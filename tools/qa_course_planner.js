#!/usr/bin/env node
'use strict';
/*
 * course-planner 静态校验门禁（语言感知）
 * --------------------------------
 * 用 linkedom 解析 index.html 得到真实 DOM，再把内联主脚本在受控沙箱里执行，校验：
 *   1. 课程库规模（C 的门数）
 *   2. 悬空课号：PLANS / FRONTIER / NEWCOURSES / MAP / HOT 引用的课号必须都存在于 C
 *   3. 每套方案的学分约束：总课数 ≤8、ECE 课 ≥5、外系 ≤3（方案 D 走 BL 例外 9/4）
 *   4. 全部前端路由渲染不抛错且非空
 *   5. 语言断言：en 模式下视图不得残留中文；zh 模式下必须渲染出中文
 *
 * 运行： NODE_PATH=<managed node_modules> node tools/qa_course_planner.js [en|zh]
 * 退出码：0 通过 / 1 失败
 */
const fs = require('fs');
const path = require('path');
const { parseHTML } = require('linkedom');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'apps', 'course-planner');
const file = path.join(APP, 'index.html');
const LANG = (process.argv[2] || process.env.UW_LANG || 'en').toLowerCase() === 'zh' ? 'zh' : 'en';

if (!fs.existsSync(file)) { console.error('FAIL: 找不到 ' + file); process.exit(1); }
const html = fs.readFileSync(file, 'utf8');

/* 主脚本：var C / const C 都接受（双语化时已把 const 改为 var 以便外部数据补丁） */
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const code = scripts.find((s) => /(?:var|const)\s+C\s*=/.test(s));
if (!code) { console.error('FAIL: 未找到主脚本（含 `var C =` / `const C =` 的那段）'); process.exit(1); }

const { window, document } = parseHTML(html);
window.scrollTo = function () { };
const location = { hash: '', search: LANG === 'zh' ? '?lang=zh' : '', protocol: 'https:', href: 'https://x/' };
const navigator = { clipboard: { writeText: function () { return Promise.resolve(); } }, share: undefined };
const store = LANG === 'zh' ? { 'uw-lang': 'zh' } : {};
window.localStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

/* 先载入 i18n 运行时与词典，再跑英文数据补丁，最后跑主脚本 */
const runFile = (rel) => {
  const p = path.join(APP, rel);
  if (!fs.existsSync(p)) return false;
  new Function('window', 'document', 'location', 'localStorage', fs.readFileSync(p, 'utf8'))(window, document, location, window.localStorage);
  return true;
};
['../../assets/i18n.js', '../../assets/i18n/common.js', '../../assets/i18n/course-planner.js'].forEach(runFile);

const harness =
  code +
  '\n;globalThis.__cp = { C, PLANS, FRONTIER, NEWCOURSES, MAP, HOT, GROUP_ORDER, APPLY_GROUPS, route, renderHome, renderPlan, renderCourses, renderCoop, renderNew, renderMap, renderApply };';
try {
  new Function('window', 'document', 'navigator', 'location', harness)(window, document, navigator, location);
} catch (e) {
  console.error('FAIL: 脚本执行抛错：\n' + (e && e.stack ? e.stack : e));
  process.exit(1);
}

const E = globalThis.__cp;
if (!E || !E.C) { console.error('FAIL: 导出失败（__cp.C 缺失）'); process.exit(1); }

/* 把主脚本里的数据镜像到 window，让 courses-en.js / data-en.js 能按引用打补丁 */
window.C = E.C; window.PLANS = E.PLANS; window.FRONTIER = E.FRONTIER;
window.NEWCOURSES = E.NEWCOURSES; window.MAP = E.MAP; window.APPLY_GROUPS = E.APPLY_GROUPS || [];
const patched = ['courses-en.js', 'data-en.js'].map(runFile);
try { window.UW_I18N && UW_I18N.apply(document); } catch (e) { }

let fails = [];

// 1) 课程库规模
const total = Object.keys(E.C).length;
if (total < 100) fails.push('课程库门数异常偏少：' + total);

// 2) 悬空课号
const keys = new Set(Object.keys(E.C));
const refs = new Set();
E.PLANS.forEach((p) => (p.terms || []).forEach((t) => (t.c || []).forEach((c) => refs.add(c))));
E.FRONTIER.forEach((o) => refs.add(o.c));
E.NEWCOURSES.forEach((o) => refs.add(o.c));
E.MAP.forEach((m) => (m.cl || []).forEach((g) => (g.c || []).forEach((c) => refs.add(c))));
(E.HOT || []).forEach((c) => refs.add(c));
const dangling = [...refs].filter((c) => !keys.has(c));
if (dangling.length) fails.push('悬空课号（引用但不在 C 中）: ' + dangling.join(', '));

// 3) 每方案学分约束
const WIL = 'WIL 601';
const EXEMPT = {
  D: { maxTotal: 9, maxOutside: 4, reason: 'Business Leadership 例外：外系放宽到 4、总课数到 9（须 ECE Graduate Office 书面确认 approved 名单）' },
};
E.PLANS.forEach((p) => {
  const all = [];
  (p.terms || []).forEach((t) => (t.c || []).forEach((c) => {
    if (c.trim().toUpperCase() === WIL) return;
    if (keys.has(c)) all.push(c);
  }));
  const ece = all.filter((c) => (E.C[c].g || '').indexOf('ece') === 0).length;
  const outside = all.length - ece;
  const ex = EXEMPT[p.id];
  const maxTotal = ex ? ex.maxTotal : 8;
  const maxOutside = ex ? ex.maxOutside : 3;
  if (ece < 5) fails.push('方案 ' + p.id + ' ECE 课 ' + ece + ' < 5（要求 ≥5）');
  if (all.length > maxTotal) fails.push('方案 ' + p.id + ' 计入学分课数 ' + all.length + ' > ' + maxTotal + (ex ? '（' + ex.reason + '）' : '（毕业上限 8 门，已剔除 WIL 601）'));
  if (outside > maxOutside) fails.push('方案 ' + p.id + ' 外系课 ' + outside + ' > ' + maxOutside + (ex ? '（' + ex.reason + '）' : '（要求 ≤3）'));
  if (ex) {
    const doc = (p.lead || '') + ' ' + (p.lead_en || '') + ' ' + (p.risk || []).join(' ') + ' ' + (p.risk_en || []).join(' ');
    if (!/4\s*门|放宽|relax/i.test(doc)) fails.push('方案 ' + p.id + ' 用了放宽例外，但 lead/risk 未声明「4 门 / 放宽 / relax」，疑似遗漏说明');
  }
});

// 4) 路由渲染 + 5) 语言断言
const routes = ['', '#/plan/A', '#/plan/B', '#/plan/C', '#/plan/D', '#/courses', '#/coop', '#/map', '#/new', '#/apply'];
const view = document.getElementById('view');
const CJK = /[\u4e00-\u9fff]/;
routes.forEach((r) => {
  try {
    location.hash = r;
    E.route();
    const len = (view.innerHTML || '').length;
    const text = (view.textContent || '');
    if (len < 30) fails.push('路由 ' + (r || '#/') + ' 渲染为空 (' + len + ' 字符)');
    if (LANG === 'en' && CJK.test(text)) {
      const sample = (text.match(/[^\s]{0,14}[\u4e00-\u9fff][^\s]{0,14}/g) || []).slice(0, 3).join(' ¦ ');
      fails.push('[en] 路由 ' + (r || '#/') + ' 残留中文：' + sample);
    }
    if (LANG === 'zh' && (text.match(/[\u4e00-\u9fff]/g) || []).length < 50) {
      fails.push('[zh] 路由 ' + (r || '#/') + ' 中文内容过少，疑似退化为英文');
    }
  } catch (e) {
    fails.push('路由 ' + (r || '#/') + ' 抛错: ' + (e && e.message ? e.message : e));
  }
});

// 6) 双语数据层完整性（仅在英文数据文件加载成功时校验）
if (patched.every(Boolean)) {
  const withEn = Object.keys(E.C).filter((k) => E.C[k] && E.C[k].desc_en).length;
  if (withEn < 100) fails.push('课程英文数据过少：仅 ' + withEn + ' 门有 desc_en');
  const plansEn = E.PLANS.filter((p) => p.name_en && Array.isArray(p.win_en)).length;
  if (plansEn !== E.PLANS.length) fails.push('方案英文数据不全：' + plansEn + '/' + E.PLANS.length);
} else {
  fails.push('英文数据文件（courses-en.js / data-en.js）未能全部加载');
}

console.log('语言 LANG           : ' + LANG + '   (html data-lang=' + document.documentElement.getAttribute('data-lang') + ')');
console.log('课程库 C 门数       : ' + total + '   其中 desc_en: ' + Object.keys(E.C).filter((k) => E.C[k] && E.C[k].desc_en).length);
console.log('引用课号去重        : ' + refs.size + (dangling.length ? '  ⚠ 含悬空 ' + dangling.length : '  (无悬空)'));
console.log('方案 PLANS          : ' + E.PLANS.length + '   地图方向 MAP: ' + E.MAP.length);
console.log('前沿/新课           : ' + E.FRONTIER.length + ' / ' + E.NEWCOURSES.length);

if (fails.length) {
  console.error('\n❌ course-planner QA 未通过 (' + fails.length + ' 项):');
  fails.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log('\n✅ course-planner QA 全部通过（' + LANG + '）：无悬空课号、全部路由渲染正常、方案约束合规、语言断言通过。');
process.exit(0);

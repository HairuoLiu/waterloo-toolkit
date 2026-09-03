#!/usr/bin/env node
'use strict';
/*
 * course-planner 静态校验门禁
 * --------------------------------
 * 用 linkedom 解析 index.html 得到真实 DOM，再把内联主脚本（含 const C 的那段）
 * 在受控沙箱（window/document/navigator/location 均为 stub）里执行，校验：
 *   1. 课程库规模（C 的门数）
 *   2. 悬空课号：PLANS / FRONTIER / NEWCOURSES / MAP / HOT 引用的课号必须都存在于 C
 *   3. 每套方案的学分约束：总课数 ≤8、ECE 课 ≥5、外系 ≤3
 *   4. 全部前端路由（home/plan A-D/courses/coop/map/new/apply）渲染不抛错且非空
 *
 * 运行： NODE_PATH=<managed node_modules> node tools/qa_course_planner.js
 * 退出码：0 通过 / 1 失败
 */
const fs = require('fs');
const path = require('path');
const { parseHTML } = require('linkedom');

const ROOT = path.resolve(__dirname, '..');
const file = path.join(ROOT, 'apps', 'course-planner', 'index.html');

if (!fs.existsSync(file)) {
  console.error('FAIL: 找不到 ' + file);
  process.exit(1);
}
const html = fs.readFileSync(file, 'utf8');

// 抽出全部 <script> 块，取含主数据的那段（const C = ...）
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const code = scripts.find((s) => /const\s+C\s*=/.test(s));
if (!code) {
  console.error('FAIL: 未找到主脚本 (const C)');
  process.exit(1);
}

const { window, document } = parseHTML(html);
window.scrollTo = function () {};
const location = { hash: '' };
const navigator = {
  clipboard: { writeText: function () { return Promise.resolve(); } },
  share: undefined,
};

// 把关键符号导出到 globalThis 以便断言
const harness =
  code +
  '\n;globalThis.__cp = { C, PLANS, FRONTIER, NEWCOURSES, MAP, HOT, GROUP_ORDER, route, renderHome, renderPlan, renderCourses, renderCoop, renderNew, renderMap, renderApply };';

let fails = [];
try {
  const fn = new Function('window', 'document', 'navigator', 'location', harness);
  fn(window, document, navigator, location);
} catch (e) {
  console.error('FAIL: 脚本执行抛错：\n' + (e && e.stack ? e.stack : e));
  process.exit(1);
}

const E = globalThis.__cp;
if (!E || !E.C) {
  console.error('FAIL: 导出失败（__cp.C 缺失）');
  process.exit(1);
}

// 1) 课程库规模
const total = Object.keys(E.C).length;

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
//    WIL 601（Career Foundations for WIL）按 ECE 规则不计入毕业 8 门，先剔除。
//    标准方案：计入学分课 ≤8、ECE ≥5、外系 ≤3。
//    方案 D 走 Business Leadership 例外（外系放宽到 4、总课数到 9），需在 lead/risk 中声明。
const WIL = 'WIL 601';
const EXEMPT = {
  D: { maxTotal: 9, maxOutside: 4, reason: 'Business Leadership 例外：外系放宽到 4、总课数到 9（须 ECE Graduate Office 书面确认 approved 名单）' },
};
E.PLANS.forEach((p) => {
  const all = [];
  (p.terms || []).forEach((t) => (t.c || []).forEach((c) => {
    if (c.trim().toUpperCase() === WIL) return;       // WIL 601 不计入 8 门
    if (keys.has(c)) all.push(c);
  }));
  const ece = all.filter((c) => (E.C[c].g || '').indexOf('ece') === 0).length;
  const outside = all.length - ece;
  const ex = EXEMPT[p.id];
  const maxTotal = ex ? ex.maxTotal : 8;
  const maxOutside = ex ? ex.maxOutside : 3;
  if (ece < 5) fails.push('方案 ' + p.id + ' ECE 课 ' + ece + ' < 5（要求 ≥5）');
  if (all.length > maxTotal) fails.push(
    '方案 ' + p.id + ' 计入学分课数 ' + all.length + ' > ' + maxTotal +
    (ex ? '（' + ex.reason + '）' : '（毕业上限 8 门，已剔除 WIL 601）')
  );
  if (outside > maxOutside) fails.push(
    '方案 ' + p.id + ' 外系课 ' + outside + ' > ' + maxOutside +
    (ex ? '（' + ex.reason + '）' : '（要求 ≤3）')
  );
  if (ex) {
    const doc = (p.lead || '') + ' ' + (p.risk || []).join(' ');
    if (!/4\s*门|放宽/.test(doc)) fails.push('方案 ' + p.id + ' 用了放宽例外，但 lead/risk 未声明「4 门 / 放宽」，疑似遗漏说明');
  }
});

// 4) 路由渲染
const routes = [
  '', '#/plan/A', '#/plan/B', '#/plan/C', '#/plan/D',
  '#/courses', '#/coop', '#/map', '#/new', '#/apply',
];
const view = document.getElementById('view');
routes.forEach((r) => {
  try {
    location.hash = r;
    E.route();
    const len = (view.innerHTML || '').length;
    if (len < 30) fails.push('路由 ' + (r || '#/') + ' 渲染为空 (' + len + ' 字符)');
  } catch (e) {
    fails.push('路由 ' + (r || '#/') + ' 抛错: ' + (e && e.message ? e.message : e));
  }
});

// 报告
console.log('课程库 C 门数      : ' + total);
console.log('引用课号去重       : ' + refs.size + (dangling.length ? '  ⚠ 含悬空 ' + dangling.length : '  (无悬空)'));
console.log('方案 PLANS         : ' + E.PLANS.length);
console.log('课程地图方向 MAP   : ' + E.MAP.length);
console.log('最前沿 FRONTIER    : ' + E.FRONTIER.length + '   今年新课 NEWCOURSES: ' + E.NEWCOURSES.length);

if (fails.length) {
  console.error('\n❌ course-planner QA 未通过 (' + fails.length + ' 项):');
  fails.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log('\n✅ course-planner QA 全部通过：无悬空课号、全部路由渲染正常、方案约束合规。');
process.exit(0);

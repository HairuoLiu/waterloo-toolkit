/**
 * tools/qa_sop.js — SOP 页面的「真实 DOM」QA 门禁（语言感知版）
 *
 * 在原始 qa_sop.js 基础上改造：
 *   1) 语言感知：通过 argv[2] 或环境变量 UW_LANG 指定 'en' | 'zh'（默认 en），
 *      断言相应语言下的文案与结构；原有依赖中文 UI 文案的断言仅在 zh 模式执行，
 *      en 模式改由「i18n 覆盖率断言」保证界面无中文残渣、且呈现正确语言的译文。
 *   2) 新增 i18n 覆盖率断言（见 runI18nChecks）：
 *      a. 默认语言为英文（无 ?lang 时 html[data-lang] 为 en）
 *      b. 词典 en/zh 键集对称（数量与键名一致）
 *      c. 页面中不存在未被替换的 data-i18n 占位（渲染后 textContent 不得等于 key）
 *      d. 英文模式下 UI 区域（[data-i18n]）不得出现中文界面文案
 *
 * 用法：
 *   node tools/qa_sop.js            # 默认 en
 *   node tools/qa_sop.js zh         # 中文
 *   UW_LANG=zh node tools/qa_sop.js
 * 退出码：0 通过 / 1 失败 / 2 参数错误
 *
 * 说明：本脚本依赖 framework 的 assets/i18n.js 与各 App 词典（assets/i18n/sop.js），
 * 这些文件由其他 Agent 在合并阶段产出；合并前本脚本的 i18n 相关断言会 SKIP，
 * 结构断言仍可对当前仓库运行。详见 qa-plan.md。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'apps', 'sop');
const APP_ID = 'sop';

/* ---------- 语言选择 ---------- */
const LANG = (process.argv[2] || process.env.UW_LANG || 'en').toLowerCase();
if (!['en', 'zh'].includes(LANG)) {
  console.error('LANG 必须是 en 或 zh，收到: ' + LANG);
  process.exit(2);
}

/* ---------- 定位 linkedom ---------- */
function loadLinkedom() {
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const candidates = [
    path.join(home, '.workbuddy/binaries/node/workspace/node_modules/linkedom/cjs/index.js'),
    'C:/Users/h/.workbuddy/binaries/node/workspace/node_modules/linkedom/cjs/index.js',
    'linkedom'
  ];
  for (const c of candidates) {
    try { return require(c); } catch (e) { /* 继续找 */ }
  }
  throw new Error('找不到 linkedom，请先安装：npm i linkedom --prefix ~/.workbuddy/binaries/node/workspace');
}

const results = [];
function check(name, cond, detail) {
  results.push({ name, ok: !!cond, detail: detail || '' });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- localStorage 桩 ---------- */
function makeLocalStorage(initial) {
  const store = Object.assign({}, initial || {});
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
}

/* ---------- 加载 i18n 框架 + 词典（手动模拟浏览器 <script src>） ---------- */
function loadI18n(window, document, locationStub, lsStub) {
  const i18nPath = path.join(ROOT, 'assets', 'i18n.js');
  if (!fs.existsSync(i18nPath)) return { ok: false, reason: 'assets/i18n.js 不存在（framework 未合并）' };
  const i18nCode = fs.readFileSync(i18nPath, 'utf8');
  const dictPath = path.join(ROOT, 'assets', 'i18n', APP_ID + '.js');
  let dictCode = '';
  if (fs.existsSync(dictPath)) dictCode = fs.readFileSync(dictPath, 'utf8');
  const full = i18nCode + '\n;\n' + dictCode;
  let err = null;
  try {
    new Function('window', 'document', 'location', 'localStorage', full)(window, document, locationStub, lsStub);
  } catch (e) { err = e; }
  return { ok: true, err };
}

/* ---------- 语言相关的 i18n 覆盖率断言 ---------- */
function runI18nChecks(window, document) {
  /* a. 默认语言为英文：重新解析一份「无 ?lang」的 DOM，加载 i18n 后检查默认 en */
  try {
    const { parseHTML } = loadLinkedom();
    const rawHtml = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
    const { window: w2, document: d2 } = parseHTML(rawHtml);
    const loc2 = { search: '', hash: '', href: 'https://hairuoliu.github.io/waterloo-toolkit/apps/sop/' };
    loadI18n(w2, d2, loc2, makeLocalStorage({}));
    // 尝试触发 init（不同实现可能在 init() 或 DOMContentLoaded 中定默认语言）
    try { if (w2.UW_I18N && typeof w2.UW_I18N.init === 'function') w2.UW_I18N.init(); } catch (e) {}
    try { if (w2.Event) d2.dispatchEvent(new w2.Event('DOMContentLoaded')); } catch (e) {}
    const dl = (d2.documentElement.getAttribute('data-lang') || '').toLowerCase();
    const getLang = w2.UW_I18N && typeof w2.UW_I18N.get === 'function' ? w2.UW_I18N.get() : null;
    check('默认语言为英文（无 ?lang 时 html[data-lang]=en）',
      dl === 'en' || getLang === 'en',
      'data-lang=' + dl + (getLang ? ' / get()=' + getLang : ''));
  } catch (e) {
    check('默认语言为英文（无 ?lang 时 html[data-lang]=en）', false, '异常: ' + String(e.message || e).slice(0, 120));
  }

  /* b. 词典 en/zh 键集对称 */
  const dictPath = path.join(ROOT, 'assets', 'i18n', APP_ID + '.js');
  if (fs.existsSync(dictPath)) {
    const dictWin = {};
    try {
      new Function('window', fs.readFileSync(dictPath, 'utf8'))(dictWin);
    } catch (e) {}
    const D = (dictWin.UW_DICT && dictWin.UW_DICT[APP_ID]) || {};
    const enKeys = Object.keys(D.en || {}).sort();
    const zhKeys = Object.keys(D.zh || {}).sort();
    const sameCount = enKeys.length === zhKeys.length;
    const sameSet = JSON.stringify(enKeys) === JSON.stringify(zhKeys);
    check('词典 en/zh 键集对称（数量一致）', sameCount, 'en=' + enKeys.length + ' / zh=' + zhKeys.length);
    check('词典 en/zh 键集对称（键名一致）', sameSet,
      sameSet ? '' : '仅 en 有: ' + enKeys.filter((k) => !zhKeys.includes(k)).join(',') +
        ' | 仅 zh 有: ' + zhKeys.filter((k) => !enKeys.includes(k)).join(','));
  } else {
    check('词典 en/zh 键集对称', false, '词典文件不存在: ' + dictPath);
  }

  /* c + d. 扫描 [data-i18n] 与 [data-i18n-attr] 占位 / 中文残渣 */
  const i18nEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  const i18nAttrEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-attr]'));
  let unreplaced = 0;
  let cjkInUi = 0;
  const cjkRe = /[一-鿿]/;

  i18nEls.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const txt = (el.textContent || '').trim();
    if (txt === key) unreplaced += 1;             // (c) 未替换占位
    if (LANG === 'en' && cjkRe.test(txt)) cjkInUi += 1;  // (d) 英文模式中文残渣
  });
  i18nAttrEls.forEach((el) => {
    const spec = el.getAttribute('data-i18n-attr') || '';
    spec.split(/\s+/).filter(Boolean).forEach((pair) => {
      const attr = pair.split(':')[0];
      const key = pair.split(':')[1];
      const val = el.getAttribute(attr) || '';
      if (val === key) unreplaced += 1;
      if (LANG === 'en' && cjkRe.test(val)) cjkInUi += 1;
    });
  });

  check('无未替换的 data-i18n 占位（textContent ≠ key）', unreplaced === 0,
    unreplaced ? unreplaced + ' 处仍为 key 原文' : '');
  if (LANG === 'en') {
    check('英文模式 UI 区域无中文界面文案（[data-i18n]）', cjkInUi === 0,
      cjkInUi ? cjkInUi + ' 处含汉字' : '');
  }

  /* 语言文案一致性：对词典中存在的 key，en 模式应呈现 en 译文、zh 模式应呈现 zh 译文 */
  const dictWin2 = {};
  const dictPath2 = path.join(ROOT, 'assets', 'i18n', APP_ID + '.js');
  if (fs.existsSync(dictPath2)) {
    try { new Function('window', fs.readFileSync(dictPath2, 'utf8'))(dictWin2); } catch (e) {}
  }
  const D2 = (dictWin2.UW_DICT && dictWin2.UW_DICT[APP_ID]) || {};
  let mismatch = 0, checked = 0;
  i18nEls.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const expected = (D2[LANG] || {})[key];
    if (expected == null) return;           // 词典缺键由 (c) 的兜底覆盖
    checked += 1;
    if ((el.textContent || '').trim() !== expected) mismatch += 1;
  });
  check('呈现译文与当前语言词典一致（' + LANG + '）', mismatch === 0,
    checked ? (mismatch + '/' + checked + ' 处不符') : '无可比对 key');
}

/* ---------- 主流程 ---------- */
(async function main() {
  const { parseHTML } = loadLinkedom();

  const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
  const dataJs = fs.readFileSync(path.join(APP, 'data.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');

  const { window, document } = parseHTML(html);
  const qsa = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
  const lower = (s) => String(s || '').toLowerCase();

  /* ---------- 0. 加载 i18n（手动模拟 <script src>），并设置目标语言 ---------- */
  const locStub = {
    search: LANG === 'zh' ? '?lang=zh' : '',
    hash: '',
    href: 'https://hairuoliu.github.io/waterloo-toolkit/apps/sop/',
  };
  const lsStub = makeLocalStorage(LANG === 'zh' ? { 'uw-lang': 'zh' } : {});
  const i18nLoad = loadI18n(window, document, locStub, lsStub);
  // 应用词典到 DOM（若框架未自动 apply）
  try {
    if (window.UW_I18N && typeof window.UW_I18N.apply === 'function') window.UW_I18N.apply(document);
    if (window.UW_I18N && typeof window.UW_I18N.init === 'function') window.UW_I18N.init();
  } catch (e) {}

  /* ---------- 1. 执行脚本 ---------- */
  new Function('window', dataJs)(window);
  check(
    'data.js 注入 window.SOP_LOG',
    Array.isArray(window.SOP_LOG) && window.SOP_LOG.length > 0,
    '共 ' + ((window.SOP_LOG || []).length) + ' 条'
  );

  const navStub = { clipboard: null, share: null };
  let runErr = null;
  try {
    new Function('window', 'document', 'navigator', 'location', appJs)(
      window, document, navStub, locStub
    );
  } catch (e) {
    runErr = e;
  }
  check('app.js 执行无抛错', !runErr, runErr ? String(runErr.message || runErr).slice(0, 160) : '');

  /* ---------- 2. 顶栏规范（全站硬约束） ---------- */
  check('顶栏存在 .topbar', !!document.querySelector('.topbar'));
  check('顶栏 brand 回首页', (document.querySelector('.topbar .brand') || {}).getAttribute
    && /index\.html/.test(document.querySelector('.topbar .brand').getAttribute('href') || ''));
  check('右上 .top-actions 含切换按钮（#lang-toggle 或 EN/中文）',
    !!document.getElementById('lang-toggle') ||
    document.querySelectorAll('.topbar .top-actions .icon-btn').length >= 1,
    document.querySelectorAll('.topbar .top-actions .icon-btn').length + ' 个');
  check('分享按钮 #share-btn 存在', !!document.getElementById('share-btn'));

  /* ---------- 3. 目录（TOC） ---------- */
  const secs = qsa('.sop-main section[data-toc]');
  const tocLinks = qsa('#side-toc a');
  check('正文含带 data-toc 的章节', secs.length >= 10, secs.length + ' 个章节');
  check('目录已自动生成且数量匹配', tocLinks.length === secs.length,
    '目录 ' + tocLinks.length + ' / 章节 ' + secs.length);

  const ids = secs.map((s) => s.getAttribute('id'));
  check('每个章节都有 id', ids.every(Boolean), ids.join(','));
  check('章节 id 唯一', new Set(ids).size === ids.length, ids.join(','));

  const hrefs = tocLinks.map((a) => (a.getAttribute('href') || '').replace('#', ''));
  check('目录链接与章节 id 一一对应', JSON.stringify(hrefs) === JSON.stringify(ids),
    '目录 ' + hrefs.join(',') + ' | 章节 ' + ids.join(','));
  check('目录项含序号与标题', tocLinks.every((a) => a.querySelector('.t-num') && a.querySelector('.t-label')));

  /* ---------- 3.5 新增章节（Co-op / 住房 / 选课 / 杂费）存在性与外链规范 ---------- */
  ['coop', 'housing', 'courses', 'fees'].forEach((id) => {
    const el = document.getElementById(id);
    check('新增章节 #' + id + ' 存在且带 data-toc', !!el && !!el.getAttribute('data-toc'));
    const links = el ? qsa('#' + id + ' .link-row a') : [];
    const ext = links.filter((x) => /^https?:/.test(x.getAttribute('href') || ''));
    check('#' + id + ' 含外链且带 target=_blank & rel=noopener',
      ext.length > 0 && ext.every((x) =>
        x.getAttribute('target') === '_blank' && /noopener/.test(x.getAttribute('rel') || '')),
      ext.length + ' 条外链');
  });

  /* ---------- 4. 踩坑记录渲染 ---------- */
  const logItems = qsa('#sop-log .log-item');
  check('踩坑记录已渲染', logItems.length === (window.SOP_LOG || []).length,
    logItems.length + ' / ' + (window.SOP_LOG || []).length);

  /* ---------- 5. 搜索：命中高亮 + 过滤 ---------- */
  const input = document.getElementById('sop-search');
  check('搜索框存在', !!input);

  function fire(el, type) {
    if (window.Event) el.dispatchEvent(new window.Event(type));
    else if (typeof el['on' + type] === 'function') el['on' + type]();
  }

  const visibleIds = () => secs.filter((s) => s.style.display !== 'none')
    .map((s) => s.getAttribute('id'));
  const isVisible = (el) => {
    let n = el;
    while (n) { if (n.style && n.style.display === 'none') return false; n = n.parentNode; }
    return true;
  };
  async function search(term) {
    input.value = term;
    fire(input, 'input');
    await sleep(300);
    return lower(term);
  }

  // 5a. 关键词过滤的正确性（使用语言中立的专有名词 WatCard）
  const needle = await search('WatCard');
  const marks = qsa('.sop-main mark');
  const kept = secs.filter((s) => s.style.display !== 'none');
  const hid = secs.filter((s) => s.style.display === 'none');

  check('搜索产生 <mark> 高亮', marks.length > 0, marks.length + ' 处');
  check('高亮文本正确（大小写不敏感）',
    marks.length > 0 && marks.every((m) => lower(m.textContent) === needle),
    marks.length ? marks[0].textContent : '');
  check('所有高亮都落在可见内容内', marks.every(isVisible));
  check('可见章节的文本确实含关键词（无假阳性）',
    kept.length > 0 && kept.every((s) => lower(s.textContent).indexOf(needle) !== -1),
    visibleIds().join(','));
  check('隐藏章节的文本确实不含关键词（无假阴性）',
    hid.length > 0 && hid.every((s) => lower(s.textContent).indexOf(needle) === -1),
    hid.map((s) => s.getAttribute('id')).join(','));

  const status = document.getElementById('sop-status');
  // 状态文案：zh 模式断言原中文，en 模式仅断言非空且无中文残渣（具体英文由 app 决定）
  if (LANG === 'zh') {
    check('搜索状态文案已更新（zh）', /处匹配/.test(status.textContent || ''), status.textContent);
  } else {
    check('搜索状态文案已更新（en：非空且无中文）',
      (status.textContent || '').trim().length > 0 && !/[一-鿿]/.test(status.textContent || ''),
      status.textContent);
  }
  check('目录命中徽标数 = 可见章节数', qsa('#side-toc .t-count').length === kept.length,
    qsa('#side-toc .t-count').length + ' 个 / 可见 ' + kept.length + ' 章');
  check('未命中章节在目录中变灰', qsa('#side-toc a.dim').length === hid.length,
    qsa('#side-toc a.dim').length + ' 项 / 隐藏 ' + hid.length + ' 章');

  // 5b. 多章节命中（zh 用「银行」，en 用「Waterloo」——两者均为跨章节高频词）
  const needle2 = await search(LANG === 'zh' ? '银行' : 'Waterloo');
  const kept2 = secs.filter((s) => s.style.display !== 'none');
  check('多章节命中（≥2 章）', kept2.length >= 2, visibleIds().join(','));
  check('多章节命中均含关键词',
    kept2.every((s) => lower(s.textContent).indexOf(needle2) !== -1),
    visibleIds().join(','));

  /* ---------- 6. 搜索：踩坑记录可被命中（zh 用「建站」，en 模式跳过该中文专属断言） ---------- */
  if (LANG === 'zh') {
    input.value = '建站';
    fire(input, 'input');
    await sleep(300);
    const logSec = secs.filter((s) => s.getAttribute('id') === 'log')[0];
    check('踩坑记录章节能被搜索命中（zh）', logSec && logSec.style.display !== 'none');
  }

  /* ---------- 7. 清空：完整还原 ---------- */
  input.value = '';
  fire(input, 'input');
  await sleep(300);
  check('清空后高亮全部移除', qsa('.sop-main mark').length === 0,
    qsa('.sop-main mark').length + ' 处残留');
  check('清空后所有章节恢复显示',
    secs.every((s) => s.style.display !== 'none'));
  check('清空后踩坑记录完整恢复',
    qsa('#sop-log .log-item').length === (window.SOP_LOG || []).length,
    qsa('#sop-log .log-item').length + ' 条');
  check('清空后目录徽标清除', qsa('#side-toc .t-count').length === 0);
  check('清空后目录无变灰项', qsa('#side-toc a.dim').length === 0);
  check('清空后状态文案隐藏', status.style.display === 'none' || status.hasAttribute('hidden'));

  /* ---------- 7.5 内容完整性 ---------- */
  check('「重要日期速查」章节已存在', !!document.getElementById('dates'));
  const dateRows = qsa('#dates tbody tr');
  check('重要日期表 ≥15 行', dateRows.length >= 15, dateRows.length + ' 行');

  const tocLabels = tocLinks.map((a) => {
    const t = a.querySelector('.t-label');
    return t ? t.textContent : '';
  });
  // 目录是否含「重要日期速查」：zh 用中文；en 模式改成按 id 存在性判断（语言中立）
  if (LANG === 'zh') {
    check('目录含「重要日期速查」', tocLabels.some((t) => /重要日期速查/.test(t)), tocLabels.join(' / '));
  } else {
    check('目录含「重要日期速查」对应条目（en：按 id #dates）', !!document.getElementById('dates'));
  }

  const metaRows = qsa('.meta-row');
  check('时间窗口 chip 覆盖多个阶段', metaRows.length >= 8, metaRows.length + ' 个阶段');
  const needsBlocks = qsa('.needs');
  check('材料清单块存在', needsBlocks.length >= 7, needsBlocks.length + ' 个');

  const linkEls = qsa('.link-row a');
  check('官方链接已配置', linkEls.length >= 8, linkEls.length + ' 条');
  const extLinks = linkEls.filter((a) => /^https?:/.test(a.getAttribute('href') || ''));
  check('外链均带 target=_blank 与 rel=noopener',
    extLinks.length > 0 && extLinks.every((a) =>
      a.getAttribute('target') === '_blank' && /noopener/.test(a.getAttribute('rel') || '')),
    extLinks.length + ' 条外链');

  check('踩坑记录 ≥5 条（常见坑已沉淀）',
    qsa('#sop-log .log-item').length >= 5,
    qsa('#sop-log .log-item').length + ' 条');

  /* ---------- 8. 静态红线 ---------- */
  const styleBlock = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  check('两栏布局 CSS 存在', /\.sop-layout\s*\{[^}]*grid-template-columns/.test(styleBlock));
  check('移动端降级为单列', /@media[^{]*900px[\s\S]*?\.sop-layout\s*\{[^}]*grid-template-columns:\s*1fr/.test(styleBlock));
  check('mark 高亮样式存在', /mark\s*\{/.test(styleBlock));
  check('共享样式用相对路径', html.indexOf('href="../../assets/style.css"') !== -1);
  check('无以 / 开头的绝对资源路径', !/(?:href|src)="\/(?!\/)/.test(html));
  check('data.js 在 app.js 之前引入',
    html.indexOf('src="data.js"') !== -1 &&
    html.indexOf('src="data.js"') < html.indexOf('src="app.js"'));
  check('页面未泄漏 token', !/ghp_[A-Za-z0-9]/.test(html));
  check('AGENT_GUIDE.md 存在于 SOP 根目录', fs.existsSync(path.join(APP, 'AGENT_GUIDE.md')));
  check('页面链接到 AGENT_GUIDE.md', html.indexOf('AGENT_GUIDE.md') !== -1);

  /* ---------- 9. i18n 覆盖率断言（语言感知） ---------- */
  if (i18nLoad.ok) {
    runI18nChecks(window, document);
  } else {
    check('i18n 覆盖率断言', false, 'SKIP: ' + i18nLoad.reason);
  }

  /* ---------- 输出 ---------- */
  const pass = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok);
  console.log('\n===== SOP QA（linkedom 真实 DOM · 语言=' + LANG + '） =====');
  results.forEach((r) => {
    console.log((r.ok ? '  PASS  ' : '  FAIL  ') + r.name + (r.detail ? '  → ' + r.detail : ''));
  });
  console.log('\n结果： ' + pass + ' / ' + results.length + ' 通过');
  if (fail.length) {
    console.log('\n失败项：');
    fail.forEach((r) => console.log('  × ' + r.name + (r.detail ? '  → ' + r.detail : '')));
    process.exitCode = 1;
  } else {
    console.log('全部通过 ✅');
  }
})().catch((e) => {
  console.error('QA 脚本自身异常：', e);
  process.exitCode = 1;
});

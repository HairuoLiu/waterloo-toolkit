/**
 * tools/qa_sop.js — SOP 页面的「真实 DOM」QA 门禁
 *
 * 用 linkedom 真实解析 apps/sop/index.html，依次执行 data.js + app.js，
 * 断言：顶栏规范 / 目录生成 / 章节 id 唯一 / 记录渲染 / 搜索高亮 / 清空还原 / 路径红线。
 *
 * 用法：  node tools/qa_sop.js
 * 要求：  必须 0 失败才允许 push（见仓库根 AGENT_MEMORY.md §7）
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'apps', 'sop');

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

(async function main() {
  const { parseHTML } = loadLinkedom();

  const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
  const dataJs = fs.readFileSync(path.join(APP, 'data.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(APP, 'app.js'), 'utf8');

  const { window, document } = parseHTML(html);
  const qsa = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));

  /* ---------- 1. 执行脚本 ---------- */
  new Function('window', dataJs)(window);
  check(
    'data.js 注入 window.SOP_LOG',
    Array.isArray(window.SOP_LOG) && window.SOP_LOG.length > 0,
    '共 ' + ((window.SOP_LOG || []).length) + ' 条'
  );

  // linkedom 的 window.navigator / location 是只读 getter → 必须作为参数注入桩对象
  const navStub = { clipboard: null, share: null };
  const locStub = { href: 'https://hairuoliu.github.io/waterloo-toolkit/apps/sop/' };
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
  check('右上 .top-actions 含 2 个按钮（GitHub + 分享）',
    document.querySelectorAll('.topbar .top-actions .icon-btn').length === 2,
    '实际 ' + document.querySelectorAll('.topbar .top-actions .icon-btn').length + ' 个');
  check('分享按钮 #share-btn 存在', !!document.getElementById('share-btn'));

  /* ---------- 3. 目录（TOC） ---------- */
  const secs = qsa('.sop-main section[data-toc]');
  const tocLinks = qsa('#side-toc a');
  check('正文含带 data-toc 的章节', secs.length >= 6, secs.length + ' 个章节');
  check('目录已自动生成且数量匹配', tocLinks.length === secs.length,
    '目录 ' + tocLinks.length + ' / 章节 ' + secs.length);

  const ids = secs.map((s) => s.getAttribute('id'));
  check('每个章节都有 id', ids.every(Boolean), ids.join(','));
  check('章节 id 唯一', new Set(ids).size === ids.length, ids.join(','));

  const hrefs = tocLinks.map((a) => (a.getAttribute('href') || '').replace('#', ''));
  check('目录链接与章节 id 一一对应', JSON.stringify(hrefs) === JSON.stringify(ids),
    '目录 ' + hrefs.join(',') + ' | 章节 ' + ids.join(','));
  check('目录项含序号与标题', tocLinks.every((a) => a.querySelector('.t-num') && a.querySelector('.t-label')));

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

  // 5a. 唯一命中：WatCard 全页仅出现 1 次，位于「阶段三 · 入学注册」
  input.value = 'WatCard';
  fire(input, 'input');
  await sleep(300);

  const marks = qsa('.sop-main mark');
  check('搜索产生 <mark> 高亮', marks.length > 0, marks.length + ' 处');
  check('高亮文本正确（大小写不敏感）',
    marks.length > 0 && marks[0].textContent === 'WatCard',
    marks.length ? marks[0].textContent : '');

  const kept = secs.filter((s) => s.style.display !== 'none');
  const hid = secs.filter((s) => s.style.display === 'none');
  check('命中章节保留、未命中隐藏', kept.length > 0 && hid.length > 0,
    '保留 ' + kept.length + ' / 隐藏 ' + hid.length);
  check('唯一命中「注册」章节',
    kept.length === 1 && kept[0].getAttribute('id') === 'enroll',
    visibleIds().join(','));

  const status = document.getElementById('sop-status');
  check('搜索状态文案已更新', /处匹配/.test(status.textContent || ''), status.textContent);
  check('目录显示命中数徽标', qsa('#side-toc .t-count').length > 0,
    qsa('#side-toc .t-count').length + ' 个');
  check('未命中章节在目录中变灰', qsa('#side-toc a.dim').length === secs.length - 1,
    qsa('#side-toc a.dim').length + ' 项变灰');

  // 5b. 多章节命中：「银行」同时出现在「总览」的阶段二卡片与「抵达」正文
  input.value = '银行';
  fire(input, 'input');
  await sleep(300);
  const kept2 = visibleIds();
  check('多章节命中正确（总览 + 抵达）',
    kept2.length === 2 && kept2.indexOf('overview') !== -1 && kept2.indexOf('arrive') !== -1,
    kept2.join(','));

  /* ---------- 6. 搜索：踩坑记录可被命中 ---------- */
  input.value = '建站';
  fire(input, 'input');
  await sleep(300);
  const logSec = secs.filter((s) => s.getAttribute('id') === 'log')[0];
  check('踩坑记录章节能被搜索命中', logSec && logSec.style.display !== 'none');

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

  /* ---------- 输出 ---------- */
  const pass = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok);
  console.log('\n===== SOP QA（linkedom 真实 DOM） =====');
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

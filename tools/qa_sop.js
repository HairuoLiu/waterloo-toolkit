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
  const lower = (s) => String(s || '').toLowerCase();

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
  // 用「属性断言」而非硬编码章节名：内容增长后关键词不再唯一，也不会造成假失败
  async function search(term) {
    input.value = term;
    fire(input, 'input');
    await sleep(300);
    return lower(term);
  }

  // 5a. 关键词过滤的正确性
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
  check('搜索状态文案已更新', /处匹配/.test(status.textContent || ''), status.textContent);
  check('目录命中徽标数 = 可见章节数', qsa('#side-toc .t-count').length === kept.length,
    qsa('#side-toc .t-count').length + ' 个 / 可见 ' + kept.length + ' 章');
  check('未命中章节在目录中变灰', qsa('#side-toc a.dim').length === hid.length,
    qsa('#side-toc a.dim').length + ' 项 / 隐藏 ' + hid.length + ' 章');

  // 5b. 关键词分布在多个章节时应全部保留
  const needle2 = await search('银行');
  const kept2 = secs.filter((s) => s.style.display !== 'none');
  check('多章节命中（≥2 章）', kept2.length >= 2, visibleIds().join(','));
  check('多章节命中均含关键词',
    kept2.every((s) => lower(s.textContent).indexOf(needle2) !== -1),
    visibleIds().join(','));

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

  /* ---------- 7.5 内容完整性（对应 AGENT_GUIDE §9 的七维标准） ---------- */
  check('「重要日期速查」章节已存在', !!document.getElementById('dates'));
  const dateRows = qsa('#dates tbody tr');
  check('重要日期表 ≥15 行', dateRows.length >= 15, dateRows.length + ' 行');

  const tocLabels = tocLinks.map((a) => {
    const t = a.querySelector('.t-label');
    return t ? t.textContent : '';
  });
  check('目录含「重要日期速查」', tocLabels.some((t) => /重要日期速查/.test(t)), tocLabels.join(' / '));

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

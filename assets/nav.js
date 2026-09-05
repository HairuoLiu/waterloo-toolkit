/* ============================================================
   UW Toolkit · 顶部导航行为层
   ------------------------------------------------------------
   用法：在页面里依次引入
     <link rel="stylesheet" href="assets/nav.css">
     <script src="assets/nav-data.js"></script>
     <script src="assets/nav.js"></script>
   脚本会自动把导航插入到 .topbar 内、.top-actions 之前（桌面端），
   并在 .top-actions 左侧注入移动端「☰ 导航」触发按钮。

   桌面端：每个分类是一个 .uw-nav-item（标签 + 其下拉面板同属一项），
   面板在该标签正下方展开（最后一个分类右对齐防溢屏）。悬停即开、点击可钉住。
   移动端（≤860px）：隐藏桌面标签，改用底部抽屉（bottom sheet），
   带遮罩、滑动入场、≥48px 触控区、滚动锁定与完整键盘/读屏支持。
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.UW_NAV;
  var ICONS = window.UW_NAV_ICONS || {};
  if (!DATA || !DATA.categories) return;

  var topbar = document.querySelector('.topbar');
  var mq = window.matchMedia('(max-width: 860px)');

  /* ---------- 挂载点（桌面导航） ---------- */
  var mount = document.getElementById('uw-nav-mount');
  if (!mount) {
    if (!topbar) return;
    mount = document.createElement('nav');
    mount.className = 'uw-nav';
    var actions = topbar.querySelector('.top-actions');
    if (actions) topbar.insertBefore(mount, actions);
    else topbar.appendChild(mount);
  }
  mount.setAttribute('aria-label', '滑铁卢常用站点导航');

  /* 单条链接的 HTML（桌面面板与移动抽屉共用） */
  function itemHTML(it) {
    return '' +
      '<a class="uw-item" href="' + it.url + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="uw-item-ico">' + (ICONS[it.icon] || '') + '</span>' +
        '<span class="uw-item-body">' +
          '<span class="uw-item-name">' + it.zh +
            '<em>' + it.name + '</em>' +
            (it.badge ? '<span class="badge">' + it.badge + '</span>' : '') +
          '</span>' +
          '<span class="uw-item-desc">' + it.desc + '</span>' +
        '</span>' +
        '<span class="uw-item-go">' + (ICONS.arrow || '') + '</span>' +
      '</a>';
  }

  /* ---------- 桌面：每个分类 = .uw-nav-item（标签 + 下拉面板） ---------- */
  var tabsWrap = document.createElement('div');
  tabsWrap.className = 'uw-nav-tabs';
  tabsWrap.setAttribute('role', 'tablist');

  DATA.categories.forEach(function (cat) {
    var panelId = 'uw-panel-' + cat.id;
    var tabId = 'uw-tab-' + cat.id;

    var item = document.createElement('div');
    item.className = 'uw-nav-item';
    item.setAttribute('role', 'presentation');

    var tab = document.createElement('button');
    tab.className = 'uw-tab';
    tab.type = 'button';
    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-expanded', 'false');
    tab.setAttribute('data-cat', cat.id);
    tab.innerHTML =
      '<span class="uw-tab-ico">' + (ICONS[cat.icon] || '') + '</span>' +
      '<span class="uw-tab-txt">' + cat.label + '</span>' +
      '<span class="uw-tab-count">' + cat.items.length + '</span>';
    item.appendChild(tab);

    var panel = document.createElement('div');
    panel.className = 'uw-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('data-cat', cat.id);
    var items = cat.items.map(itemHTML).join('');
    panel.innerHTML =
      '<div class="uw-panel-head">' +
        '<div class="uw-panel-title">' + cat.label + '<span>' + cat.labelEn + '</span></div>' +
        '<div class="uw-panel-desc">' + cat.desc + '</div>' +
      '</div>' +
      '<div class="uw-panel-items">' + items + '</div>';
    item.appendChild(panel);

    tabsWrap.appendChild(item);
  });

  mount.appendChild(tabsWrap);

  /* ---------- 移动：触发按钮 + 底部抽屉 ---------- */
  var trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'uw-mobile-trigger';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'uw-sheet');
  trigger.setAttribute('aria-label', '滑铁卢站点导航');
  trigger.innerHTML = '<span class="uw-m-ico">' + (ICONS.menu || '') + '</span><span>导航</span>';
  if (topbar) {
    var acts = topbar.querySelector('.top-actions');
    if (acts) acts.insertBefore(trigger, acts.firstChild);
    else topbar.appendChild(trigger);
  }

  var scrim = document.createElement('div');
  scrim.className = 'uw-sheet-scrim';
  scrim.id = 'uw-sheet-scrim';

  var sheet = document.createElement('div');
  sheet.className = 'uw-sheet';
  sheet.id = 'uw-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-label', '滑铁卢常用站点导航');

  var total = DATA.categories.reduce(function (n, c) { return n + c.items.length; }, 0);
  var catsHTML = DATA.categories.map(function (cat) {
    var head =
      '<div class="uw-sheet-cat-head">' +
        '<span class="uw-sheet-cat-ico">' + (ICONS[cat.icon] || '') + '</span>' +
        '<span class="uw-sheet-cat-name">' + cat.label + '</span>' +
        '<span class="uw-sheet-cat-en">' + cat.labelEn + '</span>' +
        '<span class="uw-sheet-cat-count">' + cat.items.length + '</span>' +
      '</div>';
    var items = cat.items.map(itemHTML).join('');
    return '<div class="uw-sheet-cat">' + head + items + '</div>';
  }).join('');

  sheet.innerHTML =
    '<div class="uw-sheet-grab"></div>' +
    '<div class="uw-sheet-head">' +
      '<div>' +
        '<div class="uw-sheet-title">滑铁卢常用站点</div>' +
        '<div class="uw-sheet-sub">UW Toolkit · ' + total + ' 个高频入口</div>' +
      '</div>' +
      '<button type="button" class="uw-sheet-close" aria-label="关闭">×</button>' +
    '</div>' +
    '<div class="uw-sheet-body">' + catsHTML + '</div>';

  document.body.appendChild(scrim);
  document.body.appendChild(sheet);
  var sheetClose = sheet.querySelector('.uw-sheet-close');

  /* ---------- 行为 ---------- */
  var tabs = [].slice.call(tabsWrap.querySelectorAll('.uw-tab'));
  var panels = [].slice.call(tabsWrap.querySelectorAll('.uw-panel'));
  var closeTimer = null, openTimer = null;

  function panelOf(id) {
    return panels.filter(function (p) { return p.getAttribute('data-cat') === id; })[0];
  }
  function closeAll() {
    clearTimeout(openTimer);
    panels.forEach(function (p) { p.classList.remove('is-open'); });
    tabs.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
  }
  function openPanel(id) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    panels.forEach(function (p) {
      p.classList.toggle('is-open', p.getAttribute('data-cat') === id);
    });
    tabs.forEach(function (t) {
      t.setAttribute('aria-expanded', String(t.getAttribute('data-cat') === id));
    });
  }
  function isPanelOpen(id) {
    var p = panelOf(id);
    return !!p && p.classList.contains('is-open');
  }

  /* 抽屉开合 */
  function openSheet() {
    scrim.classList.add('is-open');
    sheet.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('uw-no-scroll');
    sheetClose.focus();
  }
  function closeSheet() {
    scrim.classList.remove('is-open');
    sheet.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('uw-no-scroll');
    trigger.focus();
  }
  function sheetIsOpen() { return sheet.classList.contains('is-open'); }

  /* 桌面：悬停在 .uw-nav-item 上（标签与其面板同属一项，移入面板不会关闭） */
  tabs.forEach(function (tab) {
    var id = tab.getAttribute('data-cat');
    var item = tab.parentNode;

    item.addEventListener('mouseenter', function () {
      if (mq.matches) return;
      clearTimeout(closeTimer);
      openTimer = setTimeout(function () { openPanel(id); }, 70);
    });
    item.addEventListener('mouseleave', function () {
      clearTimeout(openTimer);
      closeTimer = setTimeout(closeAll, 180);
    });

    tab.addEventListener('click', function (e) {
      e.preventDefault();
      clearTimeout(openTimer);
      if (isPanelOpen(id)) closeAll();
      else openPanel(id);
    });
    tab.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(tab), next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        openPanel(id);
        var p = panelOf(id), first = p && p.querySelector('.uw-item');
        if (first) first.focus();
        return;
      }
      if (next) { e.preventDefault(); next.focus(); openPanel(next.getAttribute('data-cat')); }
    });
  });

  /* 移动：触发 / 遮罩 / 关闭 / 点击链接 */
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    if (sheetIsOpen()) closeSheet();
    else openSheet();
  });
  scrim.addEventListener('click', closeSheet);
  sheetClose.addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.uw-item')) closeSheet();
  });
  tabsWrap.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.uw-item')) closeAll();
  });

  /* 全局：Esc 关闭并归还焦点；点击空白关闭桌面面板 */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (sheetIsOpen()) { closeSheet(); return; }
    var openTab = tabs.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0];
    if (openTab) { closeAll(); openTab.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!mount.contains(e.target)) closeAll();
  });

  /* 跨断点清理：避免状态残留 */
  var rT = null;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      if (mq.matches) closeAll();
      else if (sheetIsOpen()) closeSheet();
    }, 120);
  });
})();

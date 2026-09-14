/* ============================================================
   UW Toolkit · 顶部导航行为层（双语改造版 · 2026-09-14）
   ------------------------------------------------------------
   用法：在页面里依次引入
     <link rel="stylesheet" href="assets/nav.css">
     <script src="assets/i18n.js"></script>
     <script src="assets/i18n/nav.js"></script>   <!-- 词典：nav.* -->
     <script src="assets/nav-data.js"></script>
     <script src="assets/nav.js"></script>
   脚本会自动把导航插入到 .topbar 内、.top-actions 之前（桌面端），
   并在 .top-actions 左侧注入移动端「☰ 导航」触发按钮。

   桌面端：每个分类是一个 .uw-nav-item（标签 + 其下拉面板同属一项），
   面板在该标签正下方展开（最后一个分类右对齐防溢屏）。悬停即开、点击可钉住。
   移动端（≤860px）：隐藏桌面标签，改用底部抽屉（bottom sheet），
   带遮罩、滑动入场、≥48px 触控区、滚动锁定与完整键盘/读屏支持。

   双语：界面串走 nav.* 词典（UW_I18N.t）；数据字段按当前语言取值
   （UW_I18N.get()==='en' → name/labelEn/desc_en/badge_en，
   否则 zh/label/desc/badge）。切换语言时整段重建导航（保留全部行为）。
   说明：英文模式下不显示中文正文数据（遵循契约 §5.2），故条目副标题
   仅中文模式保留英文站名（专有名词，属 §5.3 例外）；分类标题等只显示
   当前语言，避免任何跨语言残留。
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.UW_NAV;
  var ICONS = window.UW_NAV_ICONS || {};
  if (!DATA || !DATA.categories) return;

  var topbar = document.querySelector('.topbar');
  var mq = window.matchMedia('(max-width: 860px)');

  /* ---------- 语言与词典助手 ---------- */
  function L() {
    return (window.UW_I18N && UW_I18N.get) ? UW_I18N.get() : 'en';
  }
  function T(key, fb) {
    return (window.UW_I18N && UW_I18N.t) ? UW_I18N.t(key, fb) : (fb != null ? fb : key);
  }
  /* 当前语言下的值：en 取 a，否则取 b（a/b 为并列双语字段） */
  function cur(a, b) {
    return L() === 'en' ? (a != null ? a : b) : (b != null ? b : a);
  }

  var total = DATA.categories.reduce(function (n, c) { return n + c.items.length; }, 0);

  /* ---------- 模块级可变引用（每次 build 重新赋值） ---------- */
  var mount = null, tabsWrap = null, trigger = null, scrim = null, sheet = null, sheetClose = null;
  var tabs = [], panels = [];
  var closeTimer = null, openTimer = null;
  var created = [];

  function removeCreated() {
    created.forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    created = [];
    tabs = []; panels = [];
    mount = null; tabsWrap = null; trigger = null; scrim = null; sheet = null; sheetClose = null;
  }

  /* 单条链接的 HTML（桌面面板与移动抽屉共用） */
  function itemHTML(it) {
    var en = L() === 'en';
    var primary = en ? it.name : it.zh;
    /* 中文模式保留英文站名作为副标题（专有名词，契约 §5.3 例外）；
       英文模式不显示中文（契约 §5.2）。 */
    var secondary = en ? '' : (it.name || '');
    var badge = en ? it.badge_en : it.badge;
    var badgeHtml = badge ? '<span class="badge">' + badge + '</span>' : '';
    var desc = en ? (it.desc_en || it.desc) : (it.desc || it.desc_en);
    return '' +
      '<a class="uw-item" href="' + it.url + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="uw-item-ico">' + (ICONS[it.icon] || '') + '</span>' +
        '<span class="uw-item-body">' +
          '<span class="uw-item-name">' + primary +
            (secondary ? '<em>' + secondary + '</em>' : '') + badgeHtml +
          '</span>' +
          '<span class="uw-item-desc">' + (desc || '') + '</span>' +
        '</span>' +
        '<span class="uw-item-go">' + (ICONS.arrow || '') + '</span>' +
      '</a>';
  }

  /* ---------- 构建（每次语言切换重建） ---------- */
  function build() {
    removeCreated();

    /* 挂载点（桌面导航） */
    mount = document.getElementById('uw-nav-mount');
    if (!mount) {
      if (!topbar) return;
      mount = document.createElement('nav');
      mount.className = 'uw-nav';
      var actions = topbar.querySelector('.top-actions');
      if (actions) topbar.insertBefore(mount, actions);
      else topbar.appendChild(mount);
      created.push(mount);
    } else {
      mount.innerHTML = '';
    }
    mount.setAttribute('aria-label', T('nav.aria.nav', '滑铁卢常用站点导航'));

    /* ---------- 桌面：每个分类 = .uw-nav-item（标签 + 下拉面板） ---------- */
    tabsWrap = document.createElement('div');
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
        '<span class="uw-tab-txt">' + cur(cat.labelEn, cat.label) + '</span>' +
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
          '<div class="uw-panel-title">' + cur(cat.labelEn, cat.label) + '</div>' +
          '<div class="uw-panel-desc">' + cur(cat.desc_en, cat.desc) + '</div>' +
        '</div>' +
        '<div class="uw-panel-items">' + items + '</div>';
      item.appendChild(panel);

      tabsWrap.appendChild(item);
    });

    mount.appendChild(tabsWrap);

    /* ---------- 移动：触发按钮 + 底部抽屉 ---------- */
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'uw-mobile-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'uw-sheet');
    trigger.setAttribute('aria-label', T('nav.aria.trigger', '滑铁卢站点导航'));
    trigger.innerHTML = '<span class="uw-m-ico">' + (ICONS.menu || '') + '</span><span>' + T('nav.trigger', '导航') + '</span>';
    if (topbar) {
      var acts = topbar.querySelector('.top-actions');
      if (acts) acts.insertBefore(trigger, acts.firstChild);
      else topbar.appendChild(trigger);
      created.push(trigger);
    }

    scrim = document.createElement('div');
    scrim.className = 'uw-sheet-scrim';
    scrim.id = 'uw-sheet-scrim';
    created.push(scrim);

    sheet = document.createElement('div');
    sheet.className = 'uw-sheet';
    sheet.id = 'uw-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', T('nav.aria.nav', '滑铁卢常用站点导航'));

    var catsHTML = DATA.categories.map(function (cat) {
      var head =
        '<div class="uw-sheet-cat-head">' +
          '<span class="uw-sheet-cat-ico">' + (ICONS[cat.icon] || '') + '</span>' +
          '<span class="uw-sheet-cat-name">' + cur(cat.labelEn, cat.label) + '</span>' +
          '<span class="uw-sheet-cat-en"></span>' +
          '<span class="uw-sheet-cat-count">' + cat.items.length + '</span>' +
        '</div>';
      var items = cat.items.map(itemHTML).join('');
      return '<div class="uw-sheet-cat">' + head + items + '</div>';
    }).join('');

    sheet.innerHTML =
      '<div class="uw-sheet-grab"></div>' +
      '<div class="uw-sheet-head">' +
        '<div>' +
          '<div class="uw-sheet-title">' + T('nav.sheet.title', '滑铁卢常用站点') + '</div>' +
          '<div class="uw-sheet-sub">' + T('nav.sheet.sub', 'UW Toolkit · {n} 个高频入口').replace('{n}', total) + '</div>' +
        '</div>' +
        '<button type="button" class="uw-sheet-close" aria-label="' + T('nav.sheet.close', '关闭') + '">×</button>' +
      '</div>' +
      '<div class="uw-sheet-body">' + catsHTML + '</div>';
    created.push(sheet);

    document.body.appendChild(scrim);
    document.body.appendChild(sheet);
    sheetClose = sheet.querySelector('.uw-sheet-close');

    /* ---------- 行为（每次 build 重新绑定到新节点） ---------- */
    tabs = [].slice.call(tabsWrap.querySelectorAll('.uw-tab'));
    panels = [].slice.call(tabsWrap.querySelectorAll('.uw-panel'));

    tabs.forEach(function (tab) {
      var id = tab.getAttribute('data-cat');
      var it = tab.parentNode;

      it.addEventListener('mouseenter', function () {
        if (mq.matches) return;
        clearTimeout(closeTimer);
        openTimer = setTimeout(function () { openPanel(id); }, 70);
      });
      it.addEventListener('mouseleave', function () {
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
  }

  /* ---------- 面板开合 ---------- */
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
    if (!scrim || !sheet) return;
    scrim.classList.add('is-open');
    sheet.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('uw-no-scroll');
    sheetClose.focus();
  }
  function closeSheet() {
    if (!scrim || !sheet) return;
    scrim.classList.remove('is-open');
    sheet.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('uw-no-scroll');
    trigger.focus();
  }
  function sheetIsOpen() { return !!sheet && sheet.classList.contains('is-open'); }

  /* 全局：Esc 关闭并归还焦点；点击空白关闭桌面面板（绑定一次，引用模块级引用） */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (sheetIsOpen()) { closeSheet(); return; }
    var openTab = tabs.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0];
    if (openTab) { closeAll(); openTab.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (mount && !mount.contains(e.target)) closeAll();
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

  /* ---------- 首屏构建 + 语言切换重建 ---------- */
  build();
  if (window.UW_I18N && UW_I18N.onChange) {
    UW_I18N.onChange(function () { build(); });
  }
})();

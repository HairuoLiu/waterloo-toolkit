/* ============================================================
   UW Toolkit · 顶部导航行为层
   ------------------------------------------------------------
   用法：在页面里依次引入
     <link rel="stylesheet" href="assets/nav.css">
     <script src="assets/nav-data.js"></script>
     <script src="assets/nav.js"></script>
   脚本会自动把导航插入到 .topbar 内、.top-actions 之前。
   若页面结构不同，可先放一个 <div id="uw-nav-mount"></div>，
   脚本会优先挂载到该元素。

   交互：桌面端悬停即开、点击可钉住；移动端点击展开。
   无障碍：Escape 关闭、左右方向键切换分类、role/aria 完整。
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.UW_NAV;
  var ICONS = window.UW_NAV_ICONS || {};
  if (!DATA || !DATA.categories) return;

  /* ---------- 挂载点 ---------- */
  var mount = document.getElementById('uw-nav-mount');
  if (!mount) {
    var topbar = document.querySelector('.topbar');
    if (!topbar) return;
    var actions = topbar.querySelector('.top-actions');
    mount = document.createElement('nav');
    mount.className = 'uw-nav';
    if (actions) topbar.insertBefore(mount, actions);
    else topbar.appendChild(mount);
  }
  mount.setAttribute('aria-label', '滑铁卢常用站点导航');

  /* ---------- 渲染 ---------- */
  var tabsWrap = document.createElement('div');
  tabsWrap.className = 'uw-nav-tabs';
  tabsWrap.setAttribute('role', 'tablist');

  var panelsWrap = document.createElement('div');
  panelsWrap.className = 'uw-nav-panels';

  DATA.categories.forEach(function (cat) {
    var panelId = 'uw-panel-' + cat.id;

    /* 分类标签 */
    var tab = document.createElement('button');
    tab.className = 'uw-tab';
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-expanded', 'false');
    tab.setAttribute('data-cat', cat.id);
    tab.innerHTML =
      '<span class="uw-tab-ico">' + (ICONS[cat.icon] || '') + '</span>' +
      '<span class="uw-tab-txt">' + cat.label + '</span>' +
      '<span class="uw-tab-count">' + cat.items.length + '</span>';
    tabsWrap.appendChild(tab);

    /* 下拉面板 */
    var panel = document.createElement('div');
    panel.className = 'uw-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('data-cat', cat.id);

    var items = cat.items.map(function (it) {
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
    }).join('');

    panel.innerHTML =
      '<div class="uw-panel-head">' +
        '<div class="uw-panel-title">' + cat.label + '<span>' + cat.labelEn + '</span></div>' +
        '<div class="uw-panel-desc">' + cat.desc + '</div>' +
      '</div>' +
      '<div class="uw-panel-items">' + items + '</div>' +
      '<div class="uw-panel-foot">链接在新标签页打开 · 校验于 ' + DATA.version + '</div>';

    panelsWrap.appendChild(panel);
  });

  mount.appendChild(tabsWrap);
  mount.appendChild(panelsWrap);

  /* ---------- 行为 ---------- */
  var tabs = Array.prototype.slice.call(tabsWrap.querySelectorAll('.uw-tab'));
  var panels = Array.prototype.slice.call(panelsWrap.querySelectorAll('.uw-panel'));
  var closeTimer = null;
  var openTimer = null;

  function panelOf(id) {
    return panels.filter(function (p) { return p.getAttribute('data-cat') === id; })[0];
  }
  function tabOf(id) {
    return tabs.filter(function (t) { return t.getAttribute('data-cat') === id; })[0];
  }

  function closeAll() {
    clearTimeout(openTimer);
    panels.forEach(function (p) { p.classList.remove('is-open'); });
    tabs.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
  }

  function open(id) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    panels.forEach(function (p) {
      p.classList.toggle('is-open', p.getAttribute('data-cat') === id);
    });
    tabs.forEach(function (t) {
      t.setAttribute('aria-expanded', String(t.getAttribute('data-cat') === id));
    });
  }

  function isOpen(id) {
    var p = panelOf(id);
    return !!p && p.classList.contains('is-open');
  }

  /* 桌面端：悬停打开（带轻微延迟，避免掠过时闪烁） */
  tabs.forEach(function (tab) {
    var id = tab.getAttribute('data-cat');

    tab.addEventListener('mouseenter', function () {
      if (window.matchMedia('(max-width: 860px)').matches) return;
      clearTimeout(closeTimer);
      openTimer = setTimeout(function () { open(id); }, 70);
    });

    /* 点击可切换（同时兼顾触屏与键盘） */
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      clearTimeout(openTimer);
      if (isOpen(id)) closeAll();
      else open(id);
    });

    /* 方向键在标签间移动 */
    tab.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(tab);
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        open(id);
        var p = panelOf(id);
        var first = p && p.querySelector('.uw-item');
        if (first) first.focus();
        return;
      }
      if (next) { e.preventDefault(); next.focus(); open(next.getAttribute('data-cat')); }
    });
  });

  /* 鼠标离开整个导航区域后关闭（留 180ms 缓冲，便于移到面板上） */
  mount.addEventListener('mouseleave', function () {
    clearTimeout(openTimer);
    closeTimer = setTimeout(closeAll, 180);
  });
  mount.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });

  /* Escape 关闭并把焦点还给当前标签 */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openTab = tabs.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0];
    if (!openTab) return;
    closeAll();
    openTab.focus();
  });

  /* 点击页面空白处关闭 */
  document.addEventListener('click', function (e) {
    if (!mount.contains(e.target)) closeAll();
  });

  /* 焦点移出导航后关闭，避免面板悬空 */
  mount.addEventListener('focusout', function (e) {
    if (!mount.contains(e.relatedTarget)) closeAll();
  });

  /* 点击链接后收起面板（新标签打开，回到本页时状态干净） */
  panelsWrap.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.uw-item')) closeAll();
  });
})();

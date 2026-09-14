/* ============================================================
   UW Toolkit · 双语框架（i18n core）
   ------------------------------------------------------------
   纯原生、零依赖、ES5 风格（与 assets/nav.js 保持一致）。
   全局对象：window.UW_I18N

   用法（子 App 相对路径 ../../assets/）：
     <link rel="stylesheet" href="../../assets/i18n.css">
     <script src="../../assets/i18n.js"></script>
     <script src="../../assets/i18n/<app-id>.js"></script>
     <script>UW_I18N.mountToggle(); UW_I18N.apply(document);</script>

   容错：window.UW_DICT 缺失、页面无 .top-actions、localStorage
   被禁用、document 不可用 —— 均不抛错。
   ============================================================ */
(function () {
  'use strict';

  var DEFAULT_LANG = 'en';
  var STORAGE_KEY = 'uw-lang';
  var LANGS = { en: 'en', zh: 'zh' };

  /* 所有订阅语言变更的回调 */
  var listeners = [];
  /* 已挂载的切换按钮引用（幂等用） */
  var toggleEl = null;
  /* 是否已在 mountToggle 时登记自动 apply(document) */
  var autoApplyOn = false;
  /* 缓存当前语言 */
  var current = detectLang();

  /* ---------- 安全包装：localStorage ----------
     说明：浏览器里 window.localStorage 与裸 localStorage 等价；但在测试桩 /
     部分嵌入环境里只有裸全局能用，因此两者都取，优先 window。 */
  function store() {
    try { return (window && window.localStorage) ? window.localStorage : null; }
    catch (e) { return null; }
  }
  function lsGet() {
    try {
      var s = store();
      if (s) return s.getItem(STORAGE_KEY);
      if (typeof localStorage !== 'undefined' && localStorage) return localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    return null;
  }
  function lsSet(v) {
    try {
      var s = store();
      if (s) { s.setItem(STORAGE_KEY, v); return; }
      if (typeof localStorage !== 'undefined' && localStorage) localStorage.setItem(STORAGE_KEY, v);
    } catch (e) { /* 被禁用时静默 */ }
  }

  /* ---------- 语言判定：URL ?lang= → localStorage → 默认 en ---------- */
  function queryLang() {
    try {
      var search = '';
      if (window && window.location && window.location.search) search = window.location.search;
      else if (typeof location !== 'undefined' && location && location.search) search = location.search;
      if (!search) return null;
      var p = new URLSearchParams(search);
      var v = p.get('lang');
      if (v === 'en' || v === 'zh') return v;
    } catch (e) {}
    return null;
  }
  function detectLang() {
    var q = queryLang();
    if (q) return q;
    var s = lsGet();
    if (s === 'en' || s === 'zh') return s;
    return DEFAULT_LANG;
  }

  /* ---------- 同步 <html> 标记 ---------- */
  function syncHtmlAttrs(lang) {
    try {
      var html = document.documentElement;
      if (!html || !html.setAttribute) return;
      html.setAttribute('data-lang', lang);
      html.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    } catch (e) {}
  }

  /* ---------- 同步 URL query（replaceState，不新增历史） ---------- */
  function syncUrl(lang) {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch (e) {}
  }

  /* ---------- 词典查询：当前语言 → 另一语言（跨全部 namespace 检索） ---------- */
  function dictLookup(key, lang) {
    var dict = window.UW_DICT;
    if (!dict || typeof dict !== 'object') return undefined;
    for (var ns in dict) {
      if (!dict.hasOwnProperty(ns)) continue;
      var bundle = dict[ns];
      if (bundle && typeof bundle === 'object' && bundle[lang] &&
          Object.prototype.hasOwnProperty.call(bundle[lang], key)) {
        return bundle[lang][key];
      }
    }
    return undefined;
  }

  /* ============================================================
     公开 API
     ============================================================ */
  function get() { return current; }
  function other() { return current === 'en' ? 'zh' : 'en'; }

  function t(key, fallback) {
    if (key == null) return (fallback != null) ? fallback : '';
    var v = dictLookup(key, current);
    if (v != null) return v;
    v = dictLookup(key, other());
    if (v != null) return v;
    if (fallback != null) return fallback;
    return key;
  }

  /* 双语数据字段取值：当前语言字段 → 无后缀原字段 → 另一语言字段 → 空串
     两种历史约定都支持：
       ① field_en / field_zh 都齐（manifest.json 风格）
       ② 原字段为默认语言（多为中文）+ field_en（data.js 风格，如 sop 的 tag/title/body）
     第 ② 种下若直接跳到「另一语言」，中文模式会错误显示英文，因此无后缀字段必须插在中间。 */
  function pick(obj, field) {
    if (!obj || typeof obj !== 'object') return '';
    var curKey = current === 'en' ? field + '_en' : field + '_zh';
    var othKey = current === 'en' ? field + '_zh' : field + '_en';
    var cur = obj[curKey];
    if (cur != null && String(cur) !== '') return cur;
    var plain = obj[field];
    if (plain != null && String(plain) !== '') return plain;
    var oth = obj[othKey];
    if (oth != null && String(oth) !== '') return oth;
    return '';
  }

  /* 扫描 root 内 [data-i18n]（textContent）与 [data-i18n-attr]（attr:key,attr:key） */
  function apply(root) {
    var scope = root || document;
    if (!scope || !scope.querySelectorAll) return;
    var nodes, i, el, key, spec, parts, k, seg, attr, akey;
    try {
      nodes = scope.querySelectorAll('[data-i18n]');
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        key = el.getAttribute('data-i18n');
        if (key) el.textContent = t(key);
      }
    } catch (e) {}
    try {
      nodes = scope.querySelectorAll('[data-i18n-attr]');
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        spec = el.getAttribute('data-i18n-attr');
        if (!spec) continue;
        parts = spec.split(',');
        for (k = 0; k < parts.length; k++) {
          seg = parts[k].split(':');
          if (seg.length === 2) {
            attr = seg[0].trim();
            akey = seg[1].trim();
            if (attr && akey) el.setAttribute(attr, t(akey));
          }
        }
      }
    } catch (e) {}
  }

  /* 订阅语言变更（动态渲染页面在此重渲染） */
  function onChange(cb) {
    if (typeof cb === 'function') listeners.push(cb);
  }

  /* 切换并持久化、更新 html 属性与 URL、广播变更 */
  function set(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    if (lang === current) return; /* 同语言：幂等，不广播 */
    current = lang;
    syncHtmlAttrs(lang);
    lsSet(lang);
    syncUrl(lang);
    syncToggleHighlight();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](lang); } catch (e) {}
    }
  }

  /* ---------- 切换按钮（幂等） ---------- */
  function syncToggleHighlight() {
    if (!toggleEl) return;
    try {
      var opts = toggleEl.querySelectorAll('.uw-lang-opt');
      for (var i = 0; i < opts.length; i++) {
        var lang = opts[i].getAttribute('data-lang');
        if (lang === current) opts[i].classList.add('is-active');
        else opts[i].classList.remove('is-active');
      }
      toggleEl.setAttribute('aria-label', 'Switch language');
    } catch (e) {}
  }

  function mountToggle() {
    /* 幂等：已挂载则仅同步高亮 */
    var existing = null;
    try { existing = document.querySelector('[data-uw-lang-toggle]'); } catch (e) {}
    if (existing) { toggleEl = existing; syncToggleHighlight(); return; }

    var actions = null;
    try { actions = document.querySelector('.top-actions'); } catch (e) {}
    if (!actions) return; /* 页面无 .top-actions：容错，不抛错 */

    toggleEl = document.createElement('button');
    toggleEl.type = 'button';
    toggleEl.className = 'uw-lang-toggle';
    toggleEl.setAttribute('data-uw-lang-toggle', '');
    toggleEl.setAttribute('aria-label', 'Switch language');
    toggleEl.innerHTML =
      '<span class="uw-lang-opt" data-lang="en">EN</span>' +
      '<span class="uw-lang-sep" aria-hidden="true">/</span>' +
      '<span class="uw-lang-opt" data-lang="zh">中文</span>';

    toggleEl.addEventListener('click', function () {
      try { API.set(API.other()); } catch (e) {}
    });

    try { actions.appendChild(toggleEl); } catch (e) { return; }
    syncToggleHighlight();

    /* 静态页面：挂载切换按钮后，自动让语言切换即时刷新 [data-i18n] 文本。
       动态渲染页面可再自行 onChange 做完整重渲染（两者互不冲突）。 */
    if (!autoApplyOn) {
      autoApplyOn = true;
      onChange(function () {
        try { apply(document); } catch (e) {}
      });
    }
  }

  /* 模块加载即同步 <html> 标记（即使页面尚未调用 mountToggle） */
  syncHtmlAttrs(current);

  var API = {
    get: get,
    other: other,
    set: set,
    t: t,
    pick: pick,
    apply: apply,
    onChange: onChange,
    mountToggle: mountToggle
  };

  /* 语言切换时同步高亮（即使切换按钮晚于 set 调用） */
  onChange(syncToggleHighlight);

  try { window.UW_I18N = API; } catch (e) {}
})();

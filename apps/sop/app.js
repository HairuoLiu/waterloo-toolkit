// 滑铁卢入学 SOP · Wiki 版交互（i18n 版）
// 1) 渲染「踩坑记录」  2) 生成左侧目录  3) 全文搜索 + 命中高亮
// 4) 滚动联动高亮当前章节  5) 全站统一的分享/复制
// 6) 双语：界面串走 UW_I18N.t；数据字段走 pick(obj, base)（base_zh / base_en）；
//    正文用内联 <span lang="zh|en"> 并列，搜索时自动跳过「另一语言」的分支。
// 注：刻意不用 TreeWalker —— 手写递归遍历文本节点，保证在 linkedom 等 DOM 实现里也能跑。
(function () {
  'use strict';

  /* ============ 0. i18n 助手 ============ */
  function lower(s) { return String(s || '').toLowerCase(); }
  function hidden(el, v) {
    if (!el) return;
    if (v) { el.setAttribute('hidden', ''); el.style.display = 'none'; }
    else { el.removeAttribute('hidden'); el.style.display = ''; }
  }
  function T(key, fallback) {
    if (window.UW_I18N && UW_I18N.t) return UW_I18N.t(key, fallback);
    return (fallback != null) ? fallback : key;
  }
  function curLang() {
    return (window.UW_I18N && UW_I18N.get) ? UW_I18N.get() : 'en';
  }
  // 双语数据字段取值，顺序：当前语言 → 无后缀原字段 → 另一语言。
  // 注意「无后缀原字段」必须排在「另一语言」之前：本仓库 data.js 多为
  // 「原字段=中文 + *_en=英文」的约定，否则中文模式会错误地显示英文。
  // 优先复用运行时的 UW_I18N.pick（保证与全站行为一致）。
  function pick(o, base) {
    if (!o) return '';
    if (window.UW_I18N && UW_I18N.pick) return UW_I18N.pick(o, base);
    var cur = o[base + '_' + curLang()];
    var plain = o[base];
    var oth = o[base + (curLang() === 'en' ? '_zh' : '_en')];
    if (cur != null && cur !== '') return cur;
    if (plain != null && plain !== '') return plain;
    if (oth != null && oth !== '') return oth;
    return '';
  }
  function fmt(s, a, b) {
    var parts = [a, b], i = 0;
    return String(s).replace(/%[sd]/g, function () {
      var v = parts[i++];
      return (v == null) ? '' : String(v);
    });
  }
  // 语言归一：'zh-CN' / 'zh' → 'zh'；'en' / 'en-US' → 'en'；其它 → ''
  function normLang(v) {
    var s = String(v || '').toLowerCase();
    if (s.indexOf('zh') === 0) return 'zh';
    if (s.indexOf('en') === 0) return 'en';
    return '';
  }

  /* ============ 1. 渲染踩坑记录 ============ */
  function renderLog() {
    var box = document.getElementById('sop-log');
    if (!box) return;
    var log = window.SOP_LOG || [];
    if (!log.length) {
      box.innerHTML = '<p class="muted">' + T('sop.log.empty', 'No entries yet.') + '</p>';
      return;
    }
    box.innerHTML = log.map(function (e) {
      return '<div class="log-item">' +
        '<div class="log-meta"><span class="log-date">' + (e.date || '') + '</span>' +
        (pick(e, 'tag') ? '<span class="log-tag">' + pick(e, 'tag') + '</span>' : '') + '</div>' +
        '<div class="log-title">' + pick(e, 'title') + '</div>' +
        '<div class="log-body">' + String(pick(e, 'body')).replace(/\n/g, '<br>') + '</div>' +
      '</div>';
    }).join('');
  }

  /* ============ 2. 生成左侧目录 ============ */
  // 只有带 data-toc 的 <section> 才会被收进目录 —— 新增章节时必须加这个属性。
  // 双语标签：优先用 data-toc-key（对应词典 key），回退到 data-toc 原文。
  var secs = [].slice.call(document.querySelectorAll('.sop-main section[data-toc]'));
  var toc = document.getElementById('side-toc');
  var links = [];

  function tocLabel(s) {
    var key = s.getAttribute('data-toc-key');
    var fallback = s.getAttribute('data-toc') || s.id;
    return key ? T(key, fallback) : fallback;
  }

  function renderToc() {
    if (!toc) return;
    toc.innerHTML = '';
    links = [];
    secs.forEach(function (s, i) {
      var a = document.createElement('a');
      a.href = '#' + s.id;
      a.setAttribute('data-target', s.id);

      var num = document.createElement('span');
      num.className = 't-num';
      num.textContent = String(i + 1);

      var lab = document.createElement('span');
      lab.className = 't-label';
      lab.textContent = tocLabel(s);

      a.appendChild(num);
      a.appendChild(lab);
      toc.appendChild(a);
      links.push(a);

      // 搜索状态下点目录：先清空搜索，避免目标章节仍被隐藏导致跳不过去
      a.addEventListener('click', function () {
        var inp = document.getElementById('sop-search');
        if (inp && inp.value.trim()) { inp.value = ''; runSearch(); }
      });
    });
  }
  renderToc();
  renderLog();   // ★ 初始化必须渲染踩坑记录（否则首屏只显示占位「Loading…」）

  /* ============ 3. 全文搜索 + 命中高亮 ============ */
  var input = document.getElementById('sop-search');
  var clearBtn = document.getElementById('sop-clear');
  var status = document.getElementById('sop-status');

  // 收集 root 下所有文本节点（手写递归，避免依赖 TreeWalker）。
  // 双语正文里「另一语言」的分支整枝跳过，避免英文模式把中文段落的命中数也算进去。
  function textNodes(root) {
    var out = [];
    var cur = curLang();
    (function walk(node) {
      var cs = node.childNodes;
      if (!cs) return;
      for (var i = 0; i < cs.length; i++) {
        var n = cs[i];
        if (n.nodeType === 3) out.push(n);
        else if (n.nodeType === 1) {
          var l = n.getAttribute ? normLang(n.getAttribute('lang')) : '';
          if (l && l !== cur) continue;   // 另一语言的分支：跳过
          walk(n);
        }
      }
    })(root);
    return out;
  }

  // 在 root 内高亮 needle：每次都从「原始 HTML」重建，保证可反复搜索、可无损还原
  function highlightIn(root, needle) {
    if (!root._sopOrig) root._sopOrig = root.innerHTML;
    root.innerHTML = root._sopOrig;
    if (!needle) return;

    textNodes(root).forEach(function (n) {
      var text = n.nodeValue;
      if (lower(text).indexOf(needle) === -1) return;

      var frag = document.createDocumentFragment();
      var low = lower(text);
      var i = 0, pos;
      while ((pos = low.indexOf(needle, i)) !== -1) {
        if (pos > i) frag.appendChild(document.createTextNode(text.slice(i, pos)));
        var mk = document.createElement('mark');
        mk.textContent = text.substr(pos, needle.length);
        frag.appendChild(mk);
        i = pos + needle.length;
      }
      if (i < text.length) frag.appendChild(document.createTextNode(text.slice(i)));
      if (n.parentNode) n.parentNode.replaceChild(frag, n);
    });
  }

  function restore(root) { if (root._sopOrig) root.innerHTML = root._sopOrig; }

  // 踩坑记录：搜索时隐藏未命中的条目
  function filterLog(needle) {
    var items = document.querySelectorAll('#sop-log .log-item');
    [].forEach.call(items, function (it) {
      it.style.display = (!needle || lower(it.textContent).indexOf(needle) !== -1) ? '' : 'none';
    });
  }

  // 统计「当前可见」的 <mark> 数量（被隐藏章节/条目里的不计入，数字才诚实）
  function visibleMarks() {
    var ms = document.querySelectorAll('.sop-main mark');
    var n = 0;
    [].forEach.call(ms, function (m) {
      var el = m;
      while (el) {
        if (el.style && el.style.display === 'none') return;
        el = el.parentNode;
      }
      n++;
    });
    return n;
  }

  var lastQuery = '';

  function runSearch() {
    var q = (input.value || '').trim();
    var needle = lower(q);
    lastQuery = needle;
    hidden(clearBtn, !q);

    if (!needle) { resetSearch(); return; }

    var hitSecs = 0;
    secs.forEach(function (s, idx) {
      highlightIn(s, needle);
      var has = lower(s.textContent).indexOf(needle) !== -1;
      s.style.display = has ? '' : 'none';
      if (has) hitSecs++;

      var a = links[idx];
      if (!a) return;
      var badge = a.querySelector('.t-count');
      if (has) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 't-count';
          a.appendChild(badge);
        }
        badge.textContent = String(lower(s.textContent).split(needle).length - 1);
        if (a.classList.contains('dim')) a.classList.remove('dim');
      } else {
        if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
        a.classList.add('dim');
      }
    });

    filterLog(needle);

    var total = visibleMarks();
    hidden(status, false);
status.textContent = total
    ? fmt(T('sop.status.hits', '🔍 %d matches · %d sections'), total, hitSecs)
    : T('sop.status.none', 'No matches');
    spy();
  }

  function resetSearch() {
    secs.forEach(function (s) { s.style.display = ''; restore(s); });
    filterLog('');
    links.forEach(function (a) {
      if (a.classList.contains('dim')) a.classList.remove('dim');
      var b = a.querySelector('.t-count');
      if (b && b.parentNode) b.parentNode.removeChild(b);
    });
    hidden(status, true);
    status.textContent = '';
  }

  if (input) {
    var timer = null;
    input.addEventListener('input', function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(runSearch, 140);
    });
    // 回车立即搜索（跳过防抖）
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { if (timer) clearTimeout(timer); runSearch(); }
      if (e.key === 'Escape') { input.value = ''; runSearch(); }
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = ''; runSearch(); input.focus();
    });
  }

  // 快捷键：/ 或 Ctrl(Cmd)+K 聚焦搜索
  document.addEventListener('keydown', function (e) {
    if (!e || !e.key || !input) return;
    var tag = lower(e.target && e.target.tagName);
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === '/' || ((e.ctrlKey || e.metaKey) && lower(e.key) === 'k')) {
      if (e.preventDefault) e.preventDefault();
      input.focus();
      if (input.select) input.select();
    }
  });

  /* ============ 4. 滚动联动高亮当前章节 ============ */
  function spy() {
    var cur = null, i;
    for (i = 0; i < secs.length; i++) {
      var s = secs[i];
      if (s.style.display === 'none') continue;
      var top = 0;
      if (typeof s.getBoundingClientRect === 'function') {
        var r = s.getBoundingClientRect();
        top = (r && typeof r.top === 'number') ? r.top : 0;
      }
      if (top <= 120) cur = s;
    }
    if (!cur) {
      for (i = 0; i < secs.length; i++) {
        if (secs[i].style.display !== 'none') { cur = secs[i]; break; }
      }
    }
    links.forEach(function (a) {
      var on = !!cur && a.getAttribute('data-target') === cur.id;
      if (on) a.classList.add('active'); else a.classList.remove('active');
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    var done = function () { spy(); ticking = false; };
    if (window.requestAnimationFrame) window.requestAnimationFrame(done);
    else setTimeout(done, 16);
  }
  if (window.addEventListener) window.addEventListener('scroll', onScroll, false);
  spy();

  /* ============ 5. 分享 / 复制链接（全站统一行为） ============ */
  function toast(m) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = m;
    hidden(t, false);
    if (toast._t) clearTimeout(toast._t);
    toast._t = setTimeout(function () { hidden(t, true); }, 1800);
  }
  function copy(u) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(u);
    }
    var ta = document.createElement('textarea');
    ta.value = u; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }
  var sb = document.getElementById('share-btn');
  if (sb) sb.addEventListener('click', function () {
    var d = { title: document.title, text: document.title, url: location.href };
    if (navigator.share) { navigator.share(d).catch(function () {}); }
    else { copy(location.href).then(function () { toast(T('sop.toast.share', 'Link copied')); }); }
  });

  /* ============ 6. 语言切换：重渲染目录标签与踩坑记录，并保持搜索结果 ============ */
  function relocalize() {
    renderToc();
    renderLog();
    if (input && input.value.trim()) runSearch();
    else { resetSearch(); spy(); }
  }
  if (window.UW_I18N && UW_I18N.onChange) UW_I18N.onChange(relocalize);
})();

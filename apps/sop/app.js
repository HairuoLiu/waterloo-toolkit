// 滑铁卢入学 SOP · Wiki 版交互
// 1) 渲染「踩坑记录」  2) 生成左侧目录  3) 全文搜索 + 命中高亮
// 4) 滚动联动高亮当前章节  5) 全站统一的分享/复制
// 注：刻意不用 TreeWalker —— 手写递归遍历文本节点，保证在 linkedom 等 DOM 实现里也能跑。
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function lower(s) { return String(s || '').toLowerCase(); }
  function hidden(el, v) {
    if (!el) return;
    if (v) { el.setAttribute('hidden', ''); el.style.display = 'none'; }
    else { el.removeAttribute('hidden'); el.style.display = ''; }
  }

  /* ============ 1. 渲染踩坑记录 ============ */
  var box = $('sop-log');
  if (box) {
    var log = window.SOP_LOG || [];
    if (!log.length) {
      box.innerHTML = '<p class="muted">还没有记录，遇到问题时来这里追加一条即可。</p>';
    } else {
      box.innerHTML = log.map(function (e) {
        return '<div class="log-item">' +
          '<div class="log-meta"><span class="log-date">' + (e.date || '') + '</span>' +
          (e.tag ? '<span class="log-tag">' + e.tag + '</span>' : '') + '</div>' +
          '<div class="log-title">' + (e.title || '') + '</div>' +
          '<div class="log-body">' + String(e.body || '').replace(/\n/g, '<br>') + '</div>' +
        '</div>';
      }).join('');
    }
  }

  /* ============ 2. 生成左侧目录 ============ */
  // 只有带 data-toc 的 <section> 才会被收进目录 —— 新增章节时必须加这个属性。
  var secs = [].slice.call(document.querySelectorAll('.sop-main section[data-toc]'));
  var toc = $('side-toc');
  var links = [];

  secs.forEach(function (s, i) {
    var a = document.createElement('a');
    a.href = '#' + s.id;
    a.setAttribute('data-target', s.id);

    var num = document.createElement('span');
    num.className = 't-num';
    num.textContent = String(i + 1);

    var lab = document.createElement('span');
    lab.className = 't-label';
    lab.textContent = s.getAttribute('data-toc') || s.id;

    a.appendChild(num);
    a.appendChild(lab);
    toc.appendChild(a);
    links.push(a);

    // 搜索状态下点目录：先清空搜索，避免目标章节仍被隐藏导致跳不过去
    a.addEventListener('click', function () {
      var inp = $('sop-search');
      if (inp && inp.value.trim()) { inp.value = ''; runSearch(); }
    });
  });

  /* ============ 3. 全文搜索 + 命中高亮 ============ */
  var input = $('sop-search');
  var clearBtn = $('sop-clear');
  var status = $('sop-status');

  // 收集 root 下所有文本节点（手写递归，避免依赖 TreeWalker）
  function textNodes(root) {
    var out = [];
    (function walk(node) {
      var cs = node.childNodes;
      if (!cs) return;
      for (var i = 0; i < cs.length; i++) {
        var n = cs[i];
        if (n.nodeType === 3) out.push(n);
        else if (n.nodeType === 1) walk(n);
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

  function runSearch() {
    var q = (input.value || '').trim();
    var needle = lower(q);
    hidden(clearBtn, !q);

    if (!needle) { resetSearch(); return; }

    var hitSecs = 0;
    secs.forEach(function (s, idx) {
      highlightIn(s, needle);
      var has = lower(s.textContent).indexOf(needle) !== -1;
      s.style.display = has ? '' : 'none';
      if (has) hitSecs++;

      var a = links[idx];
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
      ? '🔍 ' + total + ' 处匹配 · ' + hitSecs + ' 个章节'
      : '无匹配内容';
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
    var t = $('toast'); if (!t) return;
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
  var sb = $('share-btn');
  if (sb) sb.addEventListener('click', function () {
    var d = { title: document.title, text: document.title, url: location.href };
    if (navigator.share) { navigator.share(d).catch(function () {}); }
    else { copy(location.href).then(function () { toast('链接已复制，去分享吧'); }); }
  });
})();

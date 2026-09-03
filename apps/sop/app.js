// 滑铁卢入学 SOP · 渲染「踩坑记录」+ 分享/复制
(function () {
  // 1) 渲染更新日志
  var box = document.getElementById('sop-log');
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
          '<div class="log-body">' + (e.body || '').replace(/\n/g, '<br>') + '</div>' +
        '</div>';
      }).join('');
    }
  }

  // 2) 分享 / 复制链接（全站统一行为）
  var sb = document.getElementById('share-btn');
  function toast(m) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = m; t.hidden = false; clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.hidden = true; }, 1800);
  }
  function copy(u) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(u);
    var ta = document.createElement('textarea'); ta.value = u; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta); return Promise.resolve();
  }
  if (sb) sb.addEventListener('click', function () {
    var d = { title: document.title, text: document.title, url: location.href };
    if (navigator.share) { navigator.share(d).catch(function () {}); }
    else { copy(location.href).then(function () { toast('链接已复制，去分享吧'); }); }
  });
})();

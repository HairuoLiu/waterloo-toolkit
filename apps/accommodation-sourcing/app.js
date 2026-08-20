/* accommodation-sourcing/app.js
 * Renders the Top-50 master table from window.ACCOM with:
 *  - city / tier filter chips (.chips / .chip from shared style.css)
 *  - free-text search
 *  - clickable row -> detail modal (reuses shared .detail-backdrop / .cal-detail)
 * No framework, no fetch (data is inlined via data.js).
 */
(function () {
  "use strict";
  var DATA = (window.ACCOM || []).slice();

  // Pre-compute derived display helpers per row
  DATA.forEach(function (r) {
    r._ratingVal = parseFloat(String(r.rating).match(/[\d.]+/));
    if (isNaN(r._ratingVal)) r._ratingVal = null;
  });

  var state = { city: "all", tier: "all", q: "" };

  var cities = ["all"].concat(
    DATA.map(function (r) { return r.city; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort()
  );
  var tiers = ["all", "A", "B", "C"];

  var body = document.getElementById("accom-body");
  var countEl = document.getElementById("accom-count");
  var cityWrap = document.getElementById("city-chips");
  var tierWrap = document.getElementById("tier-chips");
  var searchEl = document.getElementById("accom-search");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function ratingClass(v) {
    if (v == null) return "muted";
    if (v >= 8) return "rt-good";
    if (v >= 6.5) return "rt-mid";
    return "rt-bad";
  }
  function tierClass(t) { return t === "A" ? "P-A" : (t === "B" ? "P-B" : "P-C"); }

  function chip(wrap, key, values, labels) {
    wrap.innerHTML = "";
    values.forEach(function (v) {
      var b = document.createElement("button");
      b.className = "chip" + (state[key] === v ? " active" : "");
      b.textContent = labels ? (labels[v] || v) : (v === "all" ? "全部" : v);
      b.type = "button";
      b.addEventListener("click", function () {
        state[key] = v;
        chip(wrap, key, values, labels);
        render();
      });
      wrap.appendChild(b);
    });
  }

  function matches(r) {
    if (state.city !== "all" && r.city !== state.city) return false;
    if (state.tier !== "all" && r.tier !== state.tier) return false;
    if (state.q) {
      var q = state.q.toLowerCase();
      var hay = (r.name + " " + r.city + " " + r.type + " " + r.addr + " " + r.pub).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function render() {
    var list = DATA.filter(matches);
    body.innerHTML = "";
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="11" class="muted" style="text-align:center;padding:24px">没有符合条件的选项，试试放宽筛选。</td></tr>';
    }
    list.forEach(function (r) {
      var tr = document.createElement("tr");
      if (r.rank === 1) tr.className = "rank1";
      tr.className += " rowlink";
      tr.dataset.rank = r.rank;
      var rc = ratingClass(r._ratingVal);
      tr.innerHTML =
        '<td>' + r.rank + '</td>' +
        '<td><b>' + esc(r.name) + '</b></td>' +
        '<td>' + esc(r.city) + '</td>' +
        '<td>' + esc(r.type) + '</td>' +
        '<td>' + esc(r.bf) + '</td>' +
        '<td>' + esc(r.pub) + '</td>' +
        '<td>' + esc(r.neg) + '</td>' +
        '<td>' + esc(r.mo) + '</td>' +
        '<td class="score">' + r.score + '</td>' +
        '<td><span class="' + tierClass(r.tier) + '">' + r.tier + '</span></td>' +
        '<td class="' + rc + '">' + esc(r.rating) + '</td>';
      tr.addEventListener("click", function () { openDetail(r.rank); });
      body.appendChild(tr);
    });
    if (countEl) {
      countEl.textContent = "（" + list.length + " / " + DATA.length + " 家）";
    }
  }

  // ---- detail modal ----
  var backdrop = document.getElementById("detail-backdrop");
  var modal = document.getElementById("cal-detail");
  var closeBtn = document.getElementById("detail-close");

  function openDetail(rank) {
    var r = DATA.filter(function (x) { return x.rank === rank; })[0];
    if (!r) return;
    var contacts = [];
    if (r.email) contacts.push('<a href="mailto:' + esc(r.email) + '">' + esc(r.email) + '</a>');
    if (r.url) contacts.push('<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.web || r.url) + '</a>');
    if (!contacts.length) contacts.push('<span class="muted">平台消息 / 网站表单（无直接联系方式）</span>');
    var rc = ratingClass(r._ratingVal);
    modal.innerHTML =
      '<div class="cal-detail-head">' + esc(r.name) +
        ' <span class="' + tierClass(r.tier) + '">' + r.tier + '</span> ' +
        '<span class="muted" style="font-weight:400;font-size:13px">综合 ' + r.score + ' · ' + esc(r.city) + ' · ' + esc(r.type) + '</span></div>' +
      '<div class="cal-detail-item"><div class="zh">📍 地址</div><div class="en">' + esc(r.addr) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">📞 电话</div><div class="en">' + esc(r.phone) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">🔗 联系方式</div><div class="en">' + contacts.join("<br>") + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">💡 长住潜力</div><div class="en">' + esc(r.ls) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">💰 价格</div><div class="en">公开价 ' + esc(r.pub) +
        ' ｜ 谈价预估 <b>' + esc(r.neg) + '</b> ｜ 目标 ' + esc(r.tgt) +
        ' ｜ 27晚成本(税前) ' + esc(r.cost27) + ' ｜ 月成本(税前) ' + esc(r.mo) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">⭐ 平台评分 / 口碑</div><div class="en"><span class="' + rc + '">' + esc(r.rating) + '</span> — ' + esc(r.rating_note) + '</div></div>';
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDetail() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (closeBtn) closeBtn.addEventListener("click", closeDetail);
  if (backdrop) backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeDetail();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDetail();
  });

  // ---- init ----
  chip(cityWrap, "city", cities);
  chip(tierWrap, "tier", tiers);
  if (searchEl) {
    searchEl.addEventListener("input", function () {
      state.q = searchEl.value.trim();
      render();
    });
  }
  render();
})();

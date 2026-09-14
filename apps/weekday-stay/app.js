/* weekday-stay/app.js
 * Renders the Top-50 master table from window.ACCOM with:
 *  - city / tier filter chips (.chips / .chip from shared style.css)
 *  - free-text search
 *  - clickable row -> detail modal (reuses shared .detail-backdrop / .cal-detail)
 * No framework, no fetch (data is inlined via data.js).
 *
 * 双语：
 *  - 界面串走 UW_I18N.t('ws.*')（词典 assets/i18n/weekday-stay.js）
 *  - 数据层自由文本走 data-en.js 的映射表（type / ls / rating_note / 价格注解）
 *    data.js 是「自动生成的快照」，不允许手改，因此翻译集中放在 data-en.js。
 */
(function () {
  "use strict";
  var DATA = (window.ACCOM || []).slice();
  var EN = window.ACCOM_EN || { type: {}, ls: {}, note: {} };
  var NAME_EN = window.ACCOM_NAME_EN || {};
  var PRICE_EN = window.ACCOM_PRICE_EN || [];

  /* ---------- i18n helpers ---------- */
  function T(key, fallback) {
    if (window.UW_I18N && UW_I18N.t) return UW_I18N.t(key, fallback);
    return (fallback != null) ? fallback : key;
  }
  function curLang() {
    return (window.UW_I18N && UW_I18N.get) ? UW_I18N.get() : 'en';
  }
  function en() { return curLang() === 'en'; }
  /* 查表翻译：英文模式取映射，中文模式保留原值；映射缺失时退回原值（绝不空白） */
  function mapOf(bucket, v) {
    if (v == null || v === '') return '';
    if (!en()) return v;
    var m = EN[bucket] || {};
    return (v in m && m[v]) ? m[v] : v;
  }
  /* 价格字段：只替换中文注解，数字与货币符号原样保留 */
  function priceOf(v) {
    if (v == null || v === '') return '';
    if (!en()) return v;
    var out = String(v);
    for (var i = 0; i < PRICE_EN.length; i++) {
      out = out.split(PRICE_EN[i][0]).join(PRICE_EN[i][1]);
    }
    return out;
  }
  /* 物业名：品牌酒店一律保留原名，仅平台/非标准房源走映射 */
  function nameOf(v) {
    if (!en()) return v;
    return NAME_EN[v] || v;
  }
  function bfOf(v) {
    if (v === 'Y') return T('ws.bf.y', en() ? 'Yes' : '含');
    if (v === 'N') return T('ws.bf.n', en() ? 'No' : '无');
    return T('ws.bf.u', '?');
  }

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

  function chip(wrap, key, values) {
    wrap.innerHTML = "";
    values.forEach(function (v) {
      var b = document.createElement("button");
      b.className = "chip" + (state[key] === v ? " active" : "");
      b.textContent = (v === "all") ? T('ws.all', en() ? 'All' : '全部') : v;
      b.type = "button";
      b.addEventListener("click", function () {
        state[key] = v;
        chip(wrap, key, values);
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
      // 搜索同时覆盖「当前语言」与「原文」，避免英文模式下搜不到中文关键词
      var hay = (r.name + " " + nameOf(r.name) + " " + r.city + " " + r.type + " " + mapOf('type', r.type) +
        " " + r.addr + " " + r.pub + " " + priceOf(r.pub) + " " +
        r.ls + " " + mapOf('ls', r.ls)).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function render() {
    var list = DATA.filter(matches);
    body.innerHTML = "";
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="11" class="muted" style="text-align:center;padding:24px">' +
        T('ws.empty', 'No matches — try relaxing the filters.') + '</td></tr>';
    }
    list.forEach(function (r) {
      var tr = document.createElement("tr");
      if (r.rank === 1) tr.className = "rank1";
      tr.className += " rowlink";
      tr.dataset.rank = r.rank;
      var rc = ratingClass(r._ratingVal);
      tr.innerHTML =
        '<td>' + r.rank + '</td>' +
        '<td><b>' + esc(nameOf(r.name)) + '</b></td>' +
        '<td>' + esc(r.city) + '</td>' +
        '<td>' + esc(mapOf('type', r.type)) + '</td>' +
        '<td>' + esc(bfOf(r.bf)) + '</td>' +
        '<td>' + esc(priceOf(r.pub)) + '</td>' +
        '<td>' + esc(priceOf(r.neg)) + '</td>' +
        '<td>' + esc(priceOf(r.mo)) + '</td>' +
        '<td class="score">' + r.score + '</td>' +
        '<td><span class="' + tierClass(r.tier) + '">' + r.tier + '</span></td>' +
        '<td class="' + rc + '">' + esc(r.rating) + '</td>';
      tr.addEventListener("click", function () { openDetail(r.rank); });
      body.appendChild(tr);
    });
    if (countEl) {
      countEl.textContent = en()
        ? "(" + list.length + " / " + DATA.length + ")"
        : "（" + list.length + " / " + DATA.length + " 家）";
    }
  }

  // ---- detail modal ----
  var backdrop = document.getElementById("detail-backdrop");
  var modal = document.getElementById("cal-detail");
  var closeBtn = document.getElementById("detail-close");
  var lastRank = null;

  function openDetail(rank) {
    var r = DATA.filter(function (x) { return x.rank === rank; })[0];
    if (!r) return;
    lastRank = rank;
    var contacts = [];
    if (r.email) contacts.push('<a href="mailto:' + esc(r.email) + '">' + esc(r.email) + '</a>');
    if (r.url) contacts.push('<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.web || r.url) + '</a>');
    if (!contacts.length) contacts.push('<span class="muted">' + T('ws.d.nocontact') + '</span>');
    var rc = ratingClass(r._ratingVal);
    var sep = en() ? ": " : "：";
    modal.innerHTML =
      '<div class="cal-detail-head">' + esc(nameOf(r.name)) +
        ' <span class="' + tierClass(r.tier) + '">' + r.tier + '</span> ' +
        '<span class="muted" style="font-weight:400;font-size:13px">' +
        T('ws.th.score') + ' ' + r.score + ' · ' + esc(r.city) + ' · ' + esc(mapOf('type', r.type)) + '</span></div>' +
      '<div class="cal-detail-item"><div class="zh">' + T('ws.d.addr') + '</div><div class="en">' + esc(r.addr) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">' + T('ws.d.phone') + '</div><div class="en">' + esc(r.phone) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">' + T('ws.d.contact') + '</div><div class="en">' + contacts.join("<br>") + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">' + T('ws.d.ls') + '</div><div class="en">' + esc(mapOf('ls', r.ls)) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">' + T('ws.d.price') + '</div><div class="en">' +
        T('ws.d.pub') + sep + esc(priceOf(r.pub)) +
        ' ｜ ' + T('ws.d.neg') + sep + '<b>' + esc(priceOf(r.neg)) + '</b>' +
        ' ｜ ' + T('ws.d.tgt') + sep + esc(priceOf(r.tgt)) +
        ' ｜ ' + T('ws.d.cost27') + sep + esc(priceOf(r.cost27)) +
        ' ｜ ' + T('ws.d.mo') + sep + esc(priceOf(r.mo)) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">' + T('ws.d.rating') + '</div><div class="en"><span class="' + rc + '">' +
        esc(r.rating) + '</span> — ' + esc(mapOf('note', r.rating_note)) + '</div></div>';
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

  /* 语言切换：重建筛选条与表格；详情若开着则按新语言重渲染 */
  function relocalize() {
    chip(cityWrap, "city", cities);
    chip(tierWrap, "tier", tiers);
    if (searchEl && searchEl.placeholder !== undefined) {
      searchEl.placeholder = T('ws.search.ph');
    }
    render();
    if (backdrop && backdrop.classList.contains("open") && lastRank != null) openDetail(lastRank);
  }
  if (window.UW_I18N && UW_I18N.onChange) UW_I18N.onChange(relocalize);

  // ---- init ----
  chip(cityWrap, "city", cities);
  chip(tierWrap, "tier", tiers);
  if (searchEl) {
    searchEl.placeholder = T('ws.search.ph');
    searchEl.addEventListener("input", function () {
      state.q = searchEl.value.trim();
      render();
    });
  }
  render();
})();

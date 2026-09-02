/* locker-finder/app.js
 * Renders the campus map markers + card list from window.LOCKERS,
 * with category filter, click-to-detail modal (reuses shared .detail-backdrop / .cal-detail).
 * No framework, no fetch.
 */
(function () {
  "use strict";
  var DATA = (window.LOCKERS || []).slice();

  var CAT_COLOR = { "免费": "#1f8a4c", "租赁": "#EAAB00", "日租": "#0ea5e9" };
  var REC_LABEL = { best: "首选", good: "推荐", fallback: "备选" };

  var state = { cat: "all" };

  var SVGNS = "http://www.w3.org/2000/svg";
  var markersG = document.getElementById("markers");
  var cardsWrap = document.getElementById("cards");
  var catWrap = document.getElementById("cat-chips");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ---- category chips ----
  var cats = ["all", "免费", "租赁", "日租"];
  function renderChips() {
    catWrap.innerHTML = "";
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "chip" + (state.cat === c ? " active" : "");
      b.type = "button";
      b.textContent = c === "all" ? "全部" : c;
      b.addEventListener("click", function () {
        state.cat = c;
        renderChips();
        renderMarkers();
        renderCards();
      });
      catWrap.appendChild(b);
    });
  }

  function matches(d) {
    return state.cat === "all" || d.cat === state.cat;
  }

  // ---- map markers ----
  function renderMarkers() {
    markersG.innerHTML = "";
    DATA.forEach(function (d) {
      if (!matches(d)) return;
      var color = CAT_COLOR[d.cat] || "#9aa3b2";
      var g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "marker");
      g.setAttribute("data-id", d.id);
      g.setAttribute("transform", "translate(" + d.x + "," + d.y + ")");

      var title = document.createElementNS(SVGNS, "title");
      title.textContent = d.name_zh + " — " + d.price;
      g.appendChild(title);

      var circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("class", "m-dot");
      circle.setAttribute("r", "15");
      circle.setAttribute("fill", color);
      g.appendChild(circle);

      var emoji = document.createElementNS(SVGNS, "text");
      emoji.setAttribute("text-anchor", "middle");
      emoji.setAttribute("dominant-baseline", "central");
      emoji.setAttribute("font-size", "16");
      emoji.textContent = "🔒";
      g.appendChild(emoji);

      g.addEventListener("click", function () { openDetail(d.id); });
      markersG.appendChild(g);
    });
  }

  // ---- cards ----
  function renderCards() {
    cardsWrap.innerHTML = "";
    var list = DATA.filter(matches);
    if (!list.length) {
      cardsWrap.innerHTML = '<p class="muted">该分类下暂无储物柜。</p>';
      return;
    }
    // 排序：best -> good -> fallback
    var order = { best: 0, good: 1, fallback: 2 };
    list.sort(function (a, b) { return order[a.recommend] - order[b.recommend]; });
    list.forEach(function (d) {
      var div = document.createElement("div");
      div.className = "lcard " + d.recommend;
      div.innerHTML =
        '<h3>' + esc(d.name_zh) + '</h3>' +
        '<div class="meta">' +
          '<span class="tag-cat tag-' + (d.cat === "免费" ? "free" : d.cat === "租赁" ? "rent" : "day") + '">' + esc(d.cat) + ' · ' + esc(d.term) + '</span>' +
          '<span class="tag-rec ' + d.recommend + '">' + REC_LABEL[d.recommend] + '</span>' +
        '</div>' +
        '<div class="meta"><span>' + esc(d.building_full) + '</span></div>' +
        '<div class="meta"><span>💰 ' + esc(d.price) + '</span><span>🔑 ' + esc(d.ownLock) + '</span></div>';
      div.addEventListener("click", function () { openDetail(d.id); });
      cardsWrap.appendChild(div);
    });
  }

  // ---- detail modal ----
  var backdrop = document.getElementById("detail-backdrop");
  var modal = document.getElementById("cal-detail");
  var closeBtn = document.getElementById("detail-close");

  function openDetail(id) {
    var d = DATA.filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    var applyHtml;
    if (d.apply_url) {
      applyHtml = '<a href="' + esc(d.apply_url) + '" target="_blank" rel="noopener">' + esc(d.apply_text) + ' ↗</a>';
    } else {
      applyHtml = '<span class="muted">' + esc(d.apply_text) + '</span>';
    }
    modal.innerHTML =
      '<div class="cal-detail-head">' + esc(d.name_zh) +
        ' <span class="tag-cat tag-' + (d.cat === "免费" ? "free" : d.cat === "租赁" ? "rent" : "day") + '">' + esc(d.cat) + '</span>' +
        ' <span class="muted" style="font-weight:400;font-size:13px">' + esc(d.name_en) + '</span></div>' +
      '<div class="cal-detail-item"><div class="zh">🏢 楼栋</div><div class="en">' + esc(d.building_full) + '（' + esc(d.building) + '）· ' + esc(d.floor) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">💰 价格</div><div class="en">' + esc(d.price) + ' ／ ' + esc(d.price_en) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">🔑 挂锁</div><div class="en">' + esc(d.ownLock) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">🏛 管理方 / 资格</div><div class="en">' + esc(d.provider) + ' ｜ ' + esc(d.who) + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">📝 申请方式</div><div class="en">' + applyHtml + '</div></div>' +
      '<div class="cal-detail-item"><div class="zh">💡 备注</div><div class="en">' + esc(d.notes_zh) + '</div></div>';
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
  renderChips();
  renderMarkers();
  renderCards();
})();

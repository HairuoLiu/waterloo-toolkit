/* locker-finder/app.js
 * - 真实地图（Leaflet + OpenStreetMap）：按真实经纬度落点，点标记弹浮动窗
 * - 「地图 / 列表」Tab 整页切换
 * - 列表卡片点击 → 复用全站 .detail-backdrop / .cal-detail 详情模态
 * 无框架、无 fetch（数据内联于 data.js）。
 */
(function () {
  "use strict";
  var DATA = (window.LOCKERS || []).slice();

  var CAT_COLOR = { "免费": "#1f8a4c", "租赁": "#EAAB00", "日租": "#0ea5e9" };
  var REC_LABEL = { best: "首选", good: "推荐", fallback: "备选" };

  var state = { cat: "all", view: "map" };

  var catWrap = document.getElementById("cat-chips");
  var mapView = document.getElementById("mapView");
  var listView = document.getElementById("listView");
  var cardsWrap = document.getElementById("cards");
  var tabMap = document.getElementById("tab-map");
  var tabList = document.getElementById("tab-list");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function catClass(c) { return c === "免费" ? "free" : c === "租赁" ? "rent" : "day"; }

  function matches(d) { return state.cat === "all" || d.cat === state.cat; }

  // ---------- 分类 chips ----------
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
        renderList();
        if (state.view === "map") renderMarkers();
      });
      catWrap.appendChild(b);
    });
  }

  // ---------- 地图（Leaflet） ----------
  var map = null, markersLayer = null;
  function initMap() {
    if (map) return;
    map = L.map("map", { scrollWheelZoom: false }).setView([43.4712, -80.5445], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap 贡献者"
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
    renderMarkers();
  }
  function popupHtml(d) {
    var apply = d.apply_url
      ? '<a href="' + esc(d.apply_url) + '" target="_blank" rel="noopener">' + esc(d.apply_text) + " ↗</a>"
      : esc(d.apply_text);
    return '' +
      '<h3>' + esc(d.name_zh) + '</h3>' +
      '<div class="pop-meta">' + esc(d.building_full) + ' · ' + esc(d.floor) + '</div>' +
      '<div class="pop-meta">💰 <b>' + esc(d.price) + '</b> ｜ 🔑 ' + esc(d.ownLock) + '</div>' +
      '<div class="pop-meta">🏛 ' + esc(d.provider) + ' ｜ ' + esc(d.who) + '</div>' +
      '<div class="pop-meta">📝 ' + apply + '</div>' +
      '<div class="pop-meta">' + esc(d.notes_zh) + '</div>';
  }
  function renderMarkers() {
    if (!markersLayer) return;
    markersLayer.clearLayers();
    DATA.forEach(function (d) {
      if (!matches(d)) return;
      var color = CAT_COLOR[d.cat] || "#9aa3b2";
      var m = L.circleMarker(d.coord, {
        radius: 9, color: "#fff", weight: 2, fillColor: color, fillOpacity: 1
      }).bindPopup(popupHtml(d), { maxWidth: 280 });
      m.bindTooltip(d.name_zh, { direction: "top", offset: [0, -6] });
      m.addTo(markersLayer);
    });
  }

  // ---------- 列表（卡片） ----------
  function renderList() {
    cardsWrap.innerHTML = "";
    var list = DATA.filter(matches);
    if (!list.length) { cardsWrap.innerHTML = '<p class="muted">该分类下暂无储物柜。</p>'; return; }
    var order = { best: 0, good: 1, fallback: 2 };
    list.sort(function (a, b) { return order[a.recommend] - order[b.recommend]; });
    list.forEach(function (d) {
      var div = document.createElement("div");
      div.className = "lcard " + d.recommend;
      div.innerHTML =
        '<h3>' + esc(d.name_zh) + '</h3>' +
        '<div class="meta">' +
          '<span class="tag-cat tag-' + catClass(d.cat) + '">' + esc(d.cat) + ' · ' + esc(d.term) + '</span>' +
          '<span class="tag-rec ' + d.recommend + '">' + REC_LABEL[d.recommend] + '</span>' +
        '</div>' +
        '<div class="meta"><span>' + esc(d.building_full) + '</span></div>' +
        '<div class="meta"><span>💰 ' + esc(d.price) + '</span><span>🔑 ' + esc(d.ownLock) + '</span></div>';
      div.addEventListener("click", function () { openDetail(d.id); });
      cardsWrap.appendChild(div);
    });
  }

  // ---------- 详情模态（列表卡片用） ----------
  var backdrop = document.getElementById("detail-backdrop");
  var modal = document.getElementById("cal-detail");
  var closeBtn = document.getElementById("detail-close");
  function openDetail(id) {
    var d = DATA.filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    var applyHtml = d.apply_url
      ? '<a href="' + esc(d.apply_url) + '" target="_blank" rel="noopener">' + esc(d.apply_text) + ' ↗</a>'
      : '<span class="muted">' + esc(d.apply_text) + '</span>';
      modal.innerHTML =
      '<div class="cal-detail-head">' + esc(d.name_zh) +
        ' <span class="tag-cat tag-' + catClass(d.cat) + '">' + esc(d.cat) + '</span>' +
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
  function closeDetail() { backdrop.classList.remove("open"); document.body.style.overflow = ""; }
  if (closeBtn) closeBtn.addEventListener("click", closeDetail);
  if (backdrop) backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closeDetail(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDetail(); });

  // ---------- Tab 切换 ----------
  function setView(v) {
    state.view = v;
    var isMap = v === "map";
    tabMap.classList.toggle("active", isMap);
    tabList.classList.toggle("active", !isMap);
    mapView.hidden = !isMap;
    listView.hidden = isMap;
    if (isMap) { initMap(); setTimeout(function () { map.invalidateSize(); }, 60); }
    else { renderList(); }
  }
  if (tabMap) tabMap.addEventListener("click", function () { setView("map"); });
  if (tabList) tabList.addEventListener("click", function () { setView("list"); });

  // ---------- init ----------
  renderChips();
  initMap();           // 默认地图视图
})();

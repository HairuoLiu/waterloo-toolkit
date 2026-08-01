// 滑铁卢大学研究生每日提醒 · 网页版逻辑
// 复刻 daily_reminder.py 的 pick_focus + build_message；新增日历视图 + 学年切换
// 学年定义：Fall(Y) + Winter(Y+1) + Spring(Y+1) 构成 Y–Y+1 学年
// 每个学年独立：独立的日历、列表、今日提醒；月份导航锁定在该学年内（9月~次年8月）
(function () {
  'use strict';

  var WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var CAT_RANK = { '缴费': 9, '毕业': 9, '退费': 8, '退课': 8, '选课': 7,
    '考试': 6, '上课': 6, '成绩': 5, 'Co-op': 4, '补课': 3,
    '假期': 2, '其他': 1 };
  var ACTIONABLE_PERIOD = { '选课': 1, '退课': 1 };

  // 类别配色（与样式统一，用于日历 chip / 跨天底色 / 详情左边框）
  var CAT_COLOR = {
    '缴费': '#c0392b', '退费': '#c0392b', '毕业': '#b9770e', '选课': '#2563eb',
    '退课': '#2563eb', '考试': '#6b46c1', '假期': '#1f8a4c', '成绩': '#344675',
    'Co-op': '#b83280', '上课': '#0e7490', '补课': '#7c3aed', '其他': '#6b7280'
  };

  function parseISO(s) { return s ? new Date(s + 'T00:00:00') : null; }
  function md(d) { return (d.getMonth() + 1) + '月' + d.getDate() + '日'; }
  function dayDiff(a, b) { return Math.round((a - b) / 86400000); }
  function weight(e) { return CAT_RANK[e.category] || 1; }
  function hexToRgba(hex, a) {
    hex = (hex || '#6b7280').replace('#', '');
    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function loadEvents() {
    return (window.UW_EVENTS || []).map(function (e) {
      e._start = parseISO(e.start);
      e._end = e.end ? parseISO(e.end) : null;
      return e;
    });
  }

  function isOngoing(e, today) {
    if (e._end) return e._start <= today && today <= e._end;
    return e._start.getTime() === today.getTime();
  }

  // 某天"活跃"的事件（在当前学年 ACTIVE 内）：单日=当天；跨天=落在区间内
  function eventsOnDay(dt, cat) {
    return ACTIVE.filter(function (e) {
      if (cat && cat !== '全部' && e.category !== cat) return false;
      if (e._end) return e._start <= dt && dt <= e._end;
      return e._start.getTime() === dt.getTime();
    });
  }

  function pickFocus(events, today) {
    var startsToday = events.filter(function (e) { return e._start.getTime() === today.getTime(); });
    var ongoing = events.filter(function (e) { return e._end && e._start < today && today <= e._end; });
    var upcoming = events.filter(function (e) { return e._start > today; });
    upcoming.sort(function (a, b) {
      if (a._start - b._start) return a._start - b._start;
      if (b.priority - a.priority) return b.priority - a.priority;
      return weight(b) - weight(a);
    });

    function byW(arr) { return arr.slice().sort(function (a, b) { return weight(b) - weight(a); }); }

    var hardToday = byW(startsToday.filter(function (e) { return e.priority === 3; }));
    if (hardToday.length) return [hardToday[0], 'today'];

    var near7 = upcoming.filter(function (e) { return e.priority === 3 && dayDiff(e._start, today) <= 7; })
      .sort(function (a, b) { return dayDiff(a._start, today) - dayDiff(a._start, today) || weight(b) - weight(a); });
    if (near7.length) return [near7[0], 'deadline'];

    var impToday = byW(startsToday.filter(function (e) { return e.priority >= 2 && e.category !== '假期'; }));
    if (impToday.length) return [impToday[0], 'today'];

    var holi = startsToday.filter(function (e) { return e.category === '假期'; })
      .concat(ongoing.filter(function (e) { return e.category === '假期'; }));
    if (holi.length) return [holi[0], 'holiday'];

    var near14 = upcoming.filter(function (e) { return e.priority === 3 && dayDiff(e._start, today) <= 14; })
      .sort(function (a, b) { return dayDiff(a._start, today) - dayDiff(a._start, today) || weight(b) - weight(a); });
    if (near14.length) return [near14[0], 'deadline'];

    var per = ongoing.filter(function (e) { return ACTIONABLE_PERIOD[e.category] && dayDiff(e._end, today) <= 14; })
      .sort(function (a, b) { return dayDiff(a._end, today) - dayDiff(a._end, today) || weight(b) - weight(a); });
    if (per.length) return [per[0], 'ongoing'];

    if (startsToday.length) return [byW(startsToday)[0], 'today'];

    var impUp = upcoming.filter(function (e) { return e.priority >= 2; });
    if (impUp.length) {
      var e = impUp[0];
      return [e, e.priority === 3 ? 'deadline' : 'upcoming'];
    }

    if (per.length) return [per[0], 'ongoing'];
    if (upcoming.length) return [upcoming[0], 'upcoming'];
    return [null, 'none'];
  }

  function buildMessage(events, today) {
    var lines = [];
    lines.push('📅 ' + md(today) + ' ' + WD[today.getDay()] + ' · 滑铁卢研究生日程提醒');
    lines.push('（' + currentYear + '–' + (currentYear + 1) + ' 学年）');
    lines.push('');

    var pf = pickFocus(events, today);
    var focus = pf[0], kind = pf[1];

    lines.push('☀️ 今日一件事');
    if (!focus) {
      lines.push('本学年暂时没有临近的硬性节点，安心学习、照顾好自己就好～');
    } else if (kind === 'today' || kind === 'holiday') {
      lines.push(focus.emoji + ' 【' + focus.title_zh + '】');
      lines.push(focus.action);
    } else if (kind === 'deadline') {
      var d = dayDiff(focus._start, today);
      var when = d === 0 ? '就是今天！' : (d === 1 ? '就在明天！' : ('还有 ' + d + ' 天（' + md(focus._start) + '）'));
      lines.push(focus.emoji + ' 距【' + focus.title_zh + '】' + when);
      lines.push('提前准备：' + focus.action);
    } else if (kind === 'ongoing') {
      var de = dayDiff(focus._end, today);
      var endtxt = de === 0 ? '今天最后一天' : ('还有 ' + de + ' 天（' + md(focus._end) + '截止）');
      lines.push(focus.emoji + ' 【' + focus.title_zh + '】进行中 · ' + endtxt);
      lines.push(focus.action);
    } else if (kind === 'upcoming') {
      var du = dayDiff(focus._start, today);
      lines.push(focus.emoji + ' 最近的节点：' + md(focus._start) + '（还有 ' + du + ' 天）【' + focus.title_zh + '】');
      lines.push(focus.action);
    }

    var todays = events.filter(function (e) { return isOngoing(e, today); });
    var seen = {}, todaysU = [];
    todays.sort(function (a, b) { return b.priority - a.priority; });
    todays.forEach(function (e) {
      if (seen[e.title_zh]) return;
      seen[e.title_zh] = 1; todaysU.push(e);
    });
    if (todaysU.length) {
      lines.push('');
      lines.push('🔔 今日节点');
      todaysU.forEach(function (e) {
        var tag = (e._end && e._start.getTime() !== today.getTime()) ? '（进行中）' : '';
        lines.push('· ' + e.emoji + ' ' + e.title_zh + tag);
      });
    }

    var horizon = new Date(today.getTime() + 21 * 86400000);
    var up = events.filter(function (e) { return today < e._start && e._start <= horizon && e.priority >= 2; });
    up.sort(function (a, b) { return a._start - b._start || b.priority - a.priority; });
    var seen2 = {}, upU = [];
    up.forEach(function (e) {
      var k = e.title_zh + e.start;
      if (seen2[k]) return;
      seen2[k] = 1; upU.push(e);
    });
    if (upU.length) {
      lines.push('');
      lines.push('⏳ 临近提醒（未来 3 周）');
      upU.slice(0, 6).forEach(function (e) {
        var d2 = dayDiff(e._start, today);
        var when = d2 === 1 ? '明天' : ('还有' + d2 + '天');
        lines.push('· ' + e.emoji + ' ' + md(e._start) + '（' + when + '）' + e.title_zh);
      });
    }

    lines.push('');
    lines.push('———');
    lines.push('数据来源：University of Waterloo 研究生重要日期');
    return lines.join('\n');
  }

  // ===== 渲染 =====
  var EVENTS = loadEvents();
  var ACTIVE = EVENTS;            // 当前学年过滤后的事件集
  var currentYear = null;         // 当前选中的学年起点（如 2026 表示 2026–2027 学年）
  var currentCat = '全部';
  var curYear, curMonth;
  var todayStr;

  function presentYears() {
    var ys = [];
    EVENTS.forEach(function (e) {
      if (ys.indexOf(e.academicYear) < 0) ys.push(e.academicYear);
    });
    ys.sort(function (a, b) { return a - b; });
    return ys;
  }

  function refreshActive() {
    ACTIVE = EVENTS.filter(function (e) { return e.academicYear === currentYear; });
  }

  function fmtDateInput(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // 默认月份：今天在该学年内则停在今天；否则停在该学年 9 月（学年起点）
  function setDefaultMonth() {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var ty = (now.getMonth() >= 8) ? now.getFullYear() : now.getFullYear() - 1; // 学年按日期
    if (ty === currentYear) { curYear = now.getFullYear(); curMonth = now.getMonth(); }
    else { curYear = currentYear; curMonth = 8; } // 9 月
  }

  function yearBounds() {
    return { minY: currentYear, minM: 8, maxY: currentYear + 1, maxM: 7 };
  }

  function updateCalNav() {
    var b = yearBounds();
    var atMin = (curYear === b.minY && curMonth === b.minM);
    var atMax = (curYear === b.maxY && curMonth === b.maxM);
    document.getElementById('cal-prev').disabled = atMin;
    document.getElementById('cal-next').disabled = atMax;
  }

  function renderReminder(dateStr) {
    var today = parseISO(dateStr);
    var msg = buildMessage(ACTIVE, today);
    document.getElementById('reminder-text').textContent = msg;
    return msg;
  }

  function renderTable(filterCat) {
    var rows = ACTIVE.slice().sort(function (a, b) { return a._start - b._start; });
    if (filterCat && filterCat !== '全部') {
      rows = rows.filter(function (e) { return e.category === filterCat; });
    }
    var tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    rows.forEach(function (e) {
      var tr = document.createElement('tr');
      var dateTxt = md(e._start) + (e._end ? ' – ' + md(e._end) : '');
      tr.innerHTML = '<td>' + dateTxt + '</td>' +
        '<td>' + e.emoji + ' ' + e.title_zh + '</td>' +
        '<td><span class="cat cat-' + e.category + '">' + e.category + '</span></td>' +
        '<td>' + (e.term_zh || '') + '</td>' +
        '<td class="act">' + e.action + '</td>';
      tbody.appendChild(tr);
    });
    document.getElementById('table-count').textContent = rows.length;
  }

  // ---------- 日历 ----------
  function renderCalendar() {
    var year = curYear, month = curMonth;
    document.getElementById('cal-title').textContent = year + '年' + (month + 1) + '月';

    var first = new Date(year, month, 1);
    var startDow = first.getDay();            // 0 = 周日
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var cells = [];
    for (var i = 0; i < startDow; i++) cells.push(null);
    for (var d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    var calCells = document.getElementById('cal-cells');
    calCells.innerHTML = '';

    cells.forEach(function (dt) {
      var cell = document.createElement('div');
      if (!dt) { cell.className = 'cal-cell empty'; calCells.appendChild(cell); return; }
      cell.className = 'cal-cell';
      var ds = fmtDateInput(dt);
      if (ds === todayStr) cell.className += ' today';

      var num = document.createElement('div');
      num.className = 'daynum';
      num.textContent = dt.getDate();
      cell.appendChild(num);

      // 跨天事件：整段底色延续
      var inRange = eventsOnDay(dt, currentCat).filter(function (e) { return e._end; });
      if (inRange.length) {
        inRange.sort(function (a, b) { return b.priority - a.priority; });
        var c = CAT_COLOR[inRange[0].category] || '#6b7280';
        cell.style.background = hexToRgba(c, 0.10);
        cell.style.borderLeft = '3px solid ' + c;
      }

      // chip：仅在该事件「起始日」显示，避免重复
      var starts = ACTIVE.filter(function (e) {
        return e._start.getTime() === dt.getTime() && (currentCat === '全部' || e.category === currentCat);
      }).sort(function (a, b) { return b.priority - a.priority; });

      var max = 3;
      starts.slice(0, max).forEach(function (e) {
        var chip = document.createElement('div');
        chip.className = 'cal-chip';
        chip.style.borderLeftColor = CAT_COLOR[e.category] || '#888';
        chip.textContent = (e.emoji ? e.emoji + ' ' : '') + e.title_zh;
        chip.title = e.title_en || e.title_zh;
        chip.addEventListener('click', function (ev) { ev.stopPropagation(); showDetail(ds); });
        cell.appendChild(chip);
      });
      if (starts.length > max) {
        var more = document.createElement('div');
        more.className = 'cal-more';
        more.textContent = '+' + (starts.length - max) + ' 更多';
        more.addEventListener('click', function (ev) { ev.stopPropagation(); showDetail(ds); });
        cell.appendChild(more);
      }

      cell.addEventListener('click', function () { showDetail(ds); });
      calCells.appendChild(cell);
    });

    updateCalNav();
  }

  function showDetail(ds) {
    var dt = parseISO(ds);
    var acts = eventsOnDay(dt, currentCat)
      .sort(function (a, b) { return b.priority - a.priority || a._start - b._start; });
    var box = document.getElementById('cal-detail');
    if (!acts.length) {
      box.innerHTML = '<div class="cal-detail-empty">🗓️ ' + md(dt) + ' ' + WD[dt.getDay()] +
        ' · 这一天没有记录的重要日期。</div>';
      return;
    }
    var html = '<div class="cal-detail-head">📌 ' + md(dt) + ' ' + WD[dt.getDay()] + ' · 共 ' + acts.length + ' 项</div>';
    html += '<div class="cal-detail-list">';
    acts.forEach(function (e) {
      var rangeEnd = e._end && e._start.getTime() !== e._end.getTime();
      var daterange = md(e._start) + (rangeEnd ? ' – ' + md(e._end) : '');
      var en = e.title_en ? '<div class="en">' + e.title_en + '</div>' : '';
      var act = e.action ? '<div class="act">💡 ' + e.action + '</div>' : '';
      html += '<div class="cal-detail-item" style="border-left:4px solid ' + (CAT_COLOR[e.category] || '#888') + '">' +
        '<div class="zh">' + (e.emoji ? e.emoji + ' ' : '') + e.title_zh + '</div>' + en +
        '<div class="meta"><span class="cat cat-' + e.category + '">' + e.category + '</span>' +
        '<span class="date">' + daterange + '</span>' +
        '<span class="term">' + (e.term_zh || '') + '</span></div>' + act + '</div>';
    });
    html += '</div>';
    box.innerHTML = html;
  }

  function renderChips() {
    var cats = ['全部'];
    ACTIVE.forEach(function (e) { if (cats.indexOf(e.category) < 0) cats.push(e.category); });
    var bar = document.getElementById('cat-bar');
    bar.innerHTML = '';
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'chip' + (c === currentCat ? ' active' : '');
      b.textContent = c;
      b.addEventListener('click', function () {
        currentCat = c;
        Array.prototype.forEach.call(bar.children, function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        renderTable(currentCat);
        renderCalendar();
        document.getElementById('cal-detail').innerHTML = '';
      });
      bar.appendChild(b);
    });
  }

  function renderYearTabs() {
    var ys = presentYears();
    var bar = document.getElementById('year-bar');
    bar.innerHTML = '';
    ys.forEach(function (y) {
      var b = document.createElement('button');
      b.className = 'year-tab' + (y === currentYear ? ' active' : '');
      b.textContent = y + '–' + (y + 1) + ' 学年';
      b.addEventListener('click', function () {
        currentYear = y;
        currentCat = '全部';
        setDefaultMonth();
        refreshActive();
        renderYearTabs();
        renderChips();
        renderCalendar();
        renderTable('全部');
        renderReminder(todayStr);
        document.getElementById('cal-detail').innerHTML = '';
      });
      bar.appendChild(b);
    });
  }

  function init() {
    var dateInput = document.getElementById('date-pick');
    todayStr = fmtDateInput(new Date());
    dateInput.value = todayStr;

    // 默认学年：包含今天的学年；否则取最早出现的学年
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var ty = (now.getMonth() >= 8) ? now.getFullYear() : now.getFullYear() - 1;
    var ys = presentYears();
    currentYear = (ys.indexOf(ty) >= 0) ? ty : ys[0];

    refreshActive();
    setDefaultMonth();
    renderReminder(todayStr);

    dateInput.addEventListener('change', function () {
      if (this.value) renderReminder(this.value);
    });
    document.getElementById('btn-today').addEventListener('click', function () {
      dateInput.value = todayStr;
      renderReminder(todayStr);
    });
    document.getElementById('btn-copy').addEventListener('click', function () {
      var txt = document.getElementById('reminder-text').textContent;
      navigator.clipboard.writeText(txt).then(function () {
        var b = document.getElementById('btn-copy');
        var old = b.textContent; b.textContent = '✅ 已复制';
        setTimeout(function () { b.textContent = old; }, 1500);
      });
    });

    renderYearTabs();
    renderChips();
    renderCalendar();
    renderTable('全部');

    // 视图切换
    var tabs = document.querySelectorAll('.tab');
    var calView = document.getElementById('calendar-view');
    var listView = document.getElementById('list-view');
    Array.prototype.forEach.call(tabs, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (x) { x.classList.remove('active'); });
        btn.classList.add('active');
        var v = btn.getAttribute('data-view');
        calView.style.display = v === 'calendar' ? '' : 'none';
        listView.style.display = v === 'list' ? '' : 'none';
      });
    });

    // 月历导航（锁定在当前学年内）
    document.getElementById('cal-prev').addEventListener('click', function () {
      curMonth--; if (curMonth < 0) { curMonth = 11; curYear--; }
      var b = yearBounds();
      if (curYear < b.minY || (curYear === b.minY && curMonth < b.minM)) { curYear = b.minY; curMonth = b.minM; }
      renderCalendar();
    });
    document.getElementById('cal-next').addEventListener('click', function () {
      curMonth++; if (curMonth > 11) { curMonth = 0; curYear++; }
      var b = yearBounds();
      if (curYear > b.maxY || (curYear === b.maxY && curMonth > b.maxM)) { curYear = b.maxY; curMonth = b.maxM; }
      renderCalendar();
    });
    document.getElementById('cal-this').addEventListener('click', function () {
      setDefaultMonth(); renderCalendar();
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

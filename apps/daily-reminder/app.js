// 滑铁卢大学研究生每日提醒 · 网页版逻辑（i18n 版）
// 复刻 daily_reminder.py 的 pick_focus + build_message；新增日历视图 + 学年切换
// 学年定义：Fall(Y) + Winter(Y+1) + Spring(Y+1) 构成 Y–Y+1 学年
// 每个学年独立：独立的日历、列表、今日提醒；月份导航锁定在该学年内（9月~次年8月）
// 双语：UI 串走 UW_I18N.t；事件字段走 lpick(obj, base)（base_zh / base_en）
(function () {
  'use strict';

  // ---- i18n helpers ----
  function T(key, fallback) {
    if (window.UW_I18N && UW_I18N.t) return UW_I18N.t(key, fallback);
    return (fallback != null) ? fallback : key;
  }
  function curLang() {
    return (window.UW_I18N && UW_I18N.get) ? UW_I18N.get() : 'en';
  }
  // parallel bilingual field picker: base_zh / base_en（也兼容 base / base_en）
  // 顺序必须是「当前语言 → 无后缀原字段 → 另一语言」：本数据集存在
  // 「原字段=中文 + *_en=英文」的字段（如 action / action_en），
  // 若先跳到另一语言，中文模式会错误显示英文。
  function lpick(o, base) {
    var lang = curLang();
    var a = o[base + '_' + lang];
    if (a != null && a !== '') return a;
    if (o[base] != null && o[base] !== '') return o[base];
    var b = o[base + (lang === 'en' ? '_zh' : '_en')];
    if (b != null && b !== '') return b;
    return '';
  }
  function fmt(s) {
    var parts = Array.prototype.slice.call(arguments, 1);
    var i = 0;
    return String(s).replace(/%[sd]/g, function () {
      return (i < parts.length) ? parts[i++] : '';
    });
  }
  var MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function wdName(idx) { return T('dr.dow.' + idx); }
  function md(d) {
    if (curLang() === 'en') return MON_EN[d.getMonth()] + ' ' + d.getDate();
    return (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }

  var CAT_RANK = { '缴费': 9, '毕业': 9, '退费': 8, '退课': 8, '选课': 7,
    '考试': 6, '上课': 6, '成绩': 5, 'Co-op': 4, '补课': 3,
    '迎新': 5, '假期': 2, '其他': 1 };
  var CAT_EN = { '全部': 'All', '假期': 'Holiday', '迎新': 'Orientation', '缴费': 'Payment', '毕业': 'Graduation',
    '退费': 'Refund', '退课': 'Course Drop', '选课': 'Course Selection', '考试': 'Exam',
    '上课': 'Classes', '成绩': 'Grades', 'Co-op': 'Co-op', '补课': 'Make-up Class', '其他': 'Other' };
  // 类别标签按当前语言取：英文视图走 CAT_EN，中文视图用数据里的中文原值
  function catLabel(c) { return curLang() === 'en' ? (CAT_EN[c] || c) : c; }
  var ACTIONABLE_PERIOD = { '选课': 1, '退课': 1 };

  // 类别配色（与样式统一，用于日历 chip / 跨天底色 / 详情左边框）
  var CAT_COLOR = {
    '缴费': '#c0392b', '退费': '#c0392b', '毕业': '#b9770e', '选课': '#2563eb',
    '退课': '#2563eb', '考试': '#6b46c1', '假期': '#1f8a4c', '成绩': '#344675',
    'Co-op': '#b83280', '上课': '#0e7490', '补课': '#7c3aed', '迎新': '#e8590c', '其他': '#6b7280'
  };

  function parseISO(s) { return s ? new Date(s + 'T00:00:00') : null; }
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
    lines.push('📅 ' + md(today) + ' ' + wdName(today.getDay()) + ' · ' + T('dr.msg.head'));
    lines.push('（' + currentYear + '–' + (currentYear + 1) + ' ' + T('dr.year.suffix') + '）');
    lines.push('');

    var pf = pickFocus(events, today);
    var focus = pf[0], kind = pf[1];

    lines.push('☀️ ' + T('dr.msg.onething'));
    if (!focus) {
      lines.push(T('dr.msg.none'));
    } else if (kind === 'today' || kind === 'holiday') {
      lines.push(focus.emoji + ' 【' + lpick(focus, 'title') + '】');
      lines.push(lpick(focus, 'action'));
    } else if (kind === 'deadline') {
      var d = dayDiff(focus._start, today);
      var when = d === 0 ? T('dr.msg.d.today') : (d === 1 ? T('dr.msg.d.tomorrow') : fmt(T('dr.msg.d.days'), d, md(focus._start)));
      lines.push(focus.emoji + ' ' + T('dr.msg.nearest') + lpick(focus, 'title') + ' ' + when);
      lines.push(T('dr.msg.prep') + lpick(focus, 'action'));
    } else if (kind === 'ongoing') {
      var de = dayDiff(focus._end, today);
      var endtxt = de === 0 ? T('dr.msg.o.today') : fmt(T('dr.msg.o.days'), de, md(focus._end));
      lines.push(focus.emoji + ' 【' + lpick(focus, 'title') + '】' + T('dr.msg.ongoing_tag') + ' · ' + endtxt);
      lines.push(lpick(focus, 'action'));
    } else if (kind === 'upcoming') {
      var du = dayDiff(focus._start, today);
      lines.push(focus.emoji + ' ' + T('dr.msg.nearest') + md(focus._start) + '（' + fmt(T('dr.msg.days'), du) + '）【' + lpick(focus, 'title') + '】');
      lines.push(lpick(focus, 'action'));
    }

    var todays = events.filter(function (e) { return isOngoing(e, today); });
    var seen = {}, todaysU = [];
    todays.sort(function (a, b) { return b.priority - a.priority; });
    todays.forEach(function (e) {
      if (seen[lpick(e, 'title')]) return;
      seen[lpick(e, 'title')] = 1; todaysU.push(e);
    });
    if (todaysU.length) {
      lines.push('');
      lines.push('🔔 ' + T('dr.msg.todaynodes'));
      todaysU.forEach(function (e) {
        var tag = (e._end && e._start.getTime() !== today.getTime()) ? T('dr.msg.ongoing_tag') : '';
        lines.push('· ' + e.emoji + ' ' + lpick(e, 'title') + tag);
      });
    }

    var horizon = new Date(today.getTime() + 21 * 86400000);
    var up = events.filter(function (e) { return today < e._start && e._start <= horizon && e.priority >= 2; });
    up.sort(function (a, b) { return a._start - b._start || b.priority - a.priority; });
    var seen2 = {}, upU = [];
    up.forEach(function (e) {
      var k = lpick(e, 'title') + e.start;
      if (seen2[k]) return;
      seen2[k] = 1; upU.push(e);
    });
    if (upU.length) {
      lines.push('');
      lines.push('⏳ ' + T('dr.msg.upcoming'));
      upU.slice(0, 6).forEach(function (e) {
        var d2 = dayDiff(e._start, today);
        var when = d2 === 1 ? T('dr.range.tomorrow') : fmt(T('dr.msg.days'), d2);
        lines.push('· ' + e.emoji + ' ' + md(e._start) + '（' + when + '）' + lpick(e, 'title'));
      });
    }

    lines.push('');
    lines.push('———');
    lines.push(T('dr.msg.source'));
    return lines.join('\n');
  }

  // 生成某范围的分享文案（今日用 buildMessage，本周/本月用清单）
  function buildRangeSummary(range) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (range === 'today') return buildMessage(ACTIVE, now);
    var w = rangeWindow(range);
    var items = eventsInRange(w[0], w[1], currentCat);
    var label = range === 'week' ? T('dr.remind.week') : T('dr.remind.month');
    var lines2 = [];
    lines2.push(fmt(T('dr.range.head'), label));
    lines2.push('（' + currentYear + '–' + (currentYear + 1) + ' ' + T('dr.year.suffix') + '）');
    lines2.push('');
    if (!items.length) {
      lines2.push(fmt(T('dr.range.empty'), label));
    } else {
      lines2.push(fmt(T('dr.range.count'), label, items.length));
      items.forEach(function (e) {
        var d = dayDiff(e._start, now);
        var tag = d > 0 ? fmt(T('dr.tag.soon'), d) : (e._end && e._end > now ? T('dr.tag.ongoing') : T('dr.tag.today'));
        var dow = wdName(e._start.getDay());
        lines2.push('· ' + md(e._start) + ' ' + dow + ' ' + (e.emoji ? e.emoji + ' ' : '') +
          lpick(e, 'title') + '（' + tag + '）');
      });
    }
    lines2.push('');
    lines2.push('———');
    lines2.push(T('dr.msg.source'));
    return lines2.join('\n');
  }

  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { t.hidden = true; }, 1800);
  }

  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(txt);
    }
    var ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function copyRange(range) {
    var txt = buildRangeSummary(range);
    copyText(txt).then(function () {
      var label = range === 'today' ? T('dr.remind.today') : range === 'week' ? T('dr.remind.week') : T('dr.remind.month');
      showToast(fmt(T('dr.toast.copied'), label));
    });
  }

  // ===== 渲染 =====
  var EVENTS = loadEvents();
  var ACTIVE = EVENTS;            // 当前学年过滤后的事件集
  var currentYear = null;         // 当前选中的学年起点（如 2026 表示 2026–2027 学年）
  var currentCat = '全部';
  var curYear, curMonth;
  var todayStr;
  var hubRange = 'week';           // 顶部提醒中心当前选中的范围
  var lastDetailDs = null;
  var detailOpen = false;

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

  // 默认月份：始终停在“今天所在月份”，让今日高亮可见；
  // 学年之前的月份 prev 会被禁用（见 updateCalNav），不会越界到无数据区域。
  function setDefaultMonth() {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    curYear = now.getFullYear();
    curMonth = now.getMonth();
    var b = yearBounds();
    if (curYear > b.maxY || (curYear === b.maxY && curMonth > b.maxM)) {
      curYear = b.maxY; curMonth = b.maxM; // 学年结束后停在最后一个月
    }
  }

  function yearBounds() {
    return { minY: currentYear, minM: 8, maxY: currentYear + 1, maxM: 7 };
  }

  function updateCalNav() {
    var b = yearBounds();
    var atMin = (curYear < b.minY) || (curYear === b.minY && curMonth <= b.minM);
    var atMax = (curYear > b.maxY) || (curYear === b.maxY && curMonth >= b.maxM);
    document.getElementById('cal-prev').disabled = atMin;
    document.getElementById('cal-next').disabled = atMax;
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
        '<td>' + (e.emoji ? e.emoji + ' ' : '') + lpick(e, 'title') + '</td>' +
        '<td><span class="cat cat-' + e.category + '">' + catLabel(e.category) + '</span></td>' +
        '<td>' + lpick(e, 'term') + '</td>' +
        '<td class="act">' + lpick(e, 'action') + '</td>';
      tbody.appendChild(tr);
    });
    document.getElementById('table-count').textContent = fmt(T('dr.table.count'), rows.length);
  }

  // ---------- 日历 ----------
  function renderCalendar() {
    var year = curYear, month = curMonth;
    var title;
    if (curLang() === 'en') title = MON_EN[month] + ' ' + year;
    else title = year + '年' + (month + 1) + '月';
    document.getElementById('cal-title').textContent = title;

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

      // chip：仅在该事件「起始日」显示，避免重复；跨天事件不再整段铺背景色，避免整月变蓝
      var starts = ACTIVE.filter(function (e) {
        return e._start.getTime() === dt.getTime() && (currentCat === '全部' || e.category === currentCat);
      }).sort(function (a, b) { return b.priority - a.priority; });

      var max = (typeof window !== 'undefined' && window.innerWidth <= 480) ? 2 : 3;
      starts.slice(0, max).forEach(function (e) {
        var chip = document.createElement('div');
        chip.className = 'cal-chip';
        chip.style.borderLeftColor = CAT_COLOR[e.category] || '#888';
        chip.textContent = (e.emoji ? e.emoji + ' ' : '') + lpick(e, 'title');
        chip.title = lpick(e, 'title');
        chip.addEventListener('click', function (ev) { ev.stopPropagation(); openDetail(ds); });
        cell.appendChild(chip);
      });
      if (starts.length > max) {
        var more = document.createElement('div');
        more.className = 'cal-more';
        more.textContent = '+' + (starts.length - max) + ' ' + T('dr.cal.more');
        more.addEventListener('click', function (ev) { ev.stopPropagation(); openDetail(ds); });
        cell.appendChild(more);
      }

      cell.addEventListener('click', function () { openDetail(ds); });
      calCells.appendChild(cell);
    });

    updateCalNav();
  }

  function showDetail(ds) {
    lastDetailDs = ds;
    var dt = parseISO(ds);
    var acts = eventsOnDay(dt, currentCat)
      .sort(function (a, b) { return b.priority - a.priority || a._start - b._start; });
    var box = document.getElementById('cal-detail');
    if (!acts.length) {
      box.innerHTML = fmt(T('dr.detail.empty'), md(dt), wdName(dt.getDay()));
      return;
    }
    var html = fmt(T('dr.detail.head'), md(dt), wdName(dt.getDay()), acts.length);
    acts.forEach(function (e) {
      var c = CAT_COLOR[e.category] || '#888';
      var rangeEnd = e._end && e._start.getTime() !== e._end.getTime();
      var daterange = md(e._start) + (rangeEnd ? ' – ' + md(e._end) : '');
      var act = lpick(e, 'action') ? '<div class="act">💡 ' + lpick(e, 'action') + '</div>' : '';
      html += '<div class="cal-detail-item" style="border-left:4px solid ' + c + '; background:' + hexToRgba(c, 0.06) + '">' +
        '<div class="zh">' + (e.emoji ? e.emoji + ' ' : '') + lpick(e, 'title') + '</div>' +
        '<div class="meta"><span class="cat cat-' + e.category + '">' + catLabel(e.category) + '</span>' +
        '<span class="date">' + daterange + '</span>' +
        (lpick(e, 'term') ? '<span class="term">' + lpick(e, 'term') + '</span>' : '') + '</div>' + act + '</div>';
    });
    box.innerHTML = html;
  }

  function openDetail(ds) {
    lastDetailDs = ds;
    detailOpen = true;
    showDetail(ds);
    document.getElementById('detail-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDetail() {
    detailOpen = false;
    document.getElementById('detail-backdrop').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---------- 顶部提醒中心：今日 / 本周 / 本月 ----------
  function rangeWindow(range) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (range === 'today') return [now, now];
    if (range === 'week') {
      var dow = now.getDay();                       // 0 = 周日
      var mondayOffset = (dow === 0) ? 6 : dow - 1; // 周一为一周起点
      var start = new Date(now); start.setDate(now.getDate() - mondayOffset);
      var end = new Date(start); end.setDate(start.getDate() + 6);
      return [start, end];
    }
    if (range === 'month') {
      var s = new Date(now.getFullYear(), now.getMonth(), 1);
      var e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return [s, e];
    }
    return [now, now];
  }

  function eventsInRange(start, end, cat) {
    return ACTIVE.filter(function (e) {
      if (cat && cat !== '全部' && e.category !== cat) return false;
      var es = e._start, ee = e._end || e._start;
      return es <= end && ee >= start;
    }).sort(function (a, b) { return a._start - b._start; });
  }

  function renderRemindHub(range) {
    hubRange = range;
    var w = rangeWindow(range);
    var items = eventsInRange(w[0], w[1], currentCat);
    var label = range === 'today' ? T('dr.remind.today') : range === 'week' ? T('dr.remind.week') : T('dr.remind.month');
    var hint = document.getElementById('remind-hint');
    var copyBtn = document.getElementById('remind-copy');
    if (copyBtn) copyBtn.textContent = T('dr.copy.' + range);

    if (!items.length) {
      hint.innerHTML = '<div class="rh-empty">' + fmt(T('dr.hub.empty'), label) + '</div>';
      return;
    }

    var head = fmt(T('dr.hub.head'), label, items.length);
    var list = '<ul class="rh-list">';
    var now = new Date(); now.setHours(0, 0, 0, 0);
    items.slice(0, 8).forEach(function (e) {
      var d = dayDiff(e._start, now);
      var tag, cls;
      if (e._end && e._start <= now && now <= e._end) { tag = T('dr.tag.ongoing'); cls = 'ongoing'; }
      else if (d === 0) { tag = T('dr.tag.today'); cls = 'today'; }
      else if (d === 1) { tag = T('dr.range.tomorrow'); cls = 'soon'; }
      else if (d > 0) { tag = fmt(T('dr.tag.soon'), d); cls = 'soon'; }
      else { tag = md(e._start); cls = ''; }
      list += '<li class="rh-item"><span class="rh-dot" style="background:' +
        (CAT_COLOR[e.category] || '#888') + '"></span>' +
        '<span class="rh-title">' + (e.emoji ? e.emoji + ' ' : '') + lpick(e, 'title') + '</span>' +
        '<span class="rh-date">' + md(e._start) + (e._end ? '–' + md(e._end) : '') + '</span>' +
        '<span class="rh-tag ' + cls + '">' + tag + '</span></li>';
    });
    list += '</ul>';
    if (items.length > 8) {
      list += '<div class="rh-more">' + fmt(T('dr.hub.more'), items.length - 8) + '</div>';
    }
    hint.innerHTML = head + list;
  }

  // ---------- 类别筛选（右下浮动按钮 + 弹出层） ----------
  function renderCatSidebar() {
    var cats = ['全部'];
    ACTIVE.forEach(function (e) { if (cats.indexOf(e.category) < 0) cats.push(e.category); });
    var list = document.getElementById('cat-pop-list');
    if (!list) return;
    list.innerHTML = '';
    var fabDot = document.getElementById('cat-fab-dot');
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'cat-pop-item' + (c === currentCat ? ' active' : '');
      var dot = '<span class="dot" style="background:' + (CAT_COLOR[c] || '#888') + '"></span>';
      b.innerHTML = dot + '<span>' + catLabel(c) + '</span>';
      b.addEventListener('click', function () {
        currentCat = c;
        Array.prototype.forEach.call(list.querySelectorAll('.cat-pop-item'), function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        if (fabDot) { fabDot.style.background = (c === '全部') ? 'transparent' : (CAT_COLOR[c] || '#888'); }
        renderTable(currentCat);
        renderCalendar();
        closeDetail();
        renderRemindHub(hubRange);
        closeCatPop();
      });
      list.appendChild(b);
    });
  }
  function openCatPop() { var p = document.getElementById('cat-pop'); if (p) p.hidden = false; }
  function closeCatPop() { var p = document.getElementById('cat-pop'); if (p) p.hidden = true; }

  // 语言切换时重渲染（保持功能不变）
  function relocalize() {
    var yb = document.getElementById('year-badge');
    if (yb) yb.textContent = currentYear + '–' + (currentYear + 1) + ' ' + T('dr.year.suffix');
    renderCatSidebar();
    renderCalendar();
    renderTable(currentCat);
    renderRemindHub(hubRange);
    if (detailOpen && lastDetailDs) showDetail(lastDetailDs);
  }

  function init() {
    todayStr = fmtDateInput(new Date());

    var now = new Date(); now.setHours(0, 0, 0, 0);
    var ty = (now.getMonth() >= 8) ? now.getFullYear() : now.getFullYear() - 1;
    var ys = presentYears();
    currentYear = (ys.indexOf(ty) >= 0) ? ty : ys[0];

    var yb = document.getElementById('year-badge');
    if (yb) yb.textContent = currentYear + '–' + (currentYear + 1) + ' ' + T('dr.year.suffix');

    refreshActive();
    setDefaultMonth();
    hubRange = 'today';

    // 顶部提醒 tab（今日/本周/本月）
    var rtabs = document.querySelectorAll('.rtab');
    Array.prototype.forEach.call(rtabs, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(rtabs, function (x) { x.classList.remove('active'); });
        btn.classList.add('active');
        renderRemindHub(btn.getAttribute('data-range'));
      });
    });
    // 信息下方的显式“复制文案”按钮（让用户明确知道可复制）
    var copyHubBtn = document.getElementById('remind-copy');
    if (copyHubBtn) copyHubBtn.addEventListener('click', function () { copyRange(hubRange); });

    // 分享
    var shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.addEventListener('click', function () {
      var data = { title: T('dr.brand'), text: T('dr.brand'), url: location.href };
      if (navigator.share) { navigator.share(data).catch(function () {}); }
      else { copyText(location.href).then(function () { showToast(T('dr.toast.share')); }); }
    });

    // 类别浮动筛选
    var fab = document.getElementById('cat-fab');
    if (fab) fab.addEventListener('click', openCatPop);
    var popClose = document.getElementById('cat-pop-close');
    if (popClose) popClose.addEventListener('click', closeCatPop);
    document.addEventListener('click', function (e) {
      var pop = document.getElementById('cat-pop');
      if (!pop || pop.hidden) return;
      if (!pop.contains(e.target) && e.target !== fab && !fab.contains(e.target)) closeCatPop();
    });

    // 详情模态关闭
    document.getElementById('detail-close').addEventListener('click', closeDetail);
    document.getElementById('detail-backdrop').addEventListener('click', function (e) {
      if (e.target === this) closeDetail();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDetail(); closeCatPop(); }
    });

    renderCatSidebar();
    renderCalendar();
    renderTable('全部');
    renderRemindHub(hubRange);

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

    if (window.UW_I18N && UW_I18N.onChange) UW_I18N.onChange(relocalize);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

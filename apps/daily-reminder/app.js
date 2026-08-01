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

  // 生成某范围的分享文案（今日用 buildMessage，本周/本月用清单）
  function buildRangeSummary(range) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (range === 'today') return buildMessage(ACTIVE, now);
    var w = rangeWindow(range);
    var items = eventsInRange(w[0], w[1], currentCat);
    var label = range === 'week' ? '本周' : '本月';
    var lines2 = [];
    lines2.push('📅 滑铁卢研究生重要日期 · ' + label + '提醒');
    lines2.push('（' + currentYear + '–' + (currentYear + 1) + ' 学年）');
    lines2.push('');
    if (!items.length) {
      lines2.push(label + '暂时没有重要日期，享受当下吧～');
    } else {
      lines2.push(label + '共 ' + items.length + ' 个重要节点：');
      items.forEach(function (e) {
        var d = dayDiff(e._start, now);
        var tag = d > 0 ? ('还有 ' + d + ' 天') : (e._end && e._end > now ? '进行中' : '就是今天');
        var dow = WD[e._start.getDay()];
        lines2.push('· ' + md(e._start) + ' ' + dow + ' ' + (e.emoji ? e.emoji + ' ' : '') +
          e.title_zh + '（' + tag + '）');
      });
    }
    lines2.push('');
    lines2.push('———');
    lines2.push('数据来源：University of Waterloo 研究生重要日期');
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
      var label = range === 'today' ? '今日' : range === 'week' ? '本周' : '本月';
      showToast('已复制' + label + '文案，去发给同学吧');
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

      var max = (typeof window !== 'undefined' && window.innerWidth <= 480) ? 2 : 3;
      starts.slice(0, max).forEach(function (e) {
        var chip = document.createElement('div');
        chip.className = 'cal-chip';
        chip.style.borderLeftColor = CAT_COLOR[e.category] || '#888';
        chip.textContent = (e.emoji ? e.emoji + ' ' : '') + e.title_zh;
        chip.title = e.title_en || e.title_zh;
        chip.addEventListener('click', function (ev) { ev.stopPropagation(); openDetail(ds); });
        cell.appendChild(chip);
      });
      if (starts.length > max) {
        var more = document.createElement('div');
        more.className = 'cal-more';
        more.textContent = '+' + (starts.length - max) + ' 更多';
        more.addEventListener('click', function (ev) { ev.stopPropagation(); openDetail(ds); });
        cell.appendChild(more);
      }

      cell.addEventListener('click', function () { openDetail(ds); });
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
      var c = CAT_COLOR[e.category] || '#888';
      var rangeEnd = e._end && e._start.getTime() !== e._end.getTime();
      var daterange = md(e._start) + (rangeEnd ? ' – ' + md(e._end) : '');
      var en = e.title_en ? '<div class="en">' + e.title_en + '</div>' : '';
      var act = e.action ? '<div class="act">💡 ' + e.action + '</div>' : '';
      html += '<div class="cal-detail-item" style="border-left:4px solid ' + c + '; background:' + hexToRgba(c, 0.06) + '">' +
        '<div class="zh">' + (e.emoji ? e.emoji + ' ' : '') + e.title_zh + '</div>' + en +
        '<div class="meta"><span class="cat cat-' + e.category + '">' + e.category + '</span>' +
        '<span class="date">' + daterange + '</span>' +
        (e.term_zh ? '<span class="term">' + e.term_zh + '</span>' : '') + '</div>' + act + '</div>';
    });
    html += '</div>';
    box.innerHTML = html;
  }

  function openDetail(ds) {
    showDetail(ds);
    document.getElementById('detail-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDetail() {
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
    var label = range === 'today' ? '今日' : range === 'week' ? '本周' : '本月';
    var hint = document.getElementById('remind-hint');
    var copyBtn = document.getElementById('remind-copy');
    if (copyBtn) copyBtn.textContent = '📋 复制' + label + '文案';

    if (!items.length) {
      // 范围内无事件：退而求其次展示最近的即将到来节点，保持提醒有用
      var now0 = new Date(); now0.setHours(0, 0, 0, 0);
      var up = ACTIVE.filter(function (e) {
        return e._start > now0 && (currentCat === '全部' || e.category === currentCat);
      }).sort(function (a, b) { return a._start - b._start || b.priority - a.priority; });
      if (up.length) {
        var n = up[0];
        var dd = dayDiff(n._start, now0);
        hint.innerHTML = '<div class="rh-empty">' + label + '暂无节点，最近：<b>' +
          (n.emoji ? n.emoji + ' ' : '') + n.title_zh + '</b>（' + md(n._start) +
          (n._end ? ' – ' + md(n._end) : '') + '，还有 ' + dd + ' 天）</div>';
      } else {
        hint.innerHTML = '<div class="rh-empty">' + label + '暂时没有重要日期，享受当下吧～</div>';
      }
      return;
    }

    var head = '<div class="rh-head">' + label + '共 <b>' + items.length + '</b> 个节点</div>';
    var list = '<ul class="rh-list">';
    var now = new Date(); now.setHours(0, 0, 0, 0);
    items.slice(0, 8).forEach(function (e) {
      var d = dayDiff(e._start, now);
      var tag, cls;
      if (e._end && e._start <= now && now <= e._end) { tag = '进行中'; cls = 'ongoing'; }
      else if (d === 0) { tag = '今天'; cls = 'today'; }
      else if (d === 1) { tag = '明天'; cls = 'soon'; }
      else if (d > 0) { tag = '还有 ' + d + ' 天'; cls = 'soon'; }
      else { tag = md(e._start); cls = ''; }
      list += '<li class="rh-item"><span class="rh-dot" style="background:' +
        (CAT_COLOR[e.category] || '#888') + '"></span>' +
        '<span class="rh-title">' + (e.emoji ? e.emoji + ' ' : '') + e.title_zh + '</span>' +
        '<span class="rh-date">' + md(e._start) + (e._end ? '–' + md(e._end) : '') + '</span>' +
        '<span class="rh-tag ' + cls + '">' + tag + '</span></li>';
    });
    list += '</ul>';
    if (items.length > 8) {
      list += '<div class="rh-more">还有 ' + (items.length - 8) + ' 个，点上方“复制”查看完整清单</div>';
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
      b.innerHTML = dot + '<span>' + c + '</span>';
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
        renderCatSidebar();
        renderCalendar();
        renderTable('全部');
        closeDetail();
        renderRemindHub(hubRange);
      });
      bar.appendChild(b);
    });
  }

  function init() {
    todayStr = fmtDateInput(new Date());

    var now = new Date(); now.setHours(0, 0, 0, 0);
    var ty = (now.getMonth() >= 8) ? now.getFullYear() : now.getFullYear() - 1;
    var ys = presentYears();
    currentYear = (ys.indexOf(ty) >= 0) ? ty : ys[0];

    if (ys.length <= 1) {
      var lbl = document.querySelector('#year-section .year-label');
      if (lbl) lbl.textContent = '当前学年（数据仅覆盖已公布的学期）';
    }

    refreshActive();
    setDefaultMonth();
    hubRange = 'today';

    // 顶部提醒 tab（今日/本周/本月）
    var rtabs = document.querySelectorAll('.rtab');
    Array.prototype.forEach.call(rtabs, function (btn) {
      btn.addEventListener('click', function (e) {
        if (e.target.classList.contains('copy-range')) return;
        Array.prototype.forEach.call(rtabs, function (x) { x.classList.remove('active'); });
        btn.classList.add('active');
        renderRemindHub(btn.getAttribute('data-range'));
      });
    });
    var crs = document.querySelectorAll('.copy-range');
    Array.prototype.forEach.call(crs, function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        copyRange(el.getAttribute('data-range'));
      });
    });
    // 信息下方的显式“复制文案”按钮（让用户明确知道可复制）
    var copyHubBtn = document.getElementById('remind-copy');
    if (copyHubBtn) copyHubBtn.addEventListener('click', function () { copyRange(hubRange); });

    // 分享
    var shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.addEventListener('click', function () {
      var data = { title: '滑铁卢研究生重要日期', text: '滑铁卢研究生重要日期日历', url: location.href };
      if (navigator.share) { navigator.share(data).catch(function () {}); }
      else { copyText(location.href).then(function () { showToast('链接已复制，去分享吧'); }); }
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

    renderYearTabs();
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
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

// 滑铁卢大学研究生每日提醒 · 网页版逻辑
// 复刻 daily_reminder.py 的 pick_focus + build_message
(function () {
  'use strict';

  var WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var CAT_RANK = { '缴费': 9, '毕业': 9, '退费': 8, '退课': 8, '选课': 7,
    '考试': 6, '上课': 6, '成绩': 5, 'Co-op': 4, '补课': 3,
    '假期': 2, '其他': 1 };
  var ACTIONABLE_PERIOD = { '选课': 1, '退课': 1 };

  function parseISO(s) { return s ? new Date(s + 'T00:00:00') : null; }
  function md(d) { return (d.getMonth() + 1) + '月' + d.getDate() + '日'; }
  function dayDiff(a, b) { return Math.round((a - b) / 86400000); }
  function weight(e) { return CAT_RANK[e.category] || 1; }

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

    // 1) 今天开始的硬性截止
    var hardToday = byW(startsToday.filter(function (e) { return e.priority === 3; }));
    if (hardToday.length) return [hardToday[0], 'today'];

    // 2) 未来7天硬性截止
    var near7 = upcoming.filter(function (e) { return e.priority === 3 && dayDiff(e._start, today) <= 7; })
      .sort(function (a, b) { return dayDiff(a._start, today) - dayDiff(b._start, today) || weight(b) - weight(a); });
    if (near7.length) return [near7[0], 'deadline'];

    // 3) 今天开始的重要事件(非假期)
    var impToday = byW(startsToday.filter(function (e) { return e.priority >= 2 && e.category !== '假期'; }));
    if (impToday.length) return [impToday[0], 'today'];

    // 4) 假期
    var holi = startsToday.filter(function (e) { return e.category === '假期'; })
      .concat(ongoing.filter(function (e) { return e.category === '假期'; }));
    if (holi.length) return [holi[0], 'holiday'];

    // 5) 未来14天硬性截止
    var near14 = upcoming.filter(function (e) { return e.priority === 3 && dayDiff(e._start, today) <= 14; })
      .sort(function (a, b) { return dayDiff(a._start, today) - dayDiff(b._start, today) || weight(b) - weight(a); });
    if (near14.length) return [near14[0], 'deadline'];

    // 6) 进行中的可处理期间(结束<=14天)
    var per = ongoing.filter(function (e) { return ACTIONABLE_PERIOD[e.category] && dayDiff(e._end, today) <= 14; })
      .sort(function (a, b) { return dayDiff(a._end, today) - dayDiff(b._end, today) || weight(b) - weight(a); });
    if (per.length) return [per[0], 'ongoing'];

    // 7) 今天开始的其他事件
    if (startsToday.length) return [byW(startsToday)[0], 'today'];

    // 8) 最近重要节点
    var impUp = upcoming.filter(function (e) { return e.priority >= 2; });
    if (impUp.length) {
      var e = impUp[0];
      return [e, e.priority === 3 ? 'deadline' : 'upcoming'];
    }

    // 9) 进行中的可处理期间(兜底)
    if (per.length) return [per[0], 'ongoing'];

    // 10) 兜底
    if (upcoming.length) return [upcoming[0], 'upcoming'];
    return [null, 'none'];
  }

  function buildMessage(events, today) {
    var lines = [];
    lines.push('📅 ' + md(today) + ' ' + WD[today.getDay()] + ' · 滑铁卢研究生日程提醒');
    lines.push('');

    var pf = pickFocus(events, today);
    var focus = pf[0], kind = pf[1];

    lines.push('☀️ 今日一件事');
    if (!focus) {
      lines.push('今天没有需要特别处理的事项，安心学习、照顾好自己就好～');
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

    // 今日节点
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

    // 临近提醒(未来21天)
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

  function fmtDateInput(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function renderReminder(dateStr) {
    var today = parseISO(dateStr);
    var msg = buildMessage(EVENTS, today);
    document.getElementById('reminder-text').textContent = msg;
    return msg;
  }

  function renderTable(filterCat) {
    var rows = EVENTS.slice().sort(function (a, b) { return a._start - b._start; });
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

  function init() {
    var dateInput = document.getElementById('date-pick');
    var todayStr = fmtDateInput(new Date());
    dateInput.value = todayStr;
    renderReminder(todayStr);
    renderTable('全部');

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

    // 类别筛选
    var cats = ['全部'];
    EVENTS.forEach(function (e) { if (cats.indexOf(e.category) < 0) cats.push(e.category); });
    var bar = document.getElementById('cat-bar');
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'chip' + (c === '全部' ? ' active' : '');
      b.textContent = c;
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(bar.children, function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        renderTable(c);
      });
      bar.appendChild(b);
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

/* ============================================================
   UW Toolkit · 顶部导航数据（滑铁卢常用站点索引）
   ------------------------------------------------------------
   分类原则：按「任务场景」而非「所属部门」分组——
   让学生从「我要做什么」出发一跳直达，而不是在 uwaterloo.ca
   的层层目录里翻找。

   新增链接：在对应 categories[].items 里加一条即可，
   icon 从下面的 ICONS 里选（或新增一个 24×24 描边 SVG）。
   链接可达性最后校验：2026-09-04（8/8 返回 200）

   双语改造（2026-09-14）：为每个分类补 desc_en、为每个条目补
   desc_en（保留原中文 desc 不删）；badge 改 badge + badge_en。
   数据层采用并列双语字段，UI 统一走 UW_I18N.pick(obj, field)
   取值（field_en → field → 空串）。
   ============================================================ */

/* 图标词汇表：统一 24×24、stroke=currentColor、圆头圆角，保证视觉节奏一致 */
window.UW_NAV_ICONS = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></svg>',
  checklist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h11M10 12h11M10 18h11"/><path d="m3 6 1.6 1.6L7.2 4.8"/><path d="m3 17.6 1.6 1.6L7.2 16.4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 17 8 4 8-4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
};

window.UW_NAV = {
  version: '2026.09.04',
  categories: [
    {
      id: 'academics',
      label: '学术日程',
      labelEn: 'Academics',
      desc: '学期节点 · 培养方案 · 开课查询',
      desc_en: 'Term dates · degree plans · course listings',
      icon: 'calendar',
      items: [
        {
          name: 'UW Important Dates',
          zh: '重要日期',
          desc: '学期关键节点、缴费与退课截止日',
          desc_en: 'Term milestones, fee & drop deadlines',
          url: 'https://uwaterloo.ca/important-dates',
          icon: 'calendar'
        },
        {
          name: 'Undergraduate Calendar',
          zh: '本科生日历',
          desc: '专业要求、课程规定与毕业条件',
          desc_en: 'Program requirements, course rules & degree conditions',
          url: 'https://ugradcalendar.uwaterloo.ca/',
          icon: 'book'
        },
        {
          name: 'Schedule of Classes',
          zh: '开课一览',
          desc: '按学期与科目查开课、排时间冲突',
          desc_en: 'Browse courses by term & subject, spot time conflicts',
          url: 'https://classes.uwaterloo.ca/under.html',
          icon: 'clock'
        }
      ]
    },
    {
      id: 'planning',
      label: '选课规划',
      labelEn: 'Planning',
      desc: '课程口碑 · 作业拆解',
      desc_en: 'Course reviews · assignment breakdowns',
      icon: 'layers',
      items: [
        {
          name: 'UW Flow',
          zh: '课程点评',
          desc: '课程与教授评分，选课前必看',
          desc_en: 'Course & prof ratings — must-read before enrolling',
          url: 'https://uwflow.com/',
          icon: 'star',
          badge: '热门',
          badge_en: 'Popular'
        },
        {
          name: 'UW Assignment Planner',
          zh: '作业规划器',
          desc: '按截止日期把论文与报告拆成步骤',
          desc_en: 'Break essays & reports into steps by deadline',
          url: 'https://uwaterloo.ca/writing-and-communication-centre/online-resources/assignment-planner',
          icon: 'checklist'
        }
      ]
    },
    {
      id: 'systems',
      label: '学生系统',
      labelEn: 'Systems',
      desc: '选课缴费 · Co-op 求职',
      desc_en: 'Enrollment & fees · Co-op job search',
      icon: 'user',
      items: [
        {
          name: 'Quest',
          zh: '教务系统',
          desc: '选课、缴费、成绩与个人课表',
          desc_en: 'Enroll, pay, grades & your personal schedule',
          url: 'https://quest.pecs.uwaterloo.ca',
          icon: 'user'
        },
        {
          name: 'WaterlooWorks',
          zh: 'Co-op 求职',
          desc: '岗位浏览与申请、面试安排',
          url: 'https://uwaterloo.ca/co-operative-education/waterlooworks-student-help/apply-jobs',
          desc_en: 'Browse & apply to jobs, schedule interviews',
          icon: 'briefcase'
        }
      ]
    },
    {
      id: 'campus',
      label: '校园资源',
      labelEn: 'Campus',
      desc: '工坊 · 设施 · 制作空间',
      desc_en: 'Shops · facilities · maker spaces',
      icon: 'wrench',
      items: [
        {
          name: 'Engineering Student Shops',
          zh: '工程学生车间',
          desc: '工坊设备、安全培训与预约',
          desc_en: 'Shop equipment, safety training & booking',
          url: 'https://uwaterloo.ca/engineering-student-shops/',
          icon: 'wrench'
        }
      ]
    }
  ]
};

// ============================================================
// 滑铁卢入学 SOP · 踩坑记录 / 更新日志 数据源（双语）
// ------------------------------------------------------------
// 本页是「活的 Wiki」：你之后在不同时间段遇到的问题，直接往下追加一条即可。
// 每条记录 = 一个对象，字段（中英并列，_en 为英文，缺省回退中文）：
//   date    : 字符串，YYYY-MM-DD（或阶段标签，如 "行前 / 抵达 / 注册"）
//   tag     : 可选，分类标签（如 签证 / 银行 / 选课 / 住宿 / 医保 …）
//   tag_en  : tag 的英文
//   title   : 一句话标题
//   title_en: title 的英文
//   body    : 详情（可多句；需要换行用 \n）
//   body_en : body 的英文
// 只需要复制下面任意一条改内容，别动其它代码。
// 事实 / 数字 / 日期 / 金额 / 课号一律原样保留，不因翻译改写。
// ============================================================
window.SOP_LOG = [
  {
    date: "2026-09-02",
    tag: "建站",
    tag_en: "Site launch",
    title: "SOP Wiki 初始化",
    title_en: "SOP Wiki initialised",
    body: "本页建立。先搭好「行前 → 抵达 → 注册 → 学术生活」四阶段骨架，踩坑记录从此处持续追加。",
    body_en: "This page was created. The four-phase skeleton (before departure → arrival → enrolment → academic life) is in place, and the pitfalls log grows from here."
  },
  {
    date: "2026-09-03",
    tag: "改版",
    tag_en: "Redesign",
    title: "SOP 升级为「左侧目录 + 全文搜索」的文档站形态",
    title_en: "SOP upgraded into a docs-style page with sidebar contents + full-text search",
    body: "新增左侧目录（滚动自动高亮当前章节）与全文搜索：命中处金色高亮、未命中章节自动隐藏、目录项显示命中数徽标。\n同时新增 AGENT_GUIDE.md —— 其它 AI 读完就知道怎么追加记录、怎么新增章节、以及哪些红线不能碰。",
    body_en: "Added a sidebar table of contents (auto-highlighting the current section on scroll) and full-text search: matches highlighted in gold, non-matching sections hidden automatically, and a hit-count badge on each contents entry.\nAlso added AGENT_GUIDE.md — any other AI can read it and immediately know how to append entries, how to add a section, and which red lines not to cross."
  },
  {
    date: "2026-09-03",
    tag: "医保",
    tag_en: "Health insurance",
    title: "UHIP 涨价 20%：2026–27 年度 $948/年",
    title_en: "UHIP up 20%: $948/year for 2026–27",
    body: "安省 22 所公立大学统一的 UHIP 保费从 $792 涨到 $948（分 3 期，每学期 $316），自动计入学生账户。\n坑点：必须账户状态变为 \"Fees Arranged\" 后才正式生效 —— 所以别把缴费拖到最后，否则等于医保没开。",
    body_en: "The UHIP premium shared by 22 Ontario public universities rose from $792 to $948 (3 instalments, $316 per term), charged automatically to the student account.\nThe catch: it only takes effect once the account shows \"Fees Arranged\" — so don't leave fee payment to the last minute, or you effectively have no health cover."
  },
  {
    date: "2026-09-03",
    tag: "缴费",
    tag_en: "Fees",
    title: "NFA 冻结比想象中早：9/23 生效，10/31 是最后期限",
    title_en: "The NFA freeze arrives earlier than expected: effective 9/23, deadline 10/31",
    body: "9/23 起未做缴费安排的账户会被加 NFA（Not Financially Arranged）冻结，后续选课等操作直接受限。\n10/31 是办理 \"Fees Arranged\" 的最后期限。落地后别只顾着办银行卡和手机卡，把缴费排进第一周。",
    body_en: "From 9/23, accounts without a payment arrangement are frozen with an NFA (Not Financially Arranged), which directly restricts course selection and similar actions.\n10/31 is the final deadline to arrange \"Fees Arranged\". After landing, don't spend all your time on the bank and phone — put paying fees in your first week."
  },
  {
    date: "2026-09-03",
    tag: "交通",
    tag_en: "Transit",
    title: "GRT U-Pass 直接刷 WatCard，忘带卡要付现金且不找零",
    title_en: "The GRT U-Pass is just a WatCard tap — no card means cash and no change",
    body: "全日制本科生和研究生都自动获得 U-Pass（已含在 incidental fees 里），刷 WatCard 就能无限次坐 GRT 公交与 ION 轻轨。\n坑点：忘带卡时现金票价 $3.75，只收正好的零钱、不找零。建议 WatCard 随身带。",
    body_en: "Full-time undergraduate and graduate students automatically receive the U-Pass (already included in incidental fees), and tapping the WatCard gives unlimited rides on GRT buses and the ION light rail.\nThe catch: without the card the cash fare is $3.75 and exact change is required — no change given. Keep your WatCard on you."
  },
  {
    date: "2026-09-03",
    tag: "考试",
    tag_en: "Exams",
    title: "期末考期含周日场次，12/24–12/31 学校闭校",
    title_en: "The exam period includes a Sunday session, and the university closes 12/24–12/31",
    body: "2026 秋季期末考期 12/10–12/23，其中 12/13（周日）也安排了考试 —— 别默认周末没考试，务必核对自己的场次。\n另外 12/24–12/31 学校假期闭校、办公室关闭，这段时间任何事务都办不了，需要办事的提前安排。",
    body_en: "The Fall 2026 final exam period runs 12/10–12/23, and 12/13 (a Sunday) also has exams scheduled — don't assume weekends are free, and check your own sessions. \nSeparately, the university closes for the holidays 12/24–12/31 with offices shut, so nothing can be processed in that window — plan anything you need in advance."
  },
  {
    date: "2026-09-03",
    tag: "住宿",
    tag_en: "Housing",
    title: "安省租房只收「最后一个月房租」押金，damage/pet 押金违法",
    title_en: "In Ontario only a \"last month's rent\" deposit is allowed — damage/pet deposits are illegal",
    body: "签租约时房东只可收「最后一个月房租」押金（不超过一个月房租），钥匙押金仅限实际配匙成本。\n坑点：安省 Residential Tenancies Act 明确禁止 damage / pet / 安全押金——遇到要求交「押金 + 中介费 + 杂费押金」的多半是坑或违法，可拒付并向 LTB 申诉。房东还得每年按指导线（2026 约 2.1%）付押金利息。",
    body_en: "When signing a lease the landlord may only collect a \"last month's rent\" deposit (not exceeding one month's rent), plus a key deposit limited to the actual cost of cutting keys.\nThe catch: Ontario's Residential Tenancies Act explicitly prohibits damage / pet / security deposits — a request for \"deposit + agency fee + sundry deposit\" is likely a trap or illegal; you can refuse and apply to the LTB. Landlords must also pay interest on the deposit each year at the guideline rate (about 2.1% in 2026)."
  },
  {
    date: "2026-09-03",
    tag: "Co-op",
    tag_en: "Co-op",
    title: "学制首尾必须是 study term，没拿到工签会被转 regular MEng",
    title_en: "The program must start and end with study terms — no work term means a move to regular MEng",
    body: "ECE MEng Co-op 要求以 study term 开始、以 study term 结束，最后一个 term 不能是工签。\n坑点：工签是高度竞争的求职过程、不是学校分配；若没拿到工签会被自动转入 regular MEng（无 co-op）。WIL 601 须在首个工签前的 study term 完成，工签报告（WTR）要在下一 term 第一周前交，别拖。",
    body_en: "ECE MEng Co-op requires starting and ending with a study term — the final term cannot be a work term.\nThe catch: a work term is a highly competitive job search, not something the university allocates; without one you are moved automatically into regular MEng (no co-op). WIL 601 must be completed in the study term before the first work term, and the Work Term Report (WTR) is due before the end of the first week of the next term — don't delay."
  }
  // ↓↓↓ 之后遇到的问题，复制上面这条改成你的内容，加在数组里即可 ↓↓↓
];

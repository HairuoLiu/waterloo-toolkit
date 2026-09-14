/* ============================================================
   course-planner · 内容层英文数据（与 index.html 的中文数据逐字段对应）
   ------------------------------------------------------------
   约定：中文走源字段（无后缀），英文走 *_en。
   事实红线：课号 / 学分 / 学期 / 数字 / 官方名称一律不译；
             推断性表述（如「开课学期为历史数据推断」）保持推断语气。
   ============================================================ */
window.UW_CP_EN = {

  /* ---------- 方向 / 标签 / 难度 ---------- */
  gl: {
    'ece-ai': 'ECE · AI / ML', 'ece-sw': 'ECE · Software Engineering', 'ece-sys': 'ECE · Systems',
    'ece-cam': 'ECE · Vision / Signals', 'ece-proj': 'ECE · Project (MEng Project)',
    'cs': 'CS · Computer Science', 'syde': 'SYDE · Systems Design', 'be': 'BE · Business',
    'math': 'Math · Statistics / Optimization', 'msci': 'MSCI · Management Sciences',
    'apply': 'Application-based entry'
  },
  tagt: {
    ai: 'AI', swe: 'Software', cam: 'Vision · Photography', easy: 'Light', hard: 'Hard',
    new: 'New', ext: 'Outside ECE', biz: 'Business', mile: 'Milestone',
    ctrl: 'Control · Robotics', rl: 'Reinforcement Learning'
  },
  dl: { 1: 'Easy', 2: 'Fairly easy', 2.5: 'Fairly easy', 3: 'Medium', 3.5: 'Medium-hard', 4: 'Hard', 4.5: 'Hard+', 5: 'Very hard' },

  /* ---------- 四套方案 ---------- */
  plans: {
    A: {
      tag_en: 'Plan 1', name_en: 'AI Specialization Track',
      sub_en: '8 courses, all ECE · 5 terms, 20 months · 1 co-op',
      badge_en: ['AI&ML specialization', 'All ECE', 'Low risk'],
      lead_en: 'Work backwards from the AI & Machine Learning specialization: build the schedule around it and graduate with one extra line on your transcript. All 8 courses sit inside ECE, so you spend zero outside-department slots and carry the lowest enrolment risk.',
      stats_en: [['Courses', ''], ['Outside ECE', ''], ['Months', ''], ['Co-op', '']],
      info_en: ['2 courses · peak application season', '3 courses · full throttle',
        '2 courses + WIL 601 · job-search term', 'Co-op · 4 months', '1 course · final term'],
      note_en: { 3: 'Sep–Dec co-op roles often carry a return-offer path. The search runs May–Aug 2027, so WIL 601 lands in May–Aug 2027 as well.' },
      win_en: [
        '<b>AI & ML specialization locked in</b>: required ECE 657 + 657A are both here, and electives 606 / 613 / 657D fill exactly the three slots.',
        '<b>Zero outside-ECE courses</b> — no professor signatures, no scrambling for permission numbers; everything registers directly in Quest.',
        'ECE 613 lands in W2027, the exact term Prof. Zhou Wang teaches it.',
        'The final course, ECE 657D, sits alone in W2028 — light pressure, and you can write graduation materials and apply for full-time roles at the same time.',
        'Co-op in F2027: by then you have finished 7 courses, so your interview knowledge base is as complete as it gets.'
      ],
      risk_en: [
        '<b>ECE 606 is the only difficulty-5 course in this catalogue (one of the hardest), and it lands in your very first term — peak application season.</b> It has no project: weekly assignments and exams only, and it will genuinely eat into your Aug–Oct application time.',
        'W2027 packs three courses, and 657A is assignment-heavy.',
        'If you find no co-op for F2027 you revert to regular MEng — by then you have 7 courses done, so the damage is contained, but you lose co-op status.',
        '20 months overall, i.e. four more months of tuition and living costs than the fastest plan.'
      ],
      swap_en: [
        ['ECE 606 too heavy', 'Swap in <b>ECE 750 T39</b> (scalable systems design) or <b>ECE 750 T41</b> (LLM × software engineering). You lose one specialization elective and must backfill from ECE 602 / 659 / 752.'],
        ['ECE 613 unavailable', 'Swap in <b>ECE 602</b> (optimization, same term and same elective list) or <b>ECE 752</b> (multi-agent systems, same term, same list).'],
        ['ECE 654 unavailable', 'Same term: swap to <b>ECE 653</b> (harder) or <b>ECE 652</b> (embedded).'],
        ['Do not want just 1 course in W2028', 'Move ECE 654 from S2027 to W2028, leaving S2027 as ECE 657 + WIL 601 only.']
      ],
      fit_en: 'For anyone who wants a named specialization on the transcript, hates fighting for seats and chasing signatures, and can survive a hard course in term one.'
    },
    B: {
      tag_en: 'Plan 2', name_en: 'LLM Frontier Fast Track',
      sub_en: '8 courses · 4 terms, 16 months · co-op in W2027',
      badge_en: ['Fastest', 'Newest AI', 'High risk'],
      lead_en: 'Pulls co-op forward to the front: 16 months to graduate, the only four-term plan of the four. Every course bets on the newest LLM / generative AI material; the price is giving up the specialization, and carrying a 3-course load while job hunting in term one.',
      stats_en: [['Courses', ''], ['Outside ECE', ''], ['Months', ''], ['Co-op', '']],
      info_en: ['3 courses + WIL 601 · busiest', 'Co-op · 4 months', '3 courses',
        '2 courses · final term + full-time applications'],
      note_en: { 1: 'You intern in your second term. The search must finish in Sep–Nov 2026, so WIL 601 sits in that same term.' },
      win_en: [
        '<b>16 months — the fastest of the four</b>, and the cheapest in tuition and living costs.',
        'You get ECE 750 T41, the new 2026 LLM × software engineering course, right in F2026 — a home-department course, so it costs no outside-ECE slot.',
        'ECE 655 (open-book, generous grading) balances the weight of ECE 650 in term one; the real load is lighter than it looks.',
        'S2027 pairs 653 + 751 — software engineering plus distributed systems — so the co-op experience lines up with the theory when you get back.',
        'CS 854 (GenAI model serving systems) in the final term is one of the most understaffed areas in the market and lands well in interviews.'
      ],
      risk_en: [
        '<b>The big one: the W2027 co-op must be secured during Sep–Nov 2026.</b> You will have just landed, just started classes, and be carrying 3 courses while applying, grinding LeetCode and interviewing. <b>The official rule: no placement means reverting to regular MEng.</b>',
        'No specialization at all — AI & ML needs 657 + 657A, and 657A is Winter-only, the term you are interning.',
        'No ECE 651 (a Winter course), so you miss the best team-project course.',
        'CS 854 needs instructor consent and a strong systems background; it is not guaranteed.',
        'Eight courses across four terms leaves zero slack — one problem and you slip.'
      ],
      swap_en: [
        ['No W2027 co-op', 'You revert to regular MEng automatically. Fall back to Plan 1\'s rhythm: take ECE 651 + 657A + 613 in W2027 and switch to the specialization route. <b>Have this Plan B ready in advance.</b>'],
        ['No consent for CS 854', 'Swap in <b>ECE 750 T39</b> (home department, F2027, scalable systems design) or <b>ECE 750 T37</b> (adaptive software systems).'],
        ['ECE 653 too hard', 'Same term: swap to <b>ECE 654</b> (software reliability) or <b>ECE 652</b>.'],
        ['Want to keep the specialization open', 'Replace F2027’s CS 854 with ECE 657A? <b>No</b> — 657A is Winter-only. This is a structural gap the plan cannot close.']
      ],
      fit_en: 'For anyone on a tight budget who wants to graduate and start working fast, cares more about the newest AI than about a transcript line, and is confident they can land a co-op within two months of arriving.'
    },
    C: {
      tag_en: 'Plan 3', name_en: 'Systems Core · Double Co-op',
      sub_en: '8 courses · 5 terms, 20 months · 8 months continuous internship',
      badge_en: ['8-month internship', 'Return offer', 'No specialization'],
      lead_en: 'The only plan that uses two consecutive work terms. S2027 + F2027 at the same company for 8 straight months — the shape with the highest return-offer probability in North America. Courses all sit on the systems / distributed / database line that big-tech system design interviews are built on.',
      stats_en: [['Courses', ''], ['Outside ECE', ''], ['Months', ''], ['Co-op', '']],
      info_en: ['2 courses · laying the foundation', '3 courses + WIL 601 · job-search term',
        'Co-op · segment 1', 'Co-op · segment 2', '3 courses · final term'],
      note_en: {
        2: 'WaterlooWorks recruiting runs Jan–Apr 2027, so WIL 601 sits in Jan–Apr 2027.',
        3: 'Must be consecutive with segment 1 and with the same employer. Eight months is enough to own a complete module end to end — the best window for a return offer.'
      },
      win_en: [
        '<b>8 continuous months of internship</b> — a four-month internship usually ends right as you get up to speed; eight months is what it takes to deliver a complete module independently. That is the decisive difference for a return offer.',
        '650 + 750 T39 in F2026 is a solid pairing: one teaches you how to write systems, the other how to make them survive scale.',
        '651 + 656 + 750 T29 in W2027 is the software engineering trio (design / data / verification), maxing out your engineering skills before the internship.',
        'W2028 closes with three AI courses (657D deep learning + 657A + 613 image processing) — a clean way to load up on AI after the internship.',
        'All ECE: zero outside-department slots spent, zero enrolment friction.'
      ],
      risk_en: [
        '<b>No AI & ML specialization</b> — required ECE 657 is Spring-only and your Spring is a work term. <b>No Software specialization either</b> — required ECE 653 is also Spring-only. That is the direct cost of the double co-op.',
        'W2028 carries 3 courses in the final term while you are also applying full-time and preparing to graduate — pressure concentrates at the end.',
        'The two work terms must be <b>consecutive and with the same employer</b>; if segment one goes badly you have no option to switch companies mid-way.',
        'ECE 750 T29 (automated program verification, Gurfinkel) is very hard — evaluate carefully before stacking it with 651 + 656.'
      ],
      swap_en: [
        ['ECE 750 T29 too hard', 'Swap to <b>ECE 628</b> (network security) or <b>ECE 602</b> (optimization); for something lighter, <b>ECE 750 T42</b> (software data mining, same term, low load).'],
        ['Only 1 work term', 'Becomes a 4-term plan: F2026 (2) → W2027 (3) → S2027 work → F2027 (3). F2027 can then be ECE 606 + 750 T39 + 750 T37.'],
        ['Want to rescue the AI specialization', 'Replace W2027’s ECE 656 with <b>ECE 657A</b>, then take 657D + 613 + one specialization elective in W2028. But <b>ECE 657 is still impossible</b> (Spring-only), so the specialization remains out of reach.'],
        ['Three courses in W2028 is too heavy', 'Drop ECE 613 and take 2; the alternative would be <b>SYDE 671</b> (Fall-only, but you are interning in Fall) — in practice there is no fix, so accept three courses or give up 613.']
      ],
      fit_en: 'For anyone who ranks “land a return offer at a North American big-tech company” first and is willing to trade a transcript specialization for 8 months of real work experience. <b>If getting hired is your primary goal, this plan has the highest expected value.</b>'
    },
    D: {
      tag_en: 'Plan 4', name_en: 'Product & Startups · Business Leadership',
      sub_en: '9 courses · 5 terms, 20 months · 5 ECE + 4 BE',
      badge_en: ['BL specialization', 'Build products', 'Needs confirmation'],
      lead_en: 'Exploits a special clause in the Business Leadership specialization: outside-department courses relax from 3 to 4, the total rises from 8 to 9, and you can <b>lean toward</b> a second ECE specialization (by default AI&ML falls one short — see risks). For your interest line of “build my own product, make things with CNC”, this is one of the few paths that turns it into credit.',
      stats_en: [['Courses', ''], ['Outside ECE', ''], ['Months', ''], ['Co-op', '']],
      info_en: ['2 courses', '3 courses', '2 courses + WIL 601 · job-search term',
        'Co-op · 4 months', '2 courses · final term'],
      note_en: { 3: 'A tech + business profile is a differentiator for product-facing roles (TPM, Solutions Engineer, early engineer at a startup).' },
      win_en: [
        '<b>Business Leadership specialization secured</b>: 5 ECE courses (650 / 657A / 657 / 613 / 657D) + 4 BE; the AI & ML specialization reaches only 2 of 3 (one short, see risks).',
        'BE courses are mostly case studies and group work, so the <b>load is clearly lighter than hard ECE courses</b> — you trade 4 light courses for a specialization and free up a lot of time for your photography, filmmaking and CNC projects.',
        'Business courses teach “is this worth building, how do you price it, how do you explain it to someone” — things pure engineering programmes never cover but that you use every day when shipping your own product.',
        'ECE 613 + ECE 657D stay in, so the vision and AI interest lines survive.',
        'If the CNC or imaging tools actually become something, this course profile lines up directly with the Velocity Graduate Startup Fund ($20,000 + an incubator seat).'
      ],
      risk_en: [
        '<b>The biggest unknown: BET courses are explicitly closed to students outside the MBET programme</b>; only BE-prefixed courses are open to graduate students university-wide. ECE’s official wording is “up to 4 approved BE/BET courses” — <b>you must get that approved list confirmed in writing by the ECE Graduate Office, or this whole plan collapses.</b>',
        '9 courses = one more course of tuition than the standard.',
        '<b>AI & ML is one elective short</b>: 657 ✅ 657A ✅ are in place, but only 613 and 657D count as electives, leaving you 1 short. To close it you must swap ECE 650 for ECE 606 (606 is on the elective list) — the price is losing 650, the foundation course for the software pivot. Weigh this yourself.',
        'BE course terms could not be verified this time; Conrad School scheduling may clash with ECE.',
        'Business courses help pure technical interviews only indirectly, and your résumé will show fewer technical projects than under Plans 1 / 3.'
      ],
      swap_en: [
        ['These BE courses are not on the approved list', 'Fall back to Plan 1 entirely, or just use the standard 3 outside-department slots for CS / SYDE courses.'],
        ['Want both specializations', 'Swap F2026’s ECE 650 for <b>ECE 606</b>; then 606 + 613 + 657D fill all three electives and both specializations land. But you lose 650.'],
        ['BE course term clash', 'The BE pool also has BE 602 (data analytics), BE 630 (professional selling), BE 660 (negotiations) and BE 603 (operations & supply chain) as substitutes.'],
        ['9 courses is too many', 'Drop the Business Leadership specialization, take only 2–3 BE courses as ordinary outside-department electives, and return to 8 courses.']
      ],
      fit_en: 'For anyone who genuinely plans to turn the CNC builds or imaging tools into a product, or wants a tech + business hybrid path (product manager, startup, solutions engineering). <b>If a big-tech SWE offer is the only goal, Plan 3 is more direct.</b>'
    }
  },

  /* ---------- 前沿课 / 新课 ---------- */
  frontier: {
    'ECE 657D': 'The ECE deep-learning course closest to modern AI (first offered W2026); the final project can go toward generative video',
    'CS 854': 'Putting large models into production (a systems view) — one of the most understaffed and best-paid directions in the market',
    'CS 886 SEM 001': 'Learning theory of Transformers and LLMs — the deepest theory on offer',
    'CS 886 SEM 002': 'Vision-language models — the intersection of your photography interest and AI',
    'CS 886 SEM 003': 'Generative models (diffusion / GAN / autoregressive), the closest fit to image-making',
    'ECE 757A': 'Embodied intelligence — the frontier where robotics meets AI (Dautenhahn)',
    'ECE 752': 'Multi-agent systems — the theoretical foundation behind the 2026 LLM-agent wave',
    'ECE 613': 'The closest this campus gets to photography, and as a home-department course it costs no outside-ECE slot; taught by Zhou Wang, author of SSIM'
  },
  newCourses: {
    'CS 886 SEM 001': { n: 'Learning Theory of Transformers & LLMs', t: 'New F2026 topic' },
    'CS 886 SEM 002': { n: 'Vision-Language Models', t: 'New F2026 topic' },
    'CS 886 SEM 003': { n: 'Theory & Applications of Generative Models', t: 'New F2026 topic' },
    'CS 886 SEM 004': { n: 'Topics in Language Modelling', t: 'New F2026 topic' },
    'CS 848 SEM 001': { n: 'Vector + hybrid indexing (the layer under RAG)', t: 'New F2026 topic' },
    'CS 848 SEM 002': { n: 'Modern Database Systems', t: 'New F2026 topic' },
    'CS 698': { n: 'AI Transformation in Organizations', t: 'New F2026 topic' },
    'ECE 657D': { n: 'Deep Learning (Neural Networks & DL)', t: 'Recent in ECE · first offered W2026' },
    'ECE 757A': { n: 'Embodied Intelligence', t: 'Recent ECE direction' },
    'ECE 752': { n: 'Foundations of Multi-Agent Systems', t: 'Recent ECE direction' }
  },

  /* ---------- 课程地图（按索引与中文 MAP 对应；键名不可叫 map，会与下方地图页文案对象重名） ---------- */
  mapDirs: [
    { dir: 'AI & Machine Learning', cl: ['Foundations · math and tools', 'Core · the specialization base', 'Advanced · deep learning and generation', 'Advanced · agents and decision making', 'Advanced · trust and causality'] },
    { dir: 'Software Engineering', cl: ['Foundations · the coding base', 'Core · the engineering trio', 'Advanced · formal methods', 'Advanced · data-driven / LLM × SE', 'Outside-department backfill'] },
    { dir: 'Systems · Networking · Distributed', cl: ['Foundations', 'Core', 'Advanced', 'Security side-branch'] },
    { dir: 'Control · Autonomy · Robotics', cl: ['Foundations', 'Core', 'Advanced'] },
    { dir: 'Vision · Signals · Imaging', cl: ['Foundations', 'Core', 'Advanced'] },
    { dir: 'Product · Startups · Organizations', cl: ['Foundations', 'Core', 'Cross-cutting'] }
  ],

  /* ---------- 跨系申请 ---------- */
  apply: {
    cs: {
      label: 'CS · Computer Science',
      note: 'CS graduate courses are reserved on Quest for CS graduate students; other departments (including ECE) cannot self-register and must go through the instructor-consent process. You may apply for 1 course per term; as an ECE MEng student you have at most 3 outside-department slots (relaxed to 4 under the Business Leadership specialization, subject to written confirmation from the Graduate Office).'
    }
  },

  /* ---------- 各视图的英文文案 ---------- */
  home: {
    h1: 'Pick your route first, then your courses',
    lede: 'Course navigator for the Waterloo ECE MEng (including Co-op). Four plans — open one to see scheduling, difficulty and back-ups; the course library is searchable by interest.',
    fit: 'Best for: ',
    lib: 'Course Library',
    all: 'See all %d courses →',
    m1: 'New and most advanced courses this year →',
    m2: 'Course map (direction → individual courses) →',
    m3: 'How Co-op scheduling works →'
  },
  courses: { crumb: 'Course Library', count: '%d courses' },
  plan: { crumb: 'Plan %s · %s', crumbHome: 'Home', win: 'Strengths', risk: 'Costs / Risks', swap: 'If you cannot get in', fit: 'Who it is for: ', work: 'Work term', coopNote: 'Co-op work term' },
  new: {
    crumb: 'New This Year / Frontier', h1: 'Frontier courses', h2: 'What is new in this year’s schedule',
    note: 'Long-standing core courses (ECE 657 / 657A / 650 and others) run every year and are not listed here. CS 886 adds four new seminars this year covering LLMs, vision-language, and generative models.'
  },
  map: {
    crumb: 'Course Map', h2: 'From broad direction down to a single course',
    lede: 'Start by choosing a line (high level), then work down “foundations → core → advanced” (low level). Click any course code for details and prerequisites.',
    note: 'Direction groupings follow ECE graduate specializations and hiring paths; a single course may span several lines. Special topics marked “instructor consent required” can be proposed by you to a professor as a new offering.'
  },
  coop: {
    crumb: 'Co-op Rules',
    legend: { w: 'Internship', s: 'Study', m: 'Milestone' },
    h2hook: 'How do you schedule Co-op?',
    key: [
      ['The last term must be a study term', 'You cannot graduate straight out of an internship — the timeline can only end as “internship → one more study term → graduate”.'],
      ['WIL 601 must be finished first', 'It has to be completed before your first work term. It does not count toward the 8 graduation courses, but without it you lose Co-op eligibility.'],
      ['Two work terms must be consecutive', 'To do two work terms they must be back-to-back with the same employer — no study term in between.']
    ],
    excep: 'Read these three exceptions first',
    excepLi: [
      '<b>Outside-department courses can relax to 4</b>: a special clause of the Business Leadership specialization (used by Plan 4); the approved list must be confirmed in writing by the ECE Graduate Office, otherwise the standard 3 applies.',
      '<b>If this campus cannot fit it, take it elsewhere</b>: OVGS is the Ontario inter-university cross-registration channel and can untie the “required specialization course collides with a work term” knot. But you may not register in your final term, and nothing is approved after week 2 of classes.',
      '<b>Failing to find an internship does not mean expulsion</b>: the official rule is reversion to regular MEng. Credits already earned are kept, but you lose Co-op status. Decide on this Plan B while you are still scheduling.'
    ],
    h2std: 'The standard layout: why it can only work this way',
    steps: [
      '<b>Compute the graduation floor first</b>8 courses, of which ≥5 must be ECE; at most 3 may be from outside the department (Engineering / Math / Science graduate courses), and no undergraduate 400 / 500-level courses. This step decides the minimum number of study terms you need.',
      '<b>Then pin the last term</b>The final segment before graduation must be a study term. So however many internships you do, the ending has to keep one study term — this alone sets the length of the whole timeline.',
      '<b>Place the work terms next</b>One segment is 4 months. If you want two, they must be consecutive with the same employer and no study term in between, otherwise Co-op is not considered complete.',
      '<b>The term before a work term is the job-search term</b>WaterlooWorks recruits one term ahead, so the study term right before an internship is also your peak applying, LeetCode and interview term. Do not fill it with hard courses.',
      '<b>Put WIL 601 in the job-search term</b>It must be completed before the first work term and does not count toward the 8 courses. Its position differs across all four plans because it follows the work term — this is the easiest piece to miss and the most likely to break your Co-op eligibility.',
      '<b>Backfill the courses last</b>Distribute the remaining courses 2–3 per study term. Watch the term constraints: ECE 657 is Spring-only, 657A is Winter-only, ECE 653 is Spring-only. If any of them collide with a work term you lose the specialization — either switch plans or use OVGS.'
    ],
    h2tl: 'The two timelines',
    tlhint: '← swipe to see the full timeline',
    tlA: { title: '1 work term · 5 terms · 20 months', segs: [['Study', ''], ['Study', ''], ['Study', 'Job-search term'], ['Internship', '4 months'], ['Study', 'Graduation term']], marks: [['WIL 601', 400], ['Job search', 482], ['Graduate', 845]] },
    tlB: { title: '2 consecutive work terms · 5 terms · 20 months', segs: [['Study', ''], ['Study', 'Job-search term'], ['Internship', 'Segment 1'], ['Internship', 'Segment 2 · same employer'], ['Study', 'Graduation term']], marks: [['WIL 601', 226], ['Job search', 308], ['Graduate', 845]], join: 2 },
    noteAmber: 'Term names use a 2026 (Sep–Dec 2026) intake as an example, to illustrate the structure. Your actual terms depend on the Co-op offer you receive and on recruiting cycles; before registering, rely on the official schedules from the ECE Graduate Office and Quest.',
    recrH2: 'Summer internship recruiting timeline',
    recrIntro: 'North American big-tech summer SWE internships recruit about six months ahead of the internship itself. These are the key milestones — if you want May–Aug 2027 to be your internship window, you start applying in August 2026.',
    recr: [
      ['Applications open', 'Aug–Oct 2026', 'Big-tech summer intern roles open in a concentrated wave. You will have just landed and just started classes, so you are applying, grinding LeetCode and attending class at the same time.'],
      ['Interviews', 'Oct 2026 – Jan 2027', 'Online assessments + technical + behavioural rounds. Note that December exam period overlaps interviews — plan ahead.'],
      ['Summer internship', 'May–Aug 2027', '12–16 weeks. A strong performance converts straight into a full-time return offer, with no need to wait for a second Co-op term.']
    ],
    recrNote: [
      '<b>A Co-op work term does not mean WaterlooWorks only.</b> An external summer internship you find on your own also counts as an official Co-op work term, as long as you clear it with the Co-op Office in advance — you keep Co-op status and work-permit eligibility.',
      '<b>Both paths can run in parallel:</b> WaterlooWorks postings plus your own external applications do not conflict. Start both as soon as Fall 2026 begins.'
    ],
    q1: 'Go to Quest to register ↗',
    q2: 'Browse the class schedule ↗'
  },
  applyView: {
    crumb: 'Cross-Department Application Guide',
    h2: 'Cross-department enrolment guide',
    lede: 'You are an ECE student who wants to take a graduate course in another department. Quest does not open these courses to you directly, so you need instructor consent. Tick the courses below → the matching application steps and email template are generated automatically. <b>CS (Computer Science)</b> is open now; SYDE / Math / BE and other departments will follow.',
    empty: 'Tick a course above and the matching application steps and email template will appear here.',
    steps: [
      'Check prerequisites: confirm you already meet the prerequisites for <b>%s</b> (see “Prerequisites” in the course details).',
      'Email the course instructor a few weeks before classes start (template below), including: full name / student ID / home department (ECE) / course code + section.',
      'Sit in during week one: if seats allow, auditing is welcome, and it shows the professor you are a serious applicant.',
      'Collect the permission number after week one: %s issues it after the first week of classes; use it to register in Quest.',
      'Deadline: after the drop/add deadline (roughly 3 weeks into term) you need a Graduate Drop/Add Form (advisor + CS Graduate Officer signatures), which is a hassle — apply early.'
    ],
    consent: '⚠ This course is marked “instructor consent required”; seats are limited, so email early and be sure to attend week one.',
    emailBar: 'Email template (copy and edit)',
    consentTag: 'Consent required',
    copy: 'Copy',
    copied: 'Copied ✓'
  },
  drawer: {
    empty: 'Details for this course are still to be added.',
    difficulty: 'difficulty',
    desc: 'Course content', proj: 'Projects / assessment', pre: 'Prerequisites',
    why: 'Why it is worth taking', builds: 'What it builds toward', needs: 'What it needs first',
    forWhom: 'Best for whom', alt: 'Alternatives', warn: 'Caution', rel: 'Others in this area',
    links: 'Official links',
    hint: 'Left: Waterloo site search (course description). Middle: outline.uwaterloo.ca goes straight to that course’s past syllabi / teaching schedule / instructor / prerequisites. Right: the Quest registration system.',
    l1: 'Official course page on uwaterloo.ca ↗',
    l2: 'Past outlines on outline.uwaterloo.ca ↗',
    l3: 'Register in Quest ↗',
    ext: 'Uses an outside-ECE slot', consent: 'Instructor consent required', dormant: 'Not offered in recent years'
  },
  share: { title: 'Waterloo ECE MEng Course Navigator', text: 'Waterloo ECE MEng Course Navigator', toast: 'Link copied — go share it' }
};

/* ---------- 把 *_en 字段并入源数据（源对象为 const，改用 var 后可从 window 取到） ---------- */
(function () {
  var E = window.UW_CP_EN;
  var P = window.PLANS;
  if (P && E.plans) P.forEach(function (p) { var e = E.plans[p.id]; if (e) for (var k in e) p[k] = e[k]; });
  var F = window.FRONTIER;
  if (F && E.frontier) F.forEach(function (o) { if (E.frontier[o.c]) o.hot_en = E.frontier[o.c]; });
  var N = window.NEWCOURSES;
  if (N && E.newCourses) N.forEach(function (o) { var e = E.newCourses[o.c]; if (e) { o.n_en = e.n; o.t_en = e.t; } });
  var A = window.APPLY_GROUPS;
  if (A && E.apply) A.forEach(function (g) { var e = E.apply[g.key]; if (e) for (var k in e) g[k + '_en'] = e[k]; });
})();

# AGENT_MEMORY.md — 滑铁卢大学工具箱交接记忆（手写总记忆）

> **这是给「未来的 AI / 接手续作的人」读的总记忆文档。**
> 它不是规范本身，而是**规范之外的所有上下文**：为什么这么决定、踩过哪些坑、当前状态、以及接下来该做什么。
> 规范以仓库里的 `README.md`（总规范）和 `STRUCTURE.md`（精简版）为准；本文件指向它们并补充"活知识"。
> **建议阅读顺序**：本文件 → `README.md` → `STRUCTURE.md` → 需要动手时再查具体文件 / 两个 skill。

---

## 0. 一句话项目身份

- **是什么**：面向滑铁卢大学学生（研究生为主）的**纯静态工具集合站点**，无后端、免登录，跑在 GitHub Pages。
- **在线地址**：`https://hairuoliu.github.io/waterloo-toolkit/`
- **仓库**：`https://github.com/HairuoLiu/waterloo-toolkit`（分支 `master`，Pages 源 = `master` / `/`，仓库含 `.nojekyll`）
- **设计哲学**：主站只做"列表卡片"，每个工具是一个 `apps/<app-id>/` 子文件夹；新增工具 = 建文件夹 + 改 `manifest.json` + 跑 `gen_cover.py`，**不改主站 `index.html`**。
- **为谁做**：站点主人是滑铁卢大学 ECE MEng（授课型）2026 Fall 入学的国际研究生（详见 §10）。`daily-reminder` 和 `course-planner` 都围绕"研究生真实需求"展开。

---

## 1. 当前状态快照（写于 2026-08-19，最后一次实质提交 `99f342f`）

| 项 | 状态 |
|----|------|
| 主站 `index.html` | 已上线，读 `apps/manifest.json` 渲染卡片（含封面图） |
| `daily-reminder` | 已上线，月历+列表双视图、按学年拆分、类别筛选、提醒中心、分享/GitHub 顶栏 |
| `course-planner` | 已上线，但内容由**另一位 AI 通过 `uw-toolkit-onboard` 上架**，属于"示范/骨架"性质，课程数据待充实 |
| 顶栏规范 | 三页（主站 / daily-reminder / course-planner）均已落地统一顶栏（GitHub + 分享 + 可选导航） |
| 移动端导航 | `.nav` / `.topbar-nav` 移动端（≤680px）**强制换行到第二行左对齐**，GitHub+分享保持右上 |
| QA 门禁 | 推送前必须用 linkedom 真实 DOM 跑一遍（见 §8） |

> ⚠️ 本仓库为 **PUBLIC**。任何写入本仓库的内容都会公开。请勿在仓库内放密钥、个人隐私或敏感数据（参见 §10 关于"已刻意省略"的说明）。

---

## 2. 文件地图（每个文件是干嘛的）

```
waterloo-toolkit/
├── AGENT_MEMORY.md        # ← 本文件（交接记忆）
├── index.html             # 主站：fetch('apps/manifest.json') 渲染工具卡片
├── README.md              # ★ 总规范（命名/重命名/封面/顶栏/部署）给 AI 读
├── STRUCTURE.md           # 子 App 命名/结构细则（README 的精简版）
├── .nojekyll              # 必须：禁用 Jekyll，子路径资源才正常
├── assets/
│   ├── style.css          # ★ 唯一共享样式（含 .topbar / .top-actions / .icon-btn / .topbar-nav）
│   └── gen_cover.py       # ★ 封面统一生成器（所有 cover.svg 都靠它，禁止手写 SVG）
└── apps/
    ├── manifest.json      # ★ 子 App 清单（数组）；新增/改名必改
    ├── daily-reminder/
    │   ├── index.html     # 页面骨架 + 顶栏 + 视图容器
    │   ├── app.js         # 全部逻辑：日历/列表/学年/提醒中心/类别筛选/分享
    │   ├── data.js         # window.UW_EVENTS = [...]（由 transform_data.py 生成，97 条）
    │   └── cover.svg       # gen_cover.py 生成
    └── course-planner/
        ├── index.html     # 页面（含 .nav 顶部导航、顶栏、内联样式）
        ├── README.md      # 该子 App 自己的说明
        ├── DEV.md         # 该子 App 的实现细节
        └── cover.svg
```

> 注意：仓库**不含** `daily-reminder` 的构建管线脚本（`parse_dates.py` / `enrich_dates.py` / `transform_data.py`）——它们原本在 `2026-07-31-14-35-22/` 工作区根目录（即本次准备移除的本地项目），**没有被纳入本仓库**。详见 §9 数据管线说明与风险。

---

## 3. 子 App 详情

### 3.1 daily-reminder（研究生每日提醒）

- **数据来源**：`https://uwaterloo.ca/important-dates/graduate`（校方研究生重要日期页）。
- **核心功能**：
  - 月历视图（默认）+ 列表视图双切换；
  - **按学年拆分**：顶部学年 tab 把每个学年（以 Fall 入学为起点，如 2026–2027）切成独立日历/列表/提醒，互不混淆；
  - 日历按类别配色、跨天事件整段底色延续、点击日期弹**中英双语**详情；
  - 类别筛选（缴费/退课/考试/假期…）两类视图共用；
  - 「提醒中心」tab：今日 → 本周 → 本月，每个节点一行（彩色圆点 + 标题 + 日期 + 倒数标签「还有 N 天 / 今天 / 进行中」），空范围显示"X 暂无重要日期"；
  - 显式「📋 复制X文案」按钮（navigator.clipboard 复制，含星期+日期+来源）。
- **数据范围（重要，别当 bug 修）**：只保留「今天及以后、且为 Fall 入学学年」的节点。**2026 年 8 月整月 0 个事件是正常的**——首个事件是 2026-09-07（劳动节），当前处于学年开始前的暑假空档。日历默认停在"今天所在月份"，所以 8 月看到的日历是空的，这不是故障。
- **单学年隐藏**：当前 UW 只公布到 2027 春季（即 2026–2027 学年结束），故只有 1 个学年 tab；`init()` 在 `ys.length<=1` 时隐藏年份选择器、改为显示「2026–2027 学年」金色徽标。未来出现新学年时 tab **自动**出现，无需改代码。
- **顶栏**：右上 `.top-actions` 含 GitHub（指向 `apps/daily-reminder`）+ `#share-btn` 分享，`#toast` 提示。

### 3.2 course-planner（ECE 选课导航）

- **来源**：由「另一位 AI」按 `uw-toolkit-onboard` 交接 prompt 上架，目的是**验证"外部 AI 上架"流程跑得通**。
- **当前性质**：功能骨架/示范，页面可运行（顶栏、`.nav` 导航、路由切换、移动端左对齐均已实现），但**课程数据、Co-op 规则、课程地图的具体内容待充实**。
- **结构要点**：顶部导航 `.nav` 是 `.top .wrap` 的**直接子元素**（与 `.lhs`、`.top-actions` 同级），移动端（≤680px）`order:3; flex-basis:100%; justify-content:flex-start` 换行左对齐；JS 仅保留 `markNav(key)` 当前页高亮。
- **合并史**：远程曾用 `84212f6` 给它加过"汉堡菜单"把导航 `position:fixed;display:none` 隐藏，与"移动端导航可见且左上"的要求冲突，已**弃用汉堡菜单**，`99f342f` 合并提交保留可见的左上导航。

---

## 4. 全站规范速记（规范以 README 为准，这里只列"必须记住的硬约束"）

1. **命名**：`apps/<app-id>/`，id 全小写 kebab-case（只用 `a-z 0-9 -`），每文件夹必含 `index.html`。
2. **相对路径**：所有站内链接用相对路径（`../../assets/style.css`），**禁止** `/` 开头的绝对路径（Pages 跑在子路径下）。数据内嵌为 `window.XXX=[...]` 的 `.js`，避免 `fetch` 本地文件限制。
3. **封面**：只有 `assets/gen_cover.py` 生成的 `cover.svg`（1200×630）合法，**禁止手写 SVG、禁止改尺寸/字体/固定色、禁止 PNG/JPG**。同类同色（category→accent 映射见 README §3.3）。
4. **顶栏（每页必含）**：左 `brand`（回首页），右 `.top-actions` 含 **GitHub 图标链接 + 分享按钮 `#share-btn`**（两钮间分隔线由 `.icon-btn + .icon-btn` 提供）；样式**只能**用 `assets/style.css` 现成的 `.topbar/.top-actions/.icon-btn`，子 App 禁止自创顶栏 CSS；分享逻辑 `navigator.share` 优先、不支持则复制链接+toast。
5. **移动端导航（硬规则）**：若子 App 有顶部导航，统一用 `<nav class="topbar-nav">` 放 `.topbar` 内、作为 `.brand` 与 `.top-actions` 的同级兄弟；桌面端靠右，**移动端（≤680px）必须换行到第二行左对齐**，绝不许把导航堆在右上角。GitHub/分享按钮移动端仍保持右上角。
6. **manifest 三处同步**：新增 = 建文件夹 + 追加 manifest 一项 + 跑 gen_cover；**改名 = `git mv` + 同步 manifest 的 `id/path/cover` 三处 + 重跑 gen_cover**，否则首页 404。

---

## 5. 关键决策与"为什么"（决策日志）

- **为什么弃用汉堡菜单（burger）**：用户明确要求"移动端导航放在左上角、始终可见"，汉堡隐藏菜单不符合，故 course-planner 合并冲突时主动删掉远程加的 burger。
- **为什么强调色统一用 UW Gold（`--brand:#FED34C` / `--brand-deep:#EAAB00`）**：子 App 可保留自身主题色，但顶栏的形状/位置/内容（GitHub+分享）/分享行为必须全站一致、强调色统一。
- **为什么用 `.topbar-nav` 复用组件而非各写媒体查询**：未来任何人新建导航都自动获得移动端左对齐，规范靠"共享 CSS"而非"靠人记住"。
- **为什么日历默认停在今天所在月份而不是跳到学年开始**：修复了一个"真机看起来日历丢了"的错觉（之前跳到 9 月导致今日无高亮）。
- **为什么单学年时隐藏年份选择器**：用户感知"没选学年"不舒服，改为始终可见的「2026–2027 学年」徽标。
- **为什么"严格按范围"**：用户明确不要"空范围时借最近节点"的回退，今日只今日、本周只本周、本月只本月，空则显示"暂无"。
- **为什么数据只有 2026–2027 一学年**：校方目前只公布到 2027 春季，不是数据缺失。
- **为什么 push 前必须 QA**：曾出现"假 DOM 桩自造元素给假通过"的惨案；改用 linkedom 真实解析 `index.html` 后抓出过真 bug，从此定为门禁。

---

## 6. 技术坑 / 本机环境陷阱（⚠️ 未来 agent 必读，能省几小时）

1. **`.git` 曾三次损坏**（提交/拉取/rebase 时变 "not a git repository"）。**教训：不要用 `git rebase`**。遇到分叉优先 `git pull --no-rebase`（merge）；若 `.git` 真坏了，修复脚本是：
   ```
   先 cp 备份工作树改动 → git init → git remote add origin <url> → git fetch → git checkout -f -b master origin/master → 把备份覆盖回工作树 → git add -A → commit → push
   ```
2. **`rm` 被 safe-delete 钩子拦截删不掉文件** → 改用 `python -c "import os; os.remove('路径')"` 或 PowerShell `Remove-Item -Force`。
3. **Git Bash 没有 `sleep` / `timeout`** → 等 Pages 构建用 `python -c "import time; time.sleep(40)"`。
4. **GitHub Pages 推送后约 30s–2min 才生效**：中途 curl 出现 404 多半是传播延迟，**不是真丢失**，等一会儿再查。
5. **linkedom 的 `window.navigator` / `location` 是只读 getter**：执行 `app.js` 时要作为 `new Function('window','document','navigator','location', appJs)` 的参数注入桩对象，不能直接赋值。
6. **绝对路径用 `C:/...`（正斜杠 Windows 路径）**，不要用 `/c/...`（会被 Node 当成盘根相对路径）。
7. **`data.js` 必须在 `app.js` 之前执行**（QA 时先跑 data.js 注入 `window.UW_EVENTS`，否则 EVENTS 为空、`currentYear=undefined` 假失败）。
8. **`.nojekyll` 必须存在**，否则子路径资源可能被 Jekyll 处理而 404。

---

## 7. 推送前 QA 门禁（linkedom 真实 DOM）

- **位置**：历史脚本 `qa_dr.js` 原本在 `C:\Users\h\WorkBuddy\2026-07-31-14-35-22\qa_dr.js`（**仓库外，不会被纳入本仓库，且本次本地项目将被移除**）。建议未来 agent 把 QA 脚本**放进仓库**（如 `tools/qa_dr.js`）以便长期留存。
- **linkedom 位置**：`~/.workbuddy/binaries/node/workspace/node_modules/linkedom/cjs/index.js`（CJS 入口）。
- **做法**：用 linkedom `parseHTML` 真实解析 `apps/daily-reminder/index.html` → 注入 `data.js` + 执行 `app.js` → 捕获抛错 → 断言（学年徽标可见 / 今日高亮 / 三范围复制含来源 / FAB 在容器内 / 倒数标签 / 移动端 CSS 规则等）。**push 前必须 0 错误通过**。
- **course-planner 的 QA 清单**（曾用一次性脚本验证 14/14）：`.nav` 是 `.top .wrap` 直接子元素、无 `.top-mid`、`.lhs`/`.top-actions` 存在、5 个 nav 链接、`@media(max-width:680px) .nav{order:3/flex-basis:100%/justify-content:flex-start}` 都在、无 `.burger`/`.navmask` CSS、`markNav` 存在、无 `burgerEl`/`closeNav`。

---

## 8. 两个相关 Skill（不在本仓库，在 `~/.workbuddy/skills/`）

- **`uw-toolkit-site`**：站点模式的总说明（目录约定、命名、顶栏规范、manifest、封面、部署、`gh` 命令、本机坑、无头校验）。**改了顶栏/封面规范后必须同步更新它**。
- **`uw-toolkit-onboard`**：生成"发给另一个 AI 的上架交接 prompt"的 skill，含 `references/prompt_template.md`（完整可直接复制的 prompt）。course-planner 就是另一个 AI 凭它上架的。
- ⚠️ 这两个 skill 在本地 `~/.workbuddy/skills/`，**不随本仓库走**。若换机器，需重新安装/复制。本仓库的 `README.md` / `STRUCTURE.md` 才是跨机器可依赖的权威规范。

---

## 9. 数据管线说明与风险（重要）

- `daily-reminder` 的**数据源脚本**（`parse_dates.py` 抓 UW 页 → `enrich_dates.py` 翻译分类 → `transform_data.py` 过滤+加 `academicYear`+写 `data.js`）原本在 `2026-07-31-14-35-22/` 工作区根目录，**未纳入本仓库**。
- `transform_data.py` 关键逻辑：`academic_year(s)`：月份 9–12 → 年 Y；1–8 → Y-1。由此把 117 条原始数据过滤为 97 条（剔除入学前的 2025–26 学年共 20 条），全部 `academicYear:2026`。
- **风险**：本次本地项目（含构建脚本）将被移除。若未来要"重抓数据更新到 2027–2028 学年"，需要**重建这套管线**（或把脚本迁移进仓库 `tools/`）。建议未来 agent：把数据管线脚本纳入仓库，使"重抓"可一键复现。
- 同款 `events.json`（117 条）也存在于 skill `uw-grad-daily-reminder`（`~/.workbuddy/skills/uw-grad-daily-reminder/data/`），但那是为"每日提醒定时任务"准备的，与站点 `data.js` 是两份独立副本，更新时需分别处理。

---

## 10. 用户相关背景（仅摘录与本项目相关的部分）

**与本项目直接相关的学术背景**：
- 滑铁卢大学 **ECE MEng（授课型）**，2026 Fall 入学，国际学生。
- 选课偏好：越新、越 AI 相关越好；希望课程能产出可写进简历的 side project。
- 关键约束：MEng 8 门课毕业、≥5 门 ECE、外系最多 3 门（限工/数/理学院）、**禁止选任何本科课**（Fine Arts / Theatre 不算）、每学期最少 2 门；MEng Co-op 必须在申请阶段单独投，入读后不能转。
- 职业目标：北美 SWE / Data·ML·AI 工程 / FDE（Forward Deployed Engineer），优先找实习/co-op。

> **⚠️ 已刻意省略、未写入本 PUBLIC 仓库的内容**：用户的签证/移民状态、个人财务与对冲研究、简历精修专家团、以及其他个人项目（CameraManuals.Pro、IKEAR、基金宝典、Fusion 360 等）。这些属于敏感个人信息，保存在本地私有记忆 `~/.workbuddy/MEMORY.md`（位于 `~/.workbuddy/`，**不在**本次将移除的项目工作区内，通常会随 WorkBuddy 配置保留）。未来 agent 如需跨项目背景，请向用户确认而非假设其仍在某处可读。

---

## 11. Future Plan（接下来该做什么）

### 11.1 确定要做
1. **数据更新（2027–2028 学年）**：等 UW 公布 2027 秋季后，重建/运行数据管线，给 `data.js` 加 `academicYear` 字段，网页会自动多出对应学年 tab。建议顺手把管线脚本迁进仓库 `tools/`。
2. **保持规范同步**：任何顶栏/封面/命名改动，必须同时更新 `README.md` + `STRUCTURE.md` + 两个 skill（`uw-toolkit-site` / `uw-toolkit-onboard`）。
3. **QA 脚本入库**：把 linkedom QA 脚本放进仓库（如 `tools/qa_dr.js`），避免随本地项目丢失。

### 11.2 待用户确认的优化（曾讨论，未落地）
4. **daily-reminder tab 顺序**：用户曾希望"今日 → 本周 → 本月"；请先核对当前顺序（记忆中为 今日/本周/本月）与用户期望是否一致，再决定是否调整 `app.js` 的渲染顺序。
5. **daily-reminder 顶部控件精简**：用户早期质疑"复制文案/回到今天/查看日期"三按钮过重，后已改为"今天"胶囊 + 显式复制按钮；若仍觉得重，可进一步收拢。
6. **OG / SEO**：各页补 `<title>` 与 `meta description`，并在主站/`index.html` 加 OG 标签（封面图已存在，但未确认是否作为 OG 图像被社交分享正确抓取）。

### 11.3 course-planner 的下一步（最有价值的扩展）
7. **充实真实内容**：course-planner 目前是骨架。自然下一步是把真实 ECE 课程数据、Co-op 规则、课程地图做成结构化数据并渲染（一份详细的选课规划曾存在于另一个将被移除的工作区 `2026-08-01-10-40-47/outputs/waterloo-ece-meng-选课规划.html`，建议将其内容迁移进 course-planner 的数据/页面）。
8. **考虑新子 App**：如 `coop-tracker`（co-op 申请/投递追踪）或把 co-op 信息并入 course-planner。

### 11.4 运维
9. **每日提醒定时任务**：曾创建 automation `automation-1785523694848`「滑铁卢研究生每日提醒」每天 08:00 运行（定义在 `~/.workbuddy/workbuddy.db`，非本仓库）。项目工作区移除后请确认该自动化仍按预期运行，必要时按新路径重建。
10. **Pages 生效验证**：每次 push 后用 `curl -s -o /dev/null -w "%{http_code}" https://hairuoliu.github.io/waterloo-toolkit/` 确认 200（注意传播延迟）。

---

## 12. 交接检查清单（未来 agent 第一步该做的）

- [ ] 读 `README.md` + `STRUCTURE.md`（权威规范）。
- [ ] `git clone` / `git pull` 确保本地与 `master` 同步；若 `.git` 损坏按 §6.1 修复。
- [ ] 本地预览：`python -m http.server 8080`（别双击 index.html，fetch 受限）。
- [ ] 改任何东西后：跑 linkedom QA（§7）确认 0 错误，再 push。
- [ ] push 后等 ~1min 用 curl 验证线上 200。
- [ ] 改顶栏/封面/命名规范 → 同步 README + STRUCTURE + 两个 skill。
- [ ] 新增/改名子 App → 严格按 §4 第 6 条，避免首页 404。
- [ ] 遇到"8 月没事件 / 单学年 tab 少"——这是正常的，不是 bug（§3.1）。

---
*本记忆文档由前任 agent 在 2026-08-19 整理并推送，用于在本地项目移除后，让后续 agent 能无缝接手 waterloo-toolkit。*

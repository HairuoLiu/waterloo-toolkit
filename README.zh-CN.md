[English](README.md) | **中文**

# 滑铁卢大学工具箱 · UW Toolkit

面向滑铁卢大学学生（以研究生为主）的轻量工具集合。**纯静态站点，无后端、免登录**，部署在 GitHub Pages。

🌐 **在线地址**：`https://hairuoliu.github.io/waterloo-toolkit/`
📦 **仓库**：`https://github.com/HairuoLiu/waterloo-toolkit`

> 这是给**未来的 AI / 协作者**读的总规范文档。读完本文件，你应当能：
> 1. 知道子 App 文件夹怎么命名、怎么重命名；
> 2. 知道每个子 App 的「封面图」怎么做，且风格与现有封面**完全一致**；
> 3. 知道怎么新增一个工具、**怎么同步首页、怎么写它的 README**，以及怎么部署。

---

## ★ 运行规则（Operating Rules · 未来 AI 强制必读）

> 本节是**硬约束**。任何 AI / 协作者在**新增、改名、删除，或实质性修改**任何一个子 App 之后，必须完成 R1–R4，否则视为任务未完成。
> 为什么要立规矩：首页是**数据驱动**的（`index.html` 读 `apps/manifest.json` 渲染卡片）。清单、封面、子页面文档三者一旦不同步，用户就会遇到「首页有卡片、点进去看不懂」或「功能做完了、首页却找不到」的错位。

### R1 · 首页必须同步（清单 = 首页的唯一真相源）

1. 新增 / 改名 / 删除子 App ⇒ **必须**同步 `apps/manifest.json`，且 `id / title_zh / title_en / desc_zh / desc_en / icon / category / path / cover` 九个字段都要填对。
2. 首页**不得**硬编码任何工具列表；所有改动落到 manifest，由 `index.html` 自动渲染。
3. 改了 App 的功能定位、核心用法或数据范围 ⇒ **必须同时更新 manifest 的 `desc_zh` / `desc_en`**，让首页卡片的描述与真实能力一致。
4. 每条 `desc` 都要讲清**核心概要**：解决谁的什么问题、怎么用一句话说完。禁止只写「XX 工具」这种空话。
5. 提交前自检：**首页卡片数 = `manifest.json` 条目数 = `apps/` 下文件夹数**。三者不等即为漏改。

### R2 · 每个子 App 必须有自己的 README（强制）

每个 `apps/<app-id>/` 下**必须**有 `README.md`，按下面六段写，并且**与代码现状保持一致**（不是写一次就丢在一边）：

1. **核心概要** —— 一句话定位 + 解决谁的什么问题 + 一句话用法。
2. **怎么用** —— 用户视角的分步说明：有哪些视图 / 筛选 / 搜索 / 详情 / 出口链接。
3. **怎么设计** —— 文件清单及各自职责、数据结构（字段名 + 一条样例）、渲染流程、外部依赖（含 CDN）、样式约定。
4. **怎么改** —— 最常见的 3–5 类改动分别动哪些文件、改完怎么验证。
5. **事实红线** —— 数据里的日期、金额、电话、邮箱、URL、课号**一律原样保留并可溯源，绝不编造**；拿不到就明确标注「平台消息 / 网站表单」。推断内容必须标注为**推断**。
6. **参考资料** —— 官方来源链接清单（带检索日期）。

> 只要改了 App 的行为、数据或结构，**同一次提交里必须更新该 App 的 `README.md`**。

### R3 · 可发现性（Discoverability）

- 子 App 页面必须保留全站顶栏（回首页 + GitHub + 分享），规范见第 7 节。
- 若 App 有多个视图 / 路由，必须在 `README.md` 里列出锚点或 hash 路由，便于用户与 AI 直达。
- 双语站点：界面文案走 `assets/i18n/*.js` 词典，长文用 `lang="zh"` / `lang="en"` 并列；新增文案**必须两种语言都补**，缺一语言即视为缺陷。

### R4 · 推送前自检清单（Pre-push Checklist）

- [ ] `apps/manifest.json` 已同步（含双语标题与描述）
- [ ] `cover.svg` 由 `gen_cover.py` 重新生成，且 `cover` 字段已写入 manifest
- [ ] `apps/<app-id>/README.md` 存在，且与实际行为一致
- [ ] 本 README 的「现有子 App」表格已更新（含核心概要）
- [ ] 本地 `python -m http.server 8080` 预览：首页卡片出现、无 404、中英切换正常

---

## 0. 现有子 App（已上线）

> 首页卡片完全由 `apps/manifest.json` 驱动；下表是**人工维护的核心概要**，新增 / 修改后请按 R1、R2 同步更新。各 App 的详细说明见 `apps/<app-id>/README.md`。

| app-id | 名称 | 核心概要（讲清「给谁、解决什么、怎么用」） |
|--------|------|------------------------------------------|
| `sop` | 滑铁卢入学 SOP | 给**新生（以 MEng / Co-op 为主）**的入学全流程 Wiki：行前 → 抵达 → 注册 → 学术生活四个阶段，每步给清单可逐项打勾；共 11 个章节（含重要日期速查、Co-op 求职时间线、租房、选课策略、杂费明细）；左侧目录 + 全文搜索（命中高亮、未命中章节自动隐藏）；底部「踩坑记录」由 `data.js` 驱动，追加一条即可持续长大。**用法**：按阶段从上往下走，遇到问题搜关键词或追加一条踩坑记录。 |
| `daily-reminder` | 研究生每日提醒 | 把 **UW 研究生重要日期**做成日历 / 列表双视图，并按**学年拆分**（每个学年独立日历与提醒）；顶部「今日 / 本周 / 本月」提醒 + 一键复制文案发群；类别筛选（缴费 / 退课 / 考试 / 假期…）两视图共用。**用法**：每天看一眼「今日一件事」，需要发给同学就点复制。 |
| `course-planner` | ECE 选课导航 | 给 **ECE MEng（含 Co-op）**的选课规划工具：**4 套方案**（各自有定位、时长、Co-op 安排、风险与备选路径）、**112 门课程库**（点课号看难度、开课学期与教授、内容、项目考核、先修、替代课与「铺垫/需要/适合谁」关系字段）、**课程地图**（6 大方向 → 基础/核心/进阶）、Co-op 规则与跨系 / 跨校（OVGS）说明。**用法**：先选一套方案，再按它的学期时间轴选课。 |
| `weekday-stay` | 周中临时住宿 | 给**多伦多及周边、每周赴滑铁卢 2–3 晚**的人：Top 50 长住候选（Waterloo / Kitchener / Cambridge / Guelph），可按城市与等级筛选、搜索、点行看地址电话与联系方式；附**谈价策略**、**英文电话谈判脚本**与 **Call #1 → #8 呼叫顺序**。窗口 2026-09-08 ~ 12-08，共 **27 间夜**。**用法**：按呼叫顺序从上往下打，先让对方报价，按脚本还价。 |
| `locker-finder` | UW 储物柜地图 | **Leaflet + OpenStreetMap** 真实地图标出全校储物柜位置；标注免费 / 租赁 / 日租、学期或日租、是否可自带挂锁、管理方与申请方式；「地图 / 列表」双视图，点标记或卡片看详情。**用法**：先按类别筛选，再看离你最近的那个能不能自带挂锁。 |
| `goose-glance` | Goose Glance 职位洞察 | 第三方 **Chrome 扩展（MIT，非 UW 官方）**的落地页：在 Waterloo Works 岗位页用**浏览器内 AI（WebLLM，不上传数据）**把长岗位压缩成「洞察卡」——AI 职位名、1–3 条关键职责、实习时长、地点与远程/混合/现场、所需技能、特殊要求（法语 / 驾照 / 背调 / 身份 / 签证 / 证书）与需备材料。**用法**：先在 Chrome 商店安装扩展，再打开 Waterloo Works 岗位页。 |

> **数据范围说明（daily-reminder）**：本工具只保留「今天及以后、且为 Fall 入学学年」的节点。当前校方研究生重要日期页面只发布到 **2027 年春季**（即 2026–2027 学年结束），因此现在只有 **2026–2027 学年** 一个 tab；等校方发布 2027 秋季（2027–2028 学年）后，重新抓取一次、给数据加 `academicYear` 字段，网页会**自动**多出对应学年 tab，无需改代码。
> 新增子 App 时，建议延续「默认一个主视图 + 顶部类别筛选 + 详情面板」的信息组织方式，保持整站体验一致。

---

## 1. 目录结构

```
waterloo-toolkit/
├── index.html              # 主站首页：读取 apps/manifest.json 渲染工具卡片（含封面图）
├── README.md               # 本文件（总规范，给 AI / 协作者读）
├── STRUCTURE.md            # 子 App 命名/结构细则（本文件的精简版，可二选一阅读）
├── .nojekyll               # 禁用 Jekyll，保证子路径资源正常加载
├── assets/
│   ├── style.css           # 全站共享样式（唯一一份）
│   └── gen_cover.py        # ★ 封面统一生成器（所有封面都由它产出，禁止手写 SVG）
└── apps/
    ├── manifest.json       # ★ 子 App 清单（首页数据源；新增/改名必改）
    └── <app-id>/           # 每个工具一个文件夹（kebab-case）
        ├── index.html      # 工具页面（必须）
        ├── cover.svg       # 工具封面图（由 gen_cover.py 生成，1200×630）
        └── …               # 其余资源（js / css / 数据）自行放置
```

---

## 2. 子 App 命名与重命名规范

### 2.1 命名规则
- 每个工具一个文件夹：`apps/<app-id>/`
- `<app-id>` 规则：
  - **全小写 `kebab-case`**（小写 + 连字符），如 `daily-reminder`、`course-planner`、`coop-tracker`
  - 只用 `a-z 0-9 -`，**不要**空格、中文、下划线、大写
  - 简短、见名知意；同一工具只能有一个 id
- 每个 `<app-id>` 文件夹**必须**含 `index.html`
- 页面内引用共享样式用 `../../assets/style.css`（相对路径，因站点运行在子路径下）

### 2.2 新增一个子 App
1. 在 `apps/` 下新建 `apps/<app-id>/`，放入 `index.html` 及所需资源。
2. 打开 `apps/manifest.json`，在数组里**追加一个对象**（字段见下）。
3. 运行 `gen_cover.py` 生成该工具的 `cover.svg`（见第 3 节）。脚本会自动把 `cover` 字段写进 manifest。
4. 提交并推送，主站首页**自动**出现新卡片，无需改 `index.html`。

`manifest.json` 条目字段：
```json
{
  "id": "daily-reminder",        // = 文件夹名，全小写 kebab-case
  "title_zh": "研究生每日提醒",    // 中文标题（卡片与封面主标题用）
  "title_en": "Grad Daily Reminder",
  "desc_zh": "每天挑出一件最该做的事，带行动建议，可一键复制发群。",
  "desc_en": "One thing to do each day, with action tips.",
  "icon": "📅",                   // 无封面时的兜底图标
  "category": "日程提醒",          // 分类标签（卡片药丸 + 封面药丸 + 决定 accent 配色）
  "path": "apps/daily-reminder/",  // 相对根的路径，以 / 结尾
  "cover": "apps/daily-reminder/cover.svg"  // 封面图路径（gen_cover.py 自动补）
}
```

### 2.3 重命名一个已有的子 App
1. `git mv apps/<old-id> apps/<new-id>`（保留历史）。
2. 把新文件夹内 `index.html` 里对 `../../assets/style.css` 等相对引用保持不变（层级没变，无需改）。
3. 编辑 `apps/manifest.json`：把该条目的 `id`、`path`、`cover` 三处同步改成 `<new-id>`。
4. 重新运行 `gen_cover.py --id <new-id> ...`（参数里的 `--app-path` 也要改成 `apps/<new-id>`）以更新封面内的底部路径文字。
5. 提交推送。

> ⚠️ 重命名后务必同时改 manifest 的 `id / path / cover` 三处 + 重跑 gen_cover，否则首页会 404。

---

## 3. 封面（cover）制作规范 —— 统一风格的唯一方式

**核心原则：所有封面都由 `assets/gen_cover.py` 生成，禁止手写 SVG、禁止私自换字体/换配色。**
这样无论谁来加工具，整站封面风格都一致（尺寸、配色、版式、字体统一）。

### 3.1 怎么生成
在仓库根目录运行（参数填你这个工具的资料）：
```bash
python assets/gen_cover.py \
  --id daily-reminder \
  --emoji "📅" \
  --category "日程提醒" \
  --title "研究生每日提醒" \
  --desc "每天挑出一件最该做的事，带行动建议，可一键复制发群。" \
  --app-path "apps/daily-reminder"
```
效果：
- 写出 `apps/<id>/cover.svg`（1200×630）
- **自动**在 `apps/manifest.json` 对应条目补上 `"cover": "apps/<id>/cover.svg"`

可选参数：
- `--accent "#d11610"`：不传则按 `category` 自动取色（见下表）。除非有强理由，否则**不要**手动指定，保持同类同色。
- `--out "自定义路径.svg"`：一般不用，默认 `apps/<id>/cover.svg`。

### 3.2 封面字段（未来 AI 照填即可）
| 参数 | 含义 | 限制 |
|------|------|------|
| `emoji` | 工具图标，显示在左上角圆角徽章 | 一个 emoji |
| `category` | 分类标签，显示在图标右侧药丸 | 自由填；决定自动配色 |
| `title` | 工具中文标题（封面主标题） | **≤13 字/行，最多 2 行**，超出自动截断加 … |
| `desc` | 一句话说明 | **≤26 字/行，最多 3 行**，超出自动截断加 … |
| `app-path` | 工具在站内的路径 | 如 `apps/daily-reminder` |
| `accent` | 主题色（徽章/药丸/装饰图形） | 不填则按 category 取 |

### 3.3 自动配色表（category → accent，保持同类同色）
| category | 颜色 |
|----------|------|
| 日程提醒 | `#d11610`（UW Red） |
| 选课 / 课程 | `#2563eb` |
| 考试 | `#6b46c1` |
| 成绩 | `#344675` |
| 毕业 | `#b9770e` |
| 求职 / Co-op | `#b83280` |
| 财务 / 缴费 | `#c0392b` |
| 生活 | `#1f8a4c` |
| 通用 | `#2b6cb0` |

不在表中的 category 默认用 `#2b6cb0`。

### 3.4 封面版式（模板定死的，不要改）
- **尺寸**：1200 × 630（社交分享/OG 标准尺寸，也适合卡片缩略图）
- **背景**：浅灰 `#f6f7fb` + 细点阵纹理
- **左上角**：圆角徽章（accent 渐变填充）内放 `emoji`；右侧小药丸放 `category`
- **主标题**：左下，58px 粗体 `#1f2430`
- **说明**：标题下，27px `#6b7280`
- **右侧装饰**：accent 半透明大圆 + 一个白色「模拟小卡片」（带几条色条），制造图文并茂质感
- **底栏**：分隔线 + 左「🎓 滑铁卢大学工具箱」+ 右 `waterloo-toolkit/<app-path>`（等宽灰字，便于一眼定位）
- **字体**：与全站一致（`-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`）

### 3.5 风格红线（违反即破坏统一性，禁止）
- ❌ 不要手写/改 `cover.svg` 的 XML，永远用 `gen_cover.py` 生成。
- ❌ 不要改 `gen_cover.py` 里的尺寸、字体、固定色（`INK/MUTED/LINE/BG/BRAND`）。
- ❌ 不要给某个工具私自指定与类别不符的 `accent`（同类必须同色）。
- ❌ 不要把封面做成 PNG/JPG——统一用 SVG（矢量、清晰、可直接进 git、体积小）。
- ❌ 标题/说明不要塞太多字，保持「一眼看懂」：标题 ≤13 字/行、说明 ≤26 字/行。

---

## 4. 给未来 AI 的快速指引（TL;DR）

> 用户说「在工具箱里加个 XXX」时，照做：
> 1. `mkdir apps/<xxx-id>`（kebab-case）→ 写 `index.html`（引用 `../../assets/style.css`）。
> 2. 在 `apps/manifest.json` 数组追加一条（含 `id/title_zh/title_en/desc_zh/desc_en/icon/category/path`）。
> 3. `python assets/gen_cover.py --id <xxx-id> --emoji … --category … --title … --desc … --app-path apps/<xxx-id>`（自动写 cover + 改 manifest）。
> 4. 本地 `python -m http.server 8080` 预览（直接双击 index.html 会因 fetch 限制读不到 manifest）。
> 5. `git add -A && git commit && git push` → GitHub Pages 自动更新。
>
> 重命名时：`git mv` 改文件夹 → 同步 manifest 的 `id/path/cover` → 重跑 `gen_cover.py`。

---

## 5. 本地预览

```bash
cd waterloo-toolkit
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

> 直接双击 `index.html` 打开会因 `fetch` 本地文件受限而无法加载清单，请用本地服务器预览。

## 6. 部署

推送到 `master` 分支即自动生效（GitHub Pages 源已设为 `master` / `/`）。
（仓库已含 `.nojekyll`，禁用 Jekyll。）

---

## 7. 顶栏（Topbar）规范 —— 全站统一

> 和封面一样，顶栏也是「整站一致性」的硬性规范：**每个页面（主站 + 每个子 App）都必须包含同一套顶栏**，用户在任何页面都能一键回首页、看源码、分享。

**强制项**
1. 结构：左侧 `brand`（含返回首页链接），右侧 `.top-actions`。
2. 右上角**必须同时有**两个图标按钮，中间用分隔线隔开：
   - **GitHub 源码链接**（新窗口打开）
   - **分享按钮** `#share-btn`
3. 样式**只能**用 `assets/style.css` 里现成的 `.topbar` / `.top-actions` / `.icon-btn`，禁止子 App 自创一套顶栏 CSS。
4. 分享行为：`navigator.share` 优先；不支持时回退为「复制当前链接 + toast 提示」。
5. GitHub 链接：子 App 指向 `https://github.com/HairuoLiu/waterloo-toolkit/tree/master/apps/<app-id>`；主站指向仓库根。
6. **导航菜单（如有）移动端必须左对齐**：若子 App 需要顶部导航（如 course-planner 的 首页/课程库/Co-op规则/课程地图/今年新课），统一用 `<nav class="topbar-nav">` 放在 `.topbar` 内、**作为 `.brand` 与 `.top-actions` 的同级兄弟**。桌面端导航与右上角操作区相邻（靠右）；**移动端（≤680px）导航必须换行到第二行并左对齐**，绝不允许把导航堆在右上角挤成一团。GitHub/分享按钮在移动端仍保持在右上角。

**子 App 标准顶栏 HTML（含可选导航）**
```html
<header class="topbar">
  <a class="brand" href="../../index.html">
    <span class="uw-logo" aria-hidden="true"><!-- 可选：UW 金色 logo SVG --></span>
    <span class="brand-text">工具中文名</span>
  </a>
  <!-- 可选：顶部导航菜单（移动端自动换行到第二行左对齐） -->
  <nav class="topbar-nav">
    <a href="#/">首页</a>
    <a href="#/list">列表</a>
  </nav>
  <div class="top-actions">
    <a class="icon-btn" href="https://github.com/HairuoLiu/waterloo-toolkit/tree/master/apps/<app-id>"
       target="_blank" rel="noopener" aria-label="在 GitHub 查看源码" title="在 GitHub 查看源码"><!-- GitHub SVG --></a>
    <button class="icon-btn" id="share-btn" aria-label="分享此页面" title="分享此页面"><!-- 分享 SVG --></button>
  </div>
</header>
```

**分享按钮 JS（每个页面都要有，并含 `#toast` 容器）**
```html
<div class="toast" id="toast" hidden></div>
<script>
  (function () {
    var sb = document.getElementById('share-btn');
    function toast(m){ var t=document.getElementById('toast'); if(!t)return; t.textContent=m; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(function(){t.hidden=true;},1800); }
    function copy(u){ if(navigator.clipboard&&navigator.clipboard.writeText) return navigator.clipboard.writeText(u); var ta=document.createElement('textarea'); ta.value=u; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');}catch(e){} document.body.removeChild(ta); return Promise.resolve(); }
    if (sb) sb.addEventListener('click', function(){
      var d = { title: document.title, text: document.title, url: location.href };
      if (navigator.share) { navigator.share(d).catch(function(){}); }
      else { copy(location.href).then(function(){ toast('链接已复制，去分享吧'); }); }
    });
  })();
</script>
```
> 现状：`daily-reminder`、`course-planner`、主站 `index.html` 均已落地此规范；新增子 App 直接复用上面两段即可，无需重写样式。

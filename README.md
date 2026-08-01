# 滑铁卢大学工具箱 · UW Toolkit

面向滑铁卢大学学生（以研究生为主）的轻量工具集合。**纯静态站点，无后端、免登录**，部署在 GitHub Pages。

🌐 **在线地址**：`https://hairuoliu.github.io/waterloo-toolkit/`
📦 **仓库**：`https://github.com/HairuoLiu/waterloo-toolkit`

> 这是给**未来的 AI / 协作者**读的总规范文档。读完本文件，你应当能：
> 1. 知道子 App 文件夹怎么命名、怎么重命名；
> 2. 知道每个子 App 的「封面图」怎么做，且风格与现有封面**完全一致**；
> 3. 知道怎么新增一个工具、怎么部署。

---

## 0. 现有子 App（已上线）

| app-id | 名称 | 说明 |
|--------|------|------|
| `daily-reminder` | 研究生每日提醒 | 数据来自 UW 研究生重要日期。提供**月历视图**（默认）+ **列表视图**双切换；**按学年拆分**：顶部「选择学年」tab 把每个学年（Fall 入学为一年起点，如 2026–2027）切成独立日历/列表/提醒，互不混淆；日历按类别配色显示每日事件、跨天事件整段底色延续、点击日期弹出当日**中英双语**详情；类别筛选条（缴费/退课/考试/假期…）两类视图共用；另有「今日一件事」提醒文案 + 一键复制发群。 |

> **数据范围说明**：本工具只保留「今天及以后、且为 Fall 入学学年」的节点。当前校方研究生重要日期页面只发布到 **2027 年春季**（即 2026–2027 学年结束），因此现在只有 **2026–2027 学年** 一个 tab；等校方发布 2027 秋季（2027–2028 学年）后，重新抓取一次、给数据加 `academicYear` 字段，网页会**自动**多出对应学年 tab，无需改代码。
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

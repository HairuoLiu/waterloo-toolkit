# STRUCTURE.md — 滑铁卢大学工具箱 · 目录与子 App 规范

> 完整规范（命名/重命名 + 封面制作 + 部署 + 给 AI 的指引）见 **[README.md](README.md)**。
> 本文件是「目录与命名」的精简版，并与 README 互为补充。

本仓库是一个**纯静态站点**，部署在 GitHub Pages（`https://hairuoliu.github.io/waterloo-toolkit/`）。
无后端、无构建步骤。每个工具是一个独立子页面，主站 `index.html` 自动列出它们。

---

## 1. 目录结构

```
waterloo-toolkit/
├── index.html              # 主站首页：读取 apps/manifest.json 渲染工具卡片
├── STRUCTURE.md            # 本文件（子 App 规范，给 AI / 协作者读）
├── README.md               # 仓库说明
├── .nojekyll               # 禁用 Jekyll，保证子路径资源正常加载
├── assets/
│   └── style.css           # 全站共享样式（唯一一份，所有页面用相对路径引用）
└── apps/
    ├── manifest.json       # ★ 子 App 清单（首页数据源，新增工具必改）
    └── <app-id>/           # 每个工具一个文件夹
        ├── index.html      # 工具页面（必须）
        └── …               # 其余资源（js / css / 数据）自行放置
```

## 2. 子 App 文件夹命名规则

- **格式**：`apps/<app-id>/`
- **`<app-id>` 规则**：
  - 全小写 `kebab-case`（小写 + 连字符），例如 `daily-reminder`、`course-planner`
  - 只用 `a-z 0-9 -`，**不要**空格、中文、下划线、大写
  - 简短、见名知意；同一工具只能有一个 id
- 每个 `<app-id>` 文件夹**必须**含 `index.html`。
- 页面内引用共享样式用 `../../assets/style.css`（相对路径，因站点在子路径下运行）。

## 3. 如何新增一个子 App（给未来的 AI）

1. 在 `apps/` 下新建 `apps/<app-id>/`，放入 `index.html` 及所需资源。
2. 打开 `apps/manifest.json`，在数组里**追加一个对象**：

```json
{
  "id": "daily-reminder",
  "title_zh": "研究生每日提醒",
  "title_en": "Grad Daily Reminder",
  "desc_zh": "一句话说明这个工具能干什么。",
  "desc_en": "One-line description in English.",
  "icon": "📅",
  "category": "日程提醒",
  "path": "apps/daily-reminder/"
}
```

字段说明：`id`=文件夹名；`title_zh/en`=中英文标题；`desc_zh/en`=简介；
`icon`=emoji 或字符；`category`=分类标签（自由填，会显示在卡片上）；`path`=相对根的路径，以 `/` 结尾。

3. 提交并推送。主站首页会**自动**读取 manifest 渲染新卡片，无需改 `index.html`。

## 4. 封面（cover）怎么来

每个子 App 需要一张 `apps/<app-id>/cover.svg`（1200×630），**统一由 `assets/gen_cover.py` 生成**，禁止手写 SVG、禁止私自换字体/换配色。

```bash
python assets/gen_cover.py --id daily-reminder --emoji "📅" --category "日程提醒" \
  --title "研究生每日提醒" --desc "每天挑出一件最该做的事，可一键复制发群。" \
  --app-path "apps/daily-reminder"
```

- 脚本会写出 `cover.svg`，并自动在 `apps/manifest.json` 补上 `"cover"` 字段。
- `category` 决定自动配色（同类同色），详见 [README.md §3](README.md)。
- **风格红线**：只用 gen_cover.py 生成；不改其尺寸/字体/固定色；封面统一 SVG 格式；标题 ≤13 字/行、说明 ≤26 字/行。

## 5. 约定

- **链接一律用相对路径**，不要写以 `/` 开头的绝对路径（GitHub Pages 子路径会失效）。
- 共享样式只放 `assets/style.css` 一份，不要各 App 重复拷贝。
- 数据可内嵌为 `window.XXX = [...]` 的 `.js` 文件，避免 `fetch` 本地文件的限制。
- 类别色块（缴费/选课/考试/假期…）样式见 `assets/style.css` 的 `.cat-*` 规则，可扩展。
- 所有页面顶部保留“← 滑铁卢工具箱”返回链接，指向 `../../index.html`。

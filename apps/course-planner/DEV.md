# DEV.md — 技术栈与实现说明

> 给开发者 / 协作者读。本文件单独放技术栈，使用说明见同目录 [README.md](README.md)。

## 技术栈

| 维度 | 选型 |
|------|------|
| 语言 | 原生 HTML5 + CSS3 + JavaScript（ES2020） |
| 框架 | **无**（Vanilla JS） |
| 构建 | **无**（单文件，直接交付） |
| 后端 | **无**（纯静态，GitHub Pages 托管） |
| 依赖 | **无第三方依赖**（无 npm、无 CDN） |
| 数据存储 | 数据内嵌在 `<script>` 里（无 `fetch`、无外部 API） |

**为什么这样选**：工具箱是纯静态 GitHub Pages 站点、无后端；单文件 + 内嵌数据的形态能保证「双击即开、零部署、易进 git、易 fork」，也最利于开源协作。

## 文件结构

```
apps/course-planner/
├── index.html   # 全部内容（结构 + 内联样式 + 内联脚本 + 内嵌数据）
├── cover.svg    # 由仓库 assets/gen_cover.py 生成（禁止手写）
├── README.md    # 使用说明 + 参考资料（面向用户）
└── DEV.md       # 本文件（技术栈，面向开发者）
```

> 当前为**单文件**形态：HTML 结构、`<style>` 内联 CSS、`<script>` 内联 JS 与数据都在这一个 `index.html` 里。如需拆分，可把数据对象抽到 `data.js`、逻辑抽到 `app.js`（保持 `<script src>` 相对路径即可，数据与函数均为顶层声明，后续脚本可直接引用）。

## 数据结构（内嵌在 index.html 的 `<script>` 中）

| 变量 | 含义 |
|------|------|
| `C` | 课程库（约 107 门）。每门字段：`n` 英文名、`zh` 中文名、`g` 分组、`d` 难度(1-5)、`t` 开课学期+教授、`tag` 标签数组、`desc` 内容、`proj` 项目/考核、`pre` 先修、`why` 为什么值得上、`alt` 替代课、`builds` 铺垫了什么、`needs` 需要什么、`for` 最适合谁、`ext` 占外系名额、`consent` 需教授同意、`warn` 警告。 |
| `PLANS` | 4 套方案。每套：`id`/`name`/`sub`/`lead`/`stats`/`terms`（学期时间轴，含 `k:'study'\|'work'`）/`win`/`risk`/`swap`/`fit`。 |
| `FRONTIER` / `NEWCOURSES` | 首页「最前沿」与「今年新课」卡片列表（引用 `C` 中的课号）。 |
| `MAP` | 课程地图：方向 → 基础/核心/进阶三层 → 课号（引用 `C`）。 |

## 路由

基于 `location.hash` 的极简前端路由，**无路由库**：

- `#/` 首页（4 张方案入口卡 + 搜索框 + 底部入口）
- `#/plan/A` `~` `#/plan/D` 方案详情
- `#/courses` 课程库（类别折叠 + 实时搜索）
- `#/coop` Co-op 规则
- `#/map` 课程地图
- `#/new` 今年新课 / 最前沿

`route()` 读取 `location.hash` 渲染 `#view`；所有内部跳转用相对 hash，天然兼容 GitHub Pages 子路径 `/waterloo-toolkit/`。

## 交互

- **详情抽屉（drawer）**：点任意课号 → `openD(code)` 打开固定定位的抽屉，展示完整字段与「同方向还有」推荐；`closeD()` 关闭。
- **渐进披露**：首页只露入口，详情藏在抽屉/二级视图里，降低首屏认知负荷（经 PM / UI / 行为策划三方评审后采用）。

## 样式

- CSS 自定义属性集中在 `:root`：墨色 `--ink` + 一支蓝 `--blue`（主色）+ 琥珀 `--amber`（仅用于警告），圆角统一 `--r:8px`。
- 字号收为 5 档（`--s1`~`--s5`）；导航无 emoji；难度改用文字（偏难/适中）而非彩色圆点，降低视觉噪音。
- 响应式：移动端单列、桌面多列卡片栅格。

## 本地校验方式

```bash
# 1) JS 语法
node --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d')

# 2) 运行时渲染全部视图（DOM stub + eval，确认无悬空课号、各视图不抛错）
#    见交付时的校验脚本：遍历 '' '#/plan/A'..'D' '#/courses' '#/coop' '#/map' '#/new' 调用 route()
```

校验要点：课程库数量、方案引用的课号必须全部存在于 `C`、课程地图引用的课号无缺失、详情抽屉的关系字段正常渲染。

## 如何修改

- **增删课程**：改 `C` 对象（注意补齐 `builds/needs/for/ext/consent` 等关系字段）。
- **调整方案**：改 `PLANS`（学期用 `k:'study'|'work'`；`swap` 写「选不上怎么办」）。
- **调整地图**：改 `MAP` 的方向 / 层级 / 课号。
- **上架 / 改封面**：见仓库根 `README.md` 与 `STRUCTURE.md`；`cover.svg` 必须且只能由 `assets/gen_cover.py` 生成。

## 上线

推送到 `master` 即生效（GitHub Pages 源 = `master` / `/`）。本 App 不改动主站 `index.html`、`assets/style.css` 与别人的 manifest 条目。

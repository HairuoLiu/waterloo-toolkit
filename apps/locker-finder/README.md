# UW 储物柜地图 · 使用说明与资料

> 一句话用法：**先按类别筛选，再看离你最近的那个能不能自带挂锁** —— 免费柜首选 EIT 2 楼（Science 免费柜），没有就去「隐藏柜子」挖。

---

## 一、核心概要

在**真实地图**上标出滑铁卢大学全校储物柜的位置与规则。

- **给谁**：需要在校内放书 / 电脑 / 实验用品的研究生（尤其 ECE，主楼是 EIT）。
- **解决什么**：储物柜信息散落在各院系页面，且「免费 / 租赁 / 日租」「能否自带挂锁」「谁来管」往往要问人才知道；本工具把它们标在同一张地图上。
- **怎么用一句话**：筛选类别 → 看地图找最近的 → 点开看价格、租期、是否需自带挂锁、找谁申请 → 按 `apply_url` 去登记。

**数据快照**：2026-08-27（价格与空位会变，务必以管理方最新通知为准）。

---

## 二、怎么用

| 功能 | 用法 |
|------|------|
| **地图 / 列表双视图** | `setView` 切换；地图用 Leaflet + OpenStreetMap 真实底图 |
| **类别筛选** | 免费 / 租赁 / 日租（`cat`） |
| **租期筛选** | 学期 / 日租（`term`） |
| **是否可自带挂锁** | 详情里的 `ownLock` 字段 |
| **点标记 / 点卡片看详情** | 楼栋全称、楼层、管理方（`provider`）、适用人群（`who`）、价格、备注（`notes_zh`） |
| **直接申请** | 详情里的 `apply_url` 跳到官方登记页 |
| **推荐度** | `recommend`：`best`（首选）/ `good`（推荐）/ `fallback`（备选） |
| 正文 ③ 首选方案 | EIT 2 楼 Science 免费柜的具体走法 |
| 正文 ④ 隐藏柜子 | 官方清单外怎么找（问系办、看楼梯间、研究生办公室） |
| 排查清单 / 咨询对象 | 找不到柜子时的下一步动作与可发邮件的联系人 |

---

## 三、怎么设计

**文件清单**

| 文件 | 职责 |
|------|------|
| `index.html` | 页面骨架：地图容器、筛选条、列表容器、详情弹层、正文说明段 |
| `app.js` | 地图初始化、标记渲染、列表渲染、筛选、详情弹层、视图切换 |
| `data.js` | `window.LOCKERS`：储物柜数据集（内联，避免 fetch 限制） |
| `cover.svg` | 封面（`assets/gen_cover.py` 生成） |

**数据结构**（`data.js`）
```js
window.LOCKERS = [
  {
    id: "science-eit",                       // 唯一 id，与地图 marker 对应
    name_zh: "Science 免费柜 · EIT 2 楼",
    name_en: "Science Free Locker — EIT 2nd floor",
    building: "EIT",
    building_full: "Engineering Innovation Centre（ECE 主楼）",
    cat: "免费",                              // 免费 / 租赁 / 日租
    term: "学期",                             // 学期 / 日租
    price: "免费（一学期）",
    price_en: "Free (per term)",
    ownLock: true,                            // 是否需自带挂锁
    provider: "管理方",
    who: "适用人群 / 资格",
    floor: "2 楼",
    coord: [43.4723, -80.5449],               // ★ [lat, lng] 真实地理坐标
    apply_url: "https://…",                   // 申请 / 登记网址
    apply_text: "申请方式（中文简述）",
    recommend: "best",                        // best / good / fallback
    notes_zh: "备注（资格风险等）",
    notes_en: "Notes (eligibility risks, etc.)"
  }
];
```

**关键函数**（`app.js`）

| 函数 | 作用 |
|------|------|
| `initMap` | 初始化 Leaflet 地图与 OSM 瓦片 |
| `renderChips` / `matches` | 筛选条渲染与匹配 |
| `renderMarkers` / `popupHtml` | 地图标记与气泡 |
| `renderList` | 列表视图 |
| `openDetail` / `closeDetail` | 详情弹层 |
| `setView` | 地图 / 列表视图切换 |
| `catClass` | 类别配色 |
| `esc` | 转义防 XSS |

**外部依赖**：**Leaflet + OpenStreetMap 瓦片（CDN）** —— 这是本工具唯一的外链依赖，离线时地图瓦片会白屏，但列表与筛选仍可用。

**样式**：`../../assets/style.css` + Leaflet 自带 CSS。

---

## 四、怎么改

| 想改什么 | 动哪里 | 改完怎么验证 |
|---|---|---|
| 加 / 改一个柜子 | `data.js` 的 `LOCKERS` | 地图出现新标记、列表出现新卡片 |
| 柜子位置标错 | 改 `coord`（`[lat, lng]`，**注意顺序**） | 地图上标记落到正确楼栋 |
| 加一个筛选维度 | `app.js` 的 `renderChips` + `matches` | 筛选后地图标记与列表条数一致 |
| 改价格 / 租期 | `data.js` 的 `price` / `price_en` / `term` | 详情弹层中英文都更新（**改一处必须改两处**） |
| 改地图底图 / 初始缩放 | `app.js` 的 `initMap` | 打开页面确认视野覆盖校园 |
| 改推荐度逻辑 | `data.js` 的 `recommend` 字段 | 卡片徽章显示 best / good / fallback |

> 改了行为 / 数据 / 结构 ⇒ **同一次提交必须更新本文件**（见根 `README.md` 的 R2）。

---

## 五、事实红线

- 坐标、价格、租期、管理方、申请网址**一律照抄来源，绝不编造**；不确定的写「待确认」。
- `notes_zh` / `notes_en` 里的**资格风险**必须保留（比如「仅限 Science 学院」「研究生可能不适用」）。
- 中文字段与英文字段**必须成对维护**，缺一语言视为缺陷。
- 数据快照日期（2026-08-27）必须可见；价格与空位**以管理方最新通知为准**。

---

## 六、参考资料

1. UW 校园地图 — `https://uwaterloo.ca/map/`
2. 各楼栋 / 院系储物柜申请页：见 `data.js` 每条的 `apply_url`
3. Leaflet — `https://leafletjs.com/` · OpenStreetMap — `https://www.openstreetmap.org/`

> 最后整理：2026-09-14。数据快照 2026-08-27。

---

## 七、双语架构（默认英文 · 右上角切中文）

站点已全站双语：默认**英文**，右上角按钮切到**中文**（状态存 `localStorage['uw-lang']`，也支持 `?lang=zh` 深链）。

| 层 | 本 App 的做法 |
|---|---|
| 运行时 | `assets/i18n.js` → `window.UW_I18N`（`get/set/t/pick/apply/onChange/mountToggle`） |
| 界面串 | `assets/i18n/locker-finder.js` 挂 `window.UW_DICT['locker-finder'] = { en:{...}, zh:{...} }`，HTML 用 `data-i18n` / `data-i18n-attr` |
| 长文正文 | `lang="zh"` / `lang="en"` 并列块 + `assets/i18n.css` 的 `html[data-lang="en"] [lang="zh"]{display:none}` 切换 |
| 数据层 | 并列双语字段；取值顺序 **当前语言 → 无后缀原字段 → 另一语言**（写反会让中文模式显示英文） |

**改文案动哪里**：界面短句 → 改 `assets/i18n/locker-finder.js` 的 `en` / `zh` 两段（**必须成对**，缺一语言即视为缺陷）；长段正文 → 改 HTML 里对应 `lang="en"` / `lang="zh"` 块。

**改完怎么验证**（推送前必跑）：
```bash
export NODE_PATH=C:/Users/h/.workbuddy/binaries/node/workspace/node_modules
I18N_ROOT=<仓库根目录>/ node i18n-work/_leak_check.js _repo/apps/locker-finder locker-finder en   # en 模式可见区域必须零中文
I18N_ROOT=<仓库根目录>/ node i18n-work/_leak_check.js _repo/apps/locker-finder locker-finder zh   # zh 模式不得残留英文界面文案
```

**本 App 特点**：数据层 `data.js` 的 11 条储物柜记录用 `*_en` 并列字段（名称 / 类别 / 租期 / 价格 / 备注），`app.js` 按当前语言取值；界面串走 `assets/i18n/locker-finder.js`。新增一条柜子记录时，**中英字段必须成对填写**。

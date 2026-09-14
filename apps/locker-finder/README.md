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

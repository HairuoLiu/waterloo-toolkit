# Goose Glance 职位洞察 · 使用说明与资料

> 一句话用法：**先在 Chrome 商店装扩展，再打开 Waterloo Works 岗位页** —— 它会在页面里直接生成一张「洞察卡」，不用复制粘贴、不上传数据。

---

## 一、核心概要

一个**第三方 Chrome 扩展（MIT 开源，非 UW 官方）**的落地页。

- **给谁**：用 Waterloo Works 找 co-op / 实习的滑铁卢学生（尤其岗位描述长、信息密度高的技术岗）。
- **解决什么**：Waterloo Works 的岗位描述动辄上千字，关键信息（时长、地点、身份要求、材料）埋在正文里；本扩展用**浏览器内 AI** 把它压成一张卡。
- **怎么用一句话**：安装扩展 → 打开岗位页 → 看洞察卡决定要不要投。

**洞察卡字段**
- AI 职位名（把花哨标题还原成真实岗位）
- 1–3 条关键职责
- 实习时长
- 工作地点 + 远程 / 混合 / 现场
- 所需技术 / 语言 / 框架 / 软技能
- 特殊要求：法语 / 驾照 / 背调 / 公民身份 / 海外工签 / 证书
- 需要提前准备的材料

---

## 二、怎么用

1. **安装扩展**（Chrome 网上应用店）
   `https://chromewebstore.google.com/detail/goose-glance-for-waterloo/hblfffccmiegiahkolkendnfkaegogjg`
2. 打开 **Waterloo Works** 的任一岗位详情页（`https://waterlooworks.uwaterloo.ca/`）。
3. 扩展在页面内注入洞察卡；首次使用需**下载一次模型**（WebLLM，浏览器内推理）。
4. 按卡上的「特殊要求 / 需备材料」决定投不投、以及先补什么。

**隐私**：推理**完全在浏览器本地**进行（WebLLM），岗位文本**不上传**到任何服务器。

---

## 三、怎么设计

本目录**只有一个落地面**（`index.html`），扩展本体在外部仓库：

| 文件 | 职责 |
|------|------|
| `index.html` | 落地页：这是什么、隐私说明、洞察卡字段列表、安装与源码两个出口按钮、顶栏与分享 |
| `cover.svg` | 封面（`assets/gen_cover.py` 生成） |

**上游仓库**：`https://github.com/lacser/Goose-Glance-for-WaterlooWorks`（MIT）

**依赖**：无第三方库、无 CDN；样式来自 `../../assets/style.css`。

> 这是全站**唯一一个「外链型」子 App**：功能不在本站，本站只负责讲清它是什么、怎么用、安不安全。新增同类 App 时请沿用这个形态（说明页 + 安装出口 + 源码出口）。

---

## 四、怎么改

| 想改什么 | 动哪里 | 改完怎么验证 |
|---|---|---|
| 更新安装链接 / 源码链接 | `index.html` 的两个按钮 `href` | 点击能正确跳转 |
| 更新洞察卡字段说明 | `index.html` 字段列表 | 与扩展实际输出一致 |
| 扩展功能本身 | **不在本仓库**，去上游仓库改 | — |
| 改封面 | `python assets/gen_cover.py …`（禁止手改 SVG） | 首页卡片缩略图更新 |

> 改了行为 / 数据 / 结构 ⇒ **同一次提交必须更新本文件**（见根 `README.md` 的 R2）。

---

## 五、事实红线

- 必须持续标注其为**第三方、MIT、非 UW 官方**作品，不得暗示是学校出品。
- 「不上传数据 / 浏览器内推理」等隐私声明**必须与上游实现一致**；上游若改为云端推理，本页必须同步更正。
- 链接以**上游仓库与商店页**为准，不臆造功能。

---

## 六、参考资料

1. Chrome 网上应用店 — `https://chromewebstore.google.com/detail/goose-glance-for-waterloo/hblfffccmiegiahkolkendnfkaegogjg`
2. 上游仓库（MIT） — `https://github.com/lacser/Goose-Glance-for-WaterlooWorks`
3. WaterlooWorks — `https://waterlooworks.uwaterloo.ca/`

> 最后整理：2026-09-14。

---

## 七、双语架构（默认英文 · 右上角切中文）

站点已全站双语：默认**英文**，右上角按钮切到**中文**（状态存 `localStorage['uw-lang']`，也支持 `?lang=zh` 深链）。

| 层 | 本 App 的做法 |
|---|---|
| 运行时 | `assets/i18n.js` → `window.UW_I18N`（`get/set/t/pick/apply/onChange/mountToggle`） |
| 界面串 | `assets/i18n/goose-glance.js` 挂 `window.UW_DICT['goose-glance'] = { en:{...}, zh:{...} }`，HTML 用 `data-i18n` / `data-i18n-attr` |
| 长文正文 | `lang="zh"` / `lang="en"` 并列块 + `assets/i18n.css` 的 `html[data-lang="en"] [lang="zh"]{display:none}` 切换 |
| 数据层 | 并列双语字段；取值顺序 **当前语言 → 无后缀原字段 → 另一语言**（写反会让中文模式显示英文） |

**改文案动哪里**：界面短句 → 改 `assets/i18n/goose-glance.js` 的 `en` / `zh` 两段（**必须成对**，缺一语言即视为缺陷）；长段正文 → 改 HTML 里对应 `lang="en"` / `lang="zh"` 块。

**改完怎么验证**（推送前必跑）：
```bash
export NODE_PATH=C:/Users/h/.workbuddy/binaries/node/workspace/node_modules
I18N_ROOT=<仓库根目录>/ node i18n-work/_leak_check.js _repo/apps/goose-glance goose-glance en   # en 模式可见区域必须零中文
I18N_ROOT=<仓库根目录>/ node i18n-work/_leak_check.js _repo/apps/goose-glance goose-glance zh   # zh 模式不得残留英文界面文案
```

**本 App 特点**：单文件页面（`index.html` 自带样式与脚本），无独立 data.js；文案全部走 `assets/i18n/goose-glance.js` 与 HTML 内联双语块。改英文只需动这两处，不需要碰逻辑。

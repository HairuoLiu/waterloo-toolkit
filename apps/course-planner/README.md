# ECE 选课导航 · 使用说明与资料

面向**滑铁卢大学 ECE MEng（授课型硕士，含 Co-op）**学生的选课规划工具。纯静态网页，打开即用，无需登录、无后端。

> 一句话用法：**先选路线，再选课**——从 4 套方案里挑一套，按它排好的学期时间轴选课；不确定的课点开看详情；想自己挑就去课程库或课程地图。

---

## 一、如何使用

### 1. 首页（入口）
- 顶部一句主张 + **4 张方案入口卡**（点进去看整套排课）。
- 一个课程库搜索框（默认露热门 5 门）。
- 底部两个入口：**今年新课 / 最前沿**、**Co-op 规则**。

### 2. 四套方案（`#/plan/A~D`）
| 方案 | 定位 | 时长 | Co-op |
|------|------|------|-------|
| A · AI 认证线 | 8 门全 ECE，冲 AI&ML 官方认证 | 5 学期 | 1 个 |
| B · LLM 前沿快线 | 最快毕业 + 最新 LLM 课 | 4 学期（16 月） | W2027 |
| C · 系统硬核·双 Co-op | 两个连续 work term | 5 学期 | 2 个 |
| D · 产品创业双认证 | 5 ECE + 4 BE，双认证 | 5 学期 | 1 个 |

进入任一方案后看：学期时间轴、强项 / 风险 / **选不上怎么办（备选路径）**、适合谁。

### 3. 课程库（`#/courses`）
- 按类别折叠（ECE·AI / 软件 / 系统 / 视觉 / 项目、CS、SYDE、统计、商科…），输入实时筛选。
- 点任意**课号**弹详情抽屉：难度、开课学期+教授、内容、项目/考核、先修、**为什么值得上**、**替代课**、以及关系字段（**铺垫了什么 / 需要什么 / 最适合谁**）、是否占外系名额 / 是否需教授同意。

### 4. 课程地图（`#/map`）
从 high-level 到 low-level：6 大方向（AI&ML / 软件 / 系统网络 / 控制·机器人 / 视觉·影像 / 产品创业）→ 每方向「基础 → 核心 → 进阶」三层 → 单门课。顺着点下去就是详情。

### 5. Co-op 规则（`#/coop`）
讲清相互关系：**最后一学期必须上课**，所以排课被锁成「上课 → 实习 → 回来再上一学期」；两段实习要连续且同雇主；WIL 601 在首个 work term 前必修（不计入 8 门）。

### 6. 关于「需教授同意」的课
标了「需教授同意」的课通常有三条路：
- **Instructor consent**：教授签 Add form 出 permission number（CS 886 专题、CS 854 等，位置先到先得，建议尽早发邮件）。
- **Special topics / 教授开题**：ECE 700/720/750/780 等容器课号，可向你感兴趣的教授提议新专题。
- **OVGS 安省校际互修**：跨校选研究生课，最多 2 门，需 ≥75%。

> 注册前所有学期/教授以 **Quest** 实时为准；方案 D 的 BE 名单需书面问 ECE Graduate Office 确认。

---

## 二、技术栈概览

本工具是一个**单文件纯静态网页**：原生 HTML + 内联 CSS + 内联 JS，无框架、无打包、无后端、无第三方依赖，数据全部内嵌在页面里。直接双击 `index.html` 即可运行。

完整的实现细节、数据结构、路由与样式设计，见同目录的 **[DEV.md](DEV.md)**。

---

## 三、参考资料与来源（References）

课程代码、开课学期与规则均来自以下公开资料交叉核对（最后整理 2026-08-01）。注册前所有信息以 **Quest** 实时为准。

### 学位与 Co-op 规则（核心依据）
1. **ECE MEng Co-op 项目页** — 8 门课 / ≥5 ECE / 外系 ≤3 / WIL 601 / 最后一学期须为 study term
   `https://uwaterloo.ca/electrical-computer-engineering/master-engineering-meng-co-op`
2. **MEng Co-op Program Reminders（Spring 2026）** — 含 Business Leadership 最多 4 门 BE/BET 的精确表述、最后一学期约束
   `https://uwaterloo.ca/electrical-computer-engineering/welcome-spring-2026-important-meng-co-op-program-reminders`
3. **ECE Graduate Studies · Programs**
   `https://uwaterloo.ca/electrical-computer-engineering/graduate-studies/future-students/programs`
4. **University of Waterloo Academic Calendar**（学位与课程目录）
   `https://ucalendar.uwaterloo.ca/`

### 开课目录（课号 / 学期 / 教授）
5. **ECE 研究生开课表**（含 tentative future offerings 与各学期 archive；657D Creager、757A、752 等均见于此）
   `https://uwaterloo.ca/electrical-computer-engineering/graduate-studies/current-students/courses/`
6. **Cheriton School of Computer Science 研究生开课表**（Fall / Winter / Spring；CS 854、886 专题、885 等）
   `https://cs.uwaterloo.ca/current-graduate-students/courses/current-course-offerings/fall-2026`
7. **Systems Design Engineering 开课表**（Fall / Spring；SYDE 671/672/675 等）
   `https://uwaterloo.ca/systems-design-engineering/node/354` · `https://uwaterloo.ca/systems-design-engineering/node/353`
8. **Management Sciences（MSCI）研究生课程**（MSCI 630/638/720 等）
   `https://uwaterloo.ca/management-sciences/`

### 已核实的关键更正
上一版称「ECE 657D（深度学习）W2027 不开」有误——**657D 在 W2027 / W2028 均开，Elliot Creager 教**（见来源 5 的 W2026 表）。

### 顾问复核补全
课程库经 ECE 选课顾问复核，从 57 门扩至 **107 门**，补齐了控制 / 自主 / 机器人线（ECE 682/686/687/780 T13）、强化学习（CS 885）、special topics 与跨院系研究生课；并新增「课程地图」视图与每门课的「关系」字段。

> ⚠️ 本页为信息聚合，所有开课容量、学期、教授均为基于官方历史数据的推断，**注册前请以 Quest 实时数据为准**；部分 special topics 专题编号（如 ECE 780 T13）与跨院系开课学期以 Quest / 对应院系当学期通知为准。

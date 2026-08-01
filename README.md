# 滑铁卢大学工具箱 · UW Toolkit

面向滑铁卢大学学生（以研究生为主）的轻量工具集合。纯静态站点，无后端、免登录，部署在 GitHub Pages。

🌐 在线地址：`https://<user>.github.io/waterloo-toolkit/`

## 现有工具

- **研究生每日提醒**（`apps/daily-reminder/`）：每天挑出一件最该做的事，带行动建议，可一键复制发群。数据来自 [University of Waterloo 研究生重要日期](https://uwaterloo.ca/important-dates/graduate)。

## 本地预览

```bash
cd waterloo-toolkit
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

> 直接双击 `index.html` 打开会因 `fetch` 本地文件受限而无法加载清单，请用本地服务器预览。

## 新增工具

见 [STRUCTURE.md](STRUCTURE.md)。

## 部署

推送到 `main` 分支后，在仓库 **Settings → Pages** 选择 `main` 分支、`/`（root）作为源即可。
（已含 `.nojekyll`，禁用 Jekyll。）

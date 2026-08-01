#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_cover.py — 滑铁卢大学工具箱「子 App 封面」统一生成器
======================================================

为什么用它：
    所有子 App 的封面(cover.svg)都由本脚本生成，保证**尺寸、配色、字体、
    版式完全一致**。未来任何 AI / 协作者新增或修改工具封面时，只改参数、跑本
    脚本，不要手写 SVG，也不要换字体/换配色——这样整站封面风格才统一。

尺寸：1200 x 630（Open Graph / 社交分享标准尺寸，也适合做卡片缩略图）

用法：
    python assets/gen_cover.py \
        --id daily-reminder \
        --emoji "📅" \
        --category "日程提醒" \
        --title "研究生每日提醒" \
        --desc "每天挑出一件最该做的事，带行动建议，可一键复制发群。" \
        --app-path "apps/daily-reminder"

可选：
    --accent "#d11610"    不传则按 category 自动取色（见 PALETTE）
    --out "apps/<id>/cover.svg"   默认自动推断

效果：
    1) 写出 apps/<id>/cover.svg
    2) 在 apps/manifest.json 的对应条目补上 "cover": "apps/<id>/cover.svg"

设计槽位（未来 AI 照填即可）：
    emoji    工具图标（一个 emoji，显示在左上角圆角徽章里）
    category 分类标签（显示在图标右侧小药丸）
    title    工具中文标题（最多 2 行，每行 ≤13 字）
    desc     一句话说明（最多 3 行，每行 ≤26 字）
    accent   主题色（决定徽章/药丸/装饰图形颜色）
    app-path 工具在站内的路径（显示在底部，便于一眼定位）
"""

import argparse
import json
import os
import sys
from pathlib import Path

# ---------- 调色板：category -> accent（保证同类工具同色） ----------
PALETTE = {
    "日程提醒": "#d11610",   # UW Red
    "选课":     "#2563eb",
    "课程":     "#2563eb",
    "考试":     "#6b46c1",
    "成绩":     "#344675",
    "毕业":     "#b9770e",
    "求职":     "#b83280",
    "co-op":    "#b83280",
    "Co-op":    "#b83280",
    "财务":     "#c0392b",
    "缴费":     "#c0392b",
    "生活":     "#1f8a4c",
    "通用":     "#2b6cb0",
}
DEFAULT_ACCENT = "#2b6cb0"

# 全站固定色（与 assets/style.css 保持一致）
INK    = "#1f2430"
MUTED  = "#6b7280"
LINE   = "#e6e8ef"
BG     = "#f6f7fb"
BRAND  = "#d11610"

W, H = 1200, 630


def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def wrap(text: str, per: int, max_lines: int):
    """按字符数折行（中文友好）。超出 max_lines 用 … 截断。"""
    lines, cur = [], ""
    for ch in text:
        cur += ch
        if len(cur) >= per:
            lines.append(cur)
            cur = ""
            if len(lines) >= max_lines:
                break
    if cur and len(lines) < max_lines:
        lines.append(cur)
    if len(text) > per * max_lines:
        # 截断最后一行
        lines[-1] = lines[-1][:per].rstrip() + "…"
    return lines


def build_svg(emoji, category, title, desc, accent, app_path):
    title_lines = wrap(title, 13, 2)
    desc_lines = wrap(desc, 26, 3)

    # 图标徽章
    badge = f'''
  <rect x="60" y="150" width="130" height="130" rx="30" fill="url(#accGrad)"/>
  <text x="125" y="218" font-size="76" text-anchor="middle" dominant-baseline="central">{esc(emoji)}</text>'''

    # 分类药丸
    pill_w = 36 + len(category) * 26
    pill = f'''
  <rect x="218" y="172" width="{pill_w}" height="46" rx="23" fill="{accent}" opacity="0.12"/>
  <text x="{218 + pill_w/2}" y="200" font-size="23" font-weight="600" fill="{accent}" text-anchor="middle" dominant-baseline="central">{esc(category)}</text>'''

    # 标题
    title_svg = ""
    ty = 340
    for ln in title_lines:
        title_svg += f'\n  <text x="60" y="{ty}" font-size="58" font-weight="800" fill="{INK}">{esc(ln)}</text>'
        ty += 72

    # 描述
    desc_svg = ""
    dy = ty + 30
    for ln in desc_lines:
        desc_svg += f'\n  <text x="60" y="{dy}" font-size="27" fill="{MUTED}">{esc(ln)}</text>'
        dy += 42

    # 右侧装饰：大圆 + 模拟小卡片，制造"图文并茂"质感（固定安全坐标，不依赖文字高度）
    decor = f'''
  <circle cx="1075" cy="120" r="170" fill="{accent}" opacity="0.10"/>
  <circle cx="1130" cy="250" r="70" fill="{accent}" opacity="0.08"/>
  <rect x="930" y="372" width="240" height="150" rx="16" fill="#ffffff" stroke="{LINE}"/>
  <rect x="952" y="402" width="150" height="14" rx="7" fill="{accent}" opacity="0.45"/>
  <rect x="952" y="430" width="196" height="14" rx="7" fill="{LINE}"/>
  <rect x="952" y="458" width="120" height="14" rx="7" fill="{LINE}"/>'''

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif">
  <defs>
    <linearGradient id="accGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{accent}"/>
      <stop offset="100%" stop-color="{accent}" stop-opacity="0.82"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="2" fill="{LINE}"/>
    </pattern>
  </defs>

  <!-- 背景 -->
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <rect width="{W}" height="{H}" fill="url(#dots)" opacity="0.5"/>

  <!-- 顶部 kicker -->
  <text x="62" y="74" font-size="20" font-weight="700" letter-spacing="2" fill="{BRAND}">UW TOOLKIT</text>

  <!-- 图标 + 分类 -->
{badge}
{pill}

  <!-- 标题 -->
{title_svg}

  <!-- 描述 -->
{desc_svg}

  <!-- 右侧装饰 -->
{decor}

  <!-- 底栏 -->
  <line x1="60" y1="572" x2="1140" y2="572" stroke="{LINE}"/>
  <text x="60" y="610" font-size="22" font-weight="700" fill="{INK}">🎓 滑铁卢大学工具箱</text>
  <text x="1140" y="610" font-size="19" fill="{MUTED}" text-anchor="end" font-family="monospace">waterloo-toolkit/{esc(app_path.replace('apps/', ''))}</text>
</svg>
'''
    return svg


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", required=True)
    ap.add_argument("--emoji", required=True)
    ap.add_argument("--category", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--desc", required=True)
    ap.add_argument("--app-path", required=True)
    ap.add_argument("--accent", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    root = Path(__file__).resolve().parent.parent
    accent = args.accent or PALETTE.get(args.category, DEFAULT_ACCENT)

    out = Path(args.out) if args.out else root / "apps" / args.id / "cover.svg"
    out.parent.mkdir(parents=True, exist_ok=True)

    svg = build_svg(args.emoji, args.category, args.title, args.desc, accent, args.app_path)
    out.write_text(svg, encoding="utf-8")
    print(f"[ok] 封面已写出: {out}  (accent={accent})")

    # 补 manifest 的 cover 字段
    manifest = root / "apps" / "manifest.json"
    if manifest.exists():
        apps = json.loads(manifest.read_text(encoding="utf-8"))
        cover_rel = f"apps/{args.id}/cover.svg"
        found = False
        for a in apps:
            if a.get("id") == args.id:
                a["cover"] = cover_rel
                found = True
                break
        if not found:
            print(f"[warn] manifest 中未找到 id={args.id}，未自动补 cover；请手动加。")
        else:
            manifest.write_text(json.dumps(apps, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"[ok] 已更新 manifest: cover = {cover_rel}")
    else:
        print(f"[warn] 未找到 {manifest}，跳过 manifest 更新。")


if __name__ == "__main__":
    main()

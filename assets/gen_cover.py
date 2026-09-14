#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_cover.py — 滑铁卢大学工具箱「子 App 封面」统一生成器（语言中立版）
==============================================================

为什么用它：
    所有子 App 的封面(cover.svg)都由本脚本生成，保证**尺寸、配色、字体、
    版式完全一致**。未来任何 AI / 协作者新增或修改工具封面时，只改参数、跑本
    脚本，不要手写 SVG，也不要换字体/换配色——这样整站封面风格才统一。

语言中立化（本次改造核心）：
    原脚本会把中文标题/分类/说明直接画进 SVG。双语化后，封面作为静态图片
    无法随页面切换语言，因此本版本要求**文案一律英文（或纯图形）**：
      * 顶部 kicker 固定为 "UW TOOLKIT"（英文品牌，原已英文）
      * 图标：保留 emoji 作为图形表达（不承载语言）
      * 分类药丸：短英文标签（如 Onboarding / Courses / Living）
      * 标题 / 说明：英文短句，保持原折行约束
      * 底栏品牌：改为 "🎓 UW Toolkit"（"滑铁卢大学工具箱" 的官方英文译名）
    视觉规范（尺寸 1200×630、配色、圆角、字体、布局节奏）与原脚本完全一致。

尺寸：1200 x 630（Open Graph / 社交分享标准尺寸，也适合做卡片缩略图）

用法（单张）：
    python assets/gen_cover.py \
        --id daily-reminder \
        --emoji "📅" \
        --category "Reminders" \
        --title "Grad Daily Reminder" \
        --desc "One thing that matters most each day, with an action tip." \
        --app-path "apps/daily-reminder" \
        --accent "#d11610"

批量（一次生成 6 张内置封面，文案已英文化）：
    python assets/gen_cover.py --all

可选：
    --accent "#d11610"    不传则按 category 自动取色（见 PALETTE）
    --pill-text "#b9770e" 药丸文字颜色（默认等于 accent；浅色 accent 时可指定更深的文字色）
    --out "apps/<id>/cover.svg"   默认自动推断
    --footer "🎓 UW Toolkit"      底栏品牌文案（默认英文，语言中立）

效果：
    1) 写出 apps/<id>/cover.svg
    2) 若根目录存在 apps/manifest.json，则在对应条目补上 "cover" 字段
       （本目录没有 manifest 时会自动跳过，不会改动任何 _repo 文件）

设计槽位（未来 AI 照填即可）：
    emoji    工具图标（一个 emoji，显示在左上角圆角徽章里）
    category 分类标签（英文短词，显示在图标右侧小药丸）
    title    工具英文标题（最多 2 行，每行 ≤13 字）
    desc     一句话英文说明（最多 3 行，每行 ≤26 字）
    accent   主题色（决定徽章/药丸/装饰图形颜色）
    app-path 工具在站内的路径（显示在底部，便于一眼定位）
"""

import argparse
import json
import os
import sys
from pathlib import Path

# ---------- 调色板：category -> accent（保证同类工具同色） ----------
# 同时保留中文旧键（兼容旧调用）与英文新键。
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
    # ---- 英文分类键（语言中立版） ----
    "Reminders": "#d11610",
    "Onboarding": "#EAAB00",
    "Courses":   "#2563eb",
    "Living":    "#1f8a4c",
    "Careers":   "#b83280",
    "General":   "#2b6cb0",
}
DEFAULT_ACCENT = "#2b6cb0"

# 全站固定色（与 assets/style.css 保持一致）
INK    = "#1f2430"
MUTED  = "#6b7280"
LINE   = "#e6e8ef"
BG     = "#f6f7fb"
BRAND  = "#d11610"

W, H = 1200, 630

# 底栏品牌（语言中立：英文官方译名，替代原中文「滑铁卢大学工具箱」）
DEFAULT_FOOTER = "🎓 UW Toolkit"


def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def is_cjk(ch: str) -> bool:
    """粗略判断是否为中日韩全角字符（CJK 统一表意文字及其常见扩展/标点）。"""
    o = ord(ch)
    return (
        0x2E80 <= o <= 0x9FFF      # CJK  radicals / 统一表意文字
        or 0x3000 <= o <= 0x303F   # CJK 符号与标点
        or 0xFF00 <= o <= 0xFFEF   # 全角字符
        or 0x3400 <= o <= 0x4DBF   # 扩展 A
    )


def pill_width(text: str, base: int = 36, per_cjk: int = 26, per_lat: int = 13) -> int:
    """按字符估算药丸宽度：CJK 按全角宽度，拉丁字母按半角宽度，避免英文标签药丸过宽。"""
    w = base
    for ch in text:
        w += per_cjk if is_cjk(ch) else per_lat
    return w


def wrap(text: str, per: int, max_lines: int):
    """折行：含空格的拉丁文本按「单词」折行（不在词中断开）；纯 CJK 按字符数折行。
    超出 max_lines 用 … 截断。"""
    has_cjk = any(is_cjk(c) for c in text)
    if (not has_cjk) and (" " in text):
        # 拉丁：按词折行；单个超长词再硬性断字
        words = text.split(" ")
        lines, cur = [], ""
        for w in words:
            while len(w) > per:  # 超长词硬断
                if cur:
                    lines.append(cur)
                    cur = ""
                    if len(lines) >= max_lines:
                        break
                lines.append(w[:per])
                w = w[per:]
                if len(lines) >= max_lines:
                    break
            if len(lines) >= max_lines:
                break
            cand = (cur + " " + w).strip()
            if cur and len(cand) > per:
                lines.append(cur)
                cur = w
                if len(lines) >= max_lines:
                    break
            else:
                cur = cand
        if cur and len(lines) < max_lines:
            lines.append(cur)
    else:
        # CJK 或无明显空格：按字符数折行
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
    if len(lines) > max_lines:
        lines = lines[:max_lines]
    if len(text) > per * max_lines:
        # 截断最后一行
        lines[-1] = lines[-1][:per].rstrip() + "…"
    return lines


def build_svg(emoji, category, title, desc, accent, app_path,
              pill_text=None, footer=DEFAULT_FOOTER):
    pill_text = pill_text or accent
    title_cjk = any(is_cjk(c) for c in title)
    desc_cjk = any(is_cjk(c) for c in desc)
    title_lines = wrap(title, 13 if title_cjk else 20, 2)
    desc_lines = wrap(desc, 26 if desc_cjk else 42, 3)

    # 图标徽章
    badge = f'''
  <rect x="60" y="150" width="130" height="130" rx="30" fill="url(#accGrad)"/>
  <text x="125" y="218" font-size="76" text-anchor="middle" dominant-baseline="central">{esc(emoji)}</text>'''

    # 分类药丸（宽度按内容自适应：CJK / 拉丁分别估算）
    pill_w = pill_width(category)
    pill = f'''
  <rect x="218" y="172" width="{pill_w}" height="46" rx="23" fill="{accent}" opacity="0.12"/>
  <text x="{218 + pill_w/2}" y="200" font-size="23" font-weight="600" fill="{pill_text}" text-anchor="middle" dominant-baseline="central">{esc(category)}</text>'''

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

  <!-- background -->
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <rect width="{W}" height="{H}" fill="url(#dots)" opacity="0.5"/>

  <!-- top kicker -->
  <text x="62" y="74" font-size="20" font-weight="700" letter-spacing="2" fill="{BRAND}">UW TOOLKIT</text>

  <!-- icon + category -->
{badge}
{pill}

  <!-- title -->
{title_svg}

  <!-- description -->
{desc_svg}

  <!-- right-side decoration -->
{decor}

  <!-- footer -->
  <line x1="60" y1="572" x2="1140" y2="572" stroke="{LINE}"/>
  <text x="60" y="610" font-size="22" font-weight="700" fill="{INK}">{esc(footer)}</text>
  <text x="1140" y="610" font-size="19" fill="{MUTED}" text-anchor="end" font-family="monospace">waterloo-toolkit/{esc(app_path.replace('apps/', ''))}</text>
</svg>
'''
    return svg


# ---------- 内置 6 张封面的英文文案（语言中立，替代原中文） ----------
# 键名 = app id；文案为英文短词/短句，事实数字（112 门课、Top 50 等）原样保留。
APPS = {
    "sop": dict(
        emoji="🧭", category="Onboarding", pill_text="#b9770e", accent="#FED34C",
        title="Waterloo SOP",
        desc="New-student wiki: arrival, settlement, registration, academic life.",
        app_path="apps/sop",
    ),
    "daily-reminder": dict(
        emoji="📅", category="Reminders",
        title="Daily Reminder",
        desc="One thing that matters most each day, with an action tip — copy and share in one tap.",
        app_path="apps/daily-reminder", accent="#d11610",
    ),
    "course-planner": dict(
        emoji="📚", category="Courses",
        title="ECE Course Navigator",
        desc="ECE MEng planning: 4 plans, 112 courses, and an interactive course map.",
        app_path="apps/course-planner", accent="#2563eb",
    ),
    "weekday-stay": dict(
        emoji="🏠", category="Living",
        title="Weekday Stay",
        desc="Short-term weekday housing near Toronto, 2-3 nights/week in Waterloo — Top 50 picks.",
        app_path="apps/weekday-stay", accent="#1f8a4c",
    ),
    "locker-finder": dict(
        emoji="🔒", category="Living",
        title="Locker Finder",
        desc="Campus locker map: free or rental, term or daily, bring-your-own lock.",
        app_path="apps/locker-finder", accent="#1f8a4c",
    ),
    "goose-glance": dict(
        emoji="🔎", category="Careers",
        title="Goose Glance",
        desc="An AI Chrome extension that reads Waterloo Works postings at a glance.",
        app_path="apps/goose-glance", accent="#2b6cb0",
    ),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", default=None)
    ap.add_argument("--emoji", default=None)
    ap.add_argument("--category", default=None)
    ap.add_argument("--title", default=None)
    ap.add_argument("--desc", default=None)
    ap.add_argument("--app-path", default=None)
    ap.add_argument("--accent", default=None)
    ap.add_argument("--pill-text", default=None)
    ap.add_argument("--footer", default=DEFAULT_FOOTER)
    ap.add_argument("--out", default=None)
    ap.add_argument("--all", action="store_true", help="批量生成 APPS 内置的 6 张英文封面")
    args = ap.parse_args()

    root = Path(__file__).resolve().parent.parent

    if args.all:
        print("[info] 批量生成 6 张语言中立封面（英文文案）…")
        for aid, cfg in APPS.items():
            out = root / "apps" / aid / "cover.svg"
            out.parent.mkdir(parents=True, exist_ok=True)
            accent = cfg.get("accent") or PALETTE.get(cfg["category"], DEFAULT_ACCENT)
            svg = build_svg(
                cfg["emoji"], cfg["category"], cfg["title"], cfg["desc"],
                accent, cfg["app_path"],
                pill_text=cfg.get("pill_text"), footer=args.footer,
            )
            out.write_text(svg, encoding="utf-8")
            print(f"[ok] 封面已写出: {out}  (accent={accent})")
        return

    # 单张模式：必须提供完整参数
    missing = [k for k in ("id", "emoji", "category", "title", "desc", "app_path")
               if not getattr(args, k)]
    if missing:
        ap.error("单张模式缺少参数: --" + " --".join(missing))

    accent = args.accent or PALETTE.get(args.category, DEFAULT_ACCENT)

    # 语言中立护栏：封面是静态图，且站点默认英文 —— 出现 CJK 视为缺陷，显式告警
    for _label, _val in (("category", args.category), ("title", args.title),
                         ("desc", args.desc)):
        if any(is_cjk(c) for c in (_val or "")):
            print(f"[warn] 封面 {_label} 含中文：{_val!r}。"
                  f"封面必须语言中立（用英文 category_en / title_en），请改英文后重跑。")

    out = Path(args.out) if args.out else root / "apps" / args.id / "cover.svg"
    out.parent.mkdir(parents=True, exist_ok=True)

    svg = build_svg(args.emoji, args.category, args.title, args.desc, accent,
                    args.app_path, pill_text=args.pill_text, footer=args.footer)
    out.write_text(svg, encoding="utf-8")
    print(f"[ok] 封面已写出: {out}  (accent={accent})")

    # 补 manifest 的 cover 字段（仅当根目录存在 manifest 时；本目录无 manifest 会自动跳过）
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
        print(f"[info] 未找到 {manifest}，跳过 manifest 更新（不改动任何 _repo 文件）。")


if __name__ == "__main__":
    main()

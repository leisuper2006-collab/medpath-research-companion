from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "mobile_app_handoff" / "medpath_mobile_app_figma_handoff.svg"


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def text(x: int, y: int, value: str, size: int = 16, weight: int = 600, color: str = "#102033") -> str:
    return (
        f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, PingFang SC, Arial, sans-serif" '
        f'font-size="{size}" font-weight="{weight}" fill="{color}">{esc(value)}</text>'
    )


def wrap_lines(value: str, max_chars: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for char in value:
        current += char
        if len(current) >= max_chars:
            lines.append(current)
            current = ""
    if current:
        lines.append(current)
    return lines[:3]


def phone(x: int, y: int, title: str, subtitle: str, bullets: list[str], action: str, accent: str) -> str:
    parts = [
        f'<g transform="translate({x},{y})">',
        '<rect width="330" height="690" rx="34" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>',
        '<rect x="118" y="16" width="94" height="5" rx="3" fill="#cbd5e1"/>',
        text(24, 52, "MedPath", 13, 900, "#475569"),
        text(256, 52, "09:24", 13, 800, "#475569"),
        f'<rect x="24" y="78" width="132" height="34" rx="12" fill="{accent}18" stroke="{accent}55" stroke-width="1"/>',
        text(40, 101, subtitle, 13, 850, accent),
        text(24, 154, title, 26, 950, "#102033"),
        '<rect x="24" y="188" width="282" height="104" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>',
    ]
    y0 = 220
    for i, line in enumerate(wrap_lines("。".join(bullets[:2]) + "。", 20)):
        parts.append(text(42, y0 + i * 25, line, 14, 560, "#334155"))
    parts.extend([
        '<rect x="42" y="324" width="246" height="130" rx="18" fill="#fbfaf6" stroke="#e6e2d9" stroke-width="1"/>',
        '<path d="M62 424 H268" stroke="#cbd5e1" stroke-width="1"/>',
    ])
    bars = [28, 54, 76, 42, 92]
    colors = ["#6dc6a4", "#8aa3d1", "#f2c879", "#ef8a62", "#b7d86b"]
    for i, height in enumerate(bars):
        bx = 66 + i * 42
        by = 424 - height
        parts.append(f'<rect x="{bx}" y="{by}" width="28" height="{height}" rx="6" fill="{colors[i]}"/>')
    parts.append(text(62, 354, "示例图区域", 13, 850, "#0f766e"))
    y1 = 492
    for idx, bullet in enumerate(bullets):
        parts.append(f'<rect x="24" y="{y1 + idx * 58}" width="282" height="46" rx="14" fill="#ffffff" stroke="#d9e4df" stroke-width="1"/>')
        parts.append(text(42, y1 + 29 + idx * 58, f"{idx + 1}. {bullet}", 14, 760, "#334155"))
    parts.extend([
        f'<rect x="24" y="628" width="282" height="44" rx="16" fill="{accent}"/>',
        text(88, 656, action, 15, 900, "#ffffff"),
        text(34, 706, "首页", 11, 800, "#94a3b8"),
        text(92, 706, "方法", 11, 800, "#94a3b8"),
        text(150, 706, "文章", 11, 800, "#94a3b8"),
        text(208, 706, "绘图", 11, 800, "#94a3b8"),
        text(266, 706, "审计", 11, 800, "#94a3b8"),
        "</g>",
    ])
    return "".join(parts)


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    screens = [
        ("今天先完成三件事", "科研首页", ["把模糊想法变成路线", "准备数据和证据", "进入教师复核链"], "开始今日任务", "#0f766e"),
        ("我想做基因敲除", "方法详情", ["选择扰动层级", "查看失败风险", "生成复核清单"], "打开24种路线", "#255aa8"),
        ("我要写Meta分析", "文章Skill", ["定义PICO问题", "生成数据提取表", "检查图表计划"], "生成文章流程", "#b45309"),
        ("提交前先审计", "治理复核", ["标注AI输出", "检查虚假引用", "归档教师意见"], "运行风险审计", "#be123c"),
    ]
    phones = [phone(80 + i * 370, 135, *screen) for i, screen in enumerate(screens)]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="980" viewBox="0 0 1600 980">
<defs>
  <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#fbfcff"/>
    <stop offset=".62" stop-color="#f4faf8"/>
    <stop offset="1" stop-color="#fbfaf6"/>
  </linearGradient>
  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#0f2033" flood-opacity=".12"/>
  </filter>
</defs>
<rect width="1600" height="980" fill="url(#paper)"/>
<path d="M0 210 C220 120 360 290 580 190 C820 78 1040 140 1240 94 C1390 60 1500 86 1600 40" fill="none" stroke="#0f766e" stroke-opacity=".10" stroke-width="22"/>
<path d="M0 825 C260 690 430 910 720 770 C960 656 1200 730 1600 590" fill="none" stroke="#255aa8" stroke-opacity=".08" stroke-width="28"/>
{text(70, 70, "MedPath Mobile App Figma Handoff Board", 34, 950, "#102033")}
{text(70, 108, "四屏高保真结构：科研首页、方法详情、文章Skill、治理复核。可导入Figma继续拆分为组件。", 18, 560, "#475569")}
<g filter="url(#softShadow)">
{''.join(phones)}
</g>
<rect x="80" y="850" width="1440" height="78" rx="22" fill="#ffffff" stroke="#d9e4df" stroke-width="1.2"/>
{text(110, 884, "设计边界", 18, 900, "#0f766e")}
{text(210, 884, "本板为移动端产品路线和Figma交付源图，不代表已发布原生App；医学AI输出仅用于教学与科研训练，不替代临床诊断。", 18, 600, "#334155")}
{text(110, 914, "组件建议：任务卡、方法卡、文章流程卡、示例图区、审计提示、教师复核清单、桌宠对话和底部导航。", 16, 520, "#64748b")}
</svg>'''
    OUT.write_text(svg, encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()

from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "mobile_app_handoff"
OUT.mkdir(parents=True, exist_ok=True)


def text(x: int, y: int, value: str, size: int = 18, weight: int = 500, fill: str = "#102033") -> str:
    return (
        f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, Arial, sans-serif" '
        f'font-size="{size}" font-weight="{weight}" fill="{fill}">{escape(value)}</text>'
    )


def rect(x: int, y: int, w: int, h: int, fill: str, stroke: str = "#d9e4df", r: int = 8) -> str:
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="1.2"/>'


def chip(x: int, y: int, label: str, fill: str = "#eef7f5", color: str = "#0f766e") -> str:
    width = max(62, len(label) * 15 + 26)
    return rect(x, y, width, 30, fill, "#cce6df", 8) + text(x + 13, y + 20, label, 13, 800, color)


def mini_chart(x: int, y: int, w: int = 250, h: int = 110) -> str:
    bars = [
        (x + 18, y + 70, 34, 24, "#6dc6a4"),
        (x + 60, y + 48, 34, 46, "#8aa3d1"),
        (x + 102, y + 30, 34, 64, "#f2c879"),
        (x + 144, y + 56, 34, 38, "#ef8a62"),
        (x + 186, y + 20, 34, 74, "#b7d86b"),
    ]
    parts = [rect(x, y, w, h, "#fbfaf6", "#e6e2d9", 8)]
    parts.append(f'<path d="M{x+16} {y+94} H{x+w-16}" stroke="#cbd5e1" stroke-width="1"/>')
    for bx, by, bw, bh, color in bars:
        parts.append(rect(bx, by, bw, bh, color, color, 5))
    parts.append(text(x + 16, y + 24, "示例图", 13, 800, "#0f766e"))
    return "".join(parts)


def phone_frame(x: int, y: int, title: str, subtitle: str, body: list[str], accent: str, bottom: str) -> str:
    w, h = 330, 690
    parts = [
        f'<g>',
        rect(x, y, w, h, "#ffffff", "#cbd5e1", 8),
        f'<rect x="{x+108}" y="{y+14}" width="114" height="5" rx="3" fill="#cbd5e1"/>',
        text(x + 22, y + 46, "MedPath", 13, 900, "#475569"),
        text(x + 260, y + 46, "09:24", 13, 800, "#475569"),
        chip(x + 22, y + 72, subtitle, "#eef7f5", "#0f766e"),
        text(x + 22, y + 128, title, 25, 900, "#102033"),
        rect(x + 22, y + 154, 286, 84, "#f8fafc", "#e2e8f0", 8),
    ]
    wrapped = body[0][:34]
    parts.append(text(x + 38, y + 188, wrapped, 14, 600, "#334155"))
    parts.append(text(x + 38, y + 214, body[0][34:68] if len(body[0]) > 34 else "输出会进入教师复核链。", 14, 600, "#64748b"))
    parts.append(mini_chart(x + 40, y + 264, 250, 116))
    card_y = y + 410
    for i, line in enumerate(body[1:4], start=1):
        cy = card_y + (i - 1) * 62
        parts.append(rect(x + 22, cy, 286, 48, "#ffffff", "#d9e4df", 8))
        parts.append(text(x + 38, cy + 30, f"{i}. {line}", 14, 760, "#334155"))
    parts.append(rect(x + 22, y + 610, 286, 44, accent, accent, 8))
    parts.append(text(x + 70, y + 638, bottom, 15, 900, "#ffffff"))
    tabs = ["首页", "方法", "文章", "图谱", "审计"]
    for i, tab in enumerate(tabs):
        tx = x + 26 + i * 58
        parts.append(text(tx, y + 674, tab, 11, 800, accent if tab in bottom else "#94a3b8"))
    parts.append("</g>")
    return "".join(parts)


phones = [
    (
        80,
        130,
        "今天先完成三件事",
        "科研首页",
        [
            "把模糊想法变成路线：先判断问题、数据、方法和伦理边界。",
            "提出需求",
            "选择方法",
            "审计输出",
        ],
        "#0f766e",
        "开始今日任务",
    ),
    (
        450,
        130,
        "我想做基因敲除",
        "方法详情",
        [
            "先看目标：验证功能、构建模型、筛选机制或准备文章图。",
            "选择扰动层级",
            "查看失败风险",
            "生成复核清单",
        ],
        "#23395d",
        "打开24种路线",
    ),
    (
        820,
        130,
        "我要写Meta分析",
        "文章Skill",
        [
            "从PICO、检索、纳排、偏倚风险到森林图逐步生成。",
            "定义研究问题",
            "生成数据表",
            "检查图表计划",
        ],
        "#b45309",
        "生成文章流程",
    ),
    (
        1190,
        130,
        "提交前先审计",
        "治理复核",
        [
            "检查隐私、临床误导、虚假引用和学术诚信风险。",
            "标注AI输出",
            "教师复核",
            "归档证据",
        ],
        "#be123c",
        "运行风险审计",
    ),
]

parts = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="980" viewBox="0 0 1600 980">',
    '<rect width="1600" height="980" fill="#fbfaf6"/>',
    '<circle cx="1360" cy="84" r="90" fill="#f1c9d4" opacity=".35"/>',
    '<circle cx="180" cy="900" r="140" fill="#cde9df" opacity=".45"/>',
    text(70, 70, "MedPath Mobile App Figma Handoff Board", 34, 900, "#102033"),
    text(70, 106, "四屏高保真结构：科研首页、方法详情、文章Skill、治理复核。可拖入Figma继续拆组件。", 18, 520, "#475569"),
]

for phone in phones:
    parts.append(phone_frame(*phone))

parts.extend(
    [
        rect(80, 850, 1440, 74, "#ffffff", "#d9e4df", 8),
        text(110, 882, "设计边界", 18, 900, "#0f766e"),
        text(210, 882, "本板为移动端产品路线和Figma交付源图，不代表已发布原生App；医学AI输出仅用于教学与科研训练，不替代临床诊断。", 18, 600, "#334155"),
        text(110, 912, "组件建议：任务卡、方法卡、文章流程卡、示例图区、审计提示、教师复核清单、桌宠对话。", 16, 500, "#64748b"),
        "</svg>",
    ]
)

svg = "".join(parts)
(OUT / "medpath_mobile_app_figma_handoff.svg").write_text(svg, encoding="utf-8")
print(OUT / "medpath_mobile_app_figma_handoff.svg")

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "outputs" / "mobile_app_handoff"
PACK_DIR = OUT_DIR / "figma_import_pack"
SVG_MAIN = OUT_DIR / "medpath_mobile_app_round70_handoff.svg"
SVG_PACK = PACK_DIR / "medpath_mobile_app_round70_handoff.svg"
MANIFEST = PACK_DIR / "figma_import_manifest_round70.json"
TOKENS = PACK_DIR / "medpath_mobile_tokens_round70.json"
REBUILD = PACK_DIR / "figma_use_rebuild_mobile_app_round70.js"


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def t(x: int, y: int, value: str, size: int = 16, weight: int = 650, color: str = "#102033") -> str:
    return (
        f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, PingFang SC, Arial, sans-serif" '
        f'font-size="{size}" font-weight="{weight}" fill="{color}">{esc(value)}</text>'
    )


def multiline(x: int, y: int, lines: list[str], size: int = 14, color: str = "#475569", gap: int = 24) -> str:
    return "".join(t(x, y + i * gap, line, size, 560, color) for i, line in enumerate(lines))


def mini_chart(x: int, y: int, kind: str) -> str:
    if kind == "radar":
        return f"""
        <g transform="translate({x},{y})">
          <circle cx="60" cy="58" r="42" fill="none" stroke="#d8e7e4"/>
          <circle cx="60" cy="58" r="24" fill="none" stroke="#d8e7e4"/>
          <path d="M60 18 L98 58 L72 96 L34 82 L26 42 Z" fill="#0f766e" opacity=".16" stroke="#0f766e" stroke-width="2"/>
          <path d="M60 34 L82 58 L66 78 L44 72 L40 48 Z" fill="#255aa8" opacity=".18" stroke="#255aa8" stroke-width="2"/>
        </g>"""
    if kind == "forest":
        rows = []
        for i, (cx, width) in enumerate([(72, 58), (92, 80), (62, 44), (108, 72)]):
            yy = y + i * 26
            rows.append(f'<line x1="{x + 36}" y1="{yy}" x2="{x + 152}" y2="{yy}" stroke="#e2e8f0"/>')
            rows.append(f'<line x1="{x + cx - width//2}" y1="{yy}" x2="{x + cx + width//2}" y2="{yy}" stroke="#255aa8" stroke-width="2"/>')
            rows.append(f'<rect x="{x + cx - 5}" y="{yy - 5}" width="10" height="10" rx="2" fill="#0f766e"/>')
        return "".join(rows)
    bars = [42, 74, 55, 92, 64]
    colors = ["#0f766e", "#255aa8", "#d08b2d", "#be5b47", "#6b8e23"]
    return "".join(
        f'<rect x="{x + i * 34}" y="{y + 100 - h}" width="22" height="{h}" rx="7" fill="{colors[i]}" opacity=".86"/>'
        for i, h in enumerate(bars)
    )


def phone(x: int, y: int, title: str, label: str, lines: list[str], action: str, accent: str, chart: str) -> str:
    body = [
        f'<g transform="translate({x},{y})" filter="url(#phoneShadow)">',
        '<rect width="310" height="650" rx="38" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>',
        '<rect x="112" y="18" width="86" height="5" rx="3" fill="#d3dde8"/>',
        t(24, 54, "MedPath", 13, 900, "#475569"),
        t(238, 54, "09:30", 13, 850, "#475569"),
        f'<rect x="24" y="82" width="128" height="32" rx="13" fill="{accent}18" stroke="{accent}66"/>',
        t(40, 103, label, 13, 850, accent),
        t(24, 154, title, 24, 950, "#102033"),
        '<rect x="24" y="188" width="262" height="126" rx="22" fill="#f8fafc" stroke="#e2e8f0"/>',
        mini_chart(52, 205, chart),
    ]
    yy = 344
    for i, line in enumerate(lines):
        body.append(f'<rect x="24" y="{yy + i * 58}" width="262" height="46" rx="16" fill="#ffffff" stroke="#d9e4df"/>')
        body.append(t(42, yy + 29 + i * 58, f"{i + 1}. {line}", 13, 760, "#334155"))
    body.extend(
        [
            f'<rect x="24" y="578" width="262" height="46" rx="18" fill="{accent}"/>',
            t(66, 607, action, 14, 900, "#ffffff"),
            t(30, 635, "仅教学训练，不替代临床诊断", 11, 700, "#64748b"),
            "</g>",
        ]
    )
    return "".join(body)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PACK_DIR.mkdir(parents=True, exist_ok=True)
    screens = [
        ("今天先完成三件事", "首页任务", ["研究想法转任务", "方法路线看风险", "交付材料待复核"], "开始今日任务", "#0f766e", "bars"),
        ("基因敲除怎么选", "方法详情", ["永久/瞬时/条件性", "对照组与救援实验", "失败点提前提示"], "比较路线", "#255aa8", "radar"),
        ("这张图在讲什么", "示例图学习", ["读变量与分组", "看源数据格式", "生成数据审查"], "打开绘图室", "#d08b2d", "bars"),
        ("我要写Meta分析", "文章Skill", ["PICO与检索式", "纳排与偏倚风险", "森林图与GRADE"], "生成流程包", "#be5b47", "forest"),
        ("接入自己的API", "模型网关", ["只读环境变量", "任务选择模型", "输出进入审查"], "生成请求包", "#5b6b9a", "radar"),
        ("提交前谁来把关", "教师复核", ["隐私与虚假引用", "AI生成状态标注", "D10评价字段"], "打开复核表", "#7c3aed", "forest"),
    ]
    phones = []
    coords = [(70, 160), (410, 130), (750, 160), (1090, 130), (1430, 160), (1770, 130)]
    for (x, y), spec in zip(coords, screens):
        phones.append(phone(x, y, *spec))
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="2160" height="980" viewBox="0 0 2160 980">
<defs>
  <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#fbfcff"/>
    <stop offset=".55" stop-color="#f5fbf9"/>
    <stop offset="1" stop-color="#fbfaf4"/>
  </linearGradient>
  <filter id="phoneShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="28" stdDeviation="24" flood-color="#102033" flood-opacity=".14"/>
  </filter>
</defs>
<rect width="2160" height="980" fill="url(#paper)"/>
<path d="M0 230 C260 110 460 285 710 178 C990 58 1260 152 1510 98 C1740 48 1940 108 2160 52" fill="none" stroke="#0f766e" stroke-opacity=".09" stroke-width="26"/>
<path d="M0 840 C340 690 520 910 850 762 C1160 620 1460 770 2160 588" fill="none" stroke="#255aa8" stroke-opacity=".07" stroke-width="32"/>
{t(70, 72, "MedPath Mobile App · Round70 Figma Handoff", 38, 950, "#102033")}
{t(70, 112, "六屏移动端产品蓝图：今日任务、方法详情、示例图学习、文章Skill、模型网关、教师复核。可拖入Figma继续拆为组件。", 18, 560, "#475569")}
{"".join(phones)}
<rect x="70" y="850" width="2020" height="76" rx="24" fill="#ffffff" stroke="#d9e4df"/>
{t(104, 884, "交付边界", 18, 900, "#0f766e")}
{t(210, 884, "本设计板为本地可导入Figma的原型交付，不代表已发布原生App或云端Figma文件；所有医学AI输出仅用于教学与科研训练，不替代临床诊断，须经教师或专家复核。", 18, 600, "#334155")}
{t(104, 916, "组件建议：任务卡、方法故事页、示例图卡、文章流程卡、模型状态条、审计提示、桌宠对话、教师复核清单、底部导航。", 16, 540, "#64748b")}
</svg>"""
    SVG_MAIN.write_text(svg, encoding="utf-8")
    SVG_PACK.write_text(svg, encoding="utf-8")

    tokens = {
        "version": "round70",
        "palette": {
            "ink": "#102033",
            "muted": "#475569",
            "teal": "#0f766e",
            "blue": "#255aa8",
            "amber": "#d08b2d",
            "coral": "#be5b47",
            "violet": "#7c3aed",
            "paper": "#fbfcff",
        },
        "radii": {"phone": 38, "card": 22, "button": 18},
        "type": {"family": "Microsoft YaHei / PingFang SC / Inter", "title": 24, "body": 14, "label": 13},
        "safety_boundary": "仅用于教学与科研训练，不替代临床诊断，须经教师或专家复核。",
    }
    TOKENS.write_text(json.dumps(tokens, ensure_ascii=False, indent=2), encoding="utf-8")

    manifest = {
        "version": "round70",
        "name": "MedPath Mobile App Figma Handoff",
        "status": "local_import_pack_not_cloud_figma_file",
        "screens": [
            {"id": f"screen_{i+1:02d}", "title": spec[0], "role": spec[1], "component_goal": "移动端核心屏幕，可在Figma中拆为组件"}
            for i, spec in enumerate(screens)
        ],
        "files": {
            "svg": "medpath_mobile_app_round70_handoff.svg",
            "tokens": "medpath_mobile_tokens_round70.json",
            "rebuild_script": "figma_use_rebuild_mobile_app_round70.js",
        },
        "boundary": tokens["safety_boundary"],
        "manual_next_steps": [
            "将SVG拖入Figma并拆分为phone frame、task card、method card、audit card组件。",
            "运行复建脚本前请在Figma插件环境中人工确认页面与命名。",
            "若需要云端Figma文件，待Figma MCP连接可用后再创建，不在本包中伪造。",
        ],
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    rebuild_js = """// Round70 local Figma rebuild helper.
// Paste into a Figma plugin code context. It creates rough editable frames only;
// import the SVG for full visual fidelity.
const screens = [
  "今天先完成三件事",
  "基因敲除怎么选",
  "这张图在讲什么",
  "我要写Meta分析",
  "接入自己的API",
  "提交前谁来把关",
];
figma.currentPage.name = "MedPath Mobile Round70 Handoff";
screens.forEach((title, index) => {
  const frame = figma.createFrame();
  frame.name = `Round70 / ${String(index + 1).padStart(2, "0")} / ${title}`;
  frame.resize(390, 844);
  frame.x = index * 430;
  frame.y = 0;
  frame.cornerRadius = 32;
  frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  const label = figma.createText();
  label.name = "screen-title";
  label.characters = title;
  label.x = 28;
  label.y = 56;
  label.fontSize = 24;
  frame.appendChild(label);
});
figma.notify("MedPath Round70 mobile frames created. Import SVG for polished layers.");
"""
    REBUILD.write_text(rebuild_js, encoding="utf-8")
    print(SVG_MAIN)
    print(MANIFEST)
    print(TOKENS)
    print(REBUILD)


if __name__ == "__main__":
    main()

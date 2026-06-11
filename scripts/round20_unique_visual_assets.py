from __future__ import annotations

import json
import re
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = ROOT / "outputs"
DOCS = ROOT / "docs"
REPORT = DOCS / "round20_unique_visual_assets_report.md"


def load_json(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8-sig"))


def save_json(name: str, data) -> None:
    (DATA / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def safe_slug(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", str(text)).strip("-").lower()
    return slug or "item"


def wrap(text: str, width: int = 28) -> list[str]:
    text = str(text)
    lines: list[str] = []
    buf = ""
    for ch in text:
        buf += ch
        if len(buf) >= width:
            lines.append(buf)
            buf = ""
    if buf:
        lines.append(buf)
    return lines[:3]


def svg_card(title: str, subtitle: str, tag: str, mode: str, accent: str) -> str:
    title_lines = wrap(title, 20)
    subtitle_lines = wrap(subtitle, 34)
    y = 72
    title_svg = []
    for line in title_lines:
        title_svg.append(f'<text x="42" y="{y}" class="title">{escape(line)}</text>')
        y += 34
    sy = 194
    sub_svg = []
    for line in subtitle_lines:
        sub_svg.append(f'<text x="42" y="{sy}" class="body">{escape(line)}</text>')
        sy += 25
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="920" height="560" viewBox="0 0 920 560">
  <style>
    .bg{{fill:#fbfaf6}}
    .panel{{fill:#ffffff;stroke:#d9e4df;stroke-width:1.2}}
    .title{{font-family:"Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif;font-size:27px;font-weight:700;fill:#10233f}}
    .body{{font-family:"Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif;font-size:18px;fill:#546271}}
    .tag{{font-family:"Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif;font-size:16px;font-weight:700;fill:#0f766e}}
    .small{{font-family:"Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif;font-size:14px;fill:#6b7280}}
  </style>
  <rect class="bg" width="920" height="560" rx="26"/>
  <rect x="28" y="28" width="864" height="504" rx="24" class="panel"/>
  <circle cx="806" cy="96" r="54" fill="{accent}" opacity=".18"/>
  <circle cx="778" cy="155" r="24" fill="{accent}" opacity=".35"/>
  <path d="M52 424 C188 345, 284 481, 422 392 S681 355, 836 424" fill="none" stroke="{accent}" stroke-width="8" stroke-linecap="round" opacity=".75"/>
  <path d="M110 388 L185 328 L270 365 L348 270 L462 315 L565 230 L680 286 L790 214" fill="none" stroke="#23395d" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="{accent}" stroke="#fff" stroke-width="3">
    <circle cx="110" cy="388" r="10"/><circle cx="185" cy="328" r="10"/><circle cx="270" cy="365" r="10"/>
    <circle cx="348" cy="270" r="10"/><circle cx="462" cy="315" r="10"/><circle cx="565" cy="230" r="10"/>
    <circle cx="680" cy="286" r="10"/><circle cx="790" cy="214" r="10"/>
  </g>
  <rect x="42" y="40" width="220" height="28" rx="14" fill="#e8f6f1"/>
  <text x="58" y="60" class="tag">{escape(mode)} · {escape(tag)}</text>
  {''.join(title_svg)}
  {''.join(sub_svg)}
  <text x="42" y="500" class="small">公开来源线索或合成教学图：仅用于学习路径和字段审查，不代表真实研究结果。</text>
</svg>'''


def write_svg(path: Path, title: str, subtitle: str, tag: str, mode: str, accent: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg_card(title, subtitle, tag, mode, accent), encoding="utf-8")


def cbio_source(sources: list[dict], idx: int) -> dict:
    cbio = [s for s in sources if str(s.get("url", "")).startswith("https://www.cbioportal.org")]
    return cbio[idx % len(cbio)] if cbio else sources[idx % len(sources)]


def main() -> None:
    methods = load_json("method_universe.json")
    articles = load_json("article_skill_workflows.json")
    tools = load_json("open_source_catalog.json")
    plots = load_json("plot_gallery_taxonomy.json")
    sources = load_json("public_example_sources.json")

    accents = ["#0f766e", "#2563eb", "#b45309", "#7c3aed", "#be123c", "#15803d", "#0f5e7a"]

    method_dir = OUT / "round11_method_plots"
    method_written = 0
    for i, m in enumerate(methods):
        item_id = m.get("id", f"method-{i+1:03d}")
        path = method_dir / f"{safe_slug(item_id)}.svg"
        title = f"{m.get('name')}：新手路线示例"
        subtitle = m.get("output_interpretation") or m.get("what_it_solves") or "用于说明该方法的输入、输出和复核边界。"
        write_svg(path, title, subtitle, m.get("category", "方法"), "Method", accents[i % len(accents)])
        method_written += 1
        m["example_visual"] = {
            "title": title,
            "url": f"/outputs/round11_method_plots/{path.name}",
            "source_note": f"独立教学示例图；公开来源线索：{m.get('public_source_example', {}).get('citation', '待核对正式出处')}。",
            "reuse_boundary": "用于学习方法结构、数据字段和复核边界；正式科研需替换为用户自有或合规公开数据。",
        }

    article_dir = OUT / "round20_article_visuals"
    article_written = 0
    for i, a in enumerate(articles):
        item_id = a.get("id", f"article-{i+1:02d}")
        path = article_dir / f"{safe_slug(item_id)}.svg"
        title = f"{a.get('type')}：从0到1流程示例"
        subtitle = a.get("article_reporting_focus") or "用于说明文章类型、材料清单、图表计划和人工复核。"
        write_svg(path, title, subtitle, "文章工作流", "Article", accents[(i + 2) % len(accents)])
        article_written += 1
        a["example_visual"] = {
            "title": title,
            "url": f"/outputs/round20_article_visuals/{path.name}",
            "source_note": f"独立教学示例图；公开来源线索：{a.get('public_source_example', {}).get('citation', '待核对正式出处')}。",
            "reuse_boundary": "用于学习写作流程和图表计划；没有真实数据时不得生成假结果。",
        }

    tool_dir = OUT / "round20_tool_visuals"
    tool_written = 0
    for i, t in enumerate(tools):
        item_id = t.get("id") or t.get("name") or f"tool-{i+1:03d}"
        path = tool_dir / f"{i+1:03d}-{safe_slug(item_id)}.svg"
        title = f"{t.get('name')}：工具阅读示例"
        subtitle = t.get("output_interpretation") or t.get("short_description") or "用于说明工具用途、输入输出和许可证核对。"
        write_svg(path, title, subtitle, t.get("category", "工具"), "Tool", accents[(i + 4) % len(accents)])
        tool_written += 1
        t["example_visual"] = {
            "title": title,
            "url": f"/outputs/round20_tool_visuals/{path.name}",
            "source_note": f"独立教学示例图；公开来源线索：{t.get('public_source_example', {}).get('citation', '待核对正式出处')}。",
            "reuse_boundary": "用于学习工具阅读和最小复现路径；不代表工具已在用户数据上验证。",
        }

    for i, p in enumerate(plots):
        src = p.get("public_source_example") or {}
        if not str(src.get("url", "")).startswith("https://www.cbioportal.org"):
            original = dict(src)
            replacement = cbio_source(sources, i)
            p["public_source_example"] = {
                **replacement,
                "secondary_literature_note": original.get("url") or original.get("pmid") or original.get("citation", ""),
                "license_note": "主链接使用cBioPortal公开研究元数据；补充文献线索仅用于核对，不复制论文原图。",
            }

    save_json("method_universe.json", methods)
    save_json("article_skill_workflows.json", articles)
    save_json("open_source_catalog.json", tools)
    save_json("plot_gallery_taxonomy.json", plots)

    REPORT.write_text(
        "# Round20 独立示例图资产绑定报告\n\n"
        f"- 本轮绑定方法独立示例图：{method_written} 张，目录 `{method_dir}`。\n"
        f"- 本轮绑定文章独立示例图：{article_written} 张，目录 `{article_dir}`。\n"
        f"- 本轮绑定工具独立示例图：{tool_written} 张，目录 `{tool_dir}`。\n"
        "- 图谱公开来源链接已回归到 cBioPortal 公开元数据主链接；如有PubMed等补充线索，保存在 `secondary_literature_note`。\n"
        "- 所有示例图均为教学重绘/合成示例，不复制论文原图，不代表真实研究结果。\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "method_svgs_bound": method_written,
        "article_svgs_bound": article_written,
        "tool_svgs_bound": tool_written,
        "report": str(REPORT),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

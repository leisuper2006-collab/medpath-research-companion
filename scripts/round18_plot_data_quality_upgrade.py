from __future__ import annotations

import html
import json
import math
import random
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLOTS_JSON = ROOT / "data" / "plot_gallery_taxonomy.json"
SVG_DIR = ROOT / "outputs" / "round11_detail_plots"
REPORT = ROOT / "docs" / "round18_plot_data_quality_upgrade_report.md"


SOURCE_FIXES = {
    "credible_interval_plot": {
        "id": "blca_tcga_pub",
        "title": "Bladder Urothelial Carcinoma (TCGA, Nature 2014)",
        "description": "Integrated TCGA analysis of high-grade muscle-invasive urothelial bladder carcinoma; used here only as a public source citation anchor.",
        "citation": "The Cancer Genome Atlas Research Network. Nature 2014;507:315-322.",
        "pmid": "24476821",
        "cancer_type": "blca",
        "reference_genome": "hg19",
        "sample_count_public_metadata": 131,
        "source_platform": "cBioPortal / PubMed",
        "query_keyword": "Nature 2014 BLCA",
        "license_note": "仅使用公开研究元数据和引用信息；不下载受控数据，不复制论文原图。",
        "reuse_boundary": "可用于教学示例来源说明；正式科研需按原数据库与论文许可要求核对。",
        "tier": "Nature公开研究来源",
        "url": "https://www.cbioportal.org/study/summary?id=blca_tcga_pub",
        "citation_status": "verified-public-metadata",
    },
    "restricted_mean_survival": {
        "id": "blca_tcga_pub",
        "title": "Bladder Urothelial Carcinoma (TCGA, Nature 2014)",
        "description": "Integrated TCGA analysis of high-grade muscle-invasive urothelial bladder carcinoma; used here only as a public source citation anchor.",
        "citation": "The Cancer Genome Atlas Research Network. Nature 2014;507:315-322.",
        "pmid": "24476821",
        "cancer_type": "blca",
        "reference_genome": "hg19",
        "sample_count_public_metadata": 131,
        "source_platform": "cBioPortal / PubMed",
        "query_keyword": "Nature 2014 BLCA",
        "license_note": "仅使用公开研究元数据和引用信息；不下载受控数据，不复制论文原图。",
        "reuse_boundary": "可用于教学示例来源说明；正式科研需按原数据库与论文许可要求核对。",
        "tier": "Nature公开研究来源",
        "url": "https://www.cbioportal.org/study/summary?id=blca_tcga_pub",
        "citation_status": "verified-public-metadata",
    },
    "go_barplot": {
        "id": "laml_tcga_pub",
        "title": "Acute Myeloid Leukemia (TCGA, NEJM 2013)",
        "description": "TCGA genomic and epigenomic landscape of adult de novo AML; used here only as a public source citation anchor.",
        "citation": "The Cancer Genome Atlas Research Network. N Engl J Med 2013;368:2059-2074.",
        "pmid": "23634996",
        "cancer_type": "aml",
        "reference_genome": "hg19",
        "sample_count_public_metadata": 200,
        "source_platform": "cBioPortal / PubMed",
        "query_keyword": "NEJM 2013 AML TCGA",
        "license_note": "仅使用公开研究元数据和引用信息；不下载受控数据，不复制论文原图。",
        "reuse_boundary": "可用于教学示例来源说明；正式科研需按原数据库与论文许可要求核对。",
        "tier": "NEJM公开研究来源",
        "url": "https://www.cbioportal.org/study/summary?id=laml_tcga_pub",
        "citation_status": "verified-public-metadata",
    },
    "annotation_agreement_plot": {
        "id": "camelyon16_jama_2017",
        "title": "CAMELYON16 lymph-node metastasis challenge (JAMA 2017)",
        "description": "Public pathology challenge publication for breast cancer lymph node metastasis detection; used here as a digital pathology teaching source anchor.",
        "citation": "Bejnordi BE, et al. JAMA 2017;318:2199-2210.",
        "pmid": "29234806",
        "cancer_type": "breast lymph node metastasis",
        "reference_genome": "not applicable",
        "sample_count_public_metadata": 399,
        "source_platform": "CAMELYON16 / PubMed",
        "query_keyword": "CAMELYON16 JAMA",
        "license_note": "仅记录公开挑战与论文引用信息；不复制病理原图，不下载受控或需要登录的数据。",
        "reuse_boundary": "可用于数字病理算法评价教学来源说明；真实数据使用须遵循CAMELYON许可。",
        "tier": "JAMA公开挑战来源",
        "url": "https://pubmed.ncbi.nlm.nih.gov/29234806/",
        "citation_status": "verified-public-metadata",
    },
    "roc_by_subgroup_pathology": {
        "id": "camelyon16_jama_2017",
        "title": "CAMELYON16 lymph-node metastasis challenge (JAMA 2017)",
        "description": "Public pathology challenge publication for breast cancer lymph node metastasis detection; used here as a digital pathology teaching source anchor.",
        "citation": "Bejnordi BE, et al. JAMA 2017;318:2199-2210.",
        "pmid": "29234806",
        "cancer_type": "breast lymph node metastasis",
        "reference_genome": "not applicable",
        "sample_count_public_metadata": 399,
        "source_platform": "CAMELYON16 / PubMed",
        "query_keyword": "CAMELYON16 JAMA",
        "license_note": "仅记录公开挑战与论文引用信息；不复制病理原图，不下载受控或需要登录的数据。",
        "reuse_boundary": "可用于数字病理算法评价教学来源说明；真实数据使用须遵循CAMELYON许可。",
        "tier": "JAMA公开挑战来源",
        "url": "https://pubmed.ncbi.nlm.nih.gov/29234806/",
        "citation_status": "verified-public-metadata",
    },
}


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def svg_base(title: str, subtitle: str, body: str) -> str:
    return f"""<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='760' height='500' viewBox='0 0 760 500'>
<rect width='760' height='500' rx='26' fill='#fffdf8'/>
<rect x='34' y='34' width='692' height='412' rx='20' fill='#ffffff' stroke='#d8c7a2' stroke-width='1.4'/>
<text x='62' y='78' font-family='Arial, sans-serif' font-size='24' font-weight='700' fill='#132237'>{esc(title)}</text>
<text x='62' y='106' font-family='Arial, sans-serif' font-size='13' fill='#667085'>{esc(subtitle)}</text>
{body}
<text x='380' y='476' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='#8a6d3b'>Synthetic teaching visual; replace with audited user data for real research.</text>
</svg>"""


def axes() -> str:
    return "<line x1='90' y1='380' x2='690' y2='380' stroke='#344054'/><line x1='90' y1='380' x2='90' y2='135' stroke='#344054'/>"


def volcano_body(rng: random.Random) -> str:
    pts = []
    for i in range(118):
        x = rng.gauss(0, 1.7)
        y = abs(x) * 38 + rng.random() * 92
        px = 390 + x * 88
        py = 380 - min(y, 230)
        color = "#d45b53" if abs(x) > 1.5 and y > 85 else "#8aa3b5"
        pts.append(f"<circle cx='{px:.1f}' cy='{py:.1f}' r='3.2' fill='{color}' opacity='.78'/>")
    return axes() + "<line x1='260' y1='380' x2='260' y2='135' stroke='#d8dee9' stroke-dasharray='5 5'/><line x1='520' y1='380' x2='520' y2='135' stroke='#d8dee9' stroke-dasharray='5 5'/>" + "".join(pts)


def heatmap_body(rng: random.Random) -> str:
    cells = []
    colors = ["#2867a8", "#6aaed6", "#f7fbff", "#f4a582", "#ca4a3b"]
    for r in range(9):
        for c in range(10):
            idx = max(0, min(4, int((r + c + rng.randint(0, 3)) / 4)))
            cells.append(f"<rect x='{126+c*48}' y='{136+r*27}' width='44' height='24' fill='{colors[idx]}' stroke='white' stroke-width='1'/>")
    return "".join(cells) + "<text x='366' y='408' text-anchor='middle' font-family='Arial' font-size='12' fill='#667085'>matrix values / clustered teaching pattern</text>"


def distribution_body(rng: random.Random) -> str:
    parts = [axes()]
    for i, color in enumerate(["#58a6ff", "#2fbf71", "#f59f6b"]):
        x = 210 + i * 150
        h = 90 + i * 32
        parts.append(f"<path d='M{x-34} {380-h/2} C{x-70} {300-h/5},{x-50} {210+h/6},{x} {195} C{x+50} {210+h/6},{x+70} {300-h/5},{x+34} {380-h/2} Z' fill='{color}' opacity='.28' stroke='{color}'/>")
        parts.append(f"<rect x='{x-24}' y='{300-h/4}' width='48' height='{55+i*8}' fill='white' stroke='{color}' stroke-width='2'/>")
        parts.append(f"<line x1='{x-24}' y1='{324-h/4}' x2='{x+24}' y2='{324-h/4}' stroke='{color}' stroke-width='2'/>")
    return "".join(parts)


def interval_body(rng: random.Random) -> str:
    parts = [axes(), "<line x1='390' y1='130' x2='390' y2='382' stroke='#9ca3af' stroke-dasharray='6 6'/>"]
    for i in range(9):
        y = 155 + i * 24
        est = rng.uniform(-1.2, 1.2)
        lo = est - rng.uniform(.2, .55)
        hi = est + rng.uniform(.2, .55)
        x1, x2, x = 390 + lo * 120, 390 + hi * 120, 390 + est * 120
        parts.append(f"<line x1='{x1:.1f}' y1='{y}' x2='{x2:.1f}' y2='{y}' stroke='#426b8a' stroke-width='3'/>")
        parts.append(f"<circle cx='{x:.1f}' cy='{y}' r='5.5' fill='#d06b48'/>")
        parts.append(f"<text x='96' y='{y+4}' font-family='Arial' font-size='11' fill='#475467'>Feature {i+1}</text>")
    return "".join(parts)


def survival_body(rng: random.Random) -> str:
    parts = [axes()]
    for j, color in enumerate(["#0f766e", "#2563eb", "#b45309"]):
        x0, y0 = 105, 155 + j * 9
        d = f"M{x0} {y0}"
        for k in range(1, 9):
            x = 105 + k * 64
            y = y0 + k * (15 + j * 4) + rng.randint(-5, 5)
            d += f" H{x} V{y}"
        parts.append(f"<path d='{d}' fill='none' stroke='{color}' stroke-width='4'/>")
    return "".join(parts)


def roc_body(rng: random.Random) -> str:
    parts = [axes(), "<line x1='90' y1='380' x2='690' y2='135' stroke='#cbd5e1' stroke-dasharray='5 5'/>"]
    for j, color in enumerate(["#0f766e", "#2563eb", "#d06b48"]):
        d = f"M90 380 C{210+j*25} {330-j*28}, {380+j*16} {190-j*18}, 690 {140+j*10}"
        parts.append(f"<path d='{d}' fill='none' stroke='{color}' stroke-width='4'/>")
    return "".join(parts)


def bar_body(rng: random.Random) -> str:
    parts = [axes()]
    for i in range(8):
        h = 36 + rng.randint(20, 160)
        y = 380 - h
        parts.append(f"<rect x='{128+i*66}' y='{y}' width='42' height='{h}' rx='7' fill='#{rng.choice(['0f766e','2563eb','b45309','5b7c99'])}' opacity='.78'/>")
    return "".join(parts)


def network_body(rng: random.Random) -> str:
    coords = [(210,190),(330,150),(470,190),(260,300),(420,310),(560,270),(600,160)]
    edges = [(0,1),(1,2),(0,3),(3,4),(2,4),(2,5),(5,6),(1,6)]
    parts = []
    for a,b in edges:
        parts.append(f"<line x1='{coords[a][0]}' y1='{coords[a][1]}' x2='{coords[b][0]}' y2='{coords[b][1]}' stroke='#b6c2cf' stroke-width='2'/>")
    for i,(x,y) in enumerate(coords):
        parts.append(f"<circle cx='{x}' cy='{y}' r='{18+rng.randint(0,8)}' fill='{['#0f766e','#2563eb','#b45309'][i%3]}' opacity='.84'/>")
    return "".join(parts)


def spatial_body(rng: random.Random) -> str:
    pts = []
    for i in range(170):
        x = 110 + rng.random() * 560
        y = 138 + rng.random() * 235
        color = ["#0f766e", "#2563eb", "#b45309", "#d06b48"][int((x + y) / 120) % 4]
        pts.append(f"<circle cx='{x:.1f}' cy='{y:.1f}' r='4.1' fill='{color}' opacity='.74'/>")
    return "<rect x='100' y='128' width='580' height='260' rx='18' fill='#f8fafc' stroke='#e2e8f0'/>" + "".join(pts)


def flow_body(rng: random.Random) -> str:
    labels = ["Input", "QC", "Model", "Review", "Report"]
    parts = []
    for i, label in enumerate(labels):
        x = 100 + i * 132
        parts.append(f"<rect x='{x}' y='210' width='96' height='62' rx='14' fill='#{['d9f4e8','dbeafe','f3d38b','f6d5d8','e8edf3'][i]}' stroke='#ccd6df'/>")
        parts.append(f"<text x='{x+48}' y='248' text-anchor='middle' font-family='Arial' font-size='13' fill='#132237'>{label}</text>")
        if i < len(labels)-1:
            parts.append(f"<path d='M{x+100} 241 H{x+126}' stroke='#64748b' stroke-width='2' marker-end='url(#arrow)'/>")
    return "<defs><marker id='arrow' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'><path d='M0,0 L0,6 L7,3 z' fill='#64748b'/></marker></defs>" + "".join(parts)


def choose_body(plot_id: str, category: str, rng: random.Random) -> str:
    key = plot_id.lower()
    cat = category.lower()
    if "volcano" in key or "manhattan" in key:
        return volcano_body(rng)
    if "heatmap" in key or "matrix" in key or "onco" in key:
        return heatmap_body(rng)
    if "box" in key or "violin" in key or "raincloud" in key or "density" in key or "strip" in key:
        return distribution_body(rng)
    if "forest" in key or "interval" in key or "credible" in key or "meta" in cat:
        return interval_body(rng)
    if "survival" in key or "kaplan" in key or "rmst" in key:
        return survival_body(rng)
    if "roc" in key or "pr_" in key or "calibration" in key:
        return roc_body(rng)
    if "umap" in key or "tsne" in key or "spatial" in cat or "病理图像" in category:
        return spatial_body(rng)
    if "network" in cat or "cellchat" in key or "circle" in key or "graph" in key:
        return network_body(rng)
    if "enrich" in cat or "富集" in category or "bar" in key:
        return bar_body(rng)
    if "教学" in category or "workflow" in key or "cartoon" in key:
        return flow_body(rng)
    if "line" in key or "trajectory" in key or "velocity" in key:
        return survival_body(rng)
    return bar_body(rng)


def make_svg(plot: dict, index: int) -> str:
    rng = random.Random(18000 + index)
    title = plot.get("zh_name") or plot.get("en_name") or plot["id"]
    subtitle = f"{plot.get('category', 'plot')} / {plot.get('en_name', plot['id'])}"
    body = choose_body(plot["id"], plot.get("category", ""), rng)
    return svg_base(title, subtitle, body)


def main() -> None:
    plots = json.loads(PLOTS_JSON.read_text(encoding="utf-8"))
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    optional_fixed = 0
    source_fixed = 0
    for idx, plot in enumerate(plots, start=1):
        for field in plot.get("plot_data_contract", []):
            if str(field.get("field", "")).endswith("_optional") and field.get("required", True):
                field["required"] = False
                optional_fixed += 1
        if plot["id"] in SOURCE_FIXES:
            plot["public_source_example"] = SOURCE_FIXES[plot["id"]]
            source_fixed += 1
        zh = plot.get("zh_name", plot["id"])
        cat = plot.get("category", "科研图谱")
        fields = [f.get("field", "") for f in plot.get("plot_data_contract", []) if f.get("field")]
        plot.setdefault("recommended_tools", [
            "R/ggplot2优先",
            f"{cat}专用数据审查",
            f"{zh}字段契约检查",
            "导师/统计复核",
        ])
        plot["detail_teacher_checklist"] = [
            f"这张{zh}是否直接回答：{plot.get('question_answered', '当前研究问题')}？",
            f"字段是否覆盖最小契约：{', '.join(fields[:6])}？",
            "示例图是否明确标注为合成教学图或教学改绘图？",
            "正式出图是否保留用户自己的source data、脚本、参数和复核记录？",
        ]
        plot["source_data_expectation"] = f"{zh}正式使用时应提供原始字段表、清洗脚本、统计前提、图形代码和人工复核记录。"
        plot["allowed_use"] = "教学示例、方法理解、字段审查和模型提示词构建；不得作为真实研究结果或临床诊断依据。"
        svg_path = SVG_DIR / f"plot_{plot['id']}.svg"
        svg_path.write_text(make_svg(plot, idx), encoding="utf-8")
        plot["example_visual"] = {
            **plot.get("example_visual", {}),
            "title": f"{zh} 语义匹配教学示例图",
            "url": f"/outputs/round11_detail_plots/plot_{plot['id']}.svg",
            "reuse_boundary": "示例图由本地脚本使用合成教学数据生成，只说明图形结构和字段需求；正式论文出图必须替换为用户自己的可审查数据。",
            "source_note": "本图不是论文原图，不复制受版权保护图像，不代表真实研究结果。",
            "semantic_visual_status": "round18-method-matched-svg",
        }
    PLOTS_JSON.write_text(json.dumps(plots, ensure_ascii=False, indent=2), encoding="utf-8")
    REPORT.write_text(
        "\n".join([
            "# Round18 图谱数据质量升级报告",
            "",
            f"- 重绘语义匹配SVG：{len(plots)} 张",
            f"- 修复 optional 字段 required 语义：{optional_fixed} 处",
            f"- 修复占位公开来源：{source_fixed} 条",
            "- 为每个图谱补充 recommended_tools、detail_teacher_checklist、source_data_expectation、allowed_use。",
            "",
            "## 边界",
            "所有示例图均为合成教学视觉，不复制论文原图，不代表真实研究结果；正式科研必须替换为用户自己的可审查数据和脚本。",
            "",
            "## 已核对外部来源线索",
            "- BLCA TCGA Nature 2014: PubMed 24476821",
            "- LAML TCGA NEJM 2013: PubMed 23634996",
            "- ACC TCGA Cancer Cell 2016: PubMed 27165744（本轮未直接用于修复条目）",
            "- CAMELYON16 JAMA 2017: PubMed 29234806",
        ]),
        encoding="utf-8",
    )
    print(f"updated {len(plots)} plots; optional_fixed={optional_fixed}; source_fixed={source_fixed}")


if __name__ == "__main__":
    main()

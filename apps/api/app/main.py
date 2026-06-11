from __future__ import annotations

import os
import re
from html import escape
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from .schemas import (
    ApiMessage,
    CompareDemo,
    CompareRunRequest,
    GovernanceAuditRequest,
    GovernanceAuditResponse,
    PlotGenerateRequest,
    PlotGenerateResponse,
    Plugin,
    ProviderTestRequest,
    ProviderTestResponse,
    SAFETY,
    SimulateCaseRequest,
    SimulatedCase,
    Skill,
    SkillBuilderRequest,
    SkillBuilderResponse,
)
from .store import ROOT, save_output, load_json


APP_DIR = Path(__file__).resolve().parents[3]
WEB_DIR = APP_DIR / "apps" / "web"
STATIC_DIR = WEB_DIR / "static"
INDEX_PATH = WEB_DIR / "index.html"
MANIFEST_PATH = WEB_DIR / "manifest.webmanifest"
SW_PATH = WEB_DIR / "sw.js"
OUTPUTS_DIR = APP_DIR / "outputs"

app = FastAPI(title="MedPath Research & Education Skills Studio API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:8000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

if OUTPUTS_DIR.exists():
    app.mount("/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="outputs")


@app.get("/manifest.webmanifest")
def web_manifest() -> FileResponse:
    return FileResponse(MANIFEST_PATH, media_type="application/manifest+json")


@app.get("/sw.js")
def service_worker() -> FileResponse:
    return FileResponse(SW_PATH, media_type="application/javascript")


def require_item(items: list[dict[str, Any]], item_id: str, name: str) -> dict[str, Any]:
    item = next((x for x in items if x["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail=f"{name} not found: {item_id}")
    return item


def normalized_article_workflows() -> list[dict[str, Any]]:
    raw = load_json("article_skill_workflows.json")
    if isinstance(raw, list):
        return raw
    rows = raw.get("article_types", []) if isinstance(raw, dict) else []
    normalized: list[dict[str, Any]] = []
    for index, item in enumerate(rows, 1):
        normalized.append(
            {
                "id": f"article-{index:02d}",
                "source_id": item.get("id", f"source-{index:02d}"),
                "type": item.get("zh_name") or item.get("type") or item.get("id", "文章类型"),
                "audience": item.get("target_user", "科研新手/研究生/青年教师"),
                "zero_to_one_path": item.get("zero_to_one_steps", item.get("zero_to_one_path", [])),
                "required_materials": item.get("required_inputs", item.get("required_materials", [])),
                "skills_to_call": item.get(
                    "skills_to_call",
                    ["research-copilot", "medical-kg-rag-builder", "ai-ethics-governor", "skill-eval-harness"],
                ),
                "llm_api_prompt_template": item.get("model_api_prompt_template", item.get("llm_api_prompt_template", "")),
                "quality_checks": item.get("quality_checklist", item.get("quality_checks", [])),
                "figures_needed": item.get("figures_needed", []),
                "safety_boundary": item.get("safety_boundary", SAFETY),
                "status": "workflow-template",
            }
        )
    return normalized


def normalized_plot_gallery() -> list[dict[str, Any]]:
    rows = load_json("plot_gallery_taxonomy.json")
    normalized: list[dict[str, Any]] = []
    for item in rows:
        name = item.get("name") or item.get("id") or item.get("en_name") or item.get("zh_name") or "plot"
        contract = item.get("plot_data_contract", [])
        required_fields = [
            str(field.get("field"))
            for field in contract
            if field.get("field") and field.get("required", True) and not str(field.get("field")).endswith("_optional")
        ]
        normalized.append(
            {
                **item,
                "name": name.replace("_plot", "").replace("_", "-") if "name" not in item else item["name"],
                "zh_name": item.get("zh_name", item.get("name", name)),
                "category": item.get("category", "???"),
                "answers_question": item.get("answers_question") or item.get("question_answered") or item.get("output_interpretation", ""),
                "what_it_needs": required_fields or item.get("what_it_needs") or item.get("required_columns", []),
                "example_status": item.get("example_status") or item.get("example_dataset_status", "synthetic/demo only"),
                "safety_note": item.get("safety_note", SAFETY),
            }
        )
    return normalized


def plot_demo_gallery_items() -> list[dict[str, Any]]:
    demo_dir = OUTPUTS_DIR / "round11_plots"
    specs = [
        {
            "file": "01_volcano_plot.svg",
            "title": "火山图示例",
            "method": "差异分析结果展示",
            "question": "哪些基因或蛋白在两组之间变化显著，且变化幅度有多大。",
            "input": "gene_id, log2FC, p_value, adjusted_p",
        },
        {
            "file": "02_heatmap.svg",
            "title": "表达热图示例",
            "method": "样本与特征聚类展示",
            "question": "样本之间是否存在表达模式分群，关键特征是否形成模块。",
            "input": "sample_id, feature_id, expression_value, group",
        },
        {
            "file": "03_forest_plot.svg",
            "title": "森林图示例",
            "method": "Meta分析效应量展示",
            "question": "多个研究的效应量是否方向一致，合并效应是否稳定。",
            "input": "study_id, effect_size, lower_ci, upper_ci, weight",
        },
        {
            "file": "04_umap_schematic.svg",
            "title": "UMAP降维图示例",
            "method": "单细胞/高维数据结构展示",
            "question": "细胞或样本在低维空间是否形成可解释的群体结构。",
            "input": "cell_id, embedding_1, embedding_2, cluster, annotation",
        },
        {
            "file": "05_alluvial_alternative.svg",
            "title": "流向/桑基替代图示例",
            "method": "分组流向与路径变化展示",
            "question": "样本、类型或阶段之间如何转移，哪条路径占比最高。",
            "input": "source, target, count, group",
        },
        {
            "file": "06_kaplan_meier_schematic.svg",
            "title": "Kaplan-Meier生存曲线示例",
            "method": "生存结局可视化",
            "question": "不同组别的生存曲线是否存在分离趋势。",
            "input": "sample_id, survival_time, event_status, group",
        },
        {
            "file": "07_roc_curve.svg",
            "title": "ROC曲线示例",
            "method": "分类模型判别能力展示",
            "question": "模型区分阳性和阴性样本的能力是否优于随机。",
            "input": "sample_id, true_label, predicted_score",
        },
        {
            "file": "08_precision_recall_curve.svg",
            "title": "PR曲线示例",
            "method": "不平衡分类模型评估",
            "question": "阳性样本较少时，模型的查准率和召回率如何权衡。",
            "input": "sample_id, true_label, predicted_score",
        },
        {
            "file": "09_confusion_matrix.svg",
            "title": "混淆矩阵示例",
            "method": "分类错误结构分析",
            "question": "模型主要把哪一类错分成哪一类。",
            "input": "sample_id, true_label, predicted_label",
        },
        {
            "file": "10_pca_scatter.svg",
            "title": "PCA散点图示例",
            "method": "高维数据整体结构展示",
            "question": "样本是否按组别形成整体分离或批次偏移。",
            "input": "sample_id, feature_matrix, group",
        },
        {
            "file": "11_enrichment_dotplot.svg",
            "title": "富集分析气泡图示例",
            "method": "通路富集结果展示",
            "question": "哪些通路富集程度高、显著性强且命中基因多。",
            "input": "term, gene_ratio, adjusted_p, count",
        },
        {
            "file": "12_lollipop_ranking.svg",
            "title": "棒棒糖排序图示例",
            "method": "特征重要性排序展示",
            "question": "哪些特征贡献最大，排序是否有明显梯度。",
            "input": "feature_id, score",
        },
        {
            "file": "13_correlation_scatter.svg",
            "title": "相关散点图示例",
            "method": "两个变量关系展示",
            "question": "两个连续变量之间是否存在趋势、相关或异常点。",
            "input": "sample_id, variable_x, variable_y, group",
        },
        {
            "file": "14_density_overlay.svg",
            "title": "密度分布叠加图示例",
            "method": "组间分布形状比较",
            "question": "不同组的数据分布是否偏移、变宽或出现多峰。",
            "input": "sample_id, value, group",
        },
        {
            "file": "15_paired_line_plot.svg",
            "title": "配对连线图示例",
            "method": "同一对象前后变化展示",
            "question": "同一样本或个体在干预前后是否出现一致方向变化。",
            "input": "subject_id, timepoint, value",
        },
        {
            "file": "16_missingness_map.svg",
            "title": "缺失值热图示例",
            "method": "数据完整性审查",
            "question": "哪些样本或变量存在系统性缺失。",
            "input": "sample_id, variable_id, is_missing",
        },
        {
            "file": "17_coefficient_plot.svg",
            "title": "回归系数图示例",
            "method": "模型参数与不确定性展示",
            "question": "哪些协变量方向明确，置信区间是否跨过零。",
            "input": "term, estimate, lower_ci, upper_ci",
        },
        {
            "file": "18_waterfall_plot.svg",
            "title": "瀑布图示例",
            "method": "个体变化幅度排序",
            "question": "样本的变化幅度如何排序，是否存在明显响应者群体。",
            "input": "sample_id, percent_change, group",
        },
    ]
    items: list[dict[str, Any]] = []
    for spec in specs:
        path = demo_dir / spec["file"]
        items.append(
            {
                **spec,
                "url": f"/outputs/round11_plots/{spec['file']}",
                "exists": path.exists(),
                "source": "R/ggplot2 synthetic-data demo",
                "status": "synthetic teaching demo; not real study result",
                "safety_boundary": SAFETY,
            }
        )
    public_example = OUTPUTS_DIR / "public_reproducible_examples" / "brca_tcga_mutation_type_distribution.svg"
    items.insert(
        0,
        {
            "file": "brca_tcga_mutation_type_distribution.svg",
            "title": "BRCA公开突变类型分布复现图",
            "method": "cBioPortal公开API + R/ggplot2教学改绘",
            "question": "在公开乳腺癌队列中，常见基因的突变记录和突变类型如何分布。",
            "input": "study_id, sample_list_id, entrez_gene_ids, mutation_type",
            "url": "/outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.svg",
            "exists": public_example.exists(),
            "source": "cBioPortal public REST API; BRCA TCGA PanCancer Atlas",
            "status": "public API teaching re-plot; not clinical result",
            "safety_boundary": SAFETY,
        },
    )
    return items


@app.get("/api/health", response_model=ApiMessage)
def health() -> ApiMessage:
    return ApiMessage(status="ok")


@app.get("/api/plugins", response_model=list[Plugin])
def list_plugins() -> list[dict[str, Any]]:
    return load_json("plugins.json")


@app.get("/api/plugins/{plugin_id}", response_model=Plugin)
def get_plugin(plugin_id: str) -> dict[str, Any]:
    return require_item(load_json("plugins.json"), plugin_id, "plugin")


@app.get("/api/skills", response_model=list[Skill])
def list_skills() -> list[dict[str, Any]]:
    return load_json("skills.json")


@app.get("/api/skills/{skill_id}", response_model=Skill)
def get_skill(skill_id: str) -> dict[str, Any]:
    return require_item(load_json("skills.json"), skill_id, "skill")


@app.post("/api/simulate/case", response_model=SimulatedCase)
def simulate_case(payload: SimulateCaseRequest) -> dict[str, Any]:
    cases = load_json("synthetic_cases.json")
    candidates = [
        c
        for c in cases
        if payload.disease_system in c["disease_system"]
        or payload.organ_system in c["organ_system"]
        or payload.difficulty == c["difficulty"]
    ]
    base = dict((candidates or cases)[0])
    base["id"] = "generated-" + base["id"]
    base["title"] = f"{payload.organ_system}{payload.disease_system}合成教学案例"
    base["difficulty"] = payload.difficulty
    base["teaching_goal"] = payload.teaching_goal
    base["boundary"] = "合成教学案例，不是真实患者，不用于临床诊断，需教师复核。"
    return base


@app.get("/api/simulate/cases", response_model=list[SimulatedCase])
def list_cases() -> list[dict[str, Any]]:
    return load_json("synthetic_cases.json")


@app.get("/api/simulate/cases/{case_id}", response_model=SimulatedCase)
def get_case(case_id: str) -> dict[str, Any]:
    return require_item(load_json("synthetic_cases.json"), case_id, "case")


@app.post("/api/compare/run", response_model=CompareDemo)
def run_compare(payload: CompareRunRequest) -> dict[str, Any]:
    return require_item(load_json("comparison_demos.json"), payload.task_id, "comparison demo")


@app.get("/api/compare/demos", response_model=list[CompareDemo])
def list_compare_demos() -> list[dict[str, Any]]:
    return load_json("comparison_demos.json")


@app.get("/api/open-source")
def list_open_source(q: str = "", category: str = "") -> list[dict[str, Any]]:
    items = load_json("open_source_catalog.json")
    if q:
        ql = q.lower()
        items = [x for x in items if ql in (x["name"] + x["category"] + x["short_description"]).lower()]
    if category:
        items = [x for x in items if x["category"] == category]
    return items


@app.get("/api/open-source/categories")
def open_source_categories() -> list[str]:
    return sorted({x["category"] for x in load_json("open_source_catalog.json")})


@app.get("/api/public-example-sources")
def list_public_example_sources(q: str = "", limit: int = 120) -> list[dict[str, Any]]:
    items = load_json("public_example_sources.json")
    if q:
        ql = q.lower()
        items = [
            x for x in items
            if ql in f"{x.get('title','')} {x.get('description','')} {x.get('citation','')} {x.get('source_platform','')} {x.get('cancer_type','')}".lower()
        ]
    return items[: max(1, min(limit, 300))]


@app.get("/api/public-source-visuals")
def list_public_source_visuals(source_id: str = "") -> list[dict[str, Any]]:
    items = load_json("public_source_visual_examples.json")
    if source_id:
        items = [x for x in items if source_id in x.get("source_ids", [])]
    return items


@app.get("/api/open-source/{tool_id}")
def get_open_source_tool(tool_id: str) -> dict[str, Any]:
    return require_item(load_json("open_source_catalog.json"), tool_id, "open source tool")


def find_plot_spec(plot_key: str) -> dict[str, Any]:
    key = str(plot_key or "").lower().replace("_plot", "")
    plots = normalized_plot_gallery()
    return next(
        (
            item
            for item in plots
            if str(item.get("id", "")).lower() == str(plot_key or "").lower()
            or str(item.get("name", "")).lower() == key
            or str(item.get("id", "")).lower().replace("_plot", "") == key
            or key in str(item.get("zh_name", "")).lower()
        ),
        plots[0] if plots else {},
    )


def make_svg(plot_type: str, plot: dict[str, Any] | None = None) -> str:
    plot = plot or find_plot_spec(plot_type)
    title = escape(str(plot.get("zh_name") or plot.get("name") or plot_type))
    category = escape(str(plot.get("category") or "Research plot"))
    fields = [str(x) for x in plot.get("what_it_needs", [])][:6]
    field_text = escape(" / ".join(fields) or "fields pending")
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="820" height="460" viewBox="0 0 820 460">
<rect width="820" height="460" rx="28" fill="#fffaf0"/>
<rect x="34" y="34" width="752" height="392" rx="24" fill="#ffffff" stroke="#d7c7a6" stroke-width="2"/>
<text x="74" y="88" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#182033">{title}</text>
<text x="74" y="122" font-family="Arial, sans-serif" font-size="15" fill="#667085">{category} / synthetic teaching schematic</text>
<line x1="104" y1="340" x2="714" y2="340" stroke="#344054" stroke-width="2"/>
<line x1="104" y1="340" x2="104" y2="150" stroke="#344054" stroke-width="2"/>
<path d="M130 302 C210 250, 244 286, 306 230 S430 170, 506 212 S634 182, 690 132" fill="none" stroke="#0f766e" stroke-width="5" stroke-linecap="round"/>
<circle cx="166" cy="283" r="10" fill="#2563eb"/><circle cx="306" cy="230" r="10" fill="#0f766e"/><circle cx="506" cy="212" r="10" fill="#f59e0b"/><circle cx="690" cy="132" r="10" fill="#ef4444"/>
<rect x="126" y="372" width="568" height="30" rx="15" fill="#f2f4f7"/>
<text x="410" y="393" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#475467">required fields: {field_text}</text>
<text x="410" y="438" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#7a5f2b">Synthetic teaching figure only; replace with auditable user data for real research.</text>
</svg>'''


@app.post("/api/plot/generate", response_model=PlotGenerateResponse)
def generate_plot(payload: PlotGenerateRequest) -> PlotGenerateResponse:
    plot_key = payload.plot_id or payload.plot_type
    plot = find_plot_spec(plot_key)
    svg = make_svg(plot_key, plot)
    output_name = str(plot.get("id") or plot_key or "plot")
    save_output(f"plot/{output_name}.svg", svg)
    return PlotGenerateResponse(
        plot_type=str(plot.get("zh_name") or plot.get("name") or output_name),
        svg=svg,
        caption=f"{plot.get('zh_name') or output_name} 静态教学SVG示意，不代表真实研究结果。",
        methods_text=str(plot.get("r_ggplot_hint") or "真实作图需使用用户自己的数据、脚本和人工复核。"),
        download_name=f"{output_name}.svg",
    )


@app.post("/api/plot/advice")
def plot_advice(payload: dict[str, Any]) -> dict[str, Any]:
    plot_type = str(payload.get("plot_type") or "scatter").lower().replace("_plot", "")
    columns = [str(x).strip() for x in payload.get("columns", []) if str(x).strip()]
    description = str(payload.get("description") or "")
    plots = normalized_plot_gallery()
    plot = next(
        (
            item
            for item in plots
            if str(item.get("name", "")).lower() == plot_type
            or str(item.get("id", "")).lower().replace("_plot", "") == plot_type
            or plot_type in str(item.get("zh_name", "")).lower()
        ),
        plots[0] if plots else {},
    )
    required = [str(x) for x in plot.get("what_it_needs", [])]
    normalized_columns = {c.lower() for c in columns}
    missing = [field for field in required if field.lower() not in normalized_columns]
    audit_payload = {"description": f"{description} {' '.join(columns)}", "columns": columns}
    audit = run_data_audit(audit_payload)
    return {
        "plot_type": plot_type,
        "plot_name": plot.get("zh_name") or plot.get("name") or plot_type,
        "question_answered": plot.get("answers_question", ""),
        "required_columns": required,
        "provided_columns": columns,
        "missing_columns": missing,
        "data_ready": not missing,
        "audit_hits": audit["matched_rules"][:5],
        "next_steps": [
            "先补齐缺失字段或说明字段含义。",
            "确认数据来源、伦理边界和是否包含真实患者隐私。",
            "用合成或公开示例先跑图，不把示例结果写成真实结论。",
            "真实作图前保留 source data、脚本、版本和教师/导师复核记录。",
        ],
        "model_prompt": (
            f"我想绘制{plot.get('zh_name') or plot_type}，已有字段：{', '.join(columns) or '待填写'}。"
            f"请检查字段是否满足绘图要求，指出缺失字段、数据整理步骤、R/ggplot2绘图思路和不能夸大的结论。"
            "不得编造真实统计结果、p值或临床结论。"
        ),
        "safety": SAFETY,
    }


@app.get("/api/methods")
def list_methods() -> list[dict[str, Any]]:
    return load_json("method_cards.json")


@app.get("/api/methods/{method_id}")
def get_method(method_id: str) -> dict[str, Any]:
    return require_item(load_json("method_cards.json"), method_id, "method")


@app.get("/api/method-guides")
def list_method_guides() -> list[dict[str, Any]]:
    return load_json("method_learning_guides.json")


@app.get("/api/method-universe")
def list_method_universe(q: str = "", category: str = "", limit: int = 120) -> list[dict[str, Any]]:
    items = load_json("method_universe.json")
    if q:
        ql = q.lower()
        items = [
            x
            for x in items
            if ql
            in " ".join(
                [
                    str(x.get("name", "")),
                    str(x.get("category", "")),
                    str(x.get("beginner_question", "")),
                    str(x.get("what_it_solves", "")),
                    " ".join(x.get("tools", [])),
                ]
            ).lower()
        ]
    if category:
        items = [x for x in items if x.get("category") == category]
    return items[: max(1, min(limit, 1000))]


@app.get("/api/method-universe/categories")
def method_universe_categories() -> list[str]:
    return sorted({x.get("category", "未分类") for x in load_json("method_universe.json")})


@app.get("/api/method-universe/{method_id}")
def get_method_universe_item(method_id: str) -> dict[str, Any]:
    return require_item(load_json("method_universe.json"), method_id, "method universe item")


@app.get("/api/gene-perturbation-methods")
def list_gene_perturbation_methods() -> list[dict[str, Any]]:
    return load_json("gene_perturbation_methods.json")


@app.get("/api/article-workflows")
def list_article_workflows() -> list[dict[str, Any]]:
    return normalized_article_workflows()


@app.get("/api/article-workflows/{workflow_id}")
def get_article_workflow(workflow_id: str) -> dict[str, Any]:
    return require_item(normalized_article_workflows(), workflow_id, "article workflow")


@app.post("/api/article-workflows/build")
def build_article_workflow(payload: dict[str, Any]) -> dict[str, Any]:
    workflow = require_item(normalized_article_workflows(), payload.get("workflow_id", "article-01"), "article workflow")
    topic = payload.get("topic") or "待填写研究主题"
    return {
        "status": "draft-workflow-package",
        "article_type": workflow["type"],
        "topic": topic,
        "note": "本任务包用于从0搭建写作流程；不会生成或伪造真实研究结果。",
        "materials": workflow["required_materials"],
        "steps": workflow["zero_to_one_path"],
        "skills_to_call": workflow["skills_to_call"],
        "quality_checks": workflow["quality_checks"],
        "model_prompt": f"研究主题：{topic}\n文章类型：{workflow['type']}\n请按规范生成研究问题、数据/材料清单、方法流程、图表计划、伦理边界、引用核验清单和导师复核清单。不得编造结果或引用。",
        "human_review_required": True,
        "safety": SAFETY,
    }


@app.get("/api/plot-gallery")
def list_plot_gallery(q: str = "", category: str = "", limit: int = 160) -> list[dict[str, Any]]:
    items = normalized_plot_gallery()
    if q:
        ql = q.lower()
        items = [
            x
            for x in items
            if ql in f"{x.get('name','')} {x.get('category','')} {x.get('answers_question','')}".lower()
        ]
    if category:
        items = [x for x in items if x.get("category") == category]
    return items[: max(1, min(limit, 240))]


@app.get("/api/plot-demo-gallery")
def list_plot_demo_gallery() -> list[dict[str, Any]]:
    return plot_demo_gallery_items()


@app.get("/api/data-audit-rules")
def list_data_audit_rules() -> list[dict[str, Any]]:
    return load_json("data_audit_rules.json")


@app.post("/api/data-audit/run")
def run_data_audit(payload: dict[str, Any]) -> dict[str, Any]:
    text = f"{payload.get('description','')} {' '.join(payload.get('columns', []))}"
    rules = load_json("data_audit_rules.json")
    hits: list[dict[str, Any]] = []
    for rule in rules:
        topic = rule.get("topic") or rule.get("rule_name") or rule.get("applies_to") or ""
        if topic and topic in text:
            hits.append(rule)
    if not hits:
        preferred = [r for r in rules if r.get("severity") in {"critical", "high", "warning"}]
        hits = (preferred or rules)[:6]
    normalized_hits = [
        {
            **r,
            "topic": r.get("topic") or r.get("rule_name") or r.get("applies_to") or r.get("id", "audit-rule"),
            "level": r.get("level") or r.get("applies_to") or "data audit",
            "check": r.get("check") or r.get("check_logic_human") or "检查字段、隐私、统计前提和来源边界。",
            "how_to_fix": r.get("how_to_fix") or r.get("fix_suggestion") or "补充字段说明、来源证明、伦理边界和人工复核记录。",
        }
        for r in hits[:12]
    ]
    return {
        "status": "audit-template",
        "note": "\u672c\u5ba1\u67e5\u53ea\u7ed9\u51fa\u6570\u636e\u6574\u7406\u4e0e\u98ce\u9669\u63d0\u793a\uff0c\u4e0d\u751f\u6210\u771f\u5b9e\u7edf\u8ba1\u7ed3\u679c\u3002",
        "matched_rules": normalized_hits,
        "recommended_next_steps": [
            "????????????????????????",
            "\u6807\u6ce8\u6750\u6599\u6765\u6e90\uff1a\u516c\u5f00\u3001\u8131\u654f\u3001\u5408\u6210\u6216\u5f85\u6388\u6743\u3002",
            "?????????/???????",
            "???????????????????",
        ],
    }



@app.get("/api/island/buildings")
def list_island_buildings() -> list[dict[str, Any]]:
    return load_json("research_island_buildings.json")


@app.get("/api/pet/dialogues")
def list_pet_dialogues() -> list[dict[str, Any]]:
    return load_json("pet_dialogues.json")


@app.post("/api/skill-builder/generate", response_model=SkillBuilderResponse)
def generate_skill(payload: SkillBuilderRequest) -> SkillBuilderResponse:
    slug = re.sub(r"[^a-z0-9-]+", "-", payload.name.lower()).strip("-") or "custom-skill"
    skill_md = f"""---
name: {slug}
description: {payload.task}
---

# {payload.zh_name}

## 任务说明
{payload.task}

## 输入
{payload.inputs}

## 输出
{payload.outputs}

## 安全边界
{payload.risk_boundary}
"""
    plugin = {
        "id": slug,
        "zh_name": payload.zh_name,
        "description": payload.task,
        "status": "generated-preview",
        "safety": payload.risk_boundary,
    }
    eval_yaml = "rubric:\n  - 任务边界\n  - 输出质量\n  - 引用核验\n  - 安全边界\n"
    readme = f"# {payload.zh_name}\n\n由Skill Builder生成的GitHub-ready预览目录。\n"
    base = f"skill_builder/{slug}"
    downloads = {
        "SKILL.md": save_output(f"{base}/SKILL.md", skill_md),
        "plugin.json": save_output(f"{base}/plugin.json", __import__("json").dumps(plugin, ensure_ascii=False, indent=2)),
        "eval.yaml": save_output(f"{base}/eval.yaml", eval_yaml),
        "README.md": save_output(f"{base}/README.md", readme),
    }
    return SkillBuilderResponse(skill_md=skill_md, plugin_json=plugin, eval_yaml=eval_yaml, readme=readme, downloads=downloads)


@app.get("/api/providers")
def list_providers() -> list[dict[str, Any]]:
    providers = load_json("providers.json")
    for provider in providers:
        provider["configured"] = bool(os.getenv(provider["id"].upper().replace("-", "_") + "_API_KEY"))
    return providers


@app.post("/api/providers/test", response_model=ProviderTestResponse)
def provider_test(payload: ProviderTestRequest) -> ProviderTestResponse:
    env_key = payload.provider_id.upper().replace("-", "_") + "_API_KEY"
    configured = bool(os.getenv(env_key))
    return ProviderTestResponse(
        provider_id=payload.provider_id,
        configured=configured,
        mode="configured" if configured else "mock",
        message="未检测到本地环境变量，已使用mock连接测试。" if not configured else "已检测到环境变量；未在日志中显示Key。",
    )


def provider_config_status(provider: dict[str, Any]) -> dict[str, Any]:
    env = provider.get("env", {})
    api_key_var = env.get("api_key") or f"{provider.get('id', '').upper()}_API_KEY"
    base_url_var = env.get("base_url") or f"{provider.get('id', '').upper()}_BASE_URL"
    model_var = env.get("model") or f"{provider.get('id', '').upper()}_MODEL"
    return {
        "api_key_env": api_key_var,
        "base_url_env": base_url_var,
        "model_env": model_var,
        "configured": bool(api_key_var and os.getenv(api_key_var)),
        "base_url_configured": bool(base_url_var and os.getenv(base_url_var)),
        "model_configured": bool(model_var and os.getenv(model_var)),
        "base_url_preview": os.getenv(base_url_var, provider.get("default_base_url", "local")) if base_url_var else "local",
        "model_preview": os.getenv(model_var, provider.get("default_model", "mock-medpath-reviewer")) if model_var else "mock-medpath-reviewer",
    }


@app.get("/api/model-gateway/templates")
def model_gateway_templates() -> dict[str, Any]:
    data = load_json("model_gateway_templates.json")
    providers = []
    for provider in data.get("providers", []):
        item = dict(provider)
        item["config_status"] = provider_config_status(provider)
        providers.append(item)
    data["providers"] = providers
    return data


@app.post("/api/model-gateway/normalize")
def normalize_model_gateway_request(payload: dict[str, Any]) -> dict[str, Any]:
    data = load_json("model_gateway_templates.json")
    provider_id = payload.get("provider_id") or "local_mock"
    task_type = payload.get("task_type") or "case_generation"
    provider = next((p for p in data.get("providers", []) if p.get("id") == provider_id), None) or data["providers"][-1]
    task = next((t for t in data.get("task_types", []) if t.get("id") == task_type), None) or data["task_types"][0]
    config = provider_config_status(provider)
    prompt = str(payload.get("prompt") or "请根据教学目标生成一个可复核的医学教育任务草案。")
    audience = payload.get("audience") or "科研新手/课程教师/学生"
    requested_format = payload.get("output_format") or "json"
    mode = "configured" if config["configured"] else "mock"
    return {
        "provider_id": provider["id"],
        "provider_name": provider["name"],
        "mode": mode,
        "task_type": task["id"],
        "task_name": task["zh_name"],
        "base_url_env": config["base_url_env"],
        "model_env": config["model_env"],
        "api_key_env": config["api_key_env"],
        "api_key_visible": False,
        "request": {
            "model": config["model_preview"],
            "messages": [
                {
                    "role": "system",
                    "content": "你是医学教育AI Skills工作流助手。所有输出仅用于教学与科研训练，不替代临床诊断；不得编造真实患者、真实试点、真实引用或真实结果。",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            "response_format": requested_format,
            "metadata": {
                "audience": audience,
                "recommended_skills": task.get("recommended_skills", []),
                "output_schema": task.get("output_schema", []),
                "review_focus": task.get("review_focus", []),
            },
        },
        "beginner_explanation": [
            "provider 表示你要接入哪一家模型服务。",
            "base_url 表示模型服务地址；Key 只放在环境变量里，不进入页面、代码或日志。",
            "task_type 决定调用哪些 Skill、输出哪些字段、需要哪些人工复核。",
            "mock 模式只用于演示流程，不代表真实模型能力。",
        ],
        "safety_checklist": [
            "不上传真实患者隐私信息。",
            "不把模型输出当作临床诊断。",
            "引用、图表、统计结果和教学材料均需人工核验。",
            "未配置 API Key 时自动进入 mock 模式。",
        ],
    }


@app.post("/api/model-gateway/mock-generate")
def mock_model_gateway_generate(payload: dict[str, Any]) -> dict[str, Any]:
    normalized = normalize_model_gateway_request(payload)
    return {
        "status": "mock-output",
        "provider_id": normalized["provider_id"],
        "mode": normalized["mode"],
        "task_name": normalized["task_name"],
        "result": {
            "summary": f"已根据“{normalized['task_name']}”生成一份演示型任务包。",
            "workflow": normalized["request"]["metadata"]["recommended_skills"],
            "output_schema": normalized["request"]["metadata"]["output_schema"],
            "review_focus": normalized["request"]["metadata"]["review_focus"],
            "teacher_review_required": True,
            "note": "这是本地 mock 输出，用于展示模型网关和 Skill 调度格式；未调用真实模型，不代表真实研究结果。",
        },
        "normalized_request": normalized,
        "safety": SAFETY,
    }


@app.post("/api/governance/audit", response_model=GovernanceAuditResponse)
def governance_audit(payload: GovernanceAuditRequest) -> GovernanceAuditResponse:
    flags: list[str] = []
    text = payload.text
    if any(x in text for x in ["身份证", "手机号", "住院号", "病理号"]):
        flags.append("隐私风险")
    if any(x in text for x in ["治疗方案", "立即用药", "临床诊断"]):
        flags.append("临床误导")
    if any(x in text for x in ["编造文献", "不存在的DOI", "虚假引用"]):
        flags.append("伪造引用")
    if not flags:
        flags.append("未发现高风险触发词，仍需人工复核")
    return GovernanceAuditResponse(risk_flags=flags, allowed_for_teaching="隐私风险" not in flags, human_review_required=True)


@app.get("/api/audit/logs")
def audit_logs() -> list[dict[str, str]]:
    return [{"time": "mock", "event": "local audit", "note": "不记录API Key，不处理真实患者隐私"}]


@app.get("/{path:path}", response_class=HTMLResponse)
def frontend(path: str = "") -> str:
    if not INDEX_PATH.exists():
        raise HTTPException(status_code=404, detail="frontend index missing")
    return INDEX_PATH.read_text(encoding="utf-8")

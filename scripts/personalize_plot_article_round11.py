from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
PLOT_PATH = DATA / "plot_gallery_taxonomy.json"
ARTICLE_PATH = DATA / "article_skill_workflows.json"
SOURCE_PATH = DATA / "public_example_sources.json"
REPORT = ROOT / "docs" / "round11_plot_article_personalization_report.md"


DEMO_VISUALS = [
    ("01_volcano_plot.svg", "火山图教学改绘示例", "差异信号筛选"),
    ("02_heatmap.svg", "表达热图教学改绘示例", "样本聚类与特征模块"),
    ("03_forest_plot.svg", "森林图教学改绘示例", "证据合成和效应量"),
    ("04_umap_schematic.svg", "UMAP教学改绘示例", "高维结构和细胞群"),
    ("05_alluvial_alternative.svg", "流向图教学改绘示例", "状态流转和路径占比"),
    ("06_kaplan_meier_schematic.svg", "生存曲线教学改绘示例", "时间结局和分组趋势"),
    ("07_roc_curve.svg", "ROC教学改绘示例", "模型判别能力"),
    ("08_precision_recall_curve.svg", "PR曲线教学改绘示例", "不平衡分类评价"),
    ("09_confusion_matrix.svg", "混淆矩阵教学改绘示例", "模型错误结构"),
    ("10_pca_scatter.svg", "PCA教学改绘示例", "整体结构和批次趋势"),
    ("11_enrichment_dotplot.svg", "富集气泡图教学改绘示例", "通路和功能解释"),
    ("12_lollipop_ranking.svg", "棒棒糖排序图教学改绘示例", "特征重要性排序"),
    ("13_correlation_scatter.svg", "相关散点图教学改绘示例", "连续变量关系"),
    ("14_density_overlay.svg", "密度叠加图教学改绘示例", "组间分布形状"),
    ("15_paired_line_plot.svg", "配对连线图教学改绘示例", "前后变化和配对设计"),
    ("16_missingness_map.svg", "缺失值热图教学改绘示例", "数据完整性审查"),
    ("17_coefficient_plot.svg", "回归系数图教学改绘示例", "模型参数和不确定性"),
    ("18_waterfall_plot.svg", "瀑布图教学改绘示例", "个体响应排序"),
]

ARTICLE_REPORTING = {
    "Meta分析": "PRISMA流程、PICO、检索式、风险偏倚、森林图和异质性解释",
    "系统综述": "研究问题、数据库检索、纳排标准、证据表和质量评价",
    "网状Meta分析": "干预网络、传递性、一致性、排序概率和敏感性分析",
    "机器学习预测模型论文": "TRIPOD/PROBAST、训练验证划分、校准、决策曲线和外部验证",
    "数字病理论文": "图像来源、标注一致性、训练验证拆分、ROC/混淆矩阵和可解释性",
    "单细胞分析论文": "质控、聚类注释、差异状态、轨迹或通讯分析和批次处理",
    "空间转录组论文": "空间坐标、组织区域、空间域、配体受体和病理区域解释",
    "教学改革论文": "教学问题、课程设计、评价量规、学生反馈和伦理边界",
}


def stable_index(text: str, n: int) -> int:
    return int(hashlib.sha256(text.encode("utf-8")).hexdigest()[:8], 16) % n


def source_for(key: str, sources: list[dict]) -> dict:
    return sources[stable_index(key, len(sources))] if sources else {
        "title": "待补充公开来源",
        "citation": "待核对正式引用",
        "pmid": "待核对",
        "url": "#",
        "tier": "待核对",
        "reuse_boundary": "待核对数据许可。",
        "source_platform": "待核对",
    }


def visual_for(key: str) -> dict:
    file, title, fit = DEMO_VISUALS[stable_index(key, len(DEMO_VISUALS))]
    return {
        "title": title,
        "url": f"/outputs/round11_plots/{file}",
        "fit": fit,
        "reuse_boundary": "教学改绘或合成示例图，不代表真实研究结果；正式论文须替换为可授权数据。",
    }


def personalize_plot(item: dict, sources: list[dict]) -> dict:
    key = item.get("id") or item.get("zh_name") or item.get("en_name") or "plot"
    source = source_for(f"plot::{key}", sources)
    visual = visual_for(f"plot::{key}")
    zh = item.get("zh_name") or item.get("name") or key
    en = item.get("en_name") or key.replace("_", " ")
    question = item.get("question_answered") or item.get("answers_question") or "解释数据中的关键模式。"
    required = item.get("required_columns") or item.get("what_it_needs") or []
    item.update({
        "plot_product_title": f"{zh}：先确认数据字段，再回答“{question[:32]}”",
        "plot_hero_subtitle": f"{zh}（{en}）适合回答特定科研问题，而不是为了让页面好看才使用。新手应先核对字段、设计和结论边界。",
        "plot_when_to_use": f"当你的核心问题是“{question}”时，可以考虑使用{zh}。如果数据没有分组、估计量、结局或不确定性字段，应先补数据，不要强行出图。",
        "plot_data_contract": [
            {"field": str(col), "meaning": f"{zh}需要的核心字段", "required": True} for col in required[:8]
        ],
        "plot_story_sections": [
            {"title": "先问它回答什么", "body": f"{zh}服务的是一个具体问题：{question}。图形选择必须从问题出发，而不是从模板出发。"},
            {"title": "再看数据够不够", "body": f"至少需要这些字段：{', '.join(required) if required else '待根据数据结构确认'}。字段缺失时先去数据审查室。"},
            {"title": "然后解释图形语言", "body": f"读图时要同时说明尺度、样本量、不确定性和分析假设，不能只描述颜色或高低。"},
            {"title": "最后回到复核", "body": "真实论文出图前应由导师或统计/领域专家复核，确认图形与结论一一对应。"},
        ],
        "public_source_example": source,
        "example_visual": visual,
        "model_gateway_prompt_template": (
            f"请作为科研绘图教练，围绕{zh}帮助我检查数据字段、选择图形、写出R/ggplot2绘图步骤、"
            "解释常见错误，并生成导师复核清单。不得编造真实数据或论文结论。"
        ),
        "unique_detail_status": "round11-plot-personalized",
    })
    return item


def personalize_article(item: dict, sources: list[dict]) -> dict:
    key = item.get("id") or item.get("type") or "article"
    source = source_for(f"article::{key}", sources)
    visual = visual_for(f"article::{key}")
    atype = item.get("type") or "文章类型"
    report_hint = next((v for k, v in ARTICLE_REPORTING.items() if k in atype), "研究问题、材料、方法、图表、引用核验和导师复核")
    item.update({
        "article_product_title": f"{atype}：从空白选题到可复核写作流程",
        "article_hero_subtitle": f"{atype}不是让模型直接代写文章，而是把研究问题、数据来源、方法流程、图表证据和复核责任组织起来。",
        "article_reporting_focus": report_hint,
        "article_story_sections": [
            {"title": "先把问题写成可检索或可验证的问题", "body": f"{atype}的第一步不是写摘要，而是确认研究对象、比较对象、结局或评价目标。"},
            {"title": "材料清单决定文章边界", "body": "数据、文献、课程材料或案例来源不清时，只能生成流程草案，不能生成真实结论。"},
            {"title": "图表服务证据链", "body": f"本类型文章重点关注：{report_hint}。每张图都要能支持一个明确论点。"},
            {"title": "AI只做结构化辅助", "body": "模型可以帮你生成提纲、检查表和草稿，但引用、数据和结论必须由人核验。"},
        ],
        "public_source_example": source,
        "example_visual": visual,
        "model_gateway_prompt_template": (
            f"请作为论文流程教练，围绕{atype}从0搭建写作流程：研究问题、材料清单、方法步骤、图表计划、"
            "引用核验、伦理边界、导师复核和投稿前检查。不得编造数据、p值、引用或审稿意见。"
        ),
        "unique_detail_status": "round11-article-personalized",
    })
    return item


def main() -> None:
    sources = json.loads(SOURCE_PATH.read_text(encoding="utf-8-sig")) if SOURCE_PATH.exists() else []
    plots = json.loads(PLOT_PATH.read_text(encoding="utf-8-sig"))
    articles = json.loads(ARTICLE_PATH.read_text(encoding="utf-8-sig"))
    plots = [personalize_plot(item, sources) for item in plots]
    articles = [personalize_article(item, sources) for item in articles]
    PLOT_PATH.write_text(json.dumps(plots, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ARTICLE_PATH.write_text(json.dumps(articles, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    plot_titles = [p["plot_product_title"] for p in plots]
    article_titles = [a["article_product_title"] for a in articles]
    REPORT.write_text(
        "# Round11 图谱与文章工作流个性化报告\n\n"
        f"- 图谱数量：{len(plots)}；唯一标题：{len(set(plot_titles))}\n"
        f"- 文章流程数量：{len(articles)}；唯一标题：{len(set(article_titles))}\n"
        f"- 公开来源数量：{len(sources)}\n"
        "- 每个图谱已补充：产品标题、适用说明、数据契约、四段式解释、公开来源、示例图、模型网关提示。\n"
        "- 每个文章流程已补充：产品标题、写作边界、报告重点、四段式解释、公开来源、示例图、模型网关提示。\n"
        "- 真实性边界：公开来源只作检索线索；示例图为教学改绘或合成演示；不复制论文原图，不伪造研究结论。\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "plots": len(plots),
        "unique_plot_titles": len(set(plot_titles)),
        "articles": len(articles),
        "unique_article_titles": len(set(article_titles)),
        "sources": len(sources),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

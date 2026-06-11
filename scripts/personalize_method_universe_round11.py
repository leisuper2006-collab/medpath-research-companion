from __future__ import annotations

import json
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
METHOD_PATH = DATA / "method_universe.json"
SOURCE_PATH = DATA / "public_example_sources.json"
REPORT = ROOT / "docs" / "round11_method_personalization_report.md"

PLOTS = [
    {"file": "01_volcano_plot.svg", "label": "火山图", "fit": "差异信号和候选靶点筛选"},
    {"file": "02_heatmap.svg", "label": "表达热图", "fit": "样本分群、特征模块和表达模式"},
    {"file": "03_forest_plot.svg", "label": "森林图", "fit": "证据合成和效应量比较"},
    {"file": "04_umap_schematic.svg", "label": "UMAP降维图", "fit": "单细胞或高维样本结构"},
    {"file": "05_alluvial_alternative.svg", "label": "流向图", "fit": "分组、状态或路径转移"},
    {"file": "06_kaplan_meier_schematic.svg", "label": "生存曲线", "fit": "预后分层和时间结局"},
    {"file": "07_roc_curve.svg", "label": "ROC曲线", "fit": "分类模型判别能力"},
    {"file": "08_precision_recall_curve.svg", "label": "PR曲线", "fit": "类别不平衡下的模型评价"},
    {"file": "09_confusion_matrix.svg", "label": "混淆矩阵", "fit": "模型错误类型解析"},
    {"file": "10_pca_scatter.svg", "label": "PCA散点图", "fit": "整体结构、批次和分组趋势"},
    {"file": "11_enrichment_dotplot.svg", "label": "富集气泡图", "fit": "通路解释和功能聚类"},
    {"file": "12_lollipop_ranking.svg", "label": "棒棒糖排序图", "fit": "特征重要性和候选变量排序"},
    {"file": "13_correlation_scatter.svg", "label": "相关散点图", "fit": "连续变量关系和异常点检查"},
    {"file": "14_density_overlay.svg", "label": "密度叠加图", "fit": "组间分布形状比较"},
    {"file": "15_paired_line_plot.svg", "label": "配对连线图", "fit": "前后变化和配对设计"},
    {"file": "16_missingness_map.svg", "label": "缺失值热图", "fit": "数据完整性审查"},
    {"file": "17_coefficient_plot.svg", "label": "回归系数图", "fit": "模型参数和不确定性表达"},
    {"file": "18_waterfall_plot.svg", "label": "瀑布图", "fit": "个体响应幅度排序"},
]

CATEGORY_TONES = {
    "实验设计与扰动": ("从假设到验证", "重点是把扰动路线、对照设置和验证证据串起来。"),
    "基因敲除/扰动方法家族": ("从靶基因到功能证据", "重点是比较不同扰动层级，并把脱靶、效率和救援实验写清楚。"),
    "组学分析": ("从矩阵到机制解释", "重点是先审查矩阵和分组，再把差异、模块和通路解释连起来。"),
    "病理与影像": ("从图像材料到可复核判断", "重点是标注来源、训练验证分割和教学边界。"),
    "统计与机器学习": ("从变量到可解释模型", "重点是样本量、验证策略、指标选择和过拟合控制。"),
    "临床与证据合成": ("从PICO到证据等级", "重点是检索、纳排、偏倚和证据强度。"),
    "机制与计算模拟": ("从机制假设到模拟任务", "重点是参数、软件版本、dry-run和教学解释边界。"),
    "科研写作与伦理": ("从素材到合规稿件", "重点是报告规范、引用核验和AI参与披露。"),
    "数据清洗": ("从原始表到可分析数据", "重点是字段、缺失、异常、单位和处理记录。"),
    "AI辅助科研": ("从模型输出到责任链", "重点是结构化提示、引用核验、风险审计和人工确认。"),
    "开源工具与可复现流程": ("从脚本到可复现证据", "重点是环境、版本、示例数据和自动化检查。"),
}


def stable_index(text: str, modulo: int) -> int:
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return int(h[:8], 16) % modulo


def category_tone(category: str) -> tuple[str, str]:
    return CATEGORY_TONES.get(category, ("从问题到证据", "重点是让输入、流程、输出和复核边界都能被检查。"))


def build_story(item: dict, source: dict, plot: dict) -> dict:
    name = item.get("name", "该方法")
    method_code = str(item.get("id", "method")).replace("method-", "M")
    category = item.get("category", "科研方法")
    headline, principle = category_tone(category)
    verb = "判断"
    if "质量控制" in name or "数据清洗" in category:
        verb = "审查"
    elif "结果解读" in name or "富集" in name:
        verb = "解释"
    elif "进阶" in name or "模型" in name:
        verb = "优化"
    elif "常见误区" in name:
        verb = "避坑"
    return {
        "eyebrow": headline,
        "hero_title": f"{name} · {method_code}：{verb}问题、材料和证据能否对上",
        "hero_subtitle": f"{name}不是一个孤立按钮。{principle}新手进入这一页后，应先看适用场景，再看数据准备、示例图和导师复核问题。",
        "why_it_matters": f"在{category}场景中，{name}的价值在于把“我想做什么”翻译成可核验的输入字段、可执行步骤和可解释图表，避免把软件输出或模型回答直接写成结论。",
        "apple_style_sections": [
            {
                "title": "一眼判断是否适用",
                "body": f"如果你的问题需要{verb}某个变量、扰动、模型或证据链，先用这一节确认{name}是否真的匹配，而不是因为听起来高级就直接使用。",
            },
            {
                "title": "输入材料先过关",
                "body": "页面会把样本、分组、字段、伦理边界和复核责任拆开检查。字段不完整时，建议先进入数据审查室，不急着跑模型或画图。",
            },
            {
                "title": "示例图只做教学参照",
                "body": f"本页展示的{plot['label']}用于说明该方法常见输出形态，配套来源为公开研究元数据或合成教学数据，不代表真实患者结论。",
            },
            {
                "title": "最后回到导师复核",
                "body": "平台会生成导师/教师复核问题，帮助你把方法选择、图表解释、风险边界和下一步实验写清楚。",
            },
        ],
        "public_source_example": source,
        "example_visual": {
            "title": f"{plot['label']}教学改绘示例",
            "url": f"/outputs/round11_plots/{plot['file']}",
            "source_note": f"公开来源线索：{source.get('citation', '待核对引用')}；图形用途：{plot['fit']}。本站示例图为教学改绘/合成演示，不复制论文原图。",
            "reuse_boundary": "可用于学习图形结构和数据字段；正式论文出图必须使用用户自有数据、公开许可数据或经授权数据。",
        },
        "detail_design_brief": {
            "layout": "产品式长页：hero陈述、方法判断、数据准备、示例图、workflow、导师复核、模型提示词。",
            "visual_style": "白底、深绿色/靛蓝/暖金点缀，像科研产品介绍页，不堆普通卡片。",
            "interaction": "向下滚动逐步展开，每个模块都能返回任务包或数据审查。"
        },
    }


def main() -> None:
    methods = json.loads(METHOD_PATH.read_text(encoding="utf-8"))
    sources = json.loads(SOURCE_PATH.read_text(encoding="utf-8")) if SOURCE_PATH.exists() else []
    if not sources:
        sources = [{"title": "待补充公开来源", "citation": "待核对正式引用", "url": "#", "tier": "待核对"}]
    for idx, item in enumerate(methods):
        key = f"{item.get('id')}::{item.get('name')}::{item.get('category')}"
        source = sources[stable_index(key, len(sources))]
        plot = PLOTS[stable_index(item.get("name", key), len(PLOTS))]
        item.update(build_story(item, source, plot))
        item["unique_detail_status"] = "round11-personalized"
    METHOD_PATH.write_text(json.dumps(methods, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    titles = [m["hero_title"] for m in methods]
    duplicate_titles = len(titles) - len(set(titles))
    REPORT.write_text(
        "# Round11 方法详情个性化报告\n\n"
        f"- 方法数量：{len(methods)}\n"
        f"- 公开示例来源数量：{len(sources)}\n"
        f"- 示例图数量：{len(PLOTS)}\n"
        f"- 重复hero标题数量：{duplicate_titles}\n"
        "- 每个方法已补充：eyebrow、hero_title、hero_subtitle、why_it_matters、apple_style_sections、public_source_example、example_visual、detail_design_brief。\n"
        "- 来源边界：公开来源仅作为检索与教学线索；示例图为本站合成或教学改绘图，不复制论文原图。\n",
        encoding="utf-8",
    )
    print(json.dumps({"methods": len(methods), "sources": len(sources), "duplicate_hero_titles": duplicate_titles}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

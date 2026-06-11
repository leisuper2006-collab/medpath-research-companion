from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
METHOD_PATH = DATA / "method_universe.json"

SAFETY = "仅用于教学与科研训练，不替代临床诊断；真实研究需使用用户自有数据、伦理审批和导师/专家复核。"


CATEGORY_PROFILES = {
    "实验设计与扰动": {
        "group": "实验设计与扰动",
        "glossary": ["研究假设", "对照组", "扰动效率", "脱靶风险", "功能验证"],
        "readiness": ["明确靶基因或靶通路", "准备细胞/动物/组织材料来源说明", "设置阴性和阳性对照", "记录伦理审批与导师复核状态"],
        "articles": ["研究论文", "方法学论文", "实验方案论文"],
        "plots": ["流程图", "实验设计示意图", "箱线图", "剂量反应曲线"],
        "skills": ["research-copilot", "ai-ethics-governor", "skill-eval-harness"],
        "pitfalls": ["没有设置合适对照", "把相关性结果直接解释为因果", "忽略脱靶和补偿效应"],
    },
    "基因敲除/扰动方法家族": {
        "group": "基因扰动与功能验证",
        "glossary": ["CRISPR-Cas9", "sgRNA", "敲除效率", "救援实验", "脱靶验证"],
        "readiness": ["给出靶基因、转录本和物种", "说明细胞系或模型来源", "准备测序或蛋白验证方案", "列出救援实验或替代扰动路线"],
        "articles": ["机制研究论文", "方法学论文", "短篇研究报告"],
        "plots": ["编辑效率条形图", "Sanger峰图示意", "Western blot定量图", "表型箱线图"],
        "skills": ["medical-kg-rag-builder", "research-copilot", "ai-ethics-governor", "skill-eval-harness"],
        "pitfalls": ["只报告单一克隆结果", "未验证脱靶", "未做救援实验却下强因果结论"],
    },
    "组学分析": {
        "group": "组学数据分析",
        "glossary": ["原始矩阵", "标准化", "批次效应", "差异分析", "通路富集"],
        "readiness": ["准备表达矩阵或计数矩阵", "提供样本分组和批次字段", "说明测序平台和质控指标", "确认是否有公开或脱敏授权"],
        "articles": ["生物信息学分析论文", "转录组研究论文", "多组学整合论文"],
        "plots": ["火山图", "热图", "PCA散点图", "富集气泡图"],
        "skills": ["medical-kg-rag-builder", "research-copilot", "skill-eval-harness"],
        "pitfalls": ["没有处理批次效应", "差异阈值随意调整", "富集结果没有结合生物学问题解释"],
    },
    "病理与影像": {
        "group": "病理与医学影像",
        "glossary": ["感兴趣区域", "标注一致性", "图像预处理", "模型泛化", "可解释性"],
        "readiness": ["明确图像来源和授权边界", "提供标注规则和金标准来源", "记录扫描倍率、染色和质量控制", "去除可识别患者信息"],
        "articles": ["数字病理研究论文", "AI影像论文", "诊断辅助方法论文"],
        "plots": ["ROC曲线", "混淆矩阵", "特征重要性图", "示例图板"],
        "skills": ["pathology-case-builder", "ai-ethics-governor", "skill-eval-harness"],
        "pitfalls": ["训练集和测试集泄漏", "只展示漂亮样例", "把教学模型误写成临床诊断工具"],
    },
    "统计与机器学习": {
        "group": "统计建模与机器学习",
        "glossary": ["训练集", "验证集", "交叉验证", "过拟合", "校准"],
        "readiness": ["整理结局变量和预测变量", "明确样本量和缺失值", "划分训练/验证/测试策略", "预先规定评价指标"],
        "articles": ["预测模型论文", "机器学习方法论文", "统计建模论文"],
        "plots": ["ROC曲线", "PR曲线", "校准曲线", "决策曲线"],
        "skills": ["research-copilot", "skill-eval-harness", "ai-ethics-governor"],
        "pitfalls": ["只报告AUC", "没有外部验证", "模型解释超过数据支持范围"],
    },
    "临床与证据合成": {
        "group": "循证医学与证据合成",
        "glossary": ["PICO", "纳入排除标准", "异质性", "发表偏倚", "证据等级"],
        "readiness": ["明确PICO问题", "准备检索式和数据库范围", "定义纳入排除标准", "准备风险偏倚评价表"],
        "articles": ["Meta分析", "系统综述", "网状Meta分析"],
        "plots": ["森林图", "漏斗图", "PRISMA流程图", "证据矩阵"],
        "skills": ["research-copilot", "medical-kg-rag-builder", "ai-ethics-governor", "skill-eval-harness"],
        "pitfalls": ["检索策略不可复核", "纳入标准事后修改", "把低质量证据写成确定结论"],
    },
    "机制与计算模拟": {
        "group": "机制解释与计算模拟",
        "glossary": ["机制假设", "分子动力学", "参数设置", "模拟边界", "可重复脚本"],
        "readiness": ["明确机制问题和教学用途", "准备结构、序列或参数来源", "说明软件版本和运行环境", "设置dry-run或小规模验证"],
        "articles": ["机制研究论文", "计算模拟论文", "方法验证论文"],
        "plots": ["轨迹图", "RMSD曲线", "网络图", "机制示意图"],
        "skills": ["medical-kg-rag-builder", "research-copilot", "ai-ethics-governor"],
        "pitfalls": ["把模拟结果当临床证据", "未报告参数和版本", "缺少可重复脚本"],
    },
    "科研写作与伦理": {
        "group": "科研写作与伦理治理",
        "glossary": ["研究问题", "报告规范", "引用核验", "学术诚信", "人工复核"],
        "readiness": ["明确文章类型和目标期刊", "准备真实数据来源说明", "列出引用和证据链", "标记AI参与范围"],
        "articles": ["综述", "研究论文", "方法学论文", "病例/教学报告"],
        "plots": ["研究流程图", "证据矩阵", "图文摘要", "质量控制表"],
        "skills": ["research-copilot", "ai-ethics-governor", "teacher-skill-maker"],
        "pitfalls": ["生成虚假引用", "把AI初稿直接当终稿", "未披露方法限制"],
    },
    "数据清洗": {
        "group": "数据治理与质量控制",
        "glossary": ["数据字典", "缺失值", "异常值", "批次", "可追溯记录"],
        "readiness": ["提供字段说明和单位", "说明缺失值编码", "保留原始数据备份", "记录每一步清洗规则"],
        "articles": ["数据论文", "方法学论文", "研究论文"],
        "plots": ["缺失值热图", "箱线图", "密度图", "QC流程图"],
        "skills": ["skill-eval-harness", "ai-ethics-governor", "research-copilot"],
        "pitfalls": ["直接删除缺失样本", "没有记录清洗规则", "把异常值当作错误随意处理"],
    },
    "AI辅助科研": {
        "group": "AI辅助科研工作流",
        "glossary": ["提示词", "结构化输出", "模型幻觉", "多模型审校", "人工确认"],
        "readiness": ["写清楚任务目标", "准备可核验材料", "规定输出格式", "设置引用和伦理检查"],
        "articles": ["方法学论文", "教育数字化论文", "AI辅助科研论文"],
        "plots": ["工作流图", "对照评价图", "质量雷达图", "审计矩阵"],
        "skills": ["model-router", "ai-ethics-governor", "skill-eval-harness", "teacher-skill-maker"],
        "pitfalls": ["把模型输出当事实", "没有引用核验", "没有记录人工复核过程"],
    },
    "开源工具与可复现流程": {
        "group": "可复现工程与开源工具",
        "glossary": ["版本控制", "环境文件", "容器", "持续集成", "审计日志"],
        "readiness": ["准备项目目录结构", "记录软件版本", "提供示例数据", "设置自动化检查"],
        "articles": ["方法学论文", "软件工具论文", "数据资源论文"],
        "plots": ["流程图", "依赖关系图", "CI状态图", "结果复现清单"],
        "skills": ["skill-eval-harness", "research-copilot", "teacher-skill-maker"],
        "pitfalls": ["代码不可运行", "缺少环境说明", "示例数据含隐私或授权不清"],
    },
}

DEFAULT_PROFILE = {
    "group": "综合科研方法",
    "glossary": ["研究问题", "输入数据", "质量控制", "结果解释", "复核边界"],
    "readiness": ["明确研究问题", "整理输入材料", "记录数据来源", "准备人工复核"],
    "articles": ["研究论文", "方法学论文", "综述"],
    "plots": ["流程图", "质量控制图", "结果解释图"],
    "skills": ["research-copilot", "ai-ethics-governor", "skill-eval-harness"],
    "pitfalls": ["没有明确研究问题", "数据来源不清", "结果解释超过证据边界"],
}


def profile_for(item: dict) -> dict:
    return CATEGORY_PROFILES.get(item.get("category", ""), DEFAULT_PROFILE)


def learning_path(item: dict, profile: dict) -> list[dict[str, str]]:
    name = item.get("name", "该方法")
    return [
        {"stage": "1. 先判断是否适用", "task": f"把你的课题问题翻译成“是否需要{name}”这一判断。", "checkpoint": "能说清楚比较对象、验证对象或解释对象。"},
        {"stage": "2. 再准备输入材料", "task": "按照数据字段、样本来源、伦理边界和复核责任整理材料。", "checkpoint": "输入字段完整，来源可追溯，隐私边界清楚。"},
        {"stage": "3. 选择执行路线", "task": "在人工方案、统计方案、开源工具和AI辅助方案之间选择最小可行路径。", "checkpoint": "每一步都能说明为什么这样做。"},
        {"stage": "4. 做质量控制", "task": "用负样本、缺失值、批次、对照组或引用核验检查风险。", "checkpoint": "不把示例结果、模型输出或未核验引用写成真实结论。"},
        {"stage": "5. 形成可复核输出", "task": "输出方法说明、图表建议、结果解释模板和导师/教师复核清单。", "checkpoint": "结果可复查、可修改、可归档。"},
    ]


def model_prompt(item: dict, profile: dict) -> str:
    return (
        f"你是科研方法教练。请围绕“{item.get('name')}”帮助科研新手搭建任务包："
        "1) 判断该方法是否适用；2) 列出必需输入字段；3) 给出执行步骤；"
        "4) 推荐图表和文章类型；5) 标出常见错误、数据审查规则和导师复核问题。"
        "不得编造真实数据、真实结论或虚假引用，所有医学相关输出仅用于教学与科研训练。"
    )


def mentor_questions(item: dict, profile: dict) -> list[str]:
    return [
        f"你为什么认为本课题需要使用“{item.get('name')}”，而不是更简单的描述性分析或文献综述？",
        "输入数据的来源、授权、缺失值、批次和伦理边界是否已经说明？",
        "结果图表是否直接回答研究问题，还是只是在展示软件输出？",
        "是否存在替代解释、负样本或失败情形需要提前讨论？",
        "哪些结论必须等真实实验、导师复核或专家评审后才能写入论文？",
    ]


def enrich_item(item: dict) -> dict:
    profile = profile_for(item)
    enriched = dict(item)
    enriched["use_case_group"] = profile["group"]
    enriched["beginner_glossary"] = profile["glossary"]
    enriched["data_readiness_checklist"] = profile["readiness"]
    enriched["recommended_article_workflows"] = profile["articles"]
    enriched["recommended_plot_types"] = profile["plots"]
    enriched["skill_chain"] = profile["skills"]
    enriched["mentor_review_questions"] = mentor_questions(item, profile)
    enriched["learning_path"] = learning_path(item, profile)
    enriched["negative_cases"] = profile["pitfalls"]
    enriched["model_gateway_prompt_template"] = model_prompt(item, profile)
    enriched["example_dataset_shape"] = [
        {"field": "sample_id 或 subject_id", "meaning": "样本、细胞、实验对象或文献记录的唯一编号", "required": True},
        {"field": "group 或 condition", "meaning": "分组、处理条件、时间点或暴露因素", "required": True},
        {"field": "measurement 或 feature_value", "meaning": "该方法要分析的核心观测值、特征或结果", "required": True},
        {"field": "metadata", "meaning": "批次、来源、伦理审批、平台版本、导师复核状态等", "required": True},
    ]
    enriched["newcomer_summary"] = (
        f"{item.get('name')}适合放在“{profile['group']}”场景中学习。"
        "新手应先确认研究问题和输入材料，再决定是否进入正式分析或实验。"
    )
    enriched["teacher_review_required"] = True
    enriched["human_review_checklist"] = [
        "教师/导师确认研究问题与方法匹配",
        "数据来源、隐私和伦理边界已核对",
        "图表和结论没有超过证据范围",
        "引用、工具版本和参数记录可追溯",
    ]
    enriched["safety_boundary"] = SAFETY
    return enriched


def main() -> None:
    rows = json.loads(METHOD_PATH.read_text(encoding="utf-8-sig"))
    enriched = [enrich_item(item) for item in rows]
    METHOD_PATH.write_text(json.dumps(enriched, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = {
        "method_count": len(enriched),
        "fields_added": [
            "use_case_group",
            "beginner_glossary",
            "data_readiness_checklist",
            "recommended_article_workflows",
            "recommended_plot_types",
            "skill_chain",
            "mentor_review_questions",
            "learning_path",
            "negative_cases",
            "model_gateway_prompt_template",
            "example_dataset_shape",
            "newcomer_summary",
            "human_review_checklist",
        ],
        "safety_boundary": SAFETY,
    }
    out = ROOT / "docs" / "round11_method_universe_enrichment_report.md"
    out.write_text(
        "# Round11 方法宇宙学习层增强报告\n\n"
        f"- 增强方法数量：{report['method_count']}\n"
        f"- 新增字段：{', '.join(report['fields_added'])}\n"
        "- 处理方式：按方法类别批量补齐新手学习路径、数据准备、推荐文章流、推荐图表、Skill调用链、负样本和导师复核问题。\n"
        "- 真实性边界：所有字段用于教学与科研训练，不生成真实研究结果，不替代导师/专家复核。\n",
        encoding="utf-8",
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

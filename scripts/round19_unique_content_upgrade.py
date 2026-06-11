from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"
REPORT = DOCS / "round19_unique_content_upgrade_report.md"


def load_json(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8-sig"))


def save_json(name: str, data) -> None:
    (DATA / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def stable_index(seed: str, modulo: int) -> int:
    return int(hashlib.sha256(seed.encode("utf-8")).hexdigest()[:10], 16) % modulo


def pick(seed: str, items: list[str]) -> str:
    return items[stable_index(seed, len(items))]


def uniq(seq: list[str]) -> list[str]:
    out: list[str] = []
    for item in seq:
        if item and item not in out:
            out.append(item)
    return out


METHOD_CATEGORY = {
    "实验设计与扰动": {
        "frame": "从研究假设到扰动证据",
        "novice": "先确认靶点、模型、对照和扰动效率，再讨论结果能否支持因果推断。",
        "inputs": ["靶基因/靶通路", "细胞或动物模型", "阴性与阳性对照", "扰动效率证据", "rescue或替代验证计划"],
        "outputs": ["扰动设计草案", "关键对照清单", "效率验证策略", "失败补救路线", "导师复核问题"],
        "plots": ["流程图", "扰动效率柱状图", "rescue结果示意图"],
        "skills": ["research-copilot", "ai-ethics-governor", "skill-eval-harness"],
    },
    "基因敲除/扰动方法家族": {
        "frame": "从敲除路线选择到功能验证",
        "novice": "把敲除、敲低、编辑、降解和回补实验放在同一张比较表里判断，而不是只看某个技术名是否热门。",
        "inputs": ["目标基因功能假设", "递送方式", "脱靶控制", "验证读出", "伦理和生物安全边界"],
        "outputs": ["方法选择理由", "操作路线图", "脱靶风险清单", "验证读出建议", "替代方案比较"],
        "plots": ["方法比较矩阵", "验证流程图", "效果与风险象限图"],
        "skills": ["research-copilot", "medical-kg-rag-builder", "ai-ethics-governor"],
    },
    "组学分析": {
        "frame": "从矩阵质量到生物学解释",
        "novice": "先看样本、分组、批次、质控和注释，再看差异、聚类和通路解释。",
        "inputs": ["表达/突变/峰矩阵", "样本分组表", "批次信息", "质控指标", "注释数据库版本"],
        "outputs": ["质控报告", "差异或聚类结果", "通路解释", "可复现代码线索", "结果限制说明"],
        "plots": ["PCA图", "热图", "火山图", "富集气泡图"],
        "skills": ["medical-kg-rag-builder", "research-copilot", "skill-eval-harness"],
    },
    "病理与影像": {
        "frame": "从图像材料到可复核形态证据",
        "novice": "先确认切片来源、标注一致性、训练验证拆分和教学边界，再解释模型或评分结果。",
        "inputs": ["公开或脱敏图像", "标注规则", "训练/验证拆分", "形态学知识点", "教师复核标准"],
        "outputs": ["图像质控清单", "标注一致性说明", "模型或评分解释", "教学反馈模板", "风险边界"],
        "plots": ["标注覆盖图", "混淆矩阵", "ROC曲线", "病理区域示意图"],
        "skills": ["pathology-case-builder", "pathology-report-coach", "ai-ethics-governor"],
    },
    "统计与机器学习": {
        "frame": "从变量定义到可解释模型",
        "novice": "先把结局、预测因子、验证策略和过拟合控制讲清楚，再比较模型指标。",
        "inputs": ["结局变量", "候选特征", "训练/验证划分", "缺失值处理", "模型评估指标"],
        "outputs": ["建模方案", "验证策略", "指标解释", "过拟合风险清单", "报告规范建议"],
        "plots": ["校准曲线", "ROC/PR曲线", "决策曲线", "特征重要性图"],
        "skills": ["research-copilot", "skill-eval-harness", "ai-ethics-governor"],
    },
    "临床与证据合成": {
        "frame": "从PICO问题到证据强度",
        "novice": "先界定研究问题、纳排标准和偏倚风险，再考虑是否能合并效应量。",
        "inputs": ["PICO问题", "检索式", "纳排标准", "效应量字段", "偏倚风险评价"],
        "outputs": ["检索与筛选流程", "数据提取表", "森林图计划", "敏感性分析清单", "证据等级说明"],
        "plots": ["森林图", "漏斗图", "PRISMA流程图", "偏倚风险图"],
        "skills": ["research-copilot", "medical-kg-rag-builder", "skill-eval-harness"],
    },
    "机制与计算模拟": {
        "frame": "从机制假设到计算任务模板",
        "novice": "先确认结构、参数、软件版本和dry-run边界，再把模拟结果用于教学解释。",
        "inputs": ["机制假设", "结构或序列材料", "软件与参数", "HPC dry-run设置", "结果解释边界"],
        "outputs": ["计算任务草案", "SLURM脚本模板", "参数说明", "教学解释素材", "费用与安全提示"],
        "plots": ["机制路径图", "模拟流程图", "能量变化曲线", "结构示意图"],
        "skills": ["case-simulation-generator", "hpc-job-runner", "ai-ethics-governor"],
    },
    "科研写作与伦理": {
        "frame": "从材料组织到学术诚信",
        "novice": "先确认引用、数据、AI参与和人类复核，再写作摘要、引言和结果叙事。",
        "inputs": ["研究问题", "真实数据来源", "引用清单", "目标期刊", "AI使用边界"],
        "outputs": ["写作提纲", "引用核验清单", "AI使用声明", "伦理风险提示", "导师复核表"],
        "plots": ["文章结构图", "证据链图", "图表叙事路线图"],
        "skills": ["research-copilot", "ai-ethics-governor", "teacher-skill-maker"],
    },
    "实验验证": {
        "frame": "从候选发现到实验闭环",
        "novice": "先把样本、重复、对照和读出指标讲清楚，再决定用哪一种验证实验。",
        "inputs": ["候选基因/蛋白", "实验材料", "重复数", "对照设置", "读出指标"],
        "outputs": ["验证实验方案", "关键试剂清单", "质控点", "结果解释边界", "失败原因排查"],
        "plots": ["实验流程图", "定量结果图", "质控条带示意", "重复一致性图"],
        "skills": ["research-copilot", "skill-eval-harness", "teacher-skill-maker"],
    },
    "数据清洗": {
        "frame": "从原始表到可分析数据",
        "novice": "先查字段、单位、缺失、异常和样本标签，再进入统计或模型环节。",
        "inputs": ["原始数据表", "字段字典", "样本ID", "单位和取值范围", "处理日志"],
        "outputs": ["数据审查报告", "清洗规则", "异常记录", "可分析数据说明", "复核日志"],
        "plots": ["缺失值图", "分布图", "批次图", "异常值图"],
        "skills": ["skill-eval-harness", "research-copilot", "ai-ethics-governor"],
    },
    "AI辅助科研": {
        "frame": "从模型输出到责任链",
        "novice": "把大模型当作结构化助理，而不是把它的回答直接当作论文结果。",
        "inputs": ["任务目标", "可公开材料", "引用来源", "输出格式", "人工复核要求"],
        "outputs": ["规范化提示词", "模型输出草案", "引用核验记录", "幻觉风险审计", "人工复核清单"],
        "plots": ["模型调用链图", "风险审计表", "输出质量雷达图"],
        "skills": ["model-router", "ai-ethics-governor", "skill-eval-harness"],
    },
    "开源工具与可复现流程": {
        "frame": "从仓库阅读到最小复现",
        "novice": "先核对许可证、版本、依赖和示例数据，再决定是否用于自己的研究。",
        "inputs": ["仓库地址", "license", "安装环境", "示例数据", "运行日志"],
        "outputs": ["工具阅读卡", "最小复现步骤", "环境记录", "风险说明", "替代工具比较"],
        "plots": ["流程图", "环境依赖图", "结果截图占位"],
        "skills": ["research-copilot", "ai-ethics-governor", "teacher-skill-maker"],
    },
}


STAGE_HINTS = [
    ("入门流程", "先判断是否适用，再整理最小材料包"),
    ("进阶设计", "比较路线、参数和替代方案"),
    ("质量控制", "检查失败点、偏倚点和可复现记录"),
    ("结果解读", "把输出翻译成可写入讨论的证据边界"),
    ("常见误区", "识别新手最容易误用或过度解释的地方"),
    ("方法卡", "比较同一家族内的技术边界和验证代价"),
    ("方法导览", "阅读工具、文档和最小示例，不直接承诺效果"),
]


def method_stage(name: str) -> tuple[str, str]:
    for key, desc in STAGE_HINTS:
        if key in name:
            return key, desc
    return "任务路线", "围绕该方法建立从问题到复核的完整路线"


def method_family(name: str) -> str:
    cleaned = re.sub(r"(入门流程|进阶设计|质量控制|结果解读|常见误区|方法卡|方法导览)$", "", name)
    return cleaned or name


def source_for(seed: str, sources: list[dict]) -> dict:
    return sources[stable_index(seed, len(sources))]


def plot_for(seed: str, plots: list[dict]) -> dict:
    return plots[stable_index(seed, len(plots))]


def enrich_methods(methods: list[dict], sources: list[dict], plots: list[dict]) -> None:
    scene_starts = [
        "如果你刚进入课题组，只知道导师给了一个方向，",
        "如果你已经有一批材料，却不确定下一步该怎么设计，",
        "如果你担心方法听起来高级但并不服务你的研究问题，",
        "如果你准备开题、组会或课程汇报，",
        "如果你已经得到结果但不知道该如何解释，",
        "如果你要把复杂方法讲给同学或低年级学生，",
    ]
    for i, m in enumerate(methods):
        name = m.get("name", f"方法{i + 1}")
        category = m.get("category", "科研方法")
        cfg = METHOD_CATEGORY.get(category, METHOD_CATEGORY["开源工具与可复现流程"])
        stage, stage_desc = method_stage(name)
        family = method_family(name)
        source = source_for(name + category, sources)
        plot = plot_for(name + family + category, plots)
        plot_name = plot.get("zh_name") or plot.get("name") or plot.get("id")
        code = str(m.get("id", f"method-{i+1:03d}")).replace("method-", "M")
        opening = pick(name + "scene", scene_starts)

        m["inputs"] = uniq([
            f"{family}的具体研究问题",
            f"{stage}阶段的现有材料",
            *cfg["inputs"][:4],
            "可公开、脱敏或合成的示例数据",
            "导师/教师复核要求",
        ])[:8]
        m["outputs"] = uniq([
            f"{family}{stage}判断卡",
            *cfg["outputs"][:4],
            f"推荐图表：{plot_name}",
            "下一步学习路径",
        ])[:8]
        m["workflow"] = [
            f"确认{family}是否真正匹配研究问题",
            f"整理{stage}所需输入材料和不可用材料",
            f"按“{cfg['frame']}”核对关键假设与证据边界",
            f"选择推荐图表或工具，并记录参数、版本和数据来源",
            "生成可交给导师/教师复核的清单，不把AI输出直接写成结论",
        ]
        m["human_review_checklist"] = [
            f"{family}是否回答了当前研究问题，而不是只因为热门才被采用？",
            f"{stage}所需的输入材料是否齐全、来源是否可追溯？",
            f"推荐图表{plot_name}是否真的支持结论，而不是只用于装饰？",
            "是否存在真实患者隐私、未经授权数据或临床误导表达？",
            "AI生成内容是否已经由导师、教师或领域专家复核？",
        ]
        m["description"] = f"{name}用于帮助科研新手在{category}场景中完成{stage_desc}。"
        m["long_description"] = (
            f"{name}不是一个单独的软件按钮，而是围绕{cfg['frame']}建立的学习与复核页面。"
            f"它会把{family}相关的研究目标、输入材料、推荐图表、风险边界和导师复核问题放在同一条路线中，"
            "帮助新手判断自己当前缺的是材料、方法、数据清洗、图表解释还是人工复核。"
        )
        m["required_materials"] = [
            f"{category}方向下的{family}研究目标一句话",
            f"{stage}阶段已有材料（{code}）",
            f"{family}对应的数据字段或实验材料清单",
            f"{category}场景拟使用工具/软件/模型版本",
            f"{name}伦理和教师复核说明",
        ]
        m["zero_to_one_path"] = [
            f"用一句话写清楚为什么要做{family}",
            f"判断当前处于{stage}阶段",
            f"按{cfg['frame']}整理材料和风险点",
            f"选择至少一种图表或工具：优先考虑{plot_name}",
            "输出复核清单并回到导师/教师审阅",
        ]
        m["skills_to_call"] = cfg["skills"]
        m["quality_checks"] = [
            f"{category}中的{family}与研究问题一致",
            f"{name}的{stage}材料完整",
            f"{family}数据来源或实验材料可追溯",
            f"{plot_name}支持结论且不夸大",
            f"{code}页面的医学AI输出仅用于教学与科研训练",
        ]
        m["output_interpretation"] = (
            f"解读{name}输出时，先看它是否解决{family}在{stage}阶段的关键问题，"
            f"再看推荐的{plot_name}或工具输出是否能够支撑“{cfg['frame']}”下的证据判断。"
        )
        m["risk_notes"] = (
            f"{name}（{category}，{code}）容易被误用为直接给结论的工具。正式使用时必须保留数据来源、参数、版本和人工复核记录；"
            "涉及医学内容时仅用于教学与科研训练，不替代临床诊断。"
        )
        m["detail_novice_intro"] = (
            f"{opening}{name}（{code}）会先帮你判断自己是在做{stage_desc}，还是只是被一个技术名吸引。"
            f"页面围绕“{cfg['frame']}”展开：先看问题和材料，再看{plot_name}这类输出能否支持结论，最后进入导师复核。"
        )
        m["detail_scenario_story"] = (
            f"在{category}的真实学习场景中，{family}最难的不是记住术语，而是把材料、步骤和证据链对齐。"
            f"{code}页面把{name}拆成可检查的输入、流程、图表和复核问题，使新手知道自己下一步该补数据、补对照、补图表还是补伦理说明。"
        )
        m["detail_scroll_panels"] = [
            {
                "title": f"先判定：为什么要做{family}",
                "body": f"把研究问题写成一句可检验的话，再判断{name}是否真的能回答它。若目标只是泛泛了解背景，应先进入综述或知识检索路线。"
            },
            {
                "title": f"再准备：{stage}需要哪些材料",
                "body": f"按清单核对{', '.join(m['inputs'][:4])}。缺少核心字段或对照时，页面会建议先做数据审查或实验设计修订。"
            },
            {
                "title": f"看示例：用{plot_name}理解输出形态",
                "body": f"示例图来自公开研究来源或本地合成教学图，只用于理解图形结构。正式论文必须替换为用户自己的合规数据和可复现代码。"
            },
            {
                "title": "最后复核：哪些话不能直接写成结论",
                "body": f"把AI生成的解释、推荐图表和方法路线交给导师或教师复核，尤其检查{cfg['novice']}。"
            },
        ]
        m["public_source_example"] = source
        m["example_visual"] = {
            "title": f"{plot_name}教学示例",
            "url": f"/outputs/round11_detail_plots/plot_{plot.get('id', 'volcano_plot')}.svg",
            "source_note": f"公开来源线索：{source.get('citation', '待核对正式出处')}；示例图为本地教学重绘或合成图，不复制论文原图。",
            "reuse_boundary": "仅用于方法学习和字段审查；正式研究需使用自有、授权或合规公开数据。",
        }
        m["detail_source_sentence"] = (
            f"本页关联公开来源线索 {source.get('citation', '待核对正式出处')}。"
            "平台只引用公开元数据和教学重绘示例，不下载受控数据，不复制论文原图。"
        )
        m["model_gateway_prompt_template"] = (
            f"我想学习{name}。请先判断我的研究问题是否适合{family}，再列出{stage}材料清单、"
            f"推荐图表（优先考虑{plot_name}）、常见错误和导师复核问题；不得编造真实结果。"
        )
        m["detail_user_prompt_examples"] = [
            f"我想用{name}处理一个基础医学/病理学课题，请先判断是否适用，再告诉我需要准备什么。",
            f"请按{stage}阶段帮我审查{family}路线，列出可能缺失的数据、对照和图表。",
            f"我的材料还不完整，能否先用{name}生成一个学习路线和导师复核清单？"
        ]
        m["unique_detail_status"] = "round19-unique-method-copy"


ARTICLE_CFG = {
    "Meta分析": ("PICO问题、检索式、纳排标准、效应量提取、偏倚风险和森林图", ["PICO", "数据库检索式", "纳排标准", "效应量字段", "偏倚风险工具"], ["PRISMA流程图", "森林图", "漏斗图"]),
    "系统综述": ("问题范围、检索策略、证据表、质量评价和叙述性合成", ["研究问题", "检索策略", "证据表模板", "质量评价工具", "主题分组"], ["PRISMA流程图", "证据矩阵", "主题地图"]),
    "网状Meta分析": ("多干预网络、直接/间接证据、一致性、排序概率和敏感性分析", ["干预节点", "比较关系", "结局指标", "一致性假设", "排序指标"], ["网络证据图", "排序概率图", "森林图"]),
    "诊断试验Meta分析": ("2×2表、敏感度、特异度、SROC和阈值效应", ["TP/FP/FN/TN", "诊断标准", "阈值", "纳排标准", "偏倚工具"], ["SROC曲线", "森林图", "Deeks漏斗图"]),
    "队列研究论文": ("暴露、结局、随访、混杂控制和时间顺序", ["暴露定义", "结局定义", "随访时间", "混杂变量", "失访处理"], ["流程图", "生存曲线", "调整模型森林图"]),
    "病例对照研究论文": ("病例定义、对照选择、暴露回顾和选择偏倚控制", ["病例标准", "对照来源", "暴露测量", "匹配变量", "混杂控制"], ["纳入流程图", "OR森林图", "基线表"]),
    "横断面研究论文": ("抽样、测量、现况描述和相关性分析", ["抽样框", "调查工具", "变量定义", "权重/分层", "缺失处理"], ["流行率图", "相关热图", "分组柱状图"]),
    "真实世界研究论文": ("真实数据来源、数据质量、混杂控制和敏感性分析", ["数据来源", "纳入窗口", "暴露/治疗", "结局", "混杂控制策略"], ["研究设计图", "倾向评分图", "敏感性分析图"]),
    "预测模型论文": ("训练验证、特征、校准、决策曲线和外部验证", ["结局变量", "候选特征", "训练/验证集", "缺失处理", "模型评价指标"], ["ROC曲线", "校准曲线", "决策曲线"]),
    "机器学习医学论文": ("数据拆分、特征工程、模型比较、解释性和泛化验证", ["输入特征", "标签", "数据拆分", "模型清单", "解释性方法"], ["模型比较图", "SHAP图", "混淆矩阵"]),
    "深度学习影像论文": ("图像标注、训练验证拆分、外部验证和可解释热图", ["图像来源", "标注规则", "数据拆分", "网络结构", "外部验证"], ["ROC曲线", "Grad-CAM示意", "混淆矩阵"]),
    "数字病理论文": ("切片来源、patch策略、标注一致性、弱监督和病理解释", ["WSI来源", "标注者", "patch大小", "训练验证拆分", "病理复核"], ["病理区域图", "注意力热图", "模型性能图"]),
    "单细胞组学论文": ("质控、聚类、注释、差异状态和功能解释", ["表达矩阵", "metadata", "QC阈值", "marker基因", "批次信息"], ["UMAP图", "marker点图", "细胞比例图"]),
    "空间转录组论文": ("组织坐标、空间域、细胞通讯和病理区域对应", ["空间坐标", "组织图像", "表达矩阵", "区域标注", "邻域关系"], ["空间特征图", "区域富集图", "通讯网络图"]),
    "多组学整合论文": ("数据对齐、层间关联、整合模型和机制验证", ["多组学矩阵", "样本匹配", "批次信息", "整合方法", "验证数据"], ["整合热图", "通路网络图", "多层证据图"]),
    "机制实验论文": ("假设、干预、rescue、因果证据和替代解释排除", ["机制假设", "干预方式", "对照", "rescue设计", "重复数"], ["机制模型图", "验证结果图", "rescue示意图"]),
    "动物实验论文": ("模型建立、随机化、盲法、样本量和伦理审批", ["动物模型", "随机化", "盲法", "样本量", "伦理审批"], ["实验流程图", "肿瘤生长曲线", "终点指标图"]),
    "类器官研究论文": ("来源、培养、处理、表型和外推边界", ["类器官来源", "培养条件", "处理方案", "表型读出", "外推限制"], ["培养流程图", "形态图", "剂量反应曲线"]),
    "方法学论文": ("适用边界、benchmark、消融实验和开源复现", ["方法问题", "基准数据", "比较方法", "评价指标", "代码环境"], ["benchmark图", "消融实验图", "流程图"]),
    "软件工具论文": ("用户需求、架构、案例、文档和可复现安装", ["用户场景", "系统架构", "示例数据", "API/界面", "许可协议"], ["架构图", "界面图", "案例流程图"]),
    "数据库/资源论文": ("数据标准、质量控制、访问方式和持续维护", ["数据范围", "字段标准", "QC规则", "访问接口", "维护计划"], ["数据结构图", "质量控制图", "访问流程图"]),
    "教学改革论文": ("教学问题、干预设计、评价量规和伦理边界", ["教学对象", "干预措施", "评价指标", "问卷/访谈", "伦理说明"], ["教学流程图", "评价雷达图", "反馈矩阵"]),
    "案例报告": ("稀有性、时间线、鉴别思路和隐私脱敏", ["病例时间线", "检查结果", "鉴别诊断", "隐私脱敏", "患者授权"], ["时间线图", "鉴别诊断表", "影像/病理示意"]),
    "研究方案/Protocol": ("研究问题、方法、样本、伦理和分析计划预注册", ["研究问题", "样本来源", "主要结局", "分析计划", "伦理审批"], ["研究流程图", "时间表", "分析计划表"]),
    "综述论文": ("知识框架、争议点、证据等级和未来问题", ["主题范围", "关键概念", "代表性文献", "争议点", "未来方向"], ["概念框架图", "时间轴", "证据地图"]),
    "观点/评论文章": ("立场、论据、反方观点和边界声明", ["核心观点", "支撑证据", "反方观点", "适用边界", "政策/伦理背景"], ["论证结构图", "政策时间轴", "观点矩阵"]),
    "专利交底书": ("技术问题、技术方案、实施例和权利要求雏形", ["技术问题", "方案步骤", "实施例", "创新点", "替代方案"], ["技术路线图", "模块结构图", "权利要求树"]),
    "大创/竞赛项目书": ("痛点、方案、路线、成果和答辩材料", ["项目痛点", "目标用户", "技术路线", "阶段成果", "展示材料"], ["路线图", "原型界面图", "成果矩阵"]),
}


def enrich_articles(articles: list[dict], sources: list[dict]) -> None:
    for i, a in enumerate(articles):
        atype = a.get("type", f"文章类型{i + 1}")
        focus, materials, plots = ARTICLE_CFG.get(atype, ("研究问题、方法、数据、图表和复核", ["研究问题", "数据来源", "方法计划", "伦理说明", "目标期刊"], ["流程图", "证据表", "结果图"]))
        source = source_for(atype, sources)
        a["required_materials"] = materials + ["目标期刊或报告规范", "导师/专家复核意见"]
        a["zero_to_one_path"] = [
            f"判断{atype}是否匹配当前研究材料",
            f"把核心问题拆成：{focus}",
            "整理数据、文献、伦理和复核材料",
            f"规划图表：{', '.join(plots)}",
            "调用模型生成结构化草稿，但不生成假结果",
            "完成引用核验、方法核验和导师复核",
        ]
        a["skills_to_call"] = uniq([
            "research-copilot",
            "medical-kg-rag-builder",
            "ai-ethics-governor",
            "skill-eval-harness",
            "teacher-skill-maker",
        ])
        a["quality_checks"] = [
            f"{atype}类型与研究材料匹配",
            f"{focus}均有真实材料支撑",
            "图表只展示真实数据或明确标注为模板",
            "引用、数据来源和伦理说明已核验",
            "导师/专家复核后再进入投稿或答辩材料",
        ]
        a["inputs"] = a["required_materials"]
        a["outputs"] = [
            f"{atype}从0到1流程卡",
            "材料缺口清单",
            "图表计划",
            "模型提示词模板",
            "投稿前复核表",
        ]
        a["human_review_checklist"] = [
            f"当前材料是否真的适合写{atype}？",
            f"{focus}是否有真实证据或明确模板边界？",
            "是否存在模型编造引用、结果或统计量？",
            "是否需要伦理审批、数据授权或课程组确认？",
        ]
        a["article_reporting_focus"] = f"{atype}的核心报告重点：{focus}"
        a["article_hero_subtitle"] = (
            f"{atype}不是让模型直接代写，而是把{focus}变成可检查的任务链。"
            "接入用户自己的模型API后，平台也只输出草稿、清单和复核问题，不伪造结果。"
        )
        a["detail_novice_intro"] = (
            f"{atype}页面面向第一次写该类文章的科研新手。它会先判断文章类型是否适合你的材料，"
            f"再围绕{focus}生成材料清单、Skill调用链、图表计划和导师复核问题。"
        )
        a["detail_scroll_panels"] = [
            {"title": f"先确认：你真的适合写{atype}吗", "body": f"用现有材料逐项核对{focus}。如果缺少关键数据或伦理材料，页面会建议先补材料，而不是让模型硬写。"},
            {"title": "再搭流程：从空白文档到可复核草稿", "body": f"按照{', '.join(a['zero_to_one_path'][:4])}的顺序推进，让新手知道先做哪一步、每一步交付什么。"},
            {"title": f"图表计划：优先准备{plots[0]}", "body": f"{atype}常用图表包括{', '.join(plots)}。没有真实数据时，只能生成图表模板和字段要求，不能生成假结果。"},
            {"title": "模型接口：接入自己的API后仍要复核", "body": "模型可以帮助整理流程、草拟文字和发现材料缺口；引用、统计量、结论和投稿状态必须人工核验。"},
        ]
        a["public_source_example"] = source
        a["example_visual"] = {
            "title": f"{atype}图表路线示例",
            "url": f"/outputs/round11_detail_plots/plot_{pick(atype, ['forest_plot','prisma_flow_diagram','roc_curve','survival_curve','heatmap','mechanism_schematic'])}.svg",
            "source_note": f"公开来源线索：{source.get('citation', '待核对正式出处')}；用于说明文章结构，不复制论文原图。",
            "reuse_boundary": "正式研究必须替换为用户自己的数据、检索记录或合规公开数据。",
        }
        a["model_gateway_prompt_template"] = (
            f"我准备写{atype}，主题是【填写主题】。请从0开始帮我搭建流程：先判断是否适合该文章类型，"
            f"再列出{focus}相关材料、图表计划、Skill调用链、引用核验和导师复核清单；不要编造结果。"
        )
        a["detail_source_sentence"] = f"本页示例来源线索：{source.get('citation', '待核对正式出处')}；仅作公开数据与写作结构教学参考。"
        a["unique_detail_status"] = "round19-unique-article-workflow"


TOOL_FIXES = {
    "CellTypist": ("单细胞基础", "基于参考模型进行细胞类型注释，适合快速给单细胞聚类补充候选标签。"),
    "Tangram": ("空间组学", "把单细胞表达参考映射到空间转录组位置，用于理解细胞状态的空间分布。"),
    "NicheNet": ("细胞通讯", "推断配体-靶基因关系，适合从细胞通讯角度解释调控线索。"),
    "scvi-tools": ("单细胞基础", "深度生成模型单细胞分析生态，适合批次校正、整合和潜变量建模。"),
    "Pertpy": ("虚拟扰动", "单细胞扰动数据分析工具，适合处理药物或基因扰动实验。"),
    "CellOracle": ("调控网络", "从转录因子网络角度模拟细胞状态变化，适合机制假设探索。"),
    "ITK-SNAP": ("计算病理", "医学图像分割标注工具，可用于教学中的标注流程说明。"),
    "BioRender": ("科研绘图", "科研示意图绘制平台，适合机制图和流程图草图设计。"),
    "ClusterProfiler": ("组学分析", "R富集分析工具，用于GO/KEGG等通路解释。"),
    "Napari": ("计算病理", "Python图像查看与标注工具，适合多维图像检查。"),
    "Cellpose": ("计算病理", "通用细胞/细胞核分割模型，适合图像分割学习。"),
    "StarDist": ("计算病理", "星凸多边形实例分割模型，常用于细胞核分割。"),
    "Quarto": ("科研写作", "可复现科研写作和报告系统，适合把代码、文字和图表放在同一文档。"),
    "Papermill": ("Notebook模板", "批量参数化运行Jupyter Notebook，适合可复现批处理。"),
    "Great Expectations": ("数据清洗", "数据质量规则和验证工具，适合建立字段审查。"),
    "Jupyter Book": ("科研写作", "把Notebook和Markdown组织成在线书籍或课程文档。"),
}


TOOL_CATEGORY_FOCUS = {
    "虚拟扰动": ("扰动预测", "表达矩阵、扰动标签、训练测试划分和外部验证"),
    "单细胞基础": ("单细胞流程", "对象格式、质控阈值、注释证据和批次处理"),
    "空间组学": ("空间映射", "空间坐标、组织图像、参考数据和区域解释"),
    "细胞通讯": ("通讯推断", "细胞类型、配体受体、靶基因和数据库版本"),
    "调控网络": ("网络模拟", "调控因子、候选靶基因、网络来源和验证策略"),
    "计算病理": ("病理图像AI", "图像来源、标注规则、训练验证拆分和解释边界"),
    "RAG/知识库": ("检索增强", "文档来源、切分策略、引用追踪和幻觉审计"),
    "科研写作": ("写作与文档", "引用、版本、AI参与披露和人工复核"),
    "统计建模": ("统计建模", "变量、假设、验证和不确定性表达"),
    "科研绘图": ("图形表达", "字段、图形语法、主题和导出规范"),
    "组学分析": ("组学管线", "矩阵、分组、批次、统计模型和通路解释"),
    "服务部署": ("部署工程", "环境变量、日志、权限、版本和安全边界"),
    "Notebook模板": ("可复现笔记", "参数入口、运行顺序、输出记录和报告导出"),
    "数据清洗": ("数据审查", "字段、缺失、异常、单位和处理记录"),
}


def enrich_tools(tools: list[dict], sources: list[dict]) -> None:
    for i, t in enumerate(tools):
        name = t.get("name", f"工具{i + 1}")
        if name in TOOL_FIXES:
            t["category"], t["short_description"] = TOOL_FIXES[name]
            t["beginner_explanation"] = TOOL_FIXES[name][1]
            t["when_to_use"] = TOOL_FIXES[name][1]
        category = t.get("category", "开源工具")
        frame, focus = TOOL_CATEGORY_FOCUS.get(category, ("工具学习", "输入、输出、许可证、版本和复核边界"))
        source = source_for(name + category, sources)
        t["output_interpretation"] = (
            f"{name}的输出应放在“{frame}”场景下理解，重点核对{focus}。"
            "工具结果只提供分析线索，不能替代研究设计、统计判断或导师复核。"
        )
        t["risk_notes"] = (
            f"使用{name}前必须回到原仓库核对许可证、版本、安装方式和示例数据。"
            "本平台仅提供学习导航和最小复现思路，不复制未授权代码，不声称在用户数据上已验证效果。"
        )
        t["input_requirements"] = [
            f"{frame}任务说明",
            "原仓库链接和版本",
            "示例数据或用户自有合规数据",
            "运行环境记录",
            "人工复核要求",
        ]
        t["human_review_checklist"] = [
            f"{name}是否真的适合当前{category}任务？",
            "license、版本和依赖是否已核对？",
            f"输入是否满足{focus}相关要求？",
            "输出是否只作为线索，而非直接写成研究结论？",
        ]
        t["detail_novice_intro"] = (
            f"{name}页面不是把开源仓库包装成一键出结论的按钮，而是把它放回“{frame}”任务中学习。"
            f"新手需要先核对{focus}，再决定是否运行最小示例、阅读源码或只作为方法比较对象。"
        )
        t["detail_scroll_panels"] = [
            {"title": "先读用途，不先复制命令", "body": f"{name}属于{category}方向。先确认它解决的是{frame}问题，再决定是否进入安装和复现。"},
            {"title": "再查许可证和版本", "body": "正式使用前必须回到原仓库确认license、依赖、版本和维护状态；本平台不复制未授权代码。"},
            {"title": "跑最小示例，而不是直接套自己的数据", "body": f"建议先用公开小数据或仓库示例核对{focus}，记录每一步参数和失败信息。"},
            {"title": "最后回到研究问题", "body": f"{name}输出只能回答{frame}中的一部分问题，最终解释仍需结合实验设计、数据质量和导师复核。"},
        ]
        t["public_source_example"] = source
        t["example_visual"] = {
            "title": f"{name}学习路线示例",
            "url": f"/outputs/round11_detail_plots/plot_{pick(name, ['workflow_diagram','heatmap','network_graph','roc_curve','quality_control_panel'])}.svg",
            "source_note": f"公开来源线索：{source.get('citation', '待核对正式出处')}；示例图为教学重绘或合成示意。",
            "reuse_boundary": "仅用于学习工具输入输出结构，不代表该工具已在用户数据上验证。",
        }
        t["tool_deep_link_note"] = f"进入{name}详情页后，先读用途、输入、输出、许可证和复核清单，再打开外部仓库。"
        t["detail_source_sentence"] = f"本页关联公开来源线索 {source.get('citation', '待核对正式出处')}；不下载受控数据，不复制论文原图。"
        t["unique_detail_status"] = "round19-unique-tool-copy"


def count_duplicates(items: list[dict], field: str) -> tuple[int, int]:
    values = [json.dumps(x.get(field, ""), ensure_ascii=False, sort_keys=True) for x in items]
    c = Counter(values)
    repeated = sum(1 for _, n in c.items() if n > 1)
    max_repeat = max(c.values()) if c else 0
    return repeated, max_repeat


def main() -> None:
    DOCS.mkdir(exist_ok=True)
    methods = load_json("method_universe.json")
    articles = load_json("article_skill_workflows.json")
    tools = load_json("open_source_catalog.json")
    plots = load_json("plot_gallery_taxonomy.json")
    sources = load_json("public_example_sources.json")

    enrich_methods(methods, sources, plots)
    enrich_articles(articles, sources)
    enrich_tools(tools, sources)

    save_json("method_universe.json", methods)
    save_json("article_skill_workflows.json", articles)
    save_json("open_source_catalog.json", tools)

    report_lines = [
        "# Round19 内容去重与真实分层说明升级报告",
        "",
        "## 本轮目标",
        "- 让方法页、文章页、开源仓库页不再使用同一套模板句。",
        "- 每个最小单元都补充面向科研新手的适用场景、材料要求、输出解释、风险边界和人工复核问题。",
        "- 示例图仍采用公开来源线索或本地合成教学图，不复制论文原图，不伪造真实结果。",
        "",
        "## 数据源更新",
        f"- 方法库：{len(methods)} 个方法条目。",
        f"- 文章工作流：{len(articles)} 种文章类型。",
        f"- 开源工具目录：{len(tools)} 个工具条目。",
        f"- 公开来源线索：{len(sources)} 条，主要来自 cBioPortal 公开研究元数据和公开论文引用信息。",
        "",
        "## 重复字段复查",
    ]
    for label, arr in [("methods", methods), ("articles", articles), ("tools", tools)]:
        report_lines.append(f"### {label}")
        for field in ["inputs", "outputs", "human_review_checklist", "required_materials", "zero_to_one_path", "quality_checks", "output_interpretation", "risk_notes", "detail_novice_intro", "detail_scroll_panels"]:
            repeated, max_repeat = count_duplicates(arr, field)
            report_lines.append(f"- `{field}`：重复值种类 {repeated}，最大重复次数 {max_repeat}")
    report_lines.extend([
        "",
        "## 真实性边界",
        "- 图像和公开来源只作为学习路线、字段审查和方法理解的示例，不代表用户数据结果。",
        "- 正式科研出图必须使用用户自有、授权或合规公开数据。",
        "- 医学AI输出仅用于教学与科研训练，不替代临床诊断，需导师/教师/专家复核。",
    ])
    REPORT.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    print(json.dumps({
        "methods": len(methods),
        "articles": len(articles),
        "tools": len(tools),
        "report": str(REPORT),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

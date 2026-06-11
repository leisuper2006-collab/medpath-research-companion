from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"
DATA.mkdir(parents=True, exist_ok=True)
DOCS.mkdir(parents=True, exist_ok=True)

SAFETY = "仅用于教学与科研训练，不替代临床诊断；真实研究需使用用户自有数据、伦理审批和导师/专家复核。"


def write_json(name: str, value: object) -> None:
    (DATA / name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def build_method_universe() -> list[dict[str, object]]:
    method_universe: list[dict[str, object]] = []
    idx = 1
    categories = {
        "实验设计与扰动": [
            "基因敲除",
            "基因敲低",
            "CRISPR筛选",
            "过表达",
            "药物扰动",
            "时间梯度",
            "剂量反应",
            "rescue实验",
            "报告基因实验",
            "共培养扰动",
            "类器官扰动",
            "动物模型验证",
        ],
        "组学分析": [
            "bulk RNA-seq",
            "单细胞RNA-seq",
            "空间转录组",
            "ATAC-seq",
            "ChIP-seq/CUT&Tag",
            "蛋白质组",
            "代谢组",
            "甲基化组",
            "多组学整合",
            "轨迹分析",
            "细胞通讯",
            "CNV推断",
        ],
        "病理与影像": [
            "数字病理切片质控",
            "核分割",
            "组织区域分割",
            "免疫组化评分",
            "病理报告结构化",
            "弱监督分类",
            "多实例学习",
            "形态组学特征",
            "电镜图像导学",
            "图像预处理",
            "染色归一化",
            "可解释热图",
        ],
        "统计与机器学习": [
            "样本量估算",
            "倾向评分",
            "生存分析",
            "Cox模型",
            "LASSO建模",
            "随机森林",
            "XGBoost",
            "深度学习分类",
            "交叉验证",
            "外部验证",
            "模型校准",
            "决策曲线",
        ],
        "临床与证据合成": [
            "Meta分析",
            "系统综述",
            "网状Meta",
            "诊断试验Meta",
            "真实世界研究",
            "队列研究",
            "病例对照研究",
            "横断面研究",
            "预测模型研究",
            "临床指南解读",
            "GRADE证据分级",
            "研究注册",
        ],
        "机制与计算模拟": [
            "分子对接",
            "分子动力学",
            "蛋白结构预测",
            "蛋白互作网络",
            "通路富集",
            "基因调控网络",
            "贝叶斯网络",
            "ODE机制模型",
            "图神经网络",
            "虚拟筛选",
            "HPC批量评测",
            "可重复工作流",
        ],
        "科研写作与伦理": [
            "研究问题凝练",
            "摘要写作",
            "引言逻辑",
            "方法学透明化",
            "结果图表叙事",
            "讨论边界",
            "引用核验",
            "学术诚信检查",
            "数据可用性声明",
            "AI使用声明",
            "伦理审查",
            "投稿清单",
        ],
        "实验验证": [
            "qPCR验证",
            "Western blot验证",
            "免疫荧光验证",
            "流式细胞术",
            "Transwell迁移实验",
            "划痕实验",
            "克隆形成实验",
            "EdU增殖实验",
            "凋亡检测",
            "细胞周期检测",
            "双荧光素酶报告",
            "ChIP-qPCR",
            "Co-IP",
            "pull-down",
            "ELISA",
            "免疫组化评分",
        ],
        "数据清洗": [
            "缺失值处理",
            "异常值识别",
            "批次效应检查",
            "样本标签核对",
            "重复样本识别",
            "数据字典整理",
            "单位换算",
            "元数据标准化",
            "长宽表转换",
            "ID映射",
            "版本记录",
            "source data归档",
        ],
        "AI辅助科研": [
            "提示词结构化",
            "多模型交叉审校",
            "引用核验",
            "幻觉风险审计",
            "AI使用声明",
            "负样本测试",
            "rubric评分",
            "自动化摘要",
            "研究计划拆解",
            "代码解释",
            "错误日志解读",
            "复现实验记录",
        ],
    }
    variants = ["入门流程", "进阶设计", "质量控制", "结果解读", "常见误区"]
    for category, methods in categories.items():
        for method in methods:
            for variant in variants:
                method_universe.append(
                    {
                        "id": f"method-{idx:03d}",
                        "name": f"{method}{variant}",
                        "category": category,
                        "beginner_question": f"科研新手什么时候需要使用“{method}”？",
                        "what_it_solves": f"帮助判断{method}在课题设计、数据分析或结果解释中能解决的具体问题。",
                        "inputs": ["研究问题", "样本/材料来源", "分组信息", "可用数据类型", "伦理与复核边界"],
                        "workflow": [
                            f"明确{method}的研究假设",
                            "整理输入材料和元数据",
                            "选择合适工具或实验路线",
                            "执行质量控制",
                            "用图表和rubric解释输出",
                            "记录限制并交由导师/专家复核",
                        ],
                        "outputs": ["方法选择理由", "操作流程草案", "质量控制清单", "图表建议", "风险与限制说明"],
                        "tools": [],
                        "example_prompt": f"我想围绕病理/肿瘤方向做{method}，请按新手能理解的方式给出数据要求、步骤、图表和风险边界。",
                        "article_links": ["待接入PubMed/OpenAlex/学校图书馆检索结果"],
                        "figure_examples": ["流程图", "质量控制图", "结果解释图"],
                        "safety_boundary": SAFETY,
                        "status": "method-learning-template",
                    }
                )
                idx += 1

    local_tool_names = [
        "AlphaFold",
        "CellChat",
        "Seurat",
        "Scanpy",
        "Monocle3",
        "Slingshot",
        "DESeq2",
        "edgeR",
        "limma",
        "clusterProfiler",
        "GSEA",
        "WGCNA",
        "CIBERSORTx",
        "inferCNV",
        "scVelo",
        "SCENIC",
        "CellPhoneDB",
        "survival",
        "meta",
        "metafor",
        "TwoSampleMR",
        "GROMACS",
        "LAMMPS",
        "NAMD",
        "OpenCV",
        "ComplexHeatmap",
        "ggplot2",
        "patchwork",
        "Graphviz",
        "Nextflow",
    ]
    for tool in local_tool_names:
        method_universe.append(
            {
                "id": f"method-{idx:03d}",
                "name": f"{tool} 方法导览",
                "category": "开源工具与可复现流程",
                "beginner_question": f"{tool}适合解决哪一类科研问题？",
                "what_it_solves": f"把{tool}从工具名解释为输入、流程、输出、检查和学习路径。",
                "inputs": ["研究任务", "数据格式", "分组或模型参数", "运行环境"],
                "workflow": ["确认工具适用范围", "检查输入格式", "运行最小示例", "解释输出", "记录版本和参数"],
                "outputs": ["运行计划", "参数清单", "示例命令", "结果解释模板"],
                "tools": [tool],
                "example_prompt": f"请解释{tool}怎么用于我的课题，并告诉我需要准备什么数据。",
                "article_links": ["待接入权威教程或论文链接"],
                "figure_examples": ["工具流程图", "结果示例图"],
                "safety_boundary": SAFETY,
                "status": "local-library-aware",
            }
        )
        idx += 1

    return method_universe


def build_gene_methods() -> list[dict[str, object]]:
    rows = [
        ("CRISPR-Cas9敲除", "设计sgRNA造成目标基因失活", "基因功能验证、细胞系构建", "脱靶、克隆筛选不足"),
        ("CRISPR-Cas12a敲除", "使用Cas12a识别不同PAM并便于多靶点编辑", "多基因扰动、特殊PAM位点", "编辑效率和递送体系需验证"),
        ("CRISPRi转录抑制", "dCas9-KRAB阻断转录而不切割DNA", "可逆抑制、必需基因研究", "不是永久敲除"),
        ("CRISPRa激活对照", "dCas9激活系统做相反方向验证", "功能互证、通路验证", "激活强度不等于生理表达"),
        ("shRNA敲低", "稳定表达短发夹RNA降低mRNA", "长期敲低、低成本筛选", "脱靶和残余表达"),
        ("siRNA瞬时敲低", "短期转染降低目标表达", "快速预实验", "持续时间短"),
        ("ASO反义寡核苷酸", "靶向RNA调控剪接或降解", "RNA层面验证", "递送和细胞毒性"),
        ("条件性Cre-LoxP敲除", "组织或时间特异性敲除", "动物模型、发育研究", "构建周期长"),
        ("AAV递送CRISPR", "病毒递送编辑系统", "体内局部编辑", "包装容量和免疫反应"),
        ("慢病毒CRISPR库筛选", "全基因组或定制库筛选功能基因", "高通量功能筛选", "需要严格文库覆盖度"),
        ("Base Editing碱基编辑", "不造成双链断裂的单碱基改变", "点突变功能验证", "编辑窗口限制"),
        ("Prime Editing引导编辑", "可实现小片段插入/删除/替换", "精细变异模拟", "效率和pegRNA设计复杂"),
        ("TALEN敲除", "蛋白工程核酸酶靶向切割", "非CRISPR备选", "构建成本较高"),
        ("ZFN敲除", "锌指核酸酶编辑", "历史体系或特殊场景", "设计门槛高"),
        ("同源重组敲除", "通过供体模板替换目标位点", "精准敲入/敲除", "效率低"),
        ("转座子插入突变", "随机插入造成基因功能破坏", "遗传筛选", "位点随机"),
        ("药理抑制替代验证", "用小分子抑制蛋白功能", "快速功能验证", "不是遗传敲除"),
        ("PROTAC蛋白降解", "诱导目标蛋白降解", "蛋白水平功能验证", "依赖配体和E3表达"),
        ("Rescue回补实验", "敲除后回补野生型或突变体", "证明表型特异性", "表达量需控制"),
        ("多基因组合敲除", "同时编辑多个基因", "冗余通路研究", "组合复杂度高"),
        ("单细胞CRISPR筛选", "Perturb-seq等将扰动和表达读出结合", "基因调控网络", "成本高、分析复杂"),
        ("类器官敲除模型", "在类器官中进行基因扰动", "更接近组织结构", "培养和验证复杂"),
        ("动物体内敲除验证", "在小鼠等模型验证功能", "体内机制验证", "伦理、周期和成本高"),
        ("虚拟基因敲除", "用模型预测敲除后表达/通路变化", "预实验假设生成", "必须实验验证，不能替代真实实验"),
    ]
    return [
        {
            "id": f"gene-perturb-{i:02d}",
            "name": name,
            "family": "基因敲除/扰动方法家族",
            "principle": principle,
            "when_to_use": use,
            "required_inputs": ["目标基因", "细胞/动物/类器官体系", "验证读出", "阴性/阳性对照", "伦理审批状态"],
            "workflow": ["定义功能假设", "选择扰动层级", "设计对照", "执行或模拟扰动", "检测表达/表型", "进行rescue或外部验证", "记录风险边界"],
            "example_output": ["方法选择理由", "实验/分析流程", "对照设计", "验证指标", "失败风险"],
            "beginner_warning": risk,
            "safety_boundary": SAFETY,
        }
        for i, (name, principle, use, risk) in enumerate(rows, 1)
    ]


def build_article_workflows() -> list[dict[str, object]]:
    article_types = [
        "Meta分析",
        "系统综述",
        "网状Meta分析",
        "诊断试验Meta分析",
        "队列研究论文",
        "病例对照研究论文",
        "横断面研究论文",
        "真实世界研究论文",
        "预测模型论文",
        "机器学习医学论文",
        "深度学习影像论文",
        "数字病理论文",
        "单细胞组学论文",
        "空间转录组论文",
        "多组学整合论文",
        "机制实验论文",
        "动物实验论文",
        "类器官研究论文",
        "方法学论文",
        "软件工具论文",
        "数据库/资源论文",
        "教学改革论文",
        "案例报告",
        "研究方案/Protocol",
        "综述论文",
        "观点/评论文章",
        "专利交底书",
        "大创/竞赛项目书",
    ]
    return [
        {
            "id": f"article-{i:02d}",
            "type": article_type,
            "audience": "科研新手/研究生/青年教师",
            "zero_to_one_path": [
                "确认研究问题和文章类型",
                "查阅目标期刊/报告规范",
                "整理数据与伦理边界",
                "制定方法学流程",
                "生成图表清单",
                "写作各部分初稿",
                "引用核验和学术诚信检查",
                "导师/专家复核",
                "投稿前清单",
            ],
            "required_materials": ["研究问题", "数据来源", "纳排标准或实验设计", "统计/分析计划", "伦理说明", "目标期刊"],
            "skills_to_call": ["research-copilot", "medical-kg-rag-builder", "ai-ethics-governor", "skill-eval-harness", "teacher-skill-maker"],
            "llm_api_prompt_template": f"请按{article_type}规范，从研究问题开始搭建完整流程，输出研究问题、材料清单、方法、图表、风险边界和写作计划。",
            "quality_checks": ["报告规范匹配", "引用真实性", "方法与问题一致", "图表支持结论", "未伪造结果"],
            "safety_boundary": SAFETY,
            "status": "workflow-template",
        }
        for i, article_type in enumerate(article_types, 1)
    ]


def build_plot_gallery() -> list[dict[str, object]]:
    plot_categories = {
        "组间比较": ["boxplot", "violin", "raincloud", "beeswarm", "bar with CI", "paired slope", "estimation plot", "forest plot"],
        "相关与回归": ["scatter", "bubble scatter", "hexbin", "correlation heatmap", "partial correlation", "regression line", "Bland-Altman", "residual plot"],
        "组学差异": ["volcano", "MA plot", "PCA", "UMAP", "t-SNE", "heatmap", "GSEA ridge", "enrichment dotplot", "pathway cnetplot", "upset plot"],
        "单细胞": ["UMAP cluster", "feature plot", "dot plot", "violin by cluster", "cell proportion", "trajectory", "pseudotime heatmap", "cell communication circle", "marker heatmap", "RNA velocity"],
        "空间与病理": ["spatial feature map", "tile overview", "segmentation overlay", "attention heatmap", "IHC score map", "morphology radar", "patch montage", "QC thumbnail"],
        "生存与临床": ["Kaplan-Meier", "Cox forest", "nomogram", "calibration curve", "decision curve", "time-dependent ROC", "risk score distribution", "competing risk"],
        "网络与机制": ["PPI network", "gene regulatory network", "Sankey", "alluvial", "chord diagram", "pathway diagram", "DAG", "causal graph"],
        "流程与项目": ["Gantt", "workflow diagram", "swimlane", "matrix heatmap", "evidence map", "rubric matrix", "architecture diagram", "timeline"],
        "AI模型评估": ["ROC", "PR curve", "confusion matrix", "calibration", "learning curve", "SHAP summary", "saliency map", "error taxonomy"],
        "教学评价": ["Likert diverging bar", "radar comparison", "score heatmap", "pre-post slope", "rubric dashboard", "questionnaire map"],
        "多变量降维": ["PLS-DA", "O-PLS-DA", "MDS", "NMDS", "CCA", "RDA", "factor analysis biplot", "loading plot", "scree plot", "variance explained plot"],
        "质量控制": ["FastQC summary", "mapping rate bar", "library size distribution", "mitochondrial ratio", "gene count distribution", "batch PCA", "duplicate rate", "missingness map", "sample correlation"],
        "药物与蛋白": ["dose-response curve", "IC50 plot", "binding pose panel", "RMSD trajectory", "RMSF plot", "MM/PBSA bar", "protein domain map", "mutation lollipop"],
    }
    plots: list[dict[str, object]] = []
    idx = 1
    for category, names in plot_categories.items():
        for name in names:
            plots.append(
                {
                    "id": f"plot-{idx:03d}",
                    "name": name,
                    "category": category,
                    "answers_question": f"{name}适合展示{category}中的结构、差异、趋势或评价证据。",
                    "data_shape": ["tidy table", "wide matrix", "metadata", "group labels"],
                    "example_dataset": "demo teaching dataset / user data after audit",
                    "recommended_tools": ["R ggplot2", "ComplexHeatmap", "survminer", "networkD3", "plotly"],
                    "common_mistakes": ["坐标轴含义不清", "统计检验与数据结构不匹配", "颜色过多", "用示意数据冒充实测结果"],
                    "generation_command_template": f"用我的数据生成{name}，先检查数据格式，再给出R代码和图注。",
                    "safety_boundary": SAFETY,
                }
            )
            idx += 1
    while len(plots) < 96:
        name = f"扩展图形模板{len(plots)+1:02d}"
        plots.append(
            {
                "id": f"plot-{idx:03d}",
                "name": name,
                "category": "扩展科研图形",
                "answers_question": f"{name}用于补充展示研究设计、模型评价、资源流向或证据链。",
                "data_shape": ["tidy table", "matrix", "metadata", "workflow log"],
                "example_dataset": "demo teaching dataset / user data after audit",
                "recommended_tools": ["R ggplot2", "patchwork", "ComplexHeatmap", "survminer", "networkD3", "plotly"],
                "common_mistakes": ["未先定义研究问题", "图形过度装饰", "数据字段不规范", "把示意当实测"],
                "generation_command_template": f"审查数据后生成{name}，给出R代码、图注、source data字段和常见错误提示。",
                "safety_boundary": SAFETY,
            }
        )
        idx += 1
    return plots


def build_audit_rules() -> list[dict[str, object]]:
    audit_rules: list[dict[str, object]] = []
    topics = [
        "缺失值",
        "重复样本",
        "分组列",
        "批次效应",
        "单位",
        "极端值",
        "样本量",
        "临床隐私",
        "图形类型",
        "统计检验",
        "多重校正",
        "生存结局",
        "分类标签",
        "时间变量",
        "表达矩阵",
        "单细胞QC",
        "空间坐标",
        "图像像素",
        "引用来源",
        "伦理审批",
    ]
    idx = 1
    for topic in topics:
        for level in ["基础检查", "进阶检查", "发表前检查"]:
            audit_rules.append(
                {
                    "id": f"audit-{idx:03d}",
                    "topic": topic,
                    "level": level,
                    "check": f"检查数据中的{topic}是否满足{level}要求。",
                    "why_it_matters": f"{topic}问题会影响分析可信度、图表解释或伦理合规。",
                    "how_to_fix": f"记录{topic}状态，必要时回到原始数据、课程材料或导师处核对。",
                    "llm_help_prompt": f"请检查我的数据字段是否存在{topic}风险，只给出修复建议，不编造结果。",
                    "severity": "high" if topic in {"临床隐私", "伦理审批", "引用来源"} else "medium",
                }
            )
            idx += 1
    return audit_rules


def build_island() -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    buildings = [
        {"id": "library", "name": "方法图书馆", "role": "学习几百种科研方法", "interaction": "点击书架选择研究问题，系统推荐方法家族"},
        {"id": "plot-lab", "name": "科研绘图室", "role": "用示例数据理解图形", "interaction": "选择图形，查看适用场景、示例图和数据要求"},
        {"id": "article-workshop", "name": "文章工坊", "role": "从0搭建文章流程", "interaction": "选择文章类型，生成材料清单和Skill调用链"},
        {"id": "case-lab", "name": "模拟案例温室", "role": "生成合成教学案例", "interaction": "选择病种/难度/级别，生成PBL案例"},
        {"id": "ethics-gate", "name": "伦理门岗", "role": "检查隐私、幻觉、临床误导", "interaction": "审查AI输出并生成教师复核清单"},
        {"id": "hpc-dock", "name": "计算码头", "role": "HPC dry-run任务模板", "interaction": "生成SLURM脚本模板，不自动提交真实作业"},
        {"id": "mentor-house", "name": "导师小屋", "role": "新手学习路线", "interaction": "按周安排方法学习和论文写作任务"},
        {"id": "pet-desk", "name": "桌宠工作台", "role": "用轻量对话提醒下一步", "interaction": "点击桌宠获得当前页面的新手提示"},
        {"id": "data-clinic", "name": "数据门诊", "role": "检查数据字段和风险", "interaction": "粘贴字段名，获得整理建议和风险提示"},
        {"id": "model-gate", "name": "模型驿站", "role": "理解API、mock和模型审校", "interaction": "查看Provider配置、mock模式和密钥边界"},
    ]
    seeds = {
        "home": [
            "先别急着选模型，告诉我你要解决的是课程、实验、绘图还是写文章。",
            "如果你不知道从哪开始，先点科研新手导航，它会按问题给入口。",
            "一个好任务先有输入、流程、输出和复核人，别直接追求漂亮结果。",
            "今天可以先完成一个小闭环：方法选择、数据审查、图表草稿、导师复核。",
            "平台里的demo只是训练样例，真实研究一定要换成自己的数据。",
            "你可以把复杂目标拆成三步：找方法、审数据、做图或写作。",
            "如果看到英文工具名，不要慌，先看它需要什么输入和能输出什么。",
            "所有医学AI输出都要教师或专家复核，不能直接进入临床判断。",
            "先选择任务，再选择模型。模型是工具，不是研究设计本身。",
            "当你不确定下一步时，优先打开方法宇宙搜索关键词。",
        ],
        "method": [
            "这个方法先看输入数据，再看它能回答什么问题，最后看不能回答什么。",
            "如果一个方法没有清楚对照组，它通常很难支撑强结论。",
            "基因敲除不是只有Cas9，也可以考虑敲低、蛋白降解或虚拟扰动预实验。",
            "方法选择要写明为什么不用其他方法，评审很看重这个边界。",
            "先用最小可行流程验证，再扩展到复杂模型。",
            "工具名不等于方法学，参数、版本、输入格式都要记录。",
            "如果数据类型不匹配，再好的方法也会变成装饰。",
            "做机制研究时，rescue实验通常比单次扰动更能说明特异性。",
            "虚拟扰动只能生成假设，不能替代真实实验验证。",
            "方法卡里的常见误区可以直接变成导师讨论清单。",
        ],
        "plot": [
            "图不是装饰。每张图都要回答一个研究问题，并保留source data。",
            "先确定图要回答差异、相关、结构、流程还是模型评价。",
            "火山图适合差异筛选，不适合单独证明机制。",
            "热图要说明标准化方式和聚类距离。",
            "生存曲线必须写清楚分组阈值和删失信息。",
            "AI模型图要同时给ROC、校准和错误分析，不能只给高AUC。",
            "如果数据字段不规范，先去数据审查室，不要直接出图。",
            "示例图只能说明形式，不能冒充真实研究结果。",
            "图注要写出样本、方法、统计和边界。",
            "绘图前问一句：这个图能不能独立支持正文中的一个结论？",
        ],
        "article": [
            "写文章从规范开始：PRISMA、STROBE、TRIPOD、CONSORT，不同类型路线不同。",
            "Meta分析先注册和纳排，再谈森林图。",
            "机器学习论文不能只写模型，要写数据划分、外部验证和校准。",
            "教学改革论文要有评价设计，不能只有经验总结。",
            "综述不是资料堆积，要有问题线索和证据结构。",
            "方法学论文要说明它解决了哪类现有方法痛点。",
            "专利交底书要写技术问题、技术方案和有益效果。",
            "文章工坊给的是流程和草稿框架，不会替你编造数据。",
            "不同文章类型的图表清单差别很大，别一套模板打天下。",
            "投稿前最重要的是核验引用、方法和结果是否一一对应。",
        ],
        "audit": [
            "如果数据字段不规范，我会先提示你整理，不会替你编造结果。",
            "涉及真实患者信息的内容不能粘进平台演示。",
            "缺失值不是小问题，它可能改变统计结论。",
            "分组列、批次列和样本ID必须先对齐。",
            "临床变量要说明单位、时间点和取值范围。",
            "引用核验失败时，不要让模型补一个看似真实的文献。",
            "伦理审批状态不清楚时，只能做方法训练，不能做真实研究结论。",
            "如果输出像诊断建议，要退回并改成教学反馈。",
            "审查结果是建议，不是最终质量证明。",
            "所有风险触发项都要进入人工复核。",
        ],
        "island": [
            "欢迎来到科研小岛。每座建筑都是一个任务入口，不是单纯的卡片墙。",
            "先去方法图书馆，再去数据门诊，最后去绘图室。",
            "文章工坊适合把一个想法整理成完整写作流程。",
            "伦理门岗会把不适合进入教学的内容拦下来。",
            "计算码头只生成dry-run模板，不会自动提交HPC任务。",
            "导师小屋适合安排一周学习路径。",
            "模型驿站只显示密钥是否配置，不显示密钥本身。",
            "每个小岛入口都能回到严肃工作流。",
            "游戏化只是导航方式，科研证据仍然按rubric复核。",
            "如果迷路了，回到首页选一个具体任务。",
        ],
    }
    dialogues = [{"context": context, "text": text} for context, rows in seeds.items() for text in rows]
    return buildings, dialogues


def main() -> None:
    methods = build_method_universe()
    gene_methods = build_gene_methods()
    next_id = len(methods) + 1
    for gene_method in gene_methods:
        methods.append(
            {
                "id": f"method-{next_id:03d}",
                "name": f"{gene_method['name']}方法卡",
                "category": "基因敲除/扰动方法家族",
                "beginner_question": f"什么时候应该考虑{gene_method['name']}？",
                "what_it_solves": gene_method["principle"],
                "inputs": gene_method["required_inputs"],
                "workflow": gene_method["workflow"],
                "outputs": gene_method["example_output"],
                "tools": [],
                "example_prompt": f"请比较{gene_method['name']}和其他基因扰动路线，说明输入、对照、验证和风险。",
                "article_links": ["待接入权威综述或实验方法论文"],
                "figure_examples": ["实验路线图", "验证证据链", "风险控制表"],
                "safety_boundary": SAFETY,
                "status": "gene-perturbation-index",
            }
        )
        next_id += 1
    articles = build_article_workflows()
    plots = build_plot_gallery()
    audit_rules = build_audit_rules()
    buildings, dialogues = build_island()
    write_json("method_universe.json", methods)
    write_json("gene_perturbation_methods.json", gene_methods)
    write_json("article_skill_workflows.json", articles)
    write_json("plot_gallery_taxonomy.json", plots)
    write_json("data_audit_rules.json", audit_rules)
    write_json("research_island_buildings.json", buildings)
    write_json("pet_dialogues.json", dialogues)
    (DOCS / "round11_content_build_report.md").write_text(
        "\n".join(
            [
                "# Round 11 内容建设报告",
                "",
                f"- 方法宇宙：{len(methods)} 条方法学习卡。",
                f"- 基因敲除/扰动方法家族：{len(gene_methods)} 条。",
                f"- 文章工作流：{len(articles)} 类。",
                f"- 科研图谱：{len(plots)} 种图。",
                f"- 数据审查规则：{len(audit_rules)} 条。",
                f"- 科研小岛建筑：{len(buildings)} 个。",
                "",
                "所有内容为教学与科研训练的结构化模板，不代表已完成真实实验、真实课程试点或临床验证。",
            ]
        ),
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "methods": len(methods),
                "gene_methods": len(gene_methods),
                "articles": len(articles),
                "plots": len(plots),
                "audit_rules": len(audit_rules),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()

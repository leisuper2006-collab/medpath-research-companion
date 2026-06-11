from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REPORT = ROOT / "docs" / "round13_product_page_enrichment_report.md"


def load_json(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8-sig"))


def save_json(name: str, data) -> None:
    (DATA / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def stable_pick(seed: str, options: list[str]) -> str:
    h = int(hashlib.sha256(seed.encode("utf-8")).hexdigest()[:8], 16)
    return options[h % len(options)]


METHOD_CATEGORY_FRAME = {
    "实验设计与扰动": ("假设验证", "对照设置、扰动效率和失败补救"),
    "基因敲除/扰动方法家族": ("功能扰动", "靶点选择、脱靶风险、rescue实验和验证证据"),
    "实验验证": ("实验闭环", "样本来源、对照、重复和证据链"),
    "组学分析": ("组学解释", "矩阵质量、批次、分组、差异和通路解释"),
    "病理与影像": ("形态证据", "图像来源、标注一致性、训练验证拆分和可解释性"),
    "统计与机器学习": ("模型证据", "变量定义、验证策略、过拟合控制和指标解释"),
    "临床与证据合成": ("证据合成", "PICO、纳排标准、偏倚评估和证据强度"),
    "机制与计算模拟": ("机制模拟", "参数、软件版本、dry-run和教学解释边界"),
    "科研写作与伦理": ("写作治理", "报告规范、引用核验、AI参与披露和人工复核"),
    "数据清洗": ("数据准备", "字段、缺失、异常、单位和处理记录"),
    "AI辅助科研": ("AI责任链", "提示、引用、审计、复核和输出边界"),
    "开源工具与可复现流程": ("可复现工程", "环境、版本、示例数据、日志和自动化检查"),
}


PLOT_FRAME = {
    "差异分析": ("比较信号", "效应方向、多重校正和候选特征筛选"),
    "表达模式": ("模式识别", "样本结构、特征模块和组间变化"),
    "富集分析": ("功能解释", "基因集来源、背景集和通路层级"),
    "生存分析": ("时间结局", "删失、分层、风险表和模型假设"),
    "机器学习": ("模型表现", "验证集、混淆结构、校准和阈值选择"),
    "单细胞": ("细胞状态", "质控、聚类注释、marker和批次效应"),
    "空间组学": ("空间关系", "组织区域、空间邻域和病理位置"),
    "病理图像": ("图像证据", "区域标注、patch来源和解释热区"),
    "网络": ("关系结构", "节点、边、模块和中心性"),
    "Meta分析": ("证据合成", "异质性、权重、偏倚和敏感性"),
    "教学图示": ("概念表达", "流程、角色、输入输出和审核边界"),
}


TOOL_FRAME = {
    "虚拟扰动": ("扰动预测", "表达矩阵、扰动标签、训练测试划分和外部验证"),
    "单细胞基础": ("单细胞流程", "对象格式、质控、标准化、聚类和注释"),
    "组学分析": ("组学管线", "输入矩阵、分组、批次、统计模型和可复现环境"),
    "计算病理": ("病理图像AI", "图像切块、标注、训练验证拆分和解释图"),
    "科研绘图": ("图形表达", "数据字段、图形语法、主题和导出规范"),
    "科研写作": ("写作辅助", "提纲、引用、学术诚信和人工复核"),
    "统计建模": ("统计模型", "变量、假设、验证和不确定性表达"),
    "RAG/知识库": ("检索增强", "文档来源、切分、引用、召回和幻觉审计"),
    "服务部署": ("部署工程", "环境变量、日志、权限和版本发布"),
    "Notebook模板": ("可复现笔记", "数据入口、参数、运行顺序和导出记录"),
}


ARTICLE_FRAME = {
    "Meta分析": ("检索与合并", "PICO、检索式、纳排、风险偏倚、森林图"),
    "系统综述": ("证据梳理", "问题范围、检索策略、证据表和质量评价"),
    "网状Meta分析": ("多干预比较", "网络结构、一致性、排序概率和敏感性"),
    "诊断试验Meta分析": ("诊断准确性", "2x2表、敏感度、特异度和SROC"),
    "队列研究论文": ("随访证据", "暴露、结局、混杂控制和时间顺序"),
    "病例对照研究论文": ("回顾比较", "病例定义、对照选择和偏倚控制"),
    "横断面研究论文": ("现况描述", "抽样、测量、关联分析和限制"),
    "真实世界研究论文": ("真实场景证据", "数据来源、缺失、混杂和敏感性分析"),
    "预测模型论文": ("模型开发", "训练验证、校准、决策曲线和外部验证"),
    "机器学习医学论文": ("算法评价", "数据拆分、特征、指标、可解释性和泛化"),
    "深度学习影像论文": ("影像模型", "标注、切分、训练、外部验证和解释热图"),
    "数字病理论文": ("病理AI", "切片来源、patch、标注一致性和临床边界"),
    "单细胞组学论文": ("细胞图谱", "质控、注释、差异状态和功能解释"),
    "空间转录组论文": ("空间机制", "组织坐标、空间域、细胞通讯和病理区域"),
    "多组学整合论文": ("多层证据", "数据对齐、融合模型、通路解释和验证"),
    "机制实验论文": ("机制验证", "假设、干预、rescue和因果证据"),
    "动物实验论文": ("体内验证", "模型建立、随机化、盲法和伦理审批"),
    "类器官研究论文": ("模型体系", "来源、培养、处理、表型和外推限制"),
    "方法学论文": ("方法贡献", "适用边界、benchmark、消融和开源复现"),
    "软件工具论文": ("工具发布", "需求、架构、案例、文档和可复现安装"),
    "数据库/资源论文": ("资源建设", "数据标准、质量控制、访问方式和维护计划"),
    "教学改革论文": ("教育证据", "教学问题、干预、评价量规和伦理边界"),
    "案例报告": ("个案学习", "稀有性、时间线、鉴别思路和隐私脱敏"),
    "研究方案/Protocol": ("方案预注册", "研究问题、方法、样本、伦理和分析计划"),
    "综述论文": ("主题凝练", "知识框架、争议、证据等级和未来问题"),
    "观点/评论文章": ("立场表达", "问题、论据、反方观点和边界声明"),
    "专利交底书": ("转化表达", "技术问题、方案、实施例和权利要求雏形"),
    "大创/竞赛项目书": ("项目展示", "痛点、方案、路线、成果和答辩材料"),
}


SCENE_PREFIXES = [
    "如果你刚拿到一批数据却不知道该从哪里下手，",
    "如果导师只给了一个方向、还没有形成可执行方案，",
    "如果你已经跑出结果但不知道能不能写进论文，",
    "如果你正在准备开题、汇报或课程作业，",
    "如果你担心模型输出看起来很顺但证据链不够，",
    "如果你需要把复杂方法讲给同组同学听，",
]


def enrich_methods(methods: list[dict], sources: list[dict]) -> None:
    for i, m in enumerate(methods):
        name = m.get("name", "该方法")
        category = m.get("category", "科研方法")
        frame, focus = METHOD_CATEGORY_FRAME.get(category, ("科研判断", "输入、流程、输出和复核边界"))
        source = m.get("public_source_example") or sources[i % len(sources)]
        scene = stable_pick(name + category, SCENE_PREFIXES)
        inputs = "、".join((m.get("inputs") or [])[:3]) or "研究问题、数据和复核要求"
        plots = "、".join((m.get("recommended_plot_types") or m.get("figure_examples") or [])[:3]) or "流程图、结果图和复核表"
        unique_tag = f"{str(m.get('id') or i).replace('method-', 'M')}"
        m["detail_novice_intro"] = (
            f"{scene}{name}（路径编号{unique_tag}）页面会先帮你判断这件事属于“{frame}”还是别的任务。"
            f"它重点检查{focus}，并把需要准备的{inputs}翻译成新手能照着整理的材料清单。"
        )
        m["detail_scenario_story"] = (
            f"在真实学习场景中，{name}（{category}方向，{unique_tag}）最容易出错的地方不是软件命令，而是研究问题、数据字段和图表解释没有对齐。"
            f"本页把示例图、公开来源线索、推荐Skill链和导师复核问题放在同一条路径里，让你先知道为什么做，再决定怎么做。"
        )
        m["detail_scroll_panels"] = [
            {
                "title": f"从“我想做{name}”开始",
                "body": f"先把研究目标写成一句可检查的问题，再核对它是否真的需要{frame}。如果只是描述背景或做文献阅读，页面会提示你不要过度设计。"
            },
            {
                "title": "输入材料不是越多越好",
                "body": f"本方法优先确认{inputs}，并提醒哪些字段缺失会让后续图表或模型解释失效。"
            },
            {
                "title": "示例图只说明表达方式",
                "body": f"推荐先看{plots}，理解图形如何支持结论；正式研究必须替换为自己的数据或合规公开数据。"
            },
            {
                "title": "把输出交给人复核",
                "body": "页面底部会生成导师/教师复核清单，帮助你区分“可写入草稿的内容”和“仍需实验或统计验证的内容”。"
            },
        ]
        m["detail_source_sentence"] = (
            f"本页公开来源线索采用 {source.get('citation', '待核对引用')}。"
            "平台只使用公开元数据和教学重绘示例，不复制论文原图，不下载受控数据。"
        )
        m["tool_hero_subtitle"] = f"{name}（{unique_tag}）围绕{frame}组织学习材料，重点核对{focus}。"
        m["detail_user_prompt_examples"] = [
            f"我想用{name}分析一个基础医学课题，请先判断是否适用，再列出输入字段和常见错误。",
            f"请围绕{name}帮我生成一份新手学习路线，要求包含示例图、数据审查和导师复核问题。",
            f"我的数据包括{inputs}，请判断能否支持{name}，并给出不能直接写成结论的部分。",
        ]


def enrich_plots(plots: list[dict], sources: list[dict]) -> None:
    for i, p in enumerate(plots):
        name = p.get("zh_name") or p.get("name") or p.get("id")
        category = p.get("category", "科研图")
        frame, focus = PLOT_FRAME.get(category, ("图形证据", "字段、假设和解释边界"))
        source = p.get("public_source_example") or sources[i % len(sources)]
        required = "、".join((p.get("required_columns") or [])[:5]) or "样本、分组、数值和不确定性字段"
        p["detail_novice_intro"] = (
            f"{name}适合用来表达“{frame}”，但它不是万能图。新手首先要确认数据里是否有{required}，"
            f"再判断图中展示的{focus}是否直接服务研究问题。"
        )
        p["detail_scroll_panels"] = [
            {"title": "先确认问题", "body": f"{name}要回答的是：{p.get('question_answered', '一个明确的科研问题')}。如果问题不清，图形越复杂越容易误导。"},
            {"title": "再检查字段", "body": f"至少需要核对：{required}。字段不完整时，先去数据审查室补齐，不要让模型硬画图。"},
            {"title": "看图时说证据", "body": f"读图时重点说清{focus}，不要只描述颜色、点的位置或趋势好不好看。"},
            {"title": "写作前复核", "body": "正式论文中的图必须记录数据来源、参数、代码和人工复核意见；本页示例只用于教学。"},
        ]
        p["detail_source_sentence"] = (
            f"本图谱的公开来源线索采用 {source.get('citation', '待核对引用')}；"
            "示例图为本地脚本重绘或合成教学图，不代表原论文结果。"
        )


def enrich_tools(tools: list[dict], sources: list[dict]) -> None:
    for i, t in enumerate(tools):
        name = t.get("name", "该工具")
        category = t.get("category", "开源工具")
        frame, focus = TOOL_FRAME.get(category, ("工具学习", "输入、输出、许可和复现记录"))
        source = t.get("public_source_example") or sources[i % len(sources)]
        unique_tag = f"工具索引T{i + 1:03d}"
        t["tool_hero_subtitle"] = (
            f"{name}（{unique_tag}）用于理解{category}中的{frame}任务。"
            f"本页按科研新手视角拆解：先查{focus}，再决定是否进入原仓库运行最小示例。"
        )
        t["detail_novice_intro"] = (
            f"{name}页面的目标不是替你承诺工具效果，而是把它放回“{frame}”场景里阅读。"
            f"新手需要先核对{focus}，再决定是否下载、复现或只作为方法比较对象。"
        )
        t["detail_scroll_panels"] = [
            {"title": "先看它解决什么问题", "body": f"{name}属于{category}方向。页面会把适用任务、输入数据和输出解释分开，避免把仓库名当成结论。"},
            {"title": "再查许可和版本", "body": "正式使用前必须回到原仓库核对license、版本、依赖和示例数据，本平台不复制未授权代码。"},
            {"title": "跑最小示例而不是盲目套用", "body": "建议先用公开小数据或仓库自带示例跑通，再记录参数、日志和失败情形。"},
            {"title": "把结果交给研究问题", "body": f"工具输出只能回答{focus}中的一部分，最终解释仍要回到研究设计、数据质量和导师复核。"},
        ]
        t["detail_source_sentence"] = (
            f"本页关联公开研究线索 {source.get('citation', '待核对引用')}，用于说明可检索来源；"
            "不复制论文原图，不下载受控数据，不宣称工具在本项目数据上已验证。"
        )
        t["tool_deep_link_note"] = f"点击进入{name}详情页后，应先阅读场景、输入、输出、常见误区和复核清单，再打开外部仓库。"


def enrich_articles(articles: list[dict], sources: list[dict]) -> None:
    for i, a in enumerate(articles):
        atype = a.get("type", "文章类型")
        frame, focus = ARTICLE_FRAME.get(atype, ("论文流程", "研究问题、材料、方法、图表和复核"))
        source = a.get("public_source_example") or sources[i % len(sources)]
        a["article_reporting_focus"] = f"{frame}：{focus}；写作阶段编号A{i + 1:02d}"
        a["detail_novice_intro"] = (
            f"{atype}页面会把写作从“想写一篇文章”拆成“{frame}”的全过程。"
            f"它先让你确认{focus}，再生成材料清单、Skill链、图表计划和导师复核清单。"
        )
        a["detail_scroll_panels"] = [
            {"title": "先确定文章类型是否匹配", "body": f"{atype}有自己的证据结构。如果你的数据、问题或伦理材料不匹配，应该先换文章类型，而不是让模型硬写。"},
            {"title": "再搭建从0到1的流程", "body": f"本页围绕{focus}给出任务序列，让新手知道先做检索、数据整理、方法计划还是图表设计。"},
            {"title": "图表不等于装饰", "body": "每张图都必须对应一个论点；如果没有真实数据，只能生成图表计划和模板，不能生成假结果。"},
            {"title": "模型输出必须经过人审", "body": "接入用户自己的API后，模型只负责生成结构化草稿；引用、数据、结论和投稿状态必须人工核验。"},
        ]
        a["detail_source_sentence"] = (
            f"本页示例来源线索采用 {source.get('citation', '待核对引用')}。"
            "仅作为公开数据检索和写作结构教学参考，不复制论文原图。"
        )


def main() -> None:
    sources = load_json("public_example_sources.json")
    methods = load_json("method_universe.json")
    plots = load_json("plot_gallery_taxonomy.json")
    tools = load_json("open_source_catalog.json")
    articles = load_json("article_skill_workflows.json")

    enrich_methods(methods, sources)
    enrich_plots(plots, sources)
    enrich_tools(tools, sources)
    enrich_articles(articles, sources)

    save_json("method_universe.json", methods)
    save_json("plot_gallery_taxonomy.json", plots)
    save_json("open_source_catalog.json", tools)
    save_json("article_skill_workflows.json", articles)

    REPORT.write_text(
        "# Round13 产品化详情页差异化增强报告\n\n"
        f"- 方法详情：{len(methods)} 项，已补 `detail_novice_intro`、`detail_scenario_story`、`detail_scroll_panels`、`detail_user_prompt_examples`。\n"
        f"- 科研图谱：{len(plots)} 项，已补字段契约式新手说明和逐屏叙事。\n"
        f"- 开源工具：{len(tools)} 项，已补工具学习边界、许可核对和复现路径说明。\n"
        f"- 文章流程：{len(articles)} 项，已补从0到1写作路径、图表计划和模型API使用边界。\n"
        "- 示例来源策略：使用公开研究元数据、PMID/数据库入口和本地重绘/合成教学图，不复制论文原图，不下载受控数据。\n"
        "- 真实性边界：所有医学AI输出仅用于教学与科研训练，不替代临床诊断；真实研究需用户自有数据、伦理审批和导师/专家复核。\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "methods": len(methods),
        "plots": len(plots),
        "tools": len(tools),
        "articles": len(articles),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

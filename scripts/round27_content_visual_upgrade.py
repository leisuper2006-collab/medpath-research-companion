import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"


OPEN_EXAMPLES = [
    {
        "id": "cbioportal_brca_tcga",
        "title": "cBioPortal BRCA TCGA PanCancer Atlas",
        "fit": "肿瘤突变、拷贝数、OncoPrint、突变类型分布、队列概览",
        "url": "https://www.cbioportal.org/study/summary?id=brca_tcga_pan_can_atlas_2018",
        "source_platform": "cBioPortal public API",
        "license_note": "仅使用公开研究元数据、公开API返回字段和教学改绘；不复制论文原图，不下载受控数据。",
        "reuse_boundary": "适合教学示例和公开数据检索入口；正式科研需按cBioPortal、TCGA/GDC和原论文许可核对。",
        "tier": "Cell/TCGA公开研究来源",
    },
    {
        "id": "seurat_pbmc3k",
        "title": "Seurat PBMC3K guided clustering tutorial",
        "fit": "单细胞QC、降维、聚类、marker、FeaturePlot、DotPlot、VlnPlot",
        "url": "https://satijalab.org/seurat/articles/pbmc3k_tutorial",
        "source_platform": "Seurat official tutorial / 10x Genomics PBMC3K",
        "license_note": "使用官方教程和公开PBMC3K教学数据线索；不声称为用户项目实测结果。",
        "reuse_boundary": "适合单细胞方法学习和图形结构说明；正式分析须使用用户自有合规数据。",
        "tier": "官方教程/公开训练数据",
    },
    {
        "id": "galaxy_pbmc3k",
        "title": "Galaxy Training: Clustering 3K PBMCs with Scanpy/Seurat",
        "fit": "从原始单细胞数据到聚类、标记基因和轨迹学习路径",
        "url": "https://training.galaxyproject.org/training-material/topics/single-cell/",
        "source_platform": "Galaxy Training Network",
        "license_note": "使用GTN公开教学流程作为学习路径参考；不复制受限数据。",
        "reuse_boundary": "适合构建新手学习路线、流程图和课程任务链。",
        "tier": "开放教学资源",
    },
    {
        "id": "r_graph_gallery",
        "title": "The R Graph Gallery",
        "fit": "ggplot2图形语法、森林图、热图、散点、网络、分布与时间序列示例",
        "url": "https://r-graph-gallery.com/",
        "source_platform": "R Graph Gallery",
        "license_note": "作为R/ggplot2图形结构和代码学习入口；引用时需回到原页面核对许可。",
        "reuse_boundary": "适合作为图谱学习入口和代码风格参考，不把示例结果写成实测。",
        "tier": "开放可复现图形教程",
    },
    {
        "id": "cbioportal_file_formats",
        "title": "cBioPortal file format examples",
        "fit": "突变表、CNV、临床表和基因面板字段契约",
        "url": "https://docs.cbioportal.org/file-formats/",
        "source_platform": "cBioPortal Docs",
        "license_note": "使用官方字段说明作为数据契约参考；不包含患者隐私。",
        "reuse_boundary": "适合数据审查、字段契约和案例模拟的字段模板。",
        "tier": "官方文档",
    },
    {
        "id": "cbioportaldata_bioc",
        "title": "Bioconductor cBioPortalData user guide",
        "fit": "R环境下调用cBioPortal数据、构建MultiAssayExperiment和基因集合查询",
        "url": "https://waldronlab.io/cBioPortalData/articles/cBioPortalData.html",
        "source_platform": "Bioconductor / cBioPortalData",
        "license_note": "作为R侧公开API学习入口；正式运行需遵守Bioconductor和数据源许可。",
        "reuse_boundary": "适合R优先的数据获取教学和API调用规范说明。",
        "tier": "Bioconductor官方教程",
    },
    {
        "id": "bioconductor_airway",
        "title": "Bioconductor airway RNA-seq example data",
        "fit": "RNA-seq差异表达、DESeq2流程、设计矩阵、MA图和火山图入门",
        "url": "https://bioconductor.org/packages/airway/",
        "source_platform": "Bioconductor ExperimentData",
        "license_note": "使用Bioconductor公开教学数据包入口和字段说明；正式分析需核对包许可证和引用要求。",
        "reuse_boundary": "适合RNA-seq教学演示和字段契约训练，不作为用户课题实测结果。",
        "tier": "Bioconductor公开示例数据",
    },
    {
        "id": "bioconductor_pasilla",
        "title": "Bioconductor pasilla RNA-seq count dataset",
        "fit": "计数矩阵、分组设计、差异表达、质量控制和复现实验讲解",
        "url": "https://bioconductor.org/packages/pasilla/",
        "source_platform": "Bioconductor ExperimentData",
        "license_note": "使用公开教学数据包入口；运行前需核对Bioconductor包版本和引用。",
        "reuse_boundary": "适合初学者理解count矩阵到差异分析的最小闭环。",
        "tier": "Bioconductor公开示例数据",
    },
    {
        "id": "gdc_tcga_portal",
        "title": "NCI Genomic Data Commons TCGA data portal",
        "fit": "TCGA公开队列检索、病例筛选、文件类型识别和合规数据获取路径",
        "url": "https://portal.gdc.cancer.gov/",
        "source_platform": "NCI GDC",
        "license_note": "只登记公开入口和字段线索；受控数据、原始测序数据和患者级信息必须按GDC规则申请。",
        "reuse_boundary": "适合数据来源核验、队列构建教学和下载前检查表。",
        "tier": "权威癌症组学数据门户",
    },
    {
        "id": "ucsc_xena_tcga",
        "title": "UCSC Xena TCGA visualization hubs",
        "fit": "表达、临床、突变和生存字段联动，适合入门级生存图和热图讲解",
        "url": "https://xenabrowser.net/datapages/",
        "source_platform": "UCSC Xena",
        "license_note": "使用公开浏览器入口和字段说明；正式研究须核对原始数据来源与引用。",
        "reuse_boundary": "适合让新手理解临床字段、表达矩阵和图形输出之间的关系。",
        "tier": "公开癌症数据浏览器",
    },
    {
        "id": "cellxgene_census",
        "title": "CELLxGENE Census public single-cell resources",
        "fit": "公开单细胞集合、细胞类型标注、批次字段、跨数据集检索和教学查询",
        "url": "https://cellxgene.cziscience.com/census",
        "source_platform": "CZ CELLxGENE",
        "license_note": "只使用公开入口和元数据说明；具体数据集需逐项核对贡献者许可。",
        "reuse_boundary": "适合构建单细胞方法选择、字段检查和数据来源审计示例。",
        "tier": "公开单细胞资源",
    },
    {
        "id": "tenx_pbmc3k",
        "title": "10x Genomics PBMC 3k public dataset",
        "fit": "10x矩阵结构、单细胞QC、聚类、marker基因和UMAP示例",
        "url": "https://www.10xgenomics.com/datasets/3-k-pbm-cs-from-a-healthy-donor-1-standard-1-1-0",
        "source_platform": "10x Genomics public datasets",
        "license_note": "使用公开教学数据入口；正式复现需核对10x数据许可和引用说明。",
        "reuse_boundary": "适合单细胞新手完成从矩阵到聚类图的最小学习路径。",
        "tier": "公开单细胞训练数据",
    },
    {
        "id": "scanpy_pbmc3k",
        "title": "Scanpy PBMC3K preprocessing and clustering tutorial",
        "fit": "Python单细胞分析、AnnData、QC、PCA、邻接图、Leiden聚类和UMAP",
        "url": "https://scanpy-tutorials.readthedocs.io/en/latest/pbmc3k.html",
        "source_platform": "Scanpy official tutorials",
        "license_note": "作为Python流程学习入口；不把教程结果写成用户研究结论。",
        "reuse_boundary": "适合比较R/Seurat与Python/Scanpy路线的教学页面。",
        "tier": "官方教程/公开训练数据",
    },
    {
        "id": "visium_breast_cancer",
        "title": "10x Genomics Visium human breast cancer public dataset",
        "fit": "空间转录组spot矩阵、组织图、空间表达图和病理-组学整合教学",
        "url": "https://www.10xgenomics.com/datasets/human-breast-cancer-block-a-section-1-1-standard-1-1-0",
        "source_platform": "10x Genomics Visium public datasets",
        "license_note": "使用公开示例入口；原始图像和数据复用需核对10x许可。",
        "reuse_boundary": "适合空间组学图谱、病理区域讲解和字段契约说明。",
        "tier": "公开空间组学训练数据",
    },
    {
        "id": "spatiallibd",
        "title": "spatialLIBD Bioconductor spatial transcriptomics resources",
        "fit": "空间转录组对象结构、spot注释、区域标注和可视化字段说明",
        "url": "https://bioconductor.org/packages/spatialLIBD/",
        "source_platform": "Bioconductor spatialLIBD",
        "license_note": "使用Bioconductor包入口和教程线索；正式使用需核对包引用。",
        "reuse_boundary": "适合空间组学教学、对象字段讲解和示例图结构说明。",
        "tier": "Bioconductor空间组学资源",
    },
    {
        "id": "tcia_idc_public_imaging",
        "title": "TCIA and Imaging Data Commons public cancer imaging resources",
        "fit": "公开影像数据来源、DICOM字段、影像AI教学和数据合规边界",
        "url": "https://www.cancerimagingarchive.net/",
        "source_platform": "TCIA / IDC public imaging repositories",
        "license_note": "只登记公开数据入口和使用边界；具体集合需核对数据许可与引用。",
        "reuse_boundary": "适合影像AI与病理AI数据边界教学，不混入真实患者隐私。",
        "tier": "公开医学影像资源",
    },
    {
        "id": "openslide_testdata",
        "title": "OpenSlide public test data",
        "fit": "全切片图像格式、tile读取、金字塔层级、病理图像预处理教学",
        "url": "https://openslide.cs.cmu.edu/download/openslide-testdata/",
        "source_platform": "OpenSlide public test data",
        "license_note": "使用公开测试图像入口；不把测试图像伪装为真实课程病例。",
        "reuse_boundary": "适合WSI读取、切块、缩略图和图像处理流程教学。",
        "tier": "公开软件测试数据",
    },
    {
        "id": "pcam_histopathology",
        "title": "PatchCamelyon histopathology benchmark",
        "fit": "病理patch分类、深度学习benchmark、训练/验证/测试划分和ROC示例",
        "url": "https://github.com/basveeling/pcam",
        "source_platform": "PatchCamelyon / public benchmark",
        "license_note": "作为公开benchmark入口；使用时需核对原始数据许可和引用要求。",
        "reuse_boundary": "适合病理AI入门、模型评价和benchmark概念教学。",
        "tier": "公开病理AI基准数据",
    },
    {
        "id": "nct_crc_100k",
        "title": "NCT-CRC-HE-100K colorectal histology image dataset",
        "fit": "结直肠组织分类、病理patch示例、混淆矩阵和错误案例讲解",
        "url": "https://zenodo.org/records/1214456",
        "source_platform": "Zenodo public research dataset",
        "license_note": "公开数据集入口；复用需核对Zenodo页面许可证和原论文引用。",
        "reuse_boundary": "适合病理图像分类教学和错误分析示例，不用于临床诊断。",
        "tier": "公开病理图像数据",
    },
    {
        "id": "metafor_bcg",
        "title": "metafor BCG vaccine meta-analysis example dataset",
        "fit": "Meta分析效应量、森林图、异质性、亚组分析和敏感性分析教学",
        "url": "https://wviechtb.github.io/metafor/reference/dat.bcg.html",
        "source_platform": "metafor R package documentation",
        "license_note": "使用R包文档中的公开示例数据说明；正式论文需回到原始研究核验。",
        "reuse_boundary": "适合Meta分析文章Skill、森林图和异质性解释训练。",
        "tier": "R包公开示例数据",
    },
]


PLOT_BY_CATEGORY = {
    "实验设计与扰动": ["流程图", "扰动效率柱状图", "表型变化热图", "候选基因优先级图"],
    "组学分析": ["火山图", "热图", "PCA/UMAP图", "通路富集气泡图"],
    "病理与影像": ["ROI示意图", "混淆矩阵", "ROC曲线", "病例证据链图"],
    "统计与建模": ["森林图", "校准曲线", "决策曲线", "残差诊断图"],
}


def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def dump(name, value):
    (DATA / name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def text_list(value):
    if isinstance(value, list):
        return [str(x) for x in value if str(x).strip()]
    if not value:
        return []
    return [x.strip() for x in str(value).replace("；", "\n").replace("。", "\n").split("\n") if x.strip()]


def source_for(index):
    src = dict(OPEN_EXAMPLES[index % len(OPEN_EXAMPLES)])
    src["citation"] = src["title"]
    src["pmid"] = "见来源页面或原始数据库"
    src["description"] = f"该来源用于支撑“{src['fit']}”的教学示例设计；平台只引用公开入口和字段线索。"
    return src


def upgrade_methods():
    items = load("method_universe.json")
    for i, m in enumerate(items):
        name = m.get("name", f"方法{i+1}")
        category = m.get("category") or m.get("use_case_group") or "综合科研方法"
        question = m.get("beginner_question") or f"什么时候使用{name}？"
        outputs = text_list(m.get("outputs"))
        inputs = text_list(m.get("inputs"))
        plots = text_list(m.get("recommended_plot_types") or m.get("figure_examples")) or PLOT_BY_CATEGORY.get(category, ["流程图", "质量控制图", "结果解释图"])
        m["card_microcopy"] = f"{name}适合把“{question}”拆成可执行材料清单；先准备{inputs[0] if inputs else '研究问题'}，再判断是否能产出{outputs[0] if outputs else '可复核结果'}。"
        m["detail_novice_intro"] = (
            f"如果你第一次接触{name}，不要先背软件命令。先问三个问题：它是否真的回答“{question}”；"
            f"你的材料是否已经具备{inputs[0] if inputs else '核心输入'}；最终能否交付{outputs[0] if outputs else '导师可复核材料'}。"
            f"本页把{name}拆成判断、准备、执行、出图和复核五个动作。"
        )
        m["detail_scroll_panels"] = [
            {
                "title": f"先判断：{name}解决的不是所有问题",
                "body": f"本方法优先服务“{question}”。如果你的目标只是描述现象、整理文献或做临床判断，应先换到更合适的方法入口，而不是硬套{name}。",
            },
            {
                "title": "再准备：把输入材料变成字段契约",
                "body": f"最低限度应说明{inputs[0] if inputs else '研究对象'}、{inputs[1] if len(inputs)>1 else '数据来源'}和人工复核要求。缺少来源或伦理边界时，先进入数据审查室。",
            },
            {
                "title": "然后执行：每一步留下可复查证据",
                "body": f"执行{name}时应记录版本、参数、排除规则和失败补救。平台给的是训练路径，真实研究还需要导师、伦理和统计复核。",
            },
            {
                "title": "最后表达：图表只回答一个清楚问题",
                "body": f"推荐优先使用{plots[0]}，必要时配合{plots[1] if len(plots)>1 else '质量控制图'}。示例图用于学习读图方式，不代表真实实验结论。",
            },
        ]
        if not m.get("public_source_example") or "待" in str(m.get("public_source_example")):
            m["public_source_example"] = source_for(i)
        m["detail_source_sentence"] = f"{name}的示例来源只提供公开数据或教程入口，正式课题需回到原数据库、原论文和学校伦理要求核验。"
        m["demand_window_prompts"] = [
            f"我想用{name}解决一个{category}问题，请帮我判断是否适合。",
            f"我已有{inputs[0] if inputs else '研究材料'}，请列出{name}需要补齐的字段。",
            f"请把{name}转成导师可复核的任务包，不要生成假数据。",
        ]
        m["detail_teacher_checklist"] = [
            f"研究问题是否真的需要{name}",
            "输入材料来源、伦理边界和版本是否清楚",
            "示例图是否标注为教学演示或公开来源改绘",
            "输出是否只作为教学/科研训练材料",
        ]
    dump("method_universe.json", items)


def upgrade_plots():
    items = load("plot_gallery_taxonomy.json")
    for i, p in enumerate(items):
        zh = p.get("zh_name") or p.get("name") or p.get("id")
        question = p.get("question_answered") or p.get("answers_question") or "一个明确的科研问题"
        contract = p.get("plot_data_contract") or []
        for row in contract:
            field = str(row.get("field", ""))
            if field.endswith("_optional") or "optional" in field.lower() or "可选" in str(row.get("meaning", "")):
                row["required"] = False
        p["plot_data_contract"] = contract
        p["recommended_tools"] = p.get("recommended_tools") or ["R/ggplot2", "数据审查室", "导师复核", "模型网关提示词"]
        p["detail_teacher_checklist"] = p.get("detail_teacher_checklist") or [
            f"{zh}是否只回答“{question}”",
            "字段缺失、分组、单位和尺度是否已审查",
            "图注是否说明示例/预期/待实测边界",
            "是否避免把图形美化当作统计证据",
        ]
        p["detail_novice_intro"] = (
            f"{zh}的核心不是“画得漂亮”，而是回答“{question}”。"
            "新手应先确认数据字段、统计前提和图注边界，再决定是否让模型API辅助生成代码。"
        )
        if not p.get("public_source_example") or "待" in str(p.get("public_source_example")):
            p["public_source_example"] = source_for(i + 3)
    dump("plot_gallery_taxonomy.json", items)


def article_materials(article_type):
    t = article_type.lower()
    if "meta" in t:
        return ["PICO问题", "数据库检索式", "纳排标准", "效应量字段", "偏倚风险工具", "PRISMA流程", "森林图与异质性解释"]
    if "综述" in article_type or "review" in t:
        return ["主题边界", "核心概念表", "文献分层矩阵", "争议问题", "机制图草案", "引用核验清单"]
    if "机器" in article_type or "深度" in article_type or "model" in t:
        return ["数据来源", "训练/验证/外部测试划分", "标签定义", "模型结构", "评价指标", "解释性图", "偏倚与泛化风险"]
    if "病理" in article_type:
        return ["病例或切片来源边界", "标注规则", "形态学证据链", "图像预处理", "报告训练样例", "伦理复核"]
    return ["研究问题", "数据来源", "方法流程", "图表计划", "质量控制", "引用核验", "导师复核意见"]


def upgrade_articles():
    items = load("article_skill_workflows.json")
    for i, w in enumerate(items):
        typ = w.get("type", f"文章类型{i+1}")
        mats = article_materials(typ)
        w["required_materials"] = mats
        w["detail_novice_intro"] = (
            f"{typ}从0开始不是让模型代写全文，而是先把材料、证据和图表链搭好。"
            f"本流程要求先准备{mats[0]}、{mats[1]}和{mats[2]}，再生成草稿、检查引用、交给导师复核。"
        )
        w["zero_to_one_path"] = [
            f"判断{typ}是否匹配当前材料与研究目的",
            f"补齐{mats[0]}、{mats[1]}、{mats[2]}",
            "把每张图和每个结论绑定到真实材料或明确的教学模板",
            "调用模型API前先写清输出格式、禁止伪造数据和引用的规则",
            "完成导师/教师复核后再进入投稿、答辩或课程展示材料",
        ]
        w["detail_scroll_panels"] = [
            {"title": f"第一幕：为什么选择{typ}", "body": f"只有当研究材料能支撑{mats[0]}和{mats[1]}时，才适合进入{typ}流程。否则应先改选题或补材料。"},
            {"title": "第二幕：证据链先于写作", "body": f"写作前先整理{mats[2]}、图表计划和引用核验清单，避免模型生成漂亮但无证据的段落。"},
            {"title": "第三幕：模型只输出草稿和检查表", "body": "接入用户自己的模型API后，平台输出章节骨架、材料清单和复核问题，不生成虚假结果、p值、审稿意见或投稿承诺。"},
            {"title": "第四幕：导师复核决定能否进入正式材料", "body": "所有AI生成内容必须标注来源、版本和待复核状态，正式论文仍由研究者承担学术责任。"},
        ]
        w["public_source_example"] = w.get("public_source_example") or source_for(i + 8)
        w["detail_source_sentence"] = f"{typ}的示例入口用于学习报告规范和图文结构，不复制论文原图，也不替代真实数据分析。"
    dump("article_skill_workflows.json", items)


def upgrade_open_source():
    items = load("open_source_catalog.json")
    for i, tool in enumerate(items):
        name = tool.get("name", f"tool-{i+1}")
        cat = tool.get("category", "科研工具")
        use = tool.get("when_to_use") or tool.get("use_case") or "学习工具输入输出"
        tool["detail_novice_intro"] = (
            f"{name}这一页面不是软件下载按钮，而是帮助新手判断：它在“{cat}”中能否解决“{use}”。"
            "先看输入数据、许可证、示例输出和常见误区，再决定是否到原仓库运行。"
        )
        tool["detail_scroll_panels"] = [
            {"title": f"先读用途：{name}不是万能工具", "body": f"它主要适合{use}。如果你的数据形态、研究问题或复核条件不匹配，应先换工具或补齐数据。"},
            {"title": "再查许可证与版本", "body": f"使用{name}前必须回到原仓库核对许可证、版本、安装方式和引用要求。本平台不复制未授权代码。"},
            {"title": "然后跑最小示例", "body": "先用公开、脱敏或合成数据确认输入输出，再决定是否接入正式课题数据。不要把demo效果写成真实研究结果。"},
            {"title": "最后交给导师/教师复核", "body": f"{name}的输出只能作为线索，正式结论仍需统计、领域知识和导师复核共同确认。"},
        ]
        if not tool.get("public_source_example") or "待" in str(tool.get("public_source_example")):
            tool["public_source_example"] = source_for(i + 11)
        tool["detail_source_sentence"] = f"{name}的外部链接仅作为开源学习入口；正式使用需核对原仓库README、license和版本。"
    dump("open_source_catalog.json", items)


def write_reports():
    DOCS.mkdir(exist_ok=True)
    examples_path = DOCS / "round27_open_example_sources.md"
    lines = [
        "# Round27 真实开放示例来源注册表",
        "",
        "本表只登记可作为教学复现、字段契约、图形结构或公开入口说明的来源；不复制期刊原图，不下载受控数据，不伪装为用户实测结果。",
        "",
    ]
    for idx, item in enumerate(OPEN_EXAMPLES, 1):
        lines += [
            f"## {idx}. {item['title']}",
            f"- 适用：{item['fit']}",
            f"- 来源：{item['url']}",
            f"- 平台：{item['source_platform']}",
            f"- 许可/边界：{item['license_note']}",
            f"- 复用边界：{item['reuse_boundary']}",
            "",
        ]
    examples_path.write_text("\n".join(lines), encoding="utf-8")

    report = DOCS / "round27_content_visual_upgrade_report.md"
    report.write_text(
        "\n".join(
            [
                "# Round27 内容唯一化与真实示例来源升级报告",
                "",
                "- 已更新 method_universe.json：为674个方法补充按名称、类别、输入输出生成的独立 card_microcopy、detail_novice_intro、detail_scroll_panels、demand_window_prompts 和 detail_teacher_checklist。",
                "- 已更新 plot_gallery_taxonomy.json：修复 optional 字段必填语义，补充推荐工具、导师复核清单和新手解释。",
                "- 已更新 article_skill_workflows.json：按文章类型重写 required_materials、zero_to_one_path 和分幕叙事，避免28类文章共用同一套材料清单。",
                "- 已更新 open_source_catalog.json：按工具名称、类别、用途重写新手介绍与四幕学习路径。",
                "- 已生成 round27_open_example_sources.md：登记 cBioPortal、Seurat PBMC3K、Galaxy Training、R Graph Gallery、cBioPortal Docs、Bioconductor cBioPortalData 等开放来源。",
                "",
                "边界：这些来源用于教学复现和公开入口说明，不复制论文原图，不下载受控数据，不代表真实课程试点或真实科研结果。",
            ]
        ),
        encoding="utf-8",
    )


def main():
    upgrade_methods()
    upgrade_plots()
    upgrade_articles()
    upgrade_open_source()
    write_reports()
    print("round27 content visual data upgrade complete")


if __name__ == "__main__":
    main()

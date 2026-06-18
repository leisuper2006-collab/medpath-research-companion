(function () {
  "use strict";

  const VERSION = "round120";
  const PLOT_BASE = "outputs/round110_plots";

  const state = {
    carouselIndex: 0,
    activeDiscipline: "medical",
    activeSubcat: "meta",
  };
  let carouselTimer = null;

  const navItems = [
    ["概览", "/home"],
    ["探索方法", "/method-runner"],
    ["科研绘图", "/plot-gallery"],
    ["Skill 市场", "/skills"],
    ["开源工具", "/open-source"],
    ["社区交流", "/community"],
    ["科研小岛", "/island"],
    ["自主建造", "/island-builder"],
    ["我的主页", "/profile"],
  ];

  const topTabs = [
    ["学习路径", "/home#learn"],
    ["公开数据", "/open-source"],
    ["教学资源", "/skills"],
    ["社区帖子", "/community"],
    ["模型接口", "/providers"],
  ];

  const recommended = [
    {
      title: "生成一个教学案例",
      desc: "输入课程主题，得到 PBL 情境、问题链和教师复核表。",
      sample: "胃腺癌本科病理 PBL",
      route: "/method-runner",
    },
    {
      title: "找一个科研方法",
      desc: "按数据类型推荐方法、工具、图表和学习路径。",
      sample: "单细胞肿瘤免疫差异",
      route: "/method-runner",
    },
    {
      title: "生成一张论文图",
      desc: "选图型、查字段、拿代码、写图注，适合新手起步。",
      sample: "log2FC + pvalue 火山图",
      route: "/plot-gallery",
    },
    {
      title: "创建自己的 Skill",
      desc: "把常用流程写成可收藏、可发布、可复用的任务卡。",
      sample: "森林图复核流程",
      route: "/skills",
    },
    {
      title: "进入科研小岛",
      desc: "把常用工具放进建筑，做任务、拿积分、拜访好友。",
      sample: "我的病理绘图岛",
      route: "/island",
    },
  ];

  const personas = [
    ["科研小白", "从“我想研究什么”开始，按步骤拿到方法、图和复核清单。", "/method-runner"],
    ["完成作业的学生", "直接看示例图、数据格式和代码模板，替换字段就能学。", "/plot-gallery"],
    ["老师", "准备课程案例、报告训练材料和学生评价量规。", "/skills"],
    ["写论文的人", "按文章类型规划图表、方法、结果和复现材料。", "/plot-gallery"],
    ["社区创作者", "发布自己的 Skill 和案例，按收藏量进入排行榜。", "/community"],
  ];

  const skills = [
    ["medpath-course-designer", "课程设计", "把课程目标拆成章节任务、课堂活动和评价材料。"],
    ["pathology-case-builder", "病理案例", "生成 PBL 情境、问题链、讨论提纲和教师复核点。"],
    ["em-pathology-tutor", "超微导学", "把电镜结构讲成学生能跟上的跨尺度解释。"],
    ["pathology-report-coach", "报告反馈", "检查学生病理报告结构、术语和证据链。"],
    ["plot-studio-runner", "科研绘图", "从图型、字段到代码、图注一套走完。"],
    ["method-runner", "方法运行", "按数据类型推荐路线、工具和风险提示。"],
    ["literature-review-helper", "综述助手", "整理检索词、纳排、证据表和综述框架。"],
    ["grant-outline-builder", "申报框架", "把想法整理成问题、方案、成果和评价路径。"],
    ["ai-ethics-governor", "伦理审计", "检查隐私、误导、假引用和临床风险。"],
    ["skill-eval-harness", "质量评测", "用 rubric 比较传统方式、提示词和 Skill。"],
  ];

  const skillDetails = {
    "medpath-course-designer": {
      tag: "老师常用",
      audience: "备课老师、课程助教、第一次做课程设计的研究生",
      input: "课程主题、课时、学生基础、考核方式",
      output: "章节目标、课堂活动、作业题、rubric 和教师复核表",
      demo: "输入“病理学胃癌章节 2 学时”，输出课堂问题链和形成性评价表。",
      plots: ["workflow_diagram", "logic_framework", "gantt"],
      route: "/method-runner/proposal-roadmap",
      community: "Path_Queen 的课程共创模板被收藏 1,840 次",
      safety: "不替代教师判断，所有课堂材料发布前需要课程组复核。",
    },
    "pathology-case-builder": {
      tag: "教学案例",
      audience: "病理学老师、PBL 小组、医学本科生",
      input: "病种、教学目标、难度、希望训练的诊断思路",
      output: "合成 PBL 情境、问题链、讨论提纲和教师审核清单",
      demo: "输入“胃腺癌本科 PBL”，输出合成病例背景和 6 个递进问题。",
      plots: ["workflow_diagram", "logic_framework", "attention_heatmap"],
      route: "/method-runner/computational-pathology",
      community: "胃癌 PBL 案例模板本周收藏 3,860 次",
      safety: "只生成合成教学案例，不作为真实病例或临床诊断依据。",
    },
    "em-pathology-tutor": {
      tag: "超微导学",
      audience: "基础医学学生、组织胚胎学和病理学学习者",
      input: "超微结构名称、相关疾病、学生容易混淆的概念",
      output: "跨尺度解释、导学问题、常见误区和图文复习卡",
      demo: "输入“线粒体肿胀和细胞损伤”，输出结构变化到疾病机制的解释。",
      plots: ["feature_plot", "trajectory", "workflow_diagram"],
      route: "/method-runner/survey-social-research",
      community: "超微结构速记卡被 920 位学生加入学习路径",
      safety: "仅用于教学解释，不把电镜描述写成临床诊断结论。",
    },
    "pathology-report-coach": {
      tag: "报告训练",
      audience: "病理学课程学生、规培前训练、课程助教",
      input: "学生病理报告草稿、训练目标、教师给定的参考结构",
      output: "结构问题、术语问题、证据链问题和教师复核建议",
      demo: "粘贴一段报告草稿，系统标出描述顺序、术语和证据缺口。",
      plots: ["confusion_matrix", "workflow_diagram", "logic_framework"],
      route: "/method-runner/computational-pathology",
      community: "报告反馈 Skill 在社区 Skill 榜第 1 名",
      safety: "只反馈学习报告，不给真实患者处置建议。",
    },
    "plot-studio-runner": {
      tag: "绘图工作室",
      audience: "写论文、做作业、准备汇报图的新手",
      input: "CSV 字段、图型目标、分组变量、希望生成的图注",
      output: "示例图、R/Python 代码、caption、methods 和字段审查",
      demo: "上传 log2FC 和 pvalue 字段，得到火山图代码和图注草稿。",
      plots: ["volcano", "umap", "forest_plot"],
      route: "/plot-gallery",
      community: "社区收藏了 42 个自定义绘图 Skill",
      safety: "模型只辅助代码和解释，图必须由本地数据真实绘制。",
    },
    "method-runner": {
      tag: "路线推荐",
      audience: "不知道从哪一步开始的科研新手",
      input: "一句研究需求、数据类型、学科方向和已有材料",
      output: "方法路线、适合图型、开源工具、风险提示和学习路径",
      demo: "输入“我有单细胞矩阵想看免疫差异”，推荐 UMAP、marker 和比例图。",
      plots: ["umap", "marker_dotplot", "cell_type_proportion"],
      route: "/method-runner",
      community: "方法路线被用来生成 120+ 个学习任务",
      safety: "推荐是学习建议，不替代导师或专业统计审核。",
    },
    "literature-review-helper": {
      tag: "综述起步",
      audience: "准备综述、课程论文或开题背景的新手",
      input: "研究问题、关键词、数据库、纳排条件",
      output: "检索式、证据表、综述结构和需要核验的引用清单",
      demo: "输入“肿瘤免疫治疗耐药综述”，输出检索词和主题框架。",
      plots: ["prisma_flow", "forest_plot", "network_graph"],
      route: "/method-runner/meta-analysis",
      community: "Meta 入门帖常被新手从这里打开",
      safety: "不生成伪引用，所有文献都必须人工核验。",
    },
    "grant-outline-builder": {
      tag: "申报框架",
      audience: "大创、教改、课程项目和基金申请准备者",
      input: "问题、已有基础、任务、平台和成果设想",
      output: "研究目标、工作包、技术路线、经费映射和验收指标",
      demo: "输入“AI Skills 医学教育项目”，输出 5 个工作包和经费逻辑。",
      plots: ["technology_roadmap", "budget_sankey", "gantt"],
      route: "/method-runner/proposal-roadmap",
      community: "申报路线模板被 680 人收藏",
      safety: "预期成果必须写拟形成、拟评价、待实测。",
    },
    "ai-ethics-governor": {
      tag: "安全边界",
      audience: "教师、学生团队、平台管理员和 Skill 发布者",
      input: "AI 输出、案例材料、引用、是否涉及患者或临床场景",
      output: "隐私风险、临床误导、假引用、学术诚信和复核建议",
      demo: "粘贴一段案例输出，识别是否含真实患者线索或诊疗建议。",
      plots: ["workflow_diagram", "logic_framework", "evaluation_radar"],
      route: "/providers",
      community: "所有公开 Skill 发布前都要通过伦理边界检查",
      safety: "医学 AI 输出仅用于教学与科研训练，不替代临床诊断。",
    },
    "skill-eval-harness": {
      tag: "质量评测",
      audience: "课程团队、社区管理员、Skill 作者",
      input: "Skill 输出、评价量规、负样本、教师评分字段",
      output: "质量评分模板、风险项、版本记录和 D10 字段映射",
      demo: "比较普通提示词和规范化 Skill 的输出，生成待实测评价表。",
      plots: ["evaluation_radar", "confusion_matrix", "workflow_diagram"],
      route: "/method-runner/proposal-roadmap",
      community: "社区 Skill 榜默认按收藏量、复核通过和复现次数排序",
      safety: "只生成评价模板，不伪造真实教学效果数据。",
    },
  };

  const toolGroups = [
    ["文献与综述", "PubMed、Europe PMC、OpenAlex、Zotero", "先做检索式，再做纳排和证据表。", "/method-runner"],
    ["单细胞与空间组学", "Seurat、Scanpy、Squidpy、CellChat", "从质控到注释、差异、通讯和空间邻域。", "/plot-gallery"],
    ["Meta 分析", "meta、metafor、PRISMA2020、robvis", "森林图不是第一步，先把研究问题和纳排表做好。", "/plot-gallery"],
    ["机器学习与预测", "scikit-learn、tidymodels、pROC、rms", "训练、验证、校准、ROC、DCA 和可解释性。", "/plot-gallery"],
    ["计算病理", "OpenSlide、QuPath、TIAToolbox、PyTorch", "切片切块、组织掩膜、特征嵌入和注意力热图。", "/plot-gallery"],
    ["科研写作", "论文结构、图注、Methods、复现材料", "把结果转成审稿人看得懂的叙述。", "/skills"],
  ];

  const posts = [
    ["Path_Queen", "我做了一个“病理报告批改 Skill”，适合本科训练", 2740, "Skill"],
    ["BioWalker", "单细胞图太多怎么选？我整理了入门顺序", 2310, "绘图"],
    ["小明同学", "胃癌 PBL 案例模板，老师复核后课堂可用", 3860, "案例"],
    ["MedScholar", "Meta 分析新手别先画森林图，先检查纳排表", 1420, "方法"],
  ];

  const methodCatalog = [
    {
      id: "single-cell-perturbation",
      title: "单细胞扰动分析",
      subtitle: "从细胞亚群变化出发，判断某个基因、通路或处理可能带来的状态转移。",
      audience: "适合有表达矩阵、细胞注释或公开单细胞数据的新手。",
      inputs: ["表达矩阵", "细胞注释", "处理组或拟扰动目标", "基础质控记录"],
      steps: ["确认细胞类型和批次", "选择扰动问题", "比较差异表达和细胞比例", "用虚拟扰动模型做探索", "用图表和复核清单解释结果"],
      outputs: ["UMAP 与 marker 图", "扰动前后细胞状态说明", "候选基因或通路列表", "导师复核问题清单"],
      plots: ["umap", "marker_dotplot", "cell_type_proportion", "volcano", "pseudotime"],
      tools: "Seurat、Scanpy、GEARS、scGen、CPA、scTenifoldKnk",
      risk: "虚拟扰动只能作为探索线索，不能替代真实实验验证。",
    },
    {
      id: "meta-analysis",
      title: "Meta 分析流程",
      subtitle: "先把研究问题、检索式、纳排和偏倚做好，再进入森林图和敏感性分析。",
      audience: "适合准备循证医学作业、综述论文或临床问题整理的人。",
      inputs: ["PICO 问题", "检索数据库", "纳排标准", "效应量字段", "偏倚评价表"],
      steps: ["写清 PICO", "制定检索式", "筛选文献", "提取效应量", "评估偏倚", "绘制森林图和漏斗图"],
      outputs: ["PRISMA 流程", "森林图", "漏斗图", "亚组分析说明", "Methods 模板"],
      plots: ["prisma_flow", "forest_plot", "funnel_plot", "subgroup_forest", "decision_curve"],
      tools: "meta、metafor、PRISMA2020、robvis",
      risk: "不要用图表掩盖纳排不清、结局定义不一致或异质性无法解释的问题。",
    },
    {
      id: "computational-pathology",
      title: "计算病理入门",
      subtitle: "把全切片图像拆成可训练、可解释、可复核的 patch 和模型评价材料。",
      audience: "适合想做病理 AI、WSI 预处理或模型解释的新手。",
      inputs: ["公开或授权切片", "组织区域标注", "模型任务", "训练和验证划分"],
      steps: ["确认数据边界", "生成组织掩膜", "切分 patch", "提取特征", "训练或调用模型", "输出热图和错误分析"],
      outputs: ["WSI 瓦片网格", "组织掩膜", "注意力热图", "混淆矩阵", "教师复核表"],
      plots: ["tile_grid", "wsi_tissue_mask", "attention_heatmap", "patch_embedding_umap", "confusion_matrix"],
      tools: "OpenSlide、QuPath、TIAToolbox、PyTorch",
      risk: "不得使用未授权患者数据，模型热图只用于教学或研究解释。",
    },
    {
      id: "machine-learning-prediction",
      title: "机器学习预测",
      subtitle: "从数据划分、特征、模型、验证到可解释图，一步步避免只报一个 AUC。",
      audience: "适合做临床预测、生物标志物筛选或课程作业的人。",
      inputs: ["训练集和验证集", "结局变量", "候选特征", "缺失值处理策略"],
      steps: ["定义结局", "拆分数据", "选择特征", "训练模型", "验证性能", "解释错误和校准"],
      outputs: ["ROC 和 PR 曲线", "校准曲线", "决策曲线", "混淆矩阵", "模型报告草稿"],
      plots: ["roc", "pr_curve", "calibration_curve", "decision_curve", "confusion_matrix"],
      tools: "scikit-learn、tidymodels、pROC、rms、DALEX",
      risk: "小样本高维数据容易过拟合，必须报告验证策略和不确定性。",
    },
    {
      id: "survey-social-research",
      title: "问卷与访谈研究",
      subtitle: "把量表、访谈主题和统计结果组织成能复核的图表与研究叙述。",
      audience: "适合医学教育、护理、管理、人文社科方向的课程研究。",
      inputs: ["问卷题项", "分组变量", "量表得分", "访谈编码", "伦理说明"],
      steps: ["检查题项结构", "清理缺失值", "计算量表得分", "做描述和相关分析", "整理主题和证据片段"],
      outputs: ["条形图", "相关热图", "密度图", "主题网络", "结果叙述模板"],
      plots: ["barplot", "correlation_heatmap", "density", "sankey", "network_graph"],
      tools: "R tidyverse、psych、lavaan、NVivo 导出表",
      risk: "不能把访谈内容去语境化，也不能暴露受访者身份信息。",
    },
    {
      id: "proposal-roadmap",
      title: "项目申报路线",
      subtitle: "把一个想法拆成问题、任务、平台、经费、成果和评价证据。",
      audience: "适合准备大创、课程项目、教改或基金申请的人。",
      inputs: ["研究问题", "已有基础", "任务分解", "平台条件", "预期成果"],
      steps: ["明确问题", "拆工作包", "选择技术路线", "设计评价指标", "映射经费和成果", "形成答辩图表"],
      outputs: ["逻辑框架", "技术路线", "甘特图", "经费流向", "评价雷达图"],
      plots: ["logic_framework", "technology_roadmap", "gantt", "budget_sankey", "evaluation_radar"],
      tools: "Mermaid、DiagrammeR、ggplot2、项目模板",
      risk: "预期成果要写成拟形成或待实测，不能写成已经完成。",
    },
  ];

  const plotCategories = [
    {
      id: "medical",
      name: "医学与临床",
      subs: [
        ["meta", "Meta 分析与循证", "森林图、漏斗图、PRISMA 流程和亚组分析。", ["forest_plot", "funnel_plot", "prisma_flow", "subgroup_forest", "consort_flow", "decision_curve", "roc"]],
        ["clinical", "临床预测", "生存、ROC、校准曲线和临床决策曲线。", ["kaplan_meier", "roc", "pr_curve", "calibration_curve", "decision_curve", "nomogram", "forest_plot"]],
        ["pathology", "计算病理", "切片瓦片、组织掩膜、注意力热图和模型评价。", ["tile_grid", "wsi_tissue_mask", "attention_heatmap", "patch_embedding_umap", "prototype_atlas", "confusion_matrix", "class_activation_map"]],
      ],
    },
    {
      id: "biology",
      name: "生物与组学",
      subs: [
        ["single_cell", "单细胞", "聚类、marker、轨迹、细胞比例和通讯分析。", ["umap", "tsne", "feature_plot", "marker_dotplot", "violin_by_cluster", "cell_type_proportion", "pseudotime", "trajectory", "rna_velocity", "cell_cell_communication_bubble"]],
        ["spatial", "空间组学", "空间表达、邻域、组织区域和配体受体图。", ["spatial_feature_plot", "spatial_cluster_map", "spatial_neighborhood_graph", "spatial_ligand_receptor_map", "tissue_region_composition", "spatial_ecology_map"]],
        ["enrichment", "差异与富集", "火山、热图、GSEA、ORA、富集点图和 ridge 图。", ["volcano", "ma_plot", "heatmap", "gsea_curve", "ora_barplot", "enrichment_dotplot", "ridgeplot_enrichment"]],
        ["network", "多组学与网络", "网络、桑基、弦图、circos 和交集图。", ["network_graph", "pathway_network", "sankey", "alluvial", "chord_diagram", "circos", "multi_omics_heatmap", "upset_plot"]],
      ],
    },
    {
      id: "engineering",
      name: "工科与算法",
      subs: [
        ["model_eval", "模型评估", "分类、回归、混淆矩阵、ROC/PR 和消融图。", ["confusion_matrix", "roc", "pr_curve", "scatter", "line", "barplot", "heatmap"]],
        ["workflow", "系统与流程", "架构图、任务流、甘特、预算流向和路线图。", ["workflow_diagram", "architecture_diagram", "technology_roadmap", "gantt", "budget_sankey", "logic_framework", "evaluation_radar"]],
      ],
    },
    {
      id: "humanities",
      name: "人文社科",
      subs: [
        ["survey", "问卷与访谈", "条形图、相关热图、密度、桑基和主题网络。", ["barplot", "boxplot", "violin", "correlation_heatmap", "density", "sankey", "network_graph"]],
        ["policy", "政策与项目", "逻辑框架、技术路线、甘特、评价雷达和经费流向。", ["logic_framework", "technology_roadmap", "workflow_diagram", "gantt", "evaluation_radar", "budget_sankey"]],
      ],
    },
  ];

  const plotInfo = {
    boxplot: ["箱线图", "比较多组连续变量的分布和离群点。", "ggplot2 / seaborn"],
    violin: ["小提琴图", "展示组间分布形状，适合表达异质性。", "ggplot2 / seaborn"],
    scatter: ["散点图", "看两个连续变量的关系、趋势和异常点。", "ggplot2 / matplotlib"],
    line: ["折线图", "表达时间、剂量或迭代过程中的连续变化。", "ggplot2 / matplotlib"],
    histogram: ["直方图", "检查变量分布和分箱后的频数。", "ggplot2 / matplotlib"],
    density: ["密度图", "平滑比较不同组的变量分布。", "ggplot2 / seaborn"],
    correlation_heatmap: ["相关热图", "快速查看变量之间的相关结构。", "corrplot / seaborn"],
    volcano: ["火山图", "差异分析里同时看效应量和显著性。", "EnhancedVolcano / ggplot2"],
    ma_plot: ["MA 图", "检查表达量均值与差异倍数的关系。", "DESeq2 / ggplot2"],
    heatmap: ["热图", "展示基因、样本或指标矩阵的模式。", "ComplexHeatmap / pheatmap"],
    gsea_curve: ["GSEA 曲线", "展示基因集沿排序列表的富集趋势。", "clusterProfiler / fgsea"],
    ora_barplot: ["ORA 条形图", "展示过表达富集分析的 Top 通路。", "clusterProfiler / ggplot2"],
    enrichment_dotplot: ["富集点图", "用点大小和颜色同时表达富集结果。", "clusterProfiler / ggplot2"],
    ridgeplot_enrichment: ["富集山脊图", "比较多个通路的基因排序分布。", "ggridges / enrichplot"],
    umap: ["UMAP", "把高维单细胞表达压缩到二维观察细胞群。", "Seurat / Scanpy"],
    tsne: ["tSNE", "展示细胞或样本在低维空间中的聚类关系。", "Seurat / Scanpy"],
    marker_dotplot: ["Marker 点图", "同时看 marker 表达强度和表达比例。", "Seurat DotPlot / Scanpy"],
    feature_plot: ["Feature Plot", "在低维图上观察基因或评分的空间分布。", "Seurat FeaturePlot / Scanpy"],
    violin_by_cluster: ["分群小提琴图", "按 cluster 比较基因或 score 的分布。", "Seurat VlnPlot / ggplot2"],
    cell_type_proportion: ["细胞比例图", "比较健康、疾病或处理组的细胞组成变化。", "ggplot2 / scanpy"],
    pseudotime: ["拟时序图", "展示细胞状态沿发育或疾病进展的变化。", "monocle3 / slingshot"],
    trajectory: ["轨迹图", "把分支路径和细胞状态变化放在同一图中。", "monocle3 / scvelo"],
    rna_velocity: ["RNA velocity", "推断细胞状态转移方向。", "scVelo / velocyto"],
    cell_cell_communication_bubble: ["细胞通讯气泡图", "展示细胞群之间配体受体信号强弱。", "CellChat / CellPhoneDB"],
    spatial_feature_plot: ["空间表达图", "把基因表达映射回组织位置。", "Seurat / Squidpy"],
    spatial_cluster_map: ["空间分群图", "展示组织切片中的空间 cluster。", "Seurat / Squidpy"],
    spatial_neighborhood_graph: ["空间邻域图", "分析细胞邻近关系和微环境结构。", "Squidpy / networkx"],
    spatial_ligand_receptor_map: ["空间配体受体图", "把通讯结果落回组织空间。", "Squidpy / CellChat"],
    tissue_region_composition: ["组织区域组成图", "比较不同组织区域的细胞构成。", "ggplot2 / pandas"],
    spatial_ecology_map: ["空间生态图", "展示肿瘤生态位或微环境分布。", "Squidpy / matplotlib"],
    circos: ["Circos 圈图", "展示基因组区段、通路或多组学连接。", "circlize / pycirclize"],
    chord_diagram: ["弦图", "展示类别之间的双向关系和强度。", "circlize / holoviews"],
    sankey: ["桑基图", "展示样本、流程或分类转移。", "ggalluvial / plotly"],
    alluvial: ["冲积图", "展示多阶段分类流向。", "ggalluvial / plotly"],
    network_graph: ["网络图", "展示基因、通路、工具或概念之间的连接。", "igraph / networkx"],
    pathway_network: ["通路网络", "把通路、基因和功能模块连起来。", "igraph / Cytoscape"],
    multi_omics_heatmap: ["多组学热图", "并排展示多层组学矩阵。", "ComplexHeatmap / seaborn"],
    upset_plot: ["UpSet 图", "展示多个集合交集，比韦恩图更清晰。", "UpSetR / upsetplot"],
    kaplan_meier: ["Kaplan-Meier 曲线", "比较分组后的生存差异。", "survminer / lifelines"],
    forest_plot: ["森林图", "Meta 分析或亚组结果的效应量展示。", "meta / forestplot"],
    subgroup_forest: ["亚组森林图", "观察不同亚组的效应一致性。", "meta / ggplot2"],
    funnel_plot: ["漏斗图", "评估发表偏倚或小样本效应。", "meta / metafor"],
    nomogram: ["列线图", "把预测模型转成临床可读评分工具。", "rms / regplot"],
    calibration_curve: ["校准曲线", "看预测概率和真实结局是否一致。", "rms / scikit-learn"],
    roc: ["ROC 曲线", "评估二分类模型区分能力。", "pROC / scikit-learn"],
    pr_curve: ["PR 曲线", "类别不平衡时评估模型表现。", "PRROC / scikit-learn"],
    decision_curve: ["决策曲线", "评估模型在不同阈值下的临床净获益。", "rmda / dcurves"],
    consort_flow: ["CONSORT 流程图", "展示临床研究对象筛选和纳入流程。", "DiagrammeR / graphviz"],
    prisma_flow: ["PRISMA 流程图", "展示综述检索、筛选和纳入流程。", "PRISMA2020 / DiagrammeR"],
    tile_grid: ["WSI 瓦片网格", "展示全切片如何切成模型输入 patch。", "OpenSlide / matplotlib"],
    wsi_tissue_mask: ["组织掩膜图", "展示切片中组织区域和背景分割。", "OpenCV / OpenSlide"],
    attention_heatmap: ["注意力热图", "展示模型关注的病理区域。", "PyTorch / matplotlib"],
    patch_embedding_umap: ["Patch 嵌入 UMAP", "展示病理 patch 特征空间结构。", "umap-learn / sklearn"],
    prototype_atlas: ["原型图谱", "展示模型学到的典型病理视觉模式。", "matplotlib / PIL"],
    class_activation_map: ["类别激活图", "解释模型分类时关注的局部区域。", "Grad-CAM / PyTorch"],
    confusion_matrix: ["混淆矩阵", "检查分类模型错在哪里。", "caret / scikit-learn"],
    gantt: ["甘特图", "规划课题进度和里程碑。", "ggplot2 / plotly"],
    technology_roadmap: ["技术路线图", "把研究路径拆成可执行步骤。", "DiagrammeR / mermaid"],
    logic_framework: ["逻辑框架图", "展示问题、任务、产出和评价之间的关系。", "DiagrammeR / graphviz"],
    budget_sankey: ["经费桑基图", "展示经费如何流向任务和成果。", "ggalluvial / plotly"],
    evaluation_radar: ["评价雷达图", "比较方案在多个指标上的表现。", "fmsb / matplotlib"],
    workflow_diagram: ["工作流图", "展示从输入到输出的步骤和责任点。", "DiagrammeR / mermaid"],
    architecture_diagram: ["系统架构图", "展示平台、模型、数据和用户之间的关系。", "draw.io / graphviz"],
    barplot: ["柱状图", "比较不同类别的数量或均值。", "ggplot2 / matplotlib"],
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
  }

  function routeOf() {
    const hash = window.location.hash || "#/home";
    return hash.replace(/^#/, "").split("?")[0] || "/home";
  }

  function isLegacyGameRoute(path) {
    return path === "/island" || path === "/island-builder" || path.startsWith("/island/");
  }

  function go(path) {
    window.location.hash = path;
  }

  function imgPath(plotId) {
    return `${PLOT_BASE}/${plotId}/example.png`;
  }

  function getPlot(plotId) {
    const item = plotInfo[plotId] || [plotId.replace(/_/g, " "), "展示数据结构和研究问题之间的关系。", "R / Python"];
    return { id: plotId, title: item[0], desc: item[1], pkg: item[2] };
  }

  function allPlotIds() {
    return Array.from(new Set(plotCategories.flatMap((cat) => cat.subs.flatMap((sub) => sub[3]))));
  }

  function currentCategory() {
    return plotCategories.find((cat) => cat.id === state.activeDiscipline) || plotCategories[0];
  }

  function currentSubcat() {
    const cat = currentCategory();
    return cat.subs.find((sub) => sub[0] === state.activeSubcat) || cat.subs[0];
  }

  function ensureSubcat() {
    const cat = currentCategory();
    if (!cat.subs.some((sub) => sub[0] === state.activeSubcat)) {
      state.activeSubcat = cat.subs[0][0];
    }
  }

  function appShell(content, active = "/home") {
    const nav = navItems.map(([label, path]) => {
      const activeClass = active === path || (active.startsWith(path) && path !== "/home") ? "is-active" : "";
      return `<a href="#${path}" class="${activeClass}" data-testid="nav-${path.slice(1)}">${escapeHtml(label)}</a>`;
    }).join("");
    const tabs = topTabs.map(([label, path]) => `<a class="mp-tab" href="#${path}">${escapeHtml(label)}</a>`).join("");
    return `
      <div class="mp-shell">
        <aside class="mp-sidebar">
          <div class="mp-brand">
            <div class="mp-brand-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>科研学习与 AI Skill 工作台</span></div>
          </div>
          <nav class="mp-nav">${nav}</nav>
        </aside>
        <main class="mp-main">
          <div class="mp-topbar">
            <div class="mp-tabs">${tabs}</div>
            <label class="mp-search">⌕<input placeholder="搜索方法、图型、数据集、问题..." aria-label="搜索" /></label>
            <button class="mp-user" data-route="/profile" aria-label="打开我的主页">我</button>
          </div>
          <div class="mp-page">${content}</div>
          ${assistantHtml()}
        </main>
      </div>`;
  }

  function heroFigure() {
    return `
      <div class="mp-figure-stage">
        <img src="${imgPath("umap")}" alt="单细胞示例图" onerror="this.src='${imgPath("heatmap")}'" />
        <div class="mp-quick-panel">
          <strong>示例：单细胞转录组测序与细胞亚群解析</strong>
          <span>用本项目代码生成的示例图展示 UMAP、marker 和细胞比例，不代表真实研究结论。</span>
        </div>
      </div>`;
  }

  function renderHome() {
    return appShell(`
      <section class="mp-hero">
        <div class="mp-hero-copy">
          <div class="mp-kicker">从问题到图表、方法和 Skill</div>
          <h1>把科研新手的第一步，变成能点开的工作流</h1>
          <p>你可以从一个问题、一张表、一个作业或一个课程主题开始。平台会给你方法路线、示例图、R/Python 模板、Skill 草案和复核清单。</p>
          <div class="mp-actions">
            <button class="mp-btn" data-route="/plot-gallery">看科研图谱</button>
            <button class="mp-btn secondary" data-route="/island">进入科研小岛</button>
          </div>
          <div class="mp-content-grid" style="margin-top:22px">
            <div class="mp-mini-card"><strong>60+</strong><span>图型与模板</span></div>
            <div class="mp-mini-card"><strong>10</strong><span>核心 Skill</span></div>
            <div class="mp-mini-card"><strong>BYOK</strong><span>自带模型 Key</span></div>
          </div>
        </div>
        ${heroFigure()}
      </section>
      <section class="mp-section" id="learn">
        <div class="mp-section-head">
          <div>
            <h2 class="mp-section-title">五个常用入口</h2>
            <p>桌面端横向滑动，移动端一屏一张多一点；每张卡都能进入真实页面。</p>
          </div>
          <div class="mp-actions"><button class="mp-btn secondary" data-carousel="prev">←</button><button class="mp-btn secondary" data-carousel="next">→</button></div>
        </div>
        <div class="mp-carousel">
          <div class="mp-carousel-track" data-carousel-track>
            ${recommended.map((item, i) => `
              <article class="mp-entry-card" data-index="${i}">
                <small>${String(i + 1).padStart(2, "0")}</small>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.desc)}</p>
                <div class="example"><b>输入：</b>${escapeHtml(item.sample)}<br><b>输出：</b>路线 + 示例 + 可复核材料</div>
                <button class="mp-btn" data-route="${item.route}">开始</button>
              </article>
            `).join("")}
          </div>
          <div class="mp-dots">${recommended.map((_, i) => `<button class="mp-dot ${i === 0 ? "is-active" : ""}" data-carousel-dot="${i}" aria-label="切换到第${i + 1}张"></button>`).join("")}</div>
        </div>
      </section>
      <section class="mp-section">
        <h2 class="mp-section-title">按身份进入</h2>
        <div class="mp-persona-grid">
          ${personas.map(([name, text, route]) => `
            <article class="mp-persona">
              <div class="mp-persona-mark">${escapeHtml(name.slice(0, 2))}</div>
              <h3>${escapeHtml(name)}</h3>
              <p>${escapeHtml(text)}</p>
              <div class="mp-actions"><button class="mp-btn lotus" data-route="${route}">进入</button><button class="mp-btn secondary" data-toast="已收藏这个入口">收藏</button></div>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="mp-section">
        <div class="mp-detail">
          <div>
            <h2 class="mp-section-title">这个项目能帮你做什么</h2>
            <p>它不是让你从零读一堆说明，而是把“提出问题、找方法、准备数据、画图、写图注、做 Skill、请老师复核”拆成可点击的小步骤。</p>
            <p>静态 GitHub Pages 只做演示；接入你自己的本地 Runtime 和模型 API 后，才会运行真实数据与代码。API Key 不会写进网站。</p>
          </div>
          <img src="${imgPath("workflow_diagram")}" alt="工作流示例图" />
        </div>
      </section>
    `, "/home");
  }

  function plotCard(id) {
    const plot = getPlot(id);
    return `
      <article class="mp-plot-card">
        <div class="mp-plot-thumb">
          <img src="${imgPath(id)}" alt="${escapeHtml(plot.title)}示例图" loading="lazy" onerror="this.src='${imgPath("scatter")}'" />
        </div>
        <div class="body">
          <small>${escapeHtml(plot.pkg)}</small>
          <h3>${escapeHtml(plot.title)}</h3>
          <p>${escapeHtml(plot.desc)}</p>
          <div class="mp-actions">
            <button class="mp-btn secondary" data-route="/plot-gallery/${id}">看详情</button>
            <button class="mp-btn lotus" data-route="/plot-run/${id}">开始</button>
          </div>
        </div>
      </article>`;
  }

  function renderPlotGallery() {
    ensureSubcat();
    const cat = currentCategory();
    const sub = currentSubcat();
    const subCards = sub[3].map((id) => plotCard(id)).join("");
    const fullCards = allPlotIds().map((id) => plotCard(id)).join("");
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div>
            <div class="mp-kicker">Research Plot Studio</div>
            <h1 class="mp-section-title">按学科找图，而不是在图名里迷路</h1>
            <p>先选学科，再选二级任务。每个图都有真实示例图、R/Python 包、字段要求和 BYOK 绘图流程。</p>
          </div>
          <button class="mp-btn" data-route="/plot-run/${sub[3][0]}">上传数据开始</button>
        </div>
        <div class="mp-content-grid">
          <aside class="mp-taxonomy">
            <h3>学科分类</h3>
            ${plotCategories.map((item) => `<button class="${item.id === state.activeDiscipline ? "is-active" : ""}" data-discipline="${item.id}">${escapeHtml(item.name)}</button>`).join("")}
          </aside>
          <div>
            <div class="mp-subcats">
              ${cat.subs.map((item) => `<button class="${item[0] === sub[0] ? "is-active" : ""}" data-subcat="${item[0]}">${escapeHtml(item[1])}</button>`).join("")}
            </div>
            <div class="mp-panel" style="margin:14px 0">
              <strong>${escapeHtml(sub[1])}</strong>
              <p>${escapeHtml(sub[2])} 下面展示的是可点击图卡，每张图都能进入详情和开始页。</p>
            </div>
            <div class="mp-plot-grid">${subCards}</div>
            <div class="mp-section" style="padding-left:0;padding-right:0">
              <div class="mp-section-head">
                <div>
                  <h2 class="mp-section-title">完整图谱库</h2>
                  <p>全部图型统一使用本项目已经生成的示例图，不再用同一张通用图冒充不同图型。</p>
                </div>
              </div>
              <div class="mp-plot-grid">${fullCards}</div>
            </div>
          </div>
        </div>
      </section>
    `, "/plot-gallery");
  }

  function renderPlotDetail(id) {
    const plot = getPlot(id);
    return appShell(`
      <section class="mp-section">
        <button class="mp-btn secondary" data-route="/plot-gallery">← 返回图谱</button>
        <div class="mp-detail" style="margin-top:18px">
          <div>
            <div class="mp-kicker">图型详情</div>
            <h1 class="mp-section-title">${escapeHtml(plot.title)}</h1>
            <p>${escapeHtml(plot.desc)}</p>
            <div class="mp-panel"><strong>这个图回答什么问题？</strong><p>它适合把数据结构、组间差异或模型表现用一张图讲清楚。新手先确认研究问题，再检查字段，最后才改配色和图注。</p></div>
            <div class="mp-content-grid" style="grid-template-columns:1fr 1fr">
              <div class="mp-card"><strong>必需字段</strong><p>样本 ID、分组、数值、坐标或效应量字段。不同图型会在开始页给出更细检查。</p></div>
              <div class="mp-card"><strong>推荐包</strong><p>${escapeHtml(plot.pkg)}。默认优先 R/ggplot2，需要交互或算法时补 Python。</p></div>
            </div>
            <div class="mp-actions"><button class="mp-btn" data-route="/plot-run/${id}">用这个图开始</button><button class="mp-btn secondary" data-toast="示例数据已加入下载队列">下载示例数据</button></div>
          </div>
          <figure class="mp-plot-detail-figure">
            <img src="${imgPath(id)}" alt="${escapeHtml(plot.title)}示例大图" onerror="this.src='${imgPath("scatter")}'" />
            <figcaption>示例图由项目内置虚拟数据和对应绘图脚本生成，用于说明图型结构和字段要求。</figcaption>
          </figure>
        </div>
        <div class="mp-content-grid" style="margin-top:18px">
          <div class="mp-panel"><h3>R 代码模板</h3><pre class="mp-code">library(ggplot2)
dat &lt;- read.csv("example_data.csv")
ggplot(dat, aes(x = group, y = value, fill = group)) +
  geom_boxplot(width = .55, alpha = .78) +
  theme_minimal(base_family = "sans")</pre></div>
          <div class="mp-panel"><h3>Python 代码模板</h3><pre class="mp-code">import pandas as pd
import seaborn as sns
dat = pd.read_csv("example_data.csv")
sns.set_theme(style="whitegrid")
sns.boxplot(data=dat, x="group", y="value")</pre></div>
        </div>
      </section>
    `, "/plot-gallery");
  }

  function renderPlotRun(id) {
    const plot = getPlot(id);
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div>
            <div class="mp-kicker">BYOK Plot Workflow</div>
            <h1 class="mp-section-title">开始生成：${escapeHtml(plot.title)}</h1>
            <p>GitHub Pages 演示走 mock。本地 Runtime 会读取你自己的 API 配置，并在本机运行 R/Python，不把 API Key 写进网页。</p>
          </div>
          <button class="mp-btn secondary" data-route="/plot-gallery/${id}">查看图型说明</button>
        </div>
        <div class="mp-content-grid">
          <div class="mp-panel"><h3>1. 选择 Skill</h3><label><input type="radio" name="skill-choice" checked> 官方 Skill：Plot Studio Runner</label><br><label><input type="radio" name="skill-choice"> 我的收藏 Skill：社区高赞图注复核流程</label><p>收藏 Skill 来自社区发布，按收藏量、复现次数和安全审计排序。</p></div>
          <div class="mp-panel"><h3>2. 数据与字段</h3><textarea style="width:100%;min-height:130px;border-radius:18px;border:1px solid var(--mp-line);padding:14px" placeholder="粘贴字段名，例如 sample, group, value, pvalue, log2FC..."></textarea><div class="mp-actions"><button class="mp-btn" data-toast="字段检查通过：这是 mock 演示，本地 Runtime 会做真实检查。">检查字段</button><button class="mp-btn secondary" data-toast="已加载示例数据">使用示例数据</button></div></div>
          <div class="mp-panel"><h3>3. 模型 API</h3><p><b>状态：</b>前端不读取真实 Key。请在本地 Runtime 的 .env.local 里配置，网页只显示 configured true/false。</p><pre class="mp-code">OPENAI_API_KEY=...
DEEPSEEK_API_KEY=...
QWEN_API_KEY=...</pre></div>
        </div>
        <div class="mp-detail" style="margin-top:18px">
          <figure class="mp-plot-detail-figure compact">
            <img src="${imgPath(id)}" alt="${escapeHtml(plot.title)}结果预览" onerror="this.src='${imgPath("scatter")}'" />
            <figcaption>当前为 mock 预览；真实运行时由本地 R/Python runtime 出图。</figcaption>
          </figure>
          <div><h3>运行结果预览</h3><p>当前为 mock 预览。真实运行时会输出：图、代码、source data、caption、methods、字段审查和导师复核清单。</p><div class="mp-actions"><button class="mp-btn" data-toast="mock 运行完成：已生成图注和复核清单。">运行本地绘图</button><button class="mp-btn secondary" data-toast="ZIP 导出为演示状态">导出 ZIP</button></div></div>
        </div>
      </section>
    `, "/plot-gallery");
  }

  function getSkill(id) {
    const base = skills.find((item) => item[0] === id) || skills[0];
    return {
      id: base[0],
      name: base[1],
      desc: base[2],
      ...(skillDetails[base[0]] || {}),
    };
  }

  function skillCard(skill) {
    const plots = (skill.plots || ["workflow_diagram"]).slice(0, 2);
    return `<article class="mp-skill-product">
      <div class="mp-skill-head">
        <span class="mp-skill-type">${escapeHtml(skill.tag || "Skill")}</span>
        <span>可试用</span>
      </div>
      <h3>${escapeHtml(skill.name)}</h3>
      <p>${escapeHtml(skill.desc)}</p>
      <div class="mp-skill-preview">${plots.map((id) => `<img src="${imgPath(id)}" alt="${escapeHtml(getPlot(id).title)}示例图" onerror="this.style.display='none'" />`).join("")}</div>
      <dl>
        <div><dt>适合</dt><dd>${escapeHtml(skill.audience || "科研学习者")}</dd></div>
        <div><dt>产出</dt><dd>${escapeHtml(skill.output || "可复核材料")}</dd></div>
      </dl>
      <div class="mp-actions"><a class="mp-btn" href="#/skills/${skill.id}" data-route="/skills/${skill.id}">看详情</a><button class="mp-btn secondary" data-toast="${escapeHtml(skill.name)} 已收藏到我的 Skill">收藏</button></div>
    </article>`;
  }

  function renderSkills() {
    const items = skills.map(([id]) => getSkill(id));
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div><div class="mp-kicker">Skill 市场</div><h1 class="mp-section-title">选一个能完成任务的 Skill</h1><p>每张卡只说三件事：适合谁、能产出什么、点开后怎么试用。</p></div>
          <button class="mp-btn" data-toast="Skill 创建器已打开：mock 演示">创建我的 Skill</button>
        </div>
        <div class="mp-skill-strip">
          <span>官方 Skill</span><span>社区收藏 Skill</span><span>教师复核</span><span>可发布到小岛建筑</span>
        </div>
        <div class="mp-skill-grid">
          ${items.map(skillCard).join("")}
        </div>
      </section>
    `, "/skills");
  }

  function renderSkillDetail(id) {
    const skill = getSkill(id);
    const plotCards = (skill.plots || ["workflow_diagram"]).map((plotId) => {
      const plot = getPlot(plotId);
      return `<a class="mp-mini-plot" href="#/plot-gallery/${plotId}" data-route="/plot-gallery/${plotId}">
        <img src="${imgPath(plotId)}" alt="${escapeHtml(plot.title)}示例图" onerror="this.style.display='none'" />
        <span>${escapeHtml(plot.title)}</span>
      </a>`;
    }).join("");
    return appShell(`
      <section class="mp-section">
        <button class="mp-btn secondary" data-route="/skills">返回 Skill 市场</button>
        <div class="mp-skill-detail">
          <div>
            <div class="mp-kicker">${escapeHtml(skill.tag || "Skill")}</div>
            <h1 class="mp-section-title">${escapeHtml(skill.name)}</h1>
            <p>${escapeHtml(skill.desc)}</p>
            <div class="mp-method-tags"><span>${escapeHtml(skill.audience)}</span><span>${escapeHtml(skill.community)}</span></div>
            <div class="mp-actions"><button class="mp-btn" data-toast="已打开本地 mock 试用面板">试用这个 Skill</button><button class="mp-btn secondary" data-toast="已加入我的收藏 Skill">收藏</button></div>
          </div>
          <div class="mp-method-preview">${plotCards}</div>
        </div>
        <div class="mp-skill-flow">
          <article class="mp-panel"><h3>你要输入什么</h3><p>${escapeHtml(skill.input)}</p></article>
          <article class="mp-panel"><h3>会得到什么</h3><p>${escapeHtml(skill.output)}</p></article>
          <article class="mp-panel"><h3>例子</h3><p>${escapeHtml(skill.demo)}</p></article>
          <article class="mp-panel risk"><h3>安全边界</h3><p>${escapeHtml(skill.safety)}</p></article>
        </div>
        <div class="mp-community-cta">
          <div><strong>想把它放进科研小岛？</strong><span>收藏后可以绑定到建筑。游戏页保持原来的像素小岛体验，本页只提供入口。</span></div>
          <div class="mp-actions"><button class="mp-btn" data-route="/island-builder">去自主建造</button><button class="mp-btn secondary" data-route="/community">看社区同款</button></div>
        </div>
      </section>
    `, "/skills");
  }

  function renderCommunity() {
    const leaderboard = skills.map(([id]) => getSkill(id)).slice().sort((a, b) => (b.community || "").length - (a.community || "").length).slice(0, 5);
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div><div class="mp-kicker">社区交流</div><h1 class="mp-section-title">找帖子、找 Skill、看榜单</h1><p>这里先做可点击的社区雏形：搜索、点赞、收藏、排行榜和拜访小岛入口。</p></div>
          <button class="mp-btn" data-toast="发布弹窗：mock 演示">发布帖子</button>
        </div>
        <div class="mp-forum-search">
          <input aria-label="搜索社区帖子和 Skill" placeholder="搜帖子、Skill、图型或作者，例如：森林图、报告反馈、PBL..." />
          <button class="mp-btn" data-toast="搜索为静态 mock：真实社区接入后会返回帖子和 Skill">搜索</button>
        </div>
        <div class="mp-community-grid">
          <div class="mp-forum-feed">
            <div class="mp-forum-tabs"><button class="is-active">最新帖子</button><button>高收藏 Skill</button><button>小岛拜访</button></div>
            ${posts.map(([author, title, likes, tag], i) => {
              const linkedSkill = getSkill(skills[i % skills.length][0]);
              return `<article class="mp-post">
                <span class="mp-post-rank">${i + 1}</span>
                <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(author)} · ${escapeHtml(tag)} · ${likes.toLocaleString()} 收藏</p><small>关联 Skill：${escapeHtml(linkedSkill.name)}</small></div>
                <div class="mp-actions"><button class="mp-btn secondary" data-toast="已点赞">点赞</button><a class="mp-btn" href="#/skills/${linkedSkill.id}" data-route="/skills/${linkedSkill.id}">打开 Skill</a></div>
              </article>`;
            }).join("")}
          </div>
          <aside class="mp-panel mp-leaderboard"><h3>本周 Skill 榜</h3>${leaderboard.map((skill, i) => `<a href="#/skills/${skill.id}" data-route="/skills/${skill.id}"><span>${i + 1}</span><strong>${escapeHtml(skill.name)}</strong><small>${escapeHtml(skill.tag)}</small></a>`).join("")}<button class="mp-btn secondary" data-route="/island">拜访热门小岛</button></aside>
        </div>
      </section>
    `, "/community");
  }

  function renderMethodRunner() {
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head"><div><div class="mp-kicker">Method Runner</div><h1 class="mp-section-title">先说数据和问题，再选方法</h1><p>每张卡都能打开完整路线：适合谁、要什么数据、怎么跑、出什么图、哪里容易踩坑。</p></div></div>
        <div class="mp-method-grid">
          ${methodCatalog.map((item) => `<article class="mp-method-card">
            <div class="mp-method-top"><span class="mp-method-badge">方法</span><span>${escapeHtml(item.tools.split("、")[0])}</span></div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.subtitle)}</p>
            <div class="mp-method-plots">${item.plots.slice(0, 3).map((id) => `<img src="${imgPath(id)}" alt="${escapeHtml(getPlot(id).title)}示例图" onerror="this.style.display='none'" />`).join("")}</div>
            <div class="mp-actions"><a class="mp-btn" href="#/method-runner/${item.id}" data-route="/method-runner/${item.id}">查看路线</a><a class="mp-btn secondary" href="#/plot-gallery/${item.plots[0]}" data-route="/plot-gallery/${item.plots[0]}">看示例图</a></div>
          </article>`).join("")}
        </div>
      </section>
    `, "/method-runner");
  }

  function getMethod(id) {
    return methodCatalog.find((item) => item.id === id) || methodCatalog[0];
  }

  function renderMethodDetail(id) {
    const item = getMethod(id);
    const plotCards = item.plots.map((plotId) => {
      const plot = getPlot(plotId);
      return `<button class="mp-mini-plot" data-route="/plot-gallery/${plotId}">
        <img src="${imgPath(plotId)}" alt="${escapeHtml(plot.title)}示例图" onerror="this.style.display='none'" />
        <span>${escapeHtml(plot.title)}</span>
      </button>`;
    }).join("");
    return appShell(`
      <section class="mp-section">
        <button class="mp-btn secondary" data-route="/method-runner">返回方法库</button>
        <div class="mp-method-hero">
          <div>
            <div class="mp-kicker">方法路线</div>
            <h1 class="mp-section-title">${escapeHtml(item.title)}</h1>
            <p>${escapeHtml(item.subtitle)}</p>
            <div class="mp-method-tags"><span>${escapeHtml(item.audience)}</span><span>${escapeHtml(item.tools)}</span></div>
            <div class="mp-actions"><button class="mp-btn" data-route="/plot-run/${item.plots[0]}">用示例开始</button><button class="mp-btn secondary" data-toast="已加入我的学习路径">加入学习路径</button></div>
          </div>
          <div class="mp-method-preview">${plotCards}</div>
        </div>
        <div class="mp-method-columns">
          <article class="mp-panel"><h3>你需要准备</h3><ul>${item.inputs.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul></article>
          <article class="mp-panel"><h3>会得到什么</h3><ul>${item.outputs.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul></article>
          <article class="mp-panel risk"><h3>先说清楚风险</h3><p>${escapeHtml(item.risk)}</p><button class="mp-btn secondary" data-route="/providers">配置 BYOK 助手</button></article>
        </div>
        <div class="mp-timeline">
          ${item.steps.map((step, index) => `<article><span>${index + 1}</span><strong>${escapeHtml(step)}</strong><p>${escapeHtml(methodStepHint(item.id, index))}</p></article>`).join("")}
        </div>
      </section>
    `, "/method-runner");
  }

  function methodStepHint(methodId, index) {
    const hints = {
      "single-cell-perturbation": ["先看质控和注释，不要一上来跑模型。", "把问题写成一个可检验的扰动目标。", "用差异和比例先做基础证据。", "虚拟扰动只给探索线索。", "每个结论都要有图和复核点。"],
      "meta-analysis": ["PICO 决定后面所有图。", "检索式要能复现。", "纳排记录比图更重要。", "效应量字段必须统一。", "异质性需要解释。", "图表服务结论，不替代判断。"],
      "computational-pathology": ["先确认授权和脱敏。", "组织掩膜决定后续质量。", "patch 不是越多越好。", "特征要能追溯回切片位置。", "模型输出要能让老师复核。", "错误样例也要留下来。"],
      "machine-learning-prediction": ["先定义结局和时间窗。", "训练验证不要混。", "特征选择要避免信息泄漏。", "性能不是只看 AUC。", "校准和决策曲线说明可用性。", "报告限制条件。"],
      "survey-social-research": ["题项和变量先对齐。", "缺失值处理要记录。", "量表计算要可复现。", "描述统计先行。", "主题分析要保留证据片段。"],
      "proposal-roadmap": ["一句话说清痛点。", "工作包要能验收。", "技术路线要能画出来。", "指标不要写成已完成。", "经费对应任务和成果。", "答辩图表要能一眼看懂。"],
    };
    return (hints[methodId] || [])[index] || "把这一步写成可检查的材料。";
  }

  function renderOpenSource() {
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div><div class="mp-kicker">Open Source Navigator</div><h1 class="mp-section-title">先问用途，再进仓库</h1><p>这里不把 GitHub 仓库堆成目录。你先选研究任务，再看它需要什么数据、适合什么工具、有没有本地运行门槛，以及能不能转成自己的 Skill。</p></div>
          <button class="mp-btn" data-toast="已生成工具筛选草案：mock 演示">帮我筛工具</button>
        </div>
        <div class="mp-tool-grid">
          ${toolGroups.map(([title, tools, desc, route]) => `<article class="mp-tool-card"><div class="mp-tool-eyebrow">开源路线</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p><div class="mp-tool-stack">${tools.split("、").map((tool) => `<span>${escapeHtml(tool)}</span>`).join("")}</div><div class="mp-actions"><button class="mp-btn" data-route="${route}">看方法</button><button class="mp-btn secondary" data-toast="已加入你的工具箱：${escapeHtml(title)}">收藏</button></div></article>`).join("")}
        </div>
        <div class="mp-detail" style="margin-top:22px">
          <div><h2 class="mp-section-title">新手怎么用这一页</h2><p>如果你还不知道该用哪个仓库，先写一句话：“我有什么数据，想回答什么问题”。平台会把它拆成检索、安装、输入格式、示例结果、风险提示和复现材料。</p><div class="mp-panel"><strong>例子</strong><p>“我有单细胞表达矩阵，想看免疫细胞亚群差异。”系统会推荐 Seurat/Scanpy 入门流程、UMAP、marker dotplot、细胞比例图，并提示先做质控和注释。</p></div></div>
          <img src="${imgPath("network_graph")}" alt="开源工具关系示例图" onerror="this.src='${imgPath("workflow_diagram")}'" />
        </div>
      </section>
    `, "/open-source");
  }

  function renderProfile() {
    const recent = [
      ["最近打开", "UMAP 图谱详情", "/plot-gallery/umap"],
      ["收藏 Skill", "病理报告反馈 Skill", "/skills"],
      ["小岛入口", "我的科研小岛", "/island"],
      ["社区互动", "Meta 分析森林图复核帖", "/community"],
    ];
    return appShell(`
      <section class="mp-section">
        <div class="mp-profile-hero"><div class="mp-avatar">易</div><div><div class="mp-kicker">My Research Desk</div><h1 class="mp-section-title">我的主页</h1><p>这里记录你的常用图、收藏 Skill、学习路径、小岛建筑和社区发布。现在是本地演示状态，真实账号、关注和云同步需要后端接入后启用。</p></div><button class="mp-btn" data-toast="个人资料编辑为 mock 演示">编辑主页</button></div>
        <div class="mp-profile-stats"><div class="mp-mini-card"><strong>12</strong><span>收藏 Skill</span></div><div class="mp-mini-card"><strong>28</strong><span>保存图谱</span></div><div class="mp-mini-card"><strong>860</strong><span>科研积分</span></div><div class="mp-mini-card"><strong>4</strong><span>发布案例</span></div></div>
        <div class="mp-content-grid" style="margin-top:22px">
          <div class="mp-panel"><h3>我的路径</h3><p>推荐继续学习：单细胞转录组测序与细胞亚群解析。</p><button class="mp-btn" data-route="/plot-gallery">继续学习</button></div>
          <div class="mp-community-list">${recent.map(([tag, title, route], index) => `<article class="mp-post"><span class="mp-post-rank">${index + 1}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(tag)}</p></div><button class="mp-btn secondary" data-route="${route}">打开</button></article>`).join("")}</div>
        </div>
      </section>
    `, "/profile");
  }

  function renderProvidersRuntime() {
    const providers = [
      ["OpenAI", "OPENAI_API_KEY", "用于代码解释、图注和字段审查"],
      ["DeepSeek", "DEEPSEEK_API_KEY", "适合中文科研问答和代码草案"],
      ["Qwen", "QWEN_API_KEY", "适合中文本地化任务"],
      ["自定义 OpenAI-compatible", "CUSTOM_BASE_URL", "适合学校或实验室自建网关"],
    ];
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head"><div><div class="mp-kicker">BYOK Runtime</div><h1 class="mp-section-title">密钥留在你自己的电脑里</h1><p>GitHub Pages 只演示流程。真正调用模型、运行 R/Python、读取用户数据时，应在本地 Runtime 或你自己的服务器里完成，前端只显示 configured true/false。</p></div><button class="mp-btn" data-toast="连接测试为 mock：未读取任何真实密钥">测试连接</button></div>
        <div class="mp-provider-grid">${providers.map(([name, env, desc]) => `<article class="mp-card"><h3>${escapeHtml(name)}</h3><p>${escapeHtml(desc)}</p><pre class="mp-code">${escapeHtml(env)}=...</pre><span class="mp-status">未在前端保存 Key</span></article>`).join("")}</div>
        <div class="mp-detail" style="margin-top:22px"><div><h2 class="mp-section-title">绘图时模型做什么</h2><p>模型不替你编造结果。它只帮助理解字段、生成或修正代码、解释报错、写图注和 methods。图像由本地 R/Python 根据你的数据生成。</p><div class="mp-actions"><button class="mp-btn" data-route="/plot-run/umap">试一个绘图流程</button><button class="mp-btn secondary" data-route="/plot-gallery">看图谱库</button></div></div><img src="${imgPath("workflow_diagram")}" alt="BYOK运行流程示例图" /></div>
      </section>
    `, "/providers");
  }

  function renderFallback() {
    return appShell(`<section class="mp-section"><div class="mp-detail"><div><div class="mp-kicker">MedPath</div><h1 class="mp-section-title">页面正在接入</h1><p>这个入口已接入新版路由。若是 mock 按钮，会给出反馈而不是无响应。</p><button class="mp-btn" data-route="/home">回到首页</button></div><img src="${imgPath("workflow_diagram")}" alt="页面示例图" /></div></section>`, "/home");
  }

  function assistantHtml() {
    return `
      <div class="mp-assistant" data-assistant>
        <button class="mp-assistant-button" data-assistant-toggle aria-label="打开科研助手"><span class="mp-robot">▣</span></button>
        <div class="mp-assistant-panel" hidden>
          <strong>像素科研助手</strong>
          <p>问我“我做 meta 分析画什么图”或“打开科研小岛”。未配置 API 时我只做本地规则回答。</p>
          <textarea placeholder="说出你的任务..."></textarea>
          <div class="mp-actions"><button class="mp-btn" data-assistant-send>提问</button><button class="mp-btn secondary" data-assistant-close>收起</button></div>
          <p data-assistant-answer>提示：配置自己的模型 API 后，可让助手改代码、查字段、写图注。</p>
        </div>
      </div>`;
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    const path = routeOf();
    if (isLegacyGameRoute(path)) {
      document.body.classList.remove("medpath-dynamic-only");
      document.body.classList.remove("medpath-dynamic");
      if (app.getAttribute("data-medpath-dynamic-owned") === VERSION) {
        app.removeAttribute("data-medpath-dynamic-owned");
        const key = `medpath-legacy-handoff:${path}`;
        if (sessionStorage.getItem(key) !== "done") {
          sessionStorage.setItem(key, "done");
          window.location.reload();
        }
      }
      return;
    }
    for (let i = sessionStorage.length - 1; i >= 0; i -= 1) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("medpath-legacy-handoff:")) sessionStorage.removeItem(key);
    }

    document.body.classList.add("medpath-dynamic");
    window.__MEDPATH_DYNAMIC_RENDERING__ = true;
    let html;
    if (path === "/" || path === "/home") html = renderHome();
    else if (path === "/plot-gallery" || path === "/plot-studio") html = renderPlotGallery();
    else if (path.startsWith("/plot-gallery/")) html = renderPlotDetail(path.split("/").pop());
    else if (path.startsWith("/plot-run/")) html = renderPlotRun(path.split("/").pop());
    else if (path === "/skills") html = renderSkills();
    else if (path.startsWith("/skills/")) html = renderSkillDetail(path.split("/").pop());
    else if (path === "/community") html = renderCommunity();
    else if (path === "/method-runner") html = renderMethodRunner();
    else if (path.startsWith("/method-runner/")) html = renderMethodDetail(path.split("/").pop());
    else if (path === "/open-source") html = renderOpenSource();
    else if (path === "/profile") html = renderProfile();
    else if (path === "/providers" || path === "/runtime") html = renderProvidersRuntime();
    else html = renderFallback();
    app.innerHTML = html;
    app.setAttribute("data-medpath-dynamic-owned", VERSION);
    bindEvents();
    window.__MEDPATH_DYNAMIC_RENDERING__ = false;
  }

  function ordinaryRouteNeedsRender() {
    const app = document.getElementById("app");
    if (!app || isLegacyGameRoute(routeOf())) return false;
    const text = app.textContent || "";
    if (app.getAttribute("data-medpath-dynamic-owned") !== VERSION) return true;
    if (!app.querySelector(".mp-shell")) return true;
    if (!text.includes("MedPath Research Companion")) return true;
    if (routeOf() === "/home" && !text.includes("把科研新手的第一步")) return true;
    if (routeOf() === "/open-source" && !text.includes("先问用途，再进仓库")) return true;
    if ((routeOf() === "/providers" || routeOf() === "/runtime") && !text.includes("密钥留在你自己的电脑里")) return true;
    return false;
  }

  function bindEvents() {
    document.querySelectorAll("[data-route]").forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        go(el.getAttribute("data-route"));
      });
    });
    document.querySelectorAll("[data-toast]").forEach((el) => {
      el.addEventListener("click", () => toast(el.getAttribute("data-toast")));
    });
    document.querySelectorAll("[data-discipline]").forEach((el) => {
      el.addEventListener("click", () => {
        state.activeDiscipline = el.getAttribute("data-discipline");
        ensureSubcat();
        render();
      });
    });
    document.querySelectorAll("[data-subcat]").forEach((el) => {
      el.addEventListener("click", () => {
        state.activeSubcat = el.getAttribute("data-subcat");
        render();
      });
    });
    document.querySelectorAll("[data-carousel]").forEach((el) => {
      el.addEventListener("click", () => moveCarousel(el.getAttribute("data-carousel") === "next" ? 1 : -1));
    });
    document.querySelectorAll("[data-carousel-dot]").forEach((el) => {
      el.addEventListener("click", () => setCarousel(Number(el.getAttribute("data-carousel-dot"))));
    });
    const assistant = document.querySelector("[data-assistant]");
    if (assistant) {
      const panel = assistant.querySelector(".mp-assistant-panel");
      assistant.querySelector("[data-assistant-toggle]")?.addEventListener("click", () => panel.hidden = !panel.hidden);
      assistant.querySelector("[data-assistant-close]")?.addEventListener("click", () => panel.hidden = true);
      assistant.querySelector("[data-assistant-send]")?.addEventListener("click", () => answerAssistant(assistant));
    }
    setCarousel(state.carouselIndex, false);
    startCarouselAuto();
  }

  function answerAssistant(assistant) {
    const text = assistant.querySelector("textarea")?.value || "";
    const answer = assistant.querySelector("[data-assistant-answer]");
    if (/小岛|岛|游戏/.test(text)) {
      answer.textContent = "我建议打开科研小岛：那里可以把常用功能放进建筑。";
      setTimeout(() => go("/island"), 350);
    } else if (/meta|森林|循证/.test(text)) {
      answer.textContent = "Meta 分析常用：森林图、漏斗图、PRISMA 流程、亚组森林图。我已切到医学 Meta 分类。";
      state.activeDiscipline = "medical";
      state.activeSubcat = "meta";
      setTimeout(() => go("/plot-gallery"), 350);
    } else if (/单细胞|umap|marker/i.test(text)) {
      answer.textContent = "单细胞入门先看 UMAP、Feature Plot、Marker 点图和细胞比例图。";
      state.activeDiscipline = "biology";
      state.activeSubcat = "single_cell";
      setTimeout(() => go("/plot-gallery"), 350);
    } else {
      answer.textContent = "本地规则助手已响应。若要让大模型按你的数据推荐，请先在本地 Runtime 配置自己的 API Key。";
    }
  }

  function moveCarousel(delta) {
    setCarousel((state.carouselIndex + delta + recommended.length) % recommended.length);
  }

  function setCarousel(index, scroll = true) {
    state.carouselIndex = Math.max(0, Math.min(recommended.length - 1, index));
    const track = document.querySelector("[data-carousel-track]");
    const card = track?.querySelector(".mp-entry-card");
    if (track && card && scroll) {
      track.scrollTo({ left: card.offsetWidth * state.carouselIndex, behavior: "smooth" });
    }
    document.querySelectorAll(".mp-dot").forEach((dot, i) => dot.classList.toggle("is-active", i === state.carouselIndex));
  }

  function startCarouselAuto() {
    window.clearInterval(carouselTimer);
    const track = document.querySelector("[data-carousel-track]");
    if (!track || isLegacyGameRoute(routeOf())) return;
    carouselTimer = window.setInterval(() => {
      if (document.hidden || isLegacyGameRoute(routeOf())) return;
      moveCarousel(1);
    }, 5200);
    if (!track.dataset.autoBound) {
      track.dataset.autoBound = "true";
      track.addEventListener("mouseenter", () => window.clearInterval(carouselTimer));
      track.addEventListener("mouseleave", startCarouselAuto);
    }
  }

  function toast(message) {
    const old = document.querySelector(".mp-toast");
    old?.remove();
    const el = document.createElement("div");
    el.className = "mp-toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("load", () => {
    setTimeout(render, 80);
    setTimeout(render, 420);
    setTimeout(render, 1200);
    setTimeout(render, 2400);
    setTimeout(render, 4200);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

  const appNode = document.getElementById("app");
  if (appNode) {
    let guardTimer = null;
    const observer = new MutationObserver(() => {
      if (window.__MEDPATH_DYNAMIC_RENDERING__) return;
      window.clearTimeout(guardTimer);
      guardTimer = window.setTimeout(() => {
        const app = document.getElementById("app");
        if (!app || isLegacyGameRoute(routeOf())) return;
        if (ordinaryRouteNeedsRender()) render();
      }, 60);
    });
    observer.observe(appNode, { childList: true, subtree: false });
  }

  let watchdogTicks = 0;
  const watchdog = window.setInterval(() => {
    watchdogTicks += 1;
    if (ordinaryRouteNeedsRender()) render();
    if (watchdogTicks > 12) window.clearInterval(watchdog);
  }, 900);

  window.MedPathDynamicApp = { version: VERSION, render, allPlotIds, plotCategories };
})();

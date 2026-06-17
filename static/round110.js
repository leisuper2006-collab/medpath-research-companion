(() => {
  window.MEDPATH_ROUND110_WORKBENCH = true;
  const ASSET_BASE = window.MEDPATH_ASSET_BASE || "";
  const fullPlotIds = new Set([
    "boxplot", "violin", "barplot", "scatter", "line", "histogram", "density", "correlation_heatmap",
    "volcano", "ma_plot", "heatmap", "gsea_curve", "ora_barplot", "enrichment_dotplot", "ridgeplot_enrichment",
    "umap", "tsne", "marker_dotplot", "feature_plot", "violin_by_cluster", "cell_type_proportion",
    "pseudotime", "trajectory", "rna_velocity", "cell_cell_communication_bubble", "ligand_receptor_network",
    "spatial_feature_plot", "spatial_cluster_map", "spatial_neighborhood_graph", "spatial_ligand_receptor_map",
    "tissue_region_composition", "circos", "chord_diagram", "sankey", "alluvial", "network_graph",
    "pathway_network", "multi_omics_heatmap", "upset_plot", "kaplan_meier", "forest_plot", "nomogram",
    "calibration_curve", "roc", "pr_curve", "decision_curve", "subgroup_forest", "consort_flow", "prisma_flow",
    "tile_grid", "wsi_tissue_mask", "attention_heatmap", "patch_embedding_umap", "prototype_atlas",
    "spatial_ecology_map", "confusion_matrix", "class_activation_map", "gantt", "technology_roadmap",
    "logic_framework", "budget_sankey", "evaluation_radar", "workflow_diagram", "architecture_diagram",
  ]);

  const topRoutes = [
    ["home", "探索方法"],
    ["plot-studio", "科研绘图"],
    ["skills", "Skill 市场"],
    ["open-source", "公开工具"],
    ["community", "社区交流"],
    ["providers", "模型接口"],
    ["island", "科研小岛"],
  ];

  const stepRoutes = [
    ["step-problem", "提出问题"],
    ["step-design", "设计研究"],
    ["step-data", "获取数据"],
    ["step-analysis", "分析验证"],
    ["step-results", "解读结果"],
    ["step-ethics", "伦理与安全"],
    ["step-share", "分享复现"],
  ];

  const categories = [
    {
      id: "basic",
      label: "基础统计图",
      intro: "先看分布、差异和变量关系，适合作业、开题和结果初筛。",
      plots: [
        ["boxplot", "箱线图", "比较多组数值分布", "group,value"],
        ["violin", "小提琴图", "同时看分布形状和组间差异", "group,value"],
        ["barplot", "柱状图", "展示类别计数或均值", "category,value"],
        ["scatter", "散点图", "判断两个变量是否相关", "x,y,group"],
        ["line", "折线图", "展示随时间变化的趋势", "time,value,group"],
        ["histogram", "直方图", "检查数值分布和异常值", "value"],
        ["density", "密度图", "比较连续变量分布形状", "value,group"],
        ["correlation_heatmap", "相关热图", "查看多变量相关结构", "variable_a,variable_b,r"],
      ],
    },
    {
      id: "de_enrich",
      label: "差异与富集",
      intro: "差异基因、富集通路、结果筛选和机制解释常用。",
      plots: [
        ["volcano", "火山图", "同时展示变化幅度和显著性", "gene,log2FC,pvalue"],
        ["ma_plot", "MA 图", "查看表达丰度与差异倍数", "mean,log2FC"],
        ["heatmap", "表达热图", "展示基因或样本聚类模式", "gene,sample,value"],
        ["gsea_curve", "GSEA 曲线", "展示基因集富集趋势", "rank,running_score"],
        ["ora_barplot", "ORA 柱图", "展示显著富集通路排名", "term,count,pvalue"],
        ["enrichment_dotplot", "富集气泡图", "同时看比例、数量和显著性", "term,ratio,count,fdr"],
        ["ridgeplot_enrichment", "富集岭线图", "比较通路内部基因分布", "term,value"],
      ],
    },
    {
      id: "single_cell",
      label: "单细胞",
      intro: "从细胞分群、标记基因、组成变化到轨迹和通讯。",
      plots: [
        ["umap", "UMAP", "查看细胞邻域和群体结构", "UMAP_1,UMAP_2,cluster"],
        ["tsne", "t-SNE", "降维展示细胞群", "tSNE_1,tSNE_2,cluster"],
        ["marker_dotplot", "Marker DotPlot", "展示各群标记基因表达", "gene,cluster,avg,pct"],
        ["feature_plot", "FeaturePlot", "把基因表达投到降维图上", "UMAP_1,UMAP_2,expression"],
        ["violin_by_cluster", "分群小提琴图", "比较基因在细胞群中的表达", "cluster,expression"],
        ["cell_type_proportion", "细胞比例图", "比较样本或分组的细胞组成", "group,cell_type,proportion"],
        ["pseudotime", "拟时序图", "展示状态转换路径", "dim1,dim2,pseudotime"],
        ["trajectory", "轨迹图", "展示发育或疾病进展路径", "dim1,dim2,state"],
        ["rna_velocity", "RNA velocity", "展示细胞状态方向", "x,y,vx,vy"],
        ["cell_cell_communication_bubble", "细胞通讯气泡图", "比较发送和接收细胞信号", "sender,receiver,score"],
        ["ligand_receptor_network", "配体受体网络", "展示细胞间互作关系", "ligand,receptor,cell_type"],
      ],
    },
    {
      id: "spatial",
      label: "空间组学",
      intro: "把表达、分区和邻域关系放回组织空间里看。",
      plots: [
        ["spatial_feature_plot", "空间表达图", "查看组织区域内的基因信号", "x,y,value"],
        ["spatial_cluster_map", "空间分群图", "展示组织区域中的细胞群", "x,y,cluster"],
        ["spatial_neighborhood_graph", "空间邻域图", "展示相邻区域或细胞关系", "x,y,node,edge"],
        ["spatial_ligand_receptor_map", "空间配体受体图", "查看局部互作信号", "x,y,signal"],
        ["tissue_region_composition", "组织区域组成图", "比较不同区域细胞组成", "region,cell_type,proportion"],
      ],
    },
    {
      id: "multiomics",
      label: "多组学与网络",
      intro: "适合整合基因、通路、临床变量和工具输出。",
      plots: [
        ["circos", "Circos 图", "展示跨染色体或多层关系", "source,target,value"],
        ["chord_diagram", "弦图", "展示类别之间的连接强度", "source,target,value"],
        ["sankey", "桑基图", "展示资源、任务或证据流向", "source,target,value"],
        ["alluvial", "冲积图", "比较多阶段分组变化", "stage,group,value"],
        ["network_graph", "网络图", "展示节点和关系", "source,target,weight"],
        ["pathway_network", "通路网络", "展示通路与基因连接", "pathway,gene,score"],
        ["multi_omics_heatmap", "多组学热图", "整合多层数据矩阵", "feature,sample,value,omics"],
        ["upset_plot", "UpSet 图", "展示集合交集", "set,intersection,value"],
      ],
    },
    {
      id: "clinical",
      label: "临床与流行病学",
      intro: "队列、Meta 分析、模型评价和临床论文常用。",
      plots: [
        ["kaplan_meier", "Kaplan-Meier 曲线", "比较生存结局", "time,status,group"],
        ["forest_plot", "森林图", "汇总效应量和置信区间", "study,effect,ci_low,ci_high"],
        ["nomogram", "列线图", "展示风险评分模型", "predictor,points"],
        ["calibration_curve", "校准曲线", "检查预测概率是否可靠", "predicted,observed"],
        ["roc", "ROC 曲线", "评价分类模型区分能力", "fpr,tpr"],
        ["pr_curve", "PR 曲线", "评价不平衡数据分类表现", "recall,precision"],
        ["decision_curve", "决策曲线", "比较临床净获益", "threshold,net_benefit"],
        ["subgroup_forest", "亚组森林图", "比较亚组效应差异", "subgroup,effect,ci_low,ci_high"],
        ["consort_flow", "CONSORT 流程图", "展示临床研究纳排流程", "stage,count"],
        ["prisma_flow", "PRISMA 流程图", "展示综述筛选流程", "stage,count"],
      ],
    },
    {
      id: "pathology",
      label: "计算病理",
      intro: "适合 WSI、patch、模型注意力和分类性能解释。",
      plots: [
        ["tile_grid", "切片 Tile 网格", "展示大图切块策略", "tile_x,tile_y,label"],
        ["wsi_tissue_mask", "组织掩膜图", "展示组织区域识别", "x,y,mask"],
        ["attention_heatmap", "注意力热图", "展示模型关注区域", "x,y,attention"],
        ["patch_embedding_umap", "Patch UMAP", "展示图像块嵌入分布", "UMAP_1,UMAP_2,label"],
        ["prototype_atlas", "原型图谱", "展示代表性形态模式", "prototype,score"],
        ["spatial_ecology_map", "空间生态图", "展示肿瘤微环境布局", "x,y,class"],
        ["confusion_matrix", "混淆矩阵", "查看模型误判模式", "truth,predicted,count"],
        ["class_activation_map", "类激活图", "展示模型依据区域", "x,y,value"],
      ],
    },
    {
      id: "proposal",
      label: "申报与流程图",
      intro: "课题申请、项目管理、预算和工作路线更清楚。",
      plots: [
        ["gantt", "甘特图", "展示年度进度和里程碑", "task,start,end"],
        ["technology_roadmap", "技术路线图", "展示问题到成果路径", "node,stage"],
        ["logic_framework", "逻辑框架图", "展示目标、任务和成果", "level,item"],
        ["budget_sankey", "经费桑基图", "展示经费到任务与成果的对应", "source,target,value"],
        ["evaluation_radar", "评价雷达图", "展示预期指标结构", "indicator,value"],
        ["workflow_diagram", "工作流图", "展示可复现路径", "step,order"],
        ["architecture_diagram", "架构图", "展示平台模块关系", "module,dependency"],
      ],
    },
  ];

  const plotMeta = {};
  categories.forEach((cat) => cat.plots.forEach((p) => {
    plotMeta[p[0]] = { id: p[0], title: p[1], use: p[2], fields: p[3], category: cat.id, categoryLabel: cat.label };
  }));

  const disciplineCategories = [
    {
      id: "medical",
      label: "医学与临床",
      intro: "按医学论文、循证医学、预后模型和临床分组比较组织图型。Meta 分析不再是一级大类，而是医学里的一个研究用途。",
      subgroups: [
        { label: "Meta 分析与循证医学", note: "从检索筛选到效应量汇总，适合系统综述、循证作业和毕业论文。", plots: ["forest_plot", "prisma_flow", "consort_flow", "subgroup_forest"] },
        { label: "预后、诊断与模型评价", note: "用于判断模型区分度、校准度、临床净获益和生存差异。", plots: ["kaplan_meier", "roc", "pr_curve", "calibration_curve", "decision_curve", "nomogram"] },
        { label: "临床分组与队列描述", note: "先把分布、差异和关联说清楚，再进入复杂模型。", plots: ["boxplot", "violin", "barplot", "scatter"] },
      ],
    },
    {
      id: "omics",
      label: "生物信息与组学",
      intro: "面向转录组、单细胞、多组学和机制解释，按分析环节选择图型。",
      subgroups: [
        { label: "差异表达与富集解释", note: "适合 log2FC、p value、基因集和通路结果。", plots: ["volcano", "ma_plot", "heatmap", "gsea_curve", "ora_barplot", "enrichment_dotplot", "ridgeplot_enrichment"] },
        { label: "单细胞图谱与细胞组成", note: "从降维、marker、特征表达，到样本间细胞比例。", plots: ["umap", "tsne", "marker_dotplot", "feature_plot", "violin_by_cluster", "cell_type_proportion"] },
        { label: "轨迹、扰动与细胞通讯", note: "用于发育路径、状态方向和配体-受体互作。", plots: ["pseudotime", "trajectory", "rna_velocity", "cell_cell_communication_bubble", "ligand_receptor_network"] },
      ],
    },
    {
      id: "spatial",
      label: "空间组学",
      intro: "把表达、细胞群和互作放回组织坐标里看，适合肿瘤微环境和空间结构分析。",
      subgroups: [
        { label: "空间表达与区域分型", note: "展示组织坐标、分区和空间表达热点。", plots: ["spatial_feature_plot", "spatial_cluster_map", "tissue_region_composition"] },
        { label: "空间邻域与信号互作", note: "回答哪些区域相邻、哪些信号在局部增强。", plots: ["spatial_neighborhood_graph", "spatial_ligand_receptor_map", "spatial_ecology_map"] },
      ],
    },
    {
      id: "pathology",
      label: "计算病理与医学AI",
      intro: "服务数字病理、模型解释和分类评估，让图像 AI 的输入、输出和错误更容易被审查。",
      subgroups: [
        { label: "WSI 与 patch 处理", note: "展示切片分块、组织掩膜和 patch 嵌入空间。", plots: ["tile_grid", "wsi_tissue_mask", "patch_embedding_umap", "prototype_atlas"] },
        { label: "模型解释与性能评估", note: "适合注意力、激活区域、混淆模式和二分类性能。", plots: ["attention_heatmap", "class_activation_map", "confusion_matrix", "roc"] },
      ],
    },
    {
      id: "engineering",
      label: "工程、材料与通用科研",
      intro: "为工程、材料、环境、计算实验等方向准备趋势、网络、流程和多变量展示。",
      subgroups: [
        { label: "趋势、分布与相关", note: "适合参数优化、传感器数据、实验重复和变量关联。", plots: ["line", "histogram", "density", "correlation_heatmap", "scatter"] },
        { label: "网络、流向与集合关系", note: "适合工艺路线、材料组分、系统模块和集合交叉。", plots: ["network_graph", "sankey", "alluvial", "chord_diagram", "circos", "upset_plot"] },
      ],
    },
    {
      id: "social",
      label: "社科、教育与问卷",
      intro: "为教学改革、问卷调查、文本编码和访谈主题准备更轻量的图表入口。",
      subgroups: [
        { label: "问卷与分组比较", note: "展示 Likert、分组差异、分布和满意度变化。", plots: ["barplot", "boxplot", "violin", "density"] },
        { label: "文本主题与关系路径", note: "适合访谈编码、主题网络、流程复盘和转化路径。", plots: ["network_graph", "alluvial", "workflow_diagram"] },
      ],
    },
    {
      id: "proposal",
      label: "申报、项目与流程图",
      intro: "把课题逻辑、进度、经费、平台架构和评价指标画得清楚。",
      subgroups: [
        { label: "项目结构与技术路线", note: "适合申请书、开题报告和团队汇报。", plots: ["gantt", "technology_roadmap", "logic_framework", "architecture_diagram", "workflow_diagram"] },
        { label: "经费、评价与成果流向", note: "把预算、任务、平台和成果的对应关系说清楚。", plots: ["budget_sankey", "evaluation_radar", "sankey"] },
      ],
    },
  ];

  const fallbackAssetMap = {
    barplot: "bar_grouped.svg", line: "line_trend.svg", histogram: "histogram.svg", density: "density.svg",
    correlation_heatmap: "cluster_heatmap.svg", ma_plot: "ma_plot.svg", gsea_curve: "enrichment_dot.svg",
    ora_barplot: "bar_grouped.svg", ridgeplot_enrichment: "density.svg", tsne: "umap_like.svg",
    violin_by_cluster: "violin.svg", trajectory: "timeline.svg", rna_velocity: "umap_like.svg",
    ligand_receptor_network: "network.svg", spatial_cluster_map: "map_tile.svg", spatial_neighborhood_graph: "network.svg",
    spatial_ligand_receptor_map: "map_tile.svg", tissue_region_composition: "bar_stacked.svg",
    circos: "chord_like.svg", chord_diagram: "chord_like.svg", alluvial: "sankey_like.svg",
    pathway_network: "network.svg", multi_omics_heatmap: "heatmap.svg", nomogram: "nomogram_like.svg",
    calibration_curve: "calibration.svg", pr_curve: "roc.svg", decision_curve: "line_trend.svg",
    subgroup_forest: "forest.svg", consort_flow: "timeline.svg", tile_grid: "map_tile.svg",
    wsi_tissue_mask: "map_tile.svg", patch_embedding_umap: "umap_like.svg", prototype_atlas: "bubble.svg",
    spatial_ecology_map: "map_tile.svg", class_activation_map: "calibration.svg",
    technology_roadmap: "timeline.svg", logic_framework: "timeline.svg", budget_sankey: "sankey_like.svg",
    evaluation_radar: "radar.svg", architecture_diagram: "network.svg",
  };

  const recs = [
    ["生成一个教学案例", "输入课程主题，得到 PBL 情境、问题链和教师复核表。", "例：胃腺癌本科病理 PBL", "输出：合成教学案例 + 课堂提问 + 教师复核清单", "cases"],
    ["找一个科研方法", "按你的数据类型推荐方法、工具、图表和学习路径。", "例：单细胞肿瘤免疫差异", "输出：方法路线 + 推荐工具 + 适合图型", "researcher"],
    ["生成一张论文图", "选图型、查字段、拿代码、写图注，适合新手起步。", "例：我有 log2FC 和 pvalue", "输出：示例图 + R/Python 模板 + 图注草案", "plot-studio"],
    ["创建自己的 Skill", "把常用流程写成可收藏、可发布、可复用的任务卡。", "例：我的森林图复核流程", "输出：Skill 草案 + 运行入口 + 安全边界", "skill-builder"],
    ["进入科研小岛", "用游戏化入口管理常用工具、建筑、积分和社区作品。", "例：把 Plot Studio 放进绘图工坊", "输出：个人科研空间 + 建筑快捷入口", "island"],
  ];

  const posts = [
    ["置顶", "第一次做 Meta 分析，森林图、漏斗图和 PRISMA 应该怎么安排？", "Meta 分析", 328, 86],
    ["Skill", "单细胞图注助手：自动检查 UMAP、DotPlot 和 FeaturePlot 字段", "单细胞", 512, 143],
    ["求助", "老师要求作业有可复现代码，我应该用 R 还是 Python？", "作业", 241, 64],
    ["经验", "数字病理小论文常见图：ROC、混淆矩阵、注意力热图", "医学 AI", 476, 129],
    ["作品", "我的科研小岛：把绘图、综述和案例生成做成三个建筑", "科研小岛", 390, 102],
  ];

  const skillCards = [
    ["病理报告反馈", "检查结构、术语和证据链，只给教学训练反馈。", "官方"],
    ["PBL 案例生成", "把知识点拆成情境、问题链和课堂讨论提示。", "官方"],
    ["综述流程助手", "从检索式到证据表，帮新手搭好综述骨架。", "官方"],
    ["图表审查", "检查字段、图注、统计表达和复现材料。", "官方"],
    ["伦理审计", "检查隐私、虚假引用、临床误导和学术诚信。", "官方"],
    ["单细胞图注助手", "社区收藏高，用于 UMAP 与 DotPlot 解释。", "社区"],
    ["Meta 森林图模板", "适合课程作业和系统综述草稿。", "社区"],
    ["Likert 问卷图", "教学改革和满意度问卷可直接改字段。", "社区"],
    ["工程响应面图包", "给工科实验同学的参数优化模板。", "社区"],
    ["文本网络图", "适合传播、人文和访谈编码结果。", "社区"],
  ];

  const openSourceTools = [
    {
      id: "seurat",
      title: "Seurat",
      domain: "单细胞 / R",
      license: "GPL-3.0",
      github: "satijalab/seurat",
      question: "从单细胞表达矩阵出发，完成质控、聚类、注释和 UMAP 展示。",
      input: "表达矩阵、metadata、分组信息、marker 基因表。",
      output: "聚类结果、差异 marker、UMAP、DotPlot、FeaturePlot。",
      example: "我有 10x 数据，想看肿瘤样本 T 细胞亚群差异。",
      plot: "umap",
      packages: "R：Seurat、ggplot2、patchwork",
    },
    {
      id: "scanpy",
      title: "Scanpy",
      domain: "单细胞 / Python",
      license: "BSD-3-Clause",
      github: "scverse/scanpy",
      question: "用 Python 完成 AnnData 格式的单细胞分析和可视化。",
      input: "h5ad、matrix、metadata、gene annotation。",
      output: "邻接图、聚类、UMAP、marker gene ranking。",
      example: "我想把公开 PBMC 数据跑一遍基础流程。",
      plot: "feature_plot",
      packages: "Python：scanpy、anndata、matplotlib",
    },
    {
      id: "clusterprofiler",
      title: "clusterProfiler",
      domain: "富集分析 / R",
      license: "Artistic-2.0",
      github: "YuLab-SMU/clusterProfiler",
      question: "把差异基因变成 GO/KEGG 通路解释。",
      input: "gene symbol、ENTREZID、logFC、背景基因集。",
      output: "ORA/GSEA 结果、dotplot、ridgeplot、enrichment curve。",
      example: "我有一组上调基因，想知道免疫相关通路是否富集。",
      plot: "enrichment_dotplot",
      packages: "R：clusterProfiler、enrichplot、org.Hs.eg.db",
    },
    {
      id: "gears",
      title: "GEARS",
      domain: "扰动预测 / 单细胞",
      license: "MIT",
      github: "snap-stanford/GEARS",
      question: "预测基因扰动后的表达变化，适合学习 virtual perturbation 概念。",
      input: "扰动单细胞数据、基因列表、训练/测试 split。",
      output: "扰动响应预测、基因影响排序、模型评估图。",
      example: "我想比较敲低某个转录因子后 T 细胞状态可能如何改变。",
      plot: "network_graph",
      packages: "Python：PyTorch、scanpy、GEARS 环境",
    },
    {
      id: "metafor",
      title: "metafor",
      domain: "Meta 分析 / R",
      license: "GPL-2/3",
      github: "wviechtb/metafor",
      question: "系统综述和 Meta 分析中的效应量合并与异质性评估。",
      input: "study、effect、standard error、CI、subgroup。",
      output: "森林图、漏斗图、亚组分析、敏感性分析。",
      example: "我收集了 12 篇研究，想合并某个风险因素的 OR。",
      plot: "forest_plot",
      packages: "R：metafor、meta、ggplot2",
    },
    {
      id: "quarto",
      title: "Quarto",
      domain: "复现报告",
      license: "GPL-2.0",
      github: "quarto-dev/quarto-cli",
      question: "把代码、图、解释和方法写成可复现网页或 PDF。",
      input: "R/Python 代码、Markdown 文本、图表文件。",
      output: "HTML、PDF、Word、GitHub Pages 报告。",
      example: "我想把绘图代码和图注打包成老师能检查的报告。",
      plot: "workflow_diagram",
      packages: "Quarto CLI、knitr、jupyter",
    },
  ];

  const pluginFamilies = [
    ["teaching", "MedPath Teaching Plugin", "教学场景插件", "课程设计、PBL 案例、超微导学、病理报告反馈。"],
    ["research", "MedPath Research Plugin", "科研训练插件", "方法推荐、图表生成、文献综述和开源工具导航。"],
    ["governance", "MedPath Governance Plugin", "治理评价插件", "伦理审计、质量评价、教师复核和 D10 映射。"],
  ];

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function path(route) {
    return `#/${route}`;
  }

  function parts() {
    return (location.hash || "#/home").replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  }

  function currentRoute() {
    const p = parts();
    const first = p[0] || "home";
    const redirects = {
      "tools": "open-source",
      "research": "researcher",
      "method-runner": "method-runner",
      "mobile-app": "mobile-app",
      "comparison-lab": "comparison-lab",
      "simulation-lab": "simulation-lab",
      "evidence-gallery": "evidence-gallery",
    };
    return redirects[first] || first;
  }

  function isIslandRoute() {
    const first = parts()[0] || "home";
    return first === "island" || first === "island-builder" || first === "island-3d";
  }

  function imageFor(id) {
    if (fullPlotIds.has(id)) return `${ASSET_BASE}outputs/round110_plots/${id}/example.png`;
    return `${ASSET_BASE}outputs/round109_plot_gallery/${fallbackAssetMap[id] || "scatter_basic.svg"}`;
  }

  function fileFor(id, file) {
    return `${ASSET_BASE}outputs/round110_plots/${id}/${file}`;
  }

  function topNav(active) {
    return topRoutes.map(([id, label]) => `<a data-testid="nav-${id}" class="${active === id ? "active" : ""}" href="${path(id)}">${esc(label)}</a>`).join("");
  }

  function leftNav(active) {
    return `
      <a data-testid="left-overview" class="${active === "home" ? "active" : ""}" href="${path("home")}">概览</a>
      <div class="r110-left-title">研究七步</div>
      ${stepRoutes.map(([id, label], index) => `<a data-testid="left-${id}" class="${active === id ? "active" : ""}" href="${path(id)}"><span>${esc(label)}</span><b>${index + 1}</b></a>`).join("")}
      <div class="r110-note">左侧是新手学习流程；上方是产品功能入口。两套导航不再重复。</div>
    `;
  }

  function mobileNav(active) {
    const items = [["home", "首页"], ["plot-studio", "绘图"], ["skills", "Skill"], ["community", "社区"], ["island", "小岛"]];
    return `<nav class="r110-mobile-nav">${items.map(([id, label]) => `<a class="${active === id ? "active" : ""}" href="${path(id)}">${esc(label)}</a>`).join("")}</nav>`;
  }

  function assistant() {
    return `<div class="r110-assistant" id="r110-assistant">
      <div class="r110-assistant-panel">
        <strong>页面小助手</strong>
        <p>你可以问：“我做 Meta 分析该选什么图？”“我有单细胞数据先看哪张？”静态站点现在只做本地规则建议；接入自己的 API 后可让模型帮你检查字段、改代码和写图注。</p>
        <button class="r110-button" data-mock-action="当前 GitHub Pages 版本为 mock 助手，不保存 API Key。">试问一句</button>
      </div>
      <button aria-label="打开页面小助手" data-testid="assistant-toggle">问</button>
    </div>`;
  }

  function shell(active, content) {
    return `
      <div class="r110-shell">
        <aside class="r110-left">
          <a class="r110-logo" href="${path("home")}"><span class="r110-logo-mark">M</span><span><strong>MedPath Companion</strong><small>科研学习与 AI Skill 工作台</small></span></a>
          ${leftNav(active)}
        </aside>
        <main class="r110-main">
          <header class="r110-topbar">
            <nav class="r110-topnav">${topNav(active)}</nav>
            <label class="r110-search"><input data-testid="global-search" placeholder="搜索方法、数据集、图类型、Skill..." /></label>
            <a class="r110-avatar" href="${path("profile")}" aria-label="个人主页">我</a>
          </header>
          <section class="r110-page">${content}</section>
        </main>
        ${mobileNav(active)}
        ${assistant()}
      </div>`;
  }

  function sectionHead(title, sub, body = "") {
    return `<div class="r110-section-head"><span class="r110-kicker">${esc(sub)}</span><h2>${esc(title)}</h2>${body ? `<p>${esc(body)}</p>` : ""}</div>`;
  }

  function plotHeroImage(id = "umap") {
    return `<figure class="r110-figure-card"><img src="${imageFor(id)}" alt="${esc(plotMeta[id]?.title || id)} 示例图" loading="eager"><figcaption><span>本机 R 生成示例</span><a href="${path(`plot-gallery/${id}`)}">查看图型</a></figcaption></figure>`;
  }

  function recCard(item, i) {
    return `<article class="r110-rec-card" data-testid="recommend-card-${i + 1}">
      <small>0${i + 1}</small>
      <h3>${esc(item[0])}</h3>
      <p>${esc(item[1])}</p>
      <code><strong>输入：</strong>${esc(item[2])}<br><strong>输出：</strong>${esc(item[3])}</code>
      <div class="r110-actions"><a class="r110-button" data-testid="recommend-cta-${i + 1}" aria-label="进入${esc(item[0])}" href="${path(item[4])}">开始</a></div>
    </article>`;
  }

  function homePage() {
    const personas = [
      ["科研小白", "从“提出问题”开始，按七步把想法变成方法和图表。", "step-problem"],
      ["完成作业的学生", "直接看示例图、数据格式和代码模板，替换字段就能学。", "plot-studio"],
      ["老师", "用教学 Skill、案例模板和评价量规准备课堂材料。", "skills"],
      ["写论文的人", "按文章类型规划图表、方法、结果和复现材料。", "method-runner"],
      ["社区创作者", "发布自己的 Skill，按收藏量进入排行榜。", "community"],
    ];
    return shell("home", `
      <section class="r110-hero">
        <div>
          <span class="r110-kicker">概览</span>
          <h1>把科研新手的第一步讲清楚</h1>
          <p>你不需要一开始就懂所有术语。先说你想完成什么：找方法、画图、写综述、做教学案例，或者把自己的流程做成 Skill。</p>
          <div class="r110-pill-row"><span class="r110-pill">真实示例图</span><span class="r110-pill">BYOK / 本地运行</span><span class="r110-pill">科研新手友好</span></div>
          <div class="r110-actions"><a class="r110-button" href="${path("plot-studio")}">先看科研绘图</a><a class="r110-outline" href="${path("step-problem")}">走七步流程</a></div>
        </div>
        ${plotHeroImage("umap")}
      </section>
      <section class="r110-carousel">
        <div class="r110-carousel-intro"><p>常用任务会自动轮播，也可以左右滑动。每张卡都能进入真实页面。</p></div>
        <div class="r110-carousel-track" id="r110-recommend-track">${recs.map(recCard).join("")}</div>
        <div class="r110-carousel-actions">
          <div class="r110-dots">${recs.map((_, i) => `<button class="r110-dot ${i === 0 ? "active" : ""}" data-carousel-dot="${i}" aria-label="切换推荐 ${i + 1}"></button>`).join("")}</div>
          <div class="r110-carousel-buttons"><button class="r110-icon-btn" data-carousel-prev aria-label="上一张">←</button><button class="r110-icon-btn" data-carousel-next aria-label="下一张">→</button></div>
        </div>
      </section>
      <section class="r110-section">
        ${sectionHead("按身份进入", "先选你现在最像哪一类用户。")}
        <div class="r110-grid-5 r110-persona-grid">${personas.map(([t,b,h]) => `<article class="r110-card r110-persona-card"><div class="r110-card-inner"><h3>${esc(t)}</h3><p>${esc(b)}</p></div><div class="r110-card-actions r110-lotus-actions"><a class="r110-lotus-button" href="${path(h)}">进入</a><button class="r110-lotus-button ghost" data-mock-action="已把 ${esc(t)} 加入快捷入口">收藏</button></div></article>`).join("")}</div>
      </section>
      <section class="r110-panel">
        <h2>这个项目是什么</h2>
        <p>它是一个把“方法学习、科研绘图、Skill 复用、社区交流、科研小岛”放在一起的工作台。网站里的图表示例由本地脚本生成；静态版不保存 API Key，也不上传你的数据。医学相关内容仅用于教学与科研训练，不替代临床诊断。</p>
      </section>
    `);
  }

  function stepPage(active) {
    const map = {
      "step-problem": ["提出问题", "先把模糊兴趣变成可以检验的问题。", "写清对象、比较组、指标和你想画出的结果。"],
      "step-design": ["设计研究", "把问题拆成对象、变量、对照和证据链。", "适合开题、课程作业和小论文设计。"],
      "step-data": ["获取数据", "公开、脱敏、合成和禁用数据要分开。", "这里给出数据来源、字段字典和授权边界。"],
      "step-analysis": ["分析验证", "先质控，再统计或建模。", "不要拿到数据就跑模型，先检查缺失、异常和分组。"],
      "step-results": ["解读结果", "把图翻译成老师能看懂的话。", "说明图能回答什么，也说明不能说明什么。"],
      "step-ethics": ["伦理与安全", "医学 AI 输出不能越界。", "检查隐私、虚假引用、临床误导和教师复核。"],
      "step-share": ["分享复现", "让别人能看懂、能复跑、能收藏。", "整理代码、数据字典、图注和版本记录。"],
    };
    const item = map[active] || map["step-problem"];
    const idx = stepRoutes.findIndex(([id]) => id === active) + 1;
    return shell(active, `
      <section class="r110-hero">
        <div><span class="r110-kicker">第 ${idx} 步</span><h1>${esc(item[0])}</h1><p>${esc(item[1])} ${esc(item[2])}</p><div class="r110-actions"><a class="r110-button" href="${path("plot-studio")}">看可用图表</a><a class="r110-outline" href="${path("community")}">去社区问问</a></div></div>
        ${plotHeroImage(idx % 2 ? "scatter" : "workflow_diagram")}
      </section>
      <section class="r110-section"><div class="r110-grid-5">${["目标", "输入", "检查", "输出", "下一步"].map((x, i) => `<article class="r110-card"><div class="r110-card-inner"><small>0${i + 1}</small><h3>${x}</h3><p>${["写清现在要解决的具体问题。","准备课程、数据或文献材料。","检查字段、伦理和复现边界。","得到模板、代码或复核清单。","进入绘图、Skill 或社区继续。"][i]}</p></div></article>`).join("")}</div></section>
    `);
  }

  function plotCard(meta, contextLabel = "") {
    const label = contextLabel || meta.categoryLabel;
    return `<article class="r110-plot-card" data-testid="plot-card-${esc(meta.id)}">
      <img src="${imageFor(meta.id)}" alt="${esc(meta.title)} 示例图" loading="eager">
      <div class="r110-plot-body"><small>${esc(label)} · R 代码生成示例</small><h3>${esc(meta.title)}</h3><p>${esc(meta.use)}</p><div class="r110-code-tags"><b>R</b><b>Python</b><b>${esc(meta.fields.split(",")[0])}</b></div></div>
      <div class="r110-plot-actions"><a data-testid="plot-detail-${esc(meta.id)}" href="${path(`plot-gallery/${meta.id}`)}">看详情</a><a data-testid="plot-start-${esc(meta.id)}" href="${path(`plot-run/${meta.id}`)}">开始</a></div>
    </article>`;
  }

  function selectedDiscipline() {
    const p = parts();
    const alias = {
      basic: "engineering",
      de_enrich: "omics",
      single_cell: "omics",
      clinical: "medical",
      multiomics: "omics",
    };
    const id = alias[p[1]] || p[1];
    const cat = disciplineCategories.find((x) => x.id === id);
    return cat || disciplineCategories[0];
  }

  function allPlotCards(cat) {
    return cat.plots.map((p) => plotMeta[p[0]]);
  }

  function plotStudioPage() {
    const cat = selectedDiscipline();
    return shell("plot-studio", `
      <section class="r110-plot-page">
        <aside class="r110-plot-rail">
          <strong>学科分类</strong>
          ${disciplineCategories.map((c) => `<a class="${c.id === cat.id ? "active" : ""}" href="${path(`plot-studio/${c.id}`)}">${esc(c.label)}</a>`).join("")}
        </aside>
        <main class="r110-plot-main">
          <div class="r110-plot-toolbar">
            <div>${sectionHead(cat.label, "Research Plot Studio", cat.intro)}</div>
            <select class="r110-select" data-testid="plot-category-select">${disciplineCategories.map((c) => `<option ${c.id === cat.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}</select>
          </div>
          ${cat.subgroups.map((group) => `<section class="r110-plot-subgroup"><div class="r110-subgroup-head"><h3>${esc(group.label)}</h3><p>${esc(group.note)}</p></div><div class="r110-plot-grid r110-plot-grid-large">${group.plots.map((id) => plotCard(plotMeta[id], group.label)).join("")}</div></section>`).join("")}
        </main>
      </section>`);
  }

  function plotGalleryPage() {
    const completed = Array.from(fullPlotIds).map((id) => plotMeta[id]).filter(Boolean);
    return shell("plot-gallery", `
      <section class="r110-section">
        ${sectionHead("图谱总览", "Plot Gallery", "这里展示本机 R 代码生成的图表示例。每张卡都对应独立数据、R/Python 模板、图注和 methods。")}
        <div class="r110-plot-grid">${completed.map(plotCard).join("")}</div>
      </section>`);
  }

  function plotDetailPage() {
    const id = parts()[1] || "umap";
    const meta = plotMeta[id] || plotMeta.umap;
    const rows = meta.fields.split(",").map((field, i) => `<tr><td>${esc(field)}</td><td>${i === 0 ? "必需" : "建议"}</td><td>请与上传数据列名对应；不确定时让模型只做字段解释，不直接替你下结论。</td></tr>`).join("");
    return shell("plot-gallery", `
      <section class="r110-detail">
        <main class="r110-tabs">
          <div>${sectionHead(meta.title, meta.categoryLabel, meta.use)}</div>
          <figure class="r110-figure-card"><img src="${imageFor(meta.id)}" alt="${esc(meta.title)} 大图" loading="eager"><figcaption><span>本机 R 生成可复现示例</span><span>教学演示，不代表真实研究结论</span></figcaption></figure>
          <div class="r110-panel"><h3>这个图回答什么问题</h3><p>${esc(meta.use)}。新手先确认横纵轴、分组、样本量和统计含义，再写图注。</p></div>
          <div class="r110-panel"><h3>示例数据字段</h3><table class="r110-table"><thead><tr><th>字段</th><th>状态</th><th>说明</th></tr></thead><tbody>${rows}</tbody></table></div>
          <div class="r110-detail-grid">
            <article class="r110-panel"><h3>上传数据后怎么生成</h3><p>先检查列名是否包含 ${esc(meta.fields)}；字段通过后，由本地 R/Python runtime 运行模板代码，网页只负责展示图和导出材料。</p></article>
            <article class="r110-panel"><h3>API 怎么辅助</h3><p>你自己的模型 API 只做字段解释、代码改写、报错解释、图注和 methods 草案，不接收或保存 API Key。</p></article>
            <article class="r110-panel"><h3>图注模板</h3><p>图：${esc(meta.title)} 用于${esc(meta.use)}。请在真实论文中补充样本量、统计方法、显著性阈值和数据来源。</p></article>
            <article class="r110-panel"><h3>风险提示</h3><p>示例图只演示方法，不代表真实研究结论；医学相关解释需导师、教师或专家复核。</p></article>
          </div>
          <div class="r110-panel"><h3>代码与下载</h3><p>每个示例图型提供 PNG/SVG/PDF、source data、R/Python 模板、图注、methods 和 API prompt。</p><div class="r110-actions"><a class="r110-outline" href="${fileFor(meta.id, "example.png")}">下载 PNG</a><a class="r110-outline" href="${fileFor(meta.id, "example.svg")}">下载 SVG</a><a class="r110-outline" href="${fileFor(meta.id, "example.pdf")}">下载 PDF</a><a class="r110-outline" href="${fileFor(meta.id, "example_data.csv")}">下载数据</a><a class="r110-outline" href="${fileFor(meta.id, "plot.R")}">R 模板</a><a class="r110-outline" href="${fileFor(meta.id, "plot.py")}">Python 模板</a><a class="r110-outline" href="${fileFor(meta.id, "caption.md")}">图注</a><a class="r110-outline" href="${fileFor(meta.id, "methods.md")}">Methods</a><a class="r110-outline" href="${fileFor(meta.id, "api_prompt.md")}">API Prompt</a></div></div>
        </main>
        <aside class="r110-panel">
          <h3>新手提示</h3>
          <p>适合：${esc(meta.categoryLabel)} 场景。<br>不适合：样本量太小却强行解释显著性，或没有字段字典时直接出结论。</p>
          <h3>推荐包</h3>
          <p>R：ggplot2 / survival / ComplexHeatmap 视图型而定。<br>Python：pandas / matplotlib / seaborn / scanpy 视图型而定。</p>
          <a class="r110-button" data-testid="plot-start-${esc(meta.id)}" href="${path(`plot-run/${meta.id}`)}">用这个图开始</a>
        </aside>
      </section>`);
  }

  function plotRunPage() {
    const id = parts()[1] || "umap";
    const meta = plotMeta[id] || plotMeta.umap;
    const steps = ["上传数据", "选择图类型", "检查字段", "选择代码模板", "生成图", "生成图注", "导出结果"];
    return shell("plot-studio", `
      <section class="r110-run-layout">
        <aside class="r110-panel"><h3>绘图步骤</h3><div class="r110-step-list">${steps.map((s, i) => `<div class="r110-step-item ${i === 1 ? "active" : ""}"><b>${i + 1}</b><span>${esc(s)}</span></div>`).join("")}</div></aside>
        <main class="r110-panel r110-preview">
          <span class="r110-kicker">${esc(meta.categoryLabel)}</span><h1>${esc(meta.title)}</h1>
          <img src="${imageFor(meta.id)}" alt="${esc(meta.title)} 预览">
          <textarea class="r110-textarea" placeholder="描述你的数据和需求：例如我有 gene、log2FC、pvalue 三列，想画火山图并生成图注。"></textarea>
          <div class="r110-actions">
            <button class="r110-button" data-mock-action="已载入示例数据。静态站点不会上传你的文件。">使用示例数据</button>
            <button class="r110-outline" data-mock-action="字段检查为 mock：请在本地 Runtime 中运行真实检查。">检查字段</button>
            <button class="r110-outline" data-mock-action="已生成 R 代码草案。接入 API 后可让你的模型改写代码。">生成 R 代码</button>
            <button class="r110-outline" data-mock-action="已生成图注草案。请导师或老师复核。">生成图注</button>
          </div>
        </main>
        <aside class="r110-panel">
          <h3>AI 助手如何参与</h3>
          <p>模型只负责解释字段、改写代码、解释报错和写图注；真正绘图由本地 R/Python runtime 执行。GitHub Pages 版本只演示 mock 流程，不保存 API Key。</p>
          <h3>Skill 来源</h3>
          <select class="r110-select"><option>官方：字段体检 Skill</option><option>官方：图注生成 Skill</option><option>我的收藏：社区单细胞图注助手</option></select>
          <a class="r110-outline" href="${path("providers")}">配置模型接口</a>
        </aside>
      </section>`);
  }

  function skillsPage() {
    return shell("skills", `<section class="r110-section">${sectionHead("Skill 市场", "官方 + 社区收藏", "卡片按产品写法展示：解决什么问题、适合谁、如何开始，而不是目录式堆名字。")}<div class="r110-grid-5">${skillCards.map(([t,b,k], i) => `<article class="r110-card"><div class="r110-card-inner"><small>${esc(k)}</small><h3>${esc(t)}</h3><p>${esc(b)}</p></div><div class="r110-card-actions"><a href="${path("plot-run/umap")}">试用</a><button data-mock-action="已收藏 ${esc(t)}，可在开始页选择。">收藏</button></div></article>`).join("")}</div></section>`);
  }

  function skillBuilderPage() {
    return shell("skill-builder", `
      <section class="r110-detail r110-builder">
        <main>
          ${sectionHead("创建自己的 Skill", "Skill Builder", "把你常做的一件事写成可复用流程：输入、步骤、输出、评价、风险边界都要说清。")}
          <div class="r110-panel">
            <h3>三步开始</h3>
            <div class="r110-detail-grid">
              ${["写清任务", "补示例", "设置复核"].map((t, i) => `<article class="r110-mini-card"><b>0${i + 1}</b><h4>${esc(t)}</h4><p>${["例如：帮我检查森林图数据字段。", "给一份示例 CSV 和期望输出。", "说明哪些内容必须由老师或导师确认。"][i]}</p></article>`).join("")}
            </div>
          </div>
          <div class="r110-panel">
            <h3>Skill 草案</h3>
            <textarea class="r110-textarea" rows="7" placeholder="例：我的 Skill 用于检查 meta 分析森林图。输入 study/effect/ci_low/ci_high，输出字段问题、R 代码、图注和导师复核点。"></textarea>
            <div class="r110-actions">
              <button class="r110-button" data-testid="skill-builder-save" data-mock-action="已生成 Skill 草案。静态版不会发布到社区。">生成草案</button>
              <button class="r110-outline" data-mock-action="已检查安全边界：不保存 API Key，不上传用户数据。">检查边界</button>
            </div>
          </div>
        </main>
        <aside class="r110-panel">
          <h3>可以选的模板</h3>
          <p>绘图复核、字段体检、综述流程、教学案例、伦理审计。</p>
          <a class="r110-button" href="${path("community")}">看社区收藏榜</a>
        </aside>
      </section>`);
  }

  function pluginHubPage() {
    return shell("plugin-hub", `
      <section class="r110-section">
        ${sectionHead("Plugin Hub", "插件中心", "插件是一组 Skill 的产品化入口：能打开、能试用、能查看安全边界，也能映射到本地 Runtime。")}
        <div class="r110-grid-3">${pluginFamilies.map(([id, en, zh, desc]) => `<article class="r110-card r110-plugin-card"><div class="r110-card-inner"><small>${esc(en)}</small><h3>${esc(zh)}</h3><p>${esc(desc)}</p><div class="r110-chip-list"><span>本地 mock</span><span>可迁移</span><span>教师复核</span></div></div><div class="r110-card-actions"><button data-testid="plugin-hub-open-${esc(id)}" data-mock-action="${esc(zh)} 已启用为演示状态。">启用</button><a href="${path("skills")}">包含的 Skill</a></div></article>`).join("")}</div>
      </section>`);
  }

  function communityPage() {
    return shell("community", `
      <section class="r110-forum">
        <main><div class="r110-panel"><h1>社区交流</h1><p>像论坛一样找帖子、搜 Skill、看收藏榜。当前是静态 mock，真实登录、评论和发布需要后端。</p><input class="r110-input" placeholder="搜索帖子、作者、Skill、图表..." /></div>
        ${posts.map(([type,title,tag,views,likes]) => `<article class="r110-post"><b>${esc(type)}</b><div><h3>${esc(title)}</h3><p>${esc(tag)} · 浏览 ${views} · 收藏 ${likes}</p></div><a href="${path("skills")}">查看</a></article>`).join("")}</main>
        <aside class="r110-panel"><h2>Skill 收藏榜</h2>${skillCards.slice(5).map(([t,b], i) => `<p><strong>${i + 1}. ${esc(t)}</strong><br><span>${esc(b)}</span></p>`).join("")}<button class="r110-button" data-mock-action="发布 Skill 需要登录与审核，静态站点暂不提交。">发布 Skill</button></aside>
      </section>`);
  }

  function openSourcePage() {
    const id = parts()[1];
    if (id) return openSourceDetailPage(id);
    return shell("open-source", `<section class="r110-section">${sectionHead("公开工具导航", "Open Source Navigator", "先看输入、输出、License、示例任务和新手难度，再决定要不要安装。")}<div class="r110-grid-3">${openSourceTools.map((tool) => `<article class="r110-card r110-tool-card"><div class="r110-card-inner"><small>${esc(tool.domain)} · ${esc(tool.license)}</small><h3>${esc(tool.title)}</h3><p>${esc(tool.question)}</p><figure class="r110-thumb"><img src="${imageFor(tool.plot)}" alt="${esc(tool.title)} 示例图" loading="eager"></figure></div><div class="r110-card-actions"><a data-testid="open-source-detail-${esc(tool.id)}" href="${path(`open-source/${tool.id}`)}">看详情</a><a href="${path(`plot-gallery/${tool.plot}`)}">示例图</a></div></article>`).join("")}</div></section>`);
  }

  function openSourceDetailPage(id) {
    const tool = openSourceTools.find((x) => x.id === id) || openSourceTools[0];
    return shell("open-source", `
      <section class="r110-detail">
        <main>
          ${sectionHead(tool.title, `${tool.domain} · ${tool.license}`, tool.question)}
          <figure class="r110-figure-card"><img src="${imageFor(tool.plot)}" alt="${esc(tool.title)} 示例图" loading="eager"><figcaption><span>示例图：${esc(plotMeta[tool.plot]?.title || tool.plot)}</span><a href="${path(`plot-gallery/${tool.plot}`)}">查看图型说明</a></figcaption></figure>
          <div class="r110-detail-grid">
            <article class="r110-panel"><h3>输入什么</h3><p>${esc(tool.input)}</p></article>
            <article class="r110-panel"><h3>输出什么</h3><p>${esc(tool.output)}</p></article>
            <article class="r110-panel"><h3>适合新手的任务</h3><p>${esc(tool.example)}</p></article>
            <article class="r110-panel"><h3>推荐环境</h3><p>${esc(tool.packages)}</p></article>
          </div>
          <div class="r110-panel">
            <h3>从 0 到能跑的学习路径</h3>
            <ol class="r110-ordered"><li>先用示例数据理解输入字段。</li><li>在本地 Runtime 或原仓库环境安装依赖。</li><li>用本页 Skill 检查字段和参数，不让模型直接替你下科学结论。</li><li>导出图、代码、source data、caption 和 methods。</li></ol>
          </div>
        </main>
        <aside class="r110-panel">
          <h3>链接与边界</h3>
          <p>GitHub：${esc(tool.github)}</p>
          <p>License：${esc(tool.license)}。正式商用或再分发前请人工复核原仓库协议。</p>
          <button class="r110-button" data-testid="open-source-run-${esc(tool.id)}" data-mock-action="${esc(tool.title)} 已加入本地运行清单。静态站点不会安装依赖。">加入运行清单</button>
          <a class="r110-outline" href="${path("skill-builder")}">用它生成 Skill 草案</a>
        </aside>
      </section>`);
  }

  function researcherPage() {
    const tracks = [
      ["医学与生物", "从疾病问题、样本、指标和图表开始，不先堆模型。", "plot-studio/clinical"],
      ["单细胞与空间组学", "聚类、注释、空间定位、通讯和扰动分析放在同一条学习线。", "method-runner/virtual-perturbation"],
      ["计算病理", "从 WSI 切块、掩膜、嵌入到模型解释图。", "plot-studio/pathology"],
      ["工程与材料", "响应面、参数优化、误差分析和流程图。", "plot-studio/proposal"],
      ["社会科学与教育", "问卷、Likert、文本网络、教学评价和访谈编码。", "plot-studio/basic"],
    ];
    return shell("researcher", `<section class="r110-section">${sectionHead("科研工作站", "Research Workbench", "按研究问题和数据类型进入。虚拟敲除归入单细胞/生物信息学下的扰动分析，而不是顶层大类。")}<div class="r110-grid-5">${tracks.map(([t, b, h], i) => `<article class="r110-card"><div class="r110-card-inner"><small>方向 ${i + 1}</small><h3>${esc(t)}</h3><p>${esc(b)}</p></div><div class="r110-card-actions"><a href="${path(h)}">进入</a><a href="${path("open-source")}">工具</a></div></article>`).join("")}</div></section>`);
  }

  function methodRunnerPage() {
    const types = [
      ["Meta 分析", "医学 / 临床二级类型", "forest_plot"],
      ["系统综述", "医学 / 临床二级类型", "prisma_flow"],
      ["单细胞论文", "组学论文", "umap"],
      ["空间组学论文", "组学论文", "spatial_feature_plot"],
      ["数字病理论文", "医学 AI", "attention_heatmap"],
      ["机器学习预测模型", "通用建模", "roc"],
      ["教学改革论文", "医学教育", "workflow_diagram"],
      ["生物信息学分析", "医学与生物", "enrichment_dotplot"],
      ["工程实验论文", "工程与材料", "gantt"],
      ["社会科学问卷", "社科与教育", "barplot"],
    ];
    return shell("method-runner", `<section class="r110-section">${sectionHead("文章全流程", "Method Runner", "文章类型不是顶层学科，而是进入某个学科后的写作路线。选一个类型，系统给出问题、数据、图表、Skill、伦理和复现清单。")}<div class="r110-grid-5">${types.map(([t, k, plot], i) => `<article class="r110-card"><div class="r110-card-inner"><small>${esc(k)} · 流程 ${i + 1}</small><h3>${esc(t)}</h3><p>从 0 开始搭建研究问题、数据字段、图表组合和写作骨架。</p><figure class="r110-thumb"><img src="${imageFor(plot)}" alt="${esc(t)} 推荐图" loading="eager"></figure></div><div class="r110-card-actions"><a href="${path(`plot-gallery/${plot}`)}">看图</a><button data-mock-action="${esc(t)} 流程已生成 mock 草案，可接入 API 后细化。">生成草案</button></div></article>`).join("")}</div><div class="r110-panel"><h3>扰动分析入口</h3><p>如果你想做“虚拟敲除”，请进入单细胞/生物信息学下的扰动分析路线，而不是把它当成网站一级栏目。</p><a class="r110-button" href="${path("method-runner/virtual-perturbation")}">进入 virtual perturbation</a></div></section>`);
  }

  function virtualPerturbationPage() {
    const methods = [
      ["GEARS", "组合基因扰动预测", "需要 perturb-seq 或类似扰动数据；适合讲解扰动响应，不直接给临床结论。"],
      ["scGen", "跨状态表达迁移", "适合学习条件迁移思路；需要注意训练分布边界。"],
      ["CPA / chemCPA", "药物或条件扰动", "适合药物响应教学；不能替代真实实验。"],
      ["scTenifoldKnk", "基因敲除网络推断", "适合探索调控网络变化；结果需实验或文献验证。"],
    ];
    return shell("method-runner", `
      <section class="r110-detail">
        <main>
          ${sectionHead("Virtual perturbation / 虚拟扰动", "单细胞 → 扰动分析", "它不是网站顶层大类，而是生物信息学和单细胞分析中的一种方法路线。")}
          <figure class="r110-figure-card"><img src="${imageFor("network_graph")}" alt="虚拟扰动网络示例" loading="eager"><figcaption><span>示例：扰动响应网络</span><span>教学演示，不代表真实实验结论</span></figcaption></figure>
          <div class="r110-detail-grid">${methods.map(([t,b,d]) => `<article class="r110-panel"><h3>${esc(t)}</h3><p><strong>${esc(b)}</strong></p><p>${esc(d)}</p></article>`).join("")}</div>
          <div class="r110-panel"><h3>输入与输出</h3><p>输入：表达矩阵、细胞类型、扰动标签、训练/验证划分、目标基因或条件。输出：预测响应、关键基因排序、可视化图、风险提示和导师复核清单。</p></div>
        </main>
        <aside class="r110-panel">
          <h3>开始之前先确认</h3>
          <p>需要公开或授权数据；合成演示只用于学习流程。不要把模型预测当成真实实验或临床证据。</p>
          <button class="r110-button" data-testid="virtual-perturbation-mock-run" data-mock-action="已生成虚拟扰动 mock 工作流：GEARS → 字段检查 → 网络图 → 复核清单。">运行 mock 工作流</button>
          <a class="r110-outline" href="${path("open-source/gears")}">查看 GEARS 工具</a>
        </aside>
      </section>`);
  }

  function providersPage() {
    const providers = ["OpenAI", "DeepSeek", "Qwen", "Claude", "Gemini", "Ollama", "OpenAI-compatible"];
    return shell("providers", `<section class="r110-section">${sectionHead("模型接口", "BYOK", "API Key 只放在本地 Runtime 的 .env.local。静态 GitHub Pages 只显示 configured true/false，不保存也不展示密钥。")}<div class="r110-grid-5">${providers.map((p) => `<article class="r110-card"><div class="r110-card-inner"><small>Provider</small><h3>${esc(p)}</h3><p>状态：未配置。接入后可用于字段解释、代码改写、图注和报错解释。</p></div><div class="r110-card-actions"><button data-mock-action="${esc(p)} 静态站点不能保存 Key，请到本地 Runtime 配置。">测试</button><a href="${path("runtime")}">Runtime</a></div></article>`).join("")}</div></section>`);
  }

  function runtimePage() {
    return shell("runtime", `<section class="r110-hero"><div><span class="r110-kicker">Local Runtime</span><h1>真正跑图放在你自己的电脑或服务器</h1><p>网页负责选图、查字段和生成模板；R/Python 在本地执行。这样 API Key 不进 GitHub，用户数据也不上传到静态站点。</p><div class="r110-actions"><button class="r110-button" data-mock-action="静态版只展示流程，本地 runtime 需要用户启动。">检查本地服务</button><a class="r110-outline" href="${path("plot-studio")}">回到绘图</a></div></div>${plotHeroImage("workflow_diagram")}</section>`);
  }

  function profilePage() {
    return shell("profile", `<section class="r110-section">${sectionHead("我的主页", "Profile", "作品、收藏、积分、小岛和最近运行记录会集中在这里。")}<div class="r110-grid-5">${["我的 Skill", "我的案例", "我的图表", "我的收藏", "我的小岛"].map((t, i) => `<article class="r110-card"><div class="r110-card-inner"><small>${i + 1}</small><h3>${esc(t)}</h3><p>当前为本地演示数据。真实账号、关注和发布功能需要后端登录系统。</p></div></article>`).join("")}</div></section>`);
  }

  function genericPage(active, title, sub) {
    const modules = {
      "simulation-lab": ["合成教学案例", "选择病种、课程、难度和案例级别，生成 PBL 问题、报告训练和伦理审计。"],
      "comparison-lab": ["对照比较", "比较传统方式、普通提示词和规范化 Skill 的输出差异，记录教师复核点。"],
      "evidence-gallery": ["证据画廊", "集中展示示例图、代码、数据表、图注和 methods，方便作业或论文复现。"],
      governance: ["伦理治理", "检查隐私、虚假引用、临床误导、学术诚信和医学 AI 输出边界。"],
      "mobile-app": ["手机端方案", "展示面向移动端的新手入口、底部 tab、任务卡和科研小岛轻量入口。"],
      cases: ["案例与模板", "把教学案例、合成案例、科研案例和文章模板放在一个可收藏的位置。"],
    };
    const extra = modules[active] || [title, "当前为静态演示模块，真实上传、模型调用和账号功能需要本地 Runtime 或后端服务。"];
    return shell(active, `<section class="r110-hero"><div><span class="r110-kicker">${esc(sub)}</span><h1>${esc(title)}</h1><p>${esc(extra[1])} 静态 GitHub Pages 版本只演示流程和 mock 反馈，不保存 API Key，不上传用户数据。</p><div class="r110-actions"><a class="r110-button" href="${path("plot-studio")}">看绘图</a><a class="r110-outline" href="${path("community")}">去社区</a></div></div>${plotHeroImage("workflow_diagram")}</section><section class="r110-section"><div class="r110-grid-3">${["可以做什么", "需要什么输入", "输出什么"].map((t, i) => `<article class="r110-card"><div class="r110-card-inner"><small>${esc(extra[0])}</small><h3>${esc(t)}</h3><p>${["选择模板、查看样例、运行 mock 流程。","课程主题、数据字段、研究问题或示例文件。","结构化结果、复核清单、导出材料和下一步建议。"][i]}</p></div><div class="r110-card-actions"><button data-mock-action="${esc(title)} 的 ${esc(t)} 已收到，当前为静态演示。">试一下</button></div></article>`).join("")}</div></section>`);
  }

  function notFoundPage(active) {
    return shell(active, `<section class="r110-panel"><h1>页面已接住</h1><p>这个路由暂未做成完整模块，但不会黑屏。你可以从首页、绘图、Skill、社区继续。</p><a class="r110-button" href="${path("home")}">回首页</a></section>`);
  }

  function pageFor(active) {
    if (active === "home") return homePage();
    if (stepRoutes.some(([id]) => id === active)) return stepPage(active);
    if (active === "plot-studio") return plotStudioPage();
    if (active === "plot-gallery" && parts()[1]) return plotDetailPage();
    if (active === "plot-gallery") return plotGalleryPage();
    if (active === "plot-run") return plotRunPage();
    if (active === "skills") return skillsPage();
    if (active === "skill-builder") return skillBuilderPage();
    if (active === "plugin-hub") return pluginHubPage();
    if (active === "community") return communityPage();
    if (active === "open-source") return openSourcePage();
    if (active === "researcher") return researcherPage();
    if (active === "method-runner" && parts()[1] === "virtual-perturbation") return virtualPerturbationPage();
    if (active === "method-runner") return methodRunnerPage();
    if (active === "providers") return providersPage();
    if (active === "runtime") return runtimePage();
    if (active === "profile") return profilePage();
    if (active === "learn" || active === "teacher") return stepPage("step-design");
    if (active === "student") return stepPage("step-problem");
    if (active === "cases") return genericPage("cases", "案例与模板", "Cases");
    if (active === "governance") return genericPage("governance", "伦理治理", "Governance");
    if (active === "simulation-lab") return genericPage("simulation-lab", "模拟案例实验室", "Simulation Lab");
    if (active === "comparison-lab") return genericPage("comparison-lab", "比较实验室", "Comparison Lab");
    if (active === "evidence-gallery") return genericPage("evidence-gallery", "证据画廊", "Evidence Gallery");
    if (active === "mobile-app") return genericPage("mobile-app", "手机端设计", "Mobile App");
    return notFoundPage(active);
  }

  function toast(message) {
    let el = document.getElementById("r110-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "r110-toast";
      el.className = "r110-toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function bind() {
    const assistantEl = document.getElementById("r110-assistant");
    assistantEl?.querySelector("button")?.addEventListener("click", () => assistantEl.classList.toggle("open"));
    document.querySelectorAll("[data-mock-action]").forEach((el) => {
      el.addEventListener("click", (event) => {
        if (el.tagName !== "A") event.preventDefault();
        toast(el.getAttribute("data-mock-action") || "已收到，静态版用 mock 反馈。");
      });
    });
    const track = document.getElementById("r110-recommend-track");
    if (track) {
      const cards = [...track.querySelectorAll(".r110-rec-card")];
      const dots = [...document.querySelectorAll("[data-carousel-dot]")];
      let index = 0;
      let paused = false;
      const setIndex = (next) => {
        index = ((next % cards.length) + cards.length) % cards.length;
        cards[index]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      };
      document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => setIndex(index - 1));
      document.querySelector("[data-carousel-next]")?.addEventListener("click", () => setIndex(index + 1));
      dots.forEach((dot) => dot.addEventListener("click", () => setIndex(Number(dot.dataset.carouselDot || 0))));
      track.addEventListener("mouseenter", () => { paused = true; });
      track.addEventListener("mouseleave", () => { paused = false; });
      const timer = window.setInterval(() => {
        if (!paused && document.body.dataset.medpathRoute === "home") setIndex(index + 1);
      }, 4200);
      window.addEventListener("hashchange", () => window.clearInterval(timer), { once: true });
      let dragging = false;
      let startX = 0;
      let startScroll = 0;
      track.addEventListener("pointerdown", (event) => {
        dragging = true;
        paused = true;
        startX = event.clientX;
        startScroll = track.scrollLeft;
        track.setPointerCapture?.(event.pointerId);
        track.classList.add("dragging");
      });
      track.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        track.scrollLeft = startScroll - (event.clientX - startX);
      });
      const endDrag = (event) => {
        if (!dragging) return;
        dragging = false;
        paused = false;
        track.releasePointerCapture?.(event.pointerId);
        track.classList.remove("dragging");
        const nearest = cards.reduce((best, card, i) => {
          const delta = Math.abs(card.offsetLeft - track.scrollLeft);
          return delta < best.delta ? { i, delta } : best;
        }, { i: index, delta: Infinity });
        setIndex(nearest.i);
      };
      track.addEventListener("pointerup", endDrag);
      track.addEventListener("pointercancel", endDrag);
    }
    const search = document.querySelector("[data-testid='global-search']");
    search?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const q = search.value.toLowerCase();
      if (q.includes("图") || q.includes("plot") || q.includes("umap")) location.hash = "#/plot-studio";
      else if (q.includes("api") || q.includes("key") || q.includes("模型")) location.hash = "#/providers";
      else if (q.includes("社区") || q.includes("skill")) location.hash = "#/community";
      else location.hash = "#/research";
    });
  }

  function render() {
    if (isIslandRoute()) {
      document.body.classList.remove("round110-active");
      return;
    }
    const app = document.getElementById("app");
    if (!app) return;
    const active = currentRoute();
    document.body.classList.add("round110-active");
    document.body.dataset.medpathRoute = active;
    app.innerHTML = pageFor(active);
    bind();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  window.addEventListener("hashchange", () => setTimeout(render, 0));
  window.addEventListener("DOMContentLoaded", () => setTimeout(render, 80));
  window.addEventListener("load", () => setTimeout(render, 160));
})();


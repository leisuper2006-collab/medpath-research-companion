(function () {
  const VERSION = "round133";
  const PLOT_BASE = "outputs/round110_plots";
  const GAME_ROUTES = new Set(["/island", "/island-builder"]);

  const plotMeta = {
    boxplot: ["箱线图", "看组间分布、中位数和离散程度。", "group, value", "ggplot2 / ggpubr", "seaborn"],
    violin: ["小提琴图", "看组内分布形态，适合样本差异较明显的连续变量。", "group, value", "ggplot2 / ggdist", "seaborn"],
    barplot: ["柱状图", "比较类别数量、比例或均值。", "category, value", "ggplot2", "matplotlib"],
    scatter: ["散点图", "判断两个变量是否相关，顺便发现离群点。", "x_value, y_value, group", "ggplot2 / ggpubr", "seaborn"],
    line: ["折线图", "展示时间、剂量或处理顺序上的变化。", "time, value, group", "ggplot2", "matplotlib"],
    histogram: ["直方图", "看一个变量的整体分布。", "value", "ggplot2", "seaborn"],
    density: ["密度图", "比较连续变量在不同组的分布形状。", "value, group", "ggplot2", "seaborn"],
    correlation_heatmap: ["相关性热图", "快速查看多个变量之间的相关关系。", "variable matrix", "corrplot / ComplexHeatmap", "seaborn"],
    volcano: ["火山图", "同时看差异倍数和显著性，常用于差异表达。", "gene, log2FC, padj", "EnhancedVolcano", "bioinfokit"],
    ma_plot: ["MA图", "检查表达强度和差异倍数的关系。", "mean_expression, logFC", "limma", "matplotlib"],
    heatmap: ["热图", "展示样本和特征的整体模式。", "feature, sample, value", "ComplexHeatmap", "seaborn"],
    gsea_curve: ["GSEA曲线", "看某条通路是否在排序基因表前端富集。", "rank, running_score", "clusterProfiler", "gseapy"],
    ora_barplot: ["富集条形图", "按显著性展示通路或功能条目。", "term, p_adjust, count", "clusterProfiler", "matplotlib"],
    enrichment_dotplot: ["富集气泡图", "同时看通路显著性、比例和命中数量。", "term, gene_ratio, count, p_adjust", "clusterProfiler", "plotnine"],
    ridgeplot_enrichment: ["富集山峦图", "比较多个通路中的基因排序分布。", "term, rank_metric", "enrichplot", "seaborn"],
    umap: ["UMAP", "展示单细胞亚群和样本结构。", "UMAP_1, UMAP_2, cell_type", "Seurat", "scanpy"],
    tsne: ["t-SNE", "展示高维细胞数据的二维结构。", "tSNE_1, tSNE_2, cell_type", "Seurat", "scanpy"],
    marker_dotplot: ["Marker DotPlot", "比较多个标志基因在细胞群里的表达。", "gene, cluster, pct, expression", "Seurat", "scanpy"],
    feature_plot: ["Feature Plot", "在UMAP或空间坐标上看一个基因/评分。", "UMAP_1, UMAP_2, feature_value", "Seurat", "scanpy"],
    violin_by_cluster: ["按亚群小提琴图", "看基因在不同细胞群中的表达分布。", "cluster, expression", "Seurat", "scanpy"],
    cell_type_proportion: ["细胞比例图", "比较不同样本或分组的细胞组成。", "sample, cell_type, proportion", "ggplot2", "pandas"],
    pseudotime: ["拟时序图", "展示细胞状态沿轨迹的变化。", "pseudotime, state, cell_type", "monocle3", "scvelo"],
    trajectory: ["轨迹图", "展示分化路径和分支。", "dim1, dim2, branch", "monocle3", "scanpy"],
    rna_velocity: ["RNA velocity", "推断细胞状态转移方向。", "embedding, velocity", "velocyto", "scVelo"],
    cell_cell_communication_bubble: ["细胞通讯气泡图", "比较细胞群之间的配体-受体信号。", "sender, receiver, pathway, score", "CellChat", "CellPhoneDB"],
    ligand_receptor_network: ["配体-受体网络", "展示通讯关系网络。", "source, target, weight", "igraph", "networkx"],
    spatial_feature_plot: ["空间表达图", "把基因表达放回组织空间。", "x, y, feature_value", "Seurat", "Squidpy"],
    spatial_cluster_map: ["空间分群图", "看组织切片中的空间cluster。", "x, y, cluster", "Seurat", "Squidpy"],
    spatial_neighborhood_graph: ["空间邻域图", "分析细胞邻近关系和微环境结构。", "node, neighbor, weight", "Squidpy", "networkx"],
    spatial_ligand_receptor_map: ["空间通讯图", "把配体-受体结果映射回组织。", "x, y, interaction_score", "CellChat", "Squidpy"],
    tissue_region_composition: ["组织区域组成图", "比较不同组织区域的细胞构成。", "region, cell_type, proportion", "ggplot2", "pandas"],
    spatial_ecology_map: ["空间生态图", "展示组织生态位或微环境分布。", "x, y, niche", "Squidpy", "matplotlib"],
    circos: ["Circos圈图", "展示染色体、通路或多组学连接。", "source, target, value", "circlize", "pycirclize"],
    chord_diagram: ["弦图", "展示类别之间的双向关系强度。", "from, to, value", "circlize", "holoviews"],
    sankey: ["桑基图", "展示样本、流程或类别流向。", "source, target, value", "ggalluvial", "plotly"],
    alluvial: ["冲积图", "展示多阶段分类流向。", "stage, category, value", "ggalluvial", "plotly"],
    network_graph: ["网络图", "展示基因、通路、工具或概念连接。", "source, target, weight", "igraph", "networkx"],
    pathway_network: ["通路网络图", "把通路、基因和功能模块连起来。", "pathway, gene, relation", "igraph", "Cytoscape"],
    multi_omics_heatmap: ["多组学热图", "并排展示多层组学矩阵。", "feature, sample, omics_value", "ComplexHeatmap", "seaborn"],
    upset_plot: ["UpSet图", "展示多个集合的交集。", "set membership", "UpSetR", "upsetplot"],
    kaplan_meier: ["Kaplan-Meier曲线", "比较分组后的生存差异。", "time, status, group", "survminer", "lifelines"],
    forest_plot: ["森林图", "展示Meta分析或亚组效应量。", "study, effect, lower, upper", "meta / metafor", "forestplot"],
    subgroup_forest: ["亚组森林图", "观察不同亚组效应是否一致。", "subgroup, effect, ci", "meta / ggplot2", "forestplot"],
    funnel_plot: ["漏斗图", "评估发表偏倚或小样本效应。", "effect, se", "meta / metafor", "statsmodels"],
    nomogram: ["列线图", "把预测模型转成可读评分工具。", "predictor, points, risk", "rms", "regplot"],
    calibration_curve: ["校准曲线", "看预测概率和真实结局是否一致。", "predicted, observed", "rms", "scikit-learn"],
    roc: ["ROC曲线", "评估二分类模型区分能力。", "truth, score", "pROC", "scikit-learn"],
    pr_curve: ["PR曲线", "类别不平衡时评估模型表现。", "truth, score", "PRROC", "scikit-learn"],
    decision_curve: ["决策曲线", "评估模型在不同阈值下的净获益。", "threshold, net_benefit", "rmda", "dcurves"],
    consort_flow: ["CONSORT流程图", "展示临床研究对象筛选和纳入。", "stage, count", "DiagrammeR", "graphviz"],
    prisma_flow: ["PRISMA流程图", "展示综述检索、筛选和纳入流程。", "stage, count", "PRISMA2020", "graphviz"],
    tile_grid: ["WSI瓦片网格", "展示全切片如何切成patch。", "tile_x, tile_y, label", "OpenSlide", "matplotlib"],
    wsi_tissue_mask: ["组织掩膜图", "展示切片中组织和背景分割。", "x, y, mask", "OpenCV", "OpenSlide"],
    attention_heatmap: ["注意力热图", "展示模型关注的病理区域。", "x, y, attention", "PyTorch", "matplotlib"],
    patch_embedding_umap: ["Patch嵌入UMAP", "展示病理patch特征空间结构。", "UMAP_1, UMAP_2, class", "umap-learn", "sklearn"],
    prototype_atlas: ["原型图谱", "展示模型学到的典型视觉模式。", "prototype, image", "matplotlib", "PIL"],
    class_activation_map: ["类别激活图", "解释模型分类时关注的区域。", "image, activation", "Grad-CAM", "PyTorch"],
    confusion_matrix: ["混淆矩阵", "检查分类模型错在哪里。", "truth, prediction", "caret", "scikit-learn"],
    gantt: ["甘特图", "规划课题进度和里程碑。", "task, start, end", "ggplot2", "plotly"],
    technology_roadmap: ["技术路线图", "把研究路径拆成可执行步骤。", "step, dependency", "DiagrammeR", "mermaid"],
    logic_framework: ["逻辑框架图", "展示问题、任务、产出和评价关系。", "problem, task, output", "DiagrammeR", "graphviz"],
    budget_sankey: ["经费桑基图", "展示经费如何流向任务和成果。", "source, target, value", "ggalluvial", "plotly"],
    evaluation_radar: ["评价雷达图", "比较方案在多个指标上的表现。", "metric, score, group", "fmsb", "matplotlib"],
    workflow_diagram: ["工作流图", "展示从输入到输出的步骤和责任点。", "step, owner, output", "DiagrammeR", "mermaid"],
    architecture_diagram: ["系统架构图", "展示平台、模型、数据和用户关系。", "module, relation", "draw.io", "graphviz"]
  };

  const allIds = Object.keys(plotMeta);
  const commonStats = ["boxplot", "violin", "barplot", "scatter", "line", "histogram", "density", "correlation_heatmap"];
  const diffEnrich = ["volcano", "ma_plot", "heatmap", "gsea_curve", "ora_barplot", "enrichment_dotplot", "ridgeplot_enrichment"];
  const singleCell = ["umap", "tsne", "marker_dotplot", "feature_plot", "violin_by_cluster", "cell_type_proportion", "pseudotime", "trajectory", "rna_velocity", "cell_cell_communication_bubble", "ligand_receptor_network"];
  const spatial = ["spatial_feature_plot", "spatial_cluster_map", "spatial_neighborhood_graph", "spatial_ligand_receptor_map", "tissue_region_composition", "spatial_ecology_map"];
  const network = ["circos", "chord_diagram", "sankey", "alluvial", "network_graph", "pathway_network", "multi_omics_heatmap", "upset_plot"];
  const clinical = ["kaplan_meier", "forest_plot", "subgroup_forest", "funnel_plot", "nomogram", "calibration_curve", "roc", "pr_curve", "decision_curve", "consort_flow", "prisma_flow"];
  const pathology = ["tile_grid", "wsi_tissue_mask", "attention_heatmap", "patch_embedding_umap", "prototype_atlas", "class_activation_map", "confusion_matrix", "spatial_ecology_map"];
  const planning = ["gantt", "technology_roadmap", "logic_framework", "budget_sankey", "evaluation_radar", "workflow_diagram", "architecture_diagram", "sankey", "network_graph"];
  const ml = ["roc", "pr_curve", "calibration_curve", "decision_curve", "confusion_matrix", "attention_heatmap", "class_activation_map", "patch_embedding_umap", "feature_plot", "network_graph"];

  const disciplines = [
    {
      id: "medicine",
      name: "医学与生命科学",
      note: "临床、病理、组学和Meta分析放在这里；Meta不是一级类，而是医学论文任务的一种。",
      subs: [
        ["meta", "Meta分析与循证医学", "从森林图、漏斗图到PRISMA流程，先把研究问题和纳排表做好。", ["forest_plot", "subgroup_forest", "funnel_plot", "prisma_flow", "consort_flow", "sankey", "alluvial", "barplot"]],
        ["clinical", "临床预测与流行病学", "看生存、诊断、校准、净获益和亚组效应。", clinical],
        ["omics", "差异表达与富集", "火山图不是终点，后面还要接富集、热图和通路解释。", diffEnrich.concat(["circos", "network_graph"])],
        ["single-cell", "单细胞与空间组学", "从UMAP到通讯、轨迹和空间邻域，适合细胞图谱学习。", singleCell.concat(spatial)],
        ["pathology-ai", "计算病理与医学AI", "用于WSI、patch、模型解释和分类质控。", pathology.concat(ml)]
      ]
    },
    {
      id: "engineering",
      name: "工程、材料与算法实验",
      note: "更关注变量关系、过程控制、误差、模型评估和系统流程。",
      subs: [
        ["experiment", "实验对比", "比较处理组、剂量、时间和材料性能。", commonStats.concat(["heatmap", "scatter", "line"])],
        ["quality", "质控与模型表现", "看误差、分类、校准、ROC和混淆矩阵。", ["roc", "pr_curve", "calibration_curve", "confusion_matrix", "decision_curve", "scatter", "line", "correlation_heatmap"]],
        ["network", "网络与流程", "展示模块、流程、依赖和路径。", network.concat(planning)],
        ["project", "项目与经费", "用于方案、预算和进度展示。", planning]
      ]
    },
    {
      id: "social",
      name: "社科、教育与管理",
      note: "把问卷、量表、访谈编码、组织流向和评价指标转成图。",
      subs: [
        ["survey", "问卷与量表", "先看分布和相关，再谈模型。", ["barplot", "boxplot", "violin", "histogram", "density", "correlation_heatmap", "scatter", "heatmap"]],
        ["evaluation", "教育评价", "适合教学对照、指标体系和满意度分析。", ["evaluation_radar", "barplot", "line", "boxplot", "forest_plot", "workflow_diagram", "gantt", "logic_framework"]],
        ["text-network", "文本与关系", "用于主题、共现、知识网络和传播路径。", ["network_graph", "sankey", "alluvial", "chord_diagram", "upset_plot", "heatmap", "workflow_diagram", "architecture_diagram"]],
        ["evidence", "综述与证据", "适合检索流程、纳排、证据表和政策研究。", ["prisma_flow", "consort_flow", "forest_plot", "funnel_plot", "logic_framework", "technology_roadmap", "budget_sankey"]]
      ]
    },
    {
      id: "humanities",
      name: "人文、传播与设计研究",
      note: "不把图做成理工科的样子，重在结构、比较、证据路径和叙事关系。",
      subs: [
        ["timeline", "叙事与时间", "展示事件、阶段和发展脉络。", ["line", "gantt", "workflow_diagram", "technology_roadmap", "logic_framework", "sankey"]],
        ["relation", "关系与传播", "展示人物、概念、文本和传播关系。", ["network_graph", "chord_diagram", "alluvial", "upset_plot", "heatmap", "circos"]],
        ["comparison", "比较与分类", "适合编码、分类、主题数量和差异比较。", ["barplot", "boxplot", "violin", "density", "correlation_heatmap", "scatter"]],
        ["portfolio", "作品与方案", "用于展示设计流程、架构和评价指标。", ["architecture_diagram", "workflow_diagram", "evaluation_radar", "budget_sankey", "logic_framework"]]
      ]
    },
    {
      id: "ai",
      name: "AI、机器学习与深度学习",
      note: "从数据、模型表现、可解释性到部署流程，避免只放一个准确率。",
      subs: [
        ["classification", "分类评估", "看区分能力、错误类型、校准和阈值。", ["roc", "pr_curve", "confusion_matrix", "calibration_curve", "decision_curve", "barplot"]],
        ["explain", "模型解释", "适合病理AI、图像模型和特征解释。", ["attention_heatmap", "class_activation_map", "patch_embedding_umap", "prototype_atlas", "feature_plot", "network_graph"]],
        ["embedding", "表征空间", "看样本、patch、细胞或文本嵌入结构。", ["umap", "tsne", "patch_embedding_umap", "scatter", "heatmap", "correlation_heatmap"]],
        ["pipeline", "工程流程", "展示训练、评估、部署和审计链路。", ["workflow_diagram", "architecture_diagram", "gantt", "logic_framework", "budget_sankey"]]
      ]
    },
    {
      id: "general",
      name: "通用统计与申报流程",
      note: "适合刚开始学习科研图的人，先用这些图理解字段和问题。",
      subs: [
        ["basic", "基础统计", "最常用的入门图，先学字段再学美化。", commonStats],
        ["compare", "差异比较", "适合组间、前后、处理条件和亚组比较。", ["boxplot", "violin", "barplot", "scatter", "forest_plot", "heatmap", "volcano", "ma_plot"]],
        ["flow", "流程与计划", "适合申请书、课程设计和项目管理。", planning],
        ["network", "网络与集合", "适合多关系、多阶段、多集合问题。", network]
      ]
    }
  ];

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function isGameRoute(path = route()) {
    return GAME_ROUTES.has(path) || path.startsWith("/island/");
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function go(path) {
    location.hash = path;
  }

  function img(id, type = "thumb") {
    return `${PLOT_BASE}/${id}/${type === "example" ? "example.png" : "thumb.png"}`;
  }

  function plot(id) {
    const fallback = [id.replace(/_/g, " "), "查看这个图能回答什么问题。", "sample, group, value", "ggplot2", "matplotlib"];
    const meta = plotMeta[id] || fallback;
    return { id, title: meta[0], desc: meta[1], fields: meta[2], r: meta[3], py: meta[4] };
  }

  function activeDiscipline() {
    return localStorage.getItem("medpath:r133:discipline") || "medicine";
  }

  function activeSubcat(discipline) {
    return localStorage.getItem(`medpath:r133:subcat:${discipline}`) || disciplines.find((d) => d.id === discipline)?.subs[0]?.[0] || "basic";
  }

  function disciplineById(id) {
    return disciplines.find((d) => d.id === id) || disciplines[0];
  }

  function subcatById(discipline, subId) {
    return discipline.subs.find((s) => s[0] === subId) || discipline.subs[0];
  }

  function appShell(content, active = "/plot-gallery") {
    const nav = [
      ["/home", "概览", "今天从哪开始"],
      ["/plot-gallery", "科研绘图", "看图例与代码"],
      ["/method-runner", "方法路线", "从0搭流程"],
      ["/open-source", "开源工具", "找仓库与教程"],
      ["/skills", "Skill市场", "官方与收藏"],
      ["/community", "社区交流", "帖子与榜单"],
      ["/profile", "我的主页", "作品与收藏"],
      ["/island", "科研小岛", "游戏模式"],
      ["/island-builder", "自主建造", "放置建筑"]
    ];
    const top = [
      ["/plot-gallery", "探索图谱"],
      ["/plot-run/umap", "上传数据"],
      ["/providers", "模型接口"],
      ["/community", "社区Skill"]
    ];
    return `
      <div class="r133-shell">
        <aside class="r133-sidebar">
          <div class="r133-brand"><div class="r133-logo">荷</div><div><strong>MedPath Research Companion</strong><span>科研图谱与Skill工作台</span></div></div>
          <nav class="r133-nav">${nav.map(([href, label, hint]) => `<a class="${active === href || (href === "/plot-gallery" && active.startsWith("/plot")) ? "is-active" : ""}" href="#${href}" data-r133-route="${href}"><span>${esc(label)}</span><small>${esc(hint)}</small></a>`).join("")}</nav>
        </aside>
        <main class="r133-main">
          <header class="r133-topbar">
            <nav class="r133-tabs">${top.map(([href, label]) => `<a class="${active === href || (href === "/plot-gallery" && active.startsWith("/plot")) ? "is-active" : ""}" href="#${href}" data-r133-route="${href}">${esc(label)}</a>`).join("")}</nav>
            <input class="r133-search" placeholder="搜索图型、字段或研究任务..." data-r133-search />
            <button class="r133-btn lotus" data-r133-toast="个人主页将在登录后保存你的收藏；当前是静态演示。">我</button>
          </header>
          <div class="r133-page">${content}</div>
        </main>
      </div>
      ${assistant()}
    `;
  }

  function plotCard(id, context = "") {
    const p = plot(id);
    const contextText = context ? `${context} · ` : "";
    return `
      <article class="r133-plot-card" data-plot-card="${esc(id)}">
        <div class="r133-plot-thumb"><img src="${img(id)}" alt="${esc(p.title)}示例图" onerror="this.onerror=null;this.src='${img(id, "example")}'"></div>
        <div class="r133-card-body">
          <div class="r133-card-meta"><span>${esc(contextText + p.r)}</span><span>${esc(p.py)}</span></div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="r133-actions">
            <button class="r133-btn lotus" data-r133-route="/plot-gallery/${esc(id)}">看详情</button>
            <button class="r133-btn primary" data-r133-route="/plot-run/${esc(id)}">开始</button>
          </div>
        </div>
      </article>`;
  }

  function galleryPage() {
    const dId = activeDiscipline();
    const discipline = disciplineById(dId);
    const sId = activeSubcat(dId);
    const sub = subcatById(discipline, sId);
    const fullIds = Array.from(new Set(discipline.subs.flatMap((s) => s[3]).concat(allIds))).slice(0, 65);
    const content = `
      <section class="r133-hero">
        <div>
          <div class="r133-kicker">Research Plot Studio</div>
          <h1 class="r133-title">按学科找图，不在图名里迷路</h1>
          <p class="r133-lead">先选学科，再选任务场景。每张图都配真实示例图、字段要求、R/Python包和开始入口。Meta分析放在医学与生命科学下面，不再作为独立大类。</p>
          <div class="r133-actions">
            <button class="r133-btn primary" data-r133-route="/plot-run/${esc(sub[3][0])}">上传数据开始</button>
            <button class="r133-btn lotus" data-r133-route="/providers">配置自己的模型API</button>
          </div>
        </div>
        <figure class="r133-hero-figure">
          <img src="${img(sub[3][0], "example")}" alt="${esc(plot(sub[3][0]).title)}示例图">
          <figcaption>当前方向：${esc(discipline.name)} / ${esc(sub[1])}。示例图来自本项目内置R/Python脚本和虚拟数据。</figcaption>
        </figure>
      </section>
      <section class="r133-grid-layout">
        <aside class="r133-taxonomy">
          <h3>学科分类</h3>
          <p>同一个图型可以服务多个学科，关键是它回答的问题不同。</p>
          ${disciplines.map((d) => `<button class="${d.id === dId ? "is-active" : ""}" data-r133-discipline="${esc(d.id)}"><strong>${esc(d.name)}</strong><small>${d.subs.reduce((n, s) => n + s[3].length, 0)} 个常用图入口</small></button>`).join("")}
        </aside>
        <div>
          <div class="r133-subcats">${discipline.subs.map((s) => `<button class="${s[0] === sub[0] ? "is-active" : ""}" data-r133-subcat="${esc(s[0])}"><strong>${esc(s[1])}</strong><span>${s[3].length} 种图</span></button>`).join("")}</div>
          <div class="r133-info-card"><strong>${esc(sub[1])}</strong><p>${esc(sub[2])}</p></div>
          <div class="r133-plot-grid">${sub[3].map((id) => plotCard(id, sub[1])).join("")}</div>
          <div class="r133-info-card" style="margin-top:24px"><strong>完整图谱库</strong><p>下面继续展示 ${fullIds.length} 种图。每张卡片都使用自己的示例图和对应代码，不再用同一张通用图冒充。</p></div>
          <div class="r133-plot-grid">${fullIds.map((id) => plotCard(id)).join("")}</div>
        </div>
      </section>`;
    return appShell(content, "/plot-gallery");
  }

  function detailPage(id) {
    const p = plot(id);
    const content = `
      <section class="r133-detail">
        <div>
          <button class="r133-btn lotus" data-r133-route="/plot-gallery">返回图谱</button>
          <div class="r133-kicker" style="margin-top:18px">图型详情</div>
          <h1 class="r133-title">${esc(p.title)}</h1>
          <p class="r133-lead">${esc(p.desc)}</p>
          <div class="r133-two-col">
            <div class="r133-panel"><h3>这个图回答什么</h3><p>${esc(p.desc)}适合先做探索和汇报，不适合拿来替代统计检验或导师复核。</p></div>
            <div class="r133-panel"><h3>必需字段</h3><p>${esc(p.fields)}</p></div>
            <div class="r133-panel"><h3>R包</h3><p>${esc(p.r)}</p></div>
            <div class="r133-panel"><h3>Python包</h3><p>${esc(p.py)}</p></div>
          </div>
          <div class="r133-actions">
            <button class="r133-btn primary" data-r133-route="/plot-run/${esc(id)}">用这个图开始</button>
            <a class="r133-btn" href="${img(id, "example")}" target="_blank" rel="noreferrer">打开高清示例</a>
          </div>
        </div>
        <figure class="r133-detail-figure">
          <img src="${img(id, "example")}" alt="${esc(p.title)}示例图">
          <figcaption>示例图由本项目虚拟数据和对应绘图脚本生成；正式论文请替换为自己的数据，并保留source data。</figcaption>
        </figure>
      </section>
      <section class="r133-two-col">
        <div class="r133-panel"><h3>R代码模板</h3><pre class="r133-code">${esc(rTemplate(id, p))}</pre></div>
        <div class="r133-panel"><h3>Python代码模板</h3><pre class="r133-code">${esc(pyTemplate(id, p))}</pre></div>
        <div class="r133-panel"><h3>图注模板</h3><p>${esc(p.title)}展示了${esc(p.desc)}。点、线、颜色或分面含义应在正式图注中逐一说明，并注明统计方法。</p></div>
        <div class="r133-panel"><h3>常见错误</h3><p>字段名不一致、单位缺失、统计方法与数据类型不匹配、把示例图当真实结果、上传隐私数据。</p></div>
      </section>`;
    return appShell(content, "/plot-gallery");
  }

  function runPage(id) {
    const p = plot(id);
    const content = `
      <section class="r133-hero">
        <div>
          <div class="r133-kicker">BYOK绘图流程</div>
          <h1 class="r133-title">开始生成：${esc(p.title)}</h1>
          <p class="r133-lead">静态网站只演示流程。真正调用模型API和运行R/Python时，请在自己的本地Runtime配置 API Key，并把密钥只放在本地 .env.local；网页不保存密钥，也不上传你的原始数据。</p>
          <div class="r133-actions"><button class="r133-btn lotus" data-r133-route="/plot-gallery/${esc(id)}">先看详情</button><button class="r133-btn primary" data-r133-toast="mock完成：字段检查通过，下一步应在本地Runtime运行脚本。">运行mock检查</button></div>
        </div>
        <figure class="r133-hero-figure"><img src="${img(id)}" alt="${esc(p.title)}预览"><figcaption>当前是示例预览。接入Runtime后会生成你的图、代码、图注、methods和审查报告。</figcaption></figure>
      </section>
      <section class="r133-run-layout" style="margin-top:22px">
        <div class="r133-step">
          <div class="r133-panel"><h3>1. 选择Skill</h3><label><input type="radio" checked> 官方Skill：Plot Studio Runner</label><br><label><input type="radio"> 我的收藏Skill：来自社区高收藏流程</label><p>社区Skill会按收藏量、复现次数和安全审查排序。</p></div>
          <div class="r133-panel"><h3>2. 粘贴字段</h3><p><b>需要：</b>${esc(p.fields)}</p><textarea placeholder="把CSV表头粘贴到这里，例如：${esc(p.fields)}"></textarea></div>
          <div class="r133-panel"><h3>3. 模型API</h3><p>API Key 只在本地读取。模型只帮你理解字段、改代码、写图注和解释报错；真正出图由本地R/Python执行。</p><pre class="r133-code">OPENAI_API_KEY=...
DEEPSEEK_API_KEY=...
QWEN_API_KEY=...</pre></div>
        </div>
        <div class="r133-step">
          <div class="r133-panel"><h3>输出包</h3><p>图像、脚本、source data、caption、methods、字段审查、导师复核清单。</p></div>
          <div class="r133-panel"><h3>R模板</h3><pre class="r133-code">${esc(rTemplate(id, p))}</pre></div>
          <div class="r133-panel"><h3>安全边界</h3><p>不要上传可识别患者信息。医学AI输出仅用于教学与科研训练，不替代临床诊断。</p></div>
        </div>
      </section>`;
    return appShell(content, "/plot-gallery");
  }

  function rTemplate(id, p) {
    return `library(ggplot2)
dat <- read.csv("example_data.csv")
# 图型：${p.title}
# 必需字段：${p.fields}
# 建议包：${p.r}
# 请把字段名替换为你的真实列名，再在本地Runtime运行。`;
  }

  function pyTemplate(id, p) {
    return `import pandas as pd
import matplotlib.pyplot as plt
dat = pd.read_csv("example_data.csv")
# Plot: ${p.title}
# Required fields: ${p.fields}
# Suggested packages: ${p.py}
# Run locally; do not upload private data to a static website.`;
  }

  function assistant() {
    return `
      <div class="r133-assistant">
        <div class="r133-assistant-panel" hidden data-r133-assistant-panel>
          <strong>像素科研助手</strong>
          <p>告诉我你的任务，我会推荐本页图型。未配置模型API时，只做本地规则建议。</p>
          <textarea data-r133-question placeholder="例如：我在做Meta分析，应该画什么图？"></textarea>
          <div class="r133-actions"><button class="r133-btn primary" data-r133-ask>推荐</button><button class="r133-btn" data-r133-assistant-close>收起</button></div>
          <p data-r133-answer>提示：Meta分析常看森林图、漏斗图和PRISMA流程图；单细胞常看UMAP、DotPlot和Feature Plot。</p>
        </div>
        <button class="r133-assistant-button" data-r133-assistant-toggle aria-label="打开像素科研助手"><span>▣</span></button>
      </div>`;
  }

  function toast(message) {
    const old = document.querySelector(".r133-toast");
    if (old) old.remove();
    const node = document.createElement("div");
    node.className = "r133-toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2600);
  }

  function render() {
    const path = route();
    if (isGameRoute(path)) {
      document.body.classList.remove("medpath-r133-plot");
      return false;
    }
    if (window.MEDPATH_ROUND142_PLOT_FLOW && (path.startsWith("/plot-gallery/") || path.startsWith("/plot-run/"))) {
      document.body.classList.remove("medpath-r133-plot");
      return false;
    }
    if (!(path === "/plot-gallery" || path.startsWith("/plot-gallery/") || path.startsWith("/plot-run/"))) {
      document.body.classList.remove("medpath-r133-plot");
      return false;
    }
    const app = document.getElementById("app");
    if (!app) return false;
    document.body.classList.add("medpath-r133-plot");
    let html = "";
    if (path === "/plot-gallery") html = galleryPage();
    else if (path.startsWith("/plot-gallery/")) html = detailPage(decodeURIComponent(path.split("/").pop()));
    else if (path.startsWith("/plot-run/")) html = runPage(decodeURIComponent(path.split("/").pop()));
    app.innerHTML = html;
    app.setAttribute("data-round133-owned", VERSION);
    return true;
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const routeTarget = event.target.closest("[data-r133-route]");
      if (routeTarget) {
        event.preventDefault();
        go(routeTarget.getAttribute("data-r133-route"));
        return;
      }
      const discipline = event.target.closest("[data-r133-discipline]");
      if (discipline) {
        localStorage.setItem("medpath:r133:discipline", discipline.getAttribute("data-r133-discipline"));
        render();
        return;
      }
      const subcat = event.target.closest("[data-r133-subcat]");
      if (subcat) {
        const dId = activeDiscipline();
        localStorage.setItem(`medpath:r133:subcat:${dId}`, subcat.getAttribute("data-r133-subcat"));
        render();
        return;
      }
      const toastTarget = event.target.closest("[data-r133-toast]");
      if (toastTarget) {
        toast(toastTarget.getAttribute("data-r133-toast"));
        return;
      }
      if (event.target.closest("[data-r133-assistant-toggle]")) {
        const panel = document.querySelector("[data-r133-assistant-panel]");
        if (panel) panel.hidden = !panel.hidden;
        return;
      }
      if (event.target.closest("[data-r133-assistant-close]")) {
        const panel = document.querySelector("[data-r133-assistant-panel]");
        if (panel) panel.hidden = true;
        return;
      }
      if (event.target.closest("[data-r133-ask]")) {
        const q = (document.querySelector("[data-r133-question]")?.value || "").toLowerCase();
        let answer = "建议先看基础统计图：箱线图、散点图、热图。把字段准备好后再进入开始页。";
        if (q.includes("meta") || q.includes("森林") || q.includes("综述")) answer = "Meta分析建议：森林图看效应量，漏斗图看发表偏倚，PRISMA流程图交代检索与纳入。";
        if (q.includes("单细胞") || q.includes("umap") || q.includes("marker")) answer = "单细胞建议：UMAP看群体结构，Marker DotPlot看标志基因，Feature Plot看单个基因分布。";
        if (q.includes("机器") || q.includes("预测") || q.includes("模型")) answer = "模型评估建议：ROC、PR曲线、校准曲线、决策曲线和混淆矩阵一起看。";
        const box = document.querySelector("[data-r133-answer]");
        if (box) box.textContent = answer;
      }
    }, true);

    window.addEventListener("hashchange", () => setTimeout(render, 30));
    window.addEventListener("load", () => setTimeout(render, 60));
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 60));
  }

  function start() {
    bind();
    render();
    if ("MutationObserver" in window) {
      const obs = new MutationObserver(() => {
        const path = route();
        const app = document.getElementById("app");
        const isPlotRoute = path === "/plot-gallery" || path.startsWith("/plot-gallery/") || path.startsWith("/plot-run/");
        const isRound142Route = window.MEDPATH_ROUND142_PLOT_FLOW && (path.startsWith("/plot-gallery/") || path.startsWith("/plot-run/"));
        const wasOverwritten = app && app.getAttribute("data-round133-owned") === VERSION && !app.querySelector(".r133-shell");
        if (isPlotRoute && !isRound142Route && (app?.getAttribute("data-round133-owned") !== VERSION || wasOverwritten)) {
          render();
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  start();
})();

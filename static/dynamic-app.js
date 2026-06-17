(function () {
  "use strict";

  const VERSION = "round115";
  const PLOT_BASE = "outputs/round110_plots";
  const PIXEL_BASE = "static/assets/external-pixel";

  const state = {
    carouselIndex: 0,
    activeDiscipline: "medical",
    activeSubcat: "single_cell",
    enabledSkills: new Set(["pathology-report-coach", "plot-studio-runner", "method-runner"]),
    likedPosts: new Set(),
    placedBuildings: [
      { id: "library", name: "文献图书馆", x: 1, y: 1, w: 3, h: 2, route: "/open-source", type: "library" },
      { id: "plot", name: "绘图工坊", x: 5, y: 1, w: 3, h: 2, route: "/plot-gallery", type: "plot" },
      { id: "skill", name: "Skill工坊", x: 9, y: 2, w: 3, h: 2, route: "/skills", type: "skill" },
      { id: "clinic", name: "病理实验室", x: 2, y: 5, w: 4, h: 2, route: "/method-runner", type: "lab" },
    ],
  };

  const navItems = [
    ["概览", "/home"],
    ["探索方法", "/method-runner"],
    ["科研绘图", "/plot-gallery"],
    ["Skill 市场", "/skills"],
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
  ];

  const plotCategories = [
    {
      id: "medical",
      name: "医学与临床",
      subs: [
        {
          id: "meta",
          name: "Meta分析与循证",
          desc: "森林图、漏斗图、PRISMA流程和亚组分析。",
          plots: ["forest_plot", "prisma_flow", "subgroup_forest", "roc", "calibration_curve", "decision_curve", "consort_flow"],
        },
        {
          id: "clinical",
          name: "临床预测",
          desc: "生存、ROC、校准曲线和临床决策曲线。",
          plots: ["kaplan_meier", "roc", "pr_curve", "calibration_curve", "decision_curve", "nomogram", "consort_flow"],
        },
        {
          id: "pathology",
          name: "计算病理",
          desc: "切片瓦片、注意力热图、组织掩膜和模型评估。",
          plots: ["tile_grid", "wsi_tissue_mask", "attention_heatmap", "patch_embedding_umap", "prototype_atlas", "confusion_matrix", "class_activation_map"],
        },
      ],
    },
    {
      id: "biology",
      name: "生物与组学",
      subs: [
        {
          id: "single_cell",
          name: "单细胞",
          desc: "聚类、marker、轨迹、细胞比例和通讯分析。",
          plots: ["umap", "tsne", "feature_plot", "marker_dotplot", "violin_by_cluster", "cell_type_proportion", "pseudotime", "trajectory", "rna_velocity", "cell_cell_communication_bubble"],
        },
        {
          id: "spatial",
          name: "空间组学",
          desc: "空间表达、邻域、组织区域和配体受体图。",
          plots: ["spatial_feature_plot", "spatial_cluster_map", "spatial_neighborhood_graph", "spatial_ligand_receptor_map", "tissue_region_composition", "spatial_ecology_map"],
        },
        {
          id: "enrichment",
          name: "差异与富集",
          desc: "火山、热图、GSEA、ORA、富集点图和ridge图。",
          plots: ["volcano", "ma_plot", "heatmap", "gsea_curve", "ora_barplot", "enrichment_dotplot", "ridgeplot_enrichment"],
        },
        {
          id: "network",
          name: "多组学与网络",
          desc: "网络、桑基、弦图、circos和交集图。",
          plots: ["network_graph", "pathway_network", "sankey", "alluvial", "chord_diagram", "circos", "multi_omics_heatmap", "upset_plot"],
        },
      ],
    },
    {
      id: "engineering",
      name: "工科与算法",
      subs: [
        {
          id: "model_eval",
          name: "模型评估",
          desc: "分类、回归、混淆矩阵、ROC/PR和消融图。",
          plots: ["confusion_matrix", "roc", "pr_curve", "scatter", "line", "barplot", "heatmap"],
        },
        {
          id: "workflow",
          name: "系统与流程",
          desc: "架构图、任务流、甘特、预算流向和路线图。",
          plots: ["workflow_diagram", "architecture_diagram", "technology_roadmap", "gantt", "budget_sankey", "logic_framework", "evaluation_radar"],
        },
      ],
    },
    {
      id: "humanities",
      name: "人文社科",
      subs: [
        {
          id: "survey",
          name: "问卷与访谈",
          desc: "条形图、相关热图、密度、桑基和主题网络。",
          plots: ["barplot", "boxplot", "violin", "correlation_heatmap", "density", "sankey", "network_graph"],
        },
        {
          id: "policy",
          name: "政策与项目",
          desc: "逻辑框架、技术路线、甘特、评价雷达和经费流向。",
          plots: ["logic_framework", "technology_roadmap", "workflow_diagram", "gantt", "evaluation_radar", "budget_sankey"],
        },
      ],
    },
  ];

  const plotInfo = {
    boxplot: ["箱线图", "比较多组连续变量的分布和离群点", "ggplot2 / seaborn"],
    violin: ["小提琴图", "展示组间分布形状，适合表达异质性", "ggplot2 / seaborn"],
    scatter: ["散点图", "看两个连续变量的关系、趋势和异常点", "ggplot2 / matplotlib"],
    line: ["折线图", "表达时间、剂量或迭代过程中的连续变化", "ggplot2 / matplotlib"],
    histogram: ["直方图", "检查变量分布和分箱后的频数", "ggplot2 / matplotlib"],
    density: ["密度图", "平滑比较不同组的变量分布", "ggplot2 / seaborn"],
    correlation_heatmap: ["相关热图", "快速查看变量之间的相关结构", "corrplot / seaborn"],
    volcano: ["火山图", "差异分析里同时看效应量和显著性", "EnhancedVolcano / ggplot2"],
    ma_plot: ["MA图", "检查表达量均值与差异倍数的关系", "DESeq2 / ggplot2"],
    heatmap: ["热图", "展示基因、样本或指标矩阵的模式", "ComplexHeatmap / pheatmap"],
    gsea_curve: ["GSEA曲线", "展示基因集沿排序列表的富集趋势", "clusterProfiler / fgsea"],
    ora_barplot: ["ORA条形图", "展示过表达富集分析的Top通路", "clusterProfiler / ggplot2"],
    enrichment_dotplot: ["富集点图", "用点大小和颜色同时表达富集结果", "clusterProfiler / ggplot2"],
    ridgeplot_enrichment: ["富集山脊图", "比较多个通路的基因排序分布", "ggridges / enrichplot"],
    umap: ["UMAP", "把高维单细胞表达压缩到二维观察细胞群", "Seurat / Scanpy"],
    tsne: ["tSNE", "展示细胞或样本在低维空间中的聚类关系", "Seurat / Scanpy"],
    marker_dotplot: ["Marker点图", "同时看marker表达强度和表达比例", "Seurat DotPlot / Scanpy"],
    feature_plot: ["Feature Plot", "在低维图上观察基因或评分的空间分布", "Seurat FeaturePlot / Scanpy"],
    violin_by_cluster: ["分群小提琴图", "按cluster比较基因或score的分布", "Seurat VlnPlot / ggplot2"],
    cell_type_proportion: ["细胞比例图", "比较健康/疾病/治疗组的细胞组成变化", "ggplot2 / scanpy"],
    pseudotime: ["拟时序图", "展示细胞状态沿发育或疾病进展的变化", "monocle3 / slingshot"],
    trajectory: ["轨迹图", "把分支路径和细胞状态变化放在同一图中", "monocle3 / scvelo"],
    rna_velocity: ["RNA velocity", "推断细胞状态转移方向", "scVelo / velocyto"],
    cell_cell_communication_bubble: ["细胞通讯气泡图", "展示细胞群之间配体受体信号强弱", "CellChat / CellPhoneDB"],
    spatial_feature_plot: ["空间表达图", "把基因表达映射回组织位置", "Seurat / Squidpy"],
    spatial_cluster_map: ["空间分群图", "展示组织切片中的空间cluster", "Seurat / Squidpy"],
    spatial_neighborhood_graph: ["空间邻域图", "分析细胞邻近关系和微环境结构", "Squidpy / networkx"],
    spatial_ligand_receptor_map: ["空间配体受体图", "把通讯结果落回组织空间", "Squidpy / CellChat"],
    tissue_region_composition: ["组织区域组成图", "比较不同组织区域的细胞构成", "ggplot2 / pandas"],
    spatial_ecology_map: ["空间生态图", "展示肿瘤生态位或微环境分布", "Squidpy / matplotlib"],
    circos: ["Circos圈图", "展示基因组区段、通路或多组学连接", "circlize / pycirclize"],
    chord_diagram: ["弦图", "展示类别之间的双向关系和强度", "circlize / holoviews"],
    sankey: ["桑基图", "展示样本、流程或分类转移", "ggalluvial / plotly"],
    alluvial: ["冲积图", "展示多阶段分类流向", "ggalluvial / plotly"],
    network_graph: ["网络图", "展示基因、通路、工具或概念之间的连接", "igraph / networkx"],
    pathway_network: ["通路网络", "把通路、基因和功能模块连起来", "igraph / Cytoscape"],
    multi_omics_heatmap: ["多组学热图", "并排展示多层组学矩阵", "ComplexHeatmap / seaborn"],
    upset_plot: ["UpSet图", "展示多个集合交集，比韦恩图更清楚", "UpSetR / upsetplot"],
    kaplan_meier: ["Kaplan-Meier曲线", "比较分组后的生存差异", "survminer / lifelines"],
    forest_plot: ["森林图", "Meta分析或亚组结果的效应量展示", "meta / forestplot"],
    subgroup_forest: ["亚组森林图", "观察不同亚组的效应一致性", "meta / ggplot2"],
    funnel_plot: ["漏斗图", "评估发表偏倚或小样本效应", "meta / metafor"],
    nomogram: ["列线图", "把预测模型转成临床可读评分工具", "rms / regplot"],
    calibration_curve: ["校准曲线", "看预测概率和真实结局是否一致", "rms / scikit-learn"],
    roc: ["ROC曲线", "评估二分类模型区分能力", "pROC / scikit-learn"],
    pr_curve: ["PR曲线", "类别不平衡时评估模型表现", "PRROC / scikit-learn"],
    decision_curve: ["决策曲线", "评估模型在不同阈值下的临床净获益", "rmda / dcurves"],
    consort_flow: ["CONSORT流程图", "展示临床研究对象筛选和纳入流程", "DiagrammeR / graphviz"],
    prisma_flow: ["PRISMA流程图", "展示综述检索、筛选和纳入流程", "PRISMA2020 / DiagrammeR"],
    tile_grid: ["WSI瓦片网格", "展示全切片如何切成模型输入patch", "OpenSlide / matplotlib"],
    wsi_tissue_mask: ["组织掩膜图", "展示切片中组织区域和背景分割", "OpenCV / OpenSlide"],
    attention_heatmap: ["注意力热图", "展示模型关注的病理区域", "PyTorch / matplotlib"],
    patch_embedding_umap: ["Patch嵌入UMAP", "展示病理patch特征空间结构", "umap-learn / sklearn"],
    prototype_atlas: ["原型图谱", "展示模型学到的典型病理视觉模式", "matplotlib / PIL"],
    class_activation_map: ["类别激活图", "解释模型分类时关注的局部区域", "Grad-CAM / PyTorch"],
    confusion_matrix: ["混淆矩阵", "检查分类模型错在哪里", "caret / scikit-learn"],
    gantt: ["甘特图", "规划课题进度和里程碑", "ggplot2 / plotly"],
    technology_roadmap: ["技术路线图", "把研究路径拆成可执行步骤", "DiagrammeR / mermaid"],
    logic_framework: ["逻辑框架图", "展示问题、任务、产出和评价之间的关系", "DiagrammeR / graphviz"],
    budget_sankey: ["经费桑基图", "展示经费如何流向任务和成果", "ggalluvial / plotly"],
    evaluation_radar: ["评价雷达图", "比较方案在多个指标上的表现", "fmsb / matplotlib"],
    workflow_diagram: ["工作流图", "展示从输入到输出的步骤和责任点", "DiagrammeR / mermaid"],
    architecture_diagram: ["系统架构图", "展示平台、模型、数据和用户之间的关系", "draw.io / graphviz"],
    barplot: ["柱状图", "比较不同类别的数量或均值", "ggplot2 / matplotlib"],
  };

  const recommended = [
    { title: "生成一个教学案例", desc: "输入课程主题，得到PBL情境、问题链和教师复核表。", sample: "胃腺癌本科病理PBL", route: "/method-runner" },
    { title: "找一个科研方法", desc: "按数据类型推荐方法、工具、图表和学习路径。", sample: "单细胞肿瘤免疫差异", route: "/method-runner" },
    { title: "生成一张论文图", desc: "选择图型，查看真实示例、R/Python模板和图注。", sample: "log2FC + pvalue 火山图", route: "/plot-gallery" },
    { title: "创建自己的 Skill", desc: "把常用流程写成可收藏、可发布、可复用的任务卡。", sample: "森林图复核流程", route: "/skills" },
    { title: "进入科研小岛", desc: "把常用工具放进建筑，做任务、拿积分、拜访好友。", sample: "我的病理绘图岛", route: "/island" },
  ];

  const personas = [
    { name: "科研小白", text: "从“我想研究什么”开始，按步骤拿到方法、图和复核清单。", route: "/method-runner" },
    { name: "完成作业的学生", text: "直接看示例图、数据格式和代码模板，替换字段就能学。", route: "/plot-gallery" },
    { name: "老师", text: "准备课程案例、报告训练材料和学生评价量规。", route: "/skills" },
    { name: "写论文的人", text: "按文章类型规划图表、方法、结果和复现材料。", route: "/plot-gallery" },
    { name: "社区创作者", text: "发布自己的Skill和案例，按收藏进入排行榜。", route: "/community" },
  ];

  const skills = [
    ["medpath-course-designer", "课程设计", "把课程目标拆成章节任务和评价材料。"],
    ["pathology-case-builder", "病理案例", "生成PBL情境、问题链和讨论提纲。"],
    ["em-pathology-tutor", "超微导学", "把电镜结构讲成学生能跟上的解释。"],
    ["pathology-report-coach", "报告反馈", "检查学生病理报告结构、术语和证据链。"],
    ["plot-studio-runner", "科研绘图", "从图型、字段到代码、图注一套走完。"],
    ["method-runner", "方法运行", "按数据类型推荐路线和工具。"],
    ["literature-review-helper", "综述助手", "帮新手整理检索词、纳排和框架。"],
    ["grant-outline-builder", "申报框架", "把想法整理成问题、方案和成果路径。"],
    ["ai-ethics-governor", "伦理审计", "检查隐私、误导、假引用和临床风险。"],
    ["skill-eval-harness", "质量评测", "用rubric比较传统方式、提示词和Skill。"],
  ];

  const posts = [
    ["Path_Queen", "我做了一个“病理报告批改Skill”，适合本科训练", 2740, "Skill"],
    ["BioWalker", "单细胞图太多怎么选？我整理了入门顺序", 2310, "绘图"],
    ["小明同学", "胃癌PBL案例模板，老师复核后课堂可用", 3860, "案例"],
    ["MedScholar", "Meta分析新手别先画森林图，先检查纳排表", 1420, "方法"],
  ];

  const buildings = [
    { id: "lotus-library", name: "荷风图书馆", size: "3×2", price: 800, route: "/open-source", type: "library", desc: "文献、综述和公开数据入口" },
    { id: "path-lab", name: "病理实验室", size: "4×2", price: 1200, route: "/method-runner", type: "lab", desc: "报告训练、切片案例和计算病理" },
    { id: "plot-house", name: "绘图工坊", size: "3×2", price: 950, route: "/plot-gallery", type: "plot", desc: "R/Python图表模板和示例图" },
    { id: "skill-shop", name: "Skill工坊", size: "3×2", price: 1000, route: "/skills", type: "skill", desc: "创建、收藏和发布自己的Skill" },
    { id: "community-square", name: "社区广场", size: "4×3", price: 1500, route: "/community", type: "square", desc: "帖子、排行榜、拜访和点赞" },
    { id: "model-tower", name: "模型灯塔", size: "2×3", price: 1300, route: "/providers", type: "tower", desc: "BYOK模型配置和运行日志" },
  ];

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
    const item = plotInfo[plotId] || [plotId.replace(/_/g, " "), "展示数据结构和研究问题之间的关系", "R / Python"];
    return { id: plotId, title: item[0], desc: item[1], pkg: item[2] };
  }

  function allPlotIds() {
    return Array.from(new Set(plotCategories.flatMap((cat) => cat.subs.flatMap((sub) => sub.plots))));
  }

  function currentCategory() {
    return plotCategories.find((cat) => cat.id === state.activeDiscipline) || plotCategories[0];
  }

  function currentSubcat() {
    const cat = currentCategory();
    return cat.subs.find((sub) => sub.id === state.activeSubcat) || cat.subs[0];
  }

  function ensureSubcat() {
    const cat = currentCategory();
    if (!cat.subs.some((sub) => sub.id === state.activeSubcat)) {
      state.activeSubcat = cat.subs[0].id;
    }
  }

  function appShell(content, active = "/home") {
    const nav = navItems.map(([label, path]) => (
      `<a href="#${path}" class="${active === path || (active.startsWith(path) && path !== "/home") ? "is-active" : ""}" data-testid="nav-${path.slice(1)}">${escapeHtml(label)}</a>`
    )).join("");
    const tabs = topTabs.map(([label, path]) => `<a class="mp-tab" href="#${path}">${escapeHtml(label)}</a>`).join("");
    return `
      <div class="mp-shell">
        <aside class="mp-sidebar">
          <div class="mp-brand">
            <div class="mp-brand-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>科研学习与AI Skill工作台</span></div>
          </div>
          <nav class="mp-nav">${nav}</nav>
        </aside>
        <main class="mp-main">
          <div class="mp-topbar">
            <div class="mp-tabs">${tabs}</div>
            <label class="mp-search">⌕ <input placeholder="搜索方法、图型、数据集、问题..." aria-label="搜索" /></label>
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
          <span>用公开/模拟数据展示：UMAP、marker、细胞比例与方法路线。图像来自本项目代码生成示例，不代表真实研究结论。</span>
        </div>
      </div>`;
  }

  function renderHome() {
    return appShell(`
      <section class="mp-hero">
        <div class="mp-hero-copy">
          <div class="mp-kicker">从问题到图表、方法和Skill</div>
          <h1>把科研新手的第一步，变成能点开的工作流</h1>
          <p>你可以从一个问题、一张表、一个作业或一个课程主题开始。平台会给你方法路线、示例图、R/Python模板、Skill草案和复核清单。</p>
          <div class="mp-actions">
            <button class="mp-btn" data-route="/plot-gallery">看科研图谱</button>
            <button class="mp-btn secondary" data-route="/island">进入科研小岛</button>
          </div>
          <div class="mp-content-grid" style="margin-top:22px">
            <div class="mp-mini-card"><strong>80+</strong><span>图型与模板</span></div>
            <div class="mp-mini-card"><strong>10</strong><span>核心Skill</span></div>
            <div class="mp-mini-card"><strong>BYOK</strong><span>自带模型Key</span></div>
          </div>
        </div>
        ${heroFigure()}
      </section>
      <section class="mp-section">
        <div class="mp-section-head">
          <div>
            <h2 class="mp-section-title">五个常用入口</h2>
            <p>桌面端可横向滑动；移动端一屏一张多一点。每张卡都能进入真实页面。</p>
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
          ${personas.map((item) => `
            <article class="mp-persona">
              <div class="mp-lotus-icon">莲</div>
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.text)}</p>
              <div class="mp-actions"><button class="mp-btn lotus" data-route="${item.route}">进入</button><button class="mp-btn secondary" data-toast="已收藏这个入口">收藏</button></div>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="mp-section">
        <div class="mp-detail">
          <div>
            <h2 class="mp-section-title">这个项目能帮你做什么</h2>
            <p>它不是让你从零读一堆说明，而是把“提出问题、找方法、准备数据、画图、写图注、做Skill、请老师复核”拆成可点击的小步骤。</p>
            <p>静态GitHub Pages只做演示；接入你自己的本地Runtime和模型API后，才会运行真实数据与代码。API Key不会写进网站。</p>
          </div>
          <img src="${imgPath("workflow_diagram")}" alt="工作流示例图" />
        </div>
      </section>
    `, "/home");
  }

  function renderPlotGallery() {
    ensureSubcat();
    const cat = currentCategory();
    const sub = currentSubcat();
    const plotCards = sub.plots.map((id) => plotCard(id)).join("");
    const fullPlotCards = allPlotIds().map((id) => plotCard(id)).join("");
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div>
            <div class="mp-kicker">Research Plot Studio</div>
            <h1 class="mp-section-title">按学科找图，而不是在图名里迷路</h1>
            <p>先选学科，再选二级任务。每个图都有真实示例图、R/Python包、字段要求和BYOK绘图流程。</p>
          </div>
          <button class="mp-btn" data-route="/plot-run/${sub.plots[0]}">上传数据开始</button>
        </div>
        <div class="mp-content-grid">
          <aside class="mp-taxonomy">
            <h3>学科分类</h3>
            ${plotCategories.map((item) => `<button class="${item.id === state.activeDiscipline ? "is-active" : ""}" data-discipline="${item.id}">${escapeHtml(item.name)}</button>`).join("")}
          </aside>
          <div>
            <div class="mp-subcats">
              ${cat.subs.map((item) => `<button class="${item.id === sub.id ? "is-active" : ""}" data-subcat="${item.id}">${escapeHtml(item.name)}</button>`).join("")}
            </div>
            <div class="mp-panel" style="margin:14px 0">
              <strong>${escapeHtml(sub.name)}</strong>
              <p>${escapeHtml(sub.desc)} 下面展示的是可点击图卡，每张图都能进入详情和开始页。</p>
            </div>
            <div class="mp-plot-grid">${plotCards}</div>
            <div class="mp-section" style="padding-left:0;padding-right:0">
              <div class="mp-section-head">
                <div>
                  <h2 class="mp-section-title">完整图谱库</h2>
                  <p>全部图型统一使用本项目已生成的示例图。你可以直接点“看详情”或“开始”。</p>
                </div>
              </div>
              <div class="mp-plot-grid">${fullPlotCards}</div>
            </div>
          </div>
        </div>
      </section>
    `, "/plot-gallery");
  }

  function plotCard(id) {
    const plot = getPlot(id);
    return `
      <article class="mp-plot-card">
        <img src="${imgPath(id)}" alt="${escapeHtml(plot.title)}示例图" onerror="this.src='${imgPath("scatter")}'" />
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
            <div class="mp-panel">
              <strong>这个图适合回答什么问题</strong>
              <p>它适合把数据结构、组间差异或模型表现用一张图讲清楚。新手先确认研究问题，再检查字段，最后才改配色和图注。</p>
            </div>
            <div class="mp-content-grid" style="grid-template-columns:1fr 1fr">
              <div class="mp-card"><strong>必需字段</strong><p>样本ID、分组、数值/坐标/效应量字段。不同图型会在开始页给出更细检查。</p></div>
              <div class="mp-card"><strong>推荐包</strong><p>${escapeHtml(plot.pkg)}。默认优先R/ggplot2；需要交互或算法时补Python。</p></div>
            </div>
            <div class="mp-actions"><button class="mp-btn" data-route="/plot-run/${id}">用这个图开始</button><button class="mp-btn secondary" data-toast="示例数据已加入下载队列">下载示例数据</button></div>
          </div>
          <img src="${imgPath(id)}" alt="${escapeHtml(plot.title)}示例大图" onerror="this.src='${imgPath("scatter")}'" />
        </div>
        <div class="mp-content-grid" style="margin-top:18px">
          <div class="mp-panel"><h3>R代码模板</h3><pre class="mp-code">library(ggplot2)
dat &lt;- read.csv("example_data.csv")
ggplot(dat, aes(x = group, y = value, fill = group)) +
  geom_boxplot(width = .55, alpha = .78) +
  theme_minimal(base_family = "sans")</pre></div>
          <div class="mp-panel"><h3>Python代码模板</h3><pre class="mp-code">import pandas as pd
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
            <p>GitHub Pages演示走mock。本地Runtime会读取你自己的API配置，并在本机运行R/Python，不把API Key写进网页。</p>
          </div>
          <button class="mp-btn secondary" data-route="/plot-gallery/${id}">查看图型说明</button>
        </div>
        <div class="mp-content-grid">
          <div class="mp-panel">
            <h3>1. 选择Skill</h3>
            <label><input type="radio" name="skill-choice" checked> 官方Skill：Plot Studio Runner</label><br>
            <label><input type="radio" name="skill-choice"> 我的收藏Skill：社区高赞图注复核流程</label>
            <p>收藏Skill来自社区发布，按收藏量、复现次数和安全审计排序。</p>
          </div>
          <div class="mp-panel">
            <h3>2. 数据与字段</h3>
            <textarea style="width:100%;min-height:130px;border-radius:18px;border:1px solid var(--mp-line);padding:14px" placeholder="粘贴字段名，例如 sample, group, value, pvalue, log2FC..."></textarea>
            <div class="mp-actions"><button class="mp-btn" data-toast="字段检查通过：这是mock演示，本地Runtime会做真实检查。">检查字段</button><button class="mp-btn secondary" data-toast="已加载示例数据">使用示例数据</button></div>
          </div>
          <div class="mp-panel">
            <h3>3. 模型API</h3>
            <p><b>状态：</b>未检测到前端可见Key。请在本地Runtime的.env.local里配置，网页只显示configured true/false。</p>
            <pre class="mp-code">OPENAI_API_KEY=...
DEEPSEEK_API_KEY=...
QWEN_API_KEY=...</pre>
          </div>
        </div>
        <div class="mp-detail" style="margin-top:18px">
          <img src="${imgPath(id)}" alt="${escapeHtml(plot.title)}结果预览" onerror="this.src='${imgPath("scatter")}'" />
          <div>
            <h3>运行结果预览</h3>
            <p>当前为mock预览。真实运行时会输出：图、代码、source data、caption、methods、字段审查和导师复核清单。</p>
            <div class="mp-actions"><button class="mp-btn" data-toast="mock运行完成：已生成图注和复核清单。">运行本地绘图</button><button class="mp-btn secondary" data-toast="ZIP导出为演示状态">导出ZIP</button></div>
          </div>
        </div>
      </section>
    `, "/plot-gallery");
  }

  function renderSkills() {
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div><div class="mp-kicker">Skill Market</div><h1 class="mp-section-title">像挑工具一样挑Skill</h1><p>卡片只说能帮你做什么，不再写成目录。</p></div>
          <button class="mp-btn" data-toast="Skill创建器已打开：mock演示">创建我的Skill</button>
        </div>
        <div class="mp-skill-grid">
          ${skills.map(([id, name, desc]) => `
            <article class="mp-card">
              <div class="mp-lotus-icon">技</div>
              <h3>${escapeHtml(name)}</h3>
              <p>${escapeHtml(desc)}</p>
              <div class="mp-actions"><button class="mp-btn" data-toast="${escapeHtml(name)}已进入试用">打开</button><button class="mp-btn secondary" data-toast="${escapeHtml(name)}已收藏">收藏</button></div>
            </article>
          `).join("")}
        </div>
      </section>
    `, "/skills");
  }

  function renderCommunity() {
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div><div class="mp-kicker">Community</div><h1 class="mp-section-title">像论坛一样找帖子、找Skill、看榜单</h1><p>先做可点击的社区MVP：搜索、点赞、收藏、排行榜、拜访小岛。</p></div>
          <button class="mp-btn" data-toast="发帖弹窗：mock演示">发布帖子</button>
        </div>
        <div class="mp-content-grid">
          <div class="mp-community-list">
            ${posts.map(([author, title, likes, tag], i) => `
              <article class="mp-post">
                <span class="mp-lotus-icon">${i + 1}</span>
                <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(author)} · ${escapeHtml(tag)} · ${likes.toLocaleString()} 收藏</p></div>
                <div class="mp-actions"><button class="mp-btn secondary" data-toast="已点赞">点赞</button><button class="mp-btn" data-toast="已申请拜访TA的小岛">拜访</button></div>
              </article>
            `).join("")}
          </div>
          <aside class="mp-panel">
            <h3>本周排行榜</h3>
            <p>1. 病理报告批改Skill</p>
            <p>2. 单细胞入门图谱</p>
            <p>3. 胃癌PBL案例模板</p>
            <p>4. Meta分析森林图复核</p>
          </aside>
        </div>
      </section>
    `, "/community");
  }

  function renderIsland() {
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div><div class="mp-kicker">Research Island</div><h1 class="mp-section-title">科研小岛：干净版功能地图</h1><p>这里只保留底层建筑、一个小机器人和你的角色；弹窗可收起，标签不遮挡建筑。</p></div>
          <button class="mp-btn" data-route="/island-builder">进入自主建造</button>
        </div>
        <div class="mp-island">
          <div class="mp-island-panel">
            <strong>贡献榜</strong>
            <p>小明同学 3860</p><p>Path_Queen 2740</p><p>BioWalker 2310</p>
          </div>
          <div class="mp-island-map">
            <div class="mp-pixel-building" style="left:8%;top:12%" data-route="/open-source"><div class="mp-pixel-house"></div><span class="mp-pixel-label">图书馆</span></div>
            <div class="mp-pixel-building" style="left:34%;top:10%" data-route="/method-runner"><div class="mp-pixel-house lab"></div><span class="mp-pixel-label">病理实验室</span></div>
            <div class="mp-pixel-building" style="left:58%;top:13%" data-route="/skills"><div class="mp-pixel-house school"></div><span class="mp-pixel-label">教学楼</span></div>
            <div class="mp-pixel-building" style="left:13%;top:47%" data-route="/plot-gallery"><div class="mp-pixel-house plot"></div><span class="mp-pixel-label">绘图工坊</span></div>
            <div class="mp-pixel-building" style="left:58%;top:48%" data-route="/community"><div class="mp-pixel-house skill"></div><span class="mp-pixel-label">社区广场</span></div>
            <div class="mp-pixel-building" style="left:72%;top:62%" data-route="/providers"><div class="mp-pixel-house tower"></div><span class="mp-pixel-label">模型码头</span></div>
            <img src="${PIXEL_BASE}/aitown-player.png" alt="玩家" style="position:absolute;left:45%;top:61%;width:52px;image-rendering:pixelated" />
            <img src="${PIXEL_BASE}/microverse-joe.png" alt="机器人" class="mp-robot" style="position:absolute;left:40%;top:37%;width:70px;image-rendering:pixelated" />
          </div>
          <div class="mp-island-tools">
            <button data-toast="任务栏已收起/展开">任务</button>
            <button data-toast="背包已打开：mock">背包</button>
            <button data-route="/skills">技能</button>
            <button data-route="/community">好友</button>
          </div>
        </div>
      </section>
    `, "/island");
  }

  function renderBuilder() {
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head">
          <div><div class="mp-kicker">Island Builder</div><h1 class="mp-section-title">自主建造：把常用功能变成建筑</h1><p>建筑有占格大小、价格和绑定页面。现在是本地MVP，后续可接社区排行和个人主页。</p></div>
          <button class="mp-btn secondary" data-route="/island">返回小岛</button>
        </div>
        <div class="mp-builder-grid">
          <div class="mp-build-board">
            ${Array.from({ length: 96 }, (_, i) => `<span></span>`).join("")}
            ${state.placedBuildings.map((item) => `
              <button class="mp-build-item ${item.type}" style="--x:${item.x};--y:${item.y};--cols:${item.w};--rows:${item.h}" data-route="${item.route}">
                <span>${escapeHtml(item.name)}</span><small>${item.w}×${item.h}</small>
              </button>
            `).join("")}
          </div>
          <aside class="mp-catalog">
            <h3>建筑商店</h3>
            ${buildings.map((item) => `
              <button class="mp-catalog-item" data-add-building="${item.id}">
                <span class="thumb ${item.type}"></span>
                <strong>${escapeHtml(item.name)}</strong>
                <span>${escapeHtml(item.size)} · ${item.price}积分 · ${escapeHtml(item.desc)}</span>
              </button>
            `).join("")}
          </aside>
        </div>
      </section>
    `, "/island-builder");
  }

  function renderMethodRunner() {
    return appShell(`
      <section class="mp-section">
        <div class="mp-section-head"><div><div class="mp-kicker">Method Runner</div><h1 class="mp-section-title">告诉我你的数据，我帮你选方法</h1><p>医学、生信、工科、人文社科都能走。虚拟敲除被归入“生物信息学 → 单细胞 → 扰动分析”。</p></div></div>
        <div class="mp-content-grid">
          ${[
            ["单细胞扰动分析", "GEARS、scGen、CPA、scGPT perturbation、scTenifoldKnk", "/plot-gallery"],
            ["Meta分析流程", "检索、纳排、偏倚、森林图、漏斗图、亚组分析", "/plot-gallery"],
            ["计算病理", "WSI切片、patch、组织掩膜、注意力热图、混淆矩阵", "/plot-gallery"],
            ["问卷研究", "样本量、量表、相关热图、回归和结构方程提示", "/plot-gallery"],
          ].map(([title, text, route]) => `<article class="mp-card"><h3>${title}</h3><p>${text}</p><button class="mp-btn" data-route="${route}">查看路线</button></article>`).join("")}
        </div>
      </section>
    `, "/method-runner");
  }

  function renderSimplePage(title, text, active = "/home") {
    return appShell(`
      <section class="mp-section">
        <div class="mp-detail">
          <div><div class="mp-kicker">MedPath</div><h1 class="mp-section-title">${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p><button class="mp-btn" data-route="/home">回到首页</button></div>
          <img src="${imgPath("workflow_diagram")}" alt="页面示例图" />
        </div>
      </section>
    `, active);
  }

  function assistantHtml() {
    return `
      <div class="mp-assistant" data-assistant>
        <button class="mp-assistant-button" data-assistant-toggle aria-label="打开科研助手">
          <span class="mp-robot">▣</span>
        </button>
        <div class="mp-assistant-panel" hidden>
          <strong>像素科研助手</strong>
          <p>问我“我要做meta分析画什么图”或“打开科研小岛”。未配置API时我只做本地规则回答。</p>
          <textarea placeholder="说出你的任务..."></textarea>
          <div class="mp-actions"><button class="mp-btn" data-assistant-send>提问</button><button class="mp-btn secondary" data-assistant-close>收起</button></div>
          <p data-assistant-answer>提示：配置自己的模型API后，可让助手改代码、查字段、写图注。</p>
        </div>
      </div>`;
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    const path = routeOf();
    if (isLegacyGameRoute(path)) {
      document.body.classList.remove("medpath-dynamic-only");
      return;
    }
    document.body.classList.add("medpath-dynamic");
    window.__MEDPATH_DYNAMIC_RENDERING__ = true;
    let html;
    if (path === "/" || path === "/home") html = renderHome();
    else if (path === "/plot-gallery" || path === "/plot-studio") html = renderPlotGallery();
    else if (path.startsWith("/plot-gallery/")) html = renderPlotDetail(path.split("/").pop());
    else if (path.startsWith("/plot-run/")) html = renderPlotRun(path.split("/").pop());
    else if (path === "/skills") html = renderSkills();
    else if (path === "/community") html = renderCommunity();
    else if (path === "/method-runner" || path.startsWith("/method-runner/")) html = renderMethodRunner();
    else if (path === "/open-source") html = renderSimplePage("公开数据与开源导航", "这里会按学科、数据类型、License和能否本地运行来整理工具。先看用途，再进原仓库。", "/open-source");
    else if (path === "/profile") html = renderSimplePage("我的主页", "这里汇总你的Skill、案例、收藏、积分、小岛和最近动态。", "/profile");
    else if (path === "/providers" || path === "/runtime") html = renderSimplePage("模型与本地Runtime", "API Key只放在你自己的本地环境变量里；网页只显示是否配置，不保存密钥。", "/providers");
    else html = renderSimplePage("页面正在接入", "这个入口已接入新版路由。若是mock按钮，会给出反馈而不是无响应。", "/home");
    app.innerHTML = html;
    app.setAttribute("data-medpath-dynamic-owned", VERSION);
    bindEvents();
    window.__MEDPATH_DYNAMIC_RENDERING__ = false;
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
    document.querySelectorAll("[data-add-building]").forEach((el) => {
      el.addEventListener("click", () => addBuilding(el.getAttribute("data-add-building")));
    });
    const assistant = document.querySelector("[data-assistant]");
    if (assistant) {
      const panel = assistant.querySelector(".mp-assistant-panel");
      assistant.querySelector("[data-assistant-toggle]")?.addEventListener("click", () => panel.hidden = !panel.hidden);
      assistant.querySelector("[data-assistant-close]")?.addEventListener("click", () => panel.hidden = true);
      assistant.querySelector("[data-assistant-send]")?.addEventListener("click", () => {
        const text = assistant.querySelector("textarea")?.value || "";
        const answer = assistant.querySelector("[data-assistant-answer]");
        if (/小岛|岛|游戏/.test(text)) {
          answer.textContent = "我建议打开科研小岛或自主建造页：那里可以把常用功能放进建筑。";
          setTimeout(() => go("/island"), 350);
        } else if (/meta|森林|循证/.test(text)) {
          answer.textContent = "Meta分析常用：森林图、漏斗图、PRISMA流程、亚组森林图。已经为你打开医学-Meta分类。";
          state.activeDiscipline = "medical";
          state.activeSubcat = "meta";
          setTimeout(() => go("/plot-gallery"), 350);
        } else if (/单细胞|umap|marker/i.test(text)) {
          answer.textContent = "单细胞入门先看UMAP、Feature Plot、Marker点图和细胞比例图。";
          state.activeDiscipline = "biology";
          state.activeSubcat = "single_cell";
          setTimeout(() => go("/plot-gallery"), 350);
        } else {
          answer.textContent = "本地规则助手已响应。若要让大模型按你的数据推荐，请先在本地Runtime配置自己的API Key。";
        }
      });
    }
    setCarousel(state.carouselIndex, false);
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

  function addBuilding(id) {
    const info = buildings.find((item) => item.id === id);
    if (!info) return;
    const [w, h] = info.size.split("×").map(Number);
    const next = state.placedBuildings.length;
    state.placedBuildings.push({
      id: `${id}-${Date.now()}`,
      name: info.name,
      x: 1 + (next % 3) * 4,
      y: 8 + Math.floor(next / 3) * 3,
      w,
      h,
      route: info.route,
      type: info.type,
    });
    toast(`${info.name} 已放到地图上，可点击跳转。`);
    render();
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
        if (app.getAttribute("data-medpath-dynamic-owned") !== VERSION || !app.querySelector(".mp-shell")) render();
      }, 60);
    });
    observer.observe(appNode, { childList: true, subtree: false });
  }

  window.MedPathDynamicApp = { version: VERSION, render, allPlotIds, plotCategories };
})();

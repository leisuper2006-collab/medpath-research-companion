(() => {
  window.MEDPATH_ROUND110_WORKBENCH = true;
  const ASSET_BASE = window.MEDPATH_ASSET_BASE || "";
  const fullPlotIds = new Set([
    "boxplot", "violin", "scatter", "volcano", "heatmap", "enrichment_dotplot",
    "umap", "feature_plot", "marker_dotplot", "cell_type_proportion", "pseudotime",
    "cell_cell_communication_bubble", "spatial_feature_plot", "sankey", "network_graph",
    "upset_plot", "kaplan_meier", "forest_plot", "roc", "prisma_flow",
    "attention_heatmap", "confusion_matrix", "gantt", "workflow_diagram",
  ]);

  const topRoutes = [
    ["home", "探索方法"],
    ["plot-studio", "科研绘图"],
    ["skills", "Skill 市场"],
    ["tools", "公开工具"],
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
    ["生成一个教学案例", "输入课程主题，得到 PBL 情境、问题链和教师复核表。", "例：胃腺癌本科病理 PBL", "cases"],
    ["找一个科研方法", "按你的数据类型推荐方法、工具、图表和学习路径。", "例：单细胞肿瘤免疫差异", "research"],
    ["生成一张论文图", "选图型、查字段、拿代码、写图注，适合新手起步。", "例：我有 log2FC 和 pvalue", "plot-studio"],
    ["创建自己的 Skill", "把常用流程写成可收藏、可发布、可复用的任务卡。", "例：我的森林图复核流程", "skills"],
    ["进入科研小岛", "用游戏化入口管理常用工具、建筑、积分和社区作品。", "例：把 Plot Studio 放进绘图工坊", "island"],
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
      "open-source": "tools",
      "researcher": "research",
      "plugin-hub": "skills",
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
    if (fullPlotIds.has(id)) return `${ASSET_BASE}outputs/round110_plots/${id}/example.svg`;
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
    return `<figure class="r110-figure-card"><img src="${imageFor(id)}" alt="${esc(plotMeta[id]?.title || id)} 示例图" loading="lazy"><figcaption><span>本机 R 生成示例</span><a href="${path(`plot-gallery/${id}`)}">查看图型</a></figcaption></figure>`;
  }

  function recCard(item, i) {
    return `<article class="r110-rec-card" data-testid="recommend-card-${i + 1}">
      <small>0${i + 1}</small>
      <h3>${esc(item[0])}</h3>
      <p>${esc(item[1])}</p>
      <code>${esc(item[2])}</code>
      <div class="r110-actions"><a class="r110-button" data-testid="recommend-cta-${i + 1}" href="${path(item[3])}">开始</a></div>
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
          <div class="r110-pill-row"><span class="r110-pill">夏日荷风</span><span class="r110-pill">真实示例图</span><span class="r110-pill">BYOK / 本地运行</span></div>
          <div class="r110-actions"><a class="r110-button" href="${path("plot-studio")}">先看科研绘图</a><a class="r110-outline" href="${path("step-problem")}">走七步流程</a></div>
        </div>
        ${plotHeroImage("umap")}
      </section>
      <section class="r110-carousel">
        ${sectionHead("五个常用入口", "RecommendedFive", "桌面端横向滑动，移动端一屏一张多一点；每张卡都能进入真实页面。")}
        <div class="r110-carousel-track" id="r110-recommend-track">${recs.map(recCard).join("")}</div>
        <div class="r110-carousel-actions">
          <div class="r110-dots">${recs.map((_, i) => `<button class="r110-dot ${i === 0 ? "active" : ""}" data-carousel-dot="${i}" aria-label="切换推荐 ${i + 1}"></button>`).join("")}</div>
          <div class="r110-carousel-buttons"><button class="r110-icon-btn" data-carousel-prev aria-label="上一张">←</button><button class="r110-icon-btn" data-carousel-next aria-label="下一张">→</button></div>
        </div>
      </section>
      <section class="r110-section">
        ${sectionHead("按身份进入", "新手友好", "如果不知道该点哪里，先选你现在最像哪一类用户。")}
        <div class="r110-grid-5">${personas.map(([t,b,h]) => `<article class="r110-card"><div class="r110-card-inner"><small>入口</small><h3>${esc(t)}</h3><p>${esc(b)}</p></div><div class="r110-card-actions"><a href="${path(h)}">进入</a><button data-mock-action="已把 ${esc(t)} 加入快捷入口">收藏</button></div></article>`).join("")}</div>
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

  function plotCard(meta) {
    const status = fullPlotIds.has(meta.id) ? "Round110 完整示例" : "已有缩略图 / 待补完整包";
    return `<article class="r110-plot-card" data-testid="plot-card-${esc(meta.id)}">
      <img src="${imageFor(meta.id)}" alt="${esc(meta.title)} 示例图" loading="lazy">
      <div class="r110-plot-body"><small>${esc(meta.categoryLabel)} · ${esc(status)}</small><h3>${esc(meta.title)}</h3><p>${esc(meta.use)}</p><div class="r110-code-tags"><b>R</b><b>Python</b><b>${esc(meta.fields.split(",")[0])}</b></div></div>
      <div class="r110-plot-actions"><a data-testid="plot-detail-${esc(meta.id)}" href="${path(`plot-gallery/${meta.id}`)}">看详情</a><a data-testid="plot-start-${esc(meta.id)}" href="${path(`plot-run/${meta.id}`)}">开始</a></div>
    </article>`;
  }

  function selectedCategory() {
    const p = parts();
    const cat = categories.find((x) => x.id === p[1]);
    return cat || categories[0];
  }

  function allPlotCards(cat) {
    return cat.plots.map((p) => plotMeta[p[0]]);
  }

  function plotStudioPage() {
    const cat = selectedCategory();
    return shell("plot-studio", `
      <section class="r110-plot-page">
        <aside class="r110-plot-rail">
          <strong>图表分类</strong>
          ${categories.map((c) => `<a class="${c.id === cat.id ? "active" : ""}" href="${path(`plot-studio/${c.id}`)}">${esc(c.label)}</a>`).join("")}
        </aside>
        <main class="r110-plot-main">
          <div class="r110-plot-toolbar">
            <div>${sectionHead(cat.label, "Research Plot Studio", cat.intro)}</div>
            <select class="r110-select" data-testid="plot-category-select">${categories.map((c) => `<option ${c.id === cat.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}</select>
          </div>
          <div class="r110-plot-grid">${allPlotCards(cat).map(plotCard).join("")}</div>
        </main>
      </section>`);
  }

  function plotGalleryPage() {
    const completed = Array.from(fullPlotIds).map((id) => plotMeta[id]).filter(Boolean);
    return shell("plot-gallery", `
      <section class="r110-section">
        ${sectionHead("图谱总览", "Plot Gallery", "这里先展示 24 种已生成完整可复现文件夹的图。其余图型在分类页可见，并标注待补完整示例。")}
        <div class="r110-plot-grid">${completed.map(plotCard).join("")}</div>
      </section>`);
  }

  function plotDetailPage() {
    const id = parts()[1] || "umap";
    const meta = plotMeta[id] || plotMeta.umap;
    const full = fullPlotIds.has(meta.id);
    const rows = meta.fields.split(",").map((field, i) => `<tr><td>${esc(field)}</td><td>${i === 0 ? "必需" : "建议"}</td><td>请与上传数据列名对应；不确定时让模型只做字段解释，不直接替你下结论。</td></tr>`).join("");
    return shell("plot-gallery", `
      <section class="r110-detail">
        <main class="r110-tabs">
          <div>${sectionHead(meta.title, meta.categoryLabel, meta.use)}</div>
          <figure class="r110-figure-card"><img src="${imageFor(meta.id)}" alt="${esc(meta.title)} 大图" loading="lazy"><figcaption><span>${full ? "本机 R 生成完整示例" : "缩略示例，完整包待补"}</span><span>教学演示，不代表真实研究结论</span></figcaption></figure>
          <div class="r110-panel"><h3>这个图回答什么问题</h3><p>${esc(meta.use)}。新手先确认横纵轴、分组、样本量和统计含义，再写图注。</p></div>
          <div class="r110-panel"><h3>示例数据字段</h3><table class="r110-table"><thead><tr><th>字段</th><th>状态</th><th>说明</th></tr></thead><tbody>${rows}</tbody></table></div>
          <div class="r110-panel"><h3>代码与下载</h3><p>完整示例图型提供 PNG/SVG/PDF、source data、R/Python 模板、图注、methods 和 API prompt。</p><div class="r110-actions">${full ? `<a class="r110-outline" href="${fileFor(meta.id, "example_data.csv")}">下载数据</a><a class="r110-outline" href="${fileFor(meta.id, "plot.R")}">R 模板</a><a class="r110-outline" href="${fileFor(meta.id, "plot.py")}">Python 模板</a>` : `<button class="r110-outline" data-mock-action="该图型还在 V0.2 完整化清单中，当前只展示缩略图和字段说明。">查看待补说明</button>`}</div></div>
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

  function communityPage() {
    return shell("community", `
      <section class="r110-forum">
        <main><div class="r110-panel"><h1>社区交流</h1><p>像论坛一样找帖子、搜 Skill、看收藏榜。当前是静态 mock，真实登录、评论和发布需要后端。</p><input class="r110-input" placeholder="搜索帖子、作者、Skill、图表..." /></div>
        ${posts.map(([type,title,tag,views,likes]) => `<article class="r110-post"><b>${esc(type)}</b><div><h3>${esc(title)}</h3><p>${esc(tag)} · 浏览 ${views} · 收藏 ${likes}</p></div><a href="${path("skills")}">查看</a></article>`).join("")}</main>
        <aside class="r110-panel"><h2>Skill 收藏榜</h2>${skillCards.slice(5).map(([t,b], i) => `<p><strong>${i + 1}. ${esc(t)}</strong><br><span>${esc(b)}</span></p>`).join("")}<button class="r110-button" data-mock-action="发布 Skill 需要登录与审核，静态站点暂不提交。">发布 Skill</button></aside>
      </section>`);
  }

  function toolsPage() {
    const tools = ["PubMed / Europe PMC", "GEO / ArrayExpress", "TCGA / cBioPortal", "Seurat / Scanpy", "R Graph Gallery", "Quarto / GitHub Pages", "OpenTargets", "STRING / Reactome", "Cochrane / PROSPERO", "Hugging Face Spaces"];
    return shell("tools", `<section class="r110-section">${sectionHead("公开工具导航", "Open Source Navigator", "先看输入、输出、License 和新手难度，再决定要不要安装。")}<div class="r110-grid-5">${tools.map((t, i) => `<article class="r110-card"><div class="r110-card-inner"><small>${i < 4 ? "医学 / 生物" : "通用工具"}</small><h3>${esc(t)}</h3><p>适合查数据、跑分析或做可复现材料。详情页将继续补 GitHub、文档、论文和 License。</p></div><div class="r110-card-actions"><button data-mock-action="${esc(t)} 详情仍在扩展，当前先进入绘图或方法页。">详情</button><a href="${path("research")}">学习</a></div></article>`).join("")}</div></section>`);
  }

  function researchPage() {
    return shell("research", `<section class="r110-section">${sectionHead("探索方法", "Research Workbench", "按研究问题和数据类型进入，而不是把虚拟敲除放成顶层大类。")}<div class="r110-grid-5">${["医学与生物", "生物信息学", "单细胞与空间组学", "计算病理", "工程与材料", "社会科学", "人文传播", "统计建模", "机器学习", "项目申报"].map((t, i) => `<article class="r110-card"><div class="r110-card-inner"><small>方向 ${i + 1}</small><h3>${esc(t)}</h3><p>查看常见问题、推荐图表、可用工具和学习路径。</p></div><div class="r110-card-actions"><a href="${path("plot-studio")}">看图表</a><a href="${path("method-runner")}">看流程</a></div></article>`).join("")}</div></section>`);
  }

  function methodRunnerPage() {
    const types = ["Meta 分析", "系统综述", "单细胞论文", "空间组学论文", "数字病理论文", "机器学习预测模型", "教学改革论文", "生物信息学分析", "工程实验论文", "社会科学问卷"];
    return shell("method-runner", `<section class="r110-section">${sectionHead("文章全流程", "Method Runner", "选文章类型后，系统给出问题、数据、图表、Skill、伦理和复现清单。")}<div class="r110-grid-5">${types.map((t, i) => `<article class="r110-card"><div class="r110-card-inner"><small>流程 ${i + 1}</small><h3>${esc(t)}</h3><p>从 0 开始搭建研究问题、数据字段、图表组合和写作骨架。</p></div><div class="r110-card-actions"><a href="${path("plot-studio/clinical")}">图表</a><button data-mock-action="${esc(t)} 流程已加入 V0.2 扩展清单。">生成草案</button></div></article>`).join("")}</div></section>`);
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
    return shell(active, `<section class="r110-hero"><div><span class="r110-kicker">${esc(sub)}</span><h1>${esc(title)}</h1><p>这个页面已经接入统一风格和点击反馈。当前为静态演示，真实运行、上传和回传需要本地 Runtime 或后端服务。</p><div class="r110-actions"><a class="r110-button" href="${path("plot-studio")}">看绘图</a><a class="r110-outline" href="${path("community")}">去社区</a></div></div>${plotHeroImage("workflow_diagram")}</section>`);
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
    if (active === "community") return communityPage();
    if (active === "tools") return toolsPage();
    if (active === "research") return researchPage();
    if (active === "method-runner") return methodRunnerPage();
    if (active === "providers") return providersPage();
    if (active === "runtime") return runtimePage();
    if (active === "profile") return profilePage();
    if (active === "learn") return stepPage("step-design");
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
      const setIndex = (next) => {
        index = Math.max(0, Math.min(cards.length - 1, next));
        cards[index]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      };
      document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => setIndex(index - 1));
      document.querySelector("[data-carousel-next]")?.addEventListener("click", () => setIndex(index + 1));
      dots.forEach((dot) => dot.addEventListener("click", () => setIndex(Number(dot.dataset.carouselDot || 0))));
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

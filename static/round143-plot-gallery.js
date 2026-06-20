(function () {
  const VERSION = "round143";
  window.MEDPATH_ROUND143_PLOT_GALLERY = true;
  const BASE = "outputs/round110_plots";

  const catalog = {
    medicine: {
      name: "医学与生命科学",
      note: "临床、基础医学、生信、组学",
      subcats: {
        basic: ["基础统计", ["boxplot", "violin", "scatter", "line", "barplot", "histogram", "density", "correlation_heatmap"]],
        diff: ["差异与富集", ["volcano", "ma_plot", "heatmap", "gsea_curve", "ora_barplot", "enrichment_dotplot", "ridgeplot_enrichment"]],
        single: ["单细胞", ["umap", "tsne", "marker_dotplot", "feature_plot", "violin_by_cluster", "cell_type_proportion", "pseudotime", "trajectory", "rna_velocity", "cell_cell_communication_bubble", "ligand_receptor_network"]],
        spatial: ["空间组学", ["spatial_feature_plot", "spatial_cluster_map", "spatial_neighborhood_graph", "spatial_ligand_receptor_map", "tissue_region_composition"]],
        meta: ["循证与临床", ["forest_plot", "funnel_plot", "subgroup_forest", "kaplan_meier", "roc", "pr_curve", "calibration_curve", "decision_curve", "nomogram", "consort_flow", "prisma_flow"]],
        pathology: ["计算病理", ["tile_grid", "wsi_tissue_mask", "attention_heatmap", "patch_embedding_umap", "prototype_atlas", "spatial_ecology_map", "confusion_matrix", "class_activation_map"]]
      }
    },
    engineering: {
      name: "工程与计算",
      note: "模型评估、网络、流程",
      subcats: {
        model: ["模型评估", ["roc", "pr_curve", "calibration_curve", "decision_curve", "confusion_matrix", "attention_heatmap"]],
        network: ["网络结构", ["network_graph", "pathway_network", "sankey", "alluvial", "chord_diagram", "upset_plot"]],
        project: ["项目与架构", ["gantt", "workflow_diagram", "technology_roadmap", "architecture_diagram", "logic_framework", "budget_sankey", "evaluation_radar"]]
      }
    },
    social: {
      name: "社科与教育",
      note: "问卷、教育评价、文本网络",
      subcats: {
        survey: ["问卷与量表", ["barplot", "boxplot", "violin", "density", "correlation_heatmap", "line"]],
        evidence: ["综述与证据", ["prisma_flow", "forest_plot", "funnel_plot", "consort_flow", "workflow_diagram"]],
        community: ["社区与传播", ["network_graph", "sankey", "alluvial", "upset_plot", "line"]]
      }
    },
    proposal: {
      name: "申报与教学",
      note: "课题、经费、评价、课程",
      subcats: {
        grant: ["申报图", ["logic_framework", "technology_roadmap", "workflow_diagram", "gantt", "budget_sankey", "evaluation_radar", "architecture_diagram"]],
        teaching: ["教学评价", ["barplot", "evaluation_radar", "sankey", "workflow_diagram", "confusion_matrix", "line"]]
      }
    }
  };

  const meta = {
    boxplot: ["箱线图", "比较不同组连续变量的分布和离群点。", "ggplot2"],
    violin: ["小提琴图", "看组内分布形态，适合表达密度差异。", "ggplot2"],
    scatter: ["散点图", "观察两个变量之间的关系和分组趋势。", "ggplot2"],
    line: ["折线图", "展示随时间、剂量或训练轮次的变化。", "ggplot2"],
    barplot: ["柱状图", "比较分类变量、比例或实验组均值。", "ggplot2"],
    histogram: ["直方图", "查看变量分布、偏态和异常值。", "ggplot2"],
    density: ["密度图", "比较连续变量在不同组中的分布。", "ggplot2"],
    correlation_heatmap: ["相关热图", "展示变量之间的相关性结构。", "corrplot"],
    volcano: ["火山图", "同时看差异倍数和显著性。", "EnhancedVolcano"],
    ma_plot: ["MA 图", "评估表达均值与差异倍数关系。", "DESeq2"],
    heatmap: ["表达热图", "展示样本和特征的分组模式。", "ComplexHeatmap"],
    gsea_curve: ["GSEA 曲线", "展示基因集沿排序列表的富集趋势。", "clusterProfiler"],
    ora_barplot: ["ORA 富集柱图", "汇总显著通路和命中数量。", "clusterProfiler"],
    enrichment_dotplot: ["富集气泡图", "同时表达通路显著性、命中数和比例。", "enrichplot"],
    ridgeplot_enrichment: ["富集山峦图", "比较不同通路的排序分布。", "ggridges"],
    umap: ["UMAP 单细胞图", "从高维矩阵中看细胞亚群是否分开。", "Seurat"],
    tsne: ["tSNE 图", "展示细胞或样本在二维嵌入空间中的邻近关系。", "Seurat"],
    marker_dotplot: ["Marker 点图", "用点大小和颜色判断 marker 是否支持注释。", "Seurat"],
    feature_plot: ["Feature Plot", "看单个基因在嵌入图中的表达位置。", "Seurat"],
    violin_by_cluster: ["分群小提琴图", "比较某个基因在不同 cluster 中的表达。", "Seurat"],
    cell_type_proportion: ["细胞比例图", "比较样本或分组的细胞组成。", "ggplot2"],
    pseudotime: ["拟时序图", "展示细胞状态沿轨迹变化。", "monocle3"],
    trajectory: ["轨迹图", "展示分化路径或状态迁移路线。", "monocle3"],
    rna_velocity: ["RNA velocity 图", "展示转录动态方向。", "scVelo"],
    cell_cell_communication_bubble: ["细胞通讯气泡图", "展示配体受体强度与显著性。", "CellChat"],
    ligand_receptor_network: ["配体受体网络", "展示细胞群之间的信号连接。", "CellChat"],
    spatial_feature_plot: ["空间表达图", "看基因或指标在组织空间里的位置。", "Seurat"],
    spatial_cluster_map: ["空间分群图", "显示组织区域中的 cluster 分布。", "Squidpy"],
    spatial_neighborhood_graph: ["空间邻域图", "分析不同区域或细胞邻近关系。", "Squidpy"],
    spatial_ligand_receptor_map: ["空间配体受体图", "把通讯关系放回组织空间。", "Squidpy"],
    tissue_region_composition: ["组织区域组成图", "比较组织区域的细胞构成。", "ggplot2"],
    forest_plot: ["森林图", "汇总研究或亚组效应量和置信区间。", "meta"],
    funnel_plot: ["漏斗图", "检查发表偏倚和小样本效应。", "meta"],
    subgroup_forest: ["亚组森林图", "比较不同亚组效应是否一致。", "metafor"],
    kaplan_meier: ["Kaplan-Meier 曲线", "比较不同分组的生存结局。", "survival"],
    roc: ["ROC 曲线", "评估二分类模型区分能力。", "pROC"],
    pr_curve: ["PR 曲线", "适合类别不平衡场景的模型评估。", "yardstick"],
    calibration_curve: ["校准曲线", "看预测概率是否接近真实风险。", "rms"],
    decision_curve: ["决策曲线", "判断模型在不同阈值下的临床净获益。", "rmda"],
    nomogram: ["列线图", "把多变量模型转成个体风险估计工具。", "rms"],
    consort_flow: ["CONSORT 流程图", "展示临床研究纳入、分配、随访和分析。", "DiagrammeR"],
    prisma_flow: ["PRISMA 流程图", "说明系统综述检索、筛选和纳入过程。", "PRISMA2020"],
    tile_grid: ["切片 tile 网格", "展示 WSI 切块和采样策略。", "OpenSlide"],
    wsi_tissue_mask: ["WSI 组织掩膜", "标出切片中可分析组织区域。", "OpenSlide"],
    attention_heatmap: ["注意力热图", "解释模型关注的图像区域。", "PyTorch"],
    patch_embedding_umap: ["Patch 嵌入 UMAP", "展示图像 patch 特征聚类。", "scanpy"],
    prototype_atlas: ["原型图谱", "整理模型学习到的典型组织模式。", "matplotlib"],
    spatial_ecology_map: ["病理空间生态图", "展示组织微环境空间结构。", "ggplot2"],
    confusion_matrix: ["混淆矩阵", "查看分类模型容易混淆的类别。", "caret"],
    class_activation_map: ["类激活图", "定位模型做出判断的关键图像区域。", "PyTorch"],
    network_graph: ["网络关系图", "展示节点之间的连接和权重。", "ggraph"],
    pathway_network: ["通路网络图", "展示通路、基因和功能模块关系。", "Reactome"],
    sankey: ["桑基图", "展示样本、类别或经费的流向。", "ggalluvial"],
    alluvial: ["冲积图", "展示分类随阶段或分组转移。", "ggalluvial"],
    chord_diagram: ["弦图", "展示多类对象之间的双向关系。", "circlize"],
    upset_plot: ["UpSet 交集图", "比较多个集合的交集结构。", "UpSetR"],
    gantt: ["甘特图", "安排课题任务、时间和责任人。", "ggplot2"],
    workflow_diagram: ["工作流图", "把输入、处理、复核和输出步骤讲清楚。", "DiagrammeR"],
    technology_roadmap: ["技术路线图", "展示研究方案的路径和关键节点。", "DiagrammeR"],
    architecture_diagram: ["架构图", "展示平台、模块和数据流关系。", "Mermaid"],
    logic_framework: ["逻辑框架图", "说明问题、目标、任务和成果的关系。", "DiagrammeR"],
    budget_sankey: ["经费桑基图", "展示经费到任务和成果的映射。", "ggalluvial"],
    evaluation_radar: ["评价雷达图", "展示多指标评价体系，示意需标注待实测。", "fmsb"]
  };

  let discipline = localStorage.getItem("medpath:r143:discipline") || "medicine";
  let subcat = localStorage.getItem("medpath:r143:subcat") || "";
  let query = "";
  let root = null;

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function img(id, size = "thumb") {
    return `${BASE}/${id}/${size === "example" ? "example.png" : "thumb.png"}`;
  }

  function titleize(id) {
    return id.split("_").map((p) => p ? p[0].toUpperCase() + p.slice(1) : p).join(" ");
  }

  function currentDiscipline() {
    return catalog[discipline] || catalog.medicine;
  }

  function currentSubcat() {
    const d = currentDiscipline();
    if (!subcat || !d.subcats[subcat]) subcat = Object.keys(d.subcats)[0];
    return [subcat, d.subcats[subcat]];
  }

  function plot(id, label) {
    const row = meta[id] || [titleize(id), "用示例图理解用途，再替换成自己的数据。", "R / Python"];
    return { id, title: row[0], desc: row[1], pkg: row[2], label };
  }

  function items() {
    const d = currentDiscipline();
    const [, sub] = currentSubcat();
    const list = sub[1].map((id) => plot(id, sub[0]));
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => `${p.id} ${p.title} ${p.desc} ${p.pkg}`.toLowerCase().includes(q));
  }

  function shell(content) {
    const nav = [
      ["/home", "概览", "起点"],
      ["/plot-studio", "绘图工作台", "选图"],
      ["/plot-gallery", "图谱库", "全部"],
      ["/method-runner", "方法路线", "流程"],
      ["/open-source", "开源工具", "仓库"],
      ["/community", "社区", "共享"],
      ["/island", "科研小岛", "游戏"]
    ];
    return `
      <div class="r143-shell" data-round143-owned="true">
        <aside class="r143-side">
          <div class="r143-brand"><div class="r143-logo">图</div><div><strong>图谱库</strong><span>真实示例 · R 优先</span></div></div>
          <nav class="r143-nav">${nav.map(([href, label, note]) => `<a class="${href === "/plot-gallery" ? "is-active" : ""}" href="#${href}"><span>${label}</span><small>${note}</small></a>`).join("")}</nav>
          <div class="r143-disciplines">${Object.entries(catalog).map(([id, d]) => `<button class="${id === discipline ? "is-active" : ""}" data-r143-discipline="${esc(id)}"><span>${esc(d.name)}</span><small>${esc(d.note)}</small></button>`).join("")}</div>
        </aside>
        <main class="r143-main">
          <header class="r143-top">
            <nav class="r143-tabs">
              <a href="#/plot-studio">绘图工作台</a>
              <a class="is-active" href="#/plot-gallery">图谱库</a>
              <a href="#/plot-run/umap">开始绘图</a>
              <a href="#/providers">模型接口</a>
              <a href="#/runtime">本地运行</a>
            </nav>
            <input class="r143-search" data-r143-search value="${esc(query)}" placeholder="搜索图型、字段、R 包，例如 forestplot / UMAP / ggplot2" />
          </header>
          ${content}
        </main>
      </div>`;
  }

  function card(p) {
    return `
      <article class="r143-card">
        <figure class="r143-thumb"><img src="${esc(img(p.id, "thumb"))}" data-full-src="${esc(img(p.id, "example"))}" alt="${esc(p.title)} 示例图" loading="eager" onerror="this.onerror=null;this.src=this.dataset.fullSrc" /></figure>
        <div class="r143-card-body">
          <small>${esc(currentDiscipline().name)} · ${esc(p.label)}</small>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="r143-tags"><span>R：${esc(p.pkg.split("/")[0].trim())}</span><span>示例数据</span><span>图注模板</span></div>
          <div class="r143-card-actions"><a class="lotus" href="#/plot-gallery/${esc(p.id)}">看详情</a><a class="primary" href="#/plot-run/${esc(p.id)}">开始</a></div>
        </div>
      </article>`;
  }

  function page() {
    const d = currentDiscipline();
    const [, sub] = currentSubcat();
    const visible = items();
    const hero = visible[0] || plot("umap", "精选");
    return shell(`
      <section class="r143-hero">
        <div>
          <span class="r143-kicker">${esc(d.name)} · ${esc(sub[0])}</span>
          <h1>按学科找图，不在图名里迷路</h1>
          <p>先选学科，再选二级任务。每张卡片都放真实示例图、字段要求、R/Python 路线和开始入口。Meta 分析放在医学下面，不再当成网站顶层大类。</p>
          <div class="r143-actions">
            <a class="r143-btn primary" href="#/plot-run/${esc(hero.id)}">上传数据开始</a>
            <a class="r143-btn" href="#/plot-studio">让工作台帮我选图</a>
            <a class="r143-btn lotus" href="#/providers">配置自己的模型 API</a>
          </div>
        </div>
        <figure class="r143-feature"><img src="${esc(img(hero.id, "example"))}" alt="${esc(hero.title)} 精选示例图"></figure>
      </section>
      <section class="r143-control">
        <aside class="r143-panel">
          <h2>二级分类</h2>
          <div class="r143-subcats">${Object.entries(d.subcats).map(([id, s]) => `<button class="${id === subcat ? "is-active" : ""}" data-r143-subcat="${esc(id)}">${esc(s[0])}</button>`).join("")}</div>
        </aside>
        <div class="r143-panel">
          <h2>怎么用</h2>
          <p>看不懂图时先点详情；有数据时点开始。网页只演示 mock 流程，真实绘图在你的本地 Runtime 执行 R/Python，模型 API 只帮你检查字段、改代码和写图注。</p>
        </div>
      </section>
      <section>
        <div class="r143-grid-head"><div><h2>${esc(sub[0])} · ${visible.length} 张图</h2><p>每张卡都对应独立示例图，不共用占位图。</p></div><button class="r143-btn" data-r143-reset>显示全部</button></div>
        ${visible.length ? `<div class="r143-grid">${visible.map(card).join("")}</div>` : `<div class="r143-empty">没有匹配结果，换一个关键词试试。</div>`}
      </section>
    `);
  }

  function bind() {
    root.querySelectorAll("[data-r143-discipline]").forEach((button) => button.addEventListener("click", () => {
      discipline = button.dataset.r143Discipline;
      subcat = "";
      localStorage.setItem("medpath:r143:discipline", discipline);
      render();
    }));
    root.querySelectorAll("[data-r143-subcat]").forEach((button) => button.addEventListener("click", () => {
      subcat = button.dataset.r143Subcat;
      localStorage.setItem("medpath:r143:subcat", subcat);
      render();
    }));
    const input = root.querySelector("[data-r143-search]");
    if (input) input.addEventListener("input", (event) => {
      query = event.target.value || "";
      render();
      const next = root.querySelector("[data-r143-search]");
      if (next) {
        next.focus();
        next.setSelectionRange(next.value.length, next.value.length);
      }
    });
    const reset = root.querySelector("[data-r143-reset]");
    if (reset) reset.addEventListener("click", () => {
      query = "";
      render();
    });
  }

  function render() {
    if (route() !== "/plot-gallery") {
      document.body.classList.remove("medpath-r143-gallery");
      return;
    }
    const app = document.getElementById("app");
    if (!app) return;
    root = app;
    document.body.classList.add("medpath-r143-gallery");
    document.body.classList.remove("medpath-r133-plot", "medpath-island-page", "medpath-island-builder-page");
    app.innerHTML = page();
    app.setAttribute("data-round143-owned", VERSION);
    bind();
  }

  function boot() {
    if (route() === "/plot-gallery") {
      setTimeout(render, 80);
      setTimeout(() => { if (!document.querySelector(".r143-shell") && route() === "/plot-gallery") render(); }, 900);
      setTimeout(() => { if (!document.querySelector(".r143-shell") && route() === "/plot-gallery") render(); }, 2600);
      setTimeout(() => { if (!document.querySelector(".r143-shell") && route() === "/plot-gallery") render(); }, 5200);
    } else {
      document.body.classList.remove("medpath-r143-gallery");
    }
  }

  window.addEventListener("hashchange", boot);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

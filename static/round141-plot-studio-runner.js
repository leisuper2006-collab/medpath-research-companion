(function () {
  const VERSION = "round141";
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED_ROUTES = new Set(["/island", "/island-builder"]);

  const plots = [
    { id: "umap", title: "UMAP 单细胞图", field: "单细胞", question: "样本里有哪些细胞亚群，它们是否分开？", fields: ["UMAP_1", "UMAP_2", "cell_type", "sample"], r: "Seurat, ggplot2", py: "scanpy, matplotlib", example: "肿瘤免疫微环境分群" },
    { id: "feature_plot", title: "Feature Plot", field: "单细胞", question: "某个基因在二维嵌入图上的表达位置。", fields: ["UMAP_1", "UMAP_2", "gene_expression"], r: "Seurat, ggplot2", py: "scanpy", example: "标志基因表达定位" },
    { id: "marker_dotplot", title: "Marker DotPlot", field: "单细胞", question: "哪些标志基因支持细胞类型注释？", fields: ["gene", "cluster", "pct_exp", "avg_exp"], r: "Seurat, ggplot2", py: "scanpy", example: "细胞类型标注证据" },
    { id: "volcano", title: "火山图", field: "差异分析", question: "哪些基因同时有较大差异和统计显著性？", fields: ["gene", "log2FC", "padj"], r: "EnhancedVolcano, ggplot2", py: "bioinfokit, matplotlib", example: "差异表达基因筛选" },
    { id: "heatmap", title: "表达热图", field: "基础统计", question: "样本和基因是否形成稳定模式？", fields: ["feature", "sample", "value", "group"], r: "ComplexHeatmap, pheatmap", py: "seaborn", example: "候选基因表达模式" },
    { id: "forest_plot", title: "森林图", field: "临床与Meta", question: "各研究或亚组的效应量是否一致？", fields: ["study", "effect", "lower", "upper"], r: "meta, metafor, forestplot", py: "forestplot", example: "Meta 分析效应量汇总" },
    { id: "kaplan_meier", title: "Kaplan-Meier 曲线", field: "临床与Meta", question: "不同分组的生存结局是否不同？", fields: ["time", "status", "group"], r: "survminer, survival", py: "lifelines", example: "高低表达组生存比较" },
    { id: "roc", title: "ROC 曲线", field: "临床与Meta", question: "模型对二分类结局的区分能力如何？", fields: ["truth", "score", "model"], r: "pROC, yardstick", py: "scikit-learn", example: "诊断模型 AUC 展示" },
    { id: "enrichment_dotplot", title: "富集气泡图", field: "富集分析", question: "哪些通路显著富集，命中基因数有多少？", fields: ["term", "gene_ratio", "count", "padj"], r: "clusterProfiler, enrichplot", py: "plotnine", example: "GO/KEGG 富集结果" },
    { id: "spatial_feature_plot", title: "空间表达图", field: "空间组学", question: "基因表达在组织空间中的位置。", fields: ["x", "y", "feature_value", "region"], r: "Seurat, ggplot2", py: "squidpy", example: "空间组学区域表达" },
    { id: "sankey", title: "桑基图", field: "多组学与网络", question: "样本、任务或类别如何流向下一阶段？", fields: ["source", "target", "value"], r: "ggalluvial", py: "plotly", example: "队列筛选和流程流向" },
    { id: "network_graph", title: "网络关系图", field: "多组学与网络", question: "基因、概念或工具之间如何连接？", fields: ["source", "target", "weight", "type"], r: "igraph, ggraph", py: "networkx", example: "通路或工具依赖网络" },
    { id: "attention_heatmap", title: "注意力热图", field: "计算病理", question: "模型主要关注病理图像的哪些区域？", fields: ["x", "y", "attention", "tile_id"], r: "ggplot2", py: "PyTorch, matplotlib", example: "计算病理模型解释" },
    { id: "confusion_matrix", title: "混淆矩阵", field: "机器学习", question: "分类模型错在了哪些类别？", fields: ["truth", "prediction"], r: "caret, yardstick", py: "scikit-learn", example: "病理图像分类质控" },
    { id: "prisma_flow", title: "PRISMA 流程图", field: "综述与Meta", question: "综述检索、筛选、排除和纳入流程是否清楚？", fields: ["stage", "count", "reason"], r: "DiagrammeR", py: "graphviz", example: "系统综述纳排流程" },
    { id: "gantt", title: "甘特图", field: "项目管理", question: "课题任务和里程碑如何排期？", fields: ["task", "start", "end", "owner"], r: "ggplot2", py: "plotly", example: "项目进度计划" },
    { id: "workflow_diagram", title: "工作流图", field: "流程图", question: "从输入到输出有哪些步骤和复核点？", fields: ["step", "owner", "output", "risk"], r: "DiagrammeR", py: "graphviz", example: "绘图和审查流程" },
    { id: "boxplot", title: "箱线图", field: "基础统计", question: "不同组的连续变量分布是否不同？", fields: ["group", "value"], r: "ggplot2, ggpubr", py: "seaborn", example: "实验组间表达差异" },
    { id: "violin", title: "小提琴图", field: "基础统计", question: "组内分布形态是否有偏态或多峰？", fields: ["group", "value"], r: "ggplot2, ggdist", py: "seaborn", example: "表达量分布比较" },
    { id: "scatter", title: "散点图", field: "基础统计", question: "两个变量之间是否相关？", fields: ["x_value", "y_value", "group"], r: "ggplot2, ggpubr", py: "seaborn", example: "基因表达相关性" },
    { id: "cell_type_proportion", title: "细胞比例图", field: "单细胞", question: "不同样本或分组的细胞组成是否变化？", fields: ["sample", "cell_type", "proportion"], r: "ggplot2", py: "pandas, matplotlib", example: "肿瘤与健康样本组成比较" },
    { id: "pseudotime", title: "拟时序图", field: "单细胞", question: "细胞状态是否沿轨迹逐渐变化？", fields: ["pseudotime", "state", "cell_type"], r: "monocle3, ggplot2", py: "scvelo", example: "分化轨迹解释" },
    { id: "upset_plot", title: "UpSet 交集图", field: "多组学与网络", question: "多个集合之间有哪些交集？", fields: ["set", "item", "present"], r: "UpSetR, ggupset", py: "upsetplot", example: "多队列候选基因交集" },
    { id: "budget_sankey", title: "经费桑基图", field: "申报与管理", question: "经费如何流向任务和成果？", fields: ["source", "target", "value"], r: "ggalluvial", py: "plotly", example: "课题经费映射" }
  ];

  const steps = ["上传数据", "选择图型", "检查字段", "选择代码", "运行绘图", "生成图注", "导出结果"];

  const state = {
    plotId: readStore("plot", "umap"),
    sampleLoaded: readStore("sample", "0") === "1",
    checked: readStore("checked", "0") === "1",
    codeMode: readStore("code", "R"),
    ran: readStore("ran", "0") === "1",
    caption: readStore("caption", "0") === "1",
    exported: readStore("exported", "0") === "1"
  };

  let root = null;
  let toastTimer = null;

  function readStore(key, fallback) {
    try {
      return localStorage.getItem(`medpath:r141:${key}`) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(`medpath:r141:${key}`, String(value));
    } catch (_) {
      // Static preview can run without storage.
    }
  }

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function isProtected(path = route()) {
    return PROTECTED_ROUTES.has(path) || path.startsWith("/island/");
  }

  function shouldOwn(path = route()) {
    return path === "/plot-studio" && !isProtected(path);
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function currentPlot() {
    return plots.find((item) => item.id === state.plotId) || plots[0];
  }

  function plotImg(id, kind = "example") {
    return `${PLOT_BASE}/${id}/${kind}.png`;
  }

  function csvFor(plot) {
    if (plot.id === "forest_plot") return "study,effect,lower,upper\nStudy A,0.82,0.61,1.08\nStudy B,1.24,0.96,1.62\nStudy C,0.73,0.51,1.04";
    if (plot.id === "umap") return "UMAP_1,UMAP_2,cell_type,sample\n-3.1,1.2,T cell,A\n0.4,-1.8,Macrophage,B\n2.2,0.7,B cell,A";
    if (plot.id === "volcano") return "gene,log2FC,padj\nIL7R,1.8,0.004\nMS4A1,-1.2,0.018\nLYZ,0.4,0.22";
    return `${plot.fields.join(",")}\n${plot.fields.map((field, index) => (index % 2 === 0 ? field.replace(/[^A-Za-z0-9_]/g, "_") || "A" : (index + 1) * 1.25)).join(",")}`;
  }

  function rTemplate(plot) {
    if (plot.id === "forest_plot") {
      return `# R first: forest plot\nlibrary(meta)\nlibrary(readr)\ndat <- read_csv("example_data.csv")\nmeta_obj <- metagen(TE = effect, lower = lower, upper = upper, studlab = study, data = dat)\nforest(meta_obj, comb.fixed = FALSE, comb.random = TRUE)\n# 提醒：正式论文请由导师复核效应量、模型和异质性解释。`;
    }
    if (plot.id === "volcano") {
      return `# R first: volcano plot\nlibrary(ggplot2)\nlibrary(readr)\ndat <- read_csv("example_data.csv")\ndat$significant <- dat$padj < 0.05 & abs(dat$log2FC) > 1\nggplot(dat, aes(log2FC, -log10(padj), color = significant)) +\n  geom_point(size = 2.4, alpha = .82) +\n  scale_color_manual(values = c("#9ca3af", "#0f9488")) +\n  theme_minimal(base_size = 12) +\n  labs(x = "log2 fold change", y = "-log10 adjusted P", color = "显著")`;
    }
    if (plot.id === "umap" || plot.id === "feature_plot") {
      return `# R first: ${plot.title}\nlibrary(ggplot2)\nlibrary(readr)\ndat <- read_csv("example_data.csv")\nggplot(dat, aes(UMAP_1, UMAP_2, color = ${plot.id === "feature_plot" ? "gene_expression" : "cell_type"})) +\n  geom_point(size = 1.8, alpha = .82) +\n  theme_classic(base_size = 12) +\n  labs(title = "${plot.title}", subtitle = "示例数据；正式结果需保留来源和参数")`;
    }
    return `# R first: ${plot.title}\nlibrary(ggplot2)\nlibrary(readr)\ndat <- read_csv("example_data.csv")\n# 必需字段：${plot.fields.join(", ")}\n# 下面是可改写的起步模板，请按你的字段名替换 aes()。\nggplot(dat) +\n  geom_point(aes(x = ${plot.fields[0]}, y = ${plot.fields[1] || plot.fields[0]}), color = "#0f9488", alpha = .8) +\n  theme_minimal(base_size = 12) +\n  labs(title = "${plot.title}", caption = "合成或公开示例数据；正式图需导师复核")`;
  }

  function pythonTemplate(plot) {
    return `# Python template: ${plot.title}\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# data = pd.read_csv("example_data.csv")\n# required fields: ${plot.fields.join(", ")}\n# Python 版用于快速检查；本项目默认优先推荐 R/ggplot2 或领域 R 包。\nfig, ax = plt.subplots(figsize=(6, 4))\nax.set_title("${plot.title}")\nax.text(0.05, 0.55, "replace with your plotting code", transform=ax.transAxes)\nplt.tight_layout()\nplt.savefig("figure.png", dpi=300)`;
  }

  function stepState(index) {
    const done = [
      state.sampleLoaded,
      Boolean(state.plotId),
      state.checked,
      Boolean(state.codeMode),
      state.ran,
      state.caption,
      state.exported
    ][index];
    const activeIndex = [state.sampleLoaded, Boolean(state.plotId), state.checked, Boolean(state.codeMode), state.ran, state.caption, state.exported].findIndex((item) => !item);
    return { done, active: activeIndex === index || (activeIndex === -1 && index === steps.length - 1) };
  }

  function saveState() {
    writeStore("plot", state.plotId);
    writeStore("sample", state.sampleLoaded ? "1" : "0");
    writeStore("checked", state.checked ? "1" : "0");
    writeStore("code", state.codeMode);
    writeStore("ran", state.ran ? "1" : "0");
    writeStore("caption", state.caption ? "1" : "0");
    writeStore("exported", state.exported ? "1" : "0");
  }

  function toast(message) {
    if (!message) return;
    const old = document.querySelector(".r141-toast");
    if (old) old.remove();
    const node = document.createElement("div");
    node.className = "r141-toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.remove(), 2500);
  }

  function sideNav() {
    const links = [
      ["概览", "/home", "总览"],
      ["绘图工作台", "/plot-studio", "当前"],
      ["图谱库", "/plot-gallery", "示例"],
      ["方法运行器", "/method-runner", "流程"],
      ["开源导航", "/open-source", "工具"],
      ["社区", "/community", "共享"],
      ["科研小岛", "/island", "游戏"]
    ];
    return links.map(([label, href, note]) => `<a class="${href === "/plot-studio" ? "is-active" : ""}" href="#${href}"><span>${label}</span><small>${note}</small></a>`).join("");
  }

  function topbar() {
    return `
      <div class="r141-tabs" aria-label="顶部导航">
        <a href="#/home">首页</a>
        <a class="is-active" href="#/plot-studio">科研绘图</a>
        <a href="#/plot-gallery">图谱库</a>
        <a href="#/providers">模型接口</a>
        <a href="#/runtime">本地运行</a>
      </div>
      <input class="r141-search" aria-label="搜索图型" placeholder="搜索图型、字段、R 包，例如 forestplot / UMAP / pROC" />
      <a class="r141-btn lotus" href="#/plot-gallery">看全部示例</a>
    `;
  }

  function plotButtons() {
    return plots.slice(0, 24).map((plot) => `
      <button class="r141-plot-option ${plot.id === state.plotId ? "is-active" : ""}" type="button" data-r141-plot="${esc(plot.id)}" aria-label="选择${esc(plot.title)}">
        <img src="${esc(plotImg(plot.id, "thumb"))}" alt="${esc(plot.title)}缩略图" loading="lazy" onerror="this.src='${esc(plotImg(plot.id, "example"))}'" />
        <span>${esc(plot.title)}</span>
      </button>
    `).join("");
  }

  function fieldsHtml(plot) {
    return plot.fields.map((field) => `<span class="r141-pill">${esc(field)}</span>`).join("");
  }

  function statusHtml(plot) {
    const base = [
      state.sampleLoaded ? "已载入示例 CSV，可替换为你的数据。" : "还没有载入数据，先用示例 CSV 体验流程。",
      state.checked ? `字段检查通过：${plot.fields.join("、")}` : "字段尚未检查，系统会先看列名是否够用。",
      "静态网页只做 mock；真实绘图请在本地 Runtime 或你的服务器执行 R/Python。"
    ];
    return base.map((item, index) => `<li class="${index === 1 && !state.checked ? "warn" : "ok"}">${esc(item)}</li>`).join("");
  }

  function stepperHtml() {
    return `
      <section class="r141-stepper" aria-label="绘图流程">
        <h3>七步生成一张图</h3>
        <div class="r141-steps">
          ${steps.map((label, index) => {
            const stateInfo = stepState(index);
            return `<div class="r141-step ${stateInfo.done ? "is-done" : ""} ${stateInfo.active ? "is-active" : ""}" data-r141-step="${index + 1}"><strong>${index + 1}</strong><span>${esc(label)}</span></div>`;
          }).join("")}
        </div>
        <p>这页面向科研新手：先判断图回答什么问题，再看字段、代码、图注和导师复核点。</p>
      </section>
    `;
  }

  function assistantHtml(plot) {
    return `
      <aside class="r141-right">
        <section class="r141-assistant-card">
          <h3>页面小助手</h3>
          <p>不知道选什么图时，先写你的任务。没有配置模型 API 时，这里会用本页规则给建议。</p>
          <input class="r141-mini-input" data-r141-assistant-input placeholder="例：我做 meta 分析，要展示各研究效应量" />
          <div class="r141-actions">
            <button class="r141-btn primary" type="button" data-r141-assistant>推荐图型</button>
            <a class="r141-btn" href="#/providers">配置 BYOK</a>
          </div>
        </section>
        <section class="r141-assistant-card">
          <h3>适用与不适用</h3>
          <ul class="r141-checklist">
            <li>适合：${esc(plot.example)}，字段齐全后可以生成图、代码和图注。</li>
            <li>不适合：把图形结果直接当作医学结论，或上传含隐私的真实患者数据到外部服务。</li>
            <li>建议：先用示例跑通，再替换字段，最后让导师或教师复核图注。</li>
          </ul>
        </section>
        <section class="r141-assistant-card">
          <h3>BYOK / 本地运行</h3>
          <p>模型只帮你解释字段、改代码和写图注；真正绘图由本地 R/Python 运行，API Key 不写入网页或仓库。</p>
          <div class="r141-actions">
            <a class="r141-btn" href="#/runtime">打开 Runtime</a>
            <a class="r141-btn" href="#/providers">查看 Providers</a>
          </div>
        </section>
      </aside>
    `;
  }

  function renderHtml() {
    const plot = currentPlot();
    return `
      <div class="r141-shell" data-round141-owned="true">
        <aside class="r141-side">
          <div class="r141-brand">
            <div class="r141-logo">图</div>
            <div><strong>MedPath Plot Studio</strong><span>R 优先 · 示例可复现</span></div>
          </div>
          <nav>${sideNav()}</nav>
        </aside>
        <main class="r141-main">
          <header class="r141-top">${topbar()}</header>
          <div class="r141-page">
            <section class="r141-hero">
              <div>
                <span class="r141-kicker">科研绘图 · 真实示例 · 本地运行</span>
                <h1 class="r141-title">把“我想画图”拆成能跑的步骤。</h1>
                <p class="r141-lead">先选图，再检查字段。页面会给你示例数据、R/Python 模板、图注、Methods 写法和导师复核点；静态站点只演示 mock 流程，真实绘图在本地 Runtime 执行。</p>
                <div class="r141-actions">
                  <button class="r141-btn primary" type="button" data-r141-demo>使用示例数据</button>
                  <button class="r141-btn" type="button" data-r141-check>检查字段</button>
                  <button class="r141-btn lotus" type="button" data-r141-run>mock 运行绘图</button>
                </div>
              </div>
              <figure class="r141-preview-card">
                <img data-r141-preview-img src="${esc(plotImg(plot.id))}" alt="${esc(plot.title)}示例图" />
                <figcaption data-r141-preview-caption>${esc(plot.title)}：${esc(plot.question)}</figcaption>
              </figure>
            </section>
            <section class="r141-workbench">
              ${stepperHtml()}
              <div class="r141-center">
                <section class="r141-panel">
                  <h2>选择图型</h2>
                  <p>先给新手看最常用的 24 种。每张缩略图都来自本项目用示例数据生成的图片，不再共用一张占位图。</p>
                  <div class="r141-plot-strip">${plotButtons()}</div>
                </section>
                <section class="r141-stage-grid">
                  <div class="r141-panel">
                    <h2 data-r141-panel-title>${esc(plot.title)}</h2>
                    <p data-r141-panel-question>${esc(plot.question)}</p>
                    <div class="r141-field-list" data-r141-fields>${fieldsHtml(plot)}</div>
                    <label class="r141-file">
                      <strong>示例 CSV / 可替换为你的数据</strong>
                      <textarea class="r141-textarea" data-r141-csv spellcheck="false">${state.sampleLoaded ? esc(csvFor(plot)) : ""}</textarea>
                    </label>
                    <ul class="r141-status" data-r141-field-status>${statusHtml(plot)}</ul>
                    <div class="r141-actions">
                      <button class="r141-btn primary" type="button" data-r141-demo>使用示例数据</button>
                      <button class="r141-btn" type="button" data-r141-check>检查字段</button>
                    </div>
                  </div>
                  <div class="r141-panel">
                    <figure class="r141-result-figure">
                      <img data-r141-result-img src="${esc(plotImg(plot.id))}" alt="${esc(plot.title)}大图" />
                      <figcaption data-r141-result-caption>${state.ran ? "已完成 mock 运行：输出图、代码、source data 和图注草案。" : "预览图来自示例数据；点击 mock 运行后生成结果状态。"}</figcaption>
                    </figure>
                    <div class="r141-actions">
                      <a class="r141-btn" data-r141-open-r href="${esc(`${PLOT_BASE}/${plot.id}/plot.R`)}" target="_blank" rel="noreferrer">查看 R 脚本</a>
                      <a class="r141-btn" data-r141-open-csv href="${esc(`${PLOT_BASE}/${plot.id}/example_data.csv`)}" target="_blank" rel="noreferrer">下载示例数据</a>
                    </div>
                  </div>
                </section>
                <section class="r141-panel">
                  <h2>代码模板</h2>
                  <div class="r141-code-tabs">
                    <button class="r141-btn ${state.codeMode === "R" ? "primary" : ""}" type="button" data-r141-code="R">R 优先</button>
                    <button class="r141-btn ${state.codeMode === "Python" ? "primary" : ""}" type="button" data-r141-code="Python">Python 备选</button>
                    <button class="r141-btn lotus" type="button" data-r141-caption>生成图注</button>
                    <button class="r141-btn" type="button" data-r141-export>导出结果</button>
                  </div>
                  <pre class="r141-code" data-r141-code-output>${esc(state.codeMode === "R" ? rTemplate(plot) : pythonTemplate(plot))}</pre>
                  <p data-r141-caption-status>${state.caption ? "图注草案已生成：说明数据来源、方法、字段和待复核边界。" : "还没有生成图注。运行后可生成 caption、methods 和复核提示。"}</p>
                </section>
              </div>
              ${assistantHtml(plot)}
            </section>
          </div>
        </main>
      </div>
    `;
  }

  function syncUi(message) {
    const plot = currentPlot();
    saveState();
    if (!root) return;
    root.querySelectorAll(".r141-plot-option").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.r141Plot === plot.id);
    });
    root.querySelectorAll("[data-r141-preview-img], [data-r141-result-img]").forEach((img) => {
      img.src = plotImg(plot.id);
      img.alt = `${plot.title}示例图`;
    });
    setText("[data-r141-preview-caption]", `${plot.title}：${plot.question}`);
    setText("[data-r141-panel-title]", plot.title);
    setText("[data-r141-panel-question]", plot.question);
    setHtml("[data-r141-fields]", fieldsHtml(plot));
    const csv = root.querySelector("[data-r141-csv]");
    if (csv) csv.value = state.sampleLoaded ? csvFor(plot) : "";
    setHtml("[data-r141-field-status]", statusHtml(plot));
    setText("[data-r141-result-caption]", state.ran ? "已完成 mock 运行：输出图、代码、source data 和图注草案。" : "预览图来自示例数据；点击 mock 运行后生成结果状态。");
    setText("[data-r141-caption-status]", state.caption ? "图注草案已生成：说明数据来源、方法、字段和待复核边界。" : "还没有生成图注。运行后可生成 caption、methods 和复核提示。");
    const code = root.querySelector("[data-r141-code-output]");
    if (code) code.textContent = state.codeMode === "R" ? rTemplate(plot) : pythonTemplate(plot);
    root.querySelectorAll("[data-r141-code]").forEach((button) => {
      button.classList.toggle("primary", button.dataset.r141Code === state.codeMode);
    });
    const rLink = root.querySelector("[data-r141-open-r]");
    if (rLink) rLink.href = `${PLOT_BASE}/${plot.id}/plot.R`;
    const csvLink = root.querySelector("[data-r141-open-csv]");
    if (csvLink) csvLink.href = `${PLOT_BASE}/${plot.id}/example_data.csv`;
    root.querySelectorAll("[data-r141-step]").forEach((node, index) => {
      const info = stepState(index);
      node.classList.toggle("is-done", info.done);
      node.classList.toggle("is-active", info.active);
    });
    toast(message);
  }

  function setText(selector, text) {
    const node = root.querySelector(selector);
    if (node) node.textContent = text;
  }

  function setHtml(selector, html) {
    const node = root.querySelector(selector);
    if (node) node.innerHTML = html;
  }

  function handleClick(event) {
    const target = event.target.closest("[data-r141-plot], [data-r141-demo], [data-r141-check], [data-r141-run], [data-r141-code], [data-r141-caption], [data-r141-export], [data-r141-assistant]");
    if (!target || !root || !root.contains(target)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (target.dataset.r141Plot) {
      state.plotId = target.dataset.r141Plot;
      state.checked = false;
      state.ran = false;
      state.caption = false;
      state.exported = false;
      syncUi(`已切换到：${currentPlot().title}`);
      return;
    }
    if (target.hasAttribute("data-r141-demo")) {
      state.sampleLoaded = true;
      state.checked = false;
      state.ran = false;
      state.caption = false;
      state.exported = false;
      syncUi("示例 CSV 已载入，可以检查字段。");
      return;
    }
    if (target.hasAttribute("data-r141-check")) {
      state.sampleLoaded = true;
      state.checked = true;
      syncUi("字段检查通过：本地 mock 只检查列名，正式数据请继续人工复核。");
      return;
    }
    if (target.hasAttribute("data-r141-run")) {
      state.sampleLoaded = true;
      state.checked = true;
      state.ran = true;
      syncUi("已完成 mock 运行；真实绘图请在本地 Runtime 执行 R/Python。");
      return;
    }
    if (target.dataset.r141Code) {
      state.codeMode = target.dataset.r141Code;
      syncUi(`已切换到 ${state.codeMode} 模板。`);
      return;
    }
    if (target.hasAttribute("data-r141-caption")) {
      state.caption = true;
      syncUi("图注草案已生成，需导师或教师复核。");
      return;
    }
    if (target.hasAttribute("data-r141-export")) {
      state.exported = true;
      syncUi("静态站点已生成导出清单；正式导出由本地 Runtime 打包 ZIP。");
      return;
    }
    if (target.hasAttribute("data-r141-assistant")) {
      const value = root.querySelector("[data-r141-assistant-input]")?.value || "";
      const text = value.includes("meta") || value.includes("森林") ? "建议先看森林图、PRISMA 流程图和漏斗图；本页已准备森林图示例。" : "建议先从 UMAP、火山图、热图或箱线图开始；按字段选择最合适的图。";
      toast(text);
    }
  }

  function render() {
    if (!shouldOwn()) return;
    root = document.getElementById("app");
    if (!root) return;
    document.body.classList.add("medpath-r141-plot-studio");
    document.body.classList.remove("medpath-island-page", "medpath-island-builder-page");
    root.innerHTML = renderHtml();
    root.dataset.round141Owned = "true";
    root.removeEventListener("click", handleClick, true);
    root.addEventListener("click", handleClick, true);
    syncUi();
  }

  function releaseIfNeeded() {
    if (shouldOwn()) return;
    document.body.classList.remove("medpath-r141-plot-studio");
    if (root) {
      root.removeEventListener("click", handleClick, true);
      root = null;
    }
  }

  function boot() {
    if (shouldOwn()) {
      window.setTimeout(render, 60);
      window.setTimeout(() => {
        if (shouldOwn() && !document.querySelector(".r141-shell")) render();
      }, 450);
      window.setTimeout(() => {
        if (shouldOwn() && !document.querySelector(".r141-shell")) render();
      }, 1200);
    } else {
      releaseIfNeeded();
    }
  }

  window.addEventListener("hashchange", boot);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

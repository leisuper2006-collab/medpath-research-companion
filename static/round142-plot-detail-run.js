(function () {
  const VERSION = "round142";
  window.MEDPATH_ROUND142_PLOT_FLOW = true;
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED = new Set(["/island", "/island-builder"]);

  const meta = {
    umap: ["UMAP 单细胞图", "单细胞", "从高维表达矩阵中看细胞亚群是否分开。", ["UMAP_1", "UMAP_2", "cell_type", "sample"], "Seurat / ggplot2", "scanpy / matplotlib"],
    feature_plot: ["Feature Plot", "单细胞", "看某个基因在细胞嵌入图中的表达位置。", ["UMAP_1", "UMAP_2", "gene_expression"], "Seurat / ggplot2", "scanpy"],
    marker_dotplot: ["Marker DotPlot", "单细胞", "用点大小和颜色判断 marker 是否支持细胞注释。", ["gene", "cluster", "pct_exp", "avg_exp"], "Seurat / ggplot2", "scanpy"],
    volcano: ["火山图", "差异分析", "同时看差异倍数和显著性，筛出候选基因。", ["gene", "log2FC", "padj"], "EnhancedVolcano / ggplot2", "bioinfokit / matplotlib"],
    heatmap: ["表达热图", "基础统计", "看样本和特征是否形成分组模式。", ["feature", "sample", "value", "group"], "ComplexHeatmap / pheatmap", "seaborn"],
    forest_plot: ["森林图", "Meta 分析", "汇总研究或亚组效应量，观察一致性和置信区间。", ["study", "effect", "lower", "upper"], "meta / metafor / forestplot", "forestplot"],
    kaplan_meier: ["Kaplan-Meier 曲线", "临床研究", "比较不同分组的生存结局。", ["time", "status", "group"], "survival / survminer", "lifelines"],
    roc: ["ROC 曲线", "预测模型", "评价二分类模型区分能力。", ["truth", "score", "model"], "pROC / yardstick", "scikit-learn"],
    enrichment_dotplot: ["富集气泡图", "富集分析", "展示显著通路、命中数量和富集比例。", ["term", "gene_ratio", "count", "padj"], "clusterProfiler / enrichplot", "plotnine"],
    spatial_feature_plot: ["空间表达图", "空间组学", "看基因或指标在组织空间里的位置。", ["x", "y", "feature_value", "region"], "Seurat / ggplot2", "squidpy"],
    sankey: ["桑基图", "流程与构成", "展示样本、类别或经费从一端流向另一端。", ["source", "target", "value"], "ggalluvial", "plotly"],
    network_graph: ["网络关系图", "网络分析", "展示基因、通路或工具之间的连接。", ["source", "target", "weight", "type"], "igraph / ggraph", "networkx"],
    attention_heatmap: ["注意力热图", "计算病理", "解释模型关注图像的区域。", ["x", "y", "attention", "tile_id"], "ggplot2", "PyTorch / matplotlib"],
    confusion_matrix: ["混淆矩阵", "机器学习", "看模型在哪些类别上容易出错。", ["truth", "prediction"], "caret / yardstick", "scikit-learn"],
    prisma_flow: ["PRISMA 流程图", "系统综述", "清楚说明检索、筛选、排除和纳入。", ["stage", "count", "reason"], "DiagrammeR", "graphviz"],
    gantt: ["甘特图", "项目管理", "安排课题任务、时间和负责人。", ["task", "start", "end", "owner"], "ggplot2", "plotly"],
    workflow_diagram: ["工作流图", "方法流程", "把输入、处理、复核和输出步骤讲清楚。", ["step", "owner", "output", "risk"], "DiagrammeR", "graphviz"],
    boxplot: ["箱线图", "基础统计", "比较不同组连续变量的分布。", ["group", "value"], "ggplot2 / ggpubr", "seaborn"],
    violin: ["小提琴图", "基础统计", "看组内分布形态、偏态和多峰。", ["group", "value"], "ggplot2 / ggdist", "seaborn"],
    scatter: ["散点图", "基础统计", "观察两个变量之间的关系。", ["x_value", "y_value", "group"], "ggplot2 / ggpubr", "seaborn"],
    cell_type_proportion: ["细胞比例图", "单细胞", "比较样本或分组的细胞组成。", ["sample", "cell_type", "proportion"], "ggplot2", "pandas / matplotlib"],
    pseudotime: ["拟时序图", "单细胞", "展示细胞状态沿轨迹变化。", ["pseudotime", "state", "cell_type"], "monocle3 / ggplot2", "scvelo"],
    upset_plot: ["UpSet 交集图", "集合分析", "比较多个基因集、队列或工具输出的交集。", ["set", "item", "present"], "UpSetR / ggupset", "upsetplot"],
    budget_sankey: ["经费桑基图", "申报管理", "展示经费到任务和成果的映射。", ["source", "target", "value"], "ggalluvial", "plotly"]
  };

  const officialSkills = [
    ["plot-studio-runner", "官方绘图 Skill", "按图型检查字段，生成 R/Python 模板、图注和 Methods。"],
    ["data-audit-helper", "字段审查 Skill", "先查列名、缺失值、分组变量和隐私边界。"],
    ["citation-check-assistant", "引用核验 Skill", "提醒图注中哪些来源、数据和方法需要补证据。"]
  ];

  const favoriteSkills = [
    ["community-forest-review", "社区收藏：森林图复核", "来自社区榜单的 mock Skill，适合 Meta 分析新手。"],
    ["single-cell-figure-polish", "社区收藏：单细胞图润色", "检查配色、标签、图注和 marker 解释。"]
  ];

  const runState = { sample: false, checked: false, skill: "plot-studio-runner", ran: false, exported: false };
  let root = null;
  let toastTimer = null;

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function isProtected(path = route()) {
    return PROTECTED.has(path) || path.startsWith("/island/");
  }

  function routeInfo(path = route()) {
    if (isProtected(path)) return null;
    const detail = path.match(/^\/plot-gallery\/([^/]+)$/);
    if (detail) return { mode: "detail", id: decodeURIComponent(detail[1]) };
    const run = path.match(/^\/plot-run\/([^/]+)$/);
    if (run) return { mode: "run", id: decodeURIComponent(run[1]) };
    return null;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function titleFromId(id) {
    return id.split("_").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  }

  function plot(id) {
    const row = meta[id] || [titleFromId(id), "科研图表", "用示例数据理解图形用途，再替换为自己的数据。", ["x", "y", "group"], "ggplot2", "matplotlib"];
    return { id, title: row[0], field: row[1], question: row[2], fields: row[3], r: row[4], py: row[5] };
  }

  function img(id) {
    return `${PLOT_BASE}/${id}/example.png`;
  }

  function thumb(id) {
    return `${PLOT_BASE}/${id}/thumb.png`;
  }

  function pathFor(id, file) {
    return `${PLOT_BASE}/${id}/${file}`;
  }

  function sampleRows(p) {
    const head = p.fields;
    const rows = [
      head.map((f, i) => i === 0 ? f.replace(/[^A-Za-z0-9_]/g, "_") || "A" : (i + 1) * 1.2),
      head.map((f, i) => i === 0 ? `${f}_2`.replace(/[^A-Za-z0-9_]/g, "_") : (i + 2) * 1.4),
      head.map((f, i) => i === 0 ? `${f}_3`.replace(/[^A-Za-z0-9_]/g, "_") : (i + 3) * 1.1)
    ];
    return { head, rows };
  }

  function sideNav(active) {
    const links = [
      ["/home", "概览", "起点"],
      ["/plot-studio", "绘图工作台", "选图"],
      ["/plot-gallery", "图谱库", "全部"],
      ["/method-runner", "方法路线", "流程"],
      ["/open-source", "开源工具", "仓库"],
      ["/community", "社区", "共享"],
      ["/island", "科研小岛", "游戏"]
    ];
    return links.map(([href, label, note]) => `<a class="${active === href || (href === "/plot-gallery" && active.startsWith("/plot")) ? "is-active" : ""}" href="#${href}"><span>${label}</span><small>${note}</small></a>`).join("");
  }

  function topbar(active) {
    return `
      <nav class="r142-tabs">
        <a href="#/plot-studio">绘图工作台</a>
        <a class="${active.startsWith("/plot-gallery") ? "is-active" : ""}" href="#/plot-gallery">图谱库</a>
        <a class="${active.startsWith("/plot-run") ? "is-active" : ""}" href="#${active}">开始绘图</a>
        <a href="#/providers">模型接口</a>
        <a href="#/runtime">本地运行</a>
      </nav>
      <input class="r142-search" placeholder="搜索图型、字段、R 包，例如 forestplot / UMAP / pROC" aria-label="搜索" />
      <a class="r142-btn lotus" href="#/plot-studio">回工作台</a>
    `;
  }

  function shell(active, content) {
    return `
      <div class="r142-shell" data-round142-owned="true">
        <aside class="r142-side">
          <div class="r142-brand"><div class="r142-logo">图</div><div><strong>Plot Detail</strong><span>真实示例 · R 优先</span></div></div>
          <nav class="r142-nav">${sideNav(active)}</nav>
        </aside>
        <main class="r142-main">
          <header class="r142-top">${topbar(active)}</header>
          <div class="r142-page">${content}</div>
        </main>
      </div>`;
  }

  function detailPage(id) {
    const p = plot(id);
    const data = sampleRows(p);
    const rows = data.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("");
    const fields = p.fields.map((f) => `<span class="r142-pill">${esc(f)}</span>`).join("");
    return shell(`/plot-gallery/${id}`, `
      <section class="r142-hero">
        <div>
          <span class="r142-kicker">${esc(p.field)} · 图型详情</span>
          <h1>${esc(p.title)}</h1>
          <p class="r142-lead">${esc(p.question)} 这一页给科研新手看的不是“漂亮图”，而是它回答什么问题、需要哪些字段、怎么用 R 跑、图注怎样写、哪些地方要导师复核。</p>
          <div class="r142-actions">
            <a class="r142-btn primary" data-testid="r142-start-${esc(id)}" href="#/plot-run/${esc(id)}">开始用这个图</a>
            <a class="r142-btn" href="${esc(pathFor(id, "plot.R"))}" target="_blank" rel="noreferrer">看 R 代码</a>
            <a class="r142-btn lotus" href="${esc(pathFor(id, "example_data.csv"))}" target="_blank" rel="noreferrer">下载示例数据</a>
          </div>
        </div>
        <figure class="r142-figure">
          <img src="${esc(img(id))}" alt="${esc(p.title)}示例图" onerror="this.src='${esc(thumb(id))}'" />
          <figcaption><span>示例图由本项目示例数据生成</span><a href="${esc(pathFor(id, "example.png"))}" target="_blank" rel="noreferrer">打开大图</a></figcaption>
        </figure>
      </section>

      <section class="r142-grid">
        <div class="r142-section">
          <article class="r142-card">
            <h2 class="r142-section-title">什么时候用它</h2>
            <div class="r142-info-grid">
              <div class="r142-mini"><strong>回答的问题</strong><p>${esc(p.question)}</p></div>
              <div class="r142-mini"><strong>适合输入</strong><p>${esc(p.fields.join("、"))}</p></div>
              <div class="r142-mini"><strong>不适合</strong><p>字段含义不清、样本来源未核验、或想把图直接当作医学结论。</p></div>
            </div>
          </article>
          <article class="r142-card">
            <h2 class="r142-section-title">必需字段</h2>
            <div class="r142-field-list">${fields}</div>
            <p>如果你上传的数据没有这些列，系统会先提示补列或改列名。模型 API 只帮你解释字段和修代码，不替你编造数据。</p>
          </article>
          <article class="r142-card">
            <h2 class="r142-section-title">示例数据长什么样</h2>
            <div class="r142-data-table"><table><thead><tr>${data.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>
          </article>
          <article class="r142-card">
            <h2 class="r142-section-title">代码与写法</h2>
            <div class="r142-info-grid">
              <div class="r142-mini"><strong>推荐 R 包</strong><p>${esc(p.r)}</p></div>
              <div class="r142-mini"><strong>Python 备选</strong><p>${esc(p.py)}</p></div>
              <div class="r142-mini"><strong>Methods 重点</strong><p>写清数据来源、字段处理、参数、统计假设和可复现脚本。</p></div>
            </div>
            <div class="r142-actions">
              <a class="r142-btn" href="${esc(pathFor(id, "caption.md"))}" target="_blank" rel="noreferrer">图注模板</a>
              <a class="r142-btn" href="${esc(pathFor(id, "methods.md"))}" target="_blank" rel="noreferrer">Methods 模板</a>
              <a class="r142-btn" href="${esc(pathFor(id, "api_prompt.md"))}" target="_blank" rel="noreferrer">API Prompt</a>
            </div>
          </article>
        </div>
        <aside class="r142-side-panel">
          <article class="r142-panel">
            <h3>新手检查单</h3>
            <ul class="r142-checklist">
              <li>先确认每一列代表什么，不确定就不要直接画正式图。</li>
              <li>示例数据只用于学习，不是真实研究结果。</li>
              <li>正式结果必须保留 source data、代码和图注。</li>
              <li>医学相关图表仅用于教学与科研训练，不替代临床诊断。</li>
            </ul>
          </article>
          <article class="r142-panel">
            <h3>下一步</h3>
            <p>进入开始页后，可以选择官方 Skill 或社区收藏 Skill，先 mock 检查字段，再导出本地运行包。</p>
            <a class="r142-btn primary" href="#/plot-run/${esc(id)}">进入开始页</a>
          </article>
        </aside>
      </section>
    `);
  }

  function statusHtml() {
    return [
      runState.sample ? ["ok", "示例数据已载入，可以替换为你的 CSV。"] : ["warn", "尚未载入数据；先用示例数据跑通流程。"],
      runState.checked ? ["ok", "字段检查通过：列名与图型要求匹配。"] : ["warn", "字段还没检查；不要直接运行正式图。"],
      runState.ran ? ["ok", `已用 ${runState.skill} 生成 mock 运行包。`] : ["warn", "尚未运行；当前页面不会调用真实 API。"],
      runState.exported ? ["ok", "已生成导出清单：图、数据、代码、图注、审查表。"] : ["warn", "尚未导出；正式 ZIP 由本地 Runtime 生成。"]
    ].map(([cls, text]) => `<li class="${cls}">${esc(text)}</li>`).join("");
  }

  function runSteps() {
    const done = [runState.sample, runState.checked, Boolean(runState.skill), runState.ran, runState.exported];
    const labels = ["载入数据", "检查字段", "选择 Skill", "生成运行包", "导出复核"];
    const active = done.findIndex((x) => !x);
    return labels.map((label, i) => `<div class="r142-step ${done[i] ? "is-done" : ""} ${(active === i || (active < 0 && i === labels.length - 1)) ? "is-active" : ""}" data-r142-step="${i + 1}"><b>${i + 1}</b><span>${esc(label)}</span></div>`).join("");
  }

  function skillButtons() {
    const list = officialSkills.concat(favoriteSkills);
    return list.map(([id, title, desc]) => `<button type="button" class="r142-skill-option ${runState.skill === id ? "is-active" : ""}" data-r142-skill="${esc(id)}"><small>${officialSkills.some((s) => s[0] === id) ? "官方" : "我的收藏"}</small><h3>${esc(title)}</h3><p>${esc(desc)}</p></button>`).join("");
  }

  function runPage(id) {
    const p = plot(id);
    const fields = p.fields.map((f) => `<span class="r142-pill">${esc(f)}</span>`).join("");
    return shell(`/plot-run/${id}`, `
      <section class="r142-hero">
        <div>
          <span class="r142-kicker">${esc(p.field)} · 开始绘图</span>
          <h1>${esc(p.title)} 运行页</h1>
          <p class="r142-lead">这里模拟用户接入自己的模型 API 后怎么工作：网页先查字段，Skill 生成提示和代码，本地 Runtime 执行 R/Python。静态 GitHub Pages 不保存 API Key，也不上传你的数据。</p>
          <div class="r142-actions">
            <button class="r142-btn primary" type="button" data-r142-action="sample">使用示例数据</button>
            <button class="r142-btn" type="button" data-r142-action="check">检查字段</button>
            <button class="r142-btn lotus" type="button" data-r142-action="run">生成 mock 运行包</button>
          </div>
        </div>
        <figure class="r142-figure">
          <img src="${esc(img(id))}" alt="${esc(p.title)}示例图" onerror="this.src='${esc(thumb(id))}'" />
          <figcaption><span>预览示例图，正式图由你的数据生成</span><a href="#/plot-gallery/${esc(id)}">回详情</a></figcaption>
        </figure>
      </section>
      <section class="r142-run-layout">
        <aside class="r142-panel">
          <h3>运行步骤</h3>
          <div class="r142-step-list" data-r142-steps>${runSteps()}</div>
        </aside>
        <main class="r142-section">
          <article class="r142-card">
            <h2 class="r142-section-title">1. 你的数据需要这些字段</h2>
            <div class="r142-field-list">${fields}</div>
            <p>如果你不知道每列是什么意思，可以先在右侧问小助手；没有配置 API 时，本页只用规则给建议。</p>
          </article>
          <article class="r142-card">
            <h2 class="r142-section-title">2. 选择 Skill</h2>
            <p>官方 Skill 更稳，收藏 Skill 来自社区榜单。现在是静态演示，真实收藏需要登录后从社区同步。</p>
            <div class="r142-skill-grid" data-r142-skill-grid>${skillButtons()}</div>
          </article>
          <article class="r142-run-console">
            <h2 class="r142-section-title">3. 运行状态</h2>
            <ul class="r142-status" data-r142-status>${statusHtml()}</ul>
            <div class="r142-actions">
              <a class="r142-btn" href="${esc(pathFor(id, "plot.R"))}" target="_blank" rel="noreferrer">查看 R 脚本</a>
              <a class="r142-btn" href="${esc(pathFor(id, "plot.py"))}" target="_blank" rel="noreferrer">查看 Python 脚本</a>
              <button class="r142-btn primary" type="button" data-r142-action="export">导出复核清单</button>
            </div>
          </article>
        </main>
        <aside class="r142-side-panel">
          <article class="r142-panel">
            <h3>API 小助手</h3>
            <p>你可以问：“我的数据适合画什么图？” 或 “森林图缺哪个字段？” 未配置模型 API 时，只返回本页规则建议。</p>
            <button class="r142-btn lotus" type="button" data-r142-action="assistant">帮我检查下一步</button>
          </article>
          <article class="r142-panel">
            <h3>边界</h3>
            <ul class="r142-checklist">
              <li>API Key 只放本地环境变量，不写入网页和 GitHub。</li>
              <li>用户数据应在本地 Runtime 运行，不上传静态站点。</li>
              <li>医学 AI 输出仅用于教学与科研训练，不替代临床诊断。</li>
            </ul>
          </article>
        </aside>
      </section>
    `);
  }

  function syncRun(message) {
    if (!root) return;
    const steps = root.querySelector("[data-r142-steps]");
    if (steps) steps.innerHTML = runSteps();
    const status = root.querySelector("[data-r142-status]");
    if (status) status.innerHTML = statusHtml();
    root.querySelectorAll("[data-r142-skill]").forEach((button) => button.classList.toggle("is-active", button.dataset.r142Skill === runState.skill));
    toast(message);
  }

  function toast(message) {
    if (!message) return;
    const old = document.querySelector(".r142-toast");
    if (old) old.remove();
    const node = document.createElement("div");
    node.className = "r142-toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.remove(), 2500);
  }

  function clickHandler(event) {
    const target = event.target.closest("[data-r142-action], [data-r142-skill]");
    if (!target || !root || !root.contains(target)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (target.dataset.r142Skill) {
      runState.skill = target.dataset.r142Skill;
      syncRun(`已选择：${target.querySelector("h3")?.textContent || runState.skill}`);
      return;
    }
    const action = target.dataset.r142Action;
    if (action === "sample") {
      runState.sample = true;
      runState.checked = false;
      runState.ran = false;
      runState.exported = false;
      syncRun("示例数据已载入。");
    } else if (action === "check") {
      runState.sample = true;
      runState.checked = true;
      syncRun("字段检查通过。");
    } else if (action === "run") {
      runState.sample = true;
      runState.checked = true;
      runState.ran = true;
      syncRun("已生成 mock 运行包；真实运行请启动本地 Runtime。");
    } else if (action === "export") {
      runState.exported = true;
      syncRun("已生成复核清单导出提示。");
    } else if (action === "assistant") {
      toast("建议：先检查字段，再选官方绘图 Skill；如果是社区收藏 Skill，确认它的来源和版本。");
    }
  }

  function render() {
    const info = routeInfo();
    if (!info) return;
    root = document.getElementById("app");
    if (!root) return;
    document.body.classList.add("medpath-r142-plot-flow");
    document.body.classList.remove("medpath-island-page", "medpath-island-builder-page");
    const html = info.mode === "detail" ? detailPage(info.id) : runPage(info.id);
    root.innerHTML = html;
    root.dataset.round142Owned = VERSION;
    root.removeEventListener("click", clickHandler, true);
    root.addEventListener("click", clickHandler, true);
  }

  function release() {
    if (routeInfo()) return;
    document.body.classList.remove("medpath-r142-plot-flow");
    if (root) {
      root.removeEventListener("click", clickHandler, true);
      root = null;
    }
  }

  function boot() {
    if (routeInfo()) {
      window.setTimeout(render, 70);
      window.setTimeout(() => { if (routeInfo() && !document.querySelector(".r142-shell")) render(); }, 500);
      window.setTimeout(() => { if (routeInfo() && !document.querySelector(".r142-shell")) render(); }, 1200);
    } else {
      release();
    }
  }

  window.addEventListener("hashchange", boot);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

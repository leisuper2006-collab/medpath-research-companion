(function () {
  const VERSION = "round136";
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED = new Set(["/island", "/island-builder"]);

  const methods = [
    {
      id: "single-cell-basic",
      title: "单细胞基础分析",
      tag: "Seurat / Scanpy",
      plot: "umap",
      forWho: "有 count 矩阵，想先把细胞群、Marker 和比例讲清楚。",
      input: "count 矩阵、metadata、分组、批次",
      output: "质控图、UMAP、Marker DotPlot、细胞比例图、methods",
      packages: "R: Seurat, SingleR, ggplot2；Python: scanpy, anndata",
      steps: ["整理矩阵和 metadata", "质控和归一化", "降维聚类", "找 Marker", "导出图和复核清单"],
      risk: "不要只凭自动注释命名细胞群，关键细胞类型需要文献和老师复核。",
      prompt: "我有单细胞 count 矩阵和分组信息，请帮我安排从质控到 Marker 图的最小分析路线。"
    },
    {
      id: "virtual-perturbation",
      title: "单细胞虚拟扰动",
      tag: "GEARS / scGen / CPA",
      plot: "network_graph",
      forWho: "想探索基因敲除、药物扰动或通路变化，但还没做实验。",
      input: "单细胞矩阵、扰动标签、目标基因或药物、验证计划",
      output: "候选扰动方向、网络图、验证建议、风险提示",
      packages: "Python: GEARS, scGen, CPA, torch；R: ggplot2 可视化",
      steps: ["先确认问题不是临床结论", "找已有扰动数据", "选模型", "生成预测", "设计实验或文献复核"],
      risk: "预测结果只是科研假设，不能写成已验证机制，更不能用于患者处置。",
      prompt: "我想研究某基因敲除对肿瘤免疫细胞状态的影响，如何选择虚拟扰动工具？"
    },
    {
      id: "meta-analysis",
      title: "医学Meta分析",
      tag: "meta / metafor",
      plot: "forest_plot",
      forWho: "要做系统综述、循证医学或毕业论文 Meta 分析。",
      input: "PICO、检索式、纳排标准、效应量、风险偏倚",
      output: "森林图、漏斗图、PRISMA 流程、亚组分析说明",
      packages: "R: meta, metafor, robvis；Python: statsmodels",
      steps: ["写 PICO", "检索与筛选", "提取效应量", "异质性分析", "画图并写局限"],
      risk: "Meta 分析不是简单合并数值，检索、纳排和偏倚评价要能追溯。",
      prompt: "我想做肿瘤免疫治疗相关 Meta 分析，请从 PICO 到森林图给我流程。"
    },
    {
      id: "pathology-ai",
      title: "计算病理入门",
      tag: "OpenSlide / PyTorch",
      plot: "attention_heatmap",
      forWho: "有公开或脱敏切片图，想做 patch、模型解释和报告材料。",
      input: "WSI、patch、标签、授权说明、脱敏记录",
      output: "组织 mask、patch UMAP、attention heatmap、混淆矩阵",
      packages: "Python: openslide-python, opencv, pytorch-grad-cam",
      steps: ["确认图像来源", "切片预处理", "patch 特征", "模型评估", "病理老师复核解释"],
      risk: "不得上传真实患者隐私；模型热图只能做教学和科研解释，不替代诊断。",
      prompt: "我想做计算病理模型解释，需要准备哪些图和复核材料？"
    },
    {
      id: "survival-model",
      title: "生存预测模型",
      tag: "survival / rms",
      plot: "kaplan_meier",
      forWho: "有随访时间和结局，想做 KM、Cox 或临床预测模型。",
      input: "生存时间、结局状态、协变量、分组、训练/验证划分",
      output: "KM 曲线、Cox 表、ROC、校准曲线、决策曲线",
      packages: "R: survival, survminer, rms, timeROC；Python: lifelines",
      steps: ["检查结局编码", "画 KM", "建立 Cox", "校准验证", "写模型边界"],
      risk: "预测模型必须外部验证，网页示例不能作为临床决策依据。",
      prompt: "我有肿瘤随访数据，想做预后模型，请告诉我图表和验证顺序。"
    },
    {
      id: "survey-interview",
      title: "问卷与访谈研究",
      tag: "tidyverse / psych",
      plot: "correlation_heatmap",
      forWho: "有问卷、量表或访谈编码，想整理结果和图表。",
      input: "问卷表、量表分数、分组变量、访谈主题编码",
      output: "描述统计、相关热图、组间比较、主题网络、报告提纲",
      packages: "R: tidyverse, psych, ggplot2；Python: pandas, seaborn",
      steps: ["清理缺失值", "计算量表得分", "做描述统计", "选择差异或相关图", "写结果解释"],
      risk: "问卷结果要说明样本来源和量表可靠性，不要过度外推。",
      prompt: "我有一份教学反馈问卷，想分析学生对 AI Skills 的接受度。"
    },
    {
      id: "grant-roadmap",
      title: "项目申报路线",
      tag: "roadmap / budget",
      plot: "technology_roadmap",
      forWho: "想把一个想法拆成研究内容、技术路线、进度和成果。",
      input: "研究问题、已有基础、平台条件、经费额度、预期成果",
      output: "技术路线图、甘特图、经费映射、成果验收表",
      packages: "R: ggplot2, DiagrammeR；Python: graphviz, matplotlib",
      steps: ["写核心问题", "拆工作包", "映射平台和经费", "设计评价指标", "形成提交材料"],
      risk: "不能把拟形成成果写成已完成，也不能伪造试点数据。",
      prompt: "我想申报医学教育 AI 项目，请帮我把想法拆成工作包和图表。"
    },
    {
      id: "figure-package",
      title: "论文图复现包",
      tag: "source data / methods",
      plot: "workflow_diagram",
      forWho: "图已经做出来了，但不知道如何交付可复现材料。",
      input: "原始表、脚本、图注草稿、软件版本、导师修改意见",
      output: "图、代码、source data、caption、methods、审计清单",
      packages: "R: renv, sessioninfo, ggplot2；Python: matplotlib, seaborn",
      steps: ["固定输入表", "整理脚本", "生成图注", "写 methods", "打包复核"],
      risk: "不要把示例数据当真实数据；公开前检查隐私和版权。",
      prompt: "我已有一张火山图，请帮我整理投稿前的复现材料包。"
    }
  ];

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function go(path) {
    location.hash = path;
  }

  function img(id) {
    return `${PLOT_BASE}/${id}/example.png`;
  }

  function isProtected(path = route()) {
    return PROTECTED.has(path) || path.startsWith("/island/");
  }

  function isMethodRoute(path = route()) {
    return path === "/method-runner" || path.startsWith("/method-runner/");
  }

  function methodById(id) {
    return methods.find((method) => method.id === id) || methods[0];
  }

  function nav(active = "/method-runner") {
    const items = [
      ["/home", "概览", "从今天开始"],
      ["/method-runner", "方法路线", "问题到流程"],
      ["/plot-gallery", "科研绘图", "示例和代码"],
      ["/open-source", "开源工具", "仓库和教程"],
      ["/skills", "Skill市场", "官方与收藏"],
      ["/community", "社区交流", "帖子与榜单"],
      ["/profile", "我的主页", "作品与收藏"],
      ["/island", "科研小岛", "游戏模式"],
      ["/island-builder", "自主建造", "放置建筑"]
    ];
    return items.map(([href, label, hint]) => `
      <a class="${active === href ? "is-active" : ""}" href="#${href}" data-r136-route="${href}">
        <span>${esc(label)}</span><small>${esc(hint)}</small>
      </a>`).join("");
  }

  function topbar() {
    return `
      <header class="r136-top">
        <nav>
          <a class="is-active" href="#/method-runner" data-r136-route="/method-runner">学习路径</a>
          <a href="#/plot-gallery" data-r136-route="/plot-gallery">图谱页</a>
          <a href="#/open-source" data-r136-route="/open-source">开源工具</a>
          <a href="#/providers" data-r136-route="/providers">模型接口</a>
        </nav>
        <input class="r136-search" placeholder="搜方法、图型、数据集、问题..." data-r136-search>
        <button class="r136-btn small" data-r136-toast="已加入静态演示收藏；登录后会同步到我的主页。">收藏路线</button>
      </header>`;
  }

  function shell(content) {
    return `
      <div class="r136-shell">
        <aside class="r136-side">
          <div class="r136-brand">
            <div class="r136-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>方法路线工作台</span></div>
          </div>
          <nav class="r136-nav">${nav("/method-runner")}</nav>
        </aside>
        <main class="r136-main">
          ${topbar()}
          <div class="r136-page">${content}</div>
        </main>
      </div>`;
  }

  function card(method) {
    return `
      <article class="r136-method-card" data-r136-method="${esc(method.id)}">
        <img src="${img(method.plot)}" alt="${esc(method.title)}示例图">
        <div class="r136-method-body">
          <div class="r136-chip-row"><span class="r136-chip">${esc(method.tag)}</span></div>
          <h3>${esc(method.title)}</h3>
          <p>${esc(method.forWho)}</p>
          <div class="r136-actions">
            <button class="r136-btn primary small" data-r136-route="/method-runner/${esc(method.id)}">查看路线</button>
            <button class="r136-btn small" data-r136-route="/method-runner/${esc(method.id)}/run">开始</button>
          </div>
        </div>
      </article>`;
  }

  function listPage() {
    return shell(`
      <section class="r136-hero">
        <div class="r136-hero-copy">
          <div class="r136-kicker">Method Runner</div>
          <h1 class="r136-title">先说数据和问题，再选方法</h1>
          <p class="r136-lead">每张卡都能打开完整路线：适合谁、要什么数据、怎么跑、出什么图、哪里容易踩坑。你不用先会代码，先把研究任务讲清楚。</p>
          <div class="r136-actions">
            <button class="r136-btn primary" data-r136-route="/method-runner/single-cell-basic">看单细胞路线</button>
            <button class="r136-btn" data-r136-route="/method-runner/meta-analysis">看Meta路线</button>
            <button class="r136-btn" data-r136-route="/open-source">找开源仓库</button>
          </div>
        </div>
        <div class="r136-hero-panel">
          <ol class="r136-flow">
            <li><span>1</span><p>写清楚：我有什么数据，想回答什么问题。</p></li>
            <li><span>2</span><p>选择路线：单细胞、Meta、病理AI、问卷、申报等。</p></li>
            <li><span>3</span><p>检查输入字段，避免一开始就跑错方向。</p></li>
            <li><span>4</span><p>选择官方 Skill 或社区收藏 Skill。</p></li>
            <li><span>5</span><p>用自己的 API 和本地 Runtime 生成代码、图和复核清单。</p></li>
          </ol>
        </div>
      </section>
      <section class="r136-section">
        <div class="r136-section-head">
          <div><h2>常用方法路线</h2><p>先做 8 条高频路线，后续继续扩展到更多学科和文章类型。</p></div>
        </div>
        <div class="r136-method-grid">${methods.map(card).join("")}</div>
      </section>`);
  }

  function detailPage(id) {
    const method = methodById(id);
    return shell(`
      <section class="r136-detail">
        <div>
          <button class="r136-btn small" data-r136-route="/method-runner">返回方法路线</button>
          <div class="r136-kicker" style="margin-top:18px">${esc(method.tag)}</div>
          <h1 class="r136-title">${esc(method.title)}</h1>
          <p class="r136-lead">${esc(method.forWho)}</p>
          <div class="r136-actions">
            <button class="r136-btn primary" data-r136-route="/method-runner/${esc(method.id)}/run">用这条路线开始</button>
            <button class="r136-btn" data-r136-route="/plot-gallery">看相关图型</button>
            <button class="r136-btn" data-r136-toast="已收藏 ${esc(method.title)}。">收藏</button>
          </div>
        </div>
        <figure class="r136-panel">
          <img src="${img(method.plot)}" alt="${esc(method.title)}示例图">
          <figcaption>示例图由项目内置虚拟数据生成，只说明图型和字段，不代表真实研究结论。</figcaption>
        </figure>
      </section>
      <section class="r136-two r136-section">
        <div class="r136-panel"><h3>需要什么输入</h3><p>${esc(method.input)}</p></div>
        <div class="r136-panel"><h3>会得到什么输出</h3><p>${esc(method.output)}</p></div>
        <div class="r136-panel"><h3>推荐工具包</h3><p>${esc(method.packages)}</p></div>
        <div class="r136-panel"><h3>安全边界</h3><p>${esc(method.risk)}</p></div>
      </section>
      <section class="r136-two r136-section">
        <div class="r136-panel">
          <h3>路线步骤</h3>
          <ol class="r136-flow">${method.steps.map((step, index) => `<li><span>${index + 1}</span><p>${esc(step)}</p></li>`).join("")}</ol>
        </div>
        <div class="r136-panel">
          <h3>可以直接问模型</h3>
          <p>${esc(method.prompt)}</p>
          <pre class="r136-code">任务：${esc(method.title)}
输入：${esc(method.input)}
请输出：字段检查、运行步骤、推荐图型、R/Python包、导师复核点。
注意：不编造结果，不上传隐私，不替代临床诊断。</pre>
        </div>
      </section>`);
  }

  function runPage(id) {
    const method = methodById(id);
    const savedTask = sessionStorage.getItem(`medpath:r136:task:${method.id}`) || "";
    const draftTask = sessionStorage.getItem(`medpath:r136:draft:${method.id}`) || "";
    return shell(`
      <section class="r136-run">
        <div class="r136-panel">
          <button class="r136-btn small" data-r136-route="/method-runner/${esc(method.id)}">返回路线详情</button>
          <h3 style="margin-top:18px">开始：${esc(method.title)}</h3>
          <p>这里是静态演示中的 mock 运行入口。接入你自己的模型 API 和本地 Runtime 后，模型负责解释字段、生成代码和图注；真正跑图仍在你的电脑或服务器执行。</p>
          <textarea data-r136-task placeholder="把你的研究需求写在这里。例如：我有胃癌单细胞数据，想比较治疗前后免疫细胞变化。">${esc(draftTask)}</textarea>
          <div class="r136-actions">
            <button class="r136-btn primary" data-r136-run>生成步骤草案</button>
            <button class="r136-btn" data-r136-toast="已切换为官方Skill演示；社区收藏Skill会在登录后读取。">选择官方Skill</button>
            <button class="r136-btn" data-r136-toast="我的收藏来自社区Skill榜；当前为静态演示。">我的收藏Skill</button>
          </div>
        </div>
        <div class="r136-panel">
          <h3>输出预览</h3>
          <div data-r136-output>${runOutputHtml(method, savedTask)}</div>
          <pre class="r136-code">BYOK流程：
1. Providers 页面配置自己的 API Key，只显示 configured true/false。
2. 本地 Runtime 执行 R/Python。
3. 导出图、代码、source data、caption、methods 和复核清单。</pre>
        </div>
      </section>`);
  }

  function runOutputHtml(method, taskText) {
    if (taskText) {
      return `
        <p><b>已识别任务：</b>${esc(taskText)}</p>
        <p><b>下一步：</b>先检查输入字段，再选择示例图型，最后生成本地 R/Python 脚本。</p>
        <p><b>复核：</b>导师或教师需要检查数据来源、统计方法、图注和安全边界。</p>`;
    }
    return `
      <p><b>输入要求：</b>${esc(method.input)}</p>
      <p><b>建议输出：</b>${esc(method.output)}</p>
      <p><b>边界：</b>${esc(method.risk)}</p>`;
  }

  function toast(message) {
    const old = document.querySelector(".r136-toast");
    if (old) old.remove();
    const node = document.createElement("div");
    node.className = "r136-toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2600);
  }

  function runMock() {
    const parts = route().split("/").filter(Boolean);
    const method = methodById(parts[1]);
    const text = document.querySelector("[data-r136-task]")?.value || sessionStorage.getItem(`medpath:r136:draft:${method.id}`) || "";
    sessionStorage.setItem(`medpath:r136:task:${method.id}`, text || "未填写具体任务，先使用当前路线的默认模板。");
    render();
    toast("mock 运行完成：已生成步骤草案，未调用真实 API。");
  }

  function render() {
    const path = route();
    if (isProtected(path)) {
      document.body.classList.remove("medpath-r136-method");
      return false;
    }
    if (!isMethodRoute(path)) {
      document.body.classList.remove("medpath-r136-method");
      return false;
    }
    const app = document.getElementById("app");
    if (!app) return false;
    document.body.classList.add("medpath-r136-method");
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 1) app.innerHTML = listPage();
    else if (parts[2] === "run") app.innerHTML = runPage(decodeURIComponent(parts[1]));
    else app.innerHTML = detailPage(decodeURIComponent(parts[1]));
    app.setAttribute("data-round136-owned", VERSION);
    return true;
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const routeTarget = event.target.closest("[data-r136-route]");
      if (routeTarget) {
        event.preventDefault();
        go(routeTarget.getAttribute("data-r136-route"));
        return;
      }
      const toastTarget = event.target.closest("[data-r136-toast]");
      if (toastTarget) {
        toast(toastTarget.getAttribute("data-r136-toast"));
        return;
      }
      if (event.target.closest("[data-r136-run]")) {
        runMock();
      }
    }, true);
    document.addEventListener("input", (event) => {
      if (!event.target.matches("[data-r136-task]")) return;
      const parts = route().split("/").filter(Boolean);
      const method = methodById(parts[1]);
      sessionStorage.setItem(`medpath:r136:draft:${method.id}`, event.target.value || "");
    }, true);
    window.addEventListener("hashchange", () => setTimeout(render, 30));
    window.addEventListener("load", () => setTimeout(render, 60));
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 60));
  }

  function start() {
    bind();
    render();
    if ("MutationObserver" in window) {
      const observer = new MutationObserver(() => {
        const path = route();
        const app = document.getElementById("app");
        const shouldOwn = isMethodRoute(path) && !isProtected(path);
        const overwritten = app && app.getAttribute("data-round136-owned") === VERSION && !app.querySelector(".r136-shell");
        if (shouldOwn && (app?.getAttribute("data-round136-owned") !== VERSION || overwritten)) render();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  start();
})();

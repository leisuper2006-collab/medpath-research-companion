(function () {
  const VERSION = "round135";
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED = new Set(["/island", "/island-builder"]);

  const categories = [
    { id: "all", label: "全部工具", note: "按任务找，不按仓库名硬背" },
    { id: "literature", label: "文献与综述", note: "检索、筛选、证据表" },
    { id: "omics", label: "组学与单细胞", note: "表达矩阵、细胞图谱" },
    { id: "meta", label: "医学Meta分析", note: "医学二级任务，不是顶层学科" },
    { id: "ml", label: "机器学习", note: "预测、解释、校准" },
    { id: "pathology", label: "计算病理", note: "WSI、patch、注意力图" },
    { id: "writing", label: "写作与复现", note: "论文、申报、材料归档" },
    { id: "deployment", label: "运行与部署", note: "本地Runtime、API、HPC" }
  ];

  const tools = [
    {
      id: "single-cell-atlas",
      category: "omics",
      title: "单细胞图谱分析路线",
      subtitle: "Seurat / Scanpy / CellTypist",
      plot: "umap",
      audience: "有表达矩阵，想知道细胞群和Marker的新手",
      question: "我的细胞分成了哪些亚群？每群有什么标志基因？",
      inputs: "count矩阵、细胞元数据、分组信息、批次信息",
      outputs: "UMAP、Marker DotPlot、细胞比例图、复核清单",
      repo: "satijalab/seurat、scverse/scanpy",
      license: "开源许可进入仓库前核对，平台只做导航和学习路径",
      install: "建议先在本地或服务器Runtime运行，不在静态网页上传原始数据",
      packages: "R: Seurat, SingleR, ggplot2；Python: scanpy, anndata, celltypist",
      steps: ["检查矩阵和元数据", "质控、归一化、降维", "聚类和Marker分析", "生成图和methods", "导师复核细胞命名"],
      prompt: "我有单细胞count矩阵和分组信息，请帮我判断应该先做哪些质控图和Marker图。",
      skill: "single-cell-workflow-skill"
    },
    {
      id: "virtual-perturbation",
      category: "omics",
      title: "单细胞虚拟扰动",
      subtitle: "GEARS / scGen / CPA / scGPT",
      plot: "network_graph",
      audience: "想探索基因敲除、药物扰动或通路变化的人",
      question: "如果扰动某个基因或药物，细胞状态可能怎么变？",
      inputs: "单细胞表达矩阵、扰动标签、目标基因或药物、验证方案",
      outputs: "候选扰动方向、网络示意、风险提示、后续实验建议",
      repo: "snap-stanford/GEARS、theislab/scgen、facebookresearch/CPA",
      license: "各仓库许可不同，正式使用前逐项核对",
      install: "通常需要GPU或服务器环境；本站先提供路线和Skill草案",
      packages: "Python: gears, scanpy, torch；R侧用于结果可视化",
      steps: ["确认扰动问题不是临床结论", "准备扰动训练数据", "选择模型", "生成预测变化", "用外部证据和实验设计复核"],
      prompt: "我想研究某基因敲除对肿瘤免疫细胞状态的影响，如何选择虚拟扰动工具？",
      skill: "virtual-perturbation-planner"
    },
    {
      id: "meta-analysis-path",
      category: "meta",
      title: "医学Meta分析全流程",
      subtitle: "meta / metafor / PRISMA",
      plot: "forest_plot",
      audience: "要做循证医学、系统综述、毕业论文Meta的人",
      question: "多篇研究合起来，效应量是否稳定？异质性在哪里？",
      inputs: "纳排标准、文献检索式、效应量、置信区间、风险偏倚表",
      outputs: "森林图、漏斗图、PRISMA流程图、亚组分析说明",
      repo: "cran/meta、wviechtb/metafor、prisma-flowdiagram",
      license: "R包和工具许可需按原项目核对",
      install: "本地R环境优先；静态网页提供模板和示例图",
      packages: "R: meta, metafor, robvis, ggplot2；Python: statsmodels",
      steps: ["确定PICO问题", "写检索式和纳排标准", "提取效应量", "画森林图和漏斗图", "写结果和局限"],
      prompt: "我想做一篇肿瘤免疫治疗相关Meta分析，请帮我从PICO到图表列出流程。",
      skill: "meta-analysis-skill"
    },
    {
      id: "survival-model",
      category: "ml",
      title: "生存预测与临床模型",
      subtitle: "survival / rms / lifelines",
      plot: "kaplan_meier",
      audience: "有随访时间和结局，想做预后分析的人",
      question: "不同风险组的生存结局是否不同？模型是否可靠？",
      inputs: "生存时间、结局状态、分组变量、协变量、训练/验证划分",
      outputs: "KM曲线、Cox结果、校准曲线、ROC、复核清单",
      repo: "therneau/survival、harrelfe/rms、CamDavidsonPilon/lifelines",
      license: "统计包许可按原项目核对；医学解释需导师复核",
      install: "R或Python均可，本项目优先提供R模板",
      packages: "R: survival, survminer, rms, timeROC；Python: lifelines",
      steps: ["检查结局编码", "画KM曲线", "建立Cox模型", "校准和验证", "明确模型不可直接用于临床处置"],
      prompt: "我有肿瘤患者随访数据，想做预后模型，需要哪些图和检查？",
      skill: "survival-model-skill"
    },
    {
      id: "pathology-ai",
      category: "pathology",
      title: "计算病理模型解释",
      subtitle: "OpenSlide / PyTorch / Grad-CAM",
      plot: "attention_heatmap",
      audience: "有公开或脱敏病理图像，想做模型解释的人",
      question: "模型到底关注了切片的哪些区域？错误来自哪里？",
      inputs: "WSI或patch、标签、模型输出、脱敏与授权说明",
      outputs: "组织mask、attention heatmap、patch UMAP、混淆矩阵",
      repo: "openslide/openslide、jacobgil/pytorch-grad-cam",
      license: "图像数据授权必须单独核对；不得上传患者隐私",
      install: "需要本地图像处理环境；网页只做流程和示例",
      packages: "Python: openslide-python, opencv, pytorch-grad-cam, sklearn",
      steps: ["确认图像来源合法", "切片预处理", "生成patch特征", "画注意力图", "由病理老师复核解释"],
      prompt: "我想给计算病理模型做可解释性展示，应该准备哪些图？",
      skill: "pathology-ai-interpretation-skill"
    },
    {
      id: "plot-reproducibility",
      category: "writing",
      title: "论文图复现材料包",
      subtitle: "source data / caption / methods",
      plot: "workflow_diagram",
      audience: "图画出来了，但不知道如何交付复现材料的人",
      question: "这张图能不能让导师、审稿人或同学复现？",
      inputs: "原始表格、绘图脚本、图注草稿、方法草稿、软件版本",
      outputs: "图、代码、source data、caption、methods、审计报告",
      repo: "matplotlib、ggplot2、quarto、renv、conda-lock",
      license: "仅引用工具生态，不复制第三方代码",
      install: "本地Runtime生成，静态网页提供流程",
      packages: "R: ggplot2, renv, sessioninfo；Python: matplotlib, seaborn",
      steps: ["整理输入表", "固定脚本和版本", "生成图注", "写methods", "导出zip清单"],
      prompt: "我已经有一张火山图，帮我整理可以交给导师复核的复现材料。",
      skill: "figure-reproducibility-skill"
    },
    {
      id: "literature-screening",
      category: "literature",
      title: "文献检索与筛选台",
      subtitle: "PubMed / Europe PMC / Zotero",
      plot: "prisma_flow",
      audience: "刚开始做课题，不知道怎么找文献和记录筛选的人",
      question: "我该怎么把检索、筛选、排除理由记录清楚？",
      inputs: "研究问题、关键词、数据库、纳排标准、筛选记录",
      outputs: "检索式、PRISMA流程、证据表、Zotero整理建议",
      repo: "Europe PMC API、Zotero translators、RISmed",
      license: "数据库和API使用条款需按官网核对",
      install: "可先手动检索；自动化检索需要本地脚本和API合规",
      packages: "R: rentrez, RISmed；Python: biopython, metapub",
      steps: ["把问题写成PICO或PECO", "扩展关键词", "记录检索式", "筛选标题摘要", "整理排除理由"],
      prompt: "我想做胃癌病理AI相关综述，请帮我写检索式和筛选表字段。",
      skill: "literature-screening-skill"
    },
    {
      id: "kg-rag-builder",
      category: "deployment",
      title: "知识图谱与RAG资源",
      subtitle: "LangChain / LlamaIndex / Neo4j",
      plot: "architecture_diagram",
      audience: "想把课程材料、指南和论文变成可检索知识库的人",
      question: "模型回答时能否给出来源，而不是凭空编？",
      inputs: "教材章节、课程材料、公开指南、脱敏案例、引用清单",
      outputs: "索引结构、引用核验规则、RAG流程图、风险边界",
      repo: "langchain-ai/langchain、run-llama/llama_index、neo4j",
      license: "框架许可和数据来源许可分开核对",
      install: "需要本地或服务器Runtime；GitHub Pages只展示设计",
      packages: "Python: llama-index, langchain, chromadb；可选Neo4j",
      steps: ["清理材料来源", "切分和向量化", "建立引用字段", "测试负样本", "输出引用和复核清单"],
      prompt: "我想把病理学课程材料做成RAG知识库，应该怎么组织字段和引用？",
      skill: "medical-kg-rag-builder"
    },
    {
      id: "open-source-audit",
      category: "writing",
      title: "开源仓库阅读与许可核对",
      subtitle: "README / LICENSE / Issues",
      plot: "logic_framework",
      audience: "看到一个GitHub项目，不知道能不能用、怎么用的人",
      question: "这个仓库适不适合我的课题？能不能商用或改造？",
      inputs: "仓库链接、研究用途、是否计划二次开发、数据类型",
      outputs: "功能摘要、安装难度、许可风险、替代仓库、Skill草案",
      repo: "GitHub repository metadata + README + LICENSE",
      license: "必须逐仓库核对，不用一句“开源”替代许可判断",
      install: "网页做检查清单；真实克隆和运行在本地完成",
      packages: "Node/Python/R按仓库决定",
      steps: ["读README", "读LICENSE", "看最近维护", "跑最小示例", "写使用边界"],
      prompt: "这个仓库是否适合用在我的医学AI教学项目里？请帮我做许可和适用性核对。",
      skill: "open-source-audit-skill"
    },
    {
      id: "hpc-batch-review",
      category: "deployment",
      title: "HPC批处理任务草案",
      subtitle: "SLURM / Singularity / dry-run",
      plot: "gantt",
      audience: "需要批量生成案例、评测或模拟，但不想误提交收费作业的人",
      question: "哪些任务适合HPC？脚本怎么写才安全？",
      inputs: "任务类型、输入文件、软件、队列、预计时长、dry-run标志",
      outputs: "SLURM脚本、费用估计字段、作业记录、人工确认清单",
      repo: "SLURM examples、SingularityCE docs",
      license: "软件许可和学校HPC规则需按本地文档核对",
      install: "默认dry-run；真实提交必须人工确认",
      packages: "SLURM, Singularity, GROMACS/LAMMPS/OpenCV按任务选择",
      steps: ["写任务模板", "校验队列和资源", "dry-run生成脚本", "人工确认", "归档输出"],
      prompt: "我想把一批合成案例交给服务器评测，请帮我生成dry-run作业模板。",
      skill: "hpc-job-runner"
    },
    {
      id: "figure-selection",
      category: "writing",
      title: "按文章类型选图",
      subtitle: "论文结构 / 图表叙事 / 审稿复核",
      plot: "multi_omics_heatmap",
      audience: "写文章前不知道结果部分该放哪些图的人",
      question: "一篇文章从主图到补充图，应该怎样安排？",
      inputs: "文章类型、研究问题、数据类型、预期结果、投稿方向",
      outputs: "图表清单、每张图回答的问题、代码入口、图注草稿",
      repo: "ggplot2 gallery、Matplotlib examples、journal figure guides",
      license: "只借鉴展示结构，不复制受版权保护图文",
      install: "静态网页可直接给清单；真实绘图用本地Runtime",
      packages: "R/Python按图型自动推荐",
      steps: ["选文章类型", "列结果问题", "匹配图型", "生成示例数据模板", "导出图表计划"],
      prompt: "我要写单细胞肿瘤免疫文章，请帮我规划主图和补充图。",
      skill: "article-figure-planner"
    },
    {
      id: "community-skill-market",
      category: "deployment",
      title: "社区Skill收藏与冲榜",
      subtitle: "Skill草案 / 收藏 / 排行",
      plot: "sankey",
      audience: "想把自己的流程发布给别人收藏、复用和评价的人",
      question: "我能不能把常用分析流程变成一个可收藏的Skill？",
      inputs: "Skill名称、用途、输入、输出、风险边界、示例任务",
      outputs: "plugin.json草案、详情页文案、运行入口、排行字段",
      repo: "本项目Skill规范 + 社区收藏机制",
      license: "用户发布内容需明确授权范围和隐私边界",
      install: "当前为静态演示；后端上线后保存收藏和点赞",
      packages: "TypeScript schema + JSON registry",
      steps: ["写用途", "写输入输出", "补示例", "加安全边界", "发布到社区榜"],
      prompt: "我想发布一个森林图自动检查Skill，帮我生成可发布的描述和字段。",
      skill: "teacher-skill-maker"
    }
  ];

  let currentCategory = localStorage.getItem("medpath:r135:category") || "all";
  let currentQuery = localStorage.getItem("medpath:r135:query") || "";

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

  function isOpenSourceRoute(path = route()) {
    return path === "/open-source" || path.startsWith("/open-source/");
  }

  function nav(active = "/open-source") {
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
      <a class="${active === href ? "is-active" : ""}" href="#${href}" data-r135-route="${href}">
        <span>${esc(label)}</span><small>${esc(hint)}</small>
      </a>`).join("");
  }

  function topbar() {
    return `
      <header class="r135-top">
        <nav>
          <a class="is-active" href="#/open-source" data-r135-route="/open-source">工具导航</a>
          <a href="#/method-runner" data-r135-route="/method-runner">方法运行器</a>
          <a href="#/plot-gallery" data-r135-route="/plot-gallery">图谱页</a>
          <a href="#/community" data-r135-route="/community">社区Skill</a>
        </nav>
        <input class="r135-search" value="${esc(currentQuery)}" placeholder="搜：Meta、单细胞、病理AI、HPC、文献..." data-r135-search>
        <button class="r135-btn small" data-r135-toast="已记录为静态演示收藏；接入账号后会同步到我的主页。">收藏本页</button>
      </header>`;
  }

  function shell(content, active = "/open-source") {
    return `
      <div class="r135-shell">
        <aside class="r135-side">
          <div class="r135-brand">
            <div class="r135-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>开源工具导航</span></div>
          </div>
          <nav class="r135-nav">${nav(active)}</nav>
        </aside>
        <main class="r135-main">
          ${topbar()}
          <div class="r135-page">${content}</div>
        </main>
      </div>`;
  }

  function categoryButton(cat) {
    const count = cat.id === "all" ? tools.length : tools.filter((tool) => tool.category === cat.id).length;
    return `<button class="${cat.id === currentCategory ? "is-active" : ""}" data-r135-category="${esc(cat.id)}">
      <strong>${esc(cat.label)}</strong><small>${count} 个入口 · ${esc(cat.note)}</small>
    </button>`;
  }

  function filteredTools() {
    const query = currentQuery.trim().toLowerCase();
    return tools.filter((tool) => {
      const inCategory = query ? true : (currentCategory === "all" || tool.category === currentCategory);
      const haystack = [
        tool.title, tool.subtitle, tool.audience, tool.question, tool.inputs, tool.outputs,
        tool.repo, tool.packages, tool.prompt, tool.skill
      ].join(" ").toLowerCase();
      return inCategory && (!query || haystack.includes(query));
    });
  }

  function toolCard(tool) {
    const category = categories.find((cat) => cat.id === tool.category)?.label || "工具";
    return `
      <article class="r135-tool-card" data-r135-tool="${esc(tool.id)}">
        <div class="r135-tool-visual"><img src="${img(tool.plot)}" alt="${esc(tool.title)}示例图"></div>
        <div class="r135-tool-body">
          <div class="r135-chip-row"><span class="r135-chip">${esc(category)}</span><span class="r135-chip">${esc(tool.subtitle)}</span></div>
          <h3>${esc(tool.title)}</h3>
          <p>${esc(tool.question)}</p>
          <div class="r135-meta">
            <div><strong>输入</strong>${esc(tool.inputs)}</div>
            <div><strong>得到</strong>${esc(tool.outputs)}</div>
          </div>
          <div class="r135-actions">
            <button class="r135-btn primary small" data-r135-route="/open-source/${esc(tool.id)}">看详情</button>
            <button class="r135-btn small" data-r135-route="/method-runner">进方法</button>
            <button class="r135-btn small" data-r135-toast="已收藏 ${esc(tool.title)}。登录后可同步到我的主页。">收藏</button>
          </div>
        </div>
      </article>`;
  }

  function listPage() {
    const visible = filteredTools();
    const content = `
      <section class="r135-hero">
        <div class="r135-hero-copy">
          <div class="r135-kicker">Open Source Navigator</div>
          <h1 class="r135-title">先说任务，再选仓库</h1>
          <p class="r135-lead">这里不把GitHub仓库堆成目录。你先说自己有什么数据、想回答什么问题，页面再把工具、示例图、输入字段、风险边界和Skill草案放到同一张工作台上。</p>
          <div class="r135-actions">
            <button class="r135-btn primary" data-r135-route="/open-source/single-cell-atlas">看单细胞示例</button>
            <button class="r135-btn" data-r135-route="/open-source/meta-analysis-path">看Meta分析流程</button>
            <button class="r135-btn" data-r135-route="/plot-gallery">去图谱页</button>
          </div>
        </div>
        <div class="r135-hero-panel">
          <div class="r135-query">
            <label><strong>把你的需求写在这里</strong></label>
            <textarea data-r135-task placeholder="例如：我有肿瘤单细胞数据，想找一个工具判断免疫细胞亚群，并生成UMAP和Marker图。"></textarea>
            <button class="r135-btn primary" data-r135-suggest>帮我筛工具</button>
            <div class="r135-query-output" data-r135-query-output>示例：如果你有表达矩阵，先看“单细胞图谱分析路线”；如果要做基因扰动，再进入“单细胞虚拟扰动”。</div>
          </div>
        </div>
      </section>
      <section class="r135-layout">
        <aside class="r135-filter">
          <h3>按任务筛</h3>
          ${categories.map(categoryButton).join("")}
        </aside>
        <div>
          <div class="r135-panel" style="margin-bottom:18px">
            <h3>已筛出 ${visible.length} 个入口</h3>
            <p>每张卡片都写清楚适合谁、输入什么、得到什么、常见工具和下一步。许可和真实运行仍需进入原仓库、本地Runtime或导师复核，不在网页里伪装成已经完成。</p>
          </div>
          <div class="r135-card-grid">${visible.length ? visible.map(toolCard).join("") : emptyState()}</div>
        </div>
      </section>`;
    return shell(content, "/open-source");
  }

  function emptyState() {
    return `<div class="r135-panel"><h3>没筛到合适工具</h3><p>换一个关键词试试，比如“Meta”“单细胞”“病理AI”“HPC”“综述”。如果仍然没有，先去方法路线页，把问题拆成数据、任务和输出。</p><button class="r135-btn primary" data-r135-route="/method-runner">去方法路线</button></div>`;
  }

  function detailPage(id) {
    const tool = tools.find((item) => item.id === id) || tools[0];
    const content = `
      <section class="r135-detail">
        <div>
          <button class="r135-btn small" data-r135-route="/open-source">返回工具导航</button>
          <div class="r135-kicker" style="margin-top:18px">${esc(categories.find((cat) => cat.id === tool.category)?.label || "工具")}</div>
          <h1 class="r135-title">${esc(tool.title)}</h1>
          <p class="r135-lead">${esc(tool.audience)}。先看它回答什么问题，再决定是否克隆仓库、接入Runtime或做成自己的Skill。</p>
          <div class="r135-actions">
            <button class="r135-btn primary" data-r135-toast="已生成 ${esc(tool.skill)} 草案入口。静态演示不会写入服务器。">生成Skill草案</button>
            <button class="r135-btn" data-r135-route="/method-runner">进方法运行器</button>
            <button class="r135-btn" data-r135-toast="已收藏 ${esc(tool.title)}。">收藏</button>
          </div>
        </div>
        <figure class="r135-panel r135-detail-visual">
          <img src="${img(tool.plot)}" alt="${esc(tool.title)}示例图">
          <figcaption>示例图来自本项目Round110脚本和虚拟数据，只用于说明图型与字段，不代表真实研究结论。</figcaption>
        </figure>
      </section>
      <section class="r135-two">
        <div class="r135-panel"><h3>这个工具回答什么</h3><p>${esc(tool.question)}</p></div>
        <div class="r135-panel"><h3>推荐仓库或生态</h3><p>${esc(tool.repo)}</p><p><b>许可：</b>${esc(tool.license)}</p></div>
        <div class="r135-panel"><h3>输入材料</h3><p>${esc(tool.inputs)}</p></div>
        <div class="r135-panel"><h3>输出结果</h3><p>${esc(tool.outputs)}</p></div>
        <div class="r135-panel"><h3>推荐R/Python包</h3><p>${esc(tool.packages)}</p></div>
        <div class="r135-panel"><h3>运行方式</h3><p>${esc(tool.install)}</p></div>
      </section>
      <section class="r135-two">
        <div class="r135-panel">
          <h3>新手学习路径</h3>
          <ol class="r135-road">${tool.steps.map((step, index) => `<li><span>${index + 1}</span><p>${esc(step)}</p></li>`).join("")}</ol>
        </div>
        <div class="r135-panel">
          <h3>可直接问模型的提示</h3>
          <p>${esc(tool.prompt)}</p>
          <pre class="r135-code">任务：${esc(tool.question)}
输入：${esc(tool.inputs)}
请输出：工具选择理由、字段检查、最小示例代码、风险边界、导师复核清单。
注意：不要编造结果，不要上传患者隐私。</pre>
        </div>
      </section>
      <section class="r135-two">
        <div class="r135-panel">
          <h3>Skill草案结构</h3>
          <pre class="r135-code">name: ${esc(tool.skill)}
purpose: ${esc(tool.question)}
inputs: ${esc(tool.inputs)}
outputs: ${esc(tool.outputs)}
safety: 不处理可识别患者信息；医学AI输出仅用于教学与科研训练。</pre>
        </div>
        <div class="r135-panel">
          <h3>什么时候不要用</h3>
          <p>数据来源不清楚、隐私未脱敏、没有导师或教师复核、把模型输出当作临床诊断、或者无法核对原仓库许可时，先不要进入正式分析。</p>
        </div>
      </section>`;
    return shell(content, "/open-source");
  }

  function suggestTools() {
    const text = (document.querySelector("[data-r135-task]")?.value || "").toLowerCase();
    let answer = "建议先从“开源仓库阅读与许可核对”开始，把仓库用途、许可、输入输出和最小示例跑通。";
    if (text.includes("meta") || text.includes("森林") || text.includes("循证") || text.includes("综述")) {
      currentCategory = "meta";
      answer = "你更像在做医学Meta分析：先看森林图、漏斗图和PRISMA流程，再整理纳排标准和效应量表。";
    } else if (text.includes("单细胞") || text.includes("umap") || text.includes("marker") || text.includes("扰动") || text.includes("敲除")) {
      currentCategory = "omics";
      answer = "你更像在做单细胞或扰动分析：先跑图谱和Marker，再考虑虚拟扰动；不要把虚拟敲除放成顶层大类。";
    } else if (text.includes("病理") || text.includes("wsi") || text.includes("切片") || text.includes("注意力")) {
      currentCategory = "pathology";
      answer = "你更像在做计算病理：先确认图像授权和脱敏，再做mask、patch、注意力图和模型解释。";
    } else if (text.includes("hpc") || text.includes("服务器") || text.includes("批量") || text.includes("slurm")) {
      currentCategory = "deployment";
      answer = "你更像需要运行与部署：先做dry-run脚本和费用估计，不要自动提交真实HPC作业。";
    } else if (text.includes("文献") || text.includes("检索")) {
      currentCategory = "literature";
      answer = "你更像在做文献检索：先写清研究问题和检索式，再记录筛选与排除理由。";
    }
    localStorage.setItem("medpath:r135:category", currentCategory);
    const output = document.querySelector("[data-r135-query-output]");
    if (output) output.textContent = answer;
    render();
  }

  function toast(message) {
    const old = document.querySelector(".r135-toast");
    if (old) old.remove();
    const node = document.createElement("div");
    node.className = "r135-toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2600);
  }

  function render() {
    const path = route();
    if (isProtected(path)) {
      document.body.classList.remove("medpath-r135-open");
      return false;
    }
    if (!isOpenSourceRoute(path)) {
      document.body.classList.remove("medpath-r135-open");
      return false;
    }
    const app = document.getElementById("app");
    if (!app) return false;
    document.body.classList.add("medpath-r135-open");
    if (path === "/open-source") app.innerHTML = listPage();
    else app.innerHTML = detailPage(decodeURIComponent(path.split("/").pop() || tools[0].id));
    app.setAttribute("data-round135-owned", VERSION);
    return true;
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const routeTarget = event.target.closest("[data-r135-route]");
      if (routeTarget) {
        event.preventDefault();
        go(routeTarget.getAttribute("data-r135-route"));
        return;
      }
      const category = event.target.closest("[data-r135-category]");
      if (category) {
        currentCategory = category.getAttribute("data-r135-category") || "all";
        localStorage.setItem("medpath:r135:category", currentCategory);
        render();
        return;
      }
      const toastTarget = event.target.closest("[data-r135-toast]");
      if (toastTarget) {
        toast(toastTarget.getAttribute("data-r135-toast"));
        return;
      }
      if (event.target.closest("[data-r135-suggest]")) {
        suggestTools();
      }
    }, true);
    document.addEventListener("input", (event) => {
      if (event.target.matches("[data-r135-search]")) {
        currentQuery = event.target.value || "";
        localStorage.setItem("medpath:r135:query", currentQuery);
        render();
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
      const observer = new MutationObserver(() => {
        const path = route();
        const app = document.getElementById("app");
        const shouldOwn = isOpenSourceRoute(path) && !isProtected(path);
        const overwritten = app && app.getAttribute("data-round135-owned") === VERSION && !app.querySelector(".r135-shell");
        if (shouldOwn && (app?.getAttribute("data-round135-owned") !== VERSION || overwritten)) render();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  start();
})();

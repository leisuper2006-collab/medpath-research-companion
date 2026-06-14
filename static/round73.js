(() => {
  const DATA_BASE = window.MEDPATH_STATIC_DATA_BASE || "static-data";
  const routes = [
    ["home", "Home", "首页", "HO"],
    ["learn", "Learn", "教学", "LE"],
    ["research", "Research", "科研", "RE"],
    ["skills", "Skills", "技能", "SK"],
    ["cases", "Cases", "案例", "CA"],
    ["tools", "Tools", "工具", "TO"],
    ["plot-studio", "Plot", "绘图", "PL"],
    ["method-runner", "Runner", "运行", "RU"],
    ["community", "Community", "社区", "CO"],
    ["island", "Island", "小岛", "IS"],
    ["profile", "Profile", "主页", "PR"],
  ];

  const mobileRoutes = [
    ["home", "首页", "⌂"],
    ["research", "探索", "⌕"],
    ["island", "小岛", "◆"],
    ["community", "社区", "✦"],
    ["profile", "我的", "◎"],
  ];

  const data = {
    methods: [],
    tools: [],
    plots: [],
    articles: [],
    buildings: [],
  };

  const userState = {
    points: Number(localStorage.getItem("medpath_points") || 860),
    likedIsland: localStorage.getItem("medpath_liked_island") === "1",
    enabledSkills: new Set(JSON.parse(localStorage.getItem("medpath_enabled_skills") || "[]")),
  };

  const skillGroups = [
    {
      title: "教学场景 Skills",
      subtitle: "把备课、案例、报告训练和教学评价做成可复用任务。",
      color: "green",
      skills: [
        ["medpath-course-designer", "课程设计助手", "从一节课的目标、活动和评价开始，帮教师生成可审核的教学设计。"],
        ["pathology-case-builder", "病理 PBL 案例生成", "把病理知识点转成课堂案例、问题链和讨论提示。"],
        ["em-pathology-tutor", "超微病理导学", "用跨尺度解释帮助学生从细胞结构理解疾病机制。"],
        ["pathology-report-coach", "报告训练反馈", "针对学生报告草稿给结构、术语和证据链反馈。"],
        ["teaching-eval-assistant", "课堂评价助手", "把学习目标、任务产出和评价量规连起来。"],
      ],
    },
    {
      title: "科研训练 Skills",
      subtitle: "给科研新手一条从问题、数据、工具到文章的路线。",
      color: "lilac",
      skills: [
        ["medical-kg-rag-builder", "知识图谱与 RAG", "整理课程、文献和公开资源，形成可检索的证据底座。"],
        ["research-copilot", "科研选题助手", "帮你把大方向拆成研究问题、材料清单和验证路径。"],
        ["innovation-incubator", "创新项目孵化", "面向大创、竞赛和转化，整理场景、价值和展示材料。"],
        ["plot-studio-runner", "科研图运行器", "把数据字段、图形选择、代码和图注连成一个任务。"],
        ["literature-review-helper", "综述流程助手", "帮新手搭建检索、筛选、证据表和写作结构。"],
      ],
    },
    {
      title: "治理评价 Skills",
      subtitle: "让 AI 输出先过安全、引用和教学质量这一关。",
      color: "pink",
      skills: [
        ["ai-ethics-governor", "医学 AI 伦理治理", "检查隐私、临床误导、虚假引用和学术诚信风险。"],
        ["skill-eval-harness", "Skill 质量评测", "用量规、负样本和版本记录评价 Skill 是否可靠。"],
        ["teacher-skill-maker", "教师共创模板", "帮助课程团队把经验沉淀成可维护的 Skill。"],
        ["model-router", "模型路由", "让不同任务走合适的模型，并保留调用边界。"],
        ["citation-check-assistant", "引用核验助手", "检查结论是否有来源、是否需要待核验标记。"],
      ],
    },
  ];

  const islandBuildings = [
    ["library", "文献图书馆", "综述、Meta 分析、基金思路", "research", "18%", "16%", "#f3d986", "#d99c5f"],
    ["school", "教学楼", "课程设计、PBL、导学", "learn", "44%", "12%", "#b8d8b8", "#7fa08b"],
    ["pathlab", "病理室", "报告训练、超微病理", "cases", "69%", "20%", "#e9b7c5", "#ca7f8f"],
    ["bioinfo", "实验楼", "单细胞、扰动分析、空间组学", "research", "23%", "48%", "#b9d8ec", "#6f9fc1"],
    ["plot", "绘图工坊", "火山图、热图、森林图", "plot-studio", "50%", "46%", "#c9b8e6", "#9d83c7"],
    ["skill", "Skill 工坊", "DIY Skill 与运行模板", "skills", "75%", "50%", "#f0c28e", "#c27f4f"],
    ["community", "社区中心", "好友、拜访、排行榜", "community", "33%", "73%", "#d6e7a4", "#8dad5e"],
    ["archive", "档案馆", "我的案例、收藏、作品", "profile", "62%", "73%", "#e5d4bc", "#a9845f"],
  ];

  const articleTypes = [
    ["Meta 分析", "从 PICO、检索式、纳排标准到森林图和 PRISMA。"],
    ["系统综述", "先搭证据表，再写研究空白，不让大模型替你编结论。"],
    ["机器学习论文", "从数据划分、特征、模型、验证到可解释性图。"],
    ["数字病理论文", "把切片、标注、模型、外部验证和误差分析讲清楚。"],
    ["单细胞文章", "从质控、降维、注释、差异、通讯到机制假设。"],
    ["教学改革论文", "把教学问题、干预设计、评价指标和真实证据分开。"],
  ];

  const designLessons = [
    ["更短的句子", "把“构建闭环生态”改成“你今天想做什么？先选任务，再看示例”。"],
    ["每张卡讲一件事", "功能、示例、风险、下一步分层展示，避免一眼全是大段文字。"],
    ["图要说明功能", "示例图旁边必须写清楚：数据来源、图回答的问题、不能代表什么。"],
    ["手机优先任务", "移动端首屏只放继续任务、推荐工具、进入小岛和个人进度。"],
  ];

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function dataUrl(name) {
    return `${DATA_BASE}/${name}`;
  }

  async function readJson(name, fallback) {
    try {
      const response = await fetch(dataUrl(name));
      if (!response.ok) throw new Error(`${name}: ${response.status}`);
      return await response.json();
    } catch (_) {
      return fallback;
    }
  }

  function asset(path) {
    if (!path) return "";
    if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;
    return path.replace(/^\/+/, "");
  }

  function route() {
    const raw = (location.hash || "#/home").replace(/^#\/?/, "");
    if (!raw || raw === "/") return "home";
    const first = raw.split("/")[0];
    const redirects = {
      "open-source": "tools",
      "plot-gallery": "plot-studio",
      "island-3d": "island",
      "island-builder": "island",
      "researcher": "research",
      "journey-builder": "method-runner",
      "method-family": "research",
      "method-universe": "research",
      "article-workshop": "method-runner",
      "mobile-app": "profile",
    };
    return redirects[first] || first;
  }

  function link(to) {
    return `#/` + to;
  }

  function nav(active) {
    return routes.map(([id, en, zh, icon]) => `
      <a href="${link(id)}" class="${active === id ? "active" : ""}">
        <b>${icon}</b><span>${zh}<small>${en}</small></span><small>${id === "island" ? "新" : ""}</small>
      </a>
    `).join("");
  }

  function mobileNav(active) {
    return `<nav class="r73-mobile-nav">${mobileRoutes.map(([id, label, icon]) => `
      <a href="${link(id)}" class="${active === id ? "active" : ""}"><b>${icon}</b><span>${label}</span></a>
    `).join("")}</nav>`;
  }

  function shell(active, content) {
    return `
      <div class="r73-app">
        <aside class="r73-sidebar">
          <div class="r73-brand"><div class="r73-mark">M</div><div><strong>MedPath</strong><span>Research Companion 2.0</span></div></div>
          <nav class="r73-nav">${nav(active)}</nav>
          <div class="r73-side-card">
            <strong>每轮都按 README 验收</strong>
            <p>修分类、扩专业、补示例、重设计、做小岛、发 GitHub Pages。医学 AI 只用于教学与科研训练。</p>
          </div>
        </aside>
        <main class="r73-main">
          <header class="r73-topbar">
            <label class="r73-search"><span>Search</span><input id="r73-search" placeholder="输入：Meta分析、单细胞扰动、森林图、病理报告、Skill..." /></label>
            <a class="r73-user-mini" href="${link("profile")}"><span class="r73-avatar">易</span><span>Lv. 7<br><small>${userState.points} 积分</small></span></a>
          </header>
          <section class="r73-page">${content}</section>
        </main>
        ${mobileNav(active)}
        <button class="r73-pet" id="r73-pet" aria-label="科研小助手"><span class="r73-pet-body"></span></button>
        <div class="r73-pet-bubble" id="r73-pet-bubble">我会把长说明翻译成下一步任务。先选一个目标：写文章、找方法、画图，还是去科研小岛？</div>
      </div>
    `;
  }

  function hero({ kicker, title, body, primary, secondary, visual }) {
    return `
      <div class="r73-hero">
        <div class="r73-hero-grid">
          <div>
            <span class="r73-kicker">${esc(kicker)}</span>
            <h1>${esc(title)}</h1>
            <p>${esc(body)}</p>
            <div class="r73-actions">
              ${primary ? `<a class="r73-btn" href="${link(primary[1])}">${esc(primary[0])}</a>` : ""}
              ${secondary ? `<a class="r73-btn secondary" href="${link(secondary[1])}">${esc(secondary[0])}</a>` : ""}
            </div>
          </div>
          <div class="r73-visual-stack">${visual || homeVisual()}</div>
        </div>
      </div>
    `;
  }

  function homeVisual() {
    return `
      <div class="r73-mini-window dark">
        <strong>今天你可以这样开始</strong>
        <div class="r73-progress-line" style="margin-top:14px">
          ${[
            ["1", "我想写一篇 Meta 分析", "搭流程"],
            ["2", "我有单细胞数据，想看扰动分析", "选方法"],
            ["3", "我想画一张可发表的科研图", "查字段"],
          ].map(([n, t, s]) => `<div class="r73-progress-item"><b>${n}</b><span>${t}</span><small>${s}</small></div>`).join("")}
        </div>
      </div>
      <div class="r73-mini-window">
        <strong>平台会输出</strong>
        <div class="r73-tag-row"><span class="r73-tag green">学习路径</span><span class="r73-tag pink">示例图</span><span class="r73-tag blue">风险边界</span><span class="r73-tag yellow">下一步提示</span></div>
      </div>
    `;
  }

  function homePage() {
    const stats = [
      [`${data.methods.length || 674}`, "科研方法", "不再只讲病理，覆盖组学、统计、AI、绘图和写作。"],
      [`${data.plots.length || 100}`, "图谱模板", "每类图都解释能回答什么问题、需要哪些字段。"],
      [`${data.articles.length || 28}`, "文章流程", "从 Meta 分析到数字病理、单细胞和教改论文。"],
      ["2", "工作模式", "专业工作台 + 科研小岛，照顾学习效率和兴趣。"],
    ];
    return shell("home", `
      ${hero({
        kicker: "MedPath 2.0 重构中",
        title: "别先背概念，先说你今天想完成什么。",
        body: "我们把方法、工具、文章、图、Skill 和小岛入口放到同一个工作台里。科研新手不用先知道所有术语，只要选择任务，平台会告诉你需要什么数据、能产出什么、哪里要导师复核。",
        primary: ["进入科研工作台", "research"],
        secondary: ["切到科研小岛", "island"],
      })}
      <div class="r73-grid">
        ${stats.map(([n, t, b], i) => `
          <article class="r73-card span-3">
            <span class="r73-kicker">${n}</span>
            <h3>${t}</h3>
            <p>${b}</p>
          </article>
        `).join("")}
      </div>
      ${sectionTitle("给科研小白的四个入口", "不用先懂平台结构，先选你要做的事。每个入口后面都会给示例、字段、图和下一步。")}
      <div class="r73-grid">
        ${[
          ["我想写文章", "从文章类型开始，搭建 Meta 分析、综述、机器学习论文或教改论文的全流程。", "method-runner", "yellow"],
          ["我想找方法", "按生物信息学、单细胞、空间组学、统计和机器学习拆开，不把虚拟敲除放顶层。", "research", "green"],
          ["我想画科研图", "选火山图、热图、森林图、UMAP 等，先检查数据字段，再给代码和图注。", "plot-studio", "pink"],
          ["我想做 Skill", "把自己的方法或案例变成可展示、可评价、可放到小岛建筑里的 Skill。", "skills", "lilac"],
        ].map(([t, b, r, c]) => card(t, b, r, c)).join("")}
      </div>
      ${sectionTitle("这轮开始改什么", "以下规则已经写入 README 和主目标文档，后续每轮都要照着做。")}
      <div class="r73-grid">
        ${designLessons.map(([t, b], i) => `<article class="r73-card span-6"><span class="r73-icon ${["green","pink","yellow","lilac"][i]}">${i + 1}</span><h3>${t}</h3><p>${b}</p></article>`).join("")}
      </div>
    `);
  }

  function sectionTitle(title, body) {
    return `<div class="r73-section-title"><div><h2>${esc(title)}</h2><p>${esc(body)}</p></div></div>`;
  }

  function card(title, body, routeId, color = "green") {
    return `
      <article class="r73-card span-6">
        <span class="r73-icon ${color}">${esc(title.slice(0, 1))}</span>
        <h3>${esc(title)}</h3>
        <p>${esc(body)}</p>
        <div class="r73-actions"><a class="r73-btn secondary" href="${link(routeId)}">打开这个入口</a></div>
      </article>
    `;
  }

  function learnPage() {
    return shell("learn", `
      ${hero({
        kicker: "Learn",
        title: "把医学教学任务拆成看得懂的小步骤。",
        body: "这里不是给教师堆一堆 AI 功能，而是从一节课、一个病例、一个报告草稿开始，告诉你输入什么、输出什么、哪里必须人工复核。",
        primary: ["看教学 Skills", "skills"],
        secondary: ["生成案例模板", "cases"],
      })}
      <div class="r73-grid">
        ${[
          ["课程设计", "输入课程主题、学生层次和课时，输出目标、活动、评价和复核清单。", "skills", "green"],
          ["PBL 案例", "把病理知识点变成问题链、讨论材料和教师提示。", "cases", "yellow"],
          ["超微病理导学", "从细胞器、超微结构到病理机制，用跨尺度解释帮助学生理解。", "cases", "blue"],
          ["报告训练", "学生先写报告草稿，平台只给教学反馈，不给真实诊断结论。", "skills", "pink"],
        ].map(([t,b,r,c]) => card(t,b,r,c)).join("")}
      </div>
    `);
  }

  function researchPage() {
    const methods = data.methods.slice(0, 12);
    const perturbTools = data.tools.filter((t) => /GEARS|scGen|CPA|chemCPA|scGPT|perturb|knock|scTenifold/i.test(`${t.name} ${t.short_description || ""}`)).slice(0, 8);
    return shell("research", `
      ${hero({
        kicker: "Research Workbench",
        title: "科研方法按问题组织，不按热词堆叠。",
        body: "虚拟敲除已经降级到单细胞扰动分析的子方向。你可以从数据类型、研究问题和输出图开始，而不是一上来就被几十个模型名困住。",
        primary: ["看单细胞扰动路径", "method-runner"],
        secondary: ["打开工具导航", "tools"],
      })}
      ${sectionTitle("新的研究分类", "先分大方向，再进入方法族。每个方法族都要提供示例输入、示例输出、学习路径和风险边界。")}
      <div class="r73-grid">
        ${[
          ["生物信息学", "RNA-seq、单细胞、空间组学、扰动分析、通路富集。", "tools", "green"],
          ["医学 AI", "计算病理、图像预处理、模型评估、可解释性。", "tools", "blue"],
          ["统计与循证", "生存分析、Meta 分析、回归、混杂控制、样本量。", "plot-studio", "yellow"],
          ["科研写作", "综述、基金、论文结构、图表计划和引用核验。", "method-runner", "pink"],
        ].map(([t,b,r,c]) => card(t,b,r,c)).join("")}
      </div>
      ${sectionTitle("虚拟扰动应该放在这里", "路径：生物信息学 -> 单细胞 -> 扰动分析。它不是网站一级大类，而是一类特定数据和问题下的方法。")}
      <div class="r73-list">
        ${[
          ["GEARS", "适合基因扰动组合预测。先确认数据是否有扰动标签和足够细胞数。"],
          ["scGen", "适合学习细胞状态迁移，不适合替代真实实验验证。"],
          ["CPA / chemCPA", "面向药物或扰动条件建模，需要明确处理条件和批次。"],
          ["scGPT perturbation", "适合探索大模型单细胞表征，但必须检查训练域和输出可信度。"],
          ["scTenifoldKnk", "从网络扰动角度做虚拟敲除，输出更适合假设生成。"],
        ].concat(perturbTools.map((t) => [t.name, t.short_description || t.when_to_use || "待补充真实仓库核验。"])).slice(0, 10).map(([t,b], i) => listItem(t, b, "method-runner", ["green","lilac","pink","yellow"][i % 4])).join("")}
      </div>
      ${sectionTitle("从库里抽取的其他方法示例", "这一块后续会做成几百个方法的分层浏览，现在先展示已有数据可被新壳层复用。")}
      <div class="r73-grid">
        ${methods.map((m, i) => `<article class="r73-card span-4"><span class="r73-tag ${["green","pink","blue","yellow"][i % 4]}">${esc(m.category || "方法")}</span><h3>${esc(m.name || m.zh_name || "研究方法")}</h3><p>${esc(m.what_it_solves || m.beginner_question || m.detail_novice_intro || "后续会补充真实示例、字段要求和风险边界。")}</p></article>`).join("")}
      </div>
    `);
  }

  function listItem(title, body, routeId, color = "green") {
    return `<article class="r73-list-item"><span class="r73-icon ${color}">${esc(title.slice(0, 1))}</span><div><strong>${esc(title)}</strong><p>${esc(body)}</p></div><a class="r73-btn secondary" href="${link(routeId)}">查看</a></article>`;
  }

  function skillsPage() {
    return shell("skills", `
      ${hero({
        kicker: "Skills Market",
        title: "Skill 不是提示词，是能被复用和检查的任务单元。",
        body: "每个 Skill 都应该写清楚适用场景、不适用场景、输入、输出、示例、引用、风险和人工复核。未来还能放到科研小岛建筑上展示。",
        primary: ["去 Skill 工坊", "island"],
        secondary: ["看评价中心", "community"],
      })}
      <div class="r73-grid">
        ${skillGroups.map((group) => `
          <article class="r73-card span-4">
            <span class="r73-icon ${group.color}">${group.title.slice(0,1)}</span>
            <h3>${group.title}</h3>
            <p>${group.subtitle}</p>
            <div class="r73-tag-row">${group.skills.map((s) => `<span class="r73-tag">${esc(s[1])}</span>`).join("")}</div>
          </article>
        `).join("")}
      </div>
      ${sectionTitle("Skill 卡片要写得像产品，而不是像目录", "下面每个 Skill 的说明都不重复：它告诉新手这个 Skill 解决什么问题、输入什么、输出什么、哪里必须教师复核。")}
      <div class="r73-list">
        ${skillGroups.flatMap((g) => g.skills.map((s, i) => listItem(s[1], s[2], "method-runner", g.color))).join("")}
      </div>
    `);
  }

  function casesPage() {
    return shell("cases", `
      ${hero({
        kicker: "Cases",
        title: "案例不是病例。这里先做教学模拟，再让教师复核。",
        body: "所有案例必须标注公开、脱敏或合成来源。合成案例只能用于教学推理训练，不代表真实患者，也不能作为临床诊断依据。",
        primary: ["生成一个教学案例", "method-runner"],
        secondary: ["去伦理治理", "skills"],
      })}
      <div class="r73-grid">
        ${[
          ["病理 PBL 案例", "适合课堂讨论，包含背景、镜下特征、问题链和教师提示。"],
          ["报告训练样例", "给学生一段草稿，再返回结构、术语和证据链反馈。"],
          ["科研拓展案例", "从病例知识点延伸到文献、机制假设和研究设计。"],
          ["伦理审计案例", "专门训练隐私、虚假引用、临床误导和学术诚信判断。"],
        ].map(([t,b],i)=>card(t,b,"method-runner",["green","pink","yellow","lilac"][i])).join("")}
      </div>
    `);
  }

  function toolsPage() {
    const tools = data.tools.slice(0, 24);
    return shell("tools", `
      ${hero({
        kicker: "Open Source Navigator",
        title: "先问工具能帮你做什么，再决定要不要安装。",
        body: "新版工具导航会按学科、数据类型、输入输出、License 和新手友好度筛选。虚拟扰动类工具会放在单细胞扰动分析下面，而不是顶层大类。",
        primary: ["打开方法运行器", "method-runner"],
        secondary: ["看科研工作台", "research"],
      })}
      ${sectionTitle("开源工具要像产品说明页", "每个工具都要说明用途、输入、输出、仓库、论文、License、常见坑和适合新手的第一步。")}
      <div class="r73-grid">
        ${tools.map((t, i) => `<article class="r73-card span-4">
          <span class="r73-tag ${["green","pink","blue","yellow"][i % 4]}">${esc(t.category || "开源工具")}</span>
          <h3>${esc(t.name || "Tool")}</h3>
          <p>${esc(t.short_description || t.when_to_use || "该工具需要补充真实仓库、许可和最小示例。")}</p>
          <div class="r73-tag-row"><span class="r73-tag">输入：${esc((t.input_requirements || ["数据表"])[0])}</span><span class="r73-tag">License：${esc(t.license || "待核对")}</span></div>
        </article>`).join("")}
      </div>
    `);
  }

  function plotPage() {
    const featured = data.plots.slice(0, 12);
    return shell("plot-studio", `
      ${hero({
        kicker: "Plot Studio",
        title: "科研图先审字段，再谈美化。",
        body: "每种图都要告诉你：它回答什么问题，需要哪些列，示例图长什么样，常见错误是什么，最后怎么写图注和 Methods。",
        primary: ["看图谱示例", "plot-studio"],
        secondary: ["去数据审查", "method-runner"],
        visual: plotVisual(),
      })}
      <div class="r73-grid">
        ${featured.map((p, i) => figureCard(p, i)).join("")}
      </div>
    `);
  }

  function plotVisual() {
    return `
      <figure class="r73-proof">
        <img src="${asset("outputs/plot/volcano.svg")}" alt="火山图示例" />
        <figcaption>示例图为教学演示。正式使用时需要检查差异分析表是否包含 logFC、P 值、校正 P 值和基因名。</figcaption>
      </figure>
    `;
  }

  function figureCard(p, i) {
    const visual = p.example_visual?.url || ["outputs/plot/volcano.svg","outputs/plot/heatmap.svg","outputs/plot/boxplot.svg","outputs/plot/scatter.svg"][i % 4];
    return `<article class="r73-card span-4">
      <figure class="r73-proof"><img src="${asset(visual)}" alt="${esc(p.zh_name || p.name || "图谱")}" /><figcaption>${esc(p.public_source_example?.citation || "教学示例图，需结合自己的数据重新生成。")}</figcaption></figure>
      <h3>${esc(p.zh_name || p.en_name || "科研图")}</h3>
      <p>${esc(p.plot_when_to_use || p.question_answered || "先确认科研问题和字段，再生成图。")}</p>
    </article>`;
  }

  function runnerPage() {
    return shell("method-runner", `
      ${hero({
        kicker: "Method Runner",
        title: "把一句需求拆成可执行流程。",
        body: "例如“我想做基因敲除”会先区分真实实验、RNA 干扰、CRISPR、单细胞扰动预测、网络虚拟敲除等路线，再提示你需要的数据和复核点。",
        primary: ["试一个文章流程", "method-runner"],
        secondary: ["查看工具", "tools"],
      })}
      <div class="r73-grid">
        ${[
          ["Meta 分析全流程", "PICO、检索式、筛选、偏倚评价、森林图、敏感性分析、PRISMA。"],
          ["单细胞扰动分析", "确认数据类型、扰动标签、细胞数、批次，再选择 GEARS/scGen/CPA 等。"],
          ["科研图审查", "上传字段说明，先检查数据是否适合画目标图，再生成代码和图注。"],
          ["病理报告反馈", "只给教学反馈，不给真实诊断，输出教师复核清单。"],
        ].map(([t,b], i) => card(t,b, i === 1 ? "research" : "plot-studio", ["green","lilac","yellow","pink"][i])).join("")}
      </div>
      ${sectionTitle("20+ 文章类型会这样做", "后续每个文章类型都要有从 0 到 1 的 Skill：材料清单、流程、图表、质量审查、模型提示和人工复核。")}
      <div class="r73-list">
        ${articleTypes.map(([t,b], i) => listItem(t, b, "method-runner", ["green","pink","yellow","lilac"][i % 4])).join("")}
      </div>
    `);
  }

  function communityPage() {
    const makers = [
      ["易磊", "基医拔尖 2401", "发布了单细胞扰动学习岛", 128],
      ["病理课程组", "教师团队", "整理了 12 个报告训练模板", 104],
      ["绘图工坊用户", "科研绘图", "复刻了公开 BRCA 突变分布图", 92],
      ["Skill Builder", "开源共创", "上传了 Meta 分析流程 Skill", 76],
    ];
    return shell("community", `
      ${hero({
        kicker: "Community",
        title: "让会学习、会整理、会共创的人被看见。",
        body: "社区不是灌水区。这里展示高质量 Skill、案例、图谱、小岛和学习路径。点赞、收藏、拜访和排行榜会鼓励大家把科研学习做成作品。",
        primary: ["看我的主页", "profile"],
        secondary: ["拜访科研小岛", "island"],
      })}
      <div class="r73-grid">
        <article class="r73-card span-8">
          <h3>本周创作者排行榜</h3>
          <div class="r73-leaderboard">${makers.map((m,i)=>`<div class="r73-rank"><b>${i+1}</b><span><strong>${m[0]}</strong><br><small>${m[1]} · ${m[2]}</small></span><strong>${m[3]} 赞</strong></div>`).join("")}</div>
        </article>
        <article class="r73-card span-4">
          <h3>社区机制</h3>
          <p>后续会补齐好友、关注、评论、拜访请求、作品审核和举报入口。当前公开站先展示交互原型和数据结构。</p>
          <div class="r73-tag-row"><span class="r73-tag green">点赞</span><span class="r73-tag pink">收藏</span><span class="r73-tag yellow">拜访</span><span class="r73-tag lilac">积分</span></div>
        </article>
      </div>
    `);
  }

  function profilePage() {
    return shell("profile", `
      ${hero({
        kicker: "Profile",
        title: "个人主页要像科研成长档案。",
        body: "这里会集中展示你的 Skill、案例、工具箱、科研图、小岛、积分、等级、成就和收藏。未来别人可以申请拜访你的科研小岛，看你把哪些功能做成了建筑。",
        primary: ["进入我的小岛", "island"],
        secondary: ["看社区榜单", "community"],
      })}
      <div class="r73-grid">
        <article class="r73-card span-4"><span class="r73-avatar" style="width:72px;height:72px">易</span><h3>易磊</h3><p>中南大学湘雅基础医学院基医拔尖 2401。当前目标：把科研学习、医学教育和 AI Skill 做成人人看得懂的入口。</p></article>
        <article class="r73-card span-4"><h3>我的积分</h3><p style="font-size:44px;color:#171717;font-weight:900">${userState.points}</p><p>发布 Skill、整理案例、画图、被点赞、完成学习路径都可以获得积分。</p></article>
        <article class="r73-card span-4"><h3>我的成就</h3><div class="r73-tag-row"><span class="r73-tag green">Skill Builder</span><span class="r73-tag pink">科研小岛建筑师</span><span class="r73-tag yellow">图谱整理者</span></div></article>
        ${[
          ["我的 Skills", "课程设计助手、扰动分析路线、Meta 分析流程。"],
          ["我的案例", "合成教学案例、病理报告训练样例、科研拓展任务。"],
          ["我的工具箱", "DESeq2、Seurat、cBioPortal、maftools、OpenSlide。"],
          ["我的小岛", "图书馆、教学楼、实验楼、Skill 工坊和绘图工坊。"],
        ].map(([t,b],i)=>card(t,b,i===3?"island":"tools",["green","pink","yellow","lilac"][i])).join("")}
      </div>
    `);
  }

  function islandPage() {
    return shell("island", `
      ${hero({
        kicker: "Research Island MVP",
        title: "把常用科研功能摆成你自己的小岛。",
        body: "建筑不是装饰。图书馆通向综述，实验楼通向单细胞和扰动分析，绘图工坊通向科研图。未来你做好的 Skill 可以变成建筑，别人也能拜访、点赞和收藏。",
        primary: ["拜访社区", "community"],
        secondary: ["编辑个人主页", "profile"],
        visual: `<div class="r73-mini-window dark"><strong>小岛机制</strong><p>点击建筑 -> 弹出对话 -> 选择任务 -> 跳转页面 -> 完成后得积分。</p><div class="r73-tag-row"><span class="r73-tag green">建筑</span><span class="r73-tag yellow">对话</span><span class="r73-tag pink">积分</span></div></div>`,
      })}
      <div class="r73-grid">
        <article class="r73-card span-8">
          <div class="r73-island-stage" id="r73-island-stage">
            <div class="r73-river"></div><div class="r73-path"></div>
            ${["8%:68%","13%:34%","78%:14%","84%:72%","54%:29%","38%:60%"].map((pos)=>{ const [l,t]=pos.split(":"); return `<span class="r73-tree" style="left:${l};top:${t}"></span>`; }).join("")}
            ${islandBuildings.map((b) => `<button class="r73-building" data-building="${b[0]}" style="left:${b[4]};top:${b[5]};--c1:${b[6]};--c2:${b[7]}">${b[1]}<small>${b[2]}</small></button>`).join("")}
            <span class="r73-avatar-character"></span>
            <div class="r73-dialog" id="r73-island-dialog"><h3>欢迎来到科研小岛</h3><p>点一栋建筑，我会告诉你它能帮你完成什么任务。这个版本是低多边形 MVP，后续会升级 Three.js/React Three Fiber。</p><a class="r73-btn soft" href="${link("profile")}">查看我的积分</a></div>
          </div>
        </article>
        <article class="r73-card span-4">
          <h3>小岛激励</h3>
          <p>制作案例、发布 Skill、整理图谱、完成学习路径都能得积分。积分可以兑换建筑、皮肤、装饰和徽章。</p>
          <div class="r73-leaderboard" style="margin-top:14px">
            <div class="r73-rank"><b>1</b><span>Skill 被收藏</span><strong>+80</strong></div>
            <div class="r73-rank"><b>2</b><span>小岛被点赞</span><strong>+50</strong></div>
            <div class="r73-rank"><b>3</b><span>完成方法学习</span><strong>+30</strong></div>
          </div>
          <button class="r73-btn" id="r73-like-island" style="margin-top:14px">${userState.likedIsland ? "已点赞这个小岛" : "给这个小岛点赞"}</button>
        </article>
      </div>
    `);
  }

  function fallbackPage(name) {
    return shell("home", `
      ${hero({
        kicker: "页面正在重构",
        title: "这个入口已经纳入 2.0 改版清单。",
        body: `你打开的是 ${name}。Round73 先接管核心导航，后续会把这个页面按 README 的新标准重做：更短文案、示例图、学习路径和移动端适配。`,
        primary: ["回首页", "home"],
        secondary: ["看重构目标", "profile"],
      })}
    `);
  }

  /* Round107 ordinary site replacement inside round73 runtime.
     round73 owns the ordinary workbench after app.js, so these overrides make
     the actually visible GitHub Pages version match the new product direction. */

  function r107Routes() {
    return [
      ["home", "首页", "今天从哪开始"],
      ["research", "科研导航", "找方法与路线"],
      ["skills", "Skills", "可调用能力"],
      ["plot-studio", "科研绘图", "看图例与代码"],
      ["method-runner", "文章流程", "从0搭框架"],
      ["tools", "开源工具", "仓库怎么用"],
      ["cases", "案例模板", "教学与科研样例"],
      ["community", "社区", "排行与收藏"],
      ["profile", "我的主页", "作品与积分"],
      ["island", "科研小岛", "游戏化入口"],
    ];
  }

  function nav(active) {
    return r107Routes().map(([id, zh, desc]) => `
      <a href="${link(id)}" class="${active === id ? "active" : ""}">
        <span>${esc(zh)}<small>${esc(desc)}</small></span>
      </a>
    `).join("");
  }

  function mobileNav(active) {
    return `<nav class="r73-mobile-nav r107-mobile-dock">${[
      ["home", "首页"],
      ["research", "方法"],
      ["plot-studio", "绘图"],
      ["skills", "Skills"],
      ["island", "小岛"],
    ].map(([id, label]) => `<a href="${link(id)}" class="${active === id ? "active" : ""}"><span>${esc(label)}</span></a>`).join("")}</nav>`;
  }

  function shell(active, content) {
    return `
      <div class="r73-app r107-layout">
        <aside class="r73-sidebar r107-sidebar">
          <a class="r73-brand r107-brand" href="${link("home")}">
            <div><strong>MedPath</strong><span>科研学习工作台</span></div>
          </a>
          <nav class="r73-nav r107-nav-group">${nav(active)}</nav>
          <div class="r73-side-card r107-side-note">
            <strong>每轮按 README 验收</strong>
            <p>分类、文案、示例、移动端和发布都要检查。医学 AI 仅用于教学与科研训练。</p>
          </div>
        </aside>
        <main class="r73-main r107-workspace">
          <header class="r73-topbar r107-topbar">
            <label class="r73-search r107-command"><input id="r73-search" placeholder="搜索：Meta分析、单细胞、森林图、工程质控、Skill..." /></label>
            <a class="r73-user-mini r107-user-mini" href="${link("profile")}"><span class="r73-avatar">易</span><span>Lv. 7<br><small>${userState.points} 积分</small></span></a>
          </header>
          <section class="r73-page r107-page">${content}</section>
        </main>
        ${mobileNav(active)}
        <button class="r73-pet r107-pet" id="r73-pet" aria-label="页面助手"><span>AI</span></button>
        <div class="r73-pet-bubble r107-pet-bubble" id="r73-pet-bubble">你可以问：我该画什么图？我该写哪类文章？我该用哪个方法？如果配置了自己的模型 API，后续会改为真实模型回答；未配置时先用本地规则推荐。</div>
      </div>
    `;
  }

  function r107Hero(title, body, primary = ["按问题找方法", "research"], secondary = ["先看示例图", "plot-studio"]) {
    return `
      <section class="r107-hero">
        <div class="r107-hero-copy">
          <span class="r107-eyebrow">Research Companion</span>
          <h1>${esc(title)}</h1>
          <p>${esc(body)}</p>
          <div class="r107-hero-actions">
            <a class="btn" href="${link(primary[1])}">${esc(primary[0])}</a>
            <a class="btn ghost" href="${link(secondary[1])}">${esc(secondary[0])}</a>
          </div>
        </div>
        <aside class="r107-hero-panel">
          <strong>今天可以这样开始</strong>
          <div class="r107-quick-list">
            <a href="${link("method-runner")}"><span>我要写文章</span><small>Meta、综述、机器学习、教改论文，一步步搭流程。</small></a>
            <a href="${link("plot-studio")}"><span>我要做图</span><small>先看示例，再检查字段，最后选 R 或 Python 包。</small></a>
            <a href="${link("research")}"><span>我不知道方法</span><small>按研究问题推荐生信、统计、AI、工程和社科路线。</small></a>
          </div>
        </aside>
      </section>`;
  }

  function r107Section(title, sub, body = "") {
    return `<div class="r107-section-head"><span>${esc(sub)}</span><h2>${esc(title)}</h2>${body ? `<p>${esc(body)}</p>` : ""}</div>`;
  }

  function r107Preview(type = "scatter") {
    if (type === "scatter") {
      return `<svg viewBox="0 0 260 150"><rect width="260" height="150" rx="18" fill="#f7fbfa"/><path d="M32 122 L232 122 M32 122 L32 24" stroke="#d5dfdd" stroke-width="2"/><path d="M42 114 C84 82 116 88 154 55 C184 29 205 42 226 27" fill="none" stroke="#0f766e" stroke-width="4"/>${[38,52,70,88,104,121,144,160,178,199,216].map((x, i) => `<circle cx="${x}" cy="${110 - i * 7 + (i % 3) * 10}" r="4.6" fill="${i % 2 ? "#f28c7b" : "#2a9d8f"}"/>`).join("")}</svg>`;
    }
    if (type === "heatmap") {
      return `<svg viewBox="0 0 260 150"><rect width="260" height="150" rx="18" fill="#fff8f4"/>${Array.from({length: 36}).map((_, i) => `<rect x="${36 + (i % 9) * 21}" y="${28 + Math.floor(i / 9) * 23}" width="18" height="18" rx="4" fill="${["#5fbfac","#f5cf69","#ff876f","#6c93d8"][i % 4]}" opacity="${.45 + (i % 5) * .1}"/>`).join("")}</svg>`;
    }
    if (type === "paper") {
      return `<svg viewBox="0 0 260 150"><rect width="260" height="150" rx="18" fill="#fff8f7"/>${["问题","数据","图表","初稿"].map((t, i) => `<g transform="translate(${24 + i * 58},34)"><rect width="46" height="70" rx="12" fill="#fff" stroke="#f0b8ae"/><text x="23" y="42" text-anchor="middle" font-size="12" fill="#7a403a">${t}</text></g>`).join("")}<path d="M75 68 H88 M133 68 H146 M191 68 H204" stroke="#f28c7b" stroke-width="3" stroke-linecap="round"/></svg>`;
    }
    if (type === "network") {
      return `<svg viewBox="0 0 260 150"><rect width="260" height="150" rx="18" fill="#f5f8ff"/>${[[60,78],[120,44],[160,92],[205,55],[92,112]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="18" fill="#fff" stroke="#7aa7ff" stroke-width="3"/>`).join("")}<path d="M76 70 L105 52 M137 53 L145 80 M176 82 L193 64 M75 90 L94 104 M112 104 L144 94" stroke="#4d78d6" stroke-width="3"/></svg>`;
    }
    return `<svg viewBox="0 0 260 150"><rect width="260" height="150" rx="18" fill="#fffaf0"/>${[0,1,2,3].map((r) => [0,1,2,3].map((c) => `<rect x="${32 + c * 48}" y="${28 + r * 24}" width="42" height="18" rx="5" fill="${r === 0 ? "#f7c76f" : "#fff"}" stroke="#ead8ae"/>`).join("")).join("")}</svg>`;
  }

  function r107ProductCard(item) {
    return `<article class="r107-product-card">
      <div class="r107-product-preview">${r107Preview(item.preview)}</div>
      <div class="r107-product-copy"><span>${esc(item.kicker)}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p><small>${esc(item.result)}</small></div>
      <a class="r107-card-action" href="${link(item.route)}">进入</a>
    </article>`;
  }

  function r107PackageHints(plot = {}) {
    const hay = `${plot.id || ""} ${plot.name || ""} ${plot.zh_name || ""} ${plot.en_name || ""} ${plot.category || ""}`.toLowerCase();
    if (/volcano|火山/.test(hay)) return { r: ["ggplot2", "EnhancedVolcano"], py: ["matplotlib"], field: "医学/生物" };
    if (/heatmap|热图/.test(hay)) return { r: ["ComplexHeatmap", "pheatmap"], py: ["seaborn"], field: "生物/工程" };
    if (/umap|tsne|single|单细胞/.test(hay)) return { r: ["Seurat", "ggplot2"], py: ["scanpy"], field: "单细胞/空间组学" };
    if (/forest|meta|森林/.test(hay)) return { r: ["meta", "metafor"], py: ["statsmodels"], field: "医学/社科综述" };
    if (/network|tree|map|网络|地图/.test(hay)) return { r: ["igraph", "sf"], py: ["networkx", "geopandas"], field: "网络/地图/人文" };
    if (/radar|gantt|timeline|雷达|时间/.test(hay)) return { r: ["ggplot2", "fmsb"], py: ["plotly"], field: "工程/项目管理" };
    return { r: ["ggplot2"], py: ["seaborn"], field: "跨学科" };
  }

  function r107PlotCard(plot = {}, index = 0) {
    const hints = r107PackageHints(plot);
    const title = plot.zh_name || plot.name || plot.en_name || plot.id || "科研图";
    const visual = plot.example_visual || {};
    const src = "";
    const columns = (plot.plot_data_contract || plot.what_it_needs || []).map((x) => x.field || x).filter(Boolean).slice(0, 3);
    return `<article class="r107-plot-card">
      <div class="r107-plot-media">${src ? `<img src="${esc(src)}" alt="${esc(title)}" loading="lazy" />` : r107Preview(index % 3 === 0 ? "scatter" : (index % 3 === 1 ? "heatmap" : "network"))}</div>
      <div class="r107-plot-body">
        <div class="r107-plot-title"><h3>${esc(title)}</h3><span>${esc(hints.field)}</span></div>
        <p>${esc(plot.answers_question || plot.question_answered || "先判断它回答什么问题，再整理字段。")}</p>
        <div class="r107-package-row"><b>R</b>${hints.r.map((x) => `<code>${esc(x)}</code>`).join("")}</div>
        <div class="r107-package-row"><b>Python</b>${hints.py.map((x) => `<code>${esc(x)}</code>`).join("")}</div>
        <small>${columns.length ? `需要字段：${columns.join(" / ")}` : "适合先上传表头做字段审查"}</small>
      </div>
      <div class="r107-plot-actions"><a href="${link("plot-studio")}">看详情</a><button type="button">开始</button></div>
    </article>`;
  }

  function homePage() {
    const products = [
      { title: "科研绘图助手", kicker: "Plot Studio", body: "不知道该画什么图时，先看示例，再看字段和 R/Python 包。", result: "输出：示例图、字段要求、代码路线", route: "plot-studio", preview: "scatter" },
      { title: "文章流程搭建", kicker: "Paper Builder", body: "Meta 分析、机制研究、AI 医学论文，从材料到图表一步步搭。", result: "输出：章节、图表、审稿风险", route: "method-runner", preview: "paper" },
      { title: "方法选择器", kicker: "Method Router", body: "把“我想研究什么”翻译成可执行的方法路线。", result: "输出：方法、输入、误区、学习路径", route: "research", preview: "network" },
      { title: "数据体检", kicker: "Data Audit", body: "字段缺不缺、分组清不清、是否适合直接分析，先查再做。", result: "输出：缺失字段、修表建议", route: "tools", preview: "table" },
      { title: "Skill 工坊", kicker: "Skill Builder", body: "把常用科研动作做成自己的 AI Skill，之后反复调用。", result: "输出：SKILL.md、示例、复核清单", route: "skills", preview: "network" },
    ];
    const plots = (data.plots.length ? data.plots : [
      { zh_name: "森林图", category: "Meta分析", answers_question: "多项研究的效应方向是否一致？" },
      { zh_name: "响应面图", category: "工程实验", answers_question: "两个因素如何共同影响结果？" },
      { zh_name: "Likert量表图", category: "社科问卷", answers_question: "不同题项的态度分布是否一致？" },
      { zh_name: "UMAP", category: "单细胞", answers_question: "细胞群体是否形成可解释结构？" },
      { zh_name: "文本共现网络", category: "数字人文", answers_question: "关键词或人物之间怎样连接？" },
    ]).slice(0, 10);
    return shell("home", `
      ${r107Hero("别先背概念，先说你今天想完成什么。", "我们把方法、工具、文章、图、Skill 和小岛入口放到同一个工作台里。科研新手只要选择任务，平台会告诉你需要什么数据、能产出什么、哪里要导师复核。", ["进入科研工作台", "research"], ["切到科研小岛", "island"])}
      <section class="r107-section">${r107Section("常用能力", "一行五张卡片", "像产品一样写清楚效果，而不是堆 Skill 名。")}<div class="r107-product-grid">${products.map(r107ProductCard).join("")}</div></section>
      <section class="r107-section">${r107Section("先看示例图，再选方法", "科研绘图", "医学、生物、工程、社科和人文都能找到入口。")}<div class="r107-plot-strip">${plots.map(r107PlotCard).join("")}</div></section>
      <section class="r107-section">${r107Section("给科研新手的四条路", "学习路径", "不用一次学完全部。先选一个今天真正要完成的任务。")}<div class="r107-path-grid">
        ${[
          ["我要写 Meta 分析", "先定 PICO，再做检索式、筛选表、森林图和偏倚风险。", "method-runner"],
          ["我要做单细胞分析", "从 QC、聚类、注释、差异、通路到扰动预测。", "research"],
          ["我要做工程实验图", "从因素设计、响应面、误差条到质量控制图。", "plot-studio"],
          ["我要做人文社科图", "从问卷量表、文本共现、网络图到叙事证据。", "plot-studio"],
        ].map(([t,b,h]) => `<a class="r107-path-card" href="${link(h)}"><strong>${esc(t)}</strong><span>${esc(b)}</span></a>`).join("")}
      </div></section>
    `);
  }

  function skillsPage() {
    const cards = skillGroups.flatMap((group) => group.skills.map((s) => ({ group: group.title, id: s[0], title: s[1], body: s[2] }))).slice(0, 15);
    return shell("skills", `
      ${r107Hero("Skills 要像产品，不要像目录。", "每张卡片都写清楚：它帮谁解决什么问题、需要什么输入、会产出什么结果。后续这些 Skill 可以放到科研小岛建筑上。", ["去绘图页看示例", "plot-studio"], ["进入小岛", "island"])}
      <section class="r107-section">${r107Section("Skill 市场", "一行五张", "先展示核心效果，再进入详情。")}<div class="r107-product-grid">
        ${cards.map((item, i) => r107ProductCard({ title: item.title, kicker: item.group.replace(" Skills", ""), body: item.body, result: `代号：${item.id}`, route: "skills", preview: ["scatter","paper","network","table","heatmap"][i % 5] })).join("")}
      </div></section>
    `);
  }

  function plotPage() {
    const plots = (data.plots.length ? data.plots : [
      { zh_name: "散点图", category: "通用科研", answers_question: "两个连续变量是否相关？" },
      { zh_name: "热图", category: "组学/工程", answers_question: "样本和特征是否有聚类模式？" },
      { zh_name: "森林图", category: "Meta分析", answers_question: "多项研究效应是否一致？" },
      { zh_name: "Likert量表图", category: "社科问卷", answers_question: "态度分布如何？" },
      { zh_name: "响应面图", category: "工程实验", answers_question: "因素组合如何影响结果？" },
      { zh_name: "UMAP", category: "单细胞", answers_question: "细胞群体结构如何？" },
    ]).slice(0, 80);
    const categories = ["全部", "医学/生物", "工程", "社科", "人文", "Meta分析", "单细胞", "网络/地图"];
    return shell("plot-studio", `
      <section class="r107-plot-page">
        <aside class="r107-plot-rail">
          <div class="r107-plot-brand">Plot Studio</div>
          ${categories.map((c, i) => `<button class="${i === 0 ? "active" : ""}" type="button">${esc(c)}</button>`).join("")}
          <div class="r107-plot-help"><strong>怎么选图？</strong><p>先看图回答的问题，再看你的字段是否够用。拿不准就点右下角助手。</p></div>
        </aside>
        <main class="r107-plot-main">
          <div class="r107-plot-hero"><div><span>科研绘图工作室</span><h1>每张图都要回答一个问题。</h1><p>卡片直接展示示例图、R/Python 包和适用学科。医学、生物、工程、社科、人文都纳入同一个图谱选择器。</p></div><div class="r107-search-row"><input placeholder="搜索：火山图、PCA、森林图、Likert、响应面、网络图..." /><select><option>全部分类</option></select></div></div>
          <div class="r107-plot-grid">${plots.map(r107PlotCard).join("")}</div>
        </main>
      </section>
    `);
  }

  /* Round108: KaiTi + summer lotus guofeng workbench.
     This block intentionally overrides the Round107 ordinary-site pages because
     round73.js is the visible runtime on GitHub Pages. */

  const r108FigureBase = "outputs/round108_lotus_plots/";
  const r108FigureFiles = [
    "single_cell_atlas_panel.svg",
    "scatter_regression.svg",
    "heatmap_matrix.svg",
    "forest_meta.svg",
    "volcano_plot.svg",
    "pca_ordination.svg",
    "likert_stack.svg",
    "response_surface.svg",
    "workflow_network.svg",
  ];

  const r108PlotCatalog = [
    { title: "单细胞转录组测序", tag: "医学 / 生物", question: "看细胞亚群、标志基因和组成差异。", r: ["Seurat", "ggplot2"], py: ["scanpy"], fields: "表达矩阵 / 分组 / 细胞注释", asset: "single_cell_atlas_panel.svg" },
    { title: "散点与回归", tag: "通用科研", question: "判断两个连续变量是否相关。", r: ["ggplot2"], py: ["seaborn"], fields: "x / y / 分组", asset: "scatter_regression.svg" },
    { title: "热图", tag: "组学 / 工程", question: "看样本和特征有没有聚集模式。", r: ["ComplexHeatmap", "pheatmap"], py: ["seaborn"], fields: "样本 / 特征 / 数值", asset: "heatmap_matrix.svg" },
    { title: "森林图", tag: "Meta / 临床", question: "比较多项研究的效应方向和区间。", r: ["meta", "metafor"], py: ["statsmodels"], fields: "研究名 / 效应值 / 置信区间", asset: "forest_meta.svg" },
    { title: "火山图", tag: "转录组", question: "同时看差异幅度和显著性。", r: ["ggplot2", "EnhancedVolcano"], py: ["matplotlib"], fields: "log2FC / P值 / 基因名", asset: "volcano_plot.svg" },
    { title: "PCA 主成分分析", tag: "多变量", question: "看样本整体差异和分组分离。", r: ["ggplot2", "FactoMineR"], py: ["sklearn"], fields: "样本矩阵 / 分组", asset: "pca_ordination.svg" },
    { title: "Likert 量表图", tag: "社科 / 教育", question: "展示问卷态度分布。", r: ["ggplot2"], py: ["plotly"], fields: "题项 / 选项 / 比例", asset: "likert_stack.svg" },
    { title: "响应面图", tag: "工程 / 药学", question: "分析两个因素如何共同影响结果。", r: ["ggplot2"], py: ["matplotlib"], fields: "因素A / 因素B / 响应值", asset: "response_surface.svg" },
    { title: "流程网络图", tag: "人文 / 管理", question: "说明方法、人物或概念之间的关系。", r: ["igraph", "ggraph"], py: ["networkx"], fields: "节点 / 边 / 权重", asset: "workflow_network.svg" },
  ];

  function r108Routes() {
    return [
      ["home", "探索方法"],
      ["plot-studio", "科研绘图"],
      ["skills", "Skill 市场"],
      ["research", "学习路径"],
      ["tools", "公开工具"],
      ["community", "社区交流"],
      ["island", "科研小岛"],
    ];
  }

  function nav(active) {
    return r108Routes().map(([id, label]) => `<a href="${link(id)}" class="${active === id ? "active" : ""}">${esc(label)}</a>`).join("");
  }

  function mobileNav(active) {
    return `<nav class="r73-mobile-nav r108-mobile-nav">${[
      ["home", "首页"],
      ["plot-studio", "绘图"],
      ["skills", "技能"],
      ["community", "社区"],
      ["island", "小岛"],
    ].map(([id, label]) => `<a href="${link(id)}" class="${active === id ? "active" : ""}">${esc(label)}</a>`).join("")}</nav>`;
  }

  function r108Steps(active = 1) {
    const steps = ["提出问题", "设计研究", "获取数据", "分析验证", "解读结果", "伦理与安全", "分享复现"];
    return `<div class="r108-step-list">${steps.map((s, i) => `<a class="${i + 1 === active ? "active" : ""}" href="${link(i < 2 ? "home" : i < 4 ? "plot-studio" : i < 5 ? "method-runner" : "community")}"><b>${i + 1}</b><span>${esc(s)}</span></a>`).join("")}</div>`;
  }

  function shell(active, content) {
    return `
      <div class="r73-app r108-shell">
        <header class="r108-topbar">
          <a class="r108-logo" href="${link("home")}"><span>荷</span><div><strong>MedPath Research Companion</strong><small>你的生物医学研究学习伙伴</small></div></a>
          <nav class="r108-topnav">${nav(active)}</nav>
          <label class="r108-search"><input id="r73-search" placeholder="搜索方法、数据集、图表..." /></label>
          <a class="r108-avatar" href="${link("profile")}" aria-label="个人主页">易</a>
        </header>
        <div class="r108-body">
          <aside class="r108-left">
            <a class="r108-overview ${active === "home" ? "active" : ""}" href="${link("home")}">概览</a>
            ${r108Steps(active === "plot-studio" ? 3 : 1)}
            <div class="r108-persona"><strong>适合人群</strong><span>本科生、研究生、科研入门者</span><a href="${link("research")}">查看学习路径 →</a></div>
          </aside>
          <main class="r108-main">${content}</main>
        </div>
        ${mobileNav(active)}
        <button class="r73-pet r108-pet" id="r73-pet" aria-label="页面助手"><span>问</span></button>
        <div class="r73-pet-bubble r108-pet-bubble" id="r73-pet-bubble">看不懂方法时，可以问：我想研究某个疾病，应该从哪张图开始？如果配置了自己的模型 API，这里会切换为真实问答；未配置时先用本地规则推荐。</div>
      </div>
    `;
  }

  function r108MethodVisual() {
    return `<figure class="r108-method-figure">
      <img src="${r108FigureBase}single_cell_atlas_panel.svg" alt="单细胞亚群解析示例图" loading="lazy" />
      <figcaption><span>图：单细胞亚群图谱、标志基因与细胞组成（演示数据）</span><a href="${link("plot-studio")}">查看代码示例 ↗</a></figcaption>
    </figure>`;
  }

  function r108ChipRow(items) {
    return `<div class="r108-chip-row">${items.map((x) => `<span>${esc(x)}</span>`).join("")}</div>`;
  }

  function r108Hero() {
    return `<section class="r108-hero">
      <div class="r108-hero-copy">
        <span class="r108-pill">研究方法</span>
        <h1>单细胞转录组测序<br/>与细胞亚群解析</h1>
        <p>从单个细胞的基因表达出发，识别细胞类型、发育轨迹与疾病相关变化。这里先用一张能复跑的示例图，让新手看懂“输入什么、产出什么、下一步怎么做”。</p>
        <div class="r108-feature-row">
          <span><b>高分辨率</b><small>发现稀有细胞亚群</small></span>
          <span><b>多维解析</b><small>表达、轨迹、功能</small></span>
          <span><b>广泛应用</b><small>肿瘤、免疫、发育</small></span>
        </div>
        <div class="r108-actions"><a class="r108-primary" href="${link("plot-studio")}">开始学习这套方法</a><a class="r108-secondary" href="${link("research")}">加入学习路径</a></div>
      </div>
      ${r108MethodVisual()}
    </section>`;
  }

  function r108AskBox() {
    return `<section class="r108-ask">
      <div><h2>从你的研究需求出发</h2><p>告诉我们你的方向或问题，平台会推荐学习路径、图表和需要准备的数据。</p></div>
      <label><input placeholder="例如：我想研究肿瘤微环境中的免疫细胞异质性，该怎么设计单细胞转录组研究？" /></label>
      <button type="button">生成我的学习方案</button>
      ${r108ChipRow(["肿瘤免疫", "神经发育", "疾病机制", "药物反应", "更多场景"])}
    </section>`;
  }

  function r108InfoCards() {
    const cards = [
      ["学习要点", "从现象到问题的转化；确定研究对象与对照组；明确可测量的结局指标。"],
      ["公开数据支持（举例）", "可先用公开数据练习流程，真正课题再替换为自己的数据。"],
      ["安全与合规", "不提供患者隐私数据下载；避免夸大结论；引用规范与学术诚信。"],
    ];
    return `<section class="r108-info-grid">${cards.map(([t, b], i) => `<article class="${i === 2 ? "warn" : ""}"><h3>${esc(t)}</h3><p>${esc(b)}</p>${i === 1 ? `<img src="${r108FigureBase}pca_ordination.svg" alt="PCA示例图" loading="lazy" />` : ""}</article>`).join("")}</section>`;
  }

  function r108ProductCard(item, index = 0) {
    const asset = r108FigureFiles[index % r108FigureFiles.length];
    return `<article class="r108-product-card">
      <div class="r108-product-media"><img src="${r108FigureBase}${asset}" alt="${esc(item.title)}示例" loading="lazy" /></div>
      <div class="r108-product-copy"><span>${esc(item.kicker)}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div>
      <a href="${link(item.route)}">进入</a>
    </article>`;
  }

  function r107ProductCard(item, index = 0) {
    return r108ProductCard(item, index);
  }

  function r107PlotCard(plot = {}, index = 0) {
    const local = r108PlotCatalog[index % r108PlotCatalog.length];
    const title = local.title;
    return `<article class="r108-plot-card">
      <div class="r108-plot-media"><img src="${r108FigureBase}${local.asset}" alt="${esc(title)}示例图" loading="lazy" /></div>
      <div class="r108-plot-body">
        <div><span>${esc(local.tag)}</span><h3>${esc(title)}</h3></div>
        <p>${esc(local.question)}</p>
        <div class="r108-code-row"><b>R</b>${local.r.map((x) => `<code>${esc(x)}</code>`).join("")}</div>
        <div class="r108-code-row"><b>Python</b>${local.py.map((x) => `<code>${esc(x)}</code>`).join("")}</div>
        <small>需要字段：${esc(local.fields)}</small>
      </div>
      <div class="r108-plot-actions"><a href="${link("plot-studio")}">看详情</a><button type="button">开始</button></div>
    </article>`;
  }

  function homePage() {
    const products = [
      { title: "科研绘图", kicker: "Plot Studio", body: "先看真实示例图，再选 R 或 Python 包。", route: "plot-studio" },
      { title: "文章流程", kicker: "Paper Builder", body: "Meta、机制、AI 医学论文，从问题到图表一步步搭。", route: "method-runner" },
      { title: "方法导航", kicker: "Method Router", body: "把“我想研究什么”翻译成可执行路线。", route: "research" },
      { title: "数据体检", kicker: "Data Audit", body: "先查字段、分组和缺失，再决定能不能分析。", route: "tools" },
      { title: "Skill 工坊", kicker: "Skill Builder", body: "把常用科研动作做成自己的 AI Skill。", route: "skills" },
    ];
    return shell("home", `
      ${r108Hero()}
      ${r108AskBox()}
      <section class="r108-section-line"><b>01</b><div><h2>提出问题</h2><p>好的问题，决定研究的价值。先把“我想看看”变成可验证、可复现、可解释的问题。</p></div></section>
      ${r108InfoCards()}
      <section class="r108-section">${r107Section("常用能力", "一行五张卡片", "点进去就是完整功能，不再像目录。")}<div class="r108-product-grid">${products.map(r108ProductCard).join("")}</div></section>
      <section class="r108-section">${r107Section("先看图，再选方法", "真实代码示例", "每张示例图都由本项目 R 脚本生成，附源数据和包名。")}<div class="r108-plot-strip">${r108PlotCatalog.slice(0, 5).map(r107PlotCard).join("")}</div></section>
    `);
  }

  function plotPage() {
    const categories = ["全部", "医学/生物", "工程", "社科", "人文", "Meta分析", "单细胞", "网络/地图"];
    return shell("plot-studio", `
      <section class="r108-plot-page">
        <aside class="r108-plot-rail">
          <div class="r108-plot-brand">科研绘图</div>
          ${categories.map((c, i) => `<button class="${i === 0 ? "active" : ""}" type="button">${esc(c)}</button>`).join("")}
          <div class="r108-plot-help"><strong>怎么选图？</strong><p>先看它回答的问题，再检查你的字段。拿不准就问右下角助手。</p></div>
        </aside>
        <main class="r108-plot-main">
          <div class="r108-plot-hero">
            <div><span>Plot Studio</span><h1>每张图，都要有代码、字段和用途。</h1><p>医学、生物、工程、社科和人文都纳入同一个图谱选择器。这里展示的图来自本地 R 脚本生成，不是占位图。</p></div>
            <div class="r108-search-row"><input placeholder="搜索：火山图、PCA、森林图、Likert、响应面、网络图..." /><select><option>全部分类</option></select></div>
          </div>
          <div class="r108-plot-grid">${r108PlotCatalog.map(r107PlotCard).join("")}</div>
        </main>
      </section>
    `);
  }

  function skillsPage() {
    const cards = [
      { title: "病理报告反馈", kicker: "教学训练", body: "检查结构、术语、证据链和教师复核点。", route: "skills" },
      { title: "PBL 案例生成", kicker: "课堂案例", body: "把疾病机制拆成问题链和讨论环节。", route: "skills" },
      { title: "科研综述助手", kicker: "文章准备", body: "从研究问题到检索、纳排和图表计划。", route: "skills" },
      { title: "图表审查", kicker: "绘图质控", body: "提醒字段、单位、图注和统计表达问题。", route: "plot-studio" },
      { title: "伦理审计", kicker: "安全边界", body: "检查隐私、夸大结论和临床误导风险。", route: "skills" },
    ];
    return shell("skills", `
      ${r108Hero()}
      <section class="r108-section">${r107Section("Skill 市场", "像产品一样使用", "每张卡片只说清楚能帮你完成什么。")}<div class="r108-product-grid">${cards.map(r108ProductCard).join("")}</div></section>
    `);
  }

  function pageFor(active) {
    if (active === "home") return homePage();
    if (active === "learn") return learnPage();
    if (active === "research") return researchPage();
    if (active === "skills") return skillsPage();
    if (active === "cases") return casesPage();
    if (active === "tools") return toolsPage();
    if (active === "plot-studio") return plotPage();
    if (active === "method-runner") return runnerPage();
    if (active === "community") return communityPage();
    if (active === "profile") return profilePage();
    if (active === "island") return islandPage();
    return fallbackPage(active);
  }

  function renderRound73() {
    const app = document.getElementById("app");
    if (!app) return;
    document.body.classList.add("round73-active");
    const active = route();
    document.body.dataset.medpathRoute = active;
    app.innerHTML = pageFor(active);
    bindRound73();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  let reclaiming = false;

  function ensureRound73OwnsApp() {
    const app = document.getElementById("app");
    if (!app || reclaiming) return;
    if (!app.querySelector(".r73-app")) {
      reclaiming = true;
      try {
        renderRound73();
      } finally {
        reclaiming = false;
      }
    }
  }

  function bindRound73() {
    const pet = document.getElementById("r73-pet");
    const bubble = document.getElementById("r73-pet-bubble");
    if (pet && bubble) {
      pet.addEventListener("click", () => bubble.classList.toggle("show"));
    }
    document.querySelectorAll("[data-building]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = islandBuildings.find((b) => b[0] === button.dataset.building);
        const dialog = document.getElementById("r73-island-dialog");
        if (!item || !dialog) return;
        dialog.innerHTML = `<h3>${esc(item[1])}</h3><p>${esc(item[2])}。你可以把常用 Skill 绑定到这栋建筑，访客也能看到它解决什么问题。</p><div class="r73-actions"><a class="r73-btn" href="${link(item[3])}">进入相关页面</a><a class="r73-btn secondary" href="${link("skills")}">绑定 Skill</a></div>`;
      });
    });
    const like = document.getElementById("r73-like-island");
    if (like) {
      like.addEventListener("click", () => {
        userState.likedIsland = !userState.likedIsland;
        localStorage.setItem("medpath_liked_island", userState.likedIsland ? "1" : "0");
        if (userState.likedIsland) {
          userState.points += 50;
          localStorage.setItem("medpath_points", String(userState.points));
        }
        renderRound73();
      });
    }
    const search = document.getElementById("r73-search");
    if (search) {
      search.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        const q = search.value.trim();
        if (/图|plot|火山|热图|森林/.test(q)) location.hash = "#/plot-studio";
        else if (/skill|技能|插件/.test(q)) location.hash = "#/skills";
        else if (/小岛|建筑|社区|排行榜/.test(q)) location.hash = "#/island";
        else if (/文章|meta|综述|论文/.test(q.toLowerCase())) location.hash = "#/method-runner";
        else location.hash = "#/research";
      });
    }
  }

  async function loadRound73Data() {
    const [methods, tools, plots, articles, buildings] = await Promise.all([
      readJson("method_universe.json", []),
      readJson("open_source_catalog.json", []),
      readJson("plot_gallery_taxonomy.json", []),
      readJson("article_skill_workflows.json", []),
      readJson("research_island_buildings.json", []),
    ]);
    data.methods = Array.isArray(methods) ? methods : [];
    data.tools = Array.isArray(tools) ? tools : [];
    data.plots = Array.isArray(plots) ? plots : [];
    data.articles = Array.isArray(articles) ? articles : [];
    data.buildings = Array.isArray(buildings) ? buildings : [];
  }

  function boot() {
    loadRound73Data().then(() => {
      renderRound73();
      setTimeout(renderRound73, 250);
      setTimeout(renderRound73, 1000);
      setTimeout(renderRound73, 2400);
      const app = document.getElementById("app");
      if (app && "MutationObserver" in window) {
        const observer = new MutationObserver(() => ensureRound73OwnsApp());
        observer.observe(app, { childList: true });
      }
      setInterval(ensureRound73OwnsApp, 1200);
    });
  }

  window.addEventListener("hashchange", renderRound73);
  window.addEventListener("load", renderRound73);
  boot();
})();

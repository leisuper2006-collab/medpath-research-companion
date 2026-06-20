(function () {
  const VERSION = "round139";
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED = new Set(["/island", "/island-builder"]);
  const categories = [
    ["all", "全部"],
    ["official", "官方 Skill"],
    ["favorite", "我的收藏"],
    ["teaching", "教学"],
    ["research", "科研"],
    ["governance", "治理"]
  ];
  let active = localStorage.getItem("medpath:r139:tab") || "all";

  const skills = [
    ["medpath-course-designer", "课程设计", "把课程目标、章节任务、课堂活动和评价材料接起来。", "teaching", "official", "workflow_diagram", "备课老师、课程助教", "章节目标、课堂活动、rubric 和教师复核表"],
    ["pathology-case-builder", "病理案例", "从教学目标生成 PBL 情境、问题链和教师审核要点。", "teaching", "official", "technology_roadmap", "病理教师、PBL 小组", "合成案例、讨论提纲和安全边界"],
    ["em-pathology-tutor", "超微导学", "把电镜结构讲成学生能跟上的跨尺度解释。", "teaching", "favorite", "feature_plot", "基础医学学生", "导学问题、概念卡和误区提示"],
    ["pathology-report-coach", "报告反馈", "检查学生病理报告的结构、术语和证据链。", "teaching", "official", "attention_heatmap", "病理课程学生", "结构问题、术语问题和教师复核建议"],
    ["plot-studio-runner", "科研绘图", "从图型、字段到代码、图注和 methods 一套走完。", "research", "favorite", "umap", "论文写作和作业新手", "示例图、R/Python 模板、图注和导出包"],
    ["method-runner", "方法运行", "按数据类型推荐路线、工具和风险提示。", "research", "official", "network_graph", "不知道从哪一步开始的新手", "方法路线、适合图型、开源工具和学习路径"],
    ["literature-review-helper", "综述助手", "整理检索词、纳排、证据表和综述框架。", "research", "favorite", "forest_plot", "写综述或课程论文的人", "检索式、证据表、综述结构和待核验引用"],
    ["grant-outline-builder", "申报框架", "把想法整理成问题、方案、成果和评价路径。", "research", "official", "gantt", "大创、教改、课题申请者", "研究目标、工作包、路线图和验收指标"],
    ["open-source-navigator-curator", "开源导航", "按学科、数据类型和 license 整理工具。", "research", "favorite", "upset_plot", "需要找工具和仓库的人", "仓库清单、用途、license 和学习顺序"],
    ["medical-kg-rag-builder", "知识检索", "把教材、公开资料和知识点组织成可检索材料。", "research", "official", "sankey", "课程团队和科研训练小组", "知识来源表、RAG 字段和引用核验清单"],
    ["research-copilot", "科研搭子", "帮新手把题目拆成数据、方法、图和风险。", "research", "favorite", "logic_framework", "刚开始做课题的学生", "任务清单、数据需求和下一步路线"],
    ["innovation-incubator", "创新孵化", "把大创、竞赛和展示材料变成可执行清单。", "research", "official", "evaluation_radar", "学生创新团队", "展示页、任务分工和成果培育表"],
    ["ai-ethics-governor", "伦理审计", "检查隐私、误导、假引用和不当医学建议。", "governance", "official", "confusion_matrix", "教师、平台管理员和 Skill 作者", "风险列表、处理建议和人工复核点"],
    ["skill-eval-harness", "质量评测", "比较传统方式、普通提示词和规范 Skill。", "governance", "official", "correlation_heatmap", "课程团队、社区管理员", "rubric、负样本、版本记录和评价字段"],
    ["teacher-skill-maker", "教师共创", "帮老师把自己的经验做成可复用 Skill。", "governance", "favorite", "architecture_diagram", "课程负责人和助教", "SKILL.md 草稿、示例任务和发布清单"]
  ].map(([id, title, desc, group, source, image, audience, output]) => ({ id, title, desc, group, source, image, audience, output }));

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function isProtected(path = route()) {
    return PROTECTED.has(path) || path.startsWith("/island/");
  }

  function isSkillRoute(path = route()) {
    return path === "/skills" || path.startsWith("/skills/");
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function img(id) {
    return `${PLOT_BASE}/${id}/example.png`;
  }

  function go(path) {
    location.hash = path;
  }

  function toast(text) {
    document.querySelector(".r139-toast")?.remove();
    const el = document.createElement("div");
    el.className = "r139-toast";
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function nav() {
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
      <a href="#${href}" class="${route() === href ? "is-active" : ""}">
        <span>${esc(label)}</span><small>${esc(hint)}</small>
      </a>`).join("");
  }

  function topbar() {
    return `
      <header class="r139-top">
        <nav>
          <a href="#/home">网站概览</a>
          <a href="#/plot-gallery">图谱</a>
          <a href="#/community">社区</a>
          <a href="#/profile">我的主页</a>
        </nav>
        <input class="r139-search" data-r139-search placeholder="搜 Skill、任务、图谱、用途..." />
        <button class="r139-btn primary" data-r139-toast="创建 Skill 目前进入静态草稿演示，真实发布后续接账号和审核。">创建 Skill</button>
      </header>`;
  }

  function shell(content) {
    return `
      <div class="r139-shell">
        <aside class="r139-side">
          <div class="r139-brand">
            <div class="r139-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>Skill 市场</span></div>
          </div>
          <nav class="r139-nav">${nav()}</nav>
        </aside>
        <main>${topbar()}<div class="r139-page">${content}</div></main>
      </div>`;
  }

  function visibleSkills() {
    if (active === "all") return skills;
    if (active === "official") return skills.filter((item) => item.source === "official");
    if (active === "favorite") return skills.filter((item) => item.source === "favorite");
    return skills.filter((item) => item.group === active);
  }

  function skillCard(item) {
    return `
      <article class="r139-card" data-r139-skill="${esc(item.id)}">
        <img src="${img(item.image)}" alt="${esc(item.title)}示例图">
        <div class="r139-chip-row"><span class="r139-chip">${item.source === "official" ? "官方" : "收藏"}</span><span class="r139-chip">${esc(item.group)}</span></div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.desc)}</p>
        <p><b>适合：</b>${esc(item.audience)}</p>
        <footer>
          <button class="r139-btn primary" data-r139-route="/skills/${esc(item.id)}">详情</button>
          <button class="r139-btn" data-r139-toast="已收藏到我的主页演示区。">收藏</button>
        </footer>
      </article>`;
  }

  function listPage() {
    const list = visibleSkills();
    return shell(`
      <section class="r139-hero">
        <div>
          <span class="r139-kicker">Skill Market</span>
          <h1 class="r139-title">选一个能直接帮你做事的 Skill</h1>
          <p class="r139-lead">这里不按“目录”堆功能，而按任务展示：每张卡片告诉你适合谁、输入什么、产出什么。官方 Skill 更稳，收藏 Skill 来自社区，真实发布前都需要人工审核。</p>
          <div class="r139-actions">
            <button class="r139-btn primary" data-r139-route="/skills/plot-studio-runner">从科研绘图开始</button>
            <button class="r139-btn" data-r139-route="/community">看社区高收藏</button>
            <button class="r139-btn" data-r139-route="/profile">看我的收藏</button>
          </div>
        </div>
        <aside class="r139-panel">
          <h3>怎么选</h3>
          <p>如果你是新手，先选“方法运行”或“科研绘图”；如果你是老师，先选“课程设计”或“病理案例”；如果你要发布自己的 Skill，先过“伦理审计”和“质量评测”。</p>
        </aside>
      </section>
      <div class="r139-tabs">${categories.map(([id, label]) => `<button class="r139-btn ${id === active ? "is-active" : ""}" data-r139-tab="${esc(id)}">${esc(label)}</button>`).join("")}</div>
      <section class="r139-grid">${list.map(skillCard).join("")}</section>
    `);
  }

  function detailPage(id, mode = "detail") {
    const item = skills.find((skill) => skill.id === id) || skills[0];
    return shell(`
      <section class="r139-detail">
        <div>
          <button class="r139-btn" data-r139-route="/skills">返回 Skill 市场</button>
          <div class="r139-chip-row" style="margin-top:16px"><span class="r139-chip">${item.source === "official" ? "官方 Skill" : "收藏 Skill"}</span><span class="r139-chip">${esc(item.group)}</span></div>
          <h1>${esc(item.title)}</h1>
          <p>${esc(item.desc)}</p>
          <p><b>适合：</b>${esc(item.audience)}</p>
          <p><b>产出：</b>${esc(item.output)}</p>
          <div class="r139-actions">
            <button class="r139-btn primary" data-r139-route="/skills/${esc(item.id)}/run">开始</button>
            <button class="r139-btn" data-r139-toast="已收藏到我的主页演示区。">收藏</button>
            <button class="r139-btn" data-r139-route="/community">看社区讨论</button>
          </div>
          <pre class="r139-code">name: ${esc(item.id)}
scope: 教学与科研训练
inputs:
  - 任务描述
  - 数据字段或课程材料
  - 期望输出格式
safety:
  - 不处理真实患者隐私
  - 不替代临床诊断
  - 输出需教师或专家复核</pre>
        </div>
        <div>
          <img src="${img(item.image)}" alt="${esc(item.title)}示例图">
          <div class="r139-panel" style="margin-top:14px">
            <h3>${mode === "run" ? "运行演示" : "示例任务"}</h3>
            <p>${mode === "run" ? "当前为静态 mock：用户接入自己的 API 后，平台会把任务、示例数据和 Skill 规范发给本地 Runtime，再生成可复核输出。" : "示例：我想完成一个和这个 Skill 相关的课程/科研任务，请先帮我检查输入字段，再给出输出模板和复核清单。"}</p>
            <button class="r139-btn primary" data-r139-toast="已生成 mock 输出：请在本地 Runtime 接入 API 后运行真实任务。">生成 mock 输出</button>
          </div>
        </div>
      </section>
    `);
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    const path = route();
    if (isProtected(path) || !isSkillRoute(path)) return;
    document.body.classList.remove("medpath-r137-community", "medpath-r138-profile");
    document.body.classList.add("medpath-r139-skills");
    app.setAttribute("data-round139-owned", VERSION);
    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "skills" && parts[1]) {
      app.innerHTML = detailPage(parts[1], parts[2] === "run" ? "run" : "detail");
    } else {
      app.innerHTML = listPage();
    }
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const routeButton = event.target.closest("[data-r139-route]");
      if (routeButton) {
        event.preventDefault();
        go(routeButton.getAttribute("data-r139-route"));
        return;
      }
      const tab = event.target.closest("[data-r139-tab]");
      if (tab) {
        active = tab.getAttribute("data-r139-tab");
        localStorage.setItem("medpath:r139:tab", active);
        render();
        return;
      }
      const toastButton = event.target.closest("[data-r139-toast]");
      if (toastButton) {
        event.preventDefault();
        toast(toastButton.getAttribute("data-r139-toast"));
      }
    });
    window.addEventListener("hashchange", () => setTimeout(render, 0));
    const observer = new MutationObserver(() => {
      const app = document.getElementById("app");
      const shouldOwn = isSkillRoute() && !isProtected();
      const overwritten = app && app.getAttribute("data-round139-owned") === VERSION && !app.querySelector(".r139-shell");
      if (shouldOwn && (app?.getAttribute("data-round139-owned") !== VERSION || overwritten)) render();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  bind();
  render();
})();

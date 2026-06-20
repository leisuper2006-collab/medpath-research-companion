(function () {
  const VERSION = "round137";
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED = new Set(["/island", "/island-builder"]);

  const tabs = [
    ["all", "全部"],
    ["question", "新手提问"],
    ["skill", "Skill发布"],
    ["plot", "图表复现"],
    ["course", "课程作业"],
    ["island", "小岛拜访"]
  ];

  const posts = [
    {
      id: "forest-meta-skill",
      type: "skill",
      author: "Path_Queen",
      avatar: "P",
      title: "我做了一个森林图检查 Skill，适合 Meta 新手",
      summary: "把效应量、置信区间、异质性和亚组字段都列成检查项，避免只会点生成图。",
      likes: 3860,
      saves: 2740,
      replies: 32,
      plot: "forest_plot",
      linkedSkill: "meta-analysis-skill",
      detail: "这个 Skill 会先检查 PICO、纳排标准和效应量字段，再给出 forest plot、funnel plot、PRISMA flow 的顺序。适合课程作业和毕业论文初稿，不替代导师的统计审查。"
    },
    {
      id: "single-cell-figures",
      type: "plot",
      author: "BioWalker",
      avatar: "B",
      title: "单细胞图太多怎么选？我整理了入门顺序",
      summary: "UMAP 看群体结构，DotPlot 看 marker，Feature Plot 看单基因分布，比例图回答组成差异。",
      likes: 2310,
      saves: 1650,
      replies: 27,
      plot: "umap",
      linkedSkill: "single-cell-workflow-skill",
      detail: "新手不要一上来堆十几张图。先把数据来源、质控、聚类和注释讲明白，再考虑轨迹、通讯和空间图。"
    },
    {
      id: "pbl-case-template",
      type: "course",
      author: "小明同学",
      avatar: "明",
      title: "胃癌 PBL 案例模板，老师复核后课堂可用",
      summary: "合成教学案例，不是真实患者，包含问题链、报告训练和教师复核表。",
      likes: 1980,
      saves: 3860,
      replies: 45,
      plot: "workflow_diagram",
      linkedSkill: "pathology-case-builder",
      detail: "模板强调学习目标、病理特点、鉴别诊断和安全边界。所有医学内容都要求教师复核。"
    },
    {
      id: "hpc-dry-run-share",
      type: "question",
      author: "ServerCat",
      avatar: "S",
      title: "HPC dry-run 脚本怎么避免误提交收费作业？",
      summary: "我想批量跑案例评测，但不想一不小心提交真实作业。",
      likes: 860,
      saves: 520,
      replies: 19,
      plot: "gantt",
      linkedSkill: "hpc-job-runner",
      detail: "建议把 dry-run 设为默认值，真实提交前必须二次确认，并记录队列、时长、费用估计和输出归档路径。"
    },
    {
      id: "island-visit",
      type: "island",
      author: "CellExplorer",
      avatar: "C",
      title: "欢迎来我的单细胞图谱岛，建筑都绑了常用路线",
      summary: "图书馆放文献，实验楼放单细胞，绘图工坊放图谱页。欢迎点赞和收藏。",
      likes: 1650,
      saves: 980,
      replies: 41,
      plot: "architecture_diagram",
      linkedSkill: "island-skill-map",
      detail: "小岛只是游戏化导航，真正运行仍回到方法路线、图谱页和本地 Runtime。"
    },
    {
      id: "grant-roadmap-help",
      type: "question",
      author: "MedScholar",
      avatar: "M",
      title: "项目申报图应该先画技术路线还是经费映射？",
      summary: "我有研究目标，但不知道图和表怎么组织。",
      likes: 1420,
      saves: 1210,
      replies: 17,
      plot: "technology_roadmap",
      linkedSkill: "grant-roadmap-skill",
      detail: "先画问题到任务的技术路线，再画经费到任务和成果的映射。不要把拟形成成果写成已完成。"
    }
  ];

  const skillBoard = [
    ["课程设计", "老师常用", 1200, "medpath-course-designer"],
    ["质量评测", "评价量规", 1030, "skill-eval-harness"],
    ["报告反馈", "报告训练", 860, "pathology-report-coach"],
    ["伦理审计", "安全边界", 690, "ai-ethics-governor"],
    ["病理案例", "教学案例", 520, "pathology-case-builder"]
  ];

  const islands = [
    ["病理报告训练岛", "Path_Queen", 42],
    ["单细胞图谱岛", "BioWalker", 31],
    ["循证医学作业岛", "MedScholar", 18]
  ];

  let activeTab = localStorage.getItem("medpath:r137:tab") || "all";
  let query = localStorage.getItem("medpath:r137:query") || "";

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
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

  function isProtected(path = route()) {
    return PROTECTED.has(path) || path.startsWith("/island/");
  }

  function isCommunityRoute(path = route()) {
    return path === "/community" || path.startsWith("/community/");
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
      <a class="${href === "/community" ? "is-active" : ""}" href="#${href}" data-r137-route="${href}">
        <span>${esc(label)}</span><small>${esc(hint)}</small>
      </a>`).join("");
  }

  function topbar() {
    return `
      <header class="r137-top">
        <nav>
          <a class="is-active" href="#/community" data-r137-route="/community">社区首页</a>
          <a href="#/skills" data-r137-route="/skills">Skill市场</a>
          <a href="#/profile" data-r137-route="/profile">我的主页</a>
          <a href="#/island" data-r137-route="/island">小岛拜访</a>
        </nav>
        <input class="r137-search" value="${esc(query)}" placeholder="搜帖子、Skill、作者、图型..." data-r137-search>
        <button class="r137-btn primary" data-r137-toast="发布功能为静态演示；接入账号后会进入审核与草稿箱。">发布内容</button>
      </header>`;
  }

  function shell(content) {
    return `
      <div class="r137-shell">
        <aside class="r137-side">
          <div class="r137-brand">
            <div class="r137-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>社区交流</span></div>
          </div>
          <nav class="r137-nav">${nav()}</nav>
        </aside>
        <main class="r137-main">${topbar()}<div class="r137-page">${content}</div></main>
      </div>`;
  }

  function filteredPosts() {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const inTab = activeTab === "all" || post.type === activeTab;
      const text = [post.title, post.summary, post.author, post.linkedSkill, post.detail].join(" ").toLowerCase();
      return inTab && (!q || text.includes(q));
    });
  }

  function postCard(post, index) {
    return `
      <article class="r137-post" data-r137-post="${esc(post.id)}">
        <div class="r137-avatar">${esc(post.avatar)}</div>
        <img class="r137-post-image" src="${img(post.plot)}" alt="${esc(post.linkedSkill)}示例图">
        <div>
          <div class="r137-chip-row"><span class="r137-chip">${esc(tabs.find((tab) => tab[0] === post.type)?.[1] || "帖子")}</span><span class="r137-chip">${esc(post.linkedSkill)}</span></div>
          <h3>${esc(post.title)}</h3>
          <p>${esc(post.summary)}</p>
          <p>${esc(post.author)} · ${post.saves.toLocaleString()} 收藏 · ${post.replies} 回复</p>
        </div>
        <div class="r137-actions">
          <button class="r137-btn primary" data-r137-route="/community/post/${esc(post.id)}">打开</button>
          <button class="r137-btn" data-r137-toast="已点赞第 ${index + 1} 条帖子。">点赞</button>
          <button class="r137-btn" data-r137-toast="已收藏到我的主页演示区。">收藏</button>
        </div>
      </article>`;
  }

  function skillCard(item, index) {
    return `
      <article class="r137-skill">
        <img src="${img(index === 0 ? "workflow_diagram" : index === 1 ? "evaluation_radar" : index === 2 ? "attention_heatmap" : index === 3 ? "logic_framework" : "umap")}" alt="${esc(item[0])}示例">
        <h3>${esc(item[0])}</h3>
        <p>${esc(item[1])} · ${item[2]} 收藏</p>
        <button class="r137-btn primary" data-r137-toast="已打开 ${esc(item[3])} 的静态演示。">打开 Skill</button>
      </article>`;
  }

  function listPage() {
    const visible = filteredPosts();
    return shell(`
      <section class="r137-hero">
        <div>
          <div class="r137-kicker">Community Hub</div>
          <h1 class="r137-title">像贴吧一样找经验，也能收藏别人的 Skill</h1>
          <p class="r137-lead">这里把帖子、Skill、图表经验和科研小岛放在一起。你可以先搜索问题，也可以按收藏榜找别人整理好的流程。当前是静态演示，登录、评论和私信后续接入。</p>
          <div class="r137-actions">
            <button class="r137-btn primary" data-r137-toast="发布功能为静态演示；后续会进入草稿箱和审核。">发布帖子</button>
            <button class="r137-btn" data-r137-route="/profile">看我的收藏</button>
            <button class="r137-btn" data-r137-route="/island">拜访小岛</button>
          </div>
        </div>
        <div class="r137-panel">
          <h3>社区规则</h3>
          <ul>
            <li>不上传患者隐私和真实病例识别信息。</li>
            <li>Skill 可以分享流程，但不能冒充临床诊断。</li>
            <li>转载开源仓库时先看 license，再写来源。</li>
          </ul>
        </div>
      </section>
      <div class="r137-tabs">${tabs.map(([id, label]) => `<button class="r137-btn ${id === activeTab ? "primary is-active" : ""}" data-r137-tab="${esc(id)}">${esc(label)}</button>`).join("")}</div>
      <section class="r137-layout">
        <div>
          <div class="r137-panel" style="margin-bottom:14px"><h3>帖子流 · ${visible.length} 条</h3><p>能打开、能点赞、能收藏。真实账号接入前，所有操作只做前端演示。</p></div>
          <div class="r137-feed">${visible.length ? visible.map(postCard).join("") : `<div class="r137-panel"><h3>没搜到</h3><p>换个词试试：森林图、单细胞、PBL、HPC、Skill。</p></div>`}</div>
        </div>
        <aside>
          <div class="r137-panel">
            <h3>本周 Skill 榜</h3>
            <div class="r137-rank">${skillBoard.map((item, index) => `<div class="r137-rank-item"><span class="r137-rank-no">${index + 1}</span><div><strong>${esc(item[0])}</strong><p>${esc(item[1])}</p></div><b>${item[2]}</b></div>`).join("")}</div>
          </div>
          <div class="r137-panel" style="margin-top:14px">
            <h3>热门小岛</h3>
            <div class="r137-rank">${islands.map((item, index) => `<div class="r137-rank-item"><span class="r137-rank-no">${index + 1}</span><div><strong>${esc(item[0])}</strong><p>${esc(item[1])}</p></div><b>${item[2]}</b></div>`).join("")}</div>
          </div>
        </aside>
      </section>
      <section class="r137-panel" style="margin-top:22px">
        <h3>高收藏 Skill 展示</h3>
        <div class="r137-skill-grid">${skillBoard.map(skillCard).join("")}</div>
      </section>`);
  }

  function detailPage(id) {
    const post = posts.find((item) => item.id === id) || posts[0];
    return shell(`
      <section class="r137-detail">
        <div class="r137-panel">
          <button class="r137-btn" data-r137-route="/community">返回社区</button>
          <div class="r137-chip-row" style="margin-top:18px"><span class="r137-chip">${esc(post.author)}</span><span class="r137-chip">${esc(post.linkedSkill)}</span></div>
          <h1 class="r137-title">${esc(post.title)}</h1>
          <p class="r137-lead">${esc(post.detail)}</p>
          <div class="r137-actions">
            <button class="r137-btn primary" data-r137-toast="已打开关联 Skill 的静态演示入口。">打开 Skill</button>
            <button class="r137-btn" data-r137-action="like" data-r137-toast="已点赞。">点赞</button>
            <button class="r137-btn" data-r137-toast="已收藏到我的主页演示区。">收藏</button>
          </div>
          <pre class="r137-code">社区帖子结构：
标题：${esc(post.title)}
作者：${esc(post.author)}
关联Skill：${esc(post.linkedSkill)}
边界：仅用于教学与科研训练，不上传患者隐私，不替代临床诊断。</pre>
        </div>
        <figure class="r137-panel">
          <img src="${img(post.plot)}" alt="${esc(post.title)}示例图" style="width:100%;max-height:360px;object-fit:contain;border-radius:18px;background:#fff">
          <figcaption>示例图为项目虚拟数据生成，只说明帖子关联的图型和场景。</figcaption>
        </figure>
      </section>`);
  }

  function toast(message) {
    const old = document.querySelector(".r137-toast");
    if (old) old.remove();
    const node = document.createElement("div");
    node.className = "r137-toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2600);
  }

  function render() {
    const path = route();
    if (isProtected(path)) {
      document.body.classList.remove("medpath-r137-community");
      return false;
    }
    if (!isCommunityRoute(path)) {
      document.body.classList.remove("medpath-r137-community");
      return false;
    }
    const app = document.getElementById("app");
    if (!app) return false;
    document.body.classList.add("medpath-r137-community");
    const parts = path.split("/").filter(Boolean);
    app.innerHTML = parts[1] === "post" ? detailPage(decodeURIComponent(parts[2] || posts[0].id)) : listPage();
    app.setAttribute("data-round137-owned", VERSION);
    return true;
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const routeTarget = event.target.closest("[data-r137-route]");
      if (routeTarget) {
        event.preventDefault();
        go(routeTarget.getAttribute("data-r137-route"));
        return;
      }
      const tab = event.target.closest("[data-r137-tab]");
      if (tab) {
        activeTab = tab.getAttribute("data-r137-tab") || "all";
        localStorage.setItem("medpath:r137:tab", activeTab);
        render();
        return;
      }
      const toastTarget = event.target.closest("[data-r137-toast]");
      if (toastTarget) {
        toast(toastTarget.getAttribute("data-r137-toast"));
      }
    }, true);
    document.addEventListener("input", (event) => {
      if (!event.target.matches("[data-r137-search]")) return;
      query = event.target.value || "";
      localStorage.setItem("medpath:r137:query", query);
      render();
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
        const shouldOwn = isCommunityRoute(path) && !isProtected(path);
        const overwritten = app && app.getAttribute("data-round137-owned") === VERSION && !app.querySelector(".r137-shell");
        if (shouldOwn && (app?.getAttribute("data-round137-owned") !== VERSION || overwritten)) render();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  start();
})();

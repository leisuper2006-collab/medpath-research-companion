(function () {
  const VERSION = "round138";
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED = new Set(["/island", "/island-builder"]);

  const stats = [
    ["12", "收藏 Skill"],
    ["28", "保存图谱"],
    ["860", "科研积分"],
    ["42", "小岛访问"],
    ["7", "本周任务"]
  ];

  const works = [
    {
      title: "Meta 分析森林图复核帖",
      type: "社区帖子",
      image: "forest_plot",
      desc: "收藏量高的森林图字段检查流程，适合论文作业和综述初稿。",
      route: "/community/post/forest-meta-skill"
    },
    {
      title: "单细胞 UMAP 学习图",
      type: "我的图谱",
      image: "umap",
      desc: "包含示例数据、Python/R 模板、图注和 methods 写法。",
      route: "/plot-gallery/umap"
    },
    {
      title: "病理报告反馈 Skill",
      type: "收藏 Skill",
      image: "attention_heatmap",
      desc: "用于学生报告训练的结构、术语和证据链反馈，不替代诊断。",
      route: "/skills/pathology-report-coach"
    },
    {
      title: "虚拟扰动学习路线",
      type: "方法路线",
      image: "workflow_diagram",
      desc: "从任务边界、输入格式到 GEARS/scGen/CPA 的入门路线。",
      route: "/method-runner/virtual-perturbation"
    },
    {
      title: "我的科研小岛",
      type: "游戏空间",
      image: "architecture_diagram",
      desc: "把常用功能绑定到建筑，用积分解锁装饰和建筑。",
      route: "/island"
    },
    {
      title: "开源工具收藏夹",
      type: "工具导航",
      image: "network_graph",
      desc: "按学科、数据类型和 license 整理常用仓库。",
      route: "/open-source"
    }
  ];

  const todos = [
    ["UMAP 图谱详情", "刚刚打开，继续看字段和代码模板", "/plot-gallery/umap"],
    ["社区 Meta 分析帖", "有 32 条回复，适合继续收藏", "/community/post/forest-meta-skill"],
    ["虚拟扰动路线", "下一步看输入数据和风险边界", "/method-runner/virtual-perturbation"],
    ["科研小岛", "检查建筑是否绑定常用功能", "/island"],
    ["开源工具导航", "继续筛选单细胞与医学图谱工具", "/open-source"]
  ];

  const achievements = [
    ["图谱入门者", "已保存 28 张图谱模板"],
    ["Skill 收藏家", "收藏 12 个可复用 Skill"],
    ["社区观察员", "本周参与 4 个讨论"],
    ["小岛设计师", "已有 8 个建筑绑定功能"],
    ["安全边界守护", "输出前先看伦理提醒"],
    ["复现练习生", "完成 3 条方法路线"]
  ];

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function isProtected(path = route()) {
    return PROTECTED.has(path) || path.startsWith("/island/");
  }

  function isProfileRoute(path = route()) {
    return path === "/profile";
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

  function runAssistant() {
    const value = document.querySelector("[data-r138-question]")?.value?.trim();
    const lower = value?.toLowerCase() || "";
    const wantsPlot = /plot|figure|graph|umap|meta|forest/.test(lower)
      || value?.includes("\u56fe")
      || value?.includes("\u753b")
      || value?.includes("\u7ed8\u56fe")
      || value?.includes("\u53ef\u89c6\u5316")
      || value?.includes("\u5355\u7ec6\u80de");
    const wantsCommunity = /skill|community|post/.test(lower)
      || value?.includes("\u793e\u533a")
      || value?.includes("\u5e16\u5b50")
      || value?.includes("\u6536\u85cf");
    const wantsIsland = value?.includes("\u5c0f\u5c9b")
      || value?.includes("\u5efa\u7b51")
      || value?.includes("\u6e38\u620f");
    if (!value) {
      toast("先写一句你现在想做什么。");
    } else if (wantsPlot) {
      go("/plot-gallery");
    } else if (wantsCommunity) {
      go("/community");
    } else if (wantsIsland) {
      go("/island");
    } else {
      go("/method-runner");
    }
  }

  function toast(text) {
    document.querySelector(".r138-toast")?.remove();
    const el = document.createElement("div");
    el.className = "r138-toast";
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
      <header class="r138-top">
        <nav>
          <a href="#/home">网站概览</a>
          <a href="#/plot-gallery">图谱</a>
          <a href="#/community">社区</a>
          <a href="#/island">小岛</a>
        </nav>
        <input class="r138-search" data-r138-search placeholder="搜收藏、图谱、Skill、帖子..." />
        <button class="r138-btn primary" data-r138-toast="当前是静态演示；真实账号资料后续接入。">编辑主页</button>
      </header>`;
  }

  function shell(content) {
    return `
      <div class="r138-shell">
        <aside class="r138-side">
          <div class="r138-brand">
            <div class="r138-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>我的科研工作台</span></div>
          </div>
          <nav class="r138-nav">${nav()}</nav>
        </aside>
        <main class="r138-main">${topbar()}<div class="r138-page">${content}</div></main>
      </div>`;
  }

  function workCard(item) {
    return `
      <article class="r138-work">
        <img src="${img(item.image)}" alt="${esc(item.title)}示例图">
        <div>
          <div class="r138-chip-row"><span class="r138-chip">${esc(item.type)}</span></div>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.desc)}</p>
          <div class="r138-actions">
            <button class="r138-btn primary" data-r138-route="${esc(item.route)}">打开</button>
            <button class="r138-btn" data-r138-toast="已固定在主页演示区。">置顶</button>
          </div>
        </div>
      </article>`;
  }

  function todoItem(item, index) {
    return `
      <article class="r138-todo">
        <span class="r138-no">${index + 1}</span>
        <div><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p></div>
        <button class="r138-btn" data-r138-route="${esc(item[2])}">继续</button>
      </article>`;
  }

  function renderProfile() {
    return shell(`
      <section class="r138-hero">
        <div class="r138-avatar">易<small>Lv.24</small></div>
        <div>
          <div class="r138-chip-row">
            <span class="r138-chip">基础医学</span>
            <span class="r138-chip">图谱学习</span>
            <span class="r138-chip">Skill 收藏</span>
            <span class="r138-chip">小岛建造</span>
          </div>
          <h1 class="r138-title">我的科研主页</h1>
          <p class="r138-lead">这里不是简历页，而是你每天继续学习和创作的入口：收藏的 Skill、保存的图谱、社区帖子、方法路线和科研小岛都会汇到这里。当前为本地静态演示，真实登录、关注和云同步后续接入。</p>
          <div class="r138-actions">
            <button class="r138-btn primary" data-r138-route="/plot-gallery">继续画图</button>
            <button class="r138-btn" data-r138-route="/community">看社区收藏</button>
            <button class="r138-btn" data-r138-route="/island">进入小岛</button>
          </div>
        </div>
        <aside class="r138-level">
          <strong>本周成长</strong>
          <div class="r138-progress"><span></span></div>
          <p>距离“科研复现练习生”下一等级还差 380 积分。完成一张图谱、发布一个 Skill 草稿或拜访小岛都可以增加积分。</p>
        </aside>
      </section>

      <section class="r138-grid r138-stats">
        ${stats.map(([num, label]) => `<div class="r138-card r138-stat"><b>${esc(num)}</b><span>${esc(label)}</span></div>`).join("")}
      </section>

      <section class="r138-main-grid">
        <div class="r138-grid">
          <div class="r138-panel">
            <h2>我的作品与收藏</h2>
            <p>每张卡片都能进入真实页面；按钮如果暂未接入账号，会给出前端反馈，不会假装已经同步云端。</p>
            <div class="r138-work-grid">${works.map(workCard).join("")}</div>
          </div>
          <div class="r138-panel">
            <h2>成就与积分</h2>
            <div class="r138-achievements">${achievements.map(([title, desc]) => `<div class="r138-badge"><strong>${esc(title)}</strong><p>${esc(desc)}</p></div>`).join("")}</div>
          </div>
        </div>
        <aside class="r138-grid">
          <div class="r138-panel">
            <h2>今天继续什么</h2>
            <div class="r138-list">${todos.map(todoItem).join("")}</div>
          </div>
          <div class="r138-panel">
            <h2>我的公开边界</h2>
            <p>公开主页只展示合成案例、学习图谱、Skill 草稿和可公开的工具收藏。不展示真实患者信息、账号密钥、未授权课程材料和未审核医学建议。</p>
            <div class="r138-chip-row">
              <span class="r138-chip">无患者隐私</span>
              <span class="r138-chip">不替代诊断</span>
              <span class="r138-chip">教师复核</span>
            </div>
          </div>
        </aside>
      </section>

      <section class="r138-assistant" data-r138-assistant>
        <header>
          <span>主页小助手</span>
          <button class="r138-btn" data-r138-collapse>收起</button>
        </header>
        <div class="r138-assistant-body">
          <p>不知道从哪里继续，可以写一句需求。未配置模型 API 时，这里只给本地推荐。</p>
          <textarea data-r138-question placeholder="例如：我想继续完成单细胞作业，应该先打开哪个页面？"></textarea>
          <button class="r138-btn primary" data-r138-ask>推荐入口</button>
        </div>
      </section>
    `);
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    const path = route();
    if (isProtected(path) || !isProfileRoute(path)) return;
    document.body.classList.remove("medpath-r137-community");
    document.body.classList.add("medpath-r138-profile");
    app.setAttribute("data-round138-owned", VERSION);
    app.innerHTML = renderProfile();
    app.querySelector("[data-r138-ask]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      runAssistant();
    });
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const routeButton = event.target.closest("[data-r138-route]");
      if (routeButton) {
        event.preventDefault();
        go(routeButton.getAttribute("data-r138-route"));
        return;
      }
      const toastButton = event.target.closest("[data-r138-toast]");
      if (toastButton) {
        event.preventDefault();
        toast(toastButton.getAttribute("data-r138-toast"));
        return;
      }
      if (event.target.closest("[data-r138-collapse]")) {
        const body = document.querySelector(".r138-assistant-body");
        if (body) body.hidden = !body.hidden;
        return;
      }
      if (event.target.closest("[data-r138-ask]")) {
        event.preventDefault();
        runAssistant();
      }
    });

    window.addEventListener("hashchange", () => setTimeout(render, 0));
    const observer = new MutationObserver(() => {
      const app = document.getElementById("app");
      const shouldOwn = isProfileRoute() && !isProtected();
      const overwritten = app && app.getAttribute("data-round138-owned") === VERSION && !app.querySelector(".r138-shell");
      if (shouldOwn && (app?.getAttribute("data-round138-owned") !== VERSION || overwritten)) render();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  bind();
  render();
})();

(function () {
  const VERSION = "round134";
  const PLOT_BASE = "outputs/round110_plots";
  const PROTECTED = new Set(["/island", "/island-builder"]);

  const recommendations = [
    {
      title: "做一个教学案例",
      route: "/simulate",
      input: "胃腺癌本科病理 PBL",
      output: "情境、问题链、教师复核表",
      text: "把课程主题变成一节可以讨论、可以追问、可以复核的课。"
    },
    {
      title: "找一个科研方法",
      route: "/method-runner",
      input: "单细胞肿瘤免疫差异",
      output: "方法路线、工具、适合图型",
      text: "先判断你的数据和问题，再推荐方法，不让新手直接掉进代码坑。"
    },
    {
      title: "生成一张论文图",
      route: "/plot-gallery",
      input: "log2FC 与 padj",
      output: "示例图、R/Python 模板、图注",
      text: "先看真实示例图，再替换自己的字段，适合从零开始学作图。"
    },
    {
      title: "创建自己的 Skill",
      route: "/skills",
      input: "森林图复核流程",
      output: "可收藏、可发布的任务卡",
      text: "把你反复做的步骤写成 Skill，让别人也能收藏和复用。"
    },
    {
      title: "进入科研小岛",
      route: "/island",
      input: "我的病理绘图岛",
      output: "建筑入口、积分、好友拜访",
      text: "把常用工具放进建筑里，用更轻松的方式做任务和学习。"
    }
  ];

  const personas = [
    ["科研小白", "从一个想法开始，跟着问题、方法、图表和复核清单走。", "/method-runner", "研"],
    ["完成作业的学生", "直接看示例图、字段格式和代码模板，替换数据就能练。", "/plot-gallery", "学"],
    ["老师", "准备课程案例、报告训练材料和课堂评价量规。", "/skills", "师"],
    ["写论文的人", "按文章类型安排图表、结果、方法和复现材料。", "/plot-gallery", "文"],
    ["社区创作者", "发布自己的 Skill、案例和小岛建筑，按收藏量冲榜。", "/community", "创"]
  ];

  const skills = [
    ["科研绘图", "按学科找图，直接看示例和代码。", "/plot-gallery", "umap"],
    ["方法路线", "从研究问题拆到工具、数据和验证。", "/method-runner", "workflow_diagram"],
    ["开源工具", "看仓库、论文、许可和适用场景。", "/open-source", "network_graph"],
    ["Skill市场", "官方流程与社区收藏一起用。", "/skills", "sankey"],
    ["模型接口", "自带 API Key，本地运行不泄露。", "/providers", "architecture_diagram"]
  ];

  const story = [
    ["先说你要做什么", "不用先会代码。你可以输入作业、论文、课程主题或一个模糊问题。"],
    ["再选一个可执行路径", "平台把方法、图型、工具、Skill 和复核点放到同一条线上。"],
    ["最后带着证据导出", "输出图、代码、图注、methods 和安全提醒，方便老师或导师复核。"]
  ];

  let active = Number(localStorage.getItem("medpath:r134:active") || "0");
  let timer = null;

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function img(id, type = "example") {
    return `${PLOT_BASE}/${id}/${type}.png`;
  }

  function go(path) {
    location.hash = path;
  }

  function nav(activePath = "/home") {
    const items = [
      ["/home", "概览", "从这里开始"],
      ["/method-runner", "探索方法", "路线与工具"],
      ["/plot-gallery", "科研绘图", "示例与代码"],
      ["/open-source", "开源工具", "仓库与教程"],
      ["/skills", "Skill市场", "官方与收藏"],
      ["/community", "社区交流", "帖子与榜单"],
      ["/profile", "我的主页", "作品与收藏"],
      ["/island", "科研小岛", "游戏模式"],
      ["/island-builder", "自主建造", "放置建筑"]
    ];
    return items.map(([href, label, hint]) => `<a class="${href === activePath ? "is-active" : ""}" href="#${href}" data-r134-route="${href}"><span>${esc(label)}</span><small>${esc(hint)}</small></a>`).join("");
  }

  function topbar() {
    return `
      <header class="r134-top">
        <nav>
          <a class="is-active" href="#/home" data-r134-route="/home">概览</a>
          <a href="#/plot-gallery" data-r134-route="/plot-gallery">探索图谱</a>
          <a href="#/method-runner" data-r134-route="/method-runner">学习路径</a>
          <a href="#/open-source" data-r134-route="/open-source">公开工具</a>
          <a href="#/community" data-r134-route="/community">社区</a>
        </nav>
        <input class="r134-search" placeholder="搜索图型、方法、数据集或作业问题..." data-r134-search>
        <button class="r134-btn ghost" data-r134-route="/profile">我的</button>
      </header>
    `;
  }

  function lotusSvg() {
    return `
      <svg class="r134-lotus" viewBox="0 0 240 140" aria-hidden="true">
        <path d="M120 118C80 82 96 36 120 18c24 18 40 64 0 100Z" fill="#00a393"/>
        <path d="M120 118C50 100 42 58 70 35c34 10 58 39 50 83Z" fill="#f1a3bd"/>
        <path d="M120 118c70-18 78-60 50-83-34 10-58 39-50 83Z" fill="#f5cf77"/>
        <path d="M120 118c-24-19-17-48 0-64 17 16 24 45 0 64Z" fill="#fff7c8"/>
      </svg>`;
  }

  function recCard(item, idx) {
    const isMuted = Math.abs(idx - active) > 1 ? "is-muted" : "";
    return `
      <article class="r134-rec-card ${isMuted}" data-r134-rec="${idx}">
        <div>
          <strong>${String(idx + 1).padStart(2, "0")}</strong>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.text)}</p>
          <div class="r134-example"><b>输入：</b>${esc(item.input)}<br><b>得到：</b>${esc(item.output)}</div>
        </div>
        <button class="r134-btn primary" data-r134-route="${esc(item.route)}">开始</button>
      </article>`;
  }

  function renderHome() {
    return `
      <div class="r134-shell">
        <aside class="r134-side">
          <div class="r134-brand">
            <div class="r134-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>科研学习与作图工作台</span></div>
          </div>
          <nav class="r134-nav">${nav("/home")}</nav>
        </aside>
        <main class="r134-main">
          ${topbar()}
          <div class="r134-page">
            <section class="r134-hero">
              <div class="r134-hero-copy">
                <div class="r134-kicker">科研新手友好入口</div>
                <h1 class="r134-title">把问题，变成方法和图</h1>
                <p class="r134-lead">你可以从作业、课程主题、论文问题或一张表开始。这里先给你看真实示例，再给字段、代码、Skill 和复核清单；不懂图怎么选，就问右下角的小助手。</p>
                <div class="r134-actions">
                  <button class="r134-btn primary" data-r134-route="/plot-gallery">看图谱</button>
                  <button class="r134-btn ghost" data-r134-route="/method-runner">找方法</button>
                  <button class="r134-btn ghost" data-r134-route="/island">去科研小岛</button>
                </div>
              </div>
              <div class="r134-hero-art">
                <figure class="r134-hero-card">
                  <img src="${img("umap")}" alt="UMAP 示例图">
                  <figcaption>示例图由项目脚本和虚拟数据生成，用来说明图型和字段，不代表真实研究结论。</figcaption>
                </figure>
                ${lotusSvg()}
              </div>
            </section>

            <section class="r134-section" data-r134-carousel>
              <div class="r134-section-head">
                <div>
                  <h2>常用入口</h2>
                  <p>自动滑动。桌面端保留三张卡，移动端一屏一张多一点，每张都能进入真实页面。</p>
                </div>
                <div class="r134-carousel-controls">
                  <button class="r134-mini" data-r134-prev aria-label="上一张">←</button>
                  <button class="r134-mini" data-r134-next aria-label="下一张">→</button>
                </div>
              </div>
              <div class="r134-carousel">
                <div class="r134-carousel-track" style="--r134-active:${active}">${recommendations.map(recCard).join("")}</div>
                <div class="r134-dots">${recommendations.map((_, i) => `<button class="${i === active ? "is-active" : ""}" data-r134-dot="${i}" aria-label="切换到第${i + 1}张"></button>`).join("")}</div>
              </div>
            </section>

            <section class="r134-section">
              <div class="r134-section-head">
                <div>
                  <h2>按身份进入</h2>
                  <p>如果不知道点哪里，先选最像你今天状态的一类用户。</p>
                </div>
              </div>
              <div class="r134-personas">
                ${personas.map(([title, text, href, mark]) => `
                  <article class="r134-persona">
                    <div class="r134-persona-flower">${esc(mark)}</div>
                    <div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>
                    <div class="r134-actions"><button class="r134-btn primary" data-r134-route="${esc(href)}">进入</button><button class="r134-btn ghost" data-r134-toast="已加入收藏演示；登录后会保存到我的主页。">收藏</button></div>
                  </article>`).join("")}
              </div>
            </section>

            <section class="r134-section">
              <div class="r134-section-head">
                <div>
                  <h2>常用功能</h2>
                  <p>一行五张卡。每张卡都展示它能产出的效果，而不是只写一个目录名。</p>
                </div>
              </div>
              <div class="r134-skill-grid">
                ${skills.map(([title, text, href, plotId]) => `
                  <article class="r134-skill">
                    <img src="${img(plotId)}" alt="${esc(title)}示例">
                    <div><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="r134-actions"><button class="r134-btn primary" data-r134-route="${esc(href)}">打开</button></div></div>
                  </article>`).join("")}
              </div>
            </section>

            <section class="r134-section">
              <div class="r134-section-head">
                <div>
                  <h2>这个项目怎么用</h2>
                  <p>像看产品介绍一样，从问题走到结果；每一步都有下一步按钮。</p>
                </div>
              </div>
              <div class="r134-story">
                ${story.map(([title, text], i) => `
                  <article class="r134-story-card">
                    <div class="r134-story-no">${String(i + 1).padStart(2, "0")}</div>
                    <div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>
                    <button class="r134-btn ghost" data-r134-route="${i === 0 ? "/method-runner" : i === 1 ? "/plot-gallery" : "/skills"}">继续</button>
                  </article>`).join("")}
              </div>
            </section>
          </div>
        </main>
      </div>
      ${assistant()}
    `;
  }

  function assistant() {
    return `
      <div class="r134-assistant">
        <div class="r134-assistant-panel" hidden data-r134-assistant-panel>
          <strong>像素科研助手</strong>
          <p>问它“我想做什么”，它会按当前网站功能推荐入口。没有配置模型 API 时只用规则回答。</p>
          <textarea data-r134-question placeholder="例如：我要写Meta分析，应该从哪里开始？"></textarea>
          <div class="r134-actions"><button class="r134-btn primary" data-r134-ask>推荐</button><button class="r134-btn ghost" data-r134-assistant-close>收起</button></div>
          <p data-r134-answer>可以问：作图怎么选、方法怎么找、Skill怎么创建、科研小岛怎么用。</p>
        </div>
        <button class="r134-assistant-button" data-r134-assistant-toggle aria-label="打开像素科研助手">▣</button>
      </div>`;
  }

  function render() {
    const path = route();
    if (PROTECTED.has(path) || path.startsWith("/island/")) {
      document.body.classList.remove("medpath-r134-home");
      return false;
    }
    if (path !== "/home" && path !== "/") {
      document.body.classList.remove("medpath-r134-home");
      return false;
    }
    const app = document.getElementById("app");
    if (!app) return false;
    document.body.classList.add("medpath-r134-home");
    app.innerHTML = renderHome();
    app.setAttribute("data-round134-owned", VERSION);
    restartTimer();
    return true;
  }

  function setActive(next) {
    active = (next + recommendations.length) % recommendations.length;
    localStorage.setItem("medpath:r134:active", String(active));
    const track = document.querySelector(".r134-carousel-track");
    if (track) {
      track.style.setProperty("--r134-active", active);
      track.querySelectorAll(".r134-rec-card").forEach((card, i) => {
        card.classList.toggle("is-muted", Math.abs(i - active) > 1);
      });
    }
    document.querySelectorAll("[data-r134-dot]").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === active);
    });
  }

  function restartTimer() {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(() => {
      if (route() === "/home" || route() === "/") setActive(active + 1);
    }, 4800);
  }

  function toast(message) {
    const old = document.querySelector(".r134-toast");
    if (old) old.remove();
    const node = document.createElement("div");
    node.className = "r134-toast";
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2500);
  }

  function answerQuestion() {
    const q = (document.querySelector("[data-r134-question]")?.value || "").toLowerCase();
    let answer = "建议先从“探索方法”开始，把问题拆成数据、方法、图表和复核点。";
    if (q.includes("meta") || q.includes("森林") || q.includes("综述")) answer = "写Meta分析：先去科研绘图里的医学与生命科学 -> Meta分析，看森林图、漏斗图、PRISMA流程；再去方法路线整理纳排标准。";
    if (q.includes("图") || q.includes("plot") || q.includes("画")) answer = "不知道选什么图：进入科研绘图，按学科和二级任务选。每张卡都有示例图、R/Python包和开始按钮。";
    if (q.includes("skill") || q.includes("流程")) answer = "想做自己的Skill：先进Skill市场看官方模板，再把你的常用步骤写成输入、流程、输出和复核规则。";
    if (q.includes("小岛") || q.includes("游戏")) answer = "科研小岛是游戏模式。你可以把常用功能绑定到建筑，做任务得积分，再拜访别人的小岛。";
    const box = document.querySelector("[data-r134-answer]");
    if (box) box.textContent = answer;
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const routeTarget = event.target.closest("[data-r134-route]");
      if (routeTarget) {
        event.preventDefault();
        go(routeTarget.getAttribute("data-r134-route"));
        return;
      }
      if (event.target.closest("[data-r134-next]")) {
        setActive(active + 1);
        restartTimer();
        return;
      }
      if (event.target.closest("[data-r134-prev]")) {
        setActive(active - 1);
        restartTimer();
        return;
      }
      const dot = event.target.closest("[data-r134-dot]");
      if (dot) {
        setActive(Number(dot.getAttribute("data-r134-dot")));
        restartTimer();
        return;
      }
      const toastTarget = event.target.closest("[data-r134-toast]");
      if (toastTarget) {
        toast(toastTarget.getAttribute("data-r134-toast"));
        return;
      }
      if (event.target.closest("[data-r134-assistant-toggle]")) {
        const panel = document.querySelector("[data-r134-assistant-panel]");
        if (panel) panel.hidden = !panel.hidden;
        return;
      }
      if (event.target.closest("[data-r134-assistant-close]")) {
        const panel = document.querySelector("[data-r134-assistant-panel]");
        if (panel) panel.hidden = true;
        return;
      }
      if (event.target.closest("[data-r134-ask]")) {
        answerQuestion();
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
      const obs = new MutationObserver(() => {
        const path = route();
        const app = document.getElementById("app");
        const isHome = path === "/home" || path === "/";
        const overwritten = app && app.getAttribute("data-round134-owned") === VERSION && !app.querySelector(".r134-shell");
        if (isHome && (app?.getAttribute("data-round134-owned") !== VERSION || overwritten)) render();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  start();
})();

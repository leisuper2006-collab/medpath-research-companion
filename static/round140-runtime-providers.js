(function () {
  const VERSION = "round140";
  const PROTECTED = new Set(["/island", "/island-builder"]);
  const providers = [
    ["openai", "OpenAI", "适合代码解释、图注、methods 和结构化输出", "OPENAI_API_KEY", "未配置"],
    ["deepseek", "DeepSeek", "适合中文科研问答、代码草案和长文本整理", "DEEPSEEK_API_KEY", "未配置"],
    ["qwen", "Qwen", "适合中文本地化任务和课程材料改写", "QWEN_API_KEY", "未配置"],
    ["claude", "Claude", "适合长文档审读、综述框架和安全提示", "ANTHROPIC_API_KEY", "未配置"],
    ["gemini", "Gemini", "适合多模态材料理解和图文说明草案", "GEMINI_API_KEY", "未配置"],
    ["ollama", "Ollama", "适合本地模型试验，不需要把数据发到外部", "OLLAMA_BASE_URL", "本地待检测"],
    ["custom", "自定义 OpenAI-compatible", "适合学校或实验室自建网关", "CUSTOM_BASE_URL / CUSTOM_API_KEY", "未配置"]
  ];
  const logs = [
    ["字段检查", "mock", "未读取用户密钥，只演示请求结构"],
    ["图注生成", "mock", "真实运行需本地 Runtime 或自有服务器"],
    ["Skill 推荐", "local", "按关键词规则完成，不调用模型"],
    ["HPC 脚本", "dry-run", "不会提交收费作业"]
  ];

  function route() {
    return (location.hash || "#/home").replace(/^#/, "").split("?")[0] || "/home";
  }
  function isProtected(path = route()) {
    return PROTECTED.has(path) || path.startsWith("/island/");
  }
  function owns(path = route()) {
    return path === "/runtime" || path === "/providers";
  }
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
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
    setTimeout(() => el.remove(), 2400);
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
      ["/providers", "模型接口", "BYOK"],
      ["/runtime", "本地运行", "R/Python"],
      ["/island", "科研小岛", "游戏模式"]
    ];
    return items.map(([href, label, hint]) => `<a href="#${href}" class="${route() === href ? "is-active" : ""}"><span>${esc(label)}</span><small>${esc(hint)}</small></a>`).join("");
  }
  function topbar() {
    return `
      <header class="r139-top">
        <nav>
          <a href="#/providers">模型接口</a>
          <a href="#/runtime">本地运行</a>
          <a href="#/plot-gallery">科研绘图</a>
          <a href="#/skills">Skill</a>
        </nav>
        <input class="r139-search" placeholder="搜 API、Runtime、R 包、Python 包、安全边界..." />
        <button class="r139-btn primary" data-r140-toast="静态站点不会保存密钥；请在本地 .env.local 配置。">安全说明</button>
      </header>`;
  }
  function shell(content) {
    return `
      <div class="r139-shell">
        <aside class="r139-side">
          <div class="r139-brand">
            <div class="r139-mark">荷</div>
            <div><strong>MedPath Research Companion</strong><span>BYOK Runtime</span></div>
          </div>
          <nav class="r139-nav">${nav()}</nav>
        </aside>
        <main>${topbar()}<div class="r139-page">${content}</div></main>
      </div>`;
  }
  function providerCard(item) {
    return `
      <article class="r139-card" style="min-height:300px">
        <div class="r139-chip-row"><span class="r139-chip">Provider</span><span class="r139-chip">${esc(item[4])}</span></div>
        <h3>${esc(item[1])}</h3>
        <p>${esc(item[2])}</p>
        <pre class="r139-code" style="min-height:70px">${esc(item[3])}=<不写入网页或仓库></pre>
        <footer>
          <button class="r139-btn primary" data-r140-toast="${esc(item[1])} 当前为 mock 检测：未发现前端保存的 Key。">测试</button>
          <button class="r139-btn" data-r140-toast="已复制环境变量名演示；真实密钥只放本地。">复制字段</button>
        </footer>
      </article>`;
  }
  function providersPage() {
    return shell(`
      <section class="r139-hero">
        <div>
          <span class="r139-kicker">BYOK Providers</span>
          <h1 class="r139-title">密钥留在你自己的电脑里</h1>
          <p class="r139-lead">GitHub Pages 只演示流程。真正调用模型、运行 R/Python、读取用户数据时，应在本地 Runtime 或自己的服务器完成；网页只显示 configured true/false，不保存、不展示 API Key。</p>
          <div class="r139-actions">
            <button class="r139-btn primary" data-r140-route="/runtime">看本地运行流程</button>
            <button class="r139-btn" data-r140-route="/plot-gallery">去科研绘图</button>
            <button class="r139-btn" data-r140-toast="如果没有配置密钥，所有模型调用都会走 mock。">无密钥怎么办</button>
          </div>
        </div>
        <aside class="r139-panel">
          <h3>安全底线</h3>
          <p>不要把 API Key 粘到网页、GitHub、截图、日志或聊天记录里。用户数据默认不上传到我们的服务器；静态页面只做演示。</p>
        </aside>
      </section>
      <div class="r139-grid" style="margin-top:18px">${providers.map(providerCard).join("")}</div>
    `);
  }
  function runtimePage() {
    return shell(`
      <section class="r139-hero">
        <div>
          <span class="r139-kicker">Local Runtime</span>
          <h1 class="r139-title">上传数据后，图在本地跑出来</h1>
          <p class="r139-lead">推荐流程是：网页选择图型和 Skill，本地 Runtime 检查字段，模型只辅助解释字段、改写代码和生成图注，真正绘图由用户电脑上的 R/Python 完成。</p>
          <div class="r139-actions">
            <button class="r139-btn primary" data-r140-toast="mock：字段检查通过 6/7，缺少 group 列时会提示补字段。">运行字段检查</button>
            <button class="r139-btn" data-r140-toast="mock：已生成 R/ggplot2 与 Python/matplotlib 两套代码草案。">生成代码</button>
            <button class="r139-btn" data-r140-route="/providers">配置模型接口</button>
          </div>
        </div>
        <aside class="r139-panel">
          <h3>.env.local 示例</h3>
          <pre class="r139-code">OPENAI_API_KEY=&lt;在本地填写，不进入网页&gt;
DEEPSEEK_API_KEY=&lt;在本地填写，不进入网页&gt;
CUSTOM_BASE_URL=https://your-gateway/v1
MEDPATH_RUNTIME_MODE=local</pre>
        </aside>
      </section>
      <section class="r139-detail" style="margin-top:18px">
        <div>
          <h1>绘图运行七步</h1>
          <p>上传数据、选择图型、检查字段、选择代码模板、运行本地绘图、生成图注、导出 ZIP。模型不是替你“编结果”，而是帮你理解字段、修改代码和写清楚 methods。</p>
          <pre class="r139-code">1. 上传 CSV / TSV
2. 选择图型，例如 UMAP、森林图、火山图
3. 本地字段检查
4. 模型辅助解释字段和代码
5. R/Python 本地执行
6. 输出图、代码、source data、caption
7. 导出审计报告</pre>
        </div>
        <div class="r139-panel">
          <h3>最近运行日志</h3>
          ${logs.map((log) => `<p><b>${esc(log[0])}</b> · ${esc(log[1])}<br>${esc(log[2])}</p>`).join("")}
        </div>
      </section>
    `);
  }
  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    const path = route();
    if (isProtected(path) || !owns(path)) return;
    document.body.classList.remove("medpath-r137-community", "medpath-r138-profile", "medpath-r139-skills");
    document.body.classList.add("medpath-r139-skills");
    app.setAttribute("data-round140-owned", VERSION);
    app.innerHTML = path === "/runtime" ? runtimePage() : providersPage();
  }
  function bind() {
    document.addEventListener("click", (event) => {
      const routeButton = event.target.closest("[data-r140-route]");
      if (routeButton) {
        event.preventDefault();
        go(routeButton.getAttribute("data-r140-route"));
        return;
      }
      const toastButton = event.target.closest("[data-r140-toast]");
      if (toastButton) {
        event.preventDefault();
        toast(toastButton.getAttribute("data-r140-toast"));
      }
    });
    window.addEventListener("hashchange", () => setTimeout(render, 0));
    const observer = new MutationObserver(() => {
      const app = document.getElementById("app");
      const shouldOwn = owns() && !isProtected();
      const overwritten = app && app.getAttribute("data-round140-owned") === VERSION && !app.querySelector(".r139-shell");
      if (shouldOwn && (app?.getAttribute("data-round140-owned") !== VERSION || overwritten)) render();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  bind();
  render();
})();

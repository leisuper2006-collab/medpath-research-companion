(() => {
  const CANVAS_W = 960;
  const CANVAS_H = 576;

  const routes = {
    library: "method-runner",
    classroom: "learn",
    pathology: "cases",
    bioinfo: "research",
    singlecell: "research",
    spatial: "research",
    plot: "plot-studio",
    skill: "skills",
    community: "community",
    archive: "profile",
    model: "settings",
    hpc: "method-runner",
    ethics: "skills",
    writing: "method-runner",
    stats: "research",
    shop: "community",
  };

  const buildings = [
    {
      id: "library", name: "文献图书馆", role: "综述、Meta分析、课题申报",
      x: 80, y: 128, w: 118, h: 88, color: "#f6e0a6", roof: "#62a0b4", route: routes.library,
      brief: "把“我想写什么”变成检索式、纳入排除标准和证据表。",
      quests: ["生成一份综述检索路线", "拆解 Meta 分析 PRISMA 流程", "整理基金申请的立项依据"],
    },
    {
      id: "classroom", name: "教学楼", role: "课程设计、PBL、课堂评价",
      x: 242, y: 118, w: 118, h: 96, color: "#f4d1cb", roof: "#74a870", route: routes.classroom,
      brief: "把一节课拆成目标、活动、案例、提问和评价。",
      quests: ["设计一节病理学课程", "生成课堂问题链", "做一个形成性评价 rubric"],
    },
    {
      id: "pathology", name: "病理室", role: "报告训练、超微病理、案例反馈",
      x: 414, y: 96, w: 132, h: 108, color: "#e9c6d1", roof: "#876fc2", route: routes.pathology,
      brief: "把学生报告草稿转为可复核的教学反馈，不给临床诊断意见。",
      quests: ["检查报告结构", "生成教师复核清单", "做超微结构导学问题"],
    },
    {
      id: "bioinfo", name: "实验楼", role: "生信、机器学习、数据审查",
      x: 620, y: 130, w: 126, h: 96, color: "#c9e6bd", roof: "#4f8a63", route: routes.bioinfo,
      brief: "先问清数据类型，再选 QC、统计、建模或可视化路线。",
      quests: ["选择生信分析路线", "审查数据字段", "生成机器学习基线方案"],
    },
    {
      id: "plot", name: "绘图工坊", role: "火山图、热图、森林图、UMAP",
      x: 732, y: 318, w: 120, h: 94, color: "#ead7ff", roof: "#6e5aa7", route: routes.plot,
      brief: "根据数据形态推荐图形、代码、图注和期刊风格。",
      quests: ["用示例数据画火山图", "检查图表方法说明", "生成论文组图计划"],
    },
    {
      id: "skill", name: "Skill工坊", role: "自定义Skill、Agent、模板",
      x: 528, y: 346, w: 130, h: 100, color: "#f4c783", roof: "#bf6d40", route: routes.skill,
      brief: "把你的常用科研动作做成可复用 Skill，再放到小岛上。",
      quests: ["创建一个Skill草稿", "绑定到小岛建筑", "写清楚不适用场景"],
    },
    {
      id: "singlecell", name: "单细胞温室", role: "单细胞、扰动分析、虚拟敲除",
      x: 130, y: 364, w: 134, h: 90, color: "#d8f0dc", roof: "#68b278", route: routes.singlecell,
      brief: "虚拟敲除不再是顶层大类，而是单细胞扰动分析的一条路线。",
      quests: ["比较 GEARS/scGen/CPA", "设计扰动分析输入表", "生成 QC 学习路径"],
    },
    {
      id: "spatial", name: "空间组学桥", role: "空间转录组、邻域、组织结构",
      x: 296, y: 378, w: 130, h: 90, color: "#c9e8ee", roof: "#4f8e9f", route: routes.spatial,
      brief: "把组织空间位置、细胞类型和病理结构连起来解释。",
      quests: ["生成空间组学入门路线", "列出邻域分析指标", "设计组织结构解释模板"],
    },
    {
      id: "community", name: "社区中心", role: "好友、拜访、排行榜",
      x: 686, y: 92, w: 118, h: 86, color: "#f4ecd2", roof: "#d7a44d", route: routes.community,
      brief: "看别人做的 Skill、小岛、案例和图表，也让别人拜访你的成果。",
      quests: ["查看本周高赞Skill", "申请拜访同学小岛", "给一个案例点赞"],
    },
    {
      id: "archive", name: "档案馆", role: "我的案例、收藏、作品",
      x: 56, y: 290, w: 112, h: 80, color: "#d8c7b2", roof: "#8b6b4b", route: routes.archive,
      brief: "存放输入、输出、教师复核和版本记录，不让成果散掉。",
      quests: ["整理我的Skill", "归档一个案例", "导出复核记录"],
    },
    {
      id: "model", name: "模型塔", role: "API、Mock模式、多模型审校",
      x: 818, y: 112, w: 92, h: 92, color: "#d7e3ff", roof: "#4867ad", route: routes.model,
      brief: "接入自己的大模型接口；没有密钥时走 Mock，不泄露 Key。",
      quests: ["检查Provider配置", "测试Mock调用", "生成多模型审校链"],
    },
    {
      id: "hpc", name: "服务器码头", role: "HPC dry-run、SLURM、模拟任务",
      x: 802, y: 214, w: 98, h: 78, color: "#b5ddcf", roof: "#4a7c71", route: routes.hpc,
      brief: "生成教学用 SLURM 任务草案，真实提交必须人工确认。",
      quests: ["生成HPC dry-run脚本", "估算计算资源", "绑定到L3模拟案例"],
    },
    {
      id: "ethics", name: "伦理花园", role: "隐私、幻觉、引用、临床误导",
      x: 370, y: 238, w: 108, h: 82, color: "#f2c3d0", roof: "#9d6179", route: routes.ethics,
      brief: "所有医学AI输出先过风险审计，再交给教师或专家复核。",
      quests: ["审计一段AI输出", "检查虚假引用", "生成风险整改建议"],
    },
    {
      id: "writing", name: "写作屋", role: "20+文章类型从0到1流程",
      x: 214, y: 254, w: 118, h: 84, color: "#f5dfa8", roof: "#bd7e41", route: routes.writing,
      brief: "Meta分析、综述、病例报告、方法论文等按流程搭建。",
      quests: ["选择文章类型", "生成材料清单", "输出章节任务树"],
    },
    {
      id: "stats", name: "统计站", role: "样本量、回归、差异检验",
      x: 566, y: 238, w: 112, h: 84, color: "#c7d4ef", roof: "#5d6a96", route: routes.stats,
      brief: "科研小白先说数据和问题，系统再推荐统计路线。",
      quests: ["判断统计问题", "生成分析假设", "检查变量类型"],
    },
    {
      id: "shop", name: "积分商店", role: "建筑、皮肤、徽章、装饰",
      x: 420, y: 454, w: 118, h: 82, color: "#f1bb82", roof: "#b8613a", route: routes.shop,
      brief: "做案例、建Skill、画图和被点赞都能获得积分。",
      quests: ["兑换建筑皮肤", "查看徽章", "购买小岛装饰"],
    },
  ];

  const leaders = [
    ["yt", "虚拟扰动岛", 368714, "#7fa7d9", "#d9634f"],
    ["flanker", "Meta分析图书馆", 351051, "#d94c45", "#f1d37b"],
    ["Kilmmmo", "空间组学桥", 337014, "#6e9f67", "#49758a"],
    ["JoeyYe", "报告训练室", 302801, "#424b74", "#9ac3e8"],
    ["Ulysses", "绘图工坊", 257493, "#c75a40", "#e3b178"],
    ["天才小易", "Skill工坊", 221005, "#8d5fa8", "#9ddc86"],
  ];

  const resources = [
    ["案例", 42.961, "#df5e57"],
    ["图表", 181.255, "#d9c28b"],
    ["Skill", 550.387, "#f1a65f"],
    ["复核", 274.657, "#b6c7ee"],
    ["积分", 142.613, "#f4d35e"],
  ];

  const agentMemories = [
    {
      title: "观察",
      body: "六月刚走进单细胞温室，她看到用户正在比较 GEARS、scGen 与 CPA，准备把虚拟敲除放回“单细胞扰动分析”路径。",
    },
    {
      title: "计划",
      body: "Ming 计划先整理一个 demo 数据字段表，再把结果交给伦理花园检查是否出现虚假引用或过度诊断表述。",
    },
    {
      title: "反思",
      body: "Kelly 记录：科研小白需要先得到“下一步该产出什么”，而不是一口气读完所有方法名。",
    },
    {
      title: "对话",
      body: "你可以点建筑触发对话，也可以把自己的 Skill 绑定成建筑。正式版会把这些记录写入账号时间线。",
    },
  ];

  const simulationLines = [
    "June 正在图书馆整理一条 Meta 分析学习路线。",
    "Ming 把一份合成案例送到伦理花园复核。",
    "Kelly 在绘图工坊比较火山图与热图的适用场景。",
    "Dawn 申请拜访你的 Skill 工坊。",
    "服务器码头生成了一份 HPC dry-run 草稿，等待人工确认。",
  ];

  const hotbar = [
    ["Yale", "#f0a4b7", "#f7d5a5"],
    ["bing", "#e5d2a4", "#a5d5e8"],
    ["肖路", "#bd9161", "#d7a7f0"],
    ["Leo", "#566a9c", "#b9d1f2"],
    ["Mia", "#83b36b", "#f0d27e"],
  ];

  const catalogTypes = ["图书馆", "实验楼", "温室", "观测站", "教学楼", "病理室", "画图站", "数据塔", "档案馆", "咖啡屋", "喷泉", "桥", "公告牌", "小屋", "商店"];
  const catalogTopics = ["综述", "Meta分析", "单细胞", "空间组学", "病理报告", "超微病理", "机器学习", "RAG", "统计", "科研绘图", "文章工坊", "伦理审计", "案例生成", "HPC", "教学评价", "开源工具"];
  const buildingCatalog = Array.from({ length: 120 }, (_, i) => {
    const type = catalogTypes[i % catalogTypes.length];
    const topic = catalogTopics[(i * 5) % catalogTopics.length];
    return {
      name: `${topic}${type}`,
      desc: `可绑定 ${topic} 相关Skill、案例或学习路径。`,
      cost: 80 + (i % 12) * 25,
    };
  });

  const state = {
    root: null,
    canvas: null,
    ctx: null,
    selected: buildings[0],
    player: { x: 492, y: 300, tx: 492, ty: 300, dir: 1 },
    points: Number(localStorage.getItem("medpath_pixel_points") || 14500),
    visits: Number(localStorage.getItem("medpath_pixel_visits") || 39),
    note: "点建筑，角色会走过去；点任务会获得积分并留下科研训练记录。",
    showCatalog: false,
    tab: "org",
    mobilePanelOpen: false,
    tick: 0,
    npcs: [
      { name: "June", x: 500, y: 190, tx: 500, ty: 190, c: "#f4a9a8" },
      { name: "Ming", x: 612, y: 322, tx: 612, ty: 322, c: "#98c4f0" },
      { name: "Kelly", x: 284, y: 216, tx: 284, ty: 216, c: "#c2e78d" },
      { name: "Dawn", x: 760, y: 380, tx: 760, ty: 380, c: "#f1c86d" },
    ],
  };

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function shell() {
    return `
      <div class="r76-town-root" data-r76-root>
        <canvas class="r76-stage" width="${CANVAS_W}" height="${CANVAS_H}" data-r76-canvas aria-label="像素科研小镇游戏画布"></canvas>
        <div class="r76-topbar">
          <div class="r76-player-card">
            <div class="r76-avatar" aria-hidden="true"></div>
            <div>
              <div class="r76-name-line">MedPath小镇 <span>Lv. 12 科研新手村长</span></div>
              <div class="r76-bars">
                <div class="r76-bar"><span>心</span><i style="--w:86%;--c:#7df36d"></i><b>86</b></div>
                <div class="r76-bar"><span>知</span><i style="--w:72%;--c:#f3c46d"></i><b>72</b></div>
                <div class="r76-bar"><span>能</span><i style="--w:64%;--c:#6bc7f1"></i><b>64</b></div>
              </div>
            </div>
          </div>
          <div class="r76-status-card"><span>金币</span><b data-r76-points>${state.points.toLocaleString()}</b><span>拜访</span><b data-r76-visits>${state.visits}</b></div>
          <div class="r76-day-card">DAY 22<small>17:04 · 学习中</small></div>
        </div>

        <div class="r76-floating-note" data-r76-note>${esc(state.note)}</div>

        <aside class="r76-left-panel" data-r76-left-panel>
          <div class="r76-panel-tabs">
            <button class="active" data-r76-tab="org">组织</button>
            <button data-r76-tab="agent">智能体</button>
          </div>
          <div class="r76-leader-list" data-r76-panel="org">
            ${leaders.map((item, idx) => `
              <div class="r76-leader">
                <span class="r76-rank">${idx + 1}</span>
                <span class="r76-mini-face" style="--hair:${item[3]};--cloth:${item[4]}"></span>
                <span><strong>${esc(item[0])}</strong><small>${esc(item[1])} · ${item[2].toLocaleString()} 分</small></span>
                <button title="申请拜访" data-r76-visit="${esc(item[0])}">▶</button>
              </div>`).join("")}
          </div>
          <div class="r76-agent-memory" data-r76-panel="agent" hidden>
            ${agentMemories.map((item) => `
              <article class="r76-memory-card">
                <b>${esc(item.title)}</b>
                <small>${esc(item.body)}</small>
              </article>`).join("")}
          </div>
          <div class="r76-resource-bag">
            ${resources.map(([name, value, color]) => `
              <div class="r76-resource"><span style="--c:${color}"></span><b>${esc(name)}</b><strong>${value} $</strong></div>`).join("")}
          </div>
        </aside>

        <nav class="r76-right-rail" aria-label="小岛快捷操作">
          <button data-r76-action="home" title="回到广场">⌂</button>
          <button data-r76-action="catalog" title="建筑库">▣</button>
          <button data-r76-action="quests" title="任务">☰</button>
          <button data-r76-action="rank" title="排行榜">?</button>
        </nav>

        <section class="r76-dialog" data-r76-dialog></section>
        <section class="r76-sim-strip" data-r76-sim-strip>
          ${simulationLines.slice(0, 3).map((line) => `<div class="r76-sim-line">${esc(line)}</div>`).join("")}
        </section>

        <div class="r76-tool">
          <button data-r76-action="catalog">建筑库 120+</button>
          <button data-r76-action="random">随机逛逛</button>
        </div>

        <div class="r76-building-drawer" data-r76-catalog>
          ${buildingCatalog.map((item) => `
            <article class="r76-catalog-card">
              <b>${esc(item.name)}</b>
              <small>${esc(item.desc)}</small>
              <small>${item.cost} 积分 · 可绑定Skill</small>
            </article>`).join("")}
        </div>

        <div class="r76-hotbar">
          ${hotbar.map(([name, hair, cloth]) => `
            <button class="r76-bottom-card" data-r76-agent="${esc(name)}">
              <span class="r76-mini-face" style="--hair:${hair};--cloth:${cloth}"></span>
              <small>${esc(name)}</small>
            </button>`).join("")}
        </div>
      </div>
    `;
  }

  function syncText() {
    const root = state.root;
    if (!root) return;
    root.querySelector("[data-r76-points]").textContent = state.points.toLocaleString();
    root.querySelector("[data-r76-visits]").textContent = String(state.visits);
    root.querySelector("[data-r76-note]").textContent = state.note;
    root.querySelector("[data-r76-catalog]").classList.toggle("is-open", state.showCatalog);
    root.querySelector("[data-r76-left-panel]")?.classList.toggle("is-open-mobile", state.mobilePanelOpen);
    root.querySelectorAll("[data-r76-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.r76Tab === state.tab);
    });
    root.querySelectorAll("[data-r76-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.r76Panel !== state.tab;
    });
  }

  function setDialog(building) {
    state.selected = building;
    const dialog = state.root?.querySelector("[data-r76-dialog]");
    if (!dialog) return;
    dialog.innerHTML = `
      <header><strong>${esc(building.name)}</strong><span>${esc(building.role)}</span></header>
      <div class="r76-dialog-body">
        <p>${esc(building.brief)}</p>
        <div class="r76-quest-list">
          ${building.quests.map((quest) => `<button data-r76-quest="${esc(quest)}">${esc(quest)}</button>`).join("")}
        </div>
        <div class="r76-dialog-actions">
          <a href="#/${esc(building.route)}">进入功能页</a>
          <button class="secondary" data-r76-pin="${esc(building.id)}">设为常用建筑 +${24 + building.name.length}</button>
          <button class="secondary" data-r76-build>把我的Skill做成建筑</button>
        </div>
      </div>
    `;
    dialog.querySelectorAll("[data-r76-quest]").forEach((button) => {
      button.addEventListener("click", () => {
        state.points += 18;
        state.note = `已接取任务：「${button.dataset.r76Quest}」。这是本地训练记录，后续可接入真实账号和教师复核。`;
        persist();
        syncText();
      });
    });
    dialog.querySelector("[data-r76-pin]")?.addEventListener("click", () => {
      state.points += 24 + building.name.length;
      state.note = `已把「${building.name}」设为常用建筑。后续会支持拖拽摆放、公开展示和他人拜访。`;
      persist();
      syncText();
    });
    dialog.querySelector("[data-r76-build]")?.addEventListener("click", () => {
      state.showCatalog = true;
      state.note = "建筑库已打开：每个建筑都可以绑定一个Skill、案例、绘图模板或学习路径。";
      syncText();
    });
  }

  function persist() {
    localStorage.setItem("medpath_pixel_points", String(state.points));
    localStorage.setItem("medpath_pixel_visits", String(state.visits));
  }

  function moveTo(x, y) {
    state.player.tx = Math.max(28, Math.min(CANVAS_W - 28, x));
    state.player.ty = Math.max(56, Math.min(CANVAS_H - 30, y));
  }

  function hitBuilding(x, y) {
    return buildings.find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h + 24);
  }

  function selectBuilding(building) {
    if (!building) return;
    moveTo(building.x + building.w / 2, building.y + building.h + 20);
    setDialog(building);
    state.note = `正在前往「${building.name}」：${building.brief}`;
    syncText();
  }

  function drawPixelRect(ctx, x, y, w, h, fill, stroke = "#16202a") {
    ctx.fillStyle = fill;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.round(x) + 1.5, Math.round(y) + 1.5, Math.round(w) - 3, Math.round(h) - 3);
  }

  function drawTileMap(ctx) {
    ctx.fillStyle = "#79b865";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    for (let y = 0; y < CANVAS_H; y += 32) {
      for (let x = 0; x < CANVAS_W; x += 32) {
        if ((x / 32 + y / 32) % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.04)";
          ctx.fillRect(x, y, 32, 32);
        }
      }
    }

    ctx.fillStyle = "#40505a";
    ctx.fillRect(0, 58, CANVAS_W, 54);
    ctx.fillRect(660, 0, 72, CANVAS_H);
    ctx.fillRect(0, 446, CANVAS_W, 50);
    ctx.fillStyle = "#d7c6a4";
    ctx.fillRect(190, 200, 530, 180);
    ctx.fillRect(206, 214, 500, 152);

    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 3;
    ctx.setLineDash([26, 20]);
    ctx.beginPath();
    ctx.moveTo(0, 84);
    ctx.lineTo(CANVAS_W, 84);
    ctx.moveTo(696, 0);
    ctx.lineTo(696, CANVAS_H);
    ctx.moveTo(0, 471);
    ctx.lineTo(CANVAS_W, 471);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#4fb3e8";
    ctx.fillRect(18, 498, 410, 54);
    ctx.fillRect(30, 520, 358, 36);
    ctx.fillStyle = "#f1d5a7";
    ctx.fillRect(368, 500, 70, 22);
    ctx.fillRect(382, 522, 70, 18);

    drawFountain(ctx, 604, 286);
    drawBenches(ctx);
    drawTrees(ctx);
    drawFences(ctx);
  }

  function drawFountain(ctx, x, y) {
    ctx.fillStyle = "#516070";
    ctx.fillRect(x - 27, y - 15, 54, 30);
    ctx.fillStyle = "#99e4ff";
    ctx.fillRect(x - 19, y - 9, 38, 18);
    ctx.fillStyle = "#f3f7fc";
    ctx.fillRect(x - 4, y - 26, 8, 28);
    ctx.fillRect(x - 12, y - 18, 24, 6);
  }

  function drawBenches(ctx) {
    [[245, 178], [318, 178], [244, 410], [600, 184], [786, 466]].forEach(([x, y]) => {
      ctx.fillStyle = "#704b32";
      ctx.fillRect(x, y, 54, 8);
      ctx.fillRect(x + 4, y + 12, 46, 8);
      ctx.fillStyle = "#3d2c22";
      ctx.fillRect(x + 6, y + 20, 5, 14);
      ctx.fillRect(x + 42, y + 20, 5, 14);
    });
  }

  function drawTrees(ctx) {
    [[62, 160], [172, 86], [820, 58], [844, 408], [80, 420], [908, 500], [462, 64], [746, 252], [566, 510], [48, 526]].forEach(([x, y], i) => {
      ctx.fillStyle = "#7a4e2e";
      ctx.fillRect(x + 12, y + 26, 10, 24);
      ctx.fillStyle = i % 3 === 0 ? "#377b4a" : "#4f9b56";
      ctx.fillRect(x, y + 10, 36, 28);
      ctx.fillRect(x + 6, y, 24, 22);
      ctx.fillStyle = "rgba(255,255,255,.16)";
      ctx.fillRect(x + 6, y + 6, 9, 6);
    });
  }

  function drawFences(ctx) {
    ctx.fillStyle = "#f4e4bf";
    for (let x = 42; x < 376; x += 22) {
      ctx.fillRect(x, 540, 7, 24);
    }
    ctx.fillRect(42, 548, 332, 6);
    ctx.fillRect(42, 558, 332, 6);
  }

  function drawBuilding(ctx, b) {
    const shadow = "rgba(30, 24, 22, 0.18)";
    ctx.fillStyle = shadow;
    ctx.fillRect(b.x + 8, b.y + b.h - 4, b.w, 18);

    ctx.fillStyle = b.roof;
    ctx.fillRect(b.x + 10, b.y, b.w - 20, 22);
    ctx.fillRect(b.x, b.y + 18, b.w, 22);
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.fillRect(b.x + 10, b.y + 4, b.w - 36, 5);

    drawPixelRect(ctx, b.x + 8, b.y + 34, b.w - 16, b.h - 34, b.color);

    ctx.fillStyle = "#fff6d6";
    ctx.fillRect(b.x + 18, b.y + 48, 22, 22);
    ctx.fillRect(b.x + b.w - 40, b.y + 48, 22, 22);
    ctx.fillStyle = "#41586b";
    ctx.fillRect(b.x + 21, b.y + 51, 16, 5);
    ctx.fillRect(b.x + b.w - 37, b.y + 51, 16, 5);

    ctx.fillStyle = "#6f4a35";
    ctx.fillRect(b.x + b.w / 2 - 12, b.y + b.h - 34, 24, 32);
    ctx.fillStyle = "#f9edcd";
    ctx.fillRect(b.x + 12, b.y + b.h - 18, b.w - 24, 15);
    ctx.fillStyle = "#222";
    ctx.font = "700 11px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(b.name.slice(0, 6), b.x + b.w / 2, b.y + b.h - 6);

    if (state.selected?.id === b.id) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      ctx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8);
      ctx.strokeStyle = "#7df36d";
      ctx.lineWidth = 3;
      ctx.strokeRect(b.x - 9, b.y - 9, b.w + 18, b.h + 18);
    }
  }

  function drawNpc(ctx, npc) {
    ctx.fillStyle = "rgba(0,0,0,.17)";
    ctx.fillRect(npc.x - 10, npc.y + 14, 22, 7);
    ctx.fillStyle = npc.c;
    ctx.fillRect(npc.x - 8, npc.y - 2, 16, 20);
    ctx.fillStyle = "#f2c49b";
    ctx.fillRect(npc.x - 7, npc.y - 14, 14, 14);
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(npc.x - 8, npc.y - 18, 16, 6);
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.fillRect(npc.x - 22, npc.y - 34, 44, 14);
    ctx.fillStyle = "#31343b";
    ctx.font = "700 9px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(npc.name, npc.x, npc.y - 24);
  }

  function drawPlayer(ctx) {
    const p = state.player;
    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fillRect(p.x - 12, p.y + 16, 26, 8);
    ctx.fillStyle = "#2f6e95";
    ctx.fillRect(p.x - 10, p.y - 2, 20, 24);
    ctx.fillStyle = "#f0c19b";
    ctx.fillRect(p.x - 9, p.y - 20, 18, 18);
    ctx.fillStyle = "#714b35";
    ctx.fillRect(p.x - 10, p.y - 24, 20, 8);
    ctx.fillStyle = "#fff";
    ctx.fillRect(p.x - 4, p.y - 13, 3, 3);
    ctx.fillRect(p.x + 4, p.y - 13, 3, 3);
    ctx.fillStyle = "#111";
    ctx.fillRect(p.x - 4, p.y - 12, 2, 2);
    ctx.fillRect(p.x + 4, p.y - 12, 2, 2);
    ctx.fillStyle = "#f3d986";
    ctx.fillRect(p.x + 12, p.y + 3, 9, 13);
  }

  function updateWorld() {
    state.tick += 1;
    const p = state.player;
    p.x += (p.tx - p.x) * 0.065;
    p.y += (p.ty - p.y) * 0.065;

    state.npcs.forEach((npc, i) => {
      if (state.tick % (140 + i * 23) === 0) {
        npc.tx = 220 + Math.random() * 500;
        npc.ty = 180 + Math.random() * 270;
      }
      npc.x += (npc.tx - npc.x) * 0.018;
      npc.y += (npc.ty - npc.y) * 0.018;
    });

    if (state.tick % 260 === 0 && state.root) {
      const strip = state.root.querySelector("[data-r76-sim-strip]");
      if (strip) {
        const offset = Math.floor(state.tick / 260) % simulationLines.length;
        strip.innerHTML = [0, 1, 2].map((i) => {
          const line = simulationLines[(offset + i) % simulationLines.length];
          return `<div class="r76-sim-line">${esc(line)}</div>`;
        }).join("");
      }
    }
  }

  function render() {
    if (!state.ctx) return;
    const ctx = state.ctx;
    ctx.imageSmoothingEnabled = false;
    updateWorld();
    drawTileMap(ctx);

    const drawables = [
      ...buildings.map((b) => ({ y: b.y + b.h, type: "building", item: b })),
      ...state.npcs.map((n) => ({ y: n.y, type: "npc", item: n })),
      { y: state.player.y, type: "player" },
    ].sort((a, b) => a.y - b.y);

    drawables.forEach((d) => {
      if (d.type === "building") drawBuilding(ctx, d.item);
      if (d.type === "npc") drawNpc(ctx, d.item);
      if (d.type === "player") drawPlayer(ctx);
    });

    requestAnimationFrame(render);
  }

  function canvasPoint(event) {
    const rect = state.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  }

  function attachEvents() {
    state.canvas.addEventListener("click", (event) => {
      const p = canvasPoint(event);
      const b = hitBuilding(p.x, p.y);
      if (b) selectBuilding(b);
      else {
        moveTo(p.x, p.y);
        state.note = "角色已移动。靠近建筑或直接点击建筑，就会打开任务对话。";
        syncText();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (!state.root || !location.hash.includes("island")) return;
      const step = 28;
      if (["ArrowUp", "w", "W"].includes(event.key)) moveTo(state.player.tx, state.player.ty - step);
      if (["ArrowDown", "s", "S"].includes(event.key)) moveTo(state.player.tx, state.player.ty + step);
      if (["ArrowLeft", "a", "A"].includes(event.key)) moveTo(state.player.tx - step, state.player.ty);
      if (["ArrowRight", "d", "D"].includes(event.key)) moveTo(state.player.tx + step, state.player.ty);
    });

    state.root.querySelectorAll("[data-r76-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.r76Action;
        if (action === "home") {
          moveTo(492, 300);
          state.note = "已回到科研广场。你可以从这里去图书馆、实验楼、病理室或Skill工坊。";
        }
        if (action === "catalog") {
          state.showCatalog = !state.showCatalog;
          state.note = state.showCatalog ? "建筑库已打开：120种建筑模板可绑定不同科研Skill。" : "建筑库已收起。";
        }
        if (action === "quests") {
          state.mobilePanelOpen = false;
          state.note = "今日任务：做一个案例、试一个方法、画一张图、把输出交给教师复核。";
          setDialog(state.selected || buildings[0]);
        }
        if (action === "rank") {
          state.mobilePanelOpen = !state.mobilePanelOpen;
          state.tab = "org";
          state.note = "排行榜展示Skill、小岛和案例的热度；当前为本地演示数据，不代表真实用户排名。";
        }
        if (action === "random") {
          selectBuilding(buildings[Math.floor(Math.random() * buildings.length)]);
        }
        syncText();
      });
    });

    state.root.querySelectorAll("[data-r76-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.tab = button.dataset.r76Tab;
        state.note = state.tab === "agent"
          ? "智能体面板展示观察、计划、反思与对话，这是借鉴 Generative Agents/AI Town 的本地教学化机制。"
          : "组织榜单展示本地演示排名；正式版会接账号、点赞、拜访和Skill发布记录。";
        syncText();
      });
    });

    state.root.querySelectorAll("[data-r76-visit]").forEach((button) => {
      button.addEventListener("click", () => {
        state.visits += 1;
        state.note = `已申请拜访 ${button.dataset.r76Visit} 的科研小岛。当前为本地演示，正式社交需账号系统。`;
        persist();
        syncText();
      });
    });

    state.root.querySelectorAll("[data-r76-agent]").forEach((button) => {
      button.addEventListener("click", () => {
        state.note = `${button.dataset.r76Agent} 已加入你的科研小队。后续会支持性格、目标和任务偏好设置。`;
        state.points += 10;
        persist();
        syncText();
      });
    });
  }

  function mount() {
    if (window.__MEDPATH_R77_ENABLED) return;
    const stage = document.getElementById("r73-island-stage");
    if (!stage || stage.dataset.r76Mounted === "1") return;
    if (location.hash && !location.hash.includes("island")) return;

    stage.dataset.r76Mounted = "1";
    stage.innerHTML = shell();
    document.body.classList.add("r76-game-active");
    state.root = stage.querySelector("[data-r76-root]");
    state.canvas = stage.querySelector("[data-r76-canvas]");
    state.ctx = state.canvas.getContext("2d");
    setDialog(buildings[0]);
    attachEvents();
    syncText();
    requestAnimationFrame(render);
  }

  function resetForRoute() {
    if (window.__MEDPATH_R77_ENABLED) return;
    if (!location.hash.includes("island")) return;
    const stage = document.getElementById("r73-island-stage");
    if (stage && stage.dataset.r76Mounted !== "1") mount();
  }

  function observe() {
    mount();
    const app = document.getElementById("app");
    if (app && "MutationObserver" in window) {
      new MutationObserver(() => setTimeout(resetForRoute, 60)).observe(app, { childList: true, subtree: true });
    }
    window.addEventListener("hashchange", () => setTimeout(resetForRoute, 80));
    setInterval(resetForRoute, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observe);
  } else {
    observe();
  }
})();

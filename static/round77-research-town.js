(() => {
  window.__MEDPATH_R77_ENABLED = true;

  const hotspots = [
    { id: "library", name: "图书馆", sub: "文献与综述", route: "method-runner", x: 31, y: 23, w: 170, h: 128, labelX: 31, labelY: 17, desc: "从“我想写什么”开始，拆成检索词、数据库、纳入排除标准、证据表和综述提纲。", tasks: ["生成综述检索路线", "搭建Meta分析流程", "整理课题申请依据"] },
    { id: "pathology", name: "病理实验室", sub: "病理分析与报告", route: "cases", x: 50, y: 24, w: 178, h: 132, labelX: 50, labelY: 17, desc: "用于合成病理教学案例、学生病理报告反馈和教师复核，不输出真实临床诊断意见。", tasks: ["检查学生报告结构", "生成教师复核清单", "制作合成病理案例"] },
    { id: "classroom", name: "教学楼", sub: "课程设计与PBL", route: "learn", x: 68, y: 24, w: 178, h: 128, labelX: 68, labelY: 17, desc: "把一节课拆成学习目标、活动、PBL问题链、课堂任务和形成性评价。", tasks: ["设计病理学课程", "生成PBL问题链", "做课堂评价量规"] },
    { id: "singlecell", name: "单细胞温室", sub: "单细胞与空间组学", route: "research", x: 82, y: 31, w: 188, h: 144, labelX: 82, labelY: 22, desc: "虚拟敲除归入单细胞扰动分析路线，和GEARS、scGen、CPA等方法一起比较。", tasks: ["比较扰动分析方法", "生成单细胞QC路线", "设计空间组学学习路径"] },
    { id: "plot", name: "绘图工坊", sub: "可视化与Plot Studio", route: "plot-studio", x: 30, y: 51, w: 170, h: 138, labelX: 29.5, labelY: 42, desc: "从数据字段出发推荐图型，生成示例图、代码、图注和方法描述。", tasks: ["用示例数据画火山图", "检查数据能否画热图", "生成论文组图计划"] },
    { id: "community", name: "社区广场", sub: "交流、排行、活动", route: "community", x: 53, y: 48, w: 164, h: 120, labelX: 53, labelY: 42, desc: "展示高赞Skill、热门小岛、案例作品、拜访申请和排行榜，当前为本地演示数据。", tasks: ["查看高赞Skill", "申请拜访同学小岛", "发布我的Skill"] },
    { id: "skill", name: "Skill工坊", sub: "创建你的AI Skill", route: "skills", x: 74, y: 52, w: 168, h: 132, labelX: 75, labelY: 43, desc: "把常用科研动作做成可复用Skill，再绑定成小岛建筑。", tasks: ["创建Skill草稿", "绑定Skill到建筑", "补全安全边界"] },
    { id: "ethics", name: "伦理花园", sub: "伦理治理与风险审查", route: "skills", x: 35, y: 80, w: 180, h: 124, labelX: 35, labelY: 72, desc: "检查隐私、幻觉、虚假引用、临床误导和学术诚信风险。医学AI输出仅用于教学与科研训练。", tasks: ["审查一段AI输出", "检查虚假引用", "生成复核提醒"] },
    { id: "hpc", name: "服务器码头", sub: "模型API与HPC任务", route: "method-runner", x: 70, y: 78, w: 210, h: 152, labelX: 72, labelY: 70, desc: "生成模型调用、HPC dry-run和SLURM任务草案；真实密钥、登录和收费作业必须人工确认。", tasks: ["生成HPC dry-run脚本", "检查模型Provider设置", "绑定L3模拟案例"] },
  ];

  const leaders = [
    ["小明同学", "综述工作流", 3860, "#e8ba54", "#5bb3e6"],
    ["Path_Queen", "病理案例岛", 2740, "#6a3f25", "#f0c170"],
    ["BioWalker", "单细胞路线", 2310, "#f1a1c5", "#88d27e"],
    ["Researcher_X", "开源工具箱", 1980, "#73452d", "#9dd5f7"],
    ["CellExplorer", "扰动分析", 1650, "#7aa0dd", "#fff0a8"],
    ["MedScholar", "Meta分析", 1420, "#5e6874", "#bdd6f4"],
    ["Scientist_Y", "绘图模板", 1210, "#f3b48a", "#d9a4f4"],
    ["Path_Lover", "报告训练", 1150, "#664126", "#c7e98f"],
  ];

  const feed = [
    ["AI助手-小渡", "新的每日任务已经刷新啦！", "10:25"],
    ["Path_Queen", "发布了新的案例：胃癌PBL教学案例", "10:21"],
    ["BioWalker", "在单细胞分析中获得了新徽章！", "10:18"],
  ];

  const agentRoster = [
    { id: "jun", name: "小珺", role: "综述规划", color: "#7fc7ff", route: ["library", "classroom", "community", "library"], line: "我先帮你把问题拆成检索词和证据表。" },
    { id: "pathbot", name: "PathBot", role: "病理复核", color: "#ffb26e", route: ["pathology", "ethics", "classroom", "pathology"], line: "报告反馈要先讲清楚结构，再提醒教师复核。" },
    { id: "cellfox", name: "CellFox", role: "组学向导", color: "#98e58d", route: ["singlecell", "hpc", "plot", "singlecell"], line: "虚拟敲除属于单细胞扰动分析，不再单独放成大类。" },
    { id: "plotter", name: "Plotter", role: "绘图伙伴", color: "#d7a1ff", route: ["plot", "library", "skill", "plot"], line: "先看数据字段，再决定画火山图、热图还是UMAP。" },
  ];

  const dailyQuests = [
    { id: "q-case", label: "做一个教学案例", target: "pathology", reward: 28 },
    { id: "q-method", label: "理解一个科研方法", target: "singlecell", reward: 24 },
    { id: "q-plot", label: "生成一张示例图", target: "plot", reward: 26 },
  ];

  const catalogSeeds = [
    ["文献图书馆", "综述、Meta分析、课题申报入口", "library", "木质蓝瓦", "综述与证据"],
    ["病理实验室", "报告训练与合成案例", "pathology", "绿瓦显微镜", "病理训练"],
    ["教学楼", "课程设计、PBL、课堂任务", "classroom", "橙瓦黑板", "教学设计"],
    ["单细胞温室", "单细胞、扰动分析、空间组学", "singlecell", "玻璃温室", "组学探索"],
    ["绘图工坊", "火山图、热图、UMAP、森林图", "plot", "画架小屋", "科研绘图"],
    ["Skill工坊", "自定义AI Skill与Agent", "skill", "紫瓦工坊", "Skill创作"],
    ["伦理花园", "隐私、幻觉、引用、误导审查", "ethics", "藤蔓花园", "安全治理"],
    ["服务器码头", "模型API与HPC dry-run", "hpc", "码头机房", "计算任务"],
    ["统计小屋", "样本量、回归、差异检验", "plot", "白墙小屋", "统计入门"],
    ["开源集市", "GitHub工具导航和方法仓库", "community", "集市摊位", "开源工具"],
    ["写作屋", "20+文章类型全流程", "library", "红顶书屋", "论文写作"],
    ["档案馆", "案例、收藏、复核记录", "pathology", "石墙档案", "资料归档"],
    ["模型塔", "多模型路由和Mock模式", "hpc", "蓝色高塔", "模型管理"],
    ["伙伴驿站", "好友、拜访、点赞", "community", "邮局驿站", "社区社交"],
    ["徽章馆", "积分、成就、排行榜", "community", "金色展馆", "成就激励"],
    ["RAG数据塔", "知识库和引用核验", "library", "数据灯塔", "知识增强"],
  ];

  const skins = [
    ["晨光版", "morning"],
    ["夜读版", "night"],
    ["海岛版", "island"],
    ["樱花版", "sakura"],
    ["玻璃版", "glass"],
    ["木屋版", "wood"],
    ["学院版", "academy"],
  ];

  const catalogGroups = [
    { id: "all", label: "全部建筑", hint: "看全部可摆放建筑" },
    { id: "teaching", label: "教学场景", hint: "课程、PBL、病理报告" },
    { id: "research", label: "科研训练", hint: "综述、组学、绘图和写作" },
    { id: "governance", label: "治理评价", hint: "伦理、安全、评价量规" },
    { id: "community", label: "社区激励", hint: "好友、拜访、排行和徽章" },
    { id: "computing", label: "模型计算", hint: "模型 API、RAG、HPC dry-run" },
  ];

  const targetGroup = {
    classroom: "teaching",
    pathology: "teaching",
    singlecell: "research",
    plot: "research",
    library: "research",
    ethics: "governance",
    skill: "governance",
    community: "community",
    hpc: "computing",
  };

  function catalogGroupOf(target, tag) {
    if (tag && /徽章|社区|社交|开源工具/.test(tag)) return "community";
    if (tag && /模型|计算|知识增强/.test(tag)) return "computing";
    return targetGroup[target] || "research";
  }

  function unlockFor(index, skinIndex) {
    if (skinIndex > 4) return "完成3次任务或被点赞后解锁";
    if (skinIndex > 1) return "完成1次相关任务后解锁";
    return "新手可用";
  }

  const catalog = catalogSeeds.flatMap(([name, desc, target, style, tag], index) =>
    skins.map(([skin, skinKey], skinIndex) => ({
      id: `${target}-${index}-${skinIndex}`,
      name: `${name}·${skin}`,
      desc,
      target,
      skinKey,
      style,
      tag,
      cost: 80 + index * 12 + skinIndex * 18,
      rarity: skinIndex > 4 ? "稀有" : skinIndex > 1 ? "进阶" : "基础",
      group: catalogGroupOf(target, tag),
      unlock: unlockFor(index, skinIndex),
      bindHint: `绑定到${hotspots.find((b) => b.id === target)?.name || "科研功能"}`,
    }))
  );

  const decorCatalog = [
    { id: "lamp-data", name: "数据路灯", icon: "✦", kind: "lamp", desc: "放在常用建筑旁，表示这个入口有数据审查和日志记录。", cost: 26, rarity: "基础", x: 47, y: 42 },
    { id: "bench-review", name: "复核长椅", icon: "▱", kind: "bench", desc: "提醒所有AI输出都要经过教师或专家复核。", cost: 28, rarity: "基础", x: 58, y: 56 },
    { id: "flower-ethics", name: "伦理花坛", icon: "✿", kind: "flower", desc: "适合摆在病理、案例或模型建筑附近，提示隐私和误导风险。", cost: 34, rarity: "基础", x: 39, y: 66 },
    { id: "sign-method", name: "方法路牌", icon: "▸", kind: "sign", desc: "把新手带到学习路径、输入要求和示例输出。", cost: 32, rarity: "基础", x: 63, y: 43 },
    { id: "pond-focus", name: "静思小池", icon: "◌", kind: "pond", desc: "用于收藏长期课题、综述想法和待复核问题。", cost: 46, rarity: "进阶", x: 28, y: 73 },
    { id: "bridge-rag", name: "RAG小桥", icon: "═", kind: "bridge", desc: "连接知识库、引用核验和Skill运行结果。", cost: 52, rarity: "进阶", x: 52, y: 73 },
    { id: "fountain-community", name: "社区喷泉", icon: "◈", kind: "fountain", desc: "用于展示拜访、点赞、排行榜和同伴学习激励。", cost: 58, rarity: "进阶", x: 53, y: 48 },
    { id: "robot-guide", name: "导学小机器人", icon: "▣", kind: "robot", desc: "代表小岛里的Agent助手，可引导用户选择下一步任务。", cost: 64, rarity: "进阶", x: 46, y: 35 },
    { id: "garden-singlecell", name: "组学苗圃", icon: "♣", kind: "garden", desc: "放在单细胞温室附近，提示虚拟扰动属于单细胞扰动分析。", cost: 42, rarity: "基础", x: 83, y: 42 },
    { id: "crate-open", name: "开源工具箱", icon: "▤", kind: "crate", desc: "代表可复用的开源仓库、示例数据和运行说明。", cost: 38, rarity: "基础", x: 21, y: 49 },
    { id: "stone-version", name: "版本石碑", icon: "◆", kind: "stone", desc: "记录Skill版本、输入输出边界和不可伪造成果声明。", cost: 44, rarity: "基础", x: 68, y: 72 },
    { id: "tree-study", name: "学习树", icon: "♠", kind: "tree", desc: "用于方法学习路线，从入门、示例、运行到复核逐步成长。", cost: 36, rarity: "基础", x: 34, y: 36 },
    { id: "scope-pathology", name: "显微镜小牌", icon: "⌕", kind: "scope", desc: "标记病理教学训练入口，不替代临床诊断。", cost: 40, rarity: "基础", x: 55, y: 31 },
    { id: "harbor-hpc", name: "HPC警示桩", icon: "⚑", kind: "harbor", desc: "提醒HPC任务默认dry-run，真实提交必须人工确认。", cost: 48, rarity: "进阶", x: 75, y: 77 },
    { id: "poster-meta", name: "Meta流程海报", icon: "▥", kind: "poster", desc: "把Meta分析从问题、检索、筛选、提取、偏倚到森林图串起来。", cost: 50, rarity: "进阶", x: 24, y: 31 },
    { id: "gate-profile", name: "个人主页门牌", icon: "⌂", kind: "gate", desc: "提示这里会连接我的Skill、案例、收藏、徽章和小岛展示。", cost: 54, rarity: "进阶", x: 18, y: 70 },
  ];

  const spriteMap = {
    library: "static/assets/round84/buildings/library.png",
    pathology: "static/assets/round84/buildings/pathology.png",
    classroom: "static/assets/round84/buildings/classroom.png",
    singlecell: "static/assets/round84/buildings/singlecell.png",
    plot: "static/assets/round84/buildings/plot.png",
    community: "static/assets/round84/buildings/community.png",
    skill: "static/assets/round84/buildings/skill.png",
    ethics: "static/assets/round84/buildings/ethics.png",
    hpc: "static/assets/round84/buildings/hpc.png",
    archive: "static/assets/round84/buildings/library-wood.png",
  };

  const spriteFor = (target, skinKey) => skinKey
    ? `static/assets/round84/buildings/${target}-${skinKey}.png`
    : (spriteMap[target] || spriteMap.library);

  const placementSlots = [
    { x: 22, y: 62 }, { x: 44, y: 70 }, { x: 63, y: 67 }, { x: 83, y: 70 },
    { x: 22, y: 39 }, { x: 82, y: 41 }, { x: 52, y: 28 }, { x: 39, y: 83 },
    { x: 58, y: 82 }, { x: 74, y: 30 }, { x: 28, y: 78 }, { x: 68, y: 77 },
  ];

  const state = {
    selected: hotspots[0],
    points: Number(localStorage.getItem("medpath_r77_points") || 12845),
    gems: Number(localStorage.getItem("medpath_r77_gems") || 1560),
    purple: Number(localStorage.getItem("medpath_r77_purple") || 280),
    owned: JSON.parse(localStorage.getItem("medpath_r77_owned_buildings") || "[]"),
    placed: JSON.parse(localStorage.getItem("medpath_r83_placed_buildings") || "[]"),
    editing: localStorage.getItem("medpath_r83_editing") === "1",
    likes: Number(localStorage.getItem("medpath_r83_likes") || 873),
    visits: Number(localStorage.getItem("medpath_r83_visits") || 44),
    focusPlacedId: localStorage.getItem("medpath_r85_focus_placed") || "",
    taskLog: JSON.parse(localStorage.getItem("medpath_r86_task_log") || "[]"),
    agentFocusId: localStorage.getItem("medpath_r86_agent_focus") || "",
    catalogFilter: localStorage.getItem("medpath_r87_catalog_filter") || "all",
    decorations: JSON.parse(localStorage.getItem("medpath_r89_decorations") || "[]"),
    focusDecorId: localStorage.getItem("medpath_r89_focus_decor") || "",
    lastCatalog: null,
    drawer: false,
    drawerMinimized: false,
    leftPanelOpen: localStorage.getItem("medpath_r90_left_open") ? localStorage.getItem("medpath_r90_left_open") !== "0" : !(window.matchMedia?.("(max-width: 720px)")?.matches),
    rightDockOpen: localStorage.getItem("medpath_r90_right_open") ? localStorage.getItem("medpath_r90_right_open") !== "0" : !(window.matchMedia?.("(max-width: 720px)")?.matches),
    bottomDockCollapsed: localStorage.getItem("medpath_r90_bottom_collapsed") === "1",
    builderPlaced: JSON.parse(localStorage.getItem("medpath_r104_builder_placed") || "[]"),
    builderSelected: localStorage.getItem("medpath_r104_builder_selected") || "library",
    builderFocusId: localStorage.getItem("medpath_r104_builder_focus") || "",
    builderLevel: Number(localStorage.getItem("medpath_r104_builder_level") || 1),
    dialogOpen: false,
    botOpen: localStorage.getItem("medpath_r106_bot_open") === "1",
    botMessages: JSON.parse(localStorage.getItem("medpath_r106_bot_messages") || "[]"),
    toast: "这是原创像素科研岛底图，按你给的风格重做；点击建筑或在底部输入任务即可交互。",
  };

  if (!state.botMessages.length) {
    state.botMessages = [
      { role: "bot", text: "你好，我是小岛里的科研小机器人。你可以说“打开绘图工坊”“我要做Meta分析”“去自主建造页”或“配置模型API”。" },
    ];
  }

  if (!state.placed.length) {
    state.placed = [
      { id: "starter-library", name: "文献图书馆", target: "library", tag: "综述", skinKey: "morning", x: 33, y: 29 },
      { id: "starter-skill", name: "Skill工坊", target: "skill", tag: "创作", skinKey: "academy", x: 73, y: 62 },
      { id: "starter-plot", name: "绘图工坊", target: "plot", tag: "绘图", skinKey: "wood", x: 31, y: 55 },
    ];
  }

  const esc = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

  function buildingLevel(item) {
    return Math.max(1, Math.min(12, Number(item?.level || 1)));
  }

  function buildingNextXp(item) {
    return 80 + buildingLevel(item) * 45;
  }

  function buildingXp(item) {
    return Math.max(0, Number(item?.xp || 0));
  }

  function buildingProgress(item) {
    const next = buildingNextXp(item);
    const xp = Math.min(next, buildingXp(item));
    return { xp, next, pct: Math.max(6, Math.min(100, Math.round((xp / next) * 100))) };
  }

  function awardBuildingProgress(targetId, reward = 8) {
    const candidates = state.placed.filter((item) => item.target === targetId);
    const item = state.placed.find((entry) => entry.id === state.focusPlacedId) || candidates[0];
    if (!item) return;
    item.xp = buildingXp(item) + Math.max(6, Number(reward || 0));
    if (item.xp >= buildingNextXp(item)) {
      item.xp = item.xp - buildingNextXp(item);
      item.level = Math.min(12, buildingLevel(item) + 1);
      state.purple += 2;
      state.toast = `“${item.name}”升级到 Lv.${item.level}。这是本地演示成长值，正式版会进入账号档案。`;
    }
  }

  function buildingVisitText(item) {
    const likes = Number(item?.likes || 0);
    const visits = Number(item?.visits || 0);
    if (!likes && !visits) return "还没有公开展示；可先发布为小岛入口。";
    return `${visits} 次拜访 · ${likes} 个喜欢`;
  }

  function normalizePlacedBuildings() {
    state.placed = state.placed.map((item, index) => {
      const target = hotspots.find((entry) => entry.id === item.target) || hotspots[0];
      const fallbackSprite = spriteFor(item.target, item.skinKey);
      return {
        ...item,
        sprite: item.sprite || fallbackSprite,
        level: buildingLevel(item),
        xp: buildingXp(item),
        visits: Number(item.visits || (index === 0 ? 18 : 0)),
        likes: Number(item.likes || (index === 0 ? 11 : 0)),
        rarity: item.rarity || (index > 1 ? "进阶" : "基础"),
        bindNote: item.bindNote || `绑定到${target.name}：${target.sub}。正式账号版会允许用户把自己的Skill、案例或常用方法挂到这里。`,
        desc: item.desc || target.desc,
        style: item.style || "个人科研空间建筑",
        unlock: item.unlock || "新手可用",
      };
    });
  }

  normalizePlacedBuildings();

  if (!state.decorations.length) {
    state.decorations = ["lamp-data", "flower-ethics", "sign-method", "pond-focus"].map((id, index) => {
      const item = decorCatalog.find((entry) => entry.id === id) || decorCatalog[index];
      return {
        id: `starter-decor-${item.id}`,
        sourceId: item.id,
        name: item.name,
        icon: item.icon,
        kind: item.kind,
        desc: item.desc,
        rarity: item.rarity,
        x: item.x,
        y: item.y,
      };
    });
  }

  function normalizeDecorations() {
    state.decorations = state.decorations.map((item, index) => {
      const source = decorCatalog.find((entry) => entry.id === item.sourceId || entry.id === item.id) || decorCatalog[index % decorCatalog.length];
      return {
        ...item,
        sourceId: item.sourceId || source.id,
        name: item.name || source.name,
        icon: item.icon || source.icon,
        kind: item.kind || source.kind,
        desc: item.desc || source.desc,
        rarity: item.rarity || source.rarity,
        x: Number(item.x ?? source.x),
        y: Number(item.y ?? source.y),
      };
    });
  }

  normalizeDecorations();

  const builderCatalog = [
    { id: "library", name: "文献图书馆", sub: "综述与证据", route: "research", cost: 0, w: 2, h: 2, color: "#3f90bd", sprite: spriteFor("library") },
    { id: "plot", name: "绘图工坊", sub: "图表与代码", route: "plot-studio", cost: 80, w: 2, h: 2, color: "#d19a44", sprite: spriteFor("plot") },
    { id: "pathology", name: "病理实验室", sub: "报告训练", route: "cases", cost: 120, w: 2, h: 2, color: "#7dbf82", sprite: spriteFor("pathology") },
    { id: "singlecell", name: "单细胞温室", sub: "组学方法", route: "research", cost: 160, w: 2, h: 2, color: "#74c7cf", sprite: spriteFor("singlecell") },
    { id: "classroom", name: "教学楼", sub: "课程与PBL", route: "learn", cost: 140, w: 2, h: 2, color: "#df8d53", sprite: spriteFor("classroom") },
    { id: "skill", name: "Skill工坊", sub: "自建能力", route: "skills", cost: 180, w: 2, h: 2, color: "#9d7bd7", sprite: spriteFor("skill") },
    { id: "ethics", name: "伦理花园", sub: "风险审查", route: "governance", cost: 120, w: 2, h: 2, color: "#89ad5f", sprite: spriteFor("ethics") },
    { id: "hpc", name: "服务器码头", sub: "模型与HPC", route: "method-runner", cost: 220, w: 3, h: 2, color: "#536d95", sprite: spriteFor("hpc") },
    { id: "community", name: "社区广场", sub: "拜访排行", route: "community", cost: 100, w: 2, h: 2, color: "#62a7bd", sprite: spriteFor("community") },
    { id: "archive", name: "档案馆", sub: "作品收藏", route: "profile", cost: 110, w: 2, h: 2, color: "#b48a5d", sprite: spriteFor("archive") },
  ];

  const builderSeed = [
    { id: "builder-library", type: "library", name: "文献图书馆", gx: 2, gy: 2 },
    { id: "builder-plot", type: "plot", name: "绘图工坊", gx: 6, gy: 4 },
    { id: "builder-skill", type: "skill", name: "Skill工坊", gx: 10, gy: 2 },
  ];

  if (!state.builderPlaced.length) state.builderPlaced = builderSeed.map((item) => ({ ...item }));

  function isBuilderMode() {
    return /island-builder|builder/.test(location.hash || "");
  }

  const botQuickPrompts = [
    "打开绘图工坊",
    "去自主建造页",
    "我要做Meta分析",
    "配置模型API",
  ];

  const botRoutes = [
    { route: "island-builder", label: "自主建造页", pattern: /建造|摆建筑|放建筑|建筑库|小岛编辑|装修/ },
    { route: "plot-studio", label: "绘图工坊", pattern: /绘图|图表|热图|火山|森林图|umap|plot|ggplot|可视化/ },
    { route: "article-workshop", label: "文章工作坊", pattern: /文章|论文|meta|综述|系统评价|病例报告|投稿|写作/ },
    { route: "model-gateway", label: "模型API规范化", pattern: /api|模型|provider|key|密钥|配置|base_url|大模型/ },
    { route: "method-runner", label: "方法运行器", pattern: /方法|流程|hpc|slurm|服务器|dry-run|计算/ },
    { route: "open-source", label: "开源工具导航", pattern: /开源|github|仓库|工具|软件/ },
    { route: "research", label: "科研工作台", pattern: /科研|单细胞|扰动|虚拟敲除|空间组学|生信|机器学习/ },
    { route: "learn", label: "学习与教学", pattern: /学习|教学|课程|课堂|pbl|新手/ },
    { route: "cases", label: "案例与模板", pattern: /案例|病理|报告|病例|模板/ },
    { route: "skills", label: "Skills市场", pattern: /skill|agent|智能体|插件|提示词/ },
    { route: "community", label: "社区", pattern: /社区|排行|好友|拜访|点赞|交友/ },
    { route: "profile", label: "个人主页", pattern: /个人|主页|我的|积分|成就|收藏/ },
    { route: "settings", label: "设置", pattern: /设置|安全|权限|环境变量/ },
  ];

  function isModelApiConfigured() {
    const keys = [
      "MEDPATH_MODEL_API_CONFIGURED",
      "medpath_model_api_configured",
      "medpath_api_configured",
      "medpath_provider_configured",
    ];
    return !!window.MEDPATH_MODEL_API_CONFIGURED || keys.some((key) => /^(1|true|yes|configured)$/i.test(localStorage.getItem(key) || ""));
  }

  function botRouteFor(text) {
    const raw = String(text || "").trim();
    const hit = botRoutes.find((item) => item.pattern.test(raw.toLowerCase()));
    if (hit) return hit;
    const id = routeTask(raw);
    const target = hotspots.find((item) => item.id === id) || hotspots[0];
    return { route: target.route, label: target.name, targetId: id };
  }

  function pushBot(role, text) {
    state.botMessages.push({ role, text: String(text || "") });
    state.botMessages = state.botMessages.slice(-8);
  }

  function botApiHint() {
    return isModelApiConfigured()
      ? "我检测到本机已经标记模型API已配置；正式后端会把你的问题交给自有provider，并按Skill规范返回。当前GitHub Pages预览先完成页面导航。"
      : "我还没有检测到你的模型API配置，所以先用本地规则帮你打开页面。要让我用你的大模型回答，请到“模型API规范化”页配置provider、base_url、model和API Key。";
  }

  function runBotAssistant(text, options = {}) {
    const userText = String(text || "").trim();
    if (!userText) return;
    pushBot("user", userText);
    const route = botRouteFor(userText);
    const wantsApi = /api|模型|provider|key|密钥|配置|base_url|大模型/i.test(userText);
    const shouldOpen = /打开|去|进入|跳转|带我|我要|想做|配置|建造|绘图|案例|社区|主页|方法|文章|skill/i.test(userText);
    const prefix = wantsApi
      ? "可以，我先带你到模型API规范化页面。"
      : `可以，我先带你到“${route.label}”。`;
    pushBot("bot", `${prefix}${botApiHint()}`);
    state.botOpen = true;
    state.toast = `小机器人：${prefix}`;
    persist();
    sync();
    if (shouldOpen || options.forceOpen) {
      window.setTimeout(() => {
        location.hash = `#/${wantsApi ? "model-gateway" : route.route}`;
      }, 1200);
    }
  }

  function builderType(type) {
    return builderCatalog.find((item) => item.id === type) || builderCatalog[0];
  }

  function builderCells() {
    return Array.from({ length: 96 }, (_, index) => {
      const gx = (index % 12) + 1;
      const gy = Math.floor(index / 12) + 1;
      const locked = gy > 6 && state.builderLevel < 2;
      return `<button type="button" class="r77-builder-cell${locked ? " is-locked" : ""}" data-r77-builder-cell="${gx},${gy}" style="grid-column:${gx};grid-row:${gy}" aria-label="放置到 ${gx},${gy}">${locked ? "锁" : ""}</button>`;
    }).join("");
  }

  function builderShell() {
    return `
      <section class="r77-builder-scene" data-r77-builder>
        <div class="r77-builder-toolbar">
          <a href="#/island">返回入口岛</a>
          <span>建造模式：选择建筑，再点空地放置。完成科研任务会解锁更多地块。</span>
          <button type="button" data-r77-action="builder-clear">重置布局</button>
        </div>
        <div class="r77-builder-map" data-r77-builder-map>
          ${builderCells()}
          <div class="r77-builder-placed" data-r77-builder-placed></div>
          <div class="r77-builder-guide"><b>Lv.${state.builderLevel}</b><span>当前开放 12×6；继续完成任务解锁南侧地块</span></div>
        </div>
        <aside class="r77-builder-palette" data-r77-builder-palette></aside>
        <section class="r77-builder-inspector" data-r77-builder-inspector></section>
      </section>
    `;
  }

  function entryMiniActions() {
    return `
      <div class="r77-entry-actions" aria-label="科研小岛快捷入口">
        <button type="button" data-r77-bot-open title="小机器人">🤖</button>
        <a href="#/profile" title="我的主页">我</a>
        <a href="#/island-builder" title="进入建造模式">建造</a>
      </div>
    `;
  }

  function resource(label, value, icon, color) {
    return `<div class="r77-resource-pill"><span class="r77-resource-icon" style="--c:${color}">${icon}</span><span><strong data-r77-value="${label}">${value}</strong><small>${label}</small></span><span class="r77-plus">+</span></div>`;
  }

  function shell() {
    return `
      <div class="r77-town is-concept-mode ${isBuilderMode() ? "is-builder-mode" : "is-entry-mode"}" data-r77-root data-r77-mode="${isBuilderMode() ? "builder" : "entry"}">
        <div class="r77-concept-stage">
          <img src="static/assets/round77/research_island_image2.png" alt="MedPath Research Island 像素科研小岛原创底图" />
        </div>
        ${isBuilderMode() ? builderShell() : entryMiniActions()}
        <div class="r77-topbar">
          <div class="r77-card r77-profile">
            <div class="r77-avatar"><span>Lv.24</span></div>
            <div><div class="r77-title-line">MedPath Research Island <span class="r77-online-dot"></span></div><div class="r77-exp"><i style="--w:53%"></i><b>1280 / 2400</b></div></div>
          </div>
          ${resource("能量", "120/120", "⚡", "#ffca50")}
          ${resource("金币", state.points.toLocaleString(), "★", "#ffcf55")}
          ${resource("钻石", state.gems.toLocaleString(), "◆", "#52dfff")}
          ${resource("徽章", state.purple.toLocaleString(), "✦", "#c98cff")}
          <div class="r77-top-actions"><button class="r77-icon-btn" data-r77-action="tasks">今日任务<span class="r77-badge">3</span></button><button class="r77-icon-btn">信</button><button class="r77-icon-btn">铃</button><button class="r77-icon-btn">⚙</button></div>
        </div>
        <div class="r77-weather"><div class="r77-sun"><i></i><span>24°C<br><small>晴朗</small></span></div><div class="r77-time"><strong>10:30</strong>06/11 周三</div></div>
        <button class="r77-panel-peek r77-panel-peek-left" type="button" data-r77-action="toggle-left" onclick="window.medpathR77Action && window.medpathR77Action('toggle-left')"><span>榜</span><b>贡献榜</b></button>
        <aside class="r77-left-panel" data-r77-left-panel>
          <div class="r77-left-head"><b>科研贡献榜</b><button class="r77-panel-toggle" type="button" data-r77-action="toggle-left" onclick="window.medpathR77Action && window.medpathR77Action('toggle-left')" aria-label="收起贡献榜">收起</button></div>
          <div class="r77-tabs"><button class="active">本周</button><button>本月</button><button>全部</button></div>
          <section class="r77-daily-panel" data-r77-daily></section>
          <div class="r77-board-list">${leaders.map((item, idx) => `<div class="r77-rank-row"><span class="r77-rank">${idx + 1}</span><span class="r77-face" style="--hair:${item[3]};--cloth:${item[4]}"></span><span><strong>${esc(item[0])}</strong><small>${esc(item[1])}</small></span><em>★ ${item[2].toLocaleString()}</em></div>`).join("")}</div>
          <div class="r77-social-actions" data-r77-social>
            <button type="button" data-r77-action="like">点赞小岛 <b data-r77-likes>${state.likes.toLocaleString()}</b></button>
            <button type="button" data-r77-action="visit">拜访同学 <b data-r77-visits>${state.visits.toLocaleString()}</b></button>
            <button type="button" data-r77-action="decor">编辑小岛</button>
          </div>
          <div class="r77-chat"><div class="r77-chat-tabs"><button class="active">世界</button><button>好友</button></div><div class="r77-chat-list">${feed.map(([name, text, time], idx) => `<div class="r77-chat-line"><span class="r77-face" style="--hair:${leaders[idx][3]};--cloth:${leaders[idx][4]}"></span><span><strong>${esc(name)}</strong>${esc(text)}</span><time>${time}</time></div>`).join("")}</div><div class="r77-chat-input"><input placeholder="说点什么..." /><button>➤</button></div></div>
        </aside>
        <button class="r77-panel-peek r77-panel-peek-right" type="button" data-r77-action="toggle-right" onclick="window.medpathR77Action && window.medpathR77Action('toggle-right')"><span>☰</span><b>快捷</b></button>
        <nav class="r77-rail" data-r77-rail><button class="r77-rail-collapse" data-r77-action="toggle-right" onclick="window.medpathR77Action && window.medpathR77Action('toggle-right')" type="button"><span>×</span><small>收起</small></button><button data-r77-action="tasks" onclick="window.medpathR77Action && window.medpathR77Action('tasks')"><span>★</span><small>任务</small></button><button data-r77-action="catalog" onclick="window.medpathR77Action && window.medpathR77Action('catalog')"><span>▣</span><small>背包</small></button><button data-r77-action="skill" onclick="window.medpathR77Action && window.medpathR77Action('skill')"><span>⚡</span><small>技能</small></button><button data-r77-action="cases" onclick="window.medpathR77Action && window.medpathR77Action('cases')"><span>▤</span><small>案例</small></button><button data-r77-action="tools" onclick="window.medpathR77Action && window.medpathR77Action('tools')"><span>⌘</span><small>工具</small></button><button data-r77-action="decor" onclick="window.medpathR77Action && window.medpathR77Action('decor')"><span>♣</span><small>装饰</small></button><button data-r77-action="rank" onclick="window.medpathR77Action && window.medpathR77Action('rank')"><span>☺</span><small>好友</small></button><button data-r77-action="achieve" onclick="window.medpathR77Action && window.medpathR77Action('achieve')"><span>🏆</span><small>成就</small></button></nav>
        <button class="r77-mobile-decor-fab" data-r77-action="decor" type="button" onclick="window.medpathR77OpenDecorShop && window.medpathR77OpenDecorShop()"><span>♣</span><b>装饰商店</b></button>
        ${hotspots.map((b) => `<button class="r77-hotspot" data-r77-hotspot="${b.id}" onclick="window.medpathR77Select && window.medpathR77Select('${b.id}')" style="left:${b.x}%;top:${b.y}%;--w:${b.w}px;--h:${b.h}px" aria-label="${esc(b.name)}"></button><button class="r77-building-label" data-r77-label="${b.id}" onclick="window.medpathR77Select && window.medpathR77Select('${b.id}')" style="left:${b.labelX}%;top:${b.labelY}%"><b>${esc(b.name)}</b><small>${esc(b.sub)}</small></button>`).join("")}
        <div class="r77-decor-layer" data-r77-decor></div>
        <div class="r77-placed-layer" data-r77-placed></div>
        <div class="r77-agent-layer" data-r77-agents></div>
        <div class="r77-bubble" style="left:43%;top:38%">需要我帮你总结文献吗？</div>
        <div class="r77-bubble" style="left:61%;top:49%">今天想做点什么研究呢？</div>
        <div class="r77-player-pin" data-r77-player></div>
        <button class="r77-bot-guide" type="button" data-r77-bot-open aria-label="打开科研小机器人"><span></span><b>问我</b></button>
        <section class="r77-bot-panel" data-r77-bot-panel></section>
        <div class="r77-editor-banner" data-r77-editor-banner></div>
        <section class="r77-building-inspector" data-r77-building-inspector></section>
        <div class="r77-concept-toast" data-r77-toast style="pointer-events:none">${esc(state.toast)}</div>
        <section class="r77-concept-dialog" data-r77-dialog></section>
        <form class="r77-concept-command" data-r77-command onsubmit="return window.medpathR77Submit && window.medpathR77Submit(this)"><input name="task" placeholder="输入科研任务：胃癌PBL案例 / 单细胞虚拟敲除 / 画热图 / HPC dry-run" autocomplete="off" /><button type="submit">发送</button></form>
        <div class="r77-owned-strip" data-r77-owned></div>
        <button class="r77-dock-peek" type="button" data-r77-action="toggle-bottom" onclick="window.medpathR77Action && window.medpathR77Action('toggle-bottom')"><span>🔨</span><b>建造</b></button>
        <div class="r77-dock" data-r77-dock><button class="r77-dock-collapse" data-r77-action="toggle-bottom" onclick="window.medpathR77Action && window.medpathR77Action('toggle-bottom')" type="button"><span>⌄</span><small>收起</small></button><button data-r77-action="explore" onclick="window.medpathR77Action && window.medpathR77Action('explore')"><span>◉</span><small>探索</small></button><button data-r77-action="build" onclick="window.medpathR77Action && window.medpathR77Action('build')"><span>🔨</span><small>建造</small></button><button data-r77-action="decor" onclick="window.medpathR77Action && window.medpathR77Action('decor')"><span>♣</span><small>装饰</small></button><button data-r77-action="shop" onclick="window.medpathR77Action && window.medpathR77Action('shop')"><span>▥</span><small>商店</small></button><button data-r77-action="warehouse" onclick="window.medpathR77Action && window.medpathR77Action('warehouse')"><span>▤</span><small>仓库</small></button><button data-r77-action="map" onclick="window.medpathR77Action && window.medpathR77Action('map')"><span>▧</span><small>地图</small></button></div>
        <div class="r77-minimap"></div>
        <section class="r77-concept-drawer" data-r77-drawer>
          <header>
            <div>
              <b>建筑商店 · 个性化科研小岛资产库</b>
              <small data-r77-catalog-summary>点击建筑即可预览并绑定到对应科研功能。正式版会支持拖拽摆放、拜访展示和积分购买。</small>
            </div>
            <div class="r77-drawer-actions">
              <button data-r77-drawer-minimize type="button" onclick="window.medpathR77MinimizeDrawer && window.medpathR77MinimizeDrawer()" aria-label="收起建筑商店">－</button>
              <button data-r77-close type="button" onclick="window.medpathR77CloseDrawer && window.medpathR77CloseDrawer()" aria-label="关闭建筑商店">×</button>
            </div>
          </header>
          <div class="r77-drawer-body">
          <div class="r77-catalog-filters" data-r77-catalog-filters></div>
          <div class="r77-catalog-system-note">
            <b>建筑不是装饰</b>
            <span>每个建筑都代表一个可进入的 Skill、方法、案例、绘图或治理入口；用户以后可以把自己的 Skill 做成建筑放到岛上。</span>
          </div>
          <div class="r77-concept-grid" data-r77-catalog-grid></div>
          <div class="r77-decor-shop">
            <div class="r77-decor-shop-head">
              <b>装饰与功能标记</b>
              <span>给自己的科研岛加路牌、花坛、复核点和学习标记。装饰不会伪造任何真实数据，只是本地个性化入口。</span>
            </div>
            <div class="r77-decor-grid" data-r77-decor-grid></div>
          </div>
          </div>
        </section>
        <section class="r77-mobile-decor-panel" data-r77-mobile-decor-panel>
          <header><b>装饰商店</b><button type="button" data-r77-mobile-decor-close>×</button></header>
          <p>选择路牌、花坛、复核点和学习标记。它们只是本地个性化摆件，不代表真实数据或真实平台记录。</p>
          <div class="r77-mobile-decor-grid" data-r77-mobile-decor-grid></div>
        </section>
      </div>
    `;
  }

  function persist() {
    localStorage.setItem("medpath_r77_points", String(state.points));
    localStorage.setItem("medpath_r77_gems", String(state.gems));
    localStorage.setItem("medpath_r77_purple", String(state.purple));
    localStorage.setItem("medpath_r77_owned_buildings", JSON.stringify(state.owned.slice(-12)));
    localStorage.setItem("medpath_r83_placed_buildings", JSON.stringify(state.placed.slice(-48)));
    localStorage.setItem("medpath_r83_editing", state.editing ? "1" : "0");
    localStorage.setItem("medpath_r83_likes", String(state.likes));
    localStorage.setItem("medpath_r83_visits", String(state.visits));
    localStorage.setItem("medpath_r86_task_log", JSON.stringify(state.taskLog.slice(-8)));
    localStorage.setItem("medpath_r86_agent_focus", state.agentFocusId || "");
    localStorage.setItem("medpath_r87_catalog_filter", state.catalogFilter || "all");
    localStorage.setItem("medpath_r89_decorations", JSON.stringify(state.decorations.slice(-80)));
    localStorage.setItem("medpath_r90_left_open", state.leftPanelOpen ? "1" : "0");
    localStorage.setItem("medpath_r90_right_open", state.rightDockOpen ? "1" : "0");
    localStorage.setItem("medpath_r90_bottom_collapsed", state.bottomDockCollapsed ? "1" : "0");
    localStorage.setItem("medpath_r104_builder_placed", JSON.stringify(state.builderPlaced.slice(-60)));
    localStorage.setItem("medpath_r104_builder_selected", state.builderSelected || "library");
    localStorage.setItem("medpath_r104_builder_level", String(state.builderLevel || 1));
    localStorage.setItem("medpath_r106_bot_open", state.botOpen ? "1" : "0");
    localStorage.setItem("medpath_r106_bot_messages", JSON.stringify(state.botMessages.slice(-8)));
    if (state.builderFocusId) localStorage.setItem("medpath_r104_builder_focus", state.builderFocusId);
    else localStorage.removeItem("medpath_r104_builder_focus");
    if (state.focusDecorId) localStorage.setItem("medpath_r89_focus_decor", state.focusDecorId);
    else localStorage.removeItem("medpath_r89_focus_decor");
    if (state.focusPlacedId) localStorage.setItem("medpath_r85_focus_placed", state.focusPlacedId);
    else localStorage.removeItem("medpath_r85_focus_placed");
  }

  function root() { return document.querySelector("[data-r77-root]"); }

  function logTask(text, reward = 0, target = state.selected?.id || "library") {
    const targetName = hotspots.find((b) => b.id === target)?.name || "科研小岛";
    state.taskLog.push({
      text,
      reward,
      target,
      targetName,
      at: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    });
    state.taskLog = state.taskLog.slice(-8);
    awardBuildingProgress(target, reward);
  }

  function movePlayerTo(b) {
    const player = root()?.querySelector("[data-r77-player]");
    if (!player || !b) return;
    player.style.left = `${b.x}%`;
    player.style.top = `${Math.min(91, b.y + 8)}%`;
  }

  function renderOwned() {
    const node = root()?.querySelector("[data-r77-owned]");
    if (!node) return;
    const items = state.owned.slice(-5).reverse();
    node.innerHTML = items.length
      ? `<span>我的常用建筑</span>${items.map((item) => `<button type="button" data-r77-owned-jump="${esc(item.target)}"><b>${esc(item.name)}</b><small>${esc(item.tag)}</small></button>`).join("")}`
      : `<span>我的常用建筑</span><button type="button" data-r77-action="build"><b>打开建筑库</b><small>选择喜欢的建筑皮肤</small></button>`;
    node.querySelectorAll("[data-r77-owned-jump]").forEach((button) => {
      button.addEventListener("click", () => select(button.dataset.r77OwnedJump));
    });
    node.querySelector("[data-r77-action='build']")?.addEventListener("click", () => {
      state.drawer = true;
      state.toast = "打开建筑库：选择你喜欢的建筑风格，再把它绑定到常用科研功能。";
      sync();
    });
  }

  function filteredCatalog() {
    if (!state.catalogFilter || state.catalogFilter === "all") return catalog;
    return catalog.filter((item) => item.group === state.catalogFilter);
  }

  function renderCatalogDrawer() {
    const r = root();
    if (!r) return;
    const filterNode = r.querySelector("[data-r77-catalog-filters]");
    const gridNode = r.querySelector("[data-r77-catalog-grid]");
    const summaryNode = r.querySelector("[data-r77-catalog-summary]");
    const items = filteredCatalog();
    if (summaryNode) {
      const active = catalogGroups.find((g) => g.id === state.catalogFilter) || catalogGroups[0];
      summaryNode.textContent = `${active.label}：${items.length} 个可选建筑/皮肤。${active.hint}；当前均为本地原型资产，可绑定到科研功能入口。`;
    }
    if (filterNode) {
      filterNode.innerHTML = catalogGroups.map((group) => {
        const count = group.id === "all" ? catalog.length : catalog.filter((item) => item.group === group.id).length;
        return `<button type="button" class="${state.catalogFilter === group.id ? "is-active" : ""}" data-r77-catalog-filter="${esc(group.id)}"><b>${esc(group.label)}</b><small>${count}</small></button>`;
      }).join("");
      filterNode.querySelectorAll("[data-r77-catalog-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          state.catalogFilter = button.dataset.r77CatalogFilter || "all";
          state.toast = `建筑商店已切换到“${catalogGroups.find((g) => g.id === state.catalogFilter)?.label || "全部建筑"}”。`;
          persist();
          renderCatalogDrawer();
          renderDialog();
        });
      });
    }
    if (gridNode) {
      gridNode.innerHTML = items.map((item) => `
        <button type="button" data-r77-catalog="${esc(item.id)}" class="r77-catalog-card r77-catalog-${esc(item.group)}">
          <img class="r77-catalog-sprite" src="${esc(spriteFor(item.target, item.skinKey))}" alt="" loading="lazy" />
          <span class="r77-building-chip">${esc(item.rarity)}</span>
          <b>${esc(item.name)}</b>
          <small>${esc(item.desc)}</small>
          <em>${esc(item.style)} · ${esc(item.tag)}</em>
          <small>${esc(item.bindHint)} · ${item.cost} 积分</small>
          <i>${esc(item.unlock)}</i>
        </button>
      `).join("");
      gridNode.querySelectorAll("[data-r77-catalog]").forEach((button) => {
        button.addEventListener("click", () => chooseCatalog(button.dataset.r77Catalog));
      });
    }
  }

  function renderDecorations() {
    const node = root()?.querySelector("[data-r77-decor]");
    if (!node) return;
    node.innerHTML = state.decorations.map((item) => `
      <button type="button" class="r77-decor-item r77-decor-${esc(item.kind)}${item.id === state.focusDecorId ? " is-selected" : ""}" data-r77-decor-id="${esc(item.id)}" style="left:${Number(item.x).toFixed(2)}%;top:${Number(item.y).toFixed(2)}%">
        <span>${esc(item.icon)}</span>
        <small>${esc(item.name)}</small>
      </button>
    `).join("");
    node.querySelectorAll("[data-r77-decor-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = state.decorations.find((entry) => entry.id === button.dataset.r77DecorId);
        if (!item) return;
        state.focusDecorId = item.id;
        state.toast = `已选中装饰“${item.name}”：${item.desc}`;
        if (state.editing) {
          state.toast += "。编辑模式下可继续移动建筑，装饰拖拽将在后续版本开放。";
        }
        persist();
        sync();
      });
    });
  }

  function addDecorationFromCatalog(id) {
    const item = decorCatalog.find((entry) => entry.id === id);
    if (!item) return;
    if (state.points < item.cost) {
      state.toast = `积分不足：放置“${item.name}”需要 ${item.cost} 积分。`;
      sync();
      return;
    }
    const count = state.decorations.filter((entry) => entry.sourceId === item.id).length;
    const offset = (state.decorations.length % 7) * 1.8;
    state.points -= item.cost;
    const placed = {
      id: `${item.id}-${Date.now()}`,
      sourceId: item.id,
      name: item.name,
      icon: item.icon,
      kind: item.kind,
      desc: item.desc,
      rarity: item.rarity,
      x: Math.max(12, Math.min(86, item.x + offset)),
      y: Math.max(18, Math.min(86, item.y + (count % 3) * 2.2)),
    };
    state.decorations.push(placed);
    state.focusDecorId = placed.id;
    logTask(`布置小岛装饰：${item.name}`, 6, "community");
    state.toast = `已放置“${item.name}”：它会作为本地个性化装饰显示在小岛上。`;
    persist();
    sync();
  }

  function renderDecorShop() {
    const node = root()?.querySelector("[data-r77-decor-grid]");
    if (!node) return;
    node.innerHTML = decorCatalog.map((item) => `
      <button type="button" class="r77-decor-card r77-decor-card-${esc(item.kind)}" data-r77-decor-catalog="${esc(item.id)}">
        <span class="r77-decor-card-icon">${esc(item.icon)}</span>
        <b>${esc(item.name)}</b>
        <small>${esc(item.desc)}</small>
        <em>${esc(item.rarity)} · ${item.cost} 积分</em>
      </button>
    `).join("");
    node.querySelectorAll("[data-r77-decor-catalog]").forEach((button) => {
      button.addEventListener("click", () => addDecorationFromCatalog(button.dataset.r77DecorCatalog));
    });
  }

  function renderMobileDecorShop() {
    const node = root()?.querySelector("[data-r77-mobile-decor-grid]");
    if (!node) return;
    node.innerHTML = decorCatalog.map((item) => `
      <button type="button" class="r77-mobile-decor-card" data-r77-mobile-decor-catalog="${esc(item.id)}">
        <span>${esc(item.icon)}</span>
        <b>${esc(item.name)}</b>
        <small>${esc(item.desc)}</small>
        <em>${esc(item.rarity)} · ${item.cost} 积分</em>
      </button>
    `).join("");
    node.querySelectorAll("[data-r77-mobile-decor-catalog]").forEach((button) => {
      button.addEventListener("click", () => {
        addDecorationFromCatalog(button.dataset.r77MobileDecorCatalog);
        root()?.querySelector("[data-r77-mobile-decor-panel]")?.classList.add("is-open");
      });
    });
  }

  function renderSocial() {
    const r = root();
    if (!r) return;
    const likeNode = r.querySelector("[data-r77-likes]");
    const visitNode = r.querySelector("[data-r77-visits]");
    const banner = r.querySelector("[data-r77-editor-banner]");
    r.classList.toggle("is-editing", state.editing);
    if (likeNode) likeNode.textContent = state.likes.toLocaleString();
    if (visitNode) visitNode.textContent = state.visits.toLocaleString();
    if (banner) {
      banner.innerHTML = state.editing
        ? `<b>编辑模式</b><span>拖动你放置的建筑，给常用 Skill、方法、案例和绘图入口安排位置。</span><button type="button" data-r77-action="reset-layout">重置布局</button>`
        : `<b>游览模式</b><span>点击建筑进入功能；点“装饰”后可以拖动建筑，打造自己的科研岛。</span>`;
    }
  }

  function renderDailyPanel() {
    const node = root()?.querySelector("[data-r77-daily]");
    if (!node) return;
    const finished = Math.min(dailyQuests.length, state.taskLog.length);
    node.innerHTML = `
      <div class="r77-daily-head"><b>今日科研行动</b><span>${finished}/${dailyQuests.length}</span></div>
      <div class="r77-daily-progress"><i style="--w:${Math.round((finished / dailyQuests.length) * 100)}%"></i></div>
      <div class="r77-quest-buttons">
        ${dailyQuests.map((q) => `<button type="button" data-r77-daily-quest="${esc(q.id)}"><span>${esc(q.label)}</span><em>+${q.reward}</em></button>`).join("")}
      </div>
      <div class="r77-action-log">
        ${(state.taskLog.length ? state.taskLog.slice(-4).reverse() : [{ at: "现在", targetName: "新手任务", text: "先点一座建筑，系统会告诉你下一步能做什么。", reward: 0 }]).map((item) => `<p><time>${esc(item.at)}</time><b>${esc(item.targetName)}</b><span>${esc(item.text)}</span>${item.reward ? `<em>+${item.reward}</em>` : ""}</p>`).join("")}
      </div>
    `;
    node.querySelectorAll("[data-r77-daily-quest]").forEach((button) => {
      button.addEventListener("click", () => {
        const quest = dailyQuests.find((q) => q.id === button.dataset.r77DailyQuest);
        if (!quest) return;
        state.points += quest.reward;
        logTask(quest.label, quest.reward, quest.target);
        select(quest.target);
        state.toast = `今日行动已记录：“${quest.label}”，获得 ${quest.reward} 积分。`;
        persist();
        sync();
      });
    });
  }

  function renderAgents() {
    const node = root()?.querySelector("[data-r77-agents]");
    if (!node) return;
    const phase = Math.floor(Date.now() / 7000);
    node.innerHTML = agentRoster.map((agent, index) => {
      const targetId = agent.route[(phase + index) % agent.route.length];
      const target = hotspots.find((b) => b.id === targetId) || hotspots[0];
      const x = Math.max(10, Math.min(90, target.x + (index % 2 ? 5 : -5)));
      const y = Math.max(16, Math.min(88, target.y + 8 + (index % 3) * 2));
      return `<button type="button" class="r77-agent-pin${state.agentFocusId === agent.id ? " is-active" : ""}" data-r77-agent="${esc(agent.id)}" style="left:${x}%;top:${y}%;--agent:${agent.color}"><span></span><b>${esc(agent.name)}</b><small>${esc(agent.role)}</small></button>`;
    }).join("");
    node.querySelectorAll("[data-r77-agent]").forEach((button) => {
      button.addEventListener("click", () => {
        const agent = agentRoster.find((item) => item.id === button.dataset.r77Agent);
        if (!agent) return;
        state.agentFocusId = agent.id;
        const targetId = agent.route[Math.floor(Date.now() / 7000) % agent.route.length];
        const target = hotspots.find((b) => b.id === targetId) || hotspots[0];
        state.selected = target;
        state.toast = `${agent.name}：${agent.line}`;
        logTask(`和${agent.name}对话：${agent.line}`, 10, targetId);
        state.points += 10;
        persist();
        sync();
      });
    });
  }

  function renderBotPanel() {
    const node = root()?.querySelector("[data-r77-bot-panel]");
    if (!node) return;
    node.classList.toggle("is-open", !!state.botOpen);
    const configured = isModelApiConfigured();
    node.innerHTML = `
      <header>
        <span class="r77-bot-avatar"></span>
        <div><b>科研小机器人</b><small>${configured ? "已检测到API配置标记" : "未检测到模型API配置"}</small></div>
        <button type="button" data-r77-bot-close aria-label="收起小机器人">×</button>
      </header>
      <div class="r77-bot-status ${configured ? "is-configured" : ""}">
        ${configured ? "可接入自有模型回答；当前静态页先演示Skill式导航。" : "未配置API时，我先用本地规则带你打开页面。"}
      </div>
      <div class="r77-bot-messages">
        ${state.botMessages.map((msg) => `<p class="is-${esc(msg.role)}"><span>${esc(msg.text)}</span></p>`).join("")}
      </div>
      <div class="r77-bot-quick">
        ${botQuickPrompts.map((prompt) => `<button type="button" data-r77-bot-quick="${esc(prompt)}">${esc(prompt)}</button>`).join("")}
      </div>
      <form class="r77-bot-input" data-r77-bot-form>
        <input name="botText" placeholder="例如：打开绘图工坊 / 我要做Meta分析 / 配置模型API" autocomplete="off" />
        <button type="submit">发送</button>
      </form>
    `;
  }

  function buildingIcon(item) {
    return `
      <span class="r77-building-sprite">
        <img src="${esc(item.sprite || spriteFor(item.target, item.skinKey))}" alt="" loading="lazy" />
      </span>`;
  }

  function renderPlaced() {
    const node = root()?.querySelector("[data-r77-placed]");
    if (!node) return;
    node.innerHTML = state.placed.map((item) => `
      <button type="button" class="r77-placed-building r77-placed-${esc(item.target)}${item.id === state.focusPlacedId ? " is-selected" : ""}" data-r77-placed-id="${esc(item.id)}" data-r77-target="${esc(item.target)}" style="left:${Number(item.x).toFixed(2)}%;top:${Number(item.y).toFixed(2)}%">
        ${buildingIcon(item)}
        <span class="r77-building-level">Lv.${buildingLevel(item)}</span>
        <span class="r77-placed-name"><b>${esc(item.name)}</b><small>${esc(item.tag || "功能建筑")}</small></span>
      </button>
    `).join("");
  }

  function builderOverlaps(gx, gy, type, exceptId = "") {
    const w = Number(type.w || 2);
    const h = Number(type.h || 2);
    if (gx < 1 || gy < 1 || gx + w - 1 > 12 || gy + h - 1 > 8) return true;
    if (gy + h - 1 > 6 && state.builderLevel < 2) return true;
    return state.builderPlaced.some((item) => {
      if (item.id === exceptId) return false;
      const other = builderType(item.type);
      const ax1 = Number(item.gx);
      const ay1 = Number(item.gy);
      const ax2 = ax1 + Number(other.w || 2) - 1;
      const ay2 = ay1 + Number(other.h || 2) - 1;
      const bx1 = gx;
      const by1 = gy;
      const bx2 = gx + w - 1;
      const by2 = gy + h - 1;
      return ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1;
    });
  }

  function renderBuilder() {
    const r = root();
    if (!r || !isBuilderMode()) return;
    const palette = r.querySelector("[data-r77-builder-palette]");
    const placed = r.querySelector("[data-r77-builder-placed]");
    const inspector = r.querySelector("[data-r77-builder-inspector]");
    if (!palette || !placed || !inspector) return;

    palette.innerHTML = `
      <header><b>建筑库</b><span>先选建筑，再点地图空格放置</span></header>
      <div class="r77-builder-palette-grid">
        ${builderCatalog.map((item) => `<button type="button" class="${item.id === state.builderSelected ? "is-selected" : ""}" data-r77-builder-select="${esc(item.id)}" style="--accent:${item.color}">
          <span class="r77-builder-thumb"><img src="${esc(item.sprite)}" alt="" loading="lazy" /></span>
          <span class="r77-builder-card-copy">
            <b>${esc(item.name)}</b>
            <small>${esc(item.sub)}</small>
            <em>${Number(item.w || 2)}×${Number(item.h || 2)}格 · ${item.cost ? item.cost + "积分" : "已解锁"}</em>
          </span>
        </button>`).join("")}
      </div>
    `;

    placed.innerHTML = state.builderPlaced.map((item) => {
      const type = builderType(item.type);
      return `<button type="button" class="r77-builder-building${item.id === state.builderFocusId ? " is-focused" : ""}" data-r77-builder-id="${esc(item.id)}" style="--accent:${type.color};grid-column:${Number(item.gx)} / span ${Number(type.w || 2)};grid-row:${Number(item.gy)} / span ${Number(type.h || 2)}">
        <img src="${esc(type.sprite)}" alt="" loading="lazy" />
        <b>${esc(item.name || type.name)}</b>
        <small>${Number(type.w || 2)}×${Number(type.h || 2)}格</small>
      </button>`;
    }).join("");

    const focused = state.builderPlaced.find((item) => item.id === state.builderFocusId) || state.builderPlaced[0];
    if (focused) {
      const type = builderType(focused.type);
      inspector.classList.add("is-open");
      inspector.innerHTML = `
        <header><span class="r77-builder-inspector-art"><img src="${esc(type.sprite)}" alt="" /></span><b>${esc(focused.name || type.name)}</b><button type="button" data-r77-builder-close>×</button></header>
        <p>${esc(type.name)}会占用 ${Number(type.w || 2)}×${Number(type.h || 2)} 个格子。它是个人科研岛上的功能入口，点击“进入功能”会跳回主站对应页面；正式版会支持改名、拜访展示和账号同步。</p>
        <div><button type="button" data-r77-builder-open="${esc(type.route)}">进入功能</button><button type="button" data-r77-builder-remove="${esc(focused.id)}">移除建筑</button></div>
      `;
    } else {
      inspector.classList.remove("is-open");
      inspector.innerHTML = "";
    }

    palette.querySelectorAll("[data-r77-builder-select]").forEach((button) => {
      button.addEventListener("click", () => {
        state.builderSelected = button.dataset.r77BuilderSelect || "library";
        state.toast = `已选择 ${builderType(state.builderSelected).name}，现在点一块空地放置。`;
        persist();
        renderBuilder();
        sync();
      });
    });

    r.querySelectorAll("[data-r77-builder-cell]").forEach((cell) => {
      cell.addEventListener("click", () => {
        const [gx, gy] = (cell.dataset.r77BuilderCell || "1,1").split(",").map((n) => Number(n));
        const type = builderType(state.builderSelected);
        if (builderOverlaps(gx, gy, type)) {
          state.toast = "这里已经被占用，或地块还没解锁。请换一格再放。";
          sync();
          return;
        }
        const id = `builder-${type.id}-${Date.now()}`;
        state.builderPlaced.push({ id, type: type.id, name: type.name, gx, gy });
        state.builderFocusId = id;
        state.points = Math.max(0, state.points - Math.max(0, Number(type.cost || 0)));
        state.toast = `${type.name} 已放置。这个页面专门放自定义建筑，不会再覆盖入口岛底图。`;
        persist();
        renderBuilder();
        sync();
      });
    });

    placed.querySelectorAll("[data-r77-builder-id]").forEach((button) => {
      button.addEventListener("click", () => {
        state.builderFocusId = button.dataset.r77BuilderId || "";
        persist();
        renderBuilder();
      });
    });

    inspector.querySelector("[data-r77-builder-close]")?.addEventListener("click", () => {
      state.builderFocusId = "";
      persist();
      renderBuilder();
    });
    inspector.querySelector("[data-r77-builder-open]")?.addEventListener("click", (event) => {
      const route = event.currentTarget.dataset.r77BuilderOpen || "research";
      location.hash = `#/${route}`;
    });
    inspector.querySelector("[data-r77-builder-remove]")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.r77BuilderRemove;
      state.builderPlaced = state.builderPlaced.filter((item) => item.id !== id);
      state.builderFocusId = "";
      state.toast = "建筑已移除。空地可以重新布置。";
      persist();
      renderBuilder();
      sync();
    });
  }

  function renderBuildingInspector() {
    const node = root()?.querySelector("[data-r77-building-inspector]");
    if (!node) return;
    const item = state.placed.find((entry) => entry.id === state.focusPlacedId);
    if (!item) {
      node.classList.remove("is-open");
      node.innerHTML = "";
      return;
    }
    const target = hotspots.find((b) => b.id === item.target) || hotspots[0];
    const progress = buildingProgress(item);
    const likes = Number(item.likes || 0);
    const visits = Number(item.visits || 0);
    node.classList.add("is-open");
    node.innerHTML = `
      <header>
        ${buildingIcon(item)}
        <span><b>${esc(item.name)}</b><small>Lv.${buildingLevel(item)} · ${esc(target.sub)}</small></span>
        <button type="button" data-r77-inspector-close>×</button>
      </header>
      <p>${esc(target.desc)}</p>
      <div class="r77-building-progress">
        <span><b>成长值</b><em>${progress.xp}/${progress.next}</em></span>
        <i style="--w:${progress.pct}%"></i>
      </div>
      <div class="r77-building-stats">
        <span><b>${visits}</b><small>拜访</small></span>
        <span><b>${likes}</b><small>喜欢</small></span>
        <span><b>${esc(item.rarity || "基础")}</b><small>稀有度</small></span>
      </div>
      <dl>
        <div><dt>绑定功能</dt><dd>${esc(target.name)}</dd></div>
        <div><dt>入口说明</dt><dd>${esc(item.bindNote || `点击后进入${target.sub}，可继续改绑到当前选中的建筑功能。`)}</dd></div>
        <div><dt>建筑位置</dt><dd>${Number(item.x).toFixed(1)}% / ${Number(item.y).toFixed(1)}%</dd></div>
        <div><dt>访客展示</dt><dd>${esc(buildingVisitText(item))}</dd></div>
      </dl>
      <div class="r77-building-next">
        <b>今天可以从这里开始</b>
        ${target.tasks.map((task, idx) => `<button type="button" data-r77-inspector-task="${esc(task)}"><span>${esc(task)}</span><em>+${18 + idx * 6}</em></button>`).join("")}
      </div>
      <div class="r77-inspector-actions">
        <a href="#/${esc(target.route)}">进入功能页</a>
        <button type="button" data-r77-action="decor">编辑位置</button>
        <button type="button" data-r77-upgrade-building="${esc(item.id)}">升级建筑</button>
        <button type="button" data-r77-share-building="${esc(item.id)}">发布展示</button>
        <button type="button" data-r77-bind-current="${esc(item.id)}">绑定当前功能</button>
        <button type="button" data-r77-delete-building="${esc(item.id)}">移除建筑</button>
      </div>
    `;
    node.querySelector("[data-r77-inspector-close]")?.addEventListener("click", () => {
      state.focusPlacedId = "";
      normalizePlacedBuildings();
      persist();
      sync();
    });
    node.querySelectorAll("[data-r77-inspector-task]").forEach((button) => {
      button.addEventListener("click", () => {
        const reward = Number(button.querySelector("em")?.textContent?.replace("+", "") || 18);
        state.points += reward;
        logTask(`从${item.name}开始：${button.dataset.r77InspectorTask}`, reward, item.target);
        state.toast = `已从“${item.name}”领取任务，建筑成长值同步增加。`;
        persist();
        sync();
      });
    });
    node.querySelector("[data-r77-upgrade-building]")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.r77UpgradeBuilding;
      const entry = state.placed.find((placed) => placed.id === id);
      if (!entry) return;
      const cost = 60 + buildingLevel(entry) * 20;
      if (state.points < cost) {
        state.toast = `金币不足：升级需要 ${cost}，可以先完成建筑里的科研任务。`;
        sync();
        return;
      }
      state.points -= cost;
      entry.level = Math.min(12, buildingLevel(entry) + 1);
      entry.xp = 0;
      logTask(`升级建筑：${entry.name} Lv.${entry.level}`, 18, entry.target);
      state.toast = `“${entry.name}”已升级到 Lv.${entry.level}。这是本地演示成长，不代表真实账号数据。`;
      persist();
      sync();
    });
    node.querySelector("[data-r77-share-building]")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.r77ShareBuilding;
      const entry = state.placed.find((placed) => placed.id === id);
      if (!entry) return;
      entry.visits = Number(entry.visits || 0) + 5;
      entry.likes = Number(entry.likes || 0) + 2;
      entry.xp = buildingXp(entry) + 24;
      state.visits += 5;
      state.likes += 2;
      state.points += 16;
      logTask(`发布建筑到小岛展示：${entry.name}`, 16, entry.target);
      state.toast = `“${entry.name}”已生成本地展示记录：+5 拜访、+2 喜欢。正式版才会写入社区。`;
      persist();
      sync();
    });
    node.querySelector("[data-r77-delete-building]")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.r77DeleteBuilding;
      state.placed = state.placed.filter((entry) => entry.id !== id);
      state.focusPlacedId = "";
      state.toast = "建筑已从个人小岛移除。它不会删除对应功能，只是不再展示在岛上。";
      persist();
      sync();
    });
    node.querySelector("[data-r77-bind-current]")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.r77BindCurrent;
      const entry = state.placed.find((placed) => placed.id === id);
      if (!entry) return;
      entry.target = state.selected.id;
      entry.tag = state.selected.name;
      entry.bindNote = `用户把该建筑改绑到“${state.selected.name}”，以后点击建筑会优先进入${state.selected.sub}。`;
      state.toast = `已把“${entry.name}”绑定到“${state.selected.name}”。正式版会保存到账号小岛配置。`;
      logTask(`调整建筑绑定：${entry.name} → ${state.selected.name}`, 12, state.selected.id);
      state.points += 12;
      persist();
      sync();
    });
  }

  function renderDialog() {
    const r = root();
    if (!r) return;
    const b = state.selected;
    r.querySelectorAll("[data-r77-hotspot]").forEach((button) => button.classList.toggle("is-active", button.dataset.r77Hotspot === b.id));
    r.querySelectorAll("[data-r77-label]").forEach((button) => button.classList.toggle("is-active", button.dataset.r77Label === b.id));
    const dialog = r.querySelector("[data-r77-dialog]");
    if (!dialog) return;
    if (!state.dialogOpen) {
      dialog.classList.remove("is-open");
      dialog.innerHTML = "";
      return;
    }
    dialog.classList.add("is-open");
    dialog.innerHTML = `<header><strong>${esc(b.name)}</strong><span>${esc(b.sub)}</span><button type="button" data-r77-dialog-close aria-label="关闭建筑对话">×</button></header><p>${esc(b.desc)}</p><ul>${b.tasks.map((task, idx) => `<li data-r77-task="${esc(task)}"><span>${["●", "◆", "★"][idx % 3]}</span><span>${esc(task)}</span><em>+${18 + idx * 6}</em></li>`).join("")}</ul><div class="r77-concept-actions"><a href="#/${esc(b.route)}">进入功能页</a><button type="button" data-r77-build>放到我的小岛</button><button type="button" data-r77-drawer-open>打开建筑库</button></div>`;
    dialog.querySelector("[data-r77-dialog-close]")?.addEventListener("click", () => {
      state.dialogOpen = false;
      state.toast = "建筑对话框已收起。再次点击建筑即可打开。";
      sync();
    });
    dialog.querySelectorAll("[data-r77-task]").forEach((item) => {
      item.addEventListener("click", () => {
        state.points += 24;
        logTask(item.dataset.r77Task, 24, b.id);
        state.toast = `已领取任务：${item.dataset.r77Task}。这是本地演示积分，正式版会写入账号和复核记录。`;
        persist();
        sync();
      });
    });
    dialog.querySelector("[data-r77-build]")?.addEventListener("click", () => {
      state.builderSelected = builderCatalog.some((item) => item.id === b.id) ? b.id : "library";
      state.toast = `已切到建造模式：选择空地后放置“${b.name}”。`;
      persist();
      location.hash = "#/island-builder";
    });
    dialog.querySelector("[data-r77-drawer-open]")?.addEventListener("click", () => {
      state.toast = "建筑库已移到第二页，避免遮挡入口岛。";
      persist();
      location.hash = "#/island-builder";
    });
    movePlayerTo(b);
  }

  function sync() {
    const r = root();
    if (!r) return;
    window.medpathR77State = state;
    const pointsNode = r.querySelector('[data-r77-value="金币"]');
    if (pointsNode) pointsNode.textContent = state.points.toLocaleString();
    r.querySelector("[data-r77-toast]").textContent = state.toast;
    const drawerNode = r.querySelector("[data-r77-drawer]");
    drawerNode?.classList.toggle("is-open", !!state.drawer);
    drawerNode?.classList.toggle("is-minimized", !!state.drawerMinimized);
    drawerNode?.style.removeProperty("display");
    drawerNode?.removeAttribute("data-r77-force-open");
    r.classList.toggle("is-left-collapsed", !state.leftPanelOpen);
    r.classList.toggle("is-right-collapsed", !state.rightDockOpen);
    r.classList.toggle("is-bottom-collapsed", !!state.bottomDockCollapsed);
    renderSocial();
    renderDailyPanel();
    renderDecorations();
    renderPlaced();
    renderAgents();
    renderBotPanel();
    renderBuilder();
    renderBuildingInspector();
    renderOwned();
    renderCatalogDrawer();
    renderDecorShop();
    renderMobileDecorShop();
    drawerNode?.classList.toggle("is-open", !!state.drawer);
    drawerNode?.classList.toggle("is-minimized", !!state.drawerMinimized);
    renderDialog();
  }

  function select(id) {
    const b = hotspots.find((item) => item.id === id) || hotspots[0];
    state.selected = b;
    state.dialogOpen = true;
    state.toast = `已到达 ${b.name}：${b.sub}。`;
    sync();
  }

  function routeTask(text) {
    const t = text.toLowerCase();
    if (/meta|综述|文献|prisma|基金|课题/.test(t)) return "library";
    if (/课程|课堂|pbl/.test(t)) return "classroom";
    if (/病理|报告|病例|案例/.test(t)) return "pathology";
    if (/单细胞|虚拟敲除|扰动|空间组学|scgen|gears|cpa/.test(t)) return "singlecell";
    if (/图|热图|火山|umap|森林|plot|ggplot/.test(t)) return "plot";
    if (/skill|agent|智能体|模板/.test(t)) return "skill";
    if (/伦理|隐私|幻觉|引用|风险/.test(t)) return "ethics";
    if (/hpc|slurm|服务器|模型|api|dry/.test(t)) return "hpc";
    if (/社区|排行|好友|拜访|点赞/.test(t)) return "community";
    return "library";
  }

  function openDrawer() {
    state.drawer = true;
    state.drawerMinimized = false;
    state.leftPanelOpen = false;
    state.toast = `建筑库已打开：当前提供 ${catalog.length} 种建筑与皮肤。它们会绑定到不同科研功能，后续支持拖拽摆放、好友拜访和排行榜展示。`;
    sync();
  }

  function chooseCatalog(itemId) {
    const item = catalog.find((entry) => entry.id === itemId);
    if (!item) return;
    if (!state.owned.some((owned) => owned.id === item.id)) {
      state.owned.push(item);
      state.points = Math.max(0, state.points - item.cost);
    }
    addPlacedFromItem(item);
    state.lastCatalog = item;
    state.drawer = false;
    const toast = `已选择“${item.name}”：${item.desc}。它会绑定到“${hotspots.find((b) => b.id === item.target)?.name || "科研建筑"}”，后续可拖拽摆放到个人小岛。`;
    persist();
    select(item.target);
    state.toast = toast;
    sync();
  }

  function addPlacedFromItem(item) {
    if (!item || state.placed.some((placed) => placed.id === item.id)) return;
    const index = state.placed.length;
    state.placed.push({
      id: item.id,
      name: item.name,
      target: item.target,
      tag: item.tag,
      skinKey: item.skinKey,
      sprite: spriteFor(item.target, item.skinKey),
      desc: item.desc,
      style: item.style,
      rarity: item.rarity,
      unlock: item.unlock,
      bindNote: item.bindHint || `绑定到${hotspots.find((b) => b.id === item.target)?.name || "科研功能"}，后续可替换为自己的Skill、案例或常用方法。`,
      level: 1,
      xp: 0,
      visits: 0,
      likes: 0,
      x: placementSlots[index % placementSlots.length].x,
      y: placementSlots[index % placementSlots.length].y,
    });
  }

  function forceDrawerVisible() {
    const drawer = document.querySelector("[data-r77-drawer]");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.classList.remove("is-minimized");
    drawer.style.removeProperty("display");
    drawer.removeAttribute("data-r77-force-open");
  }

  function openDecorShop() {
    state.editing = true;
    const isMobile = window.matchMedia?.("(max-width: 720px)")?.matches;
    state.drawer = !isMobile;
    state.drawerMinimized = false;
    state.leftPanelOpen = false;
    state.toast = "装饰商店已打开：选择路牌、花坛、复核点和学习标记，把科研小岛布置成自己的空间。";
    persist();
    sync();
    renderCatalogDrawer();
    renderDecorShop();
    renderMobileDecorShop();
    if (isMobile) root()?.querySelector("[data-r77-mobile-decor-panel]")?.classList.add("is-open");
    else forceDrawerVisible();
  }

  function handleAction(action) {
    const r = root();
    if (action === "build") {
      location.hash = "#/island-builder";
      return;
    }
    if (action === "builder-clear") {
      state.builderPlaced = builderSeed.map((item) => ({ ...item }));
      state.builderFocusId = "";
      state.builderSelected = "library";
      state.toast = "建造模式已重置为稀疏布局；入口岛不会受到影响。";
      persist();
      renderBuilder();
      sync();
      return;
    }
    if (action === "robot") {
      state.botOpen = true;
      state.toast = "小机器人已打开：你可以让它带你去绘图、建造、案例、API配置等页面。";
      persist();
      sync();
      return;
    }
    if (["catalog", "build", "shop", "warehouse"].includes(action)) {
      state.drawer = true;
      state.drawerMinimized = false;
      state.leftPanelOpen = false;
      state.toast = "建筑库打开：选择建筑后可绑定Skill、案例、图表或学习路径。关闭请点右上角 ×。";
    } else if (action === "toggle-left") {
      state.leftPanelOpen = !state.leftPanelOpen;
      state.toast = state.leftPanelOpen ? "贡献榜已展开。" : "贡献榜已收起，小岛视野更宽。";
      persist();
    } else if (action === "toggle-right") {
      state.rightDockOpen = !state.rightDockOpen;
      state.toast = state.rightDockOpen ? "快捷栏已展开。" : "快捷栏已收起。";
      persist();
    } else if (action === "toggle-bottom") {
      state.bottomDockCollapsed = !state.bottomDockCollapsed;
      state.toast = state.bottomDockCollapsed ? "底部工具栏已收起。" : "底部工具栏已展开。";
      persist();
    } else if (action === "decor") {
      openDecorShop();
      return;
    } else if (action === "like") {
      state.likes += 1;
      state.points += 8;
      logTask("给科研小岛点赞", 8, "community");
      state.toast = "已为这个科研小岛点赞，获得 8 积分。本地原型不会上传社交数据。";
      persist();
    } else if (action === "visit") {
      state.visits += 1;
      logTask("申请拜访同学小岛", 12, "community");
      state.toast = "已发送拜访申请：正式版会进入好友小岛与建筑互动，当前展示本地演示。";
      select("community");
      persist();
      return;
    } else if (action === "reset-layout") {
      state.placed = [
        { id: "starter-library", name: "文献图书馆", target: "library", tag: "综述", skinKey: "morning", x: 33, y: 29 },
        { id: "starter-skill", name: "Skill工坊", target: "skill", tag: "创作", skinKey: "academy", x: 73, y: 62 },
        { id: "starter-plot", name: "绘图工坊", target: "plot", tag: "绘图", skinKey: "wood", x: 31, y: 55 },
      ];
      state.decorations = ["lamp-data", "flower-ethics", "sign-method", "pond-focus"].map((id, index) => {
        const item = decorCatalog.find((entry) => entry.id === id) || decorCatalog[index];
        return { id: `starter-decor-${item.id}`, sourceId: item.id, name: item.name, icon: item.icon, kind: item.kind, desc: item.desc, rarity: item.rarity, x: item.x, y: item.y };
      });
      state.focusPlacedId = "";
      state.focusDecorId = "";
      normalizePlacedBuildings();
      normalizeDecorations();
      state.toast = "小岛布局已恢复为初始科研建筑。";
      persist();
    } else if (action === "rank") {
      state.leftPanelOpen = true;
      persist();
      state.toast = "排行榜展示本地演示数据；正式版将接入点赞、收藏、拜访和发布记录。";
    } else if (action === "cases") select("pathology");
    else if (action === "tools") select("plot");
    else if (action === "skill") select("skill");
    else if (action === "tasks") {
      state.toast = "今日任务：做一个案例、试一个方法、画一张图、把输出交给教师复核。";
    } else {
      state.toast = "该功能为本地原型交互，后续会接账号、背包、建筑摆放和社区系统。";
    }
    sync();
    if (["catalog", "build", "shop", "warehouse", "decor"].includes(action)) {
      root()?.querySelector("[data-r77-drawer]")?.classList.add("is-open");
    }
  }

  function submitTask(form) {
    const input = form?.elements?.task;
    const text = input?.value?.trim();
    if (!text) return false;
    input.value = "";
    runBotAssistant(text, { forceOpen: true, fromCommand: true });
    return false;
  }

  function closeDrawer() {
    state.drawer = false;
    state.drawerMinimized = false;
    state.toast = "建筑库已收起。";
    sync();
  }

  function minimizeDrawer() {
    state.drawerMinimized = !state.drawerMinimized;
    state.toast = state.drawerMinimized ? "建筑商店已最小化，只保留标题栏。" : "建筑商店已展开。";
    sync();
  }

  function installApi() {
    window.medpathR77OpenDrawer = openDrawer;
    window.medpathR77OpenDecorShop = openDecorShop;
    window.medpathR77ChooseCatalog = chooseCatalog;
    window.medpathR77Action = handleAction;
    window.medpathR77Select = select;
    window.medpathR77Submit = submitTask;
    window.medpathR77CloseDrawer = closeDrawer;
    window.medpathR77MinimizeDrawer = minimizeDrawer;
    window.medpathR77State = state;
  }

  function attachEvents() {
    const r = root();
    if (!r) return;
    if (r.dataset.r77Events === "1") return;
    r.dataset.r77Events = "1";
    let dragging = null;
    r.addEventListener("click", (event) => {
      const botOpenButton = event.target.closest?.("[data-r77-bot-open]");
      if (botOpenButton) {
        state.botOpen = true;
        state.toast = "小机器人已打开。你可以直接说要打开哪个页面，或先配置模型API。";
        persist();
        sync();
        return;
      }
      const botCloseButton = event.target.closest?.("[data-r77-bot-close]");
      if (botCloseButton) {
        state.botOpen = false;
        persist();
        sync();
        return;
      }
      const botQuickButton = event.target.closest?.("[data-r77-bot-quick]");
      if (botQuickButton) {
        runBotAssistant(botQuickButton.dataset.r77BotQuick || "", { forceOpen: true });
        return;
      }
      const islandTarget = event.target.closest?.("[data-r77-hotspot],[data-r77-label]");
      if (islandTarget) {
        const id = islandTarget.dataset.r77Hotspot || islandTarget.dataset.r77Label;
        if (id) select(id);
        return;
      }
      const openButton = event.target.closest?.("[data-r77-drawer-open]");
      if (openButton) {
        openDrawer();
        return;
      }
      const actionButton = event.target.closest?.("[data-r77-action]");
      if (actionButton && !actionButton.getAttribute("onclick")) {
        handleAction(actionButton.dataset.r77Action);
      }
    });
    r.addEventListener("submit", (event) => {
      const botForm = event.target.closest?.("[data-r77-bot-form]");
      if (!botForm) return;
      event.preventDefault();
      const input = botForm.elements.botText;
      const text = input?.value?.trim();
      if (!text) return;
      input.value = "";
      runBotAssistant(text, { forceOpen: true });
    });
    r.addEventListener("pointerdown", (event) => {
      const placedButton = event.target.closest?.("[data-r77-placed-id]");
      if (!placedButton) return;
      const item = state.placed.find((entry) => entry.id === placedButton.dataset.r77PlacedId);
      if (!item) return;
      if (!state.editing) {
        state.focusPlacedId = item.id;
        select(item.target);
        state.toast = `已打开“${item.name}”。点底部“装饰”后可以拖动它的位置。`;
        persist();
        sync();
        return;
      }
      event.preventDefault();
      dragging = { item, element: placedButton };
      placedButton.classList.add("is-dragging");
      placedButton.setPointerCapture?.(event.pointerId);
    });
    window.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const stage = root()?.querySelector(".r77-concept-stage");
      const rect = stage?.getBoundingClientRect();
      if (!rect || rect.width < 1 || rect.height < 1) return;
      const x = Math.max(18, Math.min(86, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(18, Math.min(88, ((event.clientY - rect.top) / rect.height) * 100));
      dragging.item.x = Math.round(x * 2) / 2;
      dragging.item.y = Math.round(y * 2) / 2;
      dragging.element.style.left = `${dragging.item.x}%`;
      dragging.element.style.top = `${dragging.item.y}%`;
    });
    window.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging.element.classList.remove("is-dragging");
      state.toast = `“${dragging.item.name}”的位置已保存。`;
      persist();
      dragging = null;
      sync();
    });
    r.querySelector("[data-r77-command]")?.addEventListener("submit", (event) => {
      if (event.defaultPrevented || event.currentTarget.getAttribute("onsubmit")) return;
      event.preventDefault();
      const input = event.currentTarget.elements.task;
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      runBotAssistant(text, { forceOpen: true, fromCommand: true });
    });
    r.querySelector("[data-r77-close]")?.addEventListener("click", () => {
      state.drawer = false;
      state.drawerMinimized = false;
      state.toast = "建筑库已收起。";
      sync();
    });
    r.querySelector("[data-r77-drawer-minimize]")?.addEventListener("click", () => {
      state.drawerMinimized = !state.drawerMinimized;
      state.toast = state.drawerMinimized ? "建筑商店已最小化，只保留标题栏。" : "建筑商店已展开。";
      sync();
    });
    r.querySelector("[data-r77-mobile-decor-close]")?.addEventListener("click", () => {
      r.querySelector("[data-r77-mobile-decor-panel]")?.classList.remove("is-open");
      state.toast = "装饰商店已收起。";
      sync();
    });
    if (!window.__MEDPATH_R77_ESC_BOUND) {
      window.__MEDPATH_R77_ESC_BOUND = true;
      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const rr = root();
        if (!rr) return;
        const mobileDecor = rr.querySelector("[data-r77-mobile-decor-panel]");
        if (mobileDecor?.classList.contains("is-open")) {
          mobileDecor.classList.remove("is-open");
          state.toast = "装饰商店已收起。";
        } else if (state.drawer) {
          state.drawer = false;
          state.drawerMinimized = false;
          state.toast = "建筑库已收起。";
        } else if (state.dialogOpen) {
          state.dialogOpen = false;
          state.toast = "建筑对话框已收起。";
        } else if (state.focusPlacedId) {
          state.focusPlacedId = "";
          state.toast = "建筑详情已收起。";
        }
        persist();
        sync();
    });
    }
  }

  function installGlobalClickFallback() {
    if (window.__MEDPATH_R77_GLOBAL_CLICK_BOUND) return;
    window.__MEDPATH_R77_GLOBAL_CLICK_BOUND = true;
    document.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-r77-hotspot],[data-r77-label]");
      if (target && root()?.contains(target)) {
        const id = target.dataset.r77Hotspot || target.dataset.r77Label;
        if (!id) return;
        event.preventDefault();
        event.stopPropagation();
        select(id);
        return;
      }
      const action = event.target.closest?.("[data-r77-action]");
      if (action && root()?.contains(action)) {
        event.preventDefault();
        event.stopPropagation();
        handleAction(action.dataset.r77Action);
      }
    }, true);
  }

  function refreshInteractiveIsland() {
    installApi();
    installGlobalClickFallback();
    attachEvents();
    renderSocial();
    renderDailyPanel();
    renderDecorations();
    renderPlaced();
    renderAgents();
    renderBuilder();
    renderOwned();
    renderCatalogDrawer();
    renderDecorShop();
    renderMobileDecorShop();
    renderDialog();
    sync();
  }

  function mount() {
    const stage = document.getElementById("r73-island-stage");
    if (!stage) return;
    if (stage.dataset.r77Mounted === "1") {
      if (!root()) {
        stage.dataset.r77Mounted = "";
        stage.innerHTML = "";
      } else {
        installApi();
        attachEvents();
        sync();
        return;
      }
    }
    if (stage.dataset.r77Mounted === "1") {
      return;
    }
    if (location.hash && !location.hash.includes("island")) return;
    stage.dataset.r76Mounted = "1";
    stage.dataset.r77Mounted = "1";
    stage.innerHTML = shell();
    document.body.classList.add("r77-game-active");
    document.body.classList.remove("r76-game-active");
    refreshInteractiveIsland();
  }

  function resetForRoute() {
    if (!location.hash.includes("island")) return;
    const stage = document.getElementById("r73-island-stage");
    if (!stage) return;
    const expectedMode = isBuilderMode() ? "builder" : "entry";
    if (root()?.dataset.r77Mode && root().dataset.r77Mode !== expectedMode) {
      stage.dataset.r77Mounted = "";
      stage.innerHTML = "";
      mount();
    }
    else if (stage.dataset.r77Mounted !== "1" || !root()) mount();
    else {
      installApi();
      attachEvents();
    }
  }

  function observe() {
    installApi();
    installGlobalClickFallback();
    mount();
    const app = document.getElementById("app");
    if (app && "MutationObserver" in window) new MutationObserver(() => setTimeout(resetForRoute, 60)).observe(app, { childList: true, subtree: true });
    window.addEventListener("hashchange", () => setTimeout(resetForRoute, 80));
    setInterval(resetForRoute, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe);
  else observe();
  setTimeout(observe, 80);
  setTimeout(mount, 350);
  setTimeout(mount, 1200);
  setInterval(() => {
    if (!location.hash.includes("island")) return;
    if (!root()) mount();
    else {
      installApi();
      installGlobalClickFallback();
      attachEvents();
    }
  }, 900);
})();

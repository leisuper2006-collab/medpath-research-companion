import * as THREE from "./vendor/three.module.min.js";

const buildings = [
  {
    id: "library",
    name: "文献图书馆",
    role: "综述、Meta 分析、基金思路",
    route: "method-runner",
    color: 0xe6a95f,
    roof: 0x9c5237,
    pos: [-7, 0, -4],
    points: 60,
  },
  {
    id: "school",
    name: "教学楼",
    role: "课程设计、PBL、教学评价",
    route: "learn",
    color: 0x93c792,
    roof: 0x8b4634,
    pos: [-1.6, 0, -5.8],
    points: 45,
  },
  {
    id: "pathlab",
    name: "病理室",
    role: "报告训练、超微病理",
    route: "cases",
    color: 0xd6889b,
    roof: 0x8e4b3e,
    pos: [5.2, 0, -4.1],
    points: 50,
  },
  {
    id: "bioinfo",
    name: "实验楼",
    role: "单细胞、扰动分析、空间组学",
    route: "research",
    color: 0x9ecbe7,
    roof: 0x9a533c,
    pos: [-5.6, 0, 1.8],
    points: 70,
  },
  {
    id: "plot",
    name: "绘图工坊",
    role: "火山图、热图、森林图",
    route: "plot-studio",
    color: 0xc4b0e4,
    roof: 0x9a533c,
    pos: [0.6, 0, 2.6],
    points: 55,
  },
  {
    id: "skill",
    name: "Skill 工坊",
    role: "DIY Skill、Agent、模板生成",
    route: "skills",
    color: 0xefb26f,
    roof: 0x9a533c,
    pos: [6.3, 0, 2.4],
    points: 80,
  },
  {
    id: "community",
    name: "社区中心",
    role: "好友、拜访、排行榜",
    route: "community",
    color: 0xc9de8d,
    roof: 0x8b4634,
    pos: [-3.4, 0, 6.5],
    points: 40,
  },
  {
    id: "archive",
    name: "档案馆",
    role: "我的案例、收藏、作品",
    route: "profile",
    color: 0xd6c0a1,
    roof: 0x7c4f38,
    pos: [3.8, 0, 6.2],
    points: 35,
  },
];

const shopItems = [
  ["樱花树", 120],
  ["桥", 160],
  ["小灯", 80],
  ["温室", 220],
  ["喷泉", 260],
  ["小宠物", 300],
];

const runtime = {
  initialized: false,
  currentRoot: null,
  renderer: null,
  scene: null,
  camera: null,
  raycaster: null,
  pointer: new THREE.Vector2(),
  player: null,
  playerTarget: new THREE.Vector3(0, 0.38, 0),
  buildingObjects: [],
  hovered: null,
  points: Number(localStorage.getItem("medpath_game_points") || 960),
  visits: Number(localStorage.getItem("medpath_game_visits") || 12),
  animationId: 0,
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function makeMat(color, roughness = 0.8) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.02,
    flatShading: true,
  });
}

function roundedBox(w, h, d, color) {
  const geo = new THREE.BoxGeometry(w, h, d, 1, 1, 1);
  const mesh = new THREE.Mesh(geo, makeMat(color));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function roofMesh(w, d, color) {
  const h = 0.9;
  const vertices = new Float32Array([
    -w / 2, 0, -d / 2, w / 2, 0, -d / 2, 0, h, -d / 2,
    -w / 2, 0, d / 2, 0, h, d / 2, w / 2, 0, d / 2,
    -w / 2, 0, -d / 2, -w / 2, 0, d / 2, 0, h, -d / 2,
    0, h, -d / 2, -w / 2, 0, d / 2, 0, h, d / 2,
    w / 2, 0, -d / 2, 0, h, -d / 2, w / 2, 0, d / 2,
    0, h, -d / 2, 0, h, d / 2, w / 2, 0, d / 2,
  ]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, makeMat(color));
  mesh.castShadow = true;
  return mesh;
}

function createBuilding(item) {
  const group = new THREE.Group();
  group.position.set(item.pos[0], 0, item.pos[2]);
  const body = roundedBox(2.2, 1.65, 2.0, item.color);
  body.position.y = 0.85;
  const roof = roofMesh(2.7, 2.4, item.roof);
  roof.position.y = 1.7;
  const door = roundedBox(0.45, 0.75, 0.06, 0x50372f);
  door.position.set(0, 0.38, -1.04);
  const sign = roundedBox(1.45, 0.28, 0.05, 0xfff6df);
  sign.position.set(0, 1.35, -1.05);
  group.add(body, roof, door, sign);
  group.userData = { type: "building", item };
  group.traverse((child) => {
    child.userData = { type: "building", item };
  });
  runtime.buildingObjects.push(group);
  return group;
}

function createTree(x, z, scale = 1) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.8, 6), makeMat(0x7b5438));
  trunk.position.y = 0.4;
  const top = new THREE.Mesh(new THREE.ConeGeometry(0.66 * scale, 1.4 * scale, 7), makeMat(0x3e8d53));
  top.position.y = 1.25;
  top.castShadow = true;
  group.add(trunk, top);
  return group;
}

function createPlayer() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.86, 12), makeMat(0x2d6f96));
  body.position.y = 0.66;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 12), makeMat(0xf0c19b));
  head.position.y = 1.35;
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), makeMat(0x5a3a2a));
  hair.position.y = 1.52;
  const bag = roundedBox(0.34, 0.42, 0.14, 0xf3d986);
  bag.position.set(0.36, 0.82, 0.02);
  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.32), makeMat(0x1f2937));
  leftFoot.position.set(-0.16, 0.12, 0.08);
  const rightFoot = leftFoot.clone();
  rightFoot.position.x = 0.16;
  group.add(body, head, hair, bag, leftFoot, rightFoot);
  group.position.set(0, 0, 0);
  return group;
}

function createIslandScene(root) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcfefff);

  const camera = new THREE.OrthographicCamera(-10, 10, 7, -7, 0.1, 100);
  camera.position.set(10, 12, 12);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  root.appendChild(renderer.domElement);
  renderer.domElement.className = "r74-canvas";

  const ambient = new THREE.HemisphereLight(0xffffff, 0x8ebf6b, 1.8);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(7, 11, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.CylinderGeometry(10.5, 11.6, 0.55, 9), makeMat(0xa8d27d));
  ground.rotation.y = Math.PI / 9;
  ground.position.y = -0.28;
  ground.receiveShadow = true;
  scene.add(ground);

  const water = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 22), makeMat(0x4eb6e9, 0.45));
  water.rotation.y = -0.28;
  water.position.set(-4.2, 0.02, 0);
  scene.add(water);

  const pathMat = makeMat(0xf0dfbd);
  [
    [0, 0.06, 0, 17, 0.22, 1.0, 0.1],
    [0, 0.07, 0, 1.0, 0.22, 16, -0.16],
    [-3.8, 0.07, 1.2, 7, 0.2, 0.8, 0.55],
    [4.3, 0.07, -0.6, 7.2, 0.2, 0.8, -0.5],
  ].forEach(([x, y, z, w, h, d, r]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pathMat);
    p.position.set(x, y, z);
    p.rotation.y = r;
    p.receiveShadow = true;
    scene.add(p);
  });

  buildings.forEach((item) => scene.add(createBuilding(item)));

  [
    [-8.4, -0.4], [-8, 4.4], [-5.8, 7.8], [-2.2, -8.4], [1.4, -8.2],
    [4.4, 7.8], [8.4, -1.4], [7.6, 5.4], [-0.2, 8.2], [8.0, -6.8],
  ].forEach(([x, z], i) => scene.add(createTree(x, z, i % 3 === 0 ? 1.25 : 1)));

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 1.1), makeMat(0x9d6646));
  bridge.position.set(-3.9, 0.24, 0.5);
  bridge.rotation.y = -0.28;
  bridge.castShadow = true;
  scene.add(bridge);

  const player = createPlayer();
  scene.add(player);

  runtime.scene = scene;
  runtime.camera = camera;
  runtime.renderer = renderer;
  runtime.raycaster = new THREE.Raycaster();
  runtime.player = player;
  runtime.playerTarget.set(0, 0, 0);
  resize();
}

function resize() {
  if (!runtime.renderer || !runtime.camera || !runtime.currentRoot) return;
  const rect = runtime.currentRoot.getBoundingClientRect();
  const w = Math.max(rect.width, 320);
  const h = Math.max(rect.height, 520);
  runtime.renderer.setSize(w, h, false);
  const aspect = w / h;
  const view = 10.5;
  runtime.camera.left = -view * aspect;
  runtime.camera.right = view * aspect;
  runtime.camera.top = view;
  runtime.camera.bottom = -view;
  runtime.camera.updateProjectionMatrix();
}

function screenPointer(event) {
  const rect = runtime.renderer.domElement.getBoundingClientRect();
  runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function findBuildingFromEvent(event) {
  if (!runtime.raycaster || !runtime.camera) return null;
  screenPointer(event);
  runtime.raycaster.setFromCamera(runtime.pointer, runtime.camera);
  const hits = runtime.raycaster.intersectObjects(runtime.scene.children, true);
  const hit = hits.find((item) => item.object.userData?.type === "building");
  return hit?.object?.userData?.item || null;
}

function findNearestBuildingFromEvent(event) {
  const directHit = findBuildingFromEvent(event);
  if (directHit) return directHit;
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const point = new THREE.Vector3();
  if (!runtime.raycaster.ray.intersectPlane(ground, point)) return null;
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  buildings.forEach((item) => {
    const dx = item.pos[0] - point.x;
    const dz = item.pos[2] - point.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < bestDistance) {
      best = item;
      bestDistance = distance;
    }
  });
  return bestDistance <= 3.5 ? best : null;
}

function movePlayerTo(item) {
  runtime.playerTarget.set(item.pos[0], 0, item.pos[2] + 2.2);
}

function setDialog(item) {
  const dialog = runtime.currentRoot.querySelector(".r74-dialog");
  if (!dialog) return;
  dialog.innerHTML = `
    <h3>${esc(item.name)}</h3>
    <p>${esc(item.role)}。点击“进入功能”会跳转到对应页面；点击“设为常用建筑”会给你的小岛增加积分。真实平台后续会支持把你自己的 Skill 绑定到建筑上。</p>
    <div class="r74-dialog-actions">
      <a href="#/${esc(item.route)}">进入功能</a>
      <button class="secondary" data-r74-favorite="${esc(item.id)}">设为常用建筑 +${item.points}</button>
      <button class="secondary" data-r74-visit>申请拜访同学小岛</button>
    </div>
  `;
  dialog.querySelector("[data-r74-favorite]")?.addEventListener("click", () => {
    runtime.points += item.points;
    localStorage.setItem("medpath_game_points", String(runtime.points));
    updateHud(`已把「${item.name}」设为常用建筑，获得 ${item.points} 积分。`);
  });
  dialog.querySelector("[data-r74-visit]")?.addEventListener("click", () => {
    runtime.visits += 1;
    localStorage.setItem("medpath_game_visits", String(runtime.visits));
    updateHud("已生成一条拜访请求：等待对方同意后可以参观他的 Skill 小岛。");
  });
}

function updateHud(message) {
  const score = runtime.currentRoot.querySelector("[data-r74-score]");
  const visits = runtime.currentRoot.querySelector("[data-r74-visits]");
  const note = runtime.currentRoot.querySelector("[data-r74-note]");
  if (score) score.textContent = `${runtime.points} 积分`;
  if (visits) visits.textContent = `${runtime.visits} 次拜访`;
  if (note && message) note.textContent = message;
}

function animate() {
  runtime.animationId = requestAnimationFrame(animate);
  if (!runtime.renderer || !runtime.scene || !runtime.camera) return;

  const p = runtime.player.position;
  const target = runtime.playerTarget;
  p.x += (target.x - p.x) * 0.055;
  p.z += (target.z - p.z) * 0.055;
  runtime.player.rotation.y = Math.atan2(target.x - p.x, target.z - p.z);
  runtime.player.position.y = Math.sin(performance.now() / 220) * 0.03;

  runtime.buildingObjects.forEach((group, index) => {
    group.position.y = Math.sin(performance.now() / 900 + index) * 0.025;
  });

  runtime.renderer.render(runtime.scene, runtime.camera);
}

function htmlShell() {
  return `
    <div class="r74-game-shell">
      <div class="r74-hud">
        <div>
          <span class="r74-chip">Research Island 3D</span>
          <span class="r74-chip" data-r74-score>${runtime.points} 积分</span>
          <span class="r74-chip" data-r74-visits>${runtime.visits} 次拜访</span>
        </div>
        <div>
          <button class="r74-action dark" data-r74-reset>回到广场</button>
          <button class="r74-action" data-r74-shop>建筑商店</button>
        </div>
      </div>
      <div class="r74-game-note" data-r74-note>点击建筑，角色会走过去并弹出任务对话。</div>
      <div class="r74-tooltip"></div>
      <div class="r74-side-panel">
        <div class="r74-panel-card">
          <h4>建筑商店</h4>
          <p>先做 MVP：完成任务得积分，积分可换建筑/装饰。后续接入个人账户和真实作品。</p>
          <div class="r74-shop">
            ${shopItems.map(([name, price]) => `<button data-r74-buy="${esc(name)}" data-price="${price}">${esc(name)}<br>${price}</button>`).join("")}
          </div>
        </div>
        <div class="r74-panel-card">
          <h4>本周小岛榜</h4>
          <p>1. 单细胞扰动岛 · 238赞<br>2. 病理报告训练岛 · 190赞<br>3. Meta分析图书馆 · 166赞</p>
        </div>
      </div>
      <div class="r74-dialog">
        <h3>欢迎来到真正的科研小岛</h3>
        <p>这是 Three.js 低多边形 3D 场景。点建筑会移动角色、弹出对话并跳转功能。它仍是本地原型，但已经不是静态卡片。</p>
        <div class="r74-dialog-actions">
          <button class="secondary" data-r74-random>随机参观一栋建筑</button>
          <a href="#/community">看排行榜</a>
        </div>
      </div>
    </div>
  `;
}

function attachEvents(root) {
  runtime.renderer.domElement.addEventListener("click", (event) => {
    const item = findNearestBuildingFromEvent(event);
    if (!item) return;
    movePlayerTo(item);
    setDialog(item);
    updateHud(`已选择 ${item.name}：${item.role}`);
  });

  const tooltip = root.querySelector(".r74-tooltip");
  runtime.renderer.domElement.addEventListener("mousemove", (event) => {
    const item = findBuildingFromEvent(event);
    if (!tooltip) return;
    if (!item) {
      tooltip.style.display = "none";
      runtime.hovered = null;
      return;
    }
    runtime.hovered = item;
    tooltip.style.display = "block";
    tooltip.style.left = `${event.offsetX}px`;
    tooltip.style.top = `${event.offsetY - 14}px`;
    tooltip.textContent = item.name;
  });

  root.querySelector("[data-r74-reset]")?.addEventListener("click", () => {
    runtime.playerTarget.set(0, 0, 0);
    updateHud("已回到广场。现在可以选择下一栋建筑。");
  });
  root.querySelector("[data-r74-random]")?.addEventListener("click", () => {
    const item = buildings[Math.floor(Math.random() * buildings.length)];
    movePlayerTo(item);
    setDialog(item);
    updateHud(`随机拜访：${item.name}`);
  });
  root.querySelector("[data-r74-shop]")?.addEventListener("click", () => {
    updateHud("建筑商店已打开：当前为原型，后续会支持购买后放置到岛上。");
  });
  root.querySelectorAll("[data-r74-buy]").forEach((button) => {
    button.addEventListener("click", () => {
      const price = Number(button.dataset.price || 0);
      const name = button.dataset.r74Buy;
      if (runtime.points < price) {
        updateHud(`积分还不够兑换「${name}」。先完成 Skill 或案例任务吧。`);
        return;
      }
      runtime.points -= price;
      localStorage.setItem("medpath_game_points", String(runtime.points));
      updateHud(`已兑换「${name}」。后续版本会允许你把它摆到小岛上。`);
    });
  });
  window.addEventListener("resize", resize, { passive: true });
}

function initGameIfNeeded() {
  const oldStage = document.getElementById("r73-island-stage");
  if (!oldStage || oldStage.dataset.r74Mounted === "1") return;
  if (location.hash && !location.hash.includes("island")) return;

  cancelAnimationFrame(runtime.animationId);
  runtime.currentRoot = oldStage;
  runtime.buildingObjects = [];
  oldStage.dataset.r74Mounted = "1";
  oldStage.classList.add("r74-game-loaded");
  document.body.classList.add("r74-game-loaded");
  oldStage.innerHTML = typeof htmlShellV75 === "function" ? htmlShellV75() : htmlShell();
  const shell = oldStage.querySelector(".r74-game-shell");
  runtime.currentRoot = shell;
  createIslandScene(shell);
  if (typeof attachEventsV75 === "function") {
    attachEventsV75(shell);
  } else {
    attachEvents(shell);
  }
  resize();
  animate();
}

function observe() {
  initGameIfNeeded();
  const app = document.getElementById("app");
  if (app && "MutationObserver" in window) {
    const mo = new MutationObserver(() => setTimeout(initGameIfNeeded, 50));
    mo.observe(app, { childList: true, subtree: true });
  }
  window.addEventListener("hashchange", () => setTimeout(initGameIfNeeded, 80));
  setInterval(initGameIfNeeded, 1200);
}

// Round75: make the island feel more like a game map, not a static 3D decoration.
// The base scene above remains intact; this layer expands buildings, gives each
// building unique tasks, and adds a keyboard/mouse-friendly building dock.
buildings.push(
  {
    id: "modeltower",
    name: "模型塔",
    role: "管理自己的大模型接口、Mock 模式和审查服务",
    route: "settings",
    color: 0xb9d3ff,
    roof: 0x5373a5,
    pos: [-8.2, 0, 3.8],
    points: 65,
    tasks: ["检查 API 是否已配置", "切换 Mock/真实模型", "查看输出审查规则"],
  },
  {
    id: "dock",
    name: "服务器码头",
    role: "HPC dry-run、SLURM 脚本和批量任务记录",
    route: "method-runner",
    color: 0x83b8a6,
    roof: 0x466c63,
    pos: [8.2, 0, -0.6],
    points: 72,
    tasks: ["生成一个 dry-run 任务", "查看费用估算", "导出脚本模板"],
  },
  {
    id: "ethics",
    name: "伦理花园",
    role: "隐私、虚假引用、临床误导和学术诚信审查",
    route: "skills",
    color: 0xf0c7d6,
    roof: 0x9b6275,
    pos: [-0.2, 0, -8.4],
    points: 58,
    tasks: ["检查一段 AI 输出", "查看红队样例", "生成教师复核清单"],
  },
  {
    id: "manuscript",
    name: "写作屋",
    role: "Meta 分析、综述、病例报告和基金申请全流程",
    route: "method-runner",
    color: 0xf2d385,
    roof: 0xa2703d,
    pos: [8.0, 0, 5.6],
    points: 66,
    tasks: ["选择文章类型", "搭建写作流程", "生成材料清单"],
  },
  {
    id: "stats",
    name: "统计站",
    role: "样本量、差异检验、回归模型和可视化检查",
    route: "research",
    color: 0xb8c4df,
    roof: 0x5d668a,
    pos: [-7.6, 0, 7.0],
    points: 62,
    tasks: ["选择统计问题", "检查数据格式", "生成分析路径"],
  },
  {
    id: "singlecell",
    name: "单细胞温室",
    role: "单细胞基础分析、扰动分析和虚拟敲除入口",
    route: "research",
    color: 0xa8d9a7,
    roof: 0x4f8f54,
    pos: [1.4, 0, 8.6],
    points: 90,
    tasks: ["进入扰动分析", "比较 GEARS/scGen/CPA", "生成 QC 学习路径"],
  },
  {
    id: "spatial",
    name: "空间组学桥",
    role: "空间转录组、邻域分析和组织结构解释",
    route: "research",
    color: 0xa5d8e6,
    roof: 0x4e8190,
    pos: [-5.2, 0, -8.2],
    points: 74,
    tasks: ["查看空间组学流程", "选择示例图", "生成新手路径"],
  },
  {
    id: "shop",
    name: "积分商店",
    role: "用学习积分兑换建筑、装饰、皮肤和徽章",
    route: "community",
    color: 0xf0b37a,
    roof: 0xb25f37,
    pos: [5.8, 0, -8.0],
    points: 36,
    tasks: ["兑换装饰", "查看徽章", "看高赞小岛"],
  }
);

shopItems.push(
  ["星光路灯", 90],
  ["显微镜雕塑", 180],
  ["论文邮箱", 130],
  ["小岛公告牌", 110],
  ["RAG 数据树", 240],
  ["单细胞温室皮肤", 360]
);

function taskList(item) {
  const tasks = item.tasks || [
    `打开「${item.name}」对应功能`,
    "把这个建筑设为常用入口",
    "生成一个给科研新手的任务清单",
  ];
  return tasks.map((task) => `<button class="secondary" data-r74-task="${esc(task)}">${esc(task)}</button>`).join("");
}

function selectBuilding(item, message = "") {
  if (!item) return;
  movePlayerTo(item);
  setDialogV75(item);
  updateHudV75(message || `已选择 ${item.name}：${item.role}`);
}

function setDialogV75(item) {
  const dialog = runtime.currentRoot?.querySelector(".r74-dialog");
  if (!dialog) return;
  dialog.innerHTML = `
    <div class="r74-dialog-kicker">当前建筑</div>
    <h3>${esc(item.name)}</h3>
    <p>${esc(item.role)}。先点一个任务试试；也可以把它设为常用建筑。正式账号系统上线后，你可以把自己制作的 Skill 绑定成建筑，公开给别人拜访、点赞和收藏。</p>
    <div class="r74-task-grid">${taskList(item)}</div>
    <div class="r74-dialog-actions">
      <a href="#/${esc(item.route)}">进入功能页</a>
      <button class="secondary" data-r74-favorite="${esc(item.id)}">设为常用建筑 +${item.points}</button>
      <button class="secondary" data-r74-visit>申请拜访同学小岛</button>
    </div>
  `;
  dialog.querySelectorAll("[data-r74-task]").forEach((button) => {
    button.addEventListener("click", () => {
      runtime.points += 8;
      localStorage.setItem("medpath_game_points", String(runtime.points));
      updateHudV75(`任务已加入待办：「${button.dataset.r74Task}」。获得 8 积分。`);
    });
  });
  dialog.querySelector("[data-r74-favorite]")?.addEventListener("click", () => {
    runtime.points += item.points;
    localStorage.setItem("medpath_game_points", String(runtime.points));
    updateHudV75(`已把「${item.name}」设为常用建筑，获得 ${item.points} 积分。`);
  });
  dialog.querySelector("[data-r74-visit]")?.addEventListener("click", () => {
    runtime.visits += 1;
    localStorage.setItem("medpath_game_visits", String(runtime.visits));
    updateHudV75("已生成拜访请求：后续会接入真实同学小岛、留言和点赞。");
  });
}

function buildingDock() {
  return buildings
    .map((item) => `<button data-r74-building="${esc(item.id)}"><span>${esc(item.name)}</span><small>${esc(item.role)}</small></button>`)
    .join("");
}

function htmlShellV75() {
  return `
    <div class="r74-game-shell">
      <div class="r74-hud">
        <div>
          <span class="r74-chip">Research Island 3D</span>
          <span class="r74-chip" data-r74-score>${runtime.points} 积分</span>
          <span class="r74-chip" data-r74-visits>${runtime.visits} 次拜访</span>
        </div>
        <div>
          <button class="r74-action dark" data-r74-reset>回到广场</button>
          <button class="r74-action" data-r74-shop>建筑商店</button>
        </div>
      </div>
      <div class="r74-game-note" data-r74-note>点建筑，或从左侧建筑面板选择；角色会走过去并弹出任务。</div>
      <div class="r74-tooltip"></div>
      <div class="r74-side-panel">
        <div class="r74-panel-card r74-building-panel">
          <h4>我的科研建筑</h4>
          <p>每栋建筑都是一个功能入口。先做成可玩 MVP，后续接入账号后可以拖拽摆放和公开拜访。</p>
          <div class="r74-building-dock">${buildingDock()}</div>
        </div>
        <div class="r74-panel-card">
          <h4>建筑商店</h4>
          <p>完成任务得积分，积分可换建筑、装饰和徽章。当前兑换为本地原型反馈。</p>
          <div class="r74-shop">
            ${shopItems.map(([name, price]) => `<button data-r74-buy="${esc(name)}" data-price="${price}">${esc(name)}<br>${price}</button>`).join("")}
          </div>
        </div>
      </div>
      <div class="r74-dialog">
        <div class="r74-dialog-kicker">欢迎</div>
        <h3>这是可以玩的科研小岛</h3>
        <p>它已经是 Three.js 低多边形 3D 场景：点建筑、选任务、得积分、进功能页。下一步会继续做拖拽摆放、好友拜访和真实作品绑定。</p>
        <div class="r74-dialog-actions">
          <button class="secondary" data-r74-random>随机参观一栋建筑</button>
          <a href="#/community">看排行榜</a>
        </div>
      </div>
    </div>
  `;
}

function updateHudV75(message) {
  const score = runtime.currentRoot?.querySelector("[data-r74-score]");
  const visits = runtime.currentRoot?.querySelector("[data-r74-visits]");
  const note = runtime.currentRoot?.querySelector("[data-r74-note]");
  if (score) score.textContent = `${runtime.points} 积分`;
  if (visits) visits.textContent = `${runtime.visits} 次拜访`;
  if (note && message) note.textContent = message;
}

function attachEventsV75(root) {
  runtime.renderer.domElement.addEventListener("click", (event) => {
    selectBuilding(findNearestBuildingFromEvent(event));
  });

  const tooltip = root.querySelector(".r74-tooltip");
  runtime.renderer.domElement.addEventListener("mousemove", (event) => {
    const item = findBuildingFromEvent(event);
    if (!tooltip) return;
    if (!item) {
      tooltip.style.display = "none";
      runtime.hovered = null;
      return;
    }
    runtime.hovered = item;
    tooltip.style.display = "block";
    tooltip.style.left = `${event.offsetX}px`;
    tooltip.style.top = `${event.offsetY - 14}px`;
    tooltip.textContent = `${item.name} · ${item.role}`;
  });

  root.querySelector("[data-r74-reset]")?.addEventListener("click", () => {
    runtime.playerTarget.set(0, 0, 0);
    updateHudV75("已回到广场。可以继续点建筑、选任务或查看商店。");
  });
  root.querySelector("[data-r74-random]")?.addEventListener("click", () => {
    const item = buildings[Math.floor(Math.random() * buildings.length)];
    selectBuilding(item, `随机拜访：${item.name}`);
  });
  root.querySelectorAll("[data-r74-building]").forEach((button) => {
    button.addEventListener("click", () => {
      selectBuilding(buildings.find((item) => item.id === button.dataset.r74Building));
    });
  });
  root.querySelector("[data-r74-shop]")?.addEventListener("click", () => {
    updateHudV75("建筑商店已打开：兑换后会先进入本地库存，后续版本支持摆放到岛上。");
  });
  root.querySelectorAll("[data-r74-buy]").forEach((button) => {
    button.addEventListener("click", () => {
      const price = Number(button.dataset.price || 0);
      const name = button.dataset.r74Buy;
      if (runtime.points < price) {
        updateHudV75(`积分还不够兑换「${name}」。先完成 Skill 或案例任务吧。`);
        return;
      }
      runtime.points -= price;
      localStorage.setItem("medpath_game_points", String(runtime.points));
      updateHudV75(`已兑换「${name}」。后续版本会允许你把它摆到小岛上。`);
    });
  });
  window.addEventListener("resize", resize, { passive: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observe);
} else {
  observe();
}

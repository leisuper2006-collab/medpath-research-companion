const API = window.MEDPATH_API_BASE || "http://127.0.0.1:8000";
const STATIC_MODE = Boolean(window.MEDPATH_STATIC_MODE);
const STATIC_DATA_BASE = window.MEDPATH_STATIC_DATA_BASE || "static-data";
const APP_SCRIPT_BASE = (() => {
  const scriptSrc = document.currentScript && document.currentScript.src;
  if (!scriptSrc) return window.location.origin + "/";
  try {
    return new URL("..", scriptSrc).toString().replace(/\/?$/, "/");
  } catch {
    return window.location.origin + "/";
  }
})();
const SAFETY = "医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置，所有结果须经教师或专家复核。";

const state = {
  plugins: [],
  skills: [],
  cases: [],
  comparisons: [],
  providers: [],
  modelGatewayTemplates: { providers: [], task_types: [], safety_boundary: "" },
  methods: [],
  methodGuides: [],
  methodUniverse: [],
  genePerturbationMethods: [],
  articleWorkflows: [],
  plotGallery: [],
  plotDemoGallery: [],
  dataAuditRules: [],
  islandBuildings: [],
  petDialogues: [],
  openSource: [],
  publicSources: [],
  publicSourceVisuals: [],
  pluginEnabled: {},
  activeCompare: "pbl-case",
};

const motionRuntime = {
  cleanups: [],
  observer: null,
};

const routeGroups = [
  {
    title: "开始",
    items: [
      ["/", "平台首页", "总览与任务入口"],
      ["/researcher", "科研新手导航", "按问题找方法"],
      ["/journey-builder", "研究路径生成器", "一句话搭流程"],
      ["/method-universe", "方法宇宙", "650+方法卡"],
      ["/method-family/gene-perturbation", "基因敲除家族", "24种扰动路线"],
      ["/article-workshop", "文章工坊", "28类文章流程"],
      ["/method-runner/virtual-perturbation", "方法理解器", "输入-流程-输出"],
      ["/mobile-app", "手机端App", "随身科研路线"],
    ],
  },
  {
    title: "教学与训练",
    items: [
      ["/teacher", "教师工作台", "课程/PBL/评价"],
      ["/student", "学生训练台", "报告反馈"],
      ["/simulate", "模拟案例实验室", "合成案例"],
    ],
  },
  {
    title: "插件与工具",
    items: [
      ["/plugins", "插件中心", "三类能力插件"],
      ["/open-source", "开源工具库", "GitHub工具导航"],
      ["/source-library", "证据来源库", "公开示例与图源"],
      ["/plot-studio", "科研绘图室", "图形选择与导出"],
      ["/plot-gallery", "图谱宇宙", "100种科研图"],
      ["/data-audit", "数据审查室", "先审数据再分析"],
      ["/skill-builder", "Skill共创工坊", "生成Skill草稿"],
    ],
  },
  {
    title: "运行与治理",
    items: [
      ["/compare", "对照实验室", "三组对照"],
      ["/evidence", "证据画廊", "待实测证据链"],
      ["/runtime", "运行环境", "本地/服务器说明"],
      ["/providers", "模型网关", "Provider配置"],
      ["/model-gateway", "API规范化", "请求包与审查"],
      ["/governance", "伦理审计", "风险与复核"],
      ["/island", "科研小岛", "交互式学习地图"],
      ["/island-3d", "3D科研小岛", "任务岛屿原型"],
      ["/settings", "设置", "安全边界"],
    ],
  },
];

function el(id) {
  return document.getElementById(id);
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

function pathLastSegment(pathname) {
  const raw = String(pathname || "")
    .split("/")
    .filter(Boolean)
    .pop() || "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function routePath(prefix, id) {
  return `${prefix}/${encodeURIComponent(String(id ?? ""))}`;
}

function currentRoutePath() {
  if (STATIC_MODE) {
    const hashPath = String(location.hash || "").replace(/^#/, "");
    if (hashPath && hashPath.startsWith("/")) return hashPath;
  }
  return location.pathname || "/";
}

function appScriptBase() {
  return APP_SCRIPT_BASE;
}

function assetUrl(url) {
  const raw = String(url || "");
  if (!raw) return "";
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  const clean = raw.replace(/^\/+/, "");
  const base = window.MEDPATH_ASSET_BASE || (STATIC_MODE ? appScriptBase() : `${API}/`);
  return `${String(base).replace(/\/?$/, "/")}${clean}`;
}

async function api(path, options = {}) {
  if (STATIC_MODE) return staticApi(path, options);
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function staticJson(file) {
  const res = await fetch(`${STATIC_DATA_BASE}/${file}`);
  if (!res.ok) throw new Error(`static data missing: ${file}`);
  return res.json();
}

async function staticApi(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const cleanPath = path.split("?")[0];
  if (method === "GET") {
    const getMap = {
      "/api/plugins": "plugins.json",
      "/api/skills": "skills.json",
      "/api/simulate/cases": "synthetic_cases.json",
      "/api/compare/demos": "comparison_demos.json",
      "/api/providers": "providers.json",
      "/api/model-gateway/templates": "model_gateway_templates.json",
      "/api/methods": "method_cards.json",
      "/api/open-source": "open_source_catalog.json",
      "/api/public-example-sources": "public_example_sources.json",
      "/api/public-source-visuals": "public_source_visual_examples.json",
      "/api/method-guides": "method_learning_guides.json",
      "/api/method-universe": "method_universe.json",
      "/api/gene-perturbation-methods": "gene_perturbation_methods.json",
      "/api/article-workflows": "article_skill_workflows.json",
      "/api/plot-gallery": "plot_gallery_taxonomy.json",
      "/api/data-audit-rules": "data_audit_rules.json",
      "/api/island/buildings": "research_island_buildings.json",
      "/api/pet/dialogues": "pet_dialogues.json",
    };
    if (cleanPath === "/api/plot-demo-gallery") return staticPlotDemoGallery();
    if (getMap[cleanPath]) return staticJson(getMap[cleanPath]);
    if (cleanPath.startsWith("/api/open-source/")) return staticRequireItem("open_source_catalog.json", pathLastSegment(cleanPath), "tool");
    if (cleanPath.startsWith("/api/method-universe/")) return staticRequireItem("method_universe.json", pathLastSegment(cleanPath), "method");
    if (cleanPath.startsWith("/api/article-workflows/")) return staticRequireItem("article_skill_workflows.json", pathLastSegment(cleanPath), "article");
    if (cleanPath.startsWith("/api/simulate/cases/")) return staticRequireItem("synthetic_cases.json", pathLastSegment(cleanPath), "case");
    if (cleanPath === "/api/health") return { status: "ok", mode: "static-demo" };
  }
  if (cleanPath === "/api/providers/test") return { provider_id: body.provider_id || "local_mock", configured: false, mode: "mock", message: "静态发布版不读取密钥，已使用mock连接测试。" };
  if (cleanPath === "/api/simulate/case") return staticSimulatedCase(body);
  if (cleanPath === "/api/governance/audit") return staticGovernanceAudit(body);
  if (cleanPath === "/api/data-audit/run") return staticDataAudit(body);
  if (cleanPath === "/api/plot/advice") return staticPlotAdvice(body);
  if (cleanPath === "/api/plot/generate") return staticPlotGenerate(body);
  if (cleanPath === "/api/article-workflows/build") return staticArticlePackage(body);
  if (cleanPath === "/api/skill-builder/generate") return staticSkillBuilder(body);
  if (cleanPath === "/api/model-gateway/normalize") return staticModelGateway(body, false);
  if (cleanPath === "/api/model-gateway/mock-generate") return staticModelGateway(body, true);
  throw new Error(`static API not implemented: ${path}`);
}

async function staticRequireItem(file, id, label) {
  const items = await staticJson(file);
  const item = (items || []).find((x) => String(x.id) === String(id));
  if (!item) throw new Error(`static ${label} not found: ${id}`);
  return item;
}

function staticPlotDemoGallery() {
  const specs = [
    ["../public_reproducible_examples/brca_tcga_mutation_type_distribution.svg", "BRCA公开突变类型分布复现图", "cBioPortal公开API + R/ggplot2教学改绘", "公开乳腺癌队列中，常见基因的突变记录和突变类型如何分布。", "study_id, sample_list_id, entrez_gene_ids, mutation_type"],
    ["01_volcano_plot.svg", "火山图示例", "差异分析结果展示", "哪些基因或蛋白在两组之间变化显著。", "gene_id, log2FC, p_value, adjusted_p"],
    ["02_heatmap.svg", "表达热图示例", "样本与特征聚类展示", "样本之间是否存在表达模式分群。", "sample_id, feature_id, expression_value, group"],
    ["03_forest_plot.svg", "森林图示例", "Meta分析效应量展示", "多个研究的效应量是否方向一致。", "study_id, effect_size, lower_ci, upper_ci, weight"],
    ["04_umap_schematic.svg", "UMAP降维图示例", "单细胞/高维数据结构展示", "细胞或样本是否形成可解释群体结构。", "cell_id, embedding_1, embedding_2, cluster"],
    ["05_alluvial_alternative.svg", "流向图示例", "分组流向与路径变化展示", "样本、类型或阶段之间如何转移。", "source, target, count, group"],
    ["06_kaplan_meier_schematic.svg", "Kaplan-Meier示例", "生存曲线展示", "不同分组的生存曲线是否存在差异。", "time, status, group"],
  ];
  return specs.map(([file, title, method, question, input]) => ({
    title,
    method,
    question,
    input,
    url: file.includes("/") ? `/outputs/round11_plots/${file}`.replace("/round11_plots/../", "/") : `/outputs/round11_plots/${file}`,
    exists: true,
    source: file.includes("public_reproducible_examples") ? "cBioPortal public REST API; BRCA TCGA PanCancer Atlas" : "R/ggplot2 synthetic-data demo",
    status: file.includes("public_reproducible_examples") ? "public API teaching re-plot; not clinical result" : "synthetic teaching demo; not real study result",
    safety_boundary: SAFETY,
  }));
}

function staticSimulatedCase(body = {}) {
  const title = `${body.organ_system || "胃黏膜"}${body.disease_system || "病理"}合成教学案例`;
  return {
    id: `static-case-${Date.now()}`,
    title,
    difficulty: body.difficulty || "进阶",
    boundary: "合成教学案例，不是真实患者，不用于临床诊断。",
    synthetic_profile: "教学化、模糊化的合成背景，不含可识别个人信息。",
    microscopy: "围绕教学目标描述结构异常、细胞异型和证据链，不给真实诊断意见。",
    pbl_questions: ["材料中哪些证据支持你的判断？", "还需要哪些免疫组化或课程材料？", "哪些表述必须交给教师复核？"],
    report_prompt: "请写一段教学训练用病理报告草稿，重点说明镜下所见和不确定性。",
    teacher_review: ["确认案例为合成材料", "检查术语是否适合学生层次", "审查是否出现临床处置建议"],
    ethics: [SAFETY],
  };
}

function staticGovernanceAudit(body = {}) {
  const text = String(body.text || "");
  const risk_flags = [];
  if (/(身份证|手机号|住院号|病理号)/.test(text)) risk_flags.push("隐私风险");
  if (/(治疗方案|立即用药|临床诊断)/.test(text)) risk_flags.push("临床误导");
  if (/(虚假引用|不存在的DOI|编造文献)/.test(text)) risk_flags.push("伪造引用");
  if (!risk_flags.length) risk_flags.push("未发现高风险触发词，仍需人工复核");
  return { risk_flags, allowed_for_teaching: !risk_flags.includes("隐私风险"), human_review_required: true };
}

async function staticDataAudit(body = {}) {
  const rules = await staticJson("data_audit_rules.json");
  const text = `${body.description || ""} ${(body.columns || []).join(" ")}`;
  const hits = rules.filter((r) => text.includes(r.topic || r.rule_name || r.id || "")).slice(0, 6);
  const matched_rules = (hits.length ? hits : rules.slice(0, 6)).map((r) => ({
    ...r,
    topic: r.topic || r.rule_name || r.id || "audit-rule",
    level: r.level || r.applies_to || "data audit",
    check: r.check || r.check_logic_human || "检查字段、隐私、统计前提和来源边界。",
    how_to_fix: r.how_to_fix || r.fix_suggestion || "补充字段说明、来源证明、伦理边界和人工复核记录。",
  }));
  return { matched_rules, note: "静态发布版只做规则演示，不生成真实统计结果。", safety: SAFETY };
}

async function staticPlotSpec(plotIdOrType) {
  const plots = await staticJson("plot_gallery_taxonomy.json");
  const key = String(plotIdOrType || "").trim();
  return plots.find((p) => p.id === key || p.en_name === key || p.zh_name === key || p.id.replace(/_plot$/, "") === key) || plots.find((p) => p.id === "volcano_plot") || plots[0];
}

async function staticPlotAdvice(body = {}) {
  const plot = await staticPlotSpec(body.plot_id || body.plot_type);
  const columns = body.columns || [];
  const needed = (plot.plot_data_contract || []).filter((x) => x.field && x.required !== false && !String(x.field).endsWith("_optional")).map((x) => x.field);
  const missing_columns = needed.filter((x) => !columns.includes(x));
  const source = plot.public_source_example || {};
  const visual = plot.example_visual || {};
  return {
    plot_id: plot.id,
    plot_type: plot.id,
    plot_name: plot.zh_name || plot.en_name || plot.id,
    question_answered: plot.question_answered || plot.answers_question || "请先明确科研问题，再选择图形。",
    required_columns: needed,
    provided_columns: columns,
    missing_columns,
    audit_hits: [
      {
        topic: "字段完整性",
        level: missing_columns.length ? "warning" : "pass",
        severity: missing_columns.length ? "medium" : "notice",
        check: `本图至少需要：${needed.join("、") || "待补充字段契约"}。`,
        how_to_fix: missing_columns.length ? `先补齐：${missing_columns.join("、")}；如果数据本身不具备这些字段，应回到图谱库更换图形。` : "字段名称已覆盖示例契约；下一步仍需核对单位、分组、统计前提和缺失值处理。",
      },
      {
        topic: "来源边界",
        level: "notice",
        severity: "notice",
        check: source.title ? `当前示例绑定公开来源线索：${source.title}。` : "当前图谱尚未绑定公开来源线索。",
        how_to_fix: "正式论文或课题汇报应替换为自己的可审查数据，并保留source data、脚本和引用来源。",
      },
      {
        topic: "解释边界",
        level: "review",
        severity: "notice",
        check: plot.output_interpretation || "图形只能回答它被设计回答的问题。",
        how_to_fix: "不要把示例图、合成数据或教学改绘图写成真实研究结论。",
      },
    ],
    next_steps: [
      missing_columns.length ? "补齐缺失字段，或改选更匹配当前数据结构的图形。" : "检查字段单位、分组编码、缺失值和异常值处理记录。",
      "把公开来源线索、自己的数据来源、绘图脚本和人工复核意见放入同一份图表记录。",
      "将下方提示词复制到模型网关时，只让模型生成代码和检查建议，不让模型编造数据或结论。",
    ],
    model_prompt: plot.model_gateway_prompt_template || `请作为科研绘图教练，围绕${plot.zh_name || plot.id}检查我的字段、统计前提、R/ggplot2绘图步骤和导师复核清单；不得编造真实数据或论文结论。`,
    source,
    example_visual: visual,
    r_ggplot_hint: plot.r_ggplot_hint || "",
    safety: SAFETY,
  };
}

async function staticPlotGenerate(body = {}) {
  const plot = await staticPlotSpec(body.plot_id || body.plot_type);
  const fields = (plot.plot_data_contract || []).map((x) => x.field).slice(0, 6);
  const safeTitle = escapeHtml(plot.zh_name || plot.en_name || plot.id);
  const safeCategory = escapeHtml(plot.category || "科研图谱");
  const fieldText = escapeHtml(fields.join(" · ") || "字段待补充");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="820" height="460" viewBox="0 0 820 460"><rect width="820" height="460" rx="28" fill="#fffaf0"/><rect x="34" y="34" width="752" height="392" rx="24" fill="#ffffff" stroke="#d7c7a6" stroke-width="2"/><text x="74" y="88" font-size="28" font-family="Arial, sans-serif" font-weight="700" fill="#182033">${safeTitle}</text><text x="74" y="122" font-size="15" font-family="Arial, sans-serif" fill="#667085">${safeCategory} · synthetic teaching schematic</text><line x1="104" y1="340" x2="714" y2="340" stroke="#344054" stroke-width="2"/><line x1="104" y1="340" x2="104" y2="150" stroke="#344054" stroke-width="2"/><path d="M130 302 C210 250, 244 286, 306 230 S430 170, 506 212 S634 182, 690 132" fill="none" stroke="#0f766e" stroke-width="5" stroke-linecap="round"/><circle cx="166" cy="283" r="10" fill="#2563eb"/><circle cx="306" cy="230" r="10" fill="#0f766e"/><circle cx="506" cy="212" r="10" fill="#f59e0b"/><circle cx="690" cy="132" r="10" fill="#ef4444"/><rect x="126" y="372" width="568" height="30" rx="15" fill="#f2f4f7"/><text x="410" y="393" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#475467">required fields: ${fieldText}</text><text x="410" y="438" text-anchor="middle" font-size="13" font-family="Arial, sans-serif" fill="#7a5f2b">示意/合成教学图：正式出图必须替换为用户自己的可审查数据</text></svg>`;
  return {
    plot_id: plot.id,
    plot_type: plot.zh_name || plot.id,
    svg,
    caption: `${plot.zh_name || plot.id} 的静态教学SVG示意，不代表真实研究结果；页面上方的示例图为本地教学改绘或合成演示。`,
    methods_text: plot.r_ggplot_hint || "真实作图需使用用户自己的数据、脚本和人工复核。",
  };
}

async function staticArticlePackage(body = {}) {
  const workflows = await staticJson("article_skill_workflows.json");
  const workflow = workflows.find((x) => x.id === (body.workflow_id || "article-01")) || workflows[0];
  return { status: "draft-workflow-package", article_type: workflow.type, topic: body.topic || "待填写研究主题", note: "静态发布版用于从0搭建写作流程；不会生成或伪造真实研究结果。", materials: workflow.required_materials || [], steps: workflow.zero_to_one_path || [], skills_to_call: workflow.skills_to_call || [], quality_checks: workflow.quality_checks || [], model_prompt: "请生成研究问题、材料清单、方法流程、图表计划和人工复核清单；不得编造结果或引用。", human_review_required: true, safety: SAFETY };
}

function staticSkillBuilder(body = {}) {
  const slug = String(body.name || "custom-skill").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "custom-skill";
  const skill_md = `---\nname: ${slug}\ndescription: ${body.task || "教学科研训练任务"}\n---\n\n# ${body.zh_name || "自定义Skill"}\n\n## 安全边界\n${body.risk_boundary || SAFETY}\n`;
  return { skill_md, plugin_json: { id: slug, zh_name: body.zh_name || "自定义Skill", status: "static-preview", safety: body.risk_boundary || SAFETY }, eval_yaml: "rubric:\n  - 任务边界\n  - 输出质量\n  - 安全边界\n", readme: "# 静态发布版Skill预览\n", downloads: {} };
}

async function staticModelGateway(body = {}, generate = false) {
  const templates = await staticJson("model_gateway_templates.json");
  const provider = (templates.providers || []).find((p) => p.id === body.provider_id) || (templates.providers || []).slice(-1)[0] || { id: "local_mock", name: "Local Mock" };
  const task = (templates.task_types || []).find((t) => t.id === body.task_type) || (templates.task_types || [])[0] || { id: "case_generation", zh_name: "案例生成", recommended_skills: [], output_schema: [], review_focus: [] };
  const normalized = { provider_id: provider.id, provider_name: provider.name, mode: "mock", task_type: task.id, task_name: task.zh_name, api_key_visible: false, request: { model: "static-mock", messages: [{ role: "system", content: SAFETY }, { role: "user", content: body.prompt || "请生成任务包。" }], response_format: body.output_format || "json", metadata: { audience: body.audience || "科研新手", recommended_skills: task.recommended_skills || [], output_schema: task.output_schema || [], review_focus: task.review_focus || [] } }, safety_checklist: ["不上传真实患者隐私", "不把模型输出当作临床诊断", "静态发布版不读取API Key"] };
  if (!generate) return normalized;
  return { status: "mock-output", provider_id: provider.id, mode: "mock", task_name: task.zh_name, result: { summary: `静态发布版已生成“${task.zh_name}”演示任务包。`, workflow: task.recommended_skills || [], output_schema: task.output_schema || [], review_focus: task.review_focus || [], teacher_review_required: true, note: "未调用真实模型，不代表真实研究结果。" }, normalized_request: normalized, safety: SAFETY };
}

function navigate(path) {
  const target = String(path || "/");
  history.pushState({}, "", STATIC_MODE ? `#${target.startsWith("/") ? target : `/${target}`}` : target);
  document.body.classList.add("route-turning");
  window.scrollTo(0, 0);
  render();
}

function badge(text, tone = "green") {
  return `<span class="badge ${tone}">${escapeHtml(text)}</span>`;
}

function sectionTitle(kicker, title, note = "") {
  return `<div class="section-title"><span>${kicker}</span><h2>${title}</h2>${note ? `<p>${note}</p>` : ""}</div>`;
}

function productNav(items = []) {
  return `<nav class="product-anchor-nav" aria-label="本页快速导航">
    ${items.map(([href, label, note]) => `<a href="${href}"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(note || "")}</small></a>`).join("")}
  </nav>`;
}

function premiumFigureRail(items = []) {
  return `<div class="premium-figure-rail">
    ${items.filter(Boolean).map((item) => {
      const src = item.url ? assetUrl(item.url) : "";
      return `<article>
        <div class="premium-figure-frame">${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.title || "科研示例图")}" loading="lazy" />` : `<div class="figure-empty">待绑定示例图</div>`}</div>
        <div><h3>${escapeHtml(item.title || "教学示例图")}</h3><p>${escapeHtml(item.source_note || item.reuse_boundary || "示例图用于教学理解，不代表真实研究结果。")}</p></div>
      </article>`;
    }).join("")}
  </div>`;
}

function learningProductRail(items = []) {
  return `<div class="learning-rail">
    ${items.map((item, index) => {
      const title = typeof item === "string" ? `第${index + 1}步` : (item.stage || item.title || `第${index + 1}步`);
      const body = typeof item === "string" ? item : (item.task || item.body || "");
      const check = typeof item === "string" ? "" : (item.checkpoint || item.note || "");
      return `<article><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p>${check ? `<small>${escapeHtml(check)}</small>` : ""}</article>`;
    }).join("")}
  </div>`;
}

function productProofStrip(items = []) {
  return `<div class="product-proof-strip">
    ${items.map(([label, value, note]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note || "")}</small></div>`).join("")}
  </div>`;
}

function storyChapterDeck(panels = [], context = {}) {
  const safePanels = (panels || []).filter(Boolean);
  if (!safePanels.length) {
    safePanels.push(
      { title: "先判断问题", body: context.question || "先把研究问题、材料来源和预期输出写清楚，再决定是否进入这个方法。" },
      { title: "再检查材料", body: context.inputs || "核对样本、字段、分组、伦理来源和缺失项，避免把不完整数据送入流程。" },
      { title: "最后复核结论", body: context.review || "所有图表和文字输出都需要回到原始来源、导师意见和方法边界中复核。" },
    );
  }
  return safePanels.map((s, i) => {
    const title = s.title || s.stage || `第${i + 1}步`;
    const body = s.body || s.task || s.description || "";
    const action = s.action || s.checkpoint || s.takeaway || "";
    const pitfall = s.pitfall || s.warning || "";
    return `<article class="story-chapter">
      <span class="story-index">${String(i + 1).padStart(2, "0")}</span>
      <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(body)}</p>
        ${action ? `<p class="story-action"><strong>你现在要做：</strong>${escapeHtml(action)}</p>` : ""}
        ${pitfall ? `<p class="story-pitfall"><strong>常见误区：</strong>${escapeHtml(pitfall)}</p>` : ""}
      </div>
    </article>`;
  }).join("");
}

function productFeatureStory({
  label = "学习路径",
  title = "把方法拆成可复核步骤",
  subtitle = "",
  visual = {},
  source = {},
  panels = [],
  proofItems = [],
  promptExamples = [],
  className = "",
  anchor = "",
  context = {},
} = {}) {
  const src = visual.url ? assetUrl(visual.url) : assetUrl("/outputs/round11_plots/01_volcano_plot.svg");
  const sourceTitle = source.title || visual.source_title || "公开来源线索待核对";
  const sourcePlatform = source.source_platform || visual.source_platform || "公开数据/教学示例";
  const sourceUrl = source.url || "#";
  const visualTitle = visual.title || title || "科研示例图";
  const visualBoundary = visual.reuse_boundary || visual.source_note || "示例图用于教学演示与方法理解，不代表本站生成的真实研究结论。";
  const inputBrief = context.inputs || "先核对样本、字段、分组、来源和缺失项。";
  const outputBrief = context.output || "只把输出作为学习线索，正式结论必须回到原始数据和人工复核。";
  const reviewBrief = context.review || "所有图表、草稿和模型输出均需教师、导师或专家复核。";
  const clinicalBoundary = "涉及医学AI输出时，仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。";
  const proof = proofItems.length ? proofItems : [
    ["适合谁", context.audience || "科研新手与课程团队", "先确认学习对象和任务边界"],
    ["看什么", context.output || "示例图、字段、流程", "用公开来源理解输出形态"],
    ["谁复核", "教师/导师", "不把AI输出直接当结论"],
  ];
  return `<section class="section product-feature-story ${escapeHtml(className)}" ${anchor ? `id="${escapeHtml(anchor)}"` : ""}>
    <aside class="story-sticky-visual">
      <div class="story-visual-frame">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || title || "科研示例图")}" />
      </div>
      <div class="story-visual-caption">
        <span>${escapeHtml(label)}</span>
        <h2>${escapeHtml(visual.title || title)}</h2>
        <p>${escapeHtml(visual.reuse_boundary || visual.source_note || "示例图用于教学演示与方法理解，不代表本站生成的真实研究结论。")}</p>
      </div>
      <div class="story-source-mini">
        <strong>${escapeHtml(sourceTitle)}</strong>
        <span>${escapeHtml(sourcePlatform)}</span>
        <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">打开来源线索</a>
      </div>
    </aside>
    <div class="story-chapter-stack">
      <div class="story-lead">
        <span>${escapeHtml(label)}</span>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(subtitle || "按“问题、材料、执行、复核”的顺序阅读；每一步都保留数据、引用和人工审核边界。")}</p>
        ${productProofStrip(proof)}
        <div class="story-evidence-lens">
          <article>
            <strong>示例图看什么</strong>
            <p>${escapeHtml(visualTitle)}：先看图形回答的问题，再看字段、阈值和图注，不把漂亮图当成结论。</p>
          </article>
          <article>
            <strong>来源从哪里来</strong>
            <p>${escapeHtml(sourceTitle)}；来源类型为${escapeHtml(sourcePlatform)}。正式使用前仍需回到原始数据库、论文或仓库核对。</p>
          </article>
          <article>
            <strong>接入自己的材料</strong>
            <p>${escapeHtml(inputBrief)} 新手应先补齐最小输入，再决定是否调用模型、脚本或绘图流程。</p>
          </article>
          <article>
            <strong>输出如何复核</strong>
            <p>${escapeHtml(outputBrief)} ${escapeHtml(reviewBrief)} ${escapeHtml(visualBoundary)} ${escapeHtml(clinicalBoundary)}</p>
          </article>
        </div>
      </div>
      ${storyChapterDeck(panels, context)}
      ${promptExamples.length ? `<div class="story-demand-prompt"><h3>可以这样描述你的需求</h3><div>${promptExamples.slice(0, 4).map((x) => `<button class="starter wide" onclick="const box=document.querySelector('textarea[id$=-demand], textarea#method-demand, textarea#journey-input'); if(box){box.value='${escapeHtml(String(x).replace(/'/g, "\\'"))}'; box.scrollIntoView({behavior:'smooth'});}">${escapeHtml(x)}</button>`).join("")}</div></div>` : ""}
    </div>
  </section>`;
}

function petContextKey(path = location.pathname) {
  if (path.includes("plot")) return "plot";
  if (path.includes("article")) return "article";
  if (path.includes("method")) return "method";
  if (path.includes("island")) return "island";
  if (path.includes("audit") || path.includes("governance")) return "audit";
  if (path.includes("open-source")) return "tool";
  if (path.includes("model-gateway")) return "model";
  return "home";
}

function petProfile(key) {
  const profiles = {
    home: {
      title: "科研小向导",
      place: "你在总控台。先说清楚想做什么，再决定去方法、绘图、文章还是审查。",
      next: ["写一句研究需求", "选择一个入口", "生成可复核任务包"],
      prepare: "课题方向、已有数据类型、你希望产出的材料。",
      avoid: "不要一上来就让模型写结论；先把输入、来源和复核人写清楚。",
      links: [["/journey-builder", "生成路线"], ["/method-universe", "找方法"], ["/island-3d", "去小岛"]],
    },
    method: {
      title: "方法导师",
      place: "你在方法页。这里要判断某个方法是否真的适合你的问题。",
      next: ["确认研究问题", "检查输入字段", "选择图表和工具", "列导师复核问题"],
      prepare: "研究对象、分组、样本量、关键字段、已有实验或数据证据。",
      avoid: "不要因为方法名字热门就硬套；不满足输入条件时先去数据审查。",
      links: [["/method-family/gene-perturbation", "基因扰动"], ["/data-audit", "审字段"], ["/plot-gallery", "看图例"]],
    },
    plot: {
      title: "绘图导师",
      place: "你在图谱页。每张图都必须回答一个具体问题，而不是只追求好看。",
      next: ["确认图回答的问题", "核对必需字段", "用示例图学习读法", "生成R/ggplot2提示"],
      prepare: "数据列名、变量类型、分组、统计前提、图注边界。",
      avoid: "不要把示例图当实测结果；字段不齐时先审查再出图。",
      links: [["/plot-gallery", "图谱宇宙"], ["/plot-studio", "字段审查"], ["/data-audit", "数据体检"]],
    },
    article: {
      title: "文章导师",
      place: "你在文章工作坊。这里从0搭流程，不代写论文。",
      next: ["选择文章类型", "补齐材料包", "规划证据链和图表链", "生成模型API提示"],
      prepare: "研究问题、数据来源、目标文章类型、图表计划、引用核验材料。",
      avoid: "不要生成假p值、假审稿意见、假引用或不存在的数据结果。",
      links: [["/article-workshop", "文章流程"], ["/model-gateway", "API提示"], ["/governance", "伦理审查"]],
    },
    tool: {
      title: "工具导师",
      place: "你在开源工具库。先理解用途和许可证，再考虑运行。",
      next: ["核对原仓库", "读输入输出", "跑最小示例", "记录版本和参数"],
      prepare: "工具原链接、许可证、示例数据、运行环境、复核边界。",
      avoid: "不要复制未授权代码；不要把demo效果写成你自己的研究结果。",
      links: [["/open-source", "工具库"], ["/method-universe", "配方法"], ["/runtime", "看环境"]],
    },
    audit: {
      title: "审查导师",
      place: "你在风险与数据审查页。这里先拦截隐私、临床误导、假引用和字段风险。",
      next: ["粘贴字段或文本", "运行规则审查", "修复高风险项", "生成复核清单"],
      prepare: "字段名、材料来源、是否含隐私、用途说明、教师/导师复核人。",
      avoid: "不要上传真实患者隐私；不要让AI输出未经审核的医学建议。",
      links: [["/data-audit", "审数据"], ["/governance", "审伦理"], ["/model-gateway", "审API"]],
    },
    island: {
      title: "小岛向导",
      place: "你在3D科研小岛。每栋建筑都是一个真实科研动作入口。",
      next: ["点击建筑", "阅读任务", "进入功能页", "保存复核证据"],
      prepare: "想完成的科研动作，比如找方法、画图、写文章或审查数据。",
      avoid: "游戏化只是导航层，正式材料仍要回到方法、图表和审查页面。",
      links: [["/island-3d", "探索小岛"], ["/journey-builder", "生成路线"], ["/teacher", "教学任务"]],
    },
    model: {
      title: "模型接口导师",
      place: "你在模型网关。这里把需求变成规范请求，不保存真实密钥。",
      next: ["选择任务类型", "写清输入和输出格式", "加入安全规则", "再调用自己的API"],
      prepare: "Provider、模型名、任务类型、输出schema、禁止伪造声明。",
      avoid: "不要把API Key写进页面、日志、代码或截图。",
      links: [["/model-gateway", "规范请求"], ["/data-audit", "审输入"], ["/governance", "审输出"]],
    },
  };
  return profiles[key] || profiles.home;
}

function petBubble() {
  const key = petContextKey();
  const profile = petProfile(key);
  const candidates = state.petDialogues.filter((x) => x.context === key || x.context === "home");
  const picked = candidates[Math.abs(location.pathname.length + key.length) % Math.max(candidates.length, 1)] || { text: profile.place };
  const islandClass = key === "island" ? " island-pet" : "";
  return `<aside class="pet-bubble${islandClass}" title="科研新手提示">
    <button class="pet-shell" type="button" data-pet-toggle aria-expanded="false">
      <span class="pet-face">研</span>
      <span><strong>${escapeHtml(profile.title)}</strong><small>${escapeHtml(picked.text)}</small></span>
    </button>
    <nav class="pet-actions" aria-label="科研小向导快捷入口">
      ${profile.links.map(([href, label]) => `<a href="${href}" data-link>${escapeHtml(label)}</a>`).join("")}
    </nav>
    <section class="pet-mentor-panel" aria-label="科研小向导展开面板">
      <button class="pet-close" type="button" data-pet-close>收起</button>
      <h3>${escapeHtml(profile.title)}：这一页怎么用</h3>
      <p>${escapeHtml(profile.place)}</p>
      <div class="pet-panel-grid">
        <article><span>下一步</span>${list(profile.next)}</article>
        <article><span>先准备</span><p>${escapeHtml(profile.prepare)}</p></article>
        <article><span>先避坑</span><p>${escapeHtml(profile.avoid)}</p></article>
      </div>
      <label for="pet-demand-input">把你的真实需求写在这里</label>
      <textarea id="pet-demand-input" placeholder="例如：我想做基因敲除后验证胃癌细胞迁移变化，但不知道该选什么方法、画什么图、写什么文章。"></textarea>
      <button class="btn" id="pet-plan-button" type="button" data-pet-plan="${escapeHtml(key)}">整理成新手任务包</button>
      <div id="pet-plan-result" class="pet-plan-result">写下需求后，我会按当前页面给你拆成入口、材料、风险和复核步骤。</div>
    </section>
  </aside>`;
}

function list(items = [], cls = "") {
  const rows = Array.isArray(items)
    ? items
    : String(items || "")
        .split(/[；;。.\n]/)
        .map((x) => x.trim())
        .filter(Boolean);
  return `<ul class="${cls}">${rows.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
}

function routeLinks() {
  const active = currentRoutePath();
  return routeGroups
    .map(
      (group) => `<div class="nav-group">
        <div class="nav-title">${group.title}</div>
        ${group.items
          .map(([href, label, desc]) => `<a href="${href}" data-link class="nav-item ${active === href || (href !== "/" && active.startsWith(href)) ? "active" : ""}">
            <span>${label}</span><small>${desc}</small>
          </a>`)
          .join("")}
      </div>`
    )
    .join("");
}

function shell(content) {
  return `
    <div class="layout">
      <div class="scroll-progress" aria-hidden="true"></div>
      <aside class="sidebar">
        <a class="brand" href="/" data-link>
          <strong>MedPath Studio</strong>
          <small>基础医学与数智病理科研教育平台</small>
        </a>
        ${routeLinks()}
      </aside>
      <div class="workspace">
        <header class="topbar">
          <div class="command">
            <span class="dot"></span>
            <input id="global-search" placeholder="搜索：虚拟扰动、PBL案例、报告反馈、科研绘图、伦理审计..." />
          </div>
          <div class="top-actions">
            ${badge("本地原型", "blue")}
            ${badge("Mock模型可用", "green")}
            ${badge("不处理真实患者数据", "red")}
          </div>
        </header>
        <main class="page page-sheet">${content}</main>
        ${petBubble()}
        <nav class="mobile-dock">
          <a href="/" data-link>首页</a>
          <a href="/method-universe" data-link>方法</a>
          <a href="/article-workshop" data-link>文章</a>
          <a href="/plot-gallery" data-link>绘图</a>
          <a href="/data-audit" data-link>审查</a>
        </nav>
      </div>
    </div>`;
}

function bindLinks() {
  document.querySelectorAll("[data-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("/")) {
        e.preventDefault();
        navigate(href);
      }
    });
  });
}

function solveCard({ icon, title, solve, input, output, href, tone = "teal" }) {
  return `<article class="solve-card ${tone}">
    <div class="solve-icon">${icon}</div>
    <h3>${title}</h3>
    <p><strong>解决：</strong>${solve}</p>
    <p><strong>输入：</strong>${input}</p>
    <p><strong>输出：</strong>${output}</p>
    <button class="btn" onclick="navigate('${href}')">开始</button>
  </article>`;
}

function homeAtlasStage() {
  const nodes = [
    ["研究问题", "把一句模糊想法拆成可检验任务", "/researcher"],
    ["数据与材料", "样本、分组、字段、公开来源先过关", "/data-audit"],
    ["方法选择", "按用途推荐统计、组学、模型或实验路线", "/method-universe"],
    ["图表证据", "先看示例图，再决定字段和代码", "/plot-gallery"],
    ["文章流程", "从题型反推材料、图表和审稿风险", "/article-workshop"],
    ["复核审计", "教师、导师、伦理和引用核验留痕", "/governance"],
  ];
  return `<div class="home-atlas-stage" aria-label="科研任务转化画布">
    <div class="atlas-ribbon">MedPath task canvas</div>
    <svg class="atlas-lines" viewBox="0 0 760 360" role="img" aria-label="从研究问题到复核归档的路径">
      <path d="M95 180 C185 72 282 76 360 166 S536 285 662 148" />
      <path d="M112 230 C230 305 390 296 510 222 S626 116 706 212" />
      <path d="M176 96 C256 134 320 210 420 198 S590 110 662 92" />
    </svg>
    ${nodes.map((node, index) => `<button class="atlas-node node-${index + 1}" onclick="navigate('${node[2]}')">
      <strong>${escapeHtml(node[0])}</strong><span>${escapeHtml(node[1])}</span>
    </button>`).join("")}
    <div class="atlas-note">所有输出先进入“教学/科研训练”边界，再进入人工复核。</div>
  </div>`;
}

function homeCapabilityMap(items = []) {
  return `<div class="capability-map">
    ${items.map((item, index) => `<article class="capability-tile tone-${index % 4}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
      <small>${escapeHtml(item.check)}</small>
      <button class="btn ghost" onclick="navigate('${escapeHtml(item.href)}')">${escapeHtml(item.action)}</button>
    </article>`).join("")}
  </div>`;
}

function homeTriagePanel() {
  const rows = [
    ["我只有一个想法", "先进入科研新手导航，把问题转成研究目的、对象、材料和输出。", "/researcher"],
    ["我已经有数据表", "先去数据审查室，检查字段、分组、缺失值和伦理来源。", "/data-audit"],
    ["我想写一类文章", "进入文章工坊，按文章类型生成材料清单和图表计划。", "/article-workshop"],
    ["我想看图长什么样", "打开科研图谱宇宙，先看示例图、字段要求和R路线。", "/plot-gallery"],
  ];
  return `<div class="triage-panel">
    <h3>不知道点哪里时，从这里选</h3>
    ${rows.map(([title, body, href]) => `<button onclick="navigate('${href}')"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></button>`).join("")}
  </div>`;
}

function renderHomeQuickRoute(query) {
  const demand = String(query || "").trim() || "我想做基因敲除后肿瘤细胞状态变化分析，并写成一篇机制研究论文";
  const method = topByJourney(state.methodUniverse, demand, 1)[0] || state.methodUniverse[0] || {};
  const plot = topByJourney(state.plotGallery, demand, 1)[0] || state.plotGallery[0] || {};
  const article = topByJourney(state.articleWorkflows, demand, 1)[0] || state.articleWorkflows[0] || {};
  const tool = topByJourney(state.openSource, demand, 1)[0] || state.openSource[0] || {};
  const audit = topByJourney(state.dataAuditRules, demand, 1)[0] || state.dataAuditRules[0] || {};
  const routeCards = [
    {
      step: "01",
      title: "先把问题拆清楚",
      body: "确认研究对象、比较关系、变量类型、材料来源和人工复核责任，不急着选工具。",
      href: "/researcher",
      cta: "去问题分诊",
    },
    {
      step: "02",
      title: method.name || "推荐方法",
      body: method.beginner_question || method.what_it_solves || "查看适用场景、输入字段、输出结果和失败条件。",
      href: routePath("/method-universe", method.id || "method-001"),
      cta: "看方法",
    },
    {
      step: "03",
      title: plot.zh_name || plot.name || "推荐示例图",
      body: plot.question_answered || plot.plot_product_title || "先看示例图回答什么问题，再决定数据字段是否足够。",
      href: routePath("/plot-gallery", plot.id || "volcano_plot"),
      cta: "看图形",
    },
    {
      step: "04",
      title: article.type || "文章流程",
      body: article.article_hero_subtitle || article.common_use || "把材料清单、图表链、质量检查和写作边界连起来。",
      href: routePath("/article-workshop", article.id || "article-01"),
      cta: "搭文章",
    },
    {
      step: "05",
      title: tool.name || "开源工具",
      body: tool.short_description || tool.tool_product_title || "核对许可证、输入输出、最小示例和复现边界。",
      href: routePath("/open-source", tool.id || tool.name || "celltypist"),
      cta: "读工具",
    },
    {
      step: "06",
      title: audit.topic || "审查与复核",
      body: audit.check || audit.how_to_fix || "检查隐私、伪造引用、临床误导和教师复核要求。",
      href: "/governance",
      cta: "做审查",
    },
  ];
  const skills = [
    "research-copilot",
    demand.includes("图") || demand.toLowerCase().includes("rag") ? "medical-kg-rag-builder" : "skill-eval-harness",
    demand.includes("案例") || demand.includes("病理") ? "pathology-case-builder" : "teacher-skill-maker",
    "ai-ethics-governor",
  ];
  return `<div class="home-route-result-card">
    <div class="home-route-result-head">
      <span>路线预览</span>
      <strong>${escapeHtml(demand)}</strong>
      <p>${SAFETY} 这里生成的是学习与项目设计路线，不代表真实研究结论。</p>
    </div>
    <div class="home-route-steps">
      ${routeCards.map((card) => `<article>
        <span>${card.step}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.body)}</p>
        <button class="btn ghost" onclick="navigate('${card.href}')">${escapeHtml(card.cta)}</button>
      </article>`).join("")}
    </div>
    <div class="home-route-skill-chain">
      <strong>建议Skill链</strong>
      <p>${skills.map((x) => badge(x, "violet")).join("")}</p>
      <button class="btn" onclick="navigate('/journey-builder')">打开完整路线生成器</button>
    </div>
  </div>`;
}

function homeCommandDeck() {
  const starters = [
    "我想做CRISPR基因敲除后细胞状态变化分析，并生成可复核图表和机制文章路线",
    "我想从0开始做一个Meta分析，整理检索、纳入排除、森林图和PRISMA流程",
    "我有单细胞RNA测序数据，想做质控、注释、差异分析、轨迹和文章主图",
    "我想把病理教学案例做成PBL课堂、报告训练和伦理审查材料",
  ];
  return `<section class="home-command-deck" id="home-command">
    <div class="home-command-copy">
      <span class="product-kicker">Beginner Command Center</span>
      <h2>如果你不知道该点哪里，就先把需求写在这里。</h2>
      <p>平台会先给一条轻量路线：问题分诊、方法、示例图、文章流程、开源工具、伦理审查和Skill链。你可以把它当成科研小白的第一张导航卡。</p>
    </div>
    <div class="home-command-console">
      <label>我的科研或教学需求</label>
      <textarea id="home-demand">我想做基因敲除后肿瘤细胞状态变化分析，并写成一篇机制研究论文</textarea>
      <div class="choice-row">
        ${starters.map((item) => `<button class="chip" onclick="el('home-demand').value='${escapeHtml(item).replace(/'/g, "\\'")}'; el('home-route-result').innerHTML=renderHomeQuickRoute(el('home-demand').value);">${escapeHtml(item.slice(0, 12))}</button>`).join("")}
      </div>
      <button class="btn" id="home-route-build">生成首页路线预览</button>
    </div>
    <div id="home-route-result">${renderHomeQuickRoute(starters[0])}</div>
  </section>`;
}

function dashboard() {
  const quick = [
    { icon: "课", title: "我要设计一节病理课", solve: "把知识点变成目标、活动、评价和复核清单", input: "课程主题、学生层次、教学目标", output: "课程设计草案与D10字段", href: "/teacher", tone: "teal" },
    { icon: "案", title: "我要生成PBL案例", solve: "生成合成教学案例和问题链", input: "病种、器官、难度、目标", output: "案例、PBL问题、教师复核表", href: "/simulate/new", tone: "blue" },
    { icon: "报", title: "我要批改报告草稿", solve: "发现结构、术语和证据链问题", input: "学生报告草稿", output: "教学反馈，不给临床结论", href: "/student", tone: "green" },
    { icon: "法", title: "我不知道该用什么科研方法", solve: "按研究问题推荐方法与工具", input: "研究目的和数据类型", output: "方法说明、误区、学习路径", href: "/researcher", tone: "violet" },
    { icon: "图", title: "我要做科研图", solve: "理解图形适合回答什么问题", input: "示例数据或用户表格", output: "SVG示例、方法说明、风险提示", href: "/plot-studio", tone: "amber" },
    { icon: "审", title: "我要审计AI输出", solve: "检查隐私、临床误导、伪造引用", input: "待审计文本", output: "风险标签与人工复核要求", href: "/governance", tone: "red" },
  ];
  const figureHighlights = [
    state.plotDemoGallery[0],
    state.plotDemoGallery[1],
    state.plotDemoGallery[2],
    state.plotDemoGallery[3],
  ].filter(Boolean);
  const homeSteps = [
    { stage: "研究入门", task: "先把研究问题写成一句话，平台会推荐方法、文章流程和图谱。", checkpoint: "不要先背工具名，先明确要比较、预测、解释还是验证。" },
    { stage: "方法选择", task: "进入方法宇宙或基因扰动家族，查看输入、输出、误区和导师复核问题。", checkpoint: "每个方法页都有独立示例图和学习路径。" },
    { stage: "数据审查", task: "把字段、分组和来源交给数据审查室，先判断数据是否能支撑该方法。", checkpoint: "字段不规范时先修数据，不让模型硬画图。" },
    { stage: "图谱生成", task: "在图谱宇宙选择合适图形，查看示例、字段要求和 R/ggplot2 路线。", checkpoint: "示例图是脚本生成的教学图，不冒充真实结果。" },
    { stage: "文章搭建", task: "按文章类型生成材料清单、图表计划、报告规范和模型网关提示。", checkpoint: "Meta分析、预测模型、数字病理论文等走不同流程。" },
    { stage: "复核提交", task: "最后进入伦理审计、教师复核和导出，保留模型调用与人工检查边界。", checkpoint: "医学AI输出只用于教学与科研训练。" },
  ];
  const capabilityCenters = [
    { title: "问题分诊室", body: "把“我想做一个方向”拆成研究对象、变量、比较关系和可交付证据。", check: "适合完全不知道从何开始的新手。", href: "/researcher", action: "描述我的需求" },
    { title: "方法宇宙", body: "按统计推断、组学分析、实验设计、机器学习、机制模拟等路线解释方法。", check: "每个方法都给输入、输出、误区和学习路径。", href: "/method-universe", action: "浏览方法族" },
    { title: "基因扰动家族", body: "把基因敲除、敲低、过表达、CRISPR筛选和虚拟扰动放在同一张决策图里。", check: "适合想比较不同实验或计算扰动方案。", href: "/gene-perturbation", action: "比较扰动方案" },
    { title: "科研图谱宇宙", body: "从字段要求出发选择热图、火山图、森林图、ROC、UMAP、桑基图等图形。", check: "先审数据，再画图，避免把错表交给模型硬画。", href: "/plot-gallery", action: "看示例图" },
    { title: "文章工坊", body: "为Meta分析、机器学习论文、数字病理论文、教改论文等生成从0到1流程。", check: "只搭流程和草稿，不伪造数据、结果或引用。", href: "/article-workshop", action: "选择文章类型" },
    { title: "开源工具导航", body: "把常见仓库解释成科研新手能理解的用途、输入、输出、学习路径和风险边界。", check: "适合想知道“这个仓库到底能干什么”。", href: "/open-source", action: "打开工具库" },
    { title: "伦理与复核中心", body: "检查隐私、临床误导、虚假引用、学术诚信和教师复核要求。", check: "所有医学AI输出都要过这道门。", href: "/governance", action: "审查输出" },
  ];
  return shell(`
    ${productNav([["#home-start", "从任务开始", "选择你现在最需要做的事"], ["#home-centers", "七个中心", "按真实科研动作组织入口"], ["#home-figures", "先看示例图", "理解方法跑出来长什么样"], ["#home-path", "完整学习路", "从问题到复核的步骤"], ["#home-platform", "平台逻辑", "知识资源到评价服务"]])}
    <section class="hero-grid">
      <div class="hero-main premium-home-hero" id="home-start">
        <div class="eyebrow">MedPath Research & Education Skills Studio</div>
        <h1>把科研新手的一句话，变成可复核的研究任务包</h1>
        <p>不用先背几百个方法名。你只要说明“我想比较什么、预测什么、解释什么、验证什么”，平台会把需求拆成方法路线、示例图、数据审查、文章流程、模型提示和人工复核清单。</p>
        ${productProofStrip([
          ["方法地图", `${state.methodUniverse.length || state.methods.length}+`, "按用途解释，不按术语吓人"],
          ["示例图谱", `${state.plotGallery.length}+`, "看懂图，再决定数据怎么整理"],
          ["文章流程", `${state.articleWorkflows.length}类`, "从问题、材料、图表到复核"],
          ["开源工具", `${state.openSource.length}+`, "解释仓库能做什么和不能做什么"],
        ])}
        <div class="hero-actions">
          <button class="btn" onclick="navigate('/researcher')">按科研问题开始</button>
          <button class="btn ghost" onclick="navigate('/journey-builder')">生成完整研究路线</button>
          <button class="btn ghost" onclick="navigate('/plugins')">查看插件中心</button>
          <button class="btn ghost" onclick="navigate('/method-runner/virtual-perturbation')">理解虚拟扰动</button>
        </div>
        <div class="safety-strip">${SAFETY} 当前是本地可运行原型，未宣称D03/D10真实上线或真实课程试点完成。</div>
      </div>
      <aside class="hero-side">
        ${homeAtlasStage()}
        ${homeTriagePanel()}
      </aside>
    </section>
    ${homeCommandDeck()}
    <section class="section" id="home-centers">
      ${sectionTitle("七个中心", "每个入口都对应一个真实科研动作", "页面不再只是方法名目录，而是围绕新手最容易卡住的环节设计：找方向、选方法、查数据、看图、写文章、找工具、做审计。")}
      ${homeCapabilityMap(capabilityCenters)}
    </section>
    <section class="section" id="home-figures">
      ${sectionTitle("先看方法跑出来的图", "示例图不是装饰，而是帮助新手判断“这个方法会产生什么证据”", "这些图由脚本或合成教学数据生成，真实研究仍需接入用户自己的数据、API和人工复核。")}
      ${premiumFigureRail(figureHighlights)}
    </section>
    <section class="section" id="home-path">
      ${sectionTitle("从科研小白到可复核任务包", "六步学习路径", "每一步都有对应入口，避免在方法名、工具名和文章类型之间来回迷路。")}
      ${learningProductRail(homeSteps)}
    </section>
    <section class="section">${sectionTitle("按任务开始", "不要先背方法名，先选你要解决的问题", "每张卡都写清楚：解决什么、输入什么、输出什么。")}
      <div class="solve-grid">${quick.map(solveCard).join("")}</div>
    </section>
    <section class="section two-col" id="home-platform">
      <div class="panel">
        ${sectionTitle("平台逻辑", "知识资源 → 能力单元 → 评价服务")}
        <div class="flowline">
          <div><strong>知识资源</strong><span>教材、公开资料、合成案例、工具文档</span></div>
          <div><strong>AI Skills</strong><span>任务边界、流程、输出模板、安全规则</span></div>
          <div><strong>评价服务</strong><span>rubric、负样本、教师复核、D10字段</span></div>
        </div>
      </div>
      <div class="panel">
        ${sectionTitle("为什么现在看起来更像平台", "不是目录，而是可解释的科研任务链")}
        <p>插件中心负责“能力卡片”，方法理解器负责“教会新手看懂方法”，模拟实验室负责“生成可复核合成案例”，治理中心负责“把风险拦在教学使用之前”。</p>
      </div>
    </section>
  `);
}

function teacherPage() {
  return shell(`
    <div class="page-heading"><span>教师工作台</span><h1>把一个病理主题变成可上课、可评价、可复核的教学任务</h1><p>适合课程团队快速搭建PBL案例、章节目标、报告训练和D10评价字段。输出是教学草案，不替代教师判断。</p></div>
    <section class="two-col">
      <div class="form-panel">
        <h2>生成病理PBL案例</h2>
        <div class="form-grid">
          <div><label>课程名称</label><input id="teacher-course" value="病理学"/></div>
          <div><label>学生年级</label><input id="teacher-grade" value="本科三年级"/></div>
          <div><label>病种/系统</label><input id="teacher-disease" value="消化系统"/></div>
          <div><label>器官/材料</label><input id="teacher-organ" value="胃黏膜"/></div>
          <div><label>难度</label><select id="teacher-difficulty"><option>基础</option><option selected>进阶</option><option>挑战</option></select></div>
          <div><label>教学目标</label><input id="teacher-goal" value="生成一个胃腺癌PBL教学案例"/></div>
        </div>
        <div class="actions">
          <button class="btn" id="generate-pbl">生成病理 PBL 案例</button>
          <button class="btn ghost" onclick="downloadText('teacher-result.md', el('teacher-result').innerText)">导出 Markdown</button>
        </div>
      </div>
      <div class="guide-panel">
        <h2>这个功能解决什么</h2>
        <p>教师常见困难不是“没有材料”，而是材料难以转成目标、问题链、报告训练和复核标准。本功能把合成案例生成、PBL问题链、伦理审计和教师复核合成一个流程。</p>
        <div class="mini-steps"><span>主题</span><span>案例</span><span>PBL</span><span>报告训练</span><span>复核</span></div>
        <p class="soft-note">建议：生成后先看“教师复核清单”，再决定是否进入课堂。</p>
      </div>
    </section>
    <div id="teacher-result" class="result rich-result">点击按钮后会调用后端 mock API，显示案例、伦理审计和教师复核清单。</div>
  `);
}

function studentPage() {
  return shell(`
    <div class="page-heading"><span>学生训练台</span><h1>训练病理报告表达，而不是让AI替你下诊断</h1><p>适合学生把报告草稿交给平台做结构、术语和证据链反馈。所有反馈只用于学习，须由教师复核。</p></div>
    <section class="two-col">
      <div class="form-panel">
        <label>病理报告训练草稿</label>
        <textarea id="student-report">镜下见腺体结构异常，部分细胞核增大，考虑恶性肿瘤可能。</textarea>
        <div class="actions"><button class="btn" id="student-feedback">生成反馈</button></div>
      </div>
      <div class="guide-panel">
        <h2>新手该怎么看反馈</h2>
        <p><strong>结构反馈</strong>看你有没有写材料、所见、依据和不确定性；<strong>术语反馈</strong>看表达是否教学规范；<strong>证据链反馈</strong>看结论有没有形态学与免疫组化依据。</p>
        <p class="soft-note">平台不会给真实诊断意见，只会提示学习中该补充哪些证据。</p>
      </div>
    </section>
    <div id="student-result" class="result rich-result">等待生成结构反馈、术语反馈和证据链反馈。</div>
  `);
}

function researcherPage() {
  const tasks = [
    ["预测基因或药物扰动后细胞会怎样变化", "虚拟扰动", "/method-runner/virtual-perturbation", "表达矩阵、扰动标签、对照组", "预测变化、候选通路、验证提醒"],
    ["我有单细胞数据但不知道第一步做什么", "单细胞基础分析", "/open-source", "矩阵、元数据、分组信息", "QC、聚类、注释、差异分析流程"],
    ["我要找可复用的开源工具", "开源工具导航", "/open-source", "任务关键词或方法名", "工具卡、license提示、学习路径"],
    ["我要判断图表是否合格", "图表审计", "/plot-studio", "数据表、图类型、统计问题", "图形建议、SVG示例、风险提示"],
    ["我要写研究设计/综述框架", "科研训练Skill", "/skills/research-copilot", "研究主题、数据来源、假设", "问题凝练、框架、引用核验提醒"],
  ];
  return shell(`
    <div class="page-heading"><span>科研新手导航</span><h1>先描述研究问题，再选择方法和工具</h1><p>这里借鉴任务型平台的思路：新手不需要先认识所有模型名，而是从“我想解决什么问题”开始。</p></div>
    <section class="section">${sectionTitle("任务导航", "按科研问题选择下一步")}
      <div class="task-table">${tasks
        .map(([problem, method, href, input, output]) => `<div class="task-row">
          <div><strong>${problem}</strong><small>推荐入口：${method}</small></div>
          <div><span>输入</span>${input}</div>
          <div><span>输出</span>${output}</div>
          <button class="btn" onclick="navigate('${href}')">打开</button>
        </div>`)
        .join("")}</div>
    </section>
    <section class="section">${sectionTitle("方法学习指南", "每个方法都要能回答：做什么、怎么做、怎么看")}
      <div class="guide-grid">${state.methodGuides
        .map((g) => `<article class="method-guide">
          <h3>${g.title}</h3>
          <p>${g.practice_task}</p>
          <h4>学习目标</h4>${list(g.learning_goals)}
          <h4>学习顺序</h4>${list(g.suggested_sequence, "numbered")}
        </article>`)
        .join("")}</div>
    </section>
  `);
}

function journeyScore(item, query) {
  const hay = JSON.stringify(item || {}).toLowerCase();
  const q = String(query || "").toLowerCase();
  const terms = q
    .replace(/[，。；;,.]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  let score = 0;
  terms.forEach((term) => {
    if (hay.includes(term)) score += term.length > 2 ? 4 : 2;
  });
  const boosts = [
    ["基因", ["gene", "perturb", "knockout", "crispr", "扰动", "敲除"]],
    ["敲除", ["crispr", "perturb", "gene", "扰动"]],
    ["meta", ["meta", "systematic", "evidence", "forest", "prisma"]],
    ["单细胞", ["single", "cell", "scrna", "scanpy", "seurat", "cell"]],
    ["空间", ["spatial", "space", "visium"]],
    ["病理", ["pathology", "image", "case", "report", "病理"]],
    ["绘图", ["plot", "figure", "visual", "ggplot"]],
    ["文章", ["article", "paper", "manuscript", "review"]],
    ["机器学习", ["machine", "learning", "model", "deep"]],
    ["预后", ["survival", "cox", "kaplan"]],
  ];
  boosts.forEach(([needle, related]) => {
    if (q.includes(needle.toLowerCase())) {
      related.forEach((r) => {
        if (hay.includes(r.toLowerCase())) score += 3;
      });
    }
  });
  return score;
}

function topByJourney(items, query, count, fallbackStart = 0) {
  const scored = (items || [])
    .map((item, idx) => ({ item, idx, score: journeyScore(item, query) }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx);
  const picked = scored.filter((x) => x.score > 0).slice(0, count).map((x) => x.item);
  if (picked.length >= count) return picked;
  const filler = (items || []).slice(fallbackStart, fallbackStart + count * 2).filter((x) => !picked.includes(x));
  return picked.concat(filler).slice(0, count);
}

function firstUsefulList(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value;
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }
  return [];
}

function journeyBlueprint({ demand, methods, plots, articles, tools }) {
  const primaryMethod = methods[0] || {};
  const primaryPlot = plots[0] || {};
  const primaryArticle = articles[0] || {};
  const primaryTool = tools[0] || {};
  const materials = firstUsefulList(
    primaryMethod.required_materials,
    primaryMethod.inputs,
    primaryMethod.data_readiness_checklist,
    primaryArticle.required_materials,
  ).slice(0, 6);
  const reviewQuestions = firstUsefulList(
    primaryMethod.detail_teacher_checklist,
    primaryMethod.human_review_checklist,
    primaryMethod.mentor_review_questions,
    primaryArticle.human_review_checklist,
  ).slice(0, 5);
  const apiPrompt = [
    primaryMethod.model_gateway_prompt_template,
    primaryPlot.model_gateway_prompt_template,
    primaryArticle.model_gateway_prompt_template || primaryArticle.llm_api_prompt_template,
    primaryTool.model_gateway_prompt_template,
  ].filter(Boolean)[0] || `请把以下需求拆成科研训练任务包：${demand}\n输出：研究问题、输入材料、首选方法、推荐图表、文章类型、开源工具、数据审查、导师复核问题。\n边界：仅用于教学与科研训练，不替代临床诊断。`;
  const weekPlan = [
    ["第1天", "把需求翻译成研究问题", `用一句话写清楚：${demand}`],
    ["第2天", "核对输入材料和伦理边界", materials[0] || "列出样本、分组、字段、来源、隐私和导师复核人。"],
    ["第3天", "进入首选方法详情页", primaryMethod.name ? `${primaryMethod.name}：先看适用场景、输入和失败条件。` : "先进入方法宇宙选择最小可行方法。"],
    ["第4天", "跑通示例图和字段契约", primaryPlot.zh_name ? `${primaryPlot.zh_name}：用示例图学习字段、图注和解释边界。` : "先在图谱宇宙选择能回答问题的图。"],
    ["第5天", "确认工具和复现环境", primaryTool.name ? `${primaryTool.name}：读许可证、输入输出和最小示例。` : "从开源工具库挑一个可解释、可复核的工具。"],
    ["第6天", "搭文章证据链", primaryArticle.type ? `${primaryArticle.type}：按材料包、图表链和质量检查推进。` : "选择文章类型并建立图文链。"],
    ["第7天", "提交导师复核包", "输出问题、材料、方法、图表、文章草案边界和风险审计清单。"],
  ];
  return `<section class="journey-blueprint" aria-label="科研路线蓝图">
    <div class="journey-blueprint-head">
      <span>Beginner Blueprint</span>
      <h3>把一句需求变成一周可执行路线</h3>
      <p>下面不是自动给结论，而是把新手最容易漏掉的材料、方法、图表、文章、工具和复核动作排成顺序。每一步都能跳到对应详情页继续学习。</p>
    </div>
    <div class="blueprint-grid">
      <article class="blueprint-timeline">
        <h4>7天入门路径</h4>
        ${weekPlan.map(([day, title, detail]) => `<div class="blueprint-day"><span>${escapeHtml(day)}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></div>`).join("")}
      </article>
      <article>
        <h4>材料包清单</h4>
        ${list((materials.length ? materials : ["研究对象与分组", "样本来源与伦理边界", "原始数据字段", "预期图表", "导师复核问题"]).map((x) => String(x)))}
        <p class="soft-note">材料不齐时，先去数据审查页补字段，不要直接让模型写结论。</p>
      </article>
      <article>
        <h4>导师/教师复核问题</h4>
        ${list((reviewQuestions.length ? reviewQuestions : ["这个方法是否回答了原始问题？", "输入字段是否足够？", "示例图是否可由数据复现？", "AI输出是否存在临床误导？"]).map((x) => String(x)))}
      </article>
      <article>
        <h4>模型API提示骨架</h4>
        <pre>${escapeHtml(apiPrompt.slice(0, 900))}</pre>
        <a class="text-link" href="/model-gateway" data-link>进入模型API规范化页面</a>
      </article>
    </div>
    <div class="blueprint-route-strip">
      <a href="${escapeHtml(routePath('/method-universe', primaryMethod.id || 'method-001'))}" data-link>打开首选方法</a>
      <a href="${escapeHtml(routePath('/plot-gallery', primaryPlot.id || 'volcano_plot'))}" data-link>打开推荐图谱</a>
      <a href="${escapeHtml(routePath('/article-workshop', primaryArticle.id || 'article-01'))}" data-link>打开文章流程</a>
      <a href="${escapeHtml(routePath('/open-source', primaryTool.id || primaryTool.name || 'celltypist'))}" data-link>打开工具详情</a>
      <a href="/data-audit" data-link>进入数据审查</a>
    </div>
  </section>`;
}

function renderJourneyPlan(query) {
  const demand = String(query || "").trim() || "我想从零开始完成一个基础医学/病理相关科研训练任务";
  const methods = topByJourney(state.methodUniverse, demand, 5);
  const plots = topByJourney(state.plotGallery, demand, 4);
  const articles = topByJourney(state.articleWorkflows, demand, 3);
  const tools = topByJourney(state.openSource, demand, 3);
  const audits = topByJourney(state.dataAuditRules, demand, 4);
  const skillChain = [
    "research-copilot",
    methods.some((m) => `${m.name} ${m.category}`.includes("图谱") || `${m.name}`.toLowerCase().includes("rag")) ? "medical-kg-rag-builder" : "skill-eval-harness",
    demand.includes("案例") || demand.includes("病理") ? "pathology-case-builder" : "teacher-skill-maker",
    "ai-ethics-governor",
  ];
  return `<section class="journey-result-panel">
    <div class="journey-result-hero">
      <span class="product-kicker">Research Journey</span>
      <h2>把需求拆成一条可执行路线</h2>
      <p>${escapeHtml(demand)}</p>
      <p class="soft-note">${SAFETY} 本页只生成学习和项目设计路线，不代表真实研究结论。</p>
    </div>
    <div class="journey-lanes">
      <article>
        <span>01</span>
        <h3>先确认数据与边界</h3>
        <p>判断你有什么材料、能否公开使用、是否需要伦理或导师确认。没有数据时先用合成教学样例练习。</p>
        ${list(audits.map((x) => `${x.topic || x.id}：${x.check || x.how_to_fix || "检查字段、隐私和统计前提"}`).slice(0, 4))}
      </article>
      <article>
        <span>02</span>
        <h3>选择方法家族</h3>
        <p>不要直接套模型，先看方法是否回答你的问题、输入是否满足、输出能否复核。</p>
        <div class="compact-list">${methods.map((m) => `<a href="${routePath('/method-universe', m.id)}" data-link><strong>${escapeHtml(m.name)}</strong><small>${escapeHtml(m.hero_title || m.beginner_question || m.what_it_solves)}</small></a>`).join("")}</div>
      </article>
      <article>
        <span>03</span>
        <h3>配置工具与复现入口</h3>
        <p>工具只作为实现路线，不是结论来源。先读 license、示例数据、运行环境和输出解释。</p>
        <div class="compact-list">${tools.map((t) => `<a href="${routePath('/open-source', t.id || t.name)}" data-link><strong>${escapeHtml(t.name)}</strong><small>${escapeHtml(t.tool_product_title || t.short_description)}</small></a>`).join("")}</div>
      </article>
      <article>
        <span>04</span>
        <h3>规划图表与文章产物</h3>
        <p>图表回答问题，文章组织证据。先定主图、补充图、质量检查，再进入写作流程。</p>
        <div class="compact-list">${plots.map((p) => `<a href="${routePath('/plot-gallery', p.id)}" data-link><strong>${escapeHtml(p.zh_name || p.name)}</strong><small>${escapeHtml(p.plot_product_title || p.question_answered)}</small></a>`).join("")}</div>
        <div class="compact-list">${articles.map((a) => `<a href="${routePath('/article-workshop', a.id)}" data-link><strong>${escapeHtml(a.type)}</strong><small>${escapeHtml(a.article_product_title || a.article_hero_subtitle)}</small></a>`).join("")}</div>
      </article>
    </div>
    <section class="journey-skill-strip">
      <h3>建议调用的 Skill 链</h3>
      <p>${skillChain.map((x) => badge(x, "violet")).join("")}</p>
      <pre>${escapeHtml(`请基于以下研究需求生成规范化任务包：\\n需求：${demand}\\n请输出：研究问题、数据准备清单、推荐方法、推荐图表、文章类型、开源工具、风险审查、教师/导师复核问题。\\n边界：仅用于教学与科研训练，不替代临床诊断，不生成真实患者处置建议。`)}</pre>
    </section>
    ${journeyBlueprint({ demand, methods, plots, articles, tools })}
  </section>`;
}

function journeyBuilderPage() {
  return shell(`
    <div class="page-heading product-heading">
      <span>Journey Builder</span>
      <h1>一句话生成科研学习路径：方法、工具、图谱、文章和审查一步串起来</h1>
      <p>这是给科研新手的入口。你不需要先知道几百个方法名，只要描述想做什么，平台会把需求拆成数据准备、方法选择、工具入口、图表产物、文章流程和伦理审查。</p>
    </div>
    <section class="journey-builder-hero">
      <div class="form-panel journey-form">
        <label>我想完成的任务</label>
        <textarea id="journey-demand">我想做基因敲除后肿瘤细胞状态变化分析，并写成一篇机制研究论文</textarea>
        <div class="choice-row">
          <button class="chip" onclick="el('journey-demand').value='我想做CRISPR基因敲除后细胞状态变化分析，并生成可复核图表和机制文章路线'">基因敲除</button>
          <button class="chip" onclick="el('journey-demand').value='我想从0开始做一个Meta分析，整理检索、纳入排除、森林图和PRISMA流程'">Meta分析</button>
          <button class="chip" onclick="el('journey-demand').value='我有单细胞RNA测序数据，想做质控、注释、差异分析、轨迹和文章主图'">单细胞</button>
          <button class="chip" onclick="el('journey-demand').value='我想把病理教学案例做成PBL课堂、报告训练和伦理审查材料'">病理PBL</button>
        </div>
        <button class="btn" id="journey-build">生成研究路线</button>
      </div>
      <div class="guide-panel journey-guide">
        <h2>它会解决什么</h2>
        <p>多数新手卡住的不是“不努力”，而是不知道当前需求属于哪类方法、需要哪些数据、图应该怎么画、文章该按什么证据链组织。本页把这些分散问题一次组合成可执行任务包。</p>
        <div class="mini-steps"><span>描述需求</span><span>推荐方法</span><span>选择工具</span><span>规划图文</span><span>审查复核</span></div>
      </div>
    </section>
    <div id="journey-result" class="section">${renderJourneyPlan("我想做基因敲除后肿瘤细胞状态变化分析，并写成一篇机制研究论文")}</div>
  `);
}

function methodUniversePage() {
  const categories = [...new Set(state.methodUniverse.map((x) => x.category))];
  const featured = state.methodUniverse.slice(0, 36);
  return shell(`
    <div class="page-heading"><span>Method Universe</span><h1>${state.methodUniverse.length}+科研方法卡：从“我想做什么”反推“该用什么方法”</h1><p>这里不是把方法名堆给新手背诵，而是把每个方法拆成问题、输入、流程、输出、图表、误区和复核边界。真实课题执行前仍需导师、伦理和数据条件确认。</p></div>
    <section class="section method-control">
      <div class="search-bar"><input id="method-search" placeholder="搜索：基因敲除、单细胞、Meta、病理图像、HPC、图表..." /><select id="method-category"><option value="">全部类别</option>${categories.map((c) => `<option>${escapeHtml(c)}</option>`).join("")}</select></div>
      <div class="metric-row"><div><strong>${state.methodUniverse.length}</strong><span>方法卡</span></div><div><strong>${categories.length}</strong><span>方法类别</span></div><div><strong>${state.genePerturbationMethods.length}</strong><span>基因扰动路线</span></div><div><strong>${state.articleWorkflows.length}</strong><span>文章流程</span></div></div>
    </section>
    <section class="section">${sectionTitle("精选方法卡", "每张卡都回答新手最关心的五件事")}
      <div id="method-universe-list" class="method-universe-grid">${featured.map(methodUniverseCard).join("")}</div>
    </section>
  `);
}

function methodUniverseCard(m) {
  const visual = m.example_visual || {};
  const src = visual.url ? assetUrl(visual.url) : "";
  return `<article class="universe-card">
    <div class="universe-thumb">${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || m.name || "方法示例图")}" loading="lazy" />` : `<span>示例图待绑定</span>`}</div>
    <div class="method-head"><h3>${escapeHtml(m.name)}</h3>${badge(m.category || "方法", "blue")}</div>
    <p class="method-problem">${escapeHtml(m.hero_title || m.beginner_question || m.what_it_solves)}</p>
    <p>${escapeHtml(m.card_microcopy || m.why_it_matters || m.what_it_solves)}</p>
    <p class="visual-note"><strong>${escapeHtml(visual.title || "示例图")}</strong><span>${escapeHtml(visual.source_note || visual.reuse_boundary || "示例图用于理解方法输出，不代表真实研究结论。")}</span></p>
    <p class="soft-note">${escapeHtml((m.public_source_example && m.public_source_example.citation) ? `示例来源线索：${m.public_source_example.citation}` : "示例来源待核对")}</p>
    <div class="method-facts">
      <div><span>要准备什么</span><p>${escapeHtml((m.inputs || []).slice(0, 4).join("、"))}</p></div>
      <div><span>推荐图形</span><p>${escapeHtml((m.recommended_plot_types || m.figure_examples || []).slice(0, 4).join("、"))}</p></div>
    </div>
    <details><summary>展开学习路径</summary>${list((m.learning_path || []).map((x) => `${x.stage}：${x.task}`) || m.workflow || [], "numbered")}<p class="soft-note">${escapeHtml(m.example_prompt || "")}</p></details>
    <button class="btn ghost" onclick="navigate('/method-universe/${escapeHtml(m.id)}')">查看完整方法包</button>
  </article>`;
}

function methodCheckpointFlow(m, suggestedPlots) {
  const source = m.public_source_example || {};
  const visual = m.example_visual || {};
  const schemaRows = (m.example_dataset_shape || []).slice(0, 6).map((x) => `
    <div class="checkpoint-schema-row">
      <strong>${escapeHtml(x.field || "")}</strong>
      <span>${escapeHtml(x.meaning || "")}</span>
      <em>${x.required ? "必填" : "选填"}</em>
    </div>`).join("");
  const toolLine = (m.tools || []).length
    ? (m.tools || []).slice(0, 8).map((x) => badge(x, "green")).join("")
    : `<span class="soft-note">先按数据类型选择工具；正式运行前需核对版本、依赖、许可证和导师/教师复核记录。</span>`;
  const checkpoints = [
    {
      no: "01",
      tag: "适不适合",
      title: "先把研究问题翻译成方法判断",
      body: m.detail_novice_intro || m.what_it_solves || "科研新手先判断这是不是当前问题真正需要的方法，而不是直接复制流程。",
      proofTitle: "适用边界",
      proof: m.beginner_question || "把你的目标写成一个可回答的问题。",
      bullets: [
        `方法场景：${m.use_case_group || m.category || "综合科研方法"}`,
        `预期产出：${(m.outputs || []).slice(0, 3).join("、") || "判断卡、图表建议和复核清单"}`,
        `先避开的坑：${(m.common_mistakes || m.common_pitfalls || ["不清楚研究问题就运行流程"])[0]}`,
      ],
      action: "先写一句“我为什么需要它”。",
    },
    {
      no: "02",
      tag: "准备什么",
      title: "把数据、材料和证据来源摊开检查",
      body: m.detail_scenario_story || "方法不是按钮，输入材料的来源、字段、分组、伦理边界和缺失值会决定后续图表是否可信。",
      proofTitle: "字段长什么样",
      custom: schemaRows ? `<div class="checkpoint-schema">${schemaRows}</div>` : list(m.inputs || []),
      bullets: (m.data_readiness_checklist || m.inputs || []).slice(0, 4),
      action: "字段不完整时先去数据审查室。",
      cta: `<button class="btn ghost" onclick="navigate('/data-audit')">打开数据审查室</button>`,
    },
    {
      no: "03",
      tag: "怎么执行",
      title: "把步骤、工具和示例图连成可复核路线",
      body: m.detail_source_sentence || `本页示例图“${visual.title || "教学示例图"}”只用于读图训练，正式研究要回到自己的数据、脚本和来源记录。`,
      proofTitle: "公开来源线索",
      proof: `${source.title || "公开来源待核对"}｜${source.tier || source.source_platform || "公开数据/教学示例"}`,
      bullets: (m.workflow || []).slice(0, 5),
      action: "每一步都保存参数、版本和失败记录。",
      media: `<img src="${escapeHtml(assetUrl(visual.url || '/outputs/round11_plots/01_volcano_plot.svg'))}" alt="${escapeHtml(visual.title || '方法示例图')}" />`,
      cta: `<button class="btn ghost" onclick="navigate('/plot-gallery')">查看图谱室</button>`,
      extra: `<div class="checkpoint-tools">${toolLine}</div><p class="soft-note">推荐图谱：${escapeHtml(suggestedPlots.slice(0, 5).join("、") || "按研究问题选择图表")}</p>`,
    },
    {
      no: "04",
      tag: "怎么复核",
      title: "让模型输出进入导师/教师复核链",
      body: "这一站不追求自动给出结论，而是把Skill调用链、人工复核问题、伦理边界和下一篇文章路线放在同一个页面中。",
      proofTitle: "Skill链",
      proof: (m.skill_chain || []).join(" → ") || "research-copilot → ai-ethics-governor → skill-eval-harness",
      bullets: (m.mentor_review_questions || m.human_review_checklist || []).slice(0, 5),
      action: "能被复核，才允许进入论文草稿或课程材料。",
      cta: `<button class="btn ghost" onclick="navigate('/article-workshop')">打开文章工坊</button>`,
    },
  ];
  return `
    <section class="section method-checkpoint-flow" id="method-checkpoints">
      ${sectionTitle("四个新手检查站", "像产品页一样从问题、材料、执行到复核逐屏推进，不再把方法拆成重复卡片")}
      <div class="checkpoint-flow">
        ${checkpoints.map((item) => `
          <article class="method-checkpoint">
            <div class="checkpoint-number">
              <span>${escapeHtml(item.no)}</span>
              <small>${escapeHtml(item.tag)}</small>
            </div>
            <div class="checkpoint-main">
              <p class="checkpoint-eyebrow">${escapeHtml(item.action)}</p>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
              <div class="checkpoint-proof">
                <strong>${escapeHtml(item.proofTitle)}</strong>
                ${item.custom || `<span>${escapeHtml(item.proof || "")}</span>`}
              </div>
              ${list(item.bullets || [])}
              ${item.extra || ""}
              <div class="checkpoint-actions">${item.cta || ""}</div>
            </div>
            ${item.media ? `<div class="checkpoint-media">${item.media}</div>` : ""}
          </article>
        `).join("")}
      </div>
    </section>`;
}

function methodDetailPage(methodId) {
  const m = state.methodUniverse.find((x) => x.id === methodId);
  if (!m) return shell(`<div class="page-heading"><span>Method Detail</span><h1>方法不存在</h1><p>没有找到 ${escapeHtml(methodId)}，请返回方法宇宙重新选择。</p><button class="btn" onclick="navigate('/method-universe')">返回方法宇宙</button></div>`);
  const suggestedPlots = (m.recommended_plot_types || []).concat(m.figure_examples || []).concat(state.plotDemoGallery.slice(0, 3).map((x) => x.title)).slice(0, 8);
  const learningPath = (m.learning_path || []).map((step) => `<li><strong>${escapeHtml(step.stage || "")}</strong><span>${escapeHtml(step.task || "")}</span><em>${escapeHtml(step.checkpoint || "")}</em></li>`).join("");
  const storyPanels = m.detail_scroll_panels || m.apple_style_sections || [];
  const promptExamples = m.detail_user_prompt_examples || m.demand_window_prompts || [];
  const productStory = productFeatureStory({
    label: "方法拆解",
    title: `${m.name} 的新手学习路线`,
    subtitle: m.detail_scenario_story || m.detail_novice_intro || "先理解它解决什么问题，再检查输入材料、图谱产出和复核边界。",
    visual: m.example_visual || {},
    source: m.public_source_example || {},
    panels: storyPanels,
    promptExamples,
    proofItems: [
      ["研究问题", m.beginner_question || "待明确", "先确认它是不是这类问题"],
      ["输入材料", `${(m.inputs || []).length}类`, "字段和来源先过审查"],
      ["建议图谱", `${suggestedPlots.length}种`, "输出要能被读懂和复核"],
    ],
    context: {
      question: m.beginner_question,
      inputs: (m.inputs || []).join("?"),
      output: (m.outputs || []).join("?"),
      review: m.safety_boundary || SAFETY,
    },
  });
  return shell(`
    ${productNav([["#method-overview", "方法总览", "先判断是否适合你的问题"], ["#method-source", "来源边界", "看示例图和公开线索"], ["#method-checkpoints", "四站学习", "像产品页一样逐屏理解"], ["#method-demand", "需求窗口", "描述你的真实任务"]])}
    <div class="page-heading product-heading"><span>${escapeHtml(m.eyebrow || "Method Detail")}</span><h1>${escapeHtml(m.hero_title || m.name)}</h1><p>${escapeHtml(m.hero_subtitle || m.what_it_solves || m.beginner_question)}</p></div>
    <section class="method-product-hero apple-product-hero" id="method-overview">
      <div class="method-product-copy">
        <span class="product-kicker">${escapeHtml(m.category || "科研方法")}</span>
        <h2>${escapeHtml(m.why_it_matters || m.what_it_solves)}</h2>
        <p>${escapeHtml(m.detail_novice_intro || "这一页按“先判断、再准备、再执行、再复核”的顺序组织，不把方法当成软件按钮，也不把AI输出当作未经验证的研究结论。")}</p>
        <p>${escapeHtml(m.detail_scenario_story || "")}</p>
        ${productProofStrip([
          ["适合问题", escapeHtml(m.beginner_question || "研究问题待填写"), "先判断用途再跑流程"],
          ["输入", `${(m.inputs || []).length}类`, "字段、样本或材料必须可核验"],
          ["输出", `${(m.outputs || []).length}类`, "图表/模型/清单均需复核"],
        ])}
        <div class="product-cta-row">
          <button class="btn" onclick="document.getElementById('method-demand')?.scrollIntoView({behavior:'smooth'})">描述我的需求</button>
          <button class="btn ghost" onclick="navigate('/plot-gallery')">查看示例图</button>
        </div>
      </div>
      <div class="method-example-visual">
        <img src="${escapeHtml(assetUrl((m.example_visual && m.example_visual.url) || '/outputs/round11_plots/01_volcano_plot.svg'))}" alt="${escapeHtml((m.example_visual && m.example_visual.title) || '科研示例图')}" />
        <div>
          <strong>${escapeHtml((m.example_visual && m.example_visual.title) || "教学示例图")}</strong>
          <p>${escapeHtml((m.example_visual && m.example_visual.source_note) || "示例图为教学改绘，不代表真实研究结果。")}</p>
        </div>
      </div>
    </section>
    ${productStory}
    <section class="section source-proof-card" id="method-source">
      ${sectionTitle("公开来源与引用边界", "顶刊/高分区来源只作为可检索示例线索，正式研究必须回到原始数据库和许可要求")}
      <div class="source-proof-layout">
        <div>
          <h3>${escapeHtml((m.public_source_example && m.public_source_example.title) || "待补充公开来源")}</h3>
          <p>${escapeHtml((m.public_source_example && m.public_source_example.description) || "该方法暂未绑定公开来源。")}</p>
          <p>${escapeHtml(m.detail_source_sentence || "")}</p>
          <p><strong>引用线索：</strong>${escapeHtml((m.public_source_example && m.public_source_example.citation) || "待核对正式引用")}；PMID：${escapeHtml((m.public_source_example && m.public_source_example.pmid) || "待核对")}</p>
          <p class="soft-note">${escapeHtml((m.public_source_example && m.public_source_example.reuse_boundary) || "不复制论文原图，不下载受控数据。")}</p>
        </div>
        <div class="source-meta">
          ${badge((m.public_source_example && m.public_source_example.tier) || "公开来源", "green")}
          ${badge((m.public_source_example && m.public_source_example.source_platform) || "source", "blue")}
          <a class="btn ghost" href="${escapeHtml((m.public_source_example && m.public_source_example.url) || '#')}" target="_blank" rel="noreferrer">打开公开来源</a>
        </div>
      </div>
    </section>
    <section class="method-detail-hero">
      <div class="method-detail-card primary">
        ${sectionTitle("先用一句话理解", escapeHtml(m.beginner_question || "这个方法什么时候用"))}
        <p>${escapeHtml(m.what_it_solves)}</p>
        <div class="method-lens-grid">
          <div><strong>方法场景</strong><span>${escapeHtml(m.use_case_group || m.category || "综合科研方法")}</span></div>
          <div><strong>研究问题</strong><span>${escapeHtml(m.beginner_question || "把你的科研目标翻译成可执行任务")}</span></div>
          <div><strong>输入材料</strong><span>${escapeHtml((m.inputs || []).join("、"))}</span></div>
          <div><strong>产出材料</strong><span>${escapeHtml((m.outputs || []).join("、"))}</span></div>
        </div>
        <div class="tag-row">${(m.beginner_glossary || []).map((x) => badge(x, "blue")).join("")}</div>
      </div>
      <div class="method-detail-card">
        ${sectionTitle("新手别急着跑", "先检查这三件事")}
        <ol class="large-steps">
          <li><strong>问题是否明确：</strong>你要比较、预测、解释、筛选，还是做机制验证？</li>
          <li><strong>数据是否够用：</strong>字段、分组、批次、伦理来源和缺失值是否能支撑该方法？</li>
          <li><strong>输出如何复核：</strong>图表、统计、模型输出和文字结论是否能被导师或教师检查？</li>
        </ol>
        <p class="soft-note">${escapeHtml(m.safety_boundary || SAFETY)}</p>
      </div>
    </section>
    <section class="section method-learning-studio" id="method-path">
      ${sectionTitle("从0开始的学习路径", "每一步都要留下证据，不把模型输出直接当结论")}
      ${learningPath ? `<ol class="method-path-list">${learningPath}</ol>` : learningProductRail(m.workflow || [])}
    </section>
    ${methodCheckpointFlow(m, suggestedPlots)}
    <section class="section demand-lab">
      ${sectionTitle("需求描述窗口", "把你的真实需求写清楚，平台帮你组织成可交给模型API和导师复核的任务包")}
      <div class="demand-grid">
        <div class="form-panel">
          ${promptExamples ? `<div class="starter-list compact-starters">${promptExamples}</div>` : ""}
          <label>我想用这个方法做什么？</label>
          <textarea id="method-demand">${escapeHtml(m.example_prompt || `我想使用${m.name}解决一个基础医学或病理学科研问题，请帮我拆成研究问题、输入数据、操作步骤、图表、风险边界和教师/导师复核清单。`)}</textarea>
          <button class="btn" id="method-demand-build" data-method="${escapeHtml(m.id)}">生成规范化任务包</button>
          <button class="btn ghost" onclick="navigate('/model-gateway')">去模型API规范化</button>
        </div>
        <div id="method-demand-result" class="result rich-result">
          <h3>生成后这里会出现</h3>
          <p>任务目标、输入字段、Skill调用链、推荐图表、数据审查规则、模型提示词和人工复核清单。</p>
        </div>
      </div>
    </section>
  `);
}

function renderMethodDemandPackage(methodId, demandText) {
  const m = state.methodUniverse.find((x) => x.id === methodId) || state.methodUniverse[0];
  if (!m) return "<p>未找到方法。</p>";
  const skillChain = (m.skill_chain || []).length ? m.skill_chain : [
    "research-copilot",
    (m.category || "").includes("图") ? "skill-eval-harness" : "medical-kg-rag-builder",
    "ai-ethics-governor",
    "teacher-skill-maker",
  ];
  const plotHints = (m.recommended_plot_types || []).concat(m.figure_examples || []).concat(state.plotDemoGallery.slice(0, 2).map((x) => x.title)).slice(0, 8);
  const plotObjects = (m.recommended_plot_types || [])
    .map((name) => state.plotGallery.find((p) => [p.zh_name, p.en_name, p.id].filter(Boolean).some((v) => String(v).includes(name) || String(name).includes(v))))
    .filter(Boolean)
    .slice(0, 4);
  const modelPrompt = m.model_gateway_prompt_template || [
    `请作为科研训练助手，围绕“${m.name}”帮助我拆解任务。`,
    `我的需求：${demandText}`,
    `请按以下栏目输出：研究问题、输入数据字段、分析/实验流程、推荐图表、常见风险、需要导师复核的问题。`,
    "不得编造真实数据、p值、图表结论、文献或实验结果；医学相关内容仅用于教学与科研训练，不替代临床诊断。",
  ].join("\n");
  return `<h2>${escapeHtml(m.name)} · 规范化任务包</h2>
    <p><strong>你的需求：</strong>${escapeHtml(demandText)}</p>
    ${renderDemandInsightPanel({ kind: "method", title: m.name, demand: demandText, object: m, skillChain, plots: plotObjects.length ? plotObjects : plotHints.slice(0, 4) })}
    <div class="task-package-grid">
      <article><h3>任务目标</h3><p>${escapeHtml(m.what_it_solves || m.beginner_question)}</p></article>
      <article><h3>输入清单</h3>${list(m.inputs || [])}</article>
      <article><h3>执行路径</h3>${list(m.workflow || [], "numbered")}</article>
      <article><h3>预期产出</h3>${list(m.outputs || [])}</article>
      <article><h3>推荐图表</h3>${list(plotHints)}</article>
      <article><h3>Skill调用链</h3><p>${skillChain.map((x) => badge(x, "violet")).join("")}</p></article>
      <article><h3>数据准备检查</h3>${list(m.data_readiness_checklist || [])}</article>
      <article><h3>导师复核问题</h3>${list(m.mentor_review_questions || [])}</article>
    </div>
    <h3>可复制到模型网关的提示词</h3>
    <pre>${escapeHtml(modelPrompt)}</pre>
    <h3>先做这些检查</h3>
    ${list(["数据字段是否齐全", "是否存在隐私或伦理风险", "示例图是否被误写成真实结果", "输出是否需要导师/教师复核"], "numbered")}
    <p class="soft-note">${escapeHtml(m.safety_boundary || SAFETY)}</p>`;
}

function genePerturbationPage() {
  return shell(`
    <div class="page-heading"><span>Gene Perturbation Family</span><h1>想做基因敲除，不只有CRISPR-Cas9一种路线</h1><p>本页把基因敲除、敲低、转录抑制、蛋白降解、虚拟扰动和体内验证放在同一个家族里比较。它帮助你先做路线判断，不替代真实实验设计、伦理审批或导师决策。</p></div>
    <section class="panel">
      ${sectionTitle("路线选择逻辑", "先判断扰动层级，再判断模型体系，最后判断验证证据")}
      <div class="pipeline gene-pipeline"><div><strong>DNA层</strong><span>Cas9/Cas12a/TALEN/ZFN</span></div><div><strong>RNA层</strong><span>siRNA/shRNA/ASO/CRISPRi</span></div><div><strong>蛋白层</strong><span>抑制剂/PROTAC/rescue</span></div><div><strong>系统层</strong><span>类器官/动物/单细胞筛选</span></div><div><strong>预实验层</strong><span>虚拟敲除/模型预测</span></div></div>
    </section>
    <section class="section">${sectionTitle("24种扰动方法", "点开每一项看原理、用途、输入和误区")}
      <div class="gene-grid">${state.genePerturbationMethods.map((m) => `<article class="gene-card"><h3>${escapeHtml(m.name)}</h3><p>${escapeHtml(m.principle)}</p>${badge(m.when_to_use, "green")}<h4>需要准备</h4>${list(m.required_inputs || [])}<h4>流程</h4>${list(m.workflow || [], "numbered")}<p class="soft-note"><strong>新手提醒：</strong>${escapeHtml(m.beginner_warning)}</p></article>`).join("")}</div>
    </section>
  `);
}

function articleWorkshopPage(workflowId = "article-01") {
  const workflow = state.articleWorkflows.find((x) => x.id === workflowId);
  if (!workflow) return shell(`<div class="page-heading"><span>Article Workshop</span><h1>文章流程不存在</h1><p>没有找到 ${escapeHtml(workflowId)}，请返回文章工坊重新选择。</p><button class="btn" onclick="navigate('/article-workshop')">返回文章工坊</button></div>`);
  const figurePlan = articleFigurePlan(workflow);
  const visual = workflow?.example_visual || {};
  const source = workflow?.public_source_example || {};
  const visualSrc = visual.url ? assetUrl(visual.url) : "";
  const storyPanels = workflow?.detail_scroll_panels || workflow?.article_story_sections || [];
  const articleStory = productFeatureStory({
    label: "文章路线",
    title: `${workflow?.type || "文章"} 从选题到草稿的完整路径`,
    subtitle: workflow?.detail_novice_intro || "先搭建流程、证据和图表计划，再接入自己的模型API生成可复核草稿。",
    visual,
    source,
    panels: storyPanels,
    promptExamples: workflow?.starter_prompts || workflow?.model_prompts || [
      `我想写一篇${workflow?.type || "科研文章"}，主题是基础医学与数智病理教学，请帮我从0搭建材料清单、图表计划和复核流程。`,
      `我已经有研究问题和部分数据，请按${workflow?.type || "文章"}格式告诉我还缺哪些材料，不能编造结果。`,
      workflow?.model_gateway_prompt_template || workflow?.llm_api_prompt_template || "请根据我的研究主题生成文章流程、图表计划和人工复核清单。"
    ].filter(Boolean),
    className: "article-product-story",
    context: {
      audience: workflow?.audience,
      output: workflow?.article_reporting_focus,
      review: (workflow?.quality_checks || []).join("?"),
    },
    proofItems: [
      ["材料清单", `${(workflow?.required_materials || []).length}项`, "缺材料先补齐"],
      ["写作步骤", `${(workflow?.zero_to_one_path || []).length}步`, "从问题到复核"],
      ["Skill链", `${(workflow?.skills_to_call || []).length}个`, "接入模型前先结构化"],
    ],
  });
  return shell(`
    ${productNav([["#article-selector", "文章类型", "先选你要写哪类文章"], ["#article-proof", "示例与来源", "看公开线索和示意图"], ["#article-flow", "从0到1", "材料、图表、Skill链"], ["#article-model", "模型提示", "接入自有API后使用"]])}
    <div class="page-heading"><span>Article Workshop</span><h1>${state.articleWorkflows.length}类文章从0到1：先搭流程，再接入自己的模型API生成草稿</h1><p>这里把Meta分析、系统综述、机器学习论文、数字病理论文、教学改革论文等文章类型拆成材料清单、报告规范、图表计划、Skill调用链和风险审查。平台只生成规范化草稿和流程，不伪造数据、结论或投稿结果。</p></div>
    <section class="article-workshop-layout" id="article-selector">
      <div class="panel article-sidebar">
        ${sectionTitle("文章类型", "选择一种文章，查看完整路径")}
        <div class="article-list">${state.articleWorkflows.map((w) => {
          const v = w.example_visual || {};
          const img = v.url ? assetUrl(v.url) : "";
          return `<button class="article-tab-button ${workflow && w.id === workflow.id ? "selected" : ""}" onclick="navigate('${escapeHtml(routePath('/article-workshop', w.id))}')">
            <span class="article-tab-image">${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(v.title || w.type || "文章流程示例图")}" loading="lazy" />` : ""}</span>
            <span><strong>${escapeHtml(w.type)}</strong><small>${escapeHtml(w.article_hero_subtitle || w.article_reporting_focus || "从0搭建文章流程")}</small></span>
          </button>`;
        }).join("")}</div>
      </div>
      <div class="panel article-detail">
        <h2>${escapeHtml(workflow?.article_product_title || workflow?.type || "文章流程")}</h2>
        <p class="article-hero-subtitle">${escapeHtml(workflow?.article_hero_subtitle || "先搭建流程，再接入自己的数据和模型API。")}</p>
        <p>${badge(workflow?.status || "workflow-template", "blue")} ${badge("接入用户自己的API后可生成规范化草稿", "green")}</p>
        <section class="method-product-hero compact-product-hero">
          <div class="method-product-copy">
            <span class="product-kicker">${escapeHtml(workflow?.type || "文章类型")}</span>
            <h2>${escapeHtml(workflow?.article_reporting_focus || "研究问题、材料、方法、图表、引用核验和导师复核")}</h2>
            <p>${escapeHtml(workflow?.detail_novice_intro || "这一页不替你伪造论文，而是把从0开始的写作任务拆成可执行、可复核、可接入模型网关的步骤。")}</p>
            ${productProofStrip([
              ["材料", `${(workflow?.required_materials || []).length}项`, "先补齐再写草稿"],
              ["步骤", `${(workflow?.zero_to_one_path || []).length}步`, "从选题到复核"],
              ["Skill链", `${(workflow?.skills_to_call || []).length}个`, "接入模型前先结构化"],
            ])}
          </div>
          <div class="method-example-visual">
            ${visualSrc ? `<img src="${escapeHtml(visualSrc)}" alt="${escapeHtml(visual.title || workflow?.type || "文章示例图")}" />` : ""}
            <div><strong>${escapeHtml(visual.title || "教学改绘示例图")}</strong><p>${escapeHtml(visual.reuse_boundary || "示例图仅用于教学，不代表真实研究结果。")}</p></div>
          </div>
        </section>
        ${articleStory}
        <section class="source-proof-card article-source-card" id="article-proof">
          <div class="source-proof-layout">
            <div>
              <p class="soft-note"><strong>公开来源线索：</strong>以下信息只用于帮助新手回到公开数据库或论文入口核对材料，不复制论文原图，不代表本站已完成真实研究。</p>
              <h3>${escapeHtml(source.title || "公开来源线索待补充")}</h3>
              <p>${escapeHtml(source.description || "文章流程暂未绑定公开来源。")}</p>
              <p>${escapeHtml(workflow?.detail_source_sentence || "")}</p>
              <p><strong>引用线索：</strong>${escapeHtml(source.citation || "待核对正式引用")}；PMID：${escapeHtml(source.pmid || "待核对")}</p>
              <p class="soft-note">${escapeHtml(source.reuse_boundary || "不复制论文原图，不下载受控数据。")}</p>
            </div>
            <div class="source-meta">
              ${badge(source.tier || "公开来源", "green")}
              ${badge(source.source_platform || "source", "blue")}
              <a class="btn ghost" href="${escapeHtml(source.url || '#')}" target="_blank" rel="noreferrer">打开公开来源</a>
            </div>
          </div>
        </section>
        ${articleCheckpointFlow(workflow, figurePlan)}
        <div class="article-model-box" id="article-model">
          <h3>可复制给模型网关的规范化提示</h3>
          <pre>${escapeHtml(workflow?.model_gateway_prompt_template || workflow?.llm_api_prompt_template || "请先填写研究主题、数据来源和文章类型。")}</pre>
          <p class="soft-note">模型可以帮助搭建提纲、材料清单和检查表，但不得编造真实数据、p值、引用、审稿意见或投稿结果。</p>
        </div>
        <div class="article-builder form-panel">
          <label>输入你的研究主题，生成完整任务包</label>
          <input id="article-topic" value="胃癌数字病理教学中AI Skills的设计与评价" />
          <button class="btn" id="article-build" data-workflow="${escapeHtml(workflow?.id || "article-01")}">生成任务包</button>
          <button class="btn ghost" onclick="navigate('/model-gateway')">去API规范化</button>
        </div>
      </div>
    </section>
    <div id="article-build-result" class="result rich-result">选择文章类型并生成任务包后，这里会展示材料清单、流程、Skill调用链和可复制到模型网关的提示。</div>
  `);
}

function articleFigurePlan(workflow) {
  const text = `${workflow?.type || ""} ${(workflow?.figures_needed || []).join(" ")}`.toLowerCase();
  if (text.includes("meta")) return ["PRISMA流程图", "纳入研究特征表", "森林图", "漏斗图", "敏感性分析图"];
  if (text.includes("machine") || text.includes("机器") || text.includes("深度")) return ["数据流程图", "ROC/PR曲线", "混淆矩阵", "特征重要性图", "校准曲线"];
  if (text.includes("single") || text.includes("单细胞")) return ["QC小提琴图", "UMAP/t-SNE图", "marker热图", "差异表达火山图", "通路富集图"];
  if (text.includes("教学") || text.includes("education")) return ["研究设计流程图", "评价指标矩阵", "三组对照图", "问卷维度图", "风险治理闭环图"];
  return (workflow?.figures_needed || []).length ? workflow.figures_needed : ["研究流程图", "数据来源表", "质量控制图", "核心结果图", "复核清单"];
}

function articleCheckpointFlow(workflow, figurePlan) {
  const visual = workflow?.example_visual || {};
  const source = workflow?.public_source_example || {};
  const checkpoints = [
    {
      no: "01",
      tag: "先定题型",
      title: `${workflow?.type || "文章"}先判断是不是这种文章`,
      body: workflow?.article_hero_subtitle || workflow?.detail_novice_intro || "先判断研究问题、材料和证据形态是否匹配这种文章。",
      proofTitle: "适用对象",
      proof: workflow?.audience || "科研新手/研究生/青年教师",
      bullets: [workflow?.article_reporting_focus || "报告重点待明确", workflow?.status || "workflow-template", "不伪造数据、结论或投稿结果"],
    },
    {
      no: "02",
      tag: "补材料",
      title: "材料不齐，不进入正文生成",
      body: "文章流程从材料清单开始，而不是从摘要和讨论开始。缺少检索式、纳排标准、数据来源或偏倚评价时，只生成补齐清单。",
      proofTitle: "必需材料",
      custom: list(workflow?.required_materials || []),
      bullets: (workflow?.quality_checks || []).slice(0, 4),
    },
    {
      no: "03",
      tag: "定图表",
      title: "先规划图表，再写结果段落",
      body: "每张图都应对应一个证据问题：筛选、比较、预测、解释或评价。模型API只能整理图表计划，不能生成不存在的结果。",
      proofTitle: "图表计划",
      custom: list(figurePlan || []),
      bullets: (workflow?.zero_to_one_path || []).slice(0, 5),
      media: visual.url ? `<img src="${escapeHtml(assetUrl(visual.url))}" alt="${escapeHtml(visual.title || workflow?.type || '文章流程示例图')}" />` : "",
    },
    {
      no: "04",
      tag: "接API",
      title: "用Skill链约束大模型输出",
      body: "接入用户自己的模型API后，先输出流程、材料清单、图表计划和复核问题；真实数据、引用、p值和结论必须由用户材料支撑。",
      proofTitle: "Skill调用链",
      proof: (workflow?.skills_to_call || []).join(" → ") || "research-copilot → ai-ethics-governor",
      bullets: (workflow?.skills_to_call || []).slice(0, 6),
      cta: `<button class="btn ghost" onclick="navigate('/model-gateway')">去API规范化</button>`,
    },
  ];
  return `<section class="section method-checkpoint-flow article-checkpoint-flow" id="article-flow">
    ${sectionTitle("文章四站工作流", "像产品页一样逐屏拆解：题型、材料、图表、模型提示和复核")}
    <div class="checkpoint-flow">
      ${checkpoints.map((item) => `<article class="method-checkpoint">
        <div class="checkpoint-number"><span>${escapeHtml(item.no)}</span><small>${escapeHtml(item.tag)}</small></div>
        <div class="checkpoint-main">
          <p class="checkpoint-eyebrow">${escapeHtml(workflow?.type || "文章")} · ${escapeHtml(item.tag)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <div class="checkpoint-proof">
            <strong>${escapeHtml(item.proofTitle)}</strong>
            ${item.custom || `<span>${escapeHtml(item.proof || "")}</span>`}
          </div>
          ${list(item.bullets || [])}
          <div class="checkpoint-actions">${item.cta || ""}</div>
        </div>
        ${item.media ? `<div class="checkpoint-media">${item.media}</div>` : ""}
      </article>`).join("")}
    </div>
  </section>`;
}

function renderArticleDemandPackage(data, workflow, topic) {
  const figurePlan = articleFigurePlan(workflow);
  const title = workflow?.type || data.article_type || "文章流程";
  const object = {
    ...(workflow || {}),
    inputs: data.materials || workflow?.required_materials || [],
    workflow: data.steps || workflow?.zero_to_one_path || [],
  };
  const prompt = data.model_prompt || workflow?.model_gateway_prompt_template || "请先填写研究主题、材料来源和文章类型。";
  return `<h2>${escapeHtml(title)}任务包</h2>
    <p>${escapeHtml(data.note || "本任务包用于从0搭建文章流程；不伪造数据、结论或投稿结果。")}</p>
    ${renderDemandInsightPanel({ kind: "article", title, demand: topic, object, skillChain: data.skills_to_call || workflow?.skills_to_call || [], plots: figurePlan })}
    <div class="task-package-grid">
      <article><h3>研究主题</h3><p>${escapeHtml(topic || "待填写研究主题")}</p></article>
      <article><h3>材料清单</h3>${list(data.materials || workflow?.required_materials || [])}</article>
      <article><h3>从0到1流程</h3>${list(data.steps || workflow?.zero_to_one_path || [], "numbered")}</article>
      <article><h3>图表计划</h3>${list(figurePlan)}</article>
      <article><h3>Skill调用链</h3><p>${(data.skills_to_call || workflow?.skills_to_call || []).map((x) => badge(x, "violet")).join("")}</p></article>
      <article><h3>质量检查</h3>${list(data.quality_checks || workflow?.quality_checks || [])}</article>
    </div>
    <h3>模型网关提示</h3>
    <pre>${escapeHtml(prompt)}</pre>
    <p class="soft-note">${escapeHtml(data.safety || SAFETY)} 这里生成的是写作流程与材料组织建议，不代表真实研究结果。</p>`;
}

function plotCheckpointFlow(p) {
  const visual = p.example_visual || {};
  const source = p.public_source_example || {};
  const fields = (p.plot_data_contract || []).map((x) => `${x.field}：${x.meaning || "核心字段"}${x.required === false ? "（可选）" : ""}`);
  const checkpoints = [
    {
      no: "01",
      tag: "为什么画",
      title: `${p.zh_name || p.en_name || "这张图"}先回答一个问题`,
      body: p.plot_when_to_use || p.question_answered || "先确认图要回答的问题，再决定是否绘制。",
      proofTitle: "图形用途",
      proof: p.question_answered || p.output_interpretation || "图形必须服务研究问题。",
      bullets: [p.category || "科研图谱", p.suitable_data || "先确认数据形状", p.example_dataset_status || "示例/待实测"],
    },
    {
      no: "02",
      tag: "数据契约",
      title: "字段不齐就先停下来",
      body: "科研图最常见的问题不是不会画，而是字段含义、分组、单位、统计前提和缺失值没有说清楚。",
      proofTitle: "必需字段",
      custom: list(fields.length ? fields : p.required_columns || []),
      bullets: ["字段名要可追溯", "分组与单位要统一", "source data 和脚本要能归档"],
      cta: `<button class="btn ghost" onclick="navigate('/plot-studio?plot=${escapeHtml(p.id)}')">检查我的字段</button>`,
    },
    {
      no: "03",
      tag: "怎么看图",
      title: "示例图只教读法，不替代你的结果",
      body: p.detail_source_sentence || visual.reuse_boundary || "示例图仅用于教学演示，不代表真实研究结果。",
      proofTitle: "公开来源线索",
      proof: `${source.title || "来源待核对"}｜${source.tier || source.source_platform || "公开来源/教学示例"}`,
      bullets: [p.output_interpretation || "结合统计前提解释", p.common_mistakes || "不要只看颜色或显著性", p.r_ggplot_hint || "优先R/ggplot2保留脚本"],
      media: visual.url ? `<img src="${escapeHtml(assetUrl(visual.url))}" alt="${escapeHtml(visual.title || p.zh_name || '图谱示例图')}" />` : "",
    },
    {
      no: "04",
      tag: "怎么复核",
      title: "把图注、代码和审查记录一起交出去",
      body: p.safety_note || SAFETY,
      proofTitle: "模型提示词",
      proof: p.model_gateway_prompt_template || "请先提供研究问题、数据字段和图类型。",
      bullets: (p.detail_teacher_checklist || ["图是否回答研究问题", "字段和分组是否可核验", "统计前提是否说明", "示例图是否标注为教学演示"]).slice(0, 5),
      cta: `<button class="btn ghost" onclick="navigate('/model-gateway')">生成模型提示词</button>`,
    },
  ];
  return `<section class="section method-checkpoint-flow plot-checkpoint-flow" id="plot-checkpoints">
    ${sectionTitle("四步读懂这张图", "从问题、字段、读图到复核，把科研图从装饰变成证据")}
    <div class="checkpoint-flow">
      ${checkpoints.map((item) => `<article class="method-checkpoint">
        <div class="checkpoint-number"><span>${escapeHtml(item.no)}</span><small>${escapeHtml(item.tag)}</small></div>
        <div class="checkpoint-main">
          <p class="checkpoint-eyebrow">${escapeHtml(p.zh_name || p.en_name || p.id)} · ${escapeHtml(item.tag)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <div class="checkpoint-proof">
            <strong>${escapeHtml(item.proofTitle)}</strong>
            ${item.custom || `<span>${escapeHtml(item.proof || "")}</span>`}
          </div>
          ${list(item.bullets || [])}
          <div class="checkpoint-actions">${item.cta || ""}</div>
        </div>
        ${item.media ? `<div class="checkpoint-media">${item.media}</div>` : ""}
      </article>`).join("")}
    </div>
  </section>`;
}

function plotGalleryPage() {
  const categories = [...new Set(state.plotGallery.map((x) => x.category))];
  const categoryCount = categories.map((cat) => `${cat} ${state.plotGallery.filter((x) => x.category === cat).length}`).slice(0, 8);
  return shell(`
    <div class="page-heading"><span>Plot Gallery</span><h1>100种科研图谱：先看示例图，再理解它回答什么问题</h1><p>每种图都对应一个科研问题、一个数据形状和一组审查规则。真实出图前必须先做数据审查，示例图均为合成数据演示，不能冒充实测结果。</p></div>
    <section class="plot-gallery-overview">
      <article><strong>${state.plotGallery.length}</strong><span>种图谱方法</span><p>覆盖差异分析、组学、模型评价、Meta分析、机制示意、空间数据与教学评价。</p></article>
      <article><strong>100%</strong><span>示例图已绑定</span><p>每张卡片直接展示脚本生成的SVG缩略图，点击后进入Apple式下滑说明页。</p></article>
      <article><strong>R优先</strong><span>ggplot2路线</span><p>默认优先给R/ggplot2实现建议，同时保留Python和专业包的替代路径。</p></article>
      <article><strong>先审查</strong><span>再出图</span><p>字段缺失、分组不清或伦理边界不明时，先进入数据审查室，不让模型硬画。</p></article>
    </section>
    <section class="section plot-demo-showcase">
      ${sectionTitle("R/ggplot2示例图", "这些图是脚本实际跑出来的，不是装饰占位图", "示例用于帮助新手理解图形用途；接入用户自己的数据和模型API后，需要先通过数据审查和教师/导师复核。")}
      <div class="plot-demo-grid">${state.plotDemoGallery.map(plotDemoCard).join("")}</div>
    </section>
    <section class="section">
      <div class="plot-taxonomy-strip">${categoryCount.map((x) => `<span>${escapeHtml(x)}</span>`).join("")}</div>
      <div class="search-bar"><input id="plot-search" placeholder="搜索：火山图、生存曲线、SHAP、PRISMA、空间图..." /><select id="plot-category"><option value="">全部图类</option>${categories.map((c) => `<option>${escapeHtml(c)}</option>`).join("")}</select></div>
      <div id="plot-gallery-list" class="plot-gallery-grid">${state.plotGallery.slice(0, 100).map(plotGalleryCard).join("")}</div>
    </section>
  `);
}

function plotDemoCard(item) {
  const src = item.url ? assetUrl(item.url) : "";
  return `<article class="plot-demo-card">
    <div class="plot-demo-figure">${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)}" loading="lazy" />` : ""}</div>
    <div class="plot-demo-copy">
      <h3>${escapeHtml(item.title)}</h3>
      ${badge(item.method, "blue")}
      <p><strong>它回答：</strong>${escapeHtml(item.question)}</p>
      <p><strong>需要字段：</strong><code>${escapeHtml(item.input)}</code></p>
      <p class="soft-note">${escapeHtml(item.status)}；${escapeHtml(item.safety_boundary || SAFETY)}</p>
    </div>
  </article>`;
}

function plotGalleryCard(p) {
  const visual = p.example_visual || {};
  const source = p.public_source_example || {};
  const src = visual.url ? assetUrl(visual.url) : "";
  const columns = (p.plot_data_contract || []).map((x) => x.field).slice(0, 5);
  const tools = p.recommended_tools || ["R/ggplot2", "数据审查", "人工复核"];
  return `<article class="plot-card plot-product-card">
    <div class="plot-card-visual">${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || p.zh_name || '图谱示例')}" loading="lazy" />` : `<div class="mini-plot" aria-label="${escapeHtml(p.name || p.id)}示例图"><span></span><span></span><span></span><span></span></div>`}</div>
    <div class="plot-card-copy">
      <div class="plot-card-head"><h3>${escapeHtml(p.zh_name || p.name)}</h3>${badge(p.category, "blue")}</div>
      <p>${escapeHtml(p.plot_product_title || p.question_answered || p.answers_question)}</p>
      <div class="plot-card-source">
        ${badge(source.tier || "教学改绘示例", "green")}
        ${badge(source.source_platform || "本地SVG", "violet")}
      </div>
      <h4>它回答什么</h4><p>${escapeHtml(p.question_answered || "请先明确科研问题。")}</p>
      <h4>需要字段</h4><p>${columns.map((x) => `<code>${escapeHtml(x)}</code>`).join(" ")}</p>
      <h4>推荐工具</h4><p>${tools.slice(0, 4).map((x) => badge(x, "green")).join("")}</p>
      <details><summary>常见错误与模型提示</summary>${list(p.common_mistakes || [])}<pre>${escapeHtml(p.model_gateway_prompt_template || p.generation_command_template || "请提供数据字段、研究问题和输出边界；不得编造真实结果。")}</pre></details>
    </div>
    <button class="btn ghost" onclick="navigate('${escapeHtml(routePath('/plot-gallery', p.id))}')">打开图谱详情</button>
  </article>`;
}

function plotDetailPage(plotId) {
  const p = state.plotGallery.find((x) => x.id === plotId);
  if (!p) return shell(`<div class="page-heading"><span>Plot Detail</span><h1>图谱不存在</h1><p>没有找到 ${escapeHtml(plotId)}，请返回图谱宇宙重新选择。</p><button class="btn" onclick="navigate('/plot-gallery')">返回图谱宇宙</button></div>`);
  const visual = p.example_visual || {};
  const source = p.public_source_example || {};
  const src = visual.url ? assetUrl(visual.url) : "";
  const storyPanels = p.detail_scroll_panels || p.plot_story_sections || [];
  const plotStory = productFeatureStory({
    label: "图谱读法",
    title: `${p.zh_name || p.name} 应该怎样判断和解释`,
    subtitle: p.plot_when_to_use || p.answers_question || "先判断问题、字段和统计前提，再决定是否绘制。",
    visual,
    source,
    panels: storyPanels,
    promptExamples: p.demand_window_prompts || [p.model_gateway_prompt_template].filter(Boolean),
    className: "plot-product-story",
    context: {
      output: p.answers_question,
      inputs: (p.what_it_needs || []).join("?"),
      review: p.safety_note || SAFETY,
    },
    proofItems: [
      ["回答问题", p.answers_question || "待明确", "不是为了装饰"],
      ["必需字段", `${(p.plot_data_contract || p.what_it_needs || []).length}项`, "字段不齐先审查"],
      ["工具建议", `${(p.recommended_tools || []).length}个`, "优先R/ggplot2并保留代码"],
    ],
  });
  return shell(`
    <div class="page-heading product-heading"><span>${escapeHtml(p.category || "Plot Detail")}</span><h1>${escapeHtml(p.plot_product_title || p.zh_name || p.name)}</h1><p>${escapeHtml(p.plot_hero_subtitle || p.answers_question)}</p></div>
    <section class="method-product-hero">
      <div class="method-product-copy">
        <span class="product-kicker">${escapeHtml(p.en_name || p.name || p.id)}</span>
        <h2>${escapeHtml(p.plot_when_to_use || p.answers_question)}</h2>
        <p>${escapeHtml(p.detail_novice_intro || "科研图不是装饰。它必须回答一个问题，匹配一种数据形状，并保留审查、复核和解释边界。")}</p>
        <div class="product-cta-row">
          <button class="btn" onclick="navigate('${escapeHtml(`/plot-studio?plot=${p.id}`)}')">检查我的数据字段</button>
          <button class="btn ghost" onclick="navigate('/model-gateway')">生成模型提示词</button>
        </div>
      </div>
      <div class="method-example-visual">
        ${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || p.zh_name || '示例图')}" />` : ""}
        <div>
          <strong>${escapeHtml(visual.title || "教学改绘示例图")}</strong>
          <p>${escapeHtml(visual.reuse_boundary || "示例图仅用于教学，不代表真实研究结果。")}</p>
        </div>
      </div>
    </section>
    ${plotStory}
    <section class="section source-proof-card">
      ${sectionTitle("公开来源与示例边界", "来源只提供可检索线索，本站示例图为教学改绘或合成演示")}
      <div class="source-proof-layout">
        <div>
          <h3>${escapeHtml(source.title || "待补充公开来源")}</h3>
          <p>${escapeHtml(source.description || "该图谱暂未绑定公开来源。")}</p>
          <p>${escapeHtml(p.detail_source_sentence || "")}</p>
          <p><strong>引用线索：</strong>${escapeHtml(source.citation || "待核对正式引用")}；PMID：${escapeHtml(source.pmid || "待核对")}</p>
          <p class="soft-note">${escapeHtml(source.reuse_boundary || "不复制论文原图，不下载受控数据。")}</p>
        </div>
        <div class="source-meta">
          ${badge(source.tier || "公开来源", "green")}
          ${badge(source.source_platform || "source", "blue")}
          <a class="btn ghost" href="${escapeHtml(source.url || '#')}" target="_blank" rel="noreferrer">打开公开来源</a>
        </div>
      </div>
    </section>
    ${plotPublicVisualEvidence(p)}
    ${plotCheckpointFlow(p)}
    <section class="section article-model-box">
      <h3>可复制到模型网关的图谱提示词</h3>
      <pre>${escapeHtml(p.model_gateway_prompt_template || "请先提供数据字段和研究问题。")}</pre>
    </section>
    <section class="section demand-lab" id="plot-demand-lab">
      ${sectionTitle("图谱需求窗口", "把你的数据字段、研究问题和想得到的图形说清楚，平台先生成审查清单和执行路线。")}
      <div class="demand-grid">
        <div class="form-panel">
          <label>我想用这张图完成什么科研任务？</label>
          <textarea id="plot-demand">我想用${escapeHtml(p.zh_name || p.en_name || "这张科研图")}展示我的数据结果。我的字段包括：样本ID、分组、基因、数值、p值、校正p值。请帮我判断字段是否够、适合用什么R/ggplot2流程、图注应如何写、哪些结论不能声称。</textarea>
          <button class="btn" id="plot-demand-build" data-plot="${escapeHtml(p.id)}">生成图谱任务包</button>
          <button class="btn ghost" onclick="navigate('/plot-studio?plot=${escapeHtml(p.id)}')">进入字段审查室</button>
        </div>
        <div id="plot-demand-result" class="result rich-result">
          <h3>生成后这里会出现</h3>
          <p>字段契约、缺失字段、推荐R路线、公开示例图、模型提示词、图注边界和导师复核问题。</p>
        </div>
      </div>
    </section>
  `);
}

function renderPlotTaskPackage(plotId, demandText) {
  const p = state.plotGallery.find((x) => x.id === plotId) || {};
  const fields = (p.plot_data_contract || []).map((x) => `${x.field}：${x.meaning || "核心字段"}${x.required === false ? "（可选）" : ""}`);
  const visualMatches = state.publicSourceVisuals.slice(0, 3);
  const prompt = [
    `请作为科研绘图教练，围绕“${p.zh_name || p.en_name || p.id || "科研图"}”生成可复核作图任务包。`,
    `用户需求：${demandText}`,
    "请输出：字段审查、缺失字段、统计前提、R/ggplot2路线、图注模板、不可声称内容、导师复核问题。",
    "不得编造真实数据、p值、显著性、临床结论或未核验引用；医学AI输出仅用于教学与科研训练，不替代临床诊断。"
  ].join("\n");
  return `<h2>${escapeHtml(p.zh_name || p.en_name || "科研图")}任务包</h2>
    <p>${badge(p.category || "科研图谱", "blue")} ${badge("R/ggplot2优先", "green")} ${badge("先审字段", "violet")}</p>
    ${renderDemandInsightPanel({ kind: "plot", title: p.zh_name || p.en_name || p.id || "科研图", demand: demandText, object: p, skillChain: ["skill-eval-harness", "citation_checker", "ai-ethics-governor"], plots: [p].filter(Boolean) })}
    <div class="task-package-grid">
      <article><h3>这张图回答什么</h3><p>${escapeHtml(p.question_answered || p.answers_question || "请先明确图形要回答的科研问题。")}</p></article>
      <article><h3>字段契约</h3>${fields.length ? list(fields) : list(p.required_columns || [])}</article>
      <article><h3>执行路线</h3>${list([
        "把原始表整理为一行一个观测单位的tidy格式。",
        "核对分组、单位、缺失值和统计前提。",
        "用R/ggplot2生成初稿图，并保留脚本、数据表和session信息。",
        "由导师或教师复核图注、统计解释和不可声称内容。"
      ], "numbered")}</article>
      <article><h3>不能声称</h3>${list([
        "不能把教学示例图写成真实研究结果。",
        "不能凭图形外观声称临床诊断、疗效或机制因果。",
        "不能伪造p值、样本量、数据库下载记录或论文引用。",
        "没有人工复核前不能进入正式汇报或论文正文。"
      ])}</article>
    </div>
    ${visualMatches.length ? `<h3>可参考的公开重绘图</h3><div class="compact-list">${visualMatches.map((v) => {
      const sid = (v.source_ids || [])[0] || "";
      return `<a href="${escapeHtml(routePath('/source-library', sid))}" data-link><strong>${escapeHtml(v.title || "公开重绘图")}</strong><small>${escapeHtml(v.figure_question || v.reuse_boundary || "")}</small></a>`;
    }).join("")}</div>` : ""}
    <h3>可复制到模型网关的提示词</h3>
    <pre>${escapeHtml(prompt)}</pre>
    <p class="soft-note">本任务包只生成作图计划、审查清单和提示词；真实图形必须使用用户自己的数据和可复核脚本。</p>`;
}

function plotPublicVisualEvidence(p = {}) {
  const text = `${p.id || ""} ${p.zh_name || ""} ${p.en_name || ""} ${p.category || ""} ${p.question_answered || ""} ${p.answers_question || ""} ${(p.recommended_tools || []).join(" ")}`.toLowerCase();
  const isMutationLike = ["mutation", "mutational", "oncoplot", "突变", "队列", "基因组", "基因"].some((kw) => text.includes(kw.toLowerCase()));
  if (!isMutationLike || !state.publicSourceVisuals.length) return "";
  const visuals = state.publicSourceVisuals.slice(0, 5);
  return `<section class="section plot-public-evidence" id="plot-public-evidence">
    ${sectionTitle("可对照学习的公开重绘图", "这些图来自公开API和本地R/ggplot2脚本，帮助新手先看懂图形输出长什么样，再替换成自己的数据。")}
    <p class="soft-note">这些公开重绘图仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置；正式研究必须回到原数据库、原论文和数据许可进行核验。</p>
    <div class="plot-public-evidence-grid">
      ${visuals.map((v) => {
        const firstSourceId = (v.source_ids || [])[0] || "";
        const source = state.publicSources.find((s) => s.id === firstSourceId) || {};
        const preview = v.png_url || v.visual_url || "";
        return `<article class="plot-public-evidence-card">
          <div class="plot-public-evidence-image">${preview ? `<img src="${escapeHtml(assetUrl(preview))}" alt="${escapeHtml(v.title || "公开重绘图")}" loading="lazy" />` : ""}</div>
          <div class="plot-public-evidence-copy">
            ${badge(v.source_platform || "公开API", "green")}
            <h3>${escapeHtml(v.title || "公开教学重绘图")}</h3>
            <p>${escapeHtml(v.figure_question || v.subtitle || "用于学习图形如何回答一个明确问题。")}</p>
            <p class="soft-note">${escapeHtml(v.reuse_boundary || v.safety_boundary || SAFETY)}</p>
            <div class="plot-public-evidence-actions">
              ${firstSourceId ? `<button class="btn ghost" onclick="navigate('${escapeHtml(routePath('/source-library', firstSourceId))}')">打开来源学习页</button>` : ""}
              <button class="btn ghost" onclick="navigate('/plot-studio?plot=${escapeHtml(p.id || 'volcano_plot')}')">用我的字段审图</button>
            </div>
            <small>${escapeHtml(source.citation || v.citation || "正式引用待核对")}</small>
          </div>
        </article>`;
      }).join("")}
    </div>
  </section>`;
}

function dataAuditPage() {
  return shell(`
    <div class="page-heading"><span>Data Audit Room</span><h1>数据不规范时，不急着画图，也不急着跑模型</h1><p>先检查字段、来源、隐私、伦理、分组和统计适配。审查结果只给整理建议，不生成虚假p值、均值或满意度。</p></div>
    <section class="two-col">
      <div class="form-panel">
        <label>描述你的数据或粘贴字段名</label>
        <textarea id="audit-description">样本ID, 分组, 年龄, 生存时间, 结局, 基因表达矩阵, 批次, 缺失值, 伦理审批</textarea>
        <button class="btn" id="run-data-audit">运行数据审查</button>
      </div>
      <div class="guide-panel"><h2>审查会看什么</h2>${list(["字段是否清晰", "是否包含隐私风险", "是否具备分组和元数据", "统计方法是否匹配", "是否需要导师/伦理复核"])}</div>
    </section>
    <div id="data-audit-result" class="result rich-result">等待审查。</div>
  `);
}

function islandPage() {
  return shell(`
    <div class="page-heading"><span>Research Island</span><h1>把科研学习路线做成一张能走的地图</h1><p>科研小岛是一个交互式学习导航：每座建筑对应一个严肃工作流。它帮助新手找到入口，但不替代平台里的方法、案例、审计和教师复核。</p></div>
    <section class="island-scene">
      <div class="sky"></div>
      <div class="island-board">
        <div id="island-avatar" class="island-avatar"><span>研</span></div>
        ${state.islandBuildings.map((b, i) => `<button class="island-building b${i % 10}" data-building="${escapeHtml(b.id)}" data-name="${escapeHtml(b.name)}" data-role="${escapeHtml(b.role)}" data-interaction="${escapeHtml(b.interaction)}"><span>${escapeHtml(b.name)}</span><small>${escapeHtml(b.role)}</small></button>`).join("")}
      </div>
    </section>
    <section id="island-dialogue" class="result rich-result"><h2>点击一座建筑开始</h2><p>角色会移动过去，并告诉你这个入口解决什么任务。</p></section>
    <section class="section">${sectionTitle("小岛建筑说明", "每个入口最终都回到正式科研/教学任务")}
      <div class="building-grid">${state.islandBuildings.map((b) => `<article><h3>${escapeHtml(b.name)}</h3><p>${escapeHtml(b.role)}</p><p class="soft-note">${escapeHtml(b.interaction)}</p></article>`).join("")}</div>
    </section>
  `);
}

function island3DPage() {
  const first = state.islandBuildings[0] || {};
  const total = Math.max(state.islandBuildings.length, 1);
  const visited = Math.min(island3DRuntime.visited.size, total);
  return shell(`
    <div class="page-heading">
      <span>Research Island 3D Prototype · 新手任务岛</span>
      <h1>把“科研小白入门”做成可走、可点、可对话的任务小岛</h1>
      <p>这是一个本地等距视角原型：每座建筑都是一个真实工作流入口。你可以点击建筑移动角色，查看它解决什么问题、三步怎么完成、会调用哪些Skill、最终要留下哪些可复核证据。</p>
    </div>
    ${productNav([["#island-canvas", "进入小岛", "点击建筑移动角色"], ["#island-compass", "任务罗盘", "选择新手路线"], ["#island-progress", "学习进度", "查看已访问任务"], ["#island-routes", "建筑路线", "进入真实功能页"]])}
    ${islandPassportMarkup()}
    ${islandCompassMarkup()}
    <section class="island3d-layout">
      <div class="island3d-stage premium-island-stage" id="island-canvas">
        <div class="island3d-hud" id="island3d-hud">
          <div><span>任务进度</span><strong>${visited}/${total}</strong></div>
          <div><span>当前模式</span><strong id="island-render-mode">Three.js加载中</strong></div>
          <div><span>安全边界</span><strong>不处理真实患者数据</strong></div>
        </div>
        <div id="three-island-root" class="three-island-root" aria-label="MedPath Three.js research island scene"></div>
        <canvas id="island3d-canvas" width="1120" height="620" aria-label="MedPath 3D research island"></canvas>
        <div class="island3d-dialogue" id="island3d-dialogue">
          <strong>科研小向导</strong>
          <p>${escapeHtml(island3DRuntime.dialogue)}</p>
        </div>
        <div class="island3d-action-bar" aria-label="科研小岛操作">
          <button onclick="startIslandQuestTour()">开始导览</button>
          <button onclick="advanceIslandQuest(1)">下一站</button>
          <button onclick="advanceIslandQuest(-1)">上一站</button>
          <button onclick="randomIslandQuest()">随机任务</button>
          <button onclick="resetIslandQuestProgress()">重置进度</button>
        </div>
        <div class="island3d-mini-map" id="island3d-mini-map">
          ${(state.islandBuildings || []).slice(0, 6).map((b, index) => `<button type="button" onclick="focusIslandBuilding('${escapeHtml(b.id)}')"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(b.name)}</button>`).join("")}
        </div>
        <div class="island3d-help">点击建筑移动角色，也可用 W/A/S/D 或方向键手动探索；靠近建筑会自动打开任务。当前为本地教学原型，不连接真实患者数据，不替代导师或教师复核。</div>
      </div>
      <aside class="island3d-panel" id="island3d-panel">
        ${islandPanelMarkup(first, true)}
      </aside>
    </section>
    <section class="section island-progress-panel" id="island-progress">
      ${sectionTitle("小岛学习进度", "每访问一座建筑，就解锁一个可复核科研动作", "这里的徽章只是学习状态，不代表真实课程成绩或平台正式上线。")}
      <div class="island-badge-grid">${state.islandBuildings.map((b, index) => `<article class="${island3DRuntime.visited.has(b.id) ? "visited" : ""}" onclick="focusIslandBuilding('${escapeHtml(b.id)}')">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(b.name)}</strong>
        <small>${island3DRuntime.visited.has(b.id) ? "已访问 · 可继续复盘" : "待探索 · 点击定位"}</small>
      </article>`).join("")}</div>
    </section>
    <section class="section" id="island-routes">${sectionTitle("岛屿任务路线", "每座建筑都是一个小闭环：入口、步骤、证据和边界")}
      <div class="building-grid island-quest-grid">${state.islandBuildings.map((b, index) => `<article>
        <span class="quest-index">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(b.name)}</h3>
        <p>${escapeHtml(b.quest_title || b.role)}</p>
        <p class="soft-note">${escapeHtml(b.quest_summary || b.interaction)}</p>
        <div class="route-card-meta">
          <div><span>交付物</span><strong>${escapeHtml(b.evidence_to_collect || "任务输入、输出草案和教师复核记录")}</strong></div>
          <div><span>避坑边界</span><strong>${escapeHtml(b.safety_boundary || SAFETY)}</strong></div>
        </div>
        <div class="actions compact-actions">
          <button class="btn ghost" onclick="focusIslandBuilding('${escapeHtml(b.id)}')">在小岛中定位</button>
          <a class="btn" href="${escapeHtml(b.route || islandRouteForBuilding(b))}" data-link>打开任务入口</a>
        </div>
      </article>`).join("")}</div>
    </section>
  `);
}

function mobileAppPage() {
  const appScenes = [
    {
      title: "刚接触课题时",
      action: "先用一句话描述自己的研究兴趣，系统把它翻译成问题、方法、数据、伦理和产出五个任务块。",
      route: "/journey-builder",
      routeText: "生成研究路线",
    },
    {
      title: "准备做实验前",
      action: "从基因扰动、细胞模型、动物模型、组学分析和病理验证中选择路径，查看每种方法适合解决什么问题。",
      route: "/method-family/gene-perturbation",
      routeText: "查看方法家族",
    },
    {
      title: "开始写文章前",
      action: "选择综述、Meta分析、机制研究、方法学论文或病例教学论文，按证据、图表、统计和写作顺序拆任务。",
      route: "/article-workshop",
      routeText: "进入文章工坊",
    },
    {
      title: "提交材料前",
      action: "用伦理治理和数据审查模块检查隐私、伪造引用、临床误导、统计风险和教师复核记录。",
      route: "/governance",
      routeText: "做提交前审计",
    },
  ];
  const phoneScreens = [
    {
      label: "方法导航",
      heading: "我想做基因敲除",
      lines: ["先选目的：验证功能 / 建模 / 筛选", "再选层级：DNA / RNA / 蛋白 / 表型", "输出：候选路线、对照组、失败风险"],
      action: "打开24种扰动路线",
    },
    {
      label: "文章流程",
      heading: "我要写Meta分析",
      lines: ["定义PICO问题", "检索策略与纳排标准", "偏倚风险、森林图、敏感性分析"],
      action: "生成全流程Skill",
    },
    {
      label: "数据审查",
      heading: "我的数据能画图吗",
      lines: ["识别列名、缺失和单位", "提示可用图形与统计前提", "不合格数据先给修改建议"],
      action: "上传前先审查",
    },
  ];
  const proofItems = [
    { k: "入口", v: "新手问题", d: "用自然语言描述需求，不要求先知道方法名。" },
    { k: "路径", v: "任务分解", d: "把大目标拆成可执行步骤和可复核证据。" },
    { k: "输出", v: "Skill规范", d: "接入自己的模型API后按统一格式生成材料。" },
    { k: "审计", v: "风险边界", d: "临床、隐私、引用和学术诚信风险先拦截。" },
  ];
  const appTabs = ["首页", "方法", "文章", "图谱", "审计"];
  return shell(`
    <div class="page-heading">
      <span>Mobile App Blueprint · 手机端设计路线</span>
      <h1>把科研新手的每一步，做成手机里能跟着走的学习路径</h1>
      <p>手机端不是把网页缩小，而是把“我现在不知道下一步做什么”转化为一张随身任务卡：先理解问题，再选择方法，再准备数据，最后完成写作、绘图和伦理审查。</p>
    </div>
    ${productNav([["#mobile-scenarios", "使用场景", "按科研时刻进入"], ["#mobile-prototype", "手机原型", "三屏产品样机"], ["#mobile-learning", "学习路径", "从0到交付"], ["#mobile-handoff", "设计交付", "Figma与开发说明"]])}
    <section class="mobile-hero-band">
      <div class="mobile-hero-copy">
        <span class="eyebrow">Research Companion in Pocket</span>
        <h2>科研小白打开手机后，看到的不是按钮堆叠，而是下一步行动。</h2>
        <p>页面会根据“想做什么”自动推荐方法族、文章类型、图形方案、数据审查和Skill调用链。每个任务都配有示例图、来源说明、常见错误和教师复核提示。</p>
        <div class="mobile-proof-grid">${proofItems.map((item) => `<article><span>${item.k}</span><strong>${item.v}</strong><p>${item.d}</p></article>`).join("")}</div>
      </div>
      <div class="mobile-device-cluster" aria-label="手机端核心界面预览">
        ${phoneScreens.map((screen, index) => `<div class="phone-frame phone-${index + 1}">
          <div class="phone-status"><span>MedPath</span><span>09:${20 + index}</span></div>
          <div class="phone-app-title"><small>${screen.label}</small><strong>${screen.heading}</strong></div>
          <div class="phone-lines">${screen.lines.map((line) => `<p>${line}</p>`).join("")}</div>
          <button class="phone-action">${screen.action}</button>
          <div class="phone-tabbar">${appTabs.map((tab, tabIndex) => `<span class="${tabIndex === index + 1 ? "active" : ""}">${tab}</span>`).join("")}</div>
        </div>`).join("")}
      </div>
    </section>
    <section class="section" id="mobile-scenarios">
      ${sectionTitle("四个高频使用时刻", "每个入口都写给第一次做科研的人", "这些场景会映射到网页已有的方法库、文章工坊、数据审查、治理审计和Skill运行页面。")}
      <div class="mobile-scene-grid">${appScenes.map((scene, index) => `<article>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <h3>${scene.title}</h3>
        <p>${scene.action}</p>
        <a class="text-link" href="${scene.route}" data-link>${scene.routeText}</a>
      </article>`).join("")}</div>
    </section>
    <section class="section mobile-product-story" id="mobile-prototype">
      ${sectionTitle("手机端信息架构", "用少量屏幕承载完整科研闭环", "移动端重点服务碎片化学习、任务提醒、材料审查和教师反馈，不替代桌面端的复杂配置。")}
      <div class="mobile-story-row">
        <div><h3>首页像任务仪表盘</h3><p>显示今天要完成的三件事：读懂一个方法、准备一份数据、检查一段AI输出。每个任务卡都标明预计耗时、输出材料和是否需要教师复核。</p></div>
        <div><h3>详情页像产品说明书</h3><p>点进一个方法后，先看到它解决什么问题，再看到输入、步骤、示例图、常见错误、适用文章类型和可调用的Skill。</p></div>
        <div><h3>桌宠承担引导而非装饰</h3><p>小向导只在用户卡住时出现，例如数据不规范、方法选择冲突、文章类型不匹配或输出需要伦理审计时，给出下一步建议。</p></div>
      </div>
    </section>
    <section class="section" id="mobile-learning">
      ${sectionTitle("从0到交付的手机学习路径", "一条路径对应一个最终可提交成果", "路径默认不生成真实结论，只生成计划、模板、检查表和待复核草案。")}
      <div class="learning-rail mobile-learning-rail">
        ${[
          ["01", "提出需求", "用自然语言写出想做的课题、文章或图形，系统先判断任务类型。"],
          ["02", "选择路线", "推荐方法家族、文章Skill和数据要求，并解释为什么适合或不适合。"],
          ["03", "准备材料", "列出数据表、文献、实验记录、图片和伦理边界的最低要求。"],
          ["04", "运行Skill", "调用自己的模型API或本地mock模式，按规范输出草案。"],
          ["05", "审查风险", "检查引用、统计、隐私、临床误导和学术诚信风险。"],
          ["06", "教师复核", "生成复核清单、修改记录和可归档证据。"],
        ].map(([num, title, text]) => `<article><span>${num}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}
      </div>
    </section>
    <section class="section mobile-demand-window">
      ${sectionTitle("需求描述窗口", "把模糊想法变成可执行Skill", "正式版将接入用户自己的模型API；当前网页用于展示输入结构和审查逻辑。")}
      <div class="two-col">
        <div class="form-panel">
          <label>我现在想完成的任务</label>
          <textarea>我想写一篇肿瘤免疫治疗相关的Meta分析，但不知道从检索、纳排、质量评价到森林图应该怎么开始。</textarea>
          <button class="btn" onclick="navigate('/article-workshop/meta-analysis')">生成文章全流程</button>
        </div>
        <div class="result rich-result">
          <h3>手机端将返回的不是一段泛泛回答</h3>
          <p>它会返回PICO问题、检索式草案、数据库选择、纳排标准、偏倚风险工具、数据提取表、图形清单、统计前提、伦理边界和可调用Skill链。</p>
          <p class="soft-note">${SAFETY}</p>
        </div>
      </div>
    </section>
    <section class="section" id="mobile-handoff">
      ${sectionTitle("Figma与开发交付路线", "先以网页原型固化信息架构，再迁移到手机端设计稿", "当前本地页面就是移动端产品蓝图，可继续在Figma中重绘为iOS/Android高保真界面。")}
      <div class="handoff-board-frame">
        <img src="/outputs/mobile_app_handoff/medpath_mobile_app_figma_handoff.svg" alt="MedPath手机端Figma交付设计板" loading="eager" />
        <p>这张设计板由本地脚本生成，可拖入Figma继续拆分为组件：任务卡、方法卡、文章Skill卡、审计卡、教师复核清单和桌宠对话。Round63 已补充可导入Figma的本地交付包；当前不声称已经创建线上Figma文件。</p>
        <div class="actions">
          <a class="btn" href="/outputs/mobile_app_handoff/figma_import_pack/medpath_mobile_app_figma_handoff.svg" target="_blank" rel="noreferrer">打开SVG交付板</a>
          <a class="btn ghost" href="/outputs/mobile_app_handoff/figma_import_pack/figma_import_manifest.json" target="_blank" rel="noreferrer">查看导入清单</a>
          <a class="btn ghost" href="/outputs/mobile_app_handoff/figma_import_pack/figma_use_rebuild_mobile_app.js" target="_blank" rel="noreferrer">查看复建脚本</a>
        </div>
      </div>
      <div class="mobile-scene-grid">
        <article><span>A</span><h3>组件层</h3><p>方法入口、文章流程、图形推荐、审计提示、桌宠对话、教师复核表分别做成可复用组件。</p></article>
        <article><span>B</span><h3>数据层</h3><p>从现有方法库、图谱库、文章Skill、开源工具库读取内容，避免手机端与网页端各写一套。</p></article>
        <article><span>C</span><h3>安全层</h3><p>所有模型输出、HPC任务、案例生成和医学建议都经过边界标注、人工复核和审计记录。</p></article>
        <article><span>D</span><h3>Figma导入包</h3><p>包含设计tokens、五个核心屏幕、可拖入SVG和Figma复建脚本。Figma连接恢复后可直接迁移为云端设计文件。</p></article>
      </div>
    </section>
  `);
}

function mobileAppPage() {
  const appScenes = [
    { title: "刚拿到课题时", action: "把一句模糊想法拆成研究问题、适用方法、数据需求、伦理边界和一周内可完成的小任务，避免新手一开始就被术语淹没。", route: "/journey-builder", routeText: "生成第一条研究路线" },
    { title: "准备做基因敲除时", action: "按CRISPR、siRNA、shRNA、条件性敲除、诱导性敲除、动物模型和救援实验等路线比较适用问题、失败风险和验证材料。", route: "/method-family/gene-perturbation", routeText: "进入基因扰动方法家族" },
    { title: "想写Meta分析时", action: "从PICO问题、检索式、纳排标准、偏倚风险、数据提取表、森林图和敏感性分析一路排到可复核的写作草稿。", route: "/article-workshop", routeText: "打开文章全流程Skill" },
    { title: "数据表不确定能不能画图时", action: "上传前先让系统检查列名、单位、缺失值、分组、统计前提和可视化候选方案，再决定是否进入科研绘图室。", route: "/data-check", routeText: "先做数据审查" },
    { title: "准备交给老师前", action: "检查AI生成内容是否有虚假引用、临床误导、过度诊断、统计解释错误和未标注的模型输出，形成复核清单。", route: "/governance", routeText: "生成提交前审计" },
    { title: "想把流程放进手机端时", action: "把网页端的Skill、方法详情、文章流程、模型网关和教师复核记录压缩成可触达的移动端任务卡。", route: "/mobile-app", routeText: "查看手机端蓝图" },
  ];
  const phoneScreens = [
    { label: "今日入口", heading: "今天先完成三件事", lines: ["把研究想法写成可执行问题", "选择一条方法路线并看失败点", "把老师要看的材料放进复核清单"], action: "开始今日科研任务" },
    { label: "方法详情", heading: "基因敲除怎么选", lines: ["先区分永久敲除、瞬时沉默和条件性模型", "再列出验证指标、对照组和补救实验", "最后提示不适用情境与替代方案"], action: "比较14条敲除路线" },
    { label: "示例图学习", heading: "这张图在讲什么", lines: ["先看图型、变量、分组和统计检验", "再看源数据格式与复现条件", "最后生成自己的数据审查建议"], action: "进入科研绘图室" },
    { label: "文章Skill", heading: "我要写Meta分析", lines: ["PICO问题、检索策略和注册信息", "纳排标准、偏倚风险和数据提取表", "森林图、漏斗图和GRADE证据表"], action: "生成全流程写作包" },
    { label: "模型网关", heading: "接入自己的API", lines: ["只读取环境变量，不保存密钥", "按任务选择生成、审稿、伦理或代码模型", "输出统一进入引用与风险审查"], action: "生成规范请求包" },
    { label: "伦理复核", heading: "提交前谁来把关", lines: ["识别隐私、虚假引用和临床误导", "标注AI生成、教师修改与待复核状态", "形成D10评价字段与归档记录"], action: "打开教师复核表" },
  ];
  const proofItems = [
    { k: "问法", v: "从一句话开始", d: "不用先知道专业术语，系统先追问目的、对象、材料和交付物。" },
    { k: "方法", v: "按用途分流", d: "基因敲除、组学、病理图像、统计建模和文章写作分别进入不同路线。" },
    { k: "证据", v: "每步要能复核", d: "示例图、来源、输入格式、输出草稿和教师复核点一起呈现。" },
    { k: "安全", v: "先标边界再输出", d: "隐私、临床误导、虚假引用和学术诚信风险先进入审计链。" },
  ];
  const journeySteps = [
    ["01", "说清需求", "把“我想做某个课题”转成研究对象、目标、样本、方法和交付物五类信息。"],
    ["02", "选择路径", "系统推荐方法家族、文章类型、图表路线和可调用Skill，并解释为什么适合或不适合。"],
    ["03", "准备材料", "列出需要的表格、图像、文献、实验记录、代码环境和伦理边界，先补齐缺口。"],
    ["04", "运行Skill", "接入用户自己的模型API或本地mock模式，按统一模板输出草稿、流程和检查表。"],
    ["05", "审查风险", "用引用核验、数据审查、幻觉风险、临床误导和学术诚信规则筛掉高风险输出。"],
    ["06", "交给老师", "生成教师复核清单、修改记录和归档材料，让AI输出停在教学训练边界内。"],
  ];
  const screenSpecs = [
    ["首页任务流", "面向刚开始的新手，显示今日三步、未完成材料、推荐学习路径和桌宠提示。"],
    ["方法详情页", "像苹果产品页一样滚动讲清一个方法：解决什么、怎么做、输入输出、示例图和失败点。"],
    ["科研绘图页", "展示可复现的示例图、源数据格式、适用图型、统计前提和数据不合格时的修正建议。"],
    ["文章工坊页", "按Meta分析、综述、机制研究、病例教学等文章类型生成从0开始的Skill流程。"],
    ["模型网关页", "让用户接入自己的模型API，系统只展示配置状态，不保存明文密钥。"],
    ["治理复核页", "将AI输出、教师修改、引用核验、D10评价和归档状态合并到一张复核卡。"],
  ];
  const handoffLinks = [
    ["Round70 SVG交付板", "/outputs/mobile_app_handoff/figma_import_pack/medpath_mobile_app_round70_handoff.svg"],
    ["Round70导入清单", "/outputs/mobile_app_handoff/figma_import_pack/figma_import_manifest_round70.json"],
    ["Round70设计Tokens", "/outputs/mobile_app_handoff/figma_import_pack/medpath_mobile_tokens_round70.json"],
    ["Round70复建脚本", "/outputs/mobile_app_handoff/figma_import_pack/figma_use_rebuild_mobile_app_round70.js"],
  ];
  const appTabs = ["首页", "路线", "方法", "文章", "模型", "复核"];
  return shell(`
    <div class="page-heading">
      <span>Mobile App Blueprint · 手机端产品路线</span>
      <h1>把科研新手的每一步，做成手机里能看懂、能试走、能交付的学习路径</h1>
      <p>手机端不是网页缩小版，而是一个随身科研向导：它用任务卡承接“我不会开始”的焦虑，用方法详情页讲清“这个方法到底干什么”，再把模型调用、数据审查、文章Skill和教师复核连接成可归档流程。</p>
    </div>
    ${productNav([["#mobile-scenarios", "使用场景", "按科研时刻进入"], ["#mobile-prototype", "手机原型", "六屏产品样机"], ["#mobile-learning", "学习路径", "从0到交付"], ["#mobile-flow", "功能地图", "每屏解决什么"], ["#mobile-handoff", "设计交付", "Figma与开发说明"]])}
    <section class="mobile-hero-band">
      <div class="mobile-hero-copy">
        <span class="eyebrow">Research Companion in Pocket</span>
        <h2>打开手机后，先看到下一步行动，而不是一堆不知道该点哪里的按钮。</h2>
        <p>页面会根据“想做什么”自动推荐方法族、文章类型、图形方案、数据审查和Skill调用链。每个任务都配有示例图、来源说明、常见错误、模型请求包和教师复核提示。</p>
        <div class="mobile-proof-grid">${proofItems.map((item) => `<article><span>${item.k}</span><strong>${item.v}</strong><p>${item.d}</p></article>`).join("")}</div>
      </div>
      <div class="mobile-device-cluster" aria-label="手机端核心界面预览">
        ${phoneScreens.map((screen, index) => `<div class="phone-frame phone-${index + 1}">
          <div class="phone-status"><span>MedPath</span><span>09:${20 + index}</span></div>
          <div class="phone-app-title"><small>${screen.label}</small><strong>${screen.heading}</strong></div>
          <div class="phone-lines">${screen.lines.map((line) => `<p>${line}</p>`).join("")}</div>
          <button class="phone-action">${screen.action}</button>
          <div class="phone-tabbar">${appTabs.map((tab, tabIndex) => `<span class="${tabIndex === Math.min(index, appTabs.length - 1) ? "active" : ""}">${tab}</span>`).join("")}</div>
        </div>`).join("")}
      </div>
    </section>
    <section class="section" id="mobile-scenarios">
      ${sectionTitle("六个高频使用时刻", "每个入口都写给第一次做科研的人", "这些场景会映射到网页已有的方法库、文章工坊、科研绘图室、模型网关、治理审计和Skill运行页面。")}
      <div class="mobile-scene-grid">${appScenes.map((scene, index) => `<article>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <h3>${scene.title}</h3>
        <p>${scene.action}</p>
        <a class="text-link" href="${scene.route}" data-link>${scene.routeText}</a>
      </article>`).join("")}</div>
    </section>
    <section class="section mobile-product-story" id="mobile-prototype">
      ${sectionTitle("六屏手机端信息架构", "用少量屏幕承载完整科研闭环", "移动端重点服务碎片化学习、任务提醒、材料审查、模型配置状态和教师反馈，不替代桌面端的复杂配置。")}
      <div class="mobile-story-row">
        <div><h3>首页像任务仪表盘</h3><p>显示今天要完成的三件事：读懂一个方法、准备一份数据、检查一段AI输出。每个任务卡都标明预计耗时、输出材料和是否需要教师复核。</p></div>
        <div><h3>详情页像产品说明书</h3><p>点进一个方法后，先看到它解决什么问题，再看到输入、步骤、示例图、常见错误、适用文章类型和可调用的Skill，避免“只知道名词、不知道用途”。</p></div>
        <div><h3>模型页只解释配置状态</h3><p>手机端不展示密钥，也不引导保存密钥；它只告诉用户当前使用mock模式还是已配置API，并把生成请求送入统一审查链。</p></div>
        <div><h3>桌宠承担引导而非装饰</h3><p>小向导只在用户卡住时出现，例如数据不规范、方法选择冲突、文章类型不匹配或输出需要伦理审计时，给出下一步建议。</p></div>
      </div>
    </section>
    <section class="section" id="mobile-learning">
      ${sectionTitle("从0到交付的手机学习路径", "一条路径对应一个最终可提交成果", "路径默认不生成真实结论，只生成计划、模板、检查表和待复核草稿。")}
      <div class="learning-rail mobile-learning-rail">
        ${journeySteps.map(([num, title, text]) => `<article><span>${num}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}
      </div>
    </section>
    <section class="section" id="mobile-flow">
      ${sectionTitle("每一屏到底解决什么", "把手机端功能拆成可以交付给Figma和前端的设计单元", "这些说明用于本地Figma导入包与后续iOS/Android原型，不宣称已发布原生App。")}
      <div class="mobile-screen-spec-grid">
        ${screenSpecs.map(([title, text], index) => `<article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </article>`).join("")}
      </div>
    </section>
    <section class="section mobile-demand-window">
      ${sectionTitle("需求描述窗口", "把模糊想法变成可执行Skill", "正式版将接入用户自己的模型API；当前网页用于展示输入结构和审查逻辑。")}
      <div class="two-col">
        <div class="form-panel">
          <label>我现在想完成的任务</label>
          <textarea>我想写一篇肿瘤免疫治疗相关的Meta分析，但不知道从检索、纳排、质量评价到森林图应该怎么开始。</textarea>
          <button class="btn" onclick="navigate('/article-workshop/meta-analysis')">生成文章全流程</button>
        </div>
        <div class="result rich-result">
          <h3>手机端将返回的不是一段泛泛回答</h3>
          <p>它会返回PICO问题、检索式草稿、数据库选择、纳排标准、偏倚风险工具、数据提取表、图形清单、统计前提、伦理边界和可调用Skill链。若用户数据不规范，系统先提示该补什么，而不是直接生成漂亮但不可复核的图。</p>
          <p class="soft-note">${SAFETY}</p>
        </div>
      </div>
    </section>
    <section class="section" id="mobile-handoff">
      ${sectionTitle("Figma与开发交付路线", "先以网页原型固化信息架构，再迁移到手机端设计稿", "当前本地页面就是移动端产品蓝图，可继续在Figma中重绘为iOS/Android高保真界面。")}
      <div class="handoff-board-frame">
        <img src="/outputs/mobile_app_handoff/medpath_mobile_app_round70_handoff.svg" alt="MedPath手机端Round70六屏Figma交付设计板" loading="eager" />
        <p>这张Round70设计板由本地脚本生成，可拖入Figma继续拆分为组件：今日任务卡、方法详情页、示例图学习区、文章Skill流程、模型网关状态、教师复核清单和桌宠对话。当前交付的是本地Figma导入包，不声称已经创建线上Figma文件或发布原生App。</p>
        <div class="actions">
          ${handoffLinks.map(([label, href], index) => `<a class="btn ${index ? "ghost" : ""}" href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join("")}
        </div>
      </div>
      <div class="mobile-scene-grid">
        <article><span>A</span><h3>组件层</h3><p>任务卡、方法故事页、示例图卡、文章流程卡、模型状态条、审计提示、桌宠对话和教师复核表分别做成可复用组件。</p></article>
        <article><span>B</span><h3>数据层</h3><p>从方法库、图谱库、文章Skill、开源工具库和模型网关读取内容，手机端不另起一套孤立数据。</p></article>
        <article><span>C</span><h3>安全层</h3><p>模型输出、HPC任务、案例生成和医学建议都进入边界标注、人工复核和审计记录，不让草稿越过教学用途。</p></article>
        <article><span>D</span><h3>Figma导入包</h3><p>包含设计tokens、六个核心屏幕、可拖入SVG和Figma复建脚本；Figma连接恢复后可迁移为云端设计文件。</p></article>
      </div>
    </section>
  `);
}

function pluginsPage() {
  return shell(`
    <div class="page-heading"><span>Plugin Hub 插件中心</span><h1>把多个Skill打包成能打开、能试用、能审计的能力插件</h1><p>卡片固定展示：解决什么问题、需要什么输入、产生什么输出、安全边界和starter prompts。</p></div>
    <div id="plugins-list" class="plugin-grid"></div>
  `);
}

function pluginCard(p) {
  const profiles = {
    teaching: {
      solve: "把课程设计、病理案例、报告反馈和教学评价串成可复核教学链。",
      input: "课程主题、学生层次、病种/器官、报告草稿、教师要求。",
      output: "课程草案、PBL问题链、报告反馈、D10评价字段和教师复核清单。",
      boundary: "只用于教学训练，不给真实临床诊断或处置建议。",
    },
    research: {
      solve: "把科研训练、RAG/知识图谱、开源工具和方法运行说明组织起来。",
      input: "研究问题、数据类型、公开/脱敏材料、目标产物。",
      output: "方法选择建议、工具导航、运行步骤、误区提示和待核验来源。",
      boundary: "仅作为科研学习和假设生成线索，真实结论需独立验证。",
    },
    governance: {
      solve: "在AI输出进入课程或科研训练前，先做风险审计和质量评价。",
      input: "AI生成文本、案例草案、引用列表、评分任务。",
      output: "隐私/幻觉/临床误导风险标签、rubric评分字段和复核要求。",
      boundary: "所有高风险输出必须隔离并人工复核。",
    },
  };
  const profile = profiles[p.id] || profiles.teaching;
  const related = p.skills.map((sid) => state.skills.find((s) => s.id === sid)).filter(Boolean);
  return `<article class="plugin-card">
    <div class="plugin-head">
      <div class="plugin-icon">${p.zh_name?.slice(0, 1) || "插"}</div>
      <div><h3>${p.zh_name || p.name}</h3><p>${p.name}</p></div>
    </div>
    <p>${p.description}</p>
    <div class="capability-grid">
      <div><span>能解决的问题</span><strong>${profile.solve}</strong></div>
      <div><span>需要的输入</span><strong>${profile.input}</strong></div>
      <div><span>产生的输出</span><strong>${profile.output}</strong></div>
      <div><span>安全边界</span><strong>${profile.boundary}</strong></div>
    </div>
    <div class="starter-list">${p.starter_prompts.map((x) => `<button class="starter" onclick="navigate('/plugins/${p.id}')">${x}</button>`).join("")}</div>
    <label class="switch"><input type="checkbox" ${state.pluginEnabled[p.id] ? "checked" : ""} onchange="togglePlugin('${p.id}', this.checked)"/><span></span>启用本地demo</label>
    <div class="actions"><button class="btn" onclick="navigate('/plugins/${p.id}')">打开插件</button><button class="btn ghost" onclick="navigate('/skills/${p.skills[0]}')">看Skill</button></div>
  </article>`;
}

function pluginDetailPage(pluginId) {
  const plugin = state.plugins.find((p) => p.id === pluginId);
  if (!plugin) return shell(`<h1>插件不存在</h1><p>未找到 ${pluginId}</p>`);
  const related = plugin.skills.map((sid) => state.skills.find((s) => s.id === sid)).filter(Boolean);
  return shell(`
    <div class="page-heading"><span>插件详情</span><h1>${plugin.zh_name || plugin.name}</h1><p>${plugin.description}</p></div>
    <section class="two-col">
      <div class="panel">
        <h2>这个插件怎么用</h2>
        <ol class="timeline">
          <li>选择一个starter prompt，确认输入材料不含真实患者隐私。</li>
          <li>平台自动调用包含的Skill，生成草案和复核点。</li>
          <li>伦理治理Skill检查隐私、临床误导和伪造引用风险。</li>
          <li>教师或专家复核后，才可进入课程或科研训练材料。</li>
        </ol>
        <h2>Starter prompts</h2>
        ${plugin.starter_prompts.map((x) => `<button class="starter wide">${x}</button>`).join("")}
      </div>
      <div class="panel">
        <h2>权限与边界</h2>
        <p>${SAFETY}</p>
        <p>当前只运行本地demo或mock API；不声称接入真实D03/D10，不上传外部平台。</p>
        <h2>包含的Skill</h2>
        <div class="compact-list">${related.map((s) => `<a href="/skills/${s.id}" data-link>${s.zh_name}<small>${s.en_name}</small></a>`).join("")}</div>
      </div>
    </section>
  `);
}

function skillDetailPage(skillId) {
  const s = state.skills.find((x) => x.id === skillId);
  if (!s) return shell(`<h1>Skill不存在</h1><p>未找到 ${skillId}</p>`);
  return shell(`
    <div class="page-heading"><span>Skill详情</span><h1>${s.zh_name}</h1><p>${s.description}</p></div>
    <section class="skill-layout">
      <div class="panel">
        <h2>新手解释</h2><p>${s.beginner_explanation || s.description}</p>
        <h2>什么时候用</h2><p>${s.when_to_use || "当任务需要结构化、可复核输出时使用。"}</p>
        <h2>输入要求</h2><p>${s.input_requirements || s.demo_input}</p>
        <h2>输出怎么看</h2><p>${s.output_interpretation || s.demo_output}</p>
      </div>
      <div class="panel">
        <h2>常见误区</h2>${list(s.common_pitfalls || [])}
        <h2>学习路径</h2>${list(s.learning_path || [], "numbered")}
        <h2>评价量规</h2><p>${(s.evals || []).map((x) => badge(x, "blue")).join("")}</p>
        <button class="btn" onclick="alert('已运行本地demo：${s.id}。输出只用于教学/科研训练，需人工复核。')">运行demo</button>
      </div>
      <div class="panel code-panel">
        <h2>SKILL.md预览</h2><pre>${escapeHtml(s.skill_md)}</pre>
      </div>
    </section>
  `);
}

function simulatePage() {
  return shell(`
    <div class="page-heading"><span>Case Simulation Lab</span><h1>生成可复核的合成教学案例</h1><p>案例用于课堂训练和科研启蒙，不是真实患者材料。生成后会显示Skill调用链、伦理审计和教师复核清单。</p></div>
    <div class="actions"><button class="btn" onclick="navigate('/simulate/new')">新建案例</button><button class="btn ghost" onclick="navigate('/simulate/demo-case-001')">打开示例案例</button></div>
    <div class="case-grid section">${state.cases.slice(0, 8).map((c) => `<article class="case-card"><span>${c.difficulty}</span><h3>${c.title}</h3><p>${c.boundary}</p><button class="btn ghost" onclick="navigate('/simulate/${c.id}')">查看案例</button></article>`).join("")}</div>
  `);
}

function simulateNewPage() {
  return shell(`
    <div class="page-heading"><span>案例生成</span><h1>从教学目标生成合成病理案例</h1><p>选择疾病系统、难度和学生层次后，平台会生成合成背景、镜下要点、PBL问题、报告训练和伦理审计。</p></div>
    <section class="two-col">
      <div class="form-panel">
        <div class="form-grid">
          <div><label>疾病系统</label><input id="sim-system" value="消化系统"/></div>
          <div><label>器官系统</label><input id="sim-organ" value="胃黏膜"/></div>
          <div><label>学生年级</label><input id="sim-level" value="本科三年级"/></div>
          <div><label>难度</label><select id="sim-difficulty"><option>基础</option><option selected>进阶</option><option>挑战</option></select></div>
          <div class="full"><label>教学目标</label><input id="sim-goal" value="训练胃腺癌病理PBL推理与报告表达"/></div>
        </div>
        <button class="btn" id="sim-generate">生成案例</button>
      </div>
      <div class="guide-panel">
        <h2>生成逻辑</h2>
        <div class="flowline small"><div>规则约束</div><div>知识核验</div><div>伦理审计</div><div>教师复核</div></div>
        <p>当前demo用本地合成案例和mock模型，不使用真实患者数据。真实课程使用前必须由课程团队审核。</p>
      </div>
    </section>
    <div id="sim-result" class="result rich-result">等待生成。</div>
  `);
}

function caseDetailPage(caseId) {
  const c = state.cases.find((x) => x.id === caseId) || state.cases[0];
  return shell(`
    <div class="page-heading"><span>合成案例详情</span><h1>${c.title}</h1><p>${c.boundary}</p></div>
    <section class="case-detail-grid">
      <div class="panel"><h2>合成背景</h2><p>${c.background}</p><h2>镜下描述</h2>${list(c.microscopy)}<h2>免疫组化</h2><p>${c.ihc.map((x) => badge(x, "blue")).join("")}</p></div>
      <div class="panel"><h2>PBL问题</h2>${list(c.pbl_questions, "numbered")}<h2>报告训练题</h2><p>${c.report_prompt}</p><h2>科研拓展</h2><p>${c.research_extension || "可进一步设计文献检索、机制解释和图表审计任务。"}</p></div>
      <div class="panel"><h2>伦理审计</h2>${list(c.ethics_audit)}<h2>教师复核清单</h2>${list(c.teacher_review)}<button class="btn">导出教学片段</button></div>
    </section>
  `);
}

function comparePage() {
  return shell(`
    <div class="page-heading"><span>Comparison Lab</span><h1>传统方式、普通提示词、规范化Skill的对照框架</h1><p>这里是评价设计与模板，不写成真实课程效果。真实分数、p值、满意度均需项目期实测。</p></div>
    <div class="choice-row">${state.comparisons.map((d) => `<button class="chip" onclick="setCompare('${d.id}')">${d.title}</button>`).join("")}</div>
    <div id="compare-result" class="section"></div>
  `);
}

function evidencePage() {
  return shell(`
    <div class="page-heading"><span>Evidence Gallery</span><h1>把申请书里的“可评价”落成证据结构</h1><p>当前全部为评价模板和待实测证据链，不伪造成效数据。</p></div>
    <div class="evidence-grid">${state.comparisons.map((d) => `<article><h3>${d.title}</h3><p>${d.note}</p><button class="btn ghost" onclick="setCompare('${d.id}'); navigate('/compare')">查看对照框架</button></article>`).join("")}</div>
  `);
}

function sourceLibraryEntries() {
  const entries = [];
  const add = (entry) => entries.push({
    sourcePlatform: "公开来源/教学示例",
    boundary: "仅用于教学与科研训练；不复制论文原图，不下载受控数据，不冒充真实研究结果。",
    tags: [],
    visualUrl: "",
    ...entry,
  });
  state.methodUniverse.slice(0, 180).forEach((m) => {
    const visual = m.example_visual || {};
    const source = m.public_source_example || {};
    add({
      id: `method-${m.id}`,
      kind: "method",
      kindLabel: "方法",
      title: m.name,
      subtitle: m.beginner_question || m.category,
      description: m.detail_novice_intro || m.what_it_solves || "方法卡用于把研究问题拆成输入、流程、图谱和复核清单。",
      visualUrl: visual.url,
      visualTitle: visual.title || `${m.name}示例图`,
      sourceTitle: source.title || visual.source_title || "教学改绘示例图",
      citation: source.citation || visual.source_note || "来源线索待核对",
      sourcePlatform: source.source_platform || visual.source_platform || "方法示例图",
      boundary: source.reuse_boundary || visual.reuse_boundary || m.safety_boundary,
      route: routePath("/method-universe", m.id),
      tags: [m.category, "方法学习", (m.outputs || [])[0]].filter(Boolean),
    });
  });
  state.articleWorkflows.forEach((w) => {
    const visual = w.example_visual || {};
    const source = w.public_source_example || {};
    add({
      id: `article-${w.id}`,
      kind: "article",
      kindLabel: "文章",
      title: w.type,
      subtitle: w.article_product_title || w.article_reporting_focus,
      description: w.detail_novice_intro || w.article_hero_subtitle || "文章流程卡用于从题型反推材料、图表、Skill链和复核边界。",
      visualUrl: visual.url,
      visualTitle: visual.title || `${w.type}流程示例图`,
      sourceTitle: source.title || "公开来源线索",
      citation: source.citation || visual.source_note || "引用线索待核对",
      sourcePlatform: source.source_platform || "cBioPortal public API",
      boundary: source.reuse_boundary || visual.reuse_boundary || w.safety_boundary,
      route: routePath("/article-workshop", w.id),
      tags: [w.type, "文章流程", (w.skills_to_call || [])[0]].filter(Boolean),
    });
  });
  state.plotGallery.forEach((p) => {
    const visual = p.example_visual || {};
    const source = p.public_source_example || {};
    add({
      id: `plot-${p.id}`,
      kind: "plot",
      kindLabel: "图谱",
      title: p.zh_name || p.en_name || p.id,
      subtitle: p.question_answered || p.category,
      description: p.plot_story || p.output_interpretation || "图谱卡用于把科研问题、字段契约、示例图和复核规则对齐。",
      visualUrl: visual.url,
      visualTitle: visual.title || `${p.zh_name || p.id}示例图`,
      sourceTitle: source.title || visual.source_title || "脚本生成教学示例图",
      citation: source.citation || visual.source_note || "示例来源待核对",
      sourcePlatform: source.source_platform || visual.source_platform || "教学改绘/合成示例",
      boundary: source.reuse_boundary || visual.reuse_boundary || p.example_dataset_status,
      route: routePath("/plot-gallery", p.id),
      tags: [p.category, p.en_name, "字段契约"].filter(Boolean),
    });
  });
  state.openSource.forEach((tool) => {
    const visual = tool.example_visual || {};
    const source = tool.public_source_example || {};
    add({
      id: `tool-${tool.id || tool.name}`,
      kind: "tool",
      kindLabel: "工具",
      title: tool.name,
      subtitle: tool.tool_product_title || tool.beginner_explanation || tool.category,
      description: tool.short_description || tool.output_interpretation || "工具卡用于核对用途、license、最小示例、失败日志和人工复核边界。",
      visualUrl: visual.url,
      visualTitle: visual.title || `${tool.name}示例图`,
      sourceTitle: source.title || "原仓库/公开教程线索",
      citation: source.citation || tool.license || "license待人工核对",
      sourcePlatform: source.source_platform || "GitHub/官方文档线索",
      boundary: source.reuse_boundary || visual.reuse_boundary || tool.risk_notes,
      route: routePath("/open-source", tool.id || tool.name),
      externalUrl: tool.repo_url,
      tags: [tool.category, tool.can_run_in_platform, "开源工具"].filter(Boolean),
    });
  });
  state.publicSources.slice(0, 80).forEach((s) => {
    const visual = state.publicSourceVisuals.find((x) => (x.source_ids || []).includes(s.id)) || {};
    add({
    id: `source-${s.id}`,
    kind: "source",
    kindLabel: "公开来源",
    title: s.title,
    subtitle: s.tier || s.cancer_type || s.query_keyword,
    description: s.description,
    visualUrl: visual.png_url || visual.visual_url || "",
    visualTitle: "公开数据来源线索",
    sourceTitle: s.title,
    citation: s.citation || "正式引用待核对",
    sourcePlatform: s.source_platform,
    boundary: s.reuse_boundary || s.license_note,
    route: routePath("/source-library", s.id),
    externalUrl: s.url,
    tags: [s.query_keyword, s.cancer_type, s.reference_genome, visual.id ? "可复现示例图" : ""].filter(Boolean),
    });
  });
  return entries;
}

function publicSourceDetailPage(sourceId) {
  const source = state.publicSources.find((x) => x.id === sourceId);
  if (!source) return shell(`<div class="page-heading"><span>Source Detail</span><h1>公开来源不存在</h1><p>没有找到 ${escapeHtml(sourceId)}，请返回证据来源库重新选择。</p><button class="btn" onclick="navigate('/source-library')">返回证据来源库</button></div>`);
  const visualExamples = state.publicSourceVisuals.filter((x) => (x.source_ids || []).includes(sourceId));
  const sourceText = `${source.title || ""} ${source.description || ""} ${source.cancer_type || ""} ${source.query_keyword || ""}`.toLowerCase();
  const linkedMethods = state.methodUniverse
    .filter((m) => `${m.name || ""} ${m.category || ""} ${m.beginner_question || ""} ${m.what_it_solves || ""}`.toLowerCase().split(/\s+/).some((word) => word && sourceText.includes(word)))
    .slice(0, 4);
  const methodFallback = state.methodUniverse
    .filter((m) => ["差异", "突变", "生存", "通路", "机器学习", "RAG"].some((kw) => `${m.name || ""} ${m.category || ""} ${m.beginner_question || ""}`.includes(kw)))
    .slice(0, 4);
  const methods = linkedMethods.length ? linkedMethods : methodFallback;
  const plots = state.plotGallery
    .filter((p) => ["突变", "差异", "生存", "热图", "网络", "队列"].some((kw) => `${p.zh_name || ""} ${p.en_name || ""} ${p.category || ""} ${p.answers_question || ""}`.includes(kw)))
    .slice(0, 5);
  const workflows = state.articleWorkflows
    .filter((w) => ["数据", "队列", "机器学习", "综述", "机制", "教学"].some((kw) => `${w.type || ""} ${w.article_reporting_focus || ""} ${w.article_hero_subtitle || ""}`.includes(kw)))
    .slice(0, 4);
  const boundary = source.reuse_boundary || source.license_note || "本条目只作为公开来源线索和教学示例入口；正式研究须回到原数据库、原论文和许可条款核对。";
  const sourceUrl = source.url || "#";
  return shell(`
    ${productNav([["#source-identity", "来源身份", "先确认它是什么"], ["#source-learning", "学习路径", "从数据源到案例"], ["#source-methods", "连接方法", "接入方法与图谱"], ["#source-demand", "需求窗口", "把你的任务写清楚"]])}
    <div class="page-heading product-heading"><span>Public Source Detail</span><h1>${escapeHtml(source.title || "公开数据来源")}</h1><p>${escapeHtml(source.description || "本页用于把公开来源线索转译为教学案例、图谱示例和研究训练任务。")}</p></div>
    <section class="source-detail-hero" id="source-identity">
      <div class="source-detail-copy">
        <span class="product-kicker">${escapeHtml(source.source_platform || "公开数据库")}</span>
        <h2>把一个公开队列，转成科研新手能读懂的任务入口。</h2>
        <p>这个页面不复制论文原图，也不下载受控数据。它把公开元数据、引用线索、病种范围和许可边界整理成可学习的路线：先知道数据源能回答什么问题，再决定应该接哪类方法、哪类图谱和哪类文章流程。</p>
        <p class="soft-note">医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置；所有案例、图注和解释文字均需教师或专家复核。</p>
        ${productProofStrip([
          ["病种/主题", source.cancer_type || source.query_keyword || "待核对", "用于快速判断是否匹配你的研究问题"],
          ["引用线索", source.citation || "待核对正式引用", "正式写作前必须回到原始出处核验"],
          ["平台入口", source.source_platform || "公开来源", "仅作为检索入口，不代表本站托管原始数据"],
        ])}
        <div class="product-cta-row">
          <a class="btn" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">打开公开来源</a>
          <button class="btn ghost" onclick="document.getElementById('source-demand')?.scrollIntoView({behavior:'smooth'})">描述我的任务</button>
        </div>
      </div>
      <div class="source-detail-orbit">
        ${visualExamples[0]
          ? `<img class="source-detail-figure" src="${escapeHtml(assetUrl(visualExamples[0].png_url || visualExamples[0].visual_url))}" alt="${escapeHtml(visualExamples[0].title)}" />`
          : `<div class="source-orbit large"><span>${escapeHtml(source.query_keyword || source.cancer_type || "SOURCE")}</span><small>${escapeHtml(source.reference_genome || "metadata")}</small></div>`}
        <p>${escapeHtml(boundary)}</p>
      </div>
    </section>
    ${productFeatureStory({
      label: "来源读法",
      title: `把 ${source.title || "公开来源"} 读成一个可复核的科研训练任务`,
      subtitle: "新手最容易犯的错误，是看到一个公开队列就直接让模型写结论。这里把来源拆成四层：它来自哪里、能回答什么、适合接哪些方法、最后由谁复核。",
      visual: visualExamples[0]
        ? { url: visualExamples[0].png_url || visualExamples[0].visual_url, title: visualExamples[0].title, reuse_boundary: visualExamples[0].reuse_boundary }
        : { url: "", title: source.title || "公开来源证据卡", reuse_boundary: boundary },
      source: { title: source.title || "公开来源", source_platform: source.source_platform || "公开数据库", url: sourceUrl },
      panels: [
        { title: "先把来源身份讲清楚", body: `这一步只记录 ${source.source_platform || "公开数据库"} 的研究名称、病种范围、引用线索、许可边界和可公开使用范围。它解决的是“我能不能用这条线索做教学训练”，不是直接证明研究结论。`, action: "打开原始来源页，核对标题、PMID、研究对象和数据下载边界。", pitfall: "不要把来源线索写成本站已经完成的真实队列分析。" },
        { title: "再把它改写成学生能理解的问题", body: `围绕 ${source.cancer_type || source.query_keyword || "该研究主题"} 提出一个可教学的问题，例如突变类型如何分布、图表要回答什么、学生需要先掌握哪些知识。`, action: "把问题限定在教学解释、方法练习或图表复现，不扩展到临床判断。", pitfall: "不要让模型直接给出治疗建议或诊断结论。" },
        { title: "接上方法、图谱和文章流程", body: "当来源、问题和边界清楚以后，平台才推荐方法卡、图谱卡和文章流程卡。这样新手点进去看到的不是孤立工具，而是一条可走完的学习路径。", action: "查看下方推荐方法、推荐图谱和文章流程，再用需求窗口生成任务包。", pitfall: "不要用不满足字段契约的数据硬画图。" },
        { title: "最后进入教师复核和伦理审计", body: "所有由来源生成的案例、图注、流程和模型提示都需要保留教师复核点。页面不会把教学改绘图、合成案例或模型输出写成真实结果。", action: "导出复核清单，标注“教学/示意/待核验”。", pitfall: "不要复制论文原图，不要下载受控数据，不要使用患者隐私。" }
      ],
      proofItems: [
        ["来源", source.citation || "引用待核对", "正式写作前回到原数据库和原文核验"],
        ["图例", visualExamples[0] ? "已有公开API教学重绘图" : "暂未绑定重绘图", "示例图不代表临床结论"],
        ["边界", "教学与科研训练", "不替代临床诊断，不用于真实患者处置"]
      ],
      promptExamples: [
        `基于${source.title || "这个公开来源"}设计一个本科病理教学案例，但只使用公开元数据和教学改写。`,
        `请帮我判断${source.title || "这个来源"}适合做哪些图，不要生成真实研究结论。`,
        `围绕${source.cancer_type || "该病种"}生成方法学习路径、图谱计划和教师复核清单。`
      ],
      className: "source-product-story",
      anchor: "source-story",
      context: { audience: "科研新手、课程团队、研究生", output: "来源登记、任务包、图表计划、复核清单" }
    })}
    ${visualExamples.length ? `<section class="section source-visual-evidence" id="source-visual">
      ${sectionTitle("这个来源已经有一张可复现教学示例图", "图由公开API数据和本地脚本生成，不复制论文原图，也不声称为真实研究结论")}
      ${visualExamples.map((v) => `<article class="source-visual-card">
        <div class="source-visual-frame"><img src="${escapeHtml(assetUrl(v.png_url || v.visual_url))}" alt="${escapeHtml(v.title)}" loading="lazy" /></div>
        <div class="source-visual-copy">
          <span class="product-kicker">${escapeHtml(v.source_platform || "公开数据复现")}</span>
          <h3>${escapeHtml(v.title)}</h3>
          <p>${escapeHtml(v.figure_question || v.subtitle || "")}</p>
          <div class="source-visual-meta">
            <div><strong>脚本</strong><code>${escapeHtml(v.script || "待补充")}</code></div>
            <div><strong>数据表</strong><code>${escapeHtml(v.source_data || "待补充")}</code></div>
            <div><strong>引用</strong><span>${escapeHtml(v.citation || "正式引用待核验")}</span></div>
          </div>
          <h4>适合训练</h4>${list(v.teaching_use || [])}
          <h4>可连接方法</h4><p>${(v.recommended_methods || []).map((x) => badge(x, "blue")).join("")}</p>
          <h4>可连接图谱</h4><p>${(v.recommended_plots || []).map((x) => badge(x, "green")).join("")}</p>
          <p class="soft-note">${escapeHtml(v.reuse_boundary || v.safety_boundary || SAFETY)}</p>
        </div>
      </article>`).join("")}
    </section>` : ""}
    <section class="section source-learning-path" id="source-learning">
      ${sectionTitle("从公开来源到教学案例的四步", "每一步都保留核验点，避免把来源线索误写成已经完成的研究结果")}
      <div class="checkpoint-flow source-checkpoint-flow">
        ${[
          ["01", "确认来源身份", `核对 ${source.title || "该来源"} 的数据库入口、引用线索、病种范围、样本说明和许可边界。`, "输出：来源登记卡、引用待核验清单、不可下载/不可复刻提醒。"],
          ["02", "转译成教学问题", `围绕 ${source.cancer_type || source.query_keyword || "该主题"} 设计一个可被学生理解的问题，例如突变谱、分型、预后、治疗反应或机制解释。`, "输出：PBL问题链、报告训练提示、科研拓展任务。"],
          ["03", "选择方法与图谱", "根据任务选择差异分析、生存分析、突变景观、热图、网络、机器学习或综述流程，并先做数据字段审查。", "输出：方法链、图谱链、数据字段清单。"],
          ["04", "进入复核与标注", "所有模型生成的案例、图注、解释文字都进入教师复核，不把教学示例写成真实发现。", "输出：伦理审计、教师复核表、D10评价字段。"],
        ].map(([no, title, body, proof]) => `<article class="method-checkpoint">
          <div class="checkpoint-number"><span>${no}</span><small>source</small></div>
          <div class="checkpoint-main"><p class="checkpoint-eyebrow">公开来源学习站</p><h3>${title}</h3><p>${body}</p><div class="checkpoint-proof"><strong>可交付物</strong><span>${proof}</span></div></div>
        </article>`).join("")}
      </div>
    </section>
    <section class="section source-linked-grid" id="source-methods">
      ${sectionTitle("它可以连接哪些方法、图谱和文章流程", "这里给的是学习路线，不是自动生成真实结论")}
      <div class="source-detail-columns">
        <article><h3>推荐方法入口</h3>${methods.map((m) => `<a href="${escapeHtml(routePath('/method-universe', m.id))}" data-link><strong>${escapeHtml(m.name)}</strong><span>${escapeHtml(m.beginner_question || m.what_it_solves || "查看方法详情")}</span></a>`).join("")}</article>
        <article><h3>推荐图谱入口</h3>${plots.map((p) => `<a href="${escapeHtml(routePath('/plot-gallery', p.id))}" data-link><strong>${escapeHtml(p.zh_name || p.en_name || p.id)}</strong><span>${escapeHtml(p.answers_question || p.question_answered || "查看图谱详情")}</span></a>`).join("")}</article>
        <article><h3>推荐文章流程</h3>${workflows.map((w) => `<a href="${escapeHtml(routePath('/article-workshop', w.id))}" data-link><strong>${escapeHtml(w.type)}</strong><span>${escapeHtml(w.article_reporting_focus || w.article_hero_subtitle || "查看文章流程")}</span></a>`).join("")}</article>
      </div>
    </section>
    <section class="section demand-lab" id="source-demand">
      ${sectionTitle("需求描述窗口", "把你想用这个公开来源做什么说清楚，平台会先给任务拆解与审查清单")}
      <div class="demand-grid">
        <div class="form-panel">
          <label>我想基于这个来源完成什么科研/教学任务？</label>
          <textarea id="source-demand-text">我想基于${escapeHtml(source.title || "这个公开数据来源")}设计一个适合本科生理解的病理学教学案例，并生成推荐方法、图谱、文章流程和教师复核清单。</textarea>
          <button class="btn" id="source-demand-build" data-source="${escapeHtml(source.id)}">生成来源任务包</button>
        </div>
        <div id="source-demand-result" class="result rich-result">
          <h3>生成后这里会出现</h3>
          <p>来源登记、可用任务、方法/图谱/文章链、模型提示词、不可声称内容和教师复核清单。</p>
        </div>
      </div>
    </section>
  `);
}

function renderSourceTaskPackage(sourceId, demandText) {
  const source = state.publicSources.find((x) => x.id === sourceId) || {};
  const topic = source.cancer_type || source.query_keyword || "公开医学数据来源";
  const prompt = [
    `请围绕公开来源“${source.title || "待核对来源"}”设计一个教学/科研训练任务。`,
    `用户需求：${demandText}`,
    "请输出：来源核验清单、可回答问题、推荐方法、推荐图谱、文章流程、模型输出边界、教师复核问题。",
    "不得编造真实结果、p值、疗效结论、患者信息或未核验引用；医学内容仅用于教学与科研训练，不替代临床诊断。",
  ].join("\n");
  return `<h2>${escapeHtml(topic)} 来源任务包</h2>
    <p><strong>来源：</strong>${escapeHtml(source.title || "待核对来源")}；<strong>引用线索：</strong>${escapeHtml(source.citation || "待核对正式引用")}</p>
    ${renderDemandInsightPanel({ kind: "source", title: topic, demand: demandText, object: source, skillChain: ["medical-kg-rag-builder", "research-copilot", "ai-ethics-governor"], plots: state.plotGallery.slice(0, 3), source })}
    <div class="task-package-grid">
      <article><h3>先核验</h3>${list(["打开原数据库页面核对研究名称", "核对原论文和PMID", "确认是否只使用公开元数据", "记录不可下载或不可复刻的数据边界"], "numbered")}</article>
      <article><h3>可做任务</h3>${list(["教学PBL案例", "公开队列方法演示", "图谱复现实训", "文章流程训练", "伦理审计示例"], "numbered")}</article>
      <article><h3>不能声称</h3>${list(["不能写成本站已完成真实研究", "不能复制论文原图", "不能下载受控数据", "不能生成临床诊断或治疗建议"], "numbered")}</article>
      <article><h3>教师复核</h3>${list(["任务是否适合学生阶段", "数据来源是否可追溯", "图表是否标注示意/教学", "解释是否越过临床边界"], "numbered")}</article>
    </div>
    <h3>可复制到模型网关的提示词</h3>
    <pre>${escapeHtml(prompt)}</pre>
    <p class="soft-note">本任务包只生成学习路线和审查清单，不生成或伪造真实研究结论。</p>`;
}

function sourceLibraryCard(entry) {
  const src = entry.visualUrl ? assetUrl(entry.visualUrl) : "";
  const tagText = (entry.tags || []).slice(0, 4).map((x) => badge(x, "blue")).join("");
  const primaryAction = entry.route
    ? `<button class="btn" onclick="navigate('${escapeHtml(entry.route)}')">进入对应详情</button>`
    : `<button class="btn" onclick="window.open('${escapeHtml(entry.externalUrl || "#")}','_blank')">打开公开来源</button>`;
  const externalAction = entry.externalUrl
    ? `<button class="btn ghost" onclick="window.open('${escapeHtml(entry.externalUrl)}','_blank')">来源入口</button>`
    : "";
  return `<article class="source-library-card" data-kind="${escapeHtml(entry.kind)}">
    <div class="source-library-visual">
      ${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(entry.visualTitle || entry.title)}" loading="lazy" />` : `<div class="source-orbit"><span>${escapeHtml(entry.kindLabel)}</span><small>${escapeHtml(entry.sourcePlatform || "公开来源")}</small></div>`}
    </div>
    <div class="source-library-copy">
      <div class="source-card-top">${badge(entry.kindLabel, entry.kind === "source" ? "green" : "violet")} ${tagText}</div>
      <h3>${escapeHtml(entry.title)}</h3>
      <p class="source-subtitle">${escapeHtml(entry.subtitle || entry.sourceTitle || "")}</p>
      <p>${escapeHtml(entry.description || "")}</p>
      <div class="source-proof-mini">
        <strong>${escapeHtml(entry.sourceTitle || "来源线索")}</strong>
        <span>${escapeHtml(entry.citation || "引用待核对")}</span>
        <small>${escapeHtml(entry.boundary || SAFETY)}</small>
      </div>
      <div class="actions">${primaryAction}${externalAction}</div>
    </div>
  </article>`;
}

function renderSourceLibrary(kind = "all", query = "") {
  const root = el("source-library-list");
  if (!root) return;
  const q = String(query || "").trim().toLowerCase();
  const entries = sourceLibraryEntries()
    .filter((entry) => kind === "all" || entry.kind === kind)
    .filter((entry) => !q || `${entry.kindLabel} ${entry.title} ${entry.subtitle} ${entry.description} ${entry.sourceTitle} ${entry.citation} ${(entry.tags || []).join(" ")}`.toLowerCase().includes(q));
  root.innerHTML = entries.map(sourceLibraryCard).join("");
  const count = el("source-library-count");
  if (count) count.textContent = `${entries.length} 条可追溯示例`;
  document.querySelectorAll("[data-source-filter]").forEach((node) => node.classList.toggle("selected", node.dataset.sourceFilter === kind));
}

function sourceLibraryPage() {
  const entries = sourceLibraryEntries();
  const total = entries.length;
  return shell(`
    <div class="page-heading source-library-hero"><span>Source & Figure Library</span><h1>证据来源库：把每个方法、图谱、文章和工具背后的示例线索放到同一张地图</h1><p>这里汇总本地示例图、公开数据入口、引用线索和使用边界。它帮助科研新手先看“这种方法跑出来的图是什么样”，再进入对应详情页学习；不复制论文原图，不下载受控数据，不把教学示例写成真实研究结果。</p></div>
    <section class="section source-library-console">
      <div>
        <h2>${total}+ 个来源与示例入口</h2>
        <p>每张卡都绑定一个真实学习对象：方法、文章流程、科研图谱、开源仓库或公开数据来源。正式科研仍需回到原数据库、原论文、用户自有数据和导师/教师复核。</p>
      </div>
      <div class="source-library-search">
        <input id="source-library-query" placeholder="搜索：TCGA、火山图、Meta分析、GEARS、基因敲除、cBioPortal..." />
        <span id="source-library-count">${total} 条可追溯示例</span>
      </div>
      <div class="source-filter-row">
        ${[
          ["all", "全部"],
          ["method", "方法"],
          ["article", "文章"],
          ["plot", "图谱"],
          ["tool", "工具"],
          ["source", "公开来源"],
        ].map(([id, label]) => `<button class="chip ${id === "all" ? "selected" : ""}" data-source-filter="${id}">${label}</button>`).join("")}
      </div>
    </section>
    <section class="source-library-grid" id="source-library-list">
      ${entries.map(sourceLibraryCard).join("")}
    </section>
  `);
}

function openSourcePage() {
  return shell(`
    <div class="page-heading"><span>Open Source Navigator</span><h1>开源工具不是“链接堆”，而是可学习、可复核、可迁移的工具卡</h1><p>每个工具都说明用途、输入输出、license待核对状态、常见误区和学习路径。</p></div>
    <div class="search-bar"><input id="os-search" value="virtual perturbation" placeholder="搜索 GEARS / scGen / 论文图表 / RAG / 单细胞"/><button class="btn" id="os-search-btn">搜索工具</button></div>
    <div id="os-list" class="tool-list"></div>
  `);
}

function toolCheckpointFlow(tool) {
  const visual = tool.example_visual || {};
  const source = tool.public_source_example || {};
  const src = visual.url ? assetUrl(visual.url) : "";
  const checkpoints = [
    {
      no: "01",
      tag: "能做什么",
      title: `先理解 ${tool.name} 的真实用途`,
      body: tool.beginner_explanation || tool.short_description || "先把工具当作学习对象，确认它解决哪类问题。",
      proofTitle: "使用场景",
      proof: tool.when_to_use || tool.use_case || "适合先阅读README和官方教程，确认输入输出边界。",
      bullets: [tool.category || "开源工具", tool.can_run_in_platform || "reference_only", tool.tool_when_to_use || tool.when_to_use || ""].filter(Boolean),
    },
    {
      no: "02",
      tag: "能不能用",
      title: "许可、来源和公开数据边界先过关",
      body: tool.risk_notes || "正式使用前必须回到原仓库核对许可证、版本、安装方式和示例数据。",
      proofTitle: "公开来源线索",
      proof: `${source.title || "来源待核对"}｜${source.tier || source.source_platform || "公开来源/教学示例"}`,
      bullets: [tool.license || "license待核对", source.reuse_boundary || "不复制论文原图，不下载受控数据。", tool.copied_code ? "已复制代码：需重新核查" : "本站不复制未授权代码"],
      media: src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || tool.name || '工具示例图')}" />` : "",
    },
    {
      no: "03",
      tag: "怎么跑通",
      title: "从最小示例开始，而不是直接跑正式课题",
      body: tool.output_interpretation || "工具输出只提供分析线索，不能替代研究设计、统计判断或导师复核。",
      proofTitle: "输入要求",
      custom: list(tool.input_requirements || ["原仓库链接和版本", "示例数据或用户自有合规数据", "运行环境记录", "人工复核要求"]),
      bullets: (tool.learning_path || []).slice(0, 5),
    },
    {
      no: "04",
      tag: "怎么复核",
      title: "把仓库结果变成可解释的研究材料",
      body: "最后一步不是把输出截图贴进论文，而是保存输入、参数、日志、失败记录和导师复核意见。",
      proofTitle: "模型网关提示词",
      proof: tool.model_gateway_prompt_template || "请先填写工具名、研究问题和数据类型。",
      bullets: (tool.human_review_checklist || tool.common_pitfalls || []).slice(0, 5),
      cta: `<button class="btn ghost" onclick="navigate('/model-gateway')">去模型网关</button>`,
    },
  ];
  return `<section class="section method-checkpoint-flow tool-checkpoint-flow" id="tool-learning">
    ${sectionTitle("仓库四站学习页", "从用途、许可、最小示例到复核，把开源仓库讲成科研新手能执行的路线")}
    <div class="checkpoint-flow">
      ${checkpoints.map((item) => `<article class="method-checkpoint">
        <div class="checkpoint-number"><span>${escapeHtml(item.no)}</span><small>${escapeHtml(item.tag)}</small></div>
        <div class="checkpoint-main">
          <p class="checkpoint-eyebrow">${escapeHtml(tool.name)} · ${escapeHtml(item.tag)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <div class="checkpoint-proof">
            <strong>${escapeHtml(item.proofTitle)}</strong>
            ${item.custom || `<span>${escapeHtml(item.proof || "")}</span>`}
          </div>
          ${list(item.bullets || [])}
          <div class="checkpoint-actions">${item.cta || `<button class="btn ghost" onclick="window.open('${escapeHtml(tool.repo_url || '#')}','_blank')">打开原仓库线索</button>`}</div>
        </div>
        ${item.media ? `<div class="checkpoint-media">${item.media}</div>` : ""}
      </article>`).join("")}
    </div>
  </section>`;
}

function plotStudioSpecPanel(p = {}) {
  const visual = p.example_visual || {};
  const source = p.public_source_example || {};
  const src = visual.url ? assetUrl(visual.url) : "";
  const fields = (p.plot_data_contract || []).map((x) => `${x.field}：${x.meaning || "核心字段"}${x.required === false ? "（可选）" : ""}`);
  return `<section class="plot-spec-panel">
    <div class="plot-spec-visual">${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || p.zh_name || "示例图")}" />` : `<div class="mini-plot"><span></span><span></span><span></span><span></span></div>`}</div>
    <div class="plot-spec-copy">
      <span class="product-kicker">${escapeHtml(p.category || "科研图谱")}</span>
      <h2>${escapeHtml(p.zh_name || p.en_name || p.id || "图谱")}</h2>
      <p>${escapeHtml(p.detail_novice_intro || p.question_answered || "先确认这张图回答的问题，再检查字段是否匹配。")}</p>
      <div class="plot-spec-meta">
        ${badge(source.tier || "公开来源线索", "green")}
        ${badge(source.source_platform || "教学SVG", "blue")}
        ${badge("示意/待实测", "violet")}
      </div>
      <h3>这张图需要什么字段</h3>
      ${list(fields)}
      <h3>公开来源与边界</h3>
      <p>${escapeHtml(source.title || "待补充公开来源线索")}</p>
      <p class="soft-note">${escapeHtml(visual.reuse_boundary || source.reuse_boundary || "示例图不代表真实研究结果；正式作图必须替换为用户自己的可审查数据。")}</p>
    </div>
  </section>`;
}

function plotStudioPage() {
  const params = new URLSearchParams(location.search);
  const requested = params.get("plot") || "volcano_plot";
  const selected = state.plotGallery.find((p) => p.id === requested) || state.plotGallery.find((p) => p.id === "volcano_plot") || state.plotGallery[0] || {};
  const defaultColumns = (selected.plot_data_contract || []).filter((x) => x.required !== false && !String(x.field).endsWith("_optional")).map((x) => x.field).join(", ");
  return shell(`
    <div class="page-heading"><span>Research Plot Studio</span><h1>先理解图解决的问题，再让数据和方法对齐</h1><p>科研新手最容易把“好看的图”当成“合适的图”。本页会根据你选择的具体图谱，检查字段契约、公开来源线索、常见错误和模型提示词，示例图只用于教学演示。</p></div>
    ${plotStudioSpecPanel(selected)}
    <section class="two-col">
      <div class="form-panel">
        <label>图类型</label>
        <select id="plot-type" onchange="navigate('/plot-studio?plot=' + this.value)">
          ${state.plotGallery.map((p) => `<option value="${escapeHtml(p.id)}" ${p.id === selected.id ? "selected" : ""}>${escapeHtml(p.zh_name || p.en_name || p.id)} · ${escapeHtml(p.category || "未分类")}</option>`).join("")}
        </select>
        <p id="plot-help" class="soft-note">${escapeHtml(selected.question_answered || selected.answers_question || "请先明确科研问题。")}</p>
        <label>粘贴你的字段名或数据说明</label>
        <textarea id="plot-columns">${escapeHtml(defaultColumns || "sample_id, group, value")}</textarea>
        <button class="btn ghost" id="plot-advice">先检查字段是否能画</button>
        <button class="btn" id="plot-generate">生成图</button>
        <button class="btn ghost" onclick="downloadText('plot.svg', el('plot-svg-source')?.textContent || '')">下载 SVG</button>
      </div>
      <div class="guide-panel"><h2>图表质量检查</h2><ul><li>图题是否回答当前研究问题，而不是只描述颜色和形状</li><li>字段是否满足该图的最小数据契约</li><li>分组、单位、统计前提和缺失值处理是否能被复核</li><li>示例图是否明确标注为教学改绘或合成演示</li><li>正式出图是否保留source data、脚本、引用和导师复核记录</li></ul></div>
    </section>
    <div id="plot-advice-result" class="result rich-result">先粘贴字段名，平台会告诉你这张图缺什么、先修什么、怎么给模型API下达规范化请求。</div>
    <div id="plot-result" class="result plot-box">点击生成图。</div>
  `);
}

function renderPlotAdvice(data) {
  const source = data.source || {};
  const visual = data.example_visual || {};
  return `<h2>${escapeHtml(data.plot_name)} · 画图前检查</h2>
    <p><strong>它回答：</strong>${escapeHtml(data.question_answered || "请先明确科研问题。")}</p>
    <div class="task-package-grid">
      <article><h3>需要字段</h3>${list(data.required_columns || [])}</article>
      <article><h3>你已提供</h3>${list(data.provided_columns || [])}</article>
      <article><h3>缺失字段</h3>${(data.missing_columns || []).length ? list(data.missing_columns) : "<p>当前字段基本满足示例检查。</p>"}</article>
      <article><h3>下一步</h3>${list(data.next_steps || [], "numbered")}</article>
    </div>
    <section class="plot-advice-proof">
      <article><h3>公开来源线索</h3><p>${escapeHtml(source.title || "待补充公开来源线索")}</p><p class="soft-note">${escapeHtml(source.reuse_boundary || "公开来源只作为检索和教学说明线索；正式研究需按原数据库和论文许可核对。")}</p></article>
      <article><h3>示例图边界</h3><p>${escapeHtml(visual.title || "教学改绘/合成示例")}</p><p class="soft-note">${escapeHtml(visual.reuse_boundary || "示例图不代表真实研究结果。")}</p></article>
      <article><h3>R/ggplot2建议</h3><p>${escapeHtml(data.r_ggplot_hint || "优先整理为tidy数据，再用ggplot2映射字段和分组。")}</p></article>
    </section>
    <h3>审查命中</h3>
    <div class="audit-hit-grid">${(data.audit_hits || []).map((r) => `<article><h3>${escapeHtml(r.topic)} · ${escapeHtml(r.level)}</h3>${badge(r.severity || "notice", (r.severity || "").includes("high") ? "red" : "blue")}<p>${escapeHtml(r.check)}</p><p>${escapeHtml(r.how_to_fix)}</p></article>`).join("")}</div>
    <h3>可复制给模型网关的提示词</h3>
    <pre>${escapeHtml(data.model_prompt || "")}</pre>
    <p class="soft-note">${escapeHtml(data.safety || SAFETY)}</p>`;
}

function methodRunnerPage(methodId = "virtual-perturbation") {
  const seen = new Set();
  const candidates = state.methods.filter((m) => (methodId === "virtual-perturbation" ? `${m.id} ${m.name} ${m.methods?.join(" ")}`.toLowerCase().includes("virtual") || m.name.includes("扰动") : true));
  const cards = candidates.filter((m) => {
    const key = m.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
  return shell(`
    <div class="page-heading"><span>Method Runner</span><h1>虚拟扰动：从“方法名”翻译成“科研任务流程”</h1><p>虚拟扰动不是魔法预测。它把表达矩阵、扰动标签、对照组和验证指标组织成可学习的建模流程，输出只能作为研究假设线索。</p></div>
    <section class="panel">
      ${sectionTitle("流程图", "输入 → 预处理 → 模型 → 预测 → 解释与验证")}
      <div class="pipeline">
        <div><strong>输入数据</strong><span>表达矩阵、细胞注释、扰动标签</span></div>
        <div><strong>预处理</strong><span>QC、归一化、批次记录</span></div>
        <div><strong>模型选择</strong><span>GEARS / scGen / CPA / scGPT</span></div>
        <div><strong>预测输出</strong><span>表达变化、候选通路、不确定性</span></div>
        <div><strong>验证</strong><span>交叉验证、外部数据、实验复核</span></div>
      </div>
    </section>
    <section class="section">${sectionTitle("方法卡", "每张卡都写给科研新手看")}
      <div class="method-grid">${cards.map(methodCard).join("")}</div>
    </section>
  `);
}

function methodCard(m) {
  return `<article class="method-card">
    <div class="method-head"><h3>${m.name}</h3>${badge(m.direct_run || "reference", "blue")}</div>
    <p class="method-problem">${m.beginner_explanation || m.problem}</p>
    <div class="method-facts">
      <div><span>什么时候用</span><p>${m.when_to_use || m.problem}</p></div>
      <div><span>输入要求</span><p>${m.input_requirements || m.input_data}</p></div>
      <div><span>输出怎么看</span><p>${m.output_interpretation || m.output_data}</p></div>
    </div>
    <p><strong>这一类常见工具/方法：</strong>${(m.related_tools || m.methods || []).map((x) => badge(x, "green")).join("")}</p>
    <details><summary>常见误区和学习路径</summary>
      <h4>常见误区</h4>${list(m.common_pitfalls || [])}
      <h4>建议学习顺序</h4>${list(m.learning_path || [], "numbered")}
    </details>
  </article>`;
}

function skillBuilderPage() {
  return shell(`
    <div class="page-heading"><span>Skill共创工坊</span><h1>把教师经验写成可复核的Skill草稿</h1><p>这里不是生成临时提示词，而是生成包含任务边界、输入输出、评价量规和安全边界的说明文件。</p></div>
    <section class="two-col">
      <div class="form-panel">
        <div class="form-grid">
          <div><label>Skill 名称</label><input id="sb-name" value="mitochondrial-ultrastructure-tutor"/></div>
          <div><label>中文名称</label><input id="sb-zh" value="线粒体超微病理导学Skill"/></div>
          <div class="full"><label>任务说明</label><input id="sb-task" value="生成超微结构导学问题、易错点和复核清单"/></div>
          <div><label>输入数据</label><input id="sb-inputs" value="超微图像描述、教学目标、学生年级"/></div>
          <div><label>输出格式</label><input id="sb-outputs" value="导学问题、机制解释、易错点、教师复核清单"/></div>
          <div class="full"><label>风险边界</label><input id="sb-risk" value="${SAFETY}"/></div>
        </div>
        <button class="btn" id="sb-generate">生成 Skill 文件预览</button>
      </div>
      <div class="guide-panel"><h2>为什么要结构化</h2><p>结构化Skill让不同教师、不同班级、不同学期可以复用同一套任务边界和评价规则。它也便于后续迁移到平台、做版本管理和审计。</p></div>
    </section>
    <div id="sb-result" class="result rich-result">填写表单后生成 SKILL.md、plugin.json、eval.yaml、README。</div>
  `);
}

function runtimePage() {
  return shell(`
    <div class="page-heading"><span>运行环境</span><h1>本地原型、远程服务器和平台迁移怎么区分</h1><p>当前平台可本地运行；服务器/HPC/API只做安全适配说明，不保存密钥，不自动提交收费任务。</p></div>
    <section class="two-col">
      <div class="panel"><h2>本地后端</h2><pre id="runtime-cmd">uvicorn app.main:app --reload --host 127.0.0.1 --port 8000</pre><button class="btn" onclick="copyText(el('runtime-cmd').innerText)">复制命令</button></div>
      <div class="panel"><h2>环境变量</h2><pre>MODEL_PROVIDER=mock
OPENAI_API_KEY=
CSU_CHAT_API_KEY=
HPC_DRY_RUN=true</pre><p>Key只来自环境变量，不进入代码、日志、截图或文档。</p></div>
    </section>
  `);
}

function providersPage() {
  return shell(`
    <div class="page-heading"><span>Model Gateway</span><h1>统一管理模型Provider，默认mock模式</h1><p>页面只显示是否配置，不显示密钥。无密钥时自动使用mock输出，避免把演示写成真实API调用。</p></div>
    <div id="provider-list" class="provider-grid"></div>
  `);
}

function modelGatewayPage() {
  const providers = state.modelGatewayTemplates.providers || [];
  const tasks = state.modelGatewayTemplates.task_types || [];
  const firstTaskId = tasks[0]?.id || "case_generation";
  return shell(`
    <div class="page-heading">
      <span>Model Gateway API规范化</span>
      <h1>把“接入自己的大模型”变成可审计、可复核、可接入Skill的请求包</h1>
      <p>科研新手常卡在三个词：provider 是哪家模型服务，base_url 是服务地址，model 是具体模型名称，API Key 是只能放在环境变量里的密钥。本页把这些概念整理成规范化请求包，并在没有密钥时使用本地 mock 模式演示。</p>
    </div>
    <section class="gateway-layout">
      <div class="form-panel gateway-form">
        <h2>1. 选择模型和任务</h2>
        <div class="form-grid">
          <div>
            <label>Provider / 模型服务</label>
            <select id="gw-provider">${providers.map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join("")}</select>
          </div>
          <div>
            <label>任务类型</label>
            <select id="gw-task">${tasks.map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.zh_name)}</option>`).join("")}</select>
          </div>
          <div>
            <label>输出格式</label>
            <select id="gw-format"><option value="json">JSON结构化输出</option><option value="markdown">Markdown教学草案</option><option value="yaml">YAML配置草案</option></select>
          </div>
          <div>
            <label>使用对象</label>
            <input id="gw-audience" value="科研新手/课程教师/学生" />
          </div>
          <div class="full">
            <label>需求描述</label>
            <textarea id="gw-prompt">我想从0开始做一篇meta分析，请帮我拆成数据准备、检索、纳排、质量评价、统计分析、绘图和导师复核流程。</textarea>
          </div>
        </div>
        <div class="actions">
          <button class="btn" id="gw-normalize">生成规范化请求包</button>
          <button class="btn ghost" id="gw-mock">运行Mock生成</button>
        </div>
        <div id="gw-task-preview" class="gateway-task-preview">${renderGatewayTaskPreview(firstTaskId)}</div>
      </div>
      <aside class="guide-panel gateway-guide">
        <h2>新手先看这里</h2>
        <div class="term-stack">
          <div><strong>provider</strong><span>你要接入哪一家模型服务，例如学校接口、OpenAI、DeepSeek、Qwen。</span></div>
          <div><strong>base_url</strong><span>模型服务地址。平台只读环境变量，不把地址和密钥写入公开文件。</span></div>
          <div><strong>model</strong><span>实际调用的模型名称。不同任务可用不同模型生成、审校、审计。</span></div>
          <div><strong>API Key</strong><span>密钥只能放在环境变量；页面只显示 configured true/false，不显示具体值。</span></div>
          <div><strong>Skill输出</strong><span>模型结果必须被任务边界、输出schema、引用核验、伦理审计和教师复核约束。</span></div>
        </div>
        <p class="soft-note">${escapeHtml(state.modelGatewayTemplates.safety_boundary || SAFETY)}</p>
      </aside>
    </section>
    <section class="section gateway-provider-strip">
      ${sectionTitle("Provider状态", "只显示是否配置，不显示密钥")}
      <div class="provider-grid">${providers.map((p) => {
        const status = p.config_status || {};
        return `<article class="provider-card">
          <h3>${escapeHtml(p.name)}</h3>
          ${badge(status.configured ? "configured" : "mock", status.configured ? "green" : "blue")}
          <p>${escapeHtml(p.beginner_note || "")}</p>
          <div class="model-meta"><span>Key变量</span><code>${escapeHtml(status.api_key_env || "")}</code></div>
          <div class="model-meta"><span>Base URL变量</span><code>${escapeHtml(status.base_url_env || "")}</code></div>
          <div class="model-meta"><span>Model变量</span><code>${escapeHtml(status.model_env || "")}</code></div>
        </article>`;
      }).join("")}</div>
    </section>
    <section class="two-col">
      <div id="gw-normalized" class="result rich-result"><h2>2. 规范化请求包</h2><p>点击“生成规范化请求包”后，这里会展示可交给Skill Orchestrator使用的标准结构。</p></div>
      <div id="gw-output" class="result rich-result"><h2>3. Mock生成结果</h2><p>点击“运行Mock生成”后，这里会展示不调用真实API的演示结果。</p></div>
    </section>
  `);
}

function governancePage() {
  return shell(`
    <div class="page-heading"><span>Governance & Audit</span><h1>先审计，再进入教学材料</h1><p>每个AI输出都应经过隐私、临床误导、伪造引用和学术诚信风险检查。</p></div>
    <section class="two-col">
      <div class="form-panel"><label>待审计文本</label><textarea id="gov-text">请检查这段AI输出是否有临床误导或隐私风险。</textarea><button class="btn" id="gov-audit">运行审计</button></div>
      <div id="gov-result" class="result">等待审计。</div>
    </section>
    <section class="risk-grid section">${["隐私风险", "模型幻觉", "临床误导", "伪造引用", "学术诚信", "红队样例"].map((x) => `<article><h3>${x}</h3><p>触发后进入人工复核、版本记录和材料隔离流程。</p></article>`).join("")}</section>
  `);
}

function settingsPage() {
  return shell(`<div class="page-heading"><span>设置</span><h1>安全优先的本地设置</h1><p>本页不保存API Key、SSH密码、私钥、Token或Cookie。真实平台接入需单独授权和审计。</p></div><div class="safety-strip">${SAFETY}</div>`);
}

function formatCase(c) {
  return `<h2>${c.title}</h2><p>${c.boundary}</p><div class="case-output-grid"><div><h3>背景</h3><p>${c.background}</p></div><div><h3>镜下描述</h3>${list(c.microscopy)}</div><div><h3>PBL问题</h3>${list(c.pbl_questions, "numbered")}</div><div><h3>伦理审计</h3>${list(c.ethics_audit)}</div><div><h3>教师复核</h3>${list(c.teacher_review)}</div></div>`;
}

function currentPage() {
  const p = currentRoutePath();
  if (p === "/") return dashboard();
  if (p === "/teacher") return teacherPage();
  if (p === "/student") return studentPage();
  if (p === "/researcher") return researcherPage();
  if (p === "/journey-builder") return journeyBuilderPage();
  if (p === "/method-universe") return methodUniversePage();
  if (p.startsWith("/method-universe/")) return methodDetailPage(pathLastSegment(p));
  if (p === "/method-family/gene-perturbation") return genePerturbationPage();
  if (p === "/article-workshop") return articleWorkshopPage();
  if (p.startsWith("/article-workshop/")) return articleWorkshopPage(pathLastSegment(p));
  if (p === "/plugins") return pluginsPage();
  if (p.startsWith("/plugins/")) return pluginDetailPage(pathLastSegment(p));
  if (p.startsWith("/skills/")) return skillDetailPage(pathLastSegment(p));
  if (p === "/simulate") return simulatePage();
  if (p === "/simulate/new") return simulateNewPage();
  if (p.startsWith("/simulate/")) return caseDetailPage(pathLastSegment(p));
  if (p === "/compare") return comparePage();
  if (p === "/evidence") return evidencePage();
  if (p === "/open-source") return openSourcePage();
  if (p === "/source-library") return sourceLibraryPage();
  if (p.startsWith("/source-library/")) return publicSourceDetailPage(pathLastSegment(p));
  if (p.startsWith("/open-source/")) return openSourceDetailPage(pathLastSegment(p));
  if (p === "/plot-studio") return plotStudioPage();
  if (p === "/plot-gallery") return plotGalleryPage();
  if (p.startsWith("/plot-gallery/")) return plotDetailPage(pathLastSegment(p));
  if (p === "/data-audit") return dataAuditPage();
  if (p === "/method-runner") return methodRunnerPage();
  if (p.startsWith("/method-runner/")) return methodRunnerPage(pathLastSegment(p));
  if (p === "/mobile-app") return mobileAppPage();
  if (p === "/skill-builder") return skillBuilderPage();
  if (p === "/runtime") return runtimePage();
  if (p === "/providers") return providersPage();
  if (p === "/model-gateway") return modelGatewayPage();
  if (p === "/governance") return governancePage();
  if (p === "/island") return islandPage();
  if (p === "/island-3d") return island3DPage();
  if (p === "/settings") return settingsPage();
  return shell(`<h1>页面不存在</h1><button class="btn" onclick="navigate('/')">返回首页</button>`);
}

async function loadInitialData() {
  const [
    plugins,
    skills,
    cases,
    comparisons,
    providers,
    modelGatewayTemplates,
    methods,
    openSource,
    publicSources,
    publicSourceVisuals,
    methodGuides,
    methodUniverse,
    genePerturbationMethods,
    articleWorkflows,
    plotGallery,
    plotDemoGallery,
    dataAuditRules,
    islandBuildings,
    petDialogues,
  ] = await Promise.all([
    api("/api/plugins"),
    api("/api/skills"),
    api("/api/simulate/cases"),
    api("/api/compare/demos"),
    api("/api/providers"),
    api("/api/model-gateway/templates").catch(() => ({ providers: [], task_types: [], safety_boundary: "" })),
    api("/api/methods"),
    api("/api/open-source"),
    api("/api/public-example-sources").catch(() => []),
    api("/api/public-source-visuals").catch(() => []),
    api("/api/method-guides").catch(() => []),
    api("/api/method-universe?limit=700").catch(() => []),
    api("/api/gene-perturbation-methods").catch(() => []),
    api("/api/article-workflows").catch(() => []),
    api("/api/plot-gallery?limit=160").catch(() => []),
    api("/api/plot-demo-gallery").catch(() => []),
    api("/api/data-audit-rules").catch(() => []),
    api("/api/island/buildings").catch(() => []),
    api("/api/pet/dialogues").catch(() => []),
  ]);
  Object.assign(state, {
    plugins,
    skills,
    cases,
    comparisons,
    providers,
    modelGatewayTemplates,
    methods,
    openSource,
    publicSources,
    publicSourceVisuals,
    methodGuides,
    methodUniverse,
    genePerturbationMethods,
    articleWorkflows,
    plotGallery,
    plotDemoGallery,
    dataAuditRules,
    islandBuildings,
    petDialogues,
  });
  plugins.forEach((p) => (state.pluginEnabled[p.id] = p.enabled));
}

function renderPluginList() {
  const root = el("plugins-list");
  if (root) root.innerHTML = state.plugins.map(pluginCard).join("");
}

function togglePlugin(id, checked) {
  state.pluginEnabled[id] = checked;
  renderPluginList();
}

function setCompare(id) {
  state.activeCompare = id;
  const d = state.comparisons.find((x) => x.id === id) || state.comparisons[0];
  const root = el("compare-result");
  if (!root || !d) return;
  root.innerHTML = `<h2>${d.title}</h2><p>${d.note}</p><div class="compare-columns"><article><h3>传统方式</h3><p>${d.no_ai}</p></article><article><h3>普通提示词</h3><p>${d.normal_prompt}</p></article><article><h3>规范化MedPath Skill</h3><p>${d.medpath_skill}</p></article></div>`;
}

function renderOpenSource(query = "") {
  const q = query.toLowerCase();
  let items = state.openSource;
  if (q) items = items.filter((x) => `${x.name} ${x.category} ${x.short_description} ${x.beginner_explanation || ""}`.toLowerCase().includes(q) || (q.includes("virtual") && x.category === "虚拟扰动"));
  const root = el("os-list");
  if (!root) return;
  root.innerHTML = items.slice(0, 30).map((x) => {
    const visual = x.example_visual || {};
    const src = visual.url ? assetUrl(visual.url) : "";
    return `<article class="tool-card">
    <div class="tool-thumb">${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || x.name || "工具示例图")}" loading="lazy" />` : ""}<div class="tool-thumb-overlay"><strong>${escapeHtml(x.name)}</strong><span>${escapeHtml(x.category || "开源工具")} · 学习示例</span></div></div>
    <div><h3>${x.name}</h3>${badge(x.category, "blue")} ${badge(x.can_run_in_platform || "reference", "green")}</div>
    <p>${escapeHtml(x.tool_product_title || x.beginner_explanation || x.short_description)}</p>
    <p class="visual-note"><strong>${escapeHtml(visual.title || "示例图")}</strong><span>${escapeHtml(visual.reuse_boundary || "示例图用于学习工具输出形态，不代表真实研究结果。")}</span></p>
    <div class="tool-meta"><div><span>什么时候用</span>${x.when_to_use || x.use_case}</div><div><span>输入/输出</span>${x.input_requirements || "见原项目文档"}</div><div><span>常见误区</span>${(x.common_pitfalls || []).slice(0, 2).join("；")}</div></div>
    <div class="actions"><button class="btn" onclick="navigate('${escapeHtml(routePath('/open-source', x.id || x.name))}')">打开工具详情</button><button class="btn ghost" onclick="window.open('${escapeHtml(x.repo_url)}','_blank')">打开GitHub</button></div>
  </article>`;
  }).join("");
}

function openSourceDetailPage(toolId) {
  const tool = state.openSource.find((x) => x.id === toolId);
  if (!tool) return shell(`<div class="page-heading"><span>Open Source Navigator</span><h1>工具不存在</h1><p>没有找到 ${escapeHtml(toolId)}，请返回开源工具库重新选择。</p><button class="btn" onclick="navigate('/open-source')">返回开源工具库</button></div>`);
  const visual = tool.example_visual || {};
  const source = tool.public_source_example || {};
  const src = visual.url ? assetUrl(visual.url) : "";
  const storyPanels = tool.detail_scroll_panels || tool.tool_story_sections || [];
  const toolStory = productFeatureStory({
    label: "工具上手",
    title: `${tool.name} 的最小可运行学习路径`,
    subtitle: tool.detail_novice_intro || "先读懂输入、输出、许可证、版本和复核边界，再决定是否运行最小示例。",
    visual,
    source,
    panels: storyPanels,
    promptExamples: tool.demand_window_prompts || [tool.model_gateway_prompt_template].filter(Boolean),
    className: "tool-product-story",
    context: {
      audience: tool.when_to_use || tool.use_case,
      inputs: tool.input_requirements,
      output: tool.output_interpretation,
      review: tool.risk_notes,
    },
    proofItems: [
      ["工具类别", tool.category || "待分类", "先判断任务是否匹配"],
      ["许可证", tool.license || "待核对", "公开使用前必须核查"],
      ["平台状态", tool.can_run_in_platform || "reference", "不等于真实上线运行"],
    ],
  });
  return shell(`
    ${productNav([["#tool-overview", "工具总览", "先看它解决什么问题"], ["#tool-source", "来源与许可", "确认能不能用"], ["#tool-learning", "学习路径", "最小可运行理解"], ["#tool-prompt", "模型提示", "让API帮你整理需求"]])}
    <div class="page-heading product-heading"><span>${escapeHtml(tool.category || "Open Source Tool")}</span><h1>${escapeHtml(tool.tool_product_title || tool.name)}</h1><p>${escapeHtml(tool.tool_hero_subtitle || tool.short_description)}</p></div>
    <section class="method-product-hero apple-product-hero" id="tool-overview">
      <div class="method-product-copy">
        <span class="product-kicker">${escapeHtml(tool.name)}</span>
        <h2>${escapeHtml(tool.tool_when_to_use || tool.when_to_use || tool.use_case)}</h2>
        <p>${escapeHtml(tool.detail_novice_intro || "开源仓库不是直接拿来出结论的按钮。新手应先读懂输入、输出、许可证、版本和复核边界，再决定是否运行最小示例。")}</p>
        ${productProofStrip([
          ["类别", tool.category || "工具", "先判断是否匹配任务"],
          ["许可", tool.license || "待核对", "公开使用前必须核查"],
          ["状态", tool.can_run_in_platform || "reference", "不等于已在平台真实运行"],
        ])}
        <div class="product-cta-row">
          <button class="btn" onclick="window.open('${escapeHtml(tool.repo_url)}','_blank')">打开GitHub线索</button>
          <button class="btn ghost" onclick="navigate('/model-gateway')">生成学习提示词</button>
        </div>
      </div>
      <div class="method-example-visual">
        ${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(visual.title || tool.name || '工具示例图')}" />` : ""}
        <div>
          <strong>${escapeHtml(visual.title || "工具学习示意图")}</strong>
          <p>${escapeHtml(visual.reuse_boundary || "示例图仅用于教学，不代表原工具性能。")}</p>
        </div>
      </div>
    </section>
    ${toolStory}
    <section class="section source-proof-card" id="tool-source">
      ${sectionTitle("公开来源与学习边界", "来源只提供可检索线索，工具是否适合你的研究需要进一步核对")}
      <div class="source-proof-layout">
        <div>
          <h3>${escapeHtml(source.title || "公开来源线索待补充")}</h3>
          <p>${escapeHtml(source.description || "该工具暂未绑定公开来源。")}</p>
          <p>${escapeHtml(tool.detail_source_sentence || "")}</p>
          <p><strong>引用线索：</strong>${escapeHtml(source.citation || "待核对正式引用")}；PMID：${escapeHtml(source.pmid || "待核对")}</p>
          <p class="soft-note">${escapeHtml(source.reuse_boundary || "不复制论文原图，不下载受控数据。")}</p>
        </div>
        <div class="source-meta">
          ${badge(source.tier || "公开来源", "green")}
          ${badge(tool.license || "license待核对", "blue")}
          <a class="btn ghost" href="${escapeHtml(source.url || '#')}" target="_blank" rel="noreferrer">打开公开来源</a>
        </div>
      </div>
    </section>
    ${toolCheckpointFlow(tool)}
    <section class="section demand-lab" id="tool-demand-lab">
      <div class="lab-grid">
        <div>
          <h2>把你的研究需求转成工具上手任务包</h2>
          <p>写下你想用 ${escapeHtml(tool.name)} 解决的真实问题。平台会按这个仓库的用途、输入要求、许可边界和复核规则，生成一份适合科研新手执行的最小可运行计划。</p>
          <textarea id="tool-demand">我想用${escapeHtml(tool.name)}处理我的数据。我的研究问题是：${escapeHtml(tool.when_to_use || tool.use_case || "请帮我判断这个工具是否适合当前任务")}。我已有的数据包括：样本表、分组信息、矩阵或图像文件。请帮我列出安装前要核对什么、最小示例怎么跑、输出怎么解释、哪些结论不能声称。</textarea>
          <button class="btn" id="tool-demand-build" data-tool="${escapeHtml(tool.id)}">生成工具上手任务包</button>
        </div>
        <div id="tool-demand-result" class="result rich-result">
          <p>点击后会生成：输入材料清单、环境与许可核对、最小示例步骤、输出解释、常见误区、导师复核问题和可复制到模型网关的提示词。</p>
        </div>
      </div>
    </section>
    <section class="section article-model-box" id="tool-prompt">
      <h3>可复制到模型网关的开源工具学习提示词</h3>
      <pre>${escapeHtml(tool.model_gateway_prompt_template || "请先填写工具名、研究问题和数据类型。")}</pre>
    </section>
  `);
}

function renderGatewayTaskPreview(taskId) {
  const task = (state.modelGatewayTemplates.task_types || []).find((x) => x.id === taskId) || (state.modelGatewayTemplates.task_types || [])[0] || {};
  const skills = task.recommended_skills || [];
  const schema = task.output_schema || [];
  const review = task.review_focus || [];
  return `<section class="gateway-preview-card">
    <span>REQUEST CONTRACT</span>
    <h3>${escapeHtml(task.zh_name || "模型任务")}</h3>
    <p>这一步不是直接让模型自由发挥，而是先把需求锁定到任务类型、输出字段、Skill链和审查重点中。</p>
    <div class="gateway-flow-lane">
      <div><strong>01</strong><small>用户需求</small></div>
      <div><strong>02</strong><small>规范化请求</small></div>
      <div><strong>03</strong><small>模型生成/Mock</small></div>
      <div><strong>04</strong><small>Skill审查</small></div>
      <div><strong>05</strong><small>教师复核</small></div>
    </div>
    <div class="gateway-preview-grid">
      <article><h4>推荐Skill链</h4><p>${skills.map((x) => badge(x, "violet")).join("") || badge("待选择", "blue")}</p></article>
      <article><h4>输出字段</h4>${schema.length ? list(schema) : "<p>选择任务后显示。</p>"}</article>
      <article><h4>审查重点</h4>${review.length ? list(review) : "<p>选择任务后显示。</p>"}</article>
    </div>
  </section>`;
}

function updateGatewayTaskPreview() {
  const target = el("gw-task-preview");
  if (target) target.innerHTML = renderGatewayTaskPreview(el("gw-task")?.value);
}

function renderOpenSourceToolTaskPackage(toolId, demandText) {
  const tool = state.openSource.find((x) => x.id === toolId) || {};
  const source = tool.public_source_example || {};
  const related = (tool.related_tools || []).slice(0, 6);
  const inputs = tool.input_requirements || ["研究问题", "合规数据", "运行环境", "人工复核要求"];
  const learningPath = tool.learning_path || [
    "阅读原仓库README、论文或官方教程，确认工具用途。",
    "核对许可证、版本、输入格式和示例数据边界。",
    "用公开小数据或合成数据跑通最小示例。",
    "记录参数、输出、失败日志和解释边界。",
    "把结果交给导师或教师复核后再进入正式研究。"
  ];
  const pitfalls = tool.common_pitfalls || [
    "只看示例图，不读输入格式和版本说明。",
    "忽略许可证、依赖版本和示例数据来源。",
    "把工具输出直接写成论文结论。",
    "没有保存参数、日志和失败记录。"
  ];
  const modelPrompt = [
    `请作为开源科研工具导师，帮助我评估“${tool.name || toolId}”是否适合当前任务。`,
    `用户需求：${demandText}`,
    `工具定位：${tool.when_to_use || tool.use_case || tool.short_description || "待核对"}`,
    `输入要求：${inputs.join("；")}`,
    "请输出：适用/不适用判断、缺失材料、最小可运行步骤、环境与许可证核对、输出解释、常见误区、导师复核问题。",
    "不得声称本工具已在用户数据上验证效果；不得生成真实患者处置建议；医学AI输出仅用于教学与科研训练，不替代临床诊断。"
  ].join("\n");
  return `<h2>${escapeHtml(tool.name || toolId)} 上手任务包</h2>
    <p>${badge(tool.category || "开源工具", "blue")} ${badge(tool.license || "license待核对", "green")} ${badge(tool.can_run_in_platform || "reference", "violet")}</p>
    ${renderDemandInsightPanel({ kind: "tool", title: tool.name || toolId, demand: demandText, object: { ...tool, inputs, workflow: learningPath }, skillChain: ["research-copilot", "citation_checker", "ai-ethics-governor", "teacher-skill-maker"], plots: (tool.example_visual ? [tool.example_visual] : []).concat(state.plotGallery.slice(0, 2)), source })}
    <div class="task-package-grid">
      <article><h3>先判断是否适合</h3><p>${escapeHtml(tool.when_to_use || tool.use_case || tool.short_description || "请先明确研究问题和数据类型。")}</p></article>
      <article><h3>输入材料清单</h3>${list(inputs)}</article>
      <article><h3>最小可运行路径</h3>${list(learningPath, "numbered")}</article>
      <article><h3>输出怎么解释</h3><p>${escapeHtml(tool.output_interpretation || "输出只能作为分析线索，需结合研究设计、统计前提和人工复核解释。")}</p></article>
      <article><h3>常见误区</h3>${list(pitfalls)}</article>
      <article><h3>导师复核问题</h3>${list(tool.human_review_checklist || [
        "这个工具是否真的匹配当前研究问题？",
        "输入数据、版本、参数和许可证是否可追踪？",
        "输出是否被过度解释为机制、诊断或疗效结论？"
      ])}</article>
    </div>
    ${related.length ? `<h3>可以一起比较的工具</h3><p>${related.map((x) => badge(x, "green")).join("")}</p>` : ""}
    <h3>来源核对</h3>
    <p>${escapeHtml(source.title || tool.detail_source_sentence || "请回到原仓库、论文或官方文档核对。")}</p>
    <p class="soft-note">${escapeHtml(tool.risk_notes || "本平台仅提供学习导航，不复制未授权代码，不声称工具已完成真实数据验证。")}</p>
    <h3>可复制到模型网关的提示词</h3>
    <pre>${escapeHtml(modelPrompt)}</pre>`;
}

function renderProviders() {
  const root = el("provider-list");
  if (!root) return;
  root.innerHTML = state.providers.map((p) => `<article class="provider-card"><h3>${p.name}</h3><p><strong>base_url：</strong>${p.base_url_example}</p><p><strong>model：</strong>${p.model_example}</p><p>${p.privacy_note}</p><button class="btn" onclick="testProvider('${p.id}')">Test Connection</button><div id="provider-${p.id}" class="badge blue">not tested</div></article>`).join("");
}

async function testProvider(id) {
  const data = await api("/api/providers/test", { method: "POST", body: JSON.stringify({ provider_id: id }) });
  const target = el(`provider-${id}`);
  target.textContent = `${data.mode}: configured=${data.configured}`;
}

function gatewayPayload() {
  return {
    provider_id: el("gw-provider")?.value || "local_mock",
    task_type: el("gw-task")?.value || "case_generation",
    prompt: el("gw-prompt")?.value || "",
    output_format: el("gw-format")?.value || "json",
    audience: el("gw-audience")?.value || "科研新手/课程教师/学生",
  };
}

function renderGatewayPackage(data) {
  const metadata = data.request?.metadata || {};
  const skills = metadata.recommended_skills || [];
  const schema = metadata.output_schema || [];
  const review = metadata.review_focus || [];
  const prompt = data.request?.messages?.find((x) => x.role === "user")?.content || "";
  return `<h2>${escapeHtml(data.task_name || "规范化请求包")}</h2>
    <p>${badge(data.provider_name || data.provider_id, "blue")} ${badge(data.mode || "mock", data.mode === "configured" ? "green" : "blue")} ${badge("不显示API Key", "red")}</p>
    ${renderDemandInsightPanel({ kind: "model", title: data.task_name || "模型任务", demand: prompt, object: { inputs: schema, workflow: review }, skillChain: skills, plots: state.plotGallery.slice(0, 3) })}
    <div class="gateway-flow-lane expanded">
      <div><strong>01</strong><small>Provider</small><span>${escapeHtml(data.provider_name || data.provider_id || "local_mock")}</span></div>
      <div><strong>02</strong><small>输出格式</small><span>${escapeHtml(data.request?.response_format || "json")}</span></div>
      <div><strong>03</strong><small>Skill链</small><span>${skills.length} 个</span></div>
      <div><strong>04</strong><small>审查点</small><span>${review.length} 项</span></div>
      <div><strong>05</strong><small>Key显示</small><span>永不显示</span></div>
    </div>
    <div class="gateway-checks">
      ${(data.beginner_explanation || []).map((x) => `<div>${escapeHtml(x)}</div>`).join("")}
    </div>
    <h3>推荐调用的Skills</h3>
    <p>${skills.map((x) => badge(x, "violet")).join("")}</p>
    <h3>输出字段</h3>${list(schema)}
    <h3>审查重点</h3>${list(review)}
    <h3>安全检查</h3>${list(data.safety_checklist || [])}
    <h3>规范化请求JSON</h3><pre>${escapeHtml(JSON.stringify(data.request, null, 2))}</pre>`;
}

function renderGatewayMock(data) {
  return `<h2>${escapeHtml(data.task_name || "Mock输出")}</h2>
    <p>${badge(data.status, "blue")} ${badge(data.mode, "green")}</p>
    <p>${escapeHtml(data.result?.summary || "")}</p>
    <div class="gateway-flow-lane expanded">
      <div><strong>Mock</strong><small>未调用真实API</small><span>安全演示</span></div>
      <div><strong>Schema</strong><small>输出字段</small><span>${(data.result?.output_schema || []).length} 项</span></div>
      <div><strong>Review</strong><small>审查重点</small><span>${(data.result?.review_focus || []).length} 项</span></div>
    </div>
    <h3>工作流</h3><p>${(data.result?.workflow || []).map((x) => badge(x, "violet")).join("")}</p>
    <h3>审查重点</h3>${list(data.result?.review_focus || [])}
    <h3>边界说明</h3><p class="soft-note">${escapeHtml(data.result?.note || data.safety || SAFETY)}</p>`;
}

const island3DRuntime = {
  hits: [],
  avatar: { x: 560, y: 360, tx: 560, ty: 360 },
  selected: null,
  visited: new Set(),
  frame: 0,
  dialogue: "点击任意建筑，小向导会带你走过去，并把任务拆成可执行步骤。",
};

try {
  island3DRuntime.visited = new Set(JSON.parse(localStorage.getItem("medpath_island_visited") || "[]"));
} catch {
  island3DRuntime.visited = new Set();
}

const threeIslandRuntime = {
  ready: false,
  renderer: null,
  scene: null,
  camera: null,
  raycaster: null,
  pointer: null,
  avatar: null,
  avatarTarget: null,
  pathLine: null,
  keyHandler: null,
  buildings: [],
  animationId: null,
  resizeHandler: null,
};

function staticVendorUrl(fileName) {
  const script = document.querySelector('script[src*="app.js"]');
  const base = script ? script.src.replace(/app\.js.*/, "") : `${window.location.origin}/static/`;
  return new URL(`vendor/${fileName}`, base).href;
}

function islandRouteForBuilding(building = {}) {
  if (building.route) return building.route;
  const text = `${building.name || ""} ${building.role || ""} ${building.interaction || ""}`;
  if (text.includes("绘图") || text.toLowerCase().includes("plot")) return "/plot-gallery";
  if (text.includes("文章") || text.includes("写作")) return "/article-workshop";
  if (text.includes("方法") || text.includes("基因")) return "/method-universe";
  if (text.includes("审") || text.includes("伦理")) return "/governance";
  if (text.includes("数据")) return "/data-audit";
  if (text.includes("插件") || text.includes("Skill")) return "/plugins";
  if (text.includes("案例")) return "/simulate/new";
  if (text.includes("模型") || text.includes("API")) return "/model-gateway";
  return "/researcher";
}

function islandPassportMarkup() {
  const total = Math.max(state.islandBuildings.length, 1);
  const visited = Math.min(island3DRuntime.visited.size, total);
  const percent = Math.round((visited / total) * 100);
  const next = state.islandBuildings.find((b) => !island3DRuntime.visited.has(b.id)) || state.islandBuildings[0] || {};
  const selected = island3DRuntime.selected || next;
  const milestones = [
    ["起步", "读懂方法、文章和图表的入口"],
    ["运行", "能生成一个小型任务草案"],
    ["审计", "知道哪些输出必须退回或复核"],
    ["归档", "留下输入、输出、风险和教师反馈"],
  ];
  return `<section class="island-passport" id="island-passport">
    <div class="passport-main">
      <span class="eyebrow">Quest Passport · 科研护照</span>
      <h2>今天不需要逛完整座岛，只要完成一个能留下证据的小任务。</h2>
      <p>科研新手最容易卡住的地方，是不知道“下一步产出是什么”。这张护照把每座建筑转成一个可完成动作：准备输入、运行Skill、检查边界、留下复核证据。</p>
      <div class="passport-progress" aria-label="小岛访问进度"><div style="width:${percent}%"></div></div>
      <div class="passport-stats"><strong>${visited}/${total}</strong><span>已访问建筑</span><strong>${percent}%</strong><span>学习护照进度</span></div>
    </div>
    <div class="passport-next-card">
      <span>推荐下一站</span>
      <h3>${escapeHtml(next.name || "方法图书馆")}</h3>
      <p>${escapeHtml(next.quest_title || next.role || "先选择一个科研入口，完成一个小任务。")}</p>
      <button class="btn" onclick="focusIslandBuilding('${escapeHtml(next.id || "")}')">让小向导带我去</button>
    </div>
    <div class="passport-milestones">
      ${milestones.map(([title, desc], index) => `<article class="${visited > index * 2 ? "active" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${title}</strong><p>${desc}</p></article>`).join("")}
    </div>
    <div class="passport-current">
      <span>当前聚焦</span>
      <strong>${escapeHtml(selected.name || "待选择")}</strong>
      <p>${escapeHtml(selected.beginner_tip || selected.quest_summary || "点击一座建筑后，这里会显示它适合科研新手的原因。")}</p>
    </div>
  </section>`;
}

function islandCompassRoutes() {
  return [
    {
      id: "starter",
      title: "新手第一天路线",
      subtitle: "先把模糊课题变成可执行计划",
      ids: ["library", "data-clinic", "plot-lab", "mentor-house"],
      output: "方法路线、字段审查、图表计划和一周学习表",
    },
    {
      id: "paper",
      title: "文章开工路线",
      subtitle: "从文章类型倒推证据链",
      ids: ["article-workshop", "plot-lab", "model-gate", "ethics-gate"],
      output: "文章流程、图表清单、模型请求包和投稿前审计",
    },
    {
      id: "simulation",
      title: "模拟案例路线",
      subtitle: "把案例、HPC与伦理审计串起来",
      ids: ["case-lab", "hpc-dock", "model-gate", "ethics-gate"],
      output: "合成案例、dry-run脚本、模型审校和教师复核表",
    },
  ];
}

function islandCompassMarkup() {
  const buildings = state.islandBuildings || [];
  const byId = Object.fromEntries(buildings.map((b) => [b.id, b]));
  return `<section class="island-compass" id="island-compass">
    <div class="compass-copy">
      <span class="eyebrow">Quest Compass · 小岛任务罗盘</span>
      <h2>不需要一次逛完所有建筑，先选一条路线完成一个闭环。</h2>
      <p>每条路线都把入口、材料、Skill调用、风险审查和教师复核串在一起。游戏化只是帮助新手理解顺序，正式输出仍回到网页端功能页和人工复核。</p>
    </div>
    <div class="compass-route-grid">
      ${islandCompassRoutes().map((route, routeIndex) => {
        const stops = route.ids.map((id) => byId[id]).filter(Boolean);
        return `<article class="compass-route-card tone-${routeIndex}">
          <span>${route.id.toUpperCase()}</span>
          <h3>${escapeHtml(route.title)}</h3>
          <p>${escapeHtml(route.subtitle)}</p>
          <div class="compass-stop-row">${stops.map((b, index) => `<button type="button" onclick="focusIslandBuilding('${escapeHtml(b.id)}')"><strong>${index + 1}</strong>${escapeHtml(b.name)}</button>`).join("")}</div>
          <small>交付物：${escapeHtml(route.output)}</small>
          <button class="btn ghost" onclick="startIslandRoute('${escapeHtml(route.id)}')">按这条路线开始</button>
        </article>`;
      }).join("")}
    </div>
  </section>`;
}

function island3DPositions(count) {
  const base = [
    [235, 270], [405, 220], [595, 230], [780, 285], [895, 395],
    [720, 500], [520, 530], [318, 478], [198, 392], [560, 365],
  ];
  return base.slice(0, count).map(([x, y], i) => ({ x, y, z: i % 3 }));
}

function drawIsoTile(ctx, x, y, w, h, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x, y - h / 2);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x, y + h / 2);
  ctx.lineTo(x - w / 2, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function islandGlyph(building = {}) {
  const glyphs = {
    library: "法",
    "plot-lab": "图",
    "article-workshop": "文",
    "case-lab": "案",
    "ethics-gate": "审",
    "hpc-dock": "算",
    "mentor-house": "导",
    "pet-desk": "研",
    "data-clinic": "数",
    "model-gate": "模",
  };
  if (glyphs[building.id]) return glyphs[building.id];
  const text = `${building.name || ""} ${building.role || ""} ${building.interaction || ""}`;
  if (text.includes("图") || text.includes("绘图")) return "图";
  if (text.includes("文章") || text.includes("写作")) return "文";
  if (text.includes("方法") || text.includes("基因")) return "法";
  if (text.includes("审") || text.includes("伦理")) return "审";
  if (text.includes("数据")) return "数";
  if (text.includes("插件") || text.includes("Skill")) return "插";
  if (text.includes("案例")) return "案";
  if (text.includes("模型") || text.includes("API")) return "模";
  return "研";
}

function islandArray(items) {
  return Array.isArray(items) ? items : String(items || "").split(/[；;\n]/).map((x) => x.trim()).filter(Boolean);
}

function islandPanelMarkup(building = {}, idle = false) {
  const href = islandRouteForBuilding(building);
  const steps = islandArray(building.quest_steps).length ? islandArray(building.quest_steps) : ["点击建筑", "读懂任务", "进入页面", "教师复核"];
  const skills = islandArray(building.skill_chain);
  const evidence = islandArray(building.evidence_to_collect);
  const evidenceItems = evidence.length ? evidence : [building.evidence_to_collect || "任务输入、输出草案、风险边界和教师复核记录。"];
  return `<div class="island-panel-kicker">${idle ? "推荐从这里开始" : "当前任务"}</div>
    <h2>${escapeHtml(building.name || "选择一个建筑")}</h2>
    <p class="quest-title">${escapeHtml(building.quest_title || "点击小岛建筑，查看对应科研训练任务。")}</p>
    <p>${escapeHtml(building.quest_summary || building.role || "小人会走到对应建筑，并告诉你这个入口怎样帮助科研新手起步。")}</p>
    <div class="quest-focus">
      <div><span>解决的问题</span><strong>${escapeHtml(building.role || "把模糊需求转成任务")}</strong></div>
      <div><span>新手提示</span><strong>${escapeHtml(building.beginner_tip || "先明确输入材料，再运行Skill。")}</strong></div>
    </div>
    <div class="quest-steps">${steps.map((step, index) => `<div><span>${index + 1}</span><p>${escapeHtml(step)}</p></div>`).join("")}</div>
    <div class="quest-meta">
      <strong>调用链</strong>
      <div class="chip-row">${skills.length ? skills.map((s) => `<span>${escapeHtml(s)}</span>`).join("") : "<span>按任务自动选择Skill</span>"}</div>
    </div>
    <div class="quest-meta">
      <strong>要留下的证据</strong>
      <ul class="compact-evidence-list">${evidenceItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="quest-prompt">
      <strong>示例需求</strong>
      <p>${escapeHtml(building.starter_prompt || "我不知道从哪里开始，请帮我把目标拆成可执行任务。")}</p>
    </div>
    <div class="quest-reward">${escapeHtml(building.reward || "完成后获得一个可复核的小成果。")}</div>
    <p class="soft-note">${escapeHtml(building.safety_boundary || SAFETY)}</p>
    <div class="actions compact-actions">
      <button class="btn" onclick="navigate('${href}')">进入：${escapeHtml(building.name || "对应页面")}</button>
      <button class="btn ghost" onclick="focusIslandBuilding('${escapeHtml(building.id || "")}')">重新定位建筑</button>
    </div>`;
}

function drawBuilding(ctx, b, pos, i, selected = false) {
  const colors = ["#3f8f88", "#587fd0", "#6e985f", "#b87936", "#7864b8", "#a85764"];
  const body = colors[i % colors.length];
  const visited = island3DRuntime.visited.has(b.id);
  const x = pos.x;
  const y = pos.y + Math.sin((island3DRuntime.frame + i * 16) / 36) * 1.6;
  drawIsoTile(ctx, x, y + 46, 148, 74, selected ? "rgba(255,247,216,.88)" : "rgba(255,255,255,.74)", selected ? "rgba(180,83,9,.48)" : "rgba(16,32,51,.12)");
  ctx.save();
  ctx.globalAlpha = selected ? 0.24 : 0.11;
  ctx.fillStyle = selected ? "#b45309" : "#102033";
  ctx.beginPath();
  ctx.ellipse(x, y + 70, 58, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = body;
  ctx.strokeStyle = "rgba(16,32,51,.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x - 46, y - 48, 92, 72, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.86)";
  ctx.beginPath();
  ctx.moveTo(x - 56, y - 48);
  ctx.lineTo(x, y - 88);
  ctx.lineTo(x + 56, y - 48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = selected ? "#b45309" : "#0f766e";
  ctx.beginPath();
  ctx.roundRect(x - 20, y - 78, 40, 26, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "900 17px Microsoft YaHei, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(islandGlyph(b), x, y - 59);
  if (visited) {
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(x + 50, y - 78, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "900 12px Microsoft YaHei, system-ui, sans-serif";
    ctx.fillText("✓", x + 50, y - 74);
  }
  ctx.fillStyle = "#ffffff";
  for (let k = 0; k < 3; k++) {
    ctx.fillRect(x - 29 + k * 24, y - 24, 13, 18);
  }
  if (selected) {
    ctx.strokeStyle = "rgba(180,83,9,.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - 54, y - 92, 108, 122, 8);
    ctx.stroke();
  }
  ctx.fillStyle = "#102033";
  ctx.font = "700 15px Microsoft YaHei, system-ui, sans-serif";
  ctx.textAlign = "center";
  const label = (b.name || "任务入口").slice(0, 7);
  ctx.fillText(label, x, y + 56);
  return { x: x - 70, y: y - 92, w: 140, h: 168, building: b, targetX: x, targetY: y + 74 };
}

function renderIslandPanel(building) {
  const panel = el("island3d-panel");
  if (!panel) return;
  panel.innerHTML = islandPanelMarkup(building);
}

function updateIslandPassport(building) {
  const passport = el("island-passport");
  if (!passport) return;
  const scrollTop = window.scrollY || 0;
  passport.outerHTML = islandPassportMarkup();
  if (building && scrollTop > 0) window.scrollTo({ top: scrollTop });
}

function updateIslandHUD(building) {
  const total = Math.max(state.islandBuildings.length, 1);
  const hud = el("island3d-hud");
  if (hud) {
    hud.innerHTML = `<div><span>任务进度</span><strong>${Math.min(island3DRuntime.visited.size, total)}/${total}</strong></div>
      <div><span>当前建筑</span><strong>${escapeHtml(building?.name || "待选择")}</strong></div>
      <div><span>奖励</span><strong>${escapeHtml(building?.reward || "完成一个可复核小任务")}</strong></div>`;
  }
  const dialogue = el("island3d-dialogue");
  if (dialogue) {
    dialogue.innerHTML = `<strong>科研小向导</strong><p>${escapeHtml(island3DRuntime.dialogue)}</p>`;
  }
}

function focusIslandBuilding(id) {
  const building = state.islandBuildings.find((b) => b.id === id) || state.islandBuildings[0];
  if (!building) return;
  const entry = threeIslandRuntime.buildings.find((item) => item.building?.id === building.id);
  if (entry) {
    selectIslandBuilding(building, entry.position);
  } else {
    const index = Math.max(state.islandBuildings.findIndex((b) => b.id === building.id), 0);
    const fallback = island3DPositions(state.islandBuildings.length)[index] || { x: 560, y: 360 };
    island3DRuntime.avatar.tx = fallback.x;
    island3DRuntime.avatar.ty = fallback.y + 48;
    island3DRuntime.selected = building;
    island3DRuntime.visited.add(building.id);
    localStorage.setItem("medpath_island_visited", JSON.stringify([...island3DRuntime.visited]));
    island3DRuntime.dialogue = `${building.name}已定位：${building.beginner_tip || building.quest_summary || "先看输入，再看输出，最后留下复核证据。"}`;
    renderIslandPanel(building);
    updateIslandHUD(building);
    updateIslandPassport(building);
  }
  const stage = el("island-canvas");
  if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetThreeIslandRuntime() {
  if (threeIslandRuntime.animationId) cancelAnimationFrame(threeIslandRuntime.animationId);
  if (threeIslandRuntime.resizeHandler) window.removeEventListener("resize", threeIslandRuntime.resizeHandler);
  if (threeIslandRuntime.keyHandler) window.removeEventListener("keydown", threeIslandRuntime.keyHandler);
  if (threeIslandRuntime.renderer) {
    try {
      threeIslandRuntime.renderer.dispose();
    } catch {}
  }
  Object.assign(threeIslandRuntime, {
    ready: false,
    renderer: null,
    scene: null,
    camera: null,
    raycaster: null,
    pointer: null,
    avatar: null,
    avatarTarget: null,
    pathLine: null,
    keyHandler: null,
    buildings: [],
    animationId: null,
    resizeHandler: null,
  });
}

function islandWorldPositions(count) {
  const base = [
    [-4.8, -1.4], [-3.1, -3.2], [-1.0, -4.0], [1.2, -3.5], [3.5, -2.0],
    [4.4, .5], [2.5, 2.5], [.1, 3.2], [-2.5, 2.4], [-4.2, .7],
  ];
  const scale = .66;
  return base.slice(0, count).map(([x, z], index) => ({ x: x * scale, z: z * scale, index }));
}

function createThreeTextSprite(THREE, text, options = {}) {
  const canvas = document.createElement("canvas");
  const width = options.width || 512;
  const height = options.height || 160;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = options.background || "rgba(255,255,255,.88)";
  roundRectPath(ctx, 16, 18, width - 32, height - 36, 22);
  ctx.fill();
  ctx.strokeStyle = options.stroke || "rgba(16,32,51,.16)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = options.color || "#102033";
  ctx.font = options.font || "700 34px Microsoft YaHei, Noto Sans SC, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(text || "").slice(0, options.max || 12), width / 2, height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(options.scaleX || 2.05, options.scaleY || .64, 1);
  return sprite;
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function makeThreeTree(THREE, x, z, scale = 1) {
  const group = new THREE.Group();
  group.position.set(x, .22, z);
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(.045 * scale, .06 * scale, .34 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: .78 })
  );
  trunk.position.y = .17 * scale;
  group.add(trunk);
  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(.24 * scale, .58 * scale, 9),
    new THREE.MeshStandardMaterial({ color: 0x2f8f63, roughness: .66 })
  );
  crown.position.y = .56 * scale;
  group.add(crown);
  return group;
}

function makeThreePebble(THREE, x, z, scale = 1) {
  const pebble = new THREE.Mesh(
    new THREE.DodecahedronGeometry(.12 * scale, 0),
    new THREE.MeshStandardMaterial({ color: 0xd8c7a6, roughness: .92 })
  );
  pebble.position.set(x, .29, z);
  pebble.rotation.set(.4, x + z, .2);
  pebble.scale.y = .42;
  return pebble;
}

function addThreeIslandDecorations(THREE, scene) {
  const treeSpots = [
    [-4.7, -3.2, .95], [-3.9, 3.0, .78], [-1.8, 4.3, .72], [3.9, 2.9, .86],
    [4.8, -.9, .78], [1.1, 4.7, .62], [-5.0, .4, .64], [3.0, -4.1, .70],
  ];
  treeSpots.forEach(([x, z, s]) => scene.add(makeThreeTree(THREE, x, z, s)));
  const pebbleSpots = [
    [-2.6, -1.1, 1.0], [-.6, 2.5, .8], [1.9, .2, 1.1], [2.9, 1.5, .7],
    [-3.2, 1.3, .9], [.8, -2.4, .7], [4.5, .8, .8], [-4.1, -2.0, .7],
  ];
  pebbleSpots.forEach(([x, z, s]) => scene.add(makeThreePebble(THREE, x, z, s)));
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .28 });
  for (let i = 0; i < 4; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(6.35 + i * .28, .012, 8, 128), ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -.045 - i * .006;
    scene.add(ring);
  }
}

function makeThreeBuilding(THREE, building, index, position) {
  const colors = [0x2f8f83, 0x527ed1, 0x6a9856, 0xb87936, 0x735fb5, 0xaa5668, 0x2f7ca0];
  const group = new THREE.Group();
  group.position.set(position.x, 0, position.z);
  group.userData.building = building;
  group.userData.index = index;

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(.92, 1.18, .18, 6),
    new THREE.MeshStandardMaterial({ color: 0xf6f0cf, roughness: .74, metalness: .04 })
  );
  base.position.y = .09;
  base.scale.z = .72;
  base.rotation.y = Math.PI / 6;
  group.add(base);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(.95, .92, .82),
    new THREE.MeshStandardMaterial({ color: colors[index % colors.length], roughness: .62, metalness: .03 })
  );
  body.position.y = .66;
  group.add(body);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(.82, .55, 4),
    new THREE.MeshStandardMaterial({ color: 0xfff4d4, roughness: .56, metalness: .02 })
  );
  roof.position.y = 1.39;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);

  const icon = createThreeTextSprite(THREE, islandGlyph(building), {
    width: 220,
    height: 160,
    scaleX: .62,
    scaleY: .44,
    font: "900 58px Microsoft YaHei, Noto Sans SC, Arial, sans-serif",
    color: "#ffffff",
    background: "rgba(15,118,110,.92)",
    stroke: "rgba(255,255,255,.20)",
    max: 2,
  });
  icon.position.set(0, 1.75, .03);
  group.add(icon);

  const label = createThreeTextSprite(THREE, building.name || "Skill", {
    scaleX: 1.65,
    scaleY: .52,
    font: "800 30px Microsoft YaHei, Noto Sans SC, Arial, sans-serif",
    max: 9,
  });
  label.position.set(0, 2.28, 0);
  group.add(label);

  if (island3DRuntime.visited.has(building.id)) {
    const flag = createThreeTextSprite(THREE, "visited", {
      width: 220,
      height: 110,
      scaleX: .84,
      scaleY: .34,
      background: "rgba(240,253,244,.94)",
      stroke: "rgba(34,197,94,.32)",
      color: "#15803d",
      font: "900 32px Microsoft YaHei, Noto Sans SC, Arial, sans-serif",
      max: 7,
    });
    flag.position.set(.62, 1.18, .48);
    group.add(flag);
  }
  return group;
}

function updateThreeBuildingState() {
  if (!threeIslandRuntime.ready) return;
  threeIslandRuntime.buildings.forEach((entry) => {
    const selected = island3DRuntime.selected === entry.building;
    entry.group.scale.setScalar(selected ? 1.15 : 1);
    entry.group.traverse((node) => {
      if (node.isMesh && node.material && node.geometry?.type === "CylinderGeometry") {
        node.material.color.setHex(selected ? 0xffedb6 : 0xf6f0cf);
      }
    });
  });
}

function selectIslandBuilding(building, target = {}) {
  if (!building) return;
  island3DRuntime.selected = building;
  island3DRuntime.visited.add(building.id);
  localStorage.setItem("medpath_island_visited", JSON.stringify([...island3DRuntime.visited]));
  island3DRuntime.dialogue = `${building.name}已解锁：${building.beginner_tip || building.quest_summary || "打开任务，保留证据，并请求教师复核。"}`;
  renderIslandPanel(building);
  updateIslandHUD(building);
  updateIslandPassport(building);
  updateThreeBuildingState();
  if (target.x !== undefined && target.z !== undefined) {
    threeIslandRuntime.avatarTarget = { x: target.x, z: target.z + .82 };
  }
}

function islandBuildingByTourOffset(offset = 0) {
  const buildings = state.islandBuildings || [];
  if (!buildings.length) return null;
  const currentIndex = Math.max(buildings.findIndex((b) => b.id === island3DRuntime.selected?.id), -1);
  return buildings[(currentIndex + offset + buildings.length) % buildings.length];
}

function startIslandQuestTour() {
  const next = (state.islandBuildings || []).find((b) => !island3DRuntime.visited.has(b.id)) || islandBuildingByTourOffset(1);
  if (!next) return;
  island3DRuntime.dialogue = `导览开始：先去${next.name}。到达后请读任务目标、准备输入材料，并把输出交给教师或导师复核。`;
  focusIslandBuilding(next.id);
}

function advanceIslandQuest(offset = 1) {
  const next = islandBuildingByTourOffset(offset);
  if (!next) return;
  island3DRuntime.dialogue = `${offset > 0 ? "下一站" : "上一站"}：${next.name}。请先读“新手提示”，再决定是否进入正式功能页。`;
  focusIslandBuilding(next.id);
}

function startIslandRoute(routeId = "starter") {
  const route = islandCompassRoutes().find((x) => x.id === routeId) || islandCompassRoutes()[0];
  const firstStop = route.ids.map((id) => (state.islandBuildings || []).find((b) => b.id === id)).find(Boolean);
  if (!firstStop) return;
  island3DRuntime.dialogue = `路线已选择：${route.title}。目标不是逛完页面，而是完成“${route.output}”这一组可复核交付物。`;
  focusIslandBuilding(firstStop.id);
}

function randomIslandQuest() {
  const buildings = state.islandBuildings || [];
  if (!buildings.length) return;
  const pool = buildings.filter((b) => !island3DRuntime.visited.has(b.id));
  const candidates = pool.length ? pool : buildings;
  const index = Math.floor(Math.random() * candidates.length);
  const picked = candidates[index];
  island3DRuntime.dialogue = `随机任务：今天先探索${picked.name}。不要追求逛完整座岛，只要完成一个能留下证据的小任务。`;
  focusIslandBuilding(picked.id);
}

function resetIslandQuestProgress() {
  island3DRuntime.visited = new Set();
  island3DRuntime.selected = null;
  island3DRuntime.dialogue = "进度已重置。请选择一座建筑，科研小向导会把任务拆成输入、流程、风险边界和复核证据。";
  localStorage.setItem("medpath_island_visited", JSON.stringify([]));
  renderIslandPanel(state.islandBuildings[0] || {});
  updateIslandHUD(null);
  updateIslandPassport(null);
  updateThreeBuildingState();
  requestAnimationFrame(drawIsland3D);
}

function clampIslandAvatarTarget(x, z) {
  const radius = 5.15;
  const distance = Math.hypot(x, z);
  if (distance <= radius) return { x, z };
  return { x: (x / distance) * radius, z: (z / distance) * radius };
}

function nearestThreeBuildingToAvatar(maxDistance = .95) {
  if (!threeIslandRuntime.ready || !threeIslandRuntime.avatar) return null;
  let nearest = null;
  threeIslandRuntime.buildings.forEach((entry) => {
    const distance = Math.hypot(
      threeIslandRuntime.avatar.position.x - entry.position.x,
      threeIslandRuntime.avatar.position.z - entry.position.z
    );
    if (!nearest || distance < nearest.distance) nearest = { ...entry, distance };
  });
  return nearest && nearest.distance <= maxDistance ? nearest : null;
}

function moveThreeAvatarBy(dx, dz) {
  if (!threeIslandRuntime.ready || !threeIslandRuntime.avatarTarget) return;
  const next = clampIslandAvatarTarget(
    threeIslandRuntime.avatarTarget.x + dx,
    threeIslandRuntime.avatarTarget.z + dz
  );
  threeIslandRuntime.avatarTarget = next;
  island3DRuntime.dialogue = "你正在手动移动科研小向导。靠近建筑会自动打开对应任务；每一步都要留下输入、输出、风险边界和教师复核证据。";
  updateIslandHUD(island3DRuntime.selected);
}

function bindThreeIslandKeyboard() {
  if (threeIslandRuntime.keyHandler) window.removeEventListener("keydown", threeIslandRuntime.keyHandler);
  threeIslandRuntime.keyHandler = (event) => {
    const tag = String(event.target?.tagName || "").toLowerCase();
    if (["input", "textarea", "select"].includes(tag) || event.target?.isContentEditable) return;
    const step = .34;
    const key = String(event.key || "").toLowerCase();
    const moves = {
      arrowup: [0, -step],
      w: [0, -step],
      arrowdown: [0, step],
      s: [0, step],
      arrowleft: [-step, 0],
      a: [-step, 0],
      arrowright: [step, 0],
      d: [step, 0],
    };
    if (!moves[key]) return;
    event.preventDefault();
    moveThreeAvatarBy(moves[key][0], moves[key][1]);
  };
  window.addEventListener("keydown", threeIslandRuntime.keyHandler);
}

async function initThreeIsland3D() {
  const root = el("three-island-root");
  const fallback = el("island3d-canvas");
  const mode = el("island-render-mode");
  if (!root || !fallback) return false;
  resetThreeIslandRuntime();
  try {
    const THREE = await import(staticVendorUrl("three.module.min.js"));
    const width = Math.max(root.clientWidth || fallback.clientWidth || 900, 640);
    const height = Math.max(root.clientHeight || 620, 520);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef8ff);
    scene.fog = new THREE.Fog(0xeef8ff, 13, 24);

    const camera = new THREE.PerspectiveCamera(56, width / height, .1, 100);
    camera.position.set(0, 10.6, 10.8);
    camera.lookAt(0, .35, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    root.innerHTML = "";
    root.appendChild(renderer.domElement);
    root.classList.add("is-ready");
    fallback.classList.add("three-active-fallback-hidden");
    if (mode) mode.textContent = "Three.js";

    const hemi = new THREE.HemisphereLight(0xffffff, 0xcde6d8, 2.6);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff4dc, 3.8);
    sun.position.set(4, 8, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const water = new THREE.Mesh(
      new THREE.CircleGeometry(8.2, 96),
      new THREE.MeshStandardMaterial({ color: 0x83c7db, roughness: .86, metalness: .02, transparent: true, opacity: .56 })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -.08;
    scene.add(water);

    const island = new THREE.Mesh(
      new THREE.CylinderGeometry(5.9, 6.5, .42, 9),
      new THREE.MeshStandardMaterial({ color: 0xcfe8b6, roughness: .82 })
    );
    island.position.y = .02;
    island.receiveShadow = true;
    scene.add(island);
    addThreeIslandDecorations(THREE, scene);

    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xfff0bd, roughness: .76 });
    islandWorldPositions(state.islandBuildings.length).forEach((pos) => {
      const tile = new THREE.Mesh(new THREE.CylinderGeometry(.46, .52, .05, 6), pathMaterial);
      tile.position.set(pos.x, .27, pos.z);
      tile.rotation.y = Math.PI / 6;
      scene.add(tile);
    });

    const buildings = state.islandBuildings.length ? state.islandBuildings : [{ id: "start", name: "Skill", role: "starter" }];
    const positions = islandWorldPositions(buildings.length);
    threeIslandRuntime.buildings = buildings.map((building, index) => {
      const group = makeThreeBuilding(THREE, building, index, positions[index]);
      group.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      scene.add(group);
      return { group, building, position: positions[index] };
    });

    const avatar = new THREE.Group();
    const avatarBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(.22, .42, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xffe6a6, roughness: .52 })
    );
    avatarBody.position.y = .72;
    avatar.add(avatarBody);
    const avatarHead = new THREE.Mesh(
      new THREE.SphereGeometry(.24, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0x11756f, roughness: .48 })
    );
    avatarHead.position.y = 1.18;
    avatar.add(avatarHead);
    const earMaterial = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: .54 });
    [-.15, .15].forEach((x) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(.085, 14, 10), earMaterial);
      ear.position.set(x, 1.37, .02);
      ear.scale.y = 1.28;
      avatar.add(ear);
    });
    const faceMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-.085, .085].forEach((x) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(.025, 10, 8), faceMaterial);
      eye.position.set(x, 1.22, .225);
      avatar.add(eye);
    });
    const backpack = new THREE.Mesh(
      new THREE.BoxGeometry(.32, .36, .12),
      new THREE.MeshStandardMaterial({ color: 0x255aa8, roughness: .64 })
    );
    backpack.position.set(0, .78, -.25);
    avatar.add(backpack);
    const avatarLabel = createThreeTextSprite(THREE, "guide", {
      scaleX: 1.05,
      scaleY: .36,
      font: "900 30px Microsoft YaHei, Noto Sans SC, Arial, sans-serif",
      color: "#0f766e",
      background: "rgba(255,255,255,.92)",
      max: 5,
    });
    avatarLabel.position.y = 1.62;
    avatar.add(avatarLabel);
    avatar.position.set(-.25, .28, .25);
    scene.add(avatar);

    const pathGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-.25, .31, .25),
      new THREE.Vector3(-.25, .31, .25),
    ]);
    const pathLine = new THREE.Line(
      pathGeometry,
      new THREE.LineBasicMaterial({ color: 0xb45309, transparent: true, opacity: .48 })
    );
    scene.add(pathLine);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    renderer.domElement.addEventListener("pointerdown", (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const meshes = [];
      threeIslandRuntime.buildings.forEach((entry) => entry.group.traverse((node) => {
        if (node.isMesh) {
          node.userData.building = entry.building;
          node.userData.position = entry.position;
          meshes.push(node);
        }
      }));
      const hit = raycaster.intersectObjects(meshes, false)[0];
      if (hit?.object?.userData?.building) {
        selectIslandBuilding(hit.object.userData.building, hit.object.userData.position);
      } else {
        let nearest = null;
        threeIslandRuntime.buildings.forEach((entry) => {
          const projected = entry.group.position.clone().project(camera);
          const sx = (projected.x + 1) * .5 * rect.width;
          const sy = (-projected.y + 1) * .5 * rect.height;
          const distance = Math.hypot(event.clientX - rect.left - sx, event.clientY - rect.top - sy);
          if (!nearest || distance < nearest.distance) nearest = { ...entry, distance };
        });
        if (nearest && nearest.distance < 120) selectIslandBuilding(nearest.building, nearest.position);
      }
    });

    threeIslandRuntime.ready = true;
    Object.assign(threeIslandRuntime, { renderer, scene, camera, raycaster, pointer, avatar, avatarTarget: { x: -.25, z: .25 }, pathLine });
    updateThreeBuildingState();
    bindThreeIslandKeyboard();

    const animate = () => {
      threeIslandRuntime.animationId = requestAnimationFrame(animate);
      const t = performance.now() / 1000;
      threeIslandRuntime.buildings.forEach((entry, index) => {
        entry.group.position.y = Math.sin(t * 1.25 + index * .7) * .045;
        entry.group.rotation.y = Math.sin(t * .4 + index) * .035;
      });
      if (threeIslandRuntime.avatar && threeIslandRuntime.avatarTarget) {
        threeIslandRuntime.avatar.position.x += (threeIslandRuntime.avatarTarget.x - threeIslandRuntime.avatar.position.x) * .055;
        threeIslandRuntime.avatar.position.z += (threeIslandRuntime.avatarTarget.z - threeIslandRuntime.avatar.position.z) * .055;
        threeIslandRuntime.avatar.position.y = .28 + Math.sin(t * 3.4) * .035;
        if (threeIslandRuntime.pathLine) {
          threeIslandRuntime.pathLine.geometry.setFromPoints([
            new THREE.Vector3(threeIslandRuntime.avatar.position.x, .34, threeIslandRuntime.avatar.position.z),
            new THREE.Vector3(threeIslandRuntime.avatarTarget.x, .34, threeIslandRuntime.avatarTarget.z),
          ]);
        }
        const nearby = nearestThreeBuildingToAvatar(.72);
        if (nearby && island3DRuntime.selected !== nearby.building) {
          selectIslandBuilding(nearby.building, nearby.position);
        }
      }
      camera.position.x = 6.8 + Math.sin(t * .12) * .28;
      camera.position.z = 9.6 + Math.cos(t * .10) * .28;
      camera.lookAt(0, .45, 0);
      renderer.render(scene, camera);
    };
    animate();

    threeIslandRuntime.resizeHandler = () => {
      const nextWidth = Math.max(root.clientWidth || 900, 640);
      const nextHeight = Math.max(root.clientHeight || 620, 520);
      renderer.setSize(nextWidth, nextHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", threeIslandRuntime.resizeHandler);
    return true;
  } catch (error) {
    console.warn("Three island failed, using canvas fallback", error);
    if (mode) mode.textContent = "Canvas";
    root.classList.remove("is-ready");
    fallback.classList.remove("three-active-fallback-hidden");
    return false;
  }
}

function drawIsland3D() {
  const canvas = el("island3d-canvas");
  if (!canvas) return;
  island3DRuntime.frame += 1;
  const ctx = canvas.getContext("2d");
  const buildings = state.islandBuildings.length ? state.islandBuildings : [{ name: "方法馆", role: "按问题找方法", interaction: "打开方法宇宙" }];
  const positions = island3DPositions(buildings.length);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#e8f6ff");
  gradient.addColorStop(0.42, "#fff9ea");
  gradient.addColorStop(1, "#d7eedf");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  const wave = Math.sin(island3DRuntime.frame / 28) * 18;
  ctx.fillStyle = "rgba(94, 173, 207, .20)";
  ctx.beginPath();
  ctx.moveTo(0, 485 + wave * .18);
  ctx.bezierCurveTo(220, 430 + wave, 385, 565 - wave * .5, 580, 505 + wave * .22);
  ctx.bezierCurveTo(760, 450 - wave * .4, 910, 520 + wave * .45, 1120, 455 + wave * .16);
  ctx.lineTo(1120, 620);
  ctx.lineTo(0, 620);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(37,99,235,.16)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,.50)";
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.ellipse(95 + i * 145 + Math.sin((island3DRuntime.frame + i * 18) / 55) * 5, 68 + (i % 3) * 24, 42 + (i % 2) * 16, 14 + (i % 2) * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.strokeStyle = "rgba(15,118,110,.16)";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  positions.forEach((pos, i) => {
    if (i === 0) ctx.moveTo(pos.x, pos.y + 70);
    else ctx.lineTo(pos.x, pos.y + 70);
  });
  ctx.stroke();
  ctx.restore();

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      const x = 270 + (c - r) * 70;
      const y = 250 + (c + r) * 34;
      drawIsoTile(ctx, x, y, 118, 58, (c + r) % 2 ? "#bfe2ba" : "#d7efcf", "rgba(52,117,80,.18)");
    }
  }
  island3DRuntime.hits = positions
    .map((pos, i) => ({ pos, building: buildings[i], i }))
    .sort((a, b) => a.pos.y - b.pos.y)
    .map(({ pos, building, i }) => drawBuilding(ctx, building, pos, i, island3DRuntime.selected === building));
  island3DRuntime.avatar.x += (island3DRuntime.avatar.tx - island3DRuntime.avatar.x) * 0.11;
  island3DRuntime.avatar.y += (island3DRuntime.avatar.ty - island3DRuntime.avatar.y) * 0.11;
  const ax = island3DRuntime.avatar.x;
  const ay = island3DRuntime.avatar.y;
  ctx.fillStyle = "rgba(16,32,51,.18)";
  ctx.beginPath();
  ctx.ellipse(ax, ay + 34, 24, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffeaa7";
  ctx.strokeStyle = "rgba(16,32,51,.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(ax - 18, ay - 28, 36, 55, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1f7a74";
  ctx.beginPath();
  ctx.arc(ax, ay - 36 + Math.sin(island3DRuntime.frame / 12) * 1.4, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 14px Microsoft YaHei, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("研", ax, ay - 31 + Math.sin(island3DRuntime.frame / 12) * 1.4);
  if (Math.abs(island3DRuntime.avatar.tx - ax) > 0.6 || Math.abs(island3DRuntime.avatar.ty - ay) > 0.6 || el("island3d-canvas")) {
    requestAnimationFrame(drawIsland3D);
  }
}

function initIsland3D() {
  const canvas = el("island3d-canvas");
  if (!canvas) return;
  const mode = el("island-render-mode");
  if (mode) mode.textContent = "互动地图";
  drawIsland3D();
  canvas.onclick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const hit = island3DRuntime.hits.find((h) => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
    if (hit) {
      island3DRuntime.selected = hit.building;
      island3DRuntime.visited.add(hit.building.id);
      localStorage.setItem("medpath_island_visited", JSON.stringify([...island3DRuntime.visited]));
      island3DRuntime.dialogue = `${hit.building.name}已解锁：${hit.building.beginner_tip || hit.building.quest_summary || "先看任务，再进入正式功能页。"} 记得保留输入、输出和教师复核记录。`;
      island3DRuntime.avatar.tx = hit.targetX;
      island3DRuntime.avatar.ty = hit.targetY;
      renderIslandPanel(hit.building);
      updateIslandHUD(hit.building);
      requestAnimationFrame(drawIsland3D);
    }
  };
}

function renderPetPlan(key, demandText) {
  const profile = petProfile(key);
  const demand = demandText || "尚未填写具体需求";
  const routeHint = profile.links[0] || ["/journey-builder", "生成路线"];
  const methodHint = key === "plot" ? "先做字段审查，再选择R/ggplot2图谱" :
    key === "article" ? "先确定文章类型，再补齐材料包和图表链" :
    key === "method" ? "先判断方法适配性，再整理输入输出和导师复核问题" :
    key === "tool" ? "先核对原仓库、许可证和最小示例" :
    key === "audit" ? "先拦截隐私、临床误导、假引用和字段错误" :
    "先从科研路线生成器拆任务";
  return `<h4>${escapeHtml(profile.title)}生成的新手任务包</h4>
    <p><strong>你的需求：</strong>${escapeHtml(demand)}</p>
    <ol class="pet-plan-list">
      <li><strong>入口：</strong>先进入“${escapeHtml(routeHint[1])}”，路径为 <code>${escapeHtml(routeHint[0])}</code>。</li>
      <li><strong>材料：</strong>${escapeHtml(profile.prepare)}</li>
      <li><strong>方法：</strong>${escapeHtml(methodHint)}。</li>
      <li><strong>输出：</strong>生成任务清单、示例图/字段契约、模型API提示和教师/导师复核问题。</li>
      <li><strong>边界：</strong>${escapeHtml(profile.avoid)} 医学AI输出仅用于教学与科研训练，不替代临床诊断。</li>
    </ol>
    <div class="pet-plan-actions">
      ${profile.links.map(([href, label]) => `<a href="${href}" data-link>${escapeHtml(label)}</a>`).join("")}
    </div>`;
}

function demandSignals(demandText = "") {
  const text = String(demandText || "").toLowerCase();
  const has = (items) => items.some((x) => text.includes(x.toLowerCase()));
  const signals = [];
  if (has(["敲除", "knockout", "crispr", "cas9", "扰动"])) signals.push(["基因扰动", "先确认靶基因、模型体系、对照组、效率验证和脱靶风险。"]);
  if (has(["单细胞", "scrna", "scRNA", "细胞注释", "轨迹"])) signals.push(["单细胞分析", "先补齐样本批次、质控阈值、细胞注释依据和批次校正策略。"]);
  if (has(["空间", "spatial", "病理图像", "切片", "数字病理"])) signals.push(["空间/病理图像", "先说明图像来源、标注方式、分辨率、公开授权和人工复核路径。"]);
  if (has(["meta", "系统综述", "森林图", "纳排", "pico"])) signals.push(["循证综述", "先写清PICO问题、检索式、纳排标准、偏倚风险和效应量字段。"]);
  if (has(["机器学习", "深度学习", "预测", "模型", "auc"])) signals.push(["建模评价", "先区分训练/验证/外部验证，补齐标签定义、分割策略和性能指标。"]);
  if (has(["图", "可视化", "火山", "森林", "热图", "umap"])) signals.push(["科研绘图", "先核对字段契约、统计前提、图注边界和不可声称内容。"]);
  if (has(["文章", "论文", "投稿", "manuscript"])) signals.push(["文章流程", "先确定文章类型，再反推材料清单、图表链和报告规范。"]);
  if (has(["伦理", "隐私", "患者", "临床", "诊断"])) signals.push(["风险治理", "必须先做隐私、临床误导、引用可靠性和人工复核审查。"]);
  return signals.length ? signals : [["任务待分诊", "先把研究对象、比较关系、材料来源、目标产出和复核人写清楚。"]];
}

function demandReadinessItems({ kind = "method", object = {}, demand = "" } = {}) {
  const base = {
    method: ["研究问题是否能被该方法回答", "输入材料是否齐全", "推荐图表是否能解释输出", "导师复核问题是否明确"],
    plot: ["字段是否满足图形契约", "统计前提是否成立", "图注是否包含示意/待实测边界", "是否保留R/ggplot2脚本和数据表"],
    article: ["文章类型是否匹配材料", "图表链是否能支撑主线", "引用核验和报告规范是否清楚", "是否避免生成假结果和假审稿"],
    source: ["公开来源是否可追溯", "是否只使用允许复用的材料", "是否标注不可下载/不可复刻边界", "教师是否能复核来源解释"],
    tool: ["许可证是否允许使用", "输入输出是否读懂", "最小示例是否可运行", "版本参数是否记录"],
  }[kind] || [];
  const fromObject = []
    .concat(object.data_readiness_checklist || [])
    .concat(object.required_materials || [])
    .concat(object.inputs || [])
    .slice(0, 4);
  const demandHints = demandSignals(demand).slice(0, 2).map(([label, body]) => `${label}：${body}`);
  return [...demandHints, ...fromObject, ...base].filter(Boolean).slice(0, 8);
}

function renderDemandInsightPanel({ kind = "method", title = "当前任务", demand = "", object = {}, skillChain = [], plots = [], source = null } = {}) {
  const signals = demandSignals(demand);
  const readiness = demandReadinessItems({ kind, object, demand });
  const skills = (skillChain.length ? skillChain : object.skills_to_call || object.skill_chain || ["research-copilot", "ai-ethics-governor", "skill-eval-harness"]).slice(0, 6);
  const plotNames = (plots || []).map((x) => typeof x === "string" ? x : (x.zh_name || x.title || x.en_name || x.id)).filter(Boolean).slice(0, 5);
  const riskItems = [
    "不把模型输出写成真实研究结果",
    "不生成真实患者诊疗建议",
    "不伪造p值、图片、引用或专家意见",
    "正式使用前由导师/教师复核",
  ];
  const sourceLine = source ? `${source.title || source.source_platform || "公开来源"}：${source.reuse_boundary || source.source_note || "需核对来源许可和复用边界。"}` : (object.safety_boundary || SAFETY);
  return `<section class="demand-insight-board" aria-label="${escapeHtml(title)}需求解析">
    <div class="demand-insight-head">
      <span>${escapeHtml(kind.toUpperCase())} DEMAND ROUTER</span>
      <h3>${escapeHtml(title)} · 新手需求解析</h3>
      <p>${escapeHtml(demand || "尚未填写具体需求")}</p>
    </div>
    <div class="demand-signal-row">
      ${signals.map(([label, body], index) => `<article class="demand-signal-card tone-${index % 4}">
        <strong>${escapeHtml(label)}</strong>
        <p>${escapeHtml(body)}</p>
      </article>`).join("")}
    </div>
    <div class="demand-insight-grid">
      <article>
        <h4>先补齐的材料</h4>
        ${list(readiness)}
      </article>
      <article>
        <h4>建议调用的Skill链</h4>
        <p>${skills.map((x) => badge(x, "violet")).join("")}</p>
        <p class="soft-note">正式接入模型API后，每一步都要保留输入、输出、版本和人工复核记录。</p>
      </article>
      <article>
        <h4>可联动的图表/证据</h4>
        ${plotNames.length ? list(plotNames) : list(["先进入科研绘图室，根据字段契约选择图形", "示例图仅用于学习，不代表真实结果"])}
      </article>
      <article>
        <h4>边界与来源</h4>
        <p>${escapeHtml(sourceLine)}</p>
        ${list(riskItems)}
      </article>
    </div>
  </section>`;
}

function bindPetMentor() {
  const root = document.querySelector(".pet-bubble");
  if (!root) return;
  const toggle = root.querySelector("[data-pet-toggle]");
  const close = root.querySelector("[data-pet-close]");
  const openPanel = () => {
    root.classList.add("pet-expanded");
    document.body.classList.add("pet-panel-open");
    toggle?.setAttribute("aria-expanded", "true");
    try { localStorage.setItem("medpath_pet_last_context", petContextKey()); } catch {}
  };
  const closePanel = () => {
    root.classList.remove("pet-expanded");
    document.body.classList.remove("pet-panel-open");
    toggle?.setAttribute("aria-expanded", "false");
  };
  toggle?.addEventListener("click", openPanel);
  close?.addEventListener("click", closePanel);
  const planButton = el("pet-plan-button");
  if (planButton) {
    planButton.onclick = () => {
      const key = planButton.dataset.petPlan || petContextKey();
      const demand = el("pet-demand-input")?.value.trim();
      el("pet-plan-result").innerHTML = renderPetPlan(key, demand);
      bindLinks();
    };
  }
}

async function bindPageActions() {
  bindLinks();
  bindPetMentor();
  renderPluginList();
  if (el("global-search")) {
    el("global-search").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = e.target.value.trim();
        if (q.includes("扰动") || q.toLowerCase().includes("gears")) navigate("/method-runner/virtual-perturbation");
        else if (q.includes("图")) navigate("/plot-studio");
        else if (q.includes("审")) navigate("/governance");
        else if (q.includes("插件")) navigate("/plugins");
        else navigate("/researcher");
      }
    });
  }
  if (el("journey-build")) {
    el("journey-build").onclick = () => {
      el("journey-result").innerHTML = renderJourneyPlan(el("journey-demand").value);
      bindLinks();
    };
  }
  if (el("home-route-build")) {
    el("home-route-build").onclick = () => {
      el("home-route-result").innerHTML = renderHomeQuickRoute(el("home-demand").value);
      bindLinks();
    };
  }
  if (el("generate-pbl")) {
    el("generate-pbl").onclick = async () => {
      const data = await api("/api/simulate/case", { method: "POST", body: JSON.stringify({
        disease_system: el("teacher-disease").value,
        organ_system: el("teacher-organ").value,
        student_level: el("teacher-grade").value,
        teaching_goal: el("teacher-goal").value,
        difficulty: el("teacher-difficulty").value,
      }) });
      el("teacher-result").innerHTML = formatCase(data);
    };
  }
  if (el("student-feedback")) {
    el("student-feedback").onclick = async () => {
      const audit = await api("/api/governance/audit", { method: "POST", body: JSON.stringify({ text: el("student-report").value }) });
      el("student-result").innerHTML = `<h2>结构反馈</h2><p>请补充材料来源、镜下所见、依据链和不确定性表达。</p><h2>术语反馈</h2><p>建议把“考虑恶性肿瘤可能”改成教学训练中的证据描述，避免直接临床判断。</p><h2>证据链反馈</h2><p>需要把形态学特征、免疫组化或课程材料来源连接起来。</p><h2>治理审计</h2><p>${audit.risk_flags.map((x) => badge(x, "red")).join("")}</p>`;
    };
  }
  if (el("sim-generate")) {
    el("sim-generate").onclick = async () => {
      const data = await api("/api/simulate/case", { method: "POST", body: JSON.stringify({
        disease_system: el("sim-system").value,
        organ_system: el("sim-organ").value,
        student_level: el("sim-level").value,
        difficulty: el("sim-difficulty").value,
        teaching_goal: el("sim-goal").value,
      }) });
      el("sim-result").innerHTML = formatCase(data);
    };
  }
  if (location.pathname === "/compare") setCompare(state.activeCompare);
  if (el("os-search-btn")) {
    el("os-search-btn").onclick = () => renderOpenSource(el("os-search").value);
    renderOpenSource(el("os-search").value);
  }
  if (el("source-library-list")) {
    let activeSourceKind = "all";
    const runSourceFilter = () => renderSourceLibrary(activeSourceKind, el("source-library-query")?.value || "");
    el("source-library-query").oninput = runSourceFilter;
    document.querySelectorAll("[data-source-filter]").forEach((node) => {
      node.onclick = () => {
        activeSourceKind = node.dataset.sourceFilter || "all";
        runSourceFilter();
      };
    });
    runSourceFilter();
  }
  if (el("source-demand-build")) {
    el("source-demand-build").onclick = () => {
      const sourceId = el("source-demand-build").dataset.source || "";
      const demandText = el("source-demand-text")?.value || "";
      el("source-demand-result").innerHTML = renderSourceTaskPackage(sourceId, demandText);
    };
  }
  if (el("method-search")) {
    const renderMethods = () => {
      const q = el("method-search").value.trim().toLowerCase();
      const cat = el("method-category").value;
      const items = state.methodUniverse
        .filter((m) => (!cat || m.category === cat))
        .filter((m) => !q || `${m.name} ${m.category} ${m.beginner_question} ${m.what_it_solves} ${m.card_microcopy || ""} ${(m.inputs || []).join(" ")} ${(m.outputs || []).join(" ")}`.toLowerCase().includes(q))
        .slice(0, 90);
      el("method-universe-list").innerHTML = items.map(methodUniverseCard).join("");
    };
    el("method-search").oninput = renderMethods;
    el("method-category").onchange = renderMethods;
  }
  if (el("method-demand-build")) {
    el("method-demand-build").onclick = () => {
      const methodId = el("method-demand-build").dataset.method;
      const demandText = el("method-demand").value.trim();
      el("method-demand-result").innerHTML = renderMethodDemandPackage(methodId, demandText || "尚未填写具体需求");
    };
  }
  if (el("plot-advice")) {
    el("plot-advice").onclick = async () => {
      try {
        const text = el("plot-columns").value;
        const columns = text.split(/[,，\n]/).map((x) => x.trim()).filter(Boolean);
        const data = await api("/api/plot/advice", { method: "POST", body: JSON.stringify({ plot_id: el("plot-type").value, plot_type: el("plot-type").value, description: text, columns }) });
        el("plot-advice-result").innerHTML = renderPlotAdvice(data);
      } catch (err) {
        el("plot-advice-result").innerHTML = `<h2>字段审查暂未完成</h2><p>${escapeHtml(err.message || err)}</p><p class="soft-note">${escapeHtml(SAFETY)}</p>`;
      }
    };
  }
  if (el("plot-generate")) {
    el("plot-generate").onclick = async () => {
      try {
        const data = await api("/api/plot/generate", { method: "POST", body: JSON.stringify({ plot_id: el("plot-type").value, plot_type: el("plot-type").value }) });
        el("plot-result").innerHTML = `<h2>${escapeHtml(data.plot_type)}</h2>${data.svg}<pre id="plot-svg-source">${escapeHtml(data.svg)}</pre><p>${escapeHtml(data.caption)}</p><p>${escapeHtml(data.methods_text)}</p>`;
      } catch (err) {
        el("plot-result").innerHTML = `<h2>示例图生成暂未完成</h2><p>${escapeHtml(err.message || err)}</p><p class="soft-note">请先确认本地图谱服务和字段契约可用；真实出图必须使用自己的数据和脚本。</p>`;
      }
    };
  }
  if (el("plot-search")) {
    const renderPlots = () => {
      const q = el("plot-search").value.trim().toLowerCase();
      const cat = el("plot-category").value;
      const items = state.plotGallery
        .filter((p) => (!cat || p.category === cat))
        .filter((p) => !q || `${p.id} ${p.name || ""} ${p.zh_name || ""} ${p.en_name || ""} ${p.category || ""} ${p.answers_question || ""} ${p.question_answered || ""} ${p.plot_product_title || ""}`.toLowerCase().includes(q))
        .slice(0, 100);
      el("plot-gallery-list").innerHTML = items.map(plotGalleryCard).join("");
    };
    el("plot-search").oninput = renderPlots;
    el("plot-category").onchange = renderPlots;
  }
  if (el("article-build")) {
    el("article-build").onclick = async () => {
      const workflowId = el("article-build").dataset.workflow;
      const topic = el("article-topic").value;
      const data = await api("/api/article-workflows/build", {
        method: "POST",
        body: JSON.stringify({ workflow_id: workflowId, topic }),
      });
      const workflow = state.articleWorkflows.find((x) => x.id === workflowId) || {};
      el("article-build-result").innerHTML = renderArticleDemandPackage(data, workflow, topic);
    };
  }
  if (el("plot-demand-build")) {
    el("plot-demand-build").onclick = () => {
      const plotId = el("plot-demand-build").dataset.plot;
      const demand = el("plot-demand")?.value || "";
      el("plot-demand-result").innerHTML = renderPlotTaskPackage(plotId, demand);
      bindLinks();
    };
  }
  if (el("tool-demand-build")) {
    el("tool-demand-build").onclick = () => {
      const toolId = el("tool-demand-build").dataset.tool;
      const demand = el("tool-demand")?.value || "";
      el("tool-demand-result").innerHTML = renderOpenSourceToolTaskPackage(toolId, demand);
      bindLinks();
    };
  }
  if (el("run-data-audit")) {
    el("run-data-audit").onclick = async () => {
      const text = el("audit-description").value;
      const columns = text.split(/[,，\n]/).map((x) => x.trim()).filter(Boolean);
      const data = await api("/api/data-audit/run", { method: "POST", body: JSON.stringify({ description: text, columns }) });
      el("data-audit-result").innerHTML = `<h2>审查建议</h2><p>${escapeHtml(data.note)}</p><div class="audit-hit-grid">${data.matched_rules.map((r) => `<article><h3>${escapeHtml(r.topic)} · ${escapeHtml(r.level)}</h3>${badge(r.severity, r.severity === "high" ? "red" : "blue")}<p>${escapeHtml(r.check)}</p><p>${escapeHtml(r.how_to_fix)}</p></article>`).join("")}</div><h3>下一步</h3>${list(data.recommended_next_steps || [])}`;
    };
  }
  if (el("island-avatar")) {
    document.querySelectorAll(".island-building").forEach((node) => {
      node.addEventListener("click", () => {
        const rect = node.getBoundingClientRect();
        const parent = node.closest(".island-board").getBoundingClientRect();
        const avatar = el("island-avatar");
        avatar.style.left = `${rect.left - parent.left + rect.width / 2 - 24}px`;
        avatar.style.top = `${rect.top - parent.top + rect.height + 8}px`;
        el("island-dialogue").innerHTML = `<h2>${escapeHtml(node.dataset.name)}</h2><p><strong>它解决：</strong>${escapeHtml(node.dataset.role)}</p><p><strong>你可以这样用：</strong>${escapeHtml(node.dataset.interaction)}</p><p class="soft-note">游戏化只是导航层；正式输出仍要经过数据审查、Skill流程和教师/专家复核。</p>`;
      });
    });
  }
  if (el("island3d-canvas")) {
    const threeStarted = await initThreeIsland3D();
    if (!threeStarted) {
      initIsland3D();
    }
  }
  if (el("sb-generate")) {
    el("sb-generate").onclick = async () => {
      const data = await api("/api/skill-builder/generate", { method: "POST", body: JSON.stringify({
        name: el("sb-name").value,
        zh_name: el("sb-zh").value,
        task: el("sb-task").value,
        inputs: el("sb-inputs").value,
        outputs: el("sb-outputs").value,
        risk_boundary: el("sb-risk").value,
      }) });
      el("sb-result").innerHTML = `<h2>SKILL.md</h2><pre>${escapeHtml(data.skill_md)}</pre><h2>plugin.json</h2><pre>${escapeHtml(JSON.stringify(data.plugin_json, null, 2))}</pre><h2>eval.yaml</h2><pre>${escapeHtml(data.eval_yaml)}</pre>`;
    };
  }
  if (location.pathname === "/providers") renderProviders();
  if (el("gw-normalize")) {
    el("gw-normalize").onclick = async () => {
      const data = await api("/api/model-gateway/normalize", { method: "POST", body: JSON.stringify(gatewayPayload()) });
      el("gw-normalized").innerHTML = renderGatewayPackage(data);
    };
  }
  if (el("gw-task")) {
    el("gw-task").onchange = updateGatewayTaskPreview;
    updateGatewayTaskPreview();
  }
  if (el("gw-mock")) {
    el("gw-mock").onclick = async () => {
      const data = await api("/api/model-gateway/mock-generate", { method: "POST", body: JSON.stringify(gatewayPayload()) });
      el("gw-output").innerHTML = renderGatewayMock(data);
      el("gw-normalized").innerHTML = renderGatewayPackage(data.normalized_request);
    };
  }
  if (el("gov-audit")) {
    el("gov-audit").onclick = async () => {
      const data = await api("/api/governance/audit", { method: "POST", body: JSON.stringify({ text: el("gov-text").value }) });
      el("gov-result").innerHTML = `<h2>审计结果</h2><p>${data.risk_flags.map((x) => badge(x, "red")).join("")}</p><p>需人工复核：${data.human_review_required ? "是" : "否"}</p><p>${data.safety || SAFETY}</p>`;
    };
  }
}

function downloadText(filename, content) {
  const blob = new Blob([content || ""], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function copyText(text) {
  navigator.clipboard?.writeText(text);
  alert("已复制");
}

function resetPremiumMotion() {
  motionRuntime.cleanups.forEach((cleanup) => {
    try {
      cleanup();
    } catch {
      // Best-effort cleanup; animation should never block page rendering.
    }
  });
  motionRuntime.cleanups = [];
  if (motionRuntime.observer) {
    motionRuntime.observer.disconnect();
    motionRuntime.observer = null;
  }
  document.querySelectorAll(".motion-chapter-rail").forEach((node) => node.remove());
}

function readableChapterTitle(node, index) {
  const heading = node.querySelector("h2, h3, strong");
  const raw = (heading && heading.textContent ? heading.textContent : node.textContent || "").trim().replace(/\s+/g, " ");
  return raw ? raw.slice(0, 18) : `第${index + 1}幕`;
}

function attachChapterRail(targets) {
  const page = document.querySelector(".page-sheet");
  const sections = targets.filter((node) => node && node.getBoundingClientRect().height > 120).slice(0, 9);
  if (!page || sections.length < 4 || window.innerWidth < 980) return;
  const rail = document.createElement("nav");
  rail.className = "motion-chapter-rail";
  rail.setAttribute("aria-label", "本页章节进度");
  rail.innerHTML = `<span class="motion-rail-title">阅读进度</span>${sections
    .map((node, index) => {
      const label = readableChapterTitle(node, index);
      return `<button type="button" class="motion-rail-dot" data-motion-index="${index}" title="${escapeHtml(label)}"><span>${String(index + 1).padStart(2, "0")}</span></button>`;
    })
    .join("")}`;
  document.querySelector(".workspace")?.appendChild(rail);

  rail.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-motion-index") || 0);
      sections[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  const updateActive = () => {
    const viewportLine = window.innerHeight * 0.46;
    let active = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    sections.forEach((node, index) => {
      const rect = node.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * 0.25 - viewportLine);
      if (rect.bottom > 90 && rect.top < window.innerHeight && distance < bestDistance) {
        bestDistance = distance;
        active = index;
      }
    });
    rail.querySelectorAll("button").forEach((button, index) => {
      button.classList.toggle("active", index === active);
    });
  };
  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive, { passive: true });
  motionRuntime.cleanups.push(() => window.removeEventListener("scroll", updateActive));
  motionRuntime.cleanups.push(() => window.removeEventListener("resize", updateActive));
  motionRuntime.cleanups.push(() => rail.remove());
}

function initPremiumMotion() {
  resetPremiumMotion();
  document.documentElement.classList.add("motion-ready");
  requestAnimationFrame(() => document.body.classList.remove("route-turning"));
  const progress = document.querySelector(".scroll-progress");
  const updateProgress = () => {
    if (!progress) return;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const pct = Math.min(1, Math.max(0, window.scrollY / max));
    progress.style.transform = `scaleX(${pct})`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  motionRuntime.cleanups.push(() => window.removeEventListener("scroll", updateProgress));
  motionRuntime.cleanups.push(() => window.removeEventListener("resize", updateProgress));
  const motionTargets = Array.from(document.querySelectorAll(".section, .method-product-hero, .source-proof-card, .product-story-sections article, .story-chapter, .story-lead, .learning-rail article, .premium-figure-rail article, .home-route-steps article, .method-card, .plot-card, .tool-card, .plugin-card, .source-visual-card"));
  motionTargets.forEach((node, index) => {
    node.classList.add("reveal-on-scroll");
    node.style.setProperty("--reveal-delay", `${Math.min(index * 35, 260)}ms`);
  });
  const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.10 }) : null;
  if (observer) {
    motionRuntime.observer = observer;
    motionTargets.forEach((node) => {
      observer.observe(node);
    });
  } else {
    motionTargets.forEach((node) => node.classList.add("is-visible"));
  }
  attachChapterRail(motionTargets);
}

async function render() {
  document.getElementById("app").innerHTML = currentPage();
  await bindPageActions();
  initPremiumMotion();
}

window.addEventListener("popstate", render);
if (STATIC_MODE) window.addEventListener("hashchange", render);
Object.assign(window, {
  navigate,
  togglePlugin,
  setCompare,
  testProvider,
  downloadText,
  copyText,
  el,
  focusIslandBuilding,
  startIslandQuestTour,
  randomIslandQuest,
  resetIslandQuestProgress,
  renderHomeQuickRoute,
});

loadInitialData()
  .then(render)
  .catch((err) => {
    document.getElementById("app").innerHTML = `<main class="page"><h1>启动失败</h1><pre>${escapeHtml(err.stack || err.message)}</pre></main>`;
  });

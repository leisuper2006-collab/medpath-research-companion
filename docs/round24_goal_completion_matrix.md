# Round 24：MedPath Research Companion 目标完成度矩阵

## 目的

本矩阵按当前 goal 的显性要求逐项核对当前项目证据。状态只依据当前文件、页面、脚本和测试结果，不以口头描述替代完成证明。

## 数据与功能规模

| 目标项 | 当前证据 | 当前数量/状态 | 要求 | 判断 |
|---|---|---:|---:|---|
| 300+科研方法库 | `data/method_universe.json` | 674 | 300+ | 已达标 |
| 基因敲除/扰动方法家族 | `data/gene_perturbation_methods.json` | 24 | 十几种以上 | 已达标 |
| 20+文章Skill | `data/article_skill_workflows.json` | 28 | 20+ | 已达标 |
| 80+科研绘图室 | `data/plot_gallery_taxonomy.json` | 100 | 80+ | 已达标 |
| 数据审查 | `data/data_audit_rules.json` | 72条规则 | 有字段/统计/伦理审查 | 已达标 |
| 模型API规范化 | `/model-gateway`，`data/model_gateway_templates.json` | 已有页面和模板 | 接入用户自有API的规范化结构 | 已达标但可继续增强 |
| 开源工具/仓库导航 | `data/open_source_catalog.json` | 83个工具卡 | 工具说明、license、示例图、风险边界 | 已达标 |
| AI Skills说明库 | `data/skills.json` | 16个Skill说明 | 10个核心Skill以上 | 已达标 |
| 合成教学案例 | `data/synthetic_cases.json` | 120个案例 | 有案例引擎/训练材料 | 已达标 |

## 视觉与交互

| 目标项 | 当前证据 | 状态 | 仍需推进 |
|---|---|---|---|
| 艺术化网站 | `apps/web/static/styles.css`，`docs/round21_ui_upgrade_report.md`，多张页面截图 | 已完成一轮高级化改造 | 可继续加入更强滚动叙事、微交互和主题皮肤 |
| 桌宠 | 页面右下角“小向导”，`data/pet_dialogues.json` | 已存在 | 可继续加入更多情境对话和任务状态 |
| 3D科研小岛 | `/island-3d`，`docs/round22_island3d_v2.png` | 已有可点、可对话、可记录进度的本地原型 | 可继续升级为更真实的3D模型/游戏任务 |
| 手机端App路线 | `/mobile-app`，`docs/round22_mobile_app_route.png`，`docs/round24_mobile_app_figma_handoff_page_v2.png` | 已有网页高保真路线与可导入Figma的SVG设计板 | Figma真实云文件仍需MCP连接恢复后创建 |
| 动态翻页/动画 | 路由转场、滚动锚点、产品故事区、小岛动画 | 部分完成 | 需要继续扩展到更多详情页和移动端 |

## 示例图与真实公开来源

| 目标项 | 当前证据 | 状态 | 说明 |
|---|---|---|---|
| 每个方法/文章/工具有示例图 | `docs/round22_example_source_coverage_audit.md` | 已覆盖 | 方法674、文章28、图谱100、工具83均有示例图字段 |
| 真实公开数据示例 | `scripts/round23_reproduce_cbioportal_brca_mutation_plot.R` | 已新增1个可复现样例 | cBioPortal公开API + R/ggplot2教学改绘 |
| 顶刊/公开来源线索 | `data/public_example_sources.json` | 已覆盖80个公开来源线索 | 不复制论文原图，不下载受控数据 |

## 发布与验证

| 目标项 | 当前证据 | 状态 |
|---|---|---|
| GitHub Pages静态包 | `dist/github-pages-demo` | 已生成 |
| GitHub Actions | `.github/workflows/ci.yml`，`.github/workflows/pages.yml` | 已存在 |
| 发布准备说明 | `docs/round23_github_publish_readiness.md` | 已完成 |
| API测试 | `pytest apps/api/tests -q` | 20 passed |
| 发布准备检查 | `scripts/round12_release_readiness_check.py` | PASS |
| 内容唯一性检查 | `scripts/round13_content_uniqueness_audit.py` | 无失败项 |
| 绘图室链接检查 | `scripts/round17_plot_studio_linkage_check.py` | PASS |

## 仍未完全闭环的关键项

1. Figma真实设计文件：当前已有移动端网页原型、可导入Figma的SVG设计板和交付报告，但Figma MCP连接仍失败，需要连接恢复后创建云端Figma文件。
2. 3D游戏顶尖化：当前是Canvas等距任务岛，不是Three.js/真实建模级游戏；后续可引入Three.js角色、建筑模型、路径寻路和任务对话。
3. 每个最小单元真实数据复现：当前已有一个真实公开API复现模板，674个方法不可能一轮全部完成真实复现；应按高频方法逐批扩展。
4. GitHub真实发布：项目目录当前尚未初始化为Git仓库，不能证明已发布到公网；需要用户指定目标仓库或执行初始化/远程推送。
5. Android/iOS原生App：当前为移动端网页产品路线，不是原生App包。

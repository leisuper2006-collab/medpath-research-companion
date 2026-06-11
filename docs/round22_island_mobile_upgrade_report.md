# Round 22：3D科研小岛与手机端App路线升级报告

## 本轮目标

本轮围绕“科研小白能不能看懂、能不能点进去、能不能知道下一步做什么”继续推进网站体验。重点不是新增空泛页面，而是把两个用户最关心的入口做实：

1. 3D科研小岛：从静态等距图升级为可点击、可对话、可记录学习进度的任务岛。
2. 手机端App路线：新增 `/mobile-app` 页面，把移动端设计拆成使用场景、手机样机、学习路径、需求输入窗口和Figma/开发交付说明。

## 已完成建设

### 1. 3D科研小岛交互升级

修改文件：

- `apps/web/static/app.js`
- `apps/web/static/styles.css`

新增能力：

- 点击建筑后，角色移动到对应建筑附近。
- 被访问建筑会写入本地 `localStorage`，页面显示学习进度。
- 小向导对话会根据建筑任务动态更新，不再只显示固定说明。
- 右侧任务面板展示建筑对应的任务标题、三步行动、调用链、证据材料和安全边界。
- 小岛画面加入轻量动画：建筑浮动、水面与云层变化、角色轻微呼吸。

验证截图：

- `docs/round22_island3d_v2.png`

### 2. 手机端App路线页面

新增页面：

- `/mobile-app`

修改文件：

- `apps/web/static/app.js`
- `apps/web/static/styles.css`

页面内容：

- “刚接触课题、准备做实验、开始写文章、提交材料前”四类高频使用时刻。
- 三个手机样机屏幕：方法导航、文章流程、数据审查。
- 从0到交付的六步学习路径：提出需求、选择路线、准备材料、运行Skill、审查风险、教师复核。
- 需求描述窗口：展示如何把“我想写Meta分析但不知道怎么开始”转化为文章全流程Skill。
- Figma与开发交付路线：组件层、数据层、安全层。

验证截图：

- `docs/round22_mobile_app_route.png`
- `docs/round22_mobile_app_mobile_view.png`

### 3. 发布包同步

已重新生成静态发布目录：

- `dist/github-pages-demo`

### 4. 卡片入口示例图与唯一化说明升级

为回应“每个小卡片和链接都不能重复、要有示例图和真实来源线索”的要求，本轮继续检查并增强了列表页入口：

- `method_universe.json`：674个方法均已绑定 `example_visual` 与 `public_source_example` 字段，示例图路径674个唯一。
- `article_skill_workflows.json`：28类文章流程均已绑定独立示例图，文章侧栏入口已显示缩略图、文章类型和差异化说明。
- `plot_gallery_taxonomy.json`：100种科研图谱均已绑定独立示例图，图谱详情页保留字段要求、R/ggplot2路线、常见错误和模型提示词。
- `open_source_catalog.json`：83个开源工具均已绑定示例图和公开来源线索；列表页已增加工具缩略图与前景说明层，避免SVG缩略图显示过淡时出现空白感。

修改文件：

- `apps/web/static/app.js`
- `apps/web/static/styles.css`

新增验证截图：

- `docs/round22_method_universe_cards.png`
- `docs/round22_article_workshop_tabs.png`
- `docs/round22_open_source_cards.png`
- `docs/round22_open_source_cards_v2.png`

## 检查结果

已运行：

- `python scripts\round12_release_readiness_check.py`：通过
- `python scripts\round15_island_pet_check.py`：通过
- `pytest apps\api\tests -q`：20项通过
- `python scripts\round13_content_uniqueness_audit.py`：通过，无重复内容失败项
- `python scripts\round17_plot_studio_linkage_check.py`：通过
- `python scripts\build_static_release.py`：已生成静态发布包
- `python scripts\round13_content_uniqueness_audit.py`：通过，无重复内容失败项

## 边界说明

- 3D科研小岛仍为本地教学原型，不代表正式游戏产品上线。
- 手机端页面是移动App产品蓝图和网页原型，不代表已完成iOS/Android原生App。
- 医学AI相关输出仍限定为教学与科研训练，不替代临床诊断，不用于真实患者处置。

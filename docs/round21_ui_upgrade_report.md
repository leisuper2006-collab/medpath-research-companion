# Round21 UI 升级报告

## 1. 本轮解决的问题

用户指出旧版界面存在以下问题：页面不够好看、卡片和链接中的文字重复、科研新手不知道每个方法能做什么、详情页不像高水平产品页、示例图与学习路径不够突出。

本轮围绕这些问题完成了前端升级：

1. 首页增加“证据图精选”和“六步学习路径”，让新手先看到方法会产生什么图、该按什么顺序学习。
2. 方法详情页加入本页导航、产品式首屏、示例图、公开来源边界、四段式叙事、学习路径、输入输出、误区、导师复核和需求描述窗口。
3. 文章工坊详情页加入本页导航、文章类型选择、示例图、材料清单、Skill链、图表计划、模型网关提示和人工复核提醒。
4. 开源工具详情页加入本页导航、工具适用边界、许可证/状态、示例图、公开来源、学习路径和模型提示词。
5. 增加滚动进度、页面转场、桌宠轻动效和产品页锚点导航。
6. 修复滚动显现导致整页截图出现空白的问题。

## 2. 修改文件

- `apps/web/static/app.js`
- `apps/web/static/styles.css`
- `docs/round21_premium_design_system.md`
- `docs/round21_visual_reference_and_figma_status.md`
- `docs/round21_desktop_ui_concept.png`

## 3. 视觉参考

本轮参考 Apple Design Awards、Figma 2026 Web Design Trends、Aceternity UI、Magic UI 的公开设计方向，但未复制外部代码、模板或商业素材。

## 4. 截图证据

- 首页：`docs/round21_home_v2.png`
- 方法详情：`docs/round21_method_detail_v2.png`
- 文章工坊：`docs/round21_article_detail_v2.png`
- 开源工具详情：`docs/round21_tool_detail_v2.png`

## 5. Figma 状态

Figma MCP 仍因握手失败未能写入设计文件。已记录到 `docs/round21_visual_reference_and_figma_status.md`。当前采用本地设计规范、概念图、真实网页截图和源代码实现作为交付。

## 6. 仍需下一轮继续加强

1. 3D 科研小岛可继续从 canvas 原型升级到更丰富的任务地图和互动角色。
2. 手机端 App 可在 Figma 连接恢复后沉淀正式移动端原型。
3. 可进一步为每个方法绑定更精细的公开数据来源说明和可复现实例脚本。
4. 若用户提供 GitHub 仓库权限，可继续执行发布到 GitHub Pages 或 Vercel 的发布流程。

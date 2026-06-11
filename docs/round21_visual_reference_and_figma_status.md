# Round21 视觉参考与 Figma 状态

## 1. 参考来源

本轮视觉升级参考的是公开可访问的设计趋势和组件生态，不复制外部代码、模板或商业素材。

- Apple Design Awards 2026：用于理解“创新、交互、视觉图形、包容性”等高质量应用评审维度。来源：https://developer.apple.com/design/awards/
- Figma Web Design Trends 2026：用于参考 3D/沉浸式元素、实验导航、动效、游戏化等趋势。来源：https://www.figma.com/resource-library/web-design-trends/
- Aceternity UI：用于参考 React/Next.js 动效组件的交互节奏，但本项目未复制其代码。来源：https://ui.aceternity.com/components
- Magic UI：用于参考轻量动效组件和 shadcn 风格生态，但本项目未复制其代码。来源：https://magicui.design/

## 2. 本轮视觉概念图

已生成桌面端高级概念图，保存为：

`docs/round21_desktop_ui_concept.png`

该图只作为视觉方向参考，不作为网页静态截图嵌入。页面实现仍使用原生 HTML/CSS/JS 和本地数据。

## 3. 本轮落地原则

1. 首页从“入口按钮”升级为“任务入口 + 证据图精选 + 学习路径 + 平台逻辑”。
2. 方法、文章、工具详情页采用 Apple 式产品页节奏：本页导航、示例图、来源边界、故事分段、学习路径、需求窗口。
3. 每个最小内容单元继续依赖 `method_universe.json`、`article_skill_workflows.json` 和 `open_source_catalog.json` 的唯一化字段，不共用空泛模板。
4. 证据型图表仍来自本地脚本或合成教学数据，不使用图像生成模型伪造统计图。
5. 生成式图像只用于视觉概念，不作为真实科研证据。

## 4. Figma 尝试状态

本轮再次尝试连接 Figma MCP，仍失败：

`MCP startup failed: handshaking with MCP server failed: Transport channel closed`

因此，本轮未直接写入 Figma 文件。当前替代交付为：

- 本地高级视觉规范：`docs/round21_premium_design_system.md`
- 本地概念图：`docs/round21_desktop_ui_concept.png`
- 实际前端实现与浏览器截图

后续若 Figma 连接恢复，可用上述文件反向沉淀桌面端与移动端设计稿。

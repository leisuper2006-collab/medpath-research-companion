# Figma 交接指南

## 当前状态

Figma MCP 在 Round13 尝试时握手失败，因此尚未生成线上 Figma 文件。本目录提供可导入设计规范，等待 Figma 连接恢复后执行。

## 建议创建的 Figma 文件

文件名：

`MedPath Research Companion - Product Detail System`

## 建议页面结构

1. `Design Tokens`
   - 颜色；
   - 字体；
   - 间距；
   - 阴影；
   - 圆角；
   - 安全标注规则。

2. `Desktop Detail Templates`
   - 方法详情页；
   - 文章流程详情页；
   - 科研图谱详情页；
   - 开源工具详情页。

3. `Mobile App Flow`
   - 首页；
   - 研究路径生成；
   - 方法详情；
   - 绘图详情；
   - 文章流程；
   - 复核清单。

4. `Research Island`
   - 3D小岛主界面；
   - 建筑入口；
   - 对话框；
   - 任务完成状态。

5. `Evidence Components`
   - 公开来源卡；
   - 示例图框；
   - 数据字段契约；
   - 安全边界标注。

## 导入顺序

1. 使用 `design_tokens.json` 建立变量和样式。
2. 根据 `component_spec.md` 创建组件。
3. 根据网页截图建立高保真参考：
   - `docs/round13_method_detail_verified.png`
   - `docs/round13_article_detail_verified.png`
   - `docs/round13_plot_detail_verified.png`
   - `docs/round13_tool_detail_verified.png`
   - `docs/round13_method_detail_mobile_verified.png`
4. 在 Figma 中对桌面和移动端分别创建可编辑 frame。
5. 再反向同步 CSS tokens。

## 禁止事项

- 不要把网页截图当作最终 UI 元件直接贴死；
- 不要让 Figma 生成复杂中文图表；
- 不要使用 OpenAI、学校或医院 logo，除非有授权；
- 不要把示例图写成真实研究图；
- 不要移除医学AI安全边界。

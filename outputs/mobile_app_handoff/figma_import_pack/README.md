# MedPath Mobile App Figma Import Pack

本目录是 Round63 生成的 Figma 可导入/可复建设计包。当前 Figma MCP 握手失败，未能直接创建线上 Figma 文件，因此这里提供本地可审查交付物，等待 Figma 连接恢复后可直接复建。

## 文件

- `medpath_mobile_app_figma_handoff.svg`：当前手机端App交付设计板，可直接拖入 Figma。
- `figma_import_manifest.json`：导入清单、屏幕定义和安全边界。
- `medpath_mobile_tokens.json`：颜色、字体、圆角和间距 token。
- `figma_use_rebuild_mobile_app.js`：可在 Figma Plugin API / use_figma 中运行的复建脚本。

## 核心屏幕

- 科研任务首页：让科研新手用一句话描述需求，并立即获得方法、图表、文章、工具与审查路线。
- 研究路径生成器：把基因敲除、Meta分析、单细胞、病理PBL等需求拆成一周可执行路线。
- 方法详情页：像产品页一样解释每个方法的用途、输入、输出、失败条件、示例图和学习路径。
- 科研图详情页：展示该图回答什么问题、需要哪些字段、示例图如何生成、数据不合格时如何修正。
- 伦理复核页：在AI输出进入论文、课程或训练材料前检查隐私、伪造引用、临床误导和教师复核。

## 使用方式

1. 如果只需要视觉交付：把 `medpath_mobile_app_figma_handoff.svg` 拖入 Figma。
2. 如果需要可编辑组件：在 Figma 插件环境或 `use_figma` 恢复后运行 `figma_use_rebuild_mobile_app.js`。
3. 导入后应人工检查中文字体、间距、按钮状态和移动端滚动层级。

## 边界

- 本包不代表已经创建线上 Figma 文件。
- 不含学校 logo、OpenAI logo、真实患者信息或真实平台账号。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断。

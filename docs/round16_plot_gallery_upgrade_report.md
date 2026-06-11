# Round16 图谱宇宙升级说明

## 本轮目标

把“图谱宇宙”从简单卡片列表升级为科研新手能直接理解的图形方法入口。每张卡片不再只用抽象小条表示图形，而是直接展示脚本生成的 SVG 示例图、公开来源线索、字段契约、推荐工具和常见错误入口。

## 已完成内容

- 图谱总览区新增 4 个入口指标：100 种图谱方法、示例图绑定、R/ggplot2 路线、先审查再出图。
- 100 个图谱卡片全部展示真实 SVG 缩略图。
- 每张图谱卡片显示公开来源等级和来源平台，例如 Science 公开研究来源、cBioPortal public API 等。
- 每张卡片显示“它回答什么”“需要字段”“推荐工具”和“常见错误与模型提示”。
- 列表页默认展示 100 个图谱，不再只展示前 60 个。
- 移动端总览区与卡片高度做了适配。

## 真实性边界

图谱缩略图为本地脚本生成的教学改绘或合成数据示例，用于说明图形结构、字段要求和读图方式；不代表真实研究结果，不复制论文原图，不下载受控数据。用户接入自己的数据和模型 API 后，仍需通过数据审查、统计复核和导师/教师复核。

## 验证证据

- 自动检查：`scripts/round16_plot_gallery_visual_check.py`
- 检查报告：`docs/round16_plot_gallery_visual_check_report.md`
- 桌面截图：`docs/round16_plot_gallery_cards_verified.png`
- 图谱卡片截图：`docs/round16_plot_gallery_100_cards_verified.png`
- 移动端截图：`docs/round16_plot_gallery_mobile_verified.png`

## 后续建议

下一步可继续把“科研绘图室 /plot-studio”从 5 种图形生成扩展到与图谱宇宙联动：用户从任意图谱详情页进入绘图室时，自动带入该图的字段契约、R/ggplot2 模板和数据审查规则。

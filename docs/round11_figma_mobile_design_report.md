# Round 11 Figma 与产品式页面设计报告

## Figma 文件

- 文件地址：<https://www.figma.com/design/pwRKB0u8ENzzzB2OF5tEAt>
- 已有页面：`Round11 Mobile App - MedPath`
- 新增页面：`Round11 Product Detail System`

## 新增设计内容

`Round11 Product Detail System` 用于指导网页从普通卡片堆叠升级为产品式长页，包含：

1. 桌面端方法详情页框架：大标题、方法场景、需求按钮、示例图区域。
2. 示例图展示区：用于放置 R/ggplot2 或公开数据教学改绘图。
3. 四段式产品说明：一眼判断是否适用、输入材料先过关、示例图只做教学参照、最后回到导师复核。
4. 公开来源证据卡：展示公开研究来源、PMID、引用线索和使用边界。
5. 需求描述窗口：将用户的真实需求转成任务包、Skill链、模型提示词和导师复核清单。
6. 移动端方法详情框架：不是简单缩小网页，而是按“关键动作优先”重新组织。

## 与当前网页对应关系

- `/method-universe/{id}` 已接入产品式方法详情页。
- `/plot-gallery` 已展示 18 张 R/ggplot2 示例图。
- `data/public_example_sources.json` 为方法详情页提供公开来源卡。
- `data/method_universe.json` 中 674 条方法均已补充 `hero_title`、`apple_style_sections`、`public_source_example` 和 `example_visual`。

## 设计原则

- 不使用 OpenAI、医院或学校 logo，避免授权风险。
- 不复制论文原图；仅展示公开来源线索与教学改绘/合成示例图。
- 每个方法页都要有自己的叙事、示例、来源和复核边界，不能复制同一段话。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断。

## 当前状态

Figma 设计是产品视觉规范与移动端路线蓝本；网页已实现其中的方法详情页核心结构。后续可继续把文章工坊、仓库详情、图谱详情、3D科研小岛等页面按同一产品式节奏重做。

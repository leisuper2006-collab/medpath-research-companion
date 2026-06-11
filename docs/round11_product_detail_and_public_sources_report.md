# Round11 产品化详情页与公开来源接入报告

## 本轮解决的问题

用户指出旧版页面存在三个核心问题：页面审美不足、卡片文字重复、每个最小单元缺少真实示例与详细说明。本轮将方法详情页、图谱详情页和文章工作流详情页从普通卡片页升级为产品化长页：每个条目都有独立标题、独立说明、公开来源线索、教学改绘示例图和模型网关提示词。

## 数据与内容建设

- 方法宇宙：`data/method_universe.json`，共 674 条方法。
- 科研图谱：`data/plot_gallery_taxonomy.json`，共 100 种图谱。
- 文章工作流：`data/article_skill_workflows.json`，共 28 类文章。
- 开源工具库：`data/open_source_catalog.json`，共 83 个工具。
- 公开来源目录：`data/public_example_sources.json`，共 80 条公开研究元数据。
- 示例图目录：`outputs/round11_plots/`，共 18 张 R/ggplot2 生成的 SVG 教学示例图。
- 方法专属详情示例图目录：`outputs/round11_method_plots/`，共 674 张 SVG，对应 674 个方法条目。
- 图谱、文章和开源工具专属详情示例图目录：`outputs/round11_detail_plots/`，共 211 张 SVG，包括 100 张图谱、28 张文章流程、83 张开源工具示意图。

每个方法、图谱、文章工作流和开源工具均已绑定：

1. 独立产品标题；
2. 四段式解释；
3. 公开来源线索；
4. 示例图；
5. 学习路径或使用边界；
6. 可复制到模型网关的规范化提示词。

## 公开来源边界

公开来源来自 cBioPortal public API metadata，只记录研究名称、引用线索、PMID、公开链接、样本量字段和来源平台。本项目不复制论文原图，不下载受控数据，不展示真实患者隐私。页面中的示例图为本地 R/ggplot2 教学改绘或合成演示图，用于解释图形结构和数据字段，不代表真实研究结论。

## 产品化页面结构

每个详情页包含：

1. 产品式 hero：独立标题、适用判断和操作入口；
2. 示例图区域：展示一个 SVG 教学示例图，并标注教学边界；
3. 四段式说明：回答适用场景、数据准备、解释方式和复核要求；
4. 公开来源证据卡：展示公开研究题名、引用线索、PMID、来源平台和外部链接；
5. 学习路径或方法卡：帮助科研新手知道下一步做什么；
6. 需求描述窗口：用户可输入真实需求后生成任务包、模型提示词和复核问题。

## 验证证据

- 自动化测试：`pytest apps\api\tests -q`，20 项通过。
- 方法详情页截图：`docs/round11_method_detail_unique_visual_no_question_marks.png`
- 方法详情页移动端截图：`docs/round11_mobile_method_detail_product.png`
- 图谱详情页截图：`docs/round11_plot_detail_product_verified.png`
- 图谱详情页移动端截图：`docs/round11_mobile_plot_detail_product.png`
- 文章工作流详情页截图：`docs/round11_article_workshop_product_verified.png`
- 文章工作流详情页移动端截图：`docs/round11_mobile_article_workshop_product.png`
- 开源工具详情页截图：`docs/round11_open_source_detail_product_verified.png`
- 错误详情路由截图：`docs/round11_plot_missing_route_verified.png`、`docs/round11_article_missing_route_verified.png`、`docs/round11_open_source_missing_route_verified.png`

## 真实性边界

所有示例图均为教学改绘或合成演示。公开来源只作为检索线索，不代表本站复现了论文原始结果。医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。

# Round11 专属详情示例图报告

## 建设范围

本轮将详情页示例图从“少量通用示意图复用”升级为“每个最小单元绑定独立示例图”。这些示例图用于帮助科研新手理解方法、图谱、文章流程和开源工具的输入、输出、解释重点与复核边界。

## 已生成内容

- 方法宇宙专属示例图：674 张，目录为 `outputs/round11_method_plots/method_*.svg`。
- 科研图谱专属示例图：100 张，目录为 `outputs/round11_detail_plots/plot_*.svg`。
- 文章工作流专属示例图：28 张，目录为 `outputs/round11_detail_plots/article_*.svg`。
- 开源工具专属示例图：83 张，目录为 `outputs/round11_detail_plots/tool_*.svg`。

## 生成方式

- 方法示例图由 `scripts/generate_round11_method_detail_visuals.R` 生成，并由 `scripts/bind_method_unique_visuals_round11.py` 绑定到 `data/method_universe.json`。
- 图谱与文章流程示例图由 `scripts/generate_round11_unique_detail_visuals.R` 生成，并绑定到 `data/plot_gallery_taxonomy.json` 与 `data/article_skill_workflows.json`。
- 开源工具示例图由 `scripts/generate_round11_tool_detail_visuals.R` 生成，并绑定到 `data/open_source_catalog.json`。

## 页面使用方式

每个详情页读取对应数据文件中的 `example_visual.url` 字段，不再回退到同一张通用图。页面同时展示公开来源线索、适用数据结构、模型网关提示词和人工复核建议，使每一个卡片点击后的内容具有独立信息增量。

## 真实性边界

所有 SVG 均为本地生成的合成教学示意图或教学改绘，用于说明图形结构、方法思路和数据字段，不代表真实研究结果。本项目不复制论文原图，不下载受控数据，不展示真实患者隐私；医学AI输出仅用于教学与科研训练，不替代临床诊断。

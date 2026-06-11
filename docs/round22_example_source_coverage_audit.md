# Round 22：示例图与公开来源覆盖审计

## 审计目的

用户要求每一个小卡片、链接和详情页都不能是重复模板，并且应尽量提供来自高水平公开研究或公开数据库线索的示例图。为避免“看起来有图但实际是占位”的问题，本轮对核心数据表进行了覆盖率审计。

## 覆盖结果

| 模块 | 数据文件 | 条目数 | 已绑定示例图 | 唯一示例图路径 | 已绑定公开来源 | 唯一公开来源 |
|---|---|---:|---:|---:|---:|---:|
| 方法宇宙 | `data/method_universe.json` | 674 | 674 | 674 | 674 | 80 |
| 文章工坊 | `data/article_skill_workflows.json` | 28 | 28 | 28 | 28 | 25 |
| 科研图谱 | `data/plot_gallery_taxonomy.json` | 100 | 100 | 100 | 100 | 55 |
| 开源工具库 | `data/open_source_catalog.json` | 83 | 83 | 83 | 83 | 53 |

## 来源层级概况

当前公开来源线索主要来自：

- Nature / Nature Communications 等公开研究来源；
- Cell / Cancer Cell 等公开研究来源；
- Science 等公开研究来源；
- TCGA、cBioPortal 等公开联盟数据或公开API线索；
- 其他公开高水平研究来源。

这些来源用于帮助新手理解“方法或图形可以回到哪里核对”，不代表本站复制论文原图，也不代表已经完成真实研究或课程试点。

## 示例图边界

现有示例图主要分为三类：

1. R/ggplot2或本地脚本生成的教学示例图；
2. 根据公开研究问题和公开数据字段改绘的教学示意图；
3. 开源工具、方法或文章流程的本地学习示意图。

所有示例图均应按以下边界使用：

- 不复制受版权保护的论文原图；
- 不下载或展示受控患者数据；
- 不把教学示例图写成真实研究结果；
- 接入用户自己的数据后，必须先通过数据审查、引用核验和导师/教师复核。

## 本轮页面修复

已完成：

- 方法宇宙卡片显示独立缩略图、来源线索和方法学习入口；
- 文章工坊侧栏显示每种文章的独立缩略图、差异化说明和完整流程入口；
- 开源工具卡显示独立工具示例图、前景说明层、license/输入输出/误区说明；
- 图谱宇宙保留100种科研图的示例图、字段要求、R优先路线和模型提示词。

验证截图：

- `docs/round22_method_universe_cards.png`
- `docs/round22_article_workshop_tabs.png`
- `docs/round22_open_source_cards_v2.png`

## 后续建议

若要进一步满足“每个最小单元都有真实发表论文中的数据复现示例”的更高标准，建议下一阶段选择若干可公开复现的数据源，例如TCGA、GEO、cBioPortal、Human Protein Atlas或公开单细胞数据集，针对高频方法优先完成真实可运行脚本、数据下载说明和复现实验记录。该阶段需要对每个数据集的license、引用方式和再利用边界逐项核验。

## Round 23新增：真实公开API复现样例

已新增一个可运行的公开数据复现样例，作为后续扩展“真实公开数据示例图”的模板。

复现脚本：

- `scripts/round23_reproduce_cbioportal_brca_mutation_plot.R`

数据与元数据：

- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_selected_gene_mutations_raw.json`
- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_mutation_type_summary.csv`
- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_mutation_example_metadata.json`

图形输出：

- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.svg`
- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.png`

说明文档：

- `docs/public_reproducible_examples/brca_tcga_cbioportal_mutation_plot.md`

网站接入：

- `/api/plot-demo-gallery` 已将该图置于示例图列表首位；
- 静态发布模式 `staticPlotDemoGallery()` 已同步；
- 首页“示例图不是装饰”区域已显示该公开API复现图；
- 绘图室示例区可查看该图。

验证截图：

- `docs/round23_home_public_repro_figure.png`
- `docs/round23_plot_gallery_public_repro_figure.png`

边界说明：

该图为 cBioPortal 公开REST API 教学改绘示例，不复制论文原图，不使用受控患者数据，不代表真实临床结论。所有医学AI相关内容仍仅用于教学与科研训练，不替代临床诊断。

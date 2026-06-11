# Round25最小单元内容覆盖检查

## 检查范围

本检查回应“每一个小卡片、链接和最小单元的文字不能重复，且应有示例图和真实来源线索”的要求。检查范围包括：

- `data/method_universe.json`
- `data/article_skill_workflows.json`
- `data/plot_gallery_taxonomy.json`
- `data/open_source_catalog.json`

## 覆盖结果

| 数据集 | 数量 | 示例图字段 `example_visual` | 公开来源字段 `public_source_example` | 新手介绍 `detail_novice_intro` | Apple式滚动说明 `detail_scroll_panels` |
|---|---:|---:|---:|---:|---:|
| 方法宇宙 | 674 | 674/674 | 674/674 | 674/674，且无重复 | 674/674 |
| 文章工坊 | 28 | 28/28 | 28/28 | 28/28，且无重复 | 28/28 |
| 科研绘图室 | 100 | 100/100 | 100/100 | 100/100，且无重复 | 100/100 |
| 开源工具库 | 83 | 83/83 | 83/83 | 83/83，且无重复 | 83/83 |

## 页面实际使用字段

页面已在以下位置使用这些字段：

- 方法卡片与详情页：`methodUniverseCard()`、`methodDetailPage()`
- 文章工坊：`articleWorkshopPage()`
- 科研绘图室：`plotGalleryCard()`、`plotDetailPage()`、`plotStudioSpecPanel()`
- 开源工具库：`renderOpenSourceTools()`、`toolDetailPage()`

## 注意事项

- `unique_detail_status` 是内部生成状态字段，不是页面展示文案；它重复不会造成用户可见重复。
- 当前所有最小单元都有示例图字段和公开来源线索字段。
- 目前只有 cBioPortal BRCA mutation plot 是真实公开 API + R/ggplot2 的完整可复现图；其余单元多为教学改绘图、公开来源线索或示意图。后续应按高频方法逐批扩展真实公开数据复现。

## 可继续增强的方向

1. 按用户访问频率优先为基因敲除、差异表达、Meta分析、单细胞聚类、机器学习模型评估等高频方法补充真实公开数据复现图。
2. 每个详情页增加“为什么不是直接套图”的解释，帮助科研新手理解输入数据、图形选择和伦理边界。
3. 将真实复现图的 R/ggplot2 源码挂到对应图谱详情页，延续用户偏好的 R 优先路线。

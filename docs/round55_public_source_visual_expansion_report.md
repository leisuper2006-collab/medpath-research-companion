# Round55 公开来源真实示例图扩展报告

## 本轮目标

本轮针对“每个细小链接都要有真实说明和示例图”的要求，继续补强证据来源库。重点不是复制顶刊论文原图，而是使用公开数据库入口和公开 API 重新绘制教学示例图，让科研新手在来源详情页中能看到：

- 这个公开来源是什么；
- 它适合训练什么问题；
- 示例图由什么脚本和数据表生成；
- 哪些结论不能写成真实研究结果；
- 医学内容仅用于教学与科研训练，不替代临床诊断。

## 新增工作

### 1. 使用 R/ggplot2 生成 10 张 cBioPortal 公开队列教学重绘图

新增脚本：

`scripts/round55_reproduce_cbioportal_more_public_plots.R`

该脚本通过 cBioPortal public REST API 读取公开研究元数据和突变数据，生成常见基因突变类型分布教学图。图表为本地重绘，不复制论文原图，不下载受控数据，不包含患者隐私。

新增覆盖的公开来源：

1. `acc_tcga_pan_can_atlas_2018`
2. `sarc_tcga_pub`
3. `cesc_tcga_pan_can_atlas_2018`
4. `dlbc_tcga_pan_can_atlas_2018`
5. `coadread_tcga_pub`
6. `ccrcc_dfci_2019`
7. `luad_mskcc_2015`
8. `skcm_dfci_2015`
9. `paad_utsw_2015`
10. `ccle_broad_2019`

输出目录：

- PNG/SVG 图：`outputs/public_reproducible_examples/`
- CSV/JSON 数据：`data/public_reproducible_examples/`
- 新增 manifest：`data/public_reproducible_examples/round55_more_public_visual_manifest.json`
- 跳过记录：`data/public_reproducible_examples/round55_more_public_visual_skipped.json`

### 2. 合并公开来源图谱 manifest

新增脚本：

`scripts/round55_merge_public_visual_manifest.py`

合并结果：

- 合并前：5 个公开来源教学图，覆盖 14 个公开来源 ID。
- 合并后：15 个公开来源教学图，覆盖 34 个公开来源 ID。
- 发布目录同步：`dist/github-pages-demo/static-data/public_source_visual_examples.json` 已更新到同一覆盖状态。

已有覆盖报告：

`docs/round55_public_visual_coverage_report.md`

### 3. 新增真实浏览器验证脚本

新增脚本：

`scripts/round55_verify_new_public_visual_pages.py`

该脚本使用本地浏览器打开新增来源详情页，检查：

- 来源详情页 hero 是否存在；
- 公开示例图证据区是否存在；
- 图片是否真实加载，且 `naturalWidth` 与 `naturalHeight` 正常；
- 页面是否包含 cBioPortal 来源说明；
- 页面是否包含“不复制论文原图”的边界；
- 页面是否包含“教学与科研训练、不替代临床诊断”的医学安全边界；
- 页面是否无中文乱码。

已验证的新增页面：

- `#/source-library/ccrcc_dfci_2019`
- `#/source-library/acc_tcga_pan_can_atlas_2018`
- `#/source-library/sarc_tcga_pub`

验证截图：

- `docs/round55_ccrcc_source_visual_verified.png`
- `docs/round55_acc_source_visual_verified.png`
- `docs/round55_sarc_source_visual_verified.png`

## 回归测试结果

本轮完成后已运行以下检查，全部通过：

```text
python scripts\round27_static_asset_check.py
python scripts\round28_product_story_check.py
python scripts\round31_content_uniqueness_audit.py
pytest apps\api\tests -q
python scripts\round44_verify_plot_article_interactions.py
python scripts\round45_verify_tool_demand_package.py
python scripts\round46_verify_island3d_experience.py
python scripts\round55_verify_new_public_visual_pages.py
```

结果摘要：

- 静态资源：通过，关键详情页图片无破图。
- 产品叙事页：通过，方法、文章、图谱、开源工具详情页均有产品式说明结构。
- 内容唯一性：通过，674 个方法、100 个图谱、28 类文章、83 个工具无缺图、无缺来源、无明显占位、无精确重复、高相似重复为 0。
- API 测试：20 项通过。
- 图谱与文章交互：通过。
- 开源工具需求包：通过。
- 3D科研小岛：通过。
- 新公开来源详情页：通过。

## 真实性边界

本轮新增图表均为公开 API 数据的教学化重绘或来源学习示例，不代表本站完成了真实科研结论验证。页面中已保留以下边界：

- 不复制论文原图；
- 不下载受控数据；
- 不使用真实患者隐私；
- 不把教学重绘图写成真实课题结果；
- 医学AI输出仅用于教学与科研训练，不替代临床诊断；
- 正式科研写作前仍需回到原数据库、原论文和许可条款核对。

## 下一步建议

1. 继续扩大公开来源图覆盖，从当前 34/80 提升到 50/80，再逐步接近全覆盖。
2. 对最常用的 20 个来源补充“Apple 风格纵向详情页”的二级叙事分屏，包括来源身份、能回答的问题、适配方法、推荐图谱、错误用法和需求窗口。
3. 为方法详情页增加更多“真实公开来源重绘图”绑定，减少仅使用合成图的比例。
4. 优先补齐新手高频场景：基因敲除、单细胞、bulk RNA-seq、空间转录组、病理图像、机器学习、Meta分析、机制图和文章流程。

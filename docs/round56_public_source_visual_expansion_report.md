# Round56 公开来源真实示例图二次扩展报告

## 本轮目标

继续落实“每个细微链接都要有真实、不同、可审查内容”的要求，优先补强证据来源库中的公开队列详情页。上一轮已将公开来源重绘图覆盖推进到 34/80，本轮继续使用公开 cBioPortal API 与 R/ggplot2 生成可复现教学图，把覆盖推进到 50/80。

本轮仍坚持边界：不复制期刊论文原图，不下载受控数据，不使用真实患者隐私，不把教学重绘图写成真实课题发现。医学AI输出仅用于教学与科研训练，不替代临床诊断。

## 本轮新增产物

### 1. 新增 R/ggplot2 可复现脚本

新增脚本：

`scripts/round56_reproduce_cbioportal_next_public_plots.R`

脚本特点：

- 从 `data/public_example_sources.json` 读取公开来源标题、引用线索、来源平台和病种信息；
- 调用 cBioPortal public REST API 获取公开突变记录；
- 自动选择 mutation molecular profile 与 sample list；
- 对常见教学基因生成突变类型分布堆叠条形图；
- 输出 PNG、SVG、CSV、metadata JSON 和 manifest；
- 显式标注“teaching re-plot / not a clinical conclusion”。

本轮 manifest：

`data/public_reproducible_examples/round56_next_public_visual_manifest.json`

跳过记录：

`data/public_reproducible_examples/round56_next_public_visual_skipped.json`

结果：16 个目标来源全部生成成功，skipped 为 0。

### 2. 新增合并脚本与覆盖报告

新增脚本：

`scripts/round56_merge_public_visual_manifest.py`

合并报告：

`docs/round56_public_visual_coverage_report.md`

覆盖结果：

- 合并前视觉条目数：15
- 本轮新增视觉条目数：16
- 合并后视觉条目数：31
- 公开来源覆盖：50/80

### 3. 本轮新增覆盖的公开来源

1. `aml_ohsu_2022`
2. `ampca_bcm_2016`
3. `thyroid_gatci_2024`
4. `bladder_columbia_msk_2018`
5. `paired_bladder_2022`
6. `breast_msk_2018`
7. `coad_cptac_2019`
8. `hccihch_pku_2019`
9. `liad_inserm_fr_2014`
10. `aml_ohsu_2018`
11. `breast_alpelisib_2020`
12. `brca_bccrc_xenograft_2014`
13. `brca_bccrc`
14. `brca_broad`
15. `brca_sanger`
16. `brca_tcga_pub`

### 4. 新增浏览器验证脚本

新增脚本：

`scripts/round56_verify_new_public_visual_pages.py`

该脚本打开本轮新增来源详情页，检查：

- 公开示例图证据区存在；
- 图片真实加载，且 `naturalWidth` / `naturalHeight` 正常；
- 图片路径包含 round56 产物；
- 页面包含 cBioPortal 来源说明；
- 页面包含“不复制论文原图”；
- 页面包含“教学与科研训练、不替代临床诊断”；
- 页面无中文乱码。

已验证页面：

- `#/source-library/aml_ohsu_2022`
- `#/source-library/bladder_columbia_msk_2018`
- `#/source-library/breast_msk_2018`

验证截图：

- `docs/round56_aml_source_visual_verified.png`
- `docs/round56_bladder_source_visual_verified.png`
- `docs/round56_breast_source_visual_verified.png`

## 站点构建状态

已将缓存版本从 `round55 / v55` 更新为 `round56 / v56`：

- `apps/web/index.html`
- `apps/web/sw.js`

已重新构建静态发布目录：

`dist/github-pages-demo`

本地预览地址：

`http://127.0.0.1:4173/?fresh=round56`

## 回归检查

本轮已运行：

```text
python scripts\round56_verify_new_public_visual_pages.py
python scripts\round27_static_asset_check.py
python scripts\round28_product_story_check.py
python scripts\round31_content_uniqueness_audit.py
pytest apps\api\tests -q
python scripts\round44_verify_plot_article_interactions.py
python scripts\round45_verify_tool_demand_package.py
python scripts\round46_verify_island3d_experience.py
```

结果：

- Round56 新来源详情页验证：通过；
- 静态资源检查：通过，无破图；
- 产品式详情页检查：通过；
- 内容唯一性审计：通过；
- API 测试：20 passed；
- 图谱/文章需求窗口：通过；
- 开源工具需求包：通过；
- 3D科研小岛：通过。

内容唯一性审计当前覆盖：

- 方法：674 项；
- 图谱：100 项；
- 文章流程：28 类；
- 开源工具：83 个；
- 缺图：0；
- 缺来源：0；
- 明显占位：0；
- 精确重复：0；
- 高相似重复：0。

## 仍未完成的范围

公开来源库还剩 30/80 个来源没有绑定真实重绘图。下一步可继续按同一策略补齐剩余 cBioPortal 来源，并优先处理科研新手最常进入的方法链：基因扰动、单细胞、bulk RNA-seq、空间组学、病理图像、Meta分析、机器学习、机制图和文章流程。

此外，公开来源图覆盖提升并不等于整个长期目标完成。Figma移动端路线、顶级审美重构、更多 3D 游戏化交互、GitHub发布准备和每个细粒度卡片的 Apple 式深度详情页仍需继续推进。

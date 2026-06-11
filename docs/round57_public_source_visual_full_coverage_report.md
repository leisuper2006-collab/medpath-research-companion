# Round57 公开来源示例图全覆盖报告

## 本轮目标

继续向完整目标推进，完成“证据来源库中每个公开来源详情页都有真实可复现示例图”的阶段性建设。前两轮已将覆盖推进到 50/80，本轮针对剩余 30 个 cBioPortal public API 来源生成教学重绘图，并完成站点绑定、浏览器验证和回归测试。

## 关键结果

- 公开来源总数：80
- 当前视觉示例条目：61
- 覆盖公开来源：80/80
- 未覆盖公开来源：0
- 本轮新增图：30
- 本轮 skipped：0

所有新增图均为 cBioPortal public REST API 与 R/ggplot2 的教学重绘图，不复制论文原图，不下载受控数据，不使用真实患者隐私，不代表真实临床结论。正式科研使用前仍需回到原数据库、原论文和许可条款核验。

## 新增脚本

### 1. cBioPortal 绘图工具脚本

`scripts/cbioportal_public_visual_utils.R`

用途：

- 统一 cBioPortal API 请求；
- 自动选择 mutation molecular profile 与 sample list；
- 生成 mutation type distribution 教学重绘图；
- 输出 PNG、SVG、CSV、metadata JSON；
- 统一写入教学边界和医学安全边界。

### 2. Round57 剩余来源生成脚本

`scripts/round57_reproduce_cbioportal_remaining_public_plots.R`

用途：

- 自动读取 `data/public_source_visual_examples.json`；
- 计算当前仍未覆盖的公开来源；
- 对剩余 cBioPortal 来源批量生成教学重绘图；
- 输出 `round57_remaining_public_visual_manifest.json` 与 skipped 记录。

### 3. Round57 manifest 合并脚本

`scripts/round57_merge_public_visual_manifest.py`

用途：

- 将 Round57 视觉 manifest 合并到总 manifest；
- 输出覆盖报告；
- 检查是否仍有未覆盖公开来源。

### 4. Round57 页面验证脚本

`scripts/round57_verify_public_visual_full_coverage.py`

用途：

- 检查 manifest 覆盖是否达到 80/80；
- 用真实浏览器打开新增来源详情页；
- 检查图片是否真实加载；
- 检查页面是否包含 cBioPortal、教学边界、不复制论文原图、不替代临床诊断；
- 检查页面无中文乱码。

## 本轮新增来源图

本轮为以下来源新增公开 API 教学重绘图：

1. `ccle_broad_2025`
2. `pan_origimed_2020`
3. `cll_broad_2015`
4. `cll_broad_2022`
5. `cll_iuopa_2015`
6. `cllsll_icgc_2011`
7. `bowel_colitis_msk_2022`
8. `crc_hta8_htan_2024`
9. `crc_sysucc_2022`
10. `difg_glass_2019`
11. `ucec_msk_2024`
12. `hcc_meric_2021`
13. `panet_shanghai_2013`
14. `ihch_smmu_2014`
15. `brca_mapk_hp_msk_2021`
16. `msk_access_2021`
17. `mixed_selpercatinib_2020`
18. `mixed_kunga_msk_2022`
19. `pancan_pdx_uthsa_2023`
20. `prostate_pcbm_swiss_2019`
21. `sft_sysucc_2023`
22. `lung_pdx_msk_2021`
23. `utuc_cornell_baylor_mdacc_2019`
24. `panet_jhu_2011`
25. `prad_organoids_msk_2022`
26. `aml_tcga_gdc`
27. `asclc_msk_2024`
28. `bcc_unige_2016`
29. `blca_msk_tcga_2020`
30. `blca_tcga_gdc`

## 浏览器验证截图

已抽查最后一批来源详情页：

- `docs/round57_ccle_source_visual_verified.png`
- `docs/round57_pan_origimed_source_visual_verified.png`
- `docs/round57_prad_source_visual_verified.png`
- `docs/round57_blca_tcga_gdc_source_visual_verified.png`

这些页面均通过：

- 公开示例图区域存在；
- 图片真实加载；
- 图片路径为 Round57 新产物；
- 页面包含 cBioPortal 来源；
- 页面包含“不复制论文原图”；
- 页面包含“教学与科研训练、不替代临床诊断”；
- 页面无中文乱码。

## 构建与版本

已将站点缓存版本更新为：

- `round57`
- `medpath-research-companion-v57`

已重新构建静态发布目录：

`dist/github-pages-demo`

本地预览地址：

`http://127.0.0.1:4173/?fresh=round57`

## 回归测试

已运行：

```text
python scripts\round57_verify_public_visual_full_coverage.py
python scripts\round27_static_asset_check.py
python scripts\round28_product_story_check.py
python scripts\round31_content_uniqueness_audit.py
pytest apps\api\tests -q
python scripts\round44_verify_plot_article_interactions.py
python scripts\round45_verify_tool_demand_package.py
python scripts\round46_verify_island3d_experience.py
```

结果：

- Round57 全覆盖验证：通过；
- 静态资源检查：通过；
- 产品式详情页检查：通过；
- 内容唯一性审计：通过；
- API 测试：20 passed；
- 图谱/文章需求窗口：通过；
- 开源工具需求包：通过；
- 3D科研小岛：通过。

当前内容审计：

- 方法：674 项；
- 图谱：100 项；
- 文章流程：28 类；
- 开源工具：83 个；
- 缺图：0；
- 缺来源：0；
- 明显占位：0；
- 精确重复：0；
- 高相似重复：0。

## 仍需继续推进的目标

公开来源图全覆盖只是长期目标中的一块。后续还需继续推进：

1. 将更多方法详情页直接绑定这些真实公开来源重绘图，减少合成图比例；
2. 继续提升页面审美和滚动叙事，向更高级的产品页体验靠近；
3. 推进 Figma 移动端 App 设计路线；
4. 继续增强桌宠与 3D 科研小岛互动；
5. 完成 GitHub 发布准备和部署文档；
6. 对所有核心入口继续做真实浏览器截图和回归验证。

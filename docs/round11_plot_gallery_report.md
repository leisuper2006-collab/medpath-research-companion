# Round 11 科研绘图室与公开示例图报告

## 当前完成状态

- 科研图谱类型：`data/plot_gallery_taxonomy.json` 中共 100 种。
- 数据审查规则：`data/data_audit_rules.json` 中共 72 条。
- R/ggplot2 示例图：`outputs/round11_plots/` 中共 18 张 SVG。
- 示例图接口：`GET /api/plot-demo-gallery` 返回 18 条记录，均标注为 synthetic teaching demo。
- 页面验证：`/plot-gallery` 桌面与移动端均渲染 18 个示例图卡片。

## 18 张示例图

1. `01_volcano_plot.svg`
2. `02_heatmap.svg`
3. `03_forest_plot.svg`
4. `04_umap_schematic.svg`
5. `05_alluvial_alternative.svg`
6. `06_kaplan_meier_schematic.svg`
7. `07_roc_curve.svg`
8. `08_precision_recall_curve.svg`
9. `09_confusion_matrix.svg`
10. `10_pca_scatter.svg`
11. `11_enrichment_dotplot.svg`
12. `12_lollipop_ranking.svg`
13. `13_correlation_scatter.svg`
14. `14_density_overlay.svg`
15. `15_paired_line_plot.svg`
16. `16_missingness_map.svg`
17. `17_coefficient_plot.svg`
18. `18_waterfall_plot.svg`

## 生成方式

示例图由本地 R 脚本生成：

```powershell
& 'C:\Program Files\R\R-4.6.0\bin\Rscript.exe' 'scripts\generate_round11_demo_plots.R'
```

脚本使用合成教学数据，不使用真实患者数据，不代表真实研究结论。正式科研出图必须替换为用户自有数据、公开许可数据或经授权数据，并经过数据审查与导师/专家复核。

## 页面证据

- 桌面截图：`docs/round11_plot_gallery_18_verified.png`
- 移动端截图：`docs/round11_mobile_plot_gallery_18_verified.png`

## 安全边界

所有医学AI与绘图输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。示例图不能被写成实测结果，不能作为论文结论或临床证据。

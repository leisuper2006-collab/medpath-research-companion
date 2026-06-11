# BRCA TCGA PanCancer Atlas公开突变类型分布复现示例

## 示例定位

本示例用于把“科研图示例”从合成演示推进到可审查的公开数据复现。它从 cBioPortal 公开 REST API 拉取 BRCA TCGA PanCancer Atlas 中一组乳腺癌常见基因的突变摘要记录，再用 R/ggplot2 改绘为教学图。

该图用于帮助科研新手理解以下问题：

- 如何从公开数据库确定研究来源；
- 如何把API返回的数据整理为可画图的数据表；
- 如何区分“突变记录数”“样本数”和“临床结论”；
- 如何在图注中保留来源、边界和教学用途说明。

## 数据来源

- 数据库：cBioPortal public REST API
- Study ID：`brca_tcga_pan_can_atlas_2018`
- Molecular profile：`brca_tcga_pan_can_atlas_2018_mutations`
- Sample list：`brca_tcga_pan_can_atlas_2018_all`
- 官方API文档：https://docs.cbioportal.org/web-api-and-clients/
- Study页面：https://www.cbioportal.org/study/summary?id=brca_tcga_pan_can_atlas_2018

本示例仅使用公开API中的突变摘要字段，不下载受控数据，不复制论文原图，不展示真实患者身份信息。

## 运行命令

```powershell
& 'C:\Program Files\R\R-4.6.0\bin\Rscript.exe' scripts\round23_reproduce_cbioportal_brca_mutation_plot.R
```

## 生成文件

数据与元数据：

- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_selected_gene_mutations_raw.json`
- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_mutation_type_summary.csv`
- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_mutation_example_metadata.json`

图形：

- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.svg`
- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.png`

## 图形解释

该图展示所选基因在公开突变profile中的突变记录数，并按突变类型堆叠。它适合用于教学说明“同一类癌种中常见驱动基因的突变类型构成”，但不应被解释为患者诊断、治疗建议或真实研究结论。

## 边界声明

本图是公开API教学改绘示例，仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。正式研究应重新核对原始数据许可、纳入基因列表、样本定义、统计问题和导师/专家复核意见。


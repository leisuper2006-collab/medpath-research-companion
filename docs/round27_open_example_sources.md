# Round27 真实开放示例来源注册表

本表只登记可作为教学复现、字段契约、图形结构或公开入口说明的来源；不复制期刊原图，不下载受控数据，不伪装为用户实测结果。

## 1. cBioPortal BRCA TCGA PanCancer Atlas
- 适用：肿瘤突变、拷贝数、OncoPrint、突变类型分布、队列概览
- 来源：https://www.cbioportal.org/study/summary?id=brca_tcga_pan_can_atlas_2018
- 平台：cBioPortal public API
- 许可/边界：仅使用公开研究元数据、公开API返回字段和教学改绘；不复制论文原图，不下载受控数据。
- 复用边界：适合教学示例和公开数据检索入口；正式科研需按cBioPortal、TCGA/GDC和原论文许可核对。

## 2. Seurat PBMC3K guided clustering tutorial
- 适用：单细胞QC、降维、聚类、marker、FeaturePlot、DotPlot、VlnPlot
- 来源：https://satijalab.org/seurat/articles/pbmc3k_tutorial
- 平台：Seurat official tutorial / 10x Genomics PBMC3K
- 许可/边界：使用官方教程和公开PBMC3K教学数据线索；不声称为用户项目实测结果。
- 复用边界：适合单细胞方法学习和图形结构说明；正式分析须使用用户自有合规数据。

## 3. Galaxy Training: Clustering 3K PBMCs with Scanpy/Seurat
- 适用：从原始单细胞数据到聚类、标记基因和轨迹学习路径
- 来源：https://training.galaxyproject.org/training-material/topics/single-cell/
- 平台：Galaxy Training Network
- 许可/边界：使用GTN公开教学流程作为学习路径参考；不复制受限数据。
- 复用边界：适合构建新手学习路线、流程图和课程任务链。

## 4. The R Graph Gallery
- 适用：ggplot2图形语法、森林图、热图、散点、网络、分布与时间序列示例
- 来源：https://r-graph-gallery.com/
- 平台：R Graph Gallery
- 许可/边界：作为R/ggplot2图形结构和代码学习入口；引用时需回到原页面核对许可。
- 复用边界：适合作为图谱学习入口和代码风格参考，不把示例结果写成实测。

## 5. cBioPortal file format examples
- 适用：突变表、CNV、临床表和基因面板字段契约
- 来源：https://docs.cbioportal.org/file-formats/
- 平台：cBioPortal Docs
- 许可/边界：使用官方字段说明作为数据契约参考；不包含患者隐私。
- 复用边界：适合数据审查、字段契约和案例模拟的字段模板。

## 6. Bioconductor cBioPortalData user guide
- 适用：R环境下调用cBioPortal数据、构建MultiAssayExperiment和基因集合查询
- 来源：https://waldronlab.io/cBioPortalData/articles/cBioPortalData.html
- 平台：Bioconductor / cBioPortalData
- 许可/边界：作为R侧公开API学习入口；正式运行需遵守Bioconductor和数据源许可。
- 复用边界：适合R优先的数据获取教学和API调用规范说明。

## 7. Bioconductor airway RNA-seq example data
- 适用：RNA-seq差异表达、DESeq2流程、设计矩阵、MA图和火山图入门
- 来源：https://bioconductor.org/packages/airway/
- 平台：Bioconductor ExperimentData
- 许可/边界：使用Bioconductor公开教学数据包入口和字段说明；正式分析需核对包许可证和引用要求。
- 复用边界：适合RNA-seq教学演示和字段契约训练，不作为用户课题实测结果。

## 8. Bioconductor pasilla RNA-seq count dataset
- 适用：计数矩阵、分组设计、差异表达、质量控制和复现实验讲解
- 来源：https://bioconductor.org/packages/pasilla/
- 平台：Bioconductor ExperimentData
- 许可/边界：使用公开教学数据包入口；运行前需核对Bioconductor包版本和引用。
- 复用边界：适合初学者理解count矩阵到差异分析的最小闭环。

## 9. NCI Genomic Data Commons TCGA data portal
- 适用：TCGA公开队列检索、病例筛选、文件类型识别和合规数据获取路径
- 来源：https://portal.gdc.cancer.gov/
- 平台：NCI GDC
- 许可/边界：只登记公开入口和字段线索；受控数据、原始测序数据和患者级信息必须按GDC规则申请。
- 复用边界：适合数据来源核验、队列构建教学和下载前检查表。

## 10. UCSC Xena TCGA visualization hubs
- 适用：表达、临床、突变和生存字段联动，适合入门级生存图和热图讲解
- 来源：https://xenabrowser.net/datapages/
- 平台：UCSC Xena
- 许可/边界：使用公开浏览器入口和字段说明；正式研究须核对原始数据来源与引用。
- 复用边界：适合让新手理解临床字段、表达矩阵和图形输出之间的关系。

## 11. CELLxGENE Census public single-cell resources
- 适用：公开单细胞集合、细胞类型标注、批次字段、跨数据集检索和教学查询
- 来源：https://cellxgene.cziscience.com/census
- 平台：CZ CELLxGENE
- 许可/边界：只使用公开入口和元数据说明；具体数据集需逐项核对贡献者许可。
- 复用边界：适合构建单细胞方法选择、字段检查和数据来源审计示例。

## 12. 10x Genomics PBMC 3k public dataset
- 适用：10x矩阵结构、单细胞QC、聚类、marker基因和UMAP示例
- 来源：https://www.10xgenomics.com/datasets/3-k-pbm-cs-from-a-healthy-donor-1-standard-1-1-0
- 平台：10x Genomics public datasets
- 许可/边界：使用公开教学数据入口；正式复现需核对10x数据许可和引用说明。
- 复用边界：适合单细胞新手完成从矩阵到聚类图的最小学习路径。

## 13. Scanpy PBMC3K preprocessing and clustering tutorial
- 适用：Python单细胞分析、AnnData、QC、PCA、邻接图、Leiden聚类和UMAP
- 来源：https://scanpy-tutorials.readthedocs.io/en/latest/pbmc3k.html
- 平台：Scanpy official tutorials
- 许可/边界：作为Python流程学习入口；不把教程结果写成用户研究结论。
- 复用边界：适合比较R/Seurat与Python/Scanpy路线的教学页面。

## 14. 10x Genomics Visium human breast cancer public dataset
- 适用：空间转录组spot矩阵、组织图、空间表达图和病理-组学整合教学
- 来源：https://www.10xgenomics.com/datasets/human-breast-cancer-block-a-section-1-1-standard-1-1-0
- 平台：10x Genomics Visium public datasets
- 许可/边界：使用公开示例入口；原始图像和数据复用需核对10x许可。
- 复用边界：适合空间组学图谱、病理区域讲解和字段契约说明。

## 15. spatialLIBD Bioconductor spatial transcriptomics resources
- 适用：空间转录组对象结构、spot注释、区域标注和可视化字段说明
- 来源：https://bioconductor.org/packages/spatialLIBD/
- 平台：Bioconductor spatialLIBD
- 许可/边界：使用Bioconductor包入口和教程线索；正式使用需核对包引用。
- 复用边界：适合空间组学教学、对象字段讲解和示例图结构说明。

## 16. TCIA and Imaging Data Commons public cancer imaging resources
- 适用：公开影像数据来源、DICOM字段、影像AI教学和数据合规边界
- 来源：https://www.cancerimagingarchive.net/
- 平台：TCIA / IDC public imaging repositories
- 许可/边界：只登记公开数据入口和使用边界；具体集合需核对数据许可与引用。
- 复用边界：适合影像AI与病理AI数据边界教学，不混入真实患者隐私。

## 17. OpenSlide public test data
- 适用：全切片图像格式、tile读取、金字塔层级、病理图像预处理教学
- 来源：https://openslide.cs.cmu.edu/download/openslide-testdata/
- 平台：OpenSlide public test data
- 许可/边界：使用公开测试图像入口；不把测试图像伪装为真实课程病例。
- 复用边界：适合WSI读取、切块、缩略图和图像处理流程教学。

## 18. PatchCamelyon histopathology benchmark
- 适用：病理patch分类、深度学习benchmark、训练/验证/测试划分和ROC示例
- 来源：https://github.com/basveeling/pcam
- 平台：PatchCamelyon / public benchmark
- 许可/边界：作为公开benchmark入口；使用时需核对原始数据许可和引用要求。
- 复用边界：适合病理AI入门、模型评价和benchmark概念教学。

## 19. NCT-CRC-HE-100K colorectal histology image dataset
- 适用：结直肠组织分类、病理patch示例、混淆矩阵和错误案例讲解
- 来源：https://zenodo.org/records/1214456
- 平台：Zenodo public research dataset
- 许可/边界：公开数据集入口；复用需核对Zenodo页面许可证和原论文引用。
- 复用边界：适合病理图像分类教学和错误分析示例，不用于临床诊断。

## 20. metafor BCG vaccine meta-analysis example dataset
- 适用：Meta分析效应量、森林图、异质性、亚组分析和敏感性分析教学
- 来源：https://wviechtb.github.io/metafor/reference/dat.bcg.html
- 平台：metafor R package documentation
- 许可/边界：使用R包文档中的公开示例数据说明；正式论文需回到原始研究核验。
- 复用边界：适合Meta分析文章Skill、森林图和异质性解释训练。

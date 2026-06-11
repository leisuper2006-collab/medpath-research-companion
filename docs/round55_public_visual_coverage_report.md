# Round55 public source visual coverage report

## 合并结果

- 合并前视觉条目数：5
- 新增候选视觉条目数：10
- 新增条目：10
- 更新条目：0
- 合并后视觉条目数：15
- 覆盖 public source id：34/80

## 本轮新增图

- `acc_tcga_pan_can_atlas_2018_mutation_type_distribution`：肾上腺皮质癌TCGA PanCancer Atlas：常见基因突变类型分布教学重绘图；绑定来源：acc_tcga_pan_can_atlas_2018, acc_tcga, acc_tcga_gdc
- `sarc_tcga_pub_mutation_type_distribution`：软组织肉瘤TCGA Cell 2017：常见基因突变类型分布教学重绘图；绑定来源：sarc_tcga_pub, sarcoma_mskcc_2022
- `cesc_tcga_pan_can_atlas_2018_mutation_type_distribution`：宫颈鳞癌TCGA PanCancer Atlas：常见基因突变类型分布教学重绘图；绑定来源：cesc_tcga_pan_can_atlas_2018
- `dlbc_tcga_pan_can_atlas_2018_mutation_type_distribution`：弥漫大B细胞淋巴瘤TCGA PanCancer Atlas：常见基因突变类型分布教学重绘图；绑定来源：dlbc_tcga_pan_can_atlas_2018
- `coadread_tcga_pub_mutation_type_distribution`：结直肠腺癌TCGA Nature 2012：常见基因突变类型分布教学重绘图；绑定来源：coadread_tcga_pub, coadread_genentech, coadread_cass_2020
- `ccrcc_dfci_2019_mutation_type_distribution`：透明细胞肾癌DFCI Science 2019：常见基因突变类型分布教学重绘图；绑定来源：ccrcc_dfci_2019
- `luad_mskcc_2015_mutation_type_distribution`：肺腺癌MSK Science 2015：常见基因突变类型分布教学重绘图；绑定来源：luad_mskcc_2015, bm_nsclc_mskcc_2023, nsclc_mskcc_2015
- `skcm_dfci_2015_mutation_type_distribution`：转移性黑色素瘤DFCI Science 2015：常见基因突变类型分布教学重绘图；绑定来源：skcm_dfci_2015
- `paad_utsw_2015_mutation_type_distribution`：胰腺癌UTSW Nature Communications 2015：常见基因突变类型分布教学重绘图；绑定来源：paad_utsw_2015, paac_jhu_2014
- `ccle_broad_2019_mutation_type_distribution`：癌症细胞系百科CCLE Broad 2019：常见基因突变类型分布教学重绘图；绑定来源：ccle_broad_2019, cellline_ccle_broad, ccle_genentech_2014

## 仍待补充的前30个来源

- `aml_ohsu_2018`：Acute Myeloid Leukemia (OHSU, Nature 2018)
- `aml_ohsu_2022`：Acute Myeloid Leukemia (OHSU, Cancer Cell 2022)
- `aml_tcga_gdc`：Acute Myeloid Leukemia (TCGA GDC, 2025)
- `ampca_bcm_2016`：Ampullary Carcinoma (Baylor College of Medicine, Cell Reports 2016)
- `asclc_msk_2024`：Atypical Small Cell Lung Cancer (MSK, Cancer Discov 2024)
- `bcc_unige_2016`：Basal Cell Carcinoma (UNIGE, Nat Genet 2016)
- `bladder_columbia_msk_2018`：Bladder Cancer (Columbia University/MSK, Cell 2018)
- `blca_msk_tcga_2020`：Bladder Cancer (MSK/TCGA, Eur Urol 2020)
- `blca_tcga_gdc`：Bladder Urothelial Carcinoma (TCGA GDC, 2025)
- `bowel_colitis_msk_2022`：Colorectal Adenocarcinoma (MSK, Nat Commun 2022)
- `brca_bccrc`：Breast Invasive Carcinoma (British Columbia, Nature 2012)
- `brca_bccrc_xenograft_2014`：Breast Cancer Xenografts (British Columbia, Nature 2015)
- `brca_broad`：Breast Invasive Carcinoma (Broad, Nature 2012)
- `brca_mapk_hp_msk_2021`：MAPK on resistance to anti-HER2 therapy for breast cancer (MSK, Nat Commun. 2022)
- `brca_sanger`：Breast Invasive Carcinoma (Sanger, Nature 2012)
- `brca_tcga_pub`：Breast Invasive Carcinoma (TCGA, Nature 2012)
- `breast_alpelisib_2020`：Breast Cancer (MSK, Nature Cancer 2020)
- `breast_msk_2018`：Breast Cancer (MSK, Cancer Cell 2018)
- `ccle_broad_2025`：Cancer Cell Line Encyclopedia (Broad, Nat Rev Cancer 2025)
- `cll_broad_2015`：Chronic Lymphocytic Leukemia (Broad, Nature 2015)
- `cll_broad_2022`：Chronic Lymphocytic Leukemia (Broad, Nature Genetics 2022)
- `cll_iuopa_2015`：Chronic Lymphocytic Leukemia (IUOPA, Nature 2015)
- `cllsll_icgc_2011`：Chronic lymphocytic leukemia (ICGC, Nature Genetics 2011)
- `coad_cptac_2019`：Colon Cancer (CPTAC-2 Prospective, Cell 2019)
- `crc_hta8_htan_2024`：Colorectal Cancer (HTAN MSK, Nature 2025)
- `crc_sysucc_2022`：Colorectal Cancer- ChangKang Project (SYSUCC, Nat Commun 2022)
- `difg_glass_2019`：Diffuse Glioma (GLASS Consortium, Nature 2019)
- `hcc_meric_2021`：Hepatocellular Carcinoma (MERiC/Basel, Nat Commun. 2022)
- `hccihch_pku_2019`：Combined Hepatocellular and Intrahepatic Cholangiocarcinoma (Peking University, Cancer Cell 2019)
- `ihch_smmu_2014`：Intrahepatic Cholangiocarcinoma (Shanghai, Nat Commun 2014)

## 真实性边界

所有新增图均为 cBioPortal public REST API + R/ggplot2 教学重绘图，不复制论文原图，不下载受控数据，不代表真实临床结论。正式科研使用前必须回到原数据库、原论文和数据许可进行核验。医学AI输出仅用于教学与科研训练，不替代临床诊断。
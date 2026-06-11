# Round 38 Public Source Visual Evidence Upgrade

## 本轮目标

继续推进“每个最小单元都有示例图、来源线索和边界说明”的目标。本轮聚焦公开来源详情页：让 BRCA/TCGA/cBioPortal 这类公开来源不仅能被打开和解释，还能展示一张由公开 API 数据和本地脚本生成的可复现教学图。

## 已完成内容

### 1. 复跑公开数据图

已使用本地 R 环境重新运行：

```powershell
& 'C:\Program Files\R\R-4.6.0\bin\Rscript.exe' scripts\round23_reproduce_cbioportal_brca_mutation_plot.R
```

生成/刷新：

- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.svg`
- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.png`
- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_mutation_type_summary.csv`

该图来自 cBioPortal public REST API 的公开摘要数据和本地 R/ggplot2 教学改绘，不复制论文原图，不下载受控数据，不代表真实临床结论。

### 2. 新增结构化图谱登记

新增：

- `data/public_source_visual_examples.json`

该文件把公开来源 ID 与复现图、脚本、数据表、教学用途、推荐方法、推荐图谱和复用边界绑定。当前登记：

- `brca_tcga_pan_can_atlas_2018`
- `brca_tcga_pub2015`
- `brca_metabric`

### 3. 前端接入

修改：

- `apps/web/static/app.js`
- `apps/web/static/styles.css`
- `apps/api/app/main.py`
- `scripts/build_static_release.py`
- `apps/web/index.html`
- `apps/web/sw.js`

新增能力：

- API：`GET /api/public-source-visuals`
- 静态数据：`static-data/public_source_visual_examples.json`
- 来源详情页自动展示复现图面板；
- 来源库总览卡片可显示真实复现图缩略图；
- 图谱面板展示脚本路径、数据表、引用线索、推荐方法、推荐图谱和安全边界。

## 验证页面

- `http://127.0.0.1:4173/#/source-library/brca_tcga_pan_can_atlas_2018`

浏览器验证结果：

```json
{
  "h1": "Breast Invasive Carcinoma (TCGA, PanCancer Atlas)",
  "script": "http://127.0.0.1:4173/static/app.js?v=round38",
  "visualCards": 1,
  "detailFigure": 1,
  "visualImages": [
    {
      "src": "http://127.0.0.1:4173/outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.svg",
      "complete": true,
      "w": 941,
      "h": 595
    }
  ],
  "resultHasPackage": true,
  "hasScriptPath": true,
  "hasBoundary": true,
  "bodyHasMojibake": false,
  "console_errors_or_warnings": []
}
```

截图：

- `docs/round38_brca_source_visual_verified.png`

## 回归检查

- `python scripts\round27_static_asset_check.py`：PASS
- `python scripts\round28_product_story_check.py`：PASS
- `python scripts\round31_content_uniqueness_audit.py`：PASS
- `pytest apps\api\tests -q`：20 passed

静态发布包确认：

- `dist/github-pages-demo/static-data/public_source_visual_examples.json`：存在
- `dist/github-pages-demo/index.html`：使用 `round38` 静态资源版本

## 边界声明

- 该图是公开 API 教学改绘示例，不复制期刊原图。
- 不下载受控数据，不展示真实患者隐私。
- 不能写成本站已完成真实研究结果。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。

## 下一步

继续沿高频来源扩展真实可复现图谱示例，优先级建议：

1. GEO/Expression Atlas：差异表达与热图教学重绘；
2. GTEx：组织表达箱线图或密度图；
3. Human Protein Atlas：蛋白表达/组织定位教学说明；
4. CPTAC：蛋白组-转录组关联图；
5. CELLxGENE/10x PBMC：单细胞 UMAP 与 marker dot plot。


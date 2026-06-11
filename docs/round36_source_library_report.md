# Round34/36 证据来源库建设报告

## 本轮新增

新增 `证据来源库（Source & Figure Library）` 页面，路径为 `/source-library`。该页面把方法、文章、科研图谱、开源工具和公开数据来源中的示例图、公开来源线索、引用说明和使用边界统一汇总，解决原先“每个详情页都有来源，但新手不知道如何横向查找”的问题。

## 可浏览内容

- 方法来源卡：180 条，用于从方法学习页跳转到对应方法详情；
- 文章来源卡：28 条，用于从文章类型进入从0到1流程；
- 图谱来源卡：100 条，用于查看科研图示例、字段契约和图形解释；
- 开源工具来源卡：83 条，用于核对仓库用途、license、最小示例和复核边界；
- 公开来源入口：80 条，来自 `public_example_sources.json`，主要为 cBioPortal 等公开研究元数据线索。

当前页面共渲染 471 条可追溯示例，其中 391 条绑定本地示例图，80 条为公开来源入口占位图形。所有公开来源卡均标注“不复制论文原图、不下载受控数据、不把教学示例写成真实研究结果”。

## 功能

- 类型筛选：全部、方法、文章、图谱、工具、公开来源；
- 关键词搜索：支持 TCGA、火山图、Meta分析、GEARS、基因敲除、cBioPortal 等关键词；
- 跳转：内部卡片跳转到对应方法/文章/图谱/工具详情页；公开来源卡跳转到外部来源入口；
- 证据边界：每张卡显示来源线索、引用线索和复用边界。

## 修改文件

- `apps/web/static/app.js`
  - 新增 `sourceLibraryEntries()`、`sourceLibraryCard()`、`renderSourceLibrary()`、`sourceLibraryPage()`；
  - 新增 `/source-library` 路由；
  - 新增 `/api/public-example-sources` 静态 API 映射；
  - 导航栏新增“证据来源库”。
- `apps/web/static/styles.css`
  - 新增证据库 hero、筛选控制、来源卡、示例图展柜样式。
- `apps/api/app/main.py`
  - 新增 `GET /api/public-example-sources`。
- `scripts/build_static_release.py`
  - 静态发布包纳入 `public_example_sources.json`。
- `apps/web/index.html`、`apps/web/sw.js`
  - 资源版本升级到 `round36`。

## 浏览器验证

- 入口页面：`http://127.0.0.1:4173/#/source-library`
- 截图：`docs/round36_source_library_overview.png`
- 验证结果：
  - 页面标题存在；
  - 471 条卡片可见；
  - 391 张示例图；
  - 80 个公开来源占位；
  - 搜索“Meta分析”可筛出 9 条；
  - 控制台无 error/warn。

## 回归结果

- `python scripts/round27_static_asset_check.py`：通过；
- `python scripts/round28_product_story_check.py`：通过；
- `python scripts/round31_content_uniqueness_audit.py`：通过；
- `pytest apps/api/tests -q`：20 passed。

## 边界声明

本页面只提供教学示例图、公开来源线索和复核入口，不复制期刊原图，不下载受控数据，不宣称本站已完成真实研究。医学AI输出仅用于教学与科研训练，不替代临床诊断。

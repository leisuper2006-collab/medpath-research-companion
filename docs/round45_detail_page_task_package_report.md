# Round45 detail-page task package upgrade report

## 本轮目标

针对“每一个细小卡片或链接点进去后都要有真实情况、不同文字、示例图、完整说明和需求窗口”的要求，本轮继续补齐详情页交互能力。重点不再只展示卡片，而是让科研新手在最小单元页面内直接生成可执行任务包。

## 已完成改动

### 1. 公开来源示例图进入图谱详情页

- 修改位置：`apps/web/static/app.js`
- 新增能力：`plotPublicVisualEvidence(p)`
- 插入位置：`plotDetailPage(plotId)`
- 功能说明：当图谱与突变、队列、基因组或 oncoprint 等关键词相关时，页面会展示来自 cBioPortal public API 的公开重绘图证据卡，包括 BRCA、AML、BLCA、HNSC、LGG 等教学复现图。
- 边界说明：所有公开重绘图均标注为教学复现与来源学习材料，不替代临床诊断，不作为真实患者处置依据。

验证截图：

- `docs/round43_plot_public_evidence_verified.png`

### 2. 图谱详情页新增“图谱任务包生成器”

- 修改位置：`apps/web/static/app.js`
- 新增能力：`renderPlotTaskPackage(plotId, demandText)`
- 页面入口：`/plot-gallery/oncoprint_matrix`
- 交互控件：
  - `#plot-demand`
  - `#plot-demand-build`
  - `#plot-demand-result`
- 生成内容：
  - 图形回答的问题；
  - 字段契约；
  - R/ggplot2 执行路线；
  - 不可声称内容；
  - 可参考公开重绘图；
  - 可复制到模型网关的提示词；
  - 医学与真实性边界。

验证脚本：

- `scripts/round44_verify_plot_article_interactions.py`

验证截图：

- `docs/round44_plot_demand_package.png`

### 3. 文章工作坊修复 starter prompt 按钮

- 修改位置：`apps/web/static/app.js`
- 修复内容：文章流程页的 `promptExamples` 现在会从 workflow 字段和模型网关提示模板中生成，不再因字段名不一致导致按钮缺失。
- 页面入口：`/article-workshop/article-01`
- 验证结果：页面有 3 个 starter buttons，文章 builder 与 Apple-like product story 均存在。

验证脚本：

- `scripts/round44_verify_plot_article_interactions.py`

验证截图：

- `docs/round44_article_prompt_buttons.png`

### 4. 开源工具详情页新增“工具上手任务包生成器”

- 修改位置：`apps/web/static/app.js`
- 新增能力：`renderOpenSourceToolTaskPackage(toolId, demandText)`
- 页面入口：`/open-source/gears`
- 交互控件：
  - `#tool-demand`
  - `#tool-demand-build`
  - `#tool-demand-result`
- 生成内容：
  - 工具是否适合当前研究问题；
  - 输入材料清单；
  - 最小可运行路径；
  - 输出解释；
  - 常见误区；
  - 导师复核问题；
  - 来源核对；
  - 可复制到模型网关的工具学习提示词。

验证脚本：

- `scripts/round45_verify_tool_demand_package.py`

验证截图：

- `docs/round45_tool_demand_package.png`

## 内容唯一性与覆盖面验证

运行：

```powershell
python scripts\round31_content_uniqueness_audit.py
```

结果：

- 方法：674 个；
- 图谱：100 个；
- 文章流程：28 个；
- 开源工具：83 个；
- 缺失示例图：0；
- 缺失来源：0；
- 完全重复段落：0；
- 高相似度文本对：0。

这项检查专门回应“每一个小卡片文字不能重复、不能只换词套模板”的要求。

## 交互与测试验证

已运行并通过：

```powershell
python scripts\round27_static_asset_check.py
python scripts\round28_product_story_check.py
python scripts\round31_content_uniqueness_audit.py
pytest apps\api\tests -q
python scripts\round44_verify_plot_article_interactions.py
python scripts\round45_verify_tool_demand_package.py
```

结果摘要：

- 静态资源检查：PASS；
- 产品故事层检查：PASS；
- 内容唯一性审计：PASS；
- API 测试：20 passed；
- 图谱任务包交互：PASS；
- 文章提示按钮交互：PASS；
- 工具任务包交互：PASS；
- 页面乱码检查：PASS。

## 当前边界

- 已新增 5 组真实 public API 教学重绘图并绑定到多个公开来源页面；其余公开来源页面仍使用教学示意图或合成视觉作为学习辅助，不应被写成顶刊原图复现。
- 工具详情页已可生成上手任务包，但仍属于本地静态演示逻辑；真实运行仓库代码、安装环境和许可证核验需要用户在本机或服务器进一步执行。
- 所有医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。

## 下一批建议

1. 继续为更多 public source 增加可复现公开图，优先覆盖 `aml_ohsu_2022`、`acc_tcga_pan_can_atlas_2018`、`sarc_tcga_pub` 等来源。
2. 为工具详情页增加“一键导出运行记录”和“环境检查清单”。
3. 继续打磨桌宠交互和 3D 科研小岛动画，让导航页更接近游戏化学习入口。
4. 若后续使用 Figma，应把当前页面组件抽象成移动端 App 设计稿，而不是重复生成静态说明。

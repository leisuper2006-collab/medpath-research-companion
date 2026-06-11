# Round33 产品化详情页与来源证据升级报告

## 本轮完成

1. 方法详情页从 12 张重复信息卡改为 4 个“新手检查站”：
   - 01 适不适合：把研究问题翻译成方法判断；
   - 02 准备什么：检查数据、材料和证据来源；
   - 03 怎么执行：连接步骤、工具、示例图和公开来源；
   - 04 怎么复核：形成 Skill 链、导师/教师复核和文章路径。

2. 开源工具详情页从 6 张普通卡片改为“仓库四站学习页”：
   - 01 能做什么：解释仓库真实用途；
   - 02 能不能用：检查 license、来源和公开数据边界；
   - 03 怎么跑通：强调最小示例和运行日志；
   - 04 怎么复核：生成模型网关提示词和人工复核链。

3. 文章工坊详情页从 6 张流程卡改为“文章四站工作流”：
   - 01 先定题型：判断研究问题、材料和证据形态是否匹配该文章类型；
   - 02 补材料：缺少检索式、纳排标准、数据来源或偏倚评价时，只生成补齐清单；
   - 03 定图表：先规划证据图表，再写结果段落；
   - 04 接 API：用 Skill 链约束用户自有模型 API 输出，不伪造数据、p 值、引用和结论。

4. 图谱详情页改为“四步读懂这张图”：
   - 01 为什么画：先说明该图回答的科研问题；
   - 02 数据契约：列出正式作图必须具备的字段；
   - 03 怎么看图：说明读图顺序、阈值和常见误判；
   - 04 怎么复核：保留代码、source data、人工复核和模型提示边界。

5. 静态发布路由与缓存修复：
   - `navigate()` 在静态模式下兼容 hash/SPA 路由；
   - `currentPage()` 改为读取静态 hash route；
   - 左侧导航 active 状态同步读取当前路由；
   - GitHub Pages/http.server 下可通过真实点击进入详情页。
   - 前端资源版本从 `round33` 升级到 `round34`，避免 service worker 继续读取旧 app.js。

6. 内容唯一性审计仍通过：
   - 674 个方法、100 个图谱、28 类文章、83 个工具均无缺失示例图和公开来源字段；
   - 高相似度重复段落为 0；
   - 精确重复段落为 0。

## 真实公开来源与示例图边界

当前详情页使用 cBioPortal/TCGA 等公开来源线索和本地脚本改绘图作为教学示例。公开来源只用于帮助新手理解“这种方法跑出来的证据长什么样”，不复制期刊原图，不下载受控数据，也不声称本站已完成对应真实研究。

已参考的公开资料包括：

- cBioPortal 提供公开癌症基因组数据集浏览、可视化和下载入口：https://www.cbioportal.org/
- cBioPortal 数据集说明：公开站点维护大量已发表癌症研究，通常包含公开基因组与去标识化临床数据：https://github.com/cBioPortal/cbioportal-manual/blob/master/Datasets.md
- GDC Data Portal 是 NCI 癌症研究数据入口：https://portal.gdc.cancer.gov/
- Apple 产品页式叙事与滚动体验参考：CSS-Tricks 对 Apple 风格滚动动画的拆解：https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- Apple 官方设计资源与应用设计案例入口：https://developer.apple.com/design/new-design-gallery/

## 浏览器验证截图

- 方法详情新检查站截图：`docs/round33_static_method_checkpoint_realclick.png`
- 工具详情新检查站截图：`docs/round33_static_tool_checkpoint_realclick.png`
- 文章工坊新工作流截图：`docs/round33_static_article_checkpoint_scrolled.png`
- 图谱详情新读图流程截图：`docs/round33_static_plot_checkpoint_scrolled.png`
- 首页视觉验证截图：`docs/round32_static_homepage_final.png`

## 回归检查

- `python scripts/round27_static_asset_check.py`：通过；
- `python scripts/round28_product_story_check.py`：通过；
- `python scripts/round29_journey_blueprint_check.py`：通过；
- `python scripts/round30_island_quest_upgrade_check.py`：通过；
- `python scripts/round31_content_uniqueness_audit.py`：通过；
- `pytest apps/api/tests -q`：20 passed。

## Figma 状态

本轮尝试调用 Figma 连接器时出现 MCP 握手失败，未能创建或写入 Figma 文件。因此，不能声称本轮已经完成 Figma 文件设计。后续需要在 Figma 连接器恢复后，将本轮已落地的视觉结构同步为：

1. Web 端方法/工具产品详情页组件；
2. 移动端方法学习页；
3. 工具仓库详情页；
4. 图谱详情页；
5. 文章工坊详情页；
6. 3D 科研小岛入口页。

## 仍需继续做

1. 为每个工具仓库补充更细的“最小复现命令/环境/失败日志模板”；
2. 把公开来源 registry 和示例图 registry 在页面中做成可筛选的数据源面板；
3. Figma 恢复后生成 Web/Mobile 组件库和设计稿；
4. 发布到 GitHub Pages 或 Vercel 前配置远程仓库；
5. 将产品页 checkpoint 组件进一步抽象成共享组件，方便后续新增方法、文章和图谱类型时保持一致体验。

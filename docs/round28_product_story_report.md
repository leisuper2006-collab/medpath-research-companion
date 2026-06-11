# Round28 产品式详情页与内容唯一化报告

## 本轮目标

本轮针对用户提出的“每一个小卡片、链接、方法、图谱、工具都不能重复介绍，要像产品页一样点进去后有完整学习路径、示例图和真实用途说明”的要求，重点修复四类详情页：

- 方法宇宙详情页：`/method-universe/:id`
- 文章工作坊详情页：`/article-workshop/:id`
- 科研图谱详情页：`/plot-gallery/:id`
- 开源工具详情页：`/open-source/:id`

## 已完成建设

1. 新增产品式详情页组件。
   - 在 `apps/web/static/app.js` 中新增 `storyChapterDeck()` 与 `productFeatureStory()`。
   - 详情页从旧的横向卡片堆改为“左侧固定视觉证据 + 右侧滚动章节”的产品叙事结构。
   - 每个详情页包含：适用场景、输入材料、执行路径、常见误区、模型提示词/需求窗口、来源证明和示例图。

2. 完成内容唯一化修复。
   - 脚本：`scripts/round28_detail_content_polish.py`
   - 报告：`docs/round28_detail_content_polish_report.md`
   - 方法库 674 条、图谱库 100 条、文章流程 28 条、开源工具 83 条均重新生成差异化详情段落。
   - 30 个重复方法标题已改写为唯一标题。
   - `open_source_catalog.json` 中 16 处未知问号占位已修复。

3. 完成视觉概念归档。
   - 概念图：`docs/round28_product_detail_concept.png`
   - 概念方向：白底、强留白、产品故事页、左侧步骤导航、右侧真实示例图、底部学习路径与安全提醒，参考高水平科研产品页而非普通卡片式后台。

4. 完成产品故事样式。
   - 样式文件：`apps/web/static/styles.css`
   - 新增 `.product-feature-story`、`.story-sticky-visual`、`.story-chapter`、`.story-demand-prompt` 等样式。
   - 故事章节标题已收紧字号和行高，避免方法详情页出现大标题拥挤。

5. 修复静态发布包。
   - 修复 `scripts/build_static_release.py` 的乱码和语法错误。
   - 修复 `apps/web/index.html` 的页面描述。
   - 支持带 `?v=round28` 的静态资源路径转换和静态模式注入。
   - 静态包路径：`dist/github-pages-demo/`

## 验证结果

### 产品式详情页检查

脚本：`scripts/round28_product_story_check.py`

结果：PASS

检查页面：

- `/method-universe/method-001`
- `/article-workshop/article-01`
- `/plot-gallery/volcano_plot`
- `/open-source/celltypist`

每个页面均满足：

- `productFeatureStory` 数量为 1；
- 故事章节数量为 4；
- 旧版 `.product-story-sections` 数量为 0；
- 示例图已加载；
- 有来源证明；
- 有需求窗口或模型提示词区域；
- 无未知问号占位符；
- 控制台无错误。

证据：

- `docs/round28_product_story_check.json`
- `docs/round28_product_story_check.png`
- `docs/round28_product_story_verified.png`

### 浏览器真实页面检查

Browser/IAB 对 `http://127.0.0.1:3000/method-universe/method-001` 完成检查：

- H1：`基因敲除入门流程 · M001：判断问题、材料和证据能否对上`
- 产品故事区：1 个
- 故事章节：4 个
- 旧故事区：0 个
- 示例图：`/outputs/round11_method_plots/method-001.svg`，完整加载
- 来源证明：存在
- 未知占位符：不存在
- 控制台错误：0

### 静态发布包检查

构建命令：

```powershell
python scripts\build_static_release.py
```

静态页面检查：

```powershell
python scripts\round27_static_asset_check.py
```

结果：PASS

证据：

- 静态包：`dist/github-pages-demo/`
- 截图：`docs/round27_static_asset_verified.png`
- 发布预检：`scripts/round26_github_publish_preflight.py` 结果 PASS，未发现明文密钥；当前目录不是 Git 仓库且未安装 `gh`，因此 `can_publish_now=false`。

## 来源与边界

平台中的示例图为教学改绘、合成演示或公开数据线索下的本地可复核 SVG 示例，不直接复制期刊原图，也不声称为真实研究结果。每个详情页保留公开来源线索、字段契约、使用边界和人工复核提示。医学 AI 输出仅用于教学与科研训练，不替代临床诊断。

## 仍需继续推进

- 进一步为更多详情页做移动端逐页截图验收。
- 对每个文章类型补充更细的“从0到1材料包”模板。
- 对每个开源工具补充许可证原文链接与最小复现实验命令。
- 如用户提供 GitHub 仓库地址或安装并登录 `gh`，可继续执行真实发布。

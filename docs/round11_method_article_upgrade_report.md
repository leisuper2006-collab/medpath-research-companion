# Round 11 方法详情页与文章工坊升级报告

## 1. 方法详情页

已将 `/method-universe/{methodId}` 从简单说明页升级为“方法工作台”。新页面面向科研新手，按以下结构解释每个方法：

1. 先用一句话理解该方法解决什么问题；
2. 检查研究问题、输入材料和产出材料；
3. 说明准备什么、怎么做、得到什么；
4. 推荐可能需要的图表与开源工具；
5. 列出常见错误和安全边界；
6. 提供“需求描述窗口”，用户可以输入自己的研究需求；
7. 本地生成规范化任务包，包括输入清单、执行路径、预期产出、推荐图表、Skill 调用链、模型网关提示词和导师/教师复核清单。

验证路径：

- `http://127.0.0.1:3000/method-universe/method-001`

截图证据：

- `docs/round11_method_detail_verified.png`
- `docs/round11_mobile_method_detail.png`

说明：自动化脚本通过 PowerShell 输入中文时会出现问号，这是命令行编码问题；页面本身中文渲染正常。

## 2. 文章工坊

已将 `/article-workshop/{workflowId}` 从文章类型列表升级为“文章作战手册”。每类文章现在展示：

1. 是否适合该文章类型；
2. 从 0 开始的路径；
3. 需要准备的材料；
4. 建议调用的 Skill；
5. 图表与证据计划；
6. 质量检查；
7. 可复制给模型网关的规范化提示词；
8. 主题输入与任务包生成。

文章任务包仍严格标注真实性边界：只生成流程、材料清单和复核清单，不生成或伪造真实研究结果、p 值、引用、审稿意见或投稿结果。

验证路径：

- `http://127.0.0.1:3000/article-workshop/article-01`

截图证据：

- `docs/round11_article_workshop_verified.png`
- `docs/round11_mobile_article_workshop.png`

## 3. 回归验证

已执行：

```powershell
pytest apps\api\tests -q
python scripts\round11_run_checks.py
```

结果：

- API 测试：14 passed。
- Round11 总检查：PASS。
- 方法详情页和文章工坊桌面端、移动端均完成截图验证。

## 4. 后续增强方向

1. 将每个方法详情页进一步连接到对应文章类型和图表类型。
2. 为文章工坊增加更多“按文章类型定制”的统计路线和图表路线。
3. 将方法需求窗口生成的任务包与模型 API 规范化页面打通，实现一键带入 prompt。
4. 用更多 R/ggplot2 示例图支撑文章图表计划。

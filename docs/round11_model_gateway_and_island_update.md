# 模型网关、3D 科研小岛与绘图示例更新记录

## 1. 模型 API 规范化

本轮将“用户接入自己的大模型 API”从说明文字推进为可运行页面与接口。平台新增模型网关模板、规范化请求接口和 Mock 生成接口，使平台能够在不保存任何密钥的前提下，展示模型如何被纳入 Skill 调度、输出字段、引用核验、伦理审计和教师复核流程。

已完成文件：

- `data/model_gateway_templates.json`
- `apps/api/app/main.py`
- `apps/web/static/app.js`
- `apps/web/static/styles.css`
- `apps/api/tests/test_round11_content.py`

已完成接口：

- `GET /api/model-gateway/templates`
- `POST /api/model-gateway/normalize`
- `POST /api/model-gateway/mock-generate`

页面入口：

- `http://127.0.0.1:3000/model-gateway`

验证截图：

- `docs/round11_model_gateway_verified.png`
- `docs/round11_mobile_model_gateway.png`

边界：页面只显示 Key 是否已配置，不显示、不保存、不写入 API Key；无密钥时默认使用 Mock 模式。

## 2. R/ggplot2 科研示例图

本轮使用本机 R 运行 `scripts/generate_round11_demo_plots.R`，生成 6 张合成数据 SVG 示例图，并将它们接入图谱宇宙页面。

已完成接口：

- `GET /api/plot-demo-gallery`

页面入口：

- `http://127.0.0.1:3000/plot-gallery`

验证截图：

- `docs/round11_plot_gallery_verified.png`
- `docs/round11_mobile_plot_gallery.png`

边界：所有示例图均为合成数据教学演示，不代表真实研究结果，不得作为论文结论或教学实证效果。

## 3. 3D 科研小岛

本轮新增 Canvas 等距视角科研小岛页面。它不是装饰性地图，而是一个“科研任务入口层”：每座建筑对应方法学习、绘图、文章流程、模拟案例、伦理审计、HPC dry-run、模型网关等真实页面。点击建筑后，角色会移动，并在右侧解释该入口解决什么问题、需要什么输入、输出什么材料。

页面入口：

- `http://127.0.0.1:3000/island-3d`

验证截图：

- `docs/round11_island3d_verified.png`

边界：当前为本地教学原型，不连接真实患者数据，不自动调用真实模型，不提交 HPC 任务。

## 4. 回归测试

已执行：

```powershell
python -m compileall apps\api\app
pytest apps\api\tests -q
python scripts\round11_run_checks.py
```

结果：

- API 测试：13 passed。
- Round11 静态审计：PASS。
- 渲染验证：模型网关桌面端、模型网关移动端、3D 科研小岛、图谱宇宙桌面端、图谱宇宙移动端均通过。

## 5. 下一步

1. 继续扩展方法详情页，使每个方法能解释“适合什么问题、需要什么数据、怎么跑、会产生什么图、常见错误是什么”。
2. 继续补强 28 类文章工作流，把从 0 到投稿前检查的流程拆成可调用 Skill。
3. 将数据审查与绘图室联动：数据不规范时先提示如何修复，再允许生成示例代码或图。
4. 准备 GitHub 发布、部署说明和公开访问路线。

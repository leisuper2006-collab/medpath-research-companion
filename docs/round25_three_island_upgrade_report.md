# Round25 Three.js科研小岛升级报告

## 目标

本轮针对 `/island-3d` 页面进行专项升级，将原有二维 Canvas 兜底小岛增强为本地 Three.js 交互式 3D 场景，同时保留 Canvas fallback，保证静态发布包在不依赖外部 CDN 的情况下可运行。

## 已完成改动

- 引入本地 Three.js 运行文件：`apps/web/static/vendor/three.module.min.js`。
- 保留 Three.js MIT license：`apps/web/static/vendor/THREE_LICENSE.txt`。
- 在 `/island-3d` 页面新增 `three-island-root` 场景容器。
- 新增 Three.js 场景运行时，包括：
  - 岛屿地形、水面、任务路径与建筑群；
  - 建筑浮动动画；
  - 科研小向导角色；
  - 建筑标签与入口图标；
  - 点击建筑后联动任务面板、HUD、访问进度和本地学习状态；
  - W/A/S/D 与方向键移动；
  - 小向导到目标点的路径线；
  - 靠近建筑自动解锁对应任务；
  - 射线命中 + 最近建筑兜底选择逻辑；
  - Canvas fallback 自动保留。
- 新增页面验证脚本：`scripts/round25_three_island_check.py`。

## 验证证据

验证命令：

```powershell
python scripts\round25_three_island_check.py
pytest apps\api\tests -q
python scripts\round13_content_uniqueness_audit.py
python scripts\round17_plot_studio_linkage_check.py
python scripts\round12_release_readiness_check.py
python scripts\build_static_release.py
```

验证结果：

- Three.js 页面验证：通过。
- Three.js canvas 尺寸：688 x 620。
- 非空采样像素：15560。
- 采样颜色数：229。
- 点击交互：通过，HUD 更新到 3/10，并切换到“计算码头”任务面板。
- 键盘交互：通过，方向键触发小向导移动提示。
- 浏览器 console error：0。
- API 测试：20 passed。
- 内容唯一性审计：无失败项。
- 科研绘图室链接检查：通过。
- 发布前 readiness：通过。
- 静态发布包：已生成 `dist/github-pages-demo`。

截图证据：

- `docs/round25_three_island_verified.png`

机器可读检查记录：

- `docs/round25_three_island_check.json`

内置 Browser 补充验证：

- URL：`http://127.0.0.1:3000/island-3d`
- 页面标题：`MedPath Research & Education Skills Studio`
- H1：`把“科研小白入门”做成可走、可点、可对话的任务小岛`
- Three.js canvas：可见
- HUD：显示 `Three.js`
- console warning/error：0

## 静态发布状态

静态发布包包含 Three.js 本地 vendor 文件：

- `dist/github-pages-demo/static/vendor/three.module.min.js`
- `dist/github-pages-demo/static/vendor/THREE_LICENSE.txt`

## 安全与边界

- 本 3D 页面仅为科研训练和教学任务导航原型。
- 页面不处理真实患者数据。
- 页面不提交真实 HPC 作业。
- 页面不替代导师判断、教师复核、伦理审批或真实实验验证。

## 仍可继续增强

- 为每个建筑补充更精细的低多边形模型和环境音效开关。
- 增加键盘移动、角色路径线和任务完成动画。
- 在手机端提供轻量 Three.js/Canvas 自动切换策略。

# Round12 静态发布包建设报告

## 目标

为 GitHub Pages、Vercel 静态托管和普通静态服务器准备一个可打开、可演示、可审查的前端发布包。该包不依赖本地 FastAPI 后端即可浏览主要页面，并使用静态 JSON 与 mock 交互支持新手路径、方法详情、图谱详情、开源工具详情和常见演示按钮。

## 生成路径

- 构建脚本：`scripts/build_static_release.py`
- 发布目录：`dist/github-pages-demo/`
- 入口文件：`dist/github-pages-demo/index.html`
- SPA fallback：`dist/github-pages-demo/404.html`
- 静态数据：`dist/github-pages-demo/static-data/`
- 示例图与详情图：`dist/github-pages-demo/outputs/`

## 本地预览

```powershell
python scripts\build_static_release.py
cd dist\github-pages-demo
python -m http.server 4173
```

访问：`http://127.0.0.1:4173/`

## 已覆盖的静态交互

- 首页和左侧导航；
- 研究路径生成器；
- 方法宇宙和方法详情；
- 图谱宇宙和图谱详情；
- 文章工坊；
- 开源工具库；
- 模拟案例生成 mock；
- 数据审查 mock；
- 绘图建议与 SVG mock；
- 模型网关 normalize/mock-generate；
- 伦理治理审计 mock；
- Skill Builder 预览 mock。

## 验证截图

- 静态版研究路径生成器：`docs/round12_static_release_journey.png`
- 静态版方法宇宙：`docs/round12_static_release_method_universe.png`

## 边界声明

静态发布包不读取 API Key，不连接真实模型服务，不提交 HPC 作业，不处理真实患者数据，不代表 D03/D10 真实上线。所有医学AI输出仅用于教学与科研训练，不替代临床诊断。

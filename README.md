# MedPath Research & Education Skills Studio

面向基础医学、数智病理与生命科学科研训练的本地平台原型。它把科研方法库、文章工作流、科研绘图室、数据审查、模型 API 规范化、合成案例、AI Skills 插件、伦理治理、桌宠引导和 3D 科研小岛整合到一个可运行的教学与科研训练界面中。

> 医学 AI 输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。所有输出须经教师、导师或专家复核。

## 当前能力

- 674 条科研方法卡，覆盖基础实验、组学、病理图像、统计建模、机器学习、HPC dry-run 等方向。
- 24 条基因敲除/基因扰动路线，帮助新手区分 DNA、RNA、蛋白、系统和虚拟扰动层面的方案。
- 28 类文章工作流，包括 Meta 分析、系统综述、机器学习论文、数字病理论文、教学改革论文等。
- 100 种科研图谱说明，解释每类图回答什么问题、需要哪些字段、常见错误是什么。
- 公开或合成教学示例图：方法、图谱、文章和开源工具详情页均提供可审查示例图与来源边界。
- 研究路径生成器，可把一句自然语言需求拆成方法、工具、图谱、文章流程、数据审查和 Skill 调用链。
- 数据审查室，在绘图、统计、模型调用前检查字段、来源、伦理、隐私和统计适配。
- 模型网关页面，支持 provider 模板、mock 输出、请求包规范和安全边界提示。
- 3D 科研小岛，以游戏化入口帮助新手进入方法、文章、绘图、审查和模型页面。
- 手机端 App 产品路线页，把移动端科研学习场景拆成任务仪表盘、方法导航、文章流程、数据审查和教师复核。
- 公开数据复现实例：通过 cBioPortal public REST API 拉取 BRCA TCGA PanCancer Atlas 公开突变摘要，并用 R/ggplot2 生成教学重绘图。

## 本地运行

后端 API 与前端页面均由本地 FastAPI 服务提供。

```powershell
cd "C:\Users\HONOR\Desktop\AI skill\medpath-research-education-skills-studio-real\apps\api"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

```powershell
cd "C:\Users\HONOR\Desktop\AI skill\medpath-research-education-skills-studio-real\apps\api"
python -m uvicorn app.main:app --host 127.0.0.1 --port 3000
```

访问：

- 前端：http://127.0.0.1:3000
- API 健康检查：http://127.0.0.1:8000/api/health

Docker 启动：

```powershell
cd "C:\Users\HONOR\Desktop\AI skill\medpath-research-education-skills-studio-real"
docker compose up
```

## 关键页面

- `/researcher`：科研新手导航。
- `/journey-builder`：研究路径生成器。
- `/method-universe`：674 条科研方法卡。
- `/method-family/gene-perturbation`：基因敲除/扰动方法家族。
- `/article-workshop`：28 类文章工作流。
- `/plot-gallery`：100 种科研图谱与示例图。
- `/data-audit`：数据审查室。
- `/model-gateway`：模型 API 规范化。
- `/plugins`：插件中心。
- `/simulate`：合成教学案例实验室。
- `/island-3d`：3D 科研小岛。
- `/mobile-app`：手机端 App 产品路线。

## 静态演示包

生成 GitHub Pages/静态演示包：

```powershell
python scripts\build_static_release.py
cd dist\github-pages-demo
python -m http.server 4173
```

访问：http://127.0.0.1:4173

说明：`dist/` 默认不进入 Git 提交，可由 CI 或发布脚本重新生成。

## 测试与审计

推荐回归命令：

```powershell
pytest apps\api\tests -q
python scripts\round27_static_asset_check.py
python scripts\round28_product_story_check.py
$env:MEDPATH_BASE_URL='http://127.0.0.1:4173'; python scripts\round29_journey_blueprint_check.py
$env:MEDPATH_WEB_URL='http://127.0.0.1:4173'; python scripts\round30_island_quest_upgrade_check.py
python scripts\round31_content_uniqueness_audit.py
python scripts\round26_github_publish_preflight.py
python scripts\round62_github_pages_ready.py
```

当前已验证：

- API 测试：20 passed。
- 静态资源、产品详情页、研究路线生成器、3D 科研小岛均通过自动化检查。
- 内容审计：缺图 0、缺来源 0、明显占位 0、精确重复 0。
- 发布预检：无明文密钥发现；当前目录尚未绑定 GitHub 远程仓库，因此不能直接推送。

## R/ggplot2 示例图

本项目优先使用 R/ggplot2 生成科研示例图。公开数据复现实例：

```powershell
& 'C:\Program Files\R\R-4.6.0\bin\Rscript.exe' scripts\round23_reproduce_cbioportal_brca_mutation_plot.R
```

输出：

- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.svg`
- `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.png`
- `data/public_reproducible_examples/brca_tcga_pan_can_atlas_2018_mutation_type_summary.csv`

说明文档：

- `docs/public_reproducible_examples/brca_tcga_cbioportal_mutation_plot.md`

该示例使用 cBioPortal 公开 REST API，不下载受控数据，不复制论文原图，不代表真实临床结论。

## 模型 API 与密钥

所有真实 API Key 必须来自环境变量，不能写入代码、文档、日志或截图。

复制 `.env.example` 并在本地自行配置：

```text
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
QWEN_API_KEY=
ANTHROPIC_API_KEY=
CSU_CHAT_API_KEY=
CSU_CHAT_BASE_URL=
CSU_CHAT_MODEL=
```

无密钥时平台默认使用 mock 模式。

## 发布状态

当前项目目录已初始化为本地 Git 仓库，但尚未绑定 GitHub 远程地址，也未真实推送到公开仓库。项目已经具备静态发布包构建、GitHub Pages 工作流和发布预检脚本，但真实发布仍需：

1. 提供 GitHub 远程仓库 URL，或在本机安装并登录 `gh`。
2. 核对 `git status`，完成首次提交。
3. 再次运行 `npm run check:publish` 或 `python scripts\round62_github_pages_ready.py`，确认没有明文密钥、静态包缺失或发布配置退化。
4. 推送到远程仓库并启用 Pages 或部署到 Vercel/Cloudflare Pages。

## 不得公开或不得声称

- 不公开真实患者数据、可识别病例、原始课程记录、教师评分、学生问卷、HPC 账号或 API Key。
- 不声称已完成真实 D03/D10 上线。
- 不声称已完成真实课程试点。
- 不伪造教师评分、学生满意度、p 值、研究结果、论文、专利或软著。
- 不把合成教学案例、示例图或 mock 输出写成真实研究结论。

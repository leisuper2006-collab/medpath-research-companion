# Round 23：GitHub发布准备清单

## 当前状态

当前目录尚未初始化为Git仓库，`git status` 返回 `not a git repository`。因此本轮不直接推送远程仓库，先完成可审查的发布准备。

项目已具备：

- GitHub Actions CI：`.github/workflows/ci.yml`
- GitHub Pages发布流程：`.github/workflows/pages.yml`
- 静态演示包生成脚本：`scripts/build_static_release.py`
- 静态演示目录：`dist/github-pages-demo`
- 发布约束检查：`scripts/round12_release_readiness_check.py`
- 内容唯一性检查：`scripts/round13_content_uniqueness_audit.py`
- API测试：`apps/api/tests`

## 本轮新增可发布内容

- `/mobile-app` 手机端App路线页面；
- `/island-3d` 任务小岛交互增强；
- 方法宇宙、文章工坊、开源工具卡片示例图入口增强；
- cBioPortal公开API复现图：
  - `scripts/round23_reproduce_cbioportal_brca_mutation_plot.R`
  - `outputs/public_reproducible_examples/brca_tcga_mutation_type_distribution.svg`
  - `docs/public_reproducible_examples/brca_tcga_cbioportal_mutation_plot.md`

## 推荐发布流程

在确认要发布的目标仓库后执行：

```powershell
cd "C:\Users\HONOR\Desktop\AI skill\medpath-research-education-skills-studio-real"
git init
git branch -M main
git add .
git status
git commit -m "Build MedPath research education skills studio demo"
git remote add origin <你的GitHub仓库URL>
git push -u origin main
```

推送后，在GitHub仓库设置中启用 Pages：

1. Settings → Pages；
2. Source选择 GitHub Actions；
3. 手动运行 `Deploy Static Demo to GitHub Pages` 工作流，或推送到 `main` 自动触发；
4. 发布产物来自 `dist/github-pages-demo`，该目录由CI现场构建，不需要提交本地 `dist/`。

## 发布前必须检查

```powershell
pytest apps\api\tests -q
python scripts\build_static_release.py
python scripts\round12_release_readiness_check.py
python scripts\round13_content_uniqueness_audit.py
python scripts\round17_plot_studio_linkage_check.py
```

本轮已验证：

- API测试：20 passed；
- Round12发布准备：PASS；
- Round13内容唯一性：无失败项；
- Round17绘图室链接：PASS；
- 静态发布包已重建。

## 不应提交或公开的内容

`.gitignore` 已排除以下高风险内容：

- `.env`、`.env.*`、私钥、证书；
- Python虚拟环境、node_modules、缓存；
- 真实患者数据、真实课程记录、真实HPC输出；
- 本地日志、临时文件、浏览器测试报告。

发布前仍需人工确认：

- 不含API Key、HPC密码、SSH私钥；
- 不含真实患者身份信息；
- 不含未授权课程资料；
- 不把合成案例写成真实病例；
- 不把教学示例图写成真实研究结果；
- 不宣称D03/D10/HPC真实上线或真实试点完成。

## 边界声明

GitHub Pages版是静态演示站点，适合展示方法库、文章流程、绘图说明、公开数据教学复现图和新手学习路线。它不处理真实患者数据，不保存API Key，不提交HPC任务，不替代临床诊断。


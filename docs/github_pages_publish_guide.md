# GitHub Pages 发布指南

本项目可以发布一个静态演示版，用于展示 MedPath Research Companion 的方法库、文章流程、科研图谱、开源工具导航、研究路径生成器和 3D 科研小岛。静态演示版只读取仓库内 JSON 和 SVG，不连接真实模型 API，不读取 API Key，不处理真实患者数据。

## 1. 发布前检查

在本地运行：

```powershell
pytest apps\api\tests -q
python scripts\build_static_release.py
python scripts\round12_release_readiness_check.py
python scripts\round31_content_uniqueness_audit.py
python scripts\round26_github_publish_preflight.py
python scripts\round62_github_pages_ready.py
```

必须全部通过后再推送。

## 2. 推荐仓库设置

1. 在 GitHub 创建一个空仓库。
2. 把本地项目初始化为 Git 仓库并推送到 `main` 分支。
3. 在仓库 Settings → Pages 中选择 `GitHub Actions`。
4. 推送后 `.github/workflows/pages.yml` 会构建 `dist/github-pages-demo` 并发布。

## 3. 静态版能力边界

静态版支持：

- 方法库浏览与详情页；
- 文章流程浏览；
- 科研图谱详情页与示例图；
- 开源工具导航；
- 研究路径生成器 mock 逻辑；
- 模型网关 mock 请求包；
- 数据审查规则演示；
- 3D 科研小岛本地交互。

静态版不支持：

- 真实 API Key 调用；
- 真实 D03/D10 平台联调；
- 真实课程试点数据；
- 真实患者病例；
- 真实 HPC 作业提交。

## 4. 不得公开内容

发布前确认仓库中不存在：

- `.env`；
- API Key、HPC 密码、SSH 私钥；
- 真实患者数据或可识别病例；
- 未授权课程材料；
- 未公开教师/学生问卷；
- 未授权论文原图；
- 真实平台账号或接口密钥。

## 5. 验证上线页面

上线后至少访问：

- `/`
- `/#/journey-builder`
- `/#/island-3d`
- `/#/mobile-app`
- `/#/source-library/ccle_broad_2025`
- `/#/method-universe/method-001`
- `/#/article-workshop/article-01`
- `/#/plot-gallery/volcano_plot`
- `/#/open-source/celltypist`

如果使用 hash 路由，GitHub Pages 上的直接访问应优先使用 `/#/...` 形式。旧版无 hash 路径仅作为本地 FastAPI 路由参考。

## 6. 当前本地发布状态

截至 Round62，本地静态包、发布 workflow、密钥扫描、内容唯一性审计和 Round61 首页入口均已准备好。当前仍有三项外部条件未完成：

1. 当前仓库尚未绑定 GitHub `origin` 远程仓库。
2. 当前 `main` 分支尚未创建首次提交。
3. 本机未发现 `gh` CLI，因此无法直接从本地创建仓库或读取 GitHub 登录态。

因此，本指南不声称网站已经公开上线。完成远程仓库绑定、首次提交和推送后，GitHub Actions 才会执行 Pages 部署。

## 7. 静态版重点验收页面

- `/`
- `/journey-builder`
- `/method-universe/method-001`
- `/article-workshop/article-01`
- `/plot-gallery/volcano_plot`
- `/open-source/gears`
- `/island-3d`

每个页面应能看到中文内容、示例图、安全边界和公开来源线索。

## 8. 医学AI边界

医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。所有输出须经教师、导师或专家复核。

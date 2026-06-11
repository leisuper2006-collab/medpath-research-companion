# GitHub Pages 发布记录

## 当前公网地址

https://leisuper2006-collab.github.io/medpath-research-companion/

## 当前发布方式

已采用预构建静态站点发布方案：

1. 从 `main` 分支执行 `scripts/build_static_release.py` 生成 `dist/github-pages-demo`。
2. 将静态产物推送到远端 `gh-pages` 分支。
3. GitHub Pages 从 `gh-pages` 分支提供公开访问。

该方案用于快速发布和对外评审预览；后续继续修改主分支内容后，可重新执行发布脚本。

## 重新发布命令

```powershell
cd "C:\Users\HONOR\Desktop\AI skill\medpath-research-education-skills-studio-real"
powershell -ExecutionPolicy Bypass -File scripts\publish_github_pages.ps1
```

## 已验证

- 远端仓库：`https://github.com/leisuper2006-collab/medpath-research-companion.git`
- 发布分支：`gh-pages`
- 当前公网首页返回：`200`
- 首页内容包含：`MedPath`

## 后续修改流程

1. 在本地继续修改网站内容、样式、方法库和功能。
2. 测试本地预览。
3. 提交并推送 `main` 分支。
4. 执行上述重新发布命令，把最新静态站推到 `gh-pages`。

注意：所有医学内容仅用于教学与科研训练，不替代临床诊断。

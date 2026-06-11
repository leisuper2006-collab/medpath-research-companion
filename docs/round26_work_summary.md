# Round26工作汇总

## 本轮目标

在 Round25 的基础上继续推进未闭合项，重点包括：

1. 让 3D 科研小岛更接近“可玩任务空间”；
2. 为 GitHub 发布增加机器预检；
3. 修复旧发布 readiness 对密钥扫描脚本的误报；
4. 保持 PWA、静态发布包和现有内容审计通过。

## 完成内容

### 1. 3D科研小岛交互增强

已在 `apps/web/static/app.js` 中新增：

- W/A/S/D 与方向键移动科研小向导；
- 小向导到目标点的路径线；
- 靠近建筑自动解锁对应任务；
- 键盘移动后对话框提示“手动移动”和证据留存要求；
- 原点击建筑、HUD 更新、右侧任务面板联动继续保留。

验证脚本 `scripts/round25_three_island_check.py` 已同步增强：

- 检查 Three.js canvas 可见；
- 检查 canvas 非空像素与颜色数；
- 检查点击建筑后任务面板更新；
- 检查方向键移动后小向导对话更新；
- 检查浏览器 console warning/error。

### 2. GitHub发布预检

新增脚本：

- `scripts/round26_github_publish_preflight.py`

新增报告：

- `docs/round26_github_publish_preflight.md`
- `docs/round26_github_publish_preflight.json`

当前预检结论：

- Git 可用；
- 静态发布包关键文件齐全；
- 未发现明文密钥；
- 当前目录不是 Git 仓库；
- 未发现 `gh` GitHub CLI；
- 因此不能声称已发布到 GitHub。

### 3. 旧readiness误报修复

修复 `scripts/round12_release_readiness_check.py` 的密钥扫描逻辑：

- 跳过正则表达式定义本身；
- 跳过占位符与示例说明；
- 改为逐行扫描，避免跨行误报。

## 验证结果

```powershell
python scripts\round25_three_island_check.py
# PASS

python scripts\round25_pwa_check.py
# PASS

pytest apps\api\tests -q
# 20 passed

python scripts\round26_github_publish_preflight.py
# PASS；但 can_publish_now=false，因为尚无Git仓库/远程/gh

python scripts\round12_release_readiness_check.py
# PASS

python scripts\round13_content_uniqueness_audit.py
# failures: []

python scripts\round17_plot_studio_linkage_check.py
# PASS

python scripts\build_static_release.py
# Static release built: dist\github-pages-demo
```

## 边界

- 未声称 GitHub 已真实发布。
- 未声称 Figma 云端文件已创建。
- 未声称原生 Android/iOS App 已打包。
- 未声称真实课程试点完成。
- 未声称 D03/D10 已真实上线。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断。

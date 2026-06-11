# Round65 页面级科研需求解析升级报告

## 本轮目标

继续推进“科研新手也能知道每个方法、图谱、文章和来源到底怎么用”的目标。本轮没有继续堆页面数量，而是把详情页底部的需求窗口从静态说明升级为页面级需求解析器，使用户输入真实任务后，能看到任务意图、材料缺口、Skill链、图表证据、模型提示和安全边界。

## 已完成改动

1. 新增通用需求解析器
   - 在 `apps/web/static/app.js` 中新增 `demandSignals()`、`demandReadinessItems()` 和 `renderDemandInsightPanel()`。
   - 支持识别基因扰动、单细胞分析、空间/病理图像、循证综述、建模评价、科研绘图、文章流程和风险治理等任务意图。

2. 方法详情页增强
   - `renderMethodDemandPackage()` 接入需求解析面板。
   - 输入“CRISPR敲除TP53、胃癌迁移、机制文章和主图”时，系统可识别出“基因扰动、科研绘图、文章流程”。
   - 输出不再只是固定清单，而是先提示材料缺口、推荐Skill链、可联动图表和安全边界。

3. 图谱详情页增强
   - `renderPlotTaskPackage()` 接入需求解析面板。
   - 图谱页会围绕字段契约、R/ggplot2优先路线、统计前提和不可声称内容组织任务包。

4. 文章工坊增强
   - 新增 `renderArticleDemandPackage()`，替换原来较简单的任务包输出。
   - 文章页现在会把研究主题、材料清单、从0到1流程、图表计划、Skill调用链和模型网关提示统一展示。

5. 来源详情页增强
   - `renderSourceTaskPackage()` 接入需求解析面板。
   - 用户基于公开来源提出任务时，系统会优先给出来源核验、可做任务、方法/图谱/文章链和不可声称内容。

6. 视觉样式升级
   - 在 `apps/web/static/styles.css` 中新增 `.demand-insight-board`、`.demand-signal-card`、`.demand-insight-grid` 等样式。
   - 面板采用轻量学术产品风格，区分“系统识别到的意图”和“下一步该补齐的材料”。

7. 静态版本更新
   - `apps/web/index.html` 更新到 `round65`。
   - `apps/web/sw.js` 更新到 `medpath-research-companion-v65`。
   - `scripts/round62_github_pages_ready.py` 更新为检查 Round65 当前资源。

## 验证结果

| 检查项 | 结果 |
|---|---|
| Round65 需求智能验证 | 通过 |
| 方法页需求解析 | 通过，识别基因扰动/科研绘图/文章流程 |
| 图谱页需求解析 | 通过，识别科研绘图 |
| 文章页需求解析 | 通过，识别空间/病理图像与循证综述 |
| 来源页需求解析 | 通过 |
| 移动端方法页需求解析 | 通过 |
| Round64 动效回归 | 通过 |
| 首页路线驾驶台回归 | 通过 |
| API 单元测试 | 20 passed |
| GitHub Pages 静态发布预检 | `ready_except_external_publish` |
| 内容唯一性审计 | 通过 |

## 证据截图

- 桌面需求解析截图：`docs/round65_demand_intelligence_verified.png`
- 移动端需求解析截图：`docs/round65_demand_intelligence_mobile_verified.png`

## 运行命令

```powershell
python scripts\build_static_release.py
python scripts\round65_verify_demand_intelligence.py
python scripts\round64_verify_motion_experience.py
python scripts\round61_verify_home_command_center.py
pytest apps\api\tests -q
python scripts\round62_github_pages_ready.py
python scripts\round31_content_uniqueness_audit.py
```

## 尚未完成的外部事项

GitHub Pages 仍未公开发布，原因不是静态包失败，而是缺少外部发布条件：未绑定 GitHub `origin`、当前分支尚无首次提交、本机未发现 `gh` CLI。真实模型API、真实课程试点、真实教师评分、D03/D10平台回传也仍未宣称完成。

## 边界声明

所有新增需求解析均为本地原型功能。医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置；平台不会生成真实p值、真实临床结论、未核验引用或虚构专家意见。

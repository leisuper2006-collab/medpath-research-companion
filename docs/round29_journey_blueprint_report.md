# Round29 科研新手路线蓝图升级报告

## 本轮目标

用户希望平台不仅有几百个方法、图谱、文章流程和工具入口，还要能帮助科研新手理解“我现在该做什么”。本轮围绕 `/journey-builder` 增强了从一句研究需求到可执行科研路线的生成结果，使它能把方法、图谱、文章、工具、数据审查和模型 API 提示串起来。

## 已完成改动

1. 新增路线蓝图渲染逻辑。
   - 文件：`apps/web/static/app.js`
   - 新增函数：`firstUsefulList()`、`journeyBlueprint()`
   - `renderJourneyPlan()` 现在会在原有四步路线后追加一个“科研路线蓝图”。

2. 蓝图包含的新手友好内容。
   - 7 天入门路径：从研究问题、材料边界、首选方法、示例图、开源工具、文章证据链到导师复核包。
   - 材料包清单：自动从推荐方法/文章的输入要求中提取。
   - 导师/教师复核问题：自动从方法或文章的复核清单中提取。
   - 模型 API 提示骨架：自动取推荐方法、图谱、文章或工具的提示词模板。
   - 五个跳转入口：首选方法、推荐图谱、文章流程、工具详情、数据审查。

3. 新增路线蓝图样式。
   - 文件：`apps/web/static/styles.css`
   - 新增 `.journey-blueprint`、`.blueprint-grid`、`.blueprint-day`、`.blueprint-route-strip` 等样式。
   - 风格保持白底、克制色彩、清晰层级，不再只是普通列表。

4. 缓存版本同步。
   - `apps/web/index.html`：资源版本更新到 `round29`。
   - `apps/web/sw.js`：缓存名更新到 `medpath-research-companion-v29`。

## 验证结果

新增检查脚本：

```powershell
python scripts\round29_journey_blueprint_check.py
```

开发版结果：PASS

- 页面：`http://127.0.0.1:3000/journey-builder`
- 蓝图区：1 个
- 7 天路径：7 步
- 跳转入口：5 个
- 模型 API 提示骨架：存在
- 医学 AI 安全边界：存在
- 未知问号占位符：无
- 控制台错误：无
- 截图：`docs/round29_journey_blueprint_verified_dev.png`

静态发布版结果：PASS

```powershell
$env:MEDPATH_BASE_URL='http://127.0.0.1:4173'
python scripts\round29_journey_blueprint_check.py
```

- 页面：`http://127.0.0.1:4173/journey-builder`
- 蓝图区：1 个
- 7 天路径：7 步
- 真实生成需求：单细胞分析需求能更新路线
- 推荐跳转：方法、图谱、文章、Scanpy 工具、数据审查
- 截图：`docs/round29_journey_blueprint_verified_static.png`

## 本轮改进的用户价值

科研新手现在不需要先知道几百个方法名。用户只要写一句“我想做什么”，平台会把需求拆成可执行的学习路径，并指向对应方法详情页、图谱详情页、文章 Skill、开源工具和数据审查入口。这样几百个方法库不再是散列表，而是可以被需求驱动调用的科研训练网络。

## 边界说明

本功能只生成科研训练路线、材料清单、模型提示骨架和导师复核问题，不生成真实研究结论，不生成临床处置建议。医学 AI 输出仅用于教学与科研训练，不替代临床诊断。所有正式科研输出仍需使用者自有或合规公开数据，并经导师、教师或专家复核。

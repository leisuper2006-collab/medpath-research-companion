# Round61 首页科研需求驾驶台升级报告

## 本轮目标

用户反复强调：网站不能只是卡片目录，科研新手应当能先描述自己的真实需求，再由平台推荐方法、图形、文章流程、工具、审查和Skill链。本轮在首页新增“科研需求驾驶台”，让首页具备即时路线生成能力，减少新手在多个模块之间迷路。

## 已完成内容

1. 首页新增需求输入入口
   - 新增 `Beginner Command Center` 区块。
   - 支持用户输入一句科研或教学需求。
   - 提供基因敲除、Meta分析、单细胞、病理PBL四个快速starter。

2. 首页轻量路线预览
   - 根据需求自动推荐6步路线：
     1. 问题分诊；
     2. 推荐方法；
     3. 推荐示例图；
     4. 推荐文章流程；
     5. 推荐开源工具；
     6. 审查与复核。
   - 每一步都有独立说明和跳转按钮。
   - 路线说明会随需求变化，不复制同一段模板文本。

3. Skill链提示
   - 自动显示建议调用的Skill链。
   - 对不同需求切换 `medical-kg-rag-builder`、`skill-eval-harness`、`pathology-case-builder`、`teacher-skill-maker` 等组合。

4. 产品级视觉补强
   - 区块采用半透明输入台、柔和渐变、路线卡和结果头部结构。
   - 桌面端以两列输入和6步路线卡展示。
   - 手机端自动堆叠，避免文字挤压。

5. 安全边界
   - 路线生成明确标注：医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置，所有结果须经教师或专家复核。

## 关键文件

- 前端逻辑：`apps/web/static/app.js`
- 前端样式：`apps/web/static/styles.css`
- 静态入口版本：`apps/web/index.html`
- Service Worker版本：`apps/web/sw.js`
- 验证脚本：`scripts/round61_verify_home_command_center.py`
- 桌面截图：`docs/round61_home_command_center_verified.png`
- 移动端截图：`docs/round61_home_command_center_mobile_verified.png`

## 验证结果

Round61专项验证通过：

```json
{
  "has_deck": true,
  "card_count": 6,
  "link_button_count": 6,
  "skill_badge_count": 4,
  "has_complete_builder": true,
  "has_safety": true,
  "has_mojibake": false,
  "failures": []
}
```

输入“单细胞RNA测序”后，路线预览成功更新为单细胞相关路线，包含时间梯度进阶设计、PCA载荷图、多组学整合论文和Scanpy等入口。

## 回归检查

本轮完成后通过以下检查：

- `python scripts/round61_verify_home_command_center.py`
- `python scripts/round60_verify_island_gameplay.py`
- `python scripts/round57_verify_public_visual_full_coverage.py`
- `python scripts/round31_content_uniqueness_audit.py`
- `pytest apps/api/tests -q`

API测试结果：`20 passed`。

内容唯一性审计结果仍保持：

- 方法库：674项，无缺图、无缺来源、无高相似重复。
- 科研绘图：100项，无缺图、无缺来源、无高相似重复。
- 文章Skill：28项，无缺图、无缺来源、无高相似重复。
- 开源工具：83项，无缺图、无缺来源、无高相似重复。

## 当前边界

首页驾驶台生成的是学习与项目设计路线，不代表真实研究结论。真正研究执行仍需接入用户自己的数据、模型API、导师复核和伦理边界确认。

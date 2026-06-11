# Round 37 Public Source Detail Upgrade

## 本轮目标

把“证据来源库”中的公开来源条目从简单外链升级为站内可学习详情页。每个公开来源不只告诉用户“去哪里看”，还要解释它适合什么教学/科研训练任务、如何连接方法库、图谱库和文章流程，以及哪些内容不能写成真实已完成成果。

## 已完成内容

- 在来源库卡片中，将公开来源的主按钮从直接外链改为站内详情页：`/source-library/{source_id}`。
- 新增 `publicSourceDetailPage(sourceId)`：
  - 来源身份与引用线索；
  - 四步学习路径；
  - 推荐方法入口；
  - 推荐图谱入口；
  - 推荐文章流程；
  - 需求描述窗口；
  - 本地生成“来源任务包”。
- 新增 `renderSourceTaskPackage(sourceId, demandText)`：
  - 来源核验清单；
  - 可做任务；
  - 不能声称的内容；
  - 教师复核清单；
  - 可复制到模型网关的提示词。
- 新增样式：
  - `source-detail-hero`
  - `source-detail-orbit`
  - `source-learning-path`
  - `source-detail-columns`
- 明确写入安全边界：医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置，需教师或专家复核。

## 验证页面

- 本地页面：`http://127.0.0.1:4173/#/source-library/aml_ohsu_2022`
- 示例来源：`Acute Myeloid Leukemia (OHSU, Cancer Cell 2022)`
- 截图：`docs/round37_public_source_detail_verified.png`

## 浏览器验证结果

```json
{
  "h1": "Acute Myeloid Leukemia (OHSU, Cancer Cell 2022)",
  "sections": 5,
  "methodLinks": 13,
  "sourceButton": true,
  "resultHasPackage": true,
  "bodyHasMojibake": false,
  "hasBoundary": true,
  "script": "http://127.0.0.1:4173/static/app.js?v=round37",
  "console_errors_or_warnings": []
}
```

## 回归检查

- `python scripts\round27_static_asset_check.py`：PASS
- `python scripts\round28_product_story_check.py`：PASS
- `python scripts\round31_content_uniqueness_audit.py`：PASS
- `pytest apps\api\tests -q`：20 passed

## 尚未完成

- 当前公开来源详情页使用来源元数据、方法/图谱/文章推荐和本地生成任务包；尚未为 80 个公开来源逐一手工编写完全定制长文案。
- 下一步应为高频来源新增“来源故事段落”和“推荐复现实例图”，优先覆盖 TCGA、cBioPortal、GEO、GTEx、Human Protein Atlas、CPTAC 等最常用来源。
- Figma 高保真移动端设计尚未生成。当前 Figma 连接器此前不可用，后续恢复后应补移动端 App 视觉稿。


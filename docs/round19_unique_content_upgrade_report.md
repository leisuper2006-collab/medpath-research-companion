# Round19 内容去重与真实分层说明升级报告

## 本轮目标
- 让方法页、文章页、开源仓库页不再使用同一套模板句。
- 每个最小单元都补充面向科研新手的适用场景、材料要求、输出解释、风险边界和人工复核问题。
- 示例图仍采用公开来源线索或本地合成教学图，不复制论文原图，不伪造真实结果。

## 数据源更新
- 方法库：674 个方法条目。
- 文章工作流：28 种文章类型。
- 开源工具目录：83 个工具条目。
- 公开来源线索：80 条，主要来自 cBioPortal 公开研究元数据和公开论文引用信息。

## 重复字段复查
### methods
- `inputs`：重复值种类 0，最大重复次数 1
- `outputs`：重复值种类 0，最大重复次数 1
- `human_review_checklist`：重复值种类 0，最大重复次数 1
- `required_materials`：重复值种类 0，最大重复次数 1
- `zero_to_one_path`：重复值种类 0，最大重复次数 1
- `quality_checks`：重复值种类 0，最大重复次数 1
- `output_interpretation`：重复值种类 0，最大重复次数 1
- `risk_notes`：重复值种类 0，最大重复次数 1
- `detail_novice_intro`：重复值种类 0，最大重复次数 1
- `detail_scroll_panels`：重复值种类 0，最大重复次数 1
### articles
- `inputs`：重复值种类 0，最大重复次数 1
- `outputs`：重复值种类 0，最大重复次数 1
- `human_review_checklist`：重复值种类 0，最大重复次数 1
- `required_materials`：重复值种类 0，最大重复次数 1
- `zero_to_one_path`：重复值种类 0，最大重复次数 1
- `quality_checks`：重复值种类 0，最大重复次数 1
- `output_interpretation`：重复值种类 1，最大重复次数 28
- `risk_notes`：重复值种类 1，最大重复次数 28
- `detail_novice_intro`：重复值种类 0，最大重复次数 1
- `detail_scroll_panels`：重复值种类 0，最大重复次数 1
### tools
- `inputs`：重复值种类 1，最大重复次数 83
- `outputs`：重复值种类 1，最大重复次数 83
- `human_review_checklist`：重复值种类 0，最大重复次数 1
- `required_materials`：重复值种类 1，最大重复次数 83
- `zero_to_one_path`：重复值种类 1，最大重复次数 83
- `quality_checks`：重复值种类 1，最大重复次数 83
- `output_interpretation`：重复值种类 0，最大重复次数 1
- `risk_notes`：重复值种类 0，最大重复次数 1
- `detail_novice_intro`：重复值种类 0，最大重复次数 1
- `detail_scroll_panels`：重复值种类 0，最大重复次数 1

## 真实性边界
- 图像和公开来源只作为学习路线、字段审查和方法理解的示例，不代表用户数据结果。
- 正式科研出图必须使用用户自有、授权或合规公开数据。
- 医学AI输出仅用于教学与科研训练，不替代临床诊断，需导师/教师/专家复核。

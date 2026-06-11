# Round 11 文章工坊 Skill 流程报告

## 交付范围

本轮新增 `data/article_skill_workflows.json`，用于承载文章工坊的结构化工作流数据。文件覆盖 26 类写作与科研转化场景，包括 Meta 分析、系统综述、叙述性综述、Protocol、单细胞文章、空间转录组、多组学、机制研究、病理 AI 诊断模型、预后模型、生物标志物、药物重定位、网络药理学、Mendelian randomization、临床回顾队列、教改论文、医学教育数字化、AI 伦理治理、计算病理方法、数据库/知识图谱资源、会议摘要、专利交底书、软著说明、基金申请书、病例报告、诊断准确性研究、临床试验论文和医学质性研究。

每个工作流均包含以下字段：`id`、`zh_name`、`target_user`、`solves`、`suitable_data`、`unsuitable`、`zero_to_one_steps`、`required_inputs`、`output_sections`、`figures_needed`、`quality_checklist`、`common_rejection_risks`、`model_api_prompt_template`、`skill_output_schema`、`safety_boundary`。

## 全流程设计

文章工坊建议按“入口分诊、材料收集、流程生成、质量审查、输出封装”五段运行。

1. 入口分诊：用户选择文章类型，系统读取对应 `article_types[].id`，展示适用数据、不适用情形和安全边界，避免把不适合的材料硬写成论文。
2. 材料收集：根据 `required_inputs` 生成表单或上传清单，让用户提供研究问题、数据字典、检索记录、分析结果、伦理信息、图表素材等。
3. Skill 流程生成：调用 `zero_to_one_steps` 形成任务清单，再将用户材料和 `model_api_prompt_template` 拼接为模型请求。模型只允许输出计划、草稿、质控清单和待补充项。
4. 质量审查：用 `quality_checklist` 和 `common_rejection_risks` 对输出进行二次检查，标注证据不足、伦理缺口、统计风险、图表缺失和结论越界。
5. 输出封装：按 `skill_output_schema` 返回结构化 JSON，再渲染为论文大纲、方法段落、图表计划、审稿风险清单或投稿前检查表。

所有流程都采用同一条底线：不得伪造真实论文结果、病例数据、检索命中、引用、伦理批件、注册号、统计显著性、模型性能或授权状态。

## Meta 分析重点流程

Meta 分析工作流是文章工坊的核心循证模块，建议在界面和 Skill 执行层单独强化。

标准路径如下：

1. 明确 PICO：人群、干预或暴露、对照、结局必须拆开填写。
2. 注册或方案：提示用户准备 PROSPERO、INPLASY 或机构内方案记录；未注册时在风险中标注。
3. 检索策略：保存数据库、检索式、日期、语言限制和灰色文献策略。
4. 双人筛选：记录题录筛选、全文排除原因和冲突解决方式。
5. 数据提取：建立研究特征、样本量、效应量、协变量和结局定义字段。
6. 偏倚风险：按研究类型选择 RoB 2、ROBINS-I、QUADAS-2、NOS 或 JBI 工具。
7. 统计合并：根据效应量类型选择 OR、RR、HR、MD、SMD 或比例合并；优先输出 R 的 `meta` 或 `metafor` 代码框架。
8. 异质性处理：报告 I2、tau2、Q 检验，并设计亚组、Meta 回归或叙述性综合。
9. 稳健性检查：执行 leave-one-out、排除高风险研究、模型切换和影响诊断。
10. 发表偏倚：在研究数量允许时输出漏斗图、Egger/Begg 检验或 trim-and-fill，并解释局限。
11. 证据分级：可选接入 GRADE 表，区分效应估计和证据确定性。
12. 报告规范：最终按 PRISMA 2020 输出摘要、流程图、结果段落、补充表和投稿前清单。

模型提示词必须强制包含限制语句：只基于用户上传的筛选记录、提取表和分析结果写作；缺失数据写入 `missing_items` 或 `risk_warnings`，不得补造研究或数值。

## 接入用户自己的 API

文章工坊数据文件只保存提示词模板和输出 schema，不保存任何密钥。用户自己的模型 API 应通过运行时配置接入。

推荐接入方式：

1. 前端或命令行让用户选择 `workflow_id`，例如 `meta_analysis`。
2. 后端读取 `data/article_skill_workflows.json`，定位对应工作流。
3. 后端收集用户材料，构造请求体：

```json
{
  "workflow_id": "meta_analysis",
  "system_policy": "不得伪造真实研究结果；缺失信息必须列为待补充。",
  "prompt_template": "<model_api_prompt_template>",
  "user_inputs": {
    "pico": "...",
    "search_strategy": "...",
    "extraction_table": "...",
    "risk_of_bias": "..."
  },
  "expected_schema": "<skill_output_schema>"
}
```

4. API key 从环境变量读取，例如 `ARTICLE_WORKSHOP_API_KEY`、`OPENAI_API_KEY` 或用户自定义 provider key。不要写入 JSON、日志、浏览器本地存储或文档。
5. 调用模型时启用结构化输出或 JSON mode，使返回内容匹配 `skill_output_schema`。
6. 后端对模型返回做 schema 校验，并再次运行安全检查：是否出现未提供的研究编号、P 值、HR、AUC、伦理批件、注册号、患者信息或虚假引用。
7. 校验通过后再渲染为 Markdown、Word 草稿、图表清单、R 分析脚本框架或投稿检查表。

## 建议的 Skill 输出对象

文章工坊可以统一返回以下顶层对象，具体字段由每个工作流的 `skill_output_schema` 扩展：

```json
{
  "workflow_id": "string",
  "input_completeness": "complete|partial|insufficient",
  "draft_sections": {},
  "analysis_or_method_plan": [],
  "figures": [],
  "quality_check": [],
  "risk_warnings": [],
  "missing_items": [],
  "safety_boundary_confirmation": "string"
}
```

这样既能支持论文草稿，也能支持基金、专利、软著和会议摘要等非论文输出。

## 边界与审查

本轮数据定位为写作与流程生成资产，不包含真实研究结论。所有真实结果、统计值、病例细节、伦理审批、注册号、引用和知识产权状态均必须由用户提供或由后续可审计流程生成。模型输出只能作为科研写作辅助材料，不能替代伦理审查、统计师复核、临床判断、专利代理或法律合规意见。

# Known Limitations

## 真功能

- 前端页面可打开、可导航、可点击。
- 关键按钮会调用 FastAPI mock API 并更新页面状态。
- Skill Builder 会生成 SKILL.md、plugin.json、eval.yaml 和 README 预览，并写入本地输出目录。
- Plot Studio 会生成 SVG demo 图。
- Provider Hub 会检测环境变量是否配置，但不会显示或保存密钥。

## Mock 功能

- 模型调用为 mock，不代表已接入真实 OpenAI、DeepSeek、Qwen、Anthropic、CSU_CHAT 或其他供应商。
- 合成案例为教学 demo，不是真实病例。
- Comparison Lab 仅为示例对比，不代表已经得到实测提升结论。
- Governance 审计为规则级 demo，不替代真实伦理审查。

## 需要后续真实材料

- 课程组授权材料。
- 教师专家真实复核。
- 学生问卷与教师评分。
- D03/D10 接口文档与平台联调。
- 真实模型 API Key 与安全部署。
- 正式服务器部署、权限管理和日志留存。

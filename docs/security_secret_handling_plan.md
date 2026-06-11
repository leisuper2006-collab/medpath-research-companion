# Security Secret Handling Plan

- 所有 API Key 只能来自环境变量。
- `.env.example` 只包含空占位符，不包含真实密钥。
- Provider Test 只返回 configured true/false，不返回密钥内容。
- 不保存 SSH 密码、HPC 密码、私钥、token、cookie 或真实患者数据。
- 如发现明文密钥，应立即替换为环境变量占位符，并生成 `security/secret_leak_report.md`。


# Round15 3D科研小岛与桌宠升级检查报告

## 检查结论

通过

## 已覆盖内容

- 建筑任务节点：10 个。
- 每个建筑均应包含任务标题、三步路径、Skill调用链、证据要求、starter prompt、奖励提示和安全边界。
- 页面右侧面板已从普通说明升级为任务面板。
- 全站桌宠已从单次alert提示升级为带快捷入口的科研小向导。

## 建筑清单

- 方法图书馆：任务一：把“我想研究某个基因”拆成方法路线；入口 `/method-universe`；调用链 `research-copilot, medical-kg-rag-builder, ai-ethics-governor`。
- 科研绘图室：任务二：从一张表生成一组论文级图表计划；入口 `/plot-gallery`；调用链 `skill-eval-harness, research-copilot, teacher-skill-maker`。
- 文章工坊：任务三：把一个选题变成可执行的写作工程；入口 `/article-workshop`；调用链 `research-copilot, innovation-incubator, ai-ethics-governor`。
- 模拟案例温室：任务四：生成一份病理PBL合成教学案例；入口 `/simulate/new`；调用链 `case-simulation-generator, pathology-case-builder, pathology-report-coach, ai-ethics-governor`。
- 伦理门岗：任务五：给一段AI输出做风险过门检查；入口 `/governance`；调用链 `ai-ethics-governor, citation_checker, hallucination-risk-auditor`。
- 计算码头：任务六：为机制教学案例生成HPC任务草案；入口 `/runtime`；调用链 `hpc-job-runner, model-router, ai-ethics-governor`。
- 导师小屋：任务七：定制一条科研新手学习路径；入口 `/researcher`；调用链 `teacher-skill-maker, research-copilot, skill-eval-harness`。
- 桌宠工作台：任务八：让桌宠把下一步讲清楚；入口 `/researcher`；调用链 `teacher-skill-maker, ai-ethics-governor`。
- 数据门诊：任务九：先审数据，再选择方法和作图；入口 `/data-audit`；调用链 `skill-eval-harness, ai-ethics-governor, research-copilot`。
- 模型驿站：任务十：用模型前先设置边界和审校角色；入口 `/model-gateway`；调用链 `model-router, ai-ethics-governor, skill-eval-harness`。

## 失败项

- 无。

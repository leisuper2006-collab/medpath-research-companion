# Round11 图谱与文章工作流个性化报告

## 建设结果

- 科研图谱数量：100 种。
- 图谱产品标题：100 个，全部唯一。
- 文章工作流数量：28 类。
- 文章产品标题：28 个，全部唯一。
- 公开来源数量：80 条，来自 cBioPortal 公开元数据。

## 图谱条目新增字段

每一种图谱均已补充：

1. `plot_product_title`：独立产品化标题；
2. `plot_hero_subtitle`：面向科研新手的场景解释；
3. `plot_when_to_use`：什么时候适合用；
4. `plot_data_contract`：必需字段和字段含义；
5. `plot_story_sections`：四段式解释；
6. `public_source_example`：公开来源线索；
7. `example_visual`：教学改绘或合成示例图；
8. `model_gateway_prompt_template`：可复制给模型网关的数据审查与出图提示词。

## 文章工作流新增字段

每一类文章均已补充：

1. `article_product_title`：独立产品化标题；
2. `article_hero_subtitle`：从0开始的写作路线说明；
3. `article_reporting_focus`：该文章类型最核心的报告规范；
4. `article_story_sections`：四段式解释；
5. `public_source_example`：公开来源线索；
6. `example_visual`：教学改绘或合成示例图；
7. `model_gateway_prompt_template`：可复制给模型网关的写作流程提示词。

## 验证

新增测试已经固化这些要求：

- 100 个图谱标题不得重复；
- 28 个文章流程标题不得重复；
- 每个图谱和文章流程必须绑定公开来源链接；
- 每个图谱和文章流程必须绑定 SVG 示例图；
- 每个图谱和文章流程必须有模型网关提示词；
- 每个图谱和文章流程必须有不少于四段的解释结构。

验证命令：

```powershell
pytest apps\api\tests -q
```

当前结果：18 项全部通过。

## 边界声明

公开来源只作为可检索线索；示例图为教学改绘或合成演示，不代表真实研究结果。任何真实论文写作、真实出图和真实统计结论都必须使用用户自己的数据、完成数据审查，并经导师或教师复核。

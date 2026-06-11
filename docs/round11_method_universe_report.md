# Round 11 科研方法宇宙数据底座报告

## 产物

- `data/method_universe.json`：科研方法宇宙主表，当前 320 条。
- `data/gene_perturbation_methods.json`：基因敲除/扰动专题表，当前 24 条。
- 本轮只写入数据与文档文件，未写入真实患者数据，未改动前端代码或 `apps/`。

## 分类与计数

- Meta分析：20 条
- RAG/知识图谱：20 条
- 医学影像AI：20 条
- 单细胞：20 条
- 基因扰动：20 条
- 多组学：20 条
- 机制网络：20 条
- 病理AI：20 条
- 空间组学：20 条
- 绘图：20 条
- 统计建模：20 条
- 药物反应：20 条
- 蛋白组：20 条
- 论文写作：20 条
- 转录组：20 条
- 预后模型：20 条

主表覆盖基因扰动、单细胞、空间组学、转录组、蛋白组、多组学、病理AI、医学影像AI、机制网络、预后模型、药物反应、Meta分析、统计建模、绘图、RAG/知识图谱、论文写作等 16 个分类。每条记录包含 `id`, `zh_name`, `en_name`, `family`, `category`, `problem`, `beginner_explanation`, `when_to_use`, `not_for`, `inputs`, `outputs`, `example_plot_type`, `recommended_tools`, `recommended_readings`, `safety_boundary`。

## 基因扰动专题

专题表覆盖 CRISPR-Cas9 knockout、CRISPRi、CRISPRa、shRNA、siRNA、conditional knockout、Cre-LoxP、base editing、prime editing、pooled screen、arrayed screen、Perturb-seq、CROP-seq、饱和突变扫描、dCas9表观编辑、救援实验、诱导型系统、类器官扰动、体内CRISPR、谱系追踪、MPRA、Morpholino 等方法。每条包含完整解释、输入、输出、实例图类型、推荐工具和新手误区。

## 边界与安全声明

- 所有条目用于科研教育、方法导航、方案草拟和可复现分析设计，不用于直接临床诊断或治疗建议。
- 未写入真实患者可识别信息，也不包含任何伪造疗效、伪造样本或伪造统计结果。
- `recommended_readings` 统一标注为“待核对”，表示这些位置是后续补充真实文献和官方文档的占位，不得在界面或报告中表述为已验证文献。
- 涉及基因编辑、病毒载体、动物实验、类器官、临床影像或病理AI时，必须经过相应伦理、生物安全、数据合规和专家审查。
- 预测模型、病理AI、医学影像AI和药物反应条目不得被表述为临床可用，除非未来补充了真实外部验证、监管状态和人工审核记录。

## 后续核对建议

- 为每个高优先级方法补充真实原始论文、综述和软件官方文档，并记录版本号和访问日期。
- 增加 schema 校验、重复 ID 检查和分类覆盖测试，作为数据发布前的自动化门禁。
- 对病理AI、医学影像AI、药物反应和基因编辑方法增加更细的伦理与适用场景标签。

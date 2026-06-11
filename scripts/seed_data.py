from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SAFETY = "医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置，所有结果须经教师或专家复核。"
CASE_BOUNDARY = "合成教学案例，不是真实患者，不用于临床诊断，需教师复核。"


def write_json(name: str, payload):
    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / name).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


plugins = [
    {
        "id": "teaching",
        "name": "MedPath Teaching Skills Plugin",
        "zh_name": "医学教育核心插件",
        "description": "面向课程设计、病理PBL案例、超微病理导学、病理报告训练反馈与教学评价。",
        "skills": ["medpath-course-designer", "pathology-case-builder", "em-pathology-tutor", "pathology-report-coach", "ai-ethics-governor", "skill-eval-harness"],
        "enabled": True,
        "safety_tags": ["教学训练", "教师复核", "不替代诊断"],
        "starter_prompts": ["为本科三年级病理学课程生成胃腺癌PBL案例", "根据学生报告草稿生成教学反馈"],
    },
    {
        "id": "research",
        "name": "MedPath Research Skills Plugin",
        "zh_name": "科研工作站插件",
        "description": "面向科研训练、RAG/知识图谱、开源工具导航、科研绘图和方法运行。",
        "skills": ["medical-kg-rag-builder", "research-copilot", "innovation-incubator", "open-source-navigator-curator", "plot-studio-runner", "method-runner", "case-simulation-generator"],
        "enabled": False,
        "safety_tags": ["科研训练", "示例数据", "License核对"],
        "starter_prompts": ["检索虚拟扰动相关开源工具", "生成科研图表审计清单"],
    },
    {
        "id": "governance",
        "name": "MedPath Governance & Evaluation Plugin",
        "zh_name": "治理评价插件",
        "description": "面向医学AI伦理治理、质量评价、教师共创、模型路由和私有运行环境。",
        "skills": ["ai-ethics-governor", "skill-eval-harness", "teacher-skill-maker", "model-router", "local-runtime-runner"],
        "enabled": True,
        "safety_tags": ["隐私审计", "红队样例", "D10字段"],
        "starter_prompts": ["审计一段AI输出是否存在临床误导", "生成D10评价字段模板"],
    },
]

skill_defs = [
    ("medpath-course-designer", "智慧课程设计Skill", "生成课程目标、学习活动、评价方式和复核清单。", "teaching"),
    ("pathology-case-builder", "病理PBL案例生成Skill", "生成病理PBL案例、问题链、教师提示和D10字段。", "teaching"),
    ("em-pathology-tutor", "超微病理导学Skill", "生成超微结构导学问题、机制解释和易错点。", "teaching"),
    ("pathology-report-coach", "病理报告训练反馈Skill", "对学生报告草稿进行结构、术语、证据链和安全边界反馈。", "teaching"),
    ("medical-kg-rag-builder", "医学知识图谱与RAG构建Skill", "组织知识点实体、关系、来源字段和检索增强生成材料。", "research"),
    ("research-copilot", "科研训练辅助Skill", "辅助文献综述、课题凝练、实验设计与论文规范训练。", "research"),
    ("innovation-incubator", "学生创新孵化Skill", "服务大创、竞赛、专利培育和成果展示。", "research"),
    ("open-source-navigator-curator", "开源科研工具导航Skill", "整理GitHub工具、License、使用场景和借鉴方式。", "research"),
    ("plot-studio-runner", "科研绘图工作室Skill", "基于示例数据生成科研图、脚本、图注和方法文本。", "research"),
    ("method-runner", "科研方法运行器Skill", "组织虚拟扰动、RAG、单细胞、计算病理和图表审计工作流。", "research"),
    ("case-simulation-generator", "模拟教学案例生成Skill", "生成L1/L2/L3合成教学案例、教师复核和伦理审计字段。", "research"),
    ("ai-ethics-governor", "医学AI伦理治理Skill", "检查隐私、临床误导、虚假引用、学术诚信和模型幻觉。", "governance"),
    ("skill-eval-harness", "AI Skills质量评价Skill", "组织三组对照、rubric、负样本和评价记录。", "governance"),
    ("teacher-skill-maker", "教师共创Skill", "帮助教师创建、审核、迭代和归档教学Skill。", "governance"),
    ("model-router", "模型路由Skill", "统一OpenAI兼容、本地模型和mock provider调用。", "governance"),
    ("local-runtime-runner", "私有运行环境Skill", "说明本地/私有服务器运行、批处理、日志和安全扫描。", "governance"),
]

skills = []
for sid, zh, desc, cat in skill_defs:
    skills.append(
        {
            "id": sid,
            "zh_name": zh,
            "en_name": sid,
            "category": cat,
            "description": desc,
            "skill_md": f"# {zh}\n\n{desc}\n\n## 安全边界\n{SAFETY}\n",
            "demo_input": "请基于合成教学材料完成一个可复核的训练任务。",
            "demo_output": "输出包含结构化结果、待核验来源、风险提示和教师复核清单。",
            "evals": ["医学准确性", "教学/科研适配性", "引用可靠性", "伦理合规性"],
            "safety": SAFETY,
            "review_checklist": ["是否含真实患者隐私", "是否出现临床处置建议", "是否需要引用核验", "是否适合教学使用"],
        }
    )

diseases = [
    ("胃腺癌", "消化系统", "胃黏膜", ["腺体结构紊乱", "核异型", "浸润性生长"], ["CK", "CDX2", "Ki-67"]),
    ("结直肠腺癌", "消化系统", "结直肠黏膜", ["筛状结构", "坏死碎屑", "腺体拥挤"], ["CK20", "CDX2", "SATB2"]),
    ("乳腺浸润性癌", "乳腺", "乳腺导管", ["巢状浸润", "间质反应", "核分裂象"], ["ER", "PR", "HER2"]),
    ("肺腺癌", "呼吸系统", "肺泡上皮", ["腺泡样结构", "贴壁生长", "黏液形成"], ["TTF-1", "Napsin A", "CK7"]),
    ("肾小球病变", "泌尿系统", "肾小球", ["基底膜改变", "足突融合", "系膜增生"], ["IgA", "C3", "PAS"]),
    ("甲状腺乳头状癌", "内分泌系统", "甲状腺滤泡", ["乳头结构", "核沟", "毛玻璃核"], ["TTF-1", "PAX8", "HBME-1"]),
]

cases = []
for i in range(1, 121):
    disease, system, organ, micro, ihc = diseases[(i - 1) % len(diseases)]
    level = "L1" if i <= 80 else ("L2" if i <= 110 else "L3")
    cases.append(
        {
            "id": f"demo-case-{i:03d}",
            "title": f"{disease}合成教学案例{i:03d}",
            "level": level,
            "disease_system": system,
            "organ_system": organ,
            "difficulty": ["基础", "进阶", "挑战"][i % 3],
            "teaching_goal": "训练病理形态学推理、报告表达、PBL讨论和伦理边界识别。",
            "background": f"围绕{disease}设置的合成教学背景，不对应任何真实患者。",
            "gross": f"{organ}相关合成大体描述，用于课堂讨论。",
            "microscopy": micro,
            "ihc": ihc,
            "pbl_questions": ["关键形态学证据是什么？", "哪些线索需要进一步核验？", "如何表达诊断不确定性？"],
            "report_prompt": "请撰写病理报告训练草稿，标注证据链和待核验点。",
            "ethics_audit": ["合成教学案例", "无真实患者隐私", "不用于临床诊断", "需教师复核"],
            "teacher_review": ["检查知识点准确性", "检查难度是否适合学生", "检查是否存在临床误导"],
            "boundary": CASE_BOUNDARY,
        }
    )

comparison_tasks = [
    ("course-design", "智慧课程设计"),
    ("pbl-case", "病理PBL案例"),
    ("em-tutor", "超微病理导学"),
    ("report-feedback", "病理报告反馈"),
    ("research-outline", "科研综述框架"),
    ("ethics-audit", "医学AI伦理审核"),
    ("plot-caption", "科研图表图注"),
    ("skill-builder", "自定义Skill生成"),
]
comparison_demos = [
    {
        "id": tid,
        "title": title,
        "task_input": f"请完成{title}任务。",
        "no_ai": "传统方式依赖人工整理，流程可控但耗时较长，复核记录需要手动维护。",
        "normal_prompt": "普通提示词可生成文本草稿，但任务边界、引用核验和伦理审计不稳定。",
        "medpath_skill": "MedPath Skill输出结构化结果、来源核验、风险提示、教师复核清单和D10评价字段。",
        "note": "示例对比，不代表真实教学效果；真实成效需项目期实测。",
    }
    for tid, title in comparison_tasks
]

open_source_seed = [
    "GEARS", "scGen", "CPA", "chemCPA", "scGPT", "scTenifoldKnk", "Scanpy", "Seurat", "AnnData", "Squidpy",
    "CellChat", "Giotto", "OpenSlide", "QuPath", "TIAToolbox", "HistomicsTK", "CellProfiler", "MONAI", "scikit-image", "OpenCV",
    "LangChain", "LlamaIndex", "Haystack", "Qdrant", "Milvus", "Neo4j", "NetworkX", "Zotero", "Obsidian", "JabRef",
    "PaperQA", "Pandas", "Polars", "DuckDB", "NumPy", "SciPy", "scikit-learn", "PyTorch", "TensorFlow", "XGBoost",
    "LightGBM", "statsmodels", "PyMC", "Stan", "lifelines", "R survival", "ggplot2", "ComplexHeatmap", "pheatmap", "seaborn",
    "matplotlib", "plotly", "Altair", "Bokeh", "Graphviz", "Cytoscape", "GSEApy", "clusterProfiler", "DESeq2", "edgeR",
    "Snakemake", "Nextflow", "Airflow", "DVC", "MLflow", "Weights & Biases", "Docker", "Podman", "Apptainer", "Conda",
    "Jupyter", "VS Code", "Streamlit", "Gradio", "FastAPI", "Flask", "Next.js", "Vite", "React", "Tailwind CSS",
]

open_source = []
categories = ["虚拟扰动", "单细胞", "计算病理", "RAG/知识图谱", "科研绘图", "统计建模", "服务器部署", "科研写作"]
for idx, name in enumerate(open_source_seed):
    cat = "虚拟扰动" if name in {"GEARS", "scGen", "CPA", "chemCPA", "scGPT", "scTenifoldKnk"} else categories[idx % len(categories)]
    open_source.append(
        {
            "name": name,
            "repo_url": f"https://github.com/search?q={name}",
            "official_site": "待人工核对",
            "category": cat,
            "short_description": f"{name}开源工具导航条目。",
            "license": "待人工核对，以原仓库为准",
            "use_case": "科研训练、方法学习或工作流设计",
            "can_run_in_platform": "planned" if idx % 5 == 0 else "reference_only",
            "copied_code": False,
            "risk_notes": "需核对License，不复制未授权代码，不作为本项目成果。",
        }
    )

plot_data = {
    "volcano": [{"gene": f"G{i}", "logFC": (i - 10) / 3, "p": 0.01 + i * 0.002} for i in range(1, 21)],
    "heatmap": [[(r + c) % 9 for c in range(8)] for r in range(8)],
    "boxplot": [[i, 5 + (i % 4), 6 + (i % 3)] for i in range(1, 8)],
    "violin": [[i, 4 + (i % 5), 5 + (i % 2)] for i in range(1, 8)],
    "scatter": [{"x": i, "y": (i * i) % 17} for i in range(1, 25)],
}

method_cards = []
base_methods = [
    ("virtual-perturbation", "虚拟扰动工作流", ["GEARS", "scGen", "CPA/chemCPA", "scGPT perturbation", "scTenifoldKnk"]),
    ("rag-index-build", "RAG知识库构建", ["文档切分", "嵌入", "索引", "检索测试", "引用核验"]),
    ("single-cell-basic", "单细胞基础分析", ["QC", "Normalization", "Clustering", "Marker genes", "UMAP"]),
    ("pathology-preprocess", "计算病理图像预处理", ["Tile", "Stain normalization", "Feature extraction"]),
    ("figure-audit", "论文图表审计", ["图题", "图注", "source data", "统计说明", "可复现性"]),
]
for idx in range(20):
    base = base_methods[idx % len(base_methods)]
    method_cards.append(
        {
            "id": base[0] if idx < 5 else f"{base[0]}-{idx}",
            "name": base[1],
            "methods": base[2],
            "problem": "帮助用户理解科研方法适用场景与输入输出。",
            "input_data": "示例数据或用户自有数据。",
            "output_data": "方法卡片、运行说明、风险提示和demo报告。",
            "github": "https://github.com/search?q=" + base[0],
            "direct_run": "mock/demo only",
            "risk": "仅科研探索，不代表湿实验验证。",
        }
    )

providers = []
provider_names = ["OpenAI", "DeepSeek", "Qwen / DashScope", "Anthropic", "Gemini", "Zhipu", "Kimi", "Ollama", "vLLM", "LiteLLM", "CSU_CHAT", "Custom OpenAI-compatible"]
for name in provider_names:
    providers.append(
        {
            "id": name.lower().replace(" / ", "-").replace(" ", "-"),
            "name": name,
            "official_site": "待人工核对",
            "base_url_example": "https://api.example.com/v1",
            "model_example": "example-model",
            "env_example": f"{name.upper().split()[0].replace('/', '_')}_API_KEY=",
            "supports_openai_compatible": True,
            "supports_local": name in {"Ollama", "vLLM", "LiteLLM"},
            "privacy_note": "不保存Key，只显示configured true/false；无Key默认mock。",
        }
    )

governance_rules = []
risk_types = ["隐私风险", "模型幻觉", "临床误导", "伪造引用", "学术诚信"]
for idx in range(1, 21):
    risk = risk_types[(idx - 1) % len(risk_types)]
    governance_rules.append(
        {
            "id": f"rule-{idx:02d}",
            "risk_type": risk,
            "trigger": f"{risk}触发规则示例{idx}",
            "action": "阻断、标注、要求教师复核或转为教学边界说明。",
            "severity": ["low", "medium", "high"][idx % 3],
        }
    )

rubrics = {
    "simulation_case": ["医学逻辑一致性", "病理形态合理性", "PBL问题链", "报告训练价值", "伦理边界清晰"],
    "comparison": ["结构完整性", "边界清晰度", "复核便利性", "教学适配性"],
    "plot": ["图形清晰", "图注完整", "source data可追溯", "方法描述可复核"],
}

write_json("plugins.json", plugins)
write_json("skills.json", skills)
write_json("synthetic_cases.json", cases)
write_json("comparison_demos.json", comparison_demos)
write_json("open_source_catalog.json", open_source)
write_json("plot_demo_data.json", plot_data)
write_json("method_cards.json", method_cards)
write_json("providers.json", providers)
write_json("governance_rules.json", governance_rules)
write_json("rubrics.json", rubrics)

print("seeded", len(plugins), len(skills), len(cases), len(open_source))

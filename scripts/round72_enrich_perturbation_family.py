import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
METHODS_PATH = ROOT / "data" / "method_universe.json"
REPORT_PATH = ROOT / "docs" / "round72_perturbation_family_enrichment_report.md"


PROFILES = {
    "method-001": {
        "frame": "单基因完全敲除是否适合你的问题",
        "scene": "你已经怀疑某个候选基因驱动肿瘤细胞表型，但还没有证明“没有它会怎样”。",
        "decision": "先判断研究问题是否需要不可逆扰动，而不是直接进入gRNA设计。",
        "visual": "单基因敲除决策树与验证路径示例",
        "source": "CRISPR/Cas9功能扰动研究与公开肿瘤基因组数据的教学重绘线索",
        "danger": "把敲除后的表型直接写成机制结论，忽略救援实验和脱靶验证。",
    },
    "method-002": {
        "frame": "从一个候选基因走向可复核的敲除设计",
        "scene": "你已经确定靶基因，但不知道如何安排gRNA、克隆、对照和救援实验。",
        "decision": "把进阶设计拆成靶点选择、编辑效率、克隆验证和功能读出四个证据层。",
        "visual": "CRISPR敲除进阶设计泳道图",
        "source": "CRISPR实验设计指南与公开功能基因组学研究的教学重绘线索",
        "danger": "只报告一个gRNA结果，缺少多gRNA一致性和rescue验证。",
    },
    "method-003": {
        "frame": "敲除实验的质量控制不是最后补一句",
        "scene": "实验已经做出表型，但导师追问编辑效率、克隆污染和脱靶风险是否可信。",
        "decision": "把QC放在实验路线中段：测序、蛋白验证、表型读出和批次记录同步检查。",
        "visual": "敲除质量控制证据矩阵",
        "source": "基因编辑质控实践与公开CRISPR screen分析教程的教学重绘线索",
        "danger": "用单一qPCR或单张WB图替代完整的编辑与表型证据链。",
    },
    "method-004": {
        "frame": "敲除结果要解释为证据链，不是单句因果",
        "scene": "你看到敲除组增殖下降或迁移变化，但不确定该写成通路、表型还是机制。",
        "decision": "结果解读要同时看效应方向、重复一致性、替代解释和救援实验。",
        "visual": "敲除结果从表型到机制的解释阶梯",
        "source": "肿瘤功能验证论文常见结果结构的教学重绘线索",
        "danger": "把细胞系中的现象直接外推到患者预后或临床治疗。",
    },
    "method-005": {
        "frame": "敲除实验最常见的五个陷阱",
        "scene": "你准备开题或组会汇报，希望提前知道哪些设计会被老师一眼质疑。",
        "decision": "从脱靶、补偿、克隆选择、过度外推和统计不足五个角度做预审。",
        "visual": "基因敲除避坑雷达与补救路线",
        "source": "CRISPR方法学论文与实验室复核经验的教学化整理",
        "danger": "把失败补救写成“重复实验即可”，没有说明具体补救路径。",
    },
    "method-006": {
        "frame": "敲低适合回答“降低表达会怎样”",
        "scene": "你的目标基因可能是必需基因，完全敲除会导致细胞死亡或强补偿。",
        "decision": "先判断是siRNA、shRNA还是CRISPRi，重点看瞬时、稳定和可逆性。",
        "visual": "敲低路线选择图：siRNA、shRNA与CRISPRi",
        "source": "RNA干扰与CRISPRi公开方法教程的教学重绘线索",
        "danger": "把敲低结果当成完全敲除结果解释，忽略残余表达。",
    },
    "method-007": {
        "frame": "敲低进阶设计要控制剂量和时间",
        "scene": "你已经有两个siRNA候选，但不同时间点表型不一致。",
        "decision": "用剂量、时间、转染效率和非靶向对照构建可解释窗口。",
        "visual": "敲低剂量-时间设计热图",
        "source": "RNAi实验设计与表达动态分析的教学重绘线索",
        "danger": "只选择最显著时间点作图，忽略时间窗偏倚。",
    },
    "method-008": {
        "frame": "敲低QC关注残余表达和非特异效应",
        "scene": "表型出现了，但靶基因只下降了一半，且细胞状态明显变差。",
        "decision": "同时核对mRNA、蛋白、细胞毒性、转染试剂影响和多序列一致性。",
        "visual": "敲低质量控制四联图",
        "source": "RNAi质控与多序列验证实践的教学重绘线索",
        "danger": "用单条siRNA的强表型支持机制结论。",
    },
    "method-009": {
        "frame": "敲低结果更适合写成表达依赖性证据",
        "scene": "敲低后通路活性下降，但你不知道它能支撑哪一级结论。",
        "decision": "把结果限定在表达依赖、表型关联和可逆验证，不越界到遗传因果。",
        "visual": "敲低结果解释边界图",
        "source": "RNAi功能研究和通路验证论文的教学重绘线索",
        "danger": "忽略残余表达导致的低估或补偿解释。",
    },
    "method-010": {
        "frame": "敲低误区集中在短期、剂量和脱靶",
        "scene": "你想用敲低快速验证一个想法，但担心结果不够稳。",
        "decision": "把快速验证定位为初筛证据，并设计后续敲除、救援或药物验证。",
        "visual": "敲低误区与升级验证路径",
        "source": "RNA干扰局限性综述与实验教学案例的整理",
        "danger": "把短期敲低结果当作完整机制链的终点。",
    },
    "method-011": {
        "frame": "CRISPR筛选用于从很多基因里找候选",
        "scene": "你不知道哪个基因重要，想从全基因组或通路文库里做发现。",
        "decision": "先明确筛选压力、文库覆盖度、读出方式和后续验证路线。",
        "visual": "CRISPR pooled screen总体流程图",
        "source": "Seurat Mixscape与CRISPR pooled screen公开教程的本地整理",
        "danger": "把筛选命中基因直接写成机制靶点，缺少二次验证。",
    },
    "method-012": {
        "frame": "筛选设计核心是覆盖度和选择压力",
        "scene": "你准备做药物敏感性筛选，却不确定MOI、覆盖度和时间点怎么定。",
        "decision": "将文库质量、感染条件、选择压力、测序深度和统计模型连成一张设计表。",
        "visual": "CRISPR筛选参数仪表盘",
        "source": "CRISPR screen设计指南与公开药物筛选案例的教学重绘线索",
        "danger": "忽略文库瓶颈导致假阴性和假阳性。",
    },
    "method-013": {
        "frame": "筛选QC先看文库是否还活着",
        "scene": "测序结果出来了，但gRNA分布、重复相关性和非靶向对照不稳定。",
        "decision": "用文库覆盖、gRNA分布、重复一致性和阳性对照富集判断是否可分析。",
        "visual": "CRISPR筛选QC四格证据图",
        "source": "MAGeCK/Mixscape类筛选QC思路的教学重绘线索",
        "danger": "在QC失败时继续解释排名前列基因。",
    },
    "method-014": {
        "frame": "筛选结果解读要从命中到验证",
        "scene": "你得到一个rank list，但不知道哪些基因值得后续实验。",
        "decision": "结合效应大小、统计显著性、通路聚合、重复一致性和可验证性筛候选。",
        "visual": "CRISPR筛选命中优先级漏斗",
        "source": "功能基因组学筛选论文结果组织方式的教学重绘线索",
        "danger": "只按p值排序，不看生物学合理性和可实验性。",
    },
    "method-015": {
        "frame": "筛选误区是把发现当验证",
        "scene": "组会里你想展示筛选命中，但还没有独立验证。",
        "decision": "把筛选定位为候选发现，并列出单基因验证、救援实验和机制测试。",
        "visual": "CRISPR筛选发现-验证分界图",
        "source": "CRISPR screen方法学论文常见审稿问题的教学整理",
        "danger": "把筛选富集基因直接写入摘要结论。",
    },
    "method-016": {
        "frame": "过表达用于测试“增加它是否足够”",
        "scene": "你的候选基因低表达，想知道上调是否能推动表型。",
        "decision": "先区分生理表达恢复、强制过表达和构建体标签带来的解释差异。",
        "visual": "过表达实验适用性判断图",
        "source": "肿瘤功能验证论文中过表达路线的教学重绘线索",
        "danger": "把非生理高表达造成的表型当作自然机制。",
    },
    "method-017": {
        "frame": "过表达进阶设计要处理剂量和定位",
        "scene": "转染成功了，但蛋白定位、表达量和下游表型不匹配。",
        "decision": "同步设计表达剂量、定位验证、空载体对照和功能读出。",
        "visual": "过表达剂量-定位-表型三层图",
        "source": "表达载体实验设计与蛋白定位验证的教学重绘线索",
        "danger": "忽略标签、启动子和细胞系背景对结果的影响。",
    },
    "method-018": {
        "frame": "过表达QC重点是表达是否可信",
        "scene": "WB显示条带增强，但细胞状态变化明显，难以判断是否为真实功能。",
        "decision": "检查表达水平、定位、细胞毒性、空载体效应和重复一致性。",
        "visual": "过表达QC检查清单图",
        "source": "表达构建体验证和细胞表型实验的教学整理",
        "danger": "只用荧光强度证明功能效应。",
    },
    "method-019": {
        "frame": "过表达结果需要和内源表达对照",
        "scene": "过表达提高了迁移能力，但不知道是否符合患者样本或内源水平。",
        "decision": "把结果解释限定在模型系统内，并用内源表达、救援和临床数据作旁证。",
        "visual": "过表达结果外推边界图",
        "source": "功能验证论文结果解释边界的教学重绘线索",
        "danger": "把体外过表达直接写成临床预后因子。",
    },
    "method-020": {
        "frame": "过表达误区是强信号掩盖弱证据",
        "scene": "图很好看，但导师担心表达量远超生理范围。",
        "decision": "用表达梯度、内源水平、空载体和救援实验约束解释。",
        "visual": "过表达常见误区与补救路线图",
        "source": "过表达实验审稿常见问题的教学整理",
        "danger": "用强制表达制造不可重复的极端表型。",
    },
    "method-021": {
        "frame": "药物扰动先回答剂量是否合理",
        "scene": "你想用抑制剂验证通路，但不知道浓度和时间是否会造成非特异毒性。",
        "decision": "先建立剂量-时间-活性窗口，再进入机制解释。",
        "visual": "药物扰动剂量时间窗口图",
        "source": "药物敏感性实验和剂量反应分析的教学重绘线索",
        "danger": "用高毒性剂量解释为特异通路效应。",
    },
    "method-022": {
        "frame": "药物扰动进阶设计要加入替代药物和遗传验证",
        "scene": "一个抑制剂有效，但你不知道是不是靶点特异作用。",
        "decision": "加入第二抑制剂、遗传敲低/敲除和救援证据，形成交叉验证。",
        "visual": "药物-遗传交叉验证路线图",
        "source": "靶向药物机制验证论文的教学重绘线索",
        "danger": "忽略off-target导致机制过度解释。",
    },
    "method-023": {
        "frame": "药物扰动QC要看活性、毒性和批次",
        "scene": "同一药物两批实验差异很大，需要判断是生物学变化还是实验噪声。",
        "decision": "同步记录药物批次、溶剂、细胞状态、靶点活性和检测窗口。",
        "visual": "药物扰动QC证据表",
        "source": "药物实验可重复性与剂量反应QC的教学整理",
        "danger": "把批次差异误判为耐药或敏感性差异。",
    },
    "method-024": {
        "frame": "药物扰动结果解读要区分作用和机制",
        "scene": "药物处理后细胞死亡增加，但机制通路证据还不完整。",
        "decision": "把结果分为效应观察、靶点参与、通路机制和转化假说四级。",
        "visual": "药物扰动结果四级解释图",
        "source": "药物机制研究与教学案例的本地重绘线索",
        "danger": "把细胞毒性结果直接写成临床疗效预测。",
    },
}


def update_method(item, profile):
    name = item["name"]
    item["hero_title"] = f"{name}：{profile['frame']}"
    item["hero_subtitle"] = (
        f"{profile['scene']} 本页先帮新手判断是否适合使用{name}，再把输入材料、"
        f"对照设计、示例图和导师复核问题拆开说明。"
    )
    item["what_it_solves"] = (
        f"{name}解决的不是“立刻得到漂亮结果”，而是：{profile['decision']} "
        f"它适合在基础医学、肿瘤学或病理机制训练中，把研究假设转化为可复核的扰动证据链。"
    )
    item["detail_novice_intro"] = (
        f"科研新手遇到{name}时，最容易先问“怎么做”，但真正要先问的是“为什么非它不可”。"
        f"{profile['scene']} 因此本页把路线拆成问题判断、材料准备、质量控制、结果解释和风险边界五层。"
    )
    item["detail_scenario_story"] = (
        f"设想你要在组会上解释一个候选靶点。你不能只说“我准备做{name}”，"
        f"而要说明它如何回答当前假设、需要哪些对照、哪些结果只能作为初步证据。"
        f"本页的示例图用于训练这种表达方式。"
    )
    item["detail_scroll_panels"] = [
        {
            "title": "先判断问题是否匹配",
            "body": profile["decision"],
            "action": "把自己的课题写成一句可检验假设。",
        },
        {
            "title": "再列出材料和对照",
            "body": f"{name}需要同时说明模型系统、对照组、关键读出、质量控制和伦理边界。",
            "action": "补齐输入字段，不齐就不要进入结果解释。",
        },
        {
            "title": "示例图只训练读法",
            "body": f"示例图“{profile['visual']}”为本地教学重绘，不复制期刊原图；{profile['source']}。",
            "action": "正式研究必须替换为自己的合规数据和脚本。",
        },
        {
            "title": "最后写清楚不能说什么",
            "body": profile["danger"],
            "action": "把越界表述移到待验证假说或导师复核清单。",
        },
    ]
    item["apple_style_sections"] = item["detail_scroll_panels"]
    item["detail_source_sentence"] = (
        f"{name}的示例视觉“{profile['visual']}”采用本地教学化重绘，来源线索为{profile['source']}；"
        "页面只展示方法结构、字段关系和复核边界，不复制受版权保护的论文原图，也不代表真实实验结果。"
    )
    item["example_visual"] = {
        "title": profile["visual"],
        "url": item.get("example_visual", {}).get("url", f"/outputs/round11_method_plots/{item['id']}.svg"),
        "source_note": f"本地教学示例图；{profile['source']}。",
        "reuse_boundary": "用于学习方法结构、数据字段和复核边界；正式科研必须替换为用户自有或合规公开数据，并经导师/教师复核。",
    }
    item["detail_user_prompt_examples"] = [
        f"我的课题是否适合做{name}？请先问我必须补齐的材料，不要直接生成结论。",
        f"请按{name}的路线，帮我检查对照组、质量控制和可能越界的解释。",
        f"我只有初步想法，请用{name}生成一份组会讨论清单和导师复核问题。",
    ]
    item["demand_window_prompts"] = item["detail_user_prompt_examples"]
    item["mentor_review_questions"] = [
        f"当前研究问题为什么需要{name}，而不是更简单的描述、相关性或文献分析？",
        "输入材料、对照设计和质量控制是否已经足以支撑下一步解释？",
        f"示例图中的读法能否迁移到你的真实数据，哪些字段仍缺失？",
        f"是否存在{profile['danger']}这一类越界风险？",
        "哪些结论必须等真实实验、导师复核或专家评审后才能写入论文？",
    ]
    item["model_gateway_prompt_template"] = (
        f"我想学习{name}。请先判断我的研究问题是否适合，随后列出材料清单、"
        f"对照设计、质量控制、推荐示例图（{profile['visual']}）、常见错误和导师复核问题；"
        "不得编造真实实验结果。"
    )
    item["unique_detail_status"] = "round72-perturbation-family-handwritten"
    return item


def main():
    methods = json.loads(METHODS_PATH.read_text(encoding="utf-8"))
    changed = []
    for item in methods:
        profile = PROFILES.get(item["id"])
        if profile:
            update_method(item, profile)
            changed.append((item["id"], item["name"], profile["frame"]))
    METHODS_PATH.write_text(json.dumps(methods, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        "# Round72 Perturbation Family Enrichment Report",
        "",
        "本轮优先修复高相似度最集中的实验扰动家族，使基因敲除、基因敲低、CRISPR筛选、过表达和药物扰动拥有差异化产品详情页叙事。",
        "",
        "## Updated methods",
    ]
    for method_id, name, frame in changed:
        lines.append(f"- `{method_id}` {name}: {frame}")
    lines.extend([
        "",
        "## Boundary",
        "",
        "所有示例图均为本地教学化重绘或合成教学图，不复制期刊原图，不代表真实实验结果；正式科研必须替换为用户自有或合规公开数据，并经导师/教师复核。",
    ])
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print({"updated": len(changed), "report": str(REPORT_PATH)})


if __name__ == "__main__":
    main()

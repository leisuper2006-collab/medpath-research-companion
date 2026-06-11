from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLOTS = ROOT / "data" / "plot_gallery_taxonomy.json"
REPORT = ROOT / "docs" / "round32_plot_copy_deduplicate_report.md"


FOCUS_BY_TOKEN = {
    "volcano": ("同时扫视效应方向、效应大小和校正显著性", "不要把右上角/左上角的点直接说成机制靶点，先回到差异分析表和多重检验。"),
    "ma_": ("把平均丰度和差异幅度放到同一平面", "低丰度区域最容易被噪声带偏，不能只挑极端点讲故事。"),
    "mean_difference": ("把组间均值差和置信区间讲清楚", "重点不是星号，而是效应量方向、区间宽度和样本来源。"),
    "effect_size": ("让效应量成为主角，而不是只展示p值", "适合导师追问“差异到底有多大”时使用。"),
    "pvalue": ("审查p值分布是否异常堆积或过度平坦", "它是质量控制图，不是结果炫耀图。"),
    "qq": ("检查统计量是否偏离理论分布", "偏离可能来自真实信号，也可能来自批次、群体结构或模型假设问题。"),
    "bland": ("比较两种测量方式的一致性和系统偏倚", "不适合证明两种方法完全等价，只能展示差异分布。"),
    "paired": ("追踪同一对象前后或配对条件的方向变化", "线条交叉很多时，应先解释配对结构和缺失样本。"),
    "raincloud": ("同时展示分布形态、个体点和组间概览", "适合样本量不大但需要看离群点的教学场景。"),
    "waterfall": ("按个体响应幅度排序查看异质性", "不能把排序条形直接解释为疗效结论。"),
    "manhattan": ("沿基因组位置查看成片或孤立的关联信号", "必须说明基因组坐标、显著性阈值和群体结构控制。"),
    "heatmap": ("把多样本多特征的模式压缩成颜色矩阵", "聚类只能提示模式，不能自动替代分型结论。"),
    "boxplot": ("先看中位数、四分位和离群点", "箱线图不会自动说明分布形态，必要时配合原始点。"),
    "violin": ("用密度形状观察表达或评分分布", "小样本时小提琴形状容易显得过度平滑。"),
    "correlation": ("查看变量之间的相关方向和强度", "相关不等于因果，必须说明相关方法和样本范围。"),
    "umap": ("展示细胞或样本在低维空间的邻近结构", "UMAP距离不是严格生物距离，不能据此过度解释发育轨迹。"),
    "tsne": ("观察局部邻域聚集而非全局距离", "不同随机种子会影响形态，正式图需记录参数。"),
    "roc": ("比较阈值变化下的敏感度和特异度", "AUC不能代替校准、外部验证和临床净获益。"),
    "pr_": ("在类别不平衡时查看阳性预测表现", "阳性率会影响曲线解读，必须报告基线比例。"),
    "calibration": ("检查预测概率和真实发生率是否对齐", "模型看似准确也可能校准很差。"),
    "decision": ("评估不同阈值下的净获益", "它服务决策讨论，不等于已经进入临床应用。"),
    "forest": ("把多个研究或亚组的效应量放到同一标尺", "异质性、权重和模型选择必须一起报告。"),
    "funnel": ("观察小样本效应和发表偏倚线索", "漏斗不对称只是提示，不能单独定罪。"),
    "sankey": ("展示来源、状态或流程之间的流量转移", "宽度代表数量或比例，必须写清分母。"),
    "tile": ("检查病理切块层面的评分、区域或质量差异", "不得含真实患者标识，热力图不等于诊断依据。"),
    "wsi": ("从全切片到区域切块审查模型注意区域", "只能用于教学或模型解释，不能替代病理诊断。"),
    "survival": ("显示随访时间上的事件累积差异", "删失、随访起点和比例风险假设必须交代。"),
    "kaplan": ("按组展示生存曲线和删失信息", "曲线分离不代表已证明因果。"),
    "nomogram": ("把多个变量的预测贡献转成评分尺", "需要外部验证和校准，不是临床处方。"),
    "network": ("展示实体、通路或细胞之间的连接关系", "边的来源和阈值比图形好不好看更重要。"),
    "chord": ("把类别间连接关系压到环形结构中", "连接太密时应减少类别或改用矩阵。"),
}


OPENERS = [
    "新手打开这张图时，第一眼应先看",
    "这类图最有价值的地方，是帮助你确认",
    "如果导师问“证据在哪里”，这张图主要回答",
    "在正式作图前，先用这张图检查",
    "它适合放在方法探索阶段，用来判断",
    "当结果需要从表格变成可讨论证据时，先确认",
    "这张图不是装饰图，它负责说明",
]

PHASES = [
    "课题组第一次组会",
    "导师要求补方法图的下午",
    "整理补充材料前",
    "把表格交给模型之前",
    "准备论文图注时",
    "给低年级同学讲方法时",
    "做预答辩质询清单时",
    "复核公开数据库下载结果时",
    "比较两个分析方案时",
    "把代码结果转成教学材料时",
]

VISUAL_GRAMMARS = [
    "点的位置、颜色和阈值线",
    "横纵坐标的尺度与单位",
    "线段方向、区间宽度和离群点",
    "颜色块的聚类顺序与分组注释",
    "曲线形状、阈值和基线水平",
    "节点大小、边权重和筛选阈值",
    "空间坐标、组织区域和标记层",
    "条带宽度、流向和分母定义",
    "时间轴、删失点和风险表",
    "样本点、密度形态和分布尾部",
]

NEGATIVE_TASKS = [
    "不能用它直接证明因果机制",
    "不能把示例图当作真实课题结论",
    "不能跳过原始字段和清洗脚本",
    "不能替代导师或统计老师复核",
    "不能隐藏缺失值、批次或阈值来源",
    "不能只截取最漂亮的一角讲结果",
    "不能把教学合成数据写成真实数据",
    "不能省略分组、样本量和校正方法",
    "不能把模型分数等同临床诊断",
    "不能把公开来源线索写成已验证发现",
]


def pick_focus(plot_id: str) -> tuple[str, str]:
    lowered = plot_id.lower()
    for token, focus in FOCUS_BY_TOKEN.items():
        if token in lowered:
            return focus
    return ("字段、分组和输出结论是否能互相支撑", "如果字段不齐或图注说不清，先回到数据审查室。")


def fields_label(item: dict) -> str:
    cols = item.get("required_columns") or []
    if not cols:
        cols = [c.get("field") for c in item.get("plot_data_contract", []) if c.get("field")]
    cols = [str(c) for c in cols if c][:4]
    return "、".join(cols) if cols else "核心字段"


def main() -> int:
    data = json.loads(PLOTS.read_text(encoding="utf-8"))
    changed = []
    for idx, item in enumerate(data):
        pid = item.get("id", f"plot-{idx}")
        name = item.get("zh_name") or item.get("title") or pid
        category = item.get("category") or "科研图形"
        question = item.get("question_answered") or item.get("answers_question") or "把研究问题转成可读证据"
        fields = fields_label(item)
        focus, warning = pick_focus(pid)
        opener = OPENERS[idx % len(OPENERS)]
        old_when = item.get("plot_when_to_use", "")
        old_hero = item.get("plot_hero_subtitle", "")
        phase = PHASES[idx % len(PHASES)]
        grammar = VISUAL_GRAMMARS[(idx * 3) % len(VISUAL_GRAMMARS)]
        negative = NEGATIVE_TASKS[(idx * 5 + 2) % len(NEGATIVE_TASKS)]
        item["plot_when_to_use"] = (
            f"{phase}最适合拿出{name}：它要让新手先盯住{grammar}，再判断“{focus}”。"
            f"如果你的研究问题是“{question}”，请先把{fields}整理成可追溯字段表，并在图注里写清来源、分组和阈值。"
            f"{warning}{negative}；正式使用前还要保存代码、source data和人工复核记录。"
        )
        item["plot_hero_subtitle"] = (
            f"{name}不是万能科研图，而是{category}任务中的一个读图工具。"
            f"本页按“看{grammar}—核对{fields}—写边界图注”的顺序教学，适合用来训练“{focus}”。"
            f"页面中的示例只展示图形语法和字段关系；用户接入自己的数据后，仍需经过数据审查、模型提示审查和导师复核。"
        )
        item["detail_novice_intro"] = (
            f"第一次使用{name}时，不要先追求配色。先问：这张图是不是在{phase}帮助回答“{question}”？"
            f"然后逐项核对{fields}、{grammar}和常见误区“{item.get('common_mistakes') or warning}”。"
            f"如果任一字段来自不同来源、分组定义说不清，或图注越过“{focus}”的证据边界，就应退回数据审查室。"
        )
        for contract in item.get("plot_data_contract", []) or []:
            field = contract.get("field", "字段")
            contract["meaning"] = f"{name}中的{field}：用于支撑“{focus}”这一读图动作。"
        changed.append((pid, name, old_when != item["plot_when_to_use"] or old_hero != item["plot_hero_subtitle"]))
    PLOTS.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        "# Round32 图谱文案去模板化报告",
        "",
        f"- 修订图形数量：{len(changed)}",
        "- 修订字段：`plot_when_to_use`、`plot_hero_subtitle`、`plot_data_contract[].meaning`。",
        "- 原则：每张图围绕不同读图动作、字段核对和误区边界写说明；不改变示例图，不伪造真实数据。",
        "",
        "## 样例",
        "",
    ]
    for pid, name, _ in changed[:12]:
        item = next(x for x in data if x.get("id") == pid)
        lines.append(f"### {name} ({pid})")
        lines.append(item["plot_when_to_use"])
        lines.append("")
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Updated {len(changed)} plot records")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

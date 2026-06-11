import json
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
METHODS_PATH = ROOT / "data" / "method_universe.json"
REPORT_PATH = ROOT / "docs" / "round27_method_duplicate_text_fix_report.md"


CATEGORY_LENSES = {
    "病理与影像": "把图像、形态学描述和教师判读标准先对齐，避免把算法分数误当成病理结论",
    "实验验证": "先核对实验材料、对照组和重复数，再决定是否进入正式实验设计",
    "科研写作与伦理": "优先核验来源、引用和伦理边界，避免把未证实内容写成论文结论",
    "AI辅助科研": "把模型输入、输出格式和幻觉审计拆开记录，确保每一步可回看、可复核",
    "组学分析": "先整理矩阵、分组和批次信息，再选择统计路线和可视化证据",
    "临床研究": "先区分教学演示、公开数据和真实临床资料，所有真实数据必须走伦理与脱敏流程",
}


def first_text(items, fallback):
    if not items:
        return fallback
    for item in items:
        if isinstance(item, str) and item.strip():
            return item.strip()
    return fallback


def recommended_plot(outputs):
    for item in outputs or []:
        if isinstance(item, str) and "推荐图表" in item:
            return item.replace("推荐图表：", "").strip()
    return "证据图"


def build_card(method):
    name = method.get("name", "该方法")
    category = method.get("category", "科研方法")
    lens = CATEGORY_LENSES.get(category, "先判断问题、材料和复核责任是否匹配，再进入正式分析")
    input_anchor = first_text(method.get("inputs"), "研究问题")
    output_anchor = first_text(method.get("outputs"), "可复核输出")
    plot = recommended_plot(method.get("outputs"))
    return (
        f"{name}用于{category}中的具体任务：以“{input_anchor}”为起点，"
        f"形成“{output_anchor}”。{lens}。适合新手先做一页判断卡，再决定是否使用{plot}呈现证据。"
    )


def build_intro(method):
    name = method.get("name", "该方法")
    category = method.get("category", "科研方法")
    lens = CATEGORY_LENSES.get(category, "先判断问题、材料和复核责任是否匹配，再进入正式分析")
    input_anchor = first_text(method.get("inputs"), "研究问题")
    output_anchor = first_text(method.get("outputs"), "可复核输出")
    secondary_input = first_text((method.get("inputs") or [])[1:], "现有材料")
    plot = recommended_plot(method.get("outputs"))
    return (
        f"进入{name}页面时，先不要急着套用软件命令或模型提示。"
        f"在{category}场景下，第一步是确认“{input_anchor}”是否真实存在，"
        f"第二步是检查“{secondary_input}”是否足以支撑判断，第三步才是产出“{output_anchor}”。"
        f"{lens}。本页会把方法拆成适用判断、材料准备、执行路线、质量控制和导师复核五个动作，"
        f"并提示何时用{plot}作为示例图或结果图。"
    )


def duplicate_ids(data, field):
    seen = defaultdict(list)
    for method in data:
        value = method.get(field)
        if isinstance(value, dict):
            value = json.dumps(value, ensure_ascii=False, sort_keys=True)
        if value:
            seen[value].append(method["id"])
    return {text: ids for text, ids in seen.items() if len(ids) > 1}


def main():
    data = json.loads(METHODS_PATH.read_text(encoding="utf-8"))
    before = {
        "card_microcopy": duplicate_ids(data, "card_microcopy"),
        "detail_novice_intro": duplicate_ids(data, "detail_novice_intro"),
    }

    changed = []
    duplicate_method_ids = set()
    for dupes in before.values():
        for ids in dupes.values():
            duplicate_method_ids.update(ids)

    for method in data:
        if method["id"] in duplicate_method_ids:
            old_card = method.get("card_microcopy", "")
            old_intro = method.get("detail_novice_intro", "")
            method["card_microcopy"] = build_card(method)
            method["detail_novice_intro"] = build_intro(method)
            changed.append((method["id"], method.get("name"), method.get("category"), old_card[:60], method["card_microcopy"][:90]))

    METHODS_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    after = {
        "card_microcopy": duplicate_ids(data, "card_microcopy"),
        "detail_novice_intro": duplicate_ids(data, "detail_novice_intro"),
    }
    lines = [
        "# Round27 方法文案重复修复报告",
        "",
        f"- 修复方法数：{len(changed)}",
        f"- 修复前卡片文案重复组：{len(before['card_microcopy'])}",
        f"- 修复前详情导语重复组：{len(before['detail_novice_intro'])}",
        f"- 修复后卡片文案重复组：{len(after['card_microcopy'])}",
        f"- 修复后详情导语重复组：{len(after['detail_novice_intro'])}",
        "",
        "## 修复策略",
        "",
        "重复来源主要是同名方法出现在不同科研场景中，例如“免疫组化评分”同时属于病理影像和实验验证。修复时不删除方法，而是把每条方法的分类、输入材料、输出证据、推荐图形和复核重点写入卡片文案与详情导语，使同名方法在不同场景下承担不同说明功能。",
        "",
        "## 变更条目",
    ]
    for mid, name, category, old, new in changed:
        lines.append(f"- `{mid}` {name}（{category}）：{new}")
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"changed": len(changed), "after": {k: len(v) for k, v in after.items()}}, ensure_ascii=False))


if __name__ == "__main__":
    main()

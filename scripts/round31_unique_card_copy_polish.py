from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round31_unique_card_copy_polish_report.md"


def load_json(path: str) -> list[dict]:
    return json.loads((ROOT / path).read_text(encoding="utf-8-sig"))


def save_json(path: str, data: list[dict]) -> None:
    (ROOT / path).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def pick(items, fallback: str = "待补充材料") -> str:
    if isinstance(items, list) and items:
        return str(items[0])
    if isinstance(items, str) and items.strip():
        return items.strip()
    return fallback


def source_label(item: dict) -> str:
    source = item.get("public_source_example") or {}
    return source.get("tier") or source.get("title") or "公开/合成教学来源"


def visual_label(item: dict) -> str:
    visual = item.get("example_visual") or {}
    return visual.get("title") or "示例图"


def polish_methods() -> dict:
    path = "data/method_universe.json"
    data = load_json(path)
    templates = [
        "先用“{name}”回答{question}，再检查{input_item}是否足以支撑{output_item}。",
        "把{name}放进{category}场景中，重点确认{input_item}、{output_item}和教师复核证据是否闭合。",
        "当课题需要{name}时，先从{question}切入，再决定是否进入{plot_hint}和后续分析。",
        "{name}不是一个按钮，而是一条从材料、对照、输出到风险记录的{category}路线。",
        "用{name}帮助新手把{input_item}转成{output_item}，并在结果进入正文前完成边界审查。",
        "围绕{name}建立最小可讨论版本：问题、材料、图形、风险和导师复核点各留一项证据。",
    ]
    for i, item in enumerate(data):
        name = item.get("name") or f"方法{i+1}"
        category = item.get("category") or "科研方法"
        question = item.get("beginner_question") or f"什么时候使用{name}"
        input_item = pick(item.get("inputs"), "研究问题")
        output_item = pick(item.get("outputs"), "方法判断卡")
        plot_hint = pick(item.get("recommended_plot_types"), "推荐图表")
        template = templates[i % len(templates)]
        microcopy = template.format(
            name=name,
            category=category,
            question=question.replace("科研新手", "新手"),
            input_item=input_item,
            output_item=output_item,
            plot_hint=plot_hint,
        )
        item["card_microcopy"] = microcopy
        solve_templates = [
            f"{name}用于解决“{question}”这类具体判断；页面会把“{input_item}”与“{output_item}”放在同一条证据链里审查。",
            f"{name}适合先回答“为什么要做、材料够不够、输出能否复核”；本页会围绕{category}拆出输入、图表、工具和导师讨论点。",
            f"当你不确定{name}是否适合当前课题时，先看它能否从“{input_item}”推到“{output_item}”，再决定是否进入下一步。",
            f"{name}把{category}里的抽象选择转成新手可检查清单：问题、材料、输出、图形、风险和人工复核。",
        ]
        item["what_it_solves"] = solve_templates[i % len(solve_templates)]
        item["detail_novice_intro"] = (
            f"如果你第一次接触{name}，不要先追求完整流程。先确认它是否属于{category}，"
            f"再核对最小输入“{input_item}”、预期输出“{output_item}”和示例图“{visual_label(item)}”。"
        )
        item["detail_source_sentence"] = (
            f"“{name}”的示例图“{visual_label(item)}”参考{source_label(item)}的公开学习线索或本地合成教学数据重绘；"
            f"读图重点是把“{input_item}—{output_item}—{plot_hint}”连成可复核路径，不复制期刊原图，不声称代表真实课题结果。"
        )
    save_json(path, data)
    return {"methods": len(data)}


def polish_plots() -> dict:
    path = "data/plot_gallery_taxonomy.json"
    data = load_json(path)
    for i, item in enumerate(data):
        name = item.get("zh_name") or item.get("en_name") or f"图{i+1}"
        category = item.get("category") or "科研图形"
        cols = item.get("required_columns") or []
        col_text = "、".join(cols[:3]) if cols else "核心变量"
        question = item.get("question_answered") or "回答当前数据问题"
        mistake = pick(item.get("common_mistakes"), "先核对统计前提")
        tool = pick(item.get("recommended_tools"), "R/ggplot2")
        expectation = item.get("source_data_expectation") or item.get("example_dataset_status") or "需要可追溯source data"
        plot_templates = [
            f"当你想用{name}回答“{question}”时，先确认{col_text}是否齐全，并提前避开“{mistake}”。",
            f"{name}适合把“{question}”压缩成一张可审查图；建议先用{tool}做最小样例，再补source data。",
            f"如果手头只有{col_text}，先用{name}检查{category}关系是否成立；若{expectation}不满足，先回到数据审查室。",
            f"选择{name}前先问三件事：字段{col_text}是否真实存在，图注能否说明“{question}”，以及{mistake}是否已经处理。",
        ]
        item["plot_when_to_use"] = plot_templates[i % len(plot_templates)]
        item["plot_hero_subtitle"] = f"{name}属于{category}图形；本页重点讲字段{col_text}、工具线索{tool}、读图顺序和“{mistake}”这类误判。"
        item["detail_novice_intro"] = (
            f"{name}的价值不是把数据画得漂亮，而是把{category}中的“{question}”讲清楚。"
            f"本页会按字段{col_text}、示例图“{visual_label(item)}”、推荐工具{tool}和误区“{mistake}”逐步拆解。"
        )
        item["detail_source_sentence"] = (
            f"示例图“{visual_label(item)}”来自{source_label(item)}的公开学习线索或本地合成数据重绘；"
            f"读图重点是{name}如何用{col_text}回答“{question}”，不代表真实研究发现。"
        )
    save_json(path, data)
    return {"plots": len(data)}


def polish_articles() -> dict:
    path = "data/article_skill_workflows.json"
    data = load_json(path)
    for i, item in enumerate(data):
        article_type = item.get("type") or f"文章类型{i+1}"
        material = pick(item.get("required_materials"), "研究问题")
        output = pick(item.get("outputs"), "流程草案")
        check = pick(item.get("quality_checks"), "引用和方法边界")
        item["article_product_title"] = f"{article_type}从0到1：先把{material}整理清楚，再生成{output}"
        item["article_hero_subtitle"] = (
            f"面向第一次写{article_type}的学生：先补齐{material}，再围绕{check}搭建图表路线，最后接入自己的模型API生成可复核草案。"
        )
        article_templates = [
            f"{article_type}的起点不是写摘要，而是把“{material}”和“{output}”先对齐；本页按问题、材料、图表和审查节点搭建零起点路径。",
            f"第一次写{article_type}时，最容易漏掉材料边界和证据链。本页从{material}开始，逐步生成{output}和导师复核清单。",
            f"{article_type}需要先回答“材料够不够、图表怎么排、结论能否被引用支撑”。本页把这些问题拆成可执行Skill步骤。",
            f"如果你只有一个模糊选题，本页会把{article_type}拆为研究问题、{material}、{output}、风险边界和待实测指标。",
        ]
        item["detail_novice_intro"] = article_templates[i % len(article_templates)]
        item["detail_source_sentence"] = (
            f"示例图“{visual_label(item)}”基于{source_label(item)}的公开线索或教学化重绘；"
            f"读图重点是{article_type}如何从{material}走向{output}，不等同于真实投稿结果。"
        )
    save_json(path, data)
    return {"articles": len(data)}


def polish_tools() -> dict:
    path = "data/open_source_catalog.json"
    data = load_json(path)
    for i, item in enumerate(data):
        name = item.get("name") or f"工具{i+1}"
        category = item.get("category") or "开源工具"
        use_case = item.get("use_case") or item.get("when_to_use") or "学习工具输入输出"
        related = pick(item.get("related_tools"), "可替代工具")
        pitfall = pick(item.get("common_pitfalls"), "不要把工具输出直接写成结论")
        item["short_description"] = f"{name}用于{use_case}；先读懂输入、输出、版本和许可证，再决定是否运行最小示例。"
        item["tool_product_title"] = f"{name}：从开源仓库读懂“{category}”的输入、输出和复核边界"
        tool_templates = [
            f"本页把{name}当作{category}学习对象：先看它适合“{use_case}”的哪一段，再决定是否运行最小示例。",
            f"{name}不是万能按钮。新手应先核对许可证、输入格式和输出解释，再把结果交给教师或导师复核。",
            f"如果你想用{name}处理真实课题，先在本页读懂{category}任务边界、示例数据和失败风险。",
            f"本页重点不是复制{name}命令，而是把它的输入、输出、依赖和复核要求翻译给科研新手。",
        ]
        item["tool_hero_subtitle"] = tool_templates[i % len(tool_templates)]
        item["detail_novice_intro"] = (
            f"第一次使用{name}时，先不要复制复杂命令。建议先核对许可证、示例数据、依赖环境和输出解释，"
            f"再用一个小任务验证它是否真的适合“{use_case}”。"
        )
        item["detail_source_sentence"] = (
            f"示例图“{visual_label(item)}”来自{source_label(item)}的公开线索或本地学习化重绘；"
            f"读图重点是{name}在“{use_case}”中的输入输出关系，不代表平台已经真实运行该仓库。"
        )
        item["model_gateway_prompt_template"] = (
            f"我想学习开源工具{name}，用途是：{use_case}。请按科研新手视角输出："
            f"1）它在{category}任务中适合解决什么；2）最小输入字段和示例数据边界；"
            f"3）与{related}相比应如何取舍；4）安装或运行前需要核对的许可证、版本和依赖；"
            f"5）容易出现的错误：{pitfall}；6）结果解释、教师/导师复核和不得编造工具性能的边界。"
        )
    save_json(path, data)
    return {"tools": len(data)}


def main() -> int:
    results = {
        "method_universe": polish_methods(),
        "plot_gallery": polish_plots(),
        "article_workflows": polish_articles(),
        "open_source_catalog": polish_tools(),
    }
    total = sum(next(iter(value.values())) for value in results.values())
    REPORT.write_text(
        "# Round31 小卡片与详情文案差异化修复报告\n\n"
        f"本轮按条目真实字段重写卡片短说明、详情导语、来源说明和示例图边界，共处理 {total} 个最小内容单元。\n\n"
        "## 处理范围\n\n"
        f"- 方法库：{results['method_universe']['methods']} 条\n"
        f"- 图谱库：{results['plot_gallery']['plots']} 条\n"
        f"- 文章工坊：{results['article_workflows']['articles']} 条\n"
        f"- 开源工具库：{results['open_source_catalog']['tools']} 条\n\n"
        "## 写作原则\n\n"
        "- 每条卡片都绑定自身名称、类别、输入、输出、示例图或来源线索。\n"
        "- 示例图用于学习输出形态，不复制期刊原图，不伪造成真实课题结果。\n"
        "- 未真实运行的开源工具仍标注为学习线索或本地原型，不写成平台已完成部署。\n",
        encoding="utf-8",
    )
    print(json.dumps(results, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

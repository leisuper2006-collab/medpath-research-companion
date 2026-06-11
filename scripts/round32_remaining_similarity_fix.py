from __future__ import annotations

import json
from pathlib import Path

from round32_plot_copy_deduplicate import pick_focus, fields_label, PHASES, VISUAL_GRAMMARS


ROOT = Path(__file__).resolve().parents[1]


def read_json(rel: str):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def write_json(rel: str, data):
    (ROOT / rel).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def fix_plots() -> int:
    data = read_json("data/plot_gallery_taxonomy.json")
    for idx, item in enumerate(data):
        pid = item.get("id", f"plot-{idx}")
        name = item.get("zh_name") or pid
        source = item.get("public_source_example") or {}
        visual = item.get("example_visual") or {}
        fields = fields_label(item)
        focus, warning = pick_focus(pid)
        phase = PHASES[(idx + 3) % len(PHASES)]
        grammar = VISUAL_GRAMMARS[(idx * 7 + 1) % len(VISUAL_GRAMMARS)]
        source_title = source.get("title") or source.get("citation") or "公开学习来源/合成教学数据"
        visual_title = visual.get("title") or f"{name}教学示例图"
        item["detail_source_sentence"] = (
            f"{name}的示例视觉“{visual_title}”只用于说明{grammar}如何承载“{focus}”。"
            f"来源线索为“{source_title}”，正式复用时要回到原数据库、原论文许可和本地脚本；"
            f"{phase}可用它演示{fields}如何进入图形，但不得把示例图写成真实发现。"
        )
        item["model_gateway_prompt_template"] = (
            f"请作为{name}绘图导师，先判断我的数据表是否具备{fields}，再说明{grammar}应该如何映射到R/ggplot2图层。"
            f"请给出最小可运行绘图步骤、图注草案、{warning}对应的复核问题，以及“不得编造真实结果”的安全边界。"
        )
    write_json("data/plot_gallery_taxonomy.json", data)
    return len(data)


def fix_methods() -> int:
    data = read_json("data/method_universe.json")
    custom = {
        "method-004": "基因敲除结果解读的示例图强调“敲除后表型是否能回到基因—通路—功能证据链”；它借鉴公开文献线索或本地合成数据重绘，只能用于训练如何核对对照、救援实验和统计边界，不复制期刊原图。",
        "method-009": "基因敲低结果解读的示例图强调“部分抑制后效应是否稳定、剂量是否合理、脱靶是否可控”；它同样来自公开学习线索或合成数据重绘，不代表真实课题结论，也不能替代导师对实验设计的复核。",
    }
    changed = 0
    for item in data:
        if item.get("id") in custom:
            item["detail_source_sentence"] = custom[item["id"]]
            changed += 1
    write_json("data/method_universe.json", data)
    return changed


def fix_articles() -> int:
    data = read_json("data/article_skill_workflows.json")
    for item in data:
        if item.get("id") == "article-01":
            item["article_hero_subtitle"] = "Meta分析从一个可回答的PICO问题开始：先确定人群、干预或暴露、结局和研究类型，再进入检索式、筛选表、偏倚评价、森林图和GRADE证据表。模型API只能帮你整理流程，不能替你生成不存在的研究结果。"
        elif item.get("id") == "article-03":
            item["article_hero_subtitle"] = "网状Meta分析适合比较多个干预之间的相对效果：在普通Meta之前先检查网络是否连通、共同比较是否足够、异质性和不一致性是否可解释，再规划网络图、排名图和敏感性分析。"
    write_json("data/article_skill_workflows.json", data)
    return 2


def fix_tools() -> int:
    data = read_json("data/open_source_catalog.json")
    for item in data:
        tid = item.get("id")
        if tid == "clusterprofiler-2":
            item["tool_product_title"] = "ClusterProfiler二次路线：从富集结果复核“基因集、背景集和可视化选择”"
        elif tid == "napari":
            item["model_gateway_prompt_template"] = "我想学习Napari在计算病理/显微图像浏览中的用途。请按新手视角说明：图像格式、通道/层、标注插件、交互查看流程、与StarDist等分割工具的衔接、隐私图像禁用边界，以及如何把截图转成教学材料而不冒充算法性能。"
        elif tid == "stardist":
            item["model_gateway_prompt_template"] = "我想学习StarDist做细胞核或细胞实例分割。请说明：训练或推理需要的图像与标注、预训练模型边界、分割质量检查、与Napari查看结果的关系、常见失败形态，以及不得把示例分割图写成临床诊断依据。"
        elif tid == "quarto":
            item["model_gateway_prompt_template"] = "我想用Quarto组织可复现论文或课程讲义。请帮我规划：项目目录、qmd章节、代码块缓存、参考文献、图表输出、HTML/PDF发布，以及哪些内容必须由导师核对后才能进入正式稿。"
        elif tid == "jupyter-book":
            item["model_gateway_prompt_template"] = "我想用Jupyter Book制作科研训练教材。请帮我规划：章节树、notebook执行顺序、数据下载边界、交互练习、发布前检查、许可证说明，以及如何避免把教学示例误写成真实研究结果。"
    write_json("data/open_source_catalog.json", data)
    return len(data)


def main() -> int:
    counts = {
        "plots": fix_plots(),
        "methods": fix_methods(),
        "articles": fix_articles(),
        "tools": fix_tools(),
    }
    report = ROOT / "docs" / "round32_remaining_similarity_fix_report.md"
    report.write_text(
        "# Round32 剩余高相似文案修复\n\n"
        f"- 图谱库：重写 {counts['plots']} 条 `detail_source_sentence` 与 `model_gateway_prompt_template`。\n"
        f"- 方法库：定向修复 {counts['methods']} 条基因敲除/敲低结果解读来源说明。\n"
        "- 文章库：区分普通Meta分析与网状Meta分析的流程入口。\n"
        "- 工具库：区分clusterProfiler重复条目、Napari/StarDist、Quarto/Jupyter Book。\n",
        encoding="utf-8",
    )
    print(json.dumps(counts, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

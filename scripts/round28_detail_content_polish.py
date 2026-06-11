import json
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)


def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def save(name, value):
    (DATA / name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def text_join(values, fallback):
    clean = [str(v).strip() for v in values if str(v).strip()]
    return "、".join(clean[:4]) if clean else fallback


def clean_unknown(value, fallback):
    if isinstance(value, str):
        return fallback if "???" in value or value.strip() in {"????", "??"} else value
    if isinstance(value, list):
        return [clean_unknown(v, fallback) for v in value]
    if isinstance(value, dict):
        return {k: clean_unknown(v, fallback) for k, v in value.items()}
    return value


def method_stage(name, idx):
    if "入门" in name:
        return "先判断问题是否适合该方法"
    if "进阶" in name:
        return "再处理参数、对照和分层"
    if "质量控制" in name:
        return "重点检查质量、批次和边界"
    if "结果解读" in name:
        return "把输出翻译成可复核证据"
    if "常见误区" in name:
        return "先排除最容易踩的坑"
    return f"第{idx + 1}个执行视角"


def polish_methods():
    items = load("method_universe.json")
    counts = Counter(x.get("name", "") for x in items)
    seen = defaultdict(int)
    changed = 0
    for idx, item in enumerate(items):
        original_name = item.get("name") or f"方法{idx+1}"
        seen[original_name] += 1
        if counts[original_name] > 1:
            item["name"] = f"{original_name}（{item.get('category', '专题')} · {item.get('id', idx+1).upper()}）"
            changed += 1
        name = item.get("name") or original_name
        category = item.get("category") or "综合科研方法"
        question = item.get("beginner_question") or item.get("what_it_solves") or "待明确研究问题"
        inputs = text_join(item.get("inputs", []), "样本、分组、字段和伦理来源")
        outputs = text_join(item.get("outputs", []), "图表、模型结果、复核清单")
        plots = text_join(item.get("recommended_plot_types", []) or item.get("figure_examples", []), "匹配问题的主图和补充图")
        source = (item.get("public_source_example") or {}).get("title") or "公开数据库/公开论文线索"
        stage = method_stage(name, idx)
        item["card_microcopy"] = f"{name}适合在“{category}”场景下回答：{question}。先核对{inputs}，再规划{outputs}。"
        item["detail_scroll_panels"] = [
            {
                "title": f"{stage}",
                "body": f"这一页不是让新手记住方法名，而是先判断“{question}”是否真的需要{name}。如果问题只是描述现象，应先补齐研究对象、对照组和数据来源；如果要解释机制，还要准备能被导师复核的证据链。",
                "action": f"用一句话写下你的研究对象、分组和希望证明的关系。",
                "pitfall": "看到热门方法就直接套用，而没有先检查输入条件。",
            },
            {
                "title": "把输入材料整理成字段契约",
                "body": f"{name}至少需要这些材料：{inputs}。字段缺失、批次不明、样本来源不清或伦理边界不完整时，平台只给整理建议，不进入结论生成。",
                "action": "把已有字段粘到数据审查室，先得到缺口清单。",
                "pitfall": "把格式不统一的数据交给模型后要求直接写结论。",
            },
            {
                "title": "让输出服务一个具体图文任务",
                "body": f"本方法常见产出包括：{outputs}。推荐先用{plots}理解结果形态，再决定它是论文主图、补充图、课堂案例还是导师讨论材料。",
                "action": "选择一张主图和一张复核图，写清图注想回答的问题。",
                "pitfall": "图做得好看但不能回答研究问题。",
            },
            {
                "title": "回到公开来源和人工复核",
                "body": f"示例来源线索为“{source}”。本站只展示教学改绘或合成示例，不复制论文原图，也不把示例结果当作真实课题结论。",
                "action": "打开公开来源核对数据许可、论文背景和适用范围。",
                "pitfall": "把公开来源当作自己的结果，或忽略导师/伦理复核。",
            },
        ]
    save("method_universe.json", items)
    return {"methods": len(items), "duplicate_names_renamed": changed}


def polish_plots():
    items = load("plot_gallery_taxonomy.json")
    for idx, item in enumerate(items):
        name = item.get("zh_name") or item.get("name") or f"图谱{idx+1}"
        question = item.get("answers_question") or item.get("question_answered") or "待明确图形问题"
        fields = item.get("plot_data_contract") or item.get("what_it_needs") or []
        if fields and isinstance(fields[0], dict):
            field_text = text_join([f"{x.get('field')}({x.get('meaning')})" for x in fields], "关键字段")
        else:
            field_text = text_join(fields, "关键字段")
        tools = text_join(item.get("recommended_tools", []), "R/ggplot2 或等价可复现代码")
        source = (item.get("public_source_example") or {}).get("title") or "公开示例数据"
        item["plot_story_sections"] = [
            {"title": f"{name}先回答一个问题", "body": f"{name}应服务于“{question}”。科研新手要先写下图想证明、比较或解释什么，再决定是否使用这种图。", "action": "把图的问题写成一句话。"},
            {"title": "字段不齐就不要急着画", "body": f"这类图通常需要：{field_text}。如果字段类型、分组、统计前提或缺失值没有处理，图会给出误导性的视觉信号。", "action": "先完成字段审查和单位/分组统一。"},
            {"title": "示例图只教你读法", "body": f"推荐工具线索为：{tools}。本站示例图来自本地教学改绘，来源线索指向“{source}”，正式研究必须回到原始数据和代码。", "action": "保留绘图代码、参数和图注边界。"},
            {"title": "解释时不要越界", "body": f"{name}只能支持与数据匹配的解释。不能把视觉趋势写成因果机制，也不能补造p值、样本量或显著性。", "action": "把解释交给导师或统计复核。"},
        ]
    save("plot_gallery_taxonomy.json", items)
    return {"plots": len(items)}


def polish_articles():
    items = load("article_skill_workflows.json")
    for idx, item in enumerate(items):
        typ = item.get("type") or f"文章类型{idx+1}"
        materials = text_join(item.get("required_materials", []), "研究问题、数据来源和伦理材料")
        skills = text_join(item.get("skills_to_call", []), "research-copilot、citation-checker、ai-ethics-governor")
        checks = text_join(item.get("quality_checks", []), "引用核验、图表复核和导师审核")
        source = (item.get("public_source_example") or {}).get("title") or "公开来源线索"
        item["article_story_sections"] = [
            {"title": f"{typ}不是从空白页硬写", "body": f"先确认这篇文章要回答的核心问题，再判断材料是否足够。{typ}至少需要：{materials}。", "action": "写出题目、对象、数据来源和主要结局。"},
            {"title": "把写作拆成可执行任务", "body": f"平台会把选题、检索/数据、方法、主图、补充材料和复核拆开，而不是一次性生成看似完整的论文。", "action": "先完成材料清单，再生成段落草稿。"},
            {"title": "用Skill链控制质量", "body": f"建议调用：{skills}。每一步都留下输入、输出和人工复核记录，避免模型编造文献、p值或审稿结论。", "action": "把每一步输出交给导师或教师审核。"},
            {"title": "示例来源只作为路线参考", "body": f"公开来源线索为“{source}”。它帮助新手理解这种文章常见证据形态，不代表本站已经完成对应研究。", "action": f"按{checks}逐项检查。"},
        ]
    save("article_skill_workflows.json", items)
    return {"articles": len(items)}


def polish_tools():
    items = load("open_source_catalog.json")
    fixed_unknown = 0
    for idx, item in enumerate(items):
        name = item.get("name") or f"工具{idx+1}"
        category = item.get("category") or "开源工具"
        desc = item.get("short_description") or item.get("beginner_explanation") or "用于科研训练的开源工具线索"
        fallback = f"{category}工具学习任务"
        before = json.dumps(item, ensure_ascii=False)
        item = clean_unknown(item, fallback)
        if "???" in before:
            fixed_unknown += 1
        item["tool_product_title"] = f"{name}：从开源仓库读懂“{category}”的输入、输出和风险边界"
        item["tool_hero_subtitle"] = f"{name}用于理解{category}中的工具学习任务。页面按科研新手视角拆解输入、输出、许可、复现记录和人工复核。"
        item["common_pitfalls"] = [
            "只看示例截图，不读输入格式和版本要求",
            "忽略许可证、依赖版本和示例数据边界",
            "把工具输出直接写成论文结论",
            "没有保存参数、日志和失败记录",
        ]
        item["learning_path"] = [
            "阅读README、论文或官方教程，确认工具用途",
            "核对输入格式、示例数据、许可证和依赖版本",
            "用公开小数据或合成数据跑通最小示例",
            "记录参数、输出、失败日志和解释边界",
            "把结果交给导师或教师复核后再进入正式研究",
        ]
        item["tool_story_sections"] = [
            {"title": "先确认它解决哪一类问题", "body": f"{name}属于“{category}”方向，适合用于{desc}。新手不要先跑代码，应先把研究问题、输入数据和输出解释写清楚。", "action": "写下你要处理的数据类型和希望得到的输出。"},
            {"title": "再核对数据和运行边界", "body": f"使用前至少核对原仓库、版本、许可证、示例数据和参数记录。任何缺少来源或运行日志的结果，都不能直接进入论文结论。", "action": "打开原仓库或官方教程，确认能否合规使用。"},
            {"title": "把仓库当成学习路线而不是黑箱", "body": f"建议先阅读README与示例脚本，再用公开小数据或合成数据跑通最小示例，随后记录输入、参数、输出和失败日志。", "action": "保存最小可运行示例和解释笔记。"},
            {"title": "最后回到复核和可重复性", "body": f"本平台只提供导航、解释和任务包，不复制未授权代码，不承诺{name}在用户数据上的效果。正式研究必须核对原仓库license、版本、依赖和导师复核意见。", "action": "列出复核问题和替代工具。"},
        ]
        items[idx] = item
    save("open_source_catalog.json", items)
    return {"tools": len(items), "unknown_fixed_items": fixed_unknown}


def audit():
    files = ["method_universe.json", "plot_gallery_taxonomy.json", "article_skill_workflows.json", "open_source_catalog.json"]
    result = {}
    for name in files:
        arr = load(name)
        bad = sum(1 for x in arr if "????" in json.dumps(x, ensure_ascii=False) or "???" in json.dumps(x, ensure_ascii=False))
        keys = [x.get("name") or x.get("zh_name") or x.get("type") or x.get("id") for x in arr]
        result[name] = {
            "items": len(arr),
            "unknown_marker_items": bad,
            "duplicate_display_titles": len(keys) - len(set(keys)),
            "missing_example_visual_url": sum(1 for x in arr if not (x.get("example_visual") or {}).get("url")),
            "missing_public_source": sum(1 for x in arr if not (x.get("public_source_example") or {}).get("title")),
        }
    return result


def main():
    report = {
        "method_polish": polish_methods(),
        "plot_polish": polish_plots(),
        "article_polish": polish_articles(),
        "tool_polish": polish_tools(),
        "audit_after": audit(),
        "boundary": "示例图为本地教学改绘或开放数据再绘制；不复制期刊原图，不声称为真实课题结果。",
    }
    (DOCS / "round28_detail_content_polish_report.md").write_text(
        "# Round28 详情页内容差异化修复报告\n\n"
        + json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

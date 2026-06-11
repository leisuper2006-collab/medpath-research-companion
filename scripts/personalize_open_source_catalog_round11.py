import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_json(path: str):
    return json.loads((ROOT / path).read_text(encoding="utf-8-sig"))


def write_json(path: str, data):
    (ROOT / path).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def slugify(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9_-]+", "-", str(value).strip().lower())
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "tool"


def unique_id(name: str, seen: set[str]) -> str:
    base = slugify(name)
    candidate = base
    i = 2
    while candidate in seen:
        candidate = f"{base}-{i}"
        i += 1
    seen.add(candidate)
    return candidate


def story(tool: dict, idx: int) -> list[dict[str, str]]:
    name = tool.get("name", "工具")
    category = tool.get("category", "开源工具")
    use_case = tool.get("use_case") or tool.get("when_to_use") or "用于理解一种科研任务流程。"
    inputs = tool.get("input_requirements") or "先核对原仓库README、示例数据和输入格式。"
    return [
        {
            "title": "先确认它解决哪一类问题",
            "body": f"{name} 属于“{category}”方向，适合用于{use_case}。新手不要先跑代码，应先把研究问题、输入数据和输出解释写清楚。",
        },
        {
            "title": "再核对数据和运行边界",
            "body": f"使用前至少核对这些材料：{inputs} 任何缺少版本、许可证、参数或数据来源的运行结果，都不能直接进入论文结论。",
        },
        {
            "title": "把仓库当成学习路线而不是黑箱",
            "body": "建议先阅读README与示例脚本，再用公开小数据跑通最小示例，随后记录输入、参数、输出和失败日志，最后才比较同类工具差异。",
        },
        {
            "title": "最后回到复核和可重复性",
            "body": "本平台只提供导航、解释和任务包，不复制未授权代码，不承诺工具效果。正式研究必须核对原仓库license、版本、依赖和导师复核意见。",
        },
    ]


def main():
    tools = read_json("data/open_source_catalog.json")
    sources = read_json("data/public_example_sources.json")
    seen_ids: set[str] = set()
    seen_titles: set[str] = set()

    for idx, tool in enumerate(tools):
        tool_id = tool.get("id") or unique_id(tool.get("name", f"tool-{idx + 1}"), seen_ids)
        tool["id"] = tool_id
        title = f"{tool.get('name', '工具')}：从开源仓库读懂“{tool.get('category', '科研任务')}”的输入、输出和风险边界"
        if title in seen_titles:
            title = f"{title}（路线 {idx + 1}）"
        seen_titles.add(title)
        source = sources[idx % len(sources)] if sources else {}
        tool.update(
            {
                "tool_product_title": title,
                "tool_hero_subtitle": f"{tool.get('short_description', '')}。本页按科研新手视角拆解：为什么用、怎么跑、先查什么、哪里不能夸大。",
                "tool_when_to_use": tool.get("when_to_use") or tool.get("use_case") or "用于理解一个开源科研工具的最小运行路径。",
                "tool_story_sections": story(tool, idx),
                "public_source_example": source,
                "example_visual": {
                    "url": f"/outputs/round11_detail_plots/tool_{tool_id}.svg",
                    "title": f"{tool.get('name', '工具')} 开源工具学习示意图",
                    "source_note": "本图由R/ggplot2使用合成教学数据生成，用于说明工具学习路径，不代表原仓库性能。",
                    "reuse_boundary": "示例图不复制原仓库图或论文原图；正式使用需核对原仓库许可证、版本和数据来源。",
                },
                "model_gateway_prompt_template": (
                    f"我想学习并评估开源工具 {tool.get('name', '')}。请按科研新手视角输出："
                    "适用问题、输入数据字段、安装/运行前检查、最小示例流程、常见错误、"
                    "license核对清单、结果解释边界、可替代工具和导师复核问题。不得编造工具性能或论文结论。"
                ),
                "human_review_checklist": [
                    "是否核对原仓库和官方文档",
                    "是否核对license和引用方式",
                    "是否使用公开或授权数据",
                    "是否记录版本、参数和运行环境",
                    "是否由导师或教师复核结果解释",
                ],
                "unique_detail_status": "round11_tool_product_detail_ready",
            }
        )

    write_json("data/open_source_catalog.json", tools)

    report = ROOT / "docs" / "round11_open_source_tool_personalization_report.md"
    report.write_text(
        "\n".join(
            [
                "# Round11 开源工具库产品化报告",
                "",
                f"- 工具数量：{len(tools)}。",
                f"- 独立工具标题：{len({t['tool_product_title'] for t in tools})}。",
                "- 每个工具均已补充产品化标题、四段式说明、公开来源线索、专属示例图、模型网关提示词和人工复核清单。",
                "- 公开来源仅作为检索线索，不复制论文原图或仓库图，不下载受控数据。",
                "- 示例图为合成教学演示，不代表原工具真实性能。",
            ]
        ),
        encoding="utf-8",
    )

    print(json.dumps({"tools": len(tools), "unique_titles": len({t["tool_product_title"] for t in tools})}, ensure_ascii=False))


if __name__ == "__main__":
    main()

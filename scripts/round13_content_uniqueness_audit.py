from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REPORT = ROOT / "docs" / "round13_content_uniqueness_audit.md"


DATASETS = {
    "methods": ("method_universe.json", ["detail_novice_intro", "detail_scenario_story", "hero_title", "hero_subtitle"]),
    "plots": ("plot_gallery_taxonomy.json", ["detail_novice_intro", "plot_product_title", "plot_hero_subtitle", "plot_when_to_use"]),
    "tools": ("open_source_catalog.json", ["detail_novice_intro", "tool_product_title", "tool_hero_subtitle", "tool_when_to_use"]),
    "articles": ("article_skill_workflows.json", ["detail_novice_intro", "article_product_title", "article_hero_subtitle", "article_reporting_focus"]),
}


REQUIRED_FIELDS = {
    "methods": ["example_visual", "public_source_example", "detail_scroll_panels", "detail_user_prompt_examples"],
    "plots": ["example_visual", "public_source_example", "detail_scroll_panels"],
    "tools": ["example_visual", "public_source_example", "detail_scroll_panels"],
    "articles": ["example_visual", "public_source_example", "detail_scroll_panels"],
}


GENERIC_PATTERNS = [
    "可复用、可评价、可治理、可推广",
    "本项目不是",
    "这一回应将贯穿",
    "正式排版时",
    "文字化图表说明",
    "原拟",
    "现以文字说明替代",
]


def load_json(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8-sig"))


def normalize(text: str) -> str:
    text = re.sub(r"\s+", "", str(text or ""))
    text = re.sub(r"[，。；：、“”‘’（）()《》<>【】\[\]{}.,;:!?！？]", "", text)
    return text


def missing_nested(item: dict, field: str) -> bool:
    value = item.get(field)
    if not value:
        return True
    if isinstance(value, dict):
        return not any(value.values())
    if isinstance(value, list):
        return len(value) == 0
    return False


def audit_dataset(label: str, file_name: str, text_fields: list[str]) -> dict:
    items = load_json(file_name)
    text_counter: Counter[str] = Counter()
    short_fields: list[str] = []
    missing: list[str] = []
    generic_hits: list[str] = []
    visual_missing: list[str] = []
    source_missing: list[str] = []

    required = REQUIRED_FIELDS.get(label, [])
    for idx, item in enumerate(items):
        item_id = str(item.get("id") or item.get("name") or item.get("type") or idx)
        for field in text_fields:
            value = item.get(field)
            if value:
                norm = normalize(value)
                if len(norm) >= 18:
                    text_counter[norm] += 1
                if len(str(value)) < 42:
                    short_fields.append(f"{item_id}.{field}")
                for pattern in GENERIC_PATTERNS:
                    if pattern in str(value):
                        generic_hits.append(f"{item_id}.{field}: {pattern}")
            else:
                missing.append(f"{item_id}.{field}")
        for field in required:
            if missing_nested(item, field):
                missing.append(f"{item_id}.{field}")
        if missing_nested(item, "example_visual"):
            visual_missing.append(item_id)
        if missing_nested(item, "public_source_example"):
            source_missing.append(item_id)

    duplicate_texts = {k: v for k, v in text_counter.items() if v > 1}
    return {
        "count": len(items),
        "missing": missing,
        "short_fields": short_fields,
        "generic_hits": generic_hits,
        "duplicate_texts": duplicate_texts,
        "visual_missing": visual_missing,
        "source_missing": source_missing,
    }


def main() -> None:
    results = {
        label: audit_dataset(label, file_name, fields)
        for label, (file_name, fields) in DATASETS.items()
    }

    failures = []
    for label, result in results.items():
        if result["missing"]:
            failures.append(f"{label}: missing {len(result['missing'])}")
        if result["duplicate_texts"]:
            failures.append(f"{label}: duplicate_texts {len(result['duplicate_texts'])}")
        if result["visual_missing"]:
            failures.append(f"{label}: visual_missing {len(result['visual_missing'])}")
        if result["source_missing"]:
            failures.append(f"{label}: source_missing {len(result['source_missing'])}")

    lines = ["# Round13 内容差异化与示例图覆盖审计\n"]
    for label, result in results.items():
        lines.append(f"## {label}")
        lines.append(f"- 条目数：{result['count']}")
        lines.append(f"- 缺失字段：{len(result['missing'])}")
        lines.append(f"- 过短说明：{len(result['short_fields'])}")
        lines.append(f"- AI模板/过程痕迹：{len(result['generic_hits'])}")
        lines.append(f"- 完全重复长文本：{len(result['duplicate_texts'])}")
        lines.append(f"- 缺示例图：{len(result['visual_missing'])}")
        lines.append(f"- 缺公开来源：{len(result['source_missing'])}")
        if result["missing"][:12]:
            lines.append("- 缺失示例：" + "；".join(result["missing"][:12]))
        if result["generic_hits"][:8]:
            lines.append("- 模板痕迹示例：" + "；".join(result["generic_hits"][:8]))
        if result["duplicate_texts"]:
            examples = list(result["duplicate_texts"].items())[:5]
            lines.append("- 重复文本示例：" + "；".join([f"{k[:40]}... x{v}" for k, v in examples]))
        lines.append("")

    if failures:
        lines.append("## 审计结论")
        lines.append("当前仍有需要修复的问题：")
        lines.extend([f"- {x}" for x in failures])
    else:
        lines.append("## 审计结论")
        lines.append("四类核心内容均具备详情说明、公开来源、示例图和差异化文本；未发现完全重复长文本。")

    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"failures": failures, "report": str(REPORT)}, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

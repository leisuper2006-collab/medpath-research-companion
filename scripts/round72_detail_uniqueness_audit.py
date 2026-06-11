import json
import re
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round72_detail_uniqueness_audit_report.md"

DATASETS = [
    ("methods", ROOT / "data" / "method_universe.json", {
        "id": "id",
        "title": ["hero_title", "name"],
        "intro": ["detail_novice_intro", "hero_subtitle", "what_it_solves"],
        "source": ["detail_source_sentence"],
        "visual": ["example_visual"],
        "panels": ["detail_scroll_panels", "apple_style_sections"],
        "prompt": ["demand_window_prompts", "detail_user_prompt_examples", "example_prompt"],
    }),
    ("plots", ROOT / "data" / "plot_gallery_taxonomy.json", {
        "id": "id",
        "title": ["plot_product_title", "zh_name"],
        "intro": ["detail_novice_intro", "plot_hero_subtitle", "plot_when_to_use"],
        "source": ["detail_source_sentence"],
        "visual": ["example_visual"],
        "panels": ["detail_scroll_panels", "plot_story_sections"],
        "prompt": ["model_gateway_prompt_template"],
    }),
    ("articles", ROOT / "data" / "article_skill_workflows.json", {
        "id": "id",
        "title": ["article_product_title", "type"],
        "intro": ["detail_novice_intro", "article_hero_subtitle", "article_reporting_focus"],
        "source": ["detail_source_sentence"],
        "visual": ["example_visual"],
        "panels": ["detail_scroll_panels", "article_story_sections"],
        "prompt": ["model_gateway_prompt_template", "llm_api_prompt_template"],
    }),
    ("tools", ROOT / "data" / "open_source_tool_library.json", {
        "id": "id",
        "title": ["name", "title"],
        "intro": ["long_description", "description", "what_it_solves"],
        "source": ["source_note", "source", "homepage"],
        "visual": ["example_visual", "visual"],
        "panels": ["detail_scroll_panels", "workflow", "use_cases"],
        "prompt": ["example_prompt", "demand_window_prompts"],
    }),
]

GENERIC_BAD_MARKERS = [
    "通用模板",
    "待补充",
    "同上",
    "示例说明",
    "这里填写",
]


def read_json(path: Path):
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def pick(item, keys):
    for key in keys:
        if key in item and item[key]:
            return item[key]
    return None


def textify(value):
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def normalized(text):
    return re.sub(r"\s+", "", textify(text).lower())


def similarity(a, b):
    return SequenceMatcher(None, normalized(a), normalized(b)).ratio()


def has_visual(value):
    if isinstance(value, dict):
        return bool(value.get("url") or value.get("path") or value.get("title"))
    if isinstance(value, list):
        return bool(value)
    return bool(value)


def has_source_boundary(item, source_value, visual_value):
    source_text = textify(source_value) + " " + textify(visual_value)
    return any(marker in source_text for marker in ["来源", "PMID", "公开", "合成", "重绘", "reuse", "boundary", "正式科研"])


def audit_dataset(name, path, mapping):
    data = read_json(path)
    failures = []
    field_texts = []

    for index, item in enumerate(data):
        item_id = item.get(mapping["id"], f"{name}-{index}")
        title = pick(item, mapping["title"])
        intro = pick(item, mapping["intro"])
        source = pick(item, mapping["source"])
        visual = pick(item, mapping["visual"])
        panels = pick(item, mapping["panels"])
        prompt = pick(item, mapping["prompt"])

        for label, value in [
            ("title", title),
            ("intro", intro),
            ("source", source),
            ("panels", panels),
            ("prompt", prompt),
        ]:
            text = textify(value).strip()
            if len(text) < 18 and label != "title":
                failures.append((item_id, f"{label} too short or missing"))
            if any(marker in text for marker in GENERIC_BAD_MARKERS):
                failures.append((item_id, f"{label} contains generic marker"))

        if not has_visual(visual):
            failures.append((item_id, "missing example visual"))
        if not has_source_boundary(item, source, visual):
            failures.append((item_id, "missing visible source/reuse boundary"))

        combined = "\n".join([
            textify(title),
            textify(intro),
            textify(source),
            textify(panels),
            textify(prompt),
        ])
        field_texts.append((item_id, combined))

    high_similarity = []
    for i in range(len(field_texts)):
        id_a, text_a = field_texts[i]
        for j in range(i + 1, len(field_texts)):
            id_b, text_b = field_texts[j]
            score = similarity(text_a, text_b)
            if score > 0.88:
                high_similarity.append((id_a, id_b, round(score, 3)))
                if len(high_similarity) > 50:
                    break
        if len(high_similarity) > 50:
            break

    return {
        "name": name,
        "path": path,
        "count": len(data),
        "failures": failures,
        "high_similarity": high_similarity,
    }


def main():
    results = [audit_dataset(name, path, mapping) for name, path, mapping in DATASETS]
    hard_failures = []
    for result in results:
        hard_failures.extend((result["name"], *failure) for failure in result["failures"])
        hard_failures.extend((result["name"], "high_similarity", pair) for pair in result["high_similarity"])

    lines = [
        "# Round72 Detail Uniqueness Audit",
        "",
        f"Status: {'PASS' if not hard_failures else 'FAIL'}",
        "",
        "This audit checks product-detail level copy, example visuals, source/reuse boundaries, and near-duplicate detail pages.",
        "",
    ]
    for result in results:
        lines.extend([
            f"## {result['name']}",
            f"- Items: {result['count']}",
            f"- Missing/generic field failures: {len(result['failures'])}",
            f"- High-similarity detail pairs: {len(result['high_similarity'])}",
        ])
        if result["failures"][:10]:
            lines.append("- Sample failures:")
            for item_id, reason in result["failures"][:10]:
                lines.append(f"  - `{item_id}`: {reason}")
        if result["high_similarity"][:10]:
            lines.append("- Sample high-similarity pairs:")
            for id_a, id_b, score in result["high_similarity"][:10]:
                lines.append(f"  - `{id_a}` vs `{id_b}`: {score}")
        lines.append("")

    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print({"status": "PASS" if not hard_failures else "FAIL", "report": str(REPORT), "failure_count": len(hard_failures)})
    raise SystemExit(0 if not hard_failures else 1)


if __name__ == "__main__":
    main()

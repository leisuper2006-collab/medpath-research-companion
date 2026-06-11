from __future__ import annotations

import json
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT_JSON = ROOT / "docs" / "round31_content_uniqueness_audit.json"
REPORT_MD = ROOT / "docs" / "round31_content_uniqueness_audit.md"
BAD_MARKERS = ["TODO", "undefined", "null", "待补充详情", "文字化替代", "原拟", "现以文字说明替代"]
DATASETS = {
    "methods": {
        "path": "data/method_universe.json",
        "id": "id",
        "title": "name",
        "text_fields": ["card_microcopy", "what_it_solves", "detail_novice_intro", "detail_source_sentence", "model_gateway_prompt_template"],
    },
    "plots": {
        "path": "data/plot_gallery_taxonomy.json",
        "id": "id",
        "title": "zh_name",
        "text_fields": ["plot_when_to_use", "plot_hero_subtitle", "detail_novice_intro", "detail_source_sentence", "model_gateway_prompt_template"],
    },
    "articles": {
        "path": "data/article_skill_workflows.json",
        "id": "id",
        "title": "type",
        "text_fields": ["article_product_title", "article_hero_subtitle", "detail_novice_intro", "detail_source_sentence", "model_gateway_prompt_template"],
    },
    "tools": {
        "path": "data/open_source_catalog.json",
        "id": "id",
        "title": "name",
        "text_fields": ["short_description", "tool_product_title", "tool_hero_subtitle", "detail_novice_intro", "detail_source_sentence", "model_gateway_prompt_template"],
    },
}


def load(path: str) -> list[dict]:
    return json.loads((ROOT / path).read_text(encoding="utf-8-sig"))


def normalize(text: str) -> str:
    return " ".join(str(text or "").split()).strip()


def visual_path_exists(url: str) -> bool:
    if not url:
        return False
    if url.startswith("http://") or url.startswith("https://"):
        return True
    return (ROOT / url.lstrip("/")).exists()


def exact_duplicate_report(records: list[dict], field: str) -> list[dict]:
    seen: dict[str, list[str]] = defaultdict(list)
    for rec in records:
        text = normalize(rec.get(field))
        if len(text) >= 18:
            seen[text].append(rec["_key"])
    return [{"text": text, "items": items[:8], "count": len(items)} for text, items in seen.items() if len(items) > 1]


def high_similarity_pairs(records: list[dict], field: str, threshold: float = 0.965, limit: int = 15) -> list[dict]:
    pairs: list[dict] = []
    texts = [(rec["_key"], normalize(rec.get(field))) for rec in records if len(normalize(rec.get(field))) >= 36]
    for i, (key_a, text_a) in enumerate(texts):
        for key_b, text_b in texts[i + 1 :]:
            if abs(len(text_a) - len(text_b)) > 80:
                continue
            ratio = SequenceMatcher(None, text_a, text_b).ratio()
            if ratio >= threshold and text_a != text_b:
                pairs.append({"field": field, "a": key_a, "b": key_b, "ratio": round(ratio, 4), "a_text": text_a[:180], "b_text": text_b[:180]})
                if len(pairs) >= limit:
                    return pairs
    return pairs


def audit_dataset(name: str, spec: dict) -> dict:
    data = load(spec["path"])
    records = []
    missing_visual = []
    missing_source = []
    bad_marker_items = []
    for item in data:
        key = f"{name}:{item.get(spec['id']) or item.get(spec['title'])}"
        item["_key"] = key
        records.append(item)
        visual = item.get("example_visual") or {}
        if not visual_path_exists(visual.get("url", "")):
            missing_visual.append(key)
        source = item.get("public_source_example") or {}
        if not (source.get("title") and (source.get("tier") or source.get("citation") or source.get("url"))):
            missing_source.append(key)
        joined = json.dumps(item, ensure_ascii=False)
        if any(marker in joined for marker in BAD_MARKERS):
            bad_marker_items.append(key)
    exact_duplicates = []
    similar_pairs = []
    for field in spec["text_fields"]:
        exact_duplicates.extend([{**entry, "field": field} for entry in exact_duplicate_report(records, field)])
        similar_pairs.extend(high_similarity_pairs(records, field))
    for item in records:
        item.pop("_key", None)
    return {
        "items": len(data),
        "missing_visual": missing_visual[:20],
        "missing_visual_count": len(missing_visual),
        "missing_source": missing_source[:20],
        "missing_source_count": len(missing_source),
        "bad_marker_items": bad_marker_items[:20],
        "bad_marker_count": len(bad_marker_items),
        "exact_duplicate_count": len(exact_duplicates),
        "exact_duplicates": exact_duplicates[:20],
        "high_similarity_pair_count": len(similar_pairs),
        "high_similarity_pairs": similar_pairs[:20],
    }


def main() -> int:
    results = {name: audit_dataset(name, spec) for name, spec in DATASETS.items()}
    failures = []
    for name, res in results.items():
        if res["missing_visual_count"]:
            failures.append(f"{name}: missing visual {res['missing_visual_count']}")
        if res["missing_source_count"]:
            failures.append(f"{name}: missing source {res['missing_source_count']}")
        if res["bad_marker_count"]:
            failures.append(f"{name}: bad markers {res['bad_marker_count']}")
        if res["exact_duplicate_count"]:
            failures.append(f"{name}: exact duplicates {res['exact_duplicate_count']}")
    result = {"status": "FAIL" if failures else "PASS", "failures": failures, "datasets": results}
    REPORT_JSON.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        "# Round31 全站卡片与详情内容唯一性审计",
        "",
        f"状态：{result['status']}",
        "",
        "## 汇总",
        "",
    ]
    for name, res in results.items():
        lines.append(f"- {name}: {res['items']} 条；缺图 {res['missing_visual_count']}；缺来源 {res['missing_source_count']}；精确重复 {res['exact_duplicate_count']}；超高相似样例 {res['high_similarity_pair_count']}。")
    if failures:
        lines.extend(["", "## 失败项", ""])
        lines.extend([f"- {failure}" for failure in failures])
    lines.extend([
        "",
        "## 说明",
        "",
        "- 审计覆盖方法库、图谱库、文章工坊和开源工具库。",
        "- 示例图只作为学习图形或输出形态展示，不复制期刊原图，不伪造成真实研究结果。",
        "- 超高相似样例用于后续继续精修；精确重复、缺图、缺来源和明显占位为硬失败项。",
    ])
    REPORT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())

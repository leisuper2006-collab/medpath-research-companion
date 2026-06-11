from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAIN = ROOT / "data" / "public_source_visual_examples.json"
NEW = ROOT / "data" / "public_reproducible_examples" / "round57_remaining_public_visual_manifest.json"
REPORT = ROOT / "docs" / "round57_public_visual_coverage_report.md"


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_item(item: dict) -> dict:
    out = dict(item)
    source_ids = out.get("source_ids") or []
    if isinstance(source_ids, str):
        source_ids = [source_ids]
    out["source_ids"] = [str(x) for x in source_ids if str(x).strip()]
    return out


def main() -> None:
    current = [normalize_item(x) for x in load_json(MAIN)] if MAIN.exists() else []
    incoming = [normalize_item(x) for x in load_json(NEW)]
    by_id = {x["id"]: x for x in current}
    added: list[str] = []
    updated: list[str] = []
    for item in incoming:
        if item["id"] in by_id:
            updated.append(item["id"])
        else:
            added.append(item["id"])
        by_id[item["id"]] = item
    merged = list(by_id.values())
    MAIN.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")

    public_sources = load_json(ROOT / "data" / "public_example_sources.json")
    public_source_ids = {x["id"] for x in public_sources}
    covered_sources = {sid for item in merged for sid in item.get("source_ids", [])}
    covered_public = sorted(public_source_ids & covered_sources)
    uncovered_public = sorted(public_source_ids - covered_sources)

    lines = [
        "# Round57 公开来源视觉全覆盖报告",
        "",
        "## 合并结果",
        "",
        f"- 合并前视觉条目数：{len(current)}",
        f"- 本轮候选视觉条目数：{len(incoming)}",
        f"- 本轮新增条目数：{len(added)}",
        f"- 本轮更新条目数：{len(updated)}",
        f"- 合并后视觉条目数：{len(merged)}",
        f"- 覆盖公开来源：{len(covered_public)}/{len(public_sources)}",
        "",
        "## 本轮新增来源图",
        "",
    ]
    for item in incoming:
        lines.append(
            f"- `{item['id']}`：{item.get('title', '')}；绑定来源：{', '.join(item.get('source_ids', []))}"
        )
    lines.extend(["", "## 仍待补充来源", ""])
    if uncovered_public:
        for sid in uncovered_public:
            lines.append(f"- `{sid}`")
    else:
        lines.append("- 无。当前 80 个公开来源均已绑定至少一张公开 API 教学重绘图或公开来源视觉示例。")
    lines.extend(
        [
            "",
            "## 真实性边界",
            "",
            "本轮新增图均为 cBioPortal public REST API 与 R/ggplot2 的教学重绘图，不复制论文原图，不下载受控数据，不代表真实临床结论。正式科研写作前必须回到原数据库、原论文和数据许可条款核验。医学AI输出仅用于教学与科研训练，不替代临床诊断。",
        ]
    )
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(
        json.dumps(
            {
                "added": len(added),
                "updated": len(updated),
                "total_visuals": len(merged),
                "covered_public_sources": len(covered_public),
                "public_sources": len(public_sources),
                "uncovered_public_sources": len(uncovered_public),
                "report": str(REPORT),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

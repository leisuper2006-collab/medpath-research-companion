from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAIN = ROOT / "data" / "public_source_visual_examples.json"
NEW = ROOT / "data" / "public_reproducible_examples" / "round55_more_public_visual_manifest.json"
REPORT = ROOT / "docs" / "round55_public_visual_coverage_report.md"


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
    added = []
    updated = []
    for item in incoming:
        if item["id"] in by_id:
            updated.append(item["id"])
        else:
            added.append(item["id"])
        by_id[item["id"]] = item
    merged = list(by_id.values())
    MAIN.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")

    covered_sources = sorted({sid for item in merged for sid in item.get("source_ids", [])})
    public_sources = load_json(ROOT / "data" / "public_example_sources.json")
    public_source_ids = {x["id"] for x in public_sources}
    covered_public = sorted(public_source_ids & set(covered_sources))
    uncovered_public = sorted(public_source_ids - set(covered_sources))

    lines = [
        "# Round55 public source visual coverage report",
        "",
        "## 合并结果",
        "",
        f"- 合并前视觉条目数：{len(current)}",
        f"- 新增候选视觉条目数：{len(incoming)}",
        f"- 新增条目：{len(added)}",
        f"- 更新条目：{len(updated)}",
        f"- 合并后视觉条目数：{len(merged)}",
        f"- 覆盖 public source id：{len(covered_public)}/{len(public_sources)}",
        "",
        "## 本轮新增图",
        "",
    ]
    for item in incoming:
        lines.append(f"- `{item['id']}`：{item.get('title','')}；绑定来源：{', '.join(item.get('source_ids', []))}")
    lines.extend([
        "",
        "## 仍待补充的前30个来源",
        "",
    ])
    for sid in uncovered_public[:30]:
        title = next((x.get("title", "") for x in public_sources if x["id"] == sid), "")
        lines.append(f"- `{sid}`：{title}")
    lines.extend([
        "",
        "## 真实性边界",
        "",
        "所有新增图均为 cBioPortal public REST API + R/ggplot2 教学重绘图，不复制论文原图，不下载受控数据，不代表真实临床结论。正式科研使用前必须回到原数据库、原论文和数据许可进行核验。医学AI输出仅用于教学与科研训练，不替代临床诊断。",
    ])
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({
        "main": str(MAIN),
        "report": str(REPORT),
        "added": len(added),
        "updated": len(updated),
        "total_visuals": len(merged),
        "covered_public_sources": len(covered_public),
        "public_sources": len(public_sources),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

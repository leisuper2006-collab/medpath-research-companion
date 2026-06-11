from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "research_island_buildings.json"
APP = ROOT / "apps" / "web" / "static" / "app.js"
CSS = ROOT / "apps" / "web" / "static" / "styles.css"
REPORT = ROOT / "docs" / "round15_research_island_upgrade_report.md"


REQUIRED_BUILDING_FIELDS = {
    "id",
    "name",
    "role",
    "interaction",
    "route",
    "quest_title",
    "quest_summary",
    "quest_steps",
    "skill_chain",
    "evidence_to_collect",
    "starter_prompt",
    "reward",
    "beginner_tip",
    "safety_boundary",
}


def main() -> int:
    buildings = json.loads(DATA.read_text(encoding="utf-8"))
    app = APP.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")
    failures: list[str] = []

    if len(buildings) != 10:
        failures.append(f"expected 10 island buildings, found {len(buildings)}")

    for building in buildings:
        missing = sorted(REQUIRED_BUILDING_FIELDS - set(building))
        if missing:
            failures.append(f"{building.get('id', 'unknown')} missing fields: {', '.join(missing)}")
        if len(building.get("quest_steps") or []) < 3:
            failures.append(f"{building.get('id')} needs at least 3 quest steps")
        if len(building.get("skill_chain") or []) < 2:
            failures.append(f"{building.get('id')} needs at least 2 skill-chain entries")
        boundary = building.get("safety_boundary", "")
        if not any(term in boundary for term in ["不替代", "不用于", "不得", "dry-run", "不保存"]):
            failures.append(f"{building.get('id')} safety boundary is too weak")

    required_app_tokens = [
        "islandPanelMarkup",
        "quest_steps",
        "skill_chain",
        "evidence_to_collect",
        "starter_prompt",
        "pet-actions",
        "科研小向导",
    ]
    for token in required_app_tokens:
        if token not in app:
            failures.append(f"app.js missing token: {token}")

    required_css_tokens = [
        ".quest-steps",
        ".quest-meta",
        ".quest-prompt",
        ".quest-reward",
        ".pet-actions",
        ".island-panel-kicker",
    ]
    for token in required_css_tokens:
        if token not in css:
            failures.append(f"styles.css missing token: {token}")

    lines = [
        "# Round15 3D科研小岛与桌宠升级检查报告",
        "",
        "## 检查结论",
        "",
        "通过" if not failures else "未通过",
        "",
        "## 已覆盖内容",
        "",
        f"- 建筑任务节点：{len(buildings)} 个。",
        "- 每个建筑均应包含任务标题、三步路径、Skill调用链、证据要求、starter prompt、奖励提示和安全边界。",
        "- 页面右侧面板已从普通说明升级为任务面板。",
        "- 全站桌宠已从单次alert提示升级为带快捷入口的科研小向导。",
        "",
        "## 建筑清单",
        "",
    ]
    for building in buildings:
        lines.append(f"- {building['name']}：{building['quest_title']}；入口 `{building['route']}`；调用链 `{', '.join(building['skill_chain'])}`。")

    lines.extend(["", "## 失败项", ""])
    if failures:
        lines.extend(f"- {failure}" for failure in failures)
    else:
        lines.append("- 无。")

    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(REPORT)
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

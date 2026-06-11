import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def safe_id(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9_-]+", "-", str(value).lower())
    value = re.sub(r"-+", "-", value).strip("-")
    return value


path = ROOT / "data" / "method_universe.json"
methods = json.loads(path.read_text(encoding="utf-8-sig"))
for item in methods:
    sid = safe_id(item.get("id") or item.get("name"))
    item.setdefault("example_visual", {})
    item["example_visual"].update(
        {
            "url": f"/outputs/round11_method_plots/method_{sid}.svg",
            "title": f"{item.get('name', '科研方法')} 方法学习示意图",
            "source_note": "本图由R生成合成教学示意图，用于说明方法学习路径，不代表真实研究结果。",
            "reuse_boundary": "示例图仅用于教学与科研训练；正式研究必须使用用户自己的数据并完成导师复核。",
        }
    )

path.write_text(json.dumps(methods, ensure_ascii=False, indent=2), encoding="utf-8")

report = ROOT / "docs" / "round11_method_unique_visuals_report.md"
report.write_text(
    "\n".join(
        [
            "# Round11 方法宇宙专属示例图报告",
            "",
            f"- 方法数量：{len(methods)}。",
            "- 每个方法已绑定一张专属 SVG 示例图。",
            "- 图像目录：`outputs/round11_method_plots/`。",
            "- 生成脚本：`scripts/generate_round11_method_detail_visuals.R`。",
            "- 绑定脚本：`scripts/bind_method_unique_visuals_round11.py`。",
            "- 所有示例图均为合成教学示意图，不代表真实研究结果。",
        ]
    ),
    encoding="utf-8",
)

print(json.dumps({"methods": len(methods)}, ensure_ascii=False))

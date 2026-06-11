from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "outputs" / "mobile_app_handoff" / "figma_import_pack"
REPORT = ROOT / "docs" / "round63_figma_import_pack_verification.json"


def main() -> int:
    required = [
        PACK / "README.md",
        PACK / "figma_import_manifest.json",
        PACK / "figma_use_rebuild_mobile_app.js",
        PACK / "medpath_mobile_app_figma_handoff.svg",
        PACK / "medpath_mobile_tokens.json",
    ]
    missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
    manifest = json.loads((PACK / "figma_import_manifest.json").read_text(encoding="utf-8")) if not missing else {}
    tokens = json.loads((PACK / "medpath_mobile_tokens.json").read_text(encoding="utf-8")) if (PACK / "medpath_mobile_tokens.json").exists() else {}
    script = (PACK / "figma_use_rebuild_mobile_app.js").read_text(encoding="utf-8", errors="ignore") if (PACK / "figma_use_rebuild_mobile_app.js").exists() else ""
    svg = (PACK / "medpath_mobile_app_figma_handoff.svg").read_text(encoding="utf-8", errors="ignore") if (PACK / "medpath_mobile_app_figma_handoff.svg").exists() else ""

    screens = manifest.get("screens", [])
    failures = []
    if missing:
        failures.append(f"missing files: {missing}")
    if len(screens) < 5:
        failures.append(f"expected at least 5 screens, got {len(screens)}")
    if not all(s.get("goal") and s.get("primary_actions") for s in screens):
        failures.append("screen definitions missing goals or actions")
    if "figma.createPage" not in script or "Phone /" not in script:
        failures.append("Figma rebuild script does not look complete")
    if "<svg" not in svg:
        failures.append("SVG handoff is not valid SVG text")
    if not tokens.get("colors") or not tokens.get("typography"):
        failures.append("tokens missing colors or typography")

    result = {
        "pack": str(PACK),
        "file_count": len(list(PACK.glob("*"))),
        "screens": [s.get("name") for s in screens],
        "missing": missing,
        "failures": failures,
    }
    REPORT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round14_publish_design_check_report.md"


REQUIRED_FILES = [
    ".github/workflows/ci.yml",
    ".github/workflows/pages.yml",
    "vercel.json",
    "docs/github_pages_publish_guide.md",
    "docs/vercel_static_deploy_guide.md",
    "docs/public_release_checklist.md",
    "design-system/figma-import-ready/design_tokens.json",
    "design-system/figma-import-ready/component_spec.md",
    "design-system/figma-import-ready/mobile_app_flow.md",
    "design-system/figma-import-ready/figma_handoff_guide.md",
    "design-system/figma-import-ready/index.html",
]


TOKEN_REQUIRED_KEYS = ["color", "type", "radius", "spacing", "shadow", "motion", "rules"]


def main() -> None:
    checks: list[tuple[str, bool, str]] = []
    for rel in REQUIRED_FILES:
        path = ROOT / rel
        checks.append((rel, path.exists() and path.stat().st_size > 0, str(path.stat().st_size) if path.exists() else "missing"))

    token_path = ROOT / "design-system/figma-import-ready/design_tokens.json"
    if token_path.exists():
        tokens = json.loads(token_path.read_text(encoding="utf-8"))
        for key in TOKEN_REQUIRED_KEYS:
            checks.append((f"design_tokens.{key}", key in tokens, "present" if key in tokens else "missing"))

    ci = (ROOT / ".github/workflows/ci.yml").read_text(encoding="utf-8", errors="ignore") if (ROOT / ".github/workflows/ci.yml").exists() else ""
    pages = (ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8", errors="ignore") if (ROOT / ".github/workflows/pages.yml").exists() else ""
    checks.append(("CI runs pytest", "pytest apps/api/tests -q" in ci, "pytest"))
    checks.append(("CI runs static build", "scripts/build_static_release.py" in ci, "static build"))
    checks.append(("Pages deploys dist", "dist/github-pages-demo" in pages, "dist/github-pages-demo"))
    checks.append(("Pages runs uniqueness audit", "round13_content_uniqueness_audit.py" in pages, "round13 audit"))

    handoff = (ROOT / "design-system/figma-import-ready/figma_handoff_guide.md").read_text(encoding="utf-8", errors="ignore")
    checks.append(("Figma handoff records MCP boundary", "尚未生成线上 Figma 文件" in handoff, "boundary"))
    checks.append(("Mobile app flow documented", "一句话找研究路线" in (ROOT / "design-system/figma-import-ready/mobile_app_flow.md").read_text(encoding="utf-8", errors="ignore"), "mobile flow"))

    failed = [name for name, ok, _ in checks if not ok]
    lines = [
        "# Round14 发布与设计母版检查报告",
        "",
        "| 检查项 | 结果 | 证据 |",
        "|---|---:|---|",
    ]
    for name, ok, evidence in checks:
        lines.append(f"| {name} | {'PASS' if ok else 'FAIL'} | {evidence} |")
    lines.append("")
    if failed:
        lines.append("## 结论")
        lines.append("存在未满足项：")
        lines.extend(f"- {x}" for x in failed)
    else:
        lines.append("## 结论")
        lines.append("GitHub/Vercel 发布链与 Figma-ready 设计母版包均已具备可审查文件。")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"failed": failed, "report": str(REPORT)}, ensure_ascii=False, indent=2))
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

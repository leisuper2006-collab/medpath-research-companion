from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.error import URLError
from urllib.request import ProxyHandler, Request, build_opener


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REPORT = ROOT / "docs" / "final_development_audit_report.md"
FRONTEND_URL = "http://127.0.0.1:3000"
BACKEND_URL = "http://127.0.0.1:8000"
OPENER = build_opener(ProxyHandler({}))


REQUIRED_ROUTES = [
    "/",
    "/teacher",
    "/student",
    "/researcher",
    "/skill-builder",
    "/plugins",
    "/plugins/teaching",
    "/plugins/research",
    "/plugins/governance",
    "/skills/pathology-report-coach",
    "/simulate",
    "/simulate/new",
    "/simulate/demo-case-001",
    "/compare",
    "/evidence",
    "/open-source",
    "/plot-studio",
    "/method-runner",
    "/method-runner/virtual-perturbation",
    "/runtime",
    "/providers",
    "/governance",
    "/settings",
]


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8-sig"))


def request_json(path: str, method: str = "GET", body: dict | None = None):
    data = None
    headers = {"Content-Type": "application/json"}
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    req = Request(f"{BACKEND_URL}{path}", data=data, headers=headers, method=method)
    with OPENER.open(req, timeout=8) as response:
        return json.loads(response.read().decode("utf-8"))


def request_text(url: str) -> str:
    with OPENER.open(Request(url), timeout=8) as response:
        return response.read().decode("utf-8", errors="replace")


def scan_text_files() -> str:
    parts: list[str] = []
    for path in ROOT.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".py", ".js", ".ts", ".html", ".css", ".md", ".json", ".yaml", ".yml", ".txt", ".example"}:
            if any(part in {"__pycache__", ".venv", "node_modules", "scripts"} for part in path.parts):
                continue
            if path.name == "final_development_audit_report.md":
                continue
            try:
                parts.append(path.read_text(encoding="utf-8", errors="ignore"))
            except Exception:
                pass
    return "\n".join(parts)


def main() -> int:
    checks: list[tuple[str, bool, str]] = []

    def add(name: str, ok: bool, evidence: str = "") -> None:
        checks.append((name, ok, evidence))

    add("frontend package.json exists", (ROOT / "apps" / "web" / "package.json").exists())
    add("backend main.py exists", (ROOT / "apps" / "api" / "app" / "main.py").exists())
    add("Playwright spec exists", (ROOT / "tests" / "e2e" / "navigation.spec.ts").exists())

    counts = {
        "plugins": len(load("plugins.json")),
        "skills": len(load("skills.json")),
        "synthetic_cases": len(load("synthetic_cases.json")),
        "comparison_demos": len(load("comparison_demos.json")),
        "open_source": len(load("open_source_catalog.json")),
        "methods": len(load("method_cards.json")),
        "providers": len(load("providers.json")),
        "governance_rules": len(load("governance_rules.json")),
    }
    add("plugins >= 3", counts["plugins"] >= 3, str(counts["plugins"]))
    add("skills >= 13", counts["skills"] >= 13, str(counts["skills"]))
    add("synthetic cases >= 120", counts["synthetic_cases"] >= 120, str(counts["synthetic_cases"]))
    add("comparison demos >= 8", counts["comparison_demos"] >= 8, str(counts["comparison_demos"]))
    add("open-source items >= 80", counts["open_source"] >= 80, str(counts["open_source"]))
    add("method cards >= 20", counts["methods"] >= 20, str(counts["methods"]))
    add("providers >= 12", counts["providers"] >= 12, str(counts["providers"]))
    add("governance rules >= 20", counts["governance_rules"] >= 20, str(counts["governance_rules"]))

    text = scan_text_files()
    secret_patterns = [
        r"sk-[A-Za-z0-9]{20,}",
        r"AIza[0-9A-Za-z\-_]{20,}",
        r"xox[baprs]-[0-9A-Za-z-]{20,}",
        r"-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----",
    ]
    add("no plaintext key pattern", not any(re.search(p, text) for p in secret_patterns))
    add("no Chinese ID-like sequence", not re.search(r"(身份证|证件号|居民身份证)[^\n]{0,40}\d{17}[\dXx]", text))
    add("no mobile phone-like sequence", not re.search(r"\b1[3-9]\d{9}\b", text))
    forbidden_fabrication = ["已在D03上线", "已完成真实课程试点", "已证明教学效果提升", "已获得专家评分", "已回传D10真实评价"]
    fabrication_hits = [x for x in forbidden_fabrication if x in text]
    add("no fabricated completion claims", not fabrication_hits, ", ".join(fabrication_hits))
    forbidden_gb10 = ["GB10正式产品服务器", "GB10作为产品服务器", "GB10生产服务器"]
    add("GB10 not productized", not any(x in text for x in forbidden_gb10))

    api_ok = True
    api_evidence = []
    try:
        health = request_json("/api/health")
        api_evidence.append(str(health))
        request_json("/api/plugins")
        request_json("/api/skills/pathology-report-coach")
        request_json("/api/simulate/case", "POST", {"disease_system": "消化系统", "organ_system": "胃黏膜", "student_level": "本科", "teaching_goal": "PBL", "difficulty": "进阶"})
        request_json("/api/compare/run", "POST", {"task_id": "pbl-case"})
        request_json("/api/plot/generate", "POST", {"plot_type": "scatter"})
        request_json("/api/skill-builder/generate", "POST", {"name": "demo-skill", "zh_name": "示例Skill", "task": "教学反馈", "inputs": "输入", "outputs": "输出", "risk_boundary": "仅用于教学与科研训练，不替代临床诊断"})
        request_json("/api/providers/test", "POST", {"provider_id": "openai"})
        request_json("/api/governance/audit", "POST", {"text": "教学反馈"})
    except Exception as exc:
        api_ok = False
        api_evidence.append(repr(exc))
    add("backend APIs callable", api_ok, "; ".join(api_evidence))

    route_failures: list[str] = []
    for route in REQUIRED_ROUTES:
        try:
            html = request_text(f"{FRONTEND_URL}{route}")
            if "MedPath Research & Education Skills Studio" not in html:
                route_failures.append(f"{route}: missing app shell")
        except URLError as exc:
            route_failures.append(f"{route}: {exc}")
        except Exception as exc:
            route_failures.append(f"{route}: {exc!r}")
    add("all required frontend routes served", not route_failures, ", ".join(route_failures[:5]))

    screenshots = list((ROOT / "screenshots").glob("*.png"))
    add("screenshots >= 12", len(screenshots) >= 12, str(len(screenshots)))

    ok = all(status for _, status, _ in checks)
    lines = [
        "# Final Development Audit Report",
        "",
        f"Frontend URL: `{FRONTEND_URL}`",
        f"Backend URL: `{BACKEND_URL}/api/health`",
        "",
        "## Checks",
        "",
        "| Check | Result | Evidence |",
        "|---|---:|---|",
    ]
    for name, status, evidence in checks:
        lines.append(f"| {name} | {'PASS' if status else 'FAIL'} | {evidence.replace('|', '/') if evidence else ''} |")
    lines += [
        "",
        "## Counts",
        "",
        json.dumps(counts, ensure_ascii=False, indent=2),
        "",
        "## Boundary",
        "",
        "- 未宣称 D03 真实上线。",
        "- 未宣称真实课程试点完成。",
        "- 未伪造教师评分、学生问卷或教学效果。",
        "- 医学 AI 输出仅用于教学与科研训练，不替代临床诊断。",
    ]
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round26_github_publish_preflight.json"
DIST = ROOT / "dist" / "github-pages-demo"


SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_\-]{20,}"),
    re.compile(r"(?i)(api[_-]?key|secret|token)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{24,}"),
    re.compile(r"(?i)(password|passwd|pwd)\s*[:=]\s*['\"]?[^\\s'\"<>]{8,}"),
]


TEXT_SUFFIXES = {
    ".py", ".js", ".ts", ".tsx", ".json", ".md", ".yml", ".yaml", ".html", ".css",
    ".txt", ".toml", ".ini", ".env", ".example", ".webmanifest", ".ps1"
}


def run(cmd: list[str]) -> dict[str, str | int]:
    try:
        out = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=10)
        return {"code": out.returncode, "stdout": out.stdout.strip(), "stderr": out.stderr.strip()}
    except Exception as exc:  # pragma: no cover
        return {"code": -1, "stdout": "", "stderr": str(exc)}


def scan_secrets() -> list[dict[str, str | int]]:
    findings: list[dict[str, str | int]] = []
    ignored_parts = {".git", "__pycache__", ".venv", "node_modules"}
    for path in ROOT.rglob("*"):
      if not path.is_file():
        continue
      if any(part in ignored_parts for part in path.parts):
        continue
      if path.suffix.lower() not in TEXT_SUFFIXES and not path.name.endswith(".example"):
        continue
      try:
        text = path.read_text(encoding="utf-8", errors="ignore")
      except Exception:
        continue
      for line_no, line in enumerate(text.splitlines(), 1):
        if "CSU_CHAT_API_KEY=" in line or "OPENAI_API_KEY=" in line or "DEEPSEEK_API_KEY=" in line:
          if "your_" in line.lower() or "placeholder" in line.lower() or line.strip().endswith("="):
            continue
        for pattern in SECRET_PATTERNS:
          if pattern.search(line):
            findings.append({
              "file": str(path.relative_to(ROOT)),
              "line": line_no,
              "excerpt": line[:160],
            })
            break
    return findings


def main() -> int:
    git_inside = run(["git", "rev-parse", "--is-inside-work-tree"])
    git_remote = run(["git", "remote", "get-url", "origin"])
    git_head = run(["git", "log", "--oneline", "-1"])
    git_available = run(["git", "--version"])
    gh_available = run(["gh", "--version"])
    dist_required = [
        DIST / "index.html",
        DIST / "404.html",
        DIST / "static" / "app.js",
        DIST / "static" / "styles.css",
        DIST / "static" / "vendor" / "three.module.min.js",
        DIST / "manifest.webmanifest",
        DIST / "sw.js",
        DIST / "release-manifest.json",
    ]
    missing = [str(p.relative_to(ROOT)) for p in dist_required if not p.exists()]
    secret_findings = scan_secrets()
    result = {
        "git_available": git_available,
        "inside_git_repo": git_inside,
        "git_remote": git_remote,
        "git_head": git_head,
        "gh_available": gh_available,
        "dist_missing": missing,
        "secret_findings": secret_findings,
        "can_publish_now": git_inside["code"] == 0 and git_remote["code"] == 0 and git_head["code"] == 0 and not missing and not secret_findings,
        "next_steps": [
            "如需真实发布，请提供GitHub远程仓库URL或安装并登录gh。",
            "首次公开发布前需要创建commit并推送到main分支。",
            "发布前再次运行本脚本，确认没有明文密钥和静态包缺失。",
            "医学AI输出仅用于教学与科研训练，不替代临床诊断。",
        ],
    }
    REPORT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    failures = []
    if missing:
        failures.append(f"missing dist files: {missing}")
    if secret_findings:
        failures.append(f"possible secrets: {len(secret_findings)}")
    if failures:
        print("FAIL", json.dumps({"failures": failures, **result}, ensure_ascii=False, indent=2))
        return 1
    print("PASS", json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

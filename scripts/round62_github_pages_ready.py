from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist" / "github-pages-demo"
REPORT_JSON = ROOT / "docs" / "round62_github_pages_release_readiness.json"
REPORT_MD = ROOT / "docs" / "round62_github_pages_release_readiness.md"
CURRENT_ROUND = "round71"
CURRENT_CACHE = "medpath-research-companion-v71"


def run(cmd: list[str], timeout: int = 20) -> dict[str, str | int]:
    try:
        out = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=timeout)
        return {
            "code": out.returncode,
            "stdout": out.stdout.strip(),
            "stderr": out.stderr.strip(),
        }
    except FileNotFoundError as exc:
        return {"code": 127, "stdout": "", "stderr": str(exc)}
    except Exception as exc:  # pragma: no cover
        return {"code": -1, "stdout": "", "stderr": str(exc)}


def text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""


def scan_for_secrets() -> list[dict[str, str | int]]:
    findings: list[dict[str, str | int]] = []
    patterns = [
        re.compile(r"sk-[A-Za-z0-9_\-]{20,}"),
        re.compile(r"(?i)(api[_-]?key|secret|token)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{24,}"),
        re.compile(r"(?i)(password|passwd|pwd)\s*[:=]\s*['\"]?[^\\s'\"<>]{8,}"),
    ]
    suffixes = {".py", ".js", ".json", ".md", ".yml", ".yaml", ".html", ".css", ".txt", ".example", ".webmanifest"}
    ignored = {".git", "__pycache__", ".venv", "node_modules", "dist"}
    for path in ROOT.rglob("*"):
        if not path.is_file() or any(part in ignored for part in path.parts):
            continue
        if path.suffix.lower() not in suffixes and not path.name.endswith(".example"):
            continue
        body = text(path)
        for line_no, line in enumerate(body.splitlines(), 1):
            normalized = line.lower()
            if any(name in normalized for name in ["openai_api_key=", "deepseek_api_key=", "csu_chat_api_key=", "qwen_api_key=", "anthropic_api_key="]):
                if "your_" in normalized or "placeholder" in normalized or line.strip().endswith("="):
                    continue
            for pattern in patterns:
                if pattern.search(line):
                    findings.append({"file": str(path.relative_to(ROOT)), "line": line_no, "excerpt": line[:140]})
                    break
    return findings


def main() -> int:
    index = text(DIST / "index.html")
    app = text(DIST / "static" / "app.js")
    styles = text(DIST / "static" / "styles.css")
    pages_yml = text(ROOT / ".github" / "workflows" / "pages.yml")
    ci_yml = text(ROOT / ".github" / "workflows" / "ci.yml")

    required_dist = [
        DIST / "index.html",
        DIST / "404.html",
        DIST / "static" / "app.js",
        DIST / "static" / "styles.css",
        DIST / "static" / "vendor" / "three.module.min.js",
        DIST / "manifest.webmanifest",
        DIST / "sw.js",
        DIST / "release-manifest.json",
    ]
    dist_missing = [str(p.relative_to(ROOT)) for p in required_dist if not p.exists()]

    git_remote = run(["git", "remote", "get-url", "origin"])
    git_log = run(["git", "log", "--oneline", "-1"])
    gh_status = run(["gh", "auth", "status"])
    secret_findings = scan_for_secrets()

    checks = {
        "dist_exists": not dist_missing,
        "dist_uses_current_assets": CURRENT_ROUND in index and CURRENT_CACHE in text(DIST / "sw.js"),
        "dist_has_no_round61_assets": "round61" not in index and "medpath-research-companion-v61" not in text(DIST / "sw.js"),
        "home_command_center_in_static": "home-command-deck" in app and "home-route-result-card" in styles,
        "three_island_in_static": "initThreeIsland3D" in app and "startIslandQuestTour" in app,
        "pages_workflow_present": bool(pages_yml),
        "pages_workflow_uses_current_audit": "round31_content_uniqueness_audit.py" in pages_yml and "round26_github_publish_preflight.py" in pages_yml,
        "ci_workflow_present": bool(ci_yml),
        "ci_workflow_uses_current_audit": "round31_content_uniqueness_audit.py" in ci_yml and "round26_github_publish_preflight.py" in ci_yml,
        "no_secret_findings": not secret_findings,
        "has_git_remote": git_remote["code"] == 0,
        "has_commit": git_log["code"] == 0,
        "gh_available": gh_status["code"] != 127,
    }

    external_blockers = []
    if not checks["has_git_remote"]:
        external_blockers.append("当前仓库尚未绑定 GitHub origin 远程地址。")
    if not checks["has_commit"]:
        external_blockers.append("当前 main 分支尚未创建首次提交。")
    if not checks["gh_available"]:
        external_blockers.append("本机未发现 gh CLI，无法从本地直接创建仓库或检查 GitHub 登录态。")

    hard_failures = [
        key for key in [
            "dist_exists",
            "dist_uses_current_assets",
            "dist_has_no_round61_assets",
            "home_command_center_in_static",
            "three_island_in_static",
            "pages_workflow_present",
            "pages_workflow_uses_current_audit",
            "ci_workflow_present",
            "ci_workflow_uses_current_audit",
            "no_secret_findings",
        ]
        if not checks[key]
    ]
    status = "ready_except_external_publish" if not hard_failures else "failed"
    result = {
        "status": status,
        "checks": checks,
        "dist_missing": dist_missing,
        "secret_findings": secret_findings,
        "git_remote": git_remote,
        "git_log": git_log,
        "gh_status": gh_status,
        "external_blockers": external_blockers,
        "hard_failures": hard_failures,
    }
    REPORT_JSON.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    md = [
        "# Round62 GitHub Pages 发布准备审计",
        "",
        f"状态：`{status}`",
        "",
        "## 已通过的发布工程检查",
        "",
        f"- 静态包完整：{checks['dist_exists']}",
        f"- 静态包版本为 {CURRENT_ROUND}：{checks['dist_uses_current_assets']}",
        f"- 静态包未残留 Round61 资源引用：{checks['dist_has_no_round61_assets']}",
        f"- 首页科研需求驾驶台已进入静态包：{checks['home_command_center_in_static']}",
        f"- Three.js 科研小岛已进入静态包：{checks['three_island_in_static']}",
        f"- GitHub Pages workflow 存在：{checks['pages_workflow_present']}",
        f"- Pages workflow 使用当前审计链：{checks['pages_workflow_uses_current_audit']}",
        f"- CI workflow 使用当前审计链：{checks['ci_workflow_uses_current_audit']}",
        f"- 明文密钥扫描通过：{checks['no_secret_findings']}",
        "",
        "## 外部发布阻塞",
        "",
    ]
    if external_blockers:
        md.extend([f"- {item}" for item in external_blockers])
    else:
        md.append("- 未发现外部发布阻塞。")
    md.extend([
        "",
        "## 推荐发布步骤",
        "",
        "```powershell",
        'cd "C:\\Users\\HONOR\\Desktop\\AI skill\\medpath-research-education-skills-studio-real"',
        "python scripts\\build_static_release.py",
        "python scripts\\round62_github_pages_ready.py",
        "git remote add origin https://github.com/<user>/<repo>.git",
        "git add .",
        'git commit -m "Build MedPath research companion public demo"',
        "git push -u origin main",
        "```",
        "",
        "推送后在 GitHub 仓库 Settings → Pages 中选择 GitHub Actions。`.github/workflows/pages.yml` 会构建 `dist/github-pages-demo` 并部署。",
        "",
        "## 边界声明",
        "",
        "- 本审计不代表已经公开上线。",
        "- 本仓库未包含真实 API Key、HPC 密码、真实患者数据或真实课程试点结果。",
        "- 医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。",
    ])
    REPORT_MD.write_text("\n".join(md) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if hard_failures else 0


if __name__ == "__main__":
    raise SystemExit(main())

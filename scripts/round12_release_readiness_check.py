from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"
APP_JS = ROOT / "apps" / "web" / "static" / "app.js"
CSS = ROOT / "apps" / "web" / "static" / "styles.css"
STATIC_DIST = ROOT / "dist" / "github-pages-demo"


def load_json(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8-sig"))


def unique_count(items: list[dict], path: tuple[str, ...]) -> int:
    values = []
    for item in items:
        value = item
        for key in path:
            value = value.get(key, {}) if isinstance(value, dict) else {}
        values.append(str(value))
    return len(set(values))


def secret_hits() -> list[str]:
    patterns = [
        re.compile(r"sk-[A-Za-z0-9]{20,}"),
        re.compile(r"AIza[0-9A-Za-z\-_]{20,}"),
        re.compile(r"xox[baprs]-[0-9A-Za-z-]{20,}"),
        re.compile(r"-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----"),
        re.compile(r"(?i)(api[_-]?key|secret|token)\s*[:=]\s*['\"][^'\"]{16,}['\"]"),
    ]
    hits: list[str] = []
    for path in ROOT.rglob("*"):
        if any(part in {".git", "__pycache__", ".venv", "node_modules"} for part in path.parts):
            continue
        if path.is_file() and path.suffix.lower() in {".py", ".js", ".ts", ".css", ".md", ".json", ".yaml", ".yml", ".txt", ".example"}:
            text = path.read_text(encoding="utf-8", errors="ignore")
            matched = False
            for line in text.splitlines():
                if "re.compile(" in line or "SECRET_PATTERNS" in line:
                    continue
                if "your_" in line.lower() or "placeholder" in line.lower() or "占位" in line:
                    continue
                if any(pattern.search(line) for pattern in patterns):
                    matched = True
                    break
            if matched:
                hits.append(str(path.relative_to(ROOT)))
    return sorted(set(hits))


def has_viewport_font_scaling(css: str) -> bool:
    """Forbid viewport-scaled font sizes while allowing responsive spacing."""
    return bool(re.search(r"font-size\s*:\s*clamp\(", css, flags=re.IGNORECASE))


def oversized_plain_card_radius_hits(css: str) -> list[str]:
    """Flag large radii only on plain content cards/panels.

    Round 60+ added a pet mentor, 3D island, circular action buttons, and
    mobile-app mockups. Those intentionally use circles and pills. This gate
    should prevent oversized ordinary cards, not flatten the whole visual
    identity.
    """
    allow_tokens = (
        "pill",
        "badge",
        "avatar",
        "pet",
        "island",
        "bubble",
        "fab",
        "button",
        "btn",
        "icon",
        "phone",
        "mobile",
        "mockup",
        "hero",
        "orbit",
        "route-dot",
        "step-index",
        "timeline-dot",
        "compass",
        "consent",
        "toggle",
    )
    hits: list[str] = []
    for index, line in enumerate(css.splitlines(), 1):
        lower = line.lower()
        if "border-radius" not in lower:
            continue
        if any(token in lower for token in allow_tokens):
            continue
        if "50%" in lower or "999px" in lower or "inherit" in lower:
            continue
        if re.search(r"border-radius:\s*(1[0-9]|[2-9][0-9])px", lower):
            hits.append(f"L{index}: {line.strip()}")
    return hits


def main() -> None:
    methods = load_json("method_universe.json")
    articles = load_json("article_skill_workflows.json")
    plots = load_json("plot_gallery_taxonomy.json")
    tools = load_json("open_source_catalog.json")
    audits = load_json("data_audit_rules.json")
    gene = load_json("gene_perturbation_methods.json")
    app = APP_JS.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")

    checks: list[tuple[str, bool, str]] = []
    checks.append(("方法库不少于300项", len(methods) >= 300, str(len(methods))))
    checks.append(("基因敲除/扰动方法不少于10项", len(gene) >= 10, str(len(gene))))
    checks.append(("文章Skill不少于20类", len(articles) >= 20, str(len(articles))))
    checks.append(("科研绘图室不少于80种图", len(plots) >= 80, str(len(plots))))
    checks.append(("数据审查规则不少于50条", len(audits) >= 50, str(len(audits))))
    checks.append(("开源工具不少于80个", len(tools) >= 80, str(len(tools))))

    checks.append(("方法详情图全部唯一", unique_count(methods, ("example_visual", "url")) == len(methods), str(unique_count(methods, ("example_visual", "url")))))
    checks.append(("图谱详情图全部唯一", unique_count(plots, ("example_visual", "url")) == len(plots), str(unique_count(plots, ("example_visual", "url")))))
    checks.append(("文章流程详情图全部唯一", unique_count(articles, ("example_visual", "url")) == len(articles), str(unique_count(articles, ("example_visual", "url")))))
    checks.append(("开源工具详情图全部唯一", unique_count(tools, ("example_visual", "url")) == len(tools), str(unique_count(tools, ("example_visual", "url")))))

    required_routes = [
        "/journey-builder",
        "/method-universe",
        "/method-family/gene-perturbation",
        "/article-workshop",
        "/plot-gallery",
        "/open-source",
        "/model-gateway",
        "/island-3d",
    ]
    for route in required_routes:
        checks.append((f"前端入口存在：{route}", route in app, route))

    checks.append(("研究路径生成器函数存在", "journeyBuilderPage" in app and "renderJourneyPlan" in app, "journeyBuilderPage/renderJourneyPlan"))
    checks.append(("医学AI边界文本存在", "不替代临床诊断" in app, "不替代临床诊断"))
    radius_hits = oversized_plain_card_radius_hits(css)
    checks.append(("CSS无viewport字号缩放", not has_viewport_font_scaling(css), "font-size clamp absent"))
    checks.append(("普通界面圆角不超过8px", not radius_hits, "; ".join(radius_hits[:5]) or "plain card radius check"))
    checks.append(("静态发布包存在", (STATIC_DIST / "index.html").exists(), str(STATIC_DIST / "index.html")))
    checks.append(("GitHub Pages fallback存在", (STATIC_DIST / "404.html").exists(), str(STATIC_DIST / "404.html")))
    checks.append(("静态数据目录存在", (STATIC_DIST / "static-data" / "method_universe.json").exists(), str(STATIC_DIST / "static-data")))

    leaks = secret_hits()
    checks.append(("未发现明文密钥模式", not leaks, ", ".join(leaks) or "none"))

    lines = [
        "# Round12 发布准备检查报告",
        "",
        "| 检查项 | 结果 | 证据 |",
        "|---|---:|---|",
    ]
    lines.extend(f"| {name} | {'PASS' if ok else 'FAIL'} | {detail} |" for name, ok, detail in checks)
    lines.extend(
        [
            "",
            "## 边界声明",
            "",
            "本报告只证明本地原型、内容库和前端入口的阶段性发布准备状态，不代表真实D03上线、真实课程试点、真实教学效果或临床诊断能力。医学AI输出仅用于教学与科研训练，不替代临床诊断。",
        ]
    )
    (DOCS / "round12_release_readiness_report.md").write_text("\n".join(lines), encoding="utf-8")

    failed = [name for name, ok, _ in checks if not ok]
    if failed:
        raise SystemExit("Round12 release readiness failed: " + "; ".join(failed))
    print("Round12 release readiness PASS")


if __name__ == "__main__":
    main()

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8-sig"))


def main() -> None:
    checks: list[tuple[str, bool, str]] = []
    methods = load("method_universe.json")
    gene_methods = load("gene_perturbation_methods.json")
    articles = load("article_skill_workflows.json")
    if isinstance(articles, dict):
        article_count = len(articles.get("article_types", []))
    else:
        article_count = len(articles)
    plots = load("plot_gallery_taxonomy.json")
    audits = load("data_audit_rules.json")
    buildings = load("research_island_buildings.json")
    dialogues = load("pet_dialogues.json")
    model_gateway = load("model_gateway_templates.json")

    checks.append(("方法宇宙不少于360条", len(methods) >= 360, str(len(methods))))
    checks.append(("基因敲除/扰动方法不少于20条", len(gene_methods) >= 20, str(len(gene_methods))))
    checks.append(("文章工作流不少于24类", article_count >= 24, str(article_count)))
    checks.append(("科研图谱不少于90种", len(plots) >= 90, str(len(plots))))
    checks.append(("数据审查规则不少于50条", len(audits) >= 50, str(len(audits))))
    checks.append(("科研小岛建筑不少于8个", len(buildings) >= 8, str(len(buildings))))
    checks.append(("桌宠提示不少于50条", len(dialogues) >= 50, str(len(dialogues))))

    checks.append(("Model Gateway providers >= 6", len(model_gateway.get("providers", [])) >= 6, str(len(model_gateway.get("providers", [])))))
    checks.append(("Model Gateway task types >= 5", len(model_gateway.get("task_types", [])) >= 5, str(len(model_gateway.get("task_types", [])))))

    required_docs = [
        "round11_product_master_plan.md",
        "round11_execution_matrix.md",
        "round11_platform_upgrade_report.md",
        "round11_figma_mobile_design_report.md",
        "round11_github_publish_plan.md",
    ]
    for doc in required_docs:
        path = DOCS / doc
        checks.append((f"文档存在：{doc}", path.exists(), str(path)))

    app_js = (ROOT / "apps/web/static/app.js").read_text(encoding="utf-8")
    for route in ["/method-universe", "/article-workshop", "/plot-gallery", "/data-audit", "/island", "/model-gateway", "/island-3d"]:
        checks.append((f"前端路由存在：{route}", route in app_js, route))

    secret_pattern = re.compile(r"(sk-[A-Za-z0-9]{20,}|api[_-]?key\\s*[:=]\\s*['\\\"][^'\\\"]{12,})", re.I)
    secret_hits = []
    for path in list((ROOT / "apps").rglob("*")) + list((ROOT / "data").rglob("*")) + list((ROOT / "docs").rglob("*.md")):
        if path.is_file() and path.suffix.lower() in {".py", ".js", ".json", ".md", ".txt", ".yml", ".yaml"}:
            text = path.read_text(encoding="utf-8", errors="ignore")
            if secret_pattern.search(text):
                secret_hits.append(str(path.relative_to(ROOT)))
    checks.append(("未发现明显API Key样式明文", not secret_hits, ", ".join(secret_hits) or "none"))

    failed = [row for row in checks if not row[1]]
    lines = ["# Round 11 Final Build Audit", "", "| 检查项 | 结果 | 证据 |", "|---|---:|---|"]
    lines.extend(f"| {name} | {'PASS' if ok else 'FAIL'} | {detail} |" for name, ok, detail in checks)
    lines.append("")
    lines.append("医学AI输出仅用于教学与科研训练，不替代临床诊断；本轮未声明真实课程试点、真实D03/D10上线或真实教学效果。")
    (DOCS / "round11_final_audit_report.md").write_text("\n".join(lines), encoding="utf-8")
    if failed:
        raise SystemExit("Round11 checks failed: " + "; ".join(name for name, _, _ in failed))
    print("Round11 checks PASS")


if __name__ == "__main__":
    main()

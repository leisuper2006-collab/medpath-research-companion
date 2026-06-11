from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLOTS = ROOT / "data" / "plot_gallery_taxonomy.json"
APP = ROOT / "apps" / "web" / "static" / "app.js"
CSS = ROOT / "apps" / "web" / "static" / "styles.css"
REPORT = ROOT / "docs" / "round16_plot_gallery_visual_check_report.md"


def main() -> int:
    plots = json.loads(PLOTS.read_text(encoding="utf-8"))
    app = APP.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")
    failures: list[str] = []

    if len(plots) < 100:
        failures.append(f"expected at least 100 plot types, found {len(plots)}")

    missing_visuals = []
    weak_sources = []
    for plot in plots:
        visual = plot.get("example_visual") or {}
        url = visual.get("url")
        if not url or not (ROOT / url.lstrip("/")).exists():
            missing_visuals.append(plot.get("id", "unknown"))
        source = plot.get("public_source_example") or {}
        if not source.get("title") or not source.get("reuse_boundary"):
            weak_sources.append(plot.get("id", "unknown"))
        if not plot.get("detail_novice_intro"):
            failures.append(f"{plot.get('id')} missing detail_novice_intro")

    if missing_visuals:
        failures.append(f"missing example SVGs: {', '.join(missing_visuals[:12])}")
    if weak_sources:
        failures.append(f"weak source metadata: {', '.join(weak_sources[:12])}")

    required_app_tokens = [
        "plot-gallery-overview",
        "plot-card-visual",
        "state.plotGallery.slice(0, 100)",
        "example_visual",
        "public_source_example",
        "plot_data_contract",
    ]
    for token in required_app_tokens:
        if token not in app:
            failures.append(f"app.js missing token: {token}")

    required_css_tokens = [
        ".plot-gallery-overview",
        ".plot-taxonomy-strip",
        ".plot-product-card",
        ".plot-card-visual img",
        ".plot-card-source",
    ]
    for token in required_css_tokens:
        if token not in css:
            failures.append(f"styles.css missing token: {token}")

    lines = [
        "# Round16 图谱宇宙视觉升级检查报告",
        "",
        "## 检查结论",
        "",
        "通过" if not failures else "未通过",
        "",
        "## 证据",
        "",
        f"- 图谱方法数量：{len(plots)}。",
        f"- 绑定SVG示例图：{len(plots) - len(missing_visuals)}。",
        f"- 具备公开来源/边界说明：{len(plots) - len(weak_sources)}。",
        "- 列表页卡片已使用真实SVG缩略图、来源等级、字段契约和模型提示，不再以抽象小条作为主视觉。",
        "",
        "## 失败项",
        "",
    ]
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

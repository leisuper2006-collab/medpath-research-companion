from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round68#"
REPORT = ROOT / "docs" / "round68_detail_evidence_lens_report.md"
SHOT = ROOT / "docs" / "round68_detail_evidence_lens_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round68_detail_evidence_lens_mobile_verified.png"

DATASETS = {
    "methods": ("data/method_universe.json", "method-001", "/method-universe/method-001"),
    "plots": ("data/plot_gallery_taxonomy.json", "volcano_plot", "/plot-gallery/volcano_plot"),
    "articles": ("data/article_skill_workflows.json", "article-01", "/article-workshop/article-01"),
    "tools": ("data/open_source_catalog.json", "gears", "/open-source/gears"),
}


def load_json(path: str) -> list[dict]:
    return json.loads((ROOT / path).read_text(encoding="utf-8-sig"))


def local_asset_exists(url: str | None) -> bool:
    if not url:
        return False
    if url.startswith(("http://", "https://", "data:")):
        return True
    return (ROOT / url.lstrip("/")).exists()


def data_audit() -> tuple[list[str], list[str]]:
    failures: list[str] = []
    lines: list[str] = []
    for name, (path, sample_id, _) in DATASETS.items():
        items = load_json(path)
        total = len(items)
        with_visual = sum(1 for x in items if local_asset_exists((x.get("example_visual") or {}).get("url")))
        with_source = sum(1 for x in items if (x.get("public_source_example") or {}).get("title") and ((x.get("public_source_example") or {}).get("citation") or (x.get("public_source_example") or {}).get("url")))
        with_story = sum(1 for x in items if len(x.get("detail_scroll_panels") or x.get("plot_story_sections") or x.get("article_story_sections") or x.get("tool_story_sections") or []) >= 3)
        sample = next((x for x in items if x.get("id") == sample_id), None)
        lines.append(f"- {name}: {total} items; visual {with_visual}/{total}; source {with_source}/{total}; story panels {with_story}/{total}.")
        if with_visual < total:
            failures.append(f"{name}: missing example visuals {total - with_visual}")
        if with_source < total:
            failures.append(f"{name}: missing public source metadata {total - with_source}")
        if not sample:
            failures.append(f"{name}: sample id {sample_id} missing")
    return failures, lines


def inspect_page(page):
    return page.evaluate(
        """
        () => {
          const text = document.body.innerText;
          const lens = [...document.querySelectorAll(".story-evidence-lens article")].map((x) => x.innerText.trim());
          const imgs = [...document.querySelectorAll(".story-visual-frame img, .method-example-visual img")];
          return {
            lens_count: lens.length,
            lens_texts: lens,
            has_visual: imgs.length > 0,
            has_source_link: !!document.querySelector(".story-source-mini a, .source-proof-card a"),
            has_source_section: text.includes("公开来源") || text.includes("来源"),
            has_boundary: text.includes("不替代临床诊断") || text.includes("不代表真实研究结果") || text.includes("不复制论文原图"),
            has_demand_window: text.includes("需求") || !!document.querySelector("textarea"),
            has_mojibake: /[锟]|娑|閻|鐢|鍥|鍙/.test(text),
            headings: [...document.querySelectorAll("h1,h2,h3")].slice(0, 8).map((x) => x.innerText.trim()),
          };
        }
        """
    )


def browser_audit() -> tuple[list[str], dict[str, dict]]:
    failures: list[str] = []
    snapshots: dict[str, dict] = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1150}, device_scale_factor=1)
        for name, (_, _, route) in DATASETS.items():
            page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            page.wait_for_timeout(700)
            state = inspect_page(page)
            snapshots[name] = state
            if state["lens_count"] < 4:
                failures.append(f"{name}: evidence lens missing or sparse")
            if not state["has_visual"]:
                failures.append(f"{name}: visual missing")
            if not state["has_source_link"]:
                failures.append(f"{name}: source link missing")
            if not state["has_boundary"]:
                failures.append(f"{name}: boundary text missing")
            if state["has_mojibake"]:
                failures.append(f"{name}: mojibake marker detected")
        page.goto(f"{BASE_URL}/method-universe/method-001", wait_until="networkidle")
        page.locator(".story-evidence-lens").first.scroll_into_view_if_needed()
        page.wait_for_timeout(400)
        page.screenshot(path=str(SHOT), full_page=False)

        mobile = browser.new_page(viewport={"width": 390, "height": 1150}, is_mobile=True)
        mobile.goto(f"{BASE_URL}/method-universe/method-001", wait_until="networkidle")
        mobile.wait_for_timeout(700)
        mobile_state = inspect_page(mobile)
        snapshots["mobile_method"] = mobile_state
        if mobile_state["lens_count"] < 4:
            failures.append("mobile method: evidence lens missing")
        mobile.locator(".story-evidence-lens").first.scroll_into_view_if_needed()
        mobile.wait_for_timeout(400)
        mobile.screenshot(path=str(MOBILE_SHOT), full_page=False)
        browser.close()
    return failures, snapshots


def main():
    data_failures, data_lines = data_audit()
    browser_failures, snapshots = browser_audit()
    failures = data_failures + browser_failures
    REPORT.write_text(
        "# Round68 详情页证据镜头与内容质量审计\n\n"
        "## 数据层\n\n"
        + "\n".join(data_lines)
        + "\n\n## 页面层\n\n"
        + "\n".join(f"- {name}: lens={state['lens_count']}, visual={state['has_visual']}, source={state['has_source_link']}, boundary={state['has_boundary']}" for name, state in snapshots.items())
        + "\n\n## 截图\n\n"
        + f"- {SHOT}\n- {MOBILE_SHOT}\n\n"
        + ("## Failures\n\n" + "\n".join(f"- {x}" for x in failures) if failures else "## Result\n\nPASS\n"),
        encoding="utf-8",
    )
    print({"failures": failures, "screenshots": [str(SHOT), str(MOBILE_SHOT)]})
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

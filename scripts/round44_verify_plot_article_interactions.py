from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE = "http://127.0.0.1:4173"
CHROME_CANDIDATES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
]


def chrome_path() -> str | None:
    for candidate in CHROME_CANDIDATES:
        if candidate.exists():
            return str(candidate)
    return None


def has_mojibake(text: str) -> bool:
    markers = ["涓", "鐢", "鍥", "鍙", "绉", "鎶", "锛", "鏂"]
    return any(marker in text for marker in markers)


def main() -> None:
    out_plot = ROOT / "docs" / "round44_plot_demand_package.png"
    out_article = ROOT / "docs" / "round44_article_prompt_buttons.png"
    with sync_playwright() as p:
        executable_path = chrome_path()
        launch_kwargs = {"headless": True}
        if executable_path:
            launch_kwargs["executable_path"] = executable_path
        browser = p.chromium.launch(**launch_kwargs)
        page = browser.new_page(viewport={"width": 1280, "height": 820})

        page.goto(f"{BASE}/?fresh=round44playwright#/plot-gallery/oncoprint_matrix", wait_until="domcontentloaded")
        page.wait_for_timeout(1200)
        page.locator("#plot-demand-lab").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        page.locator("#plot-demand-build").click()
        page.wait_for_timeout(500)
        result = page.locator("#plot-demand-result")
        result_text = result.inner_text()
        body_text = page.locator("body").inner_text()
        plot_state = {
            "has_demand_textarea": page.locator("#plot-demand").count() == 1,
            "has_result_title": result.locator("h2").count() >= 1,
            "has_task_grid": result.locator(".task-package-grid").count() == 1,
            "has_model_prompt": "模型网关" in result_text or "prompt" in result_text.lower(),
            "has_safety_boundary": "不替代临床诊断" in result_text,
            "has_public_source_links": result.locator("a[data-link]").count() >= 1,
            "body_has_mojibake": has_mojibake(body_text),
        }
        page.screenshot(path=str(out_plot), full_page=False)

        page.goto(f"{BASE}/?fresh=round44playwright#/article-workshop/article-01", wait_until="domcontentloaded")
        page.wait_for_timeout(1200)
        article_body = page.locator("body").inner_text()
        article_state = {
            "starter_buttons": page.locator(".story-demand-prompt .starter").count(),
            "has_article_builder": page.locator("#article-build").count() == 1,
            "has_story_panel": page.locator(".product-feature-story").count() >= 1,
            "body_has_mojibake": has_mojibake(article_body),
        }
        page.screenshot(path=str(out_article), full_page=False)
        browser.close()

    report = {"plot": plot_state, "article": article_state, "screenshots": [str(out_plot), str(out_article)]}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    failing = []
    if not all(
        [
            plot_state["has_demand_textarea"],
            plot_state["has_result_title"],
            plot_state["has_task_grid"],
            plot_state["has_model_prompt"],
            plot_state["has_safety_boundary"],
            plot_state["has_public_source_links"],
        ]
    ):
        failing.append("plot-demand-package")
    if plot_state["body_has_mojibake"]:
        failing.append("plot-page-mojibake")
    if article_state["starter_buttons"] < 1 or not article_state["has_article_builder"] or not article_state["has_story_panel"]:
        failing.append("article-prompt-buttons")
    if article_state["body_has_mojibake"]:
        failing.append("article-page-mojibake")
    if failing:
        raise SystemExit("failed: " + ", ".join(failing))


if __name__ == "__main__":
    main()

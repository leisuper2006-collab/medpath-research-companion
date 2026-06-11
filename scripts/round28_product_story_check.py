import json
import time
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)


ROUTES = [
    "/method-universe/method-001",
    "/article-workshop/article-01",
    "/plot-gallery/volcano_plot",
    "/open-source/celltypist",
]


def chrome_candidates():
    return [
        Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
        Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    ]


def find_browser():
    for candidate in chrome_candidates():
        if candidate.exists():
            return str(candidate)
    return None


def main():
    base_url = "http://127.0.0.1:3000"
    executable = find_browser()
    results = []
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=executable) if executable else p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 960})
        page.on("console", lambda msg: errors.append({"type": msg.type, "text": msg.text}) if msg.type in {"error", "warning"} else None)
        for route in ROUTES:
            page.goto(f"{base_url}{route}?round28check={int(time.time()*1000)}", wait_until="domcontentloaded")
            page.wait_for_timeout(900)
            info = page.evaluate(
                """() => ({
                    route: location.pathname,
                    heading: document.querySelector('h1')?.textContent || '',
                    productStories: document.querySelectorAll('.product-feature-story').length,
                    storyChapters: document.querySelectorAll('.story-chapter').length,
                    oldStorySections: document.querySelectorAll('.product-story-sections').length,
                    storyImages: Array.from(document.querySelectorAll('.story-visual-frame img')).map(img => ({
                        src: img.getAttribute('src'),
                        complete: img.complete,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    })),
                    hasUnknownMarkers: document.body.innerText.includes('????') || document.body.innerText.includes('???'),
                    hasSourceProof: document.querySelectorAll('.source-proof-card, .story-source-mini').length,
                    hasDemandOrPrompt: !!document.querySelector('.story-demand-prompt, .demand-lab, .article-model-box')
                })"""
            )
            results.append(info)
        page.screenshot(path=str(DOCS / "round28_product_story_check.png"), full_page=False)
        browser.close()

    failures = []
    for item in results:
        if item["productStories"] < 1:
            failures.append(f"{item['route']} missing product-feature-story")
        if item["storyChapters"] < 3:
            failures.append(f"{item['route']} has too few story chapters")
        if item["oldStorySections"] != 0:
            failures.append(f"{item['route']} still uses old product-story-sections")
        if not item["storyImages"] or any((not img["complete"] or img["width"] <= 0 or img["height"] <= 0) for img in item["storyImages"]):
            failures.append(f"{item['route']} has unloaded story image")
        if item["hasUnknownMarkers"]:
            failures.append(f"{item['route']} contains unknown marker question marks")
        if item["hasSourceProof"] < 1:
            failures.append(f"{item['route']} missing source proof")
        if not item["hasDemandOrPrompt"]:
            failures.append(f"{item['route']} missing demand/model prompt surface")

    report = {
        "status": "PASS" if not failures and not errors else "FAIL",
        "routes": results,
        "console_errors_or_warnings": errors,
        "failures": failures,
        "screenshot": str(DOCS / "round28_product_story_check.png"),
    }
    (DOCS / "round28_product_story_check.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report["status"] != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()

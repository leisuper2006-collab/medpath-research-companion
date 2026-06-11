import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round27_static_asset_check.json"
SCREENSHOT = ROOT / "docs" / "round27_static_asset_verified.png"
CHROME_CANDIDATES = [
    Path(os.environ["CHROME_PATH"]) if os.environ.get("CHROME_PATH") else None,
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    (Path(os.environ["LOCALAPPDATA"]) / r"Google\Chrome\Application\chrome.exe") if os.environ.get("LOCALAPPDATA") else None,
]


def main():
    url = "http://127.0.0.1:4173/"
    failures = []
    chrome_path = next((path for path in CHROME_CANDIDATES if path and path.exists()), None)
    with sync_playwright() as p:
        launch_options = {"headless": True}
        if chrome_path:
            launch_options["executable_path"] = str(chrome_path)
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        console_errors = []
        http_errors = []
        page.on("console", lambda msg: console_errors.append({"type": msg.type, "text": msg.text}) if msg.type in {"error", "warning"} else None)
        page.on("response", lambda res: http_errors.append({"status": res.status, "url": res.url}) if res.status >= 400 else None)
        page.goto(url, wait_until="domcontentloaded")
        page.evaluate("navigate('/method-universe/method-001')")
        page.wait_for_timeout(800)
        state = page.evaluate(
            """() => {
              const images = Array.from(document.images).map(img => ({
                src: img.currentSrc || img.src,
                complete: img.complete,
                width: img.naturalWidth,
                height: img.naturalHeight,
                alt: img.alt
              }));
              return {
                url: location.href,
                title: document.title,
                h1: document.querySelector('h1')?.textContent?.trim() || '',
                hasMethodPage: document.body.innerText.includes('基因敲除入门流程'),
                hasSource: document.body.innerText.includes('公开来源') || document.body.innerText.includes('cBioPortal'),
                images
              };
            }"""
        )
        relevant_images = [img for img in state["images"] if "outputs/" in img["src"] or "static/" in img["src"]]
        broken = [img for img in relevant_images if not img["complete"] or img["width"] <= 0 or img["height"] <= 0]
        if not state["hasMethodPage"]:
            failures.append("static method detail page did not render")
        if not state["hasSource"]:
            failures.append("static method detail page missing source proof text")
        if broken:
            failures.append(f"broken static images: {len(broken)}")
        meaningful_http_errors = [
            err for err in http_errors
            if not err["url"].endswith("/favicon.ico")
        ]
        meaningful_console_errors = [
            err for err in console_errors
            if "favicon.ico" not in err["text"]
        ]
        if meaningful_http_errors:
            failures.append(f"http errors: {meaningful_http_errors[:3]}")
        if meaningful_console_errors:
            failures.append(f"console issues: {len(meaningful_console_errors)}")
        page.screenshot(path=str(SCREENSHOT), full_page=False)
        browser.close()

    payload = {
        "url": url,
        "state": state,
        "relevant_image_count": len(relevant_images),
        "broken_images": broken,
        "console_errors": console_errors,
        "http_errors": http_errors,
        "screenshot": str(SCREENSHOT),
        "failures": failures,
    }
    REPORT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

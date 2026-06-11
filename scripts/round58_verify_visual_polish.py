from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE = "http://127.0.0.1:4173"
CHROME_CANDIDATES = [
    Path(os.environ["CHROME_PATH"]) if os.environ.get("CHROME_PATH") else None,
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    (Path(os.environ["LOCALAPPDATA"]) / r"Google\Chrome\Application\chrome.exe") if os.environ.get("LOCALAPPDATA") else None,
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
]
MOJIBAKE_MARKERS = ["涓", "鐢", "鍥", "鍙", "閻", "娑", "缁", "乱码"]


def chrome_path() -> str | None:
    for candidate in CHROME_CANDIDATES:
        if candidate and candidate.exists():
            return str(candidate)
    return None


def has_mojibake(text: str) -> bool:
    return any(marker in text for marker in MOJIBAKE_MARKERS)


def render_state(page):
    body = page.locator("body").inner_text()
    return {
        "url": page.url,
        "title": page.title(),
        "h1": page.locator("h1").first.inner_text() if page.locator("h1").count() else "",
        "body_has_mojibake": has_mojibake(body),
        "hero_count": page.locator(".premium-home-hero").count(),
        "atlas_stage_count": page.locator(".home-atlas-stage").count(),
        "pet_bubble_count": page.locator(".pet-bubble").count(),
        "product_story_count": page.locator(".product-feature-story").count(),
        "source_hero_count": page.locator(".source-detail-hero").count(),
        "source_visual_count": page.locator(".source-detail-figure, .source-visual-card img").count(),
    }


def image_state(page):
    return page.evaluate(
        """() => Array.from(document.images).map((img) => ({
          src: img.currentSrc || img.src,
          complete: img.complete,
          width: img.naturalWidth,
          height: img.naturalHeight,
          alt: img.alt || ""
        }))"""
    )


def main() -> None:
    docs = ROOT / "docs"
    docs.mkdir(exist_ok=True)
    screenshots = {
        "home": docs / "round58_home_visual_polish.png",
        "source": docs / "round58_source_detail_visual_polish.png",
        "mobile": docs / "round58_mobile_home_visual_polish.png",
    }
    report_path = docs / "round58_visual_polish_check.json"
    failures: list[str] = []

    with sync_playwright() as p:
        launch_options = {"headless": True}
        executable = chrome_path()
        if executable:
            launch_options["executable_path"] = executable
        browser = p.chromium.launch(**launch_options)

        home = browser.new_page(viewport={"width": 1440, "height": 920})
        home.goto(f"{BASE}/?fresh=round58#/", wait_until="domcontentloaded")
        home.wait_for_timeout(1600)
        home_state = render_state(home)
        home.screenshot(path=str(screenshots["home"]), full_page=False)

        source = browser.new_page(viewport={"width": 1440, "height": 960})
        source.goto(f"{BASE}/?fresh=round58#/source-library/ccle_broad_2025", wait_until="domcontentloaded")
        source.wait_for_timeout(1800)
        source_state = render_state(source)
        source_images = image_state(source)
        source.screenshot(path=str(screenshots["source"]), full_page=False)

        mobile = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True)
        mobile.goto(f"{BASE}/?fresh=round58#/", wait_until="domcontentloaded")
        mobile.wait_for_timeout(1400)
        mobile_state = render_state(mobile)
        mobile.screenshot(path=str(screenshots["mobile"]), full_page=False)

        browser.close()

    visual_images = [
        img for img in source_images
        if ("outputs/" in img["src"] or "source_visual_examples" in img["src"] or "public_source" in img["src"])
    ]
    large_visuals = [img for img in visual_images if img["complete"] and img["width"] >= 300 and img["height"] >= 180]

    if home_state["hero_count"] < 1:
        failures.append("home premium hero missing")
    if home_state["atlas_stage_count"] < 1:
        failures.append("home atlas stage missing")
    if home_state["pet_bubble_count"] < 1:
        failures.append("desk pet missing")
    if source_state["source_hero_count"] < 1:
        failures.append("source detail hero missing")
    if source_state["product_story_count"] < 1:
        failures.append("source Apple-like product story missing")
    if not large_visuals:
        failures.append("source detail page missing large public visual example")
    if mobile_state["body_has_mojibake"] or home_state["body_has_mojibake"] or source_state["body_has_mojibake"]:
        failures.append("page contains mojibake markers")

    payload = {
        "home": home_state,
        "source": source_state,
        "mobile": mobile_state,
        "large_source_visuals": large_visuals[:5],
        "screenshots": {k: str(v) for k, v in screenshots.items()},
        "failures": failures,
    }
    report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

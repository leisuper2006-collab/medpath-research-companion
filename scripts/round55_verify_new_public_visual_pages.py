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
    markers = ["涓", "鐢", "鍥", "鍙", "閻", "娑", "缁", "乱码"]
    return any(marker in text for marker in markers)


def loaded_images(page) -> list[dict]:
    return page.evaluate(
        """() => Array.from(document.querySelectorAll('.source-detail-figure, .source-visual-card img')).map((img) => ({
            src: img.getAttribute('src'),
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            alt: img.getAttribute('alt') || ''
        }))"""
    )


def check_source_page(page, source_id: str, screenshot_name: str) -> dict:
    page.goto(f"{BASE}/?fresh=round55source#/{'source-library'}/{source_id}", wait_until="domcontentloaded")
    page.wait_for_timeout(1200)
    page.locator("#source-visual").scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    text = page.locator("body").inner_text()
    images = loaded_images(page)
    good_images = [img for img in images if img["complete"] and img["naturalWidth"] >= 300 and img["naturalHeight"] >= 180]
    screenshot = ROOT / "docs" / screenshot_name
    page.screenshot(path=str(screenshot), full_page=False)
    return {
        "source_id": source_id,
        "title_present": page.locator(".source-detail-hero").count() == 1,
        "visual_section_present": page.locator("#source-visual").count() == 1,
        "visual_cards": page.locator(".source-visual-card").count(),
        "loaded_images": images,
        "good_image_count": len(good_images),
        "has_cbioportal": "cBioPortal" in text,
        "has_teaching_boundary": "教学与科研训练" in text and "不替代临床诊断" in text,
        "has_no_copy_boundary": "不复制论文原图" in text,
        "has_mojibake": has_mojibake(text),
        "screenshot": str(screenshot),
    }


def main() -> None:
    targets = [
        ("ccrcc_dfci_2019", "round55_ccrcc_source_visual_verified.png"),
        ("acc_tcga_pan_can_atlas_2018", "round55_acc_source_visual_verified.png"),
        ("sarc_tcga_pub", "round55_sarc_source_visual_verified.png"),
    ]
    with sync_playwright() as p:
        launch_kwargs = {"headless": True}
        executable_path = chrome_path()
        if executable_path:
            launch_kwargs["executable_path"] = executable_path
        browser = p.chromium.launch(**launch_kwargs)
        page = browser.new_page(viewport={"width": 1440, "height": 1100})
        results = [check_source_page(page, source_id, screenshot_name) for source_id, screenshot_name in targets]
        browser.close()

    print(json.dumps({"results": results}, ensure_ascii=False, indent=2))
    failed = [
        item
        for item in results
        if not item["title_present"]
        or not item["visual_section_present"]
        or item["visual_cards"] < 1
        or item["good_image_count"] < 1
        or not item["has_cbioportal"]
        or not item["has_teaching_boundary"]
        or not item["has_no_copy_boundary"]
        or item["has_mojibake"]
    ]
    if failed:
        raise SystemExit(f"Round55 public visual page verification failed: {failed}")


if __name__ == "__main__":
    main()

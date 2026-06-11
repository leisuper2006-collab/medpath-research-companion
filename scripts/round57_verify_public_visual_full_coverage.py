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
    return any(marker in text for marker in ["涓", "鐢", "鍥", "鍙", "閻", "娑", "缁", "乱码"])


def manifest_coverage() -> dict:
    sources = json.loads((ROOT / "data" / "public_example_sources.json").read_text(encoding="utf-8"))
    visuals = json.loads((ROOT / "data" / "public_source_visual_examples.json").read_text(encoding="utf-8"))
    source_ids = {item["id"] for item in sources}
    covered: set[str] = set()
    for item in visuals:
        ids = item.get("source_ids") or []
        if isinstance(ids, str):
            ids = [ids]
        covered.update(str(x) for x in ids)
    return {
        "source_count": len(source_ids),
        "visual_count": len(visuals),
        "covered_count": len(source_ids & covered),
        "uncovered": sorted(source_ids - covered),
    }


def check_source_page(page, source_id: str, screenshot_name: str) -> dict:
    page.goto(f"{BASE}/?fresh=round57source#/source-library/{source_id}", wait_until="domcontentloaded")
    page.wait_for_timeout(1200)
    page.locator("#source-visual").scroll_into_view_if_needed()
    page.wait_for_timeout(400)
    text = page.locator("body").inner_text()
    images = page.evaluate(
        """() => Array.from(document.querySelectorAll('.source-detail-figure, .source-visual-card img')).map((img) => ({
            src: img.getAttribute('src'),
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            alt: img.getAttribute('alt') || ''
        }))"""
    )
    screenshot = ROOT / "docs" / screenshot_name
    page.screenshot(path=str(screenshot), full_page=False)
    good_images = [img for img in images if img["complete"] and img["naturalWidth"] >= 300 and img["naturalHeight"] >= 180]
    return {
        "source_id": source_id,
        "visual_section_present": page.locator("#source-visual").count() == 1,
        "visual_cards": page.locator(".source-visual-card").count(),
        "good_image_count": len(good_images),
        "has_round57_asset": any("round57_mutation_type_distribution" in (img.get("src") or "") for img in images),
        "has_cbioportal": "cBioPortal" in text,
        "has_teaching_boundary": "教学与科研训练" in text and "不替代临床诊断" in text,
        "has_no_copy_boundary": "不复制论文原图" in text,
        "has_mojibake": has_mojibake(text),
        "screenshot": str(screenshot),
    }


def main() -> None:
    coverage = manifest_coverage()
    targets = [
        ("ccle_broad_2025", "round57_ccle_source_visual_verified.png"),
        ("pan_origimed_2020", "round57_pan_origimed_source_visual_verified.png"),
        ("prad_organoids_msk_2022", "round57_prad_source_visual_verified.png"),
        ("blca_tcga_gdc", "round57_blca_tcga_gdc_source_visual_verified.png"),
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

    output = {"coverage": coverage, "results": results}
    print(json.dumps(output, ensure_ascii=False, indent=2))
    failed = coverage["covered_count"] != coverage["source_count"] or coverage["uncovered"]
    failed = failed or any(
        not item["visual_section_present"]
        or item["visual_cards"] < 1
        or item["good_image_count"] < 1
        or not item["has_round57_asset"]
        or not item["has_cbioportal"]
        or not item["has_teaching_boundary"]
        or not item["has_no_copy_boundary"]
        or item["has_mojibake"]
        for item in results
    )
    if failed:
        raise SystemExit("Round57 full public source visual coverage verification failed")


if __name__ == "__main__":
    main()

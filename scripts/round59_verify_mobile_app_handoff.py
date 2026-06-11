from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE = "http://127.0.0.1:4173"
SVG = ROOT / "outputs" / "mobile_app_handoff" / "medpath_mobile_app_figma_handoff.svg"
CHROME_CANDIDATES = [
    Path(os.environ["CHROME_PATH"]) if os.environ.get("CHROME_PATH") else None,
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
]
MOJIBAKE_CODES = [0x6D93, 0x9422, 0x9365, 0x9359, 0x95BB, 0x5A11, 0x7F01]


def chrome_path() -> str | None:
    for candidate in CHROME_CANDIDATES:
        if candidate and candidate.exists():
            return str(candidate)
    return None


def has_mojibake(text: str) -> bool:
    return any(chr(code) in text for code in MOJIBAKE_CODES)


def main() -> None:
    docs = ROOT / "docs"
    docs.mkdir(exist_ok=True)
    screenshot = docs / "round59_mobile_app_handoff_verified.png"
    mobile_screenshot = docs / "round59_mobile_app_mobile_view_verified.png"
    report_path = docs / "round59_mobile_app_handoff_check.json"
    failures: list[str] = []

    svg_text = SVG.read_text(encoding="utf-8")
    if has_mojibake(svg_text):
        failures.append("handoff svg contains mojibake markers")
    for required in ["科研首页", "方法详情", "文章Skill", "治理复核", "设计边界"]:
        if required not in svg_text:
            failures.append(f"handoff svg missing {required}")

    with sync_playwright() as p:
        launch_options = {"headless": True}
        executable = chrome_path()
        if executable:
            launch_options["executable_path"] = executable
        browser = p.chromium.launch(**launch_options)

        page = browser.new_page(viewport={"width": 1440, "height": 960})
        page.goto(f"{BASE}/?fresh=round59#/mobile-app", wait_until="domcontentloaded")
        page.wait_for_timeout(1500)
        body = page.locator("body").inner_text()
        image_info = page.evaluate(
            """() => {
              const img = document.querySelector('.handoff-board-frame img');
              return img ? {
                src: img.currentSrc || img.src,
                complete: img.complete,
                width: img.naturalWidth,
                height: img.naturalHeight,
                alt: img.alt || ''
              } : null;
            }"""
        )
        state = {
            "h1": page.locator("h1").first.inner_text() if page.locator("h1").count() else "",
            "phone_frames": page.locator(".phone-frame").count(),
            "scenario_cards": page.locator(".mobile-scene-grid article").count(),
            "learning_cards": page.locator(".mobile-learning-rail article").count(),
            "has_handoff_board": page.locator(".handoff-board-frame img").count() == 1,
            "body_has_mojibake": has_mojibake(body),
            "image": image_info,
        }
        page.screenshot(path=str(screenshot), full_page=False)

        mobile = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True)
        mobile.goto(f"{BASE}/?fresh=round59#/mobile-app", wait_until="domcontentloaded")
        mobile.wait_for_timeout(1400)
        mobile_body = mobile.locator("body").inner_text()
        mobile_state = {
            "h1": mobile.locator("h1").first.inner_text() if mobile.locator("h1").count() else "",
            "phone_frames": mobile.locator(".phone-frame").count(),
            "body_has_mojibake": has_mojibake(mobile_body),
        }
        mobile.screenshot(path=str(mobile_screenshot), full_page=False)
        browser.close()

    if state["phone_frames"] < 3:
        failures.append("desktop mobile-app page missing phone frames")
    if state["scenario_cards"] < 4:
        failures.append("mobile scenarios missing")
    if state["learning_cards"] < 6:
        failures.append("learning path cards missing")
    if not state["has_handoff_board"] or not state["image"] or not state["image"]["complete"]:
        failures.append("handoff board image not rendered")
    if state["image"] and (state["image"]["width"] < 1000 or state["image"]["height"] < 600):
        failures.append("handoff board image too small or broken")
    if state["body_has_mojibake"] or mobile_state["body_has_mojibake"]:
        failures.append("mobile app page contains mojibake markers")

    payload = {
        "svg": str(SVG),
        "desktop": state,
        "mobile": mobile_state,
        "screenshots": [str(screenshot), str(mobile_screenshot)],
        "failures": failures,
    }
    report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

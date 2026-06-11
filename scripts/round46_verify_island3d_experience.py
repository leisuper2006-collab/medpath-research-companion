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
    return any(marker in text for marker in ["涓", "鐢", "鍥", "鍙", "绉", "鎶", "锛", "鏂", "鑱"])


def main() -> None:
    screenshot = ROOT / "docs" / "round46_island3d_verified.png"
    with sync_playwright() as p:
        launch_kwargs = {"headless": True}
        executable_path = chrome_path()
        if executable_path:
            launch_kwargs["executable_path"] = executable_path
        browser = p.chromium.launch(**launch_kwargs)
        page = browser.new_page(viewport={"width": 1440, "height": 920})
        page.goto(f"{BASE}/?fresh=round46island#/island-3d", wait_until="domcontentloaded")
        page.wait_for_timeout(2200)
        body = page.locator("body").inner_text()
        state = {
            "has_island_stage": page.locator("#island-canvas").count() == 1,
            "has_three_root": page.locator("#three-island-root").count() == 1,
            "has_canvas": page.locator("#island3d-canvas").count() == 1,
            "has_passport": page.locator("#island-passport").count() == 1,
            "has_panel": page.locator("#island3d-panel").count() == 1,
            "badge_count": page.locator(".island-badge-grid article").count(),
            "quest_cards": page.locator(".island-quest-grid article").count(),
            "body_has_mojibake": has_mojibake(body),
            "has_safety_boundary": "不替代" in body and "教师" in body,
        }
        page.locator("#island-canvas").scroll_into_view_if_needed()
        page.screenshot(path=str(screenshot), full_page=False)
        browser.close()
    print(json.dumps({"island": state, "screenshot": str(screenshot)}, ensure_ascii=False, indent=2))
    if state["body_has_mojibake"] or state["badge_count"] < 8 or state["quest_cards"] < 8 or not state["has_safety_boundary"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

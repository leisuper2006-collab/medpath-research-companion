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
    screenshot = docs / "round60_island_gameplay_verified.png"
    report_path = docs / "round60_island_gameplay_check.json"
    failures: list[str] = []

    with sync_playwright() as p:
        launch_options = {"headless": True}
        executable = chrome_path()
        if executable:
            launch_options["executable_path"] = executable
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page(viewport={"width": 1440, "height": 960})
        page.goto(f"{BASE}/?fresh=round60#/island-3d", wait_until="domcontentloaded")
        page.wait_for_timeout(2600)
        before_text = page.locator("#island3d-dialogue").inner_text()
        action_buttons = page.locator(".island3d-action-bar button").count()
        mode = page.locator("#island-render-mode").inner_text() if page.locator("#island-render-mode").count() else ""
        page.locator(".island3d-action-bar button").first.click()
        page.wait_for_timeout(1200)
        after_text = page.locator("#island3d-dialogue").inner_text()
        hud_text = page.locator("#island3d-hud").inner_text()
        panel_text = page.locator("#island3d-panel").inner_text()
        body = page.locator("body").inner_text()
        state = {
            "mode": mode,
            "has_three_canvas": page.locator("#three-island-root canvas").count() >= 1,
            "fallback_canvas_hidden": "three-active-fallback-hidden" in (page.locator("#island3d-canvas").get_attribute("class") or ""),
            "action_buttons": action_buttons,
            "dialogue_changed": before_text != after_text,
            "after_dialogue": after_text,
            "hud_text": hud_text,
            "panel_has_steps": "调用链" in panel_text and "要留下的证据" in panel_text,
            "badge_count": page.locator(".island-badge-grid article").count(),
            "quest_card_count": page.locator(".island-quest-grid article").count(),
            "body_has_mojibake": has_mojibake(body),
            "has_safety_boundary": "不处理真实患者数据" in body and "教师复核" in body,
        }
        page.locator("#island-canvas").scroll_into_view_if_needed()
        page.screenshot(path=str(screenshot), full_page=False)
        browser.close()

    if state["action_buttons"] < 3:
        failures.append("island action bar missing controls")
    if not state["has_three_canvas"]:
        failures.append("Three.js canvas missing")
    if not state["dialogue_changed"]:
        failures.append("guided tour button did not change dialogue/task state")
    if not state["panel_has_steps"]:
        failures.append("island panel missing skill/evidence task details")
    if state["badge_count"] < 10 or state["quest_card_count"] < 10:
        failures.append("island progress or quest cards missing")
    if state["body_has_mojibake"]:
        failures.append("island page contains mojibake markers")
    if not state["has_safety_boundary"]:
        failures.append("island safety boundary missing")

    payload = {"state": state, "screenshot": str(screenshot), "failures": failures}
    report_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

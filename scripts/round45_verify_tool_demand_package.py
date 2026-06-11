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
    return any(marker in text for marker in ["涓", "鐢", "鍥", "鍙", "绉", "鎶", "锛", "鏂"])


def main() -> None:
    screenshot = ROOT / "docs" / "round45_tool_demand_package.png"
    with sync_playwright() as p:
        launch_kwargs = {"headless": True}
        executable_path = chrome_path()
        if executable_path:
            launch_kwargs["executable_path"] = executable_path
        browser = p.chromium.launch(**launch_kwargs)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(f"{BASE}/?fresh=round45playwright#/open-source/gears", wait_until="domcontentloaded")
        page.wait_for_timeout(1200)
        page.locator("#tool-demand-lab").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        page.locator("#tool-demand-build").click()
        page.wait_for_timeout(500)
        result = page.locator("#tool-demand-result")
        result_text = result.inner_text()
        body_text = page.locator("body").inner_text()
        state = {
            "has_textarea": page.locator("#tool-demand").count() == 1,
            "has_result_title": result.locator("h2").count() == 1,
            "has_task_grid": result.locator(".task-package-grid").count() == 1,
            "has_minimum_path": "最小可运行路径" in result_text,
            "has_model_prompt": "模型网关" in result_text,
            "has_risk_boundary": "不替代临床诊断" in result_text,
            "has_license_badge": "待核对" in result_text or "license" in result_text.lower(),
            "body_has_mojibake": has_mojibake(body_text),
        }
        page.screenshot(path=str(screenshot), full_page=False)
        browser.close()
    print(json.dumps({"tool": state, "screenshot": str(screenshot)}, ensure_ascii=False, indent=2))
    if not all(value for key, value in state.items() if key != "body_has_mojibake") or state["body_has_mojibake"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

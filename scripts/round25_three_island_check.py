from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
SCREENSHOT = ROOT / "docs" / "round25_three_island_verified.png"
REPORT = ROOT / "docs" / "round25_three_island_check.json"
URL = os.environ.get("MEDPATH_WEB_URL", "http://127.0.0.1:3000/island-3d")
CHROME_CANDIDATES = [
    Path(os.environ["CHROME_PATH"]) if os.environ.get("CHROME_PATH") else None,
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    (Path(os.environ["LOCALAPPDATA"]) / r"Google\Chrome\Application\chrome.exe") if os.environ.get("LOCALAPPDATA") else None,
]


def main() -> int:
    SCREENSHOT.parent.mkdir(parents=True, exist_ok=True)
    chrome_path = next((path for path in CHROME_CANDIDATES if path and path.exists()), None)
    with sync_playwright() as p:
        launch_options = {"headless": True}
        if chrome_path:
            launch_options["executable_path"] = str(chrome_path)
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page(viewport={"width": 1440, "height": 980}, device_scale_factor=1)
        console_errors: list[str] = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type in {"error", "warning"} else None)
        page.goto(URL, wait_until="networkidle", timeout=45_000)
        page.wait_for_selector(".three-island-root.is-ready canvas", timeout=30_000)
        canvas_locator = page.locator(".three-island-root canvas")
        for point in [{"x": 250, "y": 350}, {"x": 450, "y": 340}, {"x": 560, "y": 430}]:
            canvas_locator.click(position=point)
            page.wait_for_timeout(350)
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(350)
        page.wait_for_timeout(1200)
        page.screenshot(path=str(SCREENSHOT), full_page=False)
        result = page.evaluate(
            """
            () => {
              const canvas = document.querySelector('.three-island-root canvas');
              const mode = document.querySelector('#island-render-mode')?.textContent || '';
              const rootReady = Boolean(document.querySelector('.three-island-root.is-ready canvas'));
              const panelText = document.querySelector('#island3d-panel')?.innerText || '';
              const hudText = document.querySelector('#island3d-hud')?.innerText || '';
              const dialogueText = document.querySelector('#island3d-dialogue')?.innerText || '';
              if (!canvas) return { ok: false, reason: 'missing canvas', mode, panelText };
              const tmp = document.createElement('canvas');
              tmp.width = canvas.width;
              tmp.height = canvas.height;
              const ctx = tmp.getContext('2d', { willReadFrequently: true });
              ctx.drawImage(canvas, 0, 0);
              const data = ctx.getImageData(0, 0, tmp.width, tmp.height).data;
              let nonBlank = 0;
              const colors = new Set();
              const step = Math.max(4, Math.floor(Math.sqrt((tmp.width * tmp.height) / 12000)));
              for (let y = 0; y < tmp.height; y += step) {
                for (let x = 0; x < tmp.width; x += step) {
                  const idx = (y * tmp.width + x) * 4;
                  const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
                  if (a > 5 && (r < 245 || g < 245 || b < 245)) {
                    nonBlank += 1;
                    colors.add(`${Math.round(r/12)*12},${Math.round(g/12)*12},${Math.round(b/12)*12}`);
                  }
                }
              }
              return {
                ok: true,
                width: canvas.width,
                height: canvas.height,
                mode,
                panelText,
                hudText,
                dialogueText,
                nonBlank,
                uniqueColors: colors.size,
                hasThreeMode: rootReady || /Three\\.js/i.test(mode),
                interactionUpdatedPanel: panelText.length > 120 && /1\\/10|2\\/10|3\\/10|当前|奖励/.test(hudText + panelText),
                keyboardMovedGuide: /手动移动|靠近建筑|教师复核/.test(dialogueText),
              };
            }
            """
        )
        browser.close()

    result["url"] = URL
    result["screenshot"] = str(SCREENSHOT)
    result["console_errors"] = console_errors[:20]
    REPORT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    failures = []
    if not result.get("ok"):
        failures.append(result.get("reason", "canvas check failed"))
    if not result.get("hasThreeMode"):
        failures.append("render mode did not report Three.js")
    if result.get("nonBlank", 0) < 1200:
        failures.append(f"too few non-blank sampled pixels: {result.get('nonBlank')}")
    if result.get("uniqueColors", 0) < 20:
        failures.append(f"too few sampled colors: {result.get('uniqueColors')}")
    if not result.get("interactionUpdatedPanel"):
        failures.append("click interaction did not produce a rich task panel")
    if not result.get("keyboardMovedGuide"):
        failures.append("keyboard movement did not update guide dialogue")
    if console_errors:
        failures.append(f"browser console warnings/errors: {console_errors[:3]}")
    if failures:
        print("FAIL", json.dumps({"failures": failures, **result}, ensure_ascii=False, indent=2))
        return 1
    print("PASS", json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

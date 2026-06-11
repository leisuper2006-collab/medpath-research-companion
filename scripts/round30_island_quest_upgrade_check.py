from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round30_island_quest_check.json"
SCREENSHOT = ROOT / "docs" / "round30_island_quest_verified.png"
URL = os.environ.get("MEDPATH_WEB_URL", "http://127.0.0.1:3000/island-3d")
CHROME_CANDIDATES = [
    Path(os.environ["CHROME_PATH"]) if os.environ.get("CHROME_PATH") else None,
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    (Path(os.environ["LOCALAPPDATA"]) / r"Google\Chrome\Application\chrome.exe") if os.environ.get("LOCALAPPDATA") else None,
]
BAD_MARKERS = ["涓", "鐢", "鍥", "鏂", "鎶", "璇", "TODO", "undefined", "null"]


def main() -> int:
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    chrome_path = next((path for path in CHROME_CANDIDATES if path and path.exists()), None)
    with sync_playwright() as p:
        launch_options = {"headless": True}
        if chrome_path:
            launch_options["executable_path"] = str(chrome_path)
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page(viewport={"width": 1440, "height": 1120}, device_scale_factor=1)
        console_errors: list[str] = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type in {"error", "warning"} else None)
        target_url = URL
        use_spa_navigation = not URL.rstrip("/").endswith("/island-3d")
        page.goto(target_url, wait_until="networkidle", timeout=45_000)
        if use_spa_navigation:
            page.evaluate("() => window.navigate && window.navigate('/island-3d')")
            page.wait_for_url("**/island-3d", timeout=10_000)
            page.wait_for_load_state("networkidle", timeout=15_000)
        page.wait_for_selector(".three-island-root.is-ready canvas", timeout=30_000)
        page.wait_for_selector(".island-passport", timeout=10_000)

        first_route_button = page.locator(".island-quest-grid article button").first
        first_route_button.click()
        page.wait_for_timeout(900)
        page.locator(".three-island-root canvas").click(position={"x": 360, "y": 410}, force=True)
        page.wait_for_timeout(900)
        page.screenshot(path=str(SCREENSHOT), full_page=False)

        result = page.evaluate(
            """
            () => {
              const text = document.body.innerText || '';
              const canvas = document.querySelector('.three-island-root canvas');
              const tmp = document.createElement('canvas');
              let nonBlank = 0;
              let uniqueColors = 0;
              if (canvas) {
                tmp.width = canvas.width;
                tmp.height = canvas.height;
                const ctx = tmp.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(canvas, 0, 0);
                const data = ctx.getImageData(0, 0, tmp.width, tmp.height).data;
                const colors = new Set();
                const step = Math.max(4, Math.floor(Math.sqrt((tmp.width * tmp.height) / 14000)));
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
                uniqueColors = colors.size;
              }
              const routeCards = [...document.querySelectorAll('.island-quest-grid article')];
              const badgeCards = [...document.querySelectorAll('.island-badge-grid article')];
              const panel = document.querySelector('#island3d-panel')?.innerText || '';
              const passport = document.querySelector('.island-passport')?.innerText || '';
              const routeText = document.querySelector('#island-routes')?.innerText || '';
              return {
                canvasFound: Boolean(canvas),
                nonBlank,
                uniqueColors,
                passportFound: Boolean(document.querySelector('.island-passport')),
                passportHasProgress: /科研护照|推荐下一站|学习护照进度/.test(passport),
                routeCards: routeCards.length,
                badgeCards: badgeCards.length,
                routeCardsHaveEvidence: /交付物/.test(routeText) && /避坑边界/.test(routeText),
                panelHasFocus: /解决的问题/.test(panel) && /新手提示/.test(panel) && /要留下的证据/.test(panel),
                panelHasActions: /重新定位建筑/.test(panel) && /进入：/.test(panel),
                safetyBoundary: /不处理真实患者数据|不替代/.test(text),
                textSample: text.slice(0, 1200),
              };
            }
            """
        )
        browser.close()

    result["url"] = URL
    result["screenshot"] = str(SCREENSHOT)
    result["console_errors"] = console_errors[:20]
    bad_markers = [marker for marker in BAD_MARKERS if marker in result.get("textSample", "")]
    result["bad_markers"] = bad_markers
    REPORT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    failures = []
    if not result.get("canvasFound"):
        failures.append("Three.js canvas missing")
    if result.get("nonBlank", 0) < 1200:
        failures.append(f"canvas looks blank: nonBlank={result.get('nonBlank')}")
    if result.get("uniqueColors", 0) < 20:
        failures.append(f"canvas lacks visual richness: uniqueColors={result.get('uniqueColors')}")
    if not result.get("passportFound") or not result.get("passportHasProgress"):
        failures.append("quest passport missing or incomplete")
    if result.get("routeCards") != 10 or result.get("badgeCards") != 10:
        failures.append(f"expected 10 route cards and 10 badges, got {result.get('routeCards')} / {result.get('badgeCards')}")
    if not result.get("routeCardsHaveEvidence"):
        failures.append("route cards do not show deliverables and risk boundary")
    if not result.get("panelHasFocus"):
        failures.append("task panel lacks problem/tip/evidence sections")
    if not result.get("panelHasActions"):
        failures.append("task panel lacks action buttons")
    if not result.get("safetyBoundary"):
        failures.append("medical/research safety boundary missing")
    if bad_markers:
        failures.append(f"bad text markers found: {bad_markers}")
    if console_errors:
        failures.append(f"browser console warnings/errors: {console_errors[:3]}")

    if failures:
        print("FAIL", json.dumps({"failures": failures, **result}, ensure_ascii=False, indent=2))
        return 1
    print("PASS", json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

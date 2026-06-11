from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round25_pwa_check.json"
URL = os.environ.get("MEDPATH_WEB_URL", "http://127.0.0.1:3000/mobile-app")
CHROME_CANDIDATES = [
    Path(os.environ["CHROME_PATH"]) if os.environ.get("CHROME_PATH") else None,
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    (Path(os.environ["LOCALAPPDATA"]) / r"Google\Chrome\Application\chrome.exe") if os.environ.get("LOCALAPPDATA") else None,
]


def main() -> int:
    chrome_path = next((path for path in CHROME_CANDIDATES if path and path.exists()), None)
    with sync_playwright() as p:
        launch_options = {"headless": True}
        if chrome_path:
            launch_options["executable_path"] = str(chrome_path)
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True)
        logs: list[str] = []
        page.on("console", lambda msg: logs.append(msg.text) if msg.type in {"error", "warning"} else None)
        page.goto(URL, wait_until="load", timeout=30_000)
        page.wait_for_timeout(1500)
        result = page.evaluate(
            """
            async () => {
              const manifest = document.querySelector('link[rel="manifest"]')?.getAttribute('href') || '';
              const icon = document.querySelector('link[rel="icon"]')?.getAttribute('href') || '';
              const hasSW = Boolean(navigator.serviceWorker);
              const regs = hasSW ? await navigator.serviceWorker.getRegistrations() : [];
              return {
                url: location.href,
                title: document.title,
                manifest,
                icon,
                hasSW,
                registrationCount: regs.length,
                bodyText: document.body.innerText.slice(0, 500)
              };
            }
            """
        )
        browser.close()
    result["console_errors"] = logs[:20]
    REPORT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    failures = []
    if not result.get("manifest"):
        failures.append("missing manifest link")
    if not result.get("icon"):
        failures.append("missing icon link")
    if not result.get("hasSW"):
        failures.append("service worker unsupported in browser context")
    if logs:
        failures.append(f"console warnings/errors: {logs[:3]}")
    if failures:
        print("FAIL", json.dumps({"failures": failures, **result}, ensure_ascii=False, indent=2))
        return 1
    print("PASS", json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

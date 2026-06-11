from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "round27_pet_mentor_check.json"
SCREENSHOT = ROOT / "docs" / "round27_pet_mentor_verified.png"
URL = os.environ.get("MEDPATH_WEB_URL", "http://127.0.0.1:3000")
CHROME_CANDIDATES = [
    Path(os.environ["CHROME_PATH"]) if os.environ.get("CHROME_PATH") else None,
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    (Path(os.environ["LOCALAPPDATA"]) / r"Google\Chrome\Application\chrome.exe") if os.environ.get("LOCALAPPDATA") else None,
]


def check_page(page, path: str, demand: str) -> dict:
    page.goto(f"{URL}{path}", wait_until="load", timeout=30_000)
    page.wait_for_timeout(1000)
    page.locator("[data-pet-toggle]").click(timeout=10_000)
    page.locator("#pet-demand-input").fill(demand)
    page.locator("#pet-plan-button").click()
    page.wait_for_timeout(300)
    return page.evaluate(
        """
        () => {
          const panel = document.querySelector('.pet-mentor-panel');
          const result = document.querySelector('#pet-plan-result');
          const actions = [...document.querySelectorAll('.pet-plan-actions a')].map(a => a.textContent.trim());
          return {
            url: location.pathname,
            expanded: document.querySelector('.pet-bubble')?.classList.contains('pet-expanded') || false,
            title: document.querySelector('.pet-mentor-panel h3')?.textContent || '',
            panelText: panel?.innerText.slice(0, 800) || '',
            resultText: result?.innerText.slice(0, 800) || '',
            actions,
            cardCount: document.querySelectorAll('.universe-card,.plot-product-card,.tool-card,.article-tab-button').length
          };
        }
        """
    )


def main() -> int:
    chrome_path = next((path for path in CHROME_CANDIDATES if path and path.exists()), None)
    pages = [
        ("/", "我想做胃癌病理方向的入门课题，但不知道先选方法还是先查数据。"),
        ("/method-universe", "我想做基因敲除后验证细胞迁移变化，请帮我拆任务。"),
        ("/plot-gallery", "我有表达矩阵和分组信息，想知道该画火山图还是热图。"),
        ("/article-workshop", "我想写Meta分析，需要从PICO和森林图开始规划。"),
        ("/open-source", "我想找一个单细胞工具，但不知道许可证和输入格式。"),
        ("/island-3d", "我想用小岛找到下一步科研训练路线。"),
    ]
    results = []
    logs: list[str] = []
    with sync_playwright() as p:
        launch_options = {"headless": True}
        if chrome_path:
            launch_options["executable_path"] = str(chrome_path)
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page(viewport={"width": 1440, "height": 1050})
        page.on("console", lambda msg: logs.append(msg.text) if msg.type in {"error", "warning"} else None)
        for path, demand in pages:
            results.append(check_page(page, path, demand))
        page.goto(f"{URL}/method-universe/method-001", wait_until="load", timeout=30_000)
        page.wait_for_timeout(1000)
        page.screenshot(path=str(SCREENSHOT), full_page=True)
        browser.close()

    failures = []
    if logs:
        failures.append(f"console warnings/errors: {logs[:5]}")
    seen_titles = set()
    for item in results:
        if not item["expanded"]:
            failures.append(f"pet panel not expanded: {item['url']}")
        if "任务包" not in item["resultText"]:
            failures.append(f"missing generated plan text: {item['url']}")
        if item["title"] in seen_titles:
            failures.append(f"repeated pet context title: {item['title']}")
        seen_titles.add(item["title"])
        if len(item["actions"]) < 3:
            failures.append(f"too few pet actions: {item['url']}")

    payload = {
        "url": URL,
        "results": results,
        "console_errors": logs[:20],
        "screenshot": str(SCREENSHOT),
        "failures": failures,
    }
    REPORT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    if failures:
        print("FAIL", json.dumps(payload, ensure_ascii=False, indent=2))
        return 1
    print("PASS", json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

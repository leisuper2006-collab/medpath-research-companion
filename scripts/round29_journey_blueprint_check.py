from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
BASE_URL = os.environ.get("MEDPATH_BASE_URL", "http://127.0.0.1:3000").rstrip("/")


def chrome_candidates() -> list[Path]:
    return [
        Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
        Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    ]


def find_browser() -> str | None:
    for candidate in chrome_candidates():
        if candidate.exists():
            return str(candidate)
    return None


def main() -> None:
    failures: list[str] = []
    console_messages: list[dict[str, str]] = []
    with sync_playwright() as p:
        executable = find_browser()
        browser = p.chromium.launch(headless=True, executable_path=executable) if executable else p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1100})
        page.on("console", lambda msg: console_messages.append({"type": msg.type, "text": msg.text}))
        if "4173" in BASE_URL:
            page.goto(f"{BASE_URL}/?round29=1", wait_until="networkidle")
            page.evaluate("navigate('/journey-builder')")
            page.wait_for_timeout(800)
        else:
            page.goto(f"{BASE_URL}/journey-builder?round29=1", wait_until="networkidle")
        page.wait_for_selector(".journey-blueprint", timeout=10_000)
        initial = page.evaluate(
            """() => ({
                h1: document.querySelector('h1')?.textContent?.trim(),
                blueprint: document.querySelectorAll('.journey-blueprint').length,
                days: document.querySelectorAll('.blueprint-day').length,
                routeLinks: [...document.querySelectorAll('.blueprint-route-strip a')].map(a => a.textContent.trim()),
                hasApiPrompt: document.body.innerText.includes('模型API提示骨架'),
                hasSevenDay: document.body.innerText.includes('7天入门路径'),
                hasSafety: document.body.innerText.includes('不替代临床诊断'),
                hasUnknownMarkers: document.body.innerText.includes('????') || document.body.innerText.includes('???')
            })"""
        )
        if initial["blueprint"] != 1:
            failures.append("journey blueprint not rendered")
        if initial["days"] != 7:
            failures.append("journey blueprint should contain 7 day steps")
        if len(initial["routeLinks"]) < 5:
            failures.append("journey blueprint should expose five route links")
        if not initial["hasApiPrompt"]:
            failures.append("journey blueprint missing model API prompt skeleton")
        if not initial["hasSafety"]:
            failures.append("journey blueprint missing medical AI safety boundary")
        if initial["hasUnknownMarkers"]:
            failures.append("journey page contains unknown question markers")

        page.locator("button.chip").nth(2).click()
        page.locator("#journey-build").click()
        page.wait_for_timeout(500)
        generated = page.evaluate(
            """() => ({
                resultTextHasSingleCell: document.querySelector('#journey-result')?.innerText.includes('单细胞'),
                blueprint: document.querySelectorAll('#journey-result .journey-blueprint').length,
                days: document.querySelectorAll('#journey-result .blueprint-day').length,
                hasTeacherReview: document.querySelector('#journey-result')?.innerText.includes('导师/教师复核问题'),
                hasDataAudit: [...document.querySelectorAll('.blueprint-route-strip a')].some(a => a.textContent.includes('数据审查')),
                routeHrefs: [...document.querySelectorAll('.blueprint-route-strip a')].map(a => a.getAttribute('href'))
            })"""
        )
        if not generated["resultTextHasSingleCell"]:
            failures.append("generated journey did not reflect selected single-cell demand")
        if generated["blueprint"] != 1 or generated["days"] != 7:
            failures.append("generated journey did not retain blueprint structure")
        if not generated["hasTeacherReview"]:
            failures.append("generated journey missing teacher review section")
        if not generated["hasDataAudit"]:
            failures.append("generated journey missing data audit route")

        page.locator(".journey-blueprint").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        suffix = "static" if "4173" in BASE_URL else "dev"
        screenshot = DOCS / f"round29_journey_blueprint_verified_{suffix}.png"
        page.screenshot(path=str(screenshot), full_page=False)
        browser.close()

    relevant_console = [
        msg for msg in console_messages
        if msg["type"] in {"error", "warning"} and "favicon" not in msg["text"].lower()
    ]
    if relevant_console:
        failures.append(f"console issues: {len(relevant_console)}")

    report = {
        "status": "FAIL" if failures else "PASS",
        "url": f"{BASE_URL}/journey-builder",
        "initial": initial,
        "generated": generated,
        "console_errors_or_warnings": relevant_console,
        "screenshot": str(screenshot),
        "failures": failures,
    }
    suffix = "static" if "4173" in BASE_URL else "dev"
    out = DOCS / f"round29_journey_blueprint_check_{suffix}.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

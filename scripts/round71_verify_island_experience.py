from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round71#/island-3d"
REPORT = ROOT / "docs" / "round71_island_experience_report.md"
DESKTOP_SHOT = ROOT / "docs" / "round71_island_experience_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round71_island_mobile_verified.png"

REQUIRED_TEXT = [
    "任务罗盘",
    "新手第一天路线",
    "文章开工路线",
    "模拟案例路线",
    "下一站",
    "上一站",
    "不处理真实患者数据",
    "教师复核",
]


def main() -> None:
    failures: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1120})
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(2500)
        before = page.locator("#island3d-dialogue").inner_text(timeout=10_000)
        page.locator(".island3d-action-bar button").nth(1).click()
        page.wait_for_timeout(900)
        after = page.locator("#island3d-dialogue").inner_text()
        state = page.evaluate(
            """
            () => {
              const text = document.body.innerText;
              return {
                compassCards: document.querySelectorAll(".compass-route-card").length,
                compassStops: document.querySelectorAll(".compass-stop-row button").length,
                miniMapButtons: document.querySelectorAll(".island3d-mini-map button").length,
                actionButtons: document.querySelectorAll(".island3d-action-bar button").length,
                hasThreeCanvas: document.querySelectorAll(".three-island-root canvas").length >= 1,
                hasPanel: Boolean(document.querySelector("#island3d-panel")),
                badgeCount: document.querySelectorAll(".island-badge-grid article").length,
                questCardCount: document.querySelectorAll(".island-quest-grid article").length,
                hasFrameworkError: text.includes("Unhandled Runtime Error") || text.includes("Failed to compile"),
                text,
              };
            }
            """
        )
        page.locator("#island-canvas").scroll_into_view_if_needed()
        page.screenshot(path=str(DESKTOP_SHOT), full_page=False)

        if before == after:
            failures.append("next-stop action did not update guide dialogue")
        if state["compassCards"] < 3:
            failures.append("task compass route cards missing")
        if state["compassStops"] < 10:
            failures.append("task compass stops too sparse")
        if state["miniMapButtons"] < 6:
            failures.append("mini-map buttons missing")
        if state["actionButtons"] < 5:
            failures.append("island action bar lacks richer controls")
        if not state["hasThreeCanvas"]:
            failures.append("Three.js canvas missing")
        if state["badgeCount"] < 10 or state["questCardCount"] < 10:
            failures.append("badge or quest card grid incomplete")
        if state["hasFrameworkError"]:
            failures.append("framework error text detected")
        for term in REQUIRED_TEXT:
            if term not in state["text"]:
                failures.append(f"missing required text: {term}")

        mobile = browser.new_page(viewport={"width": 390, "height": 1100}, is_mobile=True)
        mobile.goto(BASE_URL, wait_until="networkidle")
        mobile.wait_for_timeout(2000)
        mobile_state = mobile.evaluate(
            """
            () => ({
              compassCards: document.querySelectorAll(".compass-route-card").length,
              miniMapButtons: document.querySelectorAll(".island3d-mini-map button").length,
              hasSafety: document.body.innerText.includes("不替代导师") || document.body.innerText.includes("不处理真实患者数据"),
              hasCompass: document.body.innerText.includes("任务罗盘"),
            })
            """
        )
        mobile.screenshot(path=str(MOBILE_SHOT), full_page=False)
        if mobile_state["compassCards"] < 3 or not mobile_state["hasCompass"]:
            failures.append("mobile compass missing")
        if not mobile_state["hasSafety"]:
            failures.append("mobile safety boundary missing")
        browser.close()

    REPORT.write_text(
        "# Round71 3D科研小岛与桌宠式任务体验验证报告\n\n"
        "## 页面状态\n\n"
        + f"- desktop: { {k: v for k, v in state.items() if k != 'text'} }\n"
        + f"- dialogue_before: {before}\n"
        + f"- dialogue_after: {after}\n"
        + f"- mobile: {mobile_state}\n\n"
        "## 截图\n\n"
        + f"- {DESKTOP_SHOT}\n- {MOBILE_SHOT}\n\n"
        "## 真实性边界\n\n"
        "- 小岛是本地教学导航原型，不代表正式课程成绩、真实平台上线或临床用途。\n"
        "- 所有医学AI输出仅用于教学与科研训练，不替代临床诊断或导师/教师复核。\n\n"
        + ("## Failures\n\n" + "\n".join(f"- {x}" for x in failures) if failures else "## Result\n\nPASS\n"),
        encoding="utf-8",
    )
    print({"failures": failures, "screenshots": [str(DESKTOP_SHOT), str(MOBILE_SHOT)]})
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

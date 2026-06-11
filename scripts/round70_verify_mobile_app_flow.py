from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round70#/mobile-app"
REPORT = ROOT / "docs" / "round70_mobile_app_figma_route_report.md"
DESKTOP_SHOT = ROOT / "docs" / "round70_mobile_app_flow_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round70_mobile_app_mobile_verified.png"

REQUIRED_FILES = [
    ROOT / "outputs/mobile_app_handoff/medpath_mobile_app_round70_handoff.svg",
    ROOT / "outputs/mobile_app_handoff/figma_import_pack/medpath_mobile_app_round70_handoff.svg",
    ROOT / "outputs/mobile_app_handoff/figma_import_pack/figma_import_manifest_round70.json",
    ROOT / "outputs/mobile_app_handoff/figma_import_pack/medpath_mobile_tokens_round70.json",
    ROOT / "outputs/mobile_app_handoff/figma_import_pack/figma_use_rebuild_mobile_app_round70.js",
]

REQUIRED_TEXT = [
    "六屏手机端信息架构",
    "模型网关",
    "伦理复核",
    "教师复核",
    "Figma",
    "Round70",
    "不替代临床诊断",
    "仅用于教学与科研训练",
    "接入自己的API",
]

FORBIDDEN_TEXT = [
    "已经发布原生App",
    "线上Figma文件已创建",
    "已经完成真实课程试点",
    "已经在D03上线",
    "已在D03真实上线",
]


def file_audit() -> tuple[list[str], list[str]]:
    failures: list[str] = []
    lines: list[str] = []
    for path in REQUIRED_FILES:
        ok = path.exists() and path.stat().st_size > 200
        lines.append(f"- {path}: {'OK' if ok else 'MISSING'}")
        if not ok:
            failures.append(f"missing or tiny file: {path}")
    svg = REQUIRED_FILES[0].read_text(encoding="utf-8", errors="ignore") if REQUIRED_FILES[0].exists() else ""
    if svg.count("<g transform=") < 6:
        failures.append("Round70 SVG does not contain six phone groups")
    for term in ["模型网关", "教师复核", "Meta分析", "基因敲除"]:
        if term not in svg:
            failures.append(f"Round70 SVG missing term: {term}")
    return failures, lines


def browser_audit() -> tuple[list[str], dict[str, object]]:
    failures: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1200})
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(800)
        state = page.evaluate(
            """
            () => {
              const text = document.body.innerText;
              return {
                title: document.title,
                phoneCount: document.querySelectorAll(".phone-frame").length,
                specCount: document.querySelectorAll(".mobile-screen-spec-grid article").length,
                linkCount: document.querySelectorAll("a[href*='round70']").length,
                hasFrameworkError: text.includes("Unhandled Runtime Error") || text.includes("Failed to compile"),
                text,
              };
            }
            """
        )
        page.screenshot(path=str(DESKTOP_SHOT), full_page=False)
        if state["phoneCount"] < 6:
            failures.append(f"desktop phone frames < 6: {state['phoneCount']}")
        if state["specCount"] < 6:
            failures.append(f"screen spec cards < 6: {state['specCount']}")
        if state["linkCount"] < 4:
            failures.append(f"round70 handoff links < 4: {state['linkCount']}")
        if state["hasFrameworkError"]:
            failures.append("framework error text detected")
        for term in REQUIRED_TEXT:
            if term not in state["text"]:
                failures.append(f"desktop missing required text: {term}")
        for term in FORBIDDEN_TEXT:
            if term in state["text"]:
                failures.append(f"forbidden completion claim detected: {term}")

        mobile = browser.new_page(viewport={"width": 390, "height": 1100}, is_mobile=True)
        mobile.goto(BASE_URL, wait_until="networkidle")
        mobile.wait_for_timeout(800)
        mobile_state = mobile.evaluate(
            """
            () => {
              const text = document.body.innerText;
              return {
                phoneCount: document.querySelectorAll(".phone-frame").length,
                hasModel: text.includes("模型网关"),
                hasFigma: text.includes("Figma"),
                hasSafety: text.includes("不替代临床诊断"),
              };
            }
            """
        )
        mobile.screenshot(path=str(MOBILE_SHOT), full_page=False)
        if mobile_state["phoneCount"] < 6:
            failures.append(f"mobile phone frames < 6: {mobile_state['phoneCount']}")
        if not mobile_state["hasModel"] or not mobile_state["hasFigma"] or not mobile_state["hasSafety"]:
            failures.append("mobile missing model/Figma/safety content")
        browser.close()
    return failures, {
        "desktop": {k: v for k, v in state.items() if k != "text"},
        "mobile": mobile_state,
        "screenshots": [str(DESKTOP_SHOT), str(MOBILE_SHOT)],
    }


def main() -> None:
    file_failures, file_lines = file_audit()
    browser_failures, browser_state = browser_audit()
    failures = file_failures + browser_failures
    REPORT.write_text(
        "# Round70 手机端App与Figma本地交付验证报告\n\n"
        "## 文件检查\n\n"
        + "\n".join(file_lines)
        + "\n\n## 页面检查\n\n"
        + f"- desktop: {browser_state['desktop']}\n"
        + f"- mobile: {browser_state['mobile']}\n\n"
        + "## 截图\n\n"
        + f"- {DESKTOP_SHOT}\n- {MOBILE_SHOT}\n\n"
        + "## 真实性边界\n\n"
        + "- 当前为本地网页原型与本地Figma导入包，不宣称已发布原生App。\n"
        + "- 当前不宣称已创建线上Figma文件；待Figma连接可用后可继续迁移。\n"
        + "- 医学AI输出仅用于教学与科研训练，不替代临床诊断，须经教师或专家复核。\n\n"
        + ("## Failures\n\n" + "\n".join(f"- {x}" for x in failures) if failures else "## Result\n\nPASS\n"),
        encoding="utf-8",
    )
    print({"failures": failures, "screenshots": [str(DESKTOP_SHOT), str(MOBILE_SHOT)]})
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

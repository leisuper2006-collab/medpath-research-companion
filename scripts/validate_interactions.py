from __future__ import annotations

from pathlib import Path
import os

from playwright.sync_api import expect, sync_playwright


BASE = "http://127.0.0.1:3000"
ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "local_launch_verification.md"


def browser_executable() -> str | None:
    for item in [
        os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]:
        if item and Path(item).exists():
            return item
    return None


def main() -> None:
    rows: list[tuple[str, str]] = []
    with sync_playwright() as p:
        executable_path = browser_executable()
        browser = p.chromium.launch(executable_path=executable_path) if executable_path else p.chromium.launch()
        page = browser.new_page(viewport={"width": 1366, "height": 900})

        page.goto(f"{BASE}/teacher", wait_until="networkidle")
        page.get_by_role("button", name="生成病理 PBL 案例").click()
        expect(page.locator("#teacher-result")).to_contain_text("PBL")
        rows.append(("teacher PBL generation", "PASS"))

        page.goto(f"{BASE}/student", wait_until="networkidle")
        page.get_by_role("button", name="生成反馈").click()
        expect(page.locator("#student-result")).to_contain_text("结构反馈")
        rows.append(("student report feedback", "PASS"))

        page.goto(f"{BASE}/simulate/new", wait_until="networkidle")
        page.get_by_role("button", name="生成案例").click()
        expect(page.locator("#sim-result")).to_contain_text("合成教学案例")
        rows.append(("simulation case generation", "PASS"))

        page.goto(f"{BASE}/compare", wait_until="networkidle")
        expect(page.locator("#compare-result")).to_contain_text("MedPath Skill")
        rows.append(("comparison demo switch", "PASS"))

        page.goto(f"{BASE}/open-source", wait_until="networkidle")
        page.locator("#os-search").fill("virtual perturbation")
        page.locator("#os-search-btn").click()
        expect(page.locator("#os-list")).to_contain_text("GEARS")
        rows.append(("open-source virtual perturbation filter", "PASS"))

        page.goto(f"{BASE}/plot-studio", wait_until="networkidle")
        page.get_by_role("button", name="生成图").click()
        expect(page.locator("#plot-result svg")).to_be_visible()
        rows.append(("plot studio SVG generation", "PASS"))

        page.goto(f"{BASE}/skill-builder", wait_until="networkidle")
        page.get_by_role("button", name="生成 Skill 文件预览").click()
        expect(page.locator("#sb-result")).to_contain_text("SKILL.md")
        rows.append(("skill builder generation", "PASS"))

        page.goto(f"{BASE}/providers", wait_until="networkidle")
        page.get_by_role("button", name="Test Connection").first.click()
        expect(page.locator('[id^="provider-"]').first).to_contain_text("mock")
        rows.append(("provider mock connection", "PASS"))

        page.goto(f"{BASE}/governance", wait_until="networkidle")
        page.get_by_role("button", name="运行审计").click()
        expect(page.locator("#gov-result")).to_contain_text("人工复核")
        rows.append(("governance audit", "PASS"))

        browser.close()

    existing = REPORT.read_text(encoding="utf-8") if REPORT.exists() else "# Local Launch Verification\n"
    table = ["", "## Playwright Interaction Verification", "", "| Flow | Result |", "|---|---:|"]
    table.extend(f"| {name} | {result} |" for name, result in rows)
    REPORT.write_text(existing.rstrip() + "\n" + "\n".join(table) + "\n", encoding="utf-8")
    print("\n".join(f"{name}: {result}" for name, result in rows))


if __name__ == "__main__":
    main()


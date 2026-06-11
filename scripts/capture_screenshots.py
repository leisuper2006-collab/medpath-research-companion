from __future__ import annotations

from pathlib import Path
import os

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "screenshots"
OUT.mkdir(exist_ok=True)
BASE = "http://127.0.0.1:3000"

ROUTES = [
    ("01_dashboard.png", "/"),
    ("02_teacher.png", "/teacher"),
    ("03_student.png", "/student"),
    ("04_researcher.png", "/researcher"),
    ("05_plugins.png", "/plugins"),
    ("06_plugin_detail.png", "/plugins/teaching"),
    ("07_skill_detail.png", "/skills/pathology-report-coach"),
    ("08_simulate_new.png", "/simulate/new"),
    ("09_case_detail.png", "/simulate/demo-case-001"),
    ("10_compare.png", "/compare"),
    ("11_evidence.png", "/evidence"),
    ("12_open_source.png", "/open-source"),
    ("13_plot_studio.png", "/plot-studio"),
    ("14_method_runner_virtual_perturbation.png", "/method-runner/virtual-perturbation"),
    ("15_skill_builder.png", "/skill-builder"),
    ("16_runtime.png", "/runtime"),
    ("17_providers.png", "/providers"),
    ("18_governance.png", "/governance"),
]


def main() -> None:
    candidates = [
        os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    executable_path = next((p for p in candidates if p and Path(p).exists()), None)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=executable_path) if executable_path else p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 980})
        for filename, route in ROUTES:
            page.goto(BASE + route, wait_until="networkidle")
            page.screenshot(path=str(OUT / filename), full_page=True)
            print(OUT / filename)
        browser.close()


if __name__ == "__main__":
    main()

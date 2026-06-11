from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round61#/"
DESKTOP_SHOT = ROOT / "docs" / "round61_home_command_center_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round61_home_command_center_mobile_verified.png"


def inspect_page(page):
    return page.evaluate(
        """
        () => {
          const deck = document.querySelector('.home-command-deck');
          const textarea = document.querySelector('#home-demand');
          const result = document.querySelector('#home-route-result');
          const cards = [...document.querySelectorAll('.home-route-steps article')];
          const links = [...document.querySelectorAll('.home-route-steps button')];
          const skillBadges = [...document.querySelectorAll('.home-route-skill-chain .badge')];
          const text = document.body.innerText;
          return {
            has_deck: !!deck,
            textarea_value: textarea ? textarea.value : '',
            card_count: cards.length,
            link_button_count: links.length,
            skill_badge_count: skillBadges.length,
            has_complete_builder: text.includes('打开完整路线生成器'),
            has_safety: text.includes('仅用于教学与科研训练'),
            has_mojibake: /[�]|涓|鐢|鍥|鍙/.test(text),
            result_text: result ? result.innerText.slice(0, 500) : ''
          };
        }
        """
    )


def main():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1050}, device_scale_factor=1)
        page.goto(BASE_URL, wait_until="networkidle")
        before = inspect_page(page)
        if not before["has_deck"]:
            failures.append("homepage command deck missing")
        if before["card_count"] < 6:
            failures.append(f"expected 6 route cards, got {before['card_count']}")
        if before["skill_badge_count"] < 3:
            failures.append(f"expected skill chain badges, got {before['skill_badge_count']}")
        if not before["has_safety"]:
            failures.append("safety boundary missing")
        if before["has_mojibake"]:
            failures.append("homepage contains mojibake markers")

        page.fill("#home-demand", "我有单细胞RNA测序数据，想做质控、细胞注释、差异分析、轨迹分析和论文主图")
        page.click("#home-route-build")
        page.wait_for_timeout(300)
        after = inspect_page(page)
        if "单细胞" not in after["result_text"] and "RNA" not in after["result_text"]:
            failures.append("route result did not update after new demand")
        page.screenshot(path=str(DESKTOP_SHOT), full_page=True)

        mobile = browser.new_page(viewport={"width": 390, "height": 1100}, is_mobile=True)
        mobile.goto(BASE_URL, wait_until="networkidle")
        mobile_state = inspect_page(mobile)
        if not mobile_state["has_deck"]:
            failures.append("mobile command deck missing")
        if mobile_state["card_count"] < 6:
            failures.append("mobile route cards missing")
        mobile.screenshot(path=str(MOBILE_SHOT), full_page=True)
        browser.close()

    report = {
        "before": before,
        "after": after,
        "mobile": mobile_state,
        "screenshots": [str(DESKTOP_SHOT), str(MOBILE_SHOT)],
        "failures": failures,
    }
    print(report)
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round64#"
DESKTOP_SHOT = ROOT / "docs" / "round64_motion_experience_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round64_motion_mobile_verified.png"


def inspect_motion(page):
    return page.evaluate(
        """
        () => {
          const text = document.body.innerText;
          const rail = document.querySelector('.motion-chapter-rail');
          const reveal = [...document.querySelectorAll('.reveal-on-scroll')];
          const visible = reveal.filter((node) => node.classList.contains('is-visible'));
          const progress = document.querySelector('.scroll-progress');
          const sheet = document.querySelector('.page-sheet');
          const style = reveal[0] ? getComputedStyle(reveal[0]) : null;
          return {
            rail_exists: !!rail,
            rail_dot_count: rail ? rail.querySelectorAll('button').length : 0,
            reveal_count: reveal.length,
            visible_count: visible.length,
            first_reveal_opacity: style ? style.opacity : '',
            progress_transform: progress ? progress.style.transform : '',
            has_page_sheet: !!sheet,
            has_safety: text.includes('仅用于教学与科研训练'),
            has_mojibake: /[�]|涓|鐢|鍥|鍙/.test(text),
            title_sample: [...document.querySelectorAll('h1,h2,h3')].slice(0, 5).map((x) => x.innerText).join(' | ')
          };
        }
        """
    )


def main():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1050}, device_scale_factor=1)
        page.goto(f"{BASE_URL}/method-universe/method-001", wait_until="networkidle")
        page.wait_for_timeout(500)
        before = inspect_motion(page)
        if not before["has_page_sheet"]:
            failures.append("page sheet missing")
        if before["reveal_count"] < 8:
            failures.append(f"expected rich reveal targets, got {before['reveal_count']}")
        if before["visible_count"] < 1:
            failures.append(f"expected above-fold reveals to become visible, got {before['visible_count']}")
        if not before["rail_exists"] or before["rail_dot_count"] < 4:
            failures.append(f"chapter rail missing or sparse: {before['rail_dot_count']}")
        if before["has_mojibake"]:
            failures.append("method page contains mojibake markers")

        page.mouse.move(980, 620)
        page.mouse.wheel(0, 1400)
        page.evaluate("window.scrollBy(0, 1400)")
        page.wait_for_timeout(550)
        after_scroll = inspect_motion(page)
        if after_scroll["visible_count"] <= before["visible_count"]:
            failures.append("scroll did not reveal additional sections")
        if not after_scroll["progress_transform"].startswith("scaleX("):
            failures.append("scroll progress bar did not update")

        if after_scroll["rail_dot_count"] >= 4:
            page.locator(".motion-chapter-rail button").nth(3).click()
            page.wait_for_timeout(550)
            active_count = page.locator(".motion-chapter-rail button.active").count()
            if active_count < 1:
                failures.append("chapter rail did not mark an active section after click")

        page.evaluate("navigate('/article-workshop/article-01')")
        page.wait_for_timeout(600)
        after_route = inspect_motion(page)
        if "文章" not in after_route["title_sample"] and "Article" not in after_route["title_sample"]:
            failures.append("route transition did not render article detail content")
        if after_route["has_mojibake"]:
            failures.append("article route contains mojibake markers")
        page.screenshot(path=str(DESKTOP_SHOT), full_page=False)

        mobile = browser.new_page(viewport={"width": 390, "height": 1100}, is_mobile=True)
        mobile.goto(f"{BASE_URL}/method-universe/method-001", wait_until="networkidle")
        mobile.wait_for_timeout(500)
        mobile_state = inspect_motion(mobile)
        if mobile_state["rail_exists"]:
            failures.append("chapter rail should be hidden on mobile")
        if mobile_state["reveal_count"] < 5:
            failures.append("mobile reveal targets missing")
        if mobile_state["has_mojibake"]:
            failures.append("mobile contains mojibake markers")
        mobile.screenshot(path=str(MOBILE_SHOT), full_page=False)
        browser.close()

    report = {
        "before": before,
        "after_scroll": after_scroll,
        "after_route": after_route,
        "mobile": mobile_state,
        "screenshots": [str(DESKTOP_SHOT), str(MOBILE_SHOT)],
        "failures": failures,
    }
    print(report)
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round66#"
SHOT = ROOT / "docs" / "round66_tool_detail_demand_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round66_tool_detail_mobile_verified.png"


def inspect(page):
    return page.evaluate(
        """
        () => {
          const text = document.body.innerText;
          const board = document.querySelector('.demand-insight-board');
          const signals = [...document.querySelectorAll('.demand-signal-card strong')].map((x) => x.innerText);
          return {
            has_board: !!board,
            signal_count: signals.length,
            signals,
            has_tool_title: text.includes('GEARS'),
            has_skill_chain: text.includes('建议调用的Skill链'),
            has_license: text.includes('许可证') || text.includes('license'),
            has_minimal_run: text.includes('最小可运行路径'),
            has_boundary: text.includes('不替代临床诊断') || text.includes('不声称本工具已在用户数据上验证效果'),
            has_model_prompt: text.includes('可复制到模型网关的提示词'),
            has_mojibake: /[�]|涓|鐢|鍥|鍙/.test(text),
            sample: text.slice(0, 900)
          };
        }
        """
    )


def main():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1050}, device_scale_factor=1)
        page.goto(f"{BASE_URL}/open-source/gears", wait_until="networkidle")
        page.fill("#tool-demand", "我想用GEARS做组合基因扰动预测，数据是单细胞表达矩阵和扰动标签，但不知道怎么判断能不能跑。")
        page.click("#tool-demand-build")
        page.wait_for_timeout(900)
        state = inspect(page)
        if not state["has_board"]:
            failures.append("tool demand insight board missing")
        if state["signal_count"] < 1:
            failures.append("tool demand signals missing")
        if not state["has_tool_title"]:
            failures.append("GEARS title missing")
        if not state["has_skill_chain"]:
            failures.append("skill chain missing")
        if not state["has_license"]:
            failures.append("license/source boundary missing")
        if not state["has_minimal_run"]:
            failures.append("minimal run path missing")
        if not state["has_boundary"]:
            failures.append("safety boundary missing")
        if not state["has_model_prompt"]:
            failures.append("model prompt missing")
        if state["has_mojibake"]:
            failures.append("tool detail contains mojibake markers")
        page.screenshot(path=str(SHOT), full_page=False)

        mobile = browser.new_page(viewport={"width": 390, "height": 1100}, is_mobile=True)
        mobile.goto(f"{BASE_URL}/open-source/gears", wait_until="networkidle")
        mobile.fill("#tool-demand", "我想先用公开小数据理解GEARS，不想误写成真实验证结果。")
        mobile.click("#tool-demand-build")
        mobile.wait_for_timeout(900)
        mobile_state = inspect(mobile)
        if not mobile_state["has_board"]:
            failures.append("mobile tool demand insight board missing")
        if mobile_state["has_mojibake"]:
            failures.append("mobile tool detail contains mojibake markers")
        mobile.screenshot(path=str(MOBILE_SHOT), full_page=False)
        browser.close()

    result = {
        "desktop": state,
        "mobile": mobile_state,
        "screenshots": [str(SHOT), str(MOBILE_SHOT)],
        "failures": failures,
    }
    print(result)
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

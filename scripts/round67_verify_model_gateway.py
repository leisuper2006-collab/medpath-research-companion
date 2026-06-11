from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round67#"
SHOT = ROOT / "docs" / "round67_model_gateway_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round67_model_gateway_mobile_verified.png"


def inspect(page):
    return page.evaluate(
        """
        () => {
          const text = document.body.innerText;
          const sanitized = text.replace(/CSU_CHAT_API_KEY|OPENAI_API_KEY|DEEPSEEK_API_KEY|QWEN_API_KEY|ANTHROPIC_API_KEY/g, "");
          const secretLike = /sk-[A-Za-z0-9_-]{20,}|api[_-]?key\\s*[:=]\\s*[A-Za-z0-9_-]{16,}|bearer\\s+[A-Za-z0-9._-]{24,}/i.test(sanitized);
          return {
            has_preview: !!document.querySelector(".gateway-preview-card"),
            has_flow_lane: document.querySelectorAll(".gateway-flow-lane div").length >= 5,
            has_preview_grid: document.querySelectorAll(".gateway-preview-grid article").length >= 3,
            has_demand_board: !!document.querySelector(".demand-insight-board"),
            has_request_json: text.includes("JSON") || text.includes("request"),
            has_skill_chain_text: text.includes("Skill") || text.includes("skills"),
            has_never_show_key: text.includes("不显示") || text.includes("不展示") || text.includes("Key"),
            has_mock_output: text.includes("Mock") || text.includes("mock"),
            has_article_workflow: text.includes("文章") || text.includes("workflow"),
            has_secret_like: secretLike,
            sample: text.slice(0, 1200)
          };
        }
        """
    )


def run_desktop(browser):
    page = browser.new_page(viewport={"width": 1440, "height": 1100}, device_scale_factor=1)
    page.goto(f"{BASE_URL}/model-gateway", wait_until="networkidle")
    page.wait_for_selector("#gw-task")
    options = page.locator("#gw-task option").evaluate_all("(nodes) => nodes.map((n) => n.value)")
    target_task = "article_workflow" if "article_workflow" in options else options[-1]
    page.select_option("#gw-task", target_task)
    page.fill(
        "#gw-prompt",
        "我想写一篇单细胞机制论文，但不知道如何把数据质控、图表、引用和伦理审查串成可执行流程。",
    )
    page.click("#gw-normalize")
    page.wait_for_timeout(900)
    page.click("#gw-mock")
    page.wait_for_timeout(900)
    state = inspect(page)
    page.screenshot(path=str(SHOT), full_page=False)
    page.close()
    return state


def run_mobile(browser):
    page = browser.new_page(viewport={"width": 390, "height": 1150}, is_mobile=True)
    page.goto(f"{BASE_URL}/model-gateway", wait_until="networkidle")
    page.wait_for_selector("#gw-task")
    page.fill("#gw-prompt", "我有自己的模型API，希望先生成规范化请求，再交给Skill链审查。")
    page.click("#gw-normalize")
    page.wait_for_timeout(900)
    state = inspect(page)
    page.screenshot(path=str(MOBILE_SHOT), full_page=False)
    page.close()
    return state


def main():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        desktop = run_desktop(browser)
        mobile = run_mobile(browser)
        browser.close()

    required = {
        "has_preview": "gateway task preview missing",
        "has_flow_lane": "five-step gateway flow missing",
        "has_preview_grid": "preview grid missing",
        "has_demand_board": "demand insight board missing after normalize",
        "has_request_json": "normalized request JSON missing",
        "has_skill_chain_text": "skill chain text missing",
        "has_never_show_key": "key safety text missing",
        "has_mock_output": "mock output missing",
    }
    for key, msg in required.items():
        if not desktop.get(key):
            failures.append(f"desktop: {msg}")
    for key in ["has_preview", "has_flow_lane", "has_demand_board", "has_request_json"]:
        if not mobile.get(key):
            failures.append(f"mobile: {required.get(key, key)}")
    if desktop.get("has_secret_like") or mobile.get("has_secret_like"):
        failures.append("possible secret-like token exposed in page text")

    result = {
        "desktop": desktop,
        "mobile": mobile,
        "screenshots": [str(SHOT), str(MOBILE_SHOT)],
        "failures": failures,
    }
    print(result)
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

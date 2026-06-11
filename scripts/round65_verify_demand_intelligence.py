from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "http://127.0.0.1:4173/?fresh=round65#"
SHOT = ROOT / "docs" / "round65_demand_intelligence_verified.png"
MOBILE_SHOT = ROOT / "docs" / "round65_demand_intelligence_mobile_verified.png"


def page_state(page):
    return page.evaluate(
        """
        () => {
          const text = document.body.innerText;
          const boards = [...document.querySelectorAll('.demand-insight-board')];
          const cards = [...document.querySelectorAll('.demand-signal-card')];
          return {
            board_count: boards.length,
            signal_count: cards.length,
            signal_titles: cards.map((x) => x.querySelector('strong')?.innerText || '').filter(Boolean),
            has_materials: text.includes('先补齐的材料'),
            has_skill_chain: text.includes('建议调用的Skill链'),
            has_boundary: text.includes('不替代临床诊断') || text.includes('不生成真实患者'),
            has_model_prompt: text.includes('模型网关提示') || text.includes('可复制到模型网关'),
            has_mojibake: /[�]|涓|鐢|鍥|鍙/.test(text),
            sample: text.slice(0, 900)
          };
        }
        """
    )


def require(condition, failures, message):
    if not condition:
        failures.append(message)


def main():
    failures = []
    snapshots = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1050}, device_scale_factor=1)

        page.goto(f"{BASE_URL}/method-universe/method-001", wait_until="networkidle")
        page.fill("#method-demand", "我想用CRISPR敲除TP53后观察胃癌细胞迁移变化，并准备机制研究文章和主图。")
        page.click("#method-demand-build")
        page.wait_for_timeout(300)
        method = page_state(page)
        snapshots["method"] = method
        require(method["board_count"] >= 1, failures, "method demand insight board missing")
        require("基因扰动" in method["signal_titles"] or "文章流程" in method["signal_titles"], failures, "method signals did not detect gene perturbation/article intent")
        require(method["has_materials"] and method["has_skill_chain"] and method["has_boundary"], failures, "method package missing materials/skill/boundary")

        page.goto(f"{BASE_URL}/plot-gallery/volcano_plot", wait_until="networkidle")
        page.fill("#plot-demand", "我有差异表达结果，字段包括gene、logFC、pvalue、padj，想画火山图并写清楚哪些结论不能说。")
        page.click("#plot-demand-build")
        page.wait_for_timeout(300)
        plot = page_state(page)
        snapshots["plot"] = plot
        require(plot["board_count"] >= 1, failures, "plot demand insight board missing")
        require(plot["has_materials"] and plot["has_model_prompt"], failures, "plot package missing materials/model prompt")

        page.goto(f"{BASE_URL}/article-workshop/article-01", wait_until="networkidle")
        page.fill("#article-topic", "胃癌数字病理AI Skills教学评价的系统综述与Meta分析")
        page.click("#article-build")
        page.wait_for_timeout(400)
        article = page_state(page)
        snapshots["article"] = article
        require(article["board_count"] >= 1, failures, "article demand insight board missing")
        require(article["has_materials"] and article["has_skill_chain"] and article["has_model_prompt"], failures, "article package missing materials/skill/model prompt")

        page.goto(f"{BASE_URL}/source-library/aml_ohsu_2022", wait_until="networkidle")
        page.fill("#source-demand-text", "我想基于这个公开来源设计一个病理PBL教学案例，并连接方法、图谱和文章流程。")
        page.click("#source-demand-build")
        page.wait_for_timeout(300)
        source = page_state(page)
        snapshots["source"] = source
        require(source["board_count"] >= 1, failures, "source demand insight board missing")
        require(source["has_materials"] and source["has_boundary"], failures, "source package missing materials/boundary")

        for name, state in snapshots.items():
            if state["has_mojibake"]:
                failures.append(f"{name} page contains mojibake markers")

        page.screenshot(path=str(SHOT), full_page=False)

        mobile = browser.new_page(viewport={"width": 390, "height": 1100}, is_mobile=True)
        mobile.goto(f"{BASE_URL}/method-universe/method-001", wait_until="networkidle")
        mobile.fill("#method-demand", "我想做单细胞CRISPR筛选结果的细胞状态解释。")
        mobile.click("#method-demand-build")
        mobile.wait_for_timeout(300)
        mobile_state = page_state(mobile)
        snapshots["mobile_method"] = mobile_state
        require(mobile_state["board_count"] >= 1, failures, "mobile method demand insight missing")
        require(mobile_state["signal_count"] >= 1, failures, "mobile signal cards missing")
        mobile.screenshot(path=str(MOBILE_SHOT), full_page=False)
        browser.close()

    result = {
        "snapshots": snapshots,
        "screenshots": [str(SHOT), str(MOBILE_SHOT)],
        "failures": failures,
    }
    print(result)
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

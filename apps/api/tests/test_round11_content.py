from fastapi.testclient import TestClient
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app


client = TestClient(app)


def test_model_gateway_templates_and_normalization_do_not_expose_keys():
    templates = client.get("/api/model-gateway/templates")
    assert templates.status_code == 200
    template_data = templates.json()
    assert len(template_data["providers"]) >= 6
    assert len(template_data["task_types"]) >= 5

    response = client.post(
        "/api/model-gateway/normalize",
        json={
            "provider_id": "local_mock",
            "task_type": "article_workflow",
            "prompt": "build a meta-analysis workflow",
            "output_format": "json",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "mock"
    assert data["api_key_visible"] is False
    assert data["request"]["metadata"]["recommended_skills"]
    assert "sk-" not in str(data)


def test_model_gateway_mock_generate_keeps_human_review_boundary():
    response = client.post(
        "/api/model-gateway/mock-generate",
        json={"provider_id": "local_mock", "task_type": "case_generation", "prompt": "generate a pathology PBL case"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "mock-output"
    assert data["result"]["teacher_review_required"] is True
    assert data["normalized_request"]["mode"] == "mock"


def test_method_universe_threshold_and_safety_boundary():
    response = client.get("/api/method-universe?limit=700")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 360
    assert "仅用于教学与科研训练" in items[0]["safety_boundary"]


def test_method_universe_detail_has_beginner_workflow_fields():
    response = client.get("/api/method-universe/method-001")
    assert response.status_code == 200
    item = response.json()
    assert item["name"]
    assert item["beginner_question"]
    assert item["inputs"]
    assert item["workflow"]
    assert item["outputs"]
    assert item["use_case_group"]
    assert item["beginner_glossary"]
    assert item["data_readiness_checklist"]
    assert item["recommended_article_workflows"]
    assert item["recommended_plot_types"]
    assert item["skill_chain"]
    assert item["learning_path"]
    assert item["mentor_review_questions"]
    assert item["model_gateway_prompt_template"]
    assert item["human_review_checklist"]
    assert item["hero_title"]
    assert item["why_it_matters"]
    assert len(item["apple_style_sections"]) >= 4
    assert item["public_source_example"]["url"].startswith("https://www.cbioportal.org")
    assert item["example_visual"]["url"].endswith(".svg")


def test_method_universe_has_unique_product_detail_content():
    response = client.get("/api/method-universe?limit=700")
    assert response.status_code == 200
    items = response.json()
    titles = [item["hero_title"] for item in items]
    assert len(titles) == len(set(titles))
    assert all(item["public_source_example"]["citation"] for item in items)
    assert all(item["example_visual"]["source_note"] for item in items)
    visual_urls = [item["example_visual"]["url"] for item in items]
    assert len(visual_urls) == len(set(visual_urls))
    assert all("/outputs/round11_method_plots/" in url for url in visual_urls)


def test_gene_perturbation_family_has_multiple_routes():
    response = client.get("/api/gene-perturbation-methods")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 20
    assert any("CRISPR-Cas9" in item["name"] for item in items)
    assert any("虚拟基因敲除" in item["name"] for item in items)


def test_article_workflows_and_plot_gallery_thresholds():
    articles = client.get("/api/article-workflows").json()
    plots = client.get("/api/plot-gallery?limit=160").json()
    assert len(articles) >= 24
    assert len(plots) >= 90
    assert any(item["type"] == "Meta分析" for item in articles)
    assert any(item["name"] == "volcano" for item in plots)


def test_data_audit_returns_non_fabrication_guidance():
    response = client.post(
        "/api/data-audit/run",
        json={"description": "样本ID, 分组, 生存时间, 伦理审批, 缺失值", "columns": ["样本ID", "伦理审批"]},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "不生成真实统计结果" in payload["note"]
    assert payload["matched_rules"]


def test_article_workflow_build_package_has_no_fabricated_results():
    response = client.post(
        "/api/article-workflows/build",
        json={"workflow_id": "article-01", "topic": "医学教育AI Skills评价"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "不会生成或伪造真实研究结果" in payload["note"]
    assert payload["human_review_required"] is True
    assert "不得编造结果或引用" in payload["model_prompt"]


def test_plot_demo_gallery_exposes_r_generated_svg_examples():
    response = client.get("/api/plot-demo-gallery")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 18
    assert all(item["url"].endswith(".svg") for item in items)
    assert all(item["exists"] is True for item in items)
    assert all(
        "synthetic" in item["status"] or "public API" in item["status"]
        for item in items
    )
    assert any("cBioPortal" in item["source"] for item in items)
    assert all("clinical" in item["status"] or "not real study result" in item["status"] for item in items)


def test_plot_gallery_product_detail_fields_are_unique_and_source_bound():
    response = client.get("/api/plot-gallery?limit=160")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 100

    product_titles = [item["plot_product_title"] for item in items]
    assert len(product_titles) == len(set(product_titles))
    assert all(len(item["plot_story_sections"]) >= 4 for item in items)
    assert all(item["public_source_example"]["url"].startswith("https://www.cbioportal.org") for item in items)
    assert all(item["example_visual"]["url"].endswith(".svg") for item in items)
    assert all(item["model_gateway_prompt_template"] for item in items)
    visual_urls = [item["example_visual"]["url"] for item in items]
    assert len(visual_urls) == len(set(visual_urls))


def test_article_workflows_product_detail_fields_are_unique_and_source_bound():
    response = client.get("/api/article-workflows")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 28

    product_titles = [item["article_product_title"] for item in items]
    assert len(product_titles) == len(set(product_titles))
    assert all(len(item["article_story_sections"]) >= 4 for item in items)
    assert all(item["public_source_example"]["url"].startswith("https://www.cbioportal.org") for item in items)
    assert all(item["example_visual"]["url"].endswith(".svg") for item in items)
    assert all(item["model_gateway_prompt_template"] for item in items)
    visual_urls = [item["example_visual"]["url"] for item in items]
    assert len(visual_urls) == len(set(visual_urls))


def test_open_source_tools_have_product_detail_pages_and_unique_visuals():
    response = client.get("/api/open-source")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 80

    product_titles = [item["tool_product_title"] for item in items]
    assert len(product_titles) == len(set(product_titles))
    visual_urls = [item["example_visual"]["url"] for item in items]
    assert len(visual_urls) == len(set(visual_urls))
    assert all(len(item["tool_story_sections"]) >= 4 for item in items)
    trusted_public_domains = (
        "https://www.cbioportal.org",
        "https://docs.cbioportal.org",
        "https://waldronlab.io",
        "https://r-graph-gallery.com",
        "https://satijalab.org",
        "https://bioconductor.org",
        "https://portal.gdc.cancer.gov",
        "https://xenabrowser.net",
        "https://cellxgene.cziscience.com",
        "https://www.10xgenomics.com",
    )
    assert all(item["public_source_example"]["url"].startswith(trusted_public_domains) for item in items)
    assert all(item["model_gateway_prompt_template"] for item in items)

    detail = client.get(f"/api/open-source/{items[0]['id']}")
    assert detail.status_code == 200
    assert detail.json()["id"] == items[0]["id"]


def test_plot_advice_reports_missing_columns_and_safety_prompt():
    response = client.post(
        "/api/plot/advice",
        json={"plot_type": "volcano", "columns": ["gene_id", "log2FC"], "description": "volcano demo"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["missing_columns"]
    assert "不得编造真实统计结果" in data["model_prompt"]
    assert data["audit_hits"]


def test_journey_builder_route_is_available_in_static_app():
    app_js = Path(__file__).resolve().parents[2] / "web" / "static" / "app.js"
    text = app_js.read_text(encoding="utf-8")
    assert "/journey-builder" in text
    assert "journeyBuilderPage" in text
    assert "renderJourneyPlan" in text
    assert "一句话生成科研学习路径" in text

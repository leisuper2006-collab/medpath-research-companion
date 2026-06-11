import sys
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["mode"] == "mock"


def test_core_catalog_counts() -> None:
    assert len(client.get("/api/plugins").json()) >= 3
    assert len(client.get("/api/skills").json()) >= 13
    assert len(client.get("/api/open-source").json()) >= 30
    assert len(client.get("/api/simulate/cases").json()) >= 30
    assert len(client.get("/api/compare/demos").json()) >= 8
    assert len(client.get("/api/providers").json()) >= 12
    assert len(client.get("/api/methods").json()) >= 20


def test_simulation_case_generation() -> None:
    response = client.post(
        "/api/simulate/case",
        json={
            "disease_system": "消化系统",
            "organ_system": "胃黏膜",
            "student_level": "本科三年级",
            "teaching_goal": "生成胃腺癌PBL教学案例",
            "difficulty": "进阶",
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["id"].startswith("generated-")
    assert "boundary" in payload
    assert "真实患者" in payload["boundary"]


def test_compare_plot_skill_builder_provider_and_governance() -> None:
    assert client.post("/api/compare/run", json={"task_id": "pbl-case"}).status_code == 200

    plot = client.post("/api/plot/generate", json={"plot_type": "scatter"})
    assert plot.status_code == 200
    assert "<svg" in plot.json()["svg"]

    skill = client.post(
        "/api/skill-builder/generate",
        json={
            "name": "demo-skill",
            "zh_name": "示例Skill",
            "task": "生成教学反馈",
            "inputs": "学生报告草稿",
            "outputs": "反馈清单",
            "risk_boundary": "仅用于教学与科研训练，不替代临床诊断",
        },
    )
    assert skill.status_code == 200
    assert "SKILL.md" in skill.json()["downloads"]

    provider = client.post("/api/providers/test", json={"provider_id": "openai"})
    assert provider.status_code == 200
    assert provider.json()["mode"] in {"mock", "configured"}

    audit = client.post("/api/governance/audit", json={"text": "请检查这段教学反馈"})
    assert audit.status_code == 200
    assert audit.json()["human_review_required"] is True


def test_frontend_routes_return_html() -> None:
    routes = [
        "/",
        "/teacher",
        "/student",
        "/researcher",
        "/skill-builder",
        "/plugins",
        "/plugins/teaching",
        "/plugins/research",
        "/plugins/governance",
        "/skills/pathology-report-coach",
        "/simulate",
        "/simulate/new",
        "/simulate/demo-case-001",
        "/compare",
        "/evidence",
        "/open-source",
        "/plot-studio",
        "/method-runner",
        "/method-runner/virtual-perturbation",
        "/runtime",
        "/providers",
        "/governance",
        "/settings",
    ]
    for route in routes:
        response = client.get(route)
        assert response.status_code == 200, route
        assert "MedPath Research & Education Skills Studio" in response.text

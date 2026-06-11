from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


SAFETY = "医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置，所有结果须经教师或专家复核。"


class ApiMessage(BaseModel):
    status: str
    mode: str = "mock"
    safety: str = SAFETY


class Plugin(BaseModel):
    id: str
    name: str
    zh_name: str
    description: str
    skills: list[str]
    enabled: bool
    safety_tags: list[str]
    starter_prompts: list[str]


class Skill(BaseModel):
    id: str
    zh_name: str
    en_name: str
    category: str
    description: str
    skill_md: str
    demo_input: str
    demo_output: str
    evals: list[str]
    safety: str
    review_checklist: list[str]


class SimulateCaseRequest(BaseModel):
    disease_system: str = "消化系统"
    organ_system: str = "胃黏膜"
    student_level: str = "本科三年级"
    teaching_goal: str = "病理形态学推理"
    difficulty: Literal["基础", "进阶", "挑战"] = "进阶"
    need_pbl: bool = True
    need_report_training: bool = True
    need_research_extension: bool = True
    need_ethics_audit: bool = True


class SimulatedCase(BaseModel):
    id: str
    title: str
    level: str
    disease_system: str
    organ_system: str
    difficulty: str
    teaching_goal: str
    background: str
    gross: str
    microscopy: list[str]
    ihc: list[str]
    pbl_questions: list[str]
    report_prompt: str
    ethics_audit: list[str]
    teacher_review: list[str]
    boundary: str


class CompareRunRequest(BaseModel):
    task_id: str = "pbl-case"


class CompareDemo(BaseModel):
    id: str
    title: str
    task_input: str
    no_ai: str
    normal_prompt: str
    medpath_skill: str
    note: str


class PlotGenerateRequest(BaseModel):
    plot_type: str = "scatter"
    plot_id: str | None = None


class PlotGenerateResponse(BaseModel):
    plot_type: str
    svg: str
    caption: str
    methods_text: str
    download_name: str


class SkillBuilderRequest(BaseModel):
    name: str = Field(default="mitochondrial-ultrastructure-tutor")
    zh_name: str = Field(default="线粒体超微病理导学Skill")
    task: str = Field(default="生成超微结构导学问题、易错点和复核清单")
    inputs: str = Field(default="超微图像描述、教学目标、学生年级")
    outputs: str = Field(default="导学问题、机制解释、易错点、教师复核清单")
    risk_boundary: str = Field(default=SAFETY)


class SkillBuilderResponse(BaseModel):
    skill_md: str
    plugin_json: dict[str, Any]
    eval_yaml: str
    readme: str
    downloads: dict[str, str]


class ProviderTestRequest(BaseModel):
    provider_id: str


class ProviderTestResponse(BaseModel):
    provider_id: str
    configured: bool
    mode: Literal["mock", "configured"] = "mock"
    message: str


class GovernanceAuditRequest(BaseModel):
    text: str


class GovernanceAuditResponse(BaseModel):
    risk_flags: list[str]
    allowed_for_teaching: bool
    human_review_required: bool
    safety: str = SAFETY

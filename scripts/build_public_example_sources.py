from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlencode

import requests


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = DATA / "public_example_sources.json"
DOC = ROOT / "docs" / "round11_public_example_sources_report.md"

CBIO = "https://www.cbioportal.org/api/studies"
KEYWORDS = ["Nature", "Cell", "Nat Commun", "Science", "Cancer Cell", "TCGA"]


def get_json(url: str) -> list[dict]:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


def normalize_study(study: dict, keyword: str) -> dict:
    citation = study.get("citation") or "待核对正式引用"
    pmid = study.get("pmid") or "待核对PMID"
    sample_count = (
        study.get("sequencedSampleCount")
        or study.get("allSampleCount")
        or study.get("completeSampleCount")
        or study.get("cnaSampleCount")
        or 0
    )
    tier = "公开高水平研究来源"
    if re.search(r"\bNature\b|Nat Commun|Nature Communications", citation, re.I):
        tier = "Nature/Nature Communications公开研究来源"
    elif re.search(r"\bCell\b|Cancer Cell", citation, re.I):
        tier = "Cell/Cancer Cell公开研究来源"
    elif re.search(r"\bScience\b", citation, re.I):
        tier = "Science公开研究来源"
    elif "TCGA" in citation:
        tier = "TCGA公开联盟数据来源"
    return {
        "id": study.get("studyId"),
        "title": study.get("name"),
        "description": re.sub(r"<[^>]+>", "", study.get("description") or "").strip(),
        "citation": citation,
        "pmid": pmid,
        "cancer_type": study.get("cancerTypeId", "unknown"),
        "reference_genome": study.get("referenceGenome", "unknown"),
        "sample_count_public_metadata": sample_count,
        "source_platform": "cBioPortal public API",
        "query_keyword": keyword,
        "license_note": "仅使用cBioPortal公开研究元数据和引用信息；不下载受控数据，不复制论文原图。",
        "reuse_boundary": "可用于教学示例来源说明和公开数据检索入口；正式科研需按原数据库与论文许可要求核对。",
        "tier": tier,
        "url": f"https://www.cbioportal.org/study/summary?id={study.get('studyId')}",
    }


def main() -> None:
    seen: set[str] = set()
    sources: list[dict] = []
    for keyword in KEYWORDS:
        params = urlencode({"projection": "SUMMARY", "pageSize": 20, "keyword": keyword})
        try:
            studies = get_json(f"{CBIO}?{params}")
        except Exception as exc:  # pragma: no cover - network fallback
            print(f"warning: failed keyword={keyword}: {exc}")
            continue
        for study in studies:
            sid = study.get("studyId")
            if not sid or sid in seen:
                continue
            seen.add(sid)
            sources.append(normalize_study(study, keyword))
    sources = sorted(sources, key=lambda x: (x["tier"], x["title"] or ""))[:80]
    OUT.write_text(json.dumps(sources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    by_tier: dict[str, int] = {}
    for source in sources:
        by_tier[source["tier"]] = by_tier.get(source["tier"], 0) + 1
    DOC.write_text(
        "# Round11 公开顶刊/高分区示例来源目录\n\n"
        f"- 来源数量：{len(sources)}\n"
        "- 数据来源：cBioPortal public API metadata。\n"
        "- 使用边界：仅记录公开研究元数据、引用、PMID、样本量和链接；不复制论文原图，不下载受控数据，不展示真实患者隐私。\n"
        "- 页面用途：每个方法详情页可引用一个公开来源作为“可检索示例来源”，并配合本站用合成/公开数据重绘的教学示例图。\n\n"
        "## 来源分布\n\n"
        + "\n".join(f"- {k}: {v}" for k, v in sorted(by_tier.items()))
        + "\n\n## 前10条示例\n\n"
        + "\n".join(
            f"{i+1}. {s['title']}；{s['citation']}；PMID: {s['pmid']}；{s['url']}"
            for i, s in enumerate(sources[:10])
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"sources": len(sources), "tiers": by_tier}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

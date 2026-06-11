# Final Development Audit Report

Frontend URL: `http://127.0.0.1:3000`
Backend URL: `http://127.0.0.1:8000/api/health`

## Checks

| Check | Result | Evidence |
|---|---:|---|
| frontend package.json exists | PASS |  |
| backend main.py exists | PASS |  |
| Playwright spec exists | PASS |  |
| plugins >= 3 | PASS | 3 |
| skills >= 13 | PASS | 16 |
| synthetic cases >= 120 | PASS | 120 |
| comparison demos >= 8 | PASS | 8 |
| open-source items >= 80 | PASS | 83 |
| method cards >= 20 | PASS | 20 |
| providers >= 12 | PASS | 12 |
| governance rules >= 20 | PASS | 20 |
| no plaintext key pattern | PASS |  |
| no Chinese ID-like sequence | PASS |  |
| no mobile phone-like sequence | PASS |  |
| no fabricated completion claims | PASS |  |
| GB10 not productized | PASS |  |
| backend APIs callable | PASS | {'status': 'ok', 'mode': 'mock', 'safety': '医学AI输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置，所有结果须经教师或专家复核。'} |
| all required frontend routes served | PASS |  |
| screenshots >= 12 | PASS | 18 |

## Counts

{
  "plugins": 3,
  "skills": 16,
  "synthetic_cases": 120,
  "comparison_demos": 8,
  "open_source": 83,
  "methods": 20,
  "providers": 12,
  "governance_rules": 20
}

## Boundary

- 未宣称 D03 真实上线。
- 未宣称真实课程试点完成。
- 未伪造教师评分、学生问卷或教学效果。
- 医学 AI 输出仅用于教学与科研训练，不替代临床诊断。
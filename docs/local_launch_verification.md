# Local Launch Verification

## URLs

- Frontend: `http://127.0.0.1:3000`
- Backend: `http://127.0.0.1:8000/api/health`

## Commands

```powershell
cd "C:\Users\HONOR\Desktop\AI skill\medpath-research-education-skills-studio-real\apps\api"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 3000
```

## Verification Scope

- API health and required endpoints.
- Page routing and non-404 checks for all required URLs.
- Core interactions: teacher case generation, simulation generation, comparison switch, open-source filtering, plot generation, Skill Builder, provider mock test, governance audit.

截图和最终结果见 `docs/final_development_audit_report.md`。

## Playwright Interaction Verification

| Flow | Result |
|---|---:|
| teacher PBL generation | PASS |
| student report feedback | PASS |
| simulation case generation | PASS |
| comparison demo switch | PASS |
| open-source virtual perturbation filter | PASS |
| plot studio SVG generation | PASS |
| skill builder generation | PASS |
| provider mock connection | PASS |
| governance audit | PASS |

## Playwright Interaction Verification

| Flow | Result |
|---|---:|
| teacher PBL generation | PASS |
| student report feedback | PASS |
| simulation case generation | PASS |
| comparison demo switch | PASS |
| open-source virtual perturbation filter | PASS |
| plot studio SVG generation | PASS |
| skill builder generation | PASS |
| provider mock connection | PASS |
| governance audit | PASS |

## Playwright Interaction Verification

| Flow | Result |
|---|---:|
| teacher PBL generation | PASS |
| student report feedback | PASS |
| simulation case generation | PASS |
| comparison demo switch | PASS |
| open-source virtual perturbation filter | PASS |
| plot studio SVG generation | PASS |
| skill builder generation | PASS |
| provider mock connection | PASS |
| governance audit | PASS |

## Playwright Interaction Verification

| Flow | Result |
|---|---:|
| teacher PBL generation | PASS |
| student report feedback | PASS |
| simulation case generation | PASS |
| comparison demo switch | PASS |
| open-source virtual perturbation filter | PASS |
| plot studio SVG generation | PASS |
| skill builder generation | PASS |
| provider mock connection | PASS |
| governance audit | PASS |

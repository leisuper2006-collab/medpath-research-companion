# GitHub Pages Publish Status

Status: **ready for remote authentication and push**

## Local publication state

- Local git repository: yes
- Branch: `main`
- First commit: `6561144 Build MedPath research companion site`
- Static build script: `python scripts/build_static_release.py`
- GitHub Pages workflow: `.github/workflows/pages.yml`
- CI workflow: `.github/workflows/ci.yml`
- Static preview URL on this machine: `http://127.0.0.1:4173/?fresh=round72`
- Secret scan status: pass in `scripts/round62_github_pages_ready.py`

## Current blockers for true public access

The site is not yet publicly reachable because the local repository has no GitHub remote and this machine currently has no authenticated GitHub CLI session.

Required external step:

1. Create or provide a GitHub repository, for example:
   - `https://github.com/<your-account>/medpath-research-companion.git`
2. Add it as `origin`.
3. Push `main`.
4. Enable GitHub Pages with GitHub Actions, or let `.github/workflows/pages.yml` deploy automatically after push.

## Commands after a remote repository exists

```powershell
git remote add origin https://github.com/<your-account>/medpath-research-companion.git
git push -u origin main
```

After the first push, open repository settings:

`Settings -> Pages -> Build and deployment -> Source: GitHub Actions`

Then run or wait for the workflow:

`Actions -> Deploy Static Demo to GitHub Pages`

## Safety notes

- `.env` and API keys are ignored by `.gitignore`.
- The site uses mock/demo data for public presentation.
- Medical AI output is only for teaching and research training, not clinical diagnosis.
- Public-source plots are teaching redraws or synthetic examples; they do not claim real patient conclusions.

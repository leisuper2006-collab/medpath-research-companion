param(
  [string]$Remote = "https://github.com/leisuper2006-collab/medpath-research-companion.git",
  [string]$PublishDir = "..\medpath-gh-pages-publish"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

python scripts\build_static_release.py

$src = Resolve-Path "dist\github-pages-demo"
$target = Join-Path $repoRoot $PublishDir

if (Test-Path $target) {
  Remove-Item -LiteralPath $target -Recurse -Force
}

New-Item -ItemType Directory -Path $target | Out-Null
Copy-Item -Path (Join-Path $src "*") -Destination $target -Recurse -Force
New-Item -ItemType File -Path (Join-Path $target ".nojekyll") -Force | Out-Null

Set-Content -Path (Join-Path $target "DEPLOYMENT_NOTE.md") -Encoding UTF8 -Value @"
# MedPath Research Companion GitHub Pages Build

This branch contains the prebuilt static site for GitHub Pages. It is generated from the main branch by scripts/build_static_release.py.

Safety boundary: demo content is for teaching and research training only. It does not replace clinical diagnosis.
"@

Set-Location $target
git init
git branch -M gh-pages
git config user.name "Codex Publisher"
git config user.email "codex-publisher@users.noreply.github.com"
git add -A
git commit -m "Publish static GitHub Pages site"
git remote add origin $Remote
git config http.version HTTP/1.1
git config http.postBuffer 524288000
git push -f origin gh-pages

Write-Host "Published to: https://leisuper2006-collab.github.io/medpath-research-companion/"

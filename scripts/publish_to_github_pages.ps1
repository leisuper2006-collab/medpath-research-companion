param(
  [Parameter(Mandatory=$true)]
  [string]$RemoteUrl
)

$ErrorActionPreference = "Stop"

Write-Host "== MedPath GitHub Pages publish helper =="
Write-Host "Remote: $RemoteUrl"

if (-not (git rev-parse --is-inside-work-tree 2>$null)) {
  throw "Not inside a git repository."
}

python scripts\round26_github_publish_preflight.py
python scripts\round62_github_pages_ready.py

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($existing)) {
  git remote add origin $RemoteUrl
} elseif ($existing -ne $RemoteUrl) {
  Write-Host "Existing origin: $existing"
  Write-Host "Updating origin to requested remote."
  git remote set-url origin $RemoteUrl
}

$branch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($branch)) {
  throw "Cannot resolve current branch."
}

Write-Host "Pushing branch $branch to origin..."
git push -u origin $branch

Write-Host ""
Write-Host "Push complete. In GitHub, set Pages source to GitHub Actions if not already enabled."
Write-Host "Expected workflow: .github/workflows/pages.yml"

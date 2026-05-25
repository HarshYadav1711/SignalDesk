# Quick check that submission paths exist (run from repo root).
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$required = @(
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "backend/requirements.txt",
  "backend/signaldesk.http",
  "backend/app/main.py",
  "frontend/package.json",
  "frontend/mock/enquiries.json",
  "docs/product-contract.md",
  "docs/api/README.md",
  "docs/screenshots/home.png",
  "docs/screenshots/leads.png",
  "docs/screenshots/escalations.png",
  "docs/screenshots/follow-ups.png",
  "docs/screenshots/conversation-detail.png",
  "docs/walkthrough/README.md"
)

$missing = @()
foreach ($rel in $required) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) { $missing += $rel }
}

if ($missing.Count -gt 0) {
  Write-Host "Missing deliverables:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host "  - $_" }
  exit 1
}

Write-Host "All required deliverable paths present." -ForegroundColor Green
exit 0

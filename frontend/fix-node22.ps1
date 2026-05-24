# Switch Windows from Node 25 → Node 22 for Expo SDK 52
# Run in PowerShell (not inside Python venv):  cd frontend; .\fix-node22.ps1

$ErrorActionPreference = "Stop"

Write-Host "Current node:" -NoNewline
try { node -v } catch { Write-Host " not found" }

Write-Host ""
Write-Host "Step 1: Remove Node.js 25 (OpenJS.NodeJS)..." -ForegroundColor Yellow
winget uninstall -e --id OpenJS.NodeJS --accept-source-agreements 2>&1

Write-Host ""
Write-Host "Step 2: Install Node.js 22 LTS (OpenJS.NodeJS.22)..." -ForegroundColor Yellow
winget install -e --id OpenJS.NodeJS.22 --accept-package-agreements --accept-source-agreements 2>&1

Write-Host ""
Write-Host "Close this terminal and open a NEW one, then run:" -ForegroundColor Green
Write-Host "  node -v          # expect v22.x" -ForegroundColor Cyan
Write-Host "  cd D:\Fun\SignalDesk\frontend" -ForegroundColor Cyan
Write-Host "  npm run setup" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor Cyan

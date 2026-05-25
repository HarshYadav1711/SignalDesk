# SignalDesk frontend — optional Windows setup (clean install + Expo peers)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Node version:" (node -v)
$major = [int]((node -v) -replace 'v(\d+)\..*', '$1')

if ($major -ge 23) {
  Write-Host ""
  Write-Host "Node 23+ is not supported by Expo SDK 54." -ForegroundColor Yellow
  Write-Host "Install Node 22 LTS (restart terminal after):" -ForegroundColor Yellow
  Write-Host "  winget install -e --id OpenJS.NodeJS.22" -ForegroundColor Cyan
  Write-Host ""
  $continue = Read-Host "Continue anyway? (y/N)"
  if ($continue -ne 'y' -and $continue -ne 'Y') { exit 1 }
}

Write-Host "Removing node_modules..."
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }

Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Installing Expo peer packages..."
$env:CI = "1"
npx expo install expo-asset expo-font expo-constants expo-file-system babel-preset-expo
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Done. Run: npm start" -ForegroundColor Green

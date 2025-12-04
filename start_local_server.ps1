Write-Host "Starting Charter local web server..." -ForegroundColor Green
Write-Host "Open: http://localhost:4173" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

Push-Location $PSScriptRoot
python -m http.server 4173
Pop-Location



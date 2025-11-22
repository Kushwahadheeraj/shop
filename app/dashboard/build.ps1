# PowerShell script to build Next.js app with memory optimizations
# IMPORTANT: Use this script or "npm run build" - NOT "npx next build"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next.js Build Script with Memory Limit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Do NOT use 'npx next build' - it will fail!" -ForegroundColor Yellow
Write-Host "Always use 'npm run build' or this script." -ForegroundColor Yellow
Write-Host ""

Write-Host "Cleaning previous build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Removed .next directory" -ForegroundColor Green
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
    Write-Host "Removed out directory" -ForegroundColor Green
}

Write-Host "`nStarting build with 16GB memory limit..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "`nBuild failed. Trying with more memory (20GB)..." -ForegroundColor Red
    npm run build:large
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nBuild completed with large memory setting!" -ForegroundColor Green
    } else {
        Write-Host "`nBuild still failed. Try: npm run build:max" -ForegroundColor Red
    }
}


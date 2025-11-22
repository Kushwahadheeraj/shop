# Set NODE_OPTIONS for current PowerShell session
# Run this before using npx next build (but better to use npm run build instead!)

$env:NODE_OPTIONS = "--max-old-space-size=16384 --expose-gc"
Write-Host "NODE_OPTIONS set to: $env:NODE_OPTIONS" -ForegroundColor Green
Write-Host "You can now use 'npx next build', but 'npm run build' is recommended!" -ForegroundColor Yellow


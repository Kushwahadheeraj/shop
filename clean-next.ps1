# Script to clean .next folder
Write-Host "Stopping any Node processes in this directory..."

# Try to remove .next folder
if (Test-Path .next) {
    Write-Host "Attempting to remove .next folder..."
    try {
        Remove-Item -Recurse -Force .next -ErrorAction Stop
        Write-Host "✅ .next folder removed successfully"
    } catch {
        Write-Host "❌ Could not remove .next folder: $_"
        Write-Host "💡 Please make sure:"
        Write-Host "   1. All dev servers are stopped (Ctrl+C)"
        Write-Host "   2. No other programs are using the .next folder"
        Write-Host "   3. Try closing Cursor/VS Code and reopening"
        exit 1
    }
} else {
    Write-Host "✅ .next folder doesn't exist (already clean)"
}

Write-Host ""
Write-Host "Now you can run: npm run dev"


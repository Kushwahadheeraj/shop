@echo off
echo ========================================
echo Next.js Build Script with Memory Limit
echo ========================================
echo.
echo IMPORTANT: This script uses 16GB memory limit
echo Do NOT use "npx next build" - it will fail!
echo.
echo Cleaning build cache...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
echo.
echo Starting build...
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Build completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Build failed! Trying with more memory...
    echo ========================================
    call npm run build:large
)
pause


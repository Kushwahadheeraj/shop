# ⚠️ CRITICAL: Build Instructions

## ❌ DO NOT USE: `npx next build`
This command **WILL FAIL** with memory errors because it doesn't use the required memory limit.

## ✅ ALWAYS USE ONE OF THESE:

### Option 1: npm script (Recommended)
```powershell
npm run build
```

### Option 2: With more memory (if Option 1 fails)
```powershell
npm run build:large
```

### Option 3: Maximum memory (if Option 2 fails)
```powershell
npm run build:max
```

### Option 4: Clean and build
```powershell
npm run clean:build
```

### Option 5: Use the PowerShell script
```powershell
.\build.ps1
```

### Option 6: Use the batch file
```powershell
.\build.bat
```

## Why `npx next build` fails:
- Uses default Node.js memory limit (~1.5GB)
- Your project needs 16GB+ due to its large size
- The npm scripts set `NODE_OPTIONS=--max-old-space-size=16384`

## Quick Start:
```powershell
cd app\dashboard
npm install          # Install dependencies (including cross-env)
npm run clean        # Clean old build cache
npm run build        # Build with 16GB memory limit
```

## If build still fails:
1. Try `npm run build:large` (20GB)
2. Try `npm run build:max` (24GB)
3. Check available system RAM
4. Close other applications to free memory


========================================
  ⚠️  CRITICAL BUILD INSTRUCTIONS  ⚠️
========================================

DO NOT USE: npx next build
This will FAIL with memory errors!

ALWAYS USE: npm run build

========================================
Quick Start:
========================================

1. Make sure you're in the dashboard directory:
   cd app\dashboard

2. Install dependencies (if needed):
   npm install

3. Build the project:
   npm run build

========================================
If build fails, try:
========================================

npm run build:large   (20GB memory)
npm run build:max      (24GB memory)

========================================
Why npx next build fails:
========================================

- Uses default 1.5GB memory limit
- Your project needs 16GB+ memory
- npm run build sets the correct limit

========================================


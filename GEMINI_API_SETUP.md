# Gemini API Setup Instructions

## Problem
You're getting this error:
```
AI service not configured. Please set up Gemini API key in .env.local file.
error: 'MISSING_API_KEY'
```

## Solution: Add Gemini API Key

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or use an existing key
4. Copy the API key (it will look like: `AIzaSy...`)

### Step 2: Create .env.local File

1. In your project root directory (`C:\Users\HP\Documents\NextJS-Pro\shop`), create a new file named `.env.local`
2. Add this line to the file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key from Step 1

**Example:**
```
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

### Step 3: Restart Development Server

1. Stop your current development server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

### Step 4: Verify Setup

The API should now work. Try scanning a receipt again in SimpleBillManagement.

## Alternative Environment Variable Names

The system also checks for these environment variable names (in order):
- `GEMINI_API_KEY` (preferred)
- `GOOGLE_GEMINI_API_KEY`
- `GOOGLE_API_KEY`

## Troubleshooting

### Still getting errors?

1. **Check file location**: Make sure `.env.local` is in the project root (same folder as `package.json`)
2. **Check file name**: It must be exactly `.env.local` (not `.env`, not `.env.local.txt`)
3. **Restart server**: Environment variables are only loaded when the server starts
4. **Check API key**: Make sure the key is valid and not expired
5. **Check quota**: Make sure you haven't exceeded your API quota limits

### API Key Format

Your API key should:
- Start with `AIzaSy`
- Be about 39 characters long
- Not have any spaces or quotes around it

### Example .env.local file

```
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

## Need Help?

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Check the server terminal for error logs
3. Verify your API key is active in Google AI Studio


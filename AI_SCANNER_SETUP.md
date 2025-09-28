# AI Receipt Scanner Setup Guide

## समस्या
AI Receipt Scanner काम नहीं कर रहा क्योंकि Gemini API key configure नहीं है।

## समाधान

### 1. Gemini API Key प्राप्त करें
1. [Google AI Studio](https://makersuite.google.com/app/apikey) पर जाएं
2. Google account से login करें
3. "Create API Key" button पर click करें
4. API key को copy करें

### 2. Environment Variables Setup
Project root में `.env.local` file बनाएं:

```bash
# Google Gemini AI API Key
GEMINI_API_KEY=your_actual_api_key_here

# Alternative names (optional)
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Development Server Restart
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Test करें
1. Dashboard में जाएं
2. Bill Management section में जाएं
3. "AI Receipt Scanner" button पर click करें
4. एक clear receipt image upload करें

## Troubleshooting

### Error: "AI service is not configured"
- Check कि `.env.local` file project root में है
- Check कि API key सही है
- Server restart किया है या नहीं

### Error: "Missing image data"
- Image file सही format में है (JPG, PNG, PDF)
- File size 10MB से कम है

### Error: "No structured data returned"
- Image clear और readable है
- Receipt में text properly visible है
- Try करें different angle या better lighting

## API Key Security
- `.env.local` file को git में commit न करें
- API key को share न करें
- Production में proper environment variables use करें

## Support
अगर अभी भी problem है तो:
1. Browser console में errors check करें
2. Server logs check करें
3. API key validity verify करें

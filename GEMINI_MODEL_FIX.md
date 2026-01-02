# 🔧 Gemini Model 404 Error - Fix Guide

## Problem
Getting 404 errors with both `gemini-pro` and `gemini-1.5-flash`:
```
[404 Not Found] models/gemini-pro is not found for API version v1beta
```

## Solution
The code now tries multiple model names automatically in this order:
1. `gemini-1.5-pro` (newer, better quality)
2. `gemini-1.5-flash` (faster)
3. `gemini-pro` (older, stable)

## What Changed
- ✅ Added automatic model fallback - tries all models until one works
- ✅ Better error logging - shows which models were tried
- ✅ Graceful degradation - falls back to templates if all models fail

## Manual Override
If you know which model works with your API key, you can set it in `.env`:

```env
GEMINI_MODEL=gemini-1.5-pro
```

Or try:
```env
GEMINI_MODEL=gemini-1.5-flash
```

## Check Available Models
To see which models your API key has access to, you can:

1. **Check Google AI Studio**: https://makersuite.google.com/app/apikey
   - Your API key's available models should be listed there

2. **Or test manually** by setting `GEMINI_MODEL` to different values:
   - `gemini-1.5-pro`
   - `gemini-1.5-flash`
   - `gemini-pro`
   - `gemini-2.0-flash-exp` (if available)

## Common Issues

### All models return 404
- Your API key might not have access to these models
- Try getting a new API key from https://makersuite.google.com/app/apikey
- Check if your region supports these models

### API Key Invalid
- Make sure `GEMINI_API_KEY` is set correctly in `.env`
- No spaces or quotes around the key
- Restart dev server after adding key

### Rate Limits
- Free tier has limits (60 requests/minute)
- Wait a few minutes and try again

## Next Steps
1. Restart your dev server
2. Try using the chat - it will automatically try different models
3. Check server logs to see which model worked
4. If all fail, check your API key permissions in Google AI Studio


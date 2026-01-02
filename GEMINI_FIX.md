# 🔧 Gemini AI Fix - Quick Setup

## Problem
AI is showing template responses instead of real Gemini AI responses.

## Solution

### Step 1: Add GEMINI_API_KEY to .env

1. **Get your Gemini API key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy the key

2. **Add to `.env` file** (in project root):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **IMPORTANT:** If you have `OPENAI_KEY` set and want to use Gemini instead:
   - Either remove `OPENAI_KEY` from `.env`
   - Or comment it out: `# OPENAI_KEY=...`
   - The code now prioritizes Gemini if `GEMINI_API_KEY` is set

### Step 2: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Verify It's Working

1. **Check server logs** when you send a chat message:
   - Should see: `[AI Client] ✅ Using Google Gemini (GEMINI_API_KEY found)`
   - Should see: `[Chat] 🤖 Using Gemini (gemini-pro) to generate response`
   - Should see: `[Chat] ✅ Gemini response received successfully`

2. **Test the chat:**
   - Ask: "What scholarships are available?"
   - Should get AI-generated response, NOT template

---

## Updated Model Names

The code now uses:
- **Primary:** `gemini-pro` (stable, widely available, free tier)
- **Fallback:** `gemini-1.5-pro` (if gemini-pro fails)

You can override with:
```env
GEMINI_MODEL=gemini-1.5-pro  # For better quality (if available)
```

---

## Troubleshooting

### Still seeing templates?

1. **Check `.env` file exists** in project root (not `.env.local`)
2. **Verify key format:**
   - Should be a long string of letters/numbers
   - No spaces or quotes
   - Example: `GEMINI_API_KEY=AIzaSyB...`
3. **Restart dev server** after adding key
4. **Check server console** for error messages

### Getting API errors?

**"API key not valid"**
- Get a new key from https://makersuite.google.com/app/apikey
- Make sure it's copied correctly (no extra spaces)

**"Quota exceeded"**
- Free tier has rate limits
- Wait a few minutes and try again
- Consider upgrading if needed

**"Model not found" (404 error)**
- The code uses `gemini-pro` by default (most stable)
- Falls back to `gemini-1.5-pro` if gemini-pro fails
- Both should work with free tier
- If you see 404, make sure your API key has access to the model

---

## Priority Order (Updated)

The system now checks in this order:
1. **GEMINI_API_KEY** (if set, uses Gemini) ✅ **PRIORITY**
2. **OPENAI_API_KEY** or **OPENAI_KEY** (if set, uses OpenAI)
3. Template fallback (if neither set)

---

## Quick Test

After setup, send this message in chat:
```
"Hello, can you help me find scholarships for computer science?"
```

**Expected:** AI-generated personalized response
**If you see template:** Check `.env` file and restart server

---

## Verification Checklist

- [ ] `GEMINI_API_KEY` added to `.env`
- [ ] Dev server restarted
- [ ] Server logs show "Using Google Gemini"
- [ ] Chat returns AI responses (not templates)
- [ ] No API errors in console

---

**Status:** ✅ Code updated to prioritize Gemini and use correct model names!


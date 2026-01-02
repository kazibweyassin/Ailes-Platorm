# 🤖 AI Setup Guide - Fix Template Responses

## Problem
The AI chat is showing template responses instead of real AI responses. This happens when API keys are not configured.

## Solution: Set Up AI API Keys

You have **2 options** - choose one:

### Option 1: Use Google Gemini (FREE) ✅ Recommended

1. **Get a free API key:**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key

2. **Add to `.env` file:**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

### Option 2: Use OpenAI (Paid)

1. **Get an API key:**
   - Go to https://platform.openai.com/api-keys
   - Sign up/login
   - Create new API key
   - Copy the key

2. **Add to `.env` file:**
   ```env
   OPENAI_API_KEY=sk-your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

---

## How to Check if It's Working

1. **Check server logs** when you send a chat message:
   - Should see: `[AI Client] Using Google Gemini` or `[AI Client] Using OpenAI`
   - If you see: `[AI Client] No AI API key found` → Keys not set

2. **Test the chat:**
   - Ask: "What scholarships are available for African students?"
   - Should get personalized AI response, not template

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for API errors or warnings

---

## Troubleshooting

### Still seeing templates?

1. **Verify `.env` file exists** in project root
2. **Check key format:**
   - Gemini: Should start with letters/numbers (no prefix)
   - OpenAI: Should start with `sk-`
3. **Restart dev server** after adding keys
4. **Check for typos** in variable names:
   - `GEMINI_API_KEY` (not `GEMINI_KEY` or `GEMINI_API`)
   - `OPENAI_API_KEY` (not `OPENAI_KEY`)

### Getting API errors?

**Gemini Errors:**
- "API key not valid" → Check key is correct
- "Quota exceeded" → Free tier has limits, wait or upgrade

**OpenAI Errors:**
- "Invalid API key" → Check key starts with `sk-`
- "Insufficient credits" → Add payment method to OpenAI account

---

## Priority Order

The system checks API keys in this order:
1. `OPENAI_API_KEY` (if set, uses OpenAI)
2. `GEMINI_API_KEY` (if set, uses Gemini)
3. Template fallback (if neither set)

---

## Quick Fix

**For immediate testing, use Gemini (free):**

1. Get key: https://makersuite.google.com/app/apikey
2. Add to `.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
3. Restart: `npm run dev`
4. Test chat - should work!

---

## Verification

After setting up, you should see in server logs:
```
[AI Client] Using Google Gemini (GEMINI_API_KEY found)
```
or
```
[AI Client] Using OpenAI
```

If you see:
```
[AI Client] No AI API key found. Using template fallback.
```
→ Keys are not configured correctly.


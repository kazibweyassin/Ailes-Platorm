# Gemini Setup - Fix Template Responses NOW

## ⚠️ Current Issue
Your AI is showing template responses because:
1. **GEMINI_API_KEY is NOT set** in `.env` file
2. **OPENAI_KEY is set** (which takes priority, but may be invalid)

## ✅ Quick Fix (3 Steps)

### Step 1: Get Gemini API Key (FREE)
1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the key (looks like: `AIzaSyB...`)

### Step 2: Add to `.env` File
Open `.env` file in project root and add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**IMPORTANT:** 
- If you have `OPENAI_KEY=...` in `.env`, either:
  - **Remove it** (recommended if using Gemini)
  - **Or comment it out:** `# OPENAI_KEY=...`

### Step 3: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ Verify It's Working

After restarting, check server console when you send a chat message:

**✅ Should see:**
```
[AI Client] ✅ Using Google Gemini (GEMINI_API_KEY found)
[Chat] 🤖 Using Gemini (gemini-pro) to generate response
[Chat] ✅ Gemini response received successfully
```

**❌ If you see:**
```
[AI Client] ⚠️ NO AI CONFIGURED - Using template fallback
```
→ Your `GEMINI_API_KEY` is not set correctly

---

## 🧪 Test It

1. Open AI Copilot widget (floating button)
2. Send: "What scholarships are available for African students?"
3. Should get **AI-generated response**, NOT template

---

## 🔧 What I Fixed

1. ✅ **Prioritized Gemini** - If `GEMINI_API_KEY` is set, it uses Gemini (not OpenAI)
2. ✅ **Updated model names** - Uses `gemini-pro` (stable, widely available)
3. ✅ **Added fallback** - Falls back to `gemini-1.5-pro` if gemini-pro fails
4. ✅ **Better error logging** - Shows exactly what's happening

---

## 📝 Your `.env` Should Look Like:

```env
# Gemini (FREE) - Recommended
GEMINI_API_KEY=AIzaSyB_your_key_here

# OpenAI (Optional - comment out if using Gemini)
# OPENAI_KEY=sk-proj-...
```

---

## ⚡ Quick Checklist

- [ ] Got Gemini API key from https://makersuite.google.com/app/apikey
- [ ] Added `GEMINI_API_KEY=...` to `.env`
- [ ] Removed or commented out `OPENAI_KEY` (if present)
- [ ] Restarted dev server (`npm run dev`)
- [ ] Tested chat - getting AI responses (not templates)

---

**After setup, your AI will use Gemini and show real AI responses!** 🎉


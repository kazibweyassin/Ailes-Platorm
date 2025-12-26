# Gemini API Key Verification Guide

## How to Verify Gemini is Being Used

### 1. Check Your Environment Variables

Make sure you have `GEMINI_API_KEY` set in your `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** 
- Do NOT set `OPENAI_API_KEY` or `OPENAI_KEY` if you want to use Gemini
- The system prioritizes OpenAI if both are set
- Remove any OpenAI keys to force Gemini usage

### 2. Check Server Logs

When you use the chatbot, check your server console/logs. You should see:

```
[AI Client] Using Google Gemini (GEMINI_API_KEY found)
[Chat API] AI Client type: gemini
[Chat API] Environment check - GEMINI_API_KEY: SET
[Chat] Using Gemini to generate response
[Chat] Gemini response received successfully
```

If you see:
```
[AI Client] No AI API key found. Using template fallback.
```
Then your `GEMINI_API_KEY` is not being read correctly.

### 3. Test the Chatbot

1. Open your application
2. Open the AI Copilot widget (floating button)
3. Send a message like "Hello" or "Find scholarships"
4. Check the server logs to see which AI is being used

### 4. All Routes Using Gemini

The following routes now support Gemini:
- ✅ `/api/ai/chat` - Main chatbot (AI Copilot widget)
- ✅ `/api/ai/applications` - Application essay generation
- ✅ `/api/ai/scholarship-search` - Scholarship search
- ✅ `lib/document-generator.ts` - Document generation
- ✅ `lib/ai-mapper.ts` - Form mapping

### 5. Troubleshooting

**Problem:** Still seeing OpenAI errors or payment messages

**Solution:**
1. Make sure `GEMINI_API_KEY` is in `.env.local` (not just `.env`)
2. Restart your development server after adding the key
3. Check that you don't have `OPENAI_API_KEY` or `OPENAI_KEY` set
4. Check server logs to see which client is being initialized

**Problem:** Getting template responses instead of AI

**Solution:**
1. Verify `GEMINI_API_KEY` is correct (get a new one from https://makersuite.google.com/app/apikey)
2. Check server logs for error messages
3. Make sure the key has proper permissions

### 6. Priority Order

The system checks API keys in this order:
1. `OPENAI_API_KEY` or `OPENAI_KEY` (if set, uses OpenAI)
2. `GEMINI_API_KEY` (if set, uses Gemini)
3. Template fallback (if neither is set)

To force Gemini usage, **remove all OpenAI keys**.


# 🆓 Free AI Setup Guide

The AI Copilot now supports **free alternatives** to OpenAI! You don't need to pay for AI features.

## Option 1: Google Gemini (FREE) ⭐ Recommended

Google Gemini offers a **generous free tier** with no credit card required initially.

### How to Get a Free Gemini API Key:

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy your API key**

### Add to Your Environment:

Add this to your `.env.local` file:

```env
GEMINI_API_KEY=your-api-key-here
```

That's it! The AI Copilot will automatically use Gemini instead of OpenAI.

## Option 2: Template-Based Responses (No API Needed)

If you don't want to set up any API, the system will automatically use **template-based responses** that still provide helpful information about:
- Finding scholarships
- Application help
- General guidance

The AI features will work without any API key, just with simpler template responses.

## Option 3: OpenAI (Paid)

If you have an OpenAI account with billing set up, you can still use:

```env
OPENAI_API_KEY=your-openai-key-here
```

## Priority Order

The system checks APIs in this order:
1. **OpenAI** (if `OPENAI_API_KEY` is set)
2. **Google Gemini** (if `GEMINI_API_KEY` is set)
3. **Template responses** (if no API keys are available)

## Testing

After adding your Gemini API key:
1. Restart your development server
2. Open the AI Copilot widget
3. Try asking: "Help me find scholarships"
4. You should get AI-powered responses!

## Free Tier Limits

- **Google Gemini**: 60 requests per minute (free tier)
- **Template responses**: Unlimited (no API calls)

## Need Help?

If you encounter any issues:
1. Make sure your API key is in `.env.local`
2. Restart your dev server after adding the key
3. Check the console for any error messages



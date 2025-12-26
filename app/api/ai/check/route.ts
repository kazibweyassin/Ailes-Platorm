import { NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai-client';

/**
 * Diagnostic endpoint to check which AI provider is configured
 * GET /api/ai/check
 */
export async function GET() {
  const aiClient = getAIClient();
  
  const hasOpenAI = !!(process.env.OPENAI_API_KEY || process.env.OPENAI_KEY);
  const hasGemini = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    configured: !!aiClient,
    provider: aiClient?.type || 'none',
    hasOpenAIKey: hasOpenAI,
    hasGeminiKey: hasGemini,
    message: aiClient 
      ? `Using ${aiClient.type === 'openai' ? 'OpenAI' : 'Google Gemini'}`
      : 'No AI provider configured. Using template fallback.',
    recommendation: !hasOpenAI && !hasGemini
      ? 'Add GEMINI_API_KEY to .env.local for free AI features'
      : hasOpenAI && !hasGemini
      ? 'OpenAI is configured. To use Gemini instead, remove OPENAI_API_KEY and add GEMINI_API_KEY'
      : 'Configuration looks good!'
  });
}


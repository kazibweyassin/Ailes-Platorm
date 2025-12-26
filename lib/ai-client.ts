import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type AIClientType = 'openai' | 'gemini' | null;
export type AIClient = {
  type: 'openai';
  client: OpenAI;
} | {
  type: 'gemini';
  client: GoogleGenerativeAI;
} | null;

/**
 * Get AI client - supports both OpenAI and Google Gemini (free tier)
 * Priority: OpenAI > Gemini > null (template fallback)
 */
export function getAIClient(): AIClient {
  // Try OpenAI first
  const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (openaiKey) {
    console.log('[AI Client] Using OpenAI');
    return { type: 'openai', client: new OpenAI({ apiKey: openaiKey }) };
  }
  
  // Fallback to Google Gemini (free tier)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    console.log('[AI Client] Using Google Gemini (GEMINI_API_KEY found)');
    return { type: 'gemini', client: new GoogleGenerativeAI(geminiKey) };
  }
  
  // No AI available - return null for template fallback
  console.warn('[AI Client] No AI API key found. Using template fallback. Set OPENAI_API_KEY or GEMINI_API_KEY');
  return null;
}

/**
 * Generate AI response using either OpenAI or Gemini
 */
export async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
): Promise<string> {
  const aiClient = getAIClient();
  
  if (!aiClient) {
    throw new Error('No AI client available. Please set OPENAI_API_KEY or GEMINI_API_KEY in your environment variables.');
  }

  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 1000;
  const model = options?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    if (aiClient.type === 'openai') {
      const response = await aiClient.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens,
      });
      return response.choices[0]?.message?.content || 'I could not generate a response.';
    } else if (aiClient.type === 'gemini') {
      const geminiModel = aiClient.client.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await geminiModel.generateContent(prompt);
      return result.response.text() || 'I could not generate a response.';
    }
  } catch (error: any) {
    console.error('AI generation error:', error);
    throw new Error(`AI generation failed: ${error.message}`);
  }

  throw new Error('Unknown AI client type');
}




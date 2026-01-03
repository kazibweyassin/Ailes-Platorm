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
  // Priority: GEMINI_API_KEY first (if user wants Gemini), then OpenAI
  // Check if user explicitly wants Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const trimmedKey = geminiKey.trim();
    if (trimmedKey.length > 0) {
      try {
        console.log('[AI Client] ✅ Using Google Gemini (GEMINI_API_KEY found)');
        return { type: 'gemini', client: new GoogleGenerativeAI(trimmedKey) };
      } catch (error) {
        console.error('[AI Client] ❌ Error initializing Gemini:', error);
        // Fall through to OpenAI or null
      }
    }
  }
  
  // Try OpenAI as fallback
  const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (openaiKey) {
    const trimmedKey = openaiKey.trim();
    // Validate OpenAI key format (should start with sk-)
    if (trimmedKey.startsWith('sk-') || trimmedKey.startsWith('sk-proj-')) {
      try {
        console.log('[AI Client] ✅ Using OpenAI');
        return { type: 'openai', client: new OpenAI({ apiKey: trimmedKey }) };
      } catch (error) {
        console.error('[AI Client] ❌ Error initializing OpenAI:', error);
        // Fall through to null
      }
    } else {
      console.warn('[AI Client] ⚠️ OpenAI key found but format invalid (should start with sk-). Key length:', trimmedKey.length);
    }
  }
  
  // No AI available - return null for template fallback
  console.warn('[AI Client] ⚠️ NO AI CONFIGURED - Using template fallback');
  console.warn('[AI Client] To enable AI:');
  console.warn('[AI Client]   1. Set GEMINI_API_KEY (free): https://makersuite.google.com/app/apikey');
  console.warn('[AI Client]   2. Or set OPENAI_API_KEY (paid): https://platform.openai.com/api-keys');
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
      // Try multiple model names in order of preference
      const modelNames = process.env.GEMINI_MODEL 
        ? [process.env.GEMINI_MODEL]
        : ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest'];
      
      let lastError: any = null;
      
      for (const modelName of modelNames) {
        try {
          console.log(`[AI Client] Trying Gemini model: ${modelName}`);
          const geminiModel = aiClient.client.getGenerativeModel({ model: modelName });
          const prompt = `${systemPrompt}\n\n${userPrompt}`;
          const result = await geminiModel.generateContent(prompt);
          const text = result.response.text();
          if (text) {
            console.log(`[AI Client] ✅ Successfully used model: ${modelName}`);
            return text;
          }
        } catch (error: any) {
          console.warn(`[AI Client] ⚠️ Model ${modelName} failed:`, error.message);
          lastError = error;
          // Continue to next model
          continue;
        }
      }
      
      // If all models failed, throw the last error
      throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}. Available models: ${modelNames.join(', ')}`);
    }
  } catch (error: any) {
    console.error('AI generation error:', error);
    throw new Error(`AI generation failed: ${error.message}`);
  }

  throw new Error('Unknown AI client type');
}




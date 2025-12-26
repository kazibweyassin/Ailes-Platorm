import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

type Mapping = {
  selector: string;
  profileKey: string;
  inputType: string;
  exampleValue?: string | null;
  confidence?: number;
  step?: number;
  notes?: string;
};

// Support both OPENAI_API_KEY and OPENAI_KEY (and GEMINI_API_KEY for backward compatibility)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const client = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null as any;

/**
 * Generate a mapping from a form HTML string to profile fields using an LLM.
 * This is a safe, dry-run helper: it never submits data and should NOT include
 * real user PII in the prompt. Supply only the form DOM/subtree and request
 * JSON-only output using the prompts in `docs/ai-mapper-prompts.md`.
 */
export async function generateMapping(formHtml: string, opts?: { model?: string; maxTokens?: number; }) {
  if (!client) throw new Error('No LLM client configured. Set OPENAI_API_KEY.');

  const system = `You are an assistant whose job is to extract a reliable mapping from an HTML form (or a minimal DOM subtree containing the form) to the application's user profile fields. Respond only with JSON that follows the required schema. Be conservative: prefer returning fewer high-confidence selectors rather than many low-confidence guesses. Do not return explanatory text.`;

  const user = `Given the following HTML (only the form element or minimal subtree), return a JSON array of mappings. Each mapping must include: selector, profileKey (one of firstName,lastName,email,phone,address,nationality,dob,gpa,major,degreeLevel,bio,resume,personalStatement,other), inputType (text,email,tel,select,radio,checkbox,textarea,file,date,number), exampleValue, confidence (0-1), and optional step (int). Return JSON only. HTML:\n\n${formHtml}`;

  const model = opts?.model || DEFAULT_MODEL;

  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    max_tokens: opts?.maxTokens || 1500,
    temperature: 0.0,
  });

  const text = res.choices?.[0]?.message?.content || res.choices?.[0]?.delta?.content || '';
  const json = extractJSON(text);
  if (!json) throw new Error('LLM did not return valid JSON mapping');
  return json as Mapping[];
}

function extractJSON(text: string) {
  // Attempt to find the first JSON array/object in the text
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch (e) {
      // fallthrough
    }
  }
  const objMatch = text.match(/\{[\s\S]*\}/m);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch (e) {
      return null;
    }
  }
  return null;
}

const aiMapper = { generateMapping };
export default aiMapper;

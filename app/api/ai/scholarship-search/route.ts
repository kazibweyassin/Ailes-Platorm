import { NextResponse } from 'next/server';
import { getAIClient, generateAIResponse } from '@/lib/ai-client';

export async function POST(request: Request) {
  try {
    const { nationality, degreeLevel, fieldOfStudy, destination, fundingType } = await request.json();

    const aiClient = getAIClient();
    if (!aiClient) {
      return NextResponse.json(
        { error: 'AI API key not configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Create prompts for the AI
    const systemPrompt = "You are a helpful scholarship advisor that provides accurate and personalized scholarship recommendations. Format your responses in clean markdown with proper headings and lists.";
    const userPrompt = `You are an expert scholarship advisor. Provide a detailed response to the following scholarship search query:

Student Profile:
- Nationality: ${nationality || 'Not specified'}
- Degree Level: ${degreeLevel || 'Not specified'}
- Field of Study: ${fieldOfStudy || 'Not specified'}
- Preferred Destination: ${destination || 'Not specified'}
- Funding Type: ${fundingType || 'Not specified'}

Please provide:
1. A list of 3-5 relevant scholarships with brief descriptions
2. Eligibility criteria for each scholarship
3. Application deadlines (if known)
4. Any additional tips or resources for the student

Format the response in clean, readable markdown.`;

    const content = await generateAIResponse(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 1500,
    });

    return NextResponse.json({ 
      response: content
    });

  } catch (error: any) {
    console.error('Error processing scholarship search:', error);
    return NextResponse.json(
      { 
        error: 'Error processing your request',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

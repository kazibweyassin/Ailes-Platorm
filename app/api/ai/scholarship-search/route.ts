import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Support both OPENAI_API_KEY and OPENAI_KEY
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    const { nationality, degreeLevel, fieldOfStudy, destination, fundingType } = await request.json();

    if (!apiKey || !openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create a prompt for the AI
    const prompt = `You are an expert scholarship advisor. Provide a detailed response to the following scholarship search query:

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

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful scholarship advisor that provides accurate and personalized scholarship recommendations. Format your responses in clean markdown with proper headings and lists."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || 'Sorry, I could not generate a response at this time.';

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

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Support both OPENAI_API_KEY and OPENAI_KEY
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    const { action, application, message } = await request.json();

  if (!apiKey || !openai) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  // TypeScript guard: openai is not null here
  const client = openai;

  switch (action) {
    case 'generate_essay':
      return await generateEssay(application, message);
    case 'review_essay':
      return await reviewEssay(application, message);
    case 'check_requirements':
      return await checkRequirements(application);
    case 'submit_application':
      return await submitApplication(application);
    default:
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
  }
  } catch (error: any) {
    console.error('Error in applications API:', error);
    return NextResponse.json(
      { 
        error: 'Error processing your request',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function generateEssay(application: any, prompt: string) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a scholarship essay writing assistant. Help the student write a compelling essay for their ${application.scholarshipName} application.`
      },
      {
        role: "user",
        content: prompt || "Please help me write a strong personal statement for this scholarship."
      }
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return NextResponse.json({
    content: response.choices[0]?.message?.content || "I couldn't generate an essay at this time.",
    type: 'essay_generated'
  });
}

async function reviewEssay(application: any, essay: string) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a scholarship essay reviewer. Provide detailed feedback on this essay for the ${application.scholarshipName} application. Focus on content, structure, grammar, and alignment with scholarship requirements.`
      },
      {
        role: "user",
        content: `Please review this essay and provide feedback:\n\n${essay}`
      }
    ],
    temperature: 0.5,
    max_tokens: 1500,
  });

  return NextResponse.json({
    feedback: response.choices[0]?.message?.content || "I couldn't provide feedback at this time.",
    type: 'essay_reviewed'
  });
}

async function checkRequirements(application: any) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  // In a real implementation, this would check against actual scholarship requirements
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Analyze the scholarship requirements and the student's application to identify any missing or incomplete items.`
      },
      {
        role: "user",
        content: `Scholarship: ${application.scholarshipName}\n\nApplication details: ${JSON.stringify(application, null, 2)}`
      }
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  return NextResponse.json({
    requirements: response.choices[0]?.message?.content || "Unable to verify requirements at this time.",
    type: 'requirements_checked'
  });
}

async function submitApplication(application: any) {
  // In a real implementation, this would submit to a scholarship platform
  // For now, we'll just simulate a successful submission
  return NextResponse.json({
    success: true,
    message: "Application submitted successfully!",
    submissionId: `sub_${Date.now()}`,
    submissionDate: new Date().toISOString(),
    type: 'application_submitted'
  });
}

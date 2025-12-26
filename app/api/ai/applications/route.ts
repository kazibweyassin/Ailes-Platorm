import { NextResponse } from 'next/server';
import { getAIClient, generateAIResponse, AIClient } from '@/lib/ai-client';

export async function POST(request: Request) {
  try {
    const { action, application, message } = await request.json();

  const aiClient = getAIClient();
  if (!aiClient) {
    return NextResponse.json(
      { error: 'AI API key not configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in your environment variables.' },
      { status: 500 }
    );
  }

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
  const systemPrompt = `You are a scholarship essay writing assistant. Help the student write a compelling essay for their ${application.scholarshipName} application.`;
  const userPrompt = prompt || "Please help me write a strong personal statement for this scholarship.";
  
  const content = await generateAIResponse(systemPrompt, userPrompt, {
    temperature: 0.7,
    maxTokens: 1500,
  });

  return NextResponse.json({
    content: content || "I couldn't generate an essay at this time.",
    type: 'essay_generated'
  });
}

async function reviewEssay(application: any, essay: string) {
  const systemPrompt = `You are a scholarship essay reviewer. Provide detailed feedback on this essay for the ${application.scholarshipName} application. Focus on content, structure, grammar, and alignment with scholarship requirements.`;
  const userPrompt = `Please review this essay and provide feedback:\n\n${essay}`;
  
  const feedback = await generateAIResponse(systemPrompt, userPrompt, {
    temperature: 0.5,
    maxTokens: 1500,
  });

  return NextResponse.json({
    feedback: feedback || "I couldn't provide feedback at this time.",
    type: 'essay_reviewed'
  });
}

async function checkRequirements(application: any) {
  const systemPrompt = `Analyze the scholarship requirements and the student's application to identify any missing or incomplete items.`;
  const userPrompt = `Scholarship: ${application.scholarshipName}\n\nApplication details: ${JSON.stringify(application, null, 2)}`;
  
  const requirements = await generateAIResponse(systemPrompt, userPrompt, {
    temperature: 0.3,
    maxTokens: 1000,
  });

  return NextResponse.json({
    requirements: requirements || "Unable to verify requirements at this time.",
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

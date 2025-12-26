import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

// Initialize OpenAI client (will be created when needed)
function getOpenAIClient() {
  // Check for both OPENAI_API_KEY and OPENAI_KEY (for backward compatibility)
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured. Please add it to your .env.local file.');
  }
  return new OpenAI({
    apiKey: apiKey,
  });
}

// Retry function with exponential backoff (more aggressive retries)
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5, // Increased from 3 to 5
  initialDelay: number = 500 // Reduced from 1000ms to 500ms
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on non-rate-limit errors
      if (error.status !== 429 && !error.message?.includes('rate limit') && error.code !== 'rate_limit_exceeded') {
        throw error;
      }
      
      // Calculate delay with exponential backoff (but cap at 5 seconds)
      const delay = Math.min(initialDelay * Math.pow(2, attempt), 5000);
      
      // Only retry if we have retries left
      if (attempt < maxRetries - 1) {
        console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Calculate scholarship match score (same logic as match API)
function calculateMatchScore(user: any, scholarship: any): { score: number; reasons: string[]; missing: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const missing: string[] = [];
  const maxScore = 100;

  // Country match (20 points)
  // Handle both array and string formats for targetCountries
  const targetCountries = Array.isArray(scholarship.targetCountries) 
    ? scholarship.targetCountries 
    : (scholarship.targetCountries ? [scholarship.targetCountries] : []);
  
  if (targetCountries.length > 0) {
    if (user.country && targetCountries.includes(user.country)) {
      score += 20;
      reasons.push(`Available for students from ${user.country}`);
    } else {
      missing.push(`Must be from: ${targetCountries.join(", ")}`);
    }
  } else {
    score += 20; // No country restriction
  }

  // GPA requirement (15 points)
  if (scholarship.minGPA) {
    if (user.currentGPA && user.currentGPA >= scholarship.minGPA) {
      score += 15;
      reasons.push(`Your GPA (${user.currentGPA}) meets the requirement`);
    } else {
      missing.push(`Minimum GPA ${scholarship.minGPA} required${user.currentGPA ? ` (you have ${user.currentGPA})` : ""}`);
    }
  } else {
    score += 15;
  }

  // Field of study match (15 points)
  if (scholarship.fieldOfStudy && scholarship.fieldOfStudy.length > 0) {
    if (user.fieldOfStudy && scholarship.fieldOfStudy.includes(user.fieldOfStudy)) {
      score += 15;
      reasons.push(`Matches your field: ${user.fieldOfStudy}`);
    } else {
      missing.push(`Field must be: ${scholarship.fieldOfStudy.join(", ")}`);
    }
  } else {
    score += 15;
  }

  // Degree level match (10 points)
  if (scholarship.degreeLevel && scholarship.degreeLevel.length > 0) {
    if (user.degreeLevel && scholarship.degreeLevel.includes(user.degreeLevel)) {
      score += 10;
      reasons.push(`Available for ${user.degreeLevel} students`);
    } else {
      missing.push(`Only for: ${scholarship.degreeLevel.join(", ")}`);
    }
  } else {
    score += 10;
  }

  // Gender-specific scholarships (10 points)
  if (scholarship.forWomen) {
    if (user.gender?.toLowerCase() === "female") {
      score += 10;
      reasons.push(`Specifically for women`);
    } else {
      missing.push(`Only for women applicants`);
    }
  } else {
    score += 10;
  }

  // Test scores (20 points total)
  let testScore = 0;
  if (scholarship.requiresIELTS) {
    if (user.ieltsScore && scholarship.minIELTS && user.ieltsScore >= scholarship.minIELTS) {
      testScore += 5;
      reasons.push(`IELTS ${user.ieltsScore} meets requirement`);
    } else {
      missing.push(`IELTS ${scholarship.minIELTS || "score"} required`);
    }
  } else {
    testScore += 5;
  }

  if (scholarship.requiresTOEFL) {
    if (user.toeflScore && scholarship.minTOEFL && user.toeflScore >= scholarship.minTOEFL) {
      testScore += 5;
      reasons.push(`TOEFL ${user.toeflScore} meets requirement`);
    } else {
      missing.push(`TOEFL ${scholarship.minTOEFL || "score"} required`);
    }
  } else {
    testScore += 5;
  }

  score += testScore;

  return { 
    score: Math.min(score, maxScore), 
    reasons, 
    missing 
  };
}

// Extract user profile from message or context
function extractProfileFromMessage(message: string, context: any): any {
  const profile: any = {};
  
  // Try to get from context first
  if (context?.finderData) {
    return {
      country: context.finderData.nationality,
      degreeLevel: context.finderData.degreeLevel,
      fieldOfStudy: context.finderData.fieldOfStudy,
      currentGPA: context.finderData.currentGPA,
      gender: context.finderData.gender,
    };
  }

  // Try to extract from message using simple patterns
  const nationalityMatch = message.match(/(?:from|nationality|country)[:\s]+([A-Za-z\s]+)/i);
  const degreeMatch = message.match(/(?:degree|studying|level)[:\s]+(bachelor|master|phd|doctorate)/i);
  const fieldMatch = message.match(/(?:field|major|studying)[:\s]+([A-Za-z\s]+)/i);
  
  if (nationalityMatch) profile.country = nationalityMatch[1].trim();
  if (degreeMatch) profile.degreeLevel = degreeMatch[1].trim();
  if (fieldMatch) profile.fieldOfStudy = fieldMatch[1].trim();

  return profile;
}

export async function POST(req: Request) {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { message, context } = body;
    
    // Validate the API key (check both OPENAI_API_KEY and OPENAI_KEY)
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Validate the message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if user is asking about finding/matching scholarships
    const isScholarshipSearch = /find|match|search|looking for|scholarship|opportunity|available/i.test(message);
    
    // If asking about scholarships, try to get real matches
    if (isScholarshipSearch) {
      try {
        const profile = extractProfileFromMessage(message, context);
        
        // Get active scholarships
        let scholarships: any[] = [];
        try {
          scholarships = await prisma.scholarship.findMany({
            where: {
              deadline: {
                gte: new Date()
              }
            },
            take: 100 // Limit for performance
          });
        } catch (dbError) {
          console.error('Database error fetching scholarships:', dbError);
          // Continue without scholarship matching
          scholarships = [];
        }

        if (scholarships.length > 0) {
          // Calculate matches
          const matches = scholarships.map((scholarship: any) => {
            const { score, reasons, missing } = calculateMatchScore(profile, scholarship);
            return {
              scholarship: {
                id: scholarship.id,
                name: scholarship.name,
                provider: scholarship.provider,
                amount: scholarship.amount,
                currency: scholarship.currency,
                country: scholarship.country,
                deadline: scholarship.deadline,
                fieldOfStudy: scholarship.fieldOfStudy,
                degreeLevel: scholarship.degreeLevel,
              },
              matchScore: score,
              matchReasons: reasons,
              missingRequirements: missing
            };
          });

          // Sort by match score and get top 10
          matches.sort((a: any, b: any) => b.matchScore - a.matchScore);
          const topMatches = matches.filter((m: any) => m.matchScore >= 50).slice(0, 10);

          if (topMatches.length > 0) {
            // Build AI response with real matches
            const matchesText = topMatches.map((match: any, idx: number) => {
              const sch = match.scholarship;
              const daysLeft = Math.ceil((new Date(sch.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return `${idx + 1}. **${sch.name}** by ${sch.provider}
   - Match Score: ${match.matchScore}%
   - Amount: ${sch.currency} ${sch.amount?.toLocaleString() || 'Varies'}
   - Country: ${sch.country}
   - Deadline: ${daysLeft} days left
   - Why it matches: ${match.matchReasons.slice(0, 2).join(', ')}
   - View: /scholarships/${sch.id}`;
            }).join('\n\n');

            const systemPrompt = `You are a helpful scholarship advisor. The user asked about finding scholarships. I've found ${topMatches.length} matching scholarships from our database. Present them in a friendly, helpful way. Include the match scores and encourage them to click the links to view details.`;
            
            const openai = getOpenAIClient();
            const aiResponse = await retryWithBackoff(async () => {
              return await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: `Here are ${topMatches.length} scholarships that match the user's profile:\n\n${matchesText}\n\nProvide a helpful response introducing these matches.` }
                ],
                temperature: 0.7,
                max_tokens: 800,
              });
            });

            const aiReply = aiResponse.choices[0]?.message?.content || "I found some matching scholarships for you!";
            
            return NextResponse.json({ 
              reply: aiReply,
              type: 'scholarship_matches',
              matches: topMatches,
              totalFound: topMatches.length
            });
          }
        }
      } catch (matchError) {
        console.error('Error matching scholarships:', matchError);
        // Fall through to regular AI response
      }
    }

    // Build context-aware system prompt
    let systemPrompt = `You are a helpful scholarship advisor. Provide accurate, concise, and helpful information about scholarships, applications, and higher education opportunities. When users ask about finding scholarships, encourage them to use our matching tool or provide specific guidance.`;

    // Add context about active application if available
    if (context?.activeApplication) {
      const app = context.activeApplication;
      systemPrompt += `\n\nThe user is currently working on a scholarship application:\n`;
      systemPrompt += `- Scholarship: ${app.scholarshipName || 'Custom Scholarship'}\n`;
      systemPrompt += `- Status: ${app.status}\n`;
      systemPrompt += `- Progress: ${app.progress}%\n`;
      if (app.deadline) {
        systemPrompt += `- Deadline: ${app.deadline}\n`;
      }
      if (app.documents && app.documents.length > 0) {
        systemPrompt += `- Documents: ${app.documents.map((d: any) => `${d.name} (${d.status})`).join(', ')}\n`;
      }
      systemPrompt += `\nProvide specific, actionable advice related to this application when relevant.`;
    }

    // Add context about other applications if available
    if (context?.applications && context.applications.length > 0) {
      systemPrompt += `\n\nThe user has ${context.applications.length} scholarship application(s) in progress.`;
    }

    // Add finder data if available
    if (context?.finderData) {
      systemPrompt += `\n\nUser profile:\n`;
      systemPrompt += `- From: ${context.finderData.nationality || 'Not specified'}\n`;
      systemPrompt += `- Studying: ${context.finderData.fieldOfStudy || 'Not specified'}\n`;
      systemPrompt += `- Degree: ${context.finderData.degreeLevel || 'Not specified'}\n`;
      systemPrompt += `- Destination: ${context.finderData.destination || 'Not specified'}\n`;
    }

    // Build messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: message
      }
    ];

    // Generate AI response using modern API with retry logic
    const openai = getOpenAIClient();
    const response = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });
    });

    const reply = response.choices[0]?.message?.content || "I'm not sure how to respond to that.";

    // Return the AI's response
    return NextResponse.json({ 
      reply,
      type: 'text'
    });

  } catch (error: any) {
    console.error('Error processing chat message:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.constructor.name
    });
    
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error:', error.status, error.message, error.code);
      let userMessage = 'Error from AI service. Please try again.';
      
      if (error.status === 401) {
        userMessage = 'API authentication failed. Please check your OpenAI API key configuration.';
      } else if (error.status === 402 || error.status === 403) {
        // Payment or billing issues
        if (error.message?.toLowerCase().includes('payment') || error.message?.toLowerCase().includes('billing') || error.message?.toLowerCase().includes('insufficient')) {
          userMessage = 'OpenAI API requires a valid payment method and credits. Please add a payment method to your OpenAI account at https://platform.openai.com/account/billing';
        } else {
          userMessage = 'OpenAI API access denied. Please check your account billing and API key settings.';
        }
      } else if (error.status === 429) {
        // Extract retry-after header if available
        const retryAfter = error.headers?.['retry-after'] || error.headers?.['x-ratelimit-reset'];
        if (retryAfter) {
          const waitTime = parseInt(retryAfter);
          userMessage = `Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`;
        } else {
          userMessage = 'Rate limit exceeded. Please wait a moment and try again. The system will automatically retry.';
        }
      } else if (error.status === 500 || error.status === 503) {
        userMessage = 'AI service is temporarily unavailable. Please try again later.';
      }
      
      return NextResponse.json(
        { 
          error: userMessage, 
          details: error.message,
          status: error.status 
        },
        { status: error.status || 500 }
      );
    }

    // Handle rate limiting
    if (error.message?.includes('rate limit') || error.status === 429 || error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    // Handle network errors
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return NextResponse.json(
        { error: 'Network error. Please check your connection and try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error processing your request. Please try again.', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

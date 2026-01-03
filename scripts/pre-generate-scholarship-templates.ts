/**
 * Pre-generate AI responses for top scholarships
 * This script generates and caches common questions/answers for featured scholarships
 * Run this periodically to refresh cached responses
 */

import { PrismaClient } from '@prisma/client';
import { getAICache } from '../lib/ai-cache';
import { getAIClient } from '../lib/ai-client';
import { detectScholarshipName } from '../lib/scholarship-templates';

const prisma = new PrismaClient();

// Common questions to pre-generate for each scholarship
const COMMON_QUESTIONS = [
  {
    question: 'How do I apply for this scholarship?',
    type: 'application_steps',
  },
  {
    question: 'What are the eligibility requirements?',
    type: 'eligibility',
  },
  {
    question: 'What does this scholarship cover?',
    type: 'funding',
  },
  {
    question: 'When is the deadline?',
    type: 'deadline',
  },
  {
    question: 'What documents do I need?',
    type: 'documents',
  },
  {
    question: 'Do you have any tips for applying?',
    type: 'tips',
  },
  {
    question: 'Tell me about this scholarship',
    type: 'general_info',
  },
];

async function generateResponseForQuestion(
  scholarship: any,
  question: string,
  questionType: string
): Promise<string | null> {
  const aiClient = getAIClient();
  if (!aiClient) {
    console.warn('⚠️ No AI client available. Skipping AI generation.');
    return null;
  }

  const systemPrompt = `You are a helpful scholarship advisor. Provide accurate, concise information about scholarships. Format responses in clean markdown.`;

  const userPrompt = `Scholarship: ${scholarship.name} by ${scholarship.provider}

Details:
- Country: ${scholarship.country || 'Multiple'}
- Amount: ${scholarship.currency} ${scholarship.amount?.toLocaleString() || 'Varies'}
- Type: ${scholarship.type}
- Fields: ${scholarship.fieldOfStudy?.join(', ') || 'All fields'}
- Degree Level: ${scholarship.degreeLevel?.join(', ') || 'All levels'}
- Deadline: ${scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Not specified'}
- Eligibility: ${scholarship.eligibility || 'See requirements'}
- Website: ${scholarship.website || 'Not available'}

Question: ${question}

Provide a helpful, detailed answer about this specific scholarship. Include practical information and actionable advice.`;

  try {
    if (aiClient.type === 'openai') {
      const response = await aiClient.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });
      return response.choices[0]?.message?.content || null;
    } else if (aiClient.type === 'gemini') {
      const modelNames = process.env.GEMINI_MODEL
        ? [process.env.GEMINI_MODEL]
        : ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest'];

      for (const modelName of modelNames) {
        try {
          const model = aiClient.client.getGenerativeModel({ model: modelName });
          const prompt = `${systemPrompt}\n\n${userPrompt}`;
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text) {
            return text;
          }
        } catch (error: any) {
          console.warn(`⚠️ Model ${modelName} failed:`, error.message);
          continue;
        }
      }
    }
  } catch (error: any) {
    console.error(`❌ Error generating response:`, error.message);
    return null;
  }

  return null;
}

async function preGenerateTemplates() {
  console.log('🚀 Starting pre-generation of scholarship templates...\n');

  try {
    // Get top featured scholarships
    const scholarships = await prisma.scholarship.findMany({
      where: {
        featured: true,
        deadline: {
          gte: new Date(), // Only active scholarships
        },
      },
      take: 20, // Top 20 featured scholarships
      orderBy: {
        views: 'desc', // Most viewed first
      },
    });

    console.log(`📚 Found ${scholarships.length} featured scholarships\n`);

    const cache = getAICache();
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const scholarship of scholarships) {
      console.log(`\n📖 Processing: ${scholarship.name}`);
      console.log(`   Provider: ${scholarship.provider}`);

      for (const { question, type } of COMMON_QUESTIONS) {
        // Check if already cached
        const cacheKey = `${scholarship.name} - ${question}`;
        if (cache.has(question, { scholarshipId: scholarship.id, scholarshipName: scholarship.name })) {
          console.log(`   ⏭️  Skipping (cached): "${question}"`);
          skipCount++;
          continue;
        }

        // Generate response
        console.log(`   🤖 Generating: "${question}"`);
        const response = await generateResponseForQuestion(scholarship, question, type);

        if (response) {
          // Cache the response
          cache.set(question, response, {
            scholarshipId: scholarship.id,
            scholarshipName: scholarship.name,
          }, 24 * 30); // Cache for 30 days

          console.log(`   ✅ Cached response (${response.length} chars)`);
          successCount++;

          // Small delay to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          console.log(`   ❌ Failed to generate response`);
          errorCount++;
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully cached: ${successCount}`);
    console.log(`   ⏭️  Skipped (already cached): ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📈 Total processed: ${successCount + skipCount + errorCount}`);

    // Show cache stats
    const stats = cache.getStats();
    console.log('\n💾 Cache Statistics:');
    console.log(`   Memory entries: ${stats.memoryEntries}`);
    console.log(`   Question types:`, stats.questionTypes);

  } catch (error: any) {
    console.error('❌ Error in pre-generation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  preGenerateTemplates()
    .then(() => {
      console.log('\n✅ Pre-generation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { preGenerateTemplates };


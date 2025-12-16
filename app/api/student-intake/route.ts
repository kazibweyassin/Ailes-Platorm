import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const studentIntakeSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  currentCountry: z.string().min(1, 'Current country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional().nullable(),
  
  // Academic Background
  currentDegree: z.string().min(1, 'Current degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  university: z.string().min(1, 'University is required'),
  gpa: z.string().min(1, 'GPA is required'),
  graduationYear: z.string().min(1, 'Graduation year is required'),
  currentYear: z.string().min(1, 'Current year is required'),
  
  // Test Scores
  hasTestScores: z.boolean(),
  toeflScore: z.string().optional().nullable(),
  ieltsScore: z.string().optional().nullable(),
  greScore: z.string().optional().nullable(),
  gmatScore: z.string().optional().nullable(),
  satScore: z.string().optional().nullable(),
  
  // Study Preferences
  targetDegree: z.string().min(1, 'Target degree is required'),
  targetCountries: z.string().min(1, 'Target countries are required'),
  targetFields: z.string().min(1, 'Target fields are required'),
  preferredIntake: z.string().min(1, 'Preferred intake is required'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  
  // Financial Information
  financialNeed: z.string().min(1, 'Financial need is required'),
  fundingSource: z.string().min(1, 'Funding source is required'),
  expectedFunding: z.string().min(1, 'Expected funding is required'),
  
  // Additional Information
  workExperience: z.string().optional().nullable(),
  researchExperience: z.string().optional().nullable(),
  publications: z.string().optional().nullable(),
  awards: z.string().optional().nullable(),
  volunteerWork: z.string().optional().nullable(),
  languages: z.string().optional().nullable(),
  additionalInfo: z.string().optional().nullable(),
  
  // Consent
  consentDataUsage: z.boolean().refine(val => val === true, {
    message: 'You must consent to data usage'
  }),
  marketingEmails: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = studentIntakeSchema.parse(body);
    
    // Convert date string to Date object
    const dateOfBirth = new Date(validatedData.dateOfBirth);
    
    // Clean up empty strings to null for optional fields
    const cleanData = {
      ...validatedData,
      dateOfBirth,
      address: validatedData.address || null,
      toeflScore: validatedData.toeflScore || null,
      ieltsScore: validatedData.ieltsScore || null,
      greScore: validatedData.greScore || null,
      gmatScore: validatedData.gmatScore || null,
      satScore: validatedData.satScore || null,
      workExperience: validatedData.workExperience || null,
      researchExperience: validatedData.researchExperience || null,
      publications: validatedData.publications || null,
      awards: validatedData.awards || null,
      volunteerWork: validatedData.volunteerWork || null,
      languages: validatedData.languages || null,
      additionalInfo: validatedData.additionalInfo || null,
    };
    
    // Create the student intake record
    const intake = await prisma.studentIntake.create({
      data: cleanData,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Student intake form submitted successfully',
      id: intake.id,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating student intake:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined,
    }, { status: 500 });
  }
}

// GET all intakes (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const where = status ? { status: status as any } : {};
    
    const [intakes, total] = await Promise.all([
      prisma.studentIntake.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.studentIntake.count({ where }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: intakes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching student intakes:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch intakes',
    }, { status: 500 });
  }
}

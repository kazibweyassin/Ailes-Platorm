import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get sponsored scholars count (from StudentIntake with COMPLETED status)
    const sponsoredScholars = await prisma.studentIntake.count({
      where: {
        status: 'COMPLETED',
      },
    });

    // Get total funding from sponsors
    const sponsors = await prisma.sponsor.findMany({
      where: {
        status: {
          in: ['CONFIRMED', 'ACTIVE', 'COMPLETED'],
        },
      },
      select: {
        amount: true,
      },
    });

    const totalFunding = sponsors.reduce((sum, sponsor) => sum + (sponsor.amount || 0), 0);

    // Calculate success rate from applications
    // This is a simplified calculation - you may want to refine this based on your business logic
    const totalApplications = await prisma.application.count({
      where: {
        status: {
          not: 'DRAFT', // Exclude drafts from calculation
        },
      },
    });
    const successfulApplications = await prisma.application.count({
      where: {
        status: 'ACCEPTED',
      },
    });

    const successRate = totalApplications > 0 
      ? Math.round((successfulApplications / totalApplications) * 100)
      : null;

    return NextResponse.json({
      sponsoredScholars: sponsoredScholars || null,
      totalFunding: totalFunding || null,
      successRate: successRate || null,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return null values on error so the UI can show fallbacks
    return NextResponse.json({
      sponsoredScholars: null,
      totalFunding: null,
      successRate: null,
    });
  }
}


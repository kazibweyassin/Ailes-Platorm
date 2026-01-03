import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        userId: session.user.id
      },
      _count: {
        status: true
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

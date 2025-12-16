import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const intake = await prisma.studentIntake.findUnique({
      where: { id: params.id },
    });

    if (!intake) {
      return NextResponse.json({
        success: false,
        message: 'Intake form not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: intake,
    });

  } catch (error) {
    console.error('Error fetching student intake:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch intake form',
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, assignedTo, notes } = body;

    const intake = await prisma.studentIntake.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Intake form updated successfully',
      data: intake,
    });

  } catch (error) {
    console.error('Error updating student intake:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update intake form',
    }, { status: 500 });
  }
}

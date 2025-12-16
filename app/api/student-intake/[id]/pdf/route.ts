import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateStudentIntakePDF } from '@/lib/pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PDF generation requested for ID:', params.id);
    
    const intake = await prisma.studentIntake.findUnique({
      where: { id: params.id },
    });

    if (!intake) {
      console.log('Intake not found:', params.id);
      return NextResponse.json({
        success: false,
        message: 'Intake form not found',
      }, { status: 404 });
    }

    console.log('Intake found, generating PDF...');
    
    // Generate PDF
    const pdfBuffer = await generateStudentIntakePDF(intake);
    
    console.log('PDF generated, buffer size:', pdfBuffer.length);

    // Return PDF as download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="student-intake-${intake.firstName}-${intake.lastName}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      success: false,
      message: 'Failed to generate PDF',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

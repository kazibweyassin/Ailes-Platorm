import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateMapping } from "@/lib/ai-mapper";
import { generateDocuments } from "@/lib/document-generator";
import { generateCopilotZip, getZipFileName } from "@/lib/zip-generator";
import { sendCopilotDocumentsEmail, sendCopilotProcessingEmail } from "@/lib/copilot-email";

// POST /api/copilot/process - Process a Copilot request after payment confirmation
export async function POST(req: Request) {
  try {
    const { copilotRequestId, formHtml } = await req.json();
    if (!copilotRequestId) {
      return NextResponse.json({ error: "Missing copilotRequestId" }, { status: 400 });
    }

    // Fetch the Copilot request
    const copilotRequest = await prisma.copilotRequest.findUnique({
      where: { id: copilotRequestId },
      include: { user: true },
    });
    if (!copilotRequest) {
      return NextResponse.json({ error: "Copilot request not found" }, { status: 404 });
    }

    // Send processing notification email
    try {
      await sendCopilotProcessingEmail({
        email: copilotRequest.paymentEmail,
        name: copilotRequest.paymentName,
        copilotRequestId: copilotRequestId,
      });
    } catch (emailError) {
      console.error("Error sending processing email:", emailError);
      // Continue processing even if email fails
    }

    // 1. AI Mapping (if formHtml provided)
    let mapping = null;
    if (formHtml) {
      try {
        mapping = await generateMapping(formHtml);
      } catch (e: any) {
        console.error("AI mapping failed:", e);
        // Continue without mapping if it fails
      }
    }

    // 2. Document Generation
    const documents = await generateDocuments(copilotRequest.finderData, mapping);

    // 3. Generate ZIP file
    let zipBuffer: Buffer | null = null;
    let zipFileName: string | null = null;
    try {
      zipBuffer = await generateCopilotZip(documents, copilotRequest.finderData);
      zipFileName = getZipFileName(copilotRequestId, copilotRequest.paymentName);
    } catch (zipError) {
      console.error("Error generating ZIP:", zipError);
      // Continue without ZIP if generation fails
    }

    // 4. Send email with ZIP attachment
    if (zipBuffer && zipFileName) {
      try {
        await sendCopilotDocumentsEmail({
          email: copilotRequest.paymentEmail,
          name: copilotRequest.paymentName,
          zipBuffer,
          zipFileName,
          copilotRequestId: copilotRequestId,
        });
      } catch (emailError) {
        console.error("Error sending documents email:", emailError);
        // Continue even if email fails
      }
    }

    // 5. Update CopilotRequest with mapping, documents, and ZIP info
    await prisma.copilotRequest.update({
      where: { id: copilotRequestId },
      data: {
        mapping: mapping || undefined,
        documents: {
          ...documents,
          zipGenerated: zipBuffer ? true : false,
          zipFileName: zipFileName || null,
          zipGeneratedAt: zipBuffer ? new Date().toISOString() : null,
        },
        status: zipBuffer ? "completed" : "processing",
      },
    });

    return NextResponse.json({ 
      success: true,
      mapping, 
      documents,
      zipGenerated: !!zipBuffer,
      zipFileName: zipFileName || null,
      message: zipBuffer 
        ? "Documents generated and emailed successfully" 
        : "Documents generated, but ZIP creation failed"
    });
  } catch (error: any) {
    console.error("Error processing copilot request:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

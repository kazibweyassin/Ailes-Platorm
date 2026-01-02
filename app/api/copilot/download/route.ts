import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateCopilotZip, getZipFileName } from "@/lib/zip-generator";

// GET /api/copilot/download?requestId=xxx - Download copilot documents ZIP
export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json({ error: "Missing requestId parameter" }, { status: 400 });
    }

    // Fetch the Copilot request
    const copilotRequest = await prisma.copilotRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!copilotRequest) {
      return NextResponse.json({ error: "Copilot request not found" }, { status: 404 });
    }

    // Verify ownership (if user is authenticated)
    if (session?.user?.id && copilotRequest.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if documents exist
    if (!copilotRequest.documents) {
      return NextResponse.json({ error: "Documents not yet generated" }, { status: 404 });
    }

    // Generate ZIP file
    let zipBuffer: Buffer;
    try {
      zipBuffer = await generateCopilotZip(
        copilotRequest.documents as any,
        copilotRequest.finderData as any
      );
    } catch (error: any) {
      console.error("Error generating ZIP:", error);
      return NextResponse.json({ 
        error: "Failed to generate ZIP file",
        details: error.message 
      }, { status: 500 });
    }

    const zipFileName = getZipFileName(requestId, copilotRequest.paymentName);

    // Return ZIP file as download
    return new NextResponse(zipBuffer as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFileName}"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error downloading copilot documents:", error);
    return NextResponse.json({ 
      error: error?.message || "Internal server error" 
    }, { status: 500 });
  }
}


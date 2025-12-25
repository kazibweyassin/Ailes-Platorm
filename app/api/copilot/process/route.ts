import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateMapping } from "@/lib/ai-mapper";
import { generateDocuments } from "@/lib/document-generator";

// POST /api/copilot/process - Process a Copilot request after payment confirmation
export async function POST(req: Request) {
  try {
    const { copilotRequestId, formHtml } = await req.json();
    if (!copilotRequestId || !formHtml) {
      return NextResponse.json({ error: "Missing copilotRequestId or formHtml" }, { status: 400 });
    }

    // Fetch the Copilot request
    const copilotRequest = await prisma.copilotRequest.findUnique({
      where: { id: copilotRequestId },
    });
    if (!copilotRequest) {
      return NextResponse.json({ error: "Copilot request not found" }, { status: 404 });
    }

    // 1. AI Mapping
    let mapping;
    try {
      mapping = await generateMapping(formHtml);
    } catch (e: any) {
      return NextResponse.json({ error: "AI mapping failed", details: e?.message || "Unknown error" }, { status: 500 });
    }

    // 2. Document Generation (real)
    const documents = await generateDocuments(copilotRequest.finderData, mapping);

    // 3. Update CopilotRequest with mapping and documents
    await prisma.copilotRequest.update({
      where: { id: copilotRequestId },
      data: {
        mapping,
        documents,
        status: "processing",
      },
    });

    return NextResponse.json({ mapping, documents });
  } catch (error: any) {
    console.error("Error processing copilot request:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
const RATE_LIMIT = 10; // max 10 requests per 10 min per IP
const WINDOW_MS = 10 * 60 * 1000;
const ipHits: Record<string, { count: number; first: number }> = {};

// POST /api/copilot/requests - Create a new Copilot request
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    if (!ipHits[ip] || now - ipHits[ip].first > WINDOW_MS) {
      ipHits[ip] = { count: 1, first: now };
    } else {
      ipHits[ip].count++;
      if (ipHits[ip].count > RATE_LIMIT) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
    }

    const data = await req.json();
    
    // Validate required fields
    if (!data.paymentName || !data.paymentEmail || !data.paymentPhone || !data.paymentWhatsapp || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }
    
    if (!data.finderData) {
      return NextResponse.json({ error: "Missing finderData" }, { status: 400 });
    }

    // Get or create user based on email
    let userId: string;
    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Create or find user by email
      let user = await prisma.user.findUnique({
        where: { email: data.paymentEmail }
      });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: data.paymentEmail,
            name: data.paymentName,
            phone: data.paymentPhone,
          }
        });
      }
      userId = user.id;
    }

    const copilotRequest = await prisma.copilotRequest.create({
      data: {
        userId,
        finderData: data.finderData,
        paymentName: data.paymentName,
        paymentEmail: data.paymentEmail,
        paymentPhone: data.paymentPhone,
        paymentWhatsapp: data.paymentWhatsapp,
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        auditLog: { createdAt: new Date().toISOString(), ip },
      },
    });
    
    return NextResponse.json(copilotRequest, { status: 201 });
  } catch (error: any) {
    console.error("Error creating copilot request:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create copilot request" 
    }, { status: 500 });
  }
}

// GET /api/copilot/requests - Get all Copilot requests for the authenticated user
export async function GET(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.copilotRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Error fetching copilot requests:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/copilot/requests - Update Copilot request status or data
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const { id, ...update } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Verify the request belongs to the user
    const existingRequest = await prisma.copilotRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Copilot request not found" }, { status: 404 });
    }

    // If user is authenticated, verify ownership
    if (session?.user?.id && existingRequest.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.copilotRequest.update({
      where: { id },
      data: update,
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating copilot request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSponsorConfirmationEmail, sendAdminNotification } from "@/lib/email"

// POST /api/sponsors - Submit sponsorship application
export async function POST(req: Request) {
  try {
    console.log('=== Sponsor POST route called ===');
    const body = await req.json()
    console.log('Request body:', body);
    
    const {
      name,
      email,
      phone,
      sponsorType,
      companyName,
      companyWebsite,
      tierName,
      amount,
      preferredField,
      preferredCountry,
      message,
    } = body

    // Validate required fields
    if (!name || !email || !phone || !sponsorType || !tierName || !amount) {
      console.log('Validation failed:', { name, email, phone, sponsorType, tierName, amount });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log('Validation passed, attempting to create sponsor...');
    console.log('Prisma object:', prisma);
    console.log('Prisma.sponsor:', prisma.sponsor);

    // Create sponsor record
    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        email,
        phone,
        type: sponsorType.toUpperCase(),
        companyName: companyName || null,
        companyWebsite: companyWebsite || null,
        tierName,
        amount: parseFloat(amount),
        preferredField: preferredField || null,
        preferredCountry: preferredCountry || null,
        message: message || null,
        status: "PENDING", // Payment pending
      },
    })

    console.log('Sponsor created:', sponsor);

    // Send confirmation email to sponsor
    await sendSponsorConfirmationEmail({
      name,
      email,
      tierName,
      amount: parseFloat(amount),
      type: sponsorType,
    })

    // Send notification to admin
    await sendAdminNotification({
      sponsorName: name,
      sponsorEmail: email,
      tierName,
      amount: parseFloat(amount),
      type: sponsorType,
    })

    return NextResponse.json(
      {
        message: "Sponsorship application received successfully",
        sponsor: {
          id: sponsor.id,
          email: sponsor.email,
          tierName: sponsor.tierName,
          amount: sponsor.amount,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Sponsor submission error:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}

// GET /api/sponsors - Get all sponsors (admin only)
export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ sponsors })
  } catch (error) {
    console.error("Fetch sponsors error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

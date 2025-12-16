import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = subscribeSchema.parse(body);

    // TODO: Add email to your email service
    // Options:
    // 1. Resend (recommended for Next.js)
    // 2. Mailchimp
    // 3. ConvertKit
    // 4. Your database (Prisma)

    // For now, just log it
    console.log("Newsletter subscription:", email);

    // Example with Resend (uncomment when ready):
    /*
    import { Resend } from "resend";
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });
    */

    // Example with database (uncomment when ready):
    /*
    import { prisma } from "@/lib/prisma";
    await prisma.newsletterSubscriber.create({
      data: { email, subscribedAt: new Date() },
    });
    */

    return NextResponse.json(
      { message: "Successfully subscribed to newsletter" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}





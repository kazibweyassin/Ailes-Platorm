import { NextResponse } from "next/server";
import { runEmailScheduler } from "@/lib/email-scheduler";

/**
 * Email Scheduler Cron Job
 * Runs automatically via Vercel Crons or manual trigger
 *
 * POST /api/email/scheduler
 *
 * Authorization: Bearer CRON_SECRET (required for security)
 */

export async function POST(req: Request) {
  try {
    // Verify authorization for Vercel Cron
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // For development, allow without secret or with any bearer token
    if (process.env.NODE_ENV === "production") {
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized - Invalid CRON_SECRET" },
          { status: 401 }
        );
      }
    }

    // Run the email scheduler
    const result = await runEmailScheduler();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Email scheduler API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to run email scheduler",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for manual trigger (for testing)
 */
export async function GET(req: Request) {
  try {
    // Only allow in development or with secret
    if (
      process.env.NODE_ENV === "production" &&
      req.headers.get("x-test-key") !== process.env.CRON_SECRET
    ) {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 403 }
      );
    }

    const result = await runEmailScheduler();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Email scheduler GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to run scheduler",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runEmailScheduler } from "@/scripts/email-scheduler";
import { getEmailStats } from "@/lib/email-service";

export async function GET(req: NextRequest) {
  try {
    const action = req.nextUrl.searchParams.get("action");

    if (action === "process") {
      // Allow Vercel Cron to access this endpoint without auth
      const authHeader = req.headers.get('authorization');
      const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
      
      // If not from Vercel Cron, require admin auth
      if (!isVercelCron) {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }

      // Run email scheduler
      const result = await runEmailScheduler();
      return NextResponse.json(result);
    }

    // All other actions require admin auth
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "stats") {
      // Get email statistics
      const days = parseInt(req.nextUrl.searchParams.get("days") || "30");
      const stats = await getEmailStats(days);
      return NextResponse.json(stats);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in admin email route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

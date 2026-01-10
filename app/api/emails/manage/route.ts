import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { unsubscribeUser, resubscribeUser } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, reason } = await req.json();

    if (action === "unsubscribe") {
      await unsubscribeUser(session.user.id, reason);
      return NextResponse.json({ success: true, message: "Unsubscribed from emails" });
    }

    if (action === "resubscribe") {
      await resubscribeUser(session.user.id);
      return NextResponse.json({ success: true, message: "Resubscribed to emails" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error managing subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

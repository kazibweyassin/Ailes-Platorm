import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserEmailHistory } from "@/lib/email-service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");

    const history = await getUserEmailHistory(session.user.id, limit);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching email history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

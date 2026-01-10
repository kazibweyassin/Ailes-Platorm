import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  addEmailToQueue,
  getUserEmailPreferences,
  updateUserEmailPreferences,
  getUserEmailHistory,
} from "@/lib/email-service";
import { renderTemplate } from "@/lib/email-templates";
import { EmailType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await getUserEmailPreferences(session.user.id);

    if (!preferences) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching email preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await updateUserEmailPreferences(session.user.id, body);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating email preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

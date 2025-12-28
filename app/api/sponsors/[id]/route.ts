import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, paymentReference, paymentNotes, paymentConfirmed } = body;

    const updateData: any = {};
    
    if (status) {
      if (!["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (paymentReference !== undefined) {
      updateData.paymentReference = paymentReference;
    }

    if (paymentNotes !== undefined) {
      updateData.paymentNotes = paymentNotes;
    }

    if (paymentConfirmed !== undefined) {
      updateData.paymentConfirmed = paymentConfirmed;
      if (paymentConfirmed) {
        updateData.paymentConfirmedAt = new Date();
      }
    }

    const sponsor = await prisma.sponsor.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ sponsor });
  } catch (error) {
    console.error("Error updating sponsor:", error);
    return NextResponse.json(
      { error: "Failed to update sponsor" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: params.id },
    });

    if (!sponsor) {
      return NextResponse.json(
        { error: "Sponsor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ sponsor });
  } catch (error) {
    console.error("Error fetching sponsor:", error);
    return NextResponse.json(
      { error: "Failed to fetch sponsor" },
      { status: 500 }
    );
  }
}

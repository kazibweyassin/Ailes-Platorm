import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: {
        scholarship: {
          select: {
            name: true,
            amount: true,
            currency: true,
            deadline: true
          }
        }
      }
    });

    const stats = {
      total: applications.length,
      pending: applications.filter((a: any) => a.status === 'pending').length,
      submitted: applications.filter((a: any) => a.status === 'submitted').length,
      reviewing: applications.filter((a: any) => a.status === 'reviewing').length,
      accepted: applications.filter((a: any) => a.status === 'accepted').length,
      rejected: applications.filter((a: any) => a.status === 'rejected').length,
      recentApplications: applications
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

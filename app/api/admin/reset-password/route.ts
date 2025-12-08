import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

// POST /api/admin/reset-password - Reset user password (admin only)
export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, newPassword } = await req.json()

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 12)

    // Update the user's password
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      select: { id: true, email: true, name: true }
    })

    return NextResponse.json({ 
      message: "Password reset successfully",
      user 
    })
  } catch (error: any) {
    console.error("Password reset error:", error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

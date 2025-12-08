import { auth } from "@/lib/auth"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }
  
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }
  
  return user
}

export function isAuthenticated(session: any): boolean {
  return !!session?.user
}

export function isAdmin(session: any): boolean {
  return session?.user?.role === "ADMIN"
}

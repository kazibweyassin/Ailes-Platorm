import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/applications",
  "/api/user",
  "/api/applications",
  "/api/saved",
]

// Define admin routes
const adminRoutes = [
  "/admin",
]

// Function to detect country from headers
function detectCountry(request: NextRequest): string {
  // Try various headers that might contain country information
  // Cloudflare
  const cfCountry = request.headers.get("cf-ipcountry")
  // Vercel
  const vercelCountry = request.headers.get("x-vercel-ip-country")
  // Custom header
  const customCountry = request.headers.get("x-country-code")
  // GeoIP services
  const geoCountry = request.headers.get("x-geoip-country")
  
  // Use the first available country code
  const country = cfCountry || vercelCountry || customCountry || geoCountry || null
  
  return country?.toUpperCase() || "UNKNOWN"
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()
  
  // Detect country and set market segment cookie
  const country = detectCountry(request)
  const marketSegment = country === "US" ? "domestic" : "international"
  
  // Only set cookie if it doesn't exist or needs to be updated
  const existingSegment = request.cookies.get("market_segment")
  if (!existingSegment || existingSegment.value !== marketSegment) {
    response.cookies.set("market_segment", marketSegment, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  }
  
  // Skip middleware for auth routes and API auth routes
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return response
  }
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (!isProtectedRoute && !isAdminRoute) {
    return response
  }

  // Get session token
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
  })

  // Redirect to signin if not authenticated
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check admin access
  if (isAdminRoute && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth (scholarships, universities)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|api/scholarships|api/universities).*)",
  ],
}

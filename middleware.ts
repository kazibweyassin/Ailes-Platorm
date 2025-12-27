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
  // NextAuth v5 automatically detects cookie names (__Secure-authjs.session-token in production)
  // The secret must match what NextAuth is using
  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  
  if (!authSecret) {
    console.error('Middleware: AUTH_SECRET or NEXTAUTH_SECRET is not set!')
  }
  
  // Try to get token - NextAuth v5 should auto-detect cookie name
  // But we can also try explicitly specifying it if auto-detection fails
  let token = await getToken({ 
    req: request,
    secret: authSecret
  })
  
  // If token is null but cookie exists, try with explicit cookie name (NextAuth v5 fallback)
  if (!token) {
    const sessionCookie = request.cookies.get('__Secure-authjs.session-token') || 
                          request.cookies.get('authjs.session-token')
    if (sessionCookie) {
      // Try again with explicit cookie name (some NextAuth v5 versions need this)
      try {
        token = await getToken({ 
          req: request,
          secret: authSecret,
          cookieName: '__Secure-authjs.session-token'
        })
      } catch (e) {
        // If that fails, try without Secure prefix
        try {
          token = await getToken({ 
            req: request,
            secret: authSecret,
            cookieName: 'authjs.session-token'
          })
        } catch (e2) {
          // Last resort - use default name
          console.error('Failed to get token with any cookie name:', e2)
        }
      }
    }
  }
  
  // Enhanced debug logging (always log if token not found, helps diagnose production issues)
  if (!token) {
    const cookieNames = request.cookies.getAll().map(c => c.name)
    const sessionCookie = request.cookies.get('__Secure-authjs.session-token') || 
                          request.cookies.get('authjs.session-token') ||
                          request.cookies.get('next-auth.session-token')
    
    console.log('🔴 Middleware: No token found')
    console.log('📋 Available cookies:', cookieNames)
    console.log('🍪 Session cookie exists:', !!sessionCookie)
    console.log('🌐 Request URL:', request.url)
    console.log('🏠 Request host:', request.headers.get('host'))
    console.log('🔑 Secret set:', !!authSecret)
    
    // If cookie exists but token is null, it's likely a secret mismatch
    if (sessionCookie) {
      console.error('⚠️  Session cookie exists but getToken() returned null!')
      console.error('   This usually means:')
      console.error('   1. AUTH_SECRET mismatch - encryption/decryption secret doesn\'t match')
      console.error('   2. Cookie is corrupted or expired')
      console.error('   3. Cookie domain/path mismatch')
    } else {
      console.error('⚠️  No session cookie found in request!')
      console.error('   This usually means:')
      console.error('   1. Cookie domain mismatch (www vs non-www)')
      console.error('   2. Cookie path mismatch')
      console.error('   3. Cookie was not set properly')
    }
  }
  
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

# 🔧 Fix: Redirecting to Production URL in Local Development

## Problem
When signing in locally, you're being redirected to `ailesglobal.com` instead of `localhost:3000`.

## Solution

### Step 1: Create/Update `.env.local` file

Create a `.env.local` file in the root directory with:

```env
# IMPORTANT: Use localhost for local development
AUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key-here"

# Or use the old variable name (backward compatibility)
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-key-here"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Database
DATABASE_URL="your-database-url"
```

### Step 2: Restart Your Dev Server

After creating/updating `.env.local`:

1. **Stop** your dev server (Ctrl+C)
2. **Restart** it:
   ```bash
   npm run dev
   ```

### Step 3: Clear Browser Cache (Optional)

If the issue persists:
1. Clear your browser cache
2. Or use an incognito/private window
3. Or clear cookies for `localhost:3000`

## Why This Happens

NextAuth v5 uses the `AUTH_URL` environment variable to determine where to redirect after authentication. If this is set to the production URL (`https://ailesglobal.com`), it will redirect there even in local development.

## Verification

After fixing, when you sign in:
- ✅ Should redirect to `http://localhost:3000/dashboard` (or your callback URL)
- ❌ Should NOT redirect to `https://ailesglobal.com`

## Environment Variables Priority

NextAuth will check in this order:
1. `AUTH_URL` (NextAuth v5)
2. `NEXTAUTH_URL` (backward compatibility)
3. `NEXT_PUBLIC_BASE_URL` (fallback)
4. Default: `http://localhost:3000` (development) or `https://ailesglobal.com` (production)

## Production Deployment

When deploying to production, make sure your production `.env` has:
```env
AUTH_URL="https://ailesglobal.com"
NEXT_PUBLIC_BASE_URL="https://ailesglobal.com"
```







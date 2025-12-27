# NextAuth "Configuration" Error Fix

## Error Message
```
Authentication Error
There is a problem with the server configuration.
Error code: Configuration
```

## Root Cause
The "Configuration" error in NextAuth means one or more required environment variables are missing or invalid.

## Required Environment Variables

### 1. **AUTH_SECRET or NEXTAUTH_SECRET** (CRITICAL)
This is the most common cause of the Configuration error.

**Generate a secret:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Add to `.env.local` (development):**
```env
AUTH_SECRET="your-generated-secret-here"
# OR
NEXTAUTH_SECRET="your-generated-secret-here"
```

**Add to Production Environment Variables:**
- Go to your deployment platform (Vercel, etc.)
- Settings → Environment Variables
- Add `AUTH_SECRET` or `NEXTAUTH_SECRET`
- Use the SAME secret as development

### 2. **AUTH_URL or NEXTAUTH_URL** (Required for callbacks)
**Development:**
```env
AUTH_URL="http://localhost:3000"
# OR
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```env
AUTH_URL="https://www.ailesglobal.com"
# OR
NEXTAUTH_URL="https://www.ailesglobal.com"
```

### 3. **DATABASE_URL** (Required if using PrismaAdapter)
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

## Fixes Applied

### 1. Added Secret Validation
**File**: `lib/auth.ts`
- Validates that `AUTH_SECRET` or `NEXTAUTH_SECRET` is set
- Logs clear error message if missing
- Prevents silent failures

### 2. Added basePath Configuration
- Explicitly sets `basePath: "/api/auth"`
- Ensures NextAuth knows where to handle auth routes

### 3. Enhanced trustHost
- Set `trustHost: true` for both development and production
- Allows NextAuth to work correctly behind proxies

## Immediate Fix Steps

### Step 1: Check Environment Variables
1. **Development**: Check `.env.local` file
2. **Production**: Check deployment platform environment variables

### Step 2: Verify Required Variables
Make sure these are set:
- ✅ `AUTH_SECRET` or `NEXTAUTH_SECRET`
- ✅ `AUTH_URL` or `NEXTAUTH_URL`
- ✅ `DATABASE_URL` (if using database)

### Step 3: Restart Server
After adding/updating environment variables:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 4: Clear Cookies
If error persists:
1. Clear browser cookies
2. Try signing in again

## Common Scenarios

### Scenario 1: Secret Not Set
**Symptom**: Configuration error on every sign-in attempt
**Fix**: Add `AUTH_SECRET` to environment variables

### Scenario 2: Secret Mismatch
**Symptom**: Cookies exist but can't be decrypted
**Fix**: Ensure same secret in dev and production

### Scenario 3: URL Mismatch
**Symptom**: Redirects to wrong domain
**Fix**: Set `AUTH_URL` to match your actual domain

### Scenario 4: Database Connection
**Symptom**: Configuration error when using database adapter
**Fix**: Verify `DATABASE_URL` is correct and database is accessible

## Verification

After fixing:
1. ✅ No "Configuration" error
2. ✅ Sign in works
3. ✅ Cookies are set correctly
4. ✅ Dashboard is accessible

## Debugging

Check server logs for:
```
⚠️  AUTH_SECRET or NEXTAUTH_SECRET is not set!
```

If you see this, add the secret to your environment variables.

## Production Checklist

Before deploying:
- [ ] `AUTH_SECRET` or `NEXTAUTH_SECRET` is set
- [ ] `AUTH_URL` or `NEXTAUTH_URL` is set to production URL
- [ ] `DATABASE_URL` is set and accessible
- [ ] All environment variables are added to deployment platform
- [ ] Secret matches between development and production


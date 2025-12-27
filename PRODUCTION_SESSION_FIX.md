# Production Session Fix - Cookie Exists But Not Recognized

## Issue
Cookies are set (`__Secure-authjs.session-token` exists) but middleware doesn't recognize the session, causing redirect loops.

## Cookies Observed
✅ `__Secure-authjs.session-token` - Session token (encrypted JWT)  
✅ `__Secure-authjs.callback-url` - Callback URL  
✅ `__Host-authjs.csrf-token` - CSRF token  
✅ `__Secure-authjs.pkce.code_verifier` - PKCE verifier

## Root Causes

### 1. **Secret Mismatch** (MOST LIKELY)
The `AUTH_SECRET` used to encrypt the cookie doesn't match the `AUTH_SECRET` used to decrypt it in middleware.

**Symptoms:**
- Cookie exists in browser
- `getToken()` returns `null`
- Middleware redirects to sign-in

**Solution:**
- Ensure `AUTH_SECRET` or `NEXTAUTH_SECRET` is set in production
- The secret MUST be the same as when the cookie was created
- If secret was changed, users must clear cookies and sign in again

### 2. **Domain Mismatch**
Cookie is set for `www.ailesglobal.com` but request might be from `ailesglobal.com` (or vice versa).

**Symptoms:**
- Cookie exists but not sent with request
- Different domain in cookie vs request

**Solution:**
- Ensure consistent domain usage (always use www or always use non-www)
- Set up redirect from non-www to www (or vice versa)
- Or configure cookie to work for both domains

### 3. **Cookie Path/HttpOnly Issues**
Cookie might not be accessible due to path or HttpOnly settings.

**Solution:**
- Ensure cookie path is `/` (root)
- HttpOnly should be `true` (security)
- SameSite should be `lax` or `strict`

## Debugging

### Check Server Logs
After deploying the updated middleware, check your production logs for:
```
🔴 Middleware: No token found
📋 Available cookies: [...]
🍪 Session cookie exists: true/false
🌐 Request URL: ...
🏠 Request host: ...
🔑 Secret set: true/false
```

### What to Look For

1. **If "Session cookie exists: false"**:
   - Domain mismatch issue
   - Cookie not being sent with request
   - Check if request is from same domain as cookie

2. **If "Session cookie exists: true" but token is null**:
   - Secret mismatch (most likely)
   - Cookie corrupted or expired
   - Check if `AUTH_SECRET` matches

3. **If "Secret set: false"**:
   - `AUTH_SECRET` or `NEXTAUTH_SECRET` not set in production
   - Add it to your deployment platform's environment variables

## Immediate Fix

### Step 1: Verify Environment Variables
In your deployment platform (Vercel, etc.):
1. Go to Settings → Environment Variables
2. Check if `AUTH_SECRET` or `NEXTAUTH_SECRET` is set
3. If not, add it with the same value as your development environment

### Step 2: Test
1. Clear browser cookies for `www.ailesglobal.com`
2. Sign in again
3. Check if `/dashboard` is accessible

### Step 3: Check Logs
1. Access `/dashboard` after signing in
2. Check server logs for the debug messages
3. See what the middleware is reporting

## Long-term Fix

### Option 1: Use Same Secret Everywhere
- Use the same `AUTH_SECRET` in development and production
- Store it securely in your deployment platform
- Never change it (or force all users to re-authenticate)

### Option 2: Handle Domain Redirects
- Set up redirect from `ailesglobal.com` to `www.ailesglobal.com` (or vice versa)
- Ensure cookies work for the canonical domain
- Update `AUTH_URL` to match canonical domain

### Option 3: Configure Cookie Domain
If you need cookies to work across subdomains:
```typescript
// In lib/auth.ts (if needed)
cookies: {
  sessionToken: {
    name: '__Secure-authjs.session-token',
    options: {
      domain: '.ailesglobal.com', // Works for all subdomains
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    },
  },
}
```

## Verification

After fixing:
1. ✅ Sign in works
2. ✅ Cookies are set
3. ✅ `/dashboard` is accessible
4. ✅ No redirect loops
5. ✅ Server logs show token is found

If still not working, the debug logs will tell you exactly what's wrong!


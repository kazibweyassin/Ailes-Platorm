# Session Cookie Fix - Production Issue

## Issue
User sees cookies set (`__Secure-authjs.session-token`) but middleware doesn't recognize the session, causing redirect loops.

## Root Cause
The cookies are being set correctly, but the middleware's `getToken()` function might not be reading them due to:
1. **Secret mismatch** - The secret used to encrypt the token doesn't match
2. **Cookie domain mismatch** - Cookie is set for `www.ailesglobal.com` but middleware might be checking a different domain
3. **Cookie path issues** - Cookie path doesn't match request path

## Cookies Observed
- `__Secure-authjs.session-token` - Session token (encrypted JWT)
- `__Secure-authjs.callback-url` - Callback URL
- `__Host-authjs.csrf-token` - CSRF token

## Fixes Applied

### 1. Added Debug Logging
**File**: `middleware.ts`
- Added logging to see which cookies are available
- Logs when token is not found
- Helps diagnose the issue

### 2. Secret Verification
- Added check to ensure `AUTH_SECRET` or `NEXTAUTH_SECRET` is set
- Logs error if secret is missing

## Critical Check: Environment Variables

**In Production (Vercel/Deployment):**
Make sure these environment variables are set:
```env
AUTH_SECRET="your-secret-key-here"
# OR
NEXTAUTH_SECRET="your-secret-key-here"
```

**IMPORTANT**: The secret in production MUST match the secret used when the cookie was created!

## Debugging Steps

1. **Check Server Logs**:
   - Look for "Middleware: No token found" messages
   - Check which cookies are available
   - Verify secret is set

2. **Verify Cookie Domain**:
   - Cookie is set for `www.ailesglobal.com`
   - Make sure requests are coming from the same domain
   - Check if there's a redirect from `ailesglobal.com` to `www.ailesglobal.com`

3. **Check Secret Match**:
   - The secret used to encrypt the token must match the secret used to decrypt it
   - If you changed the secret after cookies were set, users need to sign in again

## Common Issues

### Issue 1: Secret Changed
**Symptom**: Cookies exist but token can't be decrypted
**Solution**: 
- Ensure `AUTH_SECRET` is the same across all deployments
- Users may need to clear cookies and sign in again

### Issue 2: Domain Mismatch
**Symptom**: Cookie set for `www.ailesglobal.com` but request from `ailesglobal.com`
**Solution**:
- Ensure consistent domain usage
- Set up redirect from non-www to www (or vice versa)
- Or configure cookie domain to work for both

### Issue 3: HTTPS Required
**Symptom**: `__Secure-` prefix requires HTTPS
**Solution**:
- Ensure site is served over HTTPS
- Check SSL certificate is valid

## Next Steps

1. **Check Production Environment Variables**:
   - Go to your deployment platform (Vercel, etc.)
   - Verify `AUTH_SECRET` or `NEXTAUTH_SECRET` is set
   - Ensure it matches the secret used in development

2. **Test Cookie Reading**:
   - After deploying, check server logs
   - Look for the debug messages
   - See which cookies are available

3. **Clear and Re-sign In**:
   - If secret was changed, users need to:
     - Clear browser cookies
     - Sign in again
     - New cookies will be created with the correct secret

## Verification

After fixing, test:
1. Sign in
2. Check browser cookies (should see `__Secure-authjs.session-token`)
3. Access `/dashboard`
4. Should work without redirect loop

If still not working, check server logs for the debug messages to see what's happening.


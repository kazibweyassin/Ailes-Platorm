# Environment Variables Setup Checklist

## ✅ Your Current Setup

### Local Development (.env.local)
```env
AUTH_SECRET="BTgn5OaLC+wrBfe8qqm/2IIFaUG0Vp2QfGDUWQORYsQ="
```

## 🔴 CRITICAL: Production Setup Required

### Step 1: Add to Production Environment Variables

**In your deployment platform (Vercel, Railway, etc.):**

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:
   - **Name**: `AUTH_SECRET`
   - **Value**: `BTgn5OaLC+wrBfe8qqm/2IIFaUG0Vp2QfGDUWQORYsQ=`
   - **Environment**: Production (and Preview if needed)

### Step 2: Verify Other Required Variables

Make sure these are also set in production:

```env
# Required for NextAuth
AUTH_SECRET="BTgn5OaLC+wrBfe8qqm/2IIFaUG0Vp2QfGDUWQORYsQ="
AUTH_URL="https://www.ailesglobal.com"
# OR
NEXTAUTH_URL="https://www.ailesglobal.com"

# Required for database
DATABASE_URL="your-production-database-url"

# Optional: Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

## ⚠️ Important Notes

1. **Same Secret Everywhere**: Use the SAME `AUTH_SECRET` in:
   - Development (.env.local)
   - Production (deployment platform)
   - Preview environments (if applicable)

2. **Never Commit Secrets**: 
   - ✅ `.env.local` is in `.gitignore` (should be)
   - ✅ Never commit secrets to Git
   - ✅ Use deployment platform's environment variables

3. **After Adding Variables**:
   - Redeploy your application
   - Clear browser cookies
   - Test sign-in again

## 🔍 Verification

After adding `AUTH_SECRET` to production:

1. **Check Server Logs**: Should NOT see:
   ```
   ⚠️  AUTH_SECRET or NEXTAUTH_SECRET is not set!
   ```

2. **Test Sign-In**: 
   - Should NOT see "Configuration" error
   - Should redirect to dashboard after sign-in
   - Cookies should be set correctly

3. **Check Cookies**: 
   - Should see `__Secure-authjs.session-token` cookie
   - Cookie should be readable by middleware

## 🚨 If Still Getting "Configuration" Error

1. **Verify Secret is Set**:
   - Check deployment platform environment variables
   - Ensure it's set for the correct environment (Production)
   - Ensure there are no extra spaces or quotes

2. **Redeploy**:
   - After adding environment variables, you MUST redeploy
   - Environment variables are only loaded at build/runtime

3. **Check Secret Format**:
   - Should be a base64 string
   - No quotes needed in deployment platform (usually)
   - No spaces before/after

4. **Test Locally First**:
   - Make sure sign-in works locally
   - If it works locally but not in production, it's an env var issue

## 📝 Quick Reference

**Your Secret**: `BTgn5OaLC+wrBfe8qqm/2IIFaUG0Vp2QfGDUWQORYsQ=`

**Add to Production**: 
- Platform: [Your deployment platform]
- Variable: `AUTH_SECRET`
- Value: `BTgn5OaLC+wrBfe8qqm/2IIFaUG0Vp2QfGDUWQORYsQ=`
- Environment: Production


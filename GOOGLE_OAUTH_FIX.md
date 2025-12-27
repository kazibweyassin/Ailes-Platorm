# 🔧 Google OAuth Sign-In Fix Guide

## Common Issues & Solutions

### Issue 1: Missing Environment Variables ⚠️ **MOST COMMON**

The Google OAuth requires these environment variables to be set:

```env
# Required for Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# OR (alternative names)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Required for NextAuth redirects
AUTH_URL="http://localhost:3000"  # For development
# AUTH_URL="https://yourdomain.com"  # For production

# OR
NEXTAUTH_URL="http://localhost:3000"  # Alternative name

# Required for NextAuth
AUTH_SECRET="your-secret-key"
# OR
NEXTAUTH_SECRET="your-secret-key"
```

**Check if variables are set:**
```bash
# In your terminal, check if variables exist
echo $AUTH_GOOGLE_ID
echo $AUTH_GOOGLE_SECRET
```

---

### Issue 2: Google Cloud Console Configuration

#### Step 1: Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
7. Copy the **Client ID** and **Client Secret**

#### Step 2: Add to `.env.local`

```env
AUTH_GOOGLE_ID="your-client-id-here.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-client-secret-here"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="generate-a-random-secret"
```

---

### Issue 3: OAuth Consent Screen Not Configured

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (for testing) or **Internal** (for Google Workspace)
3. Fill in required fields:
   - App name
   - User support email
   - Developer contact email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users (if in testing mode)
6. Submit for verification (if going public)

---

### Issue 4: Redirect URI Mismatch

The redirect URI in your Google Console **must exactly match**:
```
http://localhost:3000/api/auth/callback/google
```

**Common mistakes:**
- ❌ `http://localhost:3000/auth/callback/google` (wrong path)
- ❌ `https://localhost:3000/api/auth/callback/google` (wrong protocol)
- ❌ Missing `/api/auth/callback/google` path
- ✅ `http://localhost:3000/api/auth/callback/google` (correct)

---

### Issue 5: Environment Variable Not Loading

**Solution:** Restart your dev server after adding env variables:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

**Check:** The variables should be in `.env.local` (not `.env` for Next.js)

---

### Issue 6: Missing AUTH_SECRET

Generate a secret key:

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Add to `.env.local`:
```env
AUTH_SECRET="your-generated-secret-here"
```

---

## 🔍 Diagnostic Steps

### Step 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try to sign in with Google
4. Look for error messages

**Common errors:**
- `redirect_uri_mismatch` → Redirect URI doesn't match Google Console
- `invalid_client` → Client ID/Secret is wrong
- `access_denied` → OAuth consent screen not configured

### Step 2: Check Server Logs

Look at your terminal where `npm run dev` is running:

```bash
# Should see NextAuth debug logs if debug mode is on
[auth][debug] ...
```

### Step 3: Test API Endpoint

Visit in browser:
```
http://localhost:3000/api/auth/providers
```

You should see Google provider listed if configured correctly.

---

## ✅ Quick Fix Checklist

- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] OAuth consent screen configured
- [ ] `AUTH_GOOGLE_ID` set in `.env.local`
- [ ] `AUTH_GOOGLE_SECRET` set in `.env.local`
- [ ] `AUTH_URL` or `NEXTAUTH_URL` set in `.env.local`
- [ ] `AUTH_SECRET` or `NEXTAUTH_SECRET` set in `.env.local`
- [ ] Dev server restarted after adding env variables
- [ ] Browser cache cleared (or use incognito mode)

---

## 🧪 Test After Fix

1. Go to `/auth/signin`
2. Click "Continue with Google"
3. Should redirect to Google sign-in page
4. After signing in, should redirect back to your app
5. Should be logged in and redirected to dashboard

---

## 🚨 Still Not Working?

### Enable Debug Mode

Add to `.env.local`:
```env
NODE_ENV=development
```

The auth config already has:
```typescript
debug: process.env.NODE_ENV === "development",
```

This will show detailed error messages in console.

### Check Prisma Schema

Make sure your Prisma schema has the `Account` model (required for OAuth):

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

---

## 📝 Example `.env.local` File

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key-here"

# Google OAuth
AUTH_GOOGLE_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz"

# Node Environment
NODE_ENV="development"
```

---

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)


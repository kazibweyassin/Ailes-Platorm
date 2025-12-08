# 🚨 Database Connection Troubleshooting

## Current Error
```
Can't reach database server at db.nfynecfddobphmebpgzb.supabase.co:5432
```

This means your Supabase project is **not accessible**.

---

## ✅ SOLUTION: Check Supabase Project Status

### Step 1: Login to Supabase Dashboard
Go to: **https://supabase.com/dashboard**

### Step 2: Check Project Status

Look for your project: **nfynecfddobphmebpgzb**

You'll see one of these:

#### Option A: Project is PAUSED ⏸️
- Status shows "Paused" or "Inactive"
- **Fix:** Click "Restore" or "Resume" button
- Wait 2-3 minutes for database to wake up
- Then retry: `npx prisma db push`

#### Option B: Project DOESN'T EXIST ❌
- Can't find project in your dashboard
- Project was deleted or never created
- **Fix:** Create new project (see below)

#### Option C: Project is ACTIVE ✅
- Project shows as "Active" and "Healthy"
- But still can't connect
- **Fix:** Get fresh connection string (see below)

---

## 🆕 Create New Supabase Project (If Needed)

### 1. Create Project
- Click "New Project"
- **Name:** `ailes-scholarships`
- **Database Password:** Choose strong password (SAVE THIS!)
- **Region:** Choose closest to you (e.g., East US, West EU)
- Click "Create new project"
- **Wait 2-3 minutes** for setup

### 2. Get Connection String
After project is ready:
- Go to: **Settings** (gear icon) → **Database**
- Scroll to "Connection string" section
- Click **"URI"** tab (NOT "Connection pooling")
- Copy the string that looks like:
  ```
  postgresql://postgres.xxxxxxxxx:[YOUR-PASSWORD]@db.xxxxxxxxx.supabase.co:5432/postgres
  ```
- **Replace `[YOUR-PASSWORD]`** with the password you chose in step 1

### 3. Update .env
Replace the DATABASE_URL in your `.env` file with the new string:
```env
DATABASE_URL="postgresql://postgres.xxxxxxxxx:YOUR_ACTUAL_PASSWORD@db.xxxxxxxxx.supabase.co:5432/postgres"
```

### 4. Update NEXT_PUBLIC_SUPABASE_URL
Also update this line with your new project URL:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
```

### 5. Get New Anon Key
In Supabase Dashboard:
- Settings → API
- Copy "anon/public" key
- Update in .env:
```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_new_anon_key
```

---

## 🔧 If Project Exists But Can't Connect

### Get Fresh Connection String

1. **Supabase Dashboard** → Your Project
2. **Settings** → **Database**
3. Look for "Connection string" section
4. Try **both** connection modes:

#### Option 1: Direct Connection (Recommended for Prisma)
- Click "URI" tab
- Copy string like:
  ```
  postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres
  ```

#### Option 2: Session Pooler
- Click "Session" tab
- Copy string like:
  ```
  postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  ```

5. **Make sure to replace `[YOUR-PASSWORD]`** with actual password

---

## 🧪 Test Connection

After updating .env:

### Test 1: Prisma Connection
```powershell
npx prisma db push --accept-data-loss
```

**Success looks like:**
```
✅ Your database is now in sync with your Prisma schema.
```

**Still failing?** Try these:

### Test 2: Check Password Special Characters
If your password has special characters (!, @, #, $, %, etc.), they need to be URL-encoded:

| Character | Encoded |
|-----------|---------|
| !         | %21     |
| @         | %40     |
| #         | %23     |
| $         | %24     |
| %         | %25     |
| ^         | %5E     |
| &         | %26     |
| *         | %2A     |

Example:
- Password: `Pass@word123!`
- Encoded: `Pass%40word123%21`

### Test 3: Verify Project Region
Make sure the region in connection string matches your project:
- Check in Supabase Dashboard → Settings → General
- Look for "Region"
- Connection string should have same region (e.g., `aws-0-us-east-1`)

---

## 🚀 After Connection Works

Run these commands in order:

```powershell
# 1. Create all database tables
npx prisma db push --accept-data-loss

# 2. Generate Prisma client
npx prisma generate

# 3. Seed database with 10 scholarships
npx prisma db seed

# 4. Verify data (opens browser UI)
npx prisma studio
```

---

## ⚡ Quick Alternative: Use Different Database Provider

If Supabase continues to have issues, you can use:

### Option 1: Neon (Recommended)
- Free tier: https://neon.tech
- Better for hobby projects
- Get connection string same way

### Option 2: Railway
- Free tier: https://railway.app
- Very fast setup
- PostgreSQL template

### Option 3: Local PostgreSQL
```powershell
# Install PostgreSQL locally
# Then use:
DATABASE_URL="postgresql://postgres:password@localhost:5432/ailes"
```

---

## 📋 Checklist

Before asking for more help, verify:

- [ ] Logged into Supabase Dashboard
- [ ] Found your project (or created new one)
- [ ] Project status is "Active" (not paused)
- [ ] Copied connection string from Settings → Database → URI
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] No typos in .env file
- [ ] No extra spaces in connection string
- [ ] Password special characters are URL-encoded if needed
- [ ] Tried both direct connection and pooler connection

---

## 💬 What To Tell Me Next

### If you restored/created project:
> "Created new Supabase project, here's the connection string: [paste it]"

I'll update your .env and test the connection.

### If project exists but still can't connect:
> "Project is active, tried both connection strings, still failing"

I'll help you troubleshoot further or set up alternative database.

### If you want to use different provider:
> "Let's use Neon/Railway/Local instead"

I'll guide you through that setup.

---

**Most likely issue:** Project was paused or deleted. Creating a new Supabase project takes 5 minutes and solves everything. 🎯

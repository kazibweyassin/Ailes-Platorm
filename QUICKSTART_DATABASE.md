# Quick Start: Connect Real Data

## 🚨 URGENT: Your database credentials are invalid

Your current error: **"Tenant or user not found"**

---

## 🔧 Fix in 3 Steps (5 minutes)

### Step 1: Get Supabase Connection String

**Go here:** https://supabase.com/dashboard

1. Sign in to your Supabase account
2. Find or create your project
3. Go to: **Settings → Database**
4. Scroll to **"Connection string"**
5. Select **"Transaction"** mode
6. Copy the string (looks like this):
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with your actual password

### Step 2: Update .env File

Open `f:\Project\newailes\.env` and replace this line:
```env
DATABASE_URL="postgresql://postgres.nfynecfddobphmebpgzb:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```

With your new connection string from Step 1.

### Step 3: Run These Commands

```powershell
# 1. Create database tables
npx prisma db push --accept-data-loss

# 2. Generate Prisma client
npx prisma generate

# 3. Seed with 10 real scholarships
npm run db:seed
```

---

## ✅ Success Looks Like This

After running the commands, you should see:

```
✅ Your database is now in sync with your Prisma schema.
```

```
🌱 Seeding scholarships database...
✅ Created: Mastercard Foundation Scholars Program
✅ Created: African Women in STEM Scholarship
✅ Created: Chevening Scholarships
...
🎉 Seeding completed!
```

---

## 🎉 What You Get

### Real Data Everywhere

1. **Browse Page** → 10 real scholarships from database
2. **AI Matching** → Actual calculations based on user profile  
3. **Dashboard** → Real saved scholarships, applications, deadlines
4. **Profile** → Saves to database, used for matching

### No Code Changes Needed!

All your API routes already use Prisma:
- ✅ `/api/scholarships` → Ready
- ✅ `/api/scholarships/match` → Ready  
- ✅ `/api/applications` → Ready
- ✅ `/api/saved-scholarships` → Ready

Your frontend already calls these APIs. Just connect the database and everything works! 🚀

---

## 🧪 Test It Works

### Method 1: Browse Scholarships
Visit: http://localhost:3000/scholarships

Should see 10 real scholarships instead of mock data.

### Method 2: Prisma Studio (Visual Database)
```powershell
npx prisma studio
```

Opens browser UI showing all your data.

---

## ❓ Still Having Issues?

### "Can't reach database server"
→ Your Supabase project might be paused (free tier)
→ Go to dashboard and restore it

### "Invalid password"  
→ Reset password: Supabase Dashboard → Settings → Database → Reset Password
→ Update .env with new password

### "Connection pool timeout"
→ Make sure you're using Transaction mode (port 5432)
→ NOT Session mode (port 6543)

---

## 📚 Full Details

See **DATABASE_SETUP_GUIDE.md** for complete instructions, troubleshooting, and API documentation.

---

**That's it!** Once database is connected, your entire platform runs on real data. No mock arrays, no fake data. Production-ready! 🎯

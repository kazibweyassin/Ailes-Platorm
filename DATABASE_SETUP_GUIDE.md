# Database Setup Guide - Connect Real Data

## Current Issue
❌ **Database connection failing with error: "Tenant or user not found"**

This means your Supabase credentials are invalid or the project no longer exists.

---

## Solution: Get New Supabase Connection String

### Option 1: Use Existing Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in with your account

2. **Select Your Project**
   - Find your project: `nfynecfddobphmebpgzb`
   - OR create a new project if it doesn't exist

3. **Get Connection String**
   - Go to: Settings → Database
   - Scroll to "Connection string"
   - Select **"Transaction"** mode (for Prisma migrations)
   - Copy the connection string
   - It looks like: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

4. **Get Your Password**
   - The connection string has `[YOUR-PASSWORD]` placeholder
   - Replace it with your actual database password
   - If you forgot the password, you can reset it in Settings → Database → Reset Database Password

5. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```

---

### Option 2: Create New Supabase Project (Recommended if project deleted)

1. **Create Project**
   - Go to: https://supabase.com/dashboard
   - Click "New Project"
   - Name: `ailes-global`
   - Choose closest region (e.g., East US)
   - **IMPORTANT:** Save the database password shown!

2. **Get Connection String**
   - After project is created (~2 minutes)
   - Go to: Settings → Database
   - Copy "Transaction" connection string
   - Replace `[YOUR-PASSWORD]` with the password from step 1

3. **Update .env**
   ```env
   DATABASE_URL="postgresql://postgres.[NEW-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```

---

## After Updating .env

### Step 1: Test Connection
```powershell
npx prisma db push --accept-data-loss
```

**Expected Success Output:**
```
✅ Your database is now in sync with your Prisma schema.
```

**If you see errors:**
- Double-check password has no typos
- Ensure no spaces in connection string
- Verify project exists in Supabase dashboard

---

### Step 2: Generate Prisma Client
```powershell
npx prisma generate
```

---

### Step 3: Seed Database with Real Scholarships
```powershell
npm run db:seed
```

This will create:
- ✅ 10 real scholarships (Mastercard, Chevening, DAAD, etc.)
- ✅ Demo user account (demo@ailes.com / demo123456)
- ✅ 5 universities

**Expected Output:**
```
🌱 Seeding scholarships database...
✅ Created: Mastercard Foundation Scholars Program
✅ Created: African Women in STEM Scholarship
✅ Created: Chevening Scholarships
...
🎉 Seeding completed!
```

---

### Step 4: Verify Data
```powershell
npx prisma studio
```

This opens a browser UI where you can:
- See all 10 scholarships
- Verify data is correct
- Make manual edits if needed

---

## After Database is Connected

### Your App Will Automatically Use Real Data

All these pages will now show real database data instead of mock data:

1. **Browse Scholarships** (`/scholarships`)
   - Shows all 10 seeded scholarships
   - Filters work with real data
   - Search queries actual database

2. **AI Matching** (`/scholarships/match`)
   - Calculates real match scores based on user profile
   - Shows actual eligibility requirements
   - Uses Prisma queries

3. **Dashboard** (`/dashboard`)
   - Shows saved scholarships from database
   - Real application tracking
   - Actual deadline calculations

4. **Profile** (`/profile`)
   - Saves to User table
   - Updates actually persist
   - Used for AI matching

---

## API Endpoints That Will Work

All these are already built and ready:

- ✅ `GET /api/scholarships` - List all scholarships with filters
- ✅ `GET /api/scholarships/[id]` - Get scholarship details
- ✅ `GET /api/scholarships/match` - AI matching (requires auth)
- ✅ `GET /api/scholarships/deadlines` - Upcoming deadlines
- ✅ `POST /api/scholarships/compare` - Compare scholarships
- ✅ `GET /api/applications` - User's applications (requires auth)
- ✅ `POST /api/applications` - Create application (requires auth)
- ✅ `GET /api/saved-scholarships` - Saved items (requires auth)
- ✅ `POST /api/saved-scholarships` - Save scholarship (requires auth)
- ✅ `GET /api/user/profile` - User profile (requires auth)
- ✅ `PUT /api/user/profile` - Update profile (requires auth)

---

## Testing the Flow

### 1. Browse Scholarships (No Auth Required)
```
Visit: http://localhost:3000/scholarships
```
- Should see 10 real scholarships
- Try filters (Country, Type, Women-only)
- Click on a scholarship to see details

### 2. AI Matching (Requires Auth)
```
Visit: http://localhost:3000/scholarships/match
```
- Sign in with: demo@ailes.com / demo123456
- See personalized match scores
- Matches based on demo user's profile (Kenyan female, CS major, 3.7 GPA)

### 3. Save & Apply (Requires Auth)
```
1. Browse scholarships
2. Click "Save" on any scholarship
3. Go to Dashboard - see saved scholarship
4. Click "Apply" - creates application record
5. Dashboard shows application status
```

---

## Common Issues & Solutions

### Error: "Can't reach database server"
- **Solution:** Check if Supabase project is paused (free tier pauses after 1 week inactivity)
- Go to Supabase Dashboard → Restore project

### Error: "Invalid password"
- **Solution:** Reset password in Supabase Settings → Database → Reset Database Password
- Update .env with new password

### Error: "Connection pool timeout"
- **Solution:** Use Transaction pooler (port 5432) not Session pooler (port 6543)

### Seed script fails
- **Solution:** Run `npx prisma db push` first to create tables
- Then run `npm run db:seed`

---

## Quick Commands Reference

```powershell
# Test connection
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed database
npm run db:seed

# Open database UI
npx prisma studio

# View schema
npx prisma validate

# Reset database (warning: deletes all data)
npx prisma db push --force-reset
```

---

## What Happens When Database is Connected?

### Frontend Pages Automatically Switch to Real Data

The API routes already use Prisma:
```typescript
// app/api/scholarships/route.ts
const scholarships = await prisma.scholarship.findMany({
  where: { /* filters */ },
  orderBy: { deadline: 'asc' }
})
```

Your frontend pages already call these APIs:
```typescript
// app/dashboard/page.tsx
const response = await fetch('/api/scholarships/match')
const data = await response.json()
```

**No code changes needed!** Just connect the database and everything works.

---

## Need Help?

1. **Check connection string format:**
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[HOST]:5432/postgres
   ```

2. **Verify in Supabase dashboard:**
   - Project is active (not paused)
   - Password is correct
   - Connection string is "Transaction" mode

3. **Test with Prisma Studio:**
   ```powershell
   npx prisma studio
   ```
   If this opens, your connection works!

---

## Next Steps After Database Works

1. ✅ Verify all 10 scholarships appear on browse page
2. ✅ Test AI matching with demo account
3. ✅ Create your own user account
4. ✅ Save scholarships and check dashboard
5. ✅ Submit test application
6. ✅ Add more scholarships via Prisma Studio or seed script
7. ✅ Update profile and see match scores change

---

**Ready to go live?** Once database is connected, all features work with real data. No mock data remains! 🚀

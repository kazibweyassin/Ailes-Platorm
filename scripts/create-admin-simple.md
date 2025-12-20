# Quick Admin Setup (If Database Connection Fails)

If `npm run create-admin` fails due to database connection, use one of these methods:

## Method 1: Using Prisma Studio (Easiest)

1. **Start Prisma Studio:**
   ```bash
   npm run db:studio
   ```

2. **Create Admin User:**
   - Click on `users` table
   - Click "Add record" button
   - Fill in:
     - `email`: `admin@ailesglobal.com` (or your email)
     - `name`: `Admin User`
     - `password`: Generate a hash using https://bcrypt-generator.com/ (use 12 rounds)
       - Enter your desired password (e.g., `Admin123!`)
       - Copy the generated hash
       - Paste it in the `password` field
     - `role`: Select `ADMIN` from dropdown
     - `emailVerified`: Click to set current date/time
   - Click "Save 1 change"

3. **Sign in** at `/auth/signin` with your email and password

## Method 2: Update Existing User

If you already signed up as a regular user:

1. **Open Prisma Studio:**
   ```bash
   npm run db:studio
   ```

2. **Find your user:**
   - Open `users` table
   - Find your email address

3. **Update role:**
   - Click on your user record
   - Change `role` from `STUDENT` to `ADMIN`
   - Click "Save 1 change"

4. **Sign in** at `/auth/signin` - you now have admin access!

## Method 3: Direct SQL (Advanced)

If you have direct database access:

```sql
-- Hash your password first using bcrypt (12 rounds)
-- You can use: https://bcrypt-generator.com/

INSERT INTO users (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'clx1234567890abcdef', -- Generate a unique ID
  'admin@ailesglobal.com',
  'Admin User',
  '$2a$12$YOUR_BCRYPT_HASH_HERE', -- Replace with actual hash
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

## Verify Admin Access

After creating/updating the admin user:

1. Go to: `http://localhost:3000/auth/signin`
2. Sign in with your admin credentials
3. You should be redirected to `/admin` dashboard





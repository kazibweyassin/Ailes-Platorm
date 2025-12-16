# 🔐 Admin Access Guide

## Quick Setup

To access the admin panel, you need to create an admin user account first.

### Step 1: Create Admin User

Run this command in your terminal:

```bash
npm run create-admin
```

This will create an admin user with:
- **Email**: `admin@ailesglobal.com`
- **Password**: `Admin123!`
- **Name**: `Admin User`

### Step 2: Custom Admin Account (Optional)

To create an admin with custom credentials:

```bash
npm run create-admin <email> <password> <name>
```

Example:
```bash
npm run create-admin myadmin@example.com MySecurePass123! "My Admin Name"
```

### Step 3: Sign In

1. Go to: `http://localhost:3000/auth/signin`
2. Enter your admin email and password
3. You'll be redirected to `/admin` dashboard

### Step 4: Access Admin Panel

Once signed in, you can access:
- **Admin Dashboard**: `/admin`
- **Manage Sponsors**: `/admin/sponsors`
- **Manage Scholarships**: `/admin/scholarships`
- **Manage Users**: `/admin/users`
- **Student Intakes**: `/admin/student-intakes`

## Troubleshooting

### Database Connection Error
If you see "Can't reach database server", make sure:
1. Your `.env` file has the correct `DATABASE_URL`
2. Your database server is running (if using local PostgreSQL)
3. Your connection string is correct (if using cloud database like Neon, Supabase, etc.)

**Alternative: Create Admin via Prisma Studio**
1. Run `npm run db:studio`
2. Open the `users` table
3. Click "Add record"
4. Fill in:
   - `email`: your admin email
   - `name`: admin name
   - `password`: (you'll need to hash this - see below)
   - `role`: Select `ADMIN` from dropdown
   - `emailVerified`: Set to current date/time
5. For password, you can use this online tool: https://bcrypt-generator.com/ (rounds: 12)
   Or create a user via signup first, then update their role to ADMIN

**Alternative: Update Existing User to Admin**
If you already have a user account:
1. Run `npm run db:studio`
2. Find your user in the `users` table
3. Edit the record
4. Change `role` from `STUDENT` to `ADMIN`
5. Save

### "Invalid credentials" error
- Make sure you ran `npm run create-admin` first
- Check that your database is connected
- Verify the email and password are correct

### "Forbidden: Admin access required" error
- The user account doesn't have ADMIN role
- Run `npm run create-admin` with the same email to update the role
- Or manually update the role in Prisma Studio

### Can't access `/admin` route
- Make sure you're signed in
- Check that your user has `role: "ADMIN"` in the database
- Try signing out and signing back in

## Security Notes

⚠️ **Important**: 
- Change the default password after first login
- Use a strong password in production
- Never commit admin credentials to version control
- Consider using environment variables for admin setup in production

## Database Check

To verify your admin user exists, you can:

1. Use Prisma Studio:
   ```bash
   npm run db:studio
   ```
   Then check the `users` table for a user with `role: "ADMIN"`

2. Or check directly in your database:
   ```sql
   SELECT email, role FROM users WHERE role = 'ADMIN';
   ```


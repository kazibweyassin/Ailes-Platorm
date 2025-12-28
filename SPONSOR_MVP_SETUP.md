# 🎯 Sponsor Program MVP - Setup Guide

## Overview

This MVP sponsor management system is a standalone system for managing sponsors, scholars, and their matches. Everything is manual - perfect for getting started quickly.

## 🗄️ Database Migration

First, you need to update your database schema to add the new models:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and run migration
npx prisma migrate dev --name add_scholar_and_matching
```

This will add:
- `Scholar` model - for scholar applications
- `SponsorScholar` model - for tracking sponsor-scholar matches
- Payment tracking fields to `Sponsor` model

## 📋 Features

### 1. Scholar Application Form
- **Route:** `/scholar-apply`
- Public form for scholars to apply for sponsorship
- Multi-step form with validation
- Stores all scholar information

### 2. Sponsor Management
- **Route:** `/admin/sponsors`
- View all sponsors
- Confirm payments manually
- Add payment references and notes
- Update sponsor status

### 3. Scholar Management
- **Route:** `/admin/scholars`
- View all scholar applications
- Filter by status
- View scholar details
- Match with sponsors

### 4. Matching Interface
- **Route:** `/admin/sponsors/match`
- Visual matching interface
- Shows match scores based on preferences
- One-click matching
- View available sponsors and scholars side-by-side

### 5. Reports Dashboard
- **Route:** `/admin/reports`
- Key metrics overview
- Revenue tracking
- Match rates
- Performance statistics

## 🔄 Workflow

### For Sponsors:
1. Sponsor fills out form on `/sponsor` page
2. Admin receives notification (check console logs for now)
3. Admin confirms payment in `/admin/sponsors`
4. Admin matches sponsor with scholar in `/admin/sponsors/match`
5. Match is created and both parties are notified

### For Scholars:
1. Scholar applies on `/scholar-apply` page
2. Application is stored in database
3. Admin reviews in `/admin/scholars`
4. Admin matches with confirmed sponsor
5. Scholar receives match notification

## 🎨 Pricing Model (MVP)

The current pricing tiers are:
- **Application Support:** $500
- **Full Journey:** $2,000 (Most Popular)
- **Multi-Scholar:** $5,000

You can adjust these in `app/sponsor/page.tsx` in the `sponsorshipTiers` array.

## 📧 Email Notifications

Currently, emails are logged to console. To enable real emails:
1. Set up an email service (Resend, SendGrid, etc.)
2. Update `lib/email.ts` with your email service
3. Replace console.log statements with actual email sending

## 🔐 Admin Access

Only users with `role: "ADMIN"` can access:
- `/admin/sponsors`
- `/admin/scholars`
- `/admin/sponsors/match`
- `/admin/reports`

To grant admin access, update the user's role in the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## 🚀 Quick Start

1. **Run Migration:**
   ```bash
   npx prisma migrate dev --name add_scholar_and_matching
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Access Admin Panel:**
   - Go to `/admin`
   - Sign in with admin account
   - Start managing sponsors and scholars!

## 📝 Manual Processes (MVP)

Everything is manual by design for the MVP:

- **Payment Confirmation:** Admin manually confirms when payment is received
- **Matching:** Admin manually matches sponsors with scholars
- **Status Updates:** Admin manually updates statuses
- **Communication:** Use email links to contact sponsors/scholars

## 🎯 Next Steps (Future Enhancements)

When ready to automate:
- Payment gateway integration (Stripe, PayPal)
- Automated email notifications
- Sponsor dashboard for viewing their matched scholar
- Scholar dashboard for tracking progress
- Automated matching algorithm
- Document upload and management
- Progress tracking and updates

## 📊 Database Models

### Sponsor
- Basic info (name, email, phone)
- Corporate details (if applicable)
- Sponsorship tier and amount
- Payment tracking
- Scholar preferences
- Status (PENDING, CONFIRMED, ACTIVE, COMPLETED)

### Scholar
- Personal information
- Academic background
- Test scores
- Study preferences
- Financial information
- Personal story
- Status (APPLIED, REVIEWING, MATCHED, IN_PROGRESS, etc.)

### SponsorScholar (Match)
- Links sponsor and scholar
- Match notes
- Progress tracking
- Scholarship status
- Status (MATCHED, ACTIVE, SCHOLARSHIP_SECURED, COMPLETED)

## 🐛 Troubleshooting

**Migration fails:**
- Make sure database is running
- Check DATABASE_URL in .env
- Try `npx prisma migrate reset` (WARNING: deletes data)

**Can't access admin:**
- Check user role in database
- Sign out and sign back in
- Verify session is working

**Matches not showing:**
- Ensure sponsor status is CONFIRMED or ACTIVE
- Check scholar doesn't already have assignedSponsorId
- Verify API endpoints are working

## 📞 Support

For issues or questions:
- Check console logs for errors
- Review API responses in browser network tab
- Verify database schema matches Prisma schema

---

**Built with ❤️ for AILES Global**


# ✅ Email Notification System - Setup Checklist

## 🚀 Quick Start (15 Minutes)

### Phase 1: Brevo Account (5 min)
- [ ] Go to https://www.brevo.com/
- [ ] Create free account
- [ ] Verify email
- [ ] Go to Settings → SMTP & API
- [ ] Copy SMTP credentials:
  - SMTP Host: `smtp-relay.brevo.com`
  - Port: `587`
  - Username: (your email)
  - Password: (generate in settings)

### Phase 2: Update Environment (2 min)
- [ ] Open `.env.local`
- [ ] Update these variables:
  ```env
  EMAIL_FROM="noreply@ailesglobal.com"
  SMTP_HOST="smtp-relay.brevo.com"
  SMTP_PORT="587"
  SMTP_USER="your-brevo-email@domain.com"
  SMTP_PASS="your-brevo-smtp-password"
  CRON_SECRET="your-random-key-here"
  ```

### Phase 3: Database Migration (1 min)
- [ ] Run: `npx prisma db push`
- [ ] Or if offline: `npx prisma generate`

### Phase 4: Test (5 min)
- [ ] Run: `npm run email:scheduler-test`
- [ ] Check output for "Successfully" message
- [ ] Run: `npx prisma studio`
- [ ] Check EmailQueue table (should have pending emails)

### Phase 5: Deploy (2 min)
- [ ] Push to GitHub
- [ ] Redeploy on Vercel
- [ ] Check Vercel Cron tab
- [ ] Done! ✅

---

## 📊 Expected Results

### After Setup
```
✅ Emails queue automatically 3x daily
✅ Users get deadline reminders (7, 3, 1 days)
✅ Users get match notifications
✅ Users get application reminders
✅ All emails are tracked in database
✅ Users can control preferences
```

### Test Output
```
📧 Email Scheduler - Manual Trigger

📧 Starting deadline reminder emails...
✅ Queued deadline reminder for user@email.com: Scholarship Name
📊 Deadline reminders: 5 queued

📧 Starting scholarship match emails...
✅ Queued match notification for user@email.com: Match Name
📊 Match notifications: 3 queued

✅ Email Scheduler Completed Successfully!
Total Queued: 10 emails
```

---

## 🔧 Configuration Files Changed

### New Files
- `lib/email-scheduler.ts` - Main scheduler logic
- `app/api/email/scheduler/route.ts` - Cron endpoint
- `scripts/test-email-scheduler.ts` - Manual trigger
- `EMAIL_SYSTEM_SETUP.md` - Full documentation

### Updated Files
- `.env.local` - Added Brevo config + CRON_SECRET
- `prisma/schema.prisma` - Added fields & enums
- `package.json` - Added `email:scheduler-test` script
- `vercel.json` - Added cron job schedule

---

## 📧 What Happens Now

### Daily Automatic (3x Daily)
1. **6 AM UTC** - Email scheduler runs
2. **12 PM UTC** - Email scheduler runs
3. **6 PM UTC** - Email scheduler runs

### When User Saves Scholarship
1. Scholarship saved
2. Cron job detects deadline is 7/3/1 days away
3. Email queued automatically
4. User receives reminder via Brevo

### When New Match Found
1. ScholarshipMatch created
2. Cron job detects notification not sent
3. Email queued automatically
4. User receives match notification

### Email Queue Flow
```
Email Added → Email Queue (PENDING)
    ↓
Cron Runs → Check Queue
    ↓
Nodemailer Sends via Brevo
    ↓
Email Log Created (SENT)
    ↓
Queue Status Updated
```

---

## 🆘 Troubleshooting

### Emails Not Sending
1. Check Brevo credentials in `.env.local`
2. Run `npm run email:scheduler-test` to debug
3. Check `npx prisma studio` → EmailQueue for pending

### Test Email Locally
```bash
npm run email:scheduler-test
```

### Manual Trigger
```bash
# Local
curl http://localhost:3000/api/email/scheduler

# Production
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://ailesglobal.com/api/email/scheduler
```

### View Database
```bash
npx prisma studio
# Tables to check:
# - EmailQueue (pending emails)
# - EmailLog (sent emails)
# - UserEmailPreferences (user settings)
# - ScholarshipMatch (match tracking)
```

---

## 💰 Costs

| Provider | Free Tier | Cost After | Best For |
|----------|-----------|-----------|----------|
| **Brevo** | 300/day | $20/month | Current setup ✅ |
| AWS SES | 62,000/month | $0.10/1K | High volume |
| Mailgun | 5,000/month | $35/month | Reliable |

---

## 🎯 Success Criteria

- [ ] Brevo account created and working
- [ ] `.env.local` updated with credentials
- [ ] Database migration completed
- [ ] `npm run email:scheduler-test` shows success
- [ ] EmailQueue has pending emails
- [ ] Cron job scheduled in Vercel
- [ ] Users receive test emails

---

## 📞 Next Steps After Setup

1. **Monitor Email Queue**
   - Check daily via Prisma Studio
   - Monitor bounces via Brevo dashboard

2. **Optimize Email Preferences**
   - Add UI for users to manage preferences
   - Track which emails are most opened

3. **Scale When Needed**
   - Upgrade Brevo when hitting 300/day limit
   - Add more cron jobs if needed
   - Implement queue processing service

4. **Add More Email Types**
   - Weekly newsletter
   - Motivational emails
   - Profile completion reminders
   - Consultation booking confirmations

---

## 📝 Quick Reference

### Environment Variables
```env
EMAIL_FROM="noreply@ailesglobal.com"
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="your-brevo-email@domain.com"
SMTP_PASS="your-brevo-smtp-password"
CRON_SECRET="random-key-from-openssl-rand"
```

### Commands
```bash
# Test locally
npm run email:scheduler-test

# Migrate database
npx prisma db push

# View database
npx prisma studio

# Check email logs
npx prisma studio → EmailLog
```

### Cron Schedule
```
0 6,12,18 * * *
├─ 0: minute (0)
├─ 6,12,18: hours (6 AM, 12 PM, 6 PM UTC)
├─ *: day of month (every day)
├─ *: month (every month)
└─ *: day of week (every day)
```

---

**Status:** ✅ Ready for Production  
**Last Updated:** February 3, 2026  
**Time to Setup:** ~15 minutes  
**Cost:** FREE (Brevo free tier)

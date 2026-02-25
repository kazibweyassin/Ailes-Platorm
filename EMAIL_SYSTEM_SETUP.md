# 📧 Email Notification System - AILES Global

Complete automated email notification system using **Brevo** (FREE - 300 emails/day).

## ✅ What's Implemented

### Email Types
- ✅ **Deadline Reminders** - 7 days, 3 days, 1 day before deadline
- ✅ **Match Notifications** - When new scholarships match user profile
- ✅ **Application Reminders** - For user's own applications
- ✅ **Welcome Emails** - When users sign up
- ✅ **Fully Customizable** - User preferences for all email types

### Features
- ✅ Automatic cron job scheduling (runs 3x daily)
- ✅ Email queue system (reliable delivery)
- ✅ User email preferences
- ✅ Beautiful HTML email templates
- ✅ Retry logic for failed sends
- ✅ Email tracking (sent, opened, clicked)
- ✅ SMTP configuration ready

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Brevo Account
```bash
# Go to https://www.brevo.com/
# 1. Sign up for free
# 2. Verify your email
# 3. Go to Settings → SMTP & API
# 4. Copy your SMTP credentials
```

### Step 2: Update `.env.local`
```env
# Email Configuration (Brevo)
EMAIL_FROM="noreply@ailesglobal.com"
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="your-brevo-email@domain.com"
SMTP_PASS="your-brevo-smtp-password"

# Cron Job Secret (for Vercel)
CRON_SECRET="your-secret-key-from-openssl-rand"
```

### Step 3: Run Database Migration
```bash
# Add new schema fields
npx prisma db push

# Or if offline, just generate Prisma client
npx prisma generate
```

### Step 4: Test Locally (Optional)
```bash
# Trigger email scheduler manually
npm run email:scheduler-test
```

---

## 📊 How It Works

### Automatic Scheduling
- **Email Scheduler Runs:** 3x daily (6 AM, 12 PM, 6 PM UTC)
- **Via Vercel Crons:** No additional setup needed
- **Fallback:** Manual trigger via `/api/email/scheduler`

### Email Flow

```
User saves scholarship
    ↓
ScholarshipMatch created
    ↓
Cron job runs → /api/email/scheduler
    ↓
Email Scheduler checks:
├─ Deadline reminders (7, 3, 1 days)
├─ Match notifications (new matches)
└─ Application reminders
    ↓
Emails added to queue
    ↓
Nodemailer sends via Brevo SMTP
    ↓
Email log created + tracking enabled
```

### Email Preferences Control
Users can customize:
- Deadline reminder frequency
- Match notifications on/off
- Application reminders on/off
- Weekly newsletter
- Promotional emails
- Max emails per week

---

## 📁 File Structure

```
lib/
├── email-scheduler.ts          # Main scheduler logic
├── email-service.ts            # Queue & send logic
├── email-templates.ts          # HTML templates
└── email.ts                    # Legacy email functions

app/api/
└── email/
    └── scheduler/route.ts      # Cron endpoint

scripts/
└── test-email-scheduler.ts     # Manual trigger

prisma/
└── schema.prisma               # Updated schema
    ├── ScholarshipMatch.notificationSent
    ├── UserEmailPreferences.*
    └── EmailType enum
```

---

## 🔧 Configuration

### Environment Variables Required
```env
# Email Service (Brevo)
EMAIL_FROM="noreply@ailesglobal.com"
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-password"

# Cron Security
CRON_SECRET="your-random-key"

# App URLs
NEXT_PUBLIC_API_URL="http://localhost:3000/api"  # Dev
NEXT_PUBLIC_API_URL="https://ailesglobal.com/api" # Prod
```

### Vercel Configuration
Already set in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/email/scheduler",
      "schedule": "0 6,12,18 * * *"
    }
  ]
}
```

---

## 🧪 Testing

### Manual Test (Local)
```bash
npm run email:scheduler-test
```

Output:
```
📧 Email Scheduler - Manual Trigger

Started at: 2025-02-03T10:30:00.000Z

📧 Starting deadline reminder emails...
✅ Queued deadline reminder for user@email.com: Scholarship Name
📊 Deadline reminders: 5 queued

📧 Starting scholarship match emails...
✅ Queued match notification for user@email.com: Match Name
📊 Match notifications: 3 queued

📧 Starting application reminder emails...
📊 Application reminders: 2 queued

✅ Email Scheduler Completed Successfully!

Results:
  Deadline Reminders: 5
  Match Notifications: 3
  Application Reminders: 2

  Total Queued: 10 emails

Completed at: 2025-02-03T10:31:45.000Z
```

### API Test
```bash
# Manual trigger (development)
curl http://localhost:3000/api/email/scheduler

# Production (with auth)
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://ailesglobal.com/api/email/scheduler
```

### Database Check
```bash
# View email queue
npx prisma studio
# Go to EmailQueue table

# View sent emails
# Go to EmailLog table
```

---

## 📧 Email Types

### 1. Deadline Reminder
**Sent:** 7 days, 3 days, 1 day before deadline
- Scholarship name, amount, deadline
- Direct link to apply
- Urgency color (green, orange, red)

### 2. Match Notification
**Sent:** When new matches found
- Match score percentage
- Why it's a good match
- Direct link to scholarship
- "Update profile for better matches"

### 3. Application Reminder
**Sent:** For user's own applications
- Application deadline
- Link to complete application
- Progress status

### 4. Welcome Email
**Sent:** When user signs up
- Welcome message
- Quick start guide
- Available scholarships
- Dashboard link

---

## 🔐 Security

### Rate Limiting
- Cron requests verified with `CRON_SECRET`
- Max 300 emails/day (Brevo free limit)
- Queue prevents duplicate sends
- Email log prevents spam

### Email Preferences
- Users control all email types
- Unsubscribe links in every email
- Email frequency limits
- GDPR compliant

### Data Protection
- No credentials in code
- SMTP over TLS (port 587)
- Environment variables only
- Encrypted in Vercel

---

## 📊 Monitoring

### Check Email Queue Status
```typescript
// lib/monitoring.ts
import { prisma } from "@/lib/prisma"

export async function getEmailStats() {
  const stats = await prisma.emailQueue.groupBy({
    by: ['status', 'type'],
    _count: true,
  })

  const logs = await prisma.emailLog.groupBy({
    by: ['type'],
    _count: true,
  })

  return { queued: stats, sent: logs }
}
```

### View in Dashboard
```
/admin/emails
- Pending: X
- Sent: Y
- Failed: Z
- By Type:
  - Deadline Reminders: A
  - Match Notifications: B
  - Application Reminders: C
```

---

## 🚨 Troubleshooting

### Emails Not Sending
1. **Check Brevo credentials**
   ```bash
   # Test SMTP connection
   npm run email:scheduler-test
   ```

2. **Check email queue**
   ```bash
   npx prisma studio
   # Look at EmailQueue table
   ```

3. **Check logs**
   ```bash
   # Server logs
   tail -f .next/server.log
   ```

### SMTP Connection Errors
```
Error: "Invalid login credentials"
→ Check SMTP_USER and SMTP_PASS in .env.local

Error: "Connection timeout"
→ Check firewall allows port 587

Error: "Temporary failure in name resolution"
→ Check SMTP_HOST is correct (smtp-relay.brevo.com)
```

### Low Email Rate
- Check Brevo dashboard for bounces
- Check SMTP limits (300/day free)
- Verify user email preferences enabled
- Check database for saved scholarships/applications

---

## 📈 Scaling

### Current (Free)
- 300 emails/day
- 3 cron runs (6 AM, 12 PM, 6 PM UTC)
- ~100 emails per run maximum

### When You Scale
- Upgrade to Brevo paid: $20/month (20,000 emails)
- Or switch to AWS SES: $0.10 per 1,000 emails
- Add more cron jobs (hourly instead of 3x daily)
- Implement email queue processing

---

## 💡 Best Practices

### ✅ Do
- Test emails in development first
- Monitor email queue daily
- Check bounce rates weekly
- Update CRON_SECRET regularly
- Keep Brevo account active

### ❌ Don't
- Send test emails to real addresses
- Use personal Brevo account
- Commit credentials to git
- Send emails without user opt-in
- Ignore bounce/complaint reports

---

## 🎓 Next Steps

1. **Setup Brevo Account** (5 min)
2. **Update .env.local** (2 min)
3. **Push Database Schema** (1 min)
4. **Test Locally** (5 min)
5. **Deploy to Production** (2 min)

**Total Time: ~15 minutes to production**

---

## 📞 Support

### Common Questions

**Q: Can I test emails locally?**
A: Yes! Run `npm run email:scheduler-test`. Emails log to console if SMTP not configured.

**Q: How often do reminders send?**
A: 3x daily (6 AM, 12 PM, 6 PM UTC). Adjust `vercel.json` crons for different schedule.

**Q: Can users unsubscribe?**
A: Yes! Every email has unsubscribe link. Set `unsubscribedAt` in UserEmailPreferences.

**Q: What if Brevo account hits limit?**
A: Queue waits until next day. No emails lost. Upgrade to paid plan for unlimited.

**Q: How do I see sent emails?**
A: Run `npx prisma studio` and check EmailLog table.

---

**Last Updated:** February 3, 2026  
**Status:** ✅ Production Ready  
**Free Tier:** 300 emails/day with Brevo

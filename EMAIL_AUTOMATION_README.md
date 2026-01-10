# 📧 Email Automation System

Complete email automation system for Ailes Global with queue management, scheduling, and templates.

## 📚 Overview

This system provides:
- ✅ Email queue management with retry logic
- ✅ 6+ pre-built email templates
- ✅ Automated triggers (welcome, reminders, newsletters)
- ✅ User preference management
- ✅ Email statistics and analytics
- ✅ Admin dashboard
- ✅ No external service required (uses database)

## 🏗️ Architecture

### Database Models
- **EmailTemplate**: Stores email templates with variables
- **EmailQueue**: Queue of pending emails to send
- **EmailLog**: Log of all sent emails with metrics
- **UserEmailPreferences**: Per-user email preferences

### Services
- **lib/email-service.ts**: Core email operations
- **lib/email-templates.ts**: Template definitions and rendering
- **scripts/email-scheduler.ts**: Automated triggers and scheduling

## 🚀 Quick Start

### 1. Run Database Migration
```bash
npm run db:push
```

### 2. Seed Email Templates
```bash
npm run seed:emails
```

### 3. Create Email Preferences for Existing Users (Optional)
```bash
npm run db:studio
# Then manually create UserEmailPreferences records, or add to seed script
```

### 4. Configure Email Service (Optional)
Edit `.env.local`:
```env
# Option 1: Use SMTP (Gmail, SendGrid, etc.)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
SMTP_SECURE=false

# Or leave empty to use console logging (development)
EMAIL_FROM=noreply@ailesglobal.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up Cron Job
For automatic email processing, add a cron job to run every 5 minutes:

**Vercel (vercel.json):**
```json
{
  "crons": [{
    "path": "/api/admin/emails?action=process",
    "schedule": "0 */5 * * * *"
  }]
}
```

**Node-Cron (app.ts):**
```typescript
import cron from 'node-cron';
import { runEmailScheduler } from '@/scripts/email-scheduler';

// Every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  await runEmailScheduler();
});
```

## 📧 Email Templates

### 1. **welcome-1** (Welcome)
- Sent immediately after signup
- Shows scholarship match count
- Introduces platform features

### 2. **deadline-reminder** (Deadline)
- Sent X days before deadline (configurable)
- Shows scholarship details
- Encourages application

### 3. **weekly-newsletter** (Newsletter)
- Sent once per week
- Top 3 new matches
- Engagement stats

### 4. **scholarship-match** (Triggered)
- Sent when new match found
- High match percentage
- Personalized reasons

### 5. **payment-receipt** (Transactional)
- Sent after successful payment
- Order summary
- Feature list

### 6. **promotional-50-off** (Promotional)
- 50% off first month
- Limited time offer
- Call to action

## 🔧 Usage Examples

### Send Welcome Email
```typescript
import { sendWelcomeEmailSeries } from '@/scripts/email-scheduler';

await sendWelcomeEmailSeries(userId);
```

### Send Deadline Reminders
```typescript
import { sendDeadlineReminders } from '@/scripts/email-scheduler';

// Runs automatically on schedule, or manually:
await sendDeadlineReminders();
```

### Send Weekly Newsletter
```typescript
import { sendWeeklyNewsletter } from '@/scripts/email-scheduler';

await sendWeeklyNewsletter();
```

### Send Payment Receipt
```typescript
import { sendPaymentReceiptEmail } from '@/scripts/email-scheduler';

await sendPaymentReceiptEmail(userId, paymentId);
```

### Send Promotional Email
```typescript
import { sendPromotionalEmail } from '@/scripts/email-scheduler';

const userIds = ['user1', 'user2', 'user3'];
await sendPromotionalEmail(userIds, 50, new Date('2025-02-10'));
```

## 👥 User Preferences API

### Get Preferences
```bash
GET /api/emails/preferences
```

### Update Preferences
```bash
PUT /api/emails/preferences
{
  "welcomeEmails": true,
  "deadlineReminders": true,
  "weeklyNewsletter": true,
  "scholarshipMatches": true,
  "applicationUpdates": true,
  "paymentReceipts": true,
  "promotionalEmails": false,
  "reminderDaysBeforeDeadline": 7,
  "maxEmailsPerWeek": 5
}
```

### Get Email History
```bash
GET /api/emails/history?limit=20
```

### Manage Subscriptions
```bash
POST /api/emails/manage
{
  "action": "unsubscribe",
  "reason": "Too many emails"
}
```

## 📊 Admin Dashboard

### View Email Stats
```bash
GET /api/admin/emails?action=stats&days=30
```

Response:
```json
{
  "sent": 1250,
  "failed": 5,
  "pending": 12,
  "opened": 375,
  "clicked": 125,
  "openRate": "30%",
  "clickRate": "10%"
}
```

### Process Email Queue Manually
```bash
GET /api/admin/emails?action=process
```

## 🔄 Automatic Triggers

### User Signup
```typescript
// In signup API route
import { sendWelcomeEmailSeries } from '@/scripts/email-scheduler';

await sendWelcomeEmailSeries(newUser.id);
```

### New Scholarship Match
```typescript
// In scholarship matching logic
import { sendScholarshipMatchEmail } from '@/scripts/email-scheduler';

await sendScholarshipMatchEmail(userId, matchId);
```

### Payment Completed
```typescript
// In payment webhook handler
import { sendPaymentReceiptEmail } from '@/scripts/email-scheduler';

await sendPaymentReceiptEmail(userId, paymentId);
```

## 🧪 Testing

### Send Test Email
```typescript
import { addEmailToQueue } from '@/lib/email-service';
import { renderTemplate } from '@/lib/email-templates';

const rendered = renderTemplate('welcome-1', {
  userName: 'John Doe',
  scholarshipCount: 5,
  appUrl: 'http://localhost:3000',
  userId: 'test-user-id',
});

if (rendered) {
  await addEmailToQueue({
    email: 'test@example.com',
    templateId: 'welcome-1',
    subject: rendered.subject,
    htmlContent: rendered.htmlContent,
    type: 'WELCOME',
  });
}
```

### Check Email Queue
```bash
npm run db:studio
# Navigate to email_queue table
```

## 📈 Email Metrics

### Tracked Metrics
- ✅ Sent count
- ✅ Failed count
- ✅ Pending count
- ✅ Open rate (if tracking enabled)
- ✅ Click rate (if tracking enabled)
- ✅ Bounce rate
- ✅ Complaint rate

### Accessing Metrics
```typescript
import { getEmailStats } from '@/lib/email-service';

const stats = await getEmailStats(30); // Last 30 days
console.log(stats);
```

## ⚙️ Configuration

### Email Provider Setup

#### Option 1: Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

#### Option 2: SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxx
SMTP_SECURE=false
```

#### Option 3: Resend (Recommended)
Modify `lib/email-service.ts` to use Resend SDK:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
```

#### Option 4: Development (Console Logging)
Leave SMTP variables empty to log emails to console.

## 🐛 Troubleshooting

### Emails Not Sending
1. Check `EmailQueue` table for pending emails
2. Check `EmailLog` for error messages
3. Verify SMTP credentials in `.env.local`
4. Check email scheduler is running

### User Not Receiving Emails
1. Check `UserEmailPreferences` for user
2. Verify email address in `users` table
3. Check email preferences (might be unsubscribed)
4. Look for bounce/complaint in `EmailLog`

### High Failure Rate
1. Check SMTP credentials
2. Verify sender domain is authorized
3. Check email content (spam triggers)
4. Look for rate limiting issues

## 📝 Roadmap

- [ ] Email open/click tracking
- [ ] A/B testing for subject lines
- [ ] Unsubscribe link in all emails
- [ ] List segmentation by user behavior
- [ ] Drip campaign automation
- [ ] Email template editor (admin UI)
- [ ] Bounce handling
- [ ] Complaint handling

## 🤝 Contributing

To add new email templates:
1. Add template to `lib/email-templates.ts`
2. Create trigger function in `scripts/email-scheduler.ts`
3. Update this README
4. Run `npm run seed:emails`

## 📞 Support

Questions? Check the template variables and examples in the code, or reach out!

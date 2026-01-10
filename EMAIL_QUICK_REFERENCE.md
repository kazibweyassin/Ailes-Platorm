# 📧 Email Automation - Quick Reference

## 🚀 30-Second Quickstart

```bash
# 1. Update database
npm run db:push

# 2. Seed templates
npm run seed:emails

# 3. Configure SMTP in .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# 4. Start app
npm run dev

# 5. Add code hooks (see EMAIL_INTEGRATION_GUIDE.md)
# 6. Deploy and watch revenue grow! 🎉
```

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| EMAIL_AUTOMATION_COMPLETE.md | Full overview & impact | 5 min |
| EMAIL_INTEGRATION_GUIDE.md | Step-by-step code integration | 10 min |
| EMAIL_AUTOMATION_README.md | Technical reference | 15 min |
| EMAIL_CODE_EXAMPLES.md | Copy-paste code examples | 10 min |
| EMAIL_AUTOMATION_CHECKLIST.md | Implementation checklist | 5 min |
| EMAIL_AUTOMATION_VISUAL.md | Architecture diagrams | 5 min |

**Total Time to Understand**: ~30 minutes

## 🎯 Core Functions

### Send Emails
```typescript
import { sendWelcomeEmailSeries } from '@/scripts/email-scheduler';
import { sendPaymentReceiptEmail } from '@/scripts/email-scheduler';
import { sendScholarshipMatchEmail } from '@/scripts/email-scheduler';
import { sendDeadlineReminders } from '@/scripts/email-scheduler';
import { sendWeeklyNewsletter } from '@/scripts/email-scheduler';

// Usage
await sendWelcomeEmailSeries(userId);
await sendPaymentReceiptEmail(userId, paymentId);
await sendScholarshipMatchEmail(userId, matchId);
```

### Manage Queue
```typescript
import { addEmailToQueue, processEmailQueue } from '@/lib/email-service';

// Add to queue
await addEmailToQueue({
  email: 'user@example.com',
  templateId: 'welcome-1',
  subject: 'Welcome!',
  htmlContent: '<html>...',
  type: 'WELCOME',
});

// Process queue (called by cron)
await processEmailQueue();
```

### User Preferences
```typescript
import { 
  getUserEmailPreferences,
  updateUserEmailPreferences,
  unsubscribeUser,
  resubscribeUser 
} from '@/lib/email-service';

// Get
const prefs = await getUserEmailPreferences(userId);

// Update
await updateUserEmailPreferences(userId, {
  weeklyNewsletter: false,
  reminderDaysBeforeDeadline: 14,
});

// Unsubscribe
await unsubscribeUser(userId, 'Too many emails');

// Resubscribe
await resubscribeUser(userId);
```

### Render Templates
```typescript
import { renderTemplate } from '@/lib/email-templates';

const rendered = renderTemplate('welcome-1', {
  userName: 'John',
  scholarshipCount: 5,
  appUrl: 'https://ailesglobal.com',
  userId: 'user-id',
});

// Result:
// {
//   subject: "🎓 Welcome to Ailes Global - Your Scholarship Journey...",
//   htmlContent: "<div>Hi John, you have 5 scholarships...</div>"
// }
```

## 📊 Email Types

```typescript
enum EmailType {
  WELCOME              // Sent when user signs up
  DEADLINE_REMINDER    // Before scholarship deadline
  SCHOLARSHIP_MATCH    // New matching scholarship
  WEEKLY_NEWSLETTER    // Weekly top matches
  APPLICATION_UPDATE   // Status updates
  PAYMENT_RECEIPT      // After payment
  PROMOTIONAL          // Limited-time offers
  CUSTOM               // Any custom email
}
```

## 🔧 Configuration

### Environment Variables
```env
# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
SMTP_SECURE=false

# Application
EMAIL_FROM=noreply@ailesglobal.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
CRON_SECRET=your-secret-token
```

### Database Tables
- `email_templates` - Store email templates
- `email_queue` - Pending emails
- `email_logs` - Sent emails & metrics
- `user_email_preferences` - User settings

## 📈 Expected Impact

```
500 FREE USERS
  ↓
30% open email = 150 engaged
  ↓
5% conversion = 7-8 paying
  ↓
$99/month × 7 = $693/month
  ↓
$8,316/year from email alone!
```

## 🔄 Integration Points

### User Signup
```typescript
await sendWelcomeEmailSeries(newUser.id);
```

### Payment Success
```typescript
await sendPaymentReceiptEmail(userId, paymentId);
```

### Scholarship Match
```typescript
if (matchScore > 75) {
  await sendScholarshipMatchEmail(userId, matchId);
}
```

### Cron Job
```json
{
  "crons": [{
    "path": "/api/admin/emails?action=process",
    "schedule": "0 */5 * * * *"
  }]
}
```

## ✅ Status Codes

### Email Status
- `PENDING` - Waiting to send
- `SENT` - Successfully sent
- `FAILED` - Failed (will retry)
- `BOUNCED` - Bounce received
- `COMPLAINED` - Spam complaint
- `CANCELLED` - Manually cancelled

## 📞 API Endpoints

### User Endpoints
- `GET /api/emails/preferences` - Get preferences
- `PUT /api/emails/preferences` - Update preferences
- `GET /api/emails/history` - Get email history
- `POST /api/emails/manage` - Manage subscriptions

### Admin Endpoints
- `GET /api/admin/emails?action=process` - Process queue
- `GET /api/admin/emails?action=stats` - Get stats
- `POST /api/admin/emails/send` - Send manual email

## 🧪 Testing

### Check Queue
```bash
npm run db:studio
# Browse email_queue table
```

### Send Test Email
```bash
curl -X POST http://localhost:3000/api/admin/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "templateName": "welcome-1",
    "variables": {"userName": "Test", "scholarshipCount": 5}
  }'
```

### Process Queue
```bash
curl "http://localhost:3000/api/admin/emails?action=process"
```

## 📊 Metrics to Track

### Daily
- Emails sent: ___
- Emails failed: ___
- Pending emails: ___

### Weekly
- New subscribers: ___
- Unsubscribes: ___
- Open rate: ___
- Click rate: ___

### Monthly
- Total subscribers: ___
- MRR from emails: ___
- Conversion rate: ___

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails not queued | Check user has email_preferences |
| Emails not sending | Check SMTP credentials |
| High failure rate | Verify domain is authorized |
| Users not receiving | Check email address |
| Cron not running | Enable in Vercel dashboard |

## 📋 Checklist

- [ ] Database migrated (`npm run db:push`)
- [ ] Templates seeded (`npm run seed:emails`)
- [ ] SMTP configured in `.env.local`
- [ ] Welcome email added to signup
- [ ] Receipt email added to payment
- [ ] Match email added to matching
- [ ] Cron job enabled
- [ ] Tested locally
- [ ] Deployed to production
- [ ] Monitoring metrics

## 🎓 Learning Path

1. **Read** EMAIL_AUTOMATION_COMPLETE.md (5 min)
2. **Understand** EMAIL_AUTOMATION_VISUAL.md (5 min)
3. **Copy** EMAIL_CODE_EXAMPLES.md (5 min)
4. **Integrate** EMAIL_INTEGRATION_GUIDE.md (15 min)
5. **Deploy** and test
6. **Monitor** metrics
7. **Optimize** based on data

## 🎉 Revenue Formula

```
Users × Engagement × Conversion × Price = Revenue

500 × 30% × 5% × $99 = $742/month
1000 × 30% × 5% × $99 = $1,485/month
5000 × 30% × 5% × $99 = $7,425/month
```

## 🚀 Next Steps

1. Read EMAIL_AUTOMATION_COMPLETE.md
2. Follow EMAIL_INTEGRATION_GUIDE.md
3. Copy code from EMAIL_CODE_EXAMPLES.md
4. Deploy and test
5. Monitor metrics
6. Optimize templates
7. Scale to more users

---

**Time to Implementation**: 2-3 hours
**Expected Revenue**: $700-1,500/month (within 30 days)
**Maintenance**: 1-2 hours/week

🎉 **Let's make money!**

Questions? Check the documentation files or look at the code.

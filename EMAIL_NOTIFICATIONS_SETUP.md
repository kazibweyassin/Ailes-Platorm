# Email Notification System Setup

## Overview
Email notifications keep students informed about:
- 🎓 New scholarship matches
- ⏰ Application deadlines (7, 3, 1 day reminders)
- 📧 Application status updates
- 📬 Weekly scholarship digests

## Setup Instructions

### 1. Get Resend API Key (Free)
1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email
3. Get your API key from the dashboard
4. Add to `.env.local`:
```env
RESEND_API_KEY="re_your_api_key_here"
```

### 2. Verify Your Domain (Production)
For testing, Resend allows sending to your own email. For production:
1. Add your domain in Resend dashboard
2. Add DNS records they provide
3. Update `from` address in `lib/email-service.ts`:
```typescript
from: 'Ailes Global <scholarships@yourdomain.com>'
```

For testing, use: `from: 'onboarding@resend.dev'`

### 3. Test Email Sending

#### Manual Test (Send to yourself):
```typescript
// In any API route or script
import { sendScholarshipAlert } from '@/lib/email-service';

await sendScholarshipAlert({
  to: 'your-email@example.com',
  userName: 'Test User',
  scholarships: [{
    name: 'Test Scholarship',
    provider: 'Test University',
    amount: 5000,
    currency: 'USD',
    deadline: new Date().toISOString(),
    url: 'https://example.com'
  }]
});
```

#### Test via API:
```bash
# Send alerts to specific user
curl -X POST http://localhost:3000/api/notifications/send-alerts \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_id_here"}'

# Send deadline reminders
curl -X POST http://localhost:3000/api/notifications/deadline-reminders
```

## Notification Types

### 1. New Scholarship Alerts
**Trigger**: When new scholarships match user profile
**File**: `lib/email-service.ts` → `sendScholarshipAlert()`
**Includes**: 
- Scholarship name, provider, amount
- Deadline with urgency indicator
- Direct link to apply

### 2. Deadline Reminders
**Trigger**: 7, 3, and 1 day before deadline
**File**: `lib/email-service.ts` → `sendDeadlineReminder()`
**Includes**:
- Countdown timer
- Urgency level (color-coded)
- Application checklist
- Direct link to complete

### 3. Status Updates
**Trigger**: When application status changes
**File**: `lib/email-service.ts` → `sendApplicationStatusUpdate()`
**Statuses**:
- SUBMITTED - Confirmation email
- UNDER_REVIEW - Progress update
- ACCEPTED - Celebration email 🎉
- REJECTED - Encouragement + next steps

### 4. Weekly Digest
**Trigger**: Every Monday (via cron)
**File**: `lib/email-service.ts` → `sendWeeklyDigest()`
**Includes**:
- Top 10 new scholarships
- Summary statistics
- Link to view all

## Automation Setup

### Option 1: Vercel Cron Jobs (Recommended)

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/notifications/send-alerts",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/notifications/deadline-reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Option 2: GitHub Actions

Create `.github/workflows/notifications.yml`:
```yaml
name: Send Notifications
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Alerts
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/notifications/send-alerts
```

### Option 3: Manual Triggers
Add button in admin dashboard:
```typescript
<button onClick={async () => {
  await fetch('/api/notifications/send-alerts', { method: 'POST' });
}}>
  Send Alerts Now
</button>
```

## Email Templates

All emails are responsive HTML with:
- ✅ Mobile-friendly design
- ✅ Professional styling
- ✅ Clear call-to-action buttons
- ✅ Unsubscribe links
- ✅ Brand colors (purple gradient)

### Customize Templates
Edit `lib/email-service.ts` to:
- Change colors (update `background`, `color` styles)
- Modify content (update HTML strings)
- Add/remove sections
- Include images/logos

## User Preferences

### Add Email Preferences to User Model

Update `prisma/schema.model`:
```prisma
model User {
  // ... existing fields
  emailPreferences Json? @default("{\"scholarshipAlerts\": true, \"deadlineReminders\": true, \"statusUpdates\": true, \"weeklyDigest\": true}")
}
```

### Create Settings Page

```typescript
// app/dashboard/settings/page.tsx
const [prefs, setPrefs] = useState({
  scholarshipAlerts: true,
  deadlineReminders: true,
  statusUpdates: true,
  weeklyDigest: true
});

// Save preferences to database
await fetch('/api/user/preferences', {
  method: 'POST',
  body: JSON.stringify({ emailPreferences: prefs })
});
```

## Monitoring & Analytics

### Track Email Metrics
Resend provides dashboard with:
- Delivery rate
- Open rate
- Click rate
- Bounce rate

### Add Event Tracking
```typescript
// In email-service.ts
console.log('✅ Email sent:', {
  type: 'scholarship_alert',
  recipient: to,
  scholarshipCount: scholarships.length,
  timestamp: new Date()
});
```

## Testing Checklist

- [ ] Resend API key added to `.env.local`
- [ ] Test email sent successfully
- [ ] All email types render correctly
- [ ] Links work and point to correct pages
- [ ] Mobile responsive (test on phone)
- [ ] Unsubscribe link functional
- [ ] Cron jobs scheduled (production)
- [ ] User preferences working
- [ ] Monitoring setup in Resend dashboard

## Rate Limits

**Resend Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Good for MVP and initial users

**To Scale:**
- Upgrade to paid plan ($20/month = 50k emails)
- Add rate limiting in code
- Batch emails (send in groups)
- Use queues (BullMQ, Redis)

## Troubleshooting

### "Email service not configured"
- Check `RESEND_API_KEY` in `.env.local`
- Restart dev server after adding key

### Emails not sending
- Check Resend dashboard for errors
- Verify API key is correct
- Check recipient email is valid
- Look for console errors

### Domain not verified
- Use `onboarding@resend.dev` for testing
- Complete DNS verification for production

### Rate limit exceeded
- Reduce sending frequency
- Add delays between emails (shown in code)
- Upgrade Resend plan

## Next Steps

1. **Add to Application Flow:**
```typescript
// When user applies
await sendApplicationStatusUpdate({
  to: user.email,
  userName: user.name,
  scholarshipName: scholarship.name,
  status: 'SUBMITTED'
});
```

2. **Set Up Cron Jobs:** Add `vercel.json` to repository

3. **Create Admin Dashboard:** Monitor email sending, view stats

4. **Add User Preferences:** Let users control email frequency

5. **Implement Webhooks:** Handle bounces, unsubscribes automatically

## Cost Estimation

- 100 users × 2 emails/week = 800 emails/month ✅ Free
- 1,000 users × 2 emails/week = 8,000 emails/month → $20/month
- 10,000 users × 2 emails/week = 80,000 emails/month → $80/month

Start free, scale as you grow! 🚀

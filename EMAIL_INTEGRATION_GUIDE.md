# Integration Guide - Email Automation

This guide shows exactly where to add email automation to your existing code.

## 1. Welcome Email on Signup

### Location: `app/api/auth/signup/route.ts`

Add after user creation:

```typescript
// At the top of file
import { sendWelcomeEmailSeries } from '@/scripts/email-scheduler';
import { prisma } from '@/lib/prisma';

// ... existing code ...

// After user is created, add this:
const newUser = await prisma.user.create({
  data: {
    email,
    name,
    password: hashedPassword,
  },
});

// Create email preferences for new user
await prisma.userEmailPreferences.create({
  data: {
    userId: newUser.id,
    welcomeEmails: true,
    deadlineReminders: true,
    weeklyNewsletter: true,
    scholarshipMatches: true,
    applicationUpdates: true,
    paymentReceipts: true,
    promotionalEmails: false,
  },
});

// Send welcome email
await sendWelcomeEmailSeries(newUser.id);
```

## 2. Payment Receipt Email

### Location: `app/api/payments/pesapal/callback/route.ts`

Add after payment status is updated to COMPLETED:

```typescript
// At the top
import { sendPaymentReceiptEmail } from '@/scripts/email-scheduler';

// ... existing code ...

// After updating payment status to COMPLETED:
if (paymentStatus === 'COMPLETED') {
  // Update subscription
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'ACTIVE',
      subscriptionTier: planToTier[payment.planId],
      subscriptionExpiresAt: getExpiryDate(payment.planId),
    },
  });

  // Send receipt email
  await sendPaymentReceiptEmail(userId, payment.id);
}
```

## 3. Scholarship Match Email

### Location: `app/api/scholarships/match/route.ts`

Add when new matches are found:

```typescript
// At the top
import { sendScholarshipMatchEmail } from '@/scripts/email-scheduler';

// ... existing code ...

// After creating new ScholarshipMatch:
const match = await prisma.scholarshipMatch.create({
  data: {
    userId,
    scholarshipId,
    matchScore,
    matchReasons,
    missingRequirements,
  },
});

// Send notification email
if (match.matchScore > 75) { // Only for high-match scholarships
  await sendScholarshipMatchEmail(userId, match.id);
}
```

## 4. Set Up Cron Job for Automated Scheduling

### Option A: Vercel Crons

Create/update `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/admin/emails?action=process",
      "schedule": "0 */5 * * * *"
    },
    {
      "path": "/api/scheduled/deadline-reminders",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/scheduled/weekly-newsletter",
      "schedule": "0 9 * * 4"
    }
  ]
}
```

### Option B: Node-Cron (Self-hosted)

Create `lib/cron.ts`:

```typescript
import cron from 'node-cron';
import {
  runEmailScheduler,
  sendDeadlineReminders,
  sendWeeklyNewsletter,
} from '@/scripts/email-scheduler';

export function initializeCrons() {
  // Process email queue every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Processing email queue...');
    await runEmailScheduler();
  });

  // Send deadline reminders daily at 8am
  cron.schedule('0 8 * * *', async () => {
    console.log('Sending deadline reminders...');
    await sendDeadlineReminders();
  });

  // Send weekly newsletter every Thursday at 9am
  cron.schedule('0 9 * * 4', async () => {
    console.log('Sending weekly newsletter...');
    await sendWeeklyNewsletter();
  });

  console.log('✅ Email crons initialized');
}
```

Then in `app/layout.tsx` or `middleware.ts`:

```typescript
import { initializeCrons } from '@/lib/cron';

// Call once at startup
initializeCrons();
```

## 5. Create Scheduled Route Handlers

### Create `app/api/scheduled/deadline-reminders/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendDeadlineReminders } from '@/scripts/email-scheduler';

export async function GET(req: NextRequest) {
  // Verify cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sendDeadlineReminders();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Create `app/api/scheduled/weekly-newsletter/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendWeeklyNewsletter } from '@/scripts/email-scheduler';

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sendWeeklyNewsletter();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

## 6. Add Email Preferences UI (Optional)

Create `app/email-preferences/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmailPreferencesPage() {
  const [prefs, setPrefs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  async function fetchPreferences() {
    try {
      const res = await fetch('/api/emails/preferences');
      const data = await res.json();
      setPrefs(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updatePreference(key: string, value: boolean) {
    try {
      await fetch('/api/emails/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });

      setPrefs({ ...prefs, [key]: value });
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>📧 Email Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ['welcomeEmails', 'Welcome Emails'],
            ['deadlineReminders', 'Deadline Reminders'],
            ['weeklyNewsletter', 'Weekly Newsletter'],
            ['scholarshipMatches', 'New Scholarship Matches'],
            ['applicationUpdates', 'Application Updates'],
            ['paymentReceipts', 'Payment Receipts'],
            ['promotionalEmails', 'Promotional Offers'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <label>{label}</label>
              <input
                type="checkbox"
                checked={prefs[key] || false}
                onChange={(e) => updatePreference(key, e.target.checked)}
              />
            </div>
          ))}

          <div className="pt-4">
            <Button
              variant="destructive"
              onClick={() => {
                fetch('/api/emails/manage', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'unsubscribe' }),
                });
              }}
            >
              Unsubscribe from All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 7. Environment Variables

Add to `.env.local`:

```env
# Email Configuration
EMAIL_FROM=noreply@ailesglobal.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SMTP Configuration (choose one)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# For security
CRON_SECRET=your-secret-cron-token-here
```

## 8. Database Migration

Run in order:

```bash
# 1. Update schema
npm run db:push

# 2. Seed email templates
npm run seed:emails

# 3. Create preferences for existing users (optional)
# npm run db:studio
# Then manually create records for each user, or add to seed script
```

## Testing

### Test Welcome Email

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password",
    "name": "Test User"
  }'
```

Check `email_queue` table for pending email.

### Test Manual Send

```bash
curl "http://localhost:3000/api/admin/emails?action=process"
```

### Test Stats

```bash
curl "http://localhost:3000/api/admin/emails?action=stats&days=30"
```

## Monitoring

### Check Email Queue

```bash
npm run db:studio
# Browse email_queue table
```

### Check Sent Emails

```bash
npm run db:studio
# Browse email_logs table
```

### Check User Preferences

```bash
npm run db:studio
# Browse user_email_preferences table
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not in queue | Check if user has email preferences created |
| Emails not sending | Check SMTP config in .env.local |
| Cron not running | Check Vercel crons or cron daemon |
| High failure rate | Check email content, verify SMTP credentials |

## Next Steps

1. ✅ Add code to signup route
2. ✅ Add code to payment callback
3. ✅ Add code to scholarship match
4. ✅ Set up cron job
5. ✅ Configure SMTP
6. ✅ Test locally
7. ✅ Deploy to production
8. ✅ Monitor metrics

---

**Estimated Integration Time**: 2-3 hours
**Expected Result**: Automated emails sending to users!

You're ready to start generating revenue! 🚀

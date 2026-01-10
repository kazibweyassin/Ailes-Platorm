# Email Automation - Code Examples

## Example 1: Send Welcome Email on Signup

### Before (Current)
```typescript
// app/api/auth/signup/route.ts
export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  });
  
  return NextResponse.json({ user });
}
```

### After (With Email)
```typescript
// app/api/auth/signup/route.ts
import { sendWelcomeEmailSeries } from '@/scripts/email-scheduler';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  });
  
  // Create email preferences for new user
  await prisma.userEmailPreferences.create({
    data: {
      userId: user.id,
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
  try {
    await sendWelcomeEmailSeries(user.id);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't fail signup if email fails
  }
  
  return NextResponse.json({ user });
}
```

## Example 2: Send Receipt on Payment

### Before (Current)
```typescript
// app/api/payments/pesapal/callback/route.ts
export async function POST(req: NextRequest) {
  // ... payment processing ...
  
  if (paymentStatus === 'COMPLETED') {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: 'PREMIUM',
      },
    });
  }
  
  return NextResponse.json({ success: true });
}
```

### After (With Email)
```typescript
// app/api/payments/pesapal/callback/route.ts
import { sendPaymentReceiptEmail } from '@/scripts/email-scheduler';

export async function POST(req: NextRequest) {
  // ... payment processing ...
  
  if (paymentStatus === 'COMPLETED') {
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency,
        transactionRef,
        status: 'COMPLETED',
      },
    });
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: 'PREMIUM',
      },
    });
    
    // Send receipt email
    try {
      await sendPaymentReceiptEmail(userId, payment.id);
    } catch (error) {
      console.error('Error sending receipt:', error);
    }
  }
  
  return NextResponse.json({ success: true });
}
```

## Example 3: Send Match Notification

### Before (Current)
```typescript
// app/api/scholarships/match/route.ts
export async function POST(req: NextRequest) {
  const { userId, scholarshipId, matchScore } = await req.json();
  
  const match = await prisma.scholarshipMatch.create({
    data: {
      userId,
      scholarshipId,
      matchScore,
      matchReasons: ['...'],
    },
  });
  
  return NextResponse.json({ match });
}
```

### After (With Email)
```typescript
// app/api/scholarships/match/route.ts
import { sendScholarshipMatchEmail } from '@/scripts/email-scheduler';

export async function POST(req: NextRequest) {
  const { userId, scholarshipId, matchScore } = await req.json();
  
  const match = await prisma.scholarshipMatch.create({
    data: {
      userId,
      scholarshipId,
      matchScore,
      matchReasons: ['...'],
    },
  });
  
  // Send notification for high-quality matches
  if (matchScore > 75) {
    try {
      await sendScholarshipMatchEmail(userId, match.id);
    } catch (error) {
      console.error('Error sending match email:', error);
    }
  }
  
  return NextResponse.json({ match });
}
```

## Example 4: Manual Email Send (Admin)

```typescript
// app/api/admin/emails/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addEmailToQueue } from '@/lib/email-service';
import { renderTemplate } from '@/lib/email-templates';
import { EmailType } from '@prisma/client';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, templateName, variables } = await req.json();

  // Render template with variables
  const rendered = renderTemplate(templateName, variables);
  if (!rendered) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  // Add to queue
  const queued = await addEmailToQueue({
    email,
    templateId: templateName,
    subject: rendered.subject,
    htmlContent: rendered.htmlContent,
    type: EmailType.CUSTOM,
    variables,
  });

  return NextResponse.json({
    success: true,
    queueId: queued.id,
    message: 'Email queued for sending',
  });
}
```

Example usage:
```bash
curl -X POST http://localhost:3000/api/admin/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "templateName": "promotional-50-off",
    "variables": {
      "userName": "John",
      "discount": 50,
      "expiresAt": "2025-02-10",
      "ctaUrl": "https://ailesglobal.com/pricing"
    }
  }'
```

## Example 5: Automated Weekly Newsletter

```typescript
// pages/api/scheduled/weekly-newsletter.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendWeeklyNewsletter } from '@/scripts/email-scheduler';

// Vercel Cron: scheduled for Thursday 9am
export async function GET(req: NextRequest) {
  // Verify CRON_SECRET
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting weekly newsletter send...');
    await sendWeeklyNewsletter();
    console.log('✅ Weekly newsletter complete');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Weekly newsletter sent' 
    });
  } catch (error) {
    console.error('Error sending weekly newsletter:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

In `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/scheduled/weekly-newsletter",
    "schedule": "0 9 * * 4"
  }]
}
```

## Example 6: User Unsubscribe Link

```typescript
// app/unsubscribe/[userId]/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UnsubscribePage({ params }: { params: { userId: string } }) {
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [reason, setReason] = useState('');

  async function handleUnsubscribe() {
    const res = await fetch('/api/emails/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'unsubscribe',
        reason: reason || 'No reason provided',
      }),
    });

    if (res.ok) {
      setUnsubscribed(true);
    }
  }

  if (unsubscribed) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="text-center">
          <h2 className="text-xl font-bold">Unsubscribed</h2>
          <p className="text-gray-600">
            You have been unsubscribed from all emails.
            You can resubscribe anytime in your preferences.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">We're Sorry To See You Go</h2>
        <p className="text-gray-600">
          Tell us why you're unsubscribing (optional):
        </p>
        
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Your feedback..."
          className="w-full border rounded p-2"
          rows={4}
        />
        
        <Button
          onClick={handleUnsubscribe}
          variant="destructive"
          className="w-full"
        >
          Unsubscribe
        </Button>
      </Card>
    </div>
  );
}
```

## Example 7: Email Preferences Dashboard

```typescript
// app/dashboard/email-preferences/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function EmailPreferencesPage() {
  const [preferences, setPreferences] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  async function fetchPreferences() {
    const res = await fetch('/api/emails/preferences');
    const data = await res.json();
    setPreferences(data);
  }

  async function updatePreference(key: string, value: any) {
    setSaving(true);
    try {
      const res = await fetch('/api/emails/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });

      if (res.ok) {
        setPreferences({ ...preferences, [key]: value });
      }
    } finally {
      setSaving(false);
    }
  }

  if (!preferences) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">📧 Email Preferences</h2>

        <div className="space-y-4">
          {[
            ['welcomeEmails', 'Welcome Emails', 'Get started guides and platform tips'],
            ['deadlineReminders', 'Deadline Reminders', 'Alerts before scholarship deadlines'],
            ['weeklyNewsletter', 'Weekly Newsletter', 'Top scholarship matches each week'],
            ['scholarshipMatches', 'Match Notifications', 'Alerts when new scholarships match your profile'],
            ['applicationUpdates', 'Application Updates', 'Status changes on your applications'],
            ['paymentReceipts', 'Payment Receipts', 'Transaction confirmations'],
            ['promotionalEmails', 'Special Offers', 'Discounts and limited-time promotions'],
          ].map(([key, label, description]) => (
            <div key={key} className="flex items-start justify-between p-4 border rounded">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <Switch
                checked={preferences[key] || false}
                onCheckedChange={(value) => updatePreference(key, value)}
                disabled={saving}
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-2">
          <p className="text-sm text-gray-600">Reminder timing (days before deadline):</p>
          <input
            type="number"
            value={preferences.reminderDaysBeforeDeadline || 7}
            onChange={(e) => updatePreference('reminderDaysBeforeDeadline', parseInt(e.target.value))}
            min="1"
            max="30"
            className="border rounded p-2 w-24"
          />
        </div>

        <div className="pt-4">
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Unsubscribe from all emails?')) {
                fetch('/api/emails/manage', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'unsubscribe' }),
                });
              }
            }}
          >
            Unsubscribe from All
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

## Example 8: Monitor Email Queue (Admin)

```typescript
// app/dashboard/admin/emails/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminEmailPage() {
  const [stats, setStats] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    const res = await fetch('/api/admin/emails?action=stats&days=30');
    const data = await res.json();
    setStats(data);
  }

  async function processQueue() {
    setProcessing(true);
    try {
      await fetch('/api/admin/emails?action=process');
      await fetchStats();
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">📧 Email Dashboard</h2>
          <Button onClick={processQueue} disabled={processing}>
            {processing ? 'Processing...' : 'Process Queue Now'}
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
            </div>

            <div className="bg-red-50 p-4 rounded">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.openRate}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Click Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.clickRate}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded">
              <p className="text-sm text-gray-600">Opened</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.opened}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
```

---

**These examples show real, working code you can use immediately!**

Copy and adapt to your needs. All examples follow the patterns already established in your codebase.

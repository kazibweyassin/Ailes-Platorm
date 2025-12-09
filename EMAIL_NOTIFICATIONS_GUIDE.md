# 📧 Email Notifications Implementation Guide

## How Email Notifications Work

### Overview
Email notifications automatically send emails to users based on triggers:
1. **Deadline Reminders** - Alert users X days before scholarship deadlines
2. **New Match Alerts** - Notify when new scholarships match their profile
3. **Application Updates** - Status changes on applications
4. **Welcome Emails** - When users sign up

---

## 🛠️ Technical Implementation

### Step 1: Choose Email Service

**Recommended: Resend** (Best for Next.js)
- Free tier: 3,000 emails/month
- Easy API integration
- Great deliverability
- Built for developers

**Alternative: SendGrid**
- Free tier: 100 emails/day
- More features, slightly more complex

### Step 2: Install Resend

```bash
npm install resend
```

### Step 3: Set Up Environment Variables

Add to `.env`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@ailesglobal.com
```

---

## 📋 Implementation: Deadline Reminders

### How It Works:

1. **Cron Job / Scheduled Task** runs daily
2. **Checks database** for scholarships with deadlines in:
   - 7 days
   - 3 days  
   - 1 day
3. **Finds users** who:
   - Saved that scholarship, OR
   - Applied to that scholarship, OR
   - Have it in their matches
4. **Sends email** with:
   - Scholarship name
   - Deadline date
   - Days remaining
   - Direct link to apply

### Code Structure:

```
app/api/cron/notifications/route.ts  (API route for cron)
lib/email-templates.ts              (Email HTML templates)
lib/notifications.ts                 (Notification logic)
```

### Example Flow:

```
Daily Cron Job (9 AM)
  ↓
Check all scholarships with deadlines in next 7 days
  ↓
For each scholarship:
  - Find users who saved it
  - Find users who applied
  - Find users with high match scores
  ↓
For each user:
  - Check if already notified (avoid spam)
  - Send reminder email
  - Mark as notified
```

---

## 📋 Implementation: New Match Alerts

### How It Works:

1. **User runs AI matching** (`/api/scholarships/match`)
2. **System finds new matches** (not previously matched)
3. **Sends email** with:
   - New scholarship matches
   - Match scores
   - Why they match
   - Links to view details

### When to Send:

- **Option A:** Immediately after matching (real-time)
- **Option B:** Daily digest of new matches
- **Option C:** Weekly summary

**Recommended:** Option B (daily digest) - less spammy

---

## 🔧 Implementation Steps

### 1. Update Email Utility (`lib/email.ts`)

Replace console.log with actual Resend calls:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDeadlineReminder(data: {
  email: string;
  name: string;
  scholarshipName: string;
  deadline: Date;
  daysLeft: number;
  scholarshipLink: string;
}) {
  const emailContent = `
    <h1>⏰ Scholarship Deadline Approaching!</h1>
    <p>Hi ${data.name},</p>
    <p>The deadline for <strong>${data.scholarshipName}</strong> is in ${data.daysLeft} days!</p>
    <a href="${data.scholarshipLink}">View Scholarship & Apply</a>
  `;

  await resend.emails.send({
    from: 'AILES Global <noreply@ailesglobal.com>',
    to: data.email,
    subject: `⏰ ${data.daysLeft} days left: ${data.scholarshipName}`,
    html: emailContent,
  });
}
```

### 2. Create Notification Service (`lib/notifications.ts`)

```typescript
// Check and send deadline reminders
export async function checkAndSendDeadlineReminders() {
  // Get scholarships with deadlines in next 7 days
  const scholarships = await prisma.scholarship.findMany({
    where: {
      deadline: {
        gte: new Date(),
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    }
  });

  for (const scholarship of scholarships) {
    const daysLeft = Math.ceil(
      (scholarship.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    // Only send on specific days (7, 3, 1)
    if (![7, 3, 1].includes(daysLeft)) continue;

    // Find users who saved this scholarship
    const savedUsers = await prisma.savedScholarship.findMany({
      where: { scholarshipId: scholarship.id },
      include: { user: true }
    });

    // Send to each user
    for (const saved of savedUsers) {
      await sendDeadlineReminder({
        email: saved.user.email,
        name: saved.user.name || 'Student',
        scholarshipName: scholarship.name,
        deadline: scholarship.deadline,
        daysLeft,
        scholarshipLink: `https://ailes-platform.vercel.app/scholarships/${scholarship.id}`
      });
    }
  }
}
```

### 3. Create Cron Job Endpoint (`app/api/cron/notifications/route.ts`)

```typescript
import { NextResponse } from "next/server";
import { checkAndSendDeadlineReminders } from "@/lib/notifications";

// This runs daily via Vercel Cron or external service
export async function GET(req: Request) {
  // Verify it's from cron service (security)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await checkAndSendDeadlineReminders();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
```

### 4. Set Up Vercel Cron (or External Service)

**Option A: Vercel Cron** (if deployed on Vercel)
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/notifications",
    "schedule": "0 9 * * *"
  }]
}
```

**Option B: External Cron Service**
- Use services like:
  - cron-job.org (free)
  - EasyCron
  - GitHub Actions (free)
- Set to call: `https://your-domain.com/api/cron/notifications`
- Schedule: Daily at 9 AM

---

## 📊 Notification Types

### 1. Deadline Reminders
**When:** 7 days, 3 days, 1 day before deadline
**To:** Users who saved/applied to that scholarship
**Content:**
- Scholarship name
- Days remaining
- Deadline date
- Apply link
- Quick action buttons

### 2. New Match Alerts
**When:** Daily digest or immediately after matching
**To:** Users with new scholarship matches
**Content:**
- List of new matches
- Match scores
- Why they match
- View details links

### 3. Application Status Updates
**When:** Application status changes
**To:** Applicant
**Content:**
- Application status
- Next steps
- Timeline updates

### 4. Welcome Email
**When:** User signs up
**To:** New user
**Content:**
- Welcome message
- Getting started guide
- Link to find scholarships

---

## 💰 Cost Estimate

**Resend Free Tier:**
- 3,000 emails/month free
- $0.20 per 1,000 after that

**Example:**
- 100 users
- 2 reminders per week per user
- = 800 emails/month
- **Cost: $0** (within free tier)

---

## 🚀 Quick Start (30 minutes)

1. **Sign up for Resend** (5 min)
   - Go to resend.com
   - Create account
   - Get API key

2. **Install package** (1 min)
   ```bash
   npm install resend
   ```

3. **Update email.ts** (10 min)
   - Replace console.log with Resend calls
   - Add email templates

4. **Create notification service** (10 min)
   - Add deadline checking logic
   - Add match alert logic

5. **Set up cron job** (5 min)
   - Create API route
   - Configure Vercel cron or external service

6. **Test** (5 min)
   - Send test email
   - Verify it works

---

## 📝 Email Template Examples

### Deadline Reminder Template:
```html
Subject: ⏰ 7 days left: [Scholarship Name]

Hi [Name],

Don't miss out! The deadline for [Scholarship Name] is approaching.

📅 Deadline: [Date]
⏰ Days Remaining: 7 days
💰 Amount: $[Amount]

[View Scholarship & Apply] button

Best of luck!
AILES Global Team
```

### New Match Alert Template:
```html
Subject: 🎯 New Scholarships Match Your Profile!

Hi [Name],

We found 3 new scholarships that match your profile!

1. [Scholarship 1] - 95% match
2. [Scholarship 2] - 88% match  
3. [Scholarship 3] - 82% match

[View All Matches] button

Happy applying!
AILES Global Team
```

---

## ✅ Benefits

1. **Increases Engagement** - Users return to check deadlines
2. **Reduces Missed Deadlines** - Proactive reminders
3. **Improves User Experience** - Users feel supported
4. **Increases Applications** - More users apply on time
5. **Builds Trust** - Shows you care about their success

---

## 🎯 Next Steps

1. Set up Resend account
2. Install package
3. Implement email functions
4. Create notification service
5. Set up cron job
6. Test with real users

**Estimated Time:** 4-6 hours for full implementation


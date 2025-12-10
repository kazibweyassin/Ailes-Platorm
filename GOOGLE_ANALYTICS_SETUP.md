# 📊 Google Analytics Setup Guide

## ✅ Google Analytics Added

Your Google Analytics tracking code has been added to the site:
- **Tracking ID:** `G-WR4CWD120W`
- **Location:** `components/google-analytics.tsx`
- **Implementation:** Next.js Script component (optimized)

---

## 🔧 How It Works

### Component: `components/google-analytics.tsx`
- Uses Next.js `Script` component for optimal performance
- Loads asynchronously after page becomes interactive
- Tracks page views automatically
- Environment variable support for easy updates

### Integration: `app/layout.tsx`
- Added to root layout (tracks all pages)
- Loads on every page automatically
- No performance impact (async loading)

---

## 📝 Environment Variable (Optional)

Add this to your `.env` file if you want to manage it via environment variables:

```env
NEXT_PUBLIC_GA_ID=G-WR4CWD120W
```

**Why?** Makes it easier to:
- Use different IDs for dev/prod
- Update without code changes
- Keep sensitive configs out of code

**Note:** The component defaults to `G-WR4CWD120W` if the env variable isn't set, so it works either way.

---

## ✅ What's Tracked Automatically

### Page Views
- ✅ All page navigations
- ✅ Route changes
- ✅ Page paths

### Events (Can Add Later)
- Button clicks
- Form submissions
- Scholarship searches
- Application starts
- User signups

---

## 🚀 Next Steps

### 1. Deploy Your Site
- Push changes to production
- Make sure site is live

### 2. Verify in Google Analytics
1. Go to https://analytics.google.com
2. Select your property
3. Go to "Realtime" → "Overview"
4. Visit your site
5. You should see yourself as an active user!

### 3. Set Up Goals (Recommended)
1. Go to "Admin" → "Goals"
2. Create goals for:
   - Scholarship searches
   - Application starts
   - User signups
   - Email subscriptions

### 4. Set Up Custom Events (Optional)
Track specific actions:
- Scholarship clicks
- Form submissions
- Button clicks
- Video plays

---

## 📊 What You Can Track

### User Behavior
- Page views
- Time on site
- Bounce rate
- User flow
- Device types
- Geographic location

### Conversions
- Scholarship searches
- Applications started
- Signups
- Email subscriptions
- Contact form submissions

### Traffic Sources
- Organic search
- Social media
- Direct traffic
- Referrals
- Paid ads

---

## 🎯 Recommended Goals to Set Up

### 1. Scholarship Search
- **Goal:** User searches for scholarships
- **Type:** Event
- **Action:** `search_scholarships`

### 2. Application Start
- **Goal:** User starts scholarship application
- **Type:** Event
- **Action:** `start_application`

### 3. User Signup
- **Goal:** New user registration
- **Type:** Event
- **Action:** `user_signup`

### 4. Email Subscription
- **Goal:** Newsletter signup
- **Type:** Event
- **Action:** `newsletter_subscribe`

---

## 💡 Adding Custom Events

### Example: Track Scholarship Click

```typescript
// In your component
import { gtag } from '@/lib/gtag';

const handleScholarshipClick = (scholarshipId: string) => {
  gtag('event', 'click_scholarship', {
    scholarship_id: scholarshipId,
  });
};
```

### Example: Track Form Submission

```typescript
const handleFormSubmit = () => {
  gtag('event', 'form_submit', {
    form_name: 'contact',
  });
};
```

---

## 🔍 Testing

### 1. Real-time Testing
1. Go to Google Analytics
2. Open "Realtime" → "Overview"
3. Visit your site
4. You should see activity within seconds

### 2. Debug Mode
- Use Google Analytics Debugger Chrome extension
- Or add `?debug_mode=true` to your URL
- Check browser console for GA events

### 3. Verify Events
- Use Google Tag Assistant
- Or check Network tab for `collect` requests

---

## 📈 Expected Data

### Immediate (After Deployment):
- ✅ Real-time visitors
- ✅ Page views
- ✅ Traffic sources

### 24-48 Hours:
- 📊 Full reports available
- 📊 User demographics
- 📊 Device breakdown

### 1 Week:
- 📊 Trends and patterns
- 📊 Conversion data
- 📊 User behavior insights

---

## 🎯 Key Metrics to Monitor

### Acquisition
- **Users:** Total visitors
- **Sessions:** Total visits
- **New vs Returning:** User loyalty
- **Traffic Sources:** Where users come from

### Behavior
- **Page Views:** Most viewed pages
- **Bounce Rate:** Single-page visits
- **Time on Site:** Engagement
- **Pages per Session:** Depth of visit

### Conversions
- **Goal Completions:** Successful actions
- **Conversion Rate:** % of users who convert
- **Funnel Analysis:** Drop-off points

---

## 🔧 Troubleshooting

### Not Seeing Data?
1. **Check deployment:** Make sure changes are live
2. **Check ad blockers:** Disable to test
3. **Check real-time:** Use Realtime report
4. **Check console:** Look for errors

### Data Delayed?
- Real-time: Shows within seconds
- Standard reports: 24-48 hour delay
- This is normal!

### Wrong Data?
- Check tracking ID is correct
- Verify script is loading (Network tab)
- Check for JavaScript errors

---

## ✅ Checklist

- [x] Google Analytics component created
- [x] Added to layout.tsx
- [x] Tracking ID configured
- [ ] Site deployed to production
- [ ] Verified in Google Analytics (Realtime)
- [ ] Set up goals
- [ ] Monitor metrics weekly
- [ ] Set up custom events (optional)

---

## 📞 Next Steps

1. **Deploy** your site
2. **Verify** tracking works (Realtime report)
3. **Set up goals** for key actions
4. **Monitor** metrics weekly
5. **Optimize** based on data

**Your Google Analytics is ready! Deploy and start tracking. 🚀**


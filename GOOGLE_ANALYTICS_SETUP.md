# Google Analytics Setup Troubleshooting

## Current Setup
- ✅ GTM Container ID: `GTM-56LDSLVJ`
- ✅ GTM script installed and loading
- ✅ GTM noscript fallback configured

## Problem: 400 Error from Google Analytics Real-time

This error typically means GTM is not properly configured to send data to Google Analytics 4 (GA4).

## Solution Steps

### 1. Go to Google Tag Manager Console
1. Visit: https://tagmanager.google.com/
2. Select your container `GTM-56LDSLVJ`
3. Click on **Workspace** → **Tags**

### 2. Check if GA4 Configuration Tag Exists
Look for a tag with:
- **Tag Type**: Google Analytics: GA4 Configuration
- **Measurement ID**: Should start with `G-` (e.g., `G-XXXXXXXXXX`)

If NOT found, create a new tag:

### 3. Create GA4 Configuration Tag
1. Click **New Tag**
2. Give it a name: "GA4 - Page View"
3. Click **Tag Configuration** dropdown
4. Select **Google Analytics: GA4 Configuration**
5. **Measurement ID**: Go to your GA4 property → Admin → Data Streams → Get Measurement ID
6. **Triggering**: Select "All Pages"
7. Click **Save**

### 4. Create GA4 Event Tag (for page views)
1. Click **New Tag**
2. Name: "GA4 - Event"
3. Tag Configuration: **Google Analytics: GA4 Event**
4. **Measurement ID**: (same as above)
5. **Event Name**: `page_view`
6. **Triggering**: "All Pages"
7. Click **Save**

### 5. Publish Your Container
1. Click **Submit** (top right)
2. Review changes
3. Click **Publish**

### 6. Verify in Browser
1. Visit your site: https://www.ailesglobal.com
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for: `gtm.js loaded successfully` or GTM messages
5. Go to **Network** tab
6. Look for requests to `googletagmanager.com` - should see 200 responses

### 7. Check Real-time Data in GA4
1. Go to your GA4 property: https://analytics.google.com/analytics/web/
2. Click **Reports** → **Real-time**
3. Visit your site in a new tab
4. You should see visitors appear within seconds

## Quick Checklist
- [ ] GA4 property created in Google Analytics
- [ ] GA4 Measurement ID obtained (starts with G-)
- [ ] GTM Configuration tag created in GTM
- [ ] GTM Event tag created in GTM
- [ ] GTM container **PUBLISHED** (not just saved)
- [ ] No console errors on site
- [ ] Real-time data showing in GA4

## Environment Variable
```
NEXT_PUBLIC_GTM_ID=GTM-56LDSLVJ  ✓ Currently set
```

## If Still Not Working

### Option A: Enable GTM Debug Mode
1. Visit: https://tagmanager.google.com/debug/
2. Scan QR code or paste URL to your site
3. Navigate and watch tag fires in real-time

### Option B: Enable GA4 Debug Mode
1. Install: Chrome extension "Google Analytics Debugger"
2. Go to your GA4 property → Admin → Debug View
3. Visit your site
4. Check if events appear in Debug View

### Option C: Check Browser Console
Press F12 → Console tab and look for errors like:
- `Failed to load GTM` - GTM container ID is wrong
- `CORS error` - Domain not allowed
- `Failed to connect to analytics` - GA4 Measurement ID wrong

## Common Issues & Fixes

| Error | Solution |
|-------|----------|
| 400 Bad Request | GA4 Configuration tag missing or Measurement ID wrong |
| No data in real-time | GTM container NOT published - need to click Publish button |
| GTM loads but no tracking | Event tags missing - create GA4 Event tag |
| Container shows as draft | Click Submit → Publish to go live |

## Quick Reference Links
- GTM Docs: https://support.google.com/tagmanager/
- GA4 Setup: https://support.google.com/analytics/answer/9304153
- GA4 Troubleshooting: https://support.google.com/analytics/

## Next Steps
1. Go to GTM Console for `GTM-56LDSLVJ`
2. Verify GA4 Configuration tag exists
3. If missing, create it with your GA4 Measurement ID
4. Publish the container
5. Wait 30 seconds and check real-time reports

**Note**: Changes to GTM can take up to 1-2 hours to fully propagate, but usually appear within minutes.

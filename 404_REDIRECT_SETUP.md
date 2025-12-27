# 404 Redirect Setup

All 404 errors are now automatically redirected to the **Scholarship Finder** (`/find-scholarships`).

## Current Setup

✅ **Default Mode: Delayed Redirect with UI**
- Shows a nice 404 page with helpful links
- Auto-redirects to `/find-scholarships` after 3 seconds
- Users can also click buttons to navigate manually

## Files Created

1. **`app/not-found.tsx`** - Main 404 page (delayed redirect with UI)
2. **`app/not-found-immediate.tsx`** - Alternative immediate redirect version
3. **`scripts/setup-404-redirect.js`** - Setup utility script

## How It Works

In Next.js App Router, any route that doesn't exist automatically triggers `app/not-found.tsx`. This page:

1. Displays a user-friendly 404 message
2. Shows links to popular pages
3. Auto-redirects to `/find-scholarships` after 3 seconds
4. Provides manual navigation options

## Switching Redirect Modes

### Option 1: Immediate Redirect (No UI)
If you want instant redirects without showing a 404 page:

```bash
# Backup current file
cp app/not-found.tsx app/not-found-delayed.tsx

# Use immediate version
cp app/not-found-immediate.tsx app/not-found.tsx
```

### Option 2: Manual Redirect Only (No Auto-redirect)
To remove auto-redirect and require user to click:

1. Open `app/not-found.tsx`
2. Remove or comment out the `useEffect` that calls `router.push()`
3. Keep the buttons for manual navigation

### Option 3: Redirect to Different Page
To redirect to a different page (e.g., homepage):

1. Open `app/not-found.tsx`
2. Change `/find-scholarships` to your desired route (e.g., `/`)

## Testing

Test the 404 redirect by visiting any non-existent page:
- `http://localhost:3000/this-page-does-not-exist`
- `http://localhost:3000/random-url`

You should see the 404 page and be redirected to `/find-scholarships`.

## Customization

### Change Redirect Delay
In `app/not-found.tsx`, modify the timeout:
```tsx
setTimeout(() => {
  router.push("/find-scholarships");
}, 3000); // Change 3000 to your desired milliseconds
```

### Change Redirect Destination
Replace `/find-scholarships` with any route:
- `/` - Homepage
- `/scholarships` - Browse all scholarships
- `/scholarships/match` - AI Matching tool

### Customize 404 Page Content
Edit the JSX in `app/not-found.tsx` to match your brand and messaging.

## Production

This works automatically in production. No additional configuration needed!

## Alternative: Middleware Redirect

If you prefer middleware-based redirects (not recommended for 404s), you could add this to `middleware.ts`:

```typescript
// This is NOT recommended - Next.js handles 404s better with not-found.tsx
// But if you really want middleware redirect:
if (response.status === 404) {
  return NextResponse.redirect(new URL("/find-scholarships", request.url));
}
```

However, the `not-found.tsx` approach is the recommended Next.js way.


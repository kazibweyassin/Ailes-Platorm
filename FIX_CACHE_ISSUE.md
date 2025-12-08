# Fix: Component Import Errors

## The Problem
You're seeing errors like:
- `'MobileQuickActions' is not exported from '@/components/mobile-quick-actions'`
- `'MobileBottomNav' is not exported from '@/components/mobile-bottom-nav'`
- `Unsupported Server Component type: undefined`

## The Solution

This is a **Next.js cache issue**. The components are correctly exported, but Next.js has cached old versions.

### Step 1: Stop the Dev Server
Press `Ctrl+C` in your terminal to stop the running server.

### Step 2: Clear Next.js Cache
Run this command in PowerShell:

```powershell
Remove-Item -Recurse -Force .next
```

Or manually delete the `.next` folder in your project directory.

### Step 3: Restart the Dev Server
```powershell
npm run dev
```

## If That Doesn't Work

### Option 1: Full Clean
```powershell
# Stop server first (Ctrl+C)
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
npm run dev
```

### Option 2: Reinstall Dependencies
```powershell
# Stop server first (Ctrl+C)
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Option 3: Check File Names
Make sure the file names match exactly (case-sensitive):
- `components/mobile-quick-actions.tsx` (lowercase)
- `components/mobile-bottom-nav.tsx` (lowercase)

## Verification

After clearing cache, you should see:
- ✓ Compiled successfully
- No import errors
- Website loads at http://localhost:3000

## Why This Happens

Next.js caches compiled modules for performance. When files are created or modified, sometimes the cache doesn't update properly, especially on Windows. Clearing the `.next` folder forces Next.js to rebuild everything from scratch.



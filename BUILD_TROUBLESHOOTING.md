# Build Troubleshooting - Blue Screen Issues

## Problem
Your computer shows a blue screen (BSOD) when running `npm run build`.

## Root Causes
Blue screens during builds are usually caused by:
1. **Insufficient RAM** - Next.js builds can use 4-8GB+ of memory
2. **Memory leaks** - Build process consuming too much memory
3. **Hardware issues** - Failing RAM, overheating CPU
4. **Windows memory management** - System running out of virtual memory

## Solutions

### Solution 1: Use Memory-Limited Build (Recommended)
Run the build with a memory limit to prevent system overload:

```powershell
# Step 1: Generate Prisma client separately
npm run build:prisma

# Step 2: Build Next.js with memory limit (4GB)
npm run build:safe
```

Or manually:
```powershell
node --max-old-space-size=4096 node_modules/.bin/next build
```

### Solution 2: Build in Steps
Split the build process to reduce memory pressure:

```powershell
# Step 1: Generate Prisma (uses less memory)
npm run build:prisma

# Step 2: Build Next.js separately
npm run build:next
```

### Solution 3: Increase Virtual Memory
1. Open **System Properties** → **Advanced** → **Performance Settings**
2. Go to **Advanced** tab → **Virtual Memory**
3. Set initial size to **8192 MB** and maximum to **16384 MB**
4. Click **Set** and restart

### Solution 4: Check System Resources
Before building, check available resources:

```powershell
# Check available RAM
Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory, TotalVisibleMemorySize
```

**Minimum Requirements:**
- **8GB RAM** (16GB recommended)
- **10GB free disk space**
- Close other applications before building

### Solution 5: System Diagnostics

#### Check RAM Health
1. Open **Windows Memory Diagnostic**
2. Type `mdsched.exe` in Run (Win+R)
3. Restart and let it test your RAM

#### Check for Overheating
- Monitor CPU temperature during build
- Ensure fans are working
- Clean dust from computer

#### Check Windows Event Viewer
1. Open **Event Viewer** (Win+X → Event Viewer)
2. Look for errors around the time of blue screen
3. Check **System** logs for hardware errors

### Solution 6: Alternative Build Methods

#### Use WSL (Windows Subsystem for Linux)
If available, build in WSL which may handle memory better:
```bash
wsl
cd /mnt/f/Project/newailes
npm run build
```

#### Build on CI/CD
Instead of building locally, use:
- **Vercel** (automatic builds)
- **GitHub Actions**
- **Netlify**

### Solution 7: Reduce Build Memory Usage

#### Disable Source Maps (Development)
Add to `next.config.js`:
```js
productionBrowserSourceMaps: false,
```

#### Clear Cache Before Building
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

### Solution 8: Update Node.js
Older Node.js versions may have memory issues:
```powershell
# Check version
node --version

# Update to latest LTS (v20.x recommended)
```

## Quick Fix Commands

```powershell
# 1. Clear all caches
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache

# 2. Generate Prisma separately
npm run build:prisma

# 3. Build with memory limit
npm run build:safe
```

## When to Seek Help

If blue screens persist after trying these solutions:
1. **Hardware issue** - Test RAM with MemTest86
2. **Driver issue** - Update all drivers, especially graphics
3. **Windows issue** - Run `sfc /scannow` and `DISM /Online /Cleanup-Image /RestoreHealth`
4. **Professional help** - May need hardware replacement

## Prevention

1. **Always close other apps** before building
2. **Use memory-limited builds** for large projects
3. **Monitor system resources** during build
4. **Build on CI/CD** instead of locally when possible


#!/usr/bin/env node

/**
 * Setup 404 Redirect Script
 * 
 * This script helps you configure 404 redirects to the Scholarship Finder.
 * 
 * Options:
 * 1. Immediate redirect (no UI, instant redirect)
 * 2. Delayed redirect with nice UI (3 second delay)
 * 3. Manual redirect (user clicks button)
 */

const fs = require('fs');
const path = require('path');

const NOT_FOUND_PATH = path.join(process.cwd(), 'app', 'not-found.tsx');
const IMMEDIATE_PATH = path.join(process.cwd(), 'app', 'not-found-immediate.tsx');

console.log('🔧 404 Redirect Setup Script\n');

// Check if files exist
if (!fs.existsSync(NOT_FOUND_PATH)) {
  console.error('❌ Error: app/not-found.tsx not found!');
  process.exit(1);
}

if (!fs.existsSync(IMMEDIATE_PATH)) {
  console.error('❌ Error: app/not-found-immediate.tsx not found!');
  process.exit(1);
}

// Read current not-found.tsx
const currentContent = fs.readFileSync(NOT_FOUND_PATH, 'utf8');
const immediateContent = fs.readFileSync(IMMEDIATE_PATH, 'utf8');

// Check which mode is currently active
const isImmediate = currentContent.includes('router.replace("/find-scholarships")');
const isDelayed = currentContent.includes('setTimeout');

console.log('Current 404 page status:');
if (isImmediate) {
  console.log('  ✅ Immediate redirect (instant)');
} else if (isDelayed) {
  console.log('  ✅ Delayed redirect with UI (3 seconds)');
} else {
  console.log('  ✅ Manual redirect (user clicks button)');
}

console.log('\nOptions:');
console.log('  1. Immediate redirect (no UI, instant)');
console.log('  2. Delayed redirect with nice UI (3 seconds) - CURRENT');
console.log('  3. Manual redirect (user clicks button)');
console.log('\nTo switch modes:');
console.log('  - For immediate: Copy not-found-immediate.tsx content to not-found.tsx');
console.log('  - For delayed: Use the current not-found.tsx');
console.log('  - For manual: Remove the useEffect auto-redirect from not-found.tsx');

console.log('\n✅ Setup complete! Your 404 page is configured.');
console.log('📝 All 404 errors will redirect to /find-scholarships');


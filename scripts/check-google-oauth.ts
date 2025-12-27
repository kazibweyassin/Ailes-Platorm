#!/usr/bin/env ts-node
/**
 * Diagnostic script to check Google OAuth configuration
 * Run with: npx ts-node scripts/check-google-oauth.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

console.log('🔍 Checking Google OAuth Configuration...\n');

// Check environment variables
const checks = [
  {
    name: 'AUTH_GOOGLE_ID or GOOGLE_CLIENT_ID',
    value: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
    required: true,
  },
  {
    name: 'AUTH_GOOGLE_SECRET or GOOGLE_CLIENT_SECRET',
    value: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    required: true,
  },
  {
    name: 'AUTH_URL or NEXTAUTH_URL',
    value: process.env.AUTH_URL || process.env.NEXTAUTH_URL,
    required: true,
  },
  {
    name: 'AUTH_SECRET or NEXTAUTH_SECRET',
    value: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    required: true,
  },
];

let allPassed = true;

checks.forEach((check) => {
  const status = check.value ? '✅' : '❌';
  const message = check.value 
    ? `${status} ${check.name}: Set`
    : `${status} ${check.name}: MISSING`;
  
  console.log(message);
  
  if (!check.value && check.required) {
    allPassed = false;
  }
});

console.log('\n📋 Configuration Summary:');

if (allPassed) {
  console.log('✅ All required environment variables are set!\n');
  
  const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUri = `${authUrl}/api/auth/callback/google`;
  
  console.log('🔗 Make sure this redirect URI is added in Google Cloud Console:');
  console.log(`   ${redirectUri}\n`);
  
  console.log('📝 Next steps:');
  console.log('   1. Go to https://console.cloud.google.com/');
  console.log('   2. Navigate to APIs & Services → Credentials');
  console.log('   3. Find your OAuth 2.0 Client ID');
  console.log('   4. Add the redirect URI above to "Authorized redirect URIs"');
  console.log('   5. Make sure OAuth consent screen is configured');
  console.log('   6. Restart your dev server: npm run dev\n');
} else {
  console.log('❌ Some required environment variables are missing!\n');
  console.log('📝 Add these to your .env.local file:');
  console.log('');
  console.log('   # Google OAuth');
  console.log('   AUTH_GOOGLE_ID="your-client-id.apps.googleusercontent.com"');
  console.log('   AUTH_GOOGLE_SECRET="your-client-secret"');
  console.log('   AUTH_URL="http://localhost:3000"');
  console.log('   AUTH_SECRET="your-secret-key"');
  console.log('');
  console.log('   # Generate AUTH_SECRET with:');
  console.log('   # openssl rand -base64 32');
  console.log('');
}

// Check if Google provider would be enabled
const hasGoogleId = !!(process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID);
const hasGoogleSecret = !!(process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET);

if (hasGoogleId && hasGoogleSecret) {
  console.log('✅ Google OAuth provider will be enabled');
} else {
  console.log('⚠️  Google OAuth provider will be DISABLED (missing credentials)');
}

console.log('');


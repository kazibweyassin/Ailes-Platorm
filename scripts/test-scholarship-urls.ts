import { PrismaClient } from '@prisma/client';
import https from 'https';
import http from 'http';

const prisma = new PrismaClient();

interface URLTestResult {
  id: string;
name: string;
  website: string | null;
  applicationLink: string | null;
  websiteStatus: 'valid' | 'broken' | 'empty' | 'invalid';
  appLinkStatus: 'valid' | 'broken' | 'empty' | 'invalid';
}

async function testUrl(url: string | null): Promise<'valid' | 'broken' | 'empty' | 'invalid'> {
  if (!url || url.trim() === '') return 'empty';
  
  // Check for obvious invalid patterns
  const invalidPatterns = [
    /example\.com/i,
    /placeholder/i,
    /test\.com/i,
    /^(n\/a|tbd|coming soon|website\.com)$/i,
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(url)) return 'invalid';
  }
  
  // Test the URL
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const request = client.request(
        {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: 'HEAD',
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ScholarshipBot/1.0;)'
          }
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
            resolve('valid');
          } else if (res.statusCode && res.statusCode >= 400) {
            resolve('broken');
          } else {
            resolve('valid'); // Assume valid for redirects
          }
        }
      );
      
      request.on('error', () => resolve('broken'));
      request.on('timeout', () => {
        request.destroy();
        resolve('broken');
      });
      
      request.end();
    } catch {
      resolve('invalid');
    }
  });
}

async function testScholarshipUrls() {
  console.log('🔍 Testing Scholarship URLs...\n');
  console.log('This will take a few minutes...\n');
  
  const scholarships = await prisma.scholarship.findMany({
    select: {
      id: true,
      name: true,
      website: true,
      applicationLink: true,
    },
  });
  
  console.log(`Testing ${scholarships.length} scholarships...\n`);
  
  const results: URLTestResult[] = [];
  let tested = 0;
  
  for (const scholarship of scholarships) {
    tested++;
    
    if (tested % 50 === 0) {
      console.log(`Progress: ${tested}/${scholarships.length} (${((tested/scholarships.length)*100).toFixed(1)}%)`);
    }
    
    const websiteStatus = await testUrl(scholarship.website);
    const appLinkStatus = await testUrl(scholarship.applicationLink);
    
    results.push({
      id: scholarship.id,
      name: scholarship.name,
      website: scholarship.website,
      applicationLink: scholarship.applicationLink,
      websiteStatus,
      appLinkStatus,
    });
    
    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n\n📊 Results:\n');
  
  const stats = {
    totalScholarships: results.length,
    websiteValid: results.filter(r => r.websiteStatus === 'valid').length,
    websiteBroken: results.filter(r => r.websiteStatus === 'broken').length,
    websiteInvalid: results.filter(r => r.websiteStatus === 'invalid').length,
    websiteEmpty: results.filter(r => r.websiteStatus === 'empty').length,
    appLinkValid: results.filter(r => r.appLinkStatus === 'valid').length,
    appLinkBroken: results.filter(r => r.appLinkStatus === 'broken').length,
    appLinkInvalid: results.filter(r => r.appLinkStatus === 'invalid').length,
    appLinkEmpty: results.filter(r => r.appLinkStatus === 'empty').length,
  };
  
  console.log(`Total Scholarships: ${stats.totalScholarships}`);
  console.log(`\nWebsite URLs:`);
  console.log(`  ✅ Valid: ${stats.websiteValid} (${((stats.websiteValid/stats.totalScholarships)*100).toFixed(1)}%)`);
  console.log(`  ❌ Broken: ${stats.websiteBroken} (${((stats.websiteBroken/stats.totalScholarships)*100).toFixed(1)}%)`);
  console.log(`  ⚠️  Invalid: ${stats.websiteInvalid} (${((stats.websiteInvalid/stats.totalScholarships)*100).toFixed(1)}%)`);
  console.log(`  ⭕ Empty: ${stats.websiteEmpty} (${((stats.websiteEmpty/stats.totalScholarships)*100).toFixed(1)}%)`);
  
  console.log(`\nApplication Link URLs:`);
  console.log(`  ✅ Valid: ${stats.appLinkValid} (${((stats.appLinkValid/stats.totalScholarships)*100).toFixed(1)}%)`);
  console.log(`  ❌ Broken: ${stats.appLinkBroken} (${((stats.appLinkBroken/stats.totalScholarships)*100).toFixed(1)}%)`);
  console.log(`  ⚠️  Invalid: ${stats.appLinkInvalid} (${((stats.appLinkInvalid/stats.totalScholarships)*100).toFixed(1)}%)`);
  console.log(`  ⭕ Empty: ${stats.appLinkEmpty} (${((stats.appLinkEmpty/stats.totalScholarships)*100).toFixed(1)}%)`);
  
  // Show broken/invalid scholarships
  const problematic = results.filter(
    r => r.websiteStatus === 'broken' || 
         r.websiteStatus === 'invalid' ||
         r.appLinkStatus === 'broken' ||
         r.appLinkStatus === 'invalid'
  );
  
  if (problematic.length > 0) {
    console.log(`\n\n⚠️  ${problematic.length} Scholarships with Broken/Invalid URLs:\n`);
    problematic.slice(0, 20).forEach((s, i) => {
      console.log(`${i + 1}. ${s.name.substring(0, 60)}`);
      console.log(`   Website: ${s.website || 'N/A'} [${s.websiteStatus}]`);
      console.log(`   App Link: ${s.applicationLink || 'N/A'} [${s.appLinkStatus}]\n`);
    });
    
    if (problematic.length > 20) {
      console.log(`... and ${problematic.length - 20} more\n`);
    }
  }
  
  await prisma.$disconnect();
}

testScholarshipUrls().catch(console.error);

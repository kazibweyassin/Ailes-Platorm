# AI Cache System Documentation

## Overview

The AI Cache System reduces API calls by caching common scholarship questions and answers. It uses a two-tier caching approach:
1. **Memory Cache**: Fast in-memory storage for frequently accessed responses
2. **Disk Cache**: Persistent storage for long-term caching

## Features

- ✅ **Automatic Caching**: All AI responses are automatically cached
- ✅ **Pre-generated Templates**: Standardized responses for common questions
- ✅ **Smart Cache Keys**: Uses message content and context to generate unique keys
- ✅ **Expiration Management**: Automatic cleanup of expired entries
- ✅ **Cache Invalidation**: Manual invalidation for specific scholarships or question types

## How It Works

### 1. Cache Check Flow

When a user asks a question, the system checks in this order:

1. **Memory Cache** → Fast lookup
2. **Disk Cache** → Persistent storage
3. **Pre-generated Templates** → Standardized responses
4. **AI API Call** → Generate new response (then cache it)

### 2. Pre-generated Templates

Templates are available for:
- **Application Steps**: Standardized scholarship application process
- **Eligibility Requirements**: Common eligibility criteria
- **Application Tips**: General advice and best practices
- **Scholarship-Specific**: Templates for popular scholarships (Mastercard Foundation, Chevening, DAAD, etc.)

### 3. Cache Expiration

- **General AI Responses**: 7 days
- **Scholarship Match Results**: 3 days (deadlines change frequently)
- **Pre-generated Templates**: 30 days
- **Custom TTL**: Can be specified per cache entry

## Usage

### Pre-generate Templates

Run the pre-generation script to cache responses for top scholarships:

```bash
npm run pre-generate-templates
# or
npx tsx scripts/pre-generate-scholarship-templates.ts
```

This script:
- Fetches top 20 featured scholarships
- Generates responses for 7 common questions per scholarship
- Caches responses for 30 days
- Skips already-cached responses

### Manual Cache Management

```typescript
import { getAICache } from '@/lib/ai-cache';

const cache = getAICache();

// Check if cached
const cached = cache.get(message, context);

// Invalidate specific scholarship
cache.invalidate({ scholarshipName: 'Mastercard Foundation Scholars Program' });

// Clean expired entries
const cleaned = cache.cleanExpired();

// Clear all cache
cache.clear();

// Get cache statistics
const stats = cache.getStats();
```

## Adding New Templates

### 1. Add Scholarship-Specific Template

Edit `lib/scholarship-templates.ts`:

```typescript
export const SCHOLARSHIP_SPECIFIC_TEMPLATES: Record<string, ScholarshipTemplate[]> = {
  'Your Scholarship Name': [
    {
      scholarshipName: 'Your Scholarship Name',
      provider: 'Provider Name',
      questionType: 'application_steps',
      template: `Your template content here...`,
    },
    // Add more question types as needed
  ],
};
```

### 2. Add General Template

Add to the appropriate template function in `lib/scholarship-templates.ts`:

```typescript
export const YOUR_NEW_TEMPLATE = `Your template content...`;
```

## Cache Directory Structure

```
.cache/
└── ai-responses/
    ├── {hash1}.json
    ├── {hash2}.json
    └── ...
```

Each cache file contains:
```json
{
  "key": "sha256-hash",
  "response": "Cached response text",
  "metadata": {
    "scholarshipId": "scholarship-id",
    "scholarshipName": "Scholarship Name",
    "questionType": "application_steps",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

## Performance Benefits

### Before Caching
- Every question → AI API call
- Average response time: 2-5 seconds
- API costs: High
- Rate limit issues: Frequent

### After Caching
- Common questions → Instant response (< 50ms)
- API calls reduced by ~70-80%
- Lower costs
- Better user experience

## Monitoring

### Cache Statistics

The cache system tracks:
- Memory entries count
- Question types distribution
- Cache hit/miss rates (via logs)

### Logs

Cache operations are logged:
- `✅ Using cached response` - Cache hit
- `✅ Using pre-generated template` - Template used
- `🤖 Generating` - New AI call made

## Best Practices

1. **Run Pre-generation Regularly**: Set up a cron job to refresh templates monthly
2. **Monitor Cache Hit Rate**: Track how often cache is used vs API calls
3. **Update Templates**: Keep templates current with scholarship requirements
4. **Invalidate When Needed**: Clear cache when scholarship details change
5. **Set Appropriate TTLs**: Use shorter TTLs for frequently changing data (deadlines)

## Troubleshooting

### Cache Not Working

1. Check `.cache/ai-responses/` directory exists
2. Verify file permissions
3. Check logs for errors

### Stale Data

1. Run cache invalidation: `cache.invalidate({ scholarshipName: '...' })`
2. Clear all cache: `cache.clear()`
3. Re-run pre-generation script

### Memory Issues

1. Reduce `maxMemoryEntries` in `lib/ai-cache.ts`
2. Increase cleanup frequency
3. Use disk cache more aggressively

## Future Enhancements

- [ ] Redis integration for distributed caching
- [ ] Cache analytics dashboard
- [ ] Automatic template updates
- [ ] A/B testing for template effectiveness
- [ ] User-specific cache (personalized responses)


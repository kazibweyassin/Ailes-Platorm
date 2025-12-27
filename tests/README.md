# Playwright Tests

## Setup

Playwright is already installed. If you need to install browsers:

```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run signup tests only
```bash
npm run test:signup
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

## Test Configuration

- **Base URL**: `http://localhost:3000` (or set `PLAYWRIGHT_TEST_BASE_URL` env var)
- **Config File**: `playwright.config.ts`
- **Test Directory**: `./tests`

## Signup Test Coverage

The `signup.spec.ts` test file includes:

1. ✅ **Form Display Test** - Verifies all form fields are visible
2. ✅ **Successful Signup Test** - Tests complete signup flow and redirect
3. ✅ **Duplicate Email Test** - Tests error handling for existing email
4. ✅ **Field Validation Tests** - Tests required fields, password match, email format
5. ✅ **Submit Button State** - Verifies button is disabled during submission

## Current Behavior

**Note**: The current signup flow redirects to `/auth/signin?registered=true` after successful signup, not directly to `/dashboard`. 

If you want to test dashboard redirect, you'll need to:
1. Implement auto-login after signup, OR
2. Modify the test to sign in after signup, OR
3. Unskip the dashboard redirect test and implement the feature

## Environment Variables

Set these if needed:
- `PLAYWRIGHT_TEST_BASE_URL` - Override base URL (default: `http://localhost:3000`)
- `CI` - Set to `true` in CI environments for retry behavior

## Test Data

Tests use dynamically generated emails to avoid conflicts:
- Format: `test-{timestamp}-{random}@example.com`
- Each test run gets unique emails
- No cleanup needed (tests are isolated)

## Debugging

### View test report
```bash
npx playwright show-report
```

### Debug a specific test
```bash
npx playwright test tests/signup.spec.ts --debug
```

### Run with trace viewer
```bash
npx playwright test --trace on
npx playwright show-trace
```


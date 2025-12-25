#!/usr/bin/env node
/*
 Playwright Validation Script (dry-run)

 Usage: `node scripts/playwright-validation.ts --url "https://example.com/apply" --mappings mappings.json --out ./out`

 This script implements the validation checklist for mapping selectors returned by the LLM. It runs in dry-run mode only (fills fields but does not click submit).

 NOTE: This is a template and requires Playwright to be installed in your environment.
    npm i -D playwright
    npx playwright install --with-deps
*/

import fs from 'fs';
import path from 'path';
import os from 'os';
import { chromium } from 'playwright';

type Mapping = {
  selector: string;
  profileKey: string;
  inputType: string;
  exampleValue?: string | null;
  confidence?: number;
  step?: number;
  notes?: string;
};

async function runValidation(url: string, mappings: Mapping[], outDir = './out') {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e) => {
    console.error('Navigation failed', e);
  });

  // Capture before screenshot
  await fs.promises.mkdir(outDir, { recursive: true });
  const beforePath = path.join(outDir, 'before.png');
  await page.screenshot({ path: beforePath, fullPage: true });

  const results: any[] = [];

  // Detect common CAPTCHAs / anti-bot signals
  const captchaDetected = await detectCaptcha(page);

  for (const m of mappings) {
    const r: any = { mapping: m, exists: false, typeMatch: false, visible: false, fillSucceeded: false, error: null };
    try {
      const handle = await page.$(m.selector);
      if (!handle) {
        r.exists = false;
        r.error = 'selector-not-found';
        results.push(r);
        continue;
      }
      r.exists = true;

      // Tag name and type
      const tagName = await handle.evaluate((el) => (el as HTMLElement).tagName.toLowerCase());
      const inputType = await handle.evaluate((el) => (el as HTMLInputElement).type || (el as HTMLElement).nodeName.toLowerCase());
      r.detected = { tagName, inputType };

      // Type consistency check (basic)
      const expectedType = m.inputType?.toLowerCase() || '';
      if (expectedType) {
        if (expectedType === 'textarea' && tagName === 'textarea') r.typeMatch = true;
        else if (expectedType === 'file' && inputType === 'file') r.typeMatch = true;
        else if (expectedType === 'select' && tagName === 'select') r.typeMatch = true;
        else if (expectedType === 'text' && (tagName === 'input' || tagName === 'textarea')) r.typeMatch = true;
        else r.typeMatch = false;
      } else {
        r.typeMatch = true;
      }

      // Visibility check
      const box = await handle.boundingBox();
      r.visible = !!box && box.width > 0 && box.height > 0;

      // Try fill (simulate typing) if not file
      if (m.inputType !== 'file') {
        try {
          await handle.scrollIntoViewIfNeeded();
          await handle.focus();
          const val = (m.exampleValue ?? getExampleForKey(m.profileKey)) as string;
          if (typeof val === 'string') {
            // simulate typing with small delay
            await page.keyboard.type(val, { delay: 60 });
            // verify set value
            const current = await handle.evaluate((el: any) => el.value || el.innerText || '');
            r.fillSucceeded = current && current.toString().length > 0;
            r.filledValue = current;
          } else {
            r.fillSucceeded = false;
            r.error = 'no-example-value';
          }
        } catch (err) {
          r.fillSucceeded = false;
          r.error = String(err);
        }
      } else {
        // For file inputs, just check that setInputFiles works in Playwright environment (requires a real file path)
        try {
          const temp = path.join(os.tmpdir(), 'resume-dummy.pdf');
          if (!fs.existsSync(temp)) fs.writeFileSync(temp, 'dummy');
          await (handle as any).setInputFiles(temp);
          // Verify files length
          const filesLen = await handle.evaluate((el: any) => (el.files ? el.files.length : 0));
          r.fillSucceeded = filesLen > 0;
        } catch (err) {
          r.fillSucceeded = false;
          r.error = String(err);
        }
      }

    } catch (err: any) {
      r.error = String(err);
    }
    results.push(r);
  }

  // Capture after screenshot
  const afterPath = path.join(outDir, 'after.png');
  await page.screenshot({ path: afterPath, fullPage: true });

  await browser.close();

  const output = { url, captchaDetected, results, before: beforePath, after: afterPath };
  const outJson = path.join(outDir, 'validation.json');
  fs.writeFileSync(outJson, JSON.stringify(output, null, 2));
  console.log('Validation complete. Results written to', outJson);
  return output;
}

function getExampleForKey(key: string) {
  const map: Record<string, string> = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '+254700000000',
    gpa: '3.8',
    major: 'Computer Science',
    degreeLevel: "Master's",
    nationality: 'Kenya',
    resume: 'https://example.com/resume.pdf',
  };
  return map[key] || 'test';
}

async function detectCaptcha(page: any) {
  // Basic heuristics: look for recaptcha, hcaptcha, iframe to known providers
  const iframeSrcs = await page.$$eval('iframe', (ifs: HTMLIFrameElement[]) => ifs.map((f) => f.src || ''));
  const captchaRegex = /(recaptcha|google.com\/recaptcha|hcaptcha|2captcha|turnstile)/i;
  if (iframeSrcs.some((s: string) => captchaRegex.test(s))) return true;
  const html = await page.content();
  if (captchaRegex.test(html) || /data-sitekey|g-recaptcha|h-captcha/i.test(html)) return true;
  return false;
}

// Simple CLI parsing
if (require.main === module) {
  (async () => {
    const argv = process.argv.slice(2);
    const argMap: any = {};
    for (let i = 0; i < argv.length; i++) {
      const a = argv[i];
      if (a.startsWith('--')) {
        const key = a.replace(/^--/, '');
        const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
        argMap[key] = val;
        if (val !== true) i++;
      }
    }
    if (!argMap.url || !argMap.mappings) {
      console.log('Usage: node scripts/playwright-validation.ts --url <url> --mappings <mappings.json> [--out ./out]');
      process.exit(1);
    }
    const mappingsFile = path.resolve(argMap.mappings as string);
    const mappings: Mapping[] = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'));
    const out = argMap.out || path.join(process.cwd(), 'out');
    await runValidation(argMap.url as string, mappings, out as string);
  })();
}

export { runValidation };

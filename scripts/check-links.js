const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const https = require('https');
const http = require('http');

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const APP_DIR = path.join(ROOT, 'app');
const MAX_EXTERNAL_CONCURRENCY = 10;

const IGNORE_URLS = new Set(['/path']);

const fileExts = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.html', '.json'];

async function walk(dir) {
  let results = [];
  const list = await readdir(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    try {
      const s = await stat(filePath);
      if (s && s.isDirectory()) {
        // skip large or irrelevant directories
        const base = path.basename(filePath).toLowerCase();
        if (["node_modules", ".git", ".next", "dist", "out", "build"].includes(base)) continue;
        results = results.concat(await walk(filePath));
      } else {
        if (fileExts.includes(path.extname(file))) results.push(filePath);
      }
    } catch (err) {
      // ignore
    }
  }
  return results;
}

function extractUrls(content) {
  const urls = new Set();
  // match href=", href=' , href={`...`} and src="..."
  const regex = /(?:href|src)\s*=\s*(?:\{\s*`([^`]+)`\s*\}|`([^`]+)`|\{"?([^"'}]+)"?\}|"([^"]+)"|'([^']+)')/g;
  let m;
  while ((m = regex.exec(content))) {
    const candidates = m.slice(1).filter(Boolean);
    if (candidates.length) urls.add(candidates[0]);
  }

  // also match <Link href="/path">
  const linkRegex = /<Link[^>]+href\s*=\s*(?:{\s*`([^`]+)`\s*}|"([^"]+)"|'([^']+)')/g;
  while ((m = linkRegex.exec(content))) {
    const candidates = m.slice(1).filter(Boolean);
    if (candidates.length) urls.add(candidates[0]);
  }

  return Array.from(urls).map(u => u.trim()).filter(Boolean);
}

function isExternal(url) {
  return /^https?:\/\//i.test(url);
}

function isAnchorOrMailto(url) {
  return url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:');
}

function looksLikeAsset(url) {
  return /\.(png|jpe?g|gif|svg|webp|avif|ico|pdf|json)$/i.test(url);
}

async function checkInternalRoute(url) {
  // normalize: strip query and hash
  const cleaned = url.split(/[?#]/)[0];
  if (cleaned === '/' || cleaned === '') {
    const rootPage = path.join(APP_DIR, 'page.tsx');
    return fs.existsSync(rootPage);
  }
  // assets served from public
  if (looksLikeAsset(cleaned) || cleaned.startsWith('/')) {
    const assetPath = path.join(PUBLIC_DIR, cleaned.replace(/^\//, ''));
    if (fs.existsSync(assetPath)) return true;
  }
  // check app routes: app/<segments>/page.tsx or page.ts
  const segments = cleaned.replace(/^\//, '').split('/').filter(Boolean);
  // try direct file under app (e.g., /about -> app/about/page.tsx)
  let tryPath = path.join(APP_DIR, ...segments, 'page.tsx');
  if (fs.existsSync(tryPath)) return true;
  tryPath = path.join(APP_DIR, ...segments, 'page.jsx');
  if (fs.existsSync(tryPath)) return true;
  tryPath = path.join(APP_DIR, ...segments + '.tsx');
  if (fs.existsSync(tryPath)) return true;
  // also consider index.tsx inside the directory
  tryPath = path.join(APP_DIR, ...segments, 'index.tsx');
  if (fs.existsSync(tryPath)) return true;

  // maybe it's a file in pages or public
  const pagesPath = path.join(ROOT, 'pages', ...segments) + '.js';
  if (fs.existsSync(pagesPath)) return true;

  // last resort: check public for a file with that path (without ext guess)
  const possible = path.join(PUBLIC_DIR, cleaned.replace(/^\//, ''));
  if (fs.existsSync(possible)) return true;

  return false;
}

function httpRequestHead(url, timeout = 10000) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.request(url, { method: 'HEAD' }, (res) => {
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      });
      req.on('error', () => resolve({ ok: false, status: null }));
      req.setTimeout(timeout, () => {
        req.destroy();
        resolve({ ok: false, status: 'timeout' });
      });
      req.end();
    } catch (err) {
      resolve({ ok: false, status: null });
    }
  });
}

async function checkExternal(url) {
  // try HEAD first, then GET
  const head = await httpRequestHead(url);
  if (head.ok) return { ok: true, status: head.status };
  // try GET
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.get(url, { timeout: 10000 }, (res) => {
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      });
      req.on('error', () => resolve({ ok: false, status: null }));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ ok: false, status: 'timeout' });
      });
    } catch (err) {
      resolve({ ok: false, status: null });
    }
  });
}

(async function main(){
  console.log('Scanning project for links...');
  const files = await walk(ROOT);
  const urlsMap = new Map(); // url -> Set(files)
  for (const f of files) {
    let content;
    try {
      content = await readFile(f, 'utf8');
    } catch (err) { continue; }
    const urls = extractUrls(content);
    for (const u of urls) {
      // ignore template expressions that contain ${ or start with {
      if (u.includes('${') || u.includes('{')) continue;
      if (!urlsMap.has(u)) urlsMap.set(u, new Set());
      urlsMap.get(u).add(f);
    }
  }

  // Only consider literal URLs/paths (start with '/', './', '../' or 'http')
  const allUrls = Array.from(urlsMap.keys())
    .filter(u => !isAnchorOrMailto(u))
    .filter(u => /^(https?:\/\/|\/|\.\/|\.\.)/.test(u))
    .filter(u => !IGNORE_URLS.has(u));
  console.log(`Found ${allUrls.length} unique URLs (excluding anchors/mailto/tel).`);

  const internalBroken = [];
  const externalBroken = [];

  // check internals synchronously
  for (const url of allUrls) {
    if (isExternal(url)) continue;
    if (url.startsWith('//')) continue; // protocol-relative
    // try internal route
    const ok = await checkInternalRoute(url);
    if (!ok) {
      internalBroken.push(url);
    }
  }

  // check externals with limited concurrency
  const externalUrls = allUrls.filter(isExternal);
  console.log(`Checking ${externalUrls.length} external URLs...`);
  const concurrency = Math.min(MAX_EXTERNAL_CONCURRENCY, externalUrls.length || 1);
  let idx = 0;
  const worker = async () => {
    while (idx < externalUrls.length) {
      const i = idx++;
      const url = externalUrls[i];
      const res = await checkExternal(url);
      if (!res.ok) externalBroken.push({ url, status: res.status });
      process.stdout.write('.');
    }
  };
  await Promise.all(new Array(concurrency).fill(0).map(worker));
  process.stdout.write('\n');

  console.log('\n--- Report ---');
  if (internalBroken.length === 0 && externalBroken.length === 0) {
    console.log('No broken links detected.');
  } else {
    if (internalBroken.length) {
      console.log(`\nBroken internal links (${internalBroken.length}):`);
      for (const url of internalBroken) {
        const files = Array.from(urlsMap.get(url)).slice(0,5).join('\n  - ');
        console.log(`- ${url}\n  referenced in:\n  - ${files}\n`);
      }
    }
    if (externalBroken.length) {
      console.log(`\nBroken external links (${externalBroken.length}):`);
      for (const e of externalBroken) {
        const files = Array.from(urlsMap.get(e.url)).slice(0,5).join('\n  - ');
        console.log(`- ${e.url} (status: ${e.status})\n  referenced in:\n  - ${files}\n`);
      }
    }
  }

  // exit code non-zero if any broken
  const brokenCount = internalBroken.length + externalBroken.length;
  process.exit(brokenCount > 0 ? 2 : 0);
})();

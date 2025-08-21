import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

async function readRoutes() {
  const candidates = [
    path.join(ROOT, 'src', 'config', 'routes.json'),
    path.join(ROOT, 'src', 'routes.json'),
  ];
  for (const p of candidates) {
    try { return JSON.parse(await fs.readFile(p, 'utf-8')); } catch {}
  }
  throw new Error(`routes.json not found`);
}
const ROUTES = (await readRoutes()).filter(r => r.index !== false);

const MIME = { html:'text/html', js:'application/javascript', mjs:'application/javascript', css:'text/css',
  json:'application/json', png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg',
  svg:'image/svg+xml', ico:'image/x-icon', webp:'image/webp', map:'application/json',
  txt:'text/plain', xml:'application/xml', woff2:'font/woff2', woff:'font/woff', ttf:'font/ttf' };

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
    const routeFile = path.join(DIST, urlPath === '/' ? 'index.html' : `.${urlPath}/index.html`);
    const assetFile = path.join(DIST, urlPath.replace(/^\/+/, ''));
    let finalPath = routeFile;
    try { await fs.access(finalPath); } catch {
      try { await fs.access(assetFile); finalPath = assetFile; }
      catch { finalPath = path.join(DIST, 'index.html'); }
    }
    const buf = await fs.readFile(finalPath);
    const ext = path.extname(finalPath).slice(1);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.end(buf);
  } catch { res.statusCode = 404; res.end('Not found'); }
});
const port = 5050;
await new Promise(r => server.listen(port, r));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
const page = await browser.newPage();

function selectorsFor(p) {
  if (p === '/') {
    // Home hero and action cards visible (from Home.jsx)
    return ['.home-container .hero-title', '.action-card', '.info-section']; // :contentReference[oaicite:0]{index=0}
  }
  if (p.startsWith('/mock-test')) {
    // Mock subject grid or setup header (from MockTest.jsx)
    return ['.subject-grid .subject-card', '.cw-header .view-title']; // :contentReference[oaicite:1]{index=1}
  }
  if (p.startsWith('/chapter-wise')) {
    // Chapter-wise: hero title or chapter header (from ChapterWise.jsx)
    return ['.cw-hero-title', '.cw-header .view-title', '.subject-grid .subject-card']; // :contentReference[oaicite:2]{index=2}
  }
  if (p.startsWith('/boards')) {
    // Boards: headers and lists (from BoardQuestions.jsx)
    return ['.board-list-header', '.board-group-title', '.search-input-wrapper']; // :contentReference[oaicite:3]{index=3}
  }
  // Fallback: any MCQ card (shared components)
  return ['.mcq-card']; // 
}

async function waitForContent(page, routePath) {
  const sels = selectorsFor(routePath);
  for (const s of sels) {
    try {
      await page.waitForSelector(s, { timeout: 15000 });
      return;
    } catch { /* try next */ }
  }
  // final guard: ensure #root has meaningful text
  await page.waitForFunction(() => {
    const el = document.querySelector('#root');
    if (!el) return false;
    const t = el.innerText.replace(/\s+/g,' ').trim();
    return t.length > 120;
  }, { timeout: 15000 }).catch(() => {});
}

function injectHead(html, r) {
  const BASE = process.env.SITE_BASE_URL || 'https://labmcq.com';
  let out = html.replace(/<link rel="canonical"[^>]*>/g, '');
  out = out.replace('<head>', `<head><link rel="canonical" href="${BASE}${r.path === '/' ? '' : r.path}">`);
  if (r.title) out = out.replace(/<title>.*?<\/title>/, `<title>${r.title}</title>`);
  return out;
}

for (const r of ROUTES) {
  const url = `http://localhost:${port}${r.path}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await waitForContent(page, r.path);
    const html = await page.content();

    const rel = r.path === '/' ? '' : r.path.replace(/^\//, '');
    const outFile = r.path === '/' ? path.join(DIST, 'index.html') : path.join(DIST, rel, 'index.html');
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, injectHead(html, r), 'utf-8');
    console.log('SSG:', r.path);
  } catch (e) {
    console.error('SSG failed:', r.path, e.message);
  }
}

await browser.close();
server.close();
console.log('SSG done');

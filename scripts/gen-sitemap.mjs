import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.SITE_BASE_URL || 'https://labmcq.com';

async function readRoutes() {
  const candidates = [
    path.join(ROOT, 'src', 'config', 'routes.json'),
    path.join(ROOT, 'src', 'routes.json')
  ];
  for (const p of candidates) {
    try { return JSON.parse(await fs.readFile(p, 'utf-8')); } catch {}
  }
  throw new Error(`routes.json not found. Expected at: ${candidates.join(' , ')}`);
}
const routes = (await readRoutes()).filter(r => r.index !== false);

const now = new Date().toISOString();
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => {
  const loc = `${BASE_URL}${r.path === '/' ? '' : r.path}`;
  const pri = r.path === '/' ? '1.0' : '0.7';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${pri}</priority>
  </url>`;
}).join('\n')}
</urlset>
`;
const outPath = path.join(ROOT, 'public', 'sitemap.xml');
await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, xml, 'utf-8');
console.log('Sitemap written:', outPath);

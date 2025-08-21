import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = process.env.SITE_BASE_URL || 'https://labmcq.com';

const routes = JSON.parse(
  await fs.readFile(path.join(ROOT, 'src', 'routes.json'), 'utf-8')
);

const indexPath = path.join(DIST, 'index.html');
let template = await fs.readFile(indexPath, 'utf-8');

// Ensure canonical placeholder exists
if (!template.includes('rel="canonical"')) {
  template = template.replace(
    '<head>',
    `<head><link rel="canonical" href="${BASE_URL}">`
  );
  await fs.writeFile(indexPath, template, 'utf-8');
}

for (const r of routes) {
  try {
    const url = r.path;
    const rel = url === '/' ? '' : url.replace(/^\//, '');
    const outFile =
      url === '/' ? path.join(DIST, 'index.html') : path.join(DIST, rel, 'index.html');

    let html = template
      .replace(/<link rel="canonical"[^>]*>/g, '')
      .replace(
        '<head>',
        `<head><link rel="canonical" href="${BASE_URL}${url === '/' ? '' : url}">`
      );

    if (r.title) {
      html = html.replace(/<title>.*?<\/title>/, `<title>${r.title}</title>`);
    }

    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, html, 'utf-8');
    console.log('Exported', url);
  } catch (e) {
    console.error('Prerender failed', r.path, e);
  }
}

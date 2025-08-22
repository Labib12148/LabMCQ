import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from '../dist/server/entry-server.js';
import { routes } from './routes.js';

// Minimal localStorage polyfill for server-side rendering
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const template = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');

for (const { path: route, title } of routes) {
  const appHtml = render(route);
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  html = html.replace(
    /<link rel="canonical" href="https:\/\/labmcq.com\/" \/>/,
    `<link rel="canonical" href="https://labmcq.com${route}" />`
  );
  html = html.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

  const filePath = path.resolve(
    __dirname,
    '../dist',
    route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

const baseUrl = 'https://labmcq.com';
const lastmod = new Date().toISOString();
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map(({ path: r }) => `  <url><loc>${baseUrl}${r}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.resolve(__dirname, '../dist/sitemap.xml'), sitemap);

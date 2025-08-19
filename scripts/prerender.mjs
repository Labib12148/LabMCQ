import fs from 'fs/promises';
import path from 'path';
import routes from '../config/routes.json' assert { type: 'json' };
import { render } from '../dist/server/entry-server.js';

const dist = path.resolve('dist');
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const templateNoTitle = template.replace(/<title>.*?<\/title>/s, '');

for (const r of routes) {
  const url = r.path;
  const { html, head, htmlAttrs, bodyAttrs } = render(url);
  let page = templateNoTitle.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  page = page.replace('<head>', `<head>${head}`);
  if (htmlAttrs) {
    page = page.replace('<html lang="bn">', `<html ${htmlAttrs}>`);
  }
  if (bodyAttrs) {
    page = page.replace('<body>', `<body ${bodyAttrs}>`);
  }
  const filePath = path.join(dist, url === '/' ? 'index.html' : `${url.replace(/^\//, '')}/index.html`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, page);
  console.log('Prerendered', url);
}

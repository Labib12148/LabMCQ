import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { chromium } from 'playwright';

const routes = JSON.parse(fs.readFileSync('config/routes.json', 'utf-8'));
const distDir = path.resolve('dist');

const server = spawn('npx', ['vite', 'preview'], { stdio: 'ignore' });
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await wait(1000);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const route of routes) {
    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle' });
    const html = await page.content();
    const outPath = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route, 'index.html');
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    await fs.promises.writeFile(outPath, html);
  }
  await browser.close();
  server.kill();
})();

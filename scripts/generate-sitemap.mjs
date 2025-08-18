import fs from 'fs';
const routes = JSON.parse(fs.readFileSync('config/routes.json', 'utf-8'));
const base = 'https://labmcq.com';
const urls = routes.map(r => `  <url><loc>${base}${r}</loc></url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.writeFileSync('public/sitemap.xml', xml);

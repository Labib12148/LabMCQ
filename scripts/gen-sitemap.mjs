import fs from 'fs/promises';
import routes from '../config/routes.json' assert { type: 'json' };

const BASE_URL = 'https://labmcq.example.com';
const urls = routes.filter(r => r.index !== false).map(r => `  <url><loc>${BASE_URL}${r.path}</loc></url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
await fs.writeFile('public/sitemap.xml', xml);
console.log('sitemap generated');

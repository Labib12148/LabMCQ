import fs from 'fs';
import path from 'path';

const baseUrl = process.env.SITE_ORIGIN || 'https://labmcq.com';
const staticRoutes = ['/', '/chapter-wise', '/about', '/contact', '/privacy'];

const dataDir = path.join(process.cwd(), 'src', 'data');
const subjects = fs.readdirSync(dataDir).filter((d) => d.endsWith('-mcq'));
const chapterRoutes = [];

for (const subjectFolder of subjects) {
  const subject = subjectFolder.replace('-mcq', '');
  const folderPath = path.join(dataDir, subjectFolder);
  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.json'));
  const chapters = new Set();

  for (const file of files) {
    try {
      const filePath = path.join(folderPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let firstQuestion;
      if (Array.isArray(data)) firstQuestion = data[0];
      else if (data.questions && data.questions.length) firstQuestion = data.questions[0];
      if (!firstQuestion || !firstQuestion.chapter) continue;
      chapters.add(String(firstQuestion.chapter));
    } catch (e) {
      console.error('Failed to parse', file, e);
    }
  }

  for (const ch of chapters) {
    chapterRoutes.push(`/chapter-wise/${subject}/${ch}/practice`);
  }
}

const urls = [...staticRoutes, ...chapterRoutes]
  .map((r) => `  <url><loc>${baseUrl}${r}</loc></url>`) 
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync(path.join('public', 'sitemap.xml'), xml);
console.log('Sitemap generated with', staticRoutes.length + chapterRoutes.length, 'urls');

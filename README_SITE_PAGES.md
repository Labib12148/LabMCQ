# Site Pages & SEO additions

This repo now includes standalone informational pages and supporting scripts:

## Pages
- **About** – Bangla mission statement and team info `/about`
- **Contact** – Netlify form at `/contact`; successful submits redirect to `/contact/success`
- **Privacy Policy** – Bangla policy with English mirror at `/privacy`
- **404** – Friendly not found page

Copy is inline in each page component under `src/pages/` and can be edited there.

## Netlify Forms
The contact form uses [Netlify Forms](https://docs.netlify.com/forms/setup/) – no backend code required. Netlify detects the form via the attributes `data-netlify="true"` and `netlify-honeypot`.

## Sitemap generation
Before builds, `npm run prebuild` runs `scripts/generate-sitemap.mjs` which scans available subject chapters and writes `public/sitemap.xml`. Robots.txt references this sitemap.

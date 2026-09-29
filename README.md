# Vezemo.pl — збірка для Render

У цій версії додано SEO-підготовку, Meta Ads tracking та оновлену hero-обкладинку без людей.

## Додано
- `robots.txt`
- `sitemap.xml`
- canonical URL
- SEO title/description
- Open Graph / Twitter meta
- Schema.org `MovingCompany`
- `noindex` для `/admin` та `/api/admin`
- Meta Pixel integration
- Meta Conversions API для `Lead`
- cookie-consent для marketing cookies
- події: `PageView`, `FormStart`, `QuoteCalculated`, `PhoneClick`, `ContactClick`, `Lead`
- збереження `utm_*`, `fbclid`, `_fbp`, `_fbc`
- нова сучасна обкладинка Варшави без людини

## Render
Build Command: `npm install`

Start Command: `npm start`

Health Check Path: `/api/health`

Persistent Disk mount path: `/var/data`

### Environment variables
- `NODE_ENV=production`
- `DB_PATH=/var/data/db.json`
- `UPLOAD_DIR=/var/data/uploads`
- `SESSION_SECRET` — випадковий довгий рядок
- `PUBLIC_BASE_URL=https://vezemo.pl`
- `META_PIXEL_ID` — ID Pixel з Meta Events Manager
- `META_ACCESS_TOKEN` — токен Conversions API
- `META_TEST_EVENT_CODE` — необов'язково, лише для тестування

Після деплою додайте `https://vezemo.pl/sitemap.xml` у Google Search Console та перевірте події в Meta Events Manager → Test Events.

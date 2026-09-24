# Kleenest Bistro — Cloudflare Pages website

A custom, responsive static restaurant website designed for direct deployment to Cloudflare Pages.

## Before publishing

The public Facebook page could not be read automatically. Review these owner-controlled details:

1. **Address** in `index.html` — currently “Quezon Avenue, Zone 1, Digos City”.
2. **Hours** in `index.html` and `app.js` — currently 10:00 AM–10:00 PM daily.
3. **Menu and prices** in `menu-data.js` — drink prices were transcribed from a historical public menu photo; verify all current pricing.
4. **Messenger link** — currently uses Facebook Page ID `61568656615106`.
5. **Photography** — remote Unsplash editorial images are included as polished placeholders. Replace them with original Kleenest Bistro photos before the final public launch for a fully authentic site.
6. **Open Graph URL** in `index.html` — replace `https://kleenest-bistro.pages.dev/` with your final domain.

## Fastest deployment: Cloudflare Pages direct upload

1. Sign in to Cloudflare.
2. Open **Workers & Pages**.
3. Select **Create application** → **Pages** → **Upload assets**.
4. Upload the contents of this folder, or upload the included ZIP after extracting it.
5. Set the project name to `kleenest-bistro` or your preferred name.
6. Deploy.

There is no build command and no output folder because this is a static site.

## Git deployment

Push this folder to GitHub, then connect the repository in Cloudflare Pages.

- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`

## Wrangler deployment

```bash
npm install
npx wrangler login
npm run deploy
```

## Editing the content

- Main text, location, hours, links: `index.html`
- Menu items and prices: `menu-data.js`
- Colors, spacing, responsive layout: `styles.css`
- Interaction and open/closed status: `app.js`
- Logo: `assets/kleenest-mark.svg`

## Replace photos

Search `index.html` for `images.unsplash.com` and replace each URL with a local image path such as:

```html
<img src="assets/food/herb-steak.webp" alt="Kleenest Bistro herb steak" />
```

For best performance, export real restaurant photos as WebP at approximately 1600 px for hero images and 900–1200 px for gallery images.

## Included production details

- Mobile navigation and sticky mobile actions
- Searchable/filterable menu
- Dynamic open/closed status using Philippine time
- Reservation flow that copies details and opens Messenger
- Responsive gallery lightbox
- OpenStreetMap location embed
- PWA manifest and service worker
- Security and caching headers for Cloudflare Pages
- SEO and social sharing metadata
- Reduced-motion accessibility support

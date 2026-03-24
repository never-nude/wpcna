# WPCNA Site

Modern static website rebuild for the White Plains Council of Neighborhood Associations, focused on clean event discovery and simple long-term maintenance.

## Project Structure

```text
wpcna-site/
├── .eleventy.js
├── package.json
├── src/
│   ├── index.njk
│   ├── about/index.njk
│   ├── events/index.njk
│   ├── events/event.njk
│   ├── _data/
│   │   ├── site.json
│   │   ├── navigation.json
│   │   ├── resources.json
│   │   ├── events.json
│   │   └── eventStore.js
│   ├── _includes/
│   │   ├── layouts/base.njk
│   │   └── components/
│   └── assets/
│       ├── css/styles.css
│       ├── js/site.js
│       └── img/
└── _site/ (generated)
```

## How To Run Locally

```bash
npm install
npm run start
```

Eleventy will serve the site locally and watch for changes.

## How To Build

```bash
npm run build
```

The production-ready static site will be generated in `_site/`.

## GitHub Pages

This project is configured to publish as a GitHub Pages project site at:

`https://never-nude.github.io/wpcna/`

In production, the build uses the `/wpcna/` path prefix so links and assets resolve correctly on GitHub Pages.

## How To Edit Or Add Events

All event content lives in [`src/_data/events.json`](./src/_data/events.json).

Each event follows the same structure:

- `id`
- `slug`
- `title`
- `category`
- `shortSummary`
- `fullDescription`
- `startDate`
- `endDate`
- `startTime`
- `endTime`
- `locationName`
- `locationAddress`
- `image`
- `flyerPdf`
- `externalUrl`
- `ctaLabel`
- `featured`
- `status`
- `tags`
- `organizer`
- `sourceUrl`
- `sourceLabel`

### Recommended workflow

1. Duplicate a similar event object in `events.json`.
2. Update the `id` and `slug` so they are unique.
3. Keep `shortSummary` brief enough for cards.
4. Put longer context in `fullDescription`.
5. Set `status` to `upcoming` or `past`.
6. Choose the most useful primary action:
   - `externalUrl` for registration, ticketing, or official details
   - `flyerPdf` if the flyer is the main resource
7. Set `featured` to `true` if the event should appear in the home page spotlight.

### Notes

- If the exact time is unknown, set `startTime` and `endTime` to `null`.
- If an event has both an official page and a flyer, use the official page as the primary action and keep the flyer as a secondary resource.
- The Events page automatically separates `upcoming` and `past` items.
- Detail pages are generated automatically from the event data.

## Other Editable Content

- Site-wide organization info: [`src/_data/site.json`](./src/_data/site.json)
- Header navigation: [`src/_data/navigation.json`](./src/_data/navigation.json)
- Home/About resource cards: [`src/_data/resources.json`](./src/_data/resources.json)

## Deployment

This is a plain static site, so it can be deployed to any static host:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Any traditional web host that serves static files

Typical deployment flow:

1. Run `npm install`
2. Run `npm run build`
3. Publish the `_site/` directory

## Content Sourcing Notes

This rebuild uses the current WPCNA site strictly as a content source, not a design reference.

The event dataset combines:

- WPCNA's existing local-events and workshop materials pages
- Official White Plains partner sources such as:
  - City of White Plains
  - White Plains Public Library
  - White Plains BID
  - White Plains Performing Arts Center

That mix gives the site a healthier launch set of upcoming events while keeping WPCNA's neighborhood context front and center.

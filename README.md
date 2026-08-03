# Life Care Planner Directory

A static directory website listing qualified Life Care Planners (LCPs) across the United States and Canada. Built with Astro and Tailwind CSS, deployed on Cloudflare Pages.

---

## Overview

This project is a proof-of-concept directory for Life Care Planning professionals. It generates over 1,400 static HTML pages from a dataset of approximately 964 providers, organized by state and major metropolitan city. The site is designed for SEO-first static hosting with no backend or database required.

The directory serves two audiences:

- **Consumers and legal professionals** looking for a qualified Life Care Planner in a specific state or city
- **Life Care Planners themselves**, who are exposed to a platform promotion banner on every listing page

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Astro 4.x (static site generation) |
| Styling      | Tailwind CSS                        |
| Language     | TypeScript                          |
| Data Import  | Python 3 (CSV to JSON)              |
| Maps         | Leaflet.js + OpenStreetMap (free)   |
| Avatars      | ui-avatars.com (free)               |
| Hosting      | Cloudflare Pages                    |

---

## Project Structure

```
cloudflare-medical-directory/
├── public/                  Static assets (favicon, robots.txt)
├── scripts/
│   └── import.py            Python script to convert CSV to providers.json
├── src/
│   ├── components/          Reusable Astro components
│   │   ├── Header.astro         Navigation with dropdown menus
│   │   ├── Footer.astro         Footer with state links
│   │   ├── USAMapSVG.astro      Clickable SVG USA map
│   │   ├── LocationMap.astro    Interactive Leaflet map with pin markers
│   │   ├── ProviderCard.astro   Provider profile card
│   │   ├── SponsoredBanner.astro  Top banner for featured providers
│   │   ├── PlatformBanner.astro   Bottom banner promoting the LCP platform
│   │   ├── Breadcrumb.astro     Breadcrumb navigation
│   │   └── ContactForm.astro    Contact form
│   ├── data/
│   │   └── providers.json   Generated provider dataset (964 providers)
│   ├── layouts/             Base HTML layout
│   ├── pages/
│   │   ├── index.astro              Homepage
│   │   ├── locations.astro          All states listing with SVG map
│   │   ├── [state]/index.astro      State listing page
│   │   ├── [state]/[city]/index.astro    City listing page
│   │   ├── [state]/[city]/[slug].astro   Individual provider page
│   │   ├── what-is-life-care-planning.astro
│   │   ├── who-are-life-care-planners.astro
│   │   ├── contact.astro
│   │   └── privacy-policy.astro
│   ├── styles/
│   │   └── global.css       Global styles and Tailwind directives
│   ├── types/
│   │   └── provider.ts      TypeScript interface for provider data
│   └── utils/
│       └── data.ts          Data access helpers (getProvidersByState, etc.)
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Python 3 (only needed if regenerating provider data)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the dev server at `http://localhost:4321` (or the next available port).

### Build

```bash
npm run build
```

Generates all static pages into the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Data Import

Provider data is stored in `src/data/providers.json`. To regenerate it from a new CSV file:

1. Place your CSV file in the project root as `input.csv`
2. Run the import script:

```bash
npm run import-data
```

Or directly:

```bash
python3 scripts/import.py
```

The script reads the CSV, normalizes state and city names into URL-friendly slugs, generates avatar image URLs, and outputs `providers.json`.

---

## URL Structure

All URLs are SEO-friendly and follow this hierarchy:

```
/                                    Homepage
/locations                           All states
/what-is-life-care-planning          Informational article
/who-are-life-care-planners          Planner types and qualifications
/contact                             Contact form
/privacy-policy                      Privacy policy

/[state]                             e.g. /florida
/[state]/[city]                      e.g. /florida/miami
/[state]/[city]/[provider-slug]      e.g. /florida/miami/john-doe-clcp
```

---

## Maps

Two map components are used on the homepage and locations page:

**USAMapSVG.astro** — A hand-coded SVG map of all 50 US states. Each state shape is clickable and navigates to the corresponding state listing page. States with providers are highlighted in blue.

**LocationMap.astro** — An interactive Leaflet.js map using free OpenStreetMap tiles. Each state with providers gets a pin marker positioned at the state's geographic centroid. Hovering a pin shows the state name and provider count. Clicking opens a popup with a link to the state page.

Both maps require no API keys.

---

## Page Layout Conventions

Each state listing page follows this structure:

1. Breadcrumb navigation
2. Page heading with provider count
3. Sponsored provider banner (top 3 providers in the state)
4. City grid — links to city-level pages
5. Platform banner — promotes the LCP enablement platform to practitioners

---

## Deployment on Cloudflare Pages

1. Push this repository to GitHub
2. Log in to Cloudflare Pages and create a new project
3. Connect your GitHub repository
4. Set the following build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy

No environment variables are required for the base site. Add a `.env` file based on `.env.example` if integrating additional services.

---

## Customization

**Adding providers** — Update `input.csv` and re-run `npm run import-data`.

**Changing the theme color** — Edit the `brand` color values in `tailwind.config.mjs`.

**Updating the platform banner** — Edit `src/components/PlatformBanner.astro`.

**Updating the sponsored banner logic** — Edit `src/components/SponsoredBanner.astro`.

---

## License

Private project. All rights reserved.

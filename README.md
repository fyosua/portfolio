# Yosua Ferdian Portfolio

Personal portfolio site built with [Next.js](https://nextjs.org/) (App Router) backed by a Symfony/FrankenPHP API.

## Architecture

```
yosuaf.com (cloudflared) → localhost:3000 → Next.js (systemd)
api.yosuaf.com (cloudflared) → localhost:80 → FrankenPHP/Symfony (Docker)
PostgreSQL 16 → portfolio-api-database-1 (Docker, host port floats on restart)
```

- **Frontend**: `/portfolio` — Next.js 14 (App Router), React 18, Tailwind, Radix UI
- **Backend**: `/portfolio-api` — Symfony 7.1, API Platform 3.3, FrankenPHP, PostgreSQL 16
- **Tunnel**: Cloudflared (`yosuaf-tunnel`) — routes `yosuaf.com`/`www.yosuaf.com` → FE, `api.yosuaf.com` → BE

## Google Tag Manager

GTM is integrated via `@next/third-parties/google` (official Next.js utility):

- **Layout**: `GoogleTagManager` component in root layout (`src/app/layout.tsx`) — renders gtm.js script in `<head>` and noscript iframe in `<body>`
- **GTM ID**: `NEXT_PUBLIC_GTM_ID` from `.env.local`

### Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `download_cv_click` | Download CV button click | `{ category: 'Engagement', label: 'Resume Download' }` |

### SPA Tracking

Next.js App Router uses client-side navigation — GTM's default Page View trigger fires only on hard navigation. Configure GTM triggers as **History Change** (Fire On: All History Changes) to capture SPA route transitions.

Events are pushed via `sendGTMEvent()` from `@next/third-parties/google`. GTM variables can read `event`, `category`, and `label` keys from the dataLayer.

### TypeScript

A global type declaration exists at `src/types/gtm.d.ts`:

```ts
interface Window {
  dataLayer: Array<Record<string, any>>;
}
```

## Development

```bash
# Frontend
cd portfolio
npm install
npm run dev    # local dev server on :3000

# Backend
cd portfolio-api
docker compose up -d   # FrankenPHP on :80
```

## Production Deploy

```bash
cd portfolio
npm run build
sudo systemctl restart yosuaf-portfolio.service
```
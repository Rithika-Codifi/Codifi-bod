# BOD Monitor

React PWA that monitors daily Beginning-of-Day (BOD) sanity checks (ETL jobs + API checks) for
17 stock brokers. Runs on mock data by default (`VITE_USE_MOCK=true`); set it to `false` and
`VITE_API_BASE_URL` to use the real API.

## Run

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # production build in dist/ (PWA + service worker)
npm run preview    # serve the build
```

## Checks

```bash
npm run lint
npm test           # Vitest + React Testing Library
npx playwright install chromium
npm run visual     # pixel diff of every screen vs docs/design (390px)
npm run a11y       # axe-core on every screen
```

## Deploy (Vercel)

Import the repo; `vercel.json` sets the Vite build, SPA rewrites and service-worker headers.
No environment variables are required for the mock build.

Architecture, design rules and conventions: see [CLAUDE.md](./CLAUDE.md).

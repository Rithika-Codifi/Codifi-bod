# BOD Monitor — React PWA (web + mobile + installable)

Monitors daily Beginning-of-Day (BOD) sanity checks (ETL jobs + API checks) for 17 stock brokers.
Build the UI first on mock data. The real API plugs in later by swapping one switch, with no UI changes.

## 1. Design reference: PIXEL-EXACT on mobile

- Screenshots (390px, 1x): `docs/design/1-overview.png` · `2-customers.png` ·
  `3-customer-detail.png` · `4-module-checks.png` · `5-report.png`
- Exact source: `docs/design/source/*.html` (one file per screen, original CSS, mock data).
  Take every font size, weight, line-height, letter-spacing, padding, margin, border width,
  color, icon size and text from these files. Never estimate from the image when the
  source has the value.
- At 390px wide every screen must be visually identical to its screenshot: same layout,
  spacing, typography, colors, icons, copy, order and line breaks. No added or removed
  elements, no "improvements", no rounded corners, no shadows.
- Tailwind: use arbitrary values (e.g. `text-[13px] tracking-[0.12em] px-[18px]`) or tokens
  whenever the default scale doesn't match. Exactness beats a tidy scale.
- Tablet/desktop layouts (section 7) are adaptations; mobile stays exact.
- Open a screenshot or source file only for the screen being built or verified.

## 2. Stack (do not deviate)

Vite + React 18 + TypeScript (strict) · React Router v6 (lazy routes) · TanStack Query v5
(server state) · Zustand (UI state only) · Tailwind CSS with CSS-variable tokens ·
vite-plugin-pwa (Workbox) · axios · lucide-react · ESLint flat config (typescript-eslint,
react-hooks, jsx-a11y, import order, eslint-plugin-boundaries) + Prettier + husky +
lint-staged · Vitest + React Testing Library · Playwright + pixelmatch (visual checks).

## 3. Architecture: Feature-first · Clean Architecture · MVVM · Unidirectional Data Flow

src/
app/
providers/ QueryClient, Router, Theme, DI providers
di/ container.ts: wires repository implementations (mock | http) by VITE_USE_MOCK
routes.tsx lazy-loaded routes
core/ framework-agnostic shared kernel
domain/ shared entities and value objects (Status, TimeIST), Result<T, AppError>
network/ axios instance, interceptors, error mapping → AppError
utils/ formatters (IST time, Indian numbers like 1,24,880), cn()
config/ env.ts, constants, status.ts (status → colors/label)
shared/ reusable presentation only
ui/ pure components (props in, JSX out, no fetching, no business logic)
layout/ AppShell, BottomNav, SideNav, PageHeader, BackLink
hooks/ useMediaQuery, useDebounce, useOnlineStatus
features/<overview | customers | customer-detail | module-checks | reports>/
domain/ pure TypeScript, no React, no axios
entities/ Customer, EtlJob, Module, ApiCheck, TestRun, ...
repositories/ interfaces
usecases/ one per action: GetCustomers, RetestFailedChecks, ...
data/
dto/ API response shapes
mappers/ DTO ↔ entity
datasources/ remote (axios) and mock
repositories/ implementations of the domain interfaces
presentation/
viewmodels/ use*ViewModel.ts
views/ *View.tsx (screen)
components/ feature-specific presentational components
state/ intents, UI state types, reducer or zustand slice
index.ts public API: route view + types only
mocks/ seed data identical to the screenshots, 300–600 ms delay
styles/ tokens.css, globals.css

Dependency rule: presentation → domain ← data. Domain imports nothing from data,
presentation, React or axios. Features import other features only through index.ts.
Enforce with eslint-plugin-boundaries.

MVVM

- View: renders `state` from its ViewModel and calls `onIntent(...)`. No logic, no fetching,
  no data useEffect.
- ViewModel: the only place for screen logic. Calls use cases via TanStack Query
  (useQuery/useMutation), merges server state with UI state, returns `{ state, onIntent }`.
- Model: entities + use cases + repositories, obtained from the DI container (`useDI()`),
  never instantiated in components.

UDF
View --intent--> ViewModel --use case--> Repository --data--> ViewModel --state--> View

- Intents: typed discriminated union per screen, e.g.
  `{ type: 'search'; q: string } | { type: 'filter'; status: StatusFilter } | { type: 'open'; id: string }`.
- UI state: one immutable typed object per screen, updated only by a pure reducer or zustand
  actions: `{ status: 'loading' | 'error' | 'empty' | 'success', data, filter, query, ... }`.
- Server state lives only in TanStack Query. Never copy it into zustand.
- Side effects (navigation, toasts, retest) run in the ViewModel, never in the View.
- Retest: mutation with optimistic "running" state (spinner), then invalidate related queries.

Keep it lean: thin use cases, no extra layers, no base classes or generic abstractions until a
second feature needs them. Query keys centralized per feature. `@/` aliases. Named exports,
except lazy-loaded views. Every screen handles loading (Skeleton), error (ErrorState with
retry) and empty (EmptyState). Semantic HTML, visible focus, 44px min touch targets.
No hard-coded colors outside tokens.

## 4. Visual language (exact values come from docs/design/source)

Colors:
bg #F3EFE6 · surface #FFFFFF · surface-muted #EFEAE0 · highlight #F6E6C8 · border #E2DBCD
text #1C1A17 · muted #5F594F · subtle #6E675C · accent #B5652E / #9A5424
pass #2E7A4E · tint #E6F2EA · ink #23633E
warn #C08A2B · tint #FBF1DC · ink #7A5A12
fail #B23B2E · tint #FBEAE7 · ink #962F24
running #2D5A86 · tint #E4ECF5 · ink #244B70
Provide a dark theme with the same token names (light theme is the one that must match).
Fonts (Google Fonts, with fallbacks): 'Source Serif 4' for page/section titles, often with one
italic muted word ("BOD Monitor _— today_", "Open API _checks_"); Inter for names and body;
'JetBrains Mono' for labels, meta, numbers, times, codes, paths.
Rules:

- Labels: mono, uppercase, small, wide letter-spacing, muted.
- Square corners on cards, buttons, badges, inputs. Only icons and dots are round.
- Cards: white, 1px border, no shadow. List rows separated by 1px dividers.
- Header: sticky, bg color, bottom border. Back links mono uppercase ("‹ CUSTOMERS").

Shared UI components (shared/ui):

- StatusBadge: outlined rectangle, mono uppercase bold; border = status color, bg = tint,
  text = ink (FAILED / WARNING / PASSED / RUNNING).
- StatusIcon: filled circle with white ×, !, or ✓. StatusDot: small filled dot.
- Button: primary = solid #1C1A17, white mono uppercase text; secondary = white with dark
  border. Optional leading icon, loading state; usually in full-width pairs.
- SegmentedBar: pass/warn/fail split by count, white mono count inside each segment,
  zero segments hidden.
- ProgressLine: thin bar under list items, status-colored, filled by ratio (may be segmented).
- FilterTabs: equal bordered cells with big count + small label; active = solid dark.
- FilterChips: wrapping bordered chips like "ALL · 34"; active = solid dark.
- StatCard, StatStrip, MetaGrid, ListRow, SectionHeader (serif title + mono right label),
  MethodChip (gray: POST/GET/PUT/DEL/WS), CodeBlock (dark bg, light mono, keeps line breaks),
  SearchInput, Timeline, EmptyState, Skeleton, ErrorState, Spinner, Toast.

## 5. Screens

1. `/` Overview (1-overview.png)
   - Header: logo (black square with red/amber/green dots), "BOD Monitor _— today_",
     mono "THU · 12 NOV 2026 · 07:42 IST", refresh icon, bell with red count badge (5).
   - Card "OVERALL BOD STATUS" + badge: large status icon with soft ring, serif
     "Action needed", "2 customers failed BOD · 3 have warnings", SegmentedBar 12/3/2,
     3-column legend (left color rule, label, count, %), divider, "VIEW ALL 17 CUSTOMERS →".
   - Card "BOD window": mono "MCX OPENS 09:00 · NSE 09:15"; Timeline (accent fill to now, black
     marker at now, red tick at cutoff), labels 05:30 start / 07:42 now (bold) / 08:30 cutoff
     (red); muted box "Sanity run 3 of 4 done · Last 07:38 · next auto run 08:00" with red
     "48m left"; buttons RETEST ALL FAILED (primary) + LATEST REPORT.
   - 2×2 StatCards: Failed checks 9 (highlight bg, red, "3 ETL · 6 API"), Warnings 14 (amber,
     "Delays · slow APIs"), ETL jobs done 130/136 (green, "/136" smaller muted), Avg run time
     3m 48s ("Per customer sanity").
   - Card "Needs attention · 5 items": StatusIcon, customer name, issue text, time, chevron.
2. `/customers` All customers (2-customers.png)
   - Back arrow, "Customers _— BOD status_", "17 BROKERS · UPDATED 07:42", overall badge.
   - SearchInput (debounced). FilterTabs: All 17 / Failed 2 / Warning 3 / Passed 12.
   - "SORTED BY SEVERITY" ... "LAST CHECK". Rows: StatusIcon, name, "ETL 6/8 · API 31/34",
     ProgressLine, badge + time on the right. Sort fail → warn → pass. Empty state on no match.
3. `/customers/:id` Customer detail (3-customer-detail.png)
   - Back "CUSTOMERS", large serif name + badge, mono "NSE · BSE · MCX · WEB · MOBILE · API".
   - StatStrip: ETL 6/8 · MODULES 7/9 · LAST RUN 07:38. Buttons RETEST FAILED + VIEW REPORT.
   - Card "ETL process" (right "UPLOAD → VALIDATE → LOAD"): 8 rows with StatusDot, name, mono
     meta (red when failed), badge, per-row retest icon.
   - Card "Modules" (right "CHECKS PASSED"): name, colored count "31/34", segmented
     ProgressLine, mono note, chevron → module page.
4. `/customers/:id/modules/:moduleId` Module checks (4-module-checks.png)
   - Back "CHOLAMANDALAM SEC." with "Module" on the right; "Open API _checks_" + badge;
     "Last check 07:38:12 · avg 182 ms"; SegmentedBar; legend "31 passed · 1 warning ·
     2 failed · of 34"; buttons RETEST FAILED + TEST REPORT; FilterChips.
   - Check rows: StatusDot, name, MethodChip + mono path, badge, retest icon; line
     "07:38:05 HTTP 502 30,000 ms · timeout" (code bold; latency red on fail, amber on warn).
     Failed rows: fail-tint background + bordered muted error box with message and accent
     "OPEN RESULT LOG →". Footer "Show N more passed checks".
5. `/reports/:runId` Test report (5-report.png)
   - Back "OPEN API" with "Run #4812" on the right; "Test report" + badge; subtitle
     "Cholamandalam Securities · Open API sanity".
   - MetaGrid 2×3: Trigger, Duration, Started, Finished, Environment, Suite.
   - Card "Result": "34 checks · 91.2% pass", SegmentedBar, "TODAY'S RUNS" tiles (time +
     status, tinted by status).
   - Serif section "Failures & warnings": one card per item with a top border in status
     color, name + badge, mono request line, message, CodeBlock log, mono hint.
   - Card "All checks · Showing 10 of 34": table CHECK / TIME / RESULT (PASS/FAIL colored mono).
   - Bottom action bar: PDF · Share (Web Share API, copy-link fallback) · Retest.
     BottomNav on main screens: Overview, Customers, Reports (icon + label, active = dark),
     styled exactly as in the source files.

## 6. Mock data

Use every name, count, time, endpoint, message and log exactly as in the screenshots and
source files. 17 brokers: Cholamandalam Securities, Nirmal Bang, Alice Blue, Goodwill,
Findoc, Trustline Securities, Aditya Birla Money (ABML), GoPocket, Jainam Broking, IIFL,
Integrated, Rmoney, Muthoot Securities, Religare Broking, Bajaj Broking, Indira Securities,
Jio BlackRock Broking.

## 7. Responsive

- <768px: exactly as screenshots; sticky BottomNav with safe-area insets.
- 768–1023px: 2-column grids for stat cards, meta grid and list cards where sensible.
- ≥1024px: SideNav replaces BottomNav, content max-width 1200px; Overview 2 columns;
  detail screens put header/summary on the left and lists on the right.
  Same components and styling at every size; only layout changes.

## 8. PWA

Manifest (name "BOD Monitor", theme #1C1A17, background #F3EFE6, standalone), icons
generated from the logo (incl. maskable), app-shell precache, runtime caching for API GETs
(network-first), offline fallback page, "new version available" update toast, offline
banner via useOnlineStatus.

## 9. Visual verification (required for every screen)

- `npm run visual`: Playwright opens each route at viewport width 390, deviceScaleFactor 1,
  VITE_USE_MOCK=true, takes a full-page screenshot and diffs it against the matching
  `docs/design/*.png` with pixelmatch. Diffs saved to `visual-diffs/`.
- Deterministic rendering: freeze the clock at Thu 12 Nov 2026 07:42 IST, wait for
  `document.fonts.ready`, disable animations and transitions, hide the scrollbar.
- If heights differ, compare the overlapping area and report the height difference.
- Loop: run → open the diff image → fix the largest mismatches → rerun, until mismatch
  is under 1% or only font anti-aliasing remains. Report the final % per screen.

## 10. Execution: one phase per turn, then stop

P1 Scaffold, all configs (TS, ESLint incl. boundaries, Prettier, husky, lint-staged, Tailwind,
PWA, env, Playwright + pixelmatch + `visual` script), folder tree, and save this prompt as
CLAUDE.md. lint and build must pass.
P2 tokens.css + Tailwind theme + fonts (values from docs/design/source); core/network, DI
container, providers, router, AppShell, BottomNav/SideNav.
P3 shared/ui components with exact values from the source files.
P4 `customers` feature end-to-end (domain → data → presentation) as the reference
implementation, with unit tests for its use case, mapper and reducer. Run the visual loop
on /customers until it passes.
P5 overview, customer-detail, module-checks, reports, each following the `customers`
structure exactly. Build one, run the visual loop on it until it passes, then the next.
P6 PWA polish, a11y and Lighthouse pass, remaining tests, rerun `visual` for all 5 screens
and report the final mismatch % per screen.

Be concise: no code explanations unless asked. End each phase with only the changed
files and the commands run.

## Project notes (tooling facts)

- Phase status: P1–P6 done. All 5 screens built; `customers` is the reference feature.
- Scripts: `dev`, `build`, `lint`, `test`, `visual` (pixel diffs), `a11y` (axe, all routes),
  `pwa:assets` (icons). Lighthouse (mobile): Perf 89, A11y 95–100, Best practices 96, SEO 100;
  desktop Perf 100. Remaining Lighthouse items are design-mandated (10–11px mono labels).
- PWA: `src/app/pwa/PwaUpdater.tsx` (registers SW, "New version available · Reload" and
  "Ready to work offline" toasts; mounted in main.tsx so tests don't load the virtual module),
  `OfflineBanner` in AppShell, queries use `networkMode: 'offlineFirst'`. Workbox: app-shell
  precache + SPA navigate fallback; API GETs NetworkFirst (navigations excluded); navigations
  to `/api/*` fall back to `public/offline.html`.
- Theme defaults to the system preference; the desktop side nav has Light/Dark/Auto. The
  visual test forces light.
- Design sources were unpacked from the bundled "BOD Monitor — Mobile PWA.html". Each
  `docs/design/source/*.html` is a template: markup inline-styled, with `{{placeholders}}`,
  `<sc-for>`/`<sc-if>` loops, and the screen's mock data + logic in the trailing
  `<script type="text/x-dc">`. Frame sizes: 390×1400 / 1500 / 1760 / 1760 / 1800.
- Visual routes (tests/visual/screens.ts): `/`, `/customers`, `/customers/cholamandalam`,
  `/customers/cholamandalam/modules/open-api`, `/reports/4812`.
- Visual baselines: `npm run visual` diffs each route against (a) the design PNG and (b) the
  original design source (`docs/design/render/*.html`, self-unpacking bundles) rendered in the
  same Chromium. The PNGs were exported by a different engine with different sub-pixel line
  rounding, so even the original source scores 1.6–4.0% against them ("PNG floor"). A screen
  passes when vs-PNG < 1%, or when vs-source < 0.5% and vs-PNG ≤ floor + 0.1%.
- Restored UA defaults that preflight removes, because flex sizing depends on them:
  `button { padding: 1px 6px }`, `input { padding: 1px 2px }`.
- Shared DTO helpers (`StatusDto`, `statusFromDto`, `istTimeFromIso`) live in `core/network/dto.ts`.
- Retest pattern: `useMutation({ mutationKey })` + `useMutationState` (pending variables) →
  running ids overlaid in the pure selector, then invalidate related queries on settle.
  Mock data sources keep an in-memory store so a retest really turns items green.
- Tests may import across layers of their own feature (boundaries rule off for `*.test.ts(x)`);
  `src/test/testContainer.ts` builds a mock container with overrides.
- Visual harness waits until no `[data-skeleton]` or `[aria-busy="true"]` element remains.
  Run one screen with `SCREEN=customers npm run visual`. Results: `visual-diffs/report.json`.
- ESLint is pinned to v9 (eslint-plugin-jsx-a11y does not support v10). React pinned to 18.
- Tailwind v4 via `@tailwindcss/vite`; theme tokens live in CSS (`@theme`), no tailwind.config.
- PWA icons: `npm run pwa:assets` regenerates from `public/logo.svg`.
- Design screenshots are cropped at the frame height; the BottomNav (and report action bar)
  is below the crop in every PNG, so it is verified against source values, not pixels.
- Fonts are self-hosted from `public/fonts` (`src/styles/fonts.css`): the exact latin files the
  design used. The current Google Fonts CSS serves a different Source Serif 4 file with wider
  metrics, which wraps titles.
- The design PNGs were exported by a renderer that rounds fractional line boxes up
  (JetBrains Mono 11px `normal` ≈ 14.5px → 15px; Chromium floors to 14px). When a stacked mono
  line drifts 1px, pin it, e.g. `leading-[16px] -mb-[1px]` (see CustomerRow meta).
  Measure with an element-box dump of the original bundle vs localhost before tweaking.
- Navigation is plain `<Link>`s; the ViewModel provides `href`s (e.g. `row.href`). Intents
  cover state changes and side effects (search, filter, retry, retest).
- Feature `index.ts` exports the lazy view, its query keys (for cross-feature invalidation)
  and entity types.
- Tokens: `src/styles/tokens.css` (raw CSS vars, light + `[data-theme='dark']`) mapped to
  Tailwind in `globals.css` via `@theme inline`. Tailwind's default palette is removed, so only
  token colors (`bg-surface`, `text-fail-ink`, …) exist. Status → classes: `core/config/status.ts`.
- Preflight overrides to match sources: `html { line-height: normal }`, native placeholder color.
- Routes declare `handle: { showBottomNav }` (`RouteHandle` in `shared/layout/AppShell.tsx`).
  BottomNav is shown on Overview (`/`) only; every other route sets `showBottomNav: false`. The
  desktop SideNav is always shown. Never hide/show the nav from inside a screen.
- Reports tab is disabled: its entry in `shared/layout/navItems.ts` is commented out
  (`// disabled for now`). `/reports/:runId` (incl. `latest`) and every in-app report link
  (Latest report, View/Test report, Open result log, today's runs) must keep working.
- Checks screen is shared: `module-checks` serves `/customers/:id/modules/:moduleId` and
  `/customers/:id/etl/:etlId`. The ViewModel derives `source: { kind: 'module' | 'etl', id }`
  from the route params and calls `GetModuleChecks` or `GetEtlChecks`; query keys and
  `RetestChecks` take the source. Title, header right label ("Module") and back link
  (customer short name) come from the returned data.
- Tapping an ETL row must show exactly design screen 4 (`4-module-checks.png`: "Open API
  checks", "Module", 31 / 1 / 2 of 34). The ETL route is in `npm run visual` as `etl-checks`
  against that PNG and its source render.
- ETL rows on `/customers/:id` open that screen via the `openEtl` intent (navigation happens in
  the ViewModel). The whole row is the tap target (job-name button with a full-row `::after`
  overlay); the per-row retest icon sits above it (`z-[1]`) and must never navigate.
- ETL checks mock (`src/mocks/etlChecks.ts`) validates the ETL job, then returns the
  customer's Open API checks (the design screen 4 data).
- Repositories get registered in `app/di/container.ts`; ViewModels read them with `useDI()`.
- Dark color token is `dark` / `on-dark` (not `solid`: `border-solid` is Tailwind's border-style).
- Sources have NO box-sizing reset, so `globals.css` restores browser defaults: content-box
  everywhere (height/min-height exclude padding + border: a row with `min-height:66px;
padding:10px` is 87px tall), border-box for button/select/search inputs. Copy source values
  as-is; use `box-border` only where the source says `box-sizing: border-box`.
- Component values were checked by rendering the original self-unpacking bundles (from the
  Downloads HTML; extract with the `__bundler/manifest` gzip+base64 entries) in Chromium and
  pixel-diffing element screenshots against `/__ui` (dev-only gallery route).

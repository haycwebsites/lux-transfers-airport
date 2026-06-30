# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A HAYC client website built on the [hayc-websites-template](https://github.com/haycwebsites/hayc-websites-template). The template automatically pushes updates to a set of shared infrastructure files via automated PRs — those files must not be edited here (see below).

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # TypeScript check + Vite build (NOT for production)
npm run build:full     # Build + export config.json (use for production)
npm run lint           # ESLint
npm run preview        # Preview built app locally
npm run pull-config    # Fetch live config from S3 into src/config.ts
npm run sync-baseline  # Create baseline for pull-config merges
npm run export:config  # Export src/config.ts → dist/hayc/config.json
```

## Architecture

### Config system

All site content lives in [src/config.ts](src/config.ts). This file defines `LocaleString` objects (bilingual `{ el: string; en: string }`) and exports a typed `config` object. In dev, [src/hayc/use-remote-config.ts](src/hayc/use-remote-config.ts) uses this directly; in prod, it fetches `/hayc/config.json` (the exported version).

[src/hayc/config-context.tsx](src/hayc/config-context.tsx) exposes three helpers via `useHayc()`:
- `t(localeString)` — returns text in the current locale
- `img(path)` — returns the image path (use in `src=`)
- `cp(path)` — spreads click-to-edit attributes (see below)

Never hardcode strings in JSX. Every text value must come through `t(config.someField)`.

### Click-to-edit (CMS edit mode)

When the HAYC CMS opens the site with `?hayc-edit=true`, clicking any element wrapped with `{...cp('config.path')}` sends a `HAYC_FIELD_FOCUS` message to the parent iframe, which opens that field in the CMS sidebar. The `path` must exactly match the config key (e.g., `cp('heroConfig.mainTitle')`). All navigation/click events are suppressed in edit mode.

### Routing and layout

`src/App.tsx` wraps everything in `HaycProvider` (from config-context) and `BrowserRouter`. Pages live in `src/pages/`. Locale state (default: `'el'`) is managed in `HaycProvider` and toggled via `setLocale`.

### Adding a new config section

1. Add interfaces and values to [src/config.ts](src/config.ts)
2. Add to `RemoteConfig` interface and `defaultConfig` in [src/hayc/use-remote-config.ts](src/hayc/use-remote-config.ts)
3. Add export logic to [scripts/export-config.ts](scripts/export-config.ts)

## Files managed by the template

The following files are owned by the upstream template repo and kept in sync via automated PRs. **Do not edit them here** — any changes will be overwritten on the next sync. To change them, open a PR in `haycwebsites/hayc-websites-template`.

| File | Purpose |
|---|---|
| `.github/workflows/deploy.yml` | Production deploy pipeline |
| `.cursor/rules/hayc-config.mdc` | Cursor AI rules for config editing |
| `scripts/pull-config.ts` | Fetches live config from S3 |
| `scripts/sync-baseline.ts` | Creates merge baseline for pull-config |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.scripts.json` | TypeScript config |
| `postcss.config.js`, `eslint.config.js` | Build/lint config |
| `src/hayc/config-context.tsx` | `HaycProvider` and `useHayc()` hook |
| `src/hayc/use-analytics.ts` | Analytics integration |
| `src/hayc/use-contact-form.ts` | Contact form logic |
| `src/hayc/use-newsletter-form.ts` | Newsletter form logic |
| `src/components/ContactForm.tsx` | Contact form component |
| `src/components/NewsletterForm.tsx` | Newsletter form component |
| `digital-products.dummy.json` | Dummy data for digital products |

Everything else is per-repo and safe to edit freely: `src/config.ts`, `src/pages/`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/BookingWidget.tsx`, `src/components/LanguageSwitcher.tsx`, `src/App.tsx`, `src/main.tsx`, `src/hayc/use-remote-config.ts`, `scripts/export-config.ts`, `vite.config.ts`, `tailwind.config.js`, `src/index.css`, `index.html`, `package.json`, `public/` assets.

## Deployment

`deploy.yml` runs on push to main: pull-config → build:full → sync-baseline → commit → S3 upload → Cloudflare cache purge. Assets get 1-year immutable cache; `index.html` and `config.json` get short-lived cache.

## Tailwind / CSS

Semantic color tokens are defined as HSL CSS variables in `src/index.css` (`--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--radius`, etc.). `tailwind.config.js` maps these to Tailwind utilities. Theming is done by overriding the CSS variables.

## Path alias

`@/` resolves to `src/` in both TypeScript and Vite.

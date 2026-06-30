# CLAUDE.template.md

Template-repo guidance for Claude Code. This file is **only relevant in `haycwebsites/hayc-websites-template`** — it does not exist in derived repos.

For general architecture, commands, and config system docs, see [CLAUDE.md](CLAUDE.md) (which is the file seeded into derived repos).

## What this repo is

A React 19 + TypeScript + Vite template for HAYC client websites. Real sites live in derived repos (e.g., `haycwebsites/dekapus`). Changes to synced files here are automatically PR'd into all derived repos via `sync-template.yml`. The template repo itself does not deploy.

## File categories

Every file in this repo falls into one of three categories.

### 1. Synced — never edit in derived repos

These files are copied verbatim from the template to every derived repo via `sync-template.yml`. Edits in a derived repo are overwritten on the next sync. All changes must be made here.

The authoritative list is [sync-files.json](sync-files.json). The `paths:` trigger in [sync-template.yml](.github/workflows/sync-template.yml) must always mirror it — [validate-sync-config.yml](.github/workflows/validate-sync-config.yml) enforces this on every PR that touches either file.

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

### 2. Per-repo — seeded from template, customized per client

These files are copied when a new repo is created from this template but are never overwritten by syncs. They are expected to diverge per client site. This template provides sensible defaults.

- `package.json`, `vite.config.ts`, `tailwind.config.js`, `src/index.css`, `index.html`, `.gitignore`
- `src/config.ts` — all site content lives here
- `src/App.tsx`, `src/main.tsx`
- `src/hayc/use-remote-config.ts` — may need per-repo adjustments for custom config shapes
- `src/pages/` — all page components
- `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/ScrollToTop.tsx`, `src/components/BookingWidget.tsx`, `src/components/LanguageSwitcher.tsx`
- `src/lib/useTemplateInit.ts`
- `scripts/export-config.ts` — export logic tied to the per-repo config structure
- `public/` assets
- `CLAUDE.md` — seeded into derived repos as their Claude Code instructions

### 3. Template-only — not present in derived repos

These files only make sense here and are not copied to derived repos.

- `sync-files.json` — authoritative list of synced files
- `repos.json` — registry of all derived repos that receive syncs
- `.github/workflows/sync-template.yml` — pushes synced files to derived repos
- `.github/workflows/sync-repos-json.yml` — maintains the repos.json registry
- `.github/workflows/validate-sync-config.yml` — validates sync-files.json vs. workflow paths
- `CLAUDE.template.md` — this file

## Adding a new synced file

When a file should be owned by the template and pushed to all derived repos:

1. Add the file path to `sync-files.json`
2. Add the same path to the `paths:` trigger list in `.github/workflows/sync-template.yml`
3. Open a PR — `validate-sync-config.yml` will confirm the two lists match

The sync runs automatically on push to `main` when any listed file changes.

## Adding a new derived repo

Add the repo slug (e.g., `haycwebsites/newclient`) to `repos.json`. The `sync-repos-json.yml` workflow maintains this file automatically when new repos are created from the template, but it can also be edited manually.

## Adding a new config section

When adding a config field that all derived repos will share, update the template defaults:

1. Add interfaces and values to [src/config.ts](src/config.ts)
2. Add to `RemoteConfig` interface and `defaultConfig` in [src/hayc/use-remote-config.ts](src/hayc/use-remote-config.ts)
3. Add export logic to [scripts/export-config.ts](scripts/export-config.ts)

Derived repos will get the new field via sync (if the files above are synced) or will need to add it manually.

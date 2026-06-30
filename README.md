# HAYC Websites Template

A minimal React base for client websites on the HAYC platform. Each derived repo is a distinct site: its own layout, components, and content. This template only ships **shared infrastructure** (config loading, CMS edit mode, deploy/sync tooling) plus a few **optional, generic building blocks**—not a full visual design system.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS (semantic theme tokens in `src/index.css` + `tailwind.config.js`)

There is **no** component library in-repo: add your own UI (or bring shadcn/MUI/etc.) per site. Optional synced helpers:

- **`ContactForm`** — posts to the HAYC public contact API using `siteConfig.apiUrl` / `siteId` from config
- **`LanguageSwitcher`** — toggles Greek / English via `useHayc().locale`

---

## Creating a New Client Repo

1. Click **Use this template** on GitHub to create a new repository
2. Set the **`SITE_ID`** variable in the new repo → **Settings → Secrets and variables → Actions → Variables**
3. Register the new repo in **`repos.json`** in this template repository:

```json
{
  "repos": [
    "haycwebsites/existing-repo",
    "haycwebsites/new-repo"
  ]
}
```

4. Commit and push — the new repo is included in future template syncs

---

## Template Sync System

When selected paths change on **`main`**, **`sync-template.yml`** copies allowlisted files into each repo listed in **`repos.json`**, opens a PR, and relies on auto-merge where enabled.

### Flow

```
Commit to template (main)
        ↓
sync-template.yml (paths allowlist)
        ↓
For each repo in repos.json → clone → copy files from sync-files.json
        ↓
Branch + PR → auto-merge (if configured)
        ↓
Derived repo deploys via its own workflow
```

### Sync config files

| File | Purpose |
|------|---------|
| `repos.json` | Registry of derived repos that receive sync PRs |
| `sync-files.json` | Allowlist of file paths to copy |
| `.github/workflows/sync-template.yml` | Sync workflow |
| `.github/workflows/validate-sync-config.yml` | Ensures `sync-files.json` and `sync-template.yml` path lists stay aligned |

### What gets synced

Infrastructure that should stay consistent across sites (adjust the allowlist when you add shared files):

- `.github/workflows/deploy.yml`
- `.cursor/rules/hayc-config.mdc`
- `scripts/pull-config.ts`, `scripts/sync-baseline.ts`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.scripts.json`
- `postcss.config.js`, `eslint.config.js`
- `src/hayc/config-context.tsx`
- `src/components/LanguageSwitcher.tsx`, `src/components/ContactForm.tsx`

### What stays per-repo (not synced)

| Area | Reason |
|------|--------|
| `vite.config.ts` | Custom aliases, plugins |
| `tailwind.config.js`, `src/index.css` | Theme and branding |
| `src/hayc/use-remote-config.ts` | Config shape / `RemoteConfig` fields |
| `scripts/export-config.ts` | Which config slices are exported to `config.json` |
| `src/config.ts` | Site copy and settings |
| `src/App.tsx`, sections, pages, assets | Layout and UI |
| `index.html`, `public/*` | SEO, favicon, static files |
| `public/hayc/config.json` | Built/exported runtime config — do not blindly overwrite in client workflows |

### Adding a file to the sync

1. Add the path to **`sync-files.json`**
2. Add the same path under **`on.push.paths`** in **`sync-template.yml`**
3. Commit both — **`validate-sync-config.yml`** flags mismatches on PRs

### Token

The sync workflow uses a classic PAT stored as **`SYNC_TOKEN`** on the template repo (`repo` + `workflow` scopes). Rotate on a regular schedule.

---

## Project structure

```
├── .github/workflows/
│   ├── deploy.yml                 # S3 deploy (used by derived repos; template itself does not deploy)
│   ├── sync-template.yml
│   └── validate-sync-config.yml
├── public/
│   ├── hayc/config.json           # Exported config (per build / per repo)
│   └── …                          # Static assets (per repo)
├── scripts/
│   ├── export-config.ts           # Writes dist/public hayc/config.json from src/config.ts
│   ├── pull-config.ts             # Fetches live config from S3 into src/config.ts
│   └── sync-baseline.ts           # Baseline file for pull-config merges
├── src/
│   ├── hayc/
│   │   ├── config-context.tsx     # HaycProvider, useHayc, t(), cp() (synced)
│   │   └── use-remote-config.ts   # Fetches /hayc/config.json in prod (per repo)
│   ├── components/
│   │   ├── ContactForm.tsx        # Optional contact API integration (synced)
│   │   └── LanguageSwitcher.tsx   # Optional el/en switcher (synced)
│   ├── config.ts                  # Locale strings + siteConfig (per repo)
│   ├── App.tsx                    # Root layout shell (per repo)
│   ├── main.tsx
│   └── index.css                  # Tailwind + CSS variables (per repo)
├── repos.json
└── sync-files.json
```

---

## Notes

- **`LanguageSwitcher`** and **`ContactForm`** are safe to delete in a derived repo if you replace them with site-specific UI; keep the HAYC config patterns from `.cursor/rules/hayc-config.mdc` when you still use `useHayc()` and config-driven copy.
- The template repository should **not** deploy itself to a live client bucket; derived repos run **`deploy.yml`** with their own **`SITE_ID`**.
- To restore a file after a bad sync: `git show HEAD~1:<path> > <path>`
- User-facing strings should flow through **`t()`** and config; see **`hayc-config.mdc`** for click-to-edit (`cp()`) conventions.

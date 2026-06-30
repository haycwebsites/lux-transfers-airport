---
name: hayc-template-port
description: >-
  Port a bespoke design template (HTML/CSS/JS) into a HAYC client React repo,
  selecting only the pages the client needs. Use when converting a design
  template, theme, or static HTML site into a React/Vite/HAYC codebase, when
  recreating a template's look and feel in a client repo, or when wiring
  template markup into the HAYC config system.
disable-model-invocation: true
---

# HAYC Template Port

Convert a per-client design template (mostly HTML/CSS + jQuery animations) into a
HAYC React/Vite client repo, building only the handful of pages the client needs
(e.g. home, about, services, contact, blog).

## Core principle: reuse behavior + process, not design

Every client gets a **different** template, so the styled markup is bespoke and
cannot be shared. What repeats across clients is:

- **Behavior** — slider, counter, accordion, scroll-reveal, tabs, lightbox,
  sticky header, parallax. These are design-agnostic. Use headless React
  primitives/hooks and wire *this* template's markup to them. Never re-port
  jQuery logic by hand.
- **Process** — the steps below are identical for every template.

The template's CSS + markup stay per-client (organize them in `src/blocks/` or
`src/pages/`), with no expectation of cross-client reuse.

## Inputs to confirm before starting

- Path to the template folder and the React client repo.
- The 5–7 target pages to build.
- Styling strategy: **port the template CSS as-is** (fastest) vs **rebuild
  sections in Tailwind** (cleaner, themeable). Default to port-as-is unless told
  otherwise; rebuild a section in Tailwind only when you'd otherwise touch it.
- Locale handling (HAYC is bilingual `{ el, en }`). If translations aren't ready,
  put the same text in both `el` and `en`.

## Workflow

```
Port progress:
- [ ] Phase 0: Triage (no editor)
- [ ] Phase 1: Foundation (selective assets, CSS, theme tokens)
- [ ] Phase 2: Interactivity (reuse vs reimplement)
- [ ] Phase 3: Assemble pages + config
- [ ] Phase 4: QA (build + visual diff)
```

### Phase 0 — Triage (do this before writing code)

Don't open an editor. Inventory the template and produce a small map:

1. List the target pages.
2. For each page, list the **section types** it uses (hero, services grid,
   counters, team, pricing, testimonials, FAQ, CTA strip, gallery, blog grid,
   contact).
3. For each section type, find which template file has the **best** version. A
   template often hides the nicest variant on a non-default page (e.g. the
   testimonials carousel may only exist in `homepage-5`, not the main page).
4. Write a one-line-per-section map: `section → source file → config key`.

This prevents mid-build "where is the X section?" detours.

### Phase 1 — Foundation

Copy only what the target pages need. Treat each asset type differently:

- **HTML — copy nothing.** Read the specific target pages as reference and
  convert their sections to JSX. No HTML files land in the repo.
- **JS — copy no glue.** Always drop the template's bespoke initializer
  (`designesia.js` / `$(document).ready` glue), `vendor/`, and `form.js` +
  `handler.php` (HAYC provides form logic). Read them only as reference. Don't
  rewrite real libraries — see Phase 2 for the reuse-vs-reimplement rule.
- **Images/media — copy selectively, on demand.** Templates ship hundreds of
  demo assets. Copy only the images a section actually references, as you build
  that section. Reference them as `/images/...` from `public/`.
- **CSS — copy the shared bundle wholesale.** Template CSS is monolithic and
  shared across pages (e.g. `bootstrap.min.css`, `plugins.css`, `style.css`,
  color scheme); it is not cleanly page-splittable, so do **not** hand-pick
  rules. Copy the bundle into `public/`, link it from `index.html`, and
  optionally run a purge pass (PurgeCSS/UnCSS) against the built pages at the
  **end** to drop unused rules.
- **Fonts — follow the CSS, not the selective rule.** The stylesheets reference
  icon/web fonts (icofont, Font Awesome). If you keep the CSS but skip its
  fonts, icons break silently. Copy every font the bundled CSS references.
- **Theme tokens**: pull the template's color scheme / fonts into the HSL CSS
  variables in `src/index.css` (imported in `src/main.tsx`; `--primary`,
  `--secondary`, etc.). Most of the "look and feel" lives here — do it early.
  Use `src/index.css` for overrides too.
- **Metadata**: update `index.html` `<title>`, description, keywords,
  theme-color, favicon for the client.

### Phase 2 — Interactivity (reuse vs reimplement)

The template's interactivity is jQuery plugins driven by a bespoke glue file
tied to its DOM. The reason to replace it is **jQuery and React fight over the
DOM** (glue inits before React mounts; re-renders wipe plugin output;
StrictMode double-mounts; bundle bloat) — not that JS is bad. So always drop the
glue, then per behavior pick the cheapest reliable option. Don't load jQuery to
mutate React-owned DOM.

**Reimplement (trivial, ~10 lines, no dependency):**

| Effect | React replacement |
|---|---|
| simple fade carousel | `useState` + `setInterval` |
| `countTo` counters | `IntersectionObserver` + `requestAnimationFrame` |
| accordion | `useState` open-index component |
| WOW.js / animate.css | `IntersectionObserver` hook adding `animated` to `.wow` (respect `data-wow-delay`) |
| jarallax parallax | static covering background via CSS (`.jarallax-img { position:absolute; inset:0; object-fit:cover }`) |
| sticky header | scroll listener toggling a `smaller` class |

Keep `.wow` elements visible by default in CSS so content never disappears if JS
fails. Prefer importing shared headless versions over rewriting these.

**Reuse a maintained library (real widget — reimplementing would be redundant):**
full touch/drag sliders, lightboxes, masonry, complex carousels. Use the
library's React API (e.g. `swiper/react`) or init it in `useEffect` against a
`ref` with cleanup. Prefer the current npm version over the template's bundled
copy.

### Phase 3 — Assemble pages + config

All user-facing content goes through the HAYC config system — **never hardcode
strings in JSX**.

1. Add interfaces + values to `src/config.ts`. Text fields are
   `LocaleString { el, en }`; image paths are plain strings.
2. Register new sections in `src/hayc/use-remote-config.ts` (interface +
   `defaultConfig`) and `scripts/export-config.ts` (export object).
3. In JSX, read values via `useHayc()`:
   - `t(config.x)` for text
   - `img(path)` for image `src`
   - `{...cp('config.path')}` for click-to-edit (path must exactly match the
     config key, including array indices like `items.0.title`).

**Reduce config boilerplate**: if the repo still enumerates every section in
three files, prefer refactoring `config.ts` to export a single `config` object
and derive `RemoteConfig = typeof config` + `export-config` from it, so adding a
section is a one-line change. (`config.ts`, `use-remote-config.ts`, and
`export-config.ts` are per-repo editable.)

**Do not edit template-managed files** (owned by `hayc-websites-template` and
overwritten by sync PRs): `deploy.yml`, `tsconfig*.json`, `postcss.config.js`,
`eslint.config.js`, `src/hayc/config-context.tsx`, `use-analytics.ts`,
`use-contact-form.ts`, `use-newsletter-form.ts`, `ContactForm.tsx`,
`NewsletterForm.tsx`, `scripts/pull-config.ts`, `scripts/sync-baseline.ts`.
Check the repo's `CLAUDE.md` for the authoritative list.

If a template-managed form hook reads a config section (e.g.
`contactFormConfig`, `newsletterFormConfig`), add that section to `config.ts`
rather than editing the hook.

### Phase 4 — QA

- Run the repo's build/typecheck (e.g. `npm run build`) and fix all errors.
- Visually compare each React route against the original template page
  (Playwright screenshots, or a manual side-by-side).
- Spot-check edit mode (`?hayc-edit=true`) so `cp()` paths resolve.

## Gotchas

- **Tailwind classes without Tailwind**: template-managed components (e.g.
  `NewsletterForm`) use Tailwind utilities. If the client repo isn't running
  Tailwind on them, classes like `.hidden` (honeypot field) and `.flex` won't
  apply — add explicit CSS in `src/index.css` to hide honeypots and lay out the
  form.
- **Square vs wide logos**: template logo CSS assumes a wide wordmark; cap height
  for a square badge in header/footer via CSS overrides.
- **Broken icons**: if icons render as empty boxes, the bundled CSS references a
  font you didn't copy — copy the icon/web fonts the CSS expects.
- **Missing referenced images**: since images are copied on demand, confirm every
  asset a section references actually exists (e.g. `testimonial/6.jpg`) before
  shipping. Copy any you missed.
- **Asset nesting**: when copying, double-check folders didn't nest
  (`images/images`).

## Make it repeatable

After a port, capture any reusable headless primitive or script (asset import,
visual diff) so the next client port is faster. The template changes every time;
the recipe in this skill does not.

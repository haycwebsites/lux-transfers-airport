/**
 * SYNCED FILE — do not modify in derived repos.
 * This file is automatically updated from the hayc-websites-template
 * repository via sync-template.yml.
 *
 * check-forms.ts
 * --------------
 * Keeps src/forms/registry.ts honest against the forms that actually
 * exist in the code. The registry is what lands in config.json as
 * `forms`, which the HAYC dashboard reads to offer Automations — so an
 * entry with no live form is an automation the client can build that
 * will never fire, and a form with no entry is a lead source the client
 * cannot automate at all.
 *
 * Checks:
 *   1. every useContactForm/useNewsletterForm call and every
 *      <ContactForm>/<NewsletterForm> element passes a formId
 *   2. every formId used resolves to an entry in siteForms
 *   3. every entry in siteForms is used by at least one call site
 *   4. entries are well-formed (unique id, non-empty name, valid type)
 *
 * Usage:
 *   npx tsx scripts/check-forms.ts            # warn only, exit 0
 *   npx tsx scripts/check-forms.ts --strict   # exit 1 on any problem
 *
 * Deploy runs it in warn mode so an unregistered form never blocks a
 * release — it just shows up loudly in the build log.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const registryPath = path.join(srcDir, 'forms', 'registry.ts');
const strict = process.argv.includes('--strict');

interface FormDefinition {
  id: string;
  name: string;
  page?: string;
  type?: string;
}

const HOOK_MARKERS = ['useContactForm', 'useNewsletterForm'];
const JSX_MARKERS = ['ContactForm', 'NewsletterForm'];
const VALID_TYPES = new Set(['contact', 'newsletter']);

const problems: string[] = [];
const notes: string[] = [];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Slice forward from the opening paren until it is balanced. */
function sliceCall(source: string, start: number): string {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return source.slice(start, start + 600);
}

/** Pull the formId expression out of a hook call or JSX element. */
function extractFormId(snippet: string): { raw: string; key?: string; literal?: string } | null {
  const viaConst = snippet.match(/formId\s*[:=]\s*\{?\s*FORM_IDS\.(\w+)/);
  if (viaConst) return { raw: 'FORM_IDS.' + viaConst[1], key: viaConst[1] };
  const viaLiteral = snippet.match(/formId\s*[:=]\s*\{?\s*['"]([^'"]+)['"]/);
  if (viaLiteral) return { raw: viaLiteral[1], literal: viaLiteral[1] };
  if (/formId/.test(snippet)) return { raw: '<dynamic>' };
  return null;
}

/** Synced files that define the props rather than consume them. */
function isFormDefinitionFile(file: string): boolean {
  const normalized = file.replace(/\\/g, '/');
  return /src\/(components\/(ContactForm|NewsletterForm)|hayc\/use-(contact|newsletter)-form)\.(tsx?|ts)$/.test(
    normalized
  );
}

async function main() {
  if (!fs.existsSync(registryPath)) {
    console.log('ℹ src/forms/registry.ts not found — skipping form registry check.');
    console.log('  Create it to make this site forms discoverable in HAYC Automations.');
    return;
  }

  let siteForms: FormDefinition[] = [];
  let formIds: Record<string, string> = {};
  try {
    const mod = (await import(pathToFileURL(registryPath).href)) as {
      siteForms?: FormDefinition[];
      FORM_IDS?: Record<string, string>;
    };
    siteForms = mod.siteForms ?? [];
    formIds = mod.FORM_IDS ?? {};
  } catch (err) {
    console.error('✖ Could not load src/forms/registry.ts:', (err as Error).message);
    process.exit(strict ? 1 : 0);
  }

  // ── 1. registry entries are well-formed ──────────────────────────
  const seen = new Set<string>();
  for (const form of siteForms) {
    if (!form.id || !form.id.trim()) {
      problems.push('registry: an entry has no id');
    } else if (seen.has(form.id)) {
      problems.push("registry: duplicate id '" + form.id + "'");
    } else {
      seen.add(form.id);
    }

    if (!form.name || !form.name.trim()) {
      problems.push(
        "registry: '" + form.id + "' has no name — the dashboard needs a human label"
      );
    }
    if (form.type && !VALID_TYPES.has(form.type)) {
      problems.push(
        "registry: '" + form.id + "' has type '" + form.type + "' (expected contact|newsletter)"
      );
    }
  }

  // ── 2. scan call sites ───────────────────────────────────────────
  const registeredIds = new Set(siteForms.map((f) => f.id));
  const usedIds = new Set<string>();
  const files = fs.existsSync(srcDir) ? walk(srcDir) : [];

  for (const file of files) {
    if (file === registryPath) continue;
    const rel = path.relative(projectRoot, file).replace(/\\/g, '/');
    const isDefinition = isFormDefinitionFile(file);
    const source = fs.readFileSync(file, 'utf-8');

    const sites: Array<{ snippet: string; label: string; index: number }> = [];

    if (!isDefinition) {
      for (const marker of HOOK_MARKERS) {
        const re = new RegExp(marker + '\\s*\\(', 'g');
        let m: RegExpExecArray | null;
        while ((m = re.exec(source)) !== null) {
          const open = source.indexOf('(', m.index);
          sites.push({ snippet: sliceCall(source, open), label: marker + '()', index: m.index });
        }
      }

      for (const marker of JSX_MARKERS) {
        const re = new RegExp('<' + marker + '[\\s/>]', 'g');
        let m: RegExpExecArray | null;
        while ((m = re.exec(source)) !== null) {
          const end = source.indexOf('>', m.index);
          const snippet = source.slice(m.index, end === -1 ? m.index + 400 : end + 1);
          sites.push({ snippet, label: '<' + marker + '>', index: m.index });
        }
      }
    }

    for (const site of sites) {
      const line = source.slice(0, site.index).split('\n').length;
      const where = rel + ':' + line;
      const found = extractFormId(site.snippet);

      if (!found) {
        problems.push(
          where + ' — ' + site.label + ' has no formId; this form is invisible to Automations'
        );
        continue;
      }
      if (found.raw === '<dynamic>') {
        notes.push(
          where + ' — ' + site.label + ' builds formId dynamically; cannot verify it statically'
        );
        continue;
      }
      if (found.key) {
        const resolved = formIds[found.key];
        if (!resolved) {
          problems.push(
            where + ' — FORM_IDS.' + found.key + ' is not defined in src/forms/registry.ts'
          );
          continue;
        }
        usedIds.add(resolved);
        if (!registeredIds.has(resolved)) {
          problems.push(where + " — '" + resolved + "' is in FORM_IDS but missing from siteForms");
        }
        continue;
      }
      if (found.literal) {
        usedIds.add(found.literal);
        notes.push(
          where +
            " — formId '" +
            found.literal +
            "' is a bare string; prefer FORM_IDS so the id is written once"
        );
        if (!registeredIds.has(found.literal)) {
          problems.push(where + " — '" + found.literal + "' is not registered in siteForms");
        }
      }
    }
  }

  // ── 3. phantom entries ───────────────────────────────────────────
  for (const form of siteForms) {
    if (!usedIds.has(form.id)) {
      problems.push(
        "registry: '" +
          form.id +
          "' (" +
          form.name +
          ') has no call site — the dashboard would offer an automation that never fires'
      );
    }
  }

  // ── report ───────────────────────────────────────────────────────
  for (const note of notes) console.log('• ' + note);

  if (problems.length === 0) {
    console.log(
      '✅ Form registry is consistent (' +
        siteForms.length +
        ' form' +
        (siteForms.length === 1 ? '' : 's') +
        ').'
    );
    return;
  }

  console.log('');
  console.log(strict ? '✖ Form registry problems:' : '⚠ Form registry problems:');
  for (const problem of problems) console.log('  - ' + problem);
  console.log('');
  console.log('  Fix them in src/forms/registry.ts and the call sites above.');
  if (strict) process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error in check-forms:', err);
  process.exit(strict ? 1 : 0);
});

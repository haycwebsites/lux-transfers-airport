/**
 * SYNCED FILE — do not modify in derived repos.
 * This file is automatically updated from the hayc-websites-template
 * repository via sync-template.yml.
 *
 * site-search
 * -----------
 * Client-side search behind <SiteAssistant />. No AI and no network calls:
 * the site's own config (FAQs + page content) is indexed with MiniSearch
 * and visitor questions are matched against it.
 *
 * ─── WHAT GETS INDEXED ──────────────────────────────────────────────
 * 1. assistantConfig.faqs — one document per FAQ, boosted above content.
 * 2. Everything else in the config (when assistantConfig.searchSiteContent),
 *    limited to assistantConfig.searchSections when that list is non-empty
 *    — every object that holds text becomes one document; a title/name-like
 *    field becomes its heading. Technical values (ids, urls, image paths,
 *    SEO fields) and sections with `enabled: false` are skipped.
 *
 * ─── GREEK SUPPORT ──────────────────────────────────────────────────
 * Terms are lowercased, accents are stripped (τόνοι/διαλυτικά), final ς
 * becomes σ, and common inflection endings are trimmed, so "τιμες",
 * "Τιμή" and "τιμών" all match each other.
 *
 * ─── REQUIRES ───────────────────────────────────────────────────────
 * The `minisearch` npm dependency in package.json.
 */

import MiniSearch from 'minisearch';

// Types live here (not in config.ts / use-remote-config.ts) so this synced
// file compiles in every derived repo, whatever its config looks like.
// A site's config.ts may declare the same shapes; they are structurally equal.
export interface LocaleString {
  el: string;
  en: string;
}

export interface AssistantFaq {
  question: LocaleString;
  answer: LocaleString;
  /** Extra search words visitors might use (synonyms), space separated. */
  keywords: LocaleString;
  /** Optional link shown under the answer, e.g. '/contact' or '#rooms'. */
  link: string;
}

export interface AssistantConfig {
  enabled: boolean;
  /** Also search the rest of the site's content, not only the FAQs. */
  searchSiteContent: boolean;
  /** Config sections to search; empty searches every section. */
  searchSections: string[];
  /** Optional CSS color for the widget; empty uses the site's --primary. */
  accentColor: string;
  title: LocaleString;
  greeting: LocaleString;
  placeholder: LocaleString;
  sendLabel: LocaleString;
  closeLabel: LocaleString;
  linkLabel: LocaleString;
  noResults: LocaleString;
  contactLabel: LocaleString;
  contactLink: string;
  faqs: AssistantFaq[];
}

/** Any site's config object; the assistant only reads `assistantConfig` from it. */
export type SiteConfigObject = { assistantConfig?: AssistantConfig } & Record<string, unknown>;

export type SearchLocale = 'el' | 'en';

export interface SiteSearchDoc {
  id: string;
  kind: 'faq' | 'content';
  heading: string;
  text: string;
  keywords: string;
  link: string;
}

export interface SiteSearchResult {
  kind: SiteSearchDoc['kind'];
  heading: string;
  text: string;
  link: string;
  score: number;
}

export type SiteSearchIndex = MiniSearch<SiteSearchDoc>;

const MAX_RESULTS = 3;
/** Results scoring below this fraction of the best hit are dropped. */
const RELATIVE_SCORE_CUTOFF = 0.35;
const FAQ_BOOST = 3;

/** Root config keys that never hold visitor-facing content. */
const SKIP_ROOT_KEYS = new Set(['version', 'exportedAt', 'forms', 'assistantConfig']);

/** Keys whose values are technical or SEO-only, anywhere in the config. */
const SKIP_KEYS = new Set([
  'id', 'siteId', 'apiUrl', 'canonical', 'ogImage', 'language', 'keywords',
  'slug', 'type', 'widgetUrl', 'thumbnail', 'image', 'images', 'img', 'icon',
  'logo', 'src', 'href', 'url', 'link', 'lastSyncedAt', 'color', 'variant',
  'className', 'style',
]);

const HEADING_KEY = /title|name|heading|question|label/i;

/**
 * Search words for well-known contact keys, so "τηλέφωνο" finds a
 * `phone: '+30 …'` value even though the key name itself is not content.
 */
const KEY_HINTS: [RegExp, string][] = [
  [/phone|mobile|^tel/i, 'phone call number τηλέφωνο τηλ κινητό αριθμός'],
  [/email|mail/i, 'email mail ηλεκτρονικό ταχυδρομείο'],
  [/address|location|map/i, 'address location where διεύθυνση τοποθεσία πού βρίσκεστε'],
  [/hours|schedule|opening/i, 'hours open opening ωράριο ώρες λειτουργίας ανοιχτά'],
  [/price|cost/i, 'price cost τιμή κόστος'],
  [/instagram|facebook|tiktok|linkedin|social/i, 'social instagram facebook social media'],
];
const TECHNICAL_VALUE = /^(https?:|\/|#|mailto:|tel:|data:)|\.(jpe?g|png|webp|gif|svg|avif|mp4|webm|pdf)$/i;
/** Plain-string codes such as 'redirect' or 'course' (LocaleStrings are never codes). */
const CODE_VALUE = /^[a-z0-9_-]+$/;
/** Text with placeholders like '{count} μαθήματα' is UI wording, not content. */
const TEMPLATE_VALUE = /\{\w+\}/;

/**
 * UI wording rather than content: buttons, badges, form labels and messages,
 * breadcrumbs, nav/social links. Indexing these makes answers read like
 * "Λεπτομέρειες Δωρεάν Εκδήλωση". Price fields are kept even when named *Label.
 */
const UI_KEY = /cta|button|btn|badge|placeholder|submit|success|error|required|invalid|loader|crumb|aria|alt$|tooltip|copyright|checkbox|^link[A-Z]|^social|Href$|Url$|Singular$|Plural$|(?<!price)Label$/i;

const STOPWORDS = new Set([
  // el (already normalized: no accents, final σ)
  'και', 'να', 'το', 'τα', 'τη', 'την', 'τησ', 'του', 'των', 'τον', 'τουσ', 'τισ',
  'ο', 'η', 'οι', 'σε', 'στο', 'στη', 'στην', 'στα', 'στον', 'στουσ', 'στισ', 'με',
  'για', 'απο', 'ειναι', 'εχει', 'εχετε', 'εχω', 'θα', 'που', 'πωσ', 'τι', 'ποιο',
  'ποια', 'ποιοσ', 'ποιεσ', 'μου', 'σασ', 'μασ', 'ενα', 'μια', 'ενασ', 'δεν', 'αν',
  'κι', 'ειμαι', 'μπορω', 'μπορειτε', 'μπορεισ', 'θελω', 'θελετε', 'κανω', 'κανεισ',
  'κανετε', 'εχεισ', 'υπαρχει', 'υπαρχουν', 'γινεται', 'γινονται',
  // en
  'the', 'a', 'an', 'is', 'are', 'do', 'does', 'you', 'your', 'i', 'we', 'our',
  'of', 'to', 'in', 'on', 'at', 'for', 'and', 'or', 'what', 'how', 'can', 'have',
  'has', 'with', 'it', 'my', 'me', 'there', 'any', 'be', 'this', 'that', 'want',
]);

/** Greek inflection endings (normalized), longest first. */
const GREEK_SUFFIXES = [
  'ουσ', 'εισ', 'ουν', 'ων', 'ου', 'οσ', 'ασ', 'εσ', 'ησ', 'οι', 'αι', 'ει',
  'α', 'η', 'ο', 'ι', 'ε', 'υ',
];
const MIN_STEM = 3;
const HAS_GREEK = /[α-ω]/;

/** Lowercase, strip accents and turn final ς into σ. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ς/g, 'σ');
}

function stem(term: string): string {
  if (HAS_GREEK.test(term)) {
    for (const suffix of GREEK_SUFFIXES) {
      if (term.endsWith(suffix) && term.length - suffix.length >= MIN_STEM) {
        return term.slice(0, -suffix.length);
      }
    }
    return term;
  }
  if (term.length > 4 && term.endsWith('ies')) return term.slice(0, -3) + 'y';
  if (term.length > 3 && term.endsWith('s') && !term.endsWith('ss')) return term.slice(0, -1);
  return term;
}

function processTerm(term: string): string | null {
  const normalized = normalize(term);
  if (!normalized || STOPWORDS.has(normalized)) return null;
  return stem(normalized);
}

/** Remove the **bold** / *italic* / __underline__ markers used in config text. */
export function stripMarkers(input: string): string {
  return input.replace(/\*\*\*|\*\*|\*|__/g, '').replace(/\s+/g, ' ').trim();
}

function isLocaleString(value: unknown): value is LocaleString {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return typeof v.el === 'string' && typeof v.en === 'string';
}

function textOf(value: unknown, locale: SearchLocale): string | null {
  if (isLocaleString(value)) {
    const text = value[locale] || value.en || value.el;
    return text && !TEMPLATE_VALUE.test(text) ? stripMarkers(text) : null;
  }
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text || TECHNICAL_VALUE.test(text) || CODE_VALUE.test(text) || TEMPLATE_VALUE.test(text)) return null;
    return stripMarkers(text);
  }
  return null;
}

function collectContentDocs(
  node: unknown,
  path: string,
  locale: SearchLocale,
  parentHeading: string,
  docs: SiteSearchDoc[],
): void {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectContentDocs(item, `${path}[${i}]`, locale, parentHeading, docs));
    return;
  }
  if (!node || typeof node !== 'object' || isLocaleString(node)) return;

  const obj = node as Record<string, unknown>;
  if (obj.enabled === false) return;

  let heading = '';
  const texts: string[] = [];
  const hints = new Set<string>();
  const children: [string, unknown][] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (SKIP_KEYS.has(key) || UI_KEY.test(key)) continue;
    const text = textOf(value, locale);
    if (text) {
      if (!heading && HEADING_KEY.test(key)) heading = text;
      else texts.push(text);
      for (const [pattern, words] of KEY_HINTS) if (pattern.test(key)) hints.add(words);
      continue;
    }
    if (Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string' || isLocaleString(v))) {
      // e.g. features: LocaleString[] — fold into this object's text
      const items = value.map(v => textOf(v, locale)).filter((v): v is string => !!v);
      if (items.length) texts.push(items.join(' · '));
      continue;
    }
    if (value && typeof value === 'object') children.push([key, value]);
  }

  if (heading || texts.length) {
    docs.push({
      id: `content:${path}`,
      kind: 'content',
      heading: heading || parentHeading,
      text: texts.join(' '),
      keywords: [...hints].join(' '),
      link: '',
    });
  }

  for (const [key, value] of children) {
    collectContentDocs(value, path ? `${path}.${key}` : key, locale, heading || parentHeading, docs);
  }
}

/** Build the documents for one locale. Exported for testing. */
// Takes `object`: a repo's RemoteConfig interface has no index signature.
export function buildDocs(siteConfig: object, locale: SearchLocale): SiteSearchDoc[] {
  const config = siteConfig as SiteConfigObject;
  const docs: SiteSearchDoc[] = [];
  const assistant = config.assistantConfig;

  (assistant?.faqs ?? []).forEach((faq, i) => {
    const heading = textOf(faq.question, locale);
    const text = textOf(faq.answer, locale);
    if (!heading || !text) return;
    docs.push({
      id: `faq:${i}`,
      kind: 'faq',
      heading,
      text,
      keywords: textOf(faq.keywords, locale) ?? '',
      link: faq.link ?? '',
    });
  });

  if (assistant?.searchSiteContent !== false) {
    const only = assistant?.searchSections?.length ? new Set(assistant.searchSections) : null;
    for (const [key, value] of Object.entries(config)) {
      if (SKIP_ROOT_KEYS.has(key) || (only && !only.has(key))) continue;
      collectContentDocs(value, key, locale, '', docs);
    }
  }

  return docs;
}

export function buildIndex(config: object, locale: SearchLocale): SiteSearchIndex {
  const index = new MiniSearch<SiteSearchDoc>({
    fields: ['heading', 'text', 'keywords'],
    storeFields: ['kind', 'heading', 'text', 'link'],
    processTerm,
  });
  index.addAll(buildDocs(config, locale));
  return index;
}

export function search(index: SiteSearchIndex, query: string): SiteSearchResult[] {
  if (!query.trim()) return [];

  const hits = index.search(query, {
    boost: { heading: 2, keywords: 2 },
    boostDocument: (_id, _term, stored) => (stored?.kind === 'faq' ? FAQ_BOOST : 1),
    prefix: term => term.length >= 3,
    // Terms are already stemmed; short stems fuzzy-match unrelated words (κιθαρ ~ καθαρ).
    fuzzy: term => (term.length >= 6 ? 0.2 : false),
    combineWith: 'OR',
  });
  if (!hits.length) return [];

  const cutoff = hits[0].score * RELATIVE_SCORE_CUTOFF;
  // The same card often appears on several pages (e.g. home + courses).
  const seen = new Set<string>();
  const results: SiteSearchResult[] = [];
  for (const hit of hits) {
    if (hit.score < cutoff || results.length >= MAX_RESULTS) break;
    const key = `${hit.heading}\u0000${hit.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      kind: hit.kind as SiteSearchDoc['kind'],
      heading: hit.heading as string,
      text: hit.text as string,
      link: hit.link as string,
      score: hit.score,
    });
  }
  return results;
}

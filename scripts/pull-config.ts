import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUCKET_BASE = 'https://hayc-react-apps.s3.eu-north-1.amazonaws.com';

function loadEnvVar(key: string): string {
  for (const envFile of ['.env.local', '.env']) {
    const envPath = path.resolve(__dirname, '..', envFile);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(new RegExp('^' + key + '=(.+)$', 'm'));
    if (match) return match[1].trim();
  }
  return process.env[key] ?? '';
}

const SITE_ID = loadEnvVar('VITE_SITE_ID');

if (!SITE_ID) {
  console.error('VITE_SITE_ID is not set. Add it to your .env.local file:');
  console.error('VITE_SITE_ID=your-site-name');
  process.exit(1);
}

const CONFIG_URL = `${BUCKET_BASE}/sites/${SITE_ID}/config/config.json?t=${Date.now()}`;
const configTsPath = path.resolve(__dirname, '../src/config.ts');
const configBasePath = path.resolve(__dirname, '.config-base.json');
const SKIP_KEYS = new Set(['version', 'exportedAt']);

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function serializeKey(key: string): string {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return key;
  return "'" + escapeString(key) + "'";
}

function serializeValue(val: unknown, indent: number): string {
  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);

  if (val === null) return 'null';
  if (typeof val === 'string') return "'" + escapeString(val) + "'";
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(function(item) { return innerPad + serializeValue(item, indent + 1); });
    return '[\n' + items.join(',\n') + ',\n' + pad + ']';
  }

  if (typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return '{}';

    const isLocaleString =
      entries.length === 2 &&
      entries.every(function(e) { return (e[0] === 'el' || e[0] === 'en') && typeof e[1] === 'string'; });

    if (isLocaleString) {
      const parts = entries.map(function(e) { return e[0] + ': ' + "'" + escapeString(e[1] as string) + "'"; });
      return '{ ' + parts.join(', ') + ' }';
    }

    const lines = entries.map(function(e) {
      return innerPad + serializeKey(e[0]) + ': ' + serializeValue(e[1], indent + 1);
    });
    return '{\n' + lines.join(',\n') + ',\n' + pad + '}';
  }

  return String(val);
}

function normalizeForCompare(value: unknown): string {
  const serialized = JSON.stringify(value);
  return serialized === undefined ? '__undefined__' : serialized;
}

function sanitizeConfigObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SKIP_KEYS.has(key)) continue;
    result[key] = value;
  }
  return result;
}

async function main() {
  console.log('Fetching config.json from ' + CONFIG_URL + '...');

  const res = await fetch(CONFIG_URL);
  if (!res.ok) {
    if (res.status === 403 || res.status === 404) {
      console.warn('⚠️  No config.json found in S3 for site "' + SITE_ID + '" (' + res.status + ') — skipping pull. This is expected on first deploy.');
      process.exit(0);
    }
    console.error('Failed to fetch config.json: ' + res.status + ' ' + res.statusText);
    process.exit(1);
  }

  const remoteConfig = await res.json() as Record<string, unknown>;
  console.log('Fetched config.json (exported at: ' + remoteConfig.exportedAt + ')');
  const sanitizedRemoteConfig = sanitizeConfigObject(remoteConfig);

  let baseConfig: Record<string, unknown> = {};
  if (fs.existsSync(configBasePath)) {
    const baseConfigRaw = fs.readFileSync(configBasePath, 'utf-8').trim();
    if (baseConfigRaw) {
      const parsedBase = JSON.parse(baseConfigRaw) as Record<string, unknown>;
      if (parsedBase && typeof parsedBase === 'object') {
        baseConfig = sanitizeConfigObject(parsedBase);
      }
    }
  }
  const hasBaseline = Object.keys(baseConfig).length > 0;

  if (!hasBaseline) {
    console.log('ℹ Baseline is empty — keeping repo src/config.ts as-is (skipping S3 pull).');
    process.exit(0);
  }

  const configTs = fs.readFileSync(configTsPath, 'utf-8');

  // Split at the CONSTANTS section marker so mid-file slug arrays never truncate interfaces.
  const constantsMarker = configTs.match(
    /\n\/\/ =+\n\/\/ CONSTANTS\n\/\/ =+\n/,
  );
  let interfacesSection: string;
  let constantsPreamble = '';

  if (constantsMarker && constantsMarker.index !== undefined) {
    interfacesSection = configTs.slice(0, constantsMarker.index);
    constantsPreamble = constantsMarker[0].trimStart() + '\n\n';
  } else {
    const firstConstAfterInterfaces = configTs.search(/\nexport const siteConfig/);
    if (firstConstAfterInterfaces === -1) {
      console.error('Could not find CONSTANTS marker or siteConfig in config.ts');
      process.exit(1);
    }
    interfacesSection = configTs.slice(0, firstConstAfterInterfaces);
  }

  const constTypeMap = new Map<string, string>();
  const constBlockMap = new Map<string, string>();
  const constRegex = /export const (\w+)(?::\s*([^=]+?))?\s*=/g;
  let match;
  while ((match = constRegex.exec(configTs)) !== null) {
    const key = match[1];
    const typeAnnotation = match[2]?.trim();
    if (typeAnnotation) constTypeMap.set(key, typeAnnotation);

    // Capture the original full const declaration so we can preserve local-only defaults.
    const blockStart = match.index;
    const valueStart = constRegex.lastIndex;
    let i = valueStart;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let escape = false;
    let depthParen = 0;
    let depthBracket = 0;
    let depthBrace = 0;

    while (i < configTs.length) {
      const ch = configTs[i];

      if (escape) {
        escape = false;
        i++;
        continue;
      }

      if (ch === '\\') {
        escape = true;
        i++;
        continue;
      }

      if (!inDouble && !inTemplate && ch === "'") {
        inSingle = !inSingle;
        i++;
        continue;
      }

      if (!inSingle && !inTemplate && ch === '"') {
        inDouble = !inDouble;
        i++;
        continue;
      }

      if (!inSingle && !inDouble && ch === '`') {
        inTemplate = !inTemplate;
        i++;
        continue;
      }

      if (!inSingle && !inDouble && !inTemplate) {
        if (ch === '(') depthParen++;
        else if (ch === ')') depthParen = Math.max(0, depthParen - 1);
        else if (ch === '[') depthBracket++;
        else if (ch === ']') depthBracket = Math.max(0, depthBracket - 1);
        else if (ch === '{') depthBrace++;
        else if (ch === '}') depthBrace = Math.max(0, depthBrace - 1);
        else if (ch === ';' && depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
          const block = configTs.slice(blockStart, i + 1);
          constBlockMap.set(key, block);
          break;
        }
      }

      i++;
    }
  }

  const constLines: string[] = [];
  const mergedConfig: Record<string, unknown> = {};
  const allKeys = new Set<string>([
    ...Object.keys(sanitizedRemoteConfig),
    ...Object.keys(baseConfig),
    ...constBlockMap.keys(),
  ]);

  for (const key of allKeys) {
    if (SKIP_KEYS.has(key)) continue;

    const hasRemote = Object.prototype.hasOwnProperty.call(sanitizedRemoteConfig, key);
    const localBlock = constBlockMap.get(key);
    const hasLocal = Boolean(localBlock);

    if (!hasRemote) {
      if (hasLocal && localBlock) {
        console.log("ℹ '" + key + "' not in S3 — preserving local default.");
        constLines.push(localBlock);
      }
      continue;
    }

    const remoteChanged =
      !hasBaseline ||
      normalizeForCompare(sanitizedRemoteConfig[key]) !== normalizeForCompare(baseConfig[key]);

    if (remoteChanged) {
      const typeAnnotation = constTypeMap.has(key) ? ': ' + constTypeMap.get(key) : '';
      constLines.push(
        'export const ' + key + typeAnnotation + ' = ' + serializeValue(sanitizedRemoteConfig[key], 0) + ';',
      );
      console.log("↓ Pulled updated '" + key + "' from S3.");
      mergedConfig[key] = sanitizedRemoteConfig[key];
      continue;
    }

    if (hasLocal && localBlock) {
      constLines.push(localBlock);
      mergedConfig[key] = sanitizedRemoteConfig[key];
      continue;
    }

    const typeAnnotation = constTypeMap.has(key) ? ': ' + constTypeMap.get(key) : '';
    constLines.push(
      'export const ' + key + typeAnnotation + ' = ' + serializeValue(sanitizedRemoteConfig[key], 0) + ';',
    );
    mergedConfig[key] = sanitizedRemoteConfig[key];
  }

  const constBody = constLines.join('\n\n');
  const enHelper = "const en = (s: string): LocaleString => ({ el: s, en: s });";
  const needsEnHelper = constBody.includes('en(');
  const newConfigTs =
    interfacesSection +
    '\n\n' +
    constantsPreamble +
    (needsEnHelper ? enHelper + '\n\n' : '') +
    constBody +
    '\n';
  fs.writeFileSync(configTsPath, newConfigTs, 'utf-8');
  fs.writeFileSync(configBasePath, JSON.stringify(mergedConfig, null, 2) + '\n', 'utf-8');
  console.log('src/config.ts updated with latest content from S3.');
  console.log('Review the changes and deploy when ready.');
}

main().catch(function(err) {
  console.error('Unexpected error:', err);
  process.exit(1);
});
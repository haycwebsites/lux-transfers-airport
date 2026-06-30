// =============================================================================
// sync-baseline.ts
// Mirrors the current src/config.ts values into scripts/.config-base.json.
// Run after every deploy to keep the baseline in sync with what was built.
// =============================================================================

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configTsPath = path.resolve(__dirname, '../src/config.ts');
const configBasePath = path.resolve(__dirname, '.config-base.json');
const SKIP_KEYS = new Set(['version', 'exportedAt']);

function parseConstValue(block: string): unknown {
  const eqIndex = block.indexOf('=');
  if (eqIndex === -1) return undefined;
  const expression = block.slice(eqIndex + 1).trim().replace(/;$/, '').trim();
  try {
    return Function('"use strict"; return (' + expression + ');')();
  } catch {
    return undefined;
  }
}

function main() {
  const configTs = fs.readFileSync(configTsPath, 'utf-8');

  const constBlockMap = new Map<string, string>();
  const constRegex = /export const (\w+)(?::\s*[^=]+?)?\s*=/g;
  let match;

  while ((match = constRegex.exec(configTs)) !== null) {
    const key = match[1];
    const blockStart = match.index;
    const valueStart = constRegex.lastIndex;
    let i = valueStart;
    let inSingle = false, inDouble = false, inTemplate = false, escape = false;
    let depthParen = 0, depthBracket = 0, depthBrace = 0;

    while (i < configTs.length) {
      const ch = configTs[i];
      if (escape) { escape = false; i++; continue; }
      if (ch === '\\') { escape = true; i++; continue; }
      if (!inDouble && !inTemplate && ch === "'") { inSingle = !inSingle; i++; continue; }
      if (!inSingle && !inTemplate && ch === '"') { inDouble = !inDouble; i++; continue; }
      if (!inSingle && !inDouble && ch === '`') { inTemplate = !inTemplate; i++; continue; }
      if (!inSingle && !inDouble && !inTemplate) {
        if (ch === '(') depthParen++;
        else if (ch === ')') depthParen = Math.max(0, depthParen - 1);
        else if (ch === '[') depthBracket++;
        else if (ch === ']') depthBracket = Math.max(0, depthBracket - 1);
        else if (ch === '{') depthBrace++;
        else if (ch === '}') depthBrace = Math.max(0, depthBrace - 1);
        else if (ch === ';' && depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
          constBlockMap.set(key, configTs.slice(blockStart, i + 1));
          break;
        }
      }
      i++;
    }
  }

  const baseline: Record<string, unknown> = {};
  for (const [key, block] of constBlockMap.entries()) {
    if (SKIP_KEYS.has(key)) continue;
    const value = parseConstValue(block);
    if (value !== undefined) {
      baseline[key] = value;
    }
  }

  fs.writeFileSync(configBasePath, JSON.stringify(baseline, null, 2) + '\n', 'utf-8');
  console.log('✅ scripts/.config-base.json synced from src/config.ts');
}

main();

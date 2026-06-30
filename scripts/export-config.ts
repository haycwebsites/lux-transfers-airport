import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  siteConfig,
  digitalProductsConfig,
  navigationConfig,
  heroConfig,
  introConfig,
  destinationsConfig,
  pricingConfig,
  transportConfig,
  contactConfig,
  contactFormConfig,
  newsletterFormConfig,
  reviewsConfig,
  footerConfig,
  whatsAppConfig,
  blogConfig,
  privacyConfig,
  bookingPageConfig,
} from '../src/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  version: 1,
  exportedAt: new Date().toISOString(),
  siteConfig,
  digitalProductsConfig,
  navigationConfig,
  heroConfig,
  introConfig,
  destinationsConfig,
  pricingConfig,
  transportConfig,
  contactConfig,
  contactFormConfig,
  newsletterFormConfig,
  reviewsConfig,
  footerConfig,
  whatsAppConfig,
  blogConfig,
  privacyConfig,
  bookingPageConfig,
};

const projectRoot = path.resolve(__dirname, '../../');
const outDir = path.join(projectRoot, 'dist/hayc');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'config.json'),
  JSON.stringify(config, null, 2),
  'utf-8'
);

console.log('config.json exported to dist/hayc/config.json');

const publicDir = path.join(projectRoot, 'public/hayc');
fs.mkdirSync(publicDir, { recursive: true });
fs.copyFileSync(
  path.join(outDir, 'config.json'),
  path.join(publicDir, 'config.json')
);
console.log('config.json copied to public/hayc/config.json');

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'src/config.ts');

const posts = JSON.parse(fs.readFileSync(path.join(root, 'scripts/wp-blog-data.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(root, 'scripts/wp-pages-data.json'), 'utf8'));

posts.forEach((p) => {
  if (!p.image) {
    const html = p.content?.el || p.content?.en || '';
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) {
      try {
        const url = new URL(match[1], 'https://luxtransfersairport.gr');
        p.image = `/images/blog/${url.pathname.split('/').pop()}`;
      } catch {
        p.image = '/images/main-article-image.webp';
      }
    } else {
      p.image = '/images/main-article-image.webp';
    }
  }
});

const bookingPageConfig = {
  heroTitle: {
    el: 'Κράτηση Μεταφοράς – Μπορείτε να κλείσετε έως 16 άτομα',
    en: 'Book Transfer – You can book up to 16 people',
  },
  subtitle1: {
    el: 'Καλαμάτα & Αεροδρόμιο Αθηνών & λιμάνι',
    en: 'Kalamata & Athens Airport & harbor',
  },
  subtitle2: {
    el: 'Costa Navarino & Στούπα',
    en: 'Costa Navarino & Stoupa',
  },
  description: {
    el: 'Σχεδιάστε την ιδανική μεταφορά σας επιλέγοντας ώρα και ημερομηνία παραλαβής και παράδοσης. Προσφέρουμε αξιόπιστες μεταφορές μεταξύ κορυφαίων προορισμών όπως Καλαμάτα, Στούπα, Αθήνα και πολλών άλλων σε όλη την Ελλάδα.',
    en: 'Plan your perfect transfer by choosing your pickup and drop-off time and date. We offer reliable transportation between top destinations like Kalamata, Stoupa, Athens, and many more across Greece.',
  },
  iframeSrc: 'https://transfers.bookingplan.eu/carweb/goluxtaxi-and-minivan-transfers/en/?cid=MA==',
  image: '/images/create-two-black-van-mercedes-car-transfer.webp',
};

const blogConfig = {
  title: { el: 'Άρθρα', en: 'Blog' },
  description: {
    el: 'Μείνετε ενημερωμένοι μέσα από το blog μας με νέα, πτήσεις και ταξιδιωτικές συμβουλές για το Αεροδρόμιο Καλαμάτας.',
    en: 'Stay updated through our blog with news, flights and travel tips for Kalamata Airport.',
  },
  posts,
};

const privacyConfig = {
  title: { el: 'Πολιτική Απορρήτου', en: 'Privacy Policy' },
  content: { el: pages.privacy, en: pages.privacy },
};

const generatedBlock = `export const blogConfig: BlogConfig = ${JSON.stringify(blogConfig, null, 2)};

export const privacyConfig: PrivacyConfig = ${JSON.stringify(privacyConfig, null, 2)};

export const bookingPageConfig: BookingPageConfig = ${JSON.stringify(bookingPageConfig, null, 2)};
`;

let config = fs.readFileSync(configPath, 'utf8');

config = config.replace(
  /import \{\n  blogConfig as generatedBlogConfig,\n  privacyConfig as generatedPrivacyConfig,\n  bookingPageConfig as generatedBookingPageConfig,\n\} from '\.\/config-generated';\n\n/,
  '',
);

const marker = 'export const blogConfig: BlogConfig = ';
const idx = config.indexOf(marker);
if (idx === -1) {
  throw new Error('Could not find blogConfig export in src/config.ts');
}

fs.writeFileSync(configPath, config.slice(0, idx) + generatedBlock);
console.log('Updated src/config.ts (blog, privacy, booking sections)');

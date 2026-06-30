import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const posts = JSON.parse(fs.readFileSync(path.join(root, 'scripts/wp-blog-data.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(root, 'scripts/wp-pages-data.json'), 'utf8'));

posts.forEach((p) => {
  if (!p.image) p.image = '/images/main-article-image.webp';
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

const out = `// AUTO-GENERATED from scripts/generate-config-content.mjs — do not edit by hand

export const blogConfig = ${JSON.stringify(blogConfig, null, 2)};

export const privacyConfig = ${JSON.stringify(privacyConfig, null, 2)};

export const bookingPageConfig = ${JSON.stringify(bookingPageConfig, null, 2)};
`;

fs.writeFileSync(path.join(root, 'src/config-generated.ts'), out);
console.log('Wrote src/config-generated.ts');

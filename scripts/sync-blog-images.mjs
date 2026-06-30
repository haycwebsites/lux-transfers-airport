import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const blogDataPath = path.join(root, 'scripts/wp-blog-data.json');
const outDir = path.join(root, 'public/images/blog');

fs.mkdirSync(outDir, { recursive: true });

const posts = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));

const res = await fetch('https://luxtransfersairport.gr/wp-json/wp/v2/posts?per_page=50&_embed=1');
const wpPosts = await res.json();

function wpImageUrl(post) {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return media?.source_url || '';
}

function normalizeDate(d) {
  return d.slice(0, 19);
}

const byDate = new Map(wpPosts.map((p) => [normalizeDate(p.date), p]));

for (const post of posts) {
  const wp = byDate.get(normalizeDate(post.date));
  if (!wp) {
    console.warn('No WP match for', post.slug, post.date);
    continue;
  }

  const src = wpImageUrl(wp);
  if (!src) {
    console.warn('No image for', post.slug);
    continue;
  }

  const filename = src.split('/').pop().split('?')[0];
  const localPath = `/images/blog/${filename}`;
  const dest = path.join(outDir, filename);

  if (!fs.existsSync(dest)) {
    const imgRes = await fetch(src);
    if (!imgRes.ok) {
      console.warn('Failed download', src);
      continue;
    }
    fs.writeFileSync(dest, Buffer.from(await imgRes.arrayBuffer()));
    console.log('Downloaded', filename);
  }

  post.image = localPath;
}

fs.writeFileSync(blogDataPath, JSON.stringify(posts, null, 2));
console.log('Updated wp-blog-data.json');

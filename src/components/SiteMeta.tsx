import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHayc } from '../hayc/config-context';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function absoluteUrl(base: string, path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const origin = base.replace(/\/$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

function assetOrigin(siteId: string) {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return `https://${siteId}.hayc.gr`;
}

export default function SiteMeta() {
  const { t, img, config, locale } = useHayc();
  const location = useLocation();
  const site = config.siteConfig;

  useEffect(() => {
    const title = t(site.title);
    const description = t(site.description);
    const siteName = t(site.siteName);
    const canonicalBase = site.canonical.replace(/\/$/, '');
    const pageUrl = `${canonicalBase}${location.pathname === '/' ? '' : location.pathname}`;
    const ogImage = absoluteUrl(assetOrigin(site.siteId), img(site.ogImage));

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', pageUrl);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', siteName);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', pageUrl);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', locale === 'el' ? 'el_GR' : 'en_US');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);
  }, [t, img, site, locale, location.pathname]);

  return null;
}

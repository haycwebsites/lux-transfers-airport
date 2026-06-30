import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToHash } from './AppLink';

const WP_ORIGIN = 'https://luxtransfersairport.gr';

function toLocalPath(href: string): string | null {
  if (href.startsWith('/#')) return href;
  if (href.startsWith('#')) return `/${href}`;
  if (href.startsWith('/')) return href;

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin && url.origin !== WP_ORIGIN) return null;

    let path = url.pathname.replace(/\/$/, '') || '/';
    const hash = url.hash;

    if (path === '/category/blog-el') path = '/blog';
    if (path === '/book-your-transfer-easily-in-kalamata') {
      return `/book-your-transfer-easily-in-kalamata${hash}`;
    }

    return `${path}${hash}`;
  } catch {
    return null;
  }
}

export default function InternalLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor) return;
      if (anchor.target === '_blank') return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const local = toLocalPath(href);
      if (!local) return;

      event.preventDefault();

      const hashIndex = local.indexOf('#');
      if (hashIndex >= 0) {
        const path = local.slice(0, hashIndex) || '/';
        const hash = local.slice(hashIndex);
        navigate({ pathname: path, hash });
        if (window.location.pathname === path) {
          scrollToHash(hash, 0);
        }
        return;
      }

      navigate(local);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  return null;
}

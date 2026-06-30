import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToHash } from './AppLink';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      scrollToHash(hash, 150);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

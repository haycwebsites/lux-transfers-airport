import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useHayc } from './config-context';

/*
 * useAnalytics — fire-and-forget pageview tracking hook
 *
 * Usage: call useAnalytics() once inside a component that is:
 *   1. A child of <BrowserRouter> (so useLocation() works)
 *   2. Rendered on every page (typically the root App component)
 *
 * Example in App.tsx:
 *   function AppContent() {
 *     useAnalytics();
 *     return <Routes>...</Routes>;
 *   }
 *
 *   export default function App() {
 *     return <BrowserRouter><AppContent /></BrowserRouter>;
 *   }
 *
 * POST ${apiUrl}/api/analytics/track
 *
 * Required:
 *   siteId    — resolved from config.siteConfig.siteId (backend resolves
 *               the apiKey internally from siteId)
 *   type      — always 'pageview'
 *   page      — current pathname (from useLocation)
 *
 * Optional:
 *   referrer    — document.referrer
 *   timestamp   — Date.now()
 *   sessionId   — generated once per browser session via sessionStorage
 *   deviceType  — 'Mobile' | 'Tablet' | 'Desktop' detected from userAgent
 *   metadata    — object carrying extra payload for non-pageview events
 *                 e.g. { depth: 75 } for scroll_depth
 *                      { url: 'https://...' } for outbound_click
 *                      { path: '/404-path' } for 404_error
 *
 * Does not fire if siteId or apiUrl is empty (local dev without config).
 * Errors are silently ignored — never affects UI state.
 */

function isHaycPreview(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('hayc_preview') === 'true') {
      sessionStorage.setItem('hayc_preview', 'true');
      return true;
    }
    return sessionStorage.getItem('hayc_preview') === 'true';
  } catch {
    return false;
  }
}

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem('hayc_session_id');
    if (!id) {
      id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('hayc_session_id', id);
    }
    return id;
  } catch {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function getScrollDepth(): number {
  const el = document.documentElement;
  const scrollTop = window.scrollY || el.scrollTop;
  const scrollHeight = el.scrollHeight - el.clientHeight;
  if (!scrollHeight) return 100;
  return Math.round((scrollTop / scrollHeight) * 100);
}

export function useAnalytics() {
  const { config } = useHayc();
  const location = useLocation();
  const lastTracked = useRef<string>('');

  useEffect(() => {
    if (isHaycPreview()) return;
    const { siteId, apiUrl } = config.siteConfig;
    if (!siteId || !apiUrl) return;
    if (lastTracked.current === location.pathname) return;
    lastTracked.current = location.pathname;

    fetch(`${apiUrl}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        type: 'pageview',
        page: location.pathname,
        referrer: document.referrer || null,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        deviceType: getDeviceType(),
      }),
    }).catch(() => {});

    // Scroll depth tracking — fires at 25%, 50%, 75%, 100% thresholds
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();

    const handleScroll = () => {
      const depth = getScrollDepth();
      thresholds.forEach((t) => {
        if (depth >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent(apiUrl, siteId, 'scroll_depth', location.pathname, { depth: t });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, config.siteConfig]);
}

/*
 * trackEvent — fire a single analytics event outside of the hook.
 *
 * Usage examples:
 *   trackEvent(apiUrl, siteId, 'outbound_click', '/contact', { url: href })
 *   trackEvent(apiUrl, siteId, 'scroll_depth', pathname, { depth: 75 })
 *   trackEvent(apiUrl, siteId, '404_error', pathname)
 *   trackEvent(apiUrl, siteId, 'file_download', pathname, { file: href })
 *
 * apiUrl and siteId come from config.siteConfig via useHayc().
 * Always fire-and-forget — never affects UI state.
 */
export function trackEvent(
  apiUrl: string,
  siteId: string,
  type: string,
  page: string,
  metadata?: Record<string, unknown>
): void {
  if (isHaycPreview()) return;
  if (!apiUrl || !siteId) return;
  fetch(`${apiUrl}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId,
      type,
      page,
      timestamp: Date.now(),
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
      metadata: metadata || null,
    }),
  }).catch(() => {});
}

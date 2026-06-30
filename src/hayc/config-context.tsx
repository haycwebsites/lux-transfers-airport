import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { LocaleString } from '../config';
import { type RemoteConfig, defaultConfig, fetchRemoteConfig } from './use-remote-config';

export type Locale = 'el' | 'en';

interface HaycContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (val: LocaleString) => string;
  img: (val: string) => string;
  config: RemoteConfig;
  isEditMode: boolean;
  cp: (path: string) => object;
}

const HaycContext = createContext<HaycContextValue | null>(null);

export function HaycProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('el');
  const [config, setConfig] = useState<RemoteConfig>(defaultConfig);
  const [ready, setReady] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEditMode(params.get('hayc-edit') === 'true');
  }, []);

  useEffect(() => {
    fetchRemoteConfig().then(c => {
      setConfig(c);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const handleEditMode = (event: MessageEvent) => {
      if (event.data?.type === 'HAYC_EDIT_MODE') {
        setIsEditMode(event.data.payload?.enabled === true);
      }
    };
    window.addEventListener('message', handleEditMode);
    return () => window.removeEventListener('message', handleEditMode);
  }, []); // empty deps — always listening

  useEffect(() => {
    if (!isEditMode) return;
    const handleConfigUpdate = (event: MessageEvent) => {
      if (event.data?.type === 'HAYC_CONFIG_UPDATE' && event.data?.payload?.config) {
        setConfig(event.data.payload.config as RemoteConfig);
      }
    };
    window.addEventListener('message', handleConfigUpdate);
    return () => window.removeEventListener('message', handleConfigUpdate);
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;

    const interceptClick = (e: MouseEvent) => {
      e.preventDefault();
      // do NOT stopPropagation — let the event bubble so cp() onClick fires
    };

    document.addEventListener('click', interceptClick, true);
    return () => document.removeEventListener('click', interceptClick, true);
  }, [isEditMode]);

  const t = (val: LocaleString): string => typeof val === 'string' ? val : val[locale] ?? val.en;
  const img = (val: string): string => val;

  const cp = useCallback((path: string): object => {
    if (!isEditMode) return {};
    return {
      'data-config-path': path,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({ type: 'HAYC_FIELD_FOCUS', path }, '*');
      },
      style: { cursor: 'pointer' },
    };
  }, [isEditMode]);

  if (!ready) return <div className="min-h-screen bg-background" />;

  return (
    <HaycContext.Provider value={{ locale, setLocale, t, img, config, isEditMode, cp }}>
      {children}
    </HaycContext.Provider>
  );
}

export function useHayc(): HaycContextValue {
  const ctx = useContext(HaycContext);
  if (!ctx) throw new Error('useHayc must be used inside HaycProvider');
  return ctx;
}
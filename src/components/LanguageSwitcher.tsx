import { useHayc, type Locale } from '../hayc/config-context';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'el', label: 'ΕΛ' },
  { value: 'en', label: 'EN' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useHayc();

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map(({ value, label }, i) => (
        <span key={value} className="flex items-center gap-1">
          <button
            onClick={() => setLocale(value)}
            className={`text-xs font-medium tracking-wider transition-colors ${
              locale === value
                ? 'text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {label}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="text-white/20 text-xs">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

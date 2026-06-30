import { useHayc, type Locale } from '../hayc/config-context';

const FLAGS: Record<Locale, { src: string; alt: string }> = {
  el: { src: '/images/flag-el.png', alt: 'Ελληνικά' },
  en: { src: '/images/flag-en.png', alt: 'English' },
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useHayc();
  const current = FLAGS[locale];

  return (
    <li className="pll-parent-menu-item menu-item menu-item-has-children dropdown nav-item">
      <a
        href="#pll_switcher"
        className="nav-link dropdown-toggle"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-haspopup="true"
        aria-expanded="false"
        role="button"
        onClick={(e) => e.preventDefault()}
      >
        <img
          src={current.src}
          alt={current.alt}
          width={16}
          height={11}
          style={{ width: 16, height: 11 }}
        />
      </a>
      <ul className="dropdown-menu depth_0">
        {(['el', 'en'] as Locale[]).map((l) => (
          <li key={l} className={`lang-item lang-item-${l}${l === locale ? ' current-lang' : ''}`}>
            <button
              type="button"
              className="dropdown-item border-0 bg-transparent d-flex align-items-center gap-2"
              onClick={() => setLocale(l)}
            >
              <img
                src={FLAGS[l].src}
                alt={FLAGS[l].alt}
                width={16}
                height={11}
                style={{ width: 16, height: 11 }}
              />
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
}

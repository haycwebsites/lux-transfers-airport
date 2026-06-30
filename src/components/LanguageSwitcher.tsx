import { useHayc, type Locale } from '../hayc/config-context';

const FLAGS: Record<Locale, string> = {
  el: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAAaVBMVEUJO8bU1dgENMQAILwACbAABKNNctT////+/v74+fv09fjj4+PDzuy9yOm3xOeBhM6OpN919ltw5ZNHw8vXr7fXJy9czXs4tWs0oVcoGG6rl5++ZrOHV3PCBgsmmt+YIMKKrscgAAI7AuEORAAAAXUlEQVR4ATXKgQbDMACE4e/ayGgMG8DW93+6GmwCWztE8bvDF+KYhFHUZDdD0NO+QRHDjqcQYf9kKpOms5wCXE8x57EFwgJbnnkhI8ct9XLHD2/SStYeUI1JQbAC/u0uEcnG0vheAAAAAElFTkSuQmCC',
  en: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAAt1BMVEWSmb66z+18msdig8La3u+tYX9IaLc7W7BagbmcUW+kqMr/q6n+//+hsNv/lIr/jIGMnNLJyOP9/fyQttT/wb3/////aWn+YWF5kNT0oqz0i4ueqtIZNJjhvt/8gn//WVr/6+rN1+o9RKZwgcMPJpX/VFT9UEn+RUX8Ozv2Ly+FGzdYZrfU1e/8LS/lQkG/mbVUX60AE231hHtcdMb0mp3qYFTFwNu3w9prcqSURGNDaaIUMX5FNW5wYt7AAAAAjklEQVR4AR3HNUJEMQCGwf+L8RR36ajR+1+CEuvRdd8kK9MNAiRQNgJmVDAt1yM6kSzYVJUsPNssAk5N7ZFKjVNFAY4co6TAOI+kyQm+LFUEBEKKzuWUNB7rSH/rSnvOulOGk+QlXTBqMIrfYX4tSe2nP3iRa/KNK7uTmWJ5a9+erZ3d+18od4ytiZdvZyuKWy8o3UpTVAAAAABJRU5ErkJggg==',
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useHayc();

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
        <img src={FLAGS[locale]} alt="" width={16} height={11} style={{ width: 16, height: 11 }} />
      </a>
      <ul className="dropdown-menu depth_0">
        {(['el', 'en'] as Locale[]).map((l) => (
          <li key={l}>
            <button
              type="button"
              className="dropdown-item border-0 bg-transparent"
              onClick={() => setLocale(l)}
            >
              <img src={FLAGS[l]} alt="" width={16} height={11} style={{ width: 16, height: 11 }} />
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
}

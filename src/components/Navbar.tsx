import AppLink from './AppLink';
import { useHayc } from '../hayc/config-context';
import LanguageSwitcher from './LanguageSwitcher';
export default function Navbar() {
  const { t, img, config, cp } = useHayc();
  const nav = config.navigationConfig;

  return (
    <header id="lc-header">
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <AppLink className="navbar-brand" to="/">
              <img
                src={img(nav.logo)}
                width={110}
                height={60}
                className="d-inline-block align-top"
                alt={t(nav.logoAlt)}
                {...cp('navigationConfig.logo')}
              />
            </AppLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#myNavbar1"
              aria-controls="myNavbar1"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="myNavbar1">
              <div className="mb-2 live-shortcode me-auto ms-auto">
                <ul className="navbar-nav">
                  {nav.links.map((link, i) => (
                    <li key={link.href} className="nav-item">
                      <AppLink
                        className="nav-link"
                        to={link.href}
                        {...cp(`navigationConfig.links.${i}.label`)}
                      >
                        {t(link.label)}
                      </AppLink>
                    </li>
                  ))}
                  <LanguageSwitcher />
                </ul>
              </div>
              <AppLink
                className="navbar-text text-decoration-none bg-black text-white rounded-5 px-3"
                to={nav.bookNowHref}
                {...cp('navigationConfig.bookNowLabel')}
              >
                {t(nav.bookNowLabel)}
              </AppLink>
              <div className="d-inline-flex align-items-center gap-2 mt-3 mt-lg-0 ms-lg-3">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.6 10.2C7.8 12.6 9.8 14.6 12.2 15.8L14 14C14.3 13.7 14.8 13.7 15.2 13.8C16.3 14.2 17.5 14.4 18.8 14.4C19.4 14.4 20 15 20 15.6V18.8C20 19.4 19.4 20 18.8 20C10.7 20 4 13.3 4 5.2C4 4.6 4.6 4 5.2 4H8.4C9 4 9.6 4.6 9.6 5.2C9.6 6.5 9.8 7.7 10.2 8.8C10.3 9.2 10.3 9.7 10 10L8.2 11.8C8.3 11.8 6.6 10.2 6.6 10.2Z"
                    fill="black"
                  />
                </svg>
                <a
                  href={`tel:${nav.phone}`}
                  className="text-black text-decoration-none"
                  {...cp('navigationConfig.phoneDisplay')}
                >
                  {t(nav.phoneDisplay)}
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

import AppLink from './AppLink';
import { useHayc } from '../hayc/config-context';
import ArrowIcon from './ArrowIcon';
import PaymentIcons from './PaymentIcons';
export default function Footer() {
  const { t, config, cp } = useHayc();
  const footer = config.footerConfig;
  const year = new Date().getFullYear();

  return (
    <footer id="lc-footer">
      <div className="bg-black py-5 px-3 px-lg-5 pt-lg-7 pb-lg-3">
        <div className="container">
          <div className="row flex-column flex-lg-row justify-content-between mb-5 mb-lg-8">
            <div className="col-lg-6 mb-4">
              <p className="rfs-17 fw-light text-white" {...cp('footerConfig.tagline')}>
                {t(footer.tagline)}
              </p>
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                <div className="d-inline-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z" />
                  </svg>
                  <a
                    href={`mailto:${footer.email}`}
                    className="text-white text-decoration-none lead rfs-7"
                    {...cp('footerConfig.email')}
                  >
                    {footer.email}
                  </a>
                </div>
                <div className="d-inline-flex align-items-center gap-2">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.6 10.2C7.8 12.6 9.8 14.6 12.2 15.8L14 14C14.3 13.7 14.8 13.7 15.2 13.8C16.3 14.2 17.5 14.4 18.8 14.4C19.4 14.4 20 15 20 15.6V18.8C20 19.4 19.4 20 18.8 20C10.7 20 4 13.3 4 5.2C4 4.6 4.6 4 5.2 4H8.4C9 4 9.6 4.6 9.6 5.2C9.6 6.5 9.8 7.7 10.2 8.8C10.3 9.2 10.3 9.7 10 10L8.2 11.8C8.3 11.8 6.6 10.2 6.6 10.2Z"
                      fill="white"
                    />
                  </svg>
                  <a
                    href={`tel:${footer.phone}`}
                    className="text-white text-decoration-none"
                    {...cp('footerConfig.phoneDisplay')}
                  >
                    {t(footer.phoneDisplay)}
                  </a>
                </div>
              </div>
              <div className="d-inline-flex align-items-center gap-2 mt-3">
                <PaymentIcons />
              </div>
            </div>
            <div className="col-lg-4">
              <p className="rfs-6 fw-light text-white mb-4" {...cp('footerConfig.ctaText')}>
                {t(footer.ctaText)}
              </p>
              <AppLink
                to={config.navigationConfig.bookNowHref}
                className="btn btn-light rounded-pill text-black p-3 d-inline-flex align-items-center gap-2 btn-with-arrow"
              >
                <span {...cp('footerConfig.bookNowLabel')}>{t(footer.bookNowLabel)}</span>
                <ArrowIcon className="text-black" />
              </AppLink>
            </div>
          </div>
          <div className="row text-white">
            <div className="col-lg-6 text-center text-lg-start rfs-6 mt-3">
              <p>
                <span {...cp('footerConfig.copyrightPrefix')}>{t(footer.copyrightPrefix)} </span>
                {year}{' '}
                <a
                  target="_blank"
                  href={footer.copyrightLinkHref}
                  rel="noopener noreferrer"
                  {...cp('footerConfig.copyrightLinkLabel')}
                >
                  {footer.copyrightLinkLabel}
                </a>{' '}
                with 💙
              </p>
            </div>
            <div className="col-lg-6 text-center text-lg-end rfs-6 mt-3">
              <AppLink
                to={footer.privacyHref}
                className="text-decoration-none primary-link light-link text-white"
                {...cp('footerConfig.privacyLabel')}
              >
                {t(footer.privacyLabel)}
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

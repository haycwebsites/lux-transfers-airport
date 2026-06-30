import AppLink from './AppLink';
import { useHayc } from '../hayc/config-context';
import ArrowIcon from './ArrowIcon';
import { HeroFeatureIcon } from './HeroIcons';

export default function HeroSection() {
  const { t, img, config, cp } = useHayc();
  const hero = config.heroConfig;

  return (
    <section className="mx-3 hero bg-white" id="home">
      <div
        className="d-flex justify-content-center justify-content-xl-start p-3 min-vh-75 rounded-5"
        style={{
          background: `url(${img(hero.backgroundImage)}) center 57% / cover no-repeat`,
          backgroundColor: '#666',
          backgroundBlendMode: 'overlay',
        }}
        aria-label={t(hero.titleLine1)}
        {...cp('heroConfig.backgroundImage')}
      >
        <div className="align-self-center text-light col-md-8 offset-md-2 mb-md-6">
          <div className="lc-block">
            <p className="lead rfs-7" {...cp('heroConfig.tagline')}>{t(hero.tagline)}</p>
          </div>
          <div className="lc-block mb-4">
            <h1 className="display-1">
              <span {...cp('heroConfig.titleLine1')}>{t(hero.titleLine1)}</span>
              <br />
              <span {...cp('heroConfig.titleLine2')}>{t(hero.titleLine2)}</span>
            </h1>
          </div>
          <div className="lc-block d-flex gap-5">
            <AppLink
              to={config.navigationConfig.bookNowHref}
              className="text-white text-decoration-none d-flex align-items-center gap-2 underlined-link"
            >
              <span {...cp('heroConfig.bookNowLabel')}>{t(hero.bookNowLabel)}</span>
              <ArrowIcon className="text-light" />
            </AppLink>
            <AppLink
              to="/#contact"
              className="text-white text-decoration-none bg-black p-2 rounded-5 d-flex align-items-center gap-2 underlined-link"
            >
              <span {...cp('heroConfig.contactLabel')}>{t(hero.contactLabel)}</span>
              <ArrowIcon className="text-light" />
            </AppLink>
          </div>
        </div>
      </div>
      <div className="info">
        <div className="row statistics-hero-row">
          <div className="col-xl-5 offset-xl-7 bg-white statistics-hero">
            <div className="container ps-md-6">
              <div className="row row-cols-1 row-cols-md-2 justify-content-center row-cols-lg-3 g-4 counter-qexe">
                {hero.features.map((feature, i) => (
                  <div key={i} className="col m-0 py-4 pt-xl-6 pb-xl-4 text-center text-lg-start">
                    <div className="card card-body border-0 pb-0">
                      <div className="d-inline-flex align-items-center justify-content-center justify-content-xl-start">
                        <div className="d-flex flex-column align-items-center align-items-xl-start">
                          <HeroFeatureIcon index={i} />
                          <p className="lead rfs-7 mb-0" style={{ marginTop: 11, whiteSpace: 'pre-line' }} {...cp(`heroConfig.features.${i}.label`)}>
                            {t(feature.label)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

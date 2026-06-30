import { useHayc } from '../hayc/config-context';
import BookNowButton from './BookNowButton';
import { ServiceCarIcon } from './HeroIcons';
import type { PricingRoute } from '../config';

const serviceClasses = [
  'top-first-service',
  '',
  'top-last-service',
  'bottom-first-service',
  '',
  'bottom-last-service',
];

function PricingCard({
  route,
  index,
  priceLabel,
  durationLabel,
}: {
  route: PricingRoute;
  index: number;
  priceLabel: string;
  durationLabel: string;
}) {
  const { t, cp } = useHayc();
  const isMiddle = index === 1 || index === 4;
  const serviceClass = serviceClasses[index] ?? '';

  const iconBlock = (
    <div className="lc-block service-icon mx-auto mx-xl-1 d-flex justify-content-center align-items-center mb-4 bg-white shadow">
      <ServiceCarIcon />
    </div>
  );

  const contentBlock = (
    <div className="lc-block">
      <div>
        <h5 className="rfs-10 mb-3 fw-bold" {...cp(`pricingConfig.routes.${index}.title`)}>
          {t(route.title)}
        </h5>
        <p className="text-secondary rfs-6 m-0">
          <i className="fas fa-money-bill" />{' '}
          <span {...cp('pricingConfig.priceLabel')}>{priceLabel}</span>{' '}
          <strong {...cp(`pricingConfig.routes.${index}.price`)}>{t(route.price)}</strong>
          <br />
          <i className="fas fa-clock" />{' '}
          <span {...cp('pricingConfig.durationLabel')}>{durationLabel}</span>{' '}
          <strong {...cp(`pricingConfig.routes.${index}.duration`)}>{t(route.duration)}</strong>
          <br />
          <i className="fas fa-map-marker-alt" />{' '}
          <span {...cp(`pricingConfig.routes.${index}.route`)}>{t(route.route)}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={`col-12 col-md-6 offset-md-3 offset-xl-0 col-xl-4 bg-white border service ${serviceClass} p-4 text-center text-xl-start mb-4 mb-xl-0`}
    >
      {isMiddle ? (
        <div className="lc-block d-flex flex-column h-100">
          {iconBlock}
          {contentBlock}
        </div>
      ) : (
        <>
          {iconBlock}
          {contentBlock}
        </>
      )}
    </div>
  );
}

export default function PricingSection() {
  const { t, config, cp } = useHayc();
  const pricing = config.pricingConfig;

  return (
    <section className="services bg-warning" id="transfers">
      <div className="container py-4 py-md-7">
        <div className="row mb-4">
          <div className="col-md-12 text-center">
            <p className="rfs-19">
              <span className="text-dark" {...cp('pricingConfig.titleDark')}>
                {t(pricing.titleDark)}
              </span>{' '}
              <span className="text-info" style={{ whiteSpace: 'pre-line' }} {...cp('pricingConfig.titleAccent')}>
                {t(pricing.titleAccent)}
              </span>
            </p>
            <p className="text-muted rfs-5" {...cp('pricingConfig.disclaimer')}>
              {t(pricing.disclaimer)}
            </p>
          </div>
        </div>
        <div className="row px-3 px-xl-0">
          {pricing.routes.slice(0, 3).map((route, i) => (
            <PricingCard
              key={i}
              route={route}
              index={i}
              priceLabel={t(pricing.priceLabel)}
              durationLabel={t(pricing.durationLabel)}
            />
          ))}
        </div>
        <div className="row px-3 px-xl-0">
          {pricing.routes.slice(3).map((route, idx) => {
            const i = idx + 3;
            return (
              <PricingCard
                key={i}
                route={route}
                index={i}
                priceLabel={t(pricing.priceLabel)}
                durationLabel={t(pricing.durationLabel)}
              />
            );
          })}
        </div>
        <div className="d-flex justify-content-center mt-4">
          <BookNowButton
            labelPath="pricingConfig.bookNowLabel"
            label={t(pricing.bookNowLabel)}
          />
        </div>
      </div>
    </section>
  );
}

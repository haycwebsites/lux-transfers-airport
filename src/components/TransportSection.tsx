import { useHayc } from '../hayc/config-context';
import BookNowButton from './BookNowButton';
import { AirportIcon, FerryIcon } from './HeroIcons';

function TransportCard({
  icon,
  labelPath,
  label,
  destinationsPath,
  destinations,
}: {
  icon: 'airport' | 'port';
  labelPath: string;
  label: string;
  destinationsPath: string;
  destinations: string;
}) {
  const { cp } = useHayc();
  const Icon = icon === 'airport' ? AirportIcon : FerryIcon;

  return (
    <div className="transport-card d-flex flex-column h-100 bg-white border p-4 rounded-30">
      <div className="transport-card-icon mb-3 text-primary">
        <Icon />
      </div>
      <span className="rfs-10 text-secondary mb-2 d-inline-block text-uppercase" {...cp(labelPath)}>
        {label}
      </span>
      <h5 className="rfs-10 mb-0 fw-normal" {...cp(destinationsPath)}>
        {destinations}
      </h5>
    </div>
  );
}

export default function TransportSection() {
  const { t, img, config, cp } = useHayc();
  const transport = config.transportConfig;

  return (
    <section className="transport-section mb-lg-5 mt-6">
      <div className="container py-4 py-lg-6">
        <div className="row justify-content-between align-items-center g-4 mb-4 mb-lg-6">
          <div className="col-lg-6">
            <img
              alt=""
              className="position-relative img-fluid rounded-30 w-100 transport-section-image"
              src={img(transport.airportImage)}
              {...cp('transportConfig.airportImage')}
            />
          </div>
          <div className="col-lg-6 pe-xl-6 text-center text-xl-start">
            <p className="rfs-20 mb-3" {...cp('transportConfig.title')}>
              <span className="text-dark">{t(transport.title)}</span>
            </p>
            <p className="rfs-10 mb-4" {...cp('transportConfig.subtitle')}>
              <span className="text-dark">{t(transport.subtitle)}</span>
            </p>
            <BookNowButton
              labelPath="transportConfig.bookNowLabel"
              label={t(transport.bookNowLabel)}
            />
          </div>
        </div>

        <div className="row justify-content-between align-items-stretch g-4">
          <div className="col-lg-6">
            <img
              alt=""
              className="position-relative img-fluid rounded-30 w-100 transport-section-image"
              src={img(transport.portImage)}
              {...cp('transportConfig.portImage')}
            />
          </div>
          <div className="col-lg-6 pe-xl-6 d-flex flex-column gap-3">
            <TransportCard
              icon="airport"
              labelPath="transportConfig.airports.label"
              label={t(transport.airports.label)}
              destinationsPath="transportConfig.airports.destinations"
              destinations={t(transport.airports.destinations)}
            />
            <TransportCard
              icon="port"
              labelPath="transportConfig.ports.label"
              label={t(transport.ports.label)}
              destinationsPath="transportConfig.ports.destinations"
              destinations={t(transport.ports.destinations)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

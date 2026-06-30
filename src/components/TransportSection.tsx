import { useHayc } from '../hayc/config-context';
import BookNowButton from './BookNowButton';

export default function TransportSection() {
  const { t, img, config, cp } = useHayc();
  const transport = config.transportConfig;

  return (
    <section className="mb-lg-5 mt-6">
      <div className="container py-4 py-lg-6">
        <div className="row flex-lg-row-reverse justify-content-between">
          <div className="col-lg-6 order-2 order-lg-2">
            <img
              alt=""
              className="position-relative img-fluid rounded-30 img-280-345 my-3 w-100"
              src={img(transport.airportImage)}
              style={{ aspectRatio: '700 / 345', objectFit: 'cover' }}
              {...cp('transportConfig.airportImage')}
            />
            <img
              alt=""
              className="position-relative img-fluid rounded-30 img-280-345 w-100"
              src={img(transport.portImage)}
              style={{ aspectRatio: '700 / 345', objectFit: 'cover' }}
              {...cp('transportConfig.portImage')}
            />
          </div>
          <div className="col-lg-6 pe-xl-6 d-flex flex-column justify-content-between">
            <div className="mb-6 text-center text-xl-start">
              <p className="rfs-20" {...cp('transportConfig.title')}>
                <span className="text-dark">{t(transport.title)}</span>
              </p>
              <p className="rfs-10" {...cp('transportConfig.subtitle')}>
                <span className="text-dark">{t(transport.subtitle)}</span>
              </p>
              <BookNowButton
                configPath="transportConfig.bookNowLabel"
                labelPath="transportConfig.bookNowLabel"
                label={t(transport.bookNowLabel)}
              />
            </div>
            <div className="row justify-content-xl-between my-3">
              <div className="col-12">
                <div className="d-flex flex-column h-100 bg-white border p-4 rounded-30">
                  <span className="rfs-10 text-secondary mb-3 d-inline-block" {...cp('transportConfig.airports.label')}>
                    {t(transport.airports.label)}
                  </span>
                  <h5 className="rfs-10 mb-4 fw-normal" {...cp('transportConfig.airports.destinations')}>
                    {t(transport.airports.destinations)}
                  </h5>
                </div>
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-12">
                <div className="d-flex flex-column h-100 bg-white border p-4 rounded-30">
                  <span className="rfs-10 text-secondary mb-3 d-inline-block" {...cp('transportConfig.ports.label')}>
                    {t(transport.ports.label)}
                  </span>
                  <h5 className="rfs-10 mb-4 fw-normal" {...cp('transportConfig.ports.destinations')}>
                    {t(transport.ports.destinations)}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

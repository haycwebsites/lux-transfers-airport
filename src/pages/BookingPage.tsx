import { useHayc } from '../hayc/config-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function BookingPage() {
  const { t, img, config, cp } = useHayc();
  const page = config.bookingPageConfig;

  return (
    <>
      <Navbar />
      <main id="theme-main">
        <div className="py-5 py-xl-6 bg-light-subtle text-dark-emphasis">
          <div className="container text-center">
            <h1 className="display-4" {...cp('bookingPageConfig.heroTitle')}>{t(page.heroTitle)}</h1>
          </div>
        </div>
        <div id="container-content-page" className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1 py-5">
              <iframe
                id="carframe"
                className="mt-4"
                style={{ borderStyle: 'none', width: '100%', height: 450 }}
                src={page.iframeSrc}
                title={t(page.heroTitle)}
                {...cp('bookingPageConfig.iframeSrc')}
              />
              <h2 className="text-center mt-4" {...cp('bookingPageConfig.subtitle1')}>{t(page.subtitle1)}</h2>
              <h4 className="text-center" {...cp('bookingPageConfig.subtitle2')}>{t(page.subtitle2)}</h4>
              <p {...cp('bookingPageConfig.description')}>{t(page.description)}</p>
              <p className="text-center">
                <img
                  className="wp-image-340 img-fluid"
                  src={img(page.image)}
                  alt={t(page.subtitle1)}
                  {...cp('bookingPageConfig.image')}
                />
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

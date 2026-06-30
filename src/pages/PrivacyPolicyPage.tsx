import { useHayc } from '../hayc/config-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function PrivacyPolicyPage() {
  const { t, config, cp } = useHayc();
  const privacy = config.privacyConfig;

  return (
    <>
      <Navbar />
      <main id="theme-main">
        <div className="container py-5 py-xl-6">
          <h1 className="text-center mb-5" {...cp('privacyConfig.title')}>{t(privacy.title)}</h1>
          <div
            className="privacy-content mx-auto"
            style={{ maxWidth: 800 }}
            dangerouslySetInnerHTML={{ __html: t(privacy.content) }}
            {...cp('privacyConfig.content')}
          />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

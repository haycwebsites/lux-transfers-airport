import { useHayc } from '../hayc/config-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function PrivacyPolicyPage() {
  const { t, config, cp } = useHayc();
  const content = config.privacyConfig?.content;
  const html = content ? t(content) : '';

  return (
    <>
      <Navbar />
      <main id="theme-main">
        {html ? (
          <div {...cp('privacyConfig.content')}>
            <div className="privacy-page-content" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        ) : (
          <div className="container py-5">
            <p>Privacy policy content is unavailable.</p>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import DestinationsSwiper from '../components/DestinationsSwiper';
import PricingSection from '../components/PricingSection';
import TransportSection from '../components/TransportSection';
import ContactSection from '../components/ContactSection';
import ReviewsSection from '../components/ReviewsSection';

export default function IndexPage() {
  return (
    <>
      <Navbar />
      <main id="theme-main">
        <HeroSection />
        <IntroSection />
        <DestinationsSwiper />
        <PricingSection />
        <TransportSection />
        <ContactSection />
        <ReviewsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

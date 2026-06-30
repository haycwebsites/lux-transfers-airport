import {
  siteConfig,
  digitalProductsConfig,
  navigationConfig,
  heroConfig,
  introConfig,
  destinationsConfig,
  pricingConfig,
  transportConfig,
  contactConfig,
  contactFormConfig,
  newsletterFormConfig,
  reviewsConfig,
  footerConfig,
  whatsAppConfig,
  blogConfig,
  privacyConfig,
  bookingPageConfig,
  type DigitalProductsConfig,
  type NavigationConfig,
  type HeroConfig,
  type IntroConfig,
  type DestinationsConfig,
  type PricingConfig,
  type TransportConfig,
  type ContactConfig,
  type ContactFormConfig,
  type NewsletterFormConfig,
  type ReviewsConfig,
  type FooterConfig,
  type WhatsAppConfig,
  type BlogConfig,
  type PrivacyConfig,
  type BookingPageConfig,
} from '../config';

export interface RemoteConfig {
  version: number;
  exportedAt: string;
  siteConfig: typeof siteConfig;
  digitalProductsConfig?: DigitalProductsConfig;
  navigationConfig: NavigationConfig;
  heroConfig: HeroConfig;
  introConfig: IntroConfig;
  destinationsConfig: DestinationsConfig;
  pricingConfig: PricingConfig;
  transportConfig: TransportConfig;
  contactConfig: ContactConfig;
  contactFormConfig: ContactFormConfig;
  newsletterFormConfig: NewsletterFormConfig;
  reviewsConfig: ReviewsConfig;
  footerConfig: FooterConfig;
  whatsAppConfig: WhatsAppConfig;
  blogConfig: BlogConfig;
  privacyConfig: PrivacyConfig;
  bookingPageConfig: BookingPageConfig;
}

export const defaultConfig: RemoteConfig = {
  version: 1,
  exportedAt: '',
  siteConfig,
  digitalProductsConfig,
  navigationConfig,
  heroConfig,
  introConfig,
  destinationsConfig,
  pricingConfig,
  transportConfig,
  contactConfig,
  contactFormConfig,
  newsletterFormConfig,
  reviewsConfig,
  footerConfig,
  whatsAppConfig,
  blogConfig,
  privacyConfig,
  bookingPageConfig,
};

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  if (import.meta.env.DEV) {
    return defaultConfig;
  }

  try {
    const res = await fetch('/hayc/config.json');
    if (!res.ok) throw new Error('Failed to fetch config: ' + res.status);
    const data = (await res.json()) as Partial<RemoteConfig>;
    return {
      ...defaultConfig,
      ...data,
      privacyConfig: data.privacyConfig ?? defaultConfig.privacyConfig,
      blogConfig: data.blogConfig ?? defaultConfig.blogConfig,
      bookingPageConfig: data.bookingPageConfig ?? defaultConfig.bookingPageConfig,
    };
  } catch (err) {
    console.warn('[HAYC] Remote config fetch failed, using default config.', err);
    return defaultConfig;
  }
}

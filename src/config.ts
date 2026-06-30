// =============================================================================
// Site Template Configuration
// =============================================================================

// =============================================================================
// INTERFACES
// =============================================================================

export interface LocaleString {
  el: string;
  en: string;
}

export interface SiteConfig {
  title: LocaleString;
  description: LocaleString;
  language: string;
  keywords: LocaleString;
  ogImage: string;
  canonical: string;
  siteId: string;
  apiUrl: string;
}

export interface NavLink {
  label: LocaleString;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  logoAlt: LocaleString;
  links: NavLink[];
  bookNowLabel: LocaleString;
  bookNowHref: string;
  phone: string;
  phoneDisplay: LocaleString;
}

export interface HeroFeature {
  label: LocaleString;
}

export interface HeroConfig {
  backgroundImage: string;
  tagline: LocaleString;
  titleLine1: LocaleString;
  titleLine2: LocaleString;
  bookNowLabel: LocaleString;
  contactLabel: LocaleString;
  features: HeroFeature[];
}

export interface IntroConfig {
  heading: LocaleString;
  body: LocaleString;
}

export interface Destination {
  title: LocaleString;
  image: string;
}

export interface DestinationsConfig {
  items: Destination[];
  bookNowLabel: LocaleString;
}

export interface PricingRoute {
  title: LocaleString;
  price: LocaleString;
  duration: LocaleString;
  route: LocaleString;
}

export interface PricingConfig {
  titleDark: LocaleString;
  titleAccent: LocaleString;
  disclaimer: LocaleString;
  priceLabel: LocaleString;
  durationLabel: LocaleString;
  routes: PricingRoute[];
  bookNowLabel: LocaleString;
}

export interface TransportHub {
  label: LocaleString;
  destinations: LocaleString;
}

export interface TransportConfig {
  title: LocaleString;
  subtitle: LocaleString;
  airportImage: string;
  portImage: string;
  bookNowLabel: LocaleString;
  airports: TransportHub;
  ports: TransportHub;
}

export interface ContactConfig {
  title: LocaleString;
  description: LocaleString;
  emailLabel: LocaleString;
  email: string;
  phoneLabel: LocaleString;
  phone: string;
  phoneDisplay: LocaleString;
}

export interface Review {
  name: string;
  text: LocaleString;
  rating: number;
}

export interface ReviewsConfig {
  ratingLabel: LocaleString;
  basedOn: LocaleString;
  verifiedLabel: LocaleString;
  verifiedDescription: LocaleString;
  readMore: LocaleString;
  items: Review[];
}

export interface FooterConfig {
  tagline: LocaleString;
  email: string;
  phone: string;
  phoneDisplay: LocaleString;
  ctaText: LocaleString;
  bookNowLabel: LocaleString;
  copyrightPrefix: LocaleString;
  copyrightLinkLabel: string;
  copyrightLinkHref: string;
  privacyLabel: LocaleString;
  privacyHref: string;
}

export interface WhatsAppConfig {
  phone: string;
  label: LocaleString;
}

export interface ContactFormConfig {
  nameRequired: LocaleString;
  emailInvalid: LocaleString;
  messageRequired: LocaleString;
  errorText: LocaleString;
}

export interface NewsletterFormConfig {
  emailInvalid: LocaleString;
  errorText: LocaleString;
}

export interface BlogPost {
  slug: string;
  date: string;
  title: LocaleString;
  excerpt: LocaleString;
  content: LocaleString;
  image: string;
}

export interface BlogConfig {
  title: LocaleString;
  description: LocaleString;
  posts: BlogPost[];
}

export interface PrivacyConfig {
  title: LocaleString;
  content: LocaleString;
}

export interface BookingPageConfig {
  heroTitle: LocaleString;
  subtitle1: LocaleString;
  subtitle2: LocaleString;
  description: LocaleString;
  iframeSrc: string;
  image: string;
}

export interface DigitalProduct {
  id: string;
  type: 'course';
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  price: string;
  widgetUrl: string;
  language: string;
  estimatedDurationMinutes?: number;
  chapters?: {
    id: string;
    title: string;
    lessons: { id: string; title: string }[];
  }[];
}

export interface DigitalProductsConfig {
  enabled: boolean;
  lastSyncedAt?: string;
  products: DigitalProduct[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const siteConfig: SiteConfig = {
  title: {
    el: 'Αεροδρόμιο Καλαμάτας - Μεταφορές - Lux Transfer Airport',
    en: 'Kalamata Airport - Transfers - Lux Transfer Airport',
  },
  description: {
    el: 'Χρειάζεστε ταξί από/προς το αεροδρόμιο Καλαμάτας; Κλείστε αξιόπιστη και άνετη μεταφορά με επαγγελματίες ντόπιους οδηγούς.',
    en: 'Need a taxi to or from Kalamata airport? Book reliable, comfortable transfers with professional local drivers.',
  },
  language: 'el',
  keywords: {
    el: 'Αεροδρόμιο Καλαμάτας, μεταφορές, ταξί',
    en: 'Kalamata airport, transfers, taxi',
  },
  ogImage: '/images/station-wagon-black-car-for-transfer-airport.webp',
  canonical: 'https://luxtransfersairport.gr/',
  siteId: '',
  apiUrl: 'https://hayc.gr',
};

export const navigationConfig: NavigationConfig = {
  logo: '/images/wash-e1742725069594-300x196.png',
  logoAlt: { el: 'Lux Transfer Airport', en: 'Lux Transfer Airport' },
  links: [
    { label: { el: 'Προορισμοί', en: 'Destinations' }, href: '/#destinations' },
    { label: { el: 'Μεταφορές', en: 'Transfers' }, href: '/#transfers' },
    { label: { el: 'Επικοινωνία', en: 'Contact' }, href: '/#contact' },
    { label: { el: 'Άρθρα', en: 'Blog' }, href: '/blog' },
  ],
  bookNowLabel: { el: 'BOOK NOW', en: 'BOOK NOW' },
  bookNowHref: '/book-your-transfer-easily-in-kalamata',
  phone: '+306947599350',
  phoneDisplay: { el: '+30 6947599350', en: '+30 6947599350' },
};

export const heroConfig: HeroConfig = {
  backgroundImage: '/images/Untitled-design-3-1.png',
  tagline: { el: 'COMFORT - SAFETY - RELIABILITY', en: 'COMFORT - SAFETY - RELIABILITY' },
  titleLine1: { el: '36 Χρόνια Εμπειρίας', en: '36 Years of Experience' },
  titleLine2: { el: 'στις Μεταφορές', en: 'in Transportation' },
  bookNowLabel: { el: 'Book now', en: 'Book now' },
  contactLabel: { el: 'Contact us', en: 'Contact us' },
  features: [
    { label: { el: 'Παραλαβές \n από το αεροδρόμιο', en: 'Pickups \n from the airport' } },
    { label: { el: 'Παραλαβές \n από το λιμάνι', en: 'Pickups \n from the port' } },
    { label: { el: 'Φιλικό προς τα κατοικίδια', en: 'Pet-friendly' } },
  ],
};

export const introConfig: IntroConfig = {
  heading: { el: 'Ταξιδεύετε \n στην Ελλάδα ;', en: 'Are you traveling \n to Greece?' },
  body: {
    el: 'Για μια ασφαλή και άνετη μεταφορά, η LUX TRANSFER AIRPORT ανοίγει νέους δρόμους στις μεταφορές, διασφαλίζοντας ταχύτητα, άνεση και ασφάλεια σε κάθε διαδρομή.',
    en: 'For a safe and comfortable transfer, LUX TRANSFER AIRPORT opens new paths in transportation, ensuring speed, comfort, and safety on every journey.',
  },
};

export const destinationsConfig: DestinationsConfig = {
  items: [
    { title: { el: 'Costa Navarino', en: 'Costa Navarino' }, image: '/images/W-Costa-Navarino-Hero.png' },
    { title: { el: 'Στούπα', en: 'Stoupa' }, image: '/images/stoupa.webp' },
    { title: { el: 'Καρδαμύλη', en: 'Kardamyli' }, image: '/images/Kardamili.webp' },
    { title: { el: 'Κάστρο Πύλου', en: 'Castle of Pylos' }, image: '/images/Skarmavbild-pylos.png' },
    { title: { el: 'Κάστρο Μεθώνης', en: 'Castle of Methoni' }, image: '/images/sl6.jpg' },
    { title: { el: 'Αρχαία Ολυμπία', en: 'Ancient Olympia' }, image: '/images/the-anciant-olympia-in-greece-2025-02-10-07-38-58-utc-1.jpg' },
    { title: { el: 'Μυστράς', en: 'Mystras' }, image: '/images/temple-of-agia-sofia-and-uphill-castle-of-mystras-2025-02-11-22-51-21-utc-1.jpg' },
    { title: { el: 'Αρχαία Μεσσήνη', en: 'Ancient Messene' }, image: '/images/Messeneasklepeion.jpg' },
    { title: { el: 'Σπήλαια Διρού', en: 'Diros Caves' }, image: '/images/Diros_Cave.jpeg' },
  ],
  bookNowLabel: { el: 'BOOK NOW', en: 'BOOK NOW' },
};

export const pricingConfig: PricingConfig = {
  titleDark: { el: 'Ενδεικτικές τιμές,', en: 'Indicative prices,' },
  titleAccent: { el: 'για \n μοναδικούς προορισμούς', en: 'for \n unique destinations' },
  disclaimer: {
    el: '*Για μεταφορά με 8θέσιο ή 9θέσιο van, η τιμή διαμορφώνεται κατόπιν συνεννόησης.',
    en: '*For transportation by 8-seater or 9-seater van, the price is determined upon consultation.',
  },
  priceLabel: { el: 'Ενδεικτική τιμή:', en: 'Indicative price:' },
  durationLabel: { el: 'Διάρκεια:', en: 'Duration:' },
  routes: [
    {
      title: { el: 'COSTA NAVARINO', en: 'COSTA NAVARINO' },
      price: { el: '65€', en: '€65' },
      duration: { el: '45 λεπτά', en: '45 minutes' },
      route: { el: 'Από Καλαμάτα προς Costa Navarino και το αντίθετο', en: 'From Kalamata to Costa Navarino and vice versa' },
    },
    {
      title: { el: 'ΑΕΡΟΔΡΟΜΙΟ ΑΘΗΝΩΝ', en: 'ELEFTHERIOS VENIZELOS' },
      price: { el: '260€', en: '€260' },
      duration: { el: '3 ώρες', en: '3 hours' },
      route: { el: 'Από Αεροδρόμιο Αθηνών προς Costa Navarino και το αντίθετο', en: 'From Athens Airport to Costa Navarino and vice versa' },
    },
    {
      title: { el: 'ΣΤΟΥΠΑ', en: 'STOUPA' },
      price: { el: '65€', en: '€65' },
      duration: { el: '45 λεπτά', en: '45 minutes' },
      route: { el: 'Από Αεροδρόμιο Καλαμάτας προς Στούπα και το αντίθετο', en: 'From Kalamata Airport to Stoupa and vice versa' },
    },
    {
      title: { el: 'ΚΑΡΔΑΜΥΛΗ', en: 'KARDAMYLI' },
      price: { el: '55€', en: '€55' },
      duration: { el: '35 λεπτά', en: '35 minutes' },
      route: { el: 'Από Αεροδρόμιο Καλαμάτας προς Καρδαμύλη και το αντίθετο', en: 'From Kalamata Airport to Kardamyli and vice versa' },
    },
    {
      title: { el: 'ΜΕΘΩΝΗ', en: 'METHONI' },
      price: { el: '65€', en: '€65' },
      duration: { el: '45 λεπτά', en: '45 minutes' },
      route: { el: 'Από Αεροδρόμιο Καλαμάτας προς Μεθώνη και το αντίθετο', en: 'From Kalamata Airport to Methoni and vice versa' },
    },
    {
      title: { el: 'ΦΟΙΝΙΚΟΥΝΤΑ', en: 'FINIKOUNDA' },
      price: { el: '65€', en: '€65' },
      duration: { el: '45 λεπτά', en: '45 minutes' },
      route: { el: 'Από Αεροδρόμιο Καλαμάτας προς Φοινικούντα και το αντίθετο', en: 'From Kalamata Airport to Finikounda and vice versa' },
    },
  ],
  bookNowLabel: { el: 'BOOK NOW', en: 'BOOK NOW' },
};

export const transportConfig: TransportConfig = {
  title: { el: 'Μεταφορές από και προς', en: 'Transfers to and from' },
  subtitle: {
    el: 'Από και προς όλους τους σταθμούς λεωφορείων και τρένων όλων των προορισμών',
    en: 'To and from all bus and train stations of all destinations',
  },
  airportImage: '/images/empty-airport-waiting-area-2024-10-18-10-03-03-utc-1.jpg',
  portImage: '/images/ferry-boat-leaving-kea-tzia-island-port-greece-2024-12-07-21-13-25-utc-1.jpg',
  bookNowLabel: { el: 'BOOK NOW', en: 'BOOK NOW' },
  airports: {
    label: { el: 'ΑΕΡΟΔΡΟΜΙΑ', en: 'AIRPORTS' },
    destinations: { el: 'Καλαμάτα - Αθήνα - Άραξος', en: 'Kalamata - Athens - Araxos' },
  },
  ports: {
    label: { el: 'ΛΙΜΑΝΙΑ', en: 'PORTS' },
    destinations: { el: 'Καλαμάτα - Πειραιάς - Πάτρα', en: 'Kalamata - Piraeus - Patras' },
  },
};

export const contactConfig: ContactConfig = {
  title: { el: 'Η καλύτερη επιλογή σας', en: 'Your best choice' },
  description: {
    el: 'Αναζητάτε κορυφαία μεταφορά; Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε μαζί σας σύντομα!',
    en: 'Are you looking for top-notch transportation? Fill in your details and we will contact you soon!',
  },
  emailLabel: { el: 'Email', en: 'Email' },
  email: 'info@luxtransfersairport.gr',
  phoneLabel: { el: 'Phone', en: 'Phone' },
  phone: '+306947599350',
  phoneDisplay: { el: '(+30) 6947599350', en: '(+30) 6947599350' },
};

export const reviewsConfig: ReviewsConfig = {
  ratingLabel: { el: 'EXCELLENT', en: 'EXCELLENT' },
  basedOn: { el: 'Βασισμένο σε 8 κριτικές', en: 'Based on 8 reviews' },
  verifiedLabel: { el: 'Επαληθευμένο από Trustindex', en: 'Verified by Trustindex' },
  verifiedDescription: {
    el: 'Το σήμα επαλήθευσης Trustindex είναι το Universal Symbol of Trust. Μόνο οι καλύτερες εταιρείες μπορούν να λάβουν το σήμα επαλήθευσης με βαθμολογία πάνω από 4.5, βάσει κριτικών πελατών τους τελευταίους 12 μήνες.',
    en: 'Trustindex verified badge is the Universal Symbol of Trust. Only the greatest companies can get the verified badge who has a review score above 4.5, based on customer reviews over the past 12 months.',
  },
  readMore: { el: 'Διαβάστε περισσότερα', en: 'Read more' },
  items: [
    {
      name: 'Karina',
      rating: 5,
      text: {
        el: 'Dette er et seriøst firma, og det er veldig god service! Rene biler og hyggelige sjåfører! Jeg har brukt de fra flyplassen i Athen, og til Kardamili/Peloponnes. Et flott og rimelig alternativ! Anbefaler Papadeas på det sterkeste!',
        en: 'Dette er et seriøst firma, og det er veldig god service! Rene biler og hyggelige sjåfører! Jeg har brukt de fra flyplassen i Athen, og til Kardamili/Peloponnes. Et flott og rimelig alternativ! Anbefaler Papadeas på det sterkeste!',
      },
    },
    {
      name: 'ELISAVET TSAPOGA',
      rating: 5,
      text: {
        el: 'Πολύ καλή Εταιρεία πάντα ευγενικοί οδηγοί καθαρά αυτοκίνητα προσιτές τιμές μπορώ να τους συστησω',
        en: 'Πολύ καλή Εταιρεία πάντα ευγενικοί οδηγοί καθαρά αυτοκίνητα προσιτές τιμές μπορώ να τους συστησω',
      },
    },
    {
      name: 'Γεωργιος Παπαδεας',
      rating: 5,
      text: {
        el: 'Συστηνεται ανεπιφυλακτα  Παντα η καλυτερη εξυπηρετηση και οι καλυτερες τιμες',
        en: 'Συστηνεται ανεπιφυλακτα  Παντα η καλυτερη εξυπηρετηση και οι καλυτερες τιμες',
      },
    },
    {
      name: 'Stavros Papadeas',
      rating: 5,
      text: {
        el: 'Great service and always on time. Whenever I am visiting Athens airport and Messinia I am always picking golux taxi. Giorgos and Elisavet are the best :)',
        en: 'Great service and always on time. Whenever I am visiting Athens airport and Messinia I am always picking golux taxi. Giorgos and Elisavet are the best :)',
      },
    },
    {
      name: 'Mina Kondos',
      rating: 5,
      text: {
        el: 'thank you for the first class service you provided. From our initial communication to the on going communication prior to collecting my mother from the airport and during the trip to kalamata, even though her flight arrived early Mr Yioryo was there well before the arrival time.Mum said she was impressed with the flawless service, your respect towards my mother and assistance throughout her trip. You are one amazingly polite professional individual whom I have no hesitation in recommending to whoever travels to Greece.This gave me peace of mind knowing mum travelling on her own and she was so relaxed. Highly Recommended. Definitely worth more than 5 stars. Congratulations to your  company Go Lux Taxis.',
        en: 'thank you for the first class service you provided. From our initial communication to the on going communication prior to collecting my mother from the airport and during the trip to kalamata, even though her flight arrived early Mr Yioryo was there well before the arrival time.Mum said she was impressed with the flawless service, your respect towards my mother and assistance throughout her trip. You are one amazingly polite professional individual whom I have no hesitation in recommending to whoever travels to Greece.This gave me peace of mind knowing mum travelling on her own and she was so relaxed. Highly Recommended. Definitely worth more than 5 stars. Congratulations to your  company Go Lux Taxis.',
      },
    },
  ],
};

export const footerConfig: FooterConfig = {
  tagline: { el: 'Ταξίδι με άνεση', en: 'Travel in comfort' },
  email: 'info@luxtransfersairport.gr',
  phone: '+306947599350',
  phoneDisplay: { el: '+30 6947599350', en: '+30 6947599350' },
  ctaText: {
    el: 'Κάντε κράτηση μαζί μας για το επόμενο ταξίδι σας και απολαύστε ασφαλή, ιδιωτική και άνετη μετακίνηση.',
    en: 'Book with us for your next trip and enjoy safe, private and comfortable travel.',
  },
  bookNowLabel: { el: 'BOOK NOW', en: 'BOOK NOW' },
  copyrightPrefix: { el: '© Made by', en: '© Made by' },
  copyrightLinkLabel: 'hayc',
  copyrightLinkHref: 'https://www.hayc.gr',
  privacyLabel: { el: 'Privacy Policy', en: 'Privacy Policy' },
  privacyHref: '/privacy-policy',
};

export const whatsAppConfig: WhatsAppConfig = {
  phone: '306947599350',
  label: { el: 'WhatsApp us', en: 'WhatsApp us' },
};

export const contactFormConfig: ContactFormConfig = {
  nameRequired: { el: 'Το όνομα είναι υποχρεωτικό.', en: 'Name is required.' },
  emailInvalid: { el: 'Εισάγετε έγκυρο email.', en: 'Please enter a valid email.' },
  messageRequired: { el: 'Το μήνυμα είναι υποχρεωτικό.', en: 'Message is required.' },
  errorText: { el: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.', en: 'Something went wrong. Please try again.' },
};

export const newsletterFormConfig: NewsletterFormConfig = {
  emailInvalid: { el: 'Εισάγετε έγκυρο email.', en: 'Please enter a valid email.' },
  errorText: { el: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.', en: 'Something went wrong. Please try again.' },
};

export const digitalProductsConfig: DigitalProductsConfig = {
  enabled: false,
  products: [],
};

import {
  blogConfig as blogConfigGenerated,
  privacyConfig as privacyConfigGenerated,
  bookingPageConfig as bookingPageConfigGenerated,
} from './config-generated';

export const blogConfig: BlogConfig = blogConfigGenerated;
export const privacyConfig: PrivacyConfig = privacyConfigGenerated;
export const bookingPageConfig: BookingPageConfig = bookingPageConfigGenerated;

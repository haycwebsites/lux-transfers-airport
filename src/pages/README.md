# Pages

This folder contains one file per page of the site.

## How pages are created

Pages are generated automatically by the HAYC pipeline
during project creation. Each HTML template page becomes
one TSX file here.

## Naming convention

- index.html     → IndexPage.tsx   (route: /)
- about.html     → AboutPage.tsx   (route: /about)
- contact.html   → ContactPage.tsx (route: /contact)
- services.html  → ServicesPage.tsx (route: /services)

## Manual page creation

If adding a page manually:
1. Create src/pages/YourPageName.tsx
2. Import Navbar and Footer
3. Add the route in src/App.tsx
4. Add the config section in src/config.ts

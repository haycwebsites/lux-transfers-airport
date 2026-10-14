/**
 * Site form registry for HAYC Automations.
 *
 * Source of truth for two things at once: the `forms` array exported into
 * config.json, which the dashboard reads to offer one automation per form,
 * and the formId each form sends with its submission.
 *
 * Keep ids stable — never change one. An id change orphans every automation
 * the client has already built on that form.
 *
 * Verify with `npm run check-forms`.
 */
export interface HaycFormDefinition {
  id: string;
  name: string;
  page?: string;
  /** 'contact' → POST /public/contact · 'newsletter' → POST /api/newsletter/subscribe */
  type: 'contact' | 'newsletter';
}

export const FORM_IDS = {
  contactPage: 'contact-page',
} as const;

export type SiteFormId = (typeof FORM_IDS)[keyof typeof FORM_IDS];

/** Every lead form on this site. Exported to config.json as `forms`. */
export const siteForms: HaycFormDefinition[] = [
  {
    id: FORM_IDS.contactPage,
    name: 'Contact',
    page: '/',
    type: 'contact',
  },
];

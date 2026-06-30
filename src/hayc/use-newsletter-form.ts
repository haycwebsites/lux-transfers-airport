/**
 * SYNCED FILE — do not modify in derived repos.
 * This file is automatically updated from the hayc-websites-template
 * repository via sync-template.yml.
 *
 * useNewsletterForm
 * -----------------
 * Handles all logic for wiring an existing newsletter or CTA subscribe
 * form to the HAYC backend. Derived repo page components own only the
 * markup and styling.
 *
 * ─── ENDPOINT ───────────────────────────────────────────────────────
 * POST /api/newsletter/subscribe
 *
 * ─── PAYLOAD FIELDS ─────────────────────────────────────────────────
 * siteId        string    Auto-resolved from config. Do not pass manually.
 * email         string    Required. Validated against EMAIL_PATTERN.
 * name          string    Optional. If set with no firstName/lastName,
 *                         backend splits into first + last automatically.
 * firstName     string    Optional. Stored on contact record.
 * lastName      string    Optional. Stored on contact record.
 * group         string    Optional. Added as a tag on the contact.
 * tags          string[]  Optional. Defaults to ['newsletter-form'].
 *                         Override per form via options parameter.
 * subscribed    boolean   Driven by newsletterOptIn. Default: true.
 *                         false = contact recorded as unsubscribed.
 * _hp           string    Honeypot. Always sent. Never expose to user.
 *
 * ─── OPTIONS ────────────────────────────────────────────────────────
 * useNewsletterForm({ tags: ['cta-about'] })
 * Pass custom tags to identify which form/section the subscriber
 * came from. Use a different tag per form placement:
 *   'newsletter-form'  — footer or dedicated newsletter section
 *   'cta-about'        — about page CTA
 *   'cta-portfolio'    — portfolio page CTA
 *   'cta-schedule'     — schedule page CTA
 *   'contact-form'     — fired internally by useContactForm
 *
 * ─── RETURN VALUES ──────────────────────────────────────────────────
 * email, setEmail             — email field state (required)
 * name, setName               — name field state (optional)
 * firstName, setFirstName     — firstName field state (optional)
 * lastName, setLastName       — lastName field state (optional)
 * group, setGroup             — group field state (optional)
 * hp, setHp                   — honeypot state (hidden input)
 * newsletterOptIn,            — subscribe checkbox state (default: true)
 *   setNewsletterOptIn
 * loading                     — true while request is in flight
 * submitted                   — true after successful submission
 * error                       — error string or null
 * handleSubmit                — form onSubmit handler
 *
 * ─── USAGE IN DERIVED REPO ──────────────────────────────────────────
 * 1. Call the hook at the top of your page component.
 *    Pass a tag that identifies this form placement:
 *
 *   const {
 *     email, setEmail,
 *     name, setName,         // include if form has a name field
 *     hp, setHp,
 *     newsletterOptIn, setNewsletterOptIn,
 *     loading, submitted, error, handleSubmit,
 *   } = useNewsletterForm({ tags: ['cta-about'] });
 *
 * 2. Wire the existing form markup:
 *
 *   <form className="your-form" onSubmit={handleSubmit}>
 *
 *     {/* Honeypot — always include, never style or label *\/}
 *     <input type="text" name="_hp" value={hp}
 *       onChange={e => setHp(e.target.value)}
 *       autoComplete="off" tabIndex={-1}
 *       style={{ display: 'none' }} aria-hidden />
 *
 *     {/* Include only fields your form has *\/}
 *     <input value={name} onChange={e => setName(e.target.value)} />
 *     <input value={email} onChange={e => setEmail(e.target.value)} />
 *
 *     {/* Optional newsletter opt-in checkbox *\/}
 *     <input type="checkbox" checked={newsletterOptIn}
 *       onChange={e => setNewsletterOptIn(e.target.checked)} />
 *
 *     <button type="submit" disabled={loading}>
 *       {loading ? '...' : t(config.footerConfig.subscribeButton)}
 *     </button>
 *
 *     {error && <p>{error}</p>}
 *   </form>
 *
 * 3. Show success state by replacing the form when submitted is true:
 *
 *   {submitted ? (
 *     <p>{t(config.footerConfig.newsletterSuccessText)}</p>
 *   ) : (
 *     <form ...>...</form>
 *   )}
 *
 * ─── NOTES ──────────────────────────────────────────────────────────
 * - Wire only the fields your form actually has — unused state fields
 *   are simply not sent in the payload (conditional spread).
 * - Success/error copy comes from config.newsletterFormConfig.
 * - newsletterOptIn defaults to true — most CTA forms auto-subscribe.
 *   Set to false default if explicit opt-in is required.
 * - Each form placement should use a unique tag so subscribers can be
 *   segmented by source in the HAYC dashboard.
 */
import { useState, useCallback } from 'react';
import { useHayc } from './config-context';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useNewsletterForm(options?: { tags?: string[] }) {
  const tags = options?.tags ?? ['newsletter-form'];
  const { t, config } = useHayc();
  const apiUrl = config.siteConfig.apiUrl;
  const siteId = config.siteConfig.siteId;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [group, setGroup] = useState('');
  const [hp, setHp] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const emailValue = email.trim();
      const nameValue = name.trim();

      if (!EMAIL_PATTERN.test(emailValue)) {
        setError(t(config.newsletterFormConfig.emailInvalid));
        return;
      }
      if (!apiUrl || !siteId) {
        setError(t(config.newsletterFormConfig.errorText));
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            email: emailValue,
            ...(nameValue && { name: nameValue }),
            ...(firstName.trim() && { firstName: firstName.trim() }),
            ...(lastName.trim() && { lastName: lastName.trim() }),
            ...(group.trim() && { group: group.trim() }),
            subscribed: newsletterOptIn,
            tags,
            _hp: hp,
          }),
        });
        if (!res.ok) throw new Error('failed');
        setSubmitted(true);
      } catch {
        setError(t(config.newsletterFormConfig.errorText));
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, siteId, email, name, firstName, lastName, group, hp, newsletterOptIn, tags]
  );

  return {
    email,
    setEmail,
    name,
    setName,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    group,
    setGroup,
    hp,
    setHp,
    newsletterOptIn,
    setNewsletterOptIn,
    loading,
    submitted,
    error,
    handleSubmit,
  };
}

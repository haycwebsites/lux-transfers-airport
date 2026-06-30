/**
 * SYNCED FILE — do not modify in derived repos.
 * This file is automatically updated from the hayc-websites-template
 * repository via sync-template.yml.
 *
 * useContactForm
 * --------------
 * Handles all logic for wiring an existing contact form to the HAYC
 * backend. Derived repo page components own only the markup and styling.
 *
 * ─── ENDPOINT ───────────────────────────────────────────────────────
 * POST /public/contact
 *
 * ─── PAYLOAD FIELDS ─────────────────────────────────────────────────
 * siteId    string    Auto-resolved from config. Do not pass manually.
 * name      string    Required. Min 1, max 100 chars. Validated.
 * email     string    Required. Must be valid email. Validated.
 * message   string    Required. Min 1, max 2000 chars. Validated.
 * phone     string    Optional. Not validated. Sent if non-empty.
 * age       string    Optional. Not validated. Sent if non-empty.
 * _hp       string    Honeypot. Always sent. Never expose to user.
 *
 * ─── SIDE EFFECT ────────────────────────────────────────────────────
 * After a successful contact submission, the hook automatically fires
 * a newsletter subscribe call to POST /api/newsletter/subscribe:
 *   subscribed: newsletterOptIn (false by default)
 *   tags: ['contact-form']
 * Always fires — subscribed:false records the contact as unsubscribed
 * rather than skipping the record entirely.
 * Wire a checkbox to newsletterOptIn to let the user opt in.
 *
 * ─── ANALYTICS EVENTS ───────────────────────────────────────────────
 * form_start   Fire manually on first field focus via setFormStarted.
 * form_submit  Fired automatically on successful submission.
 * form_abandon Fired automatically on page hide with dirty fields.
 *
 * ─── RETURN VALUES ──────────────────────────────────────────────────
 * name, setName               — name field state
 * phone, setPhone             — phone field state (optional)
 * age, setAge                 — age field state (optional)
 * email, setEmail             — email field state
 * message, setMessage         — message field state
 * hp, setHp                   — honeypot state (hidden input)
 * newsletterOptIn,            — newsletter checkbox state
 *   setNewsletterOptIn
 * loading                     — true while request is in flight
 * submitted                   — true after successful submission
 * error                       — global error string or null
 * fieldErrors                 — { name?, email?, message? }
 * handleSubmit                — form onSubmit handler
 * formStarted, setFormStarted — analytics form_start tracking
 *
 * ─── USAGE IN DERIVED REPO ──────────────────────────────────────────
 * 1. Call the hook at the top of your page component:
 *
 *   const {
 *     name, setName, phone, setPhone, age, setAge,
 *     email, setEmail, message, setMessage,
 *     hp, setHp,
 *     newsletterOptIn, setNewsletterOptIn,
 *     loading, submitted, error, fieldErrors,
 *     handleSubmit, formStarted, setFormStarted,
 *   } = useContactForm();
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
 *     <input value={name} onChange={e => setName(e.target.value)}
 *       onFocus={() => {
 *         if (!formStarted) {
 *           setFormStarted(true);
 *           trackEvent(apiUrl, siteId, 'form_start', location.pathname,
 *             { form: 'contact' });
 *         }
 *       }} />
 *     {fieldErrors.name && <p>{fieldErrors.name}</p>}
 *
 *     <input value={phone} onChange={e => setPhone(e.target.value)} />
 *
 *     <input value={age} onChange={e => setAge(e.target.value)} />
 *
 *     <input value={email} onChange={e => setEmail(e.target.value)} />
 *     {fieldErrors.email && <p>{fieldErrors.email}</p>}
 *
 *     <textarea value={message} onChange={e => setMessage(e.target.value)} />
 *     {fieldErrors.message && <p>{fieldErrors.message}</p>}
 *
 *     {/* Newsletter opt-in checkbox *\/}
 *     <input type="checkbox" checked={newsletterOptIn}
 *       onChange={e => setNewsletterOptIn(e.target.checked)} />
 *
 *     <button type="submit" disabled={loading}>
 *       {loading ? '...' : 'Send'}
 *     </button>
 *
 *     {error && <p>{error}</p>}
 *   </form>
 *
 * 3. Show success state:
 *
 *   {submitted && (
 *     <div>
 *       <p>{t(config.contactPageConfig.successTitle)}</p>
 *       <p>{t(config.contactPageConfig.successText)}</p>
 *     </div>
 *   )}
 *
 * ─── NOTES ──────────────────────────────────────────────────────────
 * - Do not import this hook into ContactForm.tsx (synced component).
 *   Use it only in derived repo page components that own their markup.
 * - Success/error copy comes from config.contactFormConfig.
 * - Phone is sent to the backend but not validated — validate in UI
 *   if required by the client.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useHayc } from './config-context';
import { trackEvent } from './use-analytics';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HARDCODED_TAGS: string[] = ['contact-form'];

export function useContactForm() {
  const { t, config } = useHayc();
  const c = config.contactFormConfig;
  const location = useLocation();
  const siteId = config.siteConfig.siteId;
  const apiUrl = config.siteConfig.apiUrl;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hp, setHp] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    isDirtyRef.current =
      name.trim().length > 0 ||
      email.trim().length > 0 ||
      message.trim().length > 0;
  }, [name, email, message]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'hidden' &&
        isDirtyRef.current &&
        !submitted
      ) {
        trackEvent(apiUrl, siteId, 'form_abandon', location.pathname, {
          form: 'contact',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [apiUrl, siteId, location.pathname, submitted]);

  const validate = useCallback((): boolean => {
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) errors.name = t(c.nameRequired);
    if (!EMAIL_PATTERN.test(email.trim())) errors.email = t(c.emailInvalid);
    if (!message.trim()) errors.message = t(c.messageRequired);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [name, email, message, t, c]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!validate()) return;

      if (!apiUrl || !siteId) {
        setError(t(c.errorText));
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/public/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            name: name.trim(),
            phone: phone.trim(),
            age: age.trim(),
            email: email.trim(),
            message: message.trim(),
            _hp: hp,
          }),
        });
        if (!res.ok) throw new Error('Request failed');
        setSubmitted(true);
        isDirtyRef.current = false;
        trackEvent(apiUrl, siteId, 'form_submit', location.pathname, {
          form: 'contact',
        });
        fetch(`${apiUrl}/api/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            email: email.trim(),
            name: name.trim(),
            subscribed: newsletterOptIn,
            tags: HARDCODED_TAGS,
            _hp: hp,
          }),
        }).catch(() => {});
      } catch {
        setError(t(c.errorText));
      } finally {
        setLoading(false);
      }
    },
    [
      apiUrl,
      siteId,
      name,
      phone,
      age,
      email,
      message,
      hp,
      validate,
      t,
      c,
      newsletterOptIn,
      location.pathname,
    ]
  );

  return {
    name,
    setName,
    phone,
    setPhone,
    age,
    setAge,
    email,
    setEmail,
    message,
    setMessage,
    hp,
    setHp,
    newsletterOptIn,
    setNewsletterOptIn,
    loading,
    submitted,
    error,
    fieldErrors,
    handleSubmit,
    formStarted,
    setFormStarted,
  };
}

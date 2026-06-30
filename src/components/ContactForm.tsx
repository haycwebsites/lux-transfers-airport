/*
* USE THE HOOK INSTEAD OF THIS FILE FOR DERIVED REPOS use-contact-form.ts
 * SYNCED FILE — do not modify in derived repos.
 * This file is automatically updated from the hayc-websites-template
 * repository via sync-template.yml.
 *
 * USAGE PATTERN:
 * Do not reimplement this form's logic inline in derived repos.
 * Instead, create a site-specific page component that imports and
 * renders <ContactForm /> and owns only the styling:
 *
 *   // src/pages/ContactPage.tsx (derived repo owned)
 *   import { ContactForm } from '../components/ContactForm';
 *
 *   export function ContactPage() {
 *     return (
 *       <div className="your-page-shell">
 *         <ContactForm />
 *       </div>
 *     );
 *   }
 *
 * Style the form via these CSS class hooks in a <style> block
 * in your page component:
 *   .contact-form            — form wrapper
 *   .contact-form-field      — each field wrapper
 *   .contact-form-input      — text inputs
 *   .contact-form-textarea   — message textarea
 *   .contact-form-button     — submit button
 *   .contact-form-error      — error message
 *   .contact-form-success    — success state wrapper
 *   .contact-form-newsletter — newsletter toggle wrapper
 *
 * Following this pattern ensures all analytics tracking
 * (form_start, form_abandon, form_submit, newsletter call)
 * is inherited automatically via template syncs.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useHayc } from '../hayc/config-context';
import { trackEvent } from '../hayc/use-analytics';

const labels = {
  nameLabel: { el: 'Όνομα', en: 'Name' },
  emailLabel: { el: 'Email', en: 'Email' },
  messageLabel: { el: 'Μήνυμα', en: 'Message' },
  submitButton: { el: 'Αποστολή', en: 'Send Message' },
  submitting: { el: 'Αποστολή...', en: 'Sending...' },
  successTitle: { el: 'Το μήνυμά σας στάλθηκε!', en: 'Message sent!' },
  successText: {
    el: 'Θα επικοινωνήσουμε μαζί σας σύντομα.',
    en: 'We will get back to you shortly.',
  },
  errorText: {
    el: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.',
    en: 'Something went wrong. Please try again.',
  },
  nameRequired: {
    el: 'Το όνομα είναι υποχρεωτικό.',
    en: 'Name is required.',
  },
  emailInvalid: {
    el: 'Εισάγετε έγκυρο email.',
    en: 'Please enter a valid email.',
  },
  messageRequired: {
    el: 'Το μήνυμα είναι υποχρεωτικό.',
    en: 'Message is required.',
  },
  newsletterOptInLabel: { el: 'Εγγραφή στο newsletter', en: 'Subscribe to newsletter' },
  newsletterOptInHint: { el: 'Λαμβάνετε νέα και ενημερώσεις', en: 'Receive news and updates' },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const { t, config } = useHayc();
  const location = useLocation();
  const siteId = config.siteConfig.siteId;
  const apiUrl = config.siteConfig.apiUrl;

  const [name, setName] = useState('');
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
  const hardcodedTags: string[] = ['contact-form'];

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
    if (!name.trim()) errors.name = t(labels.nameRequired);
    if (!EMAIL_PATTERN.test(email.trim())) errors.email = t(labels.emailInvalid);
    if (!message.trim()) errors.message = t(labels.messageRequired);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [name, email, message, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!validate()) return;

      if (!apiUrl || !siteId) {
        setError(t(labels.errorText));
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
        /*
         * POST /api/newsletter/subscribe
         *
         * Required (minimum):
         *   siteId    — resolved from config.siteConfig.siteId
         *   email     — visitor's email address
         *
         * Optional (maximum):
         *   name        — visitor's full name
         *   firstName   — visitor's first name
         *   lastName    — visitor's last name
         *   group       — subscriber group name (string)
         *   tags        — array or comma-separated string of tag names
         *   subscribed  — boolean; true = subscribed, false = unsubscribed (default: true)
         *   _hp         — honeypot field; non-empty value silently discards the request
         *
         * Always fire regardless of newsletterOptIn value — the backend uses
         * subscribed: false to record the contact as unsubscribed rather than
         * skipping the record entirely.
         */
        fetch(`${apiUrl}/api/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            email: email.trim(),
            name: name.trim(),
            subscribed: newsletterOptIn,
            tags: hardcodedTags,
            _hp: hp,
          }),
        }).catch(() => {});
      } catch {
        setError(t(labels.errorText));
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, siteId, name, email, message, hp, validate, t, newsletterOptIn]
  );

  if (submitted) {
    return (
      <>
        <style>{`
          .contact-form-success { text-align: center; }
          .contact-form-success h3 {
            margin: 0 0 0.5rem;
            font-size: 1.125rem;
            font-weight: 600;
          }
          .contact-form-success p {
            margin: 0;
            font-size: 0.875rem;
            color: #71717a;
          }
        `}</style>
        <div className="contact-form-success">
          <h3>{t(labels.successTitle)}</h3>
          <p>{t(labels.successText)}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contact-form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .contact-form-label {
          font-size: 0.875rem;
          font-weight: 500;
        }
        .contact-form-input,
        .contact-form-textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 0.5rem 0.75rem;
          font: inherit;
          font-size: 1rem;
          line-height: 1.5;
          border: 1px solid #d4d4d8;
          border-radius: 0.375rem;
          background: #fff;
          color: inherit;
        }
        .contact-form-textarea {
          min-height: 6rem;
          resize: vertical;
        }
        .contact-form-input:disabled,
        .contact-form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .contact-form-input[aria-invalid="true"],
        .contact-form-textarea[aria-invalid="true"] {
          border-color: #dc2626;
        }
        .contact-form-button {
          width: 100%;
          padding: 0.5rem 1rem;
          font: inherit;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          border-radius: 0.375rem;
          background: #18181b;
          color: #fafafa;
        }
        .contact-form-button:hover:not(:disabled) {
          background: #27272a;
        }
        .contact-form-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .contact-form-error {
          margin: 0;
          font-size: 0.875rem;
          color: #dc2626;
        }
      `}</style>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <input
          type="text"
          name="_hp"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          style={{ display: 'none' }}
          aria-hidden
        />

        <div className="contact-form-field">
          <label className="contact-form-label" htmlFor="contact-name">
            {t(labels.nameLabel)}
          </label>
          <input
            id="contact-name"
            className="contact-form-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
            onFocus={() => {
              if (!formStarted) {
                setFormStarted(true);
                trackEvent(apiUrl, siteId, 'form_start', location.pathname, {
                  form: 'contact',
                });
              }
            }}
            disabled={loading}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className="contact-form-error">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="contact-form-field">
          <label className="contact-form-label" htmlFor="contact-email">
            {t(labels.emailLabel)}
          </label>
          <input
            id="contact-email"
            className="contact-form-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
            onFocus={() => {
              if (!formStarted) {
                setFormStarted(true);
                trackEvent(apiUrl, siteId, 'form_start', location.pathname, {
                  form: 'contact',
                });
              }
            }}
            disabled={loading}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" className="contact-form-error">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="contact-form-field">
          <label className="contact-form-label" htmlFor="contact-message">
            {t(labels.messageLabel)}
          </label>
          <textarea
            id="contact-message"
            className="contact-form-textarea"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: undefined }));
            }}
            onFocus={() => {
              if (!formStarted) {
                setFormStarted(true);
                trackEvent(apiUrl, siteId, 'form_start', location.pathname, {
                  form: 'contact',
                });
              }
            }}
            disabled={loading}
            rows={4}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
          />
          {fieldErrors.message && (
            <p id="contact-message-error" className="contact-form-error">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="contact-form-field contact-form-newsletter">
          <label className="contact-form-newsletter-label">
            <input
              type="checkbox"
              className="contact-form-newsletter-checkbox"
              checked={newsletterOptIn}
              onChange={(e) => setNewsletterOptIn(e.target.checked)}
            />
            <span className="contact-form-newsletter-text">
              <span className="contact-form-newsletter-title">
                {t(labels.newsletterOptInLabel)}
              </span>
              <span className="contact-form-newsletter-hint">
                {t(labels.newsletterOptInHint)}
              </span>
            </span>
          </label>
        </div>

        <button type="submit" className="contact-form-button" disabled={loading}>
          {loading ? t(labels.submitting) : t(labels.submitButton)}
        </button>

        {error && (
          <p className="contact-form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </>
  );
}

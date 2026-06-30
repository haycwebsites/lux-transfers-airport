/*
 * USE THE HOOK INSTEAD OF THIS FILE FOR DERIVED REPOS use-newsletter-form.ts
 * SYNCED FILE — do not modify in derived repos.
 * This file is automatically updated from the hayc-websites-template
 * repository via sync-template.yml.
 *
 * USAGE PATTERN:
 * Do not reimplement this form's logic inline in derived repos.
 * Instead, create a site-specific section component that imports
 * and renders <NewsletterForm /> and owns only the styling:
 *
 *   // src/components/NewsletterSection.tsx (derived repo owned)
 *   import { NewsletterForm } from './NewsletterForm';
 *
 *   export function NewsletterSection() {
 *     return (
 *       <div className="your-section-shell">
 *         <h2>Stay in touch</h2>
 *         <NewsletterForm />
 *       </div>
 *     );
 *   }
 *
 * Following this pattern ensures form_submit analytics tracking
 * is inherited automatically via template syncs.
 */
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useHayc } from '../hayc/config-context';
import { trackEvent } from '../hayc/use-analytics';

// <NewsletterForm />

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const { config } = useHayc();
  const location = useLocation();
  const siteId = config.siteConfig.siteId;
  const apiUrl = config.siteConfig.apiUrl;

  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const normalizedEmail = email.trim();
      if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
        setError('Please enter a valid email address.');
        return;
      }

      if (hp.trim()) {
        setSubmitted(true);
        return;
      }

      if (!apiUrl || !siteId) {
        setError('Something went wrong. Please try again.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            email: normalizedEmail,
            _hp: hp,
          }),
        });

        if (!res.ok) throw new Error('Request failed');
        setSubmitted(true);
        trackEvent(apiUrl, siteId, 'form_submit', location.pathname, {
          form: 'newsletter',
        });
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [email, hp, apiUrl, siteId]
  );

  if (submitted) {
    return (
      <p className="text-sm text-green-700" role="status">
        You are subscribed. Thank you.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <input
        type="text"
        name="_hp"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden
      />

      <div className="flex w-full items-start gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
          className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Email"
          aria-invalid={!!error}
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

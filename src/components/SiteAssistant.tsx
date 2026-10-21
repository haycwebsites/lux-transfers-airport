/*
 * SYNCED FILE — do not modify in derived repos.
 * This file is automatically updated from the hayc-websites-template
 * repository via sync-template.yml.
 *
 * <SiteAssistant />
 * -----------------
 * Floating "Smart Assistant" chat widget. Answers visitor questions from
 * the site's own config (assistantConfig.faqs + page content) using the
 * client-side search in src/hayc/site-search.ts. No AI, no network calls.
 *
 * Renders nothing unless the site's config has assistantConfig.enabled.
 * Sites without an assistantConfig section simply never show it.
 * Mount once in src/App.tsx, inside <HaycProvider> (outside the router is
 * fine — it uses no router hooks):
 *
 *   <SiteAssistant />
 *
 * Only relies on useHayc()'s locale, config and cp, which every site has —
 * not on t(), whose return type differs between sites.
 *
 * Colors follow the site's --primary / --primary-foreground HSL tokens.
 * Override with assistantConfig.accentColor, or the CSS variables
 * --hayc-assistant-accent / --hayc-assistant-accent-fg.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { useHayc } from '../hayc/config-context';
import type { AssistantConfig, LocaleString, SearchLocale, SiteSearchResult } from '../hayc/site-search';

// Loaded on demand so sites with the assistant disabled don't ship MiniSearch.
type SearchEngine = typeof import('../hayc/site-search');

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  results: SiteSearchResult[];
}

const MAX_SUGGESTIONS = 4;
const MAX_SNIPPET = 280;

function snippet(text: string): string {
  if (text.length <= MAX_SNIPPET) return text;
  const cut = text.slice(0, MAX_SNIPPET);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return (sentenceEnd > MAX_SNIPPET / 2 ? cut.slice(0, sentenceEnd + 1) : cut.slice(0, cut.lastIndexOf(' '))) + '…';
}

export function SiteAssistant() {
  const { config, locale, cp } = useHayc();
  const assistant = (config as { assistantConfig?: AssistantConfig }).assistantConfig;
  const searchLocale: SearchLocale = locale === 'en' ? 'en' : 'el';
  const tx = (val?: LocaleString): string => (val ? val[searchLocale] || val.en || val.el || '' : '');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // Answers belong to the language they were found in — a locale switch starts over.
  const [chat, setChat] = useState<{ locale: string; messages: ChatMessage[] }>({ locale, messages: [] });
  const messages = chat.locale === locale ? chat.messages : [];
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [engine, setEngine] = useState<SearchEngine | null>(null);

  useEffect(() => {
    if (assistant?.enabled && !engine) import('../hayc/site-search').then(setEngine);
  }, [assistant?.enabled, engine]);

  const index = useMemo(
    () => (assistant?.enabled && engine ? engine.buildIndex(config, searchLocale) : null),
    [assistant?.enabled, engine, config, searchLocale],
  );

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!assistant?.enabled || !engine || !index) return null;

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    const results = engine.search(index, text);
    setChat({
      locale,
      messages: [
        ...messages,
        { id: nextId.current++, role: 'user', text, results: [] },
        { id: nextId.current++, role: 'assistant', text: '', results },
      ],
    });
    setQuery('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(query);
  };

  const suggestions = assistant.faqs.slice(0, MAX_SUGGESTIONS).filter(f => tx(f.question));
  const style = assistant.accentColor
    ? ({ '--hayc-assistant-accent': assistant.accentColor } as CSSProperties)
    : undefined;

  return (
    <div className="hayc-sa" style={style}>
      <style>{CSS}</style>

      {open && (
        <div className="hayc-sa-panel" role="dialog" aria-label={tx(assistant.title)}>
          <div className="hayc-sa-header">
            <span className="hayc-sa-title" {...cp('assistantConfig.title')}>{tx(assistant.title)}</span>
            <button
              type="button"
              className="hayc-sa-close"
              aria-label={tx(assistant.closeLabel)}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="hayc-sa-messages" ref={listRef} aria-live="polite">
            <div className="hayc-sa-msg hayc-sa-msg--assistant" {...cp('assistantConfig.greeting')}>
              {tx(assistant.greeting)}
            </div>

            {messages.length === 0 && suggestions.length > 0 && (
              <div className="hayc-sa-suggestions">
                {suggestions.map((faq, i) => (
                  <button
                    key={i}
                    type="button"
                    className="hayc-sa-chip"
                    onClick={() => ask(tx(faq.question))}
                    {...cp(`assistantConfig.faqs[${i}].question`)}
                  >
                    {tx(faq.question)}
                  </button>
                ))}
              </div>
            )}

            {messages.map(msg =>
              msg.role === 'user' ? (
                <div key={msg.id} className="hayc-sa-msg hayc-sa-msg--user">{msg.text}</div>
              ) : (
                <div key={msg.id} className="hayc-sa-msg hayc-sa-msg--assistant">
                  {msg.results.length > 0 ? (
                    msg.results.map((r, i) => (
                      <div key={i} className="hayc-sa-result">
                        {r.heading && r.kind === 'content' && <strong className="hayc-sa-result-heading">{r.heading}</strong>}
                        <div>{r.kind === 'faq' ? r.text : snippet(r.text)}</div>
                        {r.link && (
                          <a className="hayc-sa-link" href={r.link} {...cp('assistantConfig.linkLabel')}>
                            {tx(assistant.linkLabel)} →
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      <div {...cp('assistantConfig.noResults')}>{tx(assistant.noResults)}</div>
                      {assistant.contactLink && (
                        <a className="hayc-sa-cta" href={assistant.contactLink} {...cp('assistantConfig.contactLabel')}>
                          {tx(assistant.contactLabel)}
                        </a>
                      )}
                    </>
                  )}
                </div>
              ),
            )}
          </div>

          <form className="hayc-sa-form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              className="hayc-sa-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tx(assistant.placeholder)}
              aria-label={tx(assistant.placeholder)}
              maxLength={200}
              {...cp('assistantConfig.placeholder')}
            />
            <button type="submit" className="hayc-sa-send" aria-label={tx(assistant.sendLabel)} disabled={!query.trim()}>
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="hayc-sa-toggle"
        aria-label={open ? tx(assistant.closeLabel) : tx(assistant.title)}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}

export default SiteAssistant;

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

const CSS = `
.hayc-sa {
  --sa-accent: var(--hayc-assistant-accent, hsl(var(--primary, 222 47% 11%)));
  --sa-accent-fg: var(--hayc-assistant-accent-fg, hsl(var(--primary-foreground, 0 0% 100%)));
  position: fixed; right: 20px; bottom: 20px; z-index: 9999;
  display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
  font-family: inherit; font-size: 15px; line-height: 1.45; color: #1f2937;
}
.hayc-sa *, .hayc-sa *::before, .hayc-sa *::after { box-sizing: border-box; }
.hayc-sa-toggle {
  width: 58px; height: 58px; border-radius: 50%; border: none; cursor: pointer;
  background: var(--sa-accent); color: var(--sa-accent-fg);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(0,0,0,.22); transition: transform .15s ease;
}
.hayc-sa-toggle:hover { transform: scale(1.06); }
.hayc-sa-panel {
  width: min(370px, calc(100vw - 32px)); height: min(540px, calc(100vh - 110px));
  background: #fff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,.2); display: flex; flex-direction: column;
  animation: hayc-sa-in .18s ease-out;
}
@keyframes hayc-sa-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.hayc-sa-header {
  background: var(--sa-accent); color: var(--sa-accent-fg);
  padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;
}
.hayc-sa-title { font-weight: 600; font-size: 16px; }
.hayc-sa-close { background: none; border: none; color: inherit; cursor: pointer; padding: 4px; display: flex; opacity: .85; }
.hayc-sa-close:hover { opacity: 1; }
.hayc-sa-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f7f7f8; }
.hayc-sa-msg { max-width: 88%; padding: 10px 13px; border-radius: 14px; word-wrap: break-word; }
.hayc-sa-msg--assistant { align-self: flex-start; background: #fff; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }
.hayc-sa-msg--user { align-self: flex-end; background: var(--sa-accent); color: var(--sa-accent-fg); border-bottom-right-radius: 4px; }
.hayc-sa-result + .hayc-sa-result { margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; }
.hayc-sa-result-heading { display: block; margin-bottom: 2px; }
.hayc-sa-link { display: inline-block; margin-top: 4px; color: var(--sa-accent); font-weight: 600; text-decoration: none; }
.hayc-sa-link:hover { text-decoration: underline; }
.hayc-sa-cta {
  display: inline-block; margin-top: 8px; padding: 7px 14px; border-radius: 999px;
  background: var(--sa-accent); color: var(--sa-accent-fg); text-decoration: none; font-weight: 600;
}
.hayc-sa-suggestions { display: flex; flex-wrap: wrap; gap: 6px; }
.hayc-sa-chip {
  background: #fff; border: 1px solid var(--sa-accent); color: var(--sa-accent);
  border-radius: 999px; padding: 6px 12px; font: inherit; font-size: 13.5px; cursor: pointer; text-align: left;
}
.hayc-sa-chip:hover { background: var(--sa-accent); color: var(--sa-accent-fg); }
.hayc-sa-form { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #e5e7eb; background: #fff; }
.hayc-sa-input {
  flex: 1; min-width: 0; border: 1px solid #d1d5db; border-radius: 999px; padding: 9px 14px;
  font: inherit; font-size: 16px; color: inherit; background: #fff; outline: none;
}
.hayc-sa-input:focus { border-color: var(--sa-accent); }
.hayc-sa-send {
  width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; border: none; cursor: pointer;
  background: var(--sa-accent); color: var(--sa-accent-fg); display: flex; align-items: center; justify-content: center;
}
.hayc-sa-send:disabled { opacity: .45; cursor: default; }
@media (max-width: 480px) { .hayc-sa { right: 16px; bottom: 16px; } }
`;

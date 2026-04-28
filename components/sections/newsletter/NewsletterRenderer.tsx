'use client';

import { useState, useTransition } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NewsletterSectionConfig {
  title?: string;
  description?: string;
  ctaLabel?: string;
  placeholder?: string;
  successMessage?: string;
  source?: string;
}

interface NewsletterFormProps {
  locale: string;
  config?: NewsletterSectionConfig;
  variant?: 'inline' | 'card' | 'footer';
}

// ─── Shared Form Logic ───────────────────────────────────────────────────────

function useNewsletterForm(locale: string, source?: string) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, locale, source: source ?? 'home' }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(
            data?.message ??
              (locale === 'tr' ? 'Bir hata oluştu.' : 'Something went wrong.')
          );
          setStatus('error');
        } else {
          setStatus('success');
          setEmail('');
        }
      } catch {
        setErrorMsg(locale === 'tr' ? 'Bağlantı hatası.' : 'Connection error.');
        setStatus('error');
      }
    });
  };

  return { email, setEmail, status, errorMsg, isPending, handleSubmit };
}

// ─── Inline Variant ──────────────────────────────────────────────────────────

export function NewsletterInline({ locale, config }: NewsletterFormProps) {
  const title =
    config?.title ??
    (locale === 'tr' ? 'Bültenimize Abone Olun' : 'Subscribe to Our Newsletter');
  const description =
    config?.description ??
    (locale === 'tr'
      ? 'En güncel haberler ve duyurular için abone olun.'
      : 'Stay up to date with the latest news and announcements.');
  const ctaLabel = config?.ctaLabel ?? (locale === 'tr' ? 'Abone Ol' : 'Subscribe');
  const placeholder =
    config?.placeholder ?? (locale === 'tr' ? 'E-posta adresiniz' : 'Your email address');
  const successMessage =
    config?.successMessage ??
    (locale === 'tr' ? 'Teşekkürler! Abone oldunuz.' : 'Thank you! You are subscribed.');

  const { email, setEmail, status, errorMsg, isPending, handleSubmit } = useNewsletterForm(
    locale,
    config?.source ?? 'newsletter-inline'
  );

  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <h2
          className="text-2xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-3 text-base"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        )}

        {status === 'success' ? (
          <p
            className="mt-6 text-base"
            style={{ color: 'var(--color-accent)' }}
          >
            {successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <input
              aria-label="E-posta adresi"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full sm:w-72"
              style={{
                borderRadius: 'var(--radius-input, var(--radius-card))',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                padding: '0.625rem 1rem',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={isPending}
              style={{
                borderRadius: 'var(--radius-button, var(--radius-card))',
                background: 'var(--color-accent)',
                color: 'var(--color-accent-fg, #fff)',
                padding: '0.625rem 1.5rem',
                fontSize: '0.9375rem',
                fontFamily: 'var(--font-display)',
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
                border: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {isPending ? (locale === 'tr' ? 'Gönderiliyor…' : 'Sending…') : ctaLabel}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p
            className="mt-3 text-sm"
            style={{ color: 'var(--color-error, #e53e3e)' }}
          >
            {errorMsg}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Card Variant ────────────────────────────────────────────────────────────

export function NewsletterCard({ locale, config }: NewsletterFormProps) {
  const title =
    config?.title ??
    (locale === 'tr' ? 'Bültenimize Abone Olun' : 'Subscribe to Our Newsletter');
  const description =
    config?.description ??
    (locale === 'tr'
      ? 'Yeni içeriklerden ilk siz haberdar olun.'
      : 'Be the first to know about new content.');
  const ctaLabel = config?.ctaLabel ?? (locale === 'tr' ? 'Abone Ol' : 'Subscribe');
  const placeholder =
    config?.placeholder ?? (locale === 'tr' ? 'E-posta adresiniz' : 'Your email address');
  const successMessage =
    config?.successMessage ??
    (locale === 'tr' ? 'Teşekkürler! Abone oldunuz.' : 'Thank you! You are subscribed.');

  const { email, setEmail, status, errorMsg, isPending, handleSubmit } = useNewsletterForm(
    locale,
    config?.source ?? 'newsletter-card'
  );

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto max-w-xl px-4">
        <div
          className="p-8"
          style={{
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-bg-muted)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2
            className="text-2xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {title}
          </h2>
          {description && (
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {description}
            </p>
          )}

          {status === 'success' ? (
            <p
              className="mt-6 text-sm"
              style={{ color: 'var(--color-accent)' }}
            >
              {successMessage}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                aria-label="E-posta adresi"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="w-full"
                style={{
                  borderRadius: 'var(--radius-input, var(--radius-card))',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  padding: '0.625rem 1rem',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full"
                style={{
                  borderRadius: 'var(--radius-button, var(--radius-card))',
                  background: 'var(--color-accent)',
                  color: 'var(--color-accent-fg, #fff)',
                  padding: '0.625rem 1rem',
                  fontSize: '0.9375rem',
                  fontFamily: 'var(--font-display)',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                  border: 'none',
                }}
              >
                {isPending ? (locale === 'tr' ? 'Gönderiliyor…' : 'Sending…') : ctaLabel}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--color-error, #e53e3e)' }}
            >
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer Variant ──────────────────────────────────────────────────────────

export function NewsletterFooter({ locale, config }: NewsletterFormProps) {
  const title =
    config?.title ?? (locale === 'tr' ? 'Bülten' : 'Newsletter');
  const ctaLabel = config?.ctaLabel ?? (locale === 'tr' ? 'Abone Ol' : 'Subscribe');
  const placeholder =
    config?.placeholder ?? (locale === 'tr' ? 'E-posta adresiniz' : 'Your email address');
  const successMessage =
    config?.successMessage ??
    (locale === 'tr' ? 'Teşekkürler!' : 'Thank you!');

  const { email, setEmail, status, errorMsg, isPending, handleSubmit } = useNewsletterForm(
    locale,
    config?.source ?? 'newsletter-footer'
  );

  return (
    <div className="space-y-3">
      <p
        className="text-sm"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
      >
        {title}
      </p>

      {status === 'success' ? (
        <p
          className="text-sm"
          style={{ color: 'var(--color-accent)' }}
        >
          {successMessage}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            aria-label="E-posta adresi"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1"
            style={{
              borderRadius: 'var(--radius-input, var(--radius-card))',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={isPending}
            style={{
              borderRadius: 'var(--radius-button, var(--radius-card))',
              background: 'var(--color-accent)',
              color: 'var(--color-accent-fg, #fff)',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-display)',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.7 : 1,
              border: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {isPending ? '…' : ctaLabel}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p
          className="text-xs"
          style={{ color: 'var(--color-error, #e53e3e)' }}
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export interface NewsletterSectionProps {
  variant?: 'newsletter-inline' | 'newsletter-card' | 'newsletter-footer';
  locale: string;
  config?: NewsletterSectionConfig;
}

export function NewsletterSection({ variant = 'newsletter-inline', locale, config }: NewsletterSectionProps) {
  switch (variant) {
    case 'newsletter-card':
      return <NewsletterCard locale={locale} config={config} />;
    case 'newsletter-footer':
      return <NewsletterFooter locale={locale} config={config} />;
    case 'newsletter-inline':
    default:
      return <NewsletterInline locale={locale} config={config} />;
  }
}

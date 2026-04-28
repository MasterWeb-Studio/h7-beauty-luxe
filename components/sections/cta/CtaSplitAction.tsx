import Link from 'next/link';
import type { CtaContent } from './types';

// Split-action — 2 CTA yan yana (primary + secondary). Karar çeşitliliği olan
// siteler (SaaS free trial + demo). secondaryCta yoksa agent seçimi hatalı
// olsa da bileşen tek CTA ile graceful çalışır.
export function CtaSplitAction({ content }: { content: CtaContent }) {
  return (
    <section
      className="relative"
      style={{
        paddingBlock: 'var(--section-gap-y, 5rem)',
        background: 'var(--color-bg, var(--color-background))',
        color: 'var(--color-text, var(--color-foreground))',
      }}
    >
      <div className="container-custom">
        <div
          className="flex flex-col items-center gap-6 px-8 py-14 text-center md:px-14 md:py-16"
          style={{
            background: 'var(--color-surface, var(--color-bg, var(--color-background)))',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card, var(--radius))',
          }}
        >
          <h2
            className="max-w-2xl text-3xl tracking-tight md:text-4xl"
            style={{
              fontFamily: 'var(--font-display, var(--font-heading))',
              fontWeight: 'var(--font-weight-display, var(--font-heading-weight, 700))',
            }}
          >
            {content.headline}
          </h2>
          {content.subheadline ? (
            <p
              className="max-w-xl text-base md:text-lg"
              style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
            >
              {content.subheadline}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link
              href={content.primaryCta.href}
              className="inline-flex items-center justify-center text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-bg, var(--color-background))',
                borderRadius: 'var(--radius-button, var(--radius))',
                padding:
                  'var(--button-padding-y, 0.75rem) var(--button-padding-x, 1.5rem)',
              }}
            >
              {content.primaryCta.label}
            </Link>
            {content.secondaryCta ? (
              <Link
                href={content.secondaryCta.href}
                className="inline-flex items-center justify-center border text-sm font-medium transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text, var(--color-foreground))',
                  borderRadius: 'var(--radius-button, var(--radius))',
                  padding:
                    'var(--button-padding-y, 0.75rem) var(--button-padding-x, 1.5rem)',
                }}
              >
                {content.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

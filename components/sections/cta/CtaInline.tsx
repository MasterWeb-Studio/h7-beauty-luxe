import Link from 'next/link';
import type { CtaContent } from './types';

// Inline — background bloğu yok, merkez metin + CTA. Minimal / editorial.
export function CtaInline({ content }: { content: CtaContent }) {
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
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2
            className="text-3xl tracking-tight md:text-4xl"
            style={{
              fontFamily: 'var(--font-display, var(--font-heading))',
              fontWeight: 'var(--font-weight-display, var(--font-heading-weight, 700))',
            }}
          >
            {content.headline}
          </h2>
          {content.subheadline ? (
            <p
              className="text-base md:text-lg"
              style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
            >
              {content.subheadline}
            </p>
          ) : null}
          <Link
            href={content.primaryCta.href}
            className="mt-2 inline-flex items-center justify-center text-sm font-medium transition-opacity hover:opacity-90"
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
        </div>
      </div>
    </section>
  );
}

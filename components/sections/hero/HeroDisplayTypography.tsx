import Link from 'next/link';
import type { HeroContent } from './types';

// Sprint 22.5 borç temizliği — typography-as-art hero variant.
// Mockup referansı: agency-1 (Crafto) — devasa display headline ekrandan
// taşan büyüklükte, görsel YOK, brutalist editorial. Diğer 4 variant'ın
// hepsinde görsel + dengeli layout var; bu variant typography'i sahnenin
// merkezine alır. SaaS/agency/editorial brand sektörlerinde uygundur.
//
// Karakteristikler:
// - clamp(3.5rem, 9vw, 8rem) headline boyutu (responsive devasa)
// - tek kolon, sol hizalı (kelime kelime alt satıra düşer)
// - eyebrow küçük caps üstte, subheadline alt sütun (max-w-md)
// - CTA pair büyük outline buton stili
// - Görsel yok; aside/sağ tarafta dekoratif hiçbir şey yok
export function HeroDisplayTypography({ content }: { content: HeroContent }) {
  return (
    <section
      className="relative"
      style={{
        paddingBlock: 'var(--section-gap-y, 5rem) clamp(2rem, 5vw, 4rem)',
        background: 'var(--color-bg, var(--color-background))',
        color: 'var(--color-text, var(--color-foreground))',
      }}
    >
      <div className="container-custom">
        {content.eyebrow ? (
          <p
            className="mb-6 text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: 'var(--color-accent)' }}
          >
            {content.eyebrow}
          </p>
        ) : null}

        <h1
          className="leading-[0.95] tracking-tight"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontFamily: 'var(--font-display, var(--font-heading))',
            fontWeight: 'var(--font-weight-display, var(--font-heading-weight, 800))',
            margin: 0,
          }}
        >
          {content.headline}
        </h1>

        {content.subheadline ? (
          <p
            className="mt-10 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
          >
            {content.subheadline}
          </p>
        ) : null}

        {content.primaryCta || content.secondaryCta ? (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {content.primaryCta ? (
              <Link
                href={content.primaryCta.href}
                className="inline-flex items-center justify-center text-sm font-medium transition-colors"
                style={{
                  background: 'var(--color-text, var(--color-foreground))',
                  color: 'var(--color-bg, var(--color-background))',
                  borderRadius: 'var(--radius-button, var(--radius))',
                  padding:
                    'var(--button-padding-y, 0.875rem) var(--button-padding-x, 1.75rem)',
                }}
              >
                {content.primaryCta.label}
              </Link>
            ) : null}
            {content.secondaryCta ? (
              <Link
                href={content.secondaryCta.href}
                className="inline-flex items-center justify-center text-sm font-medium transition-opacity hover:opacity-70"
                style={{
                  color: 'var(--color-text, var(--color-foreground))',
                  borderBottom: '1px solid currentColor',
                  paddingBottom: '0.25rem',
                }}
              >
                {content.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

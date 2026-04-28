import Link from 'next/link';
import type { HeroContent } from './types';
import { SectionImageFrame } from '../_helpers/SectionImageFrame';

// Default hero — sol hizalı başlık + metin + CTA, sağ yarı boş.
// H4 dönemindeki tek layout; preset yokken scaffolder bunu varsayar.
// Sprint 18.5 G1 — content.image varsa sağ kolonda görsel (2-col'a terfi);
// yoksa eski tek-kolon max-w-3xl davranışı korunur.
export function HeroLeftAligned({ content }: { content: HeroContent }) {
  const hasImage = Boolean(content.image);

  const textBlock = (
    <div>
      {content.eyebrow ? (
        <p
          className="mb-4 text-sm font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-accent)' }}
        >
          {content.eyebrow}
        </p>
      ) : null}

      <h1
        className="text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl"
        style={{
          fontFamily: 'var(--font-display, var(--font-heading))',
          fontWeight: 'var(--font-weight-display, var(--font-heading-weight, 700))',
        }}
      >
        {content.headline}
      </h1>

      {content.subheadline ? (
        <p
          className="mt-6 max-w-2xl text-lg md:text-xl"
          style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
        >
          {content.subheadline}
        </p>
      ) : null}

      {content.primaryCta || content.secondaryCta ? (
        <div className="mt-10 flex flex-wrap gap-4">
          {content.primaryCta ? (
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
          ) : null}
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
      ) : null}
    </div>
  );

  return (
    <section
      className="relative"
      style={{
        paddingBlock: 'var(--section-gap-y, 6rem)',
        background: 'var(--color-bg, var(--color-background))',
        color: 'var(--color-text, var(--color-foreground))',
      }}
    >
      <div className="container-custom">
        {hasImage ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16">
            {textBlock}
            <div className="relative">
              <SectionImageFrame
                image={content.image}
                aspect="aspect-[4/3]"
                priority
                showPlaceholderFallback={false}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">{textBlock}</div>
        )}
      </div>
    </section>
  );
}

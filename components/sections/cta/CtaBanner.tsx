import Link from 'next/link';
import { ImageWithCredit } from '../../ImageWithCredit';
import type { CtaContent } from './types';

// Default — koyu geniş banner blok, merkezli başlık + CTA. Eski Cta.tsx'in
// preset-native hâli. Güçlü eylem çağrısı, varsayılan varyant.
// Sprint 22.5: content.image='remote' ise CTA banner background image olarak
// render edilir (HeroFullbleed pattern: cover + dark overlay + foreground
// metni cream rengi). image yoksa eski "color-text" solid arka plan korunur.
export function CtaBanner({ content }: { content: CtaContent }) {
  const hasBgImage = content.image?.type === 'remote';
  return (
    <section
      className="relative"
      style={{
        paddingBlock: 'var(--section-gap-y, 5rem)',
        background: 'var(--color-bg, var(--color-background))',
      }}
    >
      <div className="container-custom">
        <div
          className="relative flex flex-col items-center gap-6 overflow-hidden px-8 py-16 text-center md:px-16 md:py-20"
          style={{
            background: hasBgImage
              ? 'transparent'
              : 'var(--color-text, var(--color-foreground))',
            color: 'var(--color-bg, var(--color-background))',
            borderRadius: 'var(--radius-card, var(--radius))',
          }}
        >
          {hasBgImage && content.image && content.image.type === 'remote' ? (
            <>
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <ImageWithCredit
                  src={content.image.url}
                  alt={content.image.alt}
                  credit={content.image.credit}
                  creditUrl={content.image.creditUrl}
                  color={content.image.color}
                  display="hover"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <div
                className="absolute inset-0 -z-10"
                style={{ background: 'rgba(15, 15, 15, 0.55)' }}
                aria-hidden
              />
            </>
          ) : null}
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
              style={{
                color: 'var(--color-bg, var(--color-background))',
                opacity: 0.7,
              }}
            >
              {content.subheadline}
            </p>
          ) : null}
          <Link
            href={content.primaryCta.href}
            className="mt-2 inline-flex items-center justify-center text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              background: 'var(--color-bg, var(--color-background))',
              color: 'var(--color-text, var(--color-foreground))',
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

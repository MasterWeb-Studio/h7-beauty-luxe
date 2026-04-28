import Link from 'next/link';
import type { HeroContent } from './types';

// Fullbleed hero — koyu renk / gradient zemin, dramatik tipografi. Premium /
// luxury / restoran / otel için. Metin ortada, zemin tam genişlik.
// Sprint 18.5 G1 — content.image.type==='remote' ise görsel bg'ye konur,
// üstüne brand palette overlay (lejibilite için %55-75 opacity). Credit
// hover'da görünür (text'e karışmasın).
export function HeroFullbleed({ content }: { content: HeroContent }) {
  const img = content.image;
  const hasRemoteImage = img?.type === 'remote';
  const overlayGradient =
    'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover, var(--color-primary)) 55%, var(--color-accent) 100%)';
  const bgLayer = hasRemoteImage
    ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.45)), ${overlayGradient}, url("${img.url}")`
    : overlayGradient;

  return (
    <section
      className="relative w-full"
      style={{
        paddingBlock: 'var(--section-gap-y, 7rem)',
        background: bgLayer,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--color-bg, var(--color-background))',
      }}
    >
      {hasRemoteImage && img.credit ? (
        <div className="pointer-events-none absolute bottom-2 right-2 z-10 text-[10px] uppercase tracking-wider opacity-60">
          <span className="bg-black/40 px-2 py-0.5 rounded">
            <span className="opacity-80">Photo:</span>{' '}
            {img.creditUrl ? (
              <a
                href={img.creditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto hover:underline"
              >
                {img.credit}
              </a>
            ) : (
              img.credit
            )}
          </span>
        </div>
      ) : null}
      <div className="container-custom">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {content.eyebrow ? (
            <p
              className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] opacity-80"
              style={{ color: 'var(--color-bg, var(--color-background))' }}
            >
              {content.eyebrow}
            </p>
          ) : null}

          <h1
            className="text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            style={{
              fontFamily: 'var(--font-display, var(--font-heading))',
              fontWeight: 'var(--font-weight-display, var(--font-heading-weight, 700))',
            }}
          >
            {content.headline}
          </h1>

          {content.subheadline ? (
            <p
              className="mt-8 max-w-2xl text-lg md:text-xl"
              style={{
                color: 'var(--color-bg, var(--color-background))',
                opacity: 0.85,
              }}
            >
              {content.subheadline}
            </p>
          ) : null}

          {content.primaryCta || content.secondaryCta ? (
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {content.primaryCta ? (
                <Link
                  href={content.primaryCta.href}
                  className="inline-flex items-center justify-center text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    background: 'var(--color-bg, var(--color-background))',
                    color: 'var(--color-primary)',
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
                  className="inline-flex items-center justify-center border text-sm font-medium transition-colors hover:bg-white/10"
                  style={{
                    borderColor: 'var(--color-bg, var(--color-background))',
                    color: 'var(--color-bg, var(--color-background))',
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
      </div>
    </section>
  );
}

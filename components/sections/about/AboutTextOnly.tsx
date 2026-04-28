import type { AboutContent } from './types';
import { SectionImageFrame } from '../_helpers/SectionImageFrame';

// Default — sol başlık + sağ paragraflar (eski About.tsx'in preset-native
// hâli). Stats alt alanı varsa altta border-top'lı 4 sütun grid ile gösterilir.
// Sprint 19 — content.image remote varsa sol üstte küçük dekoratif görsel
// (max-w-sm aspect-[5/4]) — variant identity (text-only grid) bozulmadan
// CA'nin ürettiği görsel kaybolmasın.
export function AboutTextOnly({ content }: { content: AboutContent }) {
  const hasImage = content.image?.type === 'remote';
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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {hasImage ? (
              <div className="mb-6 max-w-sm">
                <SectionImageFrame
                  image={content.image}
                  aspect="aspect-[5/4]"
                  showPlaceholderFallback={false}
                />
              </div>
            ) : null}
            {content.eyebrow ? (
              <p
                className="mb-4 text-sm font-medium uppercase tracking-widest"
                style={{ color: 'var(--color-accent)' }}
              >
                {content.eyebrow}
              </p>
            ) : null}
            <h2
              className="text-3xl tracking-tight md:text-4xl"
              style={{
                fontFamily: 'var(--font-display, var(--font-heading))',
                fontWeight: 'var(--font-weight-display, var(--font-heading-weight, 700))',
              }}
            >
              {content.headline}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <div
              className="space-y-5"
              style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
            >
              {content.body.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            {content.stats && content.stats.length > 0 ? (
              <dl
                className="mt-12 grid grid-cols-2 gap-8 pt-8 md:grid-cols-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                {content.stats.map((stat, index) => (
                  <div key={index}>
                    <dt
                      className="text-sm"
                      style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
                    >
                      {stat.label}
                    </dt>
                    <dd
                      className="mt-2 text-3xl tracking-tight"
                      style={{
                        color: 'var(--color-text, var(--color-foreground))',
                        fontFamily: 'var(--font-display, var(--font-heading))',
                      }}
                    >
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

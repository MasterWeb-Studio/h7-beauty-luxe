import type { FeatureGridContent } from './types';
import { renderLucideIcon } from './icon';
import { SectionImageFrame } from '../_helpers/SectionImageFrame';

// Büyük ikon üstte merkez, başlık + açıklama altta. Playful SaaS,
// beauty / wellness, canlı vibeli tek-mesaj kartlar. items ≥4 ise 4 sütun.
// Sprint 22.5: item.image='remote' ise ikon yerine küçük 4:3 görsel (max-w-32).
export function FeatureGridIconTop({ content }: { content: FeatureGridContent }) {
  const cols =
    content.items.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';

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
        <div className="mx-auto max-w-2xl text-center">
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
          {content.description ? (
            <p
              className="mt-4"
              style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
            >
              {content.description}
            </p>
          ) : null}
        </div>

        <div className={`mt-16 grid grid-cols-1 gap-10 ${cols}`}>
          {content.items.map((item, index) => {
            const iconEl = renderLucideIcon(item.icon, {
              className: 'h-8 w-8',
              strokeWidth: 1.75,
            });
            const hasImage = item.image?.type === 'remote';
            return (
              <div key={index} className="flex flex-col items-center text-center">
                {hasImage ? (
                  <div className="mb-6 w-32">
                    <SectionImageFrame
                      image={item.image}
                      aspect="aspect-[4/3]"
                      showPlaceholderFallback={false}
                    />
                  </div>
                ) : iconEl ? (
                  <div
                    className="mb-6 inline-flex h-16 w-16 items-center justify-center"
                    style={{
                      background:
                        'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                      color: 'var(--color-primary)',
                      borderRadius: 'var(--radius-card, var(--radius))',
                    }}
                  >
                    {iconEl}
                  </div>
                ) : null}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p
                  className="mt-3 max-w-xs text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

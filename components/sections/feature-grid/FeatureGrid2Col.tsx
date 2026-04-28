import type { FeatureGridContent } from './types';
import { renderLucideIcon } from './icon';
import { SectionImageFrame } from '../_helpers/SectionImageFrame';

// 2 sütun geniş kart. Her kart nefes alan pad'e ve border'a sahip; daha fazla
// metin taşır. Premium / editorial / detay vurgulu içerik için.
// Sprint 22.5 borç temizliği: item.image='remote' ise ikon yerine 16:9 banner
// görsel render edilir; image yoksa ikon gösterilir (eski davranış).
export function FeatureGrid2Col({ content }: { content: FeatureGridContent }) {
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

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {content.items.map((item, index) => {
            const iconEl = renderLucideIcon(item.icon, { className: 'h-7 w-7' });
            const hasImage = item.image?.type === 'remote';
            return (
              <div
                key={index}
                className="flex flex-col overflow-hidden border"
                style={{
                  borderColor: 'var(--color-border)',
                  borderRadius: 'var(--radius-card, var(--radius))',
                  background: 'var(--color-surface, var(--color-bg, var(--color-background)))',
                }}
              >
                {hasImage ? (
                  <SectionImageFrame
                    image={item.image}
                    aspect="aspect-[16/9]"
                    showPlaceholderFallback={false}
                  />
                ) : null}
                <div
                  className="flex flex-col"
                  style={{ padding: 'var(--card-padding, 2rem)' }}
                >
                {iconEl && !hasImage ? (
                  <div
                    className="mb-6 inline-flex h-14 w-14 items-center justify-center"
                    style={{
                      background:
                        'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                      color: 'var(--color-primary)',
                      borderRadius: 'var(--radius-card, var(--radius))',
                    }}
                  >
                    {iconEl}
                  </div>
                ) : null}
                <h3
                  className="text-xl font-semibold"
                  style={{
                    fontFamily: 'var(--font-display, var(--font-heading))',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-3 leading-relaxed"
                  style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
                >
                  {item.description}
                </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

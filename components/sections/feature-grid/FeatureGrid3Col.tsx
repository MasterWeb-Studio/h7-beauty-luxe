import type { FeatureGridContent } from './types';
import { renderLucideIcon } from './icon';

// Default varyant — 3 sütun (items ≥4 ise 4 sütun). Eski FeatureGrid.tsx'in
// preset-native hâli. SaaS, kurumsal, genel amaçlı.
export function FeatureGrid3Col({ content }: { content: FeatureGridContent }) {
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

        <div className={`mt-16 grid grid-cols-1 gap-8 ${cols}`}>
          {content.items.map((item, index) => {
            const iconEl = renderLucideIcon(item.icon, { className: 'h-6 w-6' });
            return (
              <div key={index} className="flex flex-col">
                {iconEl ? (
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center"
                    style={{
                      background:
                        'color-mix(in srgb, var(--color-text, var(--color-foreground)) 5%, transparent)',
                      color: 'var(--color-accent)',
                      borderRadius: 'var(--radius-card, var(--radius))',
                    }}
                  >
                    {iconEl}
                  </div>
                ) : null}
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
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

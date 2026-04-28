import type { FeatureGridContent } from './types';
import { renderLucideIcon } from './icon';

// Dikey list — sol ikon, sağ metin. Text-heavy içerik, hukuk / danışmanlık /
// B2B. Her satır bir önceki border-bottom ile ayrılır.
export function FeatureGridList({ content }: { content: FeatureGridContent }) {
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
        <div className="mx-auto max-w-2xl">
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

        <ul className="mx-auto mt-12 max-w-3xl">
          {content.items.map((item, index) => {
            const iconEl = renderLucideIcon(item.icon, { className: 'h-6 w-6' });
            const isLast = index === content.items.length - 1;
            return (
              <li
                key={index}
                className="flex gap-6 py-6"
                style={{
                  borderBottom: isLast
                    ? 'none'
                    : '1px solid var(--color-border)',
                }}
              >
                <div className="flex-shrink-0">
                  {iconEl ? (
                    <div
                      className="inline-flex h-11 w-11 items-center justify-center"
                      style={{
                        background:
                          'color-mix(in srgb, var(--color-accent) 12%, transparent)',
                        color: 'var(--color-accent)',
                        borderRadius: 'var(--radius-card, var(--radius))',
                      }}
                    >
                      {iconEl}
                    </div>
                  ) : null}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p
                    className="mt-2 leading-relaxed"
                    style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

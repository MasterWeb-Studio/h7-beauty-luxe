import { Check } from 'lucide-react';
import type { ServicesContent } from './types';
import { SectionImageFrame } from '../_helpers/SectionImageFrame';

// Default — kart grid (2 veya 3 sütun). Eski Services.tsx'in preset-native
// hâli. Border + surface arkaplan + bullets listesi.
// Sprint 22.5: item.image='remote' ise kart üstünde 16:9 banner görsel.
export function ServicesCards({ content }: { content: ServicesContent }) {
  const cols =
    content.items.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2';

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
        <div className="max-w-2xl">
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

        <div className={`mt-16 grid grid-cols-1 gap-px overflow-hidden ${cols}`}
          style={{
            background: 'var(--color-border)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card, var(--radius))',
          }}
        >
          {content.items.map((item, index) => {
            const hasImage = item.image?.type === 'remote';
            return (
            <div
              key={index}
              className="flex flex-col"
              style={{
                background:
                  'var(--color-surface, var(--color-bg, var(--color-background)))',
              }}
            >
              {hasImage ? (
                <SectionImageFrame
                  image={item.image}
                  aspect="aspect-[16/9]"
                  showPlaceholderFallback={false}
                />
              ) : null}
              <div className="flex flex-col p-8">
              <h3
                className="text-xl font-medium"
                style={{ fontFamily: 'var(--font-display, var(--font-heading))' }}
              >
                {item.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
              >
                {item.description}
              </p>
              {item.bullets && item.bullets.length > 0 ? (
                <ul className="mt-6 space-y-2">
                  {item.bullets.map((bullet, bIndex) => (
                    <li
                      key={bIndex}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: 'var(--color-text, var(--color-foreground))' }}
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: 'var(--color-accent)' }}
                        strokeWidth={2}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

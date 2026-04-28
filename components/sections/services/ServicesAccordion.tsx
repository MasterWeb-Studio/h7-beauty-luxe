'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ServicesContent } from './types';

// Collapsible accordion. Text-heavy hizmetler, detay yoğun içerik. İlk item
// varsayılan açık, diğerleri kullanıcı etkileşimiyle açılır. Client component
// — Next.js app router'da 'use client' direktifi zorunlu.
export function ServicesAccordion({ content }: { content: ServicesContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

        <ul
          className="mx-auto mt-12 max-w-3xl"
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card, var(--radius))',
            overflow: 'hidden',
          }}
        >
          {content.items.map((item, index) => {
            const isOpen = openIndex === index;
            const isLast = index === content.items.length - 1;
            return (
              <li
                key={index}
                style={{
                  borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  style={{
                    padding: 'var(--card-padding, 1.5rem)',
                    background:
                      'var(--color-surface, var(--color-bg, var(--color-background)))',
                    color: 'var(--color-text, var(--color-foreground))',
                  }}
                >
                  <h3
                    className="text-lg font-medium"
                    style={{ fontFamily: 'var(--font-display, var(--font-heading))' }}
                  >
                    {item.title}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
                    strokeWidth={1.75}
                  />
                </button>
                {isOpen ? (
                  <div
                    style={{
                      padding: '0 var(--card-padding, 1.5rem) var(--card-padding, 1.5rem)',
                      color: 'var(--color-text-muted, var(--color-muted))',
                    }}
                  >
                    <p className="leading-relaxed">{item.description}</p>
                    {item.bullets && item.bullets.length > 0 ? (
                      <ul className="mt-4 space-y-2 text-sm">
                        {item.bullets.map((bullet, bIndex) => (
                          <li key={bIndex} className="flex items-start gap-2">
                            <span
                              className="mt-2 inline-block h-1.5 w-1.5 shrink-0"
                              style={{
                                background: 'var(--color-accent)',
                                borderRadius: '9999px',
                              }}
                              aria-hidden="true"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

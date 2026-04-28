import type { ServicesContent } from './types';

// Tablo formatı — hizmet adı + açıklama + (opsiyonel) fiyat. Pricing-adjacent,
// karşılaştırma gerektiren hizmetler. price alanı yoksa iki sütunda çalışır.
export function ServicesTable({ content }: { content: ServicesContent }) {
  const hasPrice = content.items.some((i) => !!i.price);

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

        <div
          className="mx-auto mt-12 max-w-4xl overflow-hidden"
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card, var(--radius))',
          }}
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr
                style={{
                  background:
                    'var(--color-surface, var(--color-bg, var(--color-background)))',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th
                  className="px-6 py-4 text-sm font-semibold uppercase tracking-wide"
                  style={{
                    color: 'var(--color-text-muted, var(--color-muted))',
                    width: hasPrice ? '28%' : '32%',
                  }}
                >
                  Hizmet
                </th>
                <th
                  className="px-6 py-4 text-sm font-semibold uppercase tracking-wide"
                  style={{
                    color: 'var(--color-text-muted, var(--color-muted))',
                  }}
                >
                  Açıklama
                </th>
                {hasPrice ? (
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wide"
                    style={{
                      color: 'var(--color-text-muted, var(--color-muted))',
                      width: '20%',
                    }}
                  >
                    Ücret
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {content.items.map((item, index) => {
                const isLast = index === content.items.length - 1;
                return (
                  <tr
                    key={index}
                    style={{
                      borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                    }}
                  >
                    <td
                      className="px-6 py-5 align-top font-medium"
                      style={{ fontFamily: 'var(--font-display, var(--font-heading))' }}
                    >
                      {item.title}
                    </td>
                    <td
                      className="px-6 py-5 align-top text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-muted, var(--color-muted))' }}
                    >
                      {item.description}
                    </td>
                    {hasPrice ? (
                      <td
                        className="px-6 py-5 align-top text-right text-sm font-medium"
                        style={{ color: 'var(--color-text, var(--color-foreground))' }}
                      >
                        {item.price ?? '—'}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

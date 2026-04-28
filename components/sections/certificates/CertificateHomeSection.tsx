import type { CertificateRow } from '@/lib/types/certificates';

// ---------------------------------------------------------------------------
// Shared helper
// ---------------------------------------------------------------------------

function getLocaleValue(
  field: Record<string, string> | null | undefined,
  locale: string,
): string {
  if (!field) return '';
  return field[locale] ?? field['tr'] ?? Object.values(field)[0] ?? '';
}

// ---------------------------------------------------------------------------
// CertificateStrip  (variantId: certificate-strip)
// Horizontal scrollable strip — up to 6 items, logos/images side by side
// ---------------------------------------------------------------------------

interface StripProps {
  items: CertificateRow[];
  locale: string;
  heading?: string;
}

export function CertificateStrip({ items, locale, heading }: StripProps) {
  if (items.length === 0) return null;

  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container mx-auto px-4">
        {heading && (
          <h2
            className="mb-6 text-center text-xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
              fontWeight: 600,
            }}
          >
            {heading}
          </h2>
        )}

        {/* Scrollable strip */}
        <div
          className="flex items-center gap-8 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item) => {
            const title = getLocaleValue(
              item.title as Record<string, string>,
              locale,
            );
            const slug = getLocaleValue(
              item.slug as Record<string, string>,
              locale,
            );

            return (
              <a
                key={item.id}
                href={`/${locale}/certificates/${slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
                title={title}
              >
                <div
                  className="flex items-center justify-center overflow-hidden"
                  style={{
                    width: '120px',
                    height: '80px',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    padding: '0.5rem',
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={title}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span
                  className="text-xs text-center max-w-[120px] leading-tight"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.issuer}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CertificateGrid4Col  (variantId: certificate-grid-4col)
// 4-column grid — up to 8 items, card style
// ---------------------------------------------------------------------------

interface Grid4Props {
  items: CertificateRow[];
  locale: string;
  heading?: string;
  subheading?: string;
}

export function CertificateGrid4Col({
  items,
  locale,
  heading,
  subheading,
}: Grid4Props) {
  if (items.length === 0) return null;

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        {(heading || subheading) && (
          <div className="mb-10 text-center space-y-2">
            {heading && (
              <h2
                className="text-2xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                  fontWeight: 700,
                }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className="text-sm max-w-xl mx-auto"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* 4-col grid */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const title = getLocaleValue(
              item.title as Record<string, string>,
              locale,
            );
            const slug = getLocaleValue(
              item.slug as Record<string, string>,
              locale,
            );

            return (
              <a
                key={item.id}
                href={`/${locale}/certificates/${slug}`}
                className="flex flex-col items-center gap-3 p-5 text-center transition-shadow hover:shadow-md"
                style={{
                  background: 'var(--color-bg-muted)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  className="flex items-center justify-center overflow-hidden"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem',
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={title}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1">
                  <p
                    className="text-sm leading-snug"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text)',
                      fontWeight: 600,
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {item.issuer}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-8 text-center">
          <a
            href={`/${locale}/certificates`}
            className="inline-block text-sm"
            style={{
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
            }}
          >
            {locale === 'tr' ? 'Tüm Sertifikaları Gör →' : 'View All Certificates →'}
          </a>
        </div>
      </div>
    </section>
  );
}

import type { ReferencesRow } from '@/lib/types/references';

// ---------------------------------------------------------------------------
// Grid — liste sayfası + home section variant
// ---------------------------------------------------------------------------

interface GridProps {
  items: ReferencesRow[];
  locale: string;
  /** Home section'da kullanılırken sütun sayısını override et */
  columns?: 3 | 4 | 6;
}

export function ReferencesGrid({ items, locale, columns = 3 }: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Referans eklenmemiş.' : 'No references yet.'}
      </p>
    );
  }

  const colClass =
    columns === 6
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      : columns === 4
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`mt-8 grid gap-6 ${colClass}`}>
      {items.map((item) => (
        <ReferencesCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface CardProps {
  item: ReferencesRow;
  locale: string;
}

export function ReferencesCard({ item, locale }: CardProps) {
  const description =
    item.description?.[locale as keyof typeof item.description] ??
    item.description?.tr ??
    null;

  const inner = (
    <div
      className="flex flex-col items-center gap-3 p-6"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center"
        style={{ height: '64px', width: '100%' }}
      >
        {item.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.logo_url}
            alt={item.name}
            style={{
              maxHeight: '64px',
              maxWidth: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        ) : (
          <span
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {item.name}
          </span>
        )}
      </div>

      {/* Brand name */}
      <p
        className="text-center text-sm"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
        }}
      >
        {item.name}
      </p>

      {/* Optional description */}
      {description && (
        <p
          className="text-center text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description}
        </p>
      )}
    </div>
  );

  if (item.website_url) {
    return (
      <a
        href={item.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-shadow hover:shadow-lg"
        aria-label={item.name}
        style={{ borderRadius: 'var(--radius-card)' }}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="block"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      {inner}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home Section — Logo Bar (horizontal scroll / flex wrap)
// ---------------------------------------------------------------------------

interface LogoBarProps {
  items: ReferencesRow[];
  locale: string;
  /** Kaç logo gösterilsin (defaultCount'tan gelir) */
  count?: number;
}

export function ReferencesLogoBar({ items, locale, count = 6 }: LogoBarProps) {
  const visible = items.slice(0, count);

  if (visible.length === 0) return null;

  return (
    <section
      aria-label={locale === 'tr' ? 'Referanslar' : 'References'}
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-center"
              style={{ height: '48px', minWidth: '80px', maxWidth: '140px' }}
            >
              {item.website_url ? (
                <a
                  href={item.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  {item.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      style={{
                        maxHeight: '48px',
                        maxWidth: '140px',
                        objectFit: 'contain',
                        display: 'block',
                        opacity: 0.75,
                        transition: 'opacity 0.2s',
                      }}
                    />
                  ) : (
                    <span
                      className="text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {item.name}
                    </span>
                  )}
                </a>
              ) : item.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.logo_url}
                  alt={item.name}
                  style={{
                    maxHeight: '48px',
                    maxWidth: '140px',
                    objectFit: 'contain',
                    display: 'block',
                    opacity: 0.75,
                  }}
                />
              ) : (
                <span
                  className="text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Home Section — Logo Grid (denser, home page variant)
// ---------------------------------------------------------------------------

interface LogoGridHomeSectionProps {
  items: ReferencesRow[];
  locale: string;
  count?: number;
}

export function ReferencesLogoGridSection({
  items,
  locale,
  count = 12,
}: LogoGridHomeSectionProps) {
  const visible = items.slice(0, count);

  if (visible.length === 0) return null;

  return (
    <section
      aria-label={locale === 'tr' ? 'Referanslar' : 'References'}
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        <h2
          className="mb-8 text-center text-2xl"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          {locale === 'tr' ? 'Referanslar' : 'References'}
        </h2>
        <ReferencesGrid items={visible} locale={locale} columns={4} />
      </div>
    </section>
  );
}

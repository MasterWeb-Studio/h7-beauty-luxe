import type { ServicesRow } from '@/lib/types/services';

// ---------------------------------------------------------------------------
// ServicesGrid
// ---------------------------------------------------------------------------
interface GridProps {
  items: ServicesRow[];
  locale: string;
}

export function ServicesGrid({ items, locale }: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Hizmet eklenmemiş.' : 'No services yet.'}
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ServicesCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ServicesCard
// ---------------------------------------------------------------------------
interface CardProps {
  item: ServicesRow;
  locale: string;
}

export function ServicesCard({ item, locale }: CardProps) {
  const title =
    item.title?.[locale] ??
    item.title?.tr ??
    Object.values(item.title ?? {})[0] ??
    '';
  const slug =
    item.slug?.[locale] ??
    item.slug?.tr ??
    Object.values(item.slug ?? {})[0] ??
    '';
  const shortDesc =
    item.short_description?.[locale] ??
    item.short_description?.tr ??
    Object.values(item.short_description ?? {})[0] ??
    '';

  return (
    <a
      href={`/${locale}/services/${slug}`}
      className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Icon area */}
      {item.icon && (
        <div
          className="flex items-center justify-center p-6"
          style={{ background: 'var(--color-bg-accent)' }}
        >
          <span
            className="text-4xl"
            style={{ color: 'var(--color-accent)' }}
            aria-hidden="true"
          >
            {/* Icon name rendered as text; consumer can swap with lucide-react */}
            {item.icon}
          </span>
        </div>
      )}

      {/* Image area */}
      {!item.icon && item.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={item.image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3
          className="text-lg"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
            fontWeight: 'var(--font-weight-heading)',
          }}
        >
          {title}
        </h3>
        {shortDesc && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {shortDesc}
          </p>
        )}
        <span
          className="mt-auto inline-flex items-center gap-1 text-sm"
          style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
        >
          {locale === 'tr' ? 'Detaylar' : 'Learn more'} →
        </span>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// ServicesDetail
// ---------------------------------------------------------------------------
export interface ServicesDetailProps {
  item: ServicesRow;
  locale: string;
}

export function ServicesDetail({ item, locale }: ServicesDetailProps) {
  const title =
    item.title?.[locale] ??
    item.title?.tr ??
    Object.values(item.title ?? {})[0] ??
    '';
  const shortDesc =
    item.short_description?.[locale] ??
    item.short_description?.tr ??
    Object.values(item.short_description ?? {})[0] ??
    '';
  const description =
    item.description?.[locale] ??
    item.description?.tr ??
    Object.values(item.description ?? {})[0] ??
    '';
  const features: string[] =
    (item.features as Record<string, string[]> | null)?.[locale] ??
    (item.features as Record<string, string[]> | null)?.tr ??
    [];

  return (
    <article style={{ color: 'var(--color-text)' }}>
      {/* Hero */}
      <section
        style={{
          background: 'var(--color-bg-accent)',
          paddingBlock: 'var(--section-gap-y)',
        }}
      >
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            {item.icon && (
              <span
                className="shrink-0 text-5xl"
                style={{ color: 'var(--color-accent)' }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
            )}
            <div className="flex flex-col gap-2">
              <h1
                className="text-4xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 'var(--font-weight-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {title}
              </h1>
              {shortDesc && (
                <p
                  className="text-lg"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {shortDesc}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hero image */}
      {item.image && (
        <div className="w-full overflow-hidden" style={{ maxHeight: '480px' }}>
          <img
            src={item.image}
            alt={title}
            className="h-full w-full object-cover"
            style={{ maxHeight: '480px' }}
          />
        </div>
      )}

      {/* Description */}
      {description && (
        <section
          style={{
            background: 'var(--color-bg)',
            paddingBlock: 'var(--section-gap-y)',
          }}
        >
          <div className="container mx-auto max-w-4xl px-4">
            <div
              className="prose max-w-none"
              style={{
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section
          style={{
            background: 'var(--color-bg-muted)',
            paddingBlock: 'var(--section-gap-y)',
          }}
        >
          <div className="container mx-auto max-w-4xl px-4">
            <h2
              className="mb-6 text-2xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 'var(--font-weight-heading)',
                color: 'var(--color-text)',
              }}
            >
              {locale === 'tr' ? 'Neler Dahil?' : "What's Included?"}
            </h2>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3"
                  style={{ color: 'var(--color-text)' }}
                >
                  <span
                    className="mt-1 shrink-0 text-base"
                    style={{ color: 'var(--color-accent)' }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        style={{
          background: 'var(--color-bg)',
          paddingBlock: 'var(--section-gap-y)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <p
            className="mb-6 text-lg"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {locale === 'tr'
              ? 'Bu hizmet hakkında daha fazla bilgi almak ister misiniz?'
              : 'Would you like to learn more about this service?'}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-block px-8 py-3"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-accent-fg)',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-body)',
              fontWeight: 'var(--font-weight-medium)',
              textDecoration: 'none',
            }}
          >
            {locale === 'tr' ? 'İletişime Geç' : 'Get in Touch'}
          </a>
        </div>
      </section>
    </article>
  );
}

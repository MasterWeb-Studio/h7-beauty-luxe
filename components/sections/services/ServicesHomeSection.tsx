import type { ServicesRow } from '@/lib/types/services';
import { ServicesCard } from './ServicesModuleRenderer';

// ---------------------------------------------------------------------------
// Variant: service-grid-3col
// ---------------------------------------------------------------------------
interface ServiceGrid3ColProps {
  items: ServicesRow[];
  locale: string;
  title?: string;
  subtitle?: string;
}

export function ServiceGrid3Col({
  items,
  locale,
  title,
  subtitle,
}: ServiceGrid3ColProps) {
  const displayItems = items.slice(0, 6);

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <h2
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 'var(--font-weight-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-3 text-base"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {displayItems.length === 0 ? (
          <p
            className="py-10 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr' ? 'Hizmet eklenmemiş.' : 'No services yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((item) => (
              <ServicesCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href={`/${locale}/services`}
            className="inline-block px-6 py-2"
            style={{
              border: '1px solid var(--color-accent)',
              color: 'var(--color-accent)',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
            }}
          >
            {locale === 'tr' ? 'Tüm Hizmetler' : 'All Services'}
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Variant: service-featured
// ---------------------------------------------------------------------------
interface ServiceFeaturedProps {
  items: ServicesRow[];
  locale: string;
  title?: string;
  subtitle?: string;
}

export function ServiceFeatured({
  items,
  locale,
  title,
  subtitle,
}: ServiceFeaturedProps) {
  const featured = items.filter((it) => it.is_featured).slice(0, 3);
  const displayItems = featured.length > 0 ? featured : items.slice(0, 3);

  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <h2
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 'var(--font-weight-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-3 text-base"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {displayItems.length === 0 ? (
          <p
            className="py-10 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr' ? 'Öne çıkan hizmet yok.' : 'No featured services.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {displayItems.map((item) => (
              <FeaturedServiceCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FeaturedServiceCard — larger, accent-bordered variant
// ---------------------------------------------------------------------------
interface FeaturedCardProps {
  item: ServicesRow;
  locale: string;
}

function FeaturedServiceCard({ item, locale }: FeaturedCardProps) {
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
  const features: string[] =
    (item.features as Record<string, string[]> | null)?.[locale] ??
    (item.features as Record<string, string[]> | null)?.tr ??
    [];

  return (
    <a
      href={`/${locale}/services/${slug}`}
      className="group flex flex-col gap-4 overflow-hidden p-8 transition-shadow hover:shadow-xl"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg)',
        border: '2px solid var(--color-accent)',
        textDecoration: 'none',
      }}
    >
      {item.icon && (
        <span
          className="text-4xl"
          style={{ color: 'var(--color-accent)' }}
          aria-hidden="true"
        >
          {item.icon}
        </span>
      )}
      <h3
        className="text-xl"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--font-weight-heading)',
          color: 'var(--color-text)',
        }}
      >
        {title}
      </h3>
      {shortDesc && (
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          {shortDesc}
        </p>
      )}
      {features.length > 0 && (
        <ul className="mt-2 space-y-1">
          {features.slice(0, 4).map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
            >
              <span style={{ color: 'var(--color-accent)' }} aria-hidden="true">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
      )}
      <span
        className="mt-auto text-sm"
        style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
      >
        {locale === 'tr' ? 'Detaylar' : 'Learn more'} →
      </span>
    </a>
  );
}

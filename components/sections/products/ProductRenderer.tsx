import type { ProductRow } from '@/lib/types/products';
import { ProductCard } from './ProductCard';

// ─── Grid ────────────────────────────────────────────────────────────────────

interface GridProps {
  items: ProductRow[];
  locale: string;
  total?: number;
  page?: number;
  pageSize?: number;
}

export function ProductGrid({
  items,
  locale,
  total = 0,
  page = 1,
  pageSize = 20,
}: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr'
          ? 'Bu kategoride henüz ürün yok.'
          : 'No products in this category yet.'}
      </p>
    );
  }

  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;

  return (
    <div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <ProductCard key={it.id} item={it} locale={locale} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-2"
          aria-label={locale === 'tr' ? 'Sayfalama' : 'Pagination'}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}`}
              className="flex h-9 w-9 items-center justify-center text-sm"
              style={{
                borderRadius: 'var(--radius-card)',
                background:
                  p === page
                    ? 'var(--color-primary)'
                    : 'var(--color-bg-muted)',
                color:
                  p === page
                    ? 'var(--color-primary-fg)'
                    : 'var(--color-text)',
              }}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

// ─── Detail ──────────────────────────────────────────────────────────────────

export interface ProductDetailProps {
  item: ProductRow;
  locale: string;
}

const STOCK_LABEL: Record<string, { tr: string; en: string; color: string }> = {
  in_stock: { tr: 'Stokta Var', en: 'In Stock', color: 'var(--color-success)' },
  low_stock: { tr: 'Son Birkaç Ürün', en: 'Low Stock', color: 'var(--color-warning)' },
  out_of_stock: { tr: 'Tükendi', en: 'Out of Stock', color: 'var(--color-danger)' },
  pre_order: { tr: 'Ön Sipariş', en: 'Pre-Order', color: 'var(--color-info)' },
};

const CURRENCY_SYMBOL: Record<string, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function ProductDetail({ item, locale }: ProductDetailProps) {
  const name =
    item.name?.[locale] ??
    item.name?.tr ??
    Object.values(item.name ?? {})[0] ??
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

  const attributes =
    item.attributes?.[locale] ??
    item.attributes?.tr ??
    (item.attributes ? Object.values(item.attributes)[0] : null) ??
    null;

  const stockInfo = STOCK_LABEL[item.stock_status] ?? STOCK_LABEL['in_stock'];
  const currencySymbol = item.currency ? (CURRENCY_SYMBOL[item.currency] ?? item.currency) : '₺';

  const parsedAttributes: Record<string, string> | null = (() => {
    if (!attributes) return null;
    try {
      return typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
    } catch {
      return null;
    }
  })();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: shortDesc || undefined,
    image: item.images?.[0] ?? undefined,
    offers: item.price != null
      ? {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: item.currency ?? 'TRY',
          availability:
            item.stock_status === 'in_stock' || item.stock_status === 'low_stock'
              ? 'https://schema.org/InStock'
              : item.stock_status === 'pre_order'
              ? 'https://schema.org/PreOrder'
              : 'https://schema.org/OutOfStock',
        }
      : undefined,
  };

  return (
    <article
      className="container mx-auto max-w-5xl px-4 py-10"
      style={{ color: 'var(--color-text)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Gallery */}
      {item.images && item.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {item.images.map((src, idx) => (
              <div
                key={idx}
                className="overflow-hidden"
                style={{
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--color-bg-muted)',
                  aspectRatio: '4/3',
                }}
              >
                <img
                  src={src}
                  alt={`${name} — ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: Info */}
        <div className="space-y-6">
          {/* Title */}
          <h1
            className="text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {name}
          </h1>

          {/* Price */}
          {item.price != null && item.price > 0 && (
            <p
              className="text-2xl"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
              }}
            >
              {currencySymbol}
              {item.price.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')}
            </p>
          )}

          {/* Short Description */}
          {shortDesc && (
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {shortDesc}
            </p>
          )}

          {/* Stock CTA */}
          <div className="flex items-center gap-3">
            <span
              className="inline-block px-3 py-1 text-sm"
              style={{
                borderRadius: 'var(--radius-card)',
                background: 'var(--color-bg-muted)',
                color: stockInfo.color,
              }}
            >
              {locale === 'tr' ? stockInfo.tr : stockInfo.en}
            </span>

            {item.is_bestseller && (
              <span
                className="inline-block px-3 py-1 text-sm"
                style={{
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--color-primary)',
                  color: 'var(--color-primary-fg)',
                }}
              >
                {locale === 'tr' ? 'Öne Çıkan' : 'Featured'}
              </span>
            )}
          </div>

          {/* Attributes */}
          {parsedAttributes && Object.keys(parsedAttributes).length > 0 && (
            <div
              className="overflow-hidden"
              style={{
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(parsedAttributes).map(([key, val]) => (
                    <tr
                      key={key}
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <td
                        className="px-4 py-2"
                        style={{
                          background: 'var(--color-bg-muted)',
                          color: 'var(--color-text-muted)',
                          width: '40%',
                        }}
                      >
                        {key}
                      </td>
                      <td
                        className="px-4 py-2"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Description */}
        {description && (
          <div
            className="prose max-w-none"
            style={{ color: 'var(--color-text)' }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </article>
  );
}

// ─── Home Section Variants ────────────────────────────────────────────────────

interface HomeSectionProps {
  items: ProductRow[];
  locale: string;
  title?: string;
}

/** variant: product-grid-3col — latest 6 */
export function ProductGridSection({ items, locale, title }: HomeSectionProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="mb-8 text-2xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((it) => (
            <ProductCard key={it.id} item={it} locale={locale} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={`/${locale}/products`}
            className="inline-block px-6 py-3 text-sm"
            style={{
              borderRadius: 'var(--radius-card)',
              background: 'var(--color-primary)',
              color: 'var(--color-primary-fg)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {locale === 'tr' ? 'Tüm Ürünler' : 'All Products'}
          </a>
        </div>
      </div>
    </section>
  );
}

/** variant: product-featured — bestsellers 4 */
export function ProductFeaturedSection({ items, locale, title }: HomeSectionProps) {
  const featured = items.filter((it) => it.is_bestseller).slice(0, 4);
  const display = featured.length > 0 ? featured : items.slice(0, 4);

  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="mb-8 text-2xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {display.map((it) => (
            <ProductCard key={it.id} item={it} locale={locale} featured />
          ))}
        </div>
      </div>
    </section>
  );
}

/** variant: product-carousel — latest 8 (CSS scroll snap) */
export function ProductCarouselSection({ items, locale, title }: HomeSectionProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className="mb-8 text-2xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {title}
          </h2>
        )}
        <div
          className="flex gap-6 overflow-x-auto pb-4"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {items.slice(0, 8).map((it) => (
            <div
              key={it.id}
              className="shrink-0"
              style={{ width: '280px', scrollSnapAlign: 'start' }}
            >
              <ProductCard item={it} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

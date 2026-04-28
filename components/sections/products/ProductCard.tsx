import type { ProductRow } from '@/lib/types/products';

const CURRENCY_SYMBOL: Record<string, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const STOCK_DOT: Record<string, string> = {
  in_stock: 'var(--color-success)',
  low_stock: 'var(--color-warning)',
  out_of_stock: 'var(--color-danger)',
  pre_order: 'var(--color-info)',
};

interface ProductCardProps {
  item: ProductRow;
  locale: string;
  featured?: boolean;
}

export function ProductCard({ item, locale, featured = false }: ProductCardProps) {
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

  const slug =
    item.slug?.[locale] ??
    item.slug?.tr ??
    Object.values(item.slug ?? {})[0] ??
    '';

  const coverImage = item.images?.[0] ?? null;
  const currencySymbol = item.currency
    ? (CURRENCY_SYMBOL[item.currency] ?? item.currency)
    : '₺';
  const dotColor = STOCK_DOT[item.stock_status] ?? 'var(--color-text-muted)';

  return (
    <a
      href={`/${locale}/products/${slug}`}
      className="group block overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
        border: featured ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
      }}
    >
      {/* Cover Image */}
      <div
        className="overflow-hidden"
        style={{
          aspectRatio: '4/3',
          background: 'var(--color-bg)',
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Bestseller badge */}
        {item.is_bestseller && (
          <span
            className="inline-block px-2 py-0.5 text-xs"
            style={{
              borderRadius: 'var(--radius-card)',
              background: 'var(--color-primary)',
              color: 'var(--color-primary-fg)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {locale === 'tr' ? 'Öne Çıkan' : 'Featured'}
          </span>
        )}

        {/* Name */}
        <h3
          className="text-lg leading-snug"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          {name}
        </h3>

        {/* Short description */}
        {shortDesc && (
          <p
            className="text-sm leading-relaxed line-clamp-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {shortDesc}
          </p>
        )}

        {/* Price + Stock */}
        <div className="flex items-center justify-between pt-1">
          {item.price != null && item.price > 0 ? (
            <span
              className="text-base"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
              }}
            >
              {currencySymbol}
              {item.price.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')}
            </span>
          ) : (
            <span />
          )}

          {/* Stock dot */}
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block h-2 w-2"
              style={{
                borderRadius: '50%',
                background: dotColor,
              }}
            />
            {item.stock_status === 'in_stock' &&
              (locale === 'tr' ? 'Stokta' : 'In Stock')}
            {item.stock_status === 'low_stock' &&
              (locale === 'tr' ? 'Son Birkaç' : 'Low Stock')}
            {item.stock_status === 'out_of_stock' &&
              (locale === 'tr' ? 'Tükendi' : 'Out of Stock')}
            {item.stock_status === 'pre_order' &&
              (locale === 'tr' ? 'Ön Sipariş' : 'Pre-Order')}
          </span>
        </div>
      </div>
    </a>
  );
}

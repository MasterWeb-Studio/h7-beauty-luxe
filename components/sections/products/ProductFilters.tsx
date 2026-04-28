'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface ProductFiltersProps {
  locale: string;
}

const SORT_OPTIONS = [
  { id: 'newest', tr: 'En Yeni', en: 'Newest' },
  { id: 'price-asc', tr: 'Fiyat: Artan', en: 'Price: Low to High' },
  { id: 'price-desc', tr: 'Fiyat: Azalan', en: 'Price: High to Low' },
  { id: 'bestseller', tr: 'Öne Çıkanlar', en: 'Bestsellers' },
];

const STOCK_OPTIONS = [
  { id: 'in_stock', tr: 'Stokta Var', en: 'In Stock' },
  { id: 'low_stock', tr: 'Son Birkaç', en: 'Low Stock' },
  { id: 'out_of_stock', tr: 'Tükendi', en: 'Out of Stock' },
  { id: 'pre_order', tr: 'Ön Sipariş', en: 'Pre-Order' },
];

export function ProductFilters({ locale }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const currentSort = searchParams.get('sort') ?? 'newest';
  const currentStock = searchParams.get('stock') ?? '';
  const currentPriceMin = searchParams.get('price_min') ?? '';
  const currentPriceMax = searchParams.get('price_max') ?? '';

  return (
    <div
      className="space-y-6 p-4"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Sort */}
      <div>
        <p
          className="mb-2 text-sm"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          {locale === 'tr' ? 'Sıralama' : 'Sort By'}
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateParam('sort', opt.id)}
              className="block w-full px-3 py-2 text-left text-sm"
              style={{
                borderRadius: 'var(--radius-card)',
                background:
                  currentSort === opt.id
                    ? 'var(--color-primary)'
                    : 'transparent',
                color:
                  currentSort === opt.id
                    ? 'var(--color-primary-fg)'
                    : 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {locale === 'tr' ? opt.tr : opt.en}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p
          className="mb-2 text-sm"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          {locale === 'tr' ? 'Fiyat Aralığı' : 'Price Range'}
        </p>
        <div className="flex items-center gap-2">
          <input
            aria-label={locale === 'tr' ? 'Minimum fiyat' : 'Minimum price'}
            type="number"
            min={0}
            placeholder={locale === 'tr' ? 'Min' : 'Min'}
            defaultValue={currentPriceMin}
            onBlur={(e) => updateParam('price_min', e.target.value || null)}
            className="w-full px-3 py-2 text-sm"
            style={{
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
            }}
          />
          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
          <input
            aria-label={locale === 'tr' ? 'Maksimum fiyat' : 'Maximum price'}
            type="number"
            min={0}
            placeholder={locale === 'tr' ? 'Max' : 'Max'}
            defaultValue={currentPriceMax}
            onBlur={(e) => updateParam('price_max', e.target.value || null)}
            className="w-full px-3 py-2 text-sm"
            style={{
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <p
          className="mb-2 text-sm"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          {locale === 'tr' ? 'Stok Durumu' : 'Availability'}
        </p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => updateParam('stock', null)}
            className="block w-full px-3 py-2 text-left text-sm"
            style={{
              borderRadius: 'var(--radius-card)',
              background: !currentStock ? 'var(--color-primary)' : 'transparent',
              color: !currentStock ? 'var(--color-primary-fg)' : 'var(--color-text)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {locale === 'tr' ? 'Tümü' : 'All'}
          </button>
          {STOCK_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateParam('stock', opt.id)}
              className="block w-full px-3 py-2 text-left text-sm"
              style={{
                borderRadius: 'var(--radius-card)',
                background:
                  currentStock === opt.id
                    ? 'var(--color-primary)'
                    : 'transparent',
                color:
                  currentStock === opt.id
                    ? 'var(--color-primary-fg)'
                    : 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {locale === 'tr' ? opt.tr : opt.en}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => router.push(pathname)}
        className="w-full px-4 py-2 text-sm"
        style={{
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          background: 'transparent',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {locale === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
      </button>
    </div>
  );
}

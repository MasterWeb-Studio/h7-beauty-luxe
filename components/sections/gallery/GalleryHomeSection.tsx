import type { GalleryRow } from '@/lib/types/gallery';
import { GalleryCard } from './GalleryRenderer';

// ---------------------------------------------------------------------------
// Variant: gallery-masonry-6
// ---------------------------------------------------------------------------

interface MasonryProps {
  items: GalleryRow[];
  locale: string;
  title?: string;
  cta?: { label: string; href: string };
}

export function GalleryMasonry6({ items, locale, title, cta }: MasonryProps) {
  const displayItems = items.slice(0, 6);

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4 space-y-8">
        {title && (
          <div className="flex items-end justify-between">
            <h2
              className="text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {title}
            </h2>
            {cta && (
              <a
                href={cta.href}
                className="text-sm"
                style={{ color: 'var(--color-accent)' }}
              >
                {cta.label}
              </a>
            )}
          </div>
        )}

        {/* Masonry-style: first item spans 2 cols on md+ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              className={idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
            >
              <GalleryCard item={item} locale={locale} />
            </div>
          ))}
        </div>

        {!title && cta && (
          <div className="flex justify-center">
            <a
              href={cta.href}
              className="px-6 py-3 text-sm"
              style={{
                borderRadius: 'var(--radius-card)',
                background: 'var(--color-accent)',
                color: 'var(--color-accent-fg)',
              }}
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Variant: gallery-grid-3col
// ---------------------------------------------------------------------------

interface Grid3ColProps {
  items: GalleryRow[];
  locale: string;
  title?: string;
  cta?: { label: string; href: string };
}

export function GalleryGrid3Col({ items, locale, title, cta }: Grid3ColProps) {
  const displayItems = items.slice(0, 9);

  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4 space-y-8">
        {title && (
          <div className="flex items-end justify-between">
            <h2
              className="text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {title}
            </h2>
            {cta && (
              <a
                href={cta.href}
                className="text-sm"
                style={{ color: 'var(--color-accent)' }}
              >
                {cta.label}
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <GalleryCard key={item.id} item={item} locale={locale} />
          ))}
        </div>

        {!title && cta && (
          <div className="flex justify-center">
            <a
              href={cta.href}
              className="px-6 py-3 text-sm"
              style={{
                borderRadius: 'var(--radius-card)',
                background: 'var(--color-accent)',
                color: 'var(--color-accent-fg)',
              }}
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

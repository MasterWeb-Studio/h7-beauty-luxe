import type { GalleryRow } from '@/lib/types/gallery';

// ---------------------------------------------------------------------------
// GalleryGrid
// ---------------------------------------------------------------------------

interface GridProps {
  items: GalleryRow[];
  locale: string;
}

export function GalleryGrid({ items, locale }: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Galeri henüz eklenmemiş.' : 'No galleries yet.'}
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GalleryCard
// ---------------------------------------------------------------------------

interface CardProps {
  item: GalleryRow;
  locale: string;
}

export function GalleryCard({ item, locale }: CardProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? Object.values(item.title ?? {})[0] ?? '';
  const slug = item.slug?.[locale] ?? item.slug?.tr ?? Object.values(item.slug ?? {})[0] ?? '';
  const description =
    item.description?.[locale] ?? item.description?.tr ?? Object.values(item.description ?? {})[0] ?? '';

  return (
    <a
      href={`/${locale}/gallery/${slug}`}
      className="group block overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
      }}
    >
      {/* Cover image */}
      {item.cover_image && (
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={item.cover_image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5 space-y-2">
        <h3
          className="text-lg leading-snug"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="text-sm line-clamp-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {item.taken_at && (
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {new Date(item.taken_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {item.images?.length > 0 && (
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {item.images.length} {locale === 'tr' ? 'görsel' : 'photos'}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// GalleryDetail
// ---------------------------------------------------------------------------

export interface GalleryDetailProps {
  item: GalleryRow;
  locale: string;
}

export function GalleryDetail({ item, locale }: GalleryDetailProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? Object.values(item.title ?? {})[0] ?? '';
  const description =
    item.description?.[locale] ?? item.description?.tr ?? Object.values(item.description ?? {})[0] ?? '';

  return (
    <article
      className="container mx-auto max-w-5xl px-4 py-10 space-y-8"
      style={{ color: 'var(--color-text)' }}
    >
      {/* Hero cover */}
      {item.cover_image && (
        <div
          className="w-full overflow-hidden"
          style={{ borderRadius: 'var(--radius-card)', aspectRatio: '16/9' }}
        >
          <img
            src={item.cover_image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Title + meta */}
      <div className="space-y-3">
        <h1
          className="text-4xl leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h1>

        {item.taken_at && (
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr' ? 'Çekim Tarihi: ' : 'Taken: '}
            {new Date(item.taken_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {description && (
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Gallery grid / lightbox */}
      {item.images && item.images.length > 0 && (
        <section className="space-y-4">
          <h2
            className="text-xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'Görseller' : 'Images'}
            <span
              className="ml-2 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ({item.images.length})
            </span>
          </h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {item.images.map((src, idx) => (
              <a
                key={idx}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden"
                style={{
                  borderRadius: 'var(--radius-card)',
                  aspectRatio: '1/1',
                }}
                aria-label={`${title} — ${locale === 'tr' ? 'Görsel' : 'Image'} ${idx + 1}`}
              >
                <img
                  src={src}
                  alt={`${title} ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

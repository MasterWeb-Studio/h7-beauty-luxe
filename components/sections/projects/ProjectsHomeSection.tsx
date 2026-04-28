import type { ProjectsRow } from '@/lib/types/projects';
import { ProjectsCard } from './ProjectsRenderer';

// ---------------------------------------------------------------------------
// Variant: project-grid-3col
// Latest 6 projects in a 3-column grid
// ---------------------------------------------------------------------------

interface HomeSectionProps {
  items: ProjectsRow[];
  locale: string;
  title?: string;
  viewAllHref?: string;
}

export function ProjectsGrid3Col({
  items,
  locale,
  title,
  viewAllHref,
}: HomeSectionProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-3xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {title ?? (locale === 'tr' ? 'Projeler' : 'Projects')}
          </h2>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm underline"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              {locale === 'tr' ? 'Tümünü Gör' : 'View All'}
            </a>
          )}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((item) => (
            <ProjectsCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Variant: project-masonry
// Featured projects in a masonry-style layout (CSS columns)
// ---------------------------------------------------------------------------

export function ProjectsMasonry({
  items,
  locale,
  title,
  viewAllHref,
}: HomeSectionProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-3xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {title ?? (locale === 'tr' ? 'Öne Çıkan Projeler' : 'Featured Projects')}
          </h2>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm underline"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
            >
              {locale === 'tr' ? 'Tümünü Gör' : 'View All'}
            </a>
          )}
        </div>

        {/* Masonry via CSS columns */}
        <div
          className="mt-8"
          style={{ columnCount: 3, columnGap: 'var(--gap-card, 1.5rem)' }}
        >
          {items.slice(0, 8).map((item) => {
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
              '';

            return (
              <a
                key={item.id}
                href={`/${locale}/projects/${slug}`}
                className="group mb-6 block overflow-hidden break-inside-avoid transition-shadow hover:shadow-lg"
                style={{
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--color-bg)',
                }}
              >
                {item.cover_image && (
                  <img
                    src={`/api/media/${item.cover_image}`}
                    alt={title}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="p-4 space-y-1">
                  {item.client_name && (
                    <p
                      className="text-xs uppercase tracking-wide"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {item.client_name}
                    </p>
                  )}
                  <h3
                    className="text-base leading-snug"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {title}
                  </h3>
                  {shortDesc && (
                    <p
                      className="text-sm line-clamp-2"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {shortDesc}
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Variant: project-featured-large
// Single featured project — large hero-style showcase
// ---------------------------------------------------------------------------

interface FeaturedLargeProps {
  item: ProjectsRow;
  locale: string;
  viewAllHref?: string;
}

export function ProjectsFeaturedLarge({
  item,
  locale,
  viewAllHref,
}: FeaturedLargeProps) {
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
    '';

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        <a
          href={`/${locale}/projects/${slug}`}
          className="group grid grid-cols-1 gap-8 overflow-hidden lg:grid-cols-2"
          style={{
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-bg-muted)',
          }}
        >
          {/* Image */}
          {item.cover_image && (
            <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
              <img
                src={`/api/media/${item.cover_image}`}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ minHeight: '400px' }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center p-8 space-y-4">
            {item.is_featured && (
              <span
                className="inline-block self-start px-3 py-1 text-xs uppercase tracking-wide"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-accent-fg)',
                  borderRadius: 'var(--radius-badge)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {locale === 'tr' ? 'Öne Çıkan' : 'Featured'}
              </span>
            )}
            {item.client_name && (
              <p
                className="text-sm uppercase tracking-wide"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {item.client_name}
              </p>
            )}
            <h2
              className="text-4xl leading-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
              }}
            >
              {title}
            </h2>
            {shortDesc && (
              <p
                className="text-base leading-relaxed"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {shortDesc}
              </p>
            )}
            {item.completion_date && (
              <p
                className="text-sm"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {new Date(item.completion_date).toLocaleDateString(
                  locale === 'tr' ? 'tr-TR' : 'en-US',
                  { year: 'numeric', month: 'long' },
                )}
              </p>
            )}
            <div className="flex items-center gap-4 pt-2">
              <span
                className="inline-block px-6 py-2 text-sm transition-opacity hover:opacity-80"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-accent-fg)',
                  borderRadius: 'var(--radius-button)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {locale === 'tr' ? 'Projeyi İncele' : 'View Project'}
              </span>
              {viewAllHref && (
                <a
                  href={viewAllHref}
                  className="text-sm underline"
                  style={{
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {locale === 'tr' ? 'Tüm Projeler' : 'All Projects'}
                </a>
              )}
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

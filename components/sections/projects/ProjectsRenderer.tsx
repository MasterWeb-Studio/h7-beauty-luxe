import type { ProjectsRow } from '@/lib/types/projects';

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

interface GridProps {
  items: ProjectsRow[];
  locale: string;
}

export function ProjectsGrid({ items, locale }: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Henüz proje eklenmemiş.' : 'No projects yet.'}
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ProjectsCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface CardProps {
  item: ProjectsRow;
  locale: string;
}

export function ProjectsCard({ item, locale }: CardProps) {
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
      href={`/${locale}/projects/${slug}`}
      className="group block overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
      }}
    >
      {/* Cover Image */}
      {item.cover_image && (
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={`/api/media/${item.cover_image}`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item.is_featured && (
            <span
              className="absolute left-3 top-3 px-2 py-1 text-xs"
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
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-2">
        {item.client_name && (
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {item.client_name}
          </p>
        )}
        <h3
          className="text-lg leading-snug"
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
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {shortDesc}
          </p>
        )}
        {item.completion_date && (
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {new Date(item.completion_date).toLocaleDateString(
              locale === 'tr' ? 'tr-TR' : 'en-US',
              { year: 'numeric', month: 'long' },
            )}
          </p>
        )}
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------------

export interface ProjectsDetailProps {
  item: ProjectsRow;
  locale: string;
}

export function ProjectsDetail({ item, locale }: ProjectsDetailProps) {
  const title =
    item.title?.[locale] ??
    item.title?.tr ??
    Object.values(item.title ?? {})[0] ??
    '';
  const shortDesc =
    item.short_description?.[locale] ??
    item.short_description?.tr ??
    '';
  const description =
    item.description?.[locale] ??
    item.description?.tr ??
    '';
  const tags: string[] =
    item.tags?.[locale] ?? item.tags?.tr ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: shortDesc || undefined,
    dateCreated: item.completion_date ?? undefined,
    url: item.project_url ?? undefined,
    creator: item.client_name
      ? { '@type': 'Organization', name: item.client_name }
      : undefined,
  };

  return (
    <article style={{ color: 'var(--color-text)' }}>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Image */}
      {item.cover_image && (
        <div
          className="relative w-full overflow-hidden"
          style={{ maxHeight: '520px' }}
        >
          <img
            src={`/api/media/${item.cover_image}`}
            alt={title}
            className="h-full w-full object-cover"
            style={{ maxHeight: '520px' }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-8">
        {/* Title */}
        <header className="space-y-4">
          <h1
            className="text-4xl leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {title}
          </h1>

          {/* Client Meta */}
          {(item.client_name || item.completion_date || item.project_url) && (
            <div
              className="flex flex-wrap gap-6 py-4"
              style={{
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {item.client_name && (
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                  >
                    {locale === 'tr' ? 'Müşteri' : 'Client'}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                  >
                    {item.client_name}
                  </span>
                </div>
              )}
              {item.completion_date && (
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                  >
                    {locale === 'tr' ? 'Tamamlanma' : 'Completed'}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                  >
                    {new Date(item.completion_date).toLocaleDateString(
                      locale === 'tr' ? 'tr-TR' : 'en-US',
                      { year: 'numeric', month: 'long' },
                    )}
                  </span>
                </div>
              )}
              {item.project_url && (
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                  >
                    {locale === 'tr' ? 'Canlı Site' : 'Live Site'}
                  </span>
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                    style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
                  >
                    {item.project_url}
                  </a>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Short Description */}
        {shortDesc && (
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {shortDesc}
          </p>
        )}

        {/* Rich Text Description */}
        {description && (
          <div
            className="prose max-w-none"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {/* Gallery */}
        {item.gallery_images && item.gallery_images.length > 0 && (
          <section className="space-y-4">
            <h2
              className="text-2xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {locale === 'tr' ? 'Galeri' : 'Gallery'}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {item.gallery_images.map((imgId, idx) => (
                <div
                  key={imgId}
                  className="overflow-hidden"
                  style={{ borderRadius: 'var(--radius-card)' }}
                >
                  <img
                    src={`/api/media/${imgId}`}
                    alt={`${title} — ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs"
                style={{
                  background: 'var(--color-bg-muted)',
                  color: 'var(--color-text-muted)',
                  borderRadius: 'var(--radius-badge)',
                  fontFamily: 'var(--font-body)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA — Project URL */}
        {item.project_url && (
          <div className="pt-4">
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 text-sm transition-opacity hover:opacity-80"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-accent-fg)',
                borderRadius: 'var(--radius-button)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {locale === 'tr' ? 'Projeyi Görüntüle' : 'View Project'}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

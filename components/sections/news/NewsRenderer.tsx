import type { NewsRow } from '@/lib/types/news';

interface NewsGridProps {
  items: NewsRow[];
  locale: string;
  emptyMessage?: string;
}

export function NewsGrid({ items, locale, emptyMessage }: NewsGridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {emptyMessage ?? (locale === 'tr' ? 'Henuz haber eklenmemis.' : 'No news yet.')}
      </p>
    );
  }
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

interface NewsCardProps {
  item: NewsRow;
  locale: string;
}

export function NewsCard({ item, locale }: NewsCardProps) {
  const title =
    item.title?.[locale] ??
    item.title?.tr ??
    Object.values(item.title ?? {})[0] ??
    '';
  const excerpt =
    item.excerpt?.[locale] ??
    item.excerpt?.tr ??
    (item.excerpt ? Object.values(item.excerpt)[0] : null) ??
    null;
  const slug =
    item.slug?.[locale] ??
    item.slug?.tr ??
    Object.values(item.slug ?? {})[0] ??
    '';
  const heroUrl = item.hero_image ? `/api/media/${item.hero_image}` : null;
  const publishedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' },
      )
    : null;

  return (
    <a
      href={`/${locale}/news/${slug}`}
      className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
      }}
    >
      {heroUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={heroUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {publishedDate && (
          <time
            dateTime={item.published_at}
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {publishedDate}
          </time>
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
        {excerpt && (
          <p
            className="line-clamp-3 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {excerpt}
          </p>
        )}
        {item.author && (
          <p
            className="mt-auto text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {item.author}
          </p>
        )}
      </div>
    </a>
  );
}

export interface NewsDetailProps {
  item: NewsRow;
  locale: string;
  relatedItems?: NewsRow[];
}

export function NewsDetail({ item, locale, relatedItems = [] }: NewsDetailProps) {
  const title =
    item.title?.[locale] ??
    item.title?.tr ??
    Object.values(item.title ?? {})[0] ??
    '';
  const excerpt =
    item.excerpt?.[locale] ??
    item.excerpt?.tr ??
    (item.excerpt ? Object.values(item.excerpt)[0] : null) ??
    null;
  const content =
    item.content?.[locale] ??
    item.content?.tr ??
    Object.values(item.content ?? {})[0] ??
    '';
  const heroUrl = item.hero_image ? `/api/media/${item.hero_image}` : null;
  const tags: string[] = (item.tags?.[locale] ?? item.tags?.tr ?? []) as string[];
  const publishedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' },
      )
    : null;

  return (
    <article
      className="container mx-auto max-w-4xl px-4 py-10"
      style={{ color: 'var(--color-text)' }}
    >
      {heroUrl && (
        <div
          className="mb-8 w-full overflow-hidden"
          style={{ borderRadius: 'var(--radius-card)' }}
        >
          <img
            src={heroUrl}
            alt={title}
            className="h-auto w-full object-cover"
            style={{ maxHeight: '480px' }}
          />
        </div>
      )}

      <h1
        className="mb-4 text-4xl leading-tight"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
      >
        {title}
      </h1>

      <div
        className="mb-6 flex flex-wrap items-center gap-4 text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {publishedDate && (
          <time dateTime={item.published_at}>{publishedDate}</time>
        )}
        {item.author && (
          <span>
            {locale === 'tr' ? 'Yazar:' : 'Author:'}{' '}
            <span style={{ color: 'var(--color-text)' }}>{item.author}</span>
          </span>
        )}
      </div>

      {excerpt && (
        <p
          className="mb-8 text-lg leading-relaxed"
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            borderLeft: '4px solid var(--color-primary)',
            paddingLeft: '1rem',
          }}
        >
          {excerpt}
        </p>
      )}

      <div
        className="prose max-w-none"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {item.gallery && item.gallery.length > 0 && (
        <div className="mt-10">
          <h2
            className="mb-4 text-2xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'Galeri' : 'Gallery'}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {item.gallery.map((mediaId, idx) => (
              <div
                key={mediaId}
                className="overflow-hidden"
                style={{ borderRadius: 'var(--radius-card)' }}
              >
                <img
                  src={`/api/media/${mediaId}`}
                  alt={`${title} ${idx + 1}`}
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/${locale}/news?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1 text-xs"
              style={{
                borderRadius: 'var(--radius-card)',
                background: 'var(--color-bg-muted)',
                color: 'var(--color-text-muted)',
              }}
            >
              #{tag}
            </a>
          ))}
        </div>
      )}

      <div
        className="mt-10 flex items-center gap-4 border-t pt-6"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {locale === 'tr' ? 'Paylas:' : 'Share:'}
        </span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Twitter / X
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
          style={{ color: 'var(--color-primary)' }}
        >
          LinkedIn
        </a>
      </div>

      {relatedItems.length > 0 && (
        <section className="mt-16">
          <h2
            className="mb-6 text-2xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'Ilgili Haberler' : 'Related News'}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedItems.map((rel) => (
              <NewsCard key={rel.id} item={rel} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

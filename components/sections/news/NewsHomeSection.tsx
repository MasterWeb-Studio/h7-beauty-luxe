import type { NewsRow } from '@/lib/types/news';
import { NewsCard } from './NewsRenderer';

interface NewsGrid3ColProps {
  items: NewsRow[];
  locale: string;
  title?: string;
  viewAllHref?: string;
}

export function NewsGrid3Col({ items, locale, title, viewAllHref }: NewsGrid3ColProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(title || viewAllHref) && (
          <div className="mb-8 flex items-center justify-between">
            {title && (
              <h2
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
              >
                {title}
              </h2>
            )}
            {viewAllHref && (
              <a href={viewAllHref} className="text-sm" style={{ color: 'var(--color-primary)' }}>
                {locale === 'tr' ? 'Tumunu Gor' : 'View All'}
              </a>
            )}
          </div>
        )}
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {locale === 'tr' ? 'Henuz haber eklenmemis.' : 'No news yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((item) => (
              <NewsCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface NewsListSectionProps {
  items: NewsRow[];
  locale: string;
  title?: string;
  viewAllHref?: string;
}

export function NewsListSection({ items, locale, title, viewAllHref }: NewsListSectionProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(title || viewAllHref) && (
          <div className="mb-8 flex items-center justify-between">
            {title && (
              <h2
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
              >
                {title}
              </h2>
            )}
            {viewAllHref && (
              <a href={viewAllHref} className="text-sm" style={{ color: 'var(--color-primary)' }}>
                {locale === 'tr' ? 'Tumunu Gor' : 'View All'}
              </a>
            )}
          </div>
        )}
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {locale === 'tr' ? 'Henuz haber eklenmemis.' : 'No news yet.'}
          </p>
        ) : (
          <ul className="space-y-4">
            {items.slice(0, 5).map((item) => {
              const itemTitle =
                item.title?.[locale] ??
                item.title?.tr ??
                Object.values(item.title ?? {})[0] ??
                '';
              const itemSlug =
                item.slug?.[locale] ??
                item.slug?.tr ??
                Object.values(item.slug ?? {})[0] ??
                '';
              const itemExcerpt =
                item.excerpt?.[locale] ??
                item.excerpt?.tr ??
                (item.excerpt ? Object.values(item.excerpt)[0] : null) ??
                null;
              const publishedDate = item.published_at
                ? new Date(item.published_at).toLocaleDateString(
                    locale === 'tr' ? 'tr-TR' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' },
                  )
                : null;
              return (
                <li key={item.id}>
                  <a
                    href={`/${locale}/news/${itemSlug}`}
                    className="flex items-start gap-4 py-4 transition-opacity hover:opacity-80"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    {item.hero_image && (
                      <div
                        className="shrink-0 overflow-hidden"
                        style={{
                          width: '80px',
                          height: '60px',
                          borderRadius: 'var(--radius-card)',
                        }}
                      >
                        <img
                          src={`/api/media/${item.hero_image}`}
                          alt={itemTitle}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-1">
                      <h3
                        className="text-base leading-snug"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                      >
                        {itemTitle}
                      </h3>
                      {itemExcerpt && (
                        <p className="line-clamp-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {itemExcerpt}
                        </p>
                      )}
                      {publishedDate && (
                        <time
                          dateTime={item.published_at}
                          className="text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {publishedDate}
                        </time>
                      )}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

interface NewsFeaturedLargeProps {
  item: NewsRow | null;
  locale: string;
  viewAllHref?: string;
}

export function NewsFeaturedLarge({ item, locale, viewAllHref }: NewsFeaturedLargeProps) {
  if (!item) return null;

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
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        <a
          href={`/${locale}/news/${slug}`}
          className="group grid grid-cols-1 overflow-hidden transition-shadow hover:shadow-xl md:grid-cols-2"
          style={{ borderRadius: 'var(--radius-card)' }}
        >
          {heroUrl && (
            <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
              <img
                src={heroUrl}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div
            className="flex flex-col justify-center gap-4 p-8 md:p-12"
            style={{ background: 'var(--color-bg-muted)' }}
          >
            {publishedDate && (
              <time dateTime={item.published_at} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {publishedDate}
              </time>
            )}
            <h2
              className="text-3xl leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {title}
            </h2>
            {excerpt && (
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {excerpt}
              </p>
            )}
            {item.author && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {item.author}
              </p>
            )}
            <span className="mt-2 inline-flex items-center gap-1 text-sm" style={{ color: 'var(--color-primary)' }}>
              {locale === 'tr' ? 'Devamini Oku' : 'Read More'}
            </span>
          </div>
        </a>
        {viewAllHref && (
          <div className="mt-6 text-right">
            <a href={viewAllHref} className="text-sm" style={{ color: 'var(--color-primary)' }}>
              {locale === 'tr' ? 'Tum Haberler' : 'All News'}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

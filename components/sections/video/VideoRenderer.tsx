import type { VideoRow } from '@/lib/types/video';

// ─── Embed URL helper ───────────────────────────────────────────────────────
function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === 'youtu.be') {
      const v = u.pathname.slice(1);
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    // Vimeo
    if (u.hostname === 'vimeo.com' || u.hostname === 'www.vimeo.com') {
      const v = u.pathname.slice(1);
      if (v) return `https://player.vimeo.com/video/${v}`;
    }
    return null;
  } catch {
    return null;
  }
}

function getThumbnailUrl(item: VideoRow): string | null {
  if (item.thumbnail) return `/api/media/${item.thumbnail}`;
  try {
    const u = new URL(item.video_url);
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      const v = u.searchParams.get('v');
      if (v) return `https://img.youtube.com/vi/${v}/hqdefault.jpg`;
    }
    if (u.hostname === 'youtu.be') {
      const v = u.pathname.slice(1);
      if (v) return `https://img.youtube.com/vi/${v}/hqdefault.jpg`;
    }
  } catch {
    // ignore
  }
  return null;
}

// ─── VideoGrid ───────────────────────────────────────────────────────────────
export interface VideoGridProps {
  items: VideoRow[];
  locale: string;
}

export function VideoGrid({ items, locale }: VideoGridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Henüz video yok.' : 'No videos yet.'}
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <VideoCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ─── VideoCard ───────────────────────────────────────────────────────────────
export interface VideoCardProps {
  item: VideoRow;
  locale: string;
}

export function VideoCard({ item, locale }: VideoCardProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? Object.values(item.title ?? {})[0] ?? '';
  const description = item.description?.[locale] ?? item.description?.tr ?? null;
  const thumb = getThumbnailUrl(item);
  const embedUrl = getEmbedUrl(item.video_url);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
      }}
    >
      {/* Thumbnail / embed preview */}
      <div className="relative w-full" style={{ aspectRatio: '16/9', background: 'var(--color-bg-subtle)' }}>
        {thumb ? (
          <img
            src={thumb}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
          <span
            className="flex h-12 w-12 items-center justify-center"
            style={{
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: 'var(--color-primary-fg)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </span>
        </div>
        {item.duration ? (
          <span
            className="absolute bottom-2 right-2 px-2 py-0.5 text-xs"
            style={{
              background: 'rgba(0,0,0,0.65)',
              color: '#fff',
              borderRadius: 'var(--radius-badge)',
            }}
          >
            {item.duration}
          </span>
        ) : null}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3
          className="text-base leading-snug"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h3>
        {description ? (
          <p
            className="line-clamp-2 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        ) : null}
        {embedUrl ? (
          <a
            href={item.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 text-sm"
            style={{ color: 'var(--color-primary)' }}
          >
            {locale === 'tr' ? 'İzle' : 'Watch'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : null}
      </div>
    </div>
  );
}

// ─── VideoSingleHero ─────────────────────────────────────────────────────────
export interface VideoSingleHeroProps {
  item: VideoRow;
  locale: string;
}

export function VideoSingleHero({ item, locale }: VideoSingleHeroProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? Object.values(item.title ?? {})[0] ?? '';
  const description = item.description?.[locale] ?? item.description?.tr ?? null;
  const embedUrl = getEmbedUrl(item.video_url);
  const thumb = getThumbnailUrl(item);

  return (
    <section
      className="w-full"
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto max-w-4xl px-4">
        <h2
          className="mb-4 text-3xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h2>
        {description ? (
          <p className="mb-6 text-base" style={{ color: 'var(--color-text-muted)' }}>
            {description}
          </p>
        ) : null}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-card)', background: 'var(--color-bg-subtle)' }}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : thumb ? (
            <img src={thumb} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
        </div>
        {item.duration ? (
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {locale === 'tr' ? 'Süre:' : 'Duration:'} {item.duration}
          </p>
        ) : null}
      </div>
    </section>
  );
}

// ─── VideoFeaturedSection ────────────────────────────────────────────────────
export interface VideoFeaturedSectionProps {
  items: VideoRow[];
  locale: string;
}

export function VideoFeaturedSection({ items, locale }: VideoFeaturedSectionProps) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const featuredTitle = featured.title?.[locale] ?? featured.title?.tr ?? Object.values(featured.title ?? {})[0] ?? '';
  const featuredDesc = featured.description?.[locale] ?? featured.description?.tr ?? null;
  const featuredEmbed = getEmbedUrl(featured.video_url);
  const featuredThumb = getThumbnailUrl(featured);

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Main featured */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-card)', background: 'var(--color-bg-subtle)' }}
          >
            {featuredEmbed ? (
              <iframe
                src={featuredEmbed}
                title={featuredTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : featuredThumb ? (
              <img src={featuredThumb} alt={featuredTitle} className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="flex flex-col justify-center gap-4">
            <h2
              className="text-2xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {featuredTitle}
            </h2>
            {featuredDesc ? (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {featuredDesc}
              </p>
            ) : null}
            {featured.duration ? (
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {locale === 'tr' ? 'Süre:' : 'Duration:'} {featured.duration}
              </span>
            ) : null}
          </div>
        </div>

        {/* Rest */}
        {rest.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => (
              <VideoCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

// ─── Section dispatcher ──────────────────────────────────────────────────────
export type VideoSectionVariant = 'video-single' | 'video-grid' | 'video-featured';

export interface VideoSectionProps {
  variant: VideoSectionVariant;
  items: VideoRow[];
  locale: string;
}

export function VideoSection({ variant, items, locale }: VideoSectionProps) {
  if (variant === 'video-single') {
    const item = items[0];
    if (!item) return null;
    return <VideoSingleHero item={item} locale={locale} />;
  }
  if (variant === 'video-featured') {
    return <VideoFeaturedSection items={items} locale={locale} />;
  }
  // video-grid (default)
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        <VideoGrid items={items} locale={locale} />
      </div>
    </section>
  );
}

import type { TimelineRow } from '@/lib/types/timeline';

interface TimelineVerticalProps {
  items: TimelineRow[];
  locale: string;
}

export function TimelineVertical({ items, locale }: TimelineVerticalProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Henüz kayıt yok.' : 'No items yet.'}
      </p>
    );
  }

  return (
    <div className="relative mt-8 space-y-0">
      {/* Vertical line */}
      <div
        className="absolute left-6 top-0 h-full w-px"
        style={{ background: 'var(--color-border)' }}
        aria-hidden="true"
      />
      {items.map((item, index) => (
        <TimelineVerticalItem key={item.id} item={item} locale={locale} isLast={index === items.length - 1} />
      ))}
    </div>
  );
}

interface TimelineVerticalItemProps {
  item: TimelineRow;
  locale: string;
  isLast: boolean;
}

function TimelineVerticalItem({ item, locale, isLast }: TimelineVerticalItemProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? Object.values(item.title ?? {})[0] ?? '';
  const description = item.description?.[locale] ?? item.description?.tr ?? Object.values(item.description ?? {})[0] ?? null;
  const dateLabel = item.month
    ? `${item.month.toString().padStart(2, '0')}/${item.year}`
    : `${item.year}`;

  return (
    <div className={`relative flex gap-6 ${isLast ? 'pb-0' : 'pb-10'}`}>
      {/* Dot */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className="flex h-12 w-12 items-center justify-center"
          style={{
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
          }}
        >
          {item.icon ? (
            <span className="text-sm" style={{ fontFamily: 'var(--font-display)' }}>
              {item.icon.slice(0, 2)}
            </span>
          ) : (
            <span
              className="text-xs"
              style={{ color: 'var(--color-accent-fg)', fontFamily: 'var(--font-mono, monospace)' }}
            >
              {item.year.toString().slice(2)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-hidden p-5"
        style={{
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border)',
        }}
      >
        <time
          className="mb-1 block text-xs"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)' }}
          dateTime={item.month ? `${item.year}-${item.month.toString().padStart(2, '0')}` : `${item.year}`}
        >
          {dateLabel}
        </time>
        <h3
          className="text-base"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h3>
        {description && (
          <div
            className="mt-2 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        {item.image && (
          <img
            src={item.image}
            alt={title}
            className="mt-4 w-full object-cover"
            style={{ borderRadius: 'var(--radius-card)', maxHeight: '200px' }}
          />
        )}
      </div>
    </div>
  );
}

interface TimelineHorizontalProps {
  items: TimelineRow[];
  locale: string;
}

export function TimelineHorizontal({ items, locale }: TimelineHorizontalProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Henüz kayıt yok.' : 'No items yet.'}
      </p>
    );
  }

  return (
    <div className="relative mt-8 overflow-x-auto">
      {/* Horizontal line */}
      <div
        className="absolute left-0 top-6 h-px w-full"
        style={{ background: 'var(--color-border)' }}
        aria-hidden="true"
      />
      <div className="flex gap-8 pb-4">
        {items.map((item) => (
          <TimelineHorizontalItem key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}

interface TimelineHorizontalItemProps {
  item: TimelineRow;
  locale: string;
}

function TimelineHorizontalItem({ item, locale }: TimelineHorizontalItemProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? Object.values(item.title ?? {})[0] ?? '';
  const description = item.description?.[locale] ?? item.description?.tr ?? Object.values(item.description ?? {})[0] ?? null;
  const dateLabel = item.month
    ? `${item.month.toString().padStart(2, '0')}/${item.year}`
    : `${item.year}`;

  return (
    <div className="relative flex min-w-[200px] max-w-[240px] flex-col items-center gap-3">
      {/* Dot */}
      <div
        className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center"
        style={{
          borderRadius: '50%',
          background: 'var(--color-accent)',
          color: 'var(--color-accent-fg)',
          border: '3px solid var(--color-bg)',
        }}
      >
        {item.icon ? (
          <span className="text-xs" style={{ fontFamily: 'var(--font-display)' }}>
            {item.icon.slice(0, 2)}
          </span>
        ) : (
          <span
            className="text-xs"
            style={{ color: 'var(--color-accent-fg)', fontFamily: 'var(--font-mono, monospace)' }}
          >
            {item.year.toString().slice(2)}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="w-full p-4 text-center"
        style={{
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border)',
        }}
      >
        <time
          className="mb-1 block text-xs"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)' }}
          dateTime={item.month ? `${item.year}-${item.month.toString().padStart(2, '0')}` : `${item.year}`}
        >
          {dateLabel}
        </time>
        <h3
          className="text-sm"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h3>
        {description && (
          <div
            className="mt-2 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
            dangerouslySetInnerHTML={{
              __html: description.replace(/<[^>]*>/g, '').slice(0, 120),
            }}
          />
        )}
      </div>
    </div>
  );
}

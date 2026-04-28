import type * as React from 'react';
import type { ContactCardRow } from '@/lib/types/contact-cards';

// ---------------------------------------------------------------------------
// ContactCardsGrid — 3-column variant
// ---------------------------------------------------------------------------

interface GridProps {
  items: ContactCardRow[];
  locale: string;
}

export function ContactCardsGrid({ items, locale }: GridProps) {
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
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContactCardsCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContactCardsInline — horizontal / inline variant
// ---------------------------------------------------------------------------

interface InlineProps {
  items: ContactCardRow[];
  locale: string;
}

export function ContactCardsInline({ items, locale }: InlineProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-6 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Henüz kayıt yok.' : 'No items yet.'}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      {items.map((item) => (
        <ContactCardsInlineItem key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContactCardsCard — card used in grid variant
// ---------------------------------------------------------------------------

interface CardProps {
  item: ContactCardRow;
  locale: string;
}

export function ContactCardsCard({ item, locale }: CardProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? '';
  const value = item.value?.[locale] ?? item.value?.tr ?? Object.values(item.value ?? {})[0] ?? '';

  const inner = (
    <div
      className="flex flex-col gap-3 p-6"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
        height: '100%',
      }}
    >
      {item.icon ? (
        <span
          className="text-2xl"
          aria-hidden="true"
          style={{ color: 'var(--color-accent)' }}
        >
          {/* Icon name stored as string — render as text label or swap with Lucide at build time */}
          <ContactCardIcon name={item.icon} />
        </span>
      ) : null}
      <h3
        className="text-base"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text-muted)',
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--color-text)' }}
      >
        {value}
      </p>
    </div>
  );

  if (item.link_url) {
    return (
      <a
        href={item.link_url}
        className="block overflow-hidden transition-shadow hover:shadow-lg"
        style={{ borderRadius: 'var(--radius-card)' }}
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="block overflow-hidden"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      {inner}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContactCardsInlineItem — compact item used in inline variant
// ---------------------------------------------------------------------------

interface InlineItemProps {
  item: ContactCardRow;
  locale: string;
}

function ContactCardsInlineItem({ item, locale }: InlineItemProps) {
  const title = item.title?.[locale] ?? item.title?.tr ?? '';
  const value = item.value?.[locale] ?? item.value?.tr ?? Object.values(item.value ?? {})[0] ?? '';

  const inner = (
    <div
      className="flex items-center gap-3 px-5 py-3"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
      }}
    >
      {item.icon ? (
        <span
          className="shrink-0"
          aria-hidden="true"
          style={{ color: 'var(--color-accent)' }}
        >
          <ContactCardIcon name={item.icon} />
        </span>
      ) : null}
      <div className="flex flex-col">
        <span
          className="text-xs"
          style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        <span
          className="text-sm"
          style={{ color: 'var(--color-text)' }}
        >
          {value}
        </span>
      </div>
    </div>
  );

  if (item.link_url) {
    return (
      <a
        href={item.link_url}
        className="transition-opacity hover:opacity-80"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return <div>{inner}</div>;
}

// ---------------------------------------------------------------------------
// ContactCardIcon — renders Lucide icon name as SVG placeholder
// Replace with actual Lucide import if lucide-react is available in template
// ---------------------------------------------------------------------------

function ContactCardIcon({ name }: { name: string }) {
  // Minimal SVG map for common contact icons
  const icons: Record<string, React.ReactElement> = {
    Phone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
      </svg>
    ),
    Mail: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    MapPin: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    Clock: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };

  return icons[name] ?? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

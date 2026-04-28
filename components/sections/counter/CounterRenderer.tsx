import type { CounterRow } from '@/lib/types/counter';

// ---------------------------------------------------------------------------
// CounterGrid — 4-column variant (counter-4col)
// ---------------------------------------------------------------------------

interface GridProps {
  items: CounterRow[];
  locale: string;
  variant?: 'counter-4col' | 'counter-inline';
}

export function CounterGrid({ items, locale, variant = 'counter-4col' }: GridProps) {
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

  const isInline = variant === 'counter-inline';

  return (
    <div
      className={
        isInline
          ? 'flex flex-wrap items-center justify-center gap-8'
          : 'grid grid-cols-2 gap-6 md:grid-cols-4'
      }
    >
      {items.map((item) => (
        <CounterCard key={item.id} item={item} locale={locale} inline={isInline} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CounterCard
// ---------------------------------------------------------------------------

interface CardProps {
  item: CounterRow;
  locale: string;
  inline?: boolean;
}

export function CounterCard({ item, locale, inline = false }: CardProps) {
  const label = item.label?.[locale] ?? item.label?.tr ?? Object.values(item.label ?? {})[0] ?? '';
  const suffix = item.suffix?.[locale] ?? item.suffix?.tr ?? Object.values(item.suffix ?? {})[0] ?? '';
  const value = item.value ?? 0;

  return (
    <div
      className={inline ? 'flex flex-col items-center px-6 py-4' : 'flex flex-col items-center p-6'}
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
      }}
    >
      {item.icon ? (
        <span
          className="mb-3 text-3xl"
          aria-hidden="true"
          style={{ color: 'var(--color-accent)' }}
          data-lucide-icon={item.icon}
        />
      ) : null}
      <span
        className="text-4xl"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-accent)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')}
        {suffix ? (
          <span
            className="text-2xl"
            style={{ color: 'var(--color-accent)' }}
          >
            {suffix}
          </span>
        ) : null}
      </span>
      <span
        className="mt-2 text-center text-sm"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CounterSection — home section wrapper (variant dispatcher)
// ---------------------------------------------------------------------------

interface SectionProps {
  items: CounterRow[];
  locale: string;
  variantId?: string;
  title?: string;
}

export function CounterSection({ items, locale, variantId = 'counter-4col', title }: SectionProps) {
  const variant =
    variantId === 'counter-inline' ? 'counter-inline' : 'counter-4col';

  return (
    <section
      aria-label={locale === 'tr' ? 'İstatistikler' : 'Statistics'}
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {title ? (
          <h2
            className="mb-8 text-center text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {title}
          </h2>
        ) : null}
        <CounterGrid items={items} locale={locale} variant={variant} />
      </div>
    </section>
  );
}

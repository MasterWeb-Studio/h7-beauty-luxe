import type { CareerRow } from '@/lib/types/career';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMPLOYMENT_TYPE_LABELS: Record<
  CareerRow['employment_type'],
  { tr: string; en: string }
> = {
  full_time: { tr: 'Tam Zamanlı', en: 'Full Time' },
  part_time: { tr: 'Yarı Zamanlı', en: 'Part Time' },
  contract: { tr: 'Sözleşmeli', en: 'Contract' },
  intern: { tr: 'Stajyer', en: 'Intern' },
};

function getLocaleString(
  value: Record<string, string> | string | null | undefined,
  locale: string,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value['tr'] ?? Object.values(value)[0] ?? '';
}

// ---------------------------------------------------------------------------
// CareerGrid
// ---------------------------------------------------------------------------

interface GridProps {
  items: CareerRow[];
  locale: string;
}

export function CareerGrid({ items, locale }: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr'
          ? 'Şu anda açık pozisyon yok.'
          : 'No open positions at the moment.'}
      </p>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {items.map((it) => (
        <CareerCard key={it.id} item={it} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CareerCard
// ---------------------------------------------------------------------------

interface CardProps {
  item: CareerRow;
  locale: string;
}

export function CareerCard({ item, locale }: CardProps) {
  const title = getLocaleString(item.title, locale);
  const department = getLocaleString(item.department, locale);
  const slug = getLocaleString(item.slug, locale);
  const typeLabel =
    EMPLOYMENT_TYPE_LABELS[item.employment_type]?.[locale as 'tr' | 'en'] ??
    EMPLOYMENT_TYPE_LABELS[item.employment_type]?.en ??
    item.employment_type;

  return (
    <a
      href={`/${locale}/career/${slug}`}
      className="flex items-center justify-between gap-4 p-6 transition-shadow hover:shadow-md"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
        textDecoration: 'none',
      }}
    >
      <div className="flex flex-col gap-1">
        <h3
          className="text-lg"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          {title}
        </h3>
        {department && (
          <span
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {department}
          </span>
        )}
        {item.location && (
          <span
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {item.location}
          </span>
        )}
      </div>
      <span
        className="shrink-0 px-3 py-1 text-xs"
        style={{
          borderRadius: 'var(--radius-badge)',
          background: 'var(--color-accent-muted)',
          color: 'var(--color-accent)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {typeLabel}
      </span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// CareerDetail
// ---------------------------------------------------------------------------

export interface CareerDetailProps {
  item: CareerRow;
  locale: string;
}

export function CareerDetail({ item, locale }: CareerDetailProps) {
  const title = getLocaleString(item.title, locale);
  const department = getLocaleString(item.department, locale);
  const description = getLocaleString(item.description, locale);
  const requirements = getLocaleString(item.requirements, locale);
  const typeLabel =
    EMPLOYMENT_TYPE_LABELS[item.employment_type]?.[locale as 'tr' | 'en'] ??
    EMPLOYMENT_TYPE_LABELS[item.employment_type]?.en ??
    item.employment_type;

  return (
    <article
      className="container mx-auto max-w-4xl px-4 py-10"
      style={{ color: 'var(--color-text)' }}
    >
      {/* Header */}
      <header className="mb-8">
        <h1
          className="text-4xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h1>

        {/* Meta bar */}
        <div
          className="mt-4 flex flex-wrap items-center gap-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {department && (
            <span className="flex items-center gap-1 text-sm">
              {department}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1 text-sm">
              {item.location}
            </span>
          )}
          <span
            className="px-3 py-1 text-xs"
            style={{
              borderRadius: 'var(--radius-badge)',
              background: 'var(--color-accent-muted)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {typeLabel}
          </span>
        </div>
      </header>

      {/* Description */}
      {description && (
        <section className="mb-8">
          <h2
            className="mb-4 text-2xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'Pozisyon Açıklaması' : 'Position Description'}
          </h2>
          <div
            className="prose max-w-none"
            style={{ color: 'var(--color-text)' }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </section>
      )}

      {/* Requirements */}
      {requirements && (
        <section className="mb-8">
          <h2
            className="mb-4 text-2xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'Gereksinimler' : 'Requirements'}
          </h2>
          <div
            className="prose max-w-none"
            style={{ color: 'var(--color-text)' }}
            dangerouslySetInnerHTML={{ __html: requirements }}
          />
        </section>
      )}

      {/* Apply CTA */}
      <section
        className="mt-10 p-8"
        style={{
          borderRadius: 'var(--radius-card)',
          background: 'var(--color-bg-muted)',
        }}
      >
        <h2
          className="mb-2 text-xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {locale === 'tr' ? 'Başvur' : 'Apply Now'}
        </h2>
        <p
          className="mb-6 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {locale === 'tr'
            ? 'Bu pozisyon için başvurmak ister misiniz?'
            : 'Interested in this position?'}
        </p>
        <a
          href={`/${locale}/career/${getLocaleString(item.slug, locale)}/apply`}
          className="inline-block px-6 py-3 text-sm transition-opacity hover:opacity-80"
          style={{
            borderRadius: 'var(--radius-button)',
            background: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
          }}
        >
          {locale === 'tr' ? 'Hemen Başvur' : 'Apply Now'}
        </a>
      </section>
    </article>
  );
}

import type { CareerRow } from '@/lib/types/career';
import { CareerCard } from './CareerRenderer';

// ---------------------------------------------------------------------------
// Shared helper
// ---------------------------------------------------------------------------

function getLocaleString(
  value: Record<string, string> | string | null | undefined,
  locale: string,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value['tr'] ?? Object.values(value)[0] ?? '';
}

// ---------------------------------------------------------------------------
// career-list variant  (spec: defaultCount=5, selectionLogic=latest)
// ---------------------------------------------------------------------------

interface CareerListSectionProps {
  items: CareerRow[];
  locale: string;
  /** Override başlık */
  heading?: string;
}

export function CareerListSection({
  items,
  locale,
  heading,
}: CareerListSectionProps) {
  const defaultHeading = locale === 'tr' ? 'Açık Pozisyonlar' : 'Open Positions';

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <h2
            className="text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {heading ?? defaultHeading}
          </h2>
          <a
            href={`/${locale}/career`}
            className="text-sm"
            style={{
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
            }}
          >
            {locale === 'tr' ? 'Tümünü Gör →' : 'View All →'}
          </a>
        </div>

        {items.length === 0 ? (
          <p
            className="py-10 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr'
              ? 'Şu anda açık pozisyon yok.'
              : 'No open positions at the moment.'}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((it) => (
              <CareerCard key={it.id} item={it} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// career-cards variant  (spec: defaultCount=3, selectionLogic=latest)
// ---------------------------------------------------------------------------

interface CareerCardsSectionProps {
  items: CareerRow[];
  locale: string;
  heading?: string;
}

export function CareerCardsSection({
  items,
  locale,
  heading,
}: CareerCardsSectionProps) {
  const defaultHeading = locale === 'tr' ? 'Kariyer Fırsatları' : 'Career Opportunities';

  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <h2
            className="text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {heading ?? defaultHeading}
          </h2>
          <a
            href={`/${locale}/career`}
            className="text-sm"
            style={{
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
            }}
          >
            {locale === 'tr' ? 'Tümünü Gör →' : 'View All →'}
          </a>
        </div>

        {items.length === 0 ? (
          <p
            className="py-10 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr'
              ? 'Şu anda açık pozisyon yok.'
              : 'No open positions at the moment.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <a
                key={it.id}
                href={`/${locale}/career/${getLocaleString(it.slug, locale)}`}
                className="flex flex-col gap-3 p-6 transition-shadow hover:shadow-md"
                style={{
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--color-bg)',
                  textDecoration: 'none',
                }}
              >
                <h3
                  className="text-lg"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text)',
                  }}
                >
                  {getLocaleString(it.title, locale)}
                </h3>
                {getLocaleString(it.department, locale) && (
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {getLocaleString(it.department, locale)}
                  </span>
                )}
                {it.location && (
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {it.location}
                  </span>
                )}
                <span
                  className="mt-auto self-start px-3 py-1 text-xs"
                  style={{
                    borderRadius: 'var(--radius-badge)',
                    background: 'var(--color-accent-muted)',
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {locale === 'tr' ? 'Detayları Gör' : 'View Details'}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import type { TeamRow } from '@/lib/types/team';
import { TeamCard } from './TeamCard';

// ─── Variant: team-grid-3col ──────────────────────────────────────────────────

interface TeamGrid3ColProps {
  items: TeamRow[];
  locale: string;
  title?: string;
  subtitle?: string;
}

export function TeamGrid3Col({ items, locale, title, subtitle }: TeamGrid3ColProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <h2
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-3 text-base"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <p
            className="py-10 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr' ? 'Ekip üyesi eklenmemiş.' : 'No team members yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((member) => (
              <TeamCard key={member.id} item={member} locale={locale} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href={`/${locale}/team`}
            className="inline-block px-6 py-3 text-sm"
            style={{
              borderRadius: 'var(--radius-button)',
              background: 'var(--color-accent)',
              color: 'var(--color-accent-fg)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {locale === 'tr' ? 'Tüm Ekibi Gör' : 'View All Team'}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Variant: team-masonry ────────────────────────────────────────────────────

interface TeamMasonryProps {
  items: TeamRow[];
  locale: string;
  title?: string;
  subtitle?: string;
}

export function TeamMasonry({ items, locale, title, subtitle }: TeamMasonryProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <h2
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-3 text-base"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <p
            className="py-10 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr' ? 'Ekip üyesi eklenmemiş.' : 'No team members yet.'}
          </p>
        ) : (
          <div
            className="columns-1 gap-6 sm:columns-2 lg:columns-3"
            style={{ columnGap: 'var(--spacing-md)' }}
          >
            {items.map((member) => (
              <div key={member.id} className="mb-6 break-inside-avoid">
                <TeamCard item={member} locale={locale} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href={`/${locale}/team`}
            className="inline-block px-6 py-3 text-sm"
            style={{
              borderRadius: 'var(--radius-button)',
              background: 'var(--color-accent)',
              color: 'var(--color-accent-fg)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {locale === 'tr' ? 'Tüm Ekibi Gör' : 'View All Team'}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export interface TeamHomeSectionProps {
  variantId: 'team-grid-3col' | 'team-masonry';
  items: TeamRow[];
  locale: string;
  title?: string;
  subtitle?: string;
}

export function TeamHomeSection({
  variantId,
  items,
  locale,
  title,
  subtitle,
}: TeamHomeSectionProps) {
  if (variantId === 'team-masonry') {
    return <TeamMasonry items={items} locale={locale} title={title} subtitle={subtitle} />;
  }
  return <TeamGrid3Col items={items} locale={locale} title={title} subtitle={subtitle} />;
}

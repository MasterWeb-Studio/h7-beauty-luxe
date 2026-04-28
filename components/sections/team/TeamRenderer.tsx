import type { TeamRow } from '@/lib/types/team';
import { TeamCard } from './TeamCard';

// ─── Grid ────────────────────────────────────────────────────────────────────

interface GridProps {
  items: TeamRow[];
  locale: string;
}

export function TeamGrid({ items, locale }: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr' ? 'Ekip üyesi eklenmemiş.' : 'No team members yet.'}
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((member) => (
        <TeamCard key={member.id} item={member} locale={locale} />
      ))}
    </div>
  );
}

// ─── Detail ──────────────────────────────────────────────────────────────────

export interface TeamDetailProps {
  item: TeamRow;
  locale: string;
}

export function TeamDetail({ item, locale }: TeamDetailProps) {
  const name = item.name ?? '';
  const role = item.role?.[locale] ?? item.role?.tr ?? Object.values(item.role ?? {})[0] ?? '';
  const bio = item.bio?.[locale] ?? item.bio?.tr ?? Object.values(item.bio ?? {})[0] ?? null;
  const socialLinks = item.social_links as Record<string, string> | null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    image: item.photo ?? undefined,
    email: item.email ?? undefined,
    telephone: item.phone ?? undefined,
    sameAs: socialLinks ? Object.values(socialLinks).filter(Boolean) : undefined,
  };

  return (
    <article
      className="container mx-auto max-w-4xl px-4 py-10"
      style={{ color: 'var(--color-text)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Photo */}
      {item.photo && (
        <div className="mb-8 flex justify-center">
          <div
            className="overflow-hidden"
            style={{
              borderRadius: 'var(--radius-card)',
              width: '200px',
              height: '200px',
              background: 'var(--color-bg-muted)',
            }}
          >
            <img
              src={item.photo}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {/* Name + Role */}
      <div className="mb-6 text-center">
        <h1
          className="text-4xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {name}
        </h1>
        {role && (
          <p
            className="mt-2 text-lg"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {role}
          </p>
        )}
      </div>

      {/* Bio */}
      {bio && (
        <div
          className="prose mx-auto max-w-2xl"
          style={{ color: 'var(--color-text)' }}
          dangerouslySetInnerHTML={{ __html: bio }}
        />
      )}

      {/* Contact */}
      {(item.email || item.phone) && (
        <div
          className="mx-auto mt-8 max-w-2xl space-y-2"
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--spacing-md)',
          }}
        >
          <h2
            className="text-lg"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'İletişim' : 'Contact'}
          </h2>
          {item.email && (
            <p>
              <a
                href={`mailto:${item.email}`}
                style={{ color: 'var(--color-accent)' }}
              >
                {item.email}
              </a>
            </p>
          )}
          {item.phone && (
            <p>
              <a
                href={`tel:${item.phone}`}
                style={{ color: 'var(--color-accent)' }}
              >
                {item.phone}
              </a>
            </p>
          )}
        </div>
      )}

      {/* Social Links */}
      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <div className="mx-auto mt-6 max-w-2xl">
          <h2
            className="mb-3 text-lg"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'Sosyal Medya' : 'Social Media'}
          </h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(socialLinks).map(([platform, url]) =>
              url ? (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {platform}
                </a>
              ) : null
            )}
          </div>
        </div>
      )}
    </article>
  );
}

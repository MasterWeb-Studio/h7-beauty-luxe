import type { CertificateRow } from '@/lib/types/certificates';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLocaleValue(
  field: Record<string, string> | null | undefined,
  locale: string,
): string {
  if (!field) return '';
  return (
    field[locale] ??
    field['tr'] ??
    Object.values(field)[0] ??
    ''
  );
}

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

// ---------------------------------------------------------------------------
// CertificateGrid
// ---------------------------------------------------------------------------

interface GridProps {
  items: CertificateRow[];
  locale: string;
}

export function CertificateGrid({ items, locale }: GridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-10 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {locale === 'tr'
          ? 'Sertifika henüz eklenmemiş.'
          : 'No certificates yet.'}
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <CertificateCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CertificateCard
// ---------------------------------------------------------------------------

interface CardProps {
  item: CertificateRow;
  locale: string;
}

export function CertificateCard({ item, locale }: CardProps) {
  const title = getLocaleValue(item.title as Record<string, string>, locale);
  const slug = getLocaleValue(item.slug as Record<string, string>, locale);
  const expired = isExpired(item.expiry_date);

  return (
    <a
      href={`/${locale}/certificates/${slug}`}
      className="block overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
        border: '1px solid var(--color-border)',
        opacity: expired ? 0.65 : 1,
      }}
    >
      {/* Certificate image */}
      {item.image_url && (
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: '4/3', background: 'var(--color-bg-subtle)' }}
        >
          <img
            src={item.image_url}
            alt={title}
            className="h-full w-full object-contain p-4"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5 space-y-2">
        {/* Title */}
        <h3
          className="text-base leading-snug"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
            fontWeight: 600,
          }}
        >
          {title}
        </h3>

        {/* Issuer */}
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {item.issuer}
        </p>

        {/* Dates row */}
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>{formatDate(item.issue_date, locale)}</span>
          {item.expiry_date && (
            <>
              <span aria-hidden>·</span>
              <span
                style={{
                  color: expired
                    ? 'var(--color-danger, #dc2626)'
                    : 'var(--color-text-muted)',
                }}
              >
                {expired
                  ? locale === 'tr'
                    ? 'Süresi Doldu'
                    : 'Expired'
                  : formatDate(item.expiry_date, locale)}
              </span>
            </>
          )}
          {!item.expiry_date && (
            <>
              <span aria-hidden>·</span>
              <span style={{ color: 'var(--color-success, #16a34a)' }}>
                {locale === 'tr' ? 'Süresiz' : 'No Expiry'}
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// CertificateDetail
// ---------------------------------------------------------------------------

export interface CertificateDetailProps {
  item: CertificateRow;
  locale: string;
}

export function CertificateDetail({ item, locale }: CertificateDetailProps) {
  const title = getLocaleValue(item.title as Record<string, string>, locale);
  const description = getLocaleValue(
    item.description as Record<string, string> | null,
    locale,
  );
  const expired = isExpired(item.expiry_date);

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    creator: { '@type': 'Organization', name: item.issuer },
    dateCreated: item.issue_date,
    ...(item.expiry_date ? { expires: item.expiry_date } : {}),
    ...(description ? { description } : {}),
    ...(item.image_url ? { image: item.image_url } : {}),
  };

  return (
    <article
      className="container mx-auto max-w-4xl px-4 py-10 space-y-10"
      style={{ color: 'var(--color-text)' }}
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Certificate image */}
      {item.image_url && (
        <div
          className="flex justify-center"
          style={{
            background: 'var(--color-bg-muted)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--spacing-8, 2rem)',
          }}
        >
          <img
            src={item.image_url}
            alt={title}
            className="max-h-96 w-auto object-contain"
            style={{ borderRadius: 'var(--radius-sm)' }}
          />
        </div>
      )}

      {/* Title */}
      <header className="space-y-4">
        <h1
          className="text-4xl leading-tight"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
            fontWeight: 700,
          }}
        >
          {title}
        </h1>

        {/* Issuer meta */}
        <div
          className="flex flex-wrap items-center gap-4 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
              fontWeight: 600,
            }}
          >
            {item.issuer}
          </span>
          <span aria-hidden>·</span>
          <span>
            {locale === 'tr' ? 'Veriliş: ' : 'Issued: '}
            {formatDate(item.issue_date, locale)}
          </span>
          {item.expiry_date && (
            <>
              <span aria-hidden>·</span>
              <span
                style={{
                  color: expired
                    ? 'var(--color-danger, #dc2626)'
                    : 'var(--color-text-muted)',
                }}
              >
                {locale === 'tr' ? 'Geçerlilik: ' : 'Valid until: '}
                {formatDate(item.expiry_date, locale)}
                {expired
                  ? locale === 'tr'
                    ? ' (Süresi Doldu)'
                    : ' (Expired)'
                  : ''}
              </span>
            </>
          )}
          {!item.expiry_date && (
            <>
              <span aria-hidden>·</span>
              <span style={{ color: 'var(--color-success, #16a34a)' }}>
                {locale === 'tr' ? 'Süresiz Geçerli' : 'No Expiry'}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Certificate info box */}
      {(item.certificate_number) && (
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          style={{
            background: 'var(--color-bg-muted)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--spacing-6, 1.5rem)',
            border: '1px solid var(--color-border)',
          }}
        >
          {item.certificate_number && (
            <div className="space-y-1">
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {locale === 'tr' ? 'Sertifika No' : 'Certificate No'}
              </p>
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--color-text)',
                }}
              >
                {item.certificate_number}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <div
          className="prose max-w-none"
          style={{
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </article>
  );
}

import type { Metadata } from 'next';
import { NewsletterInline } from '@/components/sections/newsletter/NewsletterRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd } from '@/lib/json-ld';

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Bülten' : 'Newsletter';
  const description =
    locale === 'tr'
      ? 'E-posta bültenimize abone olun, güncel haberlerden ilk siz haberdar olun.'
      : 'Subscribe to our email newsletter and be the first to hear the latest news.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/newsletter`,
      languages: {
        tr: '/tr/newsletter',
        en: '/en/newsletter',
      },
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const title = locale === 'tr' ? 'Bülten' : 'Newsletter';
  const description =
    locale === 'tr'
      ? 'E-posta bültenimize abone olun, güncel haberlerden ilk siz haberdar olun.'
      : 'Subscribe to our email newsletter and be the first to hear the latest news.';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/newsletter`,
    description,
    locale,
  });

  return (
    <main>
      <JsonLdScript data={collection} />
      <section
        style={{
          background: 'var(--color-bg)',
          paddingBlock: 'var(--section-gap-y)',
        }}
      >
        <div className="container mx-auto px-4">
          <h1
            className="text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {locale === 'tr' ? 'Bülten' : 'Newsletter'}
          </h1>
          <p
            className="mt-4 max-w-xl text-base"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {locale === 'tr'
              ? 'E-posta bültenimize abone olun, güncel haberlerden ilk siz haberdar olun.'
              : 'Subscribe to our email newsletter and be the first to hear the latest news.'}
          </p>
        </div>
      </section>

      <NewsletterInline
        locale={locale}
        config={{ source: 'newsletter-page' }}
      />
    </main>
  );
}

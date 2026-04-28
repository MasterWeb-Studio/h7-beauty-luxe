import type { Metadata } from 'next';
import { fetchTeamList } from '@/lib/module-queries/team';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TeamGrid } from '@/components/sections/team/TeamRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Ekip' : 'Team';
  return {
    title,
    alternates: {
      canonical: `/${locale}/team`,
      languages: { tr: '/tr/team', en: '/en/team' },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await fetchTeamList(locale);
  const breadcrumbs = await getBreadcrumbs(`/${locale}/team`, locale);

  const title = locale === 'tr' ? 'Ekip' : 'Team';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/team`,
    locale,
    numberOfItems: items.length,
  });
  const breadcrumbLd = buildBreadcrumbListJsonLd(breadcrumbs);

  return (
    <main>
      <JsonLdScript data={collection} />
      <JsonLdScript data={breadcrumbLd} />
      <Breadcrumb items={breadcrumbs} locale={locale} />
      <section
        style={{
          background: 'var(--color-bg)',
          paddingBlock: 'var(--section-gap-y)',
        }}
      >
        <div className="container mx-auto px-4">
          <h1
            className="text-3xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {locale === 'tr' ? 'Ekip' : 'Team'}
          </h1>
          <TeamGrid items={items} locale={locale} />
        </div>
      </section>
    </main>
  );
}

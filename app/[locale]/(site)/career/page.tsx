import type { Metadata } from 'next';
import { fetchCareerList } from '@/lib/module-queries/career';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CareerGrid } from '@/components/sections/career/CareerRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Kariyer' : 'Careers';
  return {
    title,
    alternates: {
      canonical: `/${locale}/career`,
      languages: { tr: '/tr/career', en: '/en/career' },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await fetchCareerList(locale);
  const breadcrumbs = await getBreadcrumbs(`/${locale}/career`, locale);

  const title = locale === 'tr' ? 'Kariyer' : 'Careers';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/career`,
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
            {locale === 'tr' ? 'Kariyer' : 'Careers'}
          </h1>
          <CareerGrid items={items} locale={locale} />
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import { fetchServicesList } from '@/lib/module-queries/services';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ServicesGrid } from '@/components/sections/services/ServicesModuleRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Hizmetler' : 'Services';
  return {
    title,
    alternates: {
      canonical: `/${locale}/services`,
      languages: { tr: '/tr/services', en: '/en/services' },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await fetchServicesList(locale);
  const breadcrumbs = await getBreadcrumbs(`/${locale}/services`, locale);

  const title = locale === 'tr' ? 'Hizmetler' : 'Services';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/services`,
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
            {locale === 'tr' ? 'Hizmetler' : 'Services'}
          </h1>
          <ServicesGrid items={items} locale={locale} />
        </div>
      </section>
    </main>
  );
}

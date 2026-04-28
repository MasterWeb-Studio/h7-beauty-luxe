import type { Metadata } from 'next';
import { fetchCertificateList } from '@/lib/module-queries/certificates';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CertificateGrid } from '@/components/sections/certificates/CertificateRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Sertifikalar' : 'Certificates';
  return {
    title,
    alternates: {
      canonical: `/${locale}/certificates`,
      languages: {
        tr: '/tr/certificates',
        en: '/en/certificates',
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await fetchCertificateList(locale);
  const breadcrumbs = await getBreadcrumbs(`/${locale}/certificates`, locale);

  const title = locale === 'tr' ? 'Sertifikalar' : 'Certificates';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/certificates`,
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
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {locale === 'tr' ? 'Sertifikalar' : 'Certificates'}
          </h1>
          <CertificateGrid items={items} locale={locale} />
        </div>
      </section>
    </main>
  );
}

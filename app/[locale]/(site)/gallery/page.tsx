import type { Metadata } from 'next';
import { fetchGalleryList } from '@/lib/module-queries/gallery';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { GalleryGrid } from '@/components/sections/gallery/GalleryRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Galeri' : 'Gallery';
  return {
    title,
    alternates: {
      canonical: `/${locale}/gallery`,
      languages: { tr: '/tr/gallery', en: '/en/gallery' },
    },
  };
}

export default async function GalleryListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await fetchGalleryList(locale);
  const breadcrumbs = await getBreadcrumbs(`/${locale}/gallery`, locale);

  const title = locale === 'tr' ? 'Galeri' : 'Gallery';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/gallery`,
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
            {locale === 'tr' ? 'Galeri' : 'Gallery'}
          </h1>
          <GalleryGrid items={items} locale={locale} />
        </div>
      </section>
    </main>
  );
}

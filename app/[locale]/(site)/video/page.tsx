import type { Metadata } from 'next';
import { fetchVideoList } from '@/lib/module-queries/video';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { VideoGrid } from '@/components/sections/video/VideoRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Video' : 'Video';
  return {
    title,
    alternates: {
      canonical: `/${locale}/video`,
      languages: { tr: '/tr/video', en: '/en/video' },
    },
  };
}

export default async function VideoListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await fetchVideoList(locale);
  const breadcrumbs = await getBreadcrumbs(`/${locale}/video`, locale);

  const title = locale === 'tr' ? 'Video' : 'Video';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/video`,
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
            {locale === 'tr' ? 'Video' : 'Video'}
          </h1>
          <VideoGrid items={items} locale={locale} />
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import { fetchProjectsList } from '@/lib/module-queries/projects';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProjectsGrid } from '@/components/sections/projects/ProjectsRenderer';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Projeler' : 'Projects';
  return {
    title,
    description:
      locale === 'tr'
        ? 'Portfolio — tamamlanmış işler, müşteri referansları, case study'
        : 'Portfolio — completed work, client references, case studies',
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { tr: '/tr/projects', en: '/en/projects' },
    },
  };
}

export default async function ProjectsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await fetchProjectsList(locale);
  const breadcrumbs = await getBreadcrumbs(`/${locale}/projects`, locale);

  const title = locale === 'tr' ? 'Projeler' : 'Projects';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/projects`,
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
            {locale === 'tr' ? 'Projeler' : 'Projects'}
          </h1>
          <ProjectsGrid items={items} locale={locale} />
        </div>
      </section>
    </main>
  );
}

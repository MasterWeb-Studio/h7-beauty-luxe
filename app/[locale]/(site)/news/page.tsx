import type { Metadata } from 'next';
import { fetchNewsList, fetchNewsCategories } from '@/lib/module-queries/news';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { NewsGrid } from '@/components/sections/news/NewsRenderer';
import { NewsCategoryFilter } from '@/components/sections/news/NewsCategoryFilter';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Haberler' : 'News';
  return {
    title,
    alternates: {
      canonical: `/${locale}/news`,
      languages: { tr: '/tr/news', en: '/en/news' },
    },
  };
}

export default async function NewsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; tag?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};
  const categorySlug = sp.category ?? null;
  const tag = sp.tag ?? null;
  const page = sp.page ? parseInt(sp.page, 10) : 1;

  const [items, categories, breadcrumbs] = await Promise.all([
    fetchNewsList(locale, { categorySlug, tag, page, pageSize: 12 }),
    fetchNewsCategories(locale),
    getBreadcrumbs(`/${locale}/news`, locale),
  ]);

  const title = locale === 'tr' ? 'Haberler' : 'News';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/news`,
    locale,
    numberOfItems: items.total ?? items.data.length,
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
            className="mb-8 text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {locale === 'tr' ? 'Haberler' : 'News'}
          </h1>

          {categories.length > 0 && (
            <NewsCategoryFilter
              categories={categories}
              locale={locale}
              activeCategorySlug={categorySlug}
            />
          )}

          <NewsGrid
            items={items.data}
            locale={locale}
            emptyMessage={locale === 'tr' ? 'Henüz haber eklenmemiş.' : 'No news yet.'}
          />

          {items.totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label={locale === 'tr' ? 'Sayfalama' : 'Pagination'}
            >
              {Array.from({ length: items.totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/${locale}/news?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}${tag ? `&tag=${tag}` : ''}`}
                  className="flex h-9 w-9 items-center justify-center text-sm"
                  style={{
                    borderRadius: 'var(--radius-card)',
                    background: p === page ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                    color: p === page ? 'var(--color-primary-fg)' : 'var(--color-text)',
                  }}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}

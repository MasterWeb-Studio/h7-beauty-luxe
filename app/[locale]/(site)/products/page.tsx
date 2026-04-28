import type { Metadata } from 'next';
import { fetchProductList } from '@/lib/module-queries/products';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductGrid } from '@/components/sections/products/ProductRenderer';
import { ProductFilters } from '@/components/sections/products/ProductFilters';
import { JsonLdScript } from '@/components/JsonLdScript';
import { buildCollectionPageJsonLd, buildBreadcrumbListJsonLd } from '@/lib/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'tr' ? 'Ürünler' : 'Products';
  return {
    title,
    alternates: {
      canonical: `/${locale}/products`,
      languages: { tr: '/tr/products', en: '/en/products' },
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};

  const page = Number(sp['page'] ?? 1);
  const sort = (sp['sort'] as string) ?? 'newest';
  const categoryId = (sp['category'] as string) ?? undefined;
  const stockStatus = (sp['stock'] as string) ?? undefined;
  const priceMin = sp['price_min'] ? Number(sp['price_min']) : undefined;
  const priceMax = sp['price_max'] ? Number(sp['price_max']) : undefined;

  const { items, total } = await fetchProductList(locale, {
    page,
    sort,
    categoryId,
    stockStatus,
    priceMin,
    priceMax,
    pageSize: 20,
  });

  const breadcrumbs = await getBreadcrumbs(`/${locale}/products`, locale);

  // H7 Sprint 18 G3 — list JSON-LD (CollectionPage + BreadcrumbList).
  const title = locale === 'tr' ? 'Ürünler' : 'Products';
  const collection = buildCollectionPageJsonLd({
    name: title,
    url: `/${locale}/products`,
    locale,
    numberOfItems: total,
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
            {locale === 'tr' ? 'Ürünler' : 'Products'}
          </h1>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row">
            <aside className="w-full lg:w-64 shrink-0">
              <ProductFilters locale={locale} />
            </aside>

            <div className="flex-1">
              <ProductGrid
                items={items}
                locale={locale}
                total={total}
                page={page}
                pageSize={20}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

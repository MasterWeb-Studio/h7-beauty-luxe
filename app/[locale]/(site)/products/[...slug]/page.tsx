import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveProductPath } from '@/lib/module-queries/products';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductDetail, ProductGrid } from '@/components/sections/products/ProductRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveProductPath(locale, slug);

  if (resolved.type === 'not_found') {
    return { title: locale === 'tr' ? 'Bulunamadı' : 'Not Found' };
  }

  if (resolved.type === 'item') {
    const it = resolved.item;
    const name = it.name?.[locale] ?? it.name?.tr ?? Object.values(it.name ?? {})[0] ?? '';
    const description =
      it.short_description?.[locale] ??
      it.short_description?.tr ??
      Object.values(it.short_description ?? {})[0] ??
      undefined;
    const firstImage = it.images?.[0] ?? undefined;

    return {
      title: name,
      description,
      openGraph: firstImage
        ? { images: [{ url: firstImage }] }
        : undefined,
      alternates: {
        canonical: `/${locale}/products/${slug.join('/')}`,
        languages: {
          tr: `/tr/products/${slug.join('/')}`,
          en: `/en/products/${slug.join('/')}`,
        },
      },
    };
  }

  if (resolved.type === 'category') {
    const catName =
      resolved.category?.name?.[locale] ??
      resolved.category?.name?.tr ??
      slug[slug.length - 1] ??
      '';
    return {
      title: catName,
      alternates: {
        canonical: `/${locale}/products/${slug.join('/')}`,
        languages: {
          tr: `/tr/products/${slug.join('/')}`,
          en: `/en/products/${slug.join('/')}`,
        },
      },
    };
  }

  return { title: slug.join(' / ') };
}

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const resolved = await resolveProductPath(locale, slug);

  if (resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(
    `/${locale}/products/${slug.join('/')}`,
    locale,
  );

  const jsonLd =
    resolved.type === 'item'
      ? (() => {
          const it = resolved.item;
          const name =
            it.name?.[locale] ?? it.name?.tr ?? Object.values(it.name ?? {})[0] ?? '';
          const description =
            it.short_description?.[locale] ??
            it.short_description?.tr ??
            Object.values(it.short_description ?? {})[0] ??
            undefined;
          return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name,
            description,
            image: it.images?.[0] ? `/api/media/${it.images[0]}` : undefined,
            sku: it.slug?.[locale] ?? it.slug?.tr,
            offers: it.price
              ? {
                  '@type': 'Offer',
                  price: it.price,
                  priceCurrency: it.currency ?? 'TRY',
                  availability:
                    it.stock_status === 'in_stock'
                      ? 'https://schema.org/InStock'
                      : it.stock_status === 'low_stock'
                      ? 'https://schema.org/LimitedAvailability'
                      : it.stock_status === 'pre_order'
                      ? 'https://schema.org/PreOrder'
                      : 'https://schema.org/OutOfStock',
                }
              : undefined,
          };
        })()
      : null;

  return (
    <main>
      <Breadcrumb items={breadcrumbs} locale={locale} />

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      {resolved.type === 'item' ? (
        <ProductDetail item={resolved.item} locale={locale} />
      ) : (
        <section
          style={{
            background: 'var(--color-bg)',
            paddingBlock: 'var(--section-gap-y)',
          }}
        >
          <div className="container mx-auto px-4">
            {resolved.category && (
              <h1
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                {resolved.category.name?.[locale] ??
                  resolved.category.name?.tr ??
                  slug[slug.length - 1]}
              </h1>
            )}
            <ProductGrid
              items={resolved.items ?? []}
              locale={locale}
              total={resolved.items?.length ?? 0}
              page={1}
              pageSize={20}
            />
          </div>
        </section>
      )}
    </main>
  );
}

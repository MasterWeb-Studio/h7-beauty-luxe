import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveGalleryPath } from '@/lib/module-queries/gallery';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { GalleryDetail, GalleryGrid } from '@/components/sections/gallery/GalleryRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveGalleryPath(locale, slug);

  if (resolved.type === 'not_found') return { title: 'Bulunamadı' };

  if (resolved.type === 'item') {
    const it = resolved.item;
    const title = it.title?.[locale] ?? it.title?.tr ?? '';
    const description = it.description?.[locale] ?? it.description?.tr ?? undefined;
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/gallery/${slug.join('/')}`,
        languages: {
          tr: `/tr/gallery/${slug.join('/')}`,
          en: `/en/gallery/${slug.join('/')}`,
        },
      },
      openGraph: {
        title,
        description,
        images: it.cover_image ? [{ url: it.cover_image }] : [],
      },
    };
  }

  if (resolved.type === 'category') {
    const catName = resolved.category?.name?.[locale] ?? resolved.category?.name?.tr ?? slug[slug.length - 1];
    return {
      title: catName,
      alternates: {
        canonical: `/${locale}/gallery/${slug.join('/')}`,
        languages: {
          tr: `/tr/gallery/${slug.join('/')}`,
          en: `/en/gallery/${slug.join('/')}`,
        },
      },
    };
  }

  return { title: slug.join(' / ') };
}

export default async function GallerySlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const resolved = await resolveGalleryPath(locale, slug);

  if (resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(`/${locale}/gallery/${slug.join('/')}`, locale);

  const jsonLd =
    resolved.type === 'item'
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: resolved.item.title?.[locale] ?? resolved.item.title?.tr ?? '',
          description: resolved.item.description?.[locale] ?? resolved.item.description?.tr ?? undefined,
          url: `/${locale}/gallery/${slug.join('/')}`,
          datePublished: resolved.item.published_at ?? undefined,
          dateCreated: resolved.item.taken_at ?? undefined,
        })
      : null;

  return (
    <main>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <Breadcrumb items={breadcrumbs} locale={locale} />
      {resolved.type === 'item' ? (
        <GalleryDetail item={resolved.item} locale={locale} />
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
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
              >
                {resolved.category.name?.[locale] ?? resolved.category.name?.tr ?? ''}
              </h1>
            )}
            <GalleryGrid items={resolved.items ?? []} locale={locale} />
          </div>
        </section>
      )}
    </main>
  );
}

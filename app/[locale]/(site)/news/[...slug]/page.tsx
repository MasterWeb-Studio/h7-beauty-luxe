import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveNewsPath } from '@/lib/module-queries/news';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { NewsDetail, NewsGrid } from '@/components/sections/news/NewsRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveNewsPath(locale, slug);

  if (resolved.type === 'not_found') {
    return { title: locale === 'tr' ? 'Bulunamadi' : 'Not Found' };
  }

  if (resolved.type === 'item' && resolved.item) {
    const item = resolved.item;
    const title =
      item.title?.[locale] ??
      item.title?.tr ??
      Object.values(item.title ?? {})[0] ??
      '';
    const description =
      item.excerpt?.[locale] ??
      item.excerpt?.tr ??
      (item.excerpt ? Object.values(item.excerpt)[0] : undefined) ??
      undefined;
    const heroImageUrl = item.hero_image ? `/api/media/${item.hero_image}` : undefined;
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/news/${slug.join('/')}`,
        languages: {
          tr: `/tr/news/${item.slug?.tr ?? slug.join('/')}`,
          en: `/en/news/${item.slug?.en ?? slug.join('/')}`,
        },
      },
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: item.published_at,
        authors: item.author ? [item.author] : undefined,
        images: heroImageUrl ? [{ url: heroImageUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: heroImageUrl ? [heroImageUrl] : undefined,
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
        canonical: `/${locale}/news/${slug.join('/')}`,
        languages: {
          tr: `/tr/news/${slug.join('/')}`,
          en: `/en/news/${slug.join('/')}`,
        },
      },
    };
  }

  return { title: slug.join(' / ') };
}

export default async function NewsSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const resolved = await resolveNewsPath(locale, slug);

  if (resolved.type === 'not_found') {
    notFound();
  }

  const breadcrumbs = await getBreadcrumbs(`/${locale}/news/${slug.join('/')}`, locale);

  if (resolved.type === 'item' && resolved.item) {
    const item = resolved.item;
    const title =
      item.title?.[locale] ??
      item.title?.tr ??
      Object.values(item.title ?? {})[0] ??
      '';
    const excerpt =
      item.excerpt?.[locale] ??
      item.excerpt?.tr ??
      (item.excerpt ? Object.values(item.excerpt)[0] : undefined) ??
      undefined;
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description: excerpt,
      datePublished: item.published_at,
      dateModified: item.updated_at,
      author: item.author ? { '@type': 'Person', name: item.author } : undefined,
      image: item.hero_image ? `/api/media/${item.hero_image}` : undefined,
    };
    return (
      <main>
        <Breadcrumb items={breadcrumbs} locale={locale} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NewsDetail item={item} locale={locale} relatedItems={resolved.related ?? []} />
      </main>
    );
  }

  if (resolved.type === 'category') {
    const catName =
      resolved.category?.name?.[locale] ??
      resolved.category?.name?.tr ??
      slug[slug.length - 1] ??
      '';
    return (
      <main>
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
              {catName}
            </h1>
            <NewsGrid
              items={resolved.items ?? []}
              locale={locale}
              emptyMessage={locale === 'tr' ? 'Bu kategoride henuz haber yok.' : 'No news in this category yet.'}
            />
          </div>
        </section>
      </main>
    );
  }

  notFound();
}

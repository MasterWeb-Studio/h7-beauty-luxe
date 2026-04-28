import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveServicesPath } from '@/lib/module-queries/services';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ServicesDetail, ServicesGrid } from '@/components/sections/services/ServicesModuleRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveServicesPath(locale, slug);
  if (resolved.type === 'not_found') return { title: 'Bulunamadı' };
  if (resolved.type === 'item') {
    const it = resolved.item;
    const title = it.title?.[locale] ?? it.title?.tr ?? '';
    const description = it.short_description?.[locale] ?? it.short_description?.tr ?? undefined;
    return {
      title: `${title}`,
      description,
      alternates: {
        canonical: `/${locale}/services/${slug.join('/')}`,
        languages: {
          tr: `/tr/services/${slug.join('/')}`,
          en: `/en/services/${slug.join('/')}`,
        },
      },
      openGraph: {
        title,
        description: description ?? '',
        images: it.image ? [{ url: it.image }] : [],
      },
    };
  }
  return { title: slug.join(' / ') };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const resolved = await resolveServicesPath(locale, slug);
  if (resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(
    `/${locale}/services/${slug.join('/')}`,
    locale,
  );

  const jsonLd =
    resolved.type === 'item'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: resolved.item.title?.[locale] ?? resolved.item.title?.tr ?? '',
          description:
            resolved.item.short_description?.[locale] ??
            resolved.item.short_description?.tr ??
            '',
          image: resolved.item.image ?? undefined,
          url: `/${locale}/services/${slug.join('/')}`,
        }
      : null;

  return (
    <main>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Breadcrumb items={breadcrumbs} locale={locale} />
      {resolved.type === 'item' ? (
        <ServicesDetail item={resolved.item} locale={locale} />
      ) : (
        <ServicesGrid items={resolved.items ?? []} locale={locale} />
      )}
    </main>
  );
}

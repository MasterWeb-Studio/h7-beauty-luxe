import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveCareerPath } from '@/lib/module-queries/career';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CareerDetail, CareerGrid } from '@/components/sections/career/CareerRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveCareerPath(locale, slug);
  if (resolved.type === 'not_found') return { title: 'Bulunamadı' };
  if (resolved.type === 'item') {
    const it = resolved.item;
    const title = it.title?.[locale] ?? it.title?.tr ?? '';
    const description =
      typeof it.description === 'object'
        ? (it.description?.[locale] ?? it.description?.tr ?? undefined)
        : undefined;
    return {
      title: `${title}`,
      description: description ? String(description).replace(/<[^>]*>/g, '').slice(0, 160) : undefined,
      alternates: {
        canonical: `/${locale}/career/${slug.join('/')}`,
        languages: {
          tr: `/tr/career/${slug.join('/')}`,
          en: `/en/career/${slug.join('/')}`,
        },
      },
      other: {
        'application/ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title,
          description: description ?? '',
          employmentType: it.employment_type ?? 'FULL_TIME',
          jobLocation: it.location
            ? { '@type': 'Place', name: it.location }
            : undefined,
          datePosted: it.published_at ?? it.created_at,
          hiringOrganization: { '@type': 'Organization' },
        }),
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
  const resolved = await resolveCareerPath(locale, slug);
  if (resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(
    `/${locale}/career/${slug.join('/')}`,
    locale,
  );

  return (
    <main>
      <Breadcrumb items={breadcrumbs} locale={locale} />
      {resolved.type === 'item' ? (
        <CareerDetail item={resolved.item} locale={locale} />
      ) : (
        <CareerGrid items={resolved.items ?? []} locale={locale} />
      )}
    </main>
  );
}

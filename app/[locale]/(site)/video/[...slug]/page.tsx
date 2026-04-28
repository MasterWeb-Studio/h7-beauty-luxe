import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveVideoPath } from '@/lib/module-queries/video';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { VideoGrid } from '@/components/sections/video/VideoRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveVideoPath(locale, slug);
  if (resolved.type === 'not_found') return { title: 'Bulunamadı' };
  if (resolved.type === 'item') {
    const it = resolved.item;
    const title = it.title?.[locale] ?? it.title?.tr ?? Object.values(it.title ?? {})[0] ?? '';
    const rawDesc = it.description?.[locale] ?? it.description?.tr ?? null;
    const description = rawDesc ? rawDesc.replace(/<[^>]*>/g, '').slice(0, 500) : undefined;
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/video/${slug.join('/')}`,
      },
    };
  }
  return { title: slug.join(' / ') };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const resolved = await resolveVideoPath(locale, slug);
  if (resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(
    `/${locale}/video/${slug.join('/')}`,
    locale,
  );

  return (
    <main>
      <Breadcrumb items={breadcrumbs} locale={locale} />
      {resolved.type === 'item' ? (
        <VideoGrid items={[resolved.item]} locale={locale} />
      ) : (
        <VideoGrid items={resolved.items ?? []} locale={locale} />
      )}
    </main>
  );
}

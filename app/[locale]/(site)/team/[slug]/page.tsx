import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveTeamPath } from '@/lib/module-queries/team';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TeamDetail } from '@/components/sections/team/TeamRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveTeamPath(locale, slug);
  if (!resolved || resolved.type === 'not_found') return { title: 'Bulunamadı' };

  const item = resolved.item;
  const name = item.name ?? '';
  const role =
    (item.role as Record<string, string> | null)?.[locale] ??
    (item.role as Record<string, string> | null)?.tr ??
    '';
  const bioRaw =
    (item.bio as Record<string, string> | null)?.[locale] ??
    (item.bio as Record<string, string> | null)?.tr ??
    undefined;
  const description = bioRaw ? bioRaw.replace(/<[^>]*>/g, '').slice(0, 160) : undefined;

  const slugLocale =
    (item.slug as Record<string, string>)?.[locale] ??
    (item.slug as Record<string, string>)?.tr ??
    slug;

  return {
    title: `${name}${role ? ` — ${role}` : ''}`,
    description,
    alternates: {
      canonical: `/${locale}/team/${slugLocale}`,
      languages: {
        tr: `/tr/team/${(item.slug as Record<string, string>)?.tr ?? slug}`,
        en: `/en/team/${(item.slug as Record<string, string>)?.en ?? slug}`,
      },
    },
    openGraph: {
      title: `${name}${role ? ` — ${role}` : ''}`,
      description,
      images: item.photo ? [{ url: item.photo }] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolved = await resolveTeamPath(locale, slug);
  if (!resolved || resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(`/${locale}/team/${slug}`, locale);

  const item = resolved.item;
  const role =
    (item.role as Record<string, string> | null)?.[locale] ??
    (item.role as Record<string, string> | null)?.tr ??
    undefined;
  const bioHtml =
    (item.bio as Record<string, string> | null)?.[locale] ??
    (item.bio as Record<string, string> | null)?.tr ??
    undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: item.name ?? '',
    jobTitle: role,
    description: bioHtml ? bioHtml.replace(/<[^>]*>/g, '').slice(0, 500) : undefined,
    image: item.photo || undefined,
    email: item.email || undefined,
    telephone: item.phone || undefined,
  };

  return (
    <main>
      <Breadcrumb items={breadcrumbs} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TeamDetail item={resolved.item} locale={locale} />
    </main>
  );
}

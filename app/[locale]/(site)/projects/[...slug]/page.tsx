import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveProjectsPath } from '@/lib/module-queries/projects';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import {
  ProjectsDetail,
  ProjectsGrid,
} from '@/components/sections/projects/ProjectsRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveProjectsPath(locale, slug);

  if (resolved.type === 'not_found') {
    return { title: locale === 'tr' ? 'Bulunamadı' : 'Not Found' };
  }

  if (resolved.type === 'item') {
    const item = resolved.item;
    const title = item.title?.[locale] ?? item.title?.tr ?? '';
    const description =
      item.short_description?.[locale] ?? item.short_description?.tr ?? undefined;
    const clientName = item.client_name ?? '';
    const siteName = locale === 'tr' ? 'Site' : 'Site';
    return {
      title: clientName ? `${title} — ${clientName} | ${siteName}` : title,
      description: description || undefined,
      alternates: {
        canonical: `/${locale}/projects/${slug.join('/')}`,
        languages: {
          tr: `/tr/projects/${slug.join('/')}`,
          en: `/en/projects/${slug.join('/')}`,
        },
      },
      openGraph: {
        title: clientName ? `${title} — ${clientName}` : title,
        description: description || undefined,
        type: 'article',
      },
    };
  }

  if (resolved.type === 'category') {
    const catName =
      resolved.category?.name?.[locale] ?? resolved.category?.name?.tr ?? slug[slug.length - 1];
    return {
      title: catName,
      alternates: {
        canonical: `/${locale}/projects/${slug.join('/')}`,
        languages: {
          tr: `/tr/projects/${slug.join('/')}`,
          en: `/en/projects/${slug.join('/')}`,
        },
      },
    };
  }

  return { title: slug.join(' / ') };
}

export default async function ProjectsSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const resolved = await resolveProjectsPath(locale, slug);

  if (resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(
    `/${locale}/projects/${slug.join('/')}`,
    locale,
  );

  const jsonLd =
    resolved.type === 'item'
      ? (() => {
          const it = resolved.item;
          const name =
            it.title?.[locale] ?? it.title?.tr ?? Object.values(it.title ?? {})[0] ?? '';
          const description =
            it.short_description?.[locale] ??
            it.short_description?.tr ??
            Object.values(it.short_description ?? {})[0] ??
            undefined;
          return {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name,
            description,
            image: it.cover_image ? `/api/media/${it.cover_image}` : undefined,
            dateCreated: it.completion_date,
            datePublished: it.published_at,
            creator: it.client_name
              ? { '@type': 'Organization', name: it.client_name }
              : undefined,
            sameAs: it.project_url || undefined,
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
        <ProjectsDetail item={resolved.item} locale={locale} />
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
            <ProjectsGrid items={resolved.items ?? []} locale={locale} />
          </div>
        </section>
      )}
    </main>
  );
}

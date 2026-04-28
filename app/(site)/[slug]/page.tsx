import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { content as staticContent } from '../../../lib/content';
import { getContent } from '../../../lib/content-loader';
import { SectionRenderer } from '../../../components/SectionRenderer';

type Params = { slug: string };

// generateStaticParams build-time çalışır; Supabase'e bağlanamayabilir.
// Bu yüzden build manifest'ini STATİK content.ts üzerinden kuruyoruz.
// Admin runtime'da yeni sayfa eklerse dynamicParams=true devreye girer.
export function generateStaticParams(): Array<Params> {
  return staticContent.pages
    .filter((page) => page.slug !== 'home')
    .map((page) => ({ slug: page.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const page = content.pages.find((p) => p.slug === slug);
  if (!page) return {};
  const locale = content.meta.language ?? 'tr';
  // Sprint 22.5: layout template bypass + canonical + hreflang.
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: {
      canonical: `/${slug}`,
      languages: { [locale]: `/${slug}` },
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (slug === 'home') notFound();

  const content = await getContent();
  const page = content.pages.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <>
      {page.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </>
  );
}

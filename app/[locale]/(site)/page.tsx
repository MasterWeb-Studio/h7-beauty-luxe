import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent } from '../../../lib/content-loader';
import { SectionRenderer } from '../../../components/SectionRenderer';
import { JsonLdScript } from '../../../components/JsonLdScript';
import { buildWebsiteJsonLd, buildOrganizationJsonLd } from '../../../lib/json-ld';

// Sprint 22.5 borç temizliği: locale-prefix'li root URL (`/tr`, `/en`)
// 404 dönüyordu çünkü `app/[locale]/(site)/` altında `page.tsx` yoktu;
// sadece modül klasörleri vardı. Bu dosya home content'i locale-aware
// render eder. Legacy `app/(site)/page.tsx` ile aynı render mantığı,
// canonical URL `/{locale}/` ve hreflang locale-spesifik.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getContent();
  const home = content.pages.find((p) => p.slug === 'home');
  if (!home) return {};
  return {
    title: { absolute: home.metaTitle },
    description: home.metaDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { tr: '/tr', en: '/en' },
    },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'tr' && locale !== 'en') notFound();

  const content = await getContent();
  const home = content.pages.find((p) => p.slug === 'home');
  if (!home) notFound();

  const siteName = content.meta.companyName;
  const description = content.meta.description;
  const website = buildWebsiteJsonLd({ name: siteName, description, locale });
  const organization = buildOrganizationJsonLd({ name: siteName, description });

  return (
    <>
      <JsonLdScript data={website} />
      <JsonLdScript data={organization} />
      {home.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} locale={locale} />
      ))}
    </>
  );
}

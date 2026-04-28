import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveCertificatePath } from '@/lib/module-queries/certificates';
import { getBreadcrumbs } from '@/lib/breadcrumb';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import {
  CertificateDetail,
  CertificateGrid,
} from '@/components/sections/certificates/CertificateRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveCertificatePath(locale, slug);

  if (resolved.type === 'not_found') return { title: 'Bulunamadı' };

  if (resolved.type === 'item') {
    const it = resolved.item;
    const title =
      it.title?.[locale as keyof typeof it.title] ??
      it.title?.tr ??
      '';
    const description =
      it.description?.[locale as keyof typeof it.description] ??
      it.description?.tr ??
      undefined;
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/certificates/${slug.join('/')}`,
        languages: {
          tr: `/tr/certificates/${slug.join('/')}`,
          en: `/en/certificates/${slug.join('/')}`,
        },
      },
      openGraph: {
        title,
        description,
        images: it.image_url ? [{ url: it.image_url }] : [],
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
  const resolved = await resolveCertificatePath(locale, slug);

  if (resolved.type === 'not_found') notFound();

  const breadcrumbs = await getBreadcrumbs(
    `/${locale}/certificates/${slug.join('/')}`,
    locale,
  );

  const jsonLd =
    resolved.type === 'item'
      ? (() => {
          const it = resolved.item;
          const name =
            it.title?.[locale as keyof typeof it.title] ??
            it.title?.tr ??
            '';
          const descHtml =
            it.description?.[locale as keyof typeof it.description] ??
            it.description?.tr ??
            undefined;
          return {
            '@context': 'https://schema.org',
            '@type': 'EducationalOccupationalCredential',
            name,
            description: descHtml
              ? descHtml.replace(/<[^>]*>/g, '').slice(0, 500)
              : undefined,
            image: it.image_url || undefined,
            credentialCategory: 'Certification',
            recognizedBy: it.issuer
              ? { '@type': 'Organization', name: it.issuer }
              : undefined,
            dateCreated: it.issue_date,
            validUntil: it.expiry_date,
            identifier: it.certificate_number || undefined,
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
        <CertificateDetail item={resolved.item} locale={locale} />
      ) : (
        <CertificateGrid items={resolved.items ?? []} locale={locale} />
      )}
    </main>
  );
}

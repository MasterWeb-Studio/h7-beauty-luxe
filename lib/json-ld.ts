// H7 Sprint 18 G3 — JSON-LD builder helper
//
// home + list sayfalarında structured data üretimini tek yerden yönetir.
// Detail sayfalarındaki ItemSchema Sprint 7'de eklendi (per-modül SKILL
// pattern'i); burası complementary: site-wide (WebSite, Organization) +
// list-level (CollectionPage) + navigation (BreadcrumbList).
//
// Kurallar:
//  - `undefined` alanlar JSON.stringify'da düşer → optional chaining yeterli.
//  - URL'ler absolute olmalı; verilmezse relative kabul.
//  - Her builder dönen obje zaten `@context` + `@type` dahil — çağıran yere
//    doğrudan `dangerouslySetInnerHTML` ile geçirilir.

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface WebsiteJsonLdInput {
  name: string;
  url?: string;
  description?: string;
  locale?: string;
}

export function buildWebsiteJsonLd(input: WebsiteJsonLdInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    ...(input.url ? { url: input.url } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.locale ? { inLanguage: input.locale } : {}),
  };
}

export interface OrganizationJsonLdInput {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
}

export function buildOrganizationJsonLd(
  input: OrganizationJsonLdInput
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    ...(input.url ? { url: input.url } : {}),
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.description ? { description: input.description } : {}),
  };
}

export interface CollectionPageJsonLdInput {
  name: string;
  url?: string;
  description?: string;
  locale?: string;
  /** Listede görünen item sayısı (total, page yok). */
  numberOfItems?: number;
}

export function buildCollectionPageJsonLd(
  input: CollectionPageJsonLdInput
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    ...(input.url ? { url: input.url } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.locale ? { inLanguage: input.locale } : {}),
    ...(typeof input.numberOfItems === 'number'
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: input.numberOfItems,
          },
        }
      : {}),
  };
}

export function buildBreadcrumbListJsonLd(
  items: BreadcrumbItem[],
  baseUrl?: string
): Record<string, unknown> | null {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: baseUrl ? `${baseUrl.replace(/\/$/, '')}${item.href}` : item.href }
        : {}),
    })),
  };
}

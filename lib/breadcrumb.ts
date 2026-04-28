// H6 Sprint 1 Gün 13 — Breadcrumb helper (placeholder).
// Sprint 2'de spec-aware getBreadcrumbs (module + category resolve) gelecek.
// Şimdilik path segment'lerinden basit breadcrumb üretiyor.

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const LOCALE_LABELS: Record<string, Record<string, string>> = {
  tr: { products: 'Ürünler', services: 'Hizmetler', about: 'Hakkımızda', contact: 'İletişim' },
  en: { products: 'Products', services: 'Services', about: 'About', contact: 'Contact' },
};

export async function getBreadcrumbs(
  pathname: string,
  locale: string
): Promise<BreadcrumbItem[]> {
  const segments = pathname
    .replace(/^\//, '')
    .split('/')
    .filter((s) => s && s !== locale);

  const home = locale === 'tr' ? 'Anasayfa' : 'Home';
  const items: BreadcrumbItem[] = [{ label: home, href: `/${locale}` }];

  let acc = `/${locale}`;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    acc += `/${seg}`;
    const labelMap = LOCALE_LABELS[locale] ?? LOCALE_LABELS.tr!;
    const label = labelMap[seg] ?? decodeURIComponent(seg);
    const isLast = i === segments.length - 1;
    items.push({ label, href: isLast ? undefined : acc });
  }

  return items;
}

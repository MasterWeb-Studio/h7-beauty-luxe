// Auto-migrated from packages/shared/src/types/products.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface ProductRow {
  id: string;
  tenant_id: string;
  project_id: string;

  // Kategori (spec.categories.enabled = true)
  category_id: string | null;

  // Locale-aware alanlar
  slug: LocaleString;
  name: LocaleString;
  short_description: LocaleString;
  description: LocaleString;
  attributes: LocaleString | null;

  // Scalar alanlar
  price: number | null;
  currency: 'TRY' | 'USD' | 'EUR' | 'GBP' | null;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  is_bestseller: boolean;

  // Media
  images: string[];

  // Yayın
  published_at: string | null;

  // Audit
  created_at: string;
  updated_at: string;
}

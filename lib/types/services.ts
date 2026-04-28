// Auto-migrated from packages/shared/src/types/services.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface ServicesRow {
  id: string;
  tenant_id: string;
  project_id: string;
  slug: LocaleString;
  title: LocaleString;
  short_description: LocaleString | null;
  description: LocaleString | null;
  icon: string | null;
  image: string | null;
  features: Record<string, string[]> | null;
  is_featured: boolean;
  sort_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

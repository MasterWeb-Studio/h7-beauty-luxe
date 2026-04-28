// Auto-migrated from packages/shared/src/types/contact-cards.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface ContactCardRow {
  id: string;
  tenant_id: string;
  project_id: string;
  title: LocaleString;
  value: LocaleString;
  icon: string | null;
  link_url: string | null;
  sort_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

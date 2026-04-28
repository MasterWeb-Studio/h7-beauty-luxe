// Auto-migrated from packages/shared/src/types/references.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface ReferencesRow {
  id: string;
  tenant_id: string;
  project_id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  description: LocaleString | null;
  sort_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

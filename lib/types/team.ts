// Auto-migrated from packages/shared/src/types/team.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface TeamRow {
  id: string;
  tenant_id: string;
  project_id: string;
  slug: LocaleString;
  name: string;
  role: LocaleString;
  bio: LocaleString | null;
  photo: string;
  email: string | null;
  phone: string | null;
  social_links: Record<string, unknown> | null;
  sort_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

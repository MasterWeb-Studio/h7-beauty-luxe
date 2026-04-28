// Auto-migrated from packages/shared/src/types/newsletter.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface NewsletterRow {
  id: string;
  tenant_id: string;
  project_id: string;
  email: string;
  subscribed_at: string;
  locale: string | null;
  source: string | null;
  confirmed: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

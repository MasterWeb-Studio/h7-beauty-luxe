// Auto-migrated from packages/shared/src/types/certificates.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface CertificateRow {
  id: string;
  tenant_id: string;
  project_id: string;
  slug: LocaleString;
  title: LocaleString;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  certificate_number: string | null;
  image_url: string;
  description: LocaleString | null;
  sort_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

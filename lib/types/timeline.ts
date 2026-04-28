// Auto-migrated from packages/shared/src/types/timeline.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface TimelineRow {
  id: string;
  tenant_id: string;
  project_id: string;
  year: number;
  month: number | null;
  title: LocaleString;
  description: LocaleString | null;
  icon: string | null;
  image: string | null;
  sort_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

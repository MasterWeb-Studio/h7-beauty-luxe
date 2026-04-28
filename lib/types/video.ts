// Auto-migrated from packages/shared/src/types/video.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
export interface VideoRow {
  id: string;
  tenant_id: string;
  project_id: string;
  title: LocaleString;
  description: LocaleString | null;
  video_url: string;
  thumbnail: string | null;
  duration: string | null;
  is_featured: boolean;
  sort_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

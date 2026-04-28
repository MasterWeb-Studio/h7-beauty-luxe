// Auto-migrated from packages/shared/src/types/gallery.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
/**
 * GalleryRow — module_gallery tablosunun TypeScript tipi.
 * Versiyon: 1.0.0 | Since: 2026-04-20
 */
export interface GalleryRow {
  /** PK — gen_random_uuid() */
  id: string;

  /** Tenant referansı */
  tenant_id: string;

  /** Proje referansı */
  project_id: string;

  /** Kategori referansı — NULL = kategorisiz */
  category_id: string | null;

  /** URL slug — locale-aware */
  slug: LocaleString;

  /** Galeri başlığı — locale-aware */
  title: LocaleString;

  /** Açıklama — locale-aware, opsiyonel */
  description: LocaleString | null;

  /** Kapak görseli — media_library UUID */
  cover_image: string;

  /** Galeri görselleri — media_library UUID dizisi */
  images: string[];

  /** Çekim tarihi — opsiyonel (ISO date string) */
  taken_at: string | null;

  /** NULL = taslak, dolu = yayında */
  published_at: string | null;

  /** Oluşturulma zamanı */
  created_at: string;

  /** Son güncelleme zamanı */
  updated_at: string;
}

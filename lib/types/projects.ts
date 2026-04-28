// Auto-migrated from packages/shared/src/types/projects.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
/**
 * ProjectsRow
 * Tablo: module_projects
 * Versiyon: 1.0.0
 */
export interface ProjectsRow {
  /** Birincil anahtar — DB tarafından üretilir */
  id: string;

  /** Kiracı referansı */
  tenant_id: string;

  /** Proje referansı */
  project_id: string;

  /** Kategori — NULL = kategorisiz */
  category_id: string | null;

  /** NULL = taslak, dolu = yayında */
  published_at: string | null;

  /** URL slug — locale-aware */
  slug: LocaleString;

  /** Proje Başlığı — locale-aware */
  title: LocaleString;

  /** Özet — locale-aware, opsiyonel */
  short_description: LocaleString;

  /** Detaylı Anlatım (richtext) — locale-aware, opsiyonel */
  description: LocaleString;

  /** Müşteri / Firma Adı */
  client_name: string | null;

  /** Müşteri Logosu (media_library UUID) */
  client_logo: string | null;

  /** Tamamlanma Tarihi */
  completion_date: string | null;

  /** Proje Linki */
  project_url: string | null;

  /** Etiketler — locale-aware string array map */
  tags: Record<string, string[]>;

  /** Kapak Görseli (media_library UUID) — zorunlu */
  cover_image: string;

  /** Galeri görselleri (media_library UUID dizisi) */
  gallery_images: string[];

  /** Öne Çıkarılmış */
  is_featured: boolean;

  /** Oluşturulma zamanı */
  created_at: string;

  /** Güncellenme zamanı */
  updated_at: string;
}

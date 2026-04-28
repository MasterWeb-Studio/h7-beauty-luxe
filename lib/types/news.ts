// Auto-migrated from packages/shared/src/types/news.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
/**
 * NewsRow
 * Tablo: module_news
 * Versiyon: 1.0.0
 * Otomatik üretildi — elle düzenleme.
 */
export interface NewsRow {
  /** Sistem: birincil anahtar */
  id: string;

  /** Sistem: kiracı referansı */
  tenant_id: string;

  /** Sistem: proje referansı */
  project_id: string;

  /** Kategori referansı (spec.categories.enabled = true) */
  category_id: string | null;

  /** URL slug — locale-aware */
  slug: LocaleString;

  /** Başlık — locale-aware */
  title: LocaleString;

  /** Özet — locale-aware, opsiyonel */
  excerpt: LocaleString | null;

  /** İçerik (zengin metin) — locale-aware */
  content: LocaleString;

  /** Yazar adı — locale-bağımsız */
  author: string | null;

  /** Etiketler — locale-aware string dizisi (jsonb) */
  tags: Record<string, string[]> | null;

  /** Kapak görseli — media_library UUID */
  hero_image: string;

  /** Galeri — media UUID dizisi */
  gallery: string[];

  /** Yayın tarihi — NULL = taslak */
  published_at: string;

  /** Sistem: oluşturulma zamanı */
  created_at: string;

  /** Sistem: güncellenme zamanı */
  updated_at: string;
}

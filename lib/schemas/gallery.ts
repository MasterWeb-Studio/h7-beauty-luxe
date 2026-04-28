// Auto-migrated from packages/shared/src/schemas/gallery.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
/**
 * GalleryInsertSchema — module_gallery insert validation.
 * Versiyon: 1.0.0 | Since: 2026-04-20
 *
 * id, created_at, updated_at DB tarafında üretilir — schema'ya dahil değil.
 */
export const GalleryInsertSchema = z.object({
  /** Tenant referansı */
  tenant_id: z
    .string()
    .uuid('Geçerli bir tenant UUID giriniz')
    .describe('Tenant ID'),

  /** Proje referansı */
  project_id: z
    .string()
    .uuid('Geçerli bir proje UUID giriniz')
    .describe('Proje ID'),

  /** Kategori referansı — opsiyonel */
  category_id: z
    .string()
    .uuid('Geçerli bir kategori UUID giriniz')
    .nullable()
    .optional()
    .describe('Kategori'),

  /** URL slug — locale-aware, zorunlu, en az bir locale dolu olmalı */
  slug: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => x.trim().length > 0),
    { message: 'Slug en az bir dilde dolu olmalıdır' }
  ).describe('URL slug — TR + EN zorunlu'),

  /** Galeri başlığı — locale-aware, zorunlu */
  title: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => x.trim().length > 0),
    { message: 'Başlık en az bir dilde dolu olmalıdır' }
  ).describe('Galeri başlığı — TR + EN zorunlu'),

  /** Açıklama — locale-aware, opsiyonel */
  description: LocaleStringSchema.nullable().optional().describe('Açıklama'),

  /** Kapak görseli — media_library UUID, zorunlu */
  cover_image: z
    .string()
    .min(1, 'Kapak görseli boş olamaz')
    .describe('Kapak Görseli — liste sayfasında gösterilir'),

  /** Galeri görselleri — media_library UUID dizisi, zorunlu */
  images: z
    .array(z.string().min(1, 'Görsel UUID boş olamaz'))
    .min(1, 'En az bir galeri görseli eklenmelidir')
    .describe('Galeri Görselleri — 3-30 arası önerilir'),

  /** Çekim tarihi — opsiyonel (ISO date string: YYYY-MM-DD) */
  taken_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih YYYY-MM-DD formatında olmalıdır')
    .nullable()
    .optional()
    .describe('Çekim Tarihi'),

  /** Yayın tarihi — NULL = taslak */
  published_at: z
    .string()
    .datetime({ message: 'Geçerli bir ISO datetime giriniz' })
    .nullable()
    .optional()
    .describe('Yayın Tarihi — NULL = taslak, dolu = yayında'),
});

/**
 * GalleryUpdateSchema — tüm alanlar opsiyonel (partial insert).
 */
export const GalleryUpdateSchema = GalleryInsertSchema.partial();

/** Insert tipi */
export type GalleryInsert = z.infer<typeof GalleryInsertSchema>;

/** Update tipi */
export type GalleryUpdate = z.infer<typeof GalleryUpdateSchema>;

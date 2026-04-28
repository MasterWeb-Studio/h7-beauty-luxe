// Auto-migrated from packages/shared/src/schemas/news.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
/**
 * NewsInsertSchema / NewsUpdateSchema
 * Tablo: module_news
 * Versiyon: 1.0.0
 * Otomatik üretildi — elle düzenleme.
 *
 * NOT: id, created_at, updated_at DB tarafında üretilir — Insert'e dahil değil.
 */

export const NewsInsertSchema = z.object({
  // ── Sistem alanları (client tarafından sağlanır) ──────────
  tenant_id: z
    .string()
    .uuid('Geçerli bir tenant_id UUID giriniz')
    .describe('Kiracı kimliği'),

  project_id: z
    .string()
    .uuid('Geçerli bir project_id UUID giriniz')
    .describe('Proje kimliği'),

  // ── Kategori ──────────────────────────────────────────────
  category_id: z
    .string()
    .uuid('Geçerli bir kategori UUID giriniz')
    .nullable()
    .optional()
    .describe('Kategori referansı'),

  // ── Modül alanları ────────────────────────────────────────

  // slug | localeAware: true | required: true
  slug: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Slug en az bir dilde dolu olmalıdır' }
    )
    .describe('URL slug — TR + EN zorunlu'),

  // title | localeAware: true | required: true
  title: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Başlık boş olamaz' }
    )
    .describe('Makale başlığı — TR + EN zorunlu'),

  // excerpt | localeAware: true | required: false
  excerpt: LocaleStringSchema
    .nullable()
    .optional()
    .describe('Özet — liste ve SEO meta description için'),

  // content | localeAware: true | required: true
  content: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'İçerik boş olamaz' }
    )
    .describe('Zengin metin içerik — TR + EN zorunlu'),

  // author | localeAware: false | required: false
  author: z
    .string()
    .max(120, 'Yazar adı en fazla 120 karakter olabilir')
    .nullable()
    .optional()
    .describe('Yazar adı — locale-bağımsız'),

  // tags | localeAware: true | string_array | required: false
  tags: z
    .record(z.string(), z.array(z.string()))
    .nullable()
    .optional()
    .describe('Etiketler — locale bazlı string dizisi'),

  // hero_image | media_ref | localeAware: false | required: true
  hero_image: z
    .string()
    .min(1, 'Kapak görseli zorunludur')
    .describe('Kapak görseli — media_library UUID veya URL'),

  // gallery | media_array | localeAware: false | required: false
  gallery: z
    .array(z.string())
    .optional()
    .default([])
    .describe('Galeri görselleri — media UUID dizisi'),

  // published_at | datetime | localeAware: false | required: true
  published_at: z
    .string()
    .datetime({ message: 'Geçerli bir yayın tarihi giriniz (ISO 8601)' })
    .describe('Yayın tarihi — NULL = taslak, dolu = yayında'),
});

export const NewsUpdateSchema = NewsInsertSchema.partial();

export type NewsInsert = z.infer<typeof NewsInsertSchema>;
export type NewsUpdate = z.infer<typeof NewsUpdateSchema>;

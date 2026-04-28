// Auto-migrated from packages/shared/src/schemas/projects.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
// ── Yardımcı: en az bir locale değeri dolu olan LocaleString ──
const NonEmptyLocaleStringSchema = LocaleStringSchema.refine(
  (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
  { message: 'En az bir dil için değer girilmelidir' }
);

// ── Locale-aware string array map ─────────────────────────────
const LocaleStringArraySchema = z.record(z.string(), z.array(z.string()));

/**
 * ProjectsInsertSchema
 * Tablo: module_projects — INSERT doğrulaması
 * Not: id, created_at, updated_at DB tarafından üretilir — şemaya dahil değil.
 */
export const ProjectsInsertSchema = z.object({
  // ── Zorunlu ilişki alanları ──────────────────────────────
  tenant_id: z
    .string()
    .uuid('Geçerli bir tenant_id UUID giriniz')
    .describe('Kiracı referansı'),

  project_id: z
    .string()
    .uuid('Geçerli bir project_id UUID giriniz')
    .describe('Proje referansı'),

  // ── Kategori ─────────────────────────────────────────────
  category_id: z
    .string()
    .uuid('Geçerli bir kategori UUID giriniz')
    .nullable()
    .optional()
    .describe('Kategori — NULL = kategorisiz'),

  // ── Yayın ────────────────────────────────────────────────
  published_at: z
    .string()
    .datetime({ message: 'Geçerli bir tarih-saat giriniz' })
    .nullable()
    .optional()
    .describe('NULL = taslak, dolu = yayında'),

  // ── slug | localeAware:true | required:true ───────────────
  slug: NonEmptyLocaleStringSchema
    .describe('URL slug, TR + EN zorunlu'),

  // ── title | localeAware:true | required:true ──────────────
  title: NonEmptyLocaleStringSchema
    .describe('Proje Başlığı, TR + EN zorunlu'),

  // ── short_description | localeAware:true | required:false ─
  short_description: LocaleStringSchema
    .optional()
    .describe('Özet — opsiyonel, locale-aware'),

  // ── description | localeAware:true | required:false ───────
  description: LocaleStringSchema
    .optional()
    .describe('Detaylı Anlatım (richtext) — opsiyonel, locale-aware'),

  // ── client_name | localeAware:false | required:false ──────
  client_name: z
    .string()
    .max(120, 'Müşteri adı en fazla 120 karakter olabilir')
    .nullable()
    .optional()
    .describe('Müşteri / Firma Adı'),

  // ── client_logo | media_ref | required:false ──────────────
  client_logo: z
    .string()
    .nullable()
    .optional()
    .describe('Müşteri Logosu (media_library UUID)'),

  // ── completion_date | date | required:false ───────────────
  completion_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih YYYY-MM-DD formatında olmalıdır')
    .nullable()
    .optional()
    .describe('Tamamlanma Tarihi'),

  // ── project_url | url | required:false ───────────────────
  project_url: z
    .string()
    .url('Geçerli bir URL giriniz')
    .nullable()
    .optional()
    .describe('Proje Linki — yalnızca gerçek canlı site URL\'si'),

  // ── tags | string_array | localeAware:true | required:false
  tags: LocaleStringArraySchema
    .optional()
    .describe('Etiketler — locale-aware string dizisi'),

  // ── cover_image | media_ref | required:true ───────────────
  cover_image: z
    .string()
    .min(1, 'Kapak görseli boş olamaz')
    .describe('Kapak Görseli (media_library UUID) — zorunlu'),

  // ── gallery_images | media_array | required:false ─────────
  gallery_images: z
    .array(z.string())
    .optional()
    .describe('Galeri görselleri (media_library UUID dizisi)'),

  // ── is_featured | boolean | required:false | default:false ─
  is_featured: z
    .boolean()
    .optional()
    .default(false)
    .describe('Öne Çıkarılmış'),
});

/**
 * ProjectsUpdateSchema
 * Tüm alanlar opsiyonel — PATCH semantiği
 */
export const ProjectsUpdateSchema = ProjectsInsertSchema.partial();

// ── Type export'ları ──────────────────────────────────────────
export type ProjectsInsert = z.infer<typeof ProjectsInsertSchema>;
export type ProjectsUpdate = z.infer<typeof ProjectsUpdateSchema>;

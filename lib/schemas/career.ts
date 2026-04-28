// Auto-migrated from packages/shared/src/schemas/career.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
/**
 * CareerInsertSchema — module_career insert validation
 * Versiyon: 1.0.0
 *
 * Not: id, created_at, updated_at DB tarafında üretilir — schema'ya dahil edilmez.
 */
export const CareerInsertSchema = z.object({
  /** Tenant UUID */
  tenant_id: z.string().uuid('Geçerli bir tenant_id UUID giriniz'),

  /** Proje UUID */
  project_id: z.string().uuid('Geçerli bir project_id UUID giriniz'),

  /** URL slug — locale-aware, zorunlu; en az bir locale dolu olmalı */
  slug: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Slug en az bir dilde dolu olmalıdır' }
    )
    .describe('URL slug, tüm aktif locale\'ler için'),

  /** Pozisyon başlığı — locale-aware, zorunlu */
  title: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Başlık en az bir dilde dolu olmalıdır' }
    )
    .describe('Pozisyon başlığı, TR + EN zorunlu'),

  /** Departman — locale-aware, opsiyonel */
  department: LocaleStringSchema
    .optional()
    .describe('Departman adı (opsiyonel)'),

  /** Konum — non-locale, opsiyonel */
  location: z
    .string()
    .max(160, 'Konum en fazla 160 karakter olabilir')
    .nullable()
    .optional()
    .describe('Çalışma konumu (ör: İstanbul, Remote, Hybrid)'),

  /** Çalışma tipi — enum, zorunlu */
  employment_type: z
    .enum(['full_time', 'part_time', 'contract', 'intern'], {
      errorMap: () => ({ message: 'Geçerli bir çalışma tipi seçiniz' }),
    })
    .default('full_time')
    .describe('Çalışma tipi'),

  /** Pozisyon açıklaması — richtext, locale-aware, zorunlu */
  description: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Pozisyon açıklaması en az bir dilde dolu olmalıdır' }
    )
    .describe('Pozisyon açıklaması (richtext), TR + EN zorunlu'),

  /** Gereksinimler — richtext, locale-aware, opsiyonel */
  requirements: LocaleStringSchema
    .optional()
    .describe('Teknik yetkinlik, tecrübe, dil, eğitim (opsiyonel)'),

  /** Başvuru form şeması — jsonb, opsiyonel */
  apply_form_schema: z
    .record(z.string(), z.unknown())
    .nullable()
    .optional()
    .describe('Custom başvuru form alanları; boşsa standart form kullanılır'),

  /** Aktif mi? */
  is_active: z
    .boolean({
      required_error: 'is_active zorunludur',
    })
    .default(true)
    .describe('Pasif ilanlar public sayfada görünmez'),

  /** NULL = taslak, dolu = yayında */
  published_at: z
    .string()
    .datetime({ message: 'Geçerli bir ISO 8601 tarih-saat giriniz' })
    .nullable()
    .optional()
    .describe('Yayın tarihi; NULL ise taslak'),
});

/**
 * CareerUpdateSchema — tüm alanlar opsiyonel (partial)
 */
export const CareerUpdateSchema = CareerInsertSchema.partial();

/** Insert tip çıkarımı */
export type CareerInsert = z.infer<typeof CareerInsertSchema>;

/** Update tip çıkarımı */
export type CareerUpdate = z.infer<typeof CareerUpdateSchema>;

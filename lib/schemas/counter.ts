// Auto-migrated from packages/shared/src/schemas/counter.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
/**
 * CounterInsertSchema
 * Tablo: module_counter
 * Versiyon: 1.0.0
 *
 * id, created_at, updated_at DB tarafında üretilir — Insert'e dahil değil.
 */
export const CounterInsertSchema = z.object({
  tenant_id: z
    .string()
    .uuid('Geçerli bir tenant UUID giriniz')
    .describe('Tenant kimliği'),

  project_id: z
    .string()
    .uuid('Geçerli bir proje UUID giriniz')
    .describe('Proje kimliği'),

  label: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Etiket en az bir dilde dolu olmalıdır' }
    )
    .describe('Etiket — TR + EN zorunlu'),

  value: z
    .number({ required_error: 'Değer boş olamaz' })
    .describe('Sayısal değer (500, 15, 98)'),

  suffix: LocaleStringSchema
    .nullable()
    .optional()
    .describe('Ek — örn: "+", "%", "M", "yıl"'),

  icon: z
    .string()
    .max(80, 'İkon adı en fazla 80 karakter olabilir')
    .nullable()
    .optional()
    .describe('Lucide icon adı — örn: "Award", "Users", "TrendingUp"'),

  sort_order: z
    .number()
    .default(0)
    .optional()
    .describe('Sıralama'),

  published_at: z
    .string()
    .datetime({ message: 'Geçerli bir tarih-saat giriniz' })
    .nullable()
    .optional()
    .describe('NULL = taslak, dolu = yayında'),
});

export const CounterUpdateSchema = CounterInsertSchema.partial();

export type CounterInsert = z.infer<typeof CounterInsertSchema>;
export type CounterUpdate = z.infer<typeof CounterUpdateSchema>;

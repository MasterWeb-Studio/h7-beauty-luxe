// Auto-migrated from packages/shared/src/schemas/services.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const ServicesInsertSchema = z.object({
  tenant_id: z.string().uuid('Geçerli bir tenant_id giriniz'),
  project_id: z.string().uuid('Geçerli bir project_id giriniz'),
  slug: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Slug en az bir dil için dolu olmalı' }
  ).describe('URL slug, TR + EN zorunlu'),
  title: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Başlık boş olamaz' }
  ).describe('Hizmet adı, TR + EN zorunlu'),
  short_description: LocaleStringSchema.nullable().optional().describe('Kısa açıklama, kart ve SEO meta için'),
  description: LocaleStringSchema.nullable().optional().describe('Detaylı açıklama (richtext)'),
  icon: z.string().max(80, 'İkon adı en fazla 80 karakter olabilir').nullable().optional().describe('Lucide icon adı — örn: Sparkles, Rocket, Shield'),
  image: z.string().nullable().optional().describe('Detay sayfası hero görseli (media_library UUID)'),
  features: z.record(z.string(), z.array(z.string())).nullable().optional().describe('Hizmetin içerdiği maddeler listesi (locale → string[])'),
  is_featured: z.boolean().default(false).describe('Öne çıkarılmış hizmet'),
  sort_order: z.number().default(0).nullable().optional().describe('Sıralama değeri'),
  published_at: z.string().datetime({ offset: true }).nullable().optional().describe('Yayın tarihi — NULL = taslak, dolu = yayında'),
});

export const ServicesUpdateSchema = ServicesInsertSchema.partial();

export type ServicesInsert = z.infer<typeof ServicesInsertSchema>;
export type ServicesUpdate = z.infer<typeof ServicesUpdateSchema>;

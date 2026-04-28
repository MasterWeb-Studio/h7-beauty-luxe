// Auto-migrated from packages/shared/src/schemas/timeline.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const TimelineInsertSchema = z.object({
  tenant_id: z.string().uuid('Geçerli bir tenant_id giriniz'),
  project_id: z.string().uuid('Geçerli bir project_id giriniz'),
  year: z.number().int('Yıl tam sayı olmalı').min(1, 'Yıl boş olamaz').describe('Yıl'),
  month: z.number().int('Ay tam sayı olmalı').min(1, 'Ay en az 1 olmalı').max(12, 'Ay en fazla 12 olabilir').nullable().optional().describe('Ay (1-12). Boş bırakılırsa sadece yıl gösterilir.'),
  title: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Başlık boş olamaz' }
  ).describe('Başlık, en az bir dil zorunlu'),
  description: LocaleStringSchema.nullable().optional().describe('Açıklama'),
  icon: z.string().max(80, 'İkon adı en fazla 80 karakter olabilir').nullable().optional().describe('Lucide icon adı — örn: "Rocket", "Award", "Building"'),
  image: z.string().nullable().optional().describe('Görsel (media_library UUID)'),
  sort_order: z.number().int('Sıralama tam sayı olmalı').default(0).optional().describe('Sıralama (Aynı Yıl İçinde)'),
  published_at: z.string().datetime({ message: 'Geçerli bir tarih giriniz' }).nullable().optional().describe('Yayın Tarihi — NULL = taslak, dolu = yayında'),
});

export const TimelineUpdateSchema = TimelineInsertSchema.partial();

export type TimelineInsert = z.infer<typeof TimelineInsertSchema>;
export type TimelineUpdate = z.infer<typeof TimelineUpdateSchema>;

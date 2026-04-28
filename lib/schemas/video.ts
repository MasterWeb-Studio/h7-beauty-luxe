// Auto-migrated from packages/shared/src/schemas/video.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const VideoInsertSchema = z.object({
  tenant_id: z.string().uuid('Geçerli bir tenant_id giriniz'),
  project_id: z.string().uuid('Geçerli bir project_id giriniz'),
  title: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Başlık boş olamaz' }
  ).describe('Video başlığı, en az bir dil zorunlu'),
  description: LocaleStringSchema.nullable().optional().describe('Açıklama'),
  video_url: z.string().url('Geçerli bir URL giriniz').max(400, 'URL en fazla 400 karakter olabilir').describe('Youtube veya Vimeo URL'),
  thumbnail: z.string().nullable().optional().describe('Kapak görseli media_library UUID'),
  duration: z.string().max(12, 'Süre en fazla 12 karakter olabilir').nullable().optional().describe('Formatted süre — örn: "2:45", "10:30", "1:23:45"'),
  is_featured: z.boolean().default(false).describe('Öne çıkarılmış'),
  sort_order: z.number().nullable().optional().default(0).describe('Sıralama'),
  published_at: z.string().datetime().nullable().optional().describe('Yayın tarihi — NULL = taslak, dolu = yayında'),
});

export const VideoUpdateSchema = VideoInsertSchema.partial();

export type VideoInsert = z.infer<typeof VideoInsertSchema>;
export type VideoUpdate = z.infer<typeof VideoUpdateSchema>;

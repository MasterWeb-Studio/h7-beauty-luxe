// Auto-migrated from packages/shared/src/schemas/newsletter.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const NewsletterInsertSchema = z.object({
  tenant_id: z.string().uuid(),
  project_id: z.string().uuid(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').max(254, 'E-posta 254 karakterden uzun olamaz').describe('E-posta adresi'),
  subscribed_at: z.string().datetime('Geçerli bir tarih giriniz').describe('Abone tarihi'),
  locale: z.string().max(10, 'Dil kodu 10 karakterden uzun olamaz').nullable().optional().describe('Abonenin kaydolduğu dil (tr/en)'),
  source: z.string().max(160, 'Kaynak 160 karakterden uzun olamaz').nullable().optional().describe('Hangi sayfadan abone oldu (URL veya section ID)'),
  confirmed: z.boolean().default(false).describe('Double opt-in için (V1\'de kullanılmıyor, H7+)'),
  published_at: z.string().datetime().nullable().optional(),
});

export const NewsletterUpdateSchema = NewsletterInsertSchema.partial();

export type NewsletterInsert = z.infer<typeof NewsletterInsertSchema>;
export type NewsletterUpdate = z.infer<typeof NewsletterUpdateSchema>;

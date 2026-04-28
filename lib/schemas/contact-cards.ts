// Auto-migrated from packages/shared/src/schemas/contact-cards.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const ContactCardInsertSchema = z.object({
  tenant_id: z.string().uuid('Geçerli bir tenant_id giriniz'),
  project_id: z.string().uuid('Geçerli bir project_id giriniz'),
  title: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Başlık boş olamaz' }
  ).describe('İletişim kartı başlığı, tüm locale\'lerde dolu olmalı'),
  value: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Değer boş olamaz' }
  ).describe('İletişim değeri — telefon, e-posta, adres vb.'),
  icon: z.string().max(80, 'İkon adı en fazla 80 karakter olabilir').nullable().optional().describe('Lucide icon adı — örn: Phone, Mail, MapPin, Clock'),
  link_url: z.string().max(400, 'Link URL en fazla 400 karakter olabilir').url('Geçerli bir URL giriniz').nullable().optional().describe('Opsiyonel tıklanabilir link — tel:/mailto:/https://'),
  sort_order: z.number().nullable().optional().describe('Sıralama değeri'),
  published_at: z.string().datetime({ message: 'Geçerli bir tarih-saat giriniz' }).nullable().optional().describe('Yayın tarihi — NULL ise taslak'),
});

export const ContactCardUpdateSchema = ContactCardInsertSchema.partial();

export type ContactCardInsert = z.infer<typeof ContactCardInsertSchema>;
export type ContactCardUpdate = z.infer<typeof ContactCardUpdateSchema>;

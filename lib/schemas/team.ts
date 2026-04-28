// Auto-migrated from packages/shared/src/schemas/team.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const TeamInsertSchema = z.object({
  tenant_id: z.string().uuid('Geçerli bir tenant_id giriniz'),
  project_id: z.string().uuid('Geçerli bir project_id giriniz'),
  slug: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Slug en az bir dilde dolu olmalıdır' }
  ).describe('URL slug, her aktif dil için zorunlu'),
  name: z.string().min(1, 'Ad boş olamaz').max(160, 'Ad en fazla 160 karakter olabilir').describe('Kişinin tam adı — locale bağımsız'),
  role: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Unvan en az bir dilde dolu olmalıdır' }
  ).describe('Unvan / Pozisyon'),
  bio: LocaleStringSchema.nullable().optional().describe('Biyografi'),
  photo: z.string().min(1, 'Profil fotoğrafı zorunludur').describe('Profil Fotoğrafı — media_library UUID'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').nullable().optional().describe('E-posta'),
  phone: z.string().nullable().optional().describe('Telefon'),
  social_links: z.record(z.string(), z.unknown()).nullable().optional().describe('Sosyal Medya — linkedin, twitter, github gibi key-value'),
  sort_order: z.number().nullable().optional().describe('Sıralama — küçük değer önce görünür'),
  published_at: z.string().datetime({ message: 'Geçerli bir tarih giriniz' }).nullable().optional().describe('Yayın Tarihi — NULL = taslak'),
});

export const TeamUpdateSchema = TeamInsertSchema.partial();

export type TeamInsert = z.infer<typeof TeamInsertSchema>;
export type TeamUpdate = z.infer<typeof TeamUpdateSchema>;

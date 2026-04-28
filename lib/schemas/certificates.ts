// Auto-migrated from packages/shared/src/schemas/certificates.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const CertificateInsertSchema = z.object({
  tenant_id: z.string().uuid('Geçerli bir tenant_id giriniz'),
  project_id: z.string().uuid('Geçerli bir project_id giriniz'),
  slug: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Slug en az bir dilde dolu olmalı' }
  ).describe('URL slug, TR + EN zorunlu'),
  title: LocaleStringSchema.refine(
    (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
    { message: 'Başlık en az bir dilde dolu olmalı' }
  ).describe('Sertifika adı, TR + EN zorunlu'),
  issuer: z.string().min(1, 'Veren kurum boş olamaz').max(200, 'Veren kurum en fazla 200 karakter olabilir').describe('Veren kurum adı'),
  issue_date: z.string().min(1, 'Veriliş tarihi boş olamaz').describe('Veriliş tarihi (YYYY-MM-DD)'),
  expiry_date: z.string().nullable().optional().describe('Son geçerlilik tarihi (YYYY-MM-DD), süresiz ise boş'),
  certificate_number: z.string().max(120, 'Sertifika numarası en fazla 120 karakter olabilir').nullable().optional().describe('Sertifika numarası'),
  image_url: z.string().min(1, 'Sertifika görseli boş olamaz').describe('Sertifika görseli (media_library UUID veya URL)'),
  description: LocaleStringSchema.nullable().optional().describe('Sertifika açıklaması (opsiyonel)'),
  sort_order: z.number().nullable().optional().describe('Sıralama değeri'),
  published_at: z.string().nullable().optional().describe('Yayın tarihi, NULL ise taslak')
});

export const CertificateUpdateSchema = CertificateInsertSchema.partial();

export type CertificateInsert = z.infer<typeof CertificateInsertSchema>;
export type CertificateUpdate = z.infer<typeof CertificateUpdateSchema>;

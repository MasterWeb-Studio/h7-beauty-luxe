// Auto-migrated from packages/shared/src/schemas/references.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
export const ReferencesInsertSchema = z.object({
  tenant_id: z.string().uuid('Geçerli bir tenant_id giriniz'),
  project_id: z.string().uuid('Geçerli bir project_id giriniz'),
  name: z.string().min(1, 'Marka adı boş olamaz').max(160, 'Marka adı en fazla 160 karakter olabilir').describe('Marka Adı — locale bağımsız'),
  logo_url: z.string().min(1, 'Logo boş olamaz').describe('Logo — media_library UUID veya URL'),
  website_url: z.string().url('Geçerli bir URL giriniz').nullable().optional().describe('Web Sitesi URL'),
  description: LocaleStringSchema.nullable().optional().describe('Açıklama — opsiyonel, çalışmanın özeti'),
  sort_order: z.number().nullable().optional().describe('Sıralama'),
  published_at: z.string().datetime({ message: 'Geçerli bir tarih giriniz' }).nullable().optional().describe('Yayın Tarihi — NULL = taslak, dolu = yayında'),
});

export const ReferencesUpdateSchema = ReferencesInsertSchema.partial();

export type ReferencesInsert = z.infer<typeof ReferencesInsertSchema>;
export type ReferencesUpdate = z.infer<typeof ReferencesUpdateSchema>;

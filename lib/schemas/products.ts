// Auto-migrated from packages/shared/src/schemas/products.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

import { z } from 'zod';
const LocaleStringSchema = z.record(z.string(), z.string());
// ------------------------------------------------------------
// ProductInsertSchema
// id, created_at, updated_at DB tarafında üretilir — dahil edilmez
// ------------------------------------------------------------

export const ProductInsertSchema = z.object({
  tenant_id: z
    .string()
    .uuid('Geçerli bir tenant_id UUID giriniz'),

  project_id: z
    .string()
    .uuid('Geçerli bir project_id UUID giriniz'),

  // Kategori
  category_id: z
    .string()
    .uuid('Geçerli bir kategori UUID giriniz')
    .nullable()
    .optional()
    .describe('Ürün kategorisi'),

  // Locale-aware — required
  slug: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Slug en az bir locale için dolu olmalı' }
    )
    .describe('URL slug — otomatik oluşur, elle düzenlenebilir'),

  name: LocaleStringSchema
    .refine(
      (v) => Object.values(v).some((x) => typeof x === 'string' && x.trim().length > 0),
      { message: 'Ürün adı en az bir locale için dolu olmalı' }
    )
    .describe('Ürün adı, TR + EN zorunlu'),

  // Locale-aware — optional
  short_description: LocaleStringSchema
    .nullable()
    .optional()
    .describe('Kısa açıklama — liste ve kart görünümlerinde kullanılır'),

  description: LocaleStringSchema
    .nullable()
    .optional()
    .describe('Detaylı açıklama (richtext)'),

  attributes: LocaleStringSchema
    .nullable()
    .optional()
    .describe('Esnek key-value özellikler — Renk, Ağırlık vb.'),

  // Scalar alanlar
  price: z
    .number()
    .min(0, 'Fiyat negatif olamaz')
    .nullable()
    .optional()
    .describe('Ürün fiyatı — para birimi ayrı alanda'),

  currency: z
    .enum(['TRY', 'USD', 'EUR', 'GBP'], {
      errorMap: () => ({ message: 'Geçerli bir para birimi seçiniz: TRY, USD, EUR, GBP' }),
    })
    .nullable()
    .optional()
    .describe('Para birimi'),

  stock_status: z
    .enum(['in_stock', 'low_stock', 'out_of_stock', 'pre_order'], {
      errorMap: () => ({ message: 'Geçerli bir stok durumu seçiniz' }),
    })
    .describe('Stok durumu'),

  is_bestseller: z
    .boolean()
    .optional()
    .default(false)
    .describe('Öne çıkarılmış ürün'),

  // Media
  images: z
    .array(z.string())
    .optional()
    .default([])
    .describe('Ürün görselleri — ilk görsel kapak olarak kullanılır'),

  // Yayın
  published_at: z
    .string()
    .datetime({ message: 'Geçerli bir tarih-saat giriniz (ISO 8601)' })
    .nullable()
    .optional()
    .describe('Yayın tarihi — boş bırakılırsa taslak kalır'),
});

export const ProductUpdateSchema = ProductInsertSchema.partial();

// ------------------------------------------------------------
// Type exports
// ------------------------------------------------------------

export type ProductInsert = z.infer<typeof ProductInsertSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

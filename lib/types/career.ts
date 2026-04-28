// Auto-migrated from packages/shared/src/types/career.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
/**
 * CareerRow — module_career tablosu satır tipi
 * Versiyon: 1.0.0
 */
export interface CareerRow {
  /** PK — gen_random_uuid() */
  id: string;

  /** Tenant referansı */
  tenant_id: string;

  /** Proje referansı */
  project_id: string;

  /** URL slug — locale-aware, zorunlu */
  slug: LocaleString;

  /** Pozisyon başlığı — locale-aware, zorunlu */
  title: LocaleString;

  /** Departman — locale-aware, opsiyonel */
  department: LocaleString;

  /** Konum — non-locale, opsiyonel */
  location: string | null;

  /** Çalışma tipi — enum, zorunlu */
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';

  /** Pozisyon açıklaması — richtext, locale-aware, zorunlu */
  description: LocaleString;

  /** Gereksinimler — richtext, locale-aware, opsiyonel */
  requirements: LocaleString;

  /** Başvuru form şeması — jsonb, opsiyonel */
  apply_form_schema: Record<string, unknown> | null;

  /** Aktif mi? */
  is_active: boolean;

  /** NULL = taslak, dolu = yayında */
  published_at: string | null;

  /** Oluşturulma zamanı */
  created_at: string;

  /** Güncellenme zamanı */
  updated_at: string;
}

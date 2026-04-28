// Auto-migrated from packages/shared/src/types/counter.ts (Schema Architect output).
// Next.js webpack monorepo deep subpath workaround — local duplicate.
// Üretim: scaffolder migrate-module.

type LocaleString = Record<string, string>;
/**
 * CounterRow
 * Tablo: module_counter
 * Versiyon: 1.0.0
 */
export interface CounterRow {
  id: string;
  tenant_id: string;
  project_id: string;

  /** Etiket — locale-aware (TR + EN) */
  label: LocaleString;

  /** Sayısal değer */
  value: number;

  /** Ek (suffix) — locale-aware, opsiyonel */
  suffix: LocaleString | null;

  /** Lucide icon adı */
  icon: string | null;

  /** Sıralama */
  sort_order: number | null;

  /** NULL = taslak, dolu = yayında */
  published_at: string | null;

  created_at: string;
  updated_at: string;
}

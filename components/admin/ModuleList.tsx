'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 6 — ModuleList
//
// Admin list view. Spec-agnostik generic types; Admin UI Builder agent ModuleSpec'ten
// map edip bu komponente veriyor.
// Spec: docs/h6-reusable-components.md §2.
// ---------------------------------------------------------------------------

export type ModuleItem = Record<string, unknown> & { id: string };

export interface ColumnDef {
  field: string;
  label: string;
  width?: string;
  sortable?: boolean;
  hideOnMobile?: boolean;
  render?: (value: unknown, row: ModuleItem, locale: string) => ReactNode;
}

export interface BulkAction {
  id: string;
  label: string;
  destructive?: boolean;
  confirm?: boolean;
}

export interface ModuleListProps {
  items: ModuleItem[];
  columns?: ColumnDef[];
  /** "+ Yeni {name}" butonu — displayName locale-aware */
  moduleName?: string;
  searchableFields?: string[];
  locale?: string;
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
  pageSize?: number;
  totalCount?: number;
  /** Agent compat alias (camel → snake tutarlılığı yok, sadece isim) */
  total?: number;
  loading?: boolean;
  error?: string | null;
  bulkActions?: BulkAction[];
  onSearchChange?: (term: string) => void;
  onSortChange?: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
  onPageChange?: (page: number) => void;
  onBulkAction?: (actionId: string, ids: string[]) => Promise<void> | void;
  onCreate?: () => void;
  onEdit?: (id: string) => void;
  /** Agent output pattern — href-bazlı new button */
  newHref?: string;
  /** Projects agent alternatifi — newPath */
  newPath?: string;
  /** Projects agent — modulePath (edit URL base) */
  modulePath?: string;
  /** Agent output pattern — href-bazlı row click */
  editHrefFn?: (item: ModuleItem) => string;
  /** Projects agent — filters + showLocaleBadges (v1'de ignored, future) */
  filters?: unknown[];
  showLocaleBadges?: boolean;
  /** Locale-aware display için proje supportedLocales (agent output) */
  supportedLocales?: string[];
  /**
   * Spec verilirse columns/moduleName/searchableFields otomatik türetilir
   * (agent output compatibility — Batch 1 ColumnDef API'sinden agent'ın
   * `<ModuleList spec={spec} />` pattern'ine köprü).
   */
  spec?: {
    meta?: { id?: string; displayName?: Record<string, string> };
    admin?: { listView?: { columns?: Array<{ field: string; sortable?: boolean }>; searchableFields?: string[] } };
    fields?: Array<{ name: string; label?: Record<string, string>; localeAware?: boolean }>;
  };
  /** URL state sync — verilirse read/write */
  urlState?: {
    get: () => { search?: string; page?: number; sortField?: string; sortDirection?: 'asc' | 'desc' };
    set: (patch: Partial<{ search: string; page: number; sortField: string; sortDirection: 'asc' | 'desc' }>) => void;
  };
  className?: string;
}

export function ModuleList({
  items,
  columns: columnsProp,
  moduleName: moduleNameProp,
  searchableFields: searchableFieldsProp,
  locale = 'tr',
  defaultSort,
  pageSize = 50,
  totalCount: totalCountProp,
  total,
  loading = false,
  error = null,
  bulkActions = [],
  onSearchChange,
  onSortChange,
  onPageChange,
  onBulkAction,
  onCreate,
  onEdit,
  newHref,
  newPath,
  modulePath,
  editHrefFn,
  filters: _filters,
  showLocaleBadges: _showLocaleBadges,
  supportedLocales: _supportedLocales,
  spec,
  urlState,
  className,
}: ModuleListProps) {
  // newPath alias olarak newHref'e, modulePath (edit) href fn olarak kullan
  const resolvedNewHref = newHref ?? newPath;
  const resolvedEditHrefFn =
    editHrefFn ??
    (modulePath ? (item: ModuleItem) => `${modulePath}/${item.id}` : undefined);
  // Spec-aware derivation — agent output compat
  const derivedColumns: ColumnDef[] =
    columnsProp ??
    (spec?.admin?.listView?.columns
      ? spec.admin.listView.columns.slice(0, 6).map((c) => {
          const fieldDef = spec.fields?.find((f) => f.name === c.field);
          const label =
            fieldDef?.label?.[locale] ??
            fieldDef?.label?.tr ??
            c.field;
          return { field: c.field, label, sortable: c.sortable };
        })
      : []);
  const columns = derivedColumns.length > 0 ? derivedColumns : [{ field: 'id', label: 'ID' }];
  const moduleName =
    moduleNameProp ??
    spec?.meta?.displayName?.[locale] ??
    spec?.meta?.displayName?.tr ??
    spec?.meta?.id ??
    'Kayıt';
  const searchableFields: string[] = searchableFieldsProp ?? spec?.admin?.listView?.searchableFields ?? [];
  const totalCount = totalCountProp ?? total;
  // newHref/editHrefFn onCreate/onEdit'e köprü (newPath/modulePath alias'ları dahil)
  const effectiveOnCreate =
    onCreate ??
    (resolvedNewHref
      ? () => {
          if (typeof window !== 'undefined') window.location.href = resolvedNewHref!;
        }
      : undefined);
  const effectiveOnEdit =
    onEdit ??
    (resolvedEditHrefFn
      ? (id: string) => {
          const item = items.find((x) => x.id === id);
          if (item && typeof window !== 'undefined') {
            window.location.href = resolvedEditHrefFn(item);
          }
        }
      : undefined);
  // Orijinal fonksiyon içinde bu isimlerle devam
  // eslint-disable-next-line prefer-const
  let _dummy = null;
  _dummy; // no-op — aşağıdaki orijinal scope korunur
  const fromUrl = urlState?.get();
  const [search, setSearch] = useState(fromUrl?.search ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(fromUrl?.page ?? 1);
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(() => {
    if (fromUrl?.sortField) {
      return { field: fromUrl.sortField, direction: fromUrl.sortDirection ?? 'asc' };
    }
    return defaultSort ?? null;
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Debounce search
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      onSearchChange?.(search);
      urlState?.set({ search });
      setPage(1);
    }, 300);
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = useCallback(
    (field: string) => {
      setSort((prev) => {
        let next: { field: string; direction: 'asc' | 'desc' };
        if (!prev || prev.field !== field) {
          next = { field, direction: 'asc' };
        } else {
          next = { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        }
        onSortChange?.(next);
        urlState?.set({ sortField: next.field, sortDirection: next.direction });
        return next;
      });
    },
    [onSortChange, urlState]
  );

  const goToPage = useCallback(
    (p: number) => {
      setPage(p);
      onPageChange?.(p);
      urlState?.set({ page: p });
    },
    [onPageChange, urlState]
  );

  // Client-side filter (sadece items prop verildiyse; production'da server-side)
  const filteredLocal = useMemo(() => {
    if (!debouncedSearch.trim() || searchableFields.length === 0) return items;
    const q = debouncedSearch.toLowerCase();
    return items.filter((row) =>
      searchableFields.some((field) => {
        const raw = row[field];
        if (raw == null) return false;
        if (typeof raw === 'string') return raw.toLowerCase().includes(q);
        if (typeof raw === 'object') {
          const v = (raw as Record<string, unknown>)[locale];
          return typeof v === 'string' && v.toLowerCase().includes(q);
        }
        return false;
      })
    );
  }, [items, debouncedSearch, searchableFields, locale]);

  const sortedLocal = useMemo(() => {
    if (!sort) return filteredLocal;
    const col = columns.find((c) => c.field === sort.field);
    if (!col) return filteredLocal;
    const arr = [...filteredLocal];
    arr.sort((a, b) => {
      const av = pickValue(a[sort.field], locale);
      const bv = pickValue(b[sort.field], locale);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), locale);
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filteredLocal, sort, locale, columns]);

  const effectiveTotal = totalCount ?? sortedLocal.length;
  const pageCount = Math.max(1, Math.ceil(effectiveTotal / pageSize));
  const pagedLocal = useMemo(() => {
    if (totalCount != null) return sortedLocal; // server paging
    const start = (page - 1) * pageSize;
    return sortedLocal.slice(start, start + pageSize);
  }, [sortedLocal, page, pageSize, totalCount]);

  const visibleIds = pagedLocal.map((i) => i.id);
  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someSelected = visibleIds.some((id) => selectedIds.has(id));

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((s) => {
      const next = new Set(s);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds((s) => {
      const next = new Set(s);
      visibleIds.forEach((id) => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const runBulk = async (actionId: string) => {
    const action = bulkActions.find((a) => a.id === actionId);
    if (!action) return;
    if (action.confirm || action.destructive) {
      const msg =
        action.destructive
          ? `${selectedIds.size} kayıt silinecek. Onaylıyor musunuz?`
          : `${action.label}: ${selectedIds.size} kayıt etkilenecek. Devam?`;
      if (typeof window !== 'undefined' && !window.confirm(msg)) return;
    }
    await onBulkAction?.(actionId, Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  if (error) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm text-rose-700">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ara…"
            aria-label={`${moduleName} ara`}
            disabled={loading}
          />
        </div>
        {effectiveOnCreate ? (
          <button
            type="button"
            onClick={effectiveOnCreate}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            + Yeni {moduleName}
          </button>
        ) : null}
      </div>

      {selectedIds.size > 0 && bulkActions.length > 0 ? (
        <div
          role="region"
          aria-label="Toplu işlemler"
          className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
        >
          <span className="font-medium">{selectedIds.size} seçildi</span>
          <span className="flex-1" />
          {bulkActions.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => runBulk(a.id)}
              className={cn(
                'inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm transition-colors',
                a.destructive
                  ? 'border-rose-300 bg-white text-rose-700 hover:bg-rose-50'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? (
        <div aria-busy="true" className="space-y-2">
          <span className="sr-only">Yükleniyor…</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-md bg-slate-100"
            />
          ))}
        </div>
      ) : pagedLocal.length === 0 && debouncedSearch ? (
        <EmptyState
          title="Sonuç bulunamadı"
          description={`"${debouncedSearch}" için ${moduleName.toLowerCase()} yok.`}
          ctaLabel="Filtreyi temizle"
          onCta={() => setSearch('')}
        />
      ) : pagedLocal.length === 0 ? (
        <EmptyState
          title={`Henüz ${moduleName.toLowerCase()} eklenmedi`}
          description=""
          ctaLabel={effectiveOnCreate ? `+ Yeni ${moduleName} ekle` : undefined}
          onCta={effectiveOnCreate}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {bulkActions.length > 0 ? (
                    <th className="w-10 px-3 py-2">
                      <input
                        type="checkbox"
                        aria-label="Tümünü seç"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = !allSelected && someSelected;
                        }}
                        onChange={(e) => toggleAll(e.target.checked)}
                      />
                    </th>
                  ) : null}
                  {columns.map((c) => {
                    const isSorted = sort?.field === c.field;
                    const ariaSort = isSorted
                      ? sort!.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none';
                    return (
                      <th
                        key={c.field}
                        scope="col"
                        aria-sort={c.sortable ? ariaSort : undefined}
                        className={cn(
                          'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600',
                          c.hideOnMobile && 'hidden md:table-cell'
                        )}
                        style={c.width ? { width: c.width } : undefined}
                      >
                        {c.sortable ? (
                          <button
                            type="button"
                            onClick={() => handleSort(c.field)}
                            className="inline-flex items-center gap-1 hover:text-slate-900"
                          >
                            {c.label}
                            <span aria-hidden="true" className="text-slate-400">
                              {isSorted ? (sort!.direction === 'asc' ? '↑' : '↓') : '↕'}
                            </span>
                          </button>
                        ) : (
                          c.label
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {pagedLocal.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    {bulkActions.length > 0 ? (
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          aria-label="Satır seç"
                          checked={selectedIds.has(row.id)}
                          onChange={(e) => toggleRow(row.id, e.target.checked)}
                        />
                      </td>
                    ) : null}
                    {columns.map((c) => (
                      <td
                        key={c.field}
                        className={cn(
                          'px-3 py-2',
                          c.hideOnMobile && 'hidden md:table-cell'
                        )}
                      >
                        {c.render ? (
                          c.render(row[c.field], row, locale)
                        ) : (
                          <button
                            type="button"
                            onClick={() => effectiveOnEdit?.(row.id)}
                            className="text-left hover:underline"
                          >
                            {formatValue(row[c.field], locale)}
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 ? (
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Sayfa {page}/{pageCount} · {effectiveTotal} kayıt
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded border border-slate-300 bg-white px-2 py-1 font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  ← Önceki
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(Math.min(pageCount, page + 1))}
                  disabled={page === pageCount}
                  className="rounded border border-slate-300 bg-white px-2 py-1 font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  Sonraki →
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function pickValue(raw: unknown, locale: string): unknown {
  if (raw == null) return raw;
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const v = (raw as Record<string, unknown>)[locale];
    return v ?? Object.values(raw as Record<string, unknown>)[0];
  }
  return raw;
}

function formatValue(raw: unknown, locale: string): ReactNode {
  if (raw == null) return <span className="text-slate-400">—</span>;
  if (typeof raw === 'boolean') return raw ? '✓' : '✗';
  if (typeof raw === 'object') {
    const v = (raw as Record<string, unknown>)[locale];
    const fallback = Object.values(raw as Record<string, unknown>)[0];
    return String(v ?? fallback ?? '—');
  }
  return String(raw);
}

function EmptyState({
  title,
  description,
  ctaLabel,
  onCta,
}: {
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description ? (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      ) : null}
      {ctaLabel && onCta ? (
        <button
          type="button"
          onClick={onCta}
          className="mt-3 inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
        >
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

// H6 Sprint 13 Gün 2 — Media library admin client component
//
// Features:
//   - Grid (responsive 2/3/5 kolon)
//   - Search + category filter + "sadece kullanılmayan" toggle
//   - Bulk selection + bulk delete (referanssızlar)
//   - Her item: dosya adı, kategori, kullanım sayacı, kaynak (upload/unsplash/pexels/undraw)

interface MediaItem {
  id: string;
  url: string;
  thumbUrl?: string;
  alt?: Record<string, string>;
  category?: string;
  width?: number;
  height?: number;
  size?: number;
  fileName: string;
  usageCount?: number;
  source?: string;
  photographer?: string;
  photographerUrl?: string;
}

interface ApiResponse {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
}

const CATEGORIES = ['general', 'hero', 'product', 'team-avatar', 'icon', 'stock', 'logo'];

export function MediaLibraryClient() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch media list
  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '60',
      });
      if (searchDebounced) params.set('search', searchDebounced);
      if (category !== 'all') params.set('category', category);
      if (unusedOnly) params.set('unused', '1');

      const res = await fetch(`/api/admin/media?${params}`, {
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data: ApiResponse = await res.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [searchDebounced, category, unusedOnly, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const totalPages = Math.max(1, Math.ceil(total / 60));

  const selectableIds = useMemo(
    () => items.filter((it) => (it.usageCount ?? 0) === 0).map((it) => it.id),
    [items]
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllUnused = () => {
    setSelected(new Set(selectableIds));
  };

  const clearSelection = () => setSelected(new Set());

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    const confirmed = window.confirm(
      `${selected.size} medya silinecek. Emin misiniz? (Referanssız medya)`
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      for (const id of selected) {
        await fetch(`/api/admin/media/${id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
        });
      }
      setSelected(new Set());
      await fetchList();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded border border-slate-200 bg-white p-3">
        <input
          type="text"
          placeholder="Dosya ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="min-w-[200px] flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="all">Tüm kategoriler</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={unusedOnly}
            onChange={(e) => {
              setUnusedOnly(e.target.checked);
              setPage(1);
            }}
          />
          Sadece kullanılmayanlar
        </label>
        <div className="ml-auto text-sm text-slate-500">{total} medya</div>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 ? (
        <div
          className="flex items-center gap-3 rounded border border-blue-200 bg-blue-50 p-3 text-sm"
          role="region"
          aria-label="Toplu işlemler"
        >
          <span className="font-medium">{selected.size} seçili</span>
          <button
            type="button"
            onClick={clearSelection}
            className="text-blue-700 hover:underline"
          >
            Seçimi temizle
          </button>
          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={deleting}
            className="ml-auto rounded bg-rose-600 px-3 py-1 text-white disabled:opacity-50"
          >
            {deleting ? 'Siliniyor...' : `${selected.size} medyayı sil`}
          </button>
        </div>
      ) : selectableIds.length > 0 ? (
        <button
          type="button"
          onClick={selectAllUnused}
          className="text-sm text-blue-700 hover:underline"
        >
          Kullanılmayan {selectableIds.length} medyayı seç
        </button>
      ) : null}

      {/* Grid */}
      {loading ? (
        <div className="py-10 text-center text-sm text-slate-500">Yükleniyor…</div>
      ) : error ? (
        <div className="rounded border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Hata: {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          Medya bulunamadı.
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => {
            const isSelected = selected.has(item.id);
            const canSelect = (item.usageCount ?? 0) === 0;
            return (
              <li
                key={item.id}
                className={`relative flex flex-col overflow-hidden rounded border transition ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => (canSelect ? toggleSelect(item.id) : null)}
                  disabled={!canSelect}
                  aria-pressed={isSelected}
                  aria-label={`${item.fileName} seç`}
                  className="block aspect-square overflow-hidden bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbUrl ?? item.url}
                    alt={item.alt?.tr ?? item.fileName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
                <div className="space-y-1 p-2 text-xs">
                  <div className="truncate font-medium" title={item.fileName}>
                    {item.fileName}
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{item.category ?? '—'}</span>
                    {item.usageCount && item.usageCount > 0 ? (
                      <span
                        className="rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-700"
                        title="Bu medya bir veya daha fazla modülde kullanılıyor"
                      >
                        {item.usageCount}×
                      </span>
                    ) : (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-[10px] text-slate-500">
                        serbest
                      </span>
                    )}
                  </div>
                  {item.source && item.source !== 'upload' ? (
                    <div className="truncate text-[10px] text-slate-400">
                      {item.source}
                      {item.photographer ? ` · ${item.photographer}` : ''}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            ← Önceki
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Sonraki →
          </button>
        </div>
      ) : null}
    </div>
  );
}

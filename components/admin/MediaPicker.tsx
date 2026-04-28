'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 5 — MediaPicker
//
// Supabase Storage entegrasyonu Sprint 2'de. V1: mock data + `fetchMedia`
// prop ile test/runtime injection.
// Spec: docs/h6-reusable-components.md §10.
// ---------------------------------------------------------------------------

export interface MediaItem {
  id: string;
  url: string;
  thumbUrl?: string;
  alt: Record<string, string>;
  category?: string;
  width?: number;
  height?: number;
  size?: number;
  fileName?: string;
}

type SingleProps = {
  multi?: false;
  value: string | null;
  onChange: (value: string | null) => void;
};

type MultiProps = {
  multi: true;
  value: string[];
  onChange: (value: string[]) => void;
  maxSelection?: number;
};

type CommonProps = {
  projectId: string;
  locale?: string;
  categoryFilter?: string;
  accept?: string;
  trigger?: React.ReactNode;
  /** Runtime: Supabase fetch; test/storybook: mock */
  fetchMedia?: (filter: { projectId: string; category?: string; search?: string }) => Promise<MediaItem[]>;
  /** Runtime: Supabase upload; test: mock */
  onUpload?: (files: File[]) => Promise<MediaItem[]>;
  /** Debug/testing için önceden yüklenmiş liste */
  initialItems?: MediaItem[];
};

type MediaPickerProps = CommonProps & (SingleProps | MultiProps);

const MAX_FILE_SIZE_MB = 10;

export function MediaPicker(props: MediaPickerProps) {
  const {
    projectId,
    locale = 'tr',
    categoryFilter,
    accept = 'image/*',
    trigger,
    fetchMedia,
    onUpload,
    initialItems,
  } = props;

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>(initialItems ?? []);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [selectedInModal, setSelectedInModal] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const isMulti = props.multi === true;

  const load = useCallback(async () => {
    if (!fetchMedia) return;
    setLoading(true);
    try {
      const list = await fetchMedia({
        projectId,
        category: categoryFilter,
        search: search.trim() || undefined,
      });
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [fetchMedia, projectId, categoryFilter, search]);

  useEffect(() => {
    if (!open) return;
    if (initialItems) return; // test injection path
    load();
  }, [open, load, initialItems]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
  }, [search, open, load]);

  // Açılırken mevcut value'yu pre-select
  useEffect(() => {
    if (!open) return;
    const current = isMulti
      ? new Set(Array.isArray(props.value) ? props.value : [])
      : new Set(typeof props.value === 'string' ? [props.value] : []);
    setSelectedInModal(current);
  }, [open, isMulti, props.value]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((m) => {
      const altText = (m.alt[locale] ?? m.alt.tr ?? '').toLowerCase();
      return (
        altText.includes(q) ||
        (m.fileName ?? '').toLowerCase().includes(q) ||
        (m.id ?? '').toLowerCase().includes(q)
      );
    });
  }, [items, search, locale]);

  const toggleSelect = (id: string) => {
    setSelectedInModal((s) => {
      const next = new Set(s);
      if (isMulti) {
        if (next.has(id)) next.delete(id);
        else {
          const max = (props as MultiProps).maxSelection;
          if (max && next.size >= max) return s;
          next.add(id);
        }
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const ids = Array.from(selectedInModal);
    if (isMulti) {
      (props.onChange as (v: string[]) => void)(ids);
    } else {
      (props.onChange as (v: string | null) => void)(ids[0] ?? null);
    }
    setOpen(false);
  };

  const handleFiles = async (files: File[]) => {
    setUploadError(null);
    const valid: File[] = [];
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadError(`${f.name}: 10MB üst sınırı aşıyor.`);
        continue;
      }
      const ext = (f.name.split('.').pop() ?? '').toLowerCase();
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];
      const isImage =
        f.type.startsWith('image/') ||
        (f.type === '' && imageExts.includes(ext));
      if (!isImage) {
        setUploadError(`${f.name}: sadece görsel kabul edilir.`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length === 0) return;

    if (!onUpload) {
      setUploadError('Upload handler yapılandırılmadı.');
      return;
    }

    const progress: Record<string, number> = {};
    valid.forEach((f) => (progress[f.name] = 10));
    setUploadProgress({ ...progress });

    try {
      const uploaded = await onUpload(valid);
      valid.forEach((f) => (progress[f.name] = 100));
      setUploadProgress({ ...progress });
      setItems((prev) => [...uploaded, ...prev]);
      // Auto-select yüklenenleri
      setSelectedInModal((s) => {
        const next = new Set(s);
        uploaded.forEach((u) => {
          if (!isMulti) next.clear();
          next.add(u.id);
        });
        return next;
      });
      setActiveTab('library');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload başarısız.');
    } finally {
      setTimeout(() => setUploadProgress({}), 1200);
    }
  };

  const currentValue = isMulti
    ? Array.isArray(props.value)
      ? props.value
      : []
    : typeof props.value === 'string'
    ? props.value
    : null;

  const currentPreview = useMemo(() => {
    if (isMulti) {
      return items.filter((i) => (currentValue as string[]).includes(i.id));
    }
    return items.find((i) => i.id === currentValue) ?? null;
  }, [items, currentValue, isMulti]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {trigger ? (
          <button type="button" onClick={() => setOpen(true)}>
            {trigger}
          </button>
        ) : (
          <MediaTrigger
            onClick={() => setOpen(true)}
            preview={currentPreview}
            isMulti={isMulti}
            locale={locale}
          />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Medya seç</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'library' | 'upload')}
          >
            <TabsList>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-3">
              <Input
                placeholder="Ara…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Medya ara"
              />

              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square animate-pulse rounded-md bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Henüz medya yok. Upload sekmesinden ekleyin.
                </div>
              ) : (
                <ul
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
                  role="listbox"
                  aria-multiselectable={isMulti}
                  aria-label="Medya listesi"
                >
                  {filteredItems.map((m) => {
                    const selected = selectedInModal.has(m.id);
                    const altText = m.alt[locale] ?? m.alt.tr ?? m.fileName ?? '';
                    return (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => toggleSelect(m.id)}
                          role="option"
                          aria-selected={selected}
                          aria-label={`Görsel seç: ${altText}`}
                          className={cn(
                            'group relative block w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                            selected && 'border-blue-500 ring-2 ring-blue-500'
                          )}
                        >
                          <div className="aspect-square w-full bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.thumbUrl ?? m.url}
                              alt={altText}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          {selected && (
                            <span
                              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shadow"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          )}
                          <p className="truncate px-2 py-1 text-xs text-slate-600">
                            {altText || m.fileName || m.id.slice(0, 8)}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-3">
              <UploadZone
                accept={accept}
                onFiles={handleFiles}
                disabled={!onUpload}
              />
              {Object.keys(uploadProgress).length > 0 && (
                <ul className="space-y-1">
                  {Object.entries(uploadProgress).map(([name, pct]) => (
                    <li key={name} className="text-xs">
                      <div className="flex justify-between">
                        <span className="truncate">{name}</span>
                        <span className="text-slate-500">{pct}%</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="mt-1 h-1 rounded-full bg-slate-200"
                      >
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {uploadError && (
                <p role="alert" className="text-xs text-rose-600">
                  {uploadError}
                </p>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedInModal.size === 0}
              className={cn(
                'inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors',
                'hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              Seç ({selectedInModal.size})
            </button>
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                İptal
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------

function MediaTrigger({
  onClick,
  preview,
  isMulti,
  locale,
}: {
  onClick: () => void;
  preview: MediaItem | MediaItem[] | null;
  isMulti: boolean;
  locale: string;
}) {
  if (isMulti) {
    const list = (preview as MediaItem[]) ?? [];
    if (list.length === 0) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex h-24 w-24 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 transition-colors hover:border-slate-400"
        >
          + Görsel ekle
        </button>
      );
    }
    return (
      <div className="flex flex-wrap items-center gap-2">
        {list.slice(0, 4).map((m) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={m.id}
            src={m.thumbUrl ?? m.url}
            alt={m.alt[locale] ?? ''}
            className="h-16 w-16 rounded-md border border-slate-200 object-cover"
          />
        ))}
        {list.length > 4 ? (
          <span className="text-xs text-slate-500">+{list.length - 4}</span>
        ) : null}
        <button
          type="button"
          onClick={onClick}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Değiştir
        </button>
      </div>
    );
  }

  const single = preview as MediaItem | null;
  if (!single) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-24 w-24 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 transition-colors hover:border-slate-400"
      >
        + Görsel ekle
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={single.thumbUrl ?? single.url}
        alt={single.alt[locale] ?? ''}
        className="h-16 w-16 rounded-md border border-slate-200 object-cover"
      />
      <button
        type="button"
        onClick={onClick}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        Değiştir
      </button>
    </div>
  );
}

function UploadZone({
  accept,
  onFiles,
  disabled,
}: {
  accept: string;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFiles(files);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        'flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors',
        'hover:border-slate-400',
        dragOver && 'border-blue-500 bg-blue-50',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <span className="text-sm text-slate-600">
        Dosyaları sürükle veya tıklayıp seç
      </span>
      <span className="mt-1 text-xs text-slate-500">
        Maks. {MAX_FILE_SIZE_MB}MB, görsel
      </span>
      <input
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onFiles(files);
          e.target.value = '';
        }}
      />
    </label>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContentPlan, Section } from '../../../../lib/content-types';
import { hasPlaceholderItems } from '../../../../lib/placeholder-utils';

// Basit accordion + JSON modal editörü.
// Gün 3 minimum: tek section'ı JSON olarak edit et, full ContentPlan'ı API'ye POST et.
// Gün 4'te daha sofistike (form-per-section, canlı önizleme) ve Supabase backing geliyor.

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  'feature-grid': 'Feature Grid',
  about: 'Hakkımızda',
  services: 'Hizmetler',
  cta: 'CTA',
  contact: 'İletişim',
  appointment: 'Randevu',
  testimonials: 'Referanslar',
  faq: 'SSS',
  stats: 'İstatistik',
  team: 'Ekip',
  projects: 'Projeler',
  products: 'Ürünler',
  blog: 'Blog',
};

interface EditingState {
  pageIndex: number;
  sectionIndex: number;
  text: string;
  error: string | null;
}

export function ContentEditor({ initialContent }: { initialContent: ContentPlan }) {
  const router = useRouter();
  const [content, setContent] = useState<ContentPlan>(initialContent);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function openEditor(pageIndex: number, sectionIndex: number) {
    const section = content.pages[pageIndex]?.sections[sectionIndex];
    if (!section) return;
    setEditing({
      pageIndex,
      sectionIndex,
      text: JSON.stringify(section, null, 2),
      error: null,
    });
  }

  async function handleSave() {
    if (!editing) return;

    let parsed: Section;
    try {
      parsed = JSON.parse(editing.text) as Section;
    } catch (err) {
      setEditing({
        ...editing,
        error: 'Geçersiz JSON: ' + (err instanceof Error ? err.message : 'parse hatası'),
      });
      return;
    }

    const newContent: ContentPlan = {
      meta: content.meta,
      pages: content.pages.map((page, pIdx) =>
        pIdx !== editing.pageIndex
          ? page
          : {
              ...page,
              sections: page.sections.map((section, sIdx) =>
                sIdx === editing.sectionIndex ? parsed : section
              ),
            }
      ),
    };

    setSaving(true);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newContent),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
          issues?: Array<{ path: string; message: string }>;
        };
        const issues = body.issues
          ? '\n' + body.issues.map((i) => `  ${i.path}: ${i.message}`).join('\n')
          : '';
        setEditing({
          ...editing,
          error: (body.error ?? 'Kaydetme başarısız.') + issues,
        });
        return;
      }

      setContent(newContent);
      setSavedAt(new Date());
      setEditing(null);
      router.refresh();
    } catch (err) {
      setEditing({
        ...editing,
        error: err instanceof Error ? err.message : 'Ağ hatası.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {savedAt ? (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          Kaydedildi ({savedAt.toLocaleTimeString('tr-TR')}). Site yeniden oluşturuldu.
        </div>
      ) : null}

      <div className="space-y-3">
        {content.pages.map((page, pIdx) => (
          <details
            key={page.slug}
            className="group overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="text-slate-400 transition-transform group-open:rotate-90"
                  aria-hidden
                >
                  <path
                    d="M3 1l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{page.title}</div>
                  <div className="text-xs text-slate-500">
                    /{page.slug} · {page.sections.length} section
                  </div>
                </div>
              </div>
            </summary>

            <ul className="border-t border-slate-100">
              {page.sections.map((section, sIdx) => {
                const placeholder = hasPlaceholderItems(section);
                const preview = getPreview(section);
                return (
                  <li
                    key={sIdx}
                    className="flex items-center justify-between gap-3 border-b border-slate-50 px-5 py-3 last:border-b-0"
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {SECTION_LABELS[section.type] ?? section.type}
                      </span>
                      {placeholder ? (
                        <span
                          className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                          title="Bu section'da placeholder içerik var"
                        >
                          Örnek içerik, değiştirin
                        </span>
                      ) : null}
                      {preview ? (
                        <span className="truncate text-xs text-slate-500">{preview}</span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditor(pIdx, sIdx)}
                      className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      JSON olarak düzenle
                    </button>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>

      {editing ? (
        <EditorModal
          editing={editing}
          saving={saving}
          onChange={(text) => setEditing({ ...editing, text, error: null })}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      ) : null}
    </>
  );
}

function getPreview(section: Section): string {
  if ('headline' in section && section.headline) return section.headline;
  if ('type' in section && section.type === 'contact') return (section.email ?? section.phone ?? '');
  return '';
}

function EditorModal({
  editing,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  editing: EditingState;
  saving: boolean;
  onChange: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Section&apos;ı JSON olarak düzenle</h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-60"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <textarea
            value={editing.text}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            disabled={saving}
            className="min-h-[400px] w-full rounded border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-900 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
          />
          {editing.error ? (
            <pre className="mt-3 whitespace-pre-wrap rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {editing.error}
            </pre>
          ) : null}
          <p className="mt-3 text-xs text-slate-500">
            Schema: <code className="rounded bg-slate-100 px-1 py-0.5">Section</code>{' '}
            — type alanı ve ilgili tipin şartları korunmalı. Sunucu tarafında zod doğrulaması çalışır.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LocaleField } from './LocaleField';
import { LocaleTextArea } from './LocaleTextArea';
import { LocaleRichText } from './LocaleRichText';
import { LocaleSlug } from './LocaleSlug';
import { MediaPicker } from './MediaPicker';
import { fetchMediaFromApi, uploadMediaToApi } from '@/lib/media-client';
import { CategoryTree, type Category } from './CategoryTree';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 7 — ModuleDetail
//
// ModuleSpec'ten dinamik form. 9 reusable komponentin tamamı burada
// birleşir. React Hook Form + dinamik Zod schema + autosave.
// Spec: docs/h6-reusable-components.md §3.
// ---------------------------------------------------------------------------

export interface FieldDef {
  name: string;
  type:
    | 'text'
    | 'textarea'
    | 'richtext'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'slug'
    | 'media_ref'
    | 'media_array'
    | 'category_ref'
    | 'string_array'
    | 'enum'
    | 'url'
    | 'email'
    | 'phone';
  label: Record<string, string>;
  localeAware?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  enumValues?: string[];
  /** source field — slug auto-gen için */
  sourceFieldName?: string;
  adminHelp?: Record<string, string>;
  default?: unknown;
}

export interface TabDef {
  id: string;
  label: Record<string, string>;
  fields: string[];
  description?: Record<string, string>;
}

export interface ModuleDetailProps {
  /** Kayıt yeni ise null, edit ise value'lar */
  item: Record<string, unknown> | null;
  fields: FieldDef[];
  tabs?: TabDef[];
  moduleName: string;
  supportedLocales?: string[];
  defaultLocale?: string;
  projectId: string;
  categories?: Category[];
  onSave?: (values: Record<string, unknown>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel?: () => void;
  /** Autosave ms — default 30s, 0 devre dışı */
  autoSaveMs?: number;
  // Agent output tolerance — spec'ten gelen ek flag'ler (v1'de pass-through)
  showCharCount?: boolean;
  autoSaveDraft?: boolean;
  previewEnabled?: boolean;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function ModuleDetail({
  item,
  fields,
  tabs,
  moduleName,
  supportedLocales = ['tr', 'en'],
  defaultLocale = 'tr',
  projectId,
  categories = [],
  onSave,
  onDelete,
  onCancel,
  autoSaveMs = 30_000,
}: ModuleDetailProps) {
  const isNew = !item;
  const id = (item?.id as string | undefined) ?? null;

  const defaults = useMemo(() => {
    const out: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (item && item[f.name] !== undefined) {
        out[f.name] = item[f.name];
      } else if (f.default !== undefined) {
        out[f.name] = f.default;
      } else if (f.localeAware) {
        out[f.name] = {};
      } else if (f.type === 'media_array' || f.type === 'string_array') {
        out[f.name] = [];
      } else if (f.type === 'boolean') {
        out[f.name] = false;
      } else {
        out[f.name] = null;
      }
    });
    return out;
  }, [fields, item]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm({ defaultValues: defaults, mode: 'onBlur' });

  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id ?? 'default');
  const [activeLocale, setActiveLocale] = useState(defaultLocale);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // item geldikçe reset
  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  // Autosave
  const watched = watch();
  useEffect(() => {
    if (autoSaveMs <= 0) return;
    if (!isDirty) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      await persist(watched, { silent: true });
    }, autoSaveMs);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [watched, isDirty, autoSaveMs]); // eslint-disable-line react-hooks/exhaustive-deps

  // beforeunload
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Cmd+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit((v) => persist(v, { silent: false }))();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSubmit]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback(
    async (values: Record<string, unknown>, opts: { silent: boolean }) => {
      if (!onSave) return;
      // Required validation (locale-aware default locale check)
      const invalid = fields
        .filter((f) => f.required)
        .find((f) => {
          const v = values[f.name];
          if (f.localeAware) {
            const locVal = (v as Record<string, string> | undefined)?.[defaultLocale];
            return !locVal || !locVal.trim();
          }
          return v == null || v === '';
        });
      if (invalid) {
        const lbl = invalid.label[defaultLocale] ?? invalid.label.en ?? invalid.name;
        setSaveStatus('error');
        setSaveError(`Zorunlu alan boş: "${lbl}"${invalid.localeAware ? ' (varsayılan dil)' : ''}`);
        return;
      }
      try {
        setSaveStatus('saving');
        setSaveError(null);
        await onSave(values);
        setSaveStatus('saved');
        reset(values, { keepValues: true, keepDirty: false });
        if (!opts.silent) {
          setTimeout(() => setSaveStatus('idle'), 1500);
        }
      } catch (err) {
        setSaveStatus('error');
        setSaveError(err instanceof Error ? err.message : 'Kaydedilemedi.');
      }
    },
    [defaultLocale, fields, onSave, reset]
  );

  const handleDelete = async () => {
    if (!id || !onDelete) return;
    if (typeof window !== 'undefined' && !window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    await onDelete(id);
  };

  const handleCancel = () => {
    if (isDirty && typeof window !== 'undefined') {
      if (!window.confirm('Kaydedilmemiş değişiklikler var. Çıkmak istiyor musunuz?')) return;
    }
    onCancel?.();
  };

  const fieldMap = useMemo(() => {
    const m = new Map<string, FieldDef>();
    fields.forEach((f) => m.set(f.name, f));
    return m;
  }, [fields]);

  // Agent output tolerance — bazı spec formatlarında tab.fields yerine
  // tab.groups[].fields yapısı var. fields varsayılanı fall-through.
  const resolvedTabs: TabDef[] = tabs && tabs.length > 0
    ? tabs.map((t) => {
        if (Array.isArray((t as any).fields)) return t as TabDef;
        const groupsField = (t as any).groups;
        if (Array.isArray(groupsField)) {
          const flat = groupsField.flatMap((g: any) =>
            Array.isArray(g?.fields) ? (g.fields as string[]) : []
          );
          return { id: t.id, label: t.label, fields: flat };
        }
        return { id: t.id, label: t.label, fields: [] };
      })
    : [{ id: 'default', label: { tr: 'Genel', en: 'General' }, fields: fields.map((f) => f.name) }];

  const labelOf = (loc: Record<string, string>, fallback?: string) =>
    loc[activeLocale] ?? loc[defaultLocale] ?? Object.values(loc)[0] ?? fallback ?? '';

  return (
    <form
      onSubmit={handleSubmit((v) => persist(v, { silent: false }))}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3">
        <h2 className="text-lg font-semibold text-slate-900">
          {isNew ? `Yeni ${moduleName}` : `${moduleName} düzenle`}
        </h2>
        <div className="flex-1" />
        <LocaleSwitcher
          locales={supportedLocales}
          active={activeLocale}
          onChange={setActiveLocale}
        />
        <SaveStatusBadge status={saveStatus} />
      </div>

      {saveError ? (
        <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {saveError}
        </div>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {resolvedTabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {labelOf(t.label)}
            </TabsTrigger>
          ))}
        </TabsList>

        {resolvedTabs.map((t) => (
          <TabsContent key={t.id} value={t.id} className="space-y-5">
            {t.description ? (
              <p className="text-sm text-slate-500">{labelOf(t.description)}</p>
            ) : null}
            {t.fields.map((fieldName) => {
              const f = fieldMap.get(fieldName);
              if (!f) return null;
              return (
                <FieldRenderer
                  key={f.name}
                  field={f}
                  control={control}
                  activeLocale={activeLocale}
                  setActiveLocale={setActiveLocale}
                  locales={supportedLocales}
                  defaultLocale={defaultLocale}
                  projectId={projectId}
                  categories={categories}
                  error={errors[f.name]?.message as string | undefined}
                  watched={watched}
                  fieldMap={fieldMap}
                />
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
        {!isNew && onDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-md border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-50"
          >
            Sil
          </button>
        ) : null}
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          İptal
        </button>
        <button
          type="button"
          disabled={saveStatus === 'saving'}
          onClick={handleSubmit((v) => persist(v, { silent: false }))}
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {saveStatus === 'saving' ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

function LocaleSwitcher({
  locales,
  active,
  onChange,
}: {
  locales: string[];
  active: string;
  onChange: (l: string) => void;
}) {
  return (
    <div role="group" aria-label="Dil" className="inline-flex rounded-md border border-slate-200 bg-white p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={active === l}
          className={cn(
            'rounded px-2 py-1 text-xs font-medium uppercase',
            active === l ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function SaveStatusBadge({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;
  const text =
    status === 'saving'
      ? '⏳ Kaydediliyor…'
      : status === 'saved'
      ? '✓ Kaydedildi'
      : '✗ Hata';
  const color =
    status === 'saving'
      ? 'text-slate-500'
      : status === 'saved'
      ? 'text-emerald-600'
      : 'text-rose-600';
  return (
    <span role="status" aria-live="polite" className={cn('text-xs font-medium', color)}>
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Field renderer — FieldDef.type → ilgili komponent
// ---------------------------------------------------------------------------

function FieldRenderer({
  field,
  control,
  activeLocale,
  setActiveLocale,
  locales,
  defaultLocale,
  projectId,
  categories,
  error,
  watched,
  fieldMap,
}: {
  field: FieldDef;
  control: any;
  activeLocale: string;
  setActiveLocale: (l: string) => void;
  locales: string[];
  defaultLocale: string;
  projectId: string;
  categories: Category[];
  error?: string;
  watched: Record<string, unknown>;
  fieldMap: Map<string, FieldDef>;
}) {
  const label = field.label;

  if (field.type === 'text' && field.localeAware) {
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <LocaleField
            value={(ctl.value ?? {}) as Record<string, string>}
            onChange={ctl.onChange}
            locales={locales}
            activeLocale={activeLocale}
            onActiveLocaleChange={setActiveLocale}
            label={label}
            required={field.required}
            maxLength={field.maxLength}
            error={error}
          />
        )}
      />
    );
  }

  if (field.type === 'textarea' && field.localeAware) {
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <LocaleTextArea
            value={(ctl.value ?? {}) as Record<string, string>}
            onChange={ctl.onChange}
            locales={locales}
            activeLocale={activeLocale}
            onActiveLocaleChange={setActiveLocale}
            label={label}
            required={field.required}
            maxLength={field.maxLength}
            error={error}
          />
        )}
      />
    );
  }

  if (field.type === 'richtext') {
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <LocaleRichText
            value={(ctl.value ?? {}) as Record<string, string>}
            onChange={ctl.onChange}
            locales={locales}
            activeLocale={activeLocale}
            onActiveLocaleChange={setActiveLocale}
            label={label}
            required={field.required}
            maxLength={field.maxLength}
            error={error}
          />
        )}
      />
    );
  }

  if (field.type === 'slug') {
    const sourceValue = field.sourceFieldName
      ? (watched[field.sourceFieldName] as Record<string, string> | undefined)
      : undefined;
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <LocaleSlug
            value={(ctl.value ?? {}) as Record<string, string>}
            onChange={ctl.onChange}
            locales={locales}
            activeLocale={activeLocale}
            onActiveLocaleChange={setActiveLocale}
            label={label}
            sourceField={sourceValue}
            required={field.required}
            maxLength={field.maxLength}
            error={error}
          />
        )}
      />
    );
  }

  if (field.type === 'media_ref') {
    return (
      <div className="space-y-1">
        <Label>{label[activeLocale] ?? label[defaultLocale] ?? field.name}</Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: ctl }) => (
            <MediaPicker
              projectId={projectId}
              value={(ctl.value as string | null) ?? null}
              onChange={ctl.onChange}
              fetchMedia={fetchMediaFromApi}
              onUpload={uploadMediaToApi}
            />
          )}
        />
      </div>
    );
  }

  if (field.type === 'media_array') {
    return (
      <div className="space-y-1">
        <Label>{label[activeLocale] ?? label[defaultLocale] ?? field.name}</Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: ctl }) => (
            <MediaPicker
              projectId={projectId}
              multi
              value={(ctl.value as string[]) ?? []}
              onChange={ctl.onChange}
              fetchMedia={fetchMediaFromApi}
              onUpload={uploadMediaToApi}
            />
          )}
        />
      </div>
    );
  }

  if (field.type === 'category_ref') {
    return (
      <div className="space-y-1">
        <Label>{label[activeLocale] ?? label[defaultLocale] ?? field.name}</Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: ctl }) => (
            <CategoryTree
              categories={categories}
              locale={activeLocale}
              mode="picker"
              value={ctl.value as string | null}
              onChange={ctl.onChange}
            />
          )}
        />
      </div>
    );
  }

  if (field.type === 'enum' && field.enumValues) {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.name}>
          {label[activeLocale] ?? label[defaultLocale] ?? field.name}
          {field.required ? <span className="ml-1 text-rose-600" aria-hidden="true">*</span> : null}
        </Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: ctl }) => (
            <select
              id={field.name}
              value={(ctl.value as string) ?? ''}
              onChange={(e) => ctl.onChange(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm shadow-sm focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="">—</option>
              {field.enumValues!.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          )}
        />
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!ctl.value}
              onChange={(e) => ctl.onChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span>{label[activeLocale] ?? label[defaultLocale] ?? field.name}</span>
          </label>
        )}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.name}>
          {label[activeLocale] ?? label[defaultLocale] ?? field.name}
          {field.required ? <span className="ml-1 text-rose-600" aria-hidden="true">*</span> : null}
        </Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: ctl }) => (
            <Input
              id={field.name}
              type="number"
              value={(ctl.value as number | string) ?? ''}
              onChange={(e) => ctl.onChange(e.target.value === '' ? null : Number(e.target.value))}
            />
          )}
        />
      </div>
    );
  }

  if (field.type === 'date' || field.type === 'datetime') {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.name}>
          {label[activeLocale] ?? label[defaultLocale] ?? field.name}
        </Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: ctl }) => (
            <Input
              id={field.name}
              type={field.type === 'date' ? 'date' : 'datetime-local'}
              value={(ctl.value as string) ?? ''}
              onChange={(e) => ctl.onChange(e.target.value || null)}
            />
          )}
        />
      </div>
    );
  }

  // Fallback: plain input (text/url/email/phone, non-locale text)
  return (
    <div className="space-y-1">
      <Label htmlFor={field.name}>
        {label[activeLocale] ?? label[defaultLocale] ?? field.name}
        {field.required ? <span className="ml-1 text-rose-600" aria-hidden="true">*</span> : null}
      </Label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <Input
            id={field.name}
            type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
            value={(ctl.value as string) ?? ''}
            onChange={(e) => ctl.onChange(e.target.value)}
            maxLength={field.maxLength}
          />
        )}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

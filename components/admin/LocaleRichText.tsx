'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 3 — LocaleRichText
//
// Multi-language Tiptap editor. Her locale kendi editor instance — aktif
// olan `useEditor` hook'u ile mount, diğer locale içerikleri parent state'te.
// Spec: docs/h6-reusable-components.md §8.
// ---------------------------------------------------------------------------

export type RichTextFeature =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'heading-2'
  | 'heading-3'
  | 'bullet-list'
  | 'ordered-list'
  | 'blockquote'
  | 'code-block'
  | 'link'
  | 'image'
  | 'youtube';

const DEFAULT_FEATURES: RichTextFeature[] = [
  'bold',
  'italic',
  'heading-2',
  'heading-3',
  'bullet-list',
  'ordered-list',
  'blockquote',
  'link',
];

interface LocaleRichTextProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  locales: string[];
  activeLocale: string;
  onActiveLocaleChange: (locale: string) => void;
  label: Record<string, string>;
  features?: RichTextFeature[];
  maxLength?: number;
  mediaPickerEnabled?: boolean;
  onRequestImage?: () => Promise<string | null>;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function LocaleRichText({
  value,
  onChange,
  locales,
  activeLocale,
  onActiveLocaleChange,
  label,
  features = DEFAULT_FEATURES,
  maxLength,
  mediaPickerEnabled = false,
  onRequestImage,
  required = false,
  error,
  disabled,
  placeholder,
}: LocaleRichTextProps) {
  const editorId = useId();
  const errorId = `${editorId}-error`;
  const counterId = `${editorId}-counter`;

  const defaultLocale = locales[0] ?? 'tr';
  const currentLabel =
    label[activeLocale] ?? label[defaultLocale] ?? Object.values(label)[0] ?? '';

  const valueRef = useRef(value);
  valueRef.current = value;

  const extensions = useMemo(() => {
    const exts: any[] = [StarterKit.configure({})];
    if (features.includes('link')) {
      exts.push(Link.configure({ openOnClick: false, autolink: false }));
    }
    if (features.includes('image')) {
      exts.push(Image);
    }
    if (features.includes('youtube')) {
      exts.push(Youtube);
    }
    return exts;
  }, [features.join(',')]);

  const editor = useEditor(
    {
      extensions,
      content: value[activeLocale] ?? '',
      editable: !disabled,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange({ ...valueRef.current, [activeLocale]: html });
      },
      editorProps: {
        attributes: {
          class: cn(
            'prose prose-sm max-w-none min-h-[160px] px-3 py-2',
            'focus:outline-none',
            disabled && 'opacity-50 cursor-not-allowed'
          ),
          'aria-label': currentLabel,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby':
            [error ? errorId : null, maxLength ? counterId : null]
              .filter(Boolean)
              .join(' ') || '',
        },
      },
    },
    [activeLocale, extensions, disabled]
  );

  // Locale switch — yeni locale'in HTML'ini editor'a yükle
  useEffect(() => {
    if (!editor) return;
    const next = value[activeLocale] ?? '';
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [activeLocale, editor]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasValue = useCallback(
    (locale: string) => {
      const v = value[locale];
      if (typeof v !== 'string') return false;
      // HTML'den plain text extract — boşluk kontrolü
      const text = v.replace(/<[^>]*>/g, '').trim();
      return text.length > 0;
    },
    [value]
  );

  const plainLength = useMemo(() => {
    const html = value[activeLocale] ?? '';
    return html.replace(/<[^>]*>/g, '').length;
  }, [value, activeLocale]);

  return (
    <div className="space-y-2">
      <Label>
        {currentLabel}
        {required ? (
          <span className="ml-1 text-rose-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>

      <Tabs value={activeLocale} onValueChange={onActiveLocaleChange}>
        <TabsList>
          {locales.map((locale) => {
            const filled = hasValue(locale);
            const needsFill = required && locale === defaultLocale && !filled;
            return (
              <TabsTrigger
                key={locale}
                value={locale}
                disabled={disabled}
                className="gap-1.5"
                aria-label={`${locale.toUpperCase()} — ${
                  filled ? 'dolu' : needsFill ? 'eksik (zorunlu)' : 'boş'
                }`}
              >
                <span>{locale.toUpperCase()}</span>
                {filled ? (
                  <span className="text-emerald-600" aria-hidden="true">
                    ✓
                  </span>
                ) : needsFill ? (
                  <span className="text-amber-600" aria-hidden="true">
                    ⚠
                  </span>
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div
        className={cn(
          'overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm',
          error && 'border-rose-500',
          disabled && 'opacity-70'
        )}
      >
        <Toolbar
          editor={editor}
          features={features}
          disabled={disabled}
          mediaPickerEnabled={mediaPickerEnabled}
          onRequestImage={onRequestImage}
        />
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {(error || maxLength) && (
        <div className="flex items-center justify-between text-xs">
          {error ? (
            <span id={errorId} role="alert" className="text-rose-600">
              {error}
            </span>
          ) : (
            <span />
          )}
          {maxLength ? (
            <span
              id={counterId}
              className={cn(
                'text-slate-500',
                plainLength >= maxLength * 0.9 && 'text-amber-600',
                plainLength >= maxLength && 'text-rose-600'
              )}
            >
              {plainLength}/{maxLength}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toolbar — feature set'e göre buton render
// ---------------------------------------------------------------------------

function Toolbar({
  editor,
  features,
  disabled,
  mediaPickerEnabled,
  onRequestImage,
}: {
  editor: Editor | null;
  features: RichTextFeature[];
  disabled?: boolean;
  mediaPickerEnabled?: boolean;
  onRequestImage?: () => Promise<string | null>;
}) {
  const is = (name: string, opts?: Record<string, unknown>) =>
    editor?.isActive(name, opts as any) ?? false;

  const btn = (active: boolean) =>
    cn(
      'inline-flex h-7 min-w-[28px] items-center justify-center rounded px-1.5 text-xs font-medium',
      'text-slate-600 transition-colors hover:bg-slate-100',
      'disabled:cursor-not-allowed disabled:opacity-50',
      active && 'bg-slate-200 text-slate-900'
    );

  const can = (fn: () => boolean) => {
    try {
      return fn();
    } catch {
      return false;
    }
  };

  const onLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Link URL', editor.getAttributes('link').href ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const onImage = useCallback(async () => {
    if (!editor) return;
    if (mediaPickerEnabled && onRequestImage) {
      const src = await onRequestImage();
      if (src) editor.chain().focus().setImage({ src }).run();
      return;
    }
    const src = window.prompt('Image URL');
    if (src) editor.chain().focus().setImage({ src }).run();
  }, [editor, mediaPickerEnabled, onRequestImage]);

  return (
    <div
      role="toolbar"
      aria-label="Metin biçimlendirme"
      className="flex flex-wrap gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1"
    >
      {features.includes('bold') && (
        <button
          type="button"
          disabled={disabled || !editor || !can(() => editor.can().toggleBold())}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={btn(is('bold'))}
          aria-label="Kalın"
          aria-pressed={is('bold')}
        >
          <strong>B</strong>
        </button>
      )}
      {features.includes('italic') && (
        <button
          type="button"
          disabled={disabled || !editor || !can(() => editor.can().toggleItalic())}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={btn(is('italic'))}
          aria-label="Eğik"
          aria-pressed={is('italic')}
        >
          <em>I</em>
        </button>
      )}
      {features.includes('strike') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={btn(is('strike'))}
          aria-label="Üstü çizili"
          aria-pressed={is('strike')}
        >
          S
        </button>
      )}
      {features.includes('heading-2') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(is('heading', { level: 2 }))}
          aria-label="Başlık 2"
          aria-pressed={is('heading', { level: 2 })}
        >
          H2
        </button>
      )}
      {features.includes('heading-3') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btn(is('heading', { level: 3 }))}
          aria-label="Başlık 3"
          aria-pressed={is('heading', { level: 3 })}
        >
          H3
        </button>
      )}
      {features.includes('bullet-list') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={btn(is('bulletList'))}
          aria-label="Madde listesi"
          aria-pressed={is('bulletList')}
        >
          •
        </button>
      )}
      {features.includes('ordered-list') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={btn(is('orderedList'))}
          aria-label="Numaralı liste"
          aria-pressed={is('orderedList')}
        >
          1.
        </button>
      )}
      {features.includes('blockquote') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={btn(is('blockquote'))}
          aria-label="Alıntı"
          aria-pressed={is('blockquote')}
        >
          ❝
        </button>
      )}
      {features.includes('code-block') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={btn(is('codeBlock'))}
          aria-label="Kod bloğu"
          aria-pressed={is('codeBlock')}
        >
          {'</>'}
        </button>
      )}
      {features.includes('link') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={onLink}
          className={btn(is('link'))}
          aria-label="Bağlantı"
          aria-pressed={is('link')}
        >
          🔗
        </button>
      )}
      {features.includes('image') && (
        <button
          type="button"
          disabled={disabled || !editor}
          onClick={onImage}
          className={btn(false)}
          aria-label="Görsel ekle"
        >
          🖼
        </button>
      )}
    </div>
  );
}

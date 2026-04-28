'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { ContentPlan } from '../../../../lib/content-types';

type Tab = 'brand' | 'admin' | 'advanced';

interface SettingsClientProps {
  initialContent: ContentPlan;
  tenantId: string;
  projectId: string;
}

export function SettingsClient({ initialContent, tenantId, projectId }: SettingsClientProps) {
  const [tab, setTab] = useState<Tab>('brand');

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-slate-200">
        <TabButton active={tab === 'brand'} onClick={() => setTab('brand')}>
          Marka
        </TabButton>
        <TabButton active={tab === 'admin'} onClick={() => setTab('admin')}>
          Admin
        </TabButton>
        <TabButton active={tab === 'advanced'} onClick={() => setTab('advanced')}>
          Gelişmiş
        </TabButton>
      </div>

      <div className="pt-4">
        {tab === 'brand' ? <BrandTab initialContent={initialContent} /> : null}
        {tab === 'admin' ? <AdminTab /> : null}
        {tab === 'advanced' ? (
          <AdvancedTab tenantId={tenantId} projectId={projectId} />
        ) : null}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-blue-600 text-blue-700'
          : 'border-transparent text-slate-600 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

function BrandTab({ initialContent }: { initialContent: ContentPlan }) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(initialContent.meta.companyName);
  const [tagline, setTagline] = useState(initialContent.meta.tagline);
  const [description, setDescription] = useState(initialContent.meta.description);
  const [language, setLanguage] = useState<'tr' | 'en'>(initialContent.meta.language);
  const [footerAbout, setFooterAbout] = useState(initialContent.meta.footer.about);
  const [footerCopyright, setFooterCopyright] = useState(initialContent.meta.footer.copyright);

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);

    const updated: ContentPlan = {
      meta: {
        ...initialContent.meta,
        companyName: companyName.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        language,
        footer: {
          ...initialContent.meta.footer,
          about: footerAbout.trim(),
          copyright: footerCopyright.trim(),
        },
      },
      pages: initialContent.pages,
    };

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Kaydedilemedi.');
      }
      setSavedAt(new Date());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {savedAt ? (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Kaydedildi ({savedAt.toLocaleTimeString('tr-TR')}). Site yeniden oluşturuldu.
        </div>
      ) : null}
      {error ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Field label="Şirket adı" htmlFor="s-company">
        <input
          id="s-company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={saving}
          className={inputClass}
          required
          maxLength={120}
        />
      </Field>

      <Field label="Tagline" htmlFor="s-tagline" help="Logonun yanında / hero altında görünür">
        <input
          id="s-tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          disabled={saving}
          className={inputClass}
          required
          maxLength={200}
        />
      </Field>

      <Field
        label="SEO açıklaması"
        htmlFor="s-description"
        help="120-160 karakter. Google arama sonuçlarında görünür."
      >
        <textarea
          id="s-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving}
          className={`${inputClass} resize-none`}
          rows={3}
          required
          maxLength={300}
        />
      </Field>

      <Field label="Dil" htmlFor="s-language">
        <select
          id="s-language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'tr' | 'en')}
          disabled={saving}
          className={inputClass}
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </Field>

      <div className="border-t border-slate-200 pt-5">
        <h3 className="text-sm font-semibold text-slate-900">Footer</h3>

        <div className="mt-4 space-y-5">
          <Field label="Footer açıklaması" htmlFor="s-footer-about">
            <textarea
              id="s-footer-about"
              value={footerAbout}
              onChange={(e) => setFooterAbout(e.target.value)}
              disabled={saving}
              className={`${inputClass} resize-none`}
              rows={2}
              required
              maxLength={400}
            />
          </Field>

          <Field label="Copyright" htmlFor="s-footer-copyright">
            <input
              id="s-footer-copyright"
              value={footerCopyright}
              onChange={(e) => setFooterCopyright(e.target.value)}
              disabled={saving}
              className={inputClass}
              required
              maxLength={120}
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
        <p className="text-xs text-slate-500">
          Navigation, kolonlar ve sosyal medya bağlantıları için İçerik editörünü kullanın.
        </p>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

function AdminTab() {
  return (
    <div className="max-w-2xl space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">Şifre</h3>
        <p className="mt-3 text-sm text-slate-700">
          Şifreni <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env.local</code>
          {' '}dosyasındaki <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code>
          {' '}satırında bulabilirsin. Değişiklik yapmak için bu satırı değiştir ve sunucuyu
          yeniden başlat.
        </p>
        <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <strong>Not:</strong> UI üzerinden şifre değişimi Hafta 5&apos;te Supabase Auth (magic
          link) entegrasyonuyla gelecek. Şimdilik tek kullanıcı, tek şifre.
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">Oturum</h3>
        <p className="mt-3 text-sm text-slate-700">
          Aktif oturumu kapatmak için sol menüden <strong>Çıkış</strong>&apos;ı kullanın. Yeniden
          giriş yaparken aynı şifreyi sorar; session cookie 7 gün geçerlidir.
        </p>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Advanced
// ---------------------------------------------------------------------------

function AdvancedTab({ tenantId, projectId }: { tenantId: string; projectId: string }) {
  return (
    <div className="max-w-2xl space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">Proje kimliği</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <IdRow label="Tenant ID" value={tenantId || '(yok)'} />
          <IdRow label="Project ID" value={projectId || '(yok)'} />
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Bu değerler <code className="rounded bg-slate-100 px-1 py-0.5">.env.local</code>&apos;den
          okunuyor. Supabase üzerindeki CRM kayıtları bu ID&apos;ler ile filtrelenir.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">Content&apos;i sıfırla</h3>
        <p className="mt-3 text-sm text-slate-700">
          Admin panelden yaptığın içerik değişikliklerini geri alıp scaffolder-üretimli orijinale
          döndürür. Supabase&apos;teki <code className="rounded bg-slate-100 px-1 py-0.5">project_content</code>
          {' '}satırı silinir; site static fallback&apos;e düşer.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400"
        >
          Yakında (Gün 5)
        </button>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">Site&apos;yi yeniden üret</h3>
        <p className="mt-3 text-sm text-slate-700">
          Brief + görsele göre sıfırdan yeni bir site üretmek için studio monorepo&apos;sunda şu
          komutu çalıştırın:
        </p>
        <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
{`npm run agent -- build-site \\
  --image ./path/to/screenshot.png \\
  --brief "..." \\
  --industry "..." \\
  --project-slug ${projectId ? projectId.slice(0, 8) : '<slug>'}`}
        </pre>
      </section>
    </div>
  );
}

function IdRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5">
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-900">{value}</code>
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const inputClass =
  'w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 disabled:opacity-60';

function Field({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-900">
        {label}
      </label>
      {children}
      {help ? <p className="mt-1 text-xs text-slate-500">{help}</p> : null}
    </div>
  );
}

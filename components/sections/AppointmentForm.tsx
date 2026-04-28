'use client';

import { useMemo, useState } from 'react';
import { Sun, CloudSun, Sunset, Moon, type LucideIcon } from 'lucide-react';
import { AppointmentSubmitSchema, type TimeSlot } from '../../lib/crm-schemas';
import { content } from '../../lib/content';
import type { AppointmentSection } from '../../lib/content-types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const TIME_SLOTS: Array<{ value: TimeSlot; label: string; icon: LucideIcon }> = [
  { value: 'morning', label: 'Sabah', icon: Sun },
  { value: 'noon', label: 'Öğlen', icon: CloudSun },
  { value: 'afternoon', label: 'Öğleden sonra', icon: Sunset },
  { value: 'evening', label: 'Akşam', icon: Moon },
];

function defaultServicesFromContent(): string[] {
  for (const page of content.pages) {
    for (const section of page.sections) {
      if (section.type === 'services') {
        return section.items.map((item) => item.title);
      }
    }
  }
  return [];
}

function emptyToUndef(value: FormDataEntryValue | null): string | undefined {
  const s = (value ?? '').toString().trim();
  return s.length > 0 ? s : undefined;
}

export function AppointmentForm({ data }: { data: AppointmentSection }) {
  const services = data.services ?? defaultServicesFromContent();

  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { todayStr, maxDateStr } = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    now.setDate(now.getDate() + 60);
    const max = now.toISOString().slice(0, 10);
    return { todayStr: today, maxDateStr: max };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: (fd.get('name') ?? '').toString().trim(),
      email: emptyToUndef(fd.get('email')),
      phone: (fd.get('phone') ?? '').toString().trim(),
      service: emptyToUndef(fd.get('service')),
      preferredDate: (fd.get('preferredDate') ?? '').toString(),
      preferredTime: (fd.get('preferredTime') ?? '').toString(),
      notes: emptyToUndef(fd.get('notes')),
    };

    const parsed = AppointmentSubmitSchema.safeParse(payload);
    if (!parsed.success) {
      const issues: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !issues[key]) issues[key] = issue.message;
      }
      setFieldErrors(issues);
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Randevu gönderilemedi. Lütfen tekrar deneyin.');
      }

      setStatus('success');
      form.reset();
    } catch (error) {
      setStatus('error');
      setServerError(error instanceof Error ? error.message : 'Bilinmeyen hata.');
    }
  }

  const submitting = status === 'submitting';

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
            {data.subheadline ? (
              <p className="mt-4 text-[var(--color-muted)]">{data.subheadline}</p>
            ) : null}
          </div>

          {status === 'success' ? (
            <div
              className="mt-12 border border-[var(--color-border)] p-8 text-center"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <h3 className="text-xl font-medium text-[var(--color-foreground)]">
                Randevunuz alındı
              </h3>
              <p className="mt-3 text-[var(--color-muted)]">
                Sizinle 24 saat içinde iletişime geçeceğiz.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-6 text-sm text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                Yeni bir randevu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-5" noValidate>
              <Field label="İsim" htmlFor="appt-name" error={fieldErrors.name} required>
                <input
                  id="appt-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  disabled={submitting}
                  className={inputClass(fieldErrors.name)}
                  style={{ borderRadius: 'var(--radius)' }}
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Telefon"
                  htmlFor="appt-phone"
                  error={fieldErrors.phone}
                  required
                >
                  <input
                    id="appt-phone"
                    name="phone"
                    type="tel"
                    required
                    minLength={7}
                    maxLength={50}
                    disabled={submitting}
                    className={inputClass(fieldErrors.phone)}
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                </Field>

                <Field label="E-posta" htmlFor="appt-email" error={fieldErrors.email}>
                  <input
                    id="appt-email"
                    name="email"
                    type="email"
                    maxLength={200}
                    disabled={submitting}
                    className={inputClass(fieldErrors.email)}
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                </Field>
              </div>

              {services.length > 0 ? (
                <Field label="Hizmet" htmlFor="appt-service" error={fieldErrors.service}>
                  <select
                    id="appt-service"
                    name="service"
                    disabled={submitting}
                    defaultValue=""
                    className={inputClass(fieldErrors.service)}
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <option value="">(seçmeden de olur)</option>
                    {services.map((svc) => (
                      <option key={svc} value={svc}>
                        {svc}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              <Field
                label="Tercih edilen tarih"
                htmlFor="appt-date"
                error={fieldErrors.preferredDate}
                required
              >
                <input
                  id="appt-date"
                  name="preferredDate"
                  type="date"
                  required
                  min={todayStr}
                  max={maxDateStr}
                  disabled={submitting}
                  className={inputClass(fieldErrors.preferredDate)}
                  style={{ borderRadius: 'var(--radius)' }}
                />
              </Field>

              <fieldset>
                <legend className="mb-2 block text-sm font-medium">
                  Saat dilimi<span className="ml-0.5 text-[var(--color-accent)]">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {TIME_SLOTS.map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className="group flex cursor-pointer flex-col items-center gap-2 border border-[var(--color-border)] p-4 transition-colors has-[:checked]:border-[var(--color-accent)] has-[:checked]:bg-[var(--color-accent)]/5"
                      style={{ borderRadius: 'var(--radius)' }}
                    >
                      <input
                        type="radio"
                        name="preferredTime"
                        value={value}
                        required
                        disabled={submitting}
                        className="sr-only"
                      />
                      <Icon
                        className="h-5 w-5 text-[var(--color-muted)] group-has-[:checked]:text-[var(--color-accent)]"
                        strokeWidth={1.5}
                      />
                      <span className="text-sm text-[var(--color-foreground)]">{label}</span>
                    </label>
                  ))}
                </div>
                {fieldErrors.preferredTime ? (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.preferredTime}</p>
                ) : null}
              </fieldset>

              <Field label="Notunuz" htmlFor="appt-notes" error={fieldErrors.notes}>
                <textarea
                  id="appt-notes"
                  name="notes"
                  rows={3}
                  maxLength={2000}
                  disabled={submitting}
                  className={`${inputClass(fieldErrors.notes)} resize-none`}
                  style={{ borderRadius: 'var(--radius)' }}
                />
              </Field>

              {data.note ? (
                <p className="text-xs text-[var(--color-muted)]">{data.note}</p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  {submitting ? 'Gönderiliyor…' : 'Randevu Al'}
                </button>

                {status === 'error' && serverError ? (
                  <p className="text-sm text-red-600">{serverError}</p>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
        {required ? <span className="ml-0.5 text-[var(--color-accent)]">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function inputClass(error: string | undefined): string {
  const base =
    'w-full border bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)] disabled:opacity-60';
  return error
    ? `${base} border-red-600 focus:border-red-600`
    : `${base} border-[var(--color-border)]`;
}

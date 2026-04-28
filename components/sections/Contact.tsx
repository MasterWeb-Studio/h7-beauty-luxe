'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { ContactSection } from '../../lib/content-types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function Contact({ data }: { data: ContactSection }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? 'Form gönderilemedi.');
      }

      setStatus('success');
      form.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Bilinmeyen hata.');
    }
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
            {data.description ? (
              <p className="mt-4 text-[var(--color-muted)]">{data.description}</p>
            ) : null}

            <dl className="mt-10 space-y-4">
              {data.email ? (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.5} />
                  <div>
                    <dt className="sr-only">E-posta</dt>
                    <dd>
                      <a
                        href={`mailto:${data.email}`}
                        className="text-[var(--color-foreground)] hover:underline"
                      >
                        {data.email}
                      </a>
                    </dd>
                  </div>
                </div>
              ) : null}
              {data.phone ? (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.5} />
                  <div>
                    <dt className="sr-only">Telefon</dt>
                    <dd>
                      <a
                        href={`tel:${data.phone.replace(/\s/g, '')}`}
                        className="text-[var(--color-foreground)] hover:underline"
                      >
                        {data.phone}
                      </a>
                    </dd>
                  </div>
                </div>
              ) : null}
              {data.address ? (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-[var(--color-accent)]" strokeWidth={1.5} />
                  <div>
                    <dt className="sr-only">Adres</dt>
                    <dd className="text-[var(--color-foreground)]">{data.address}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </div>

          {data.formEnabled ? (
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
                    İsim
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    disabled={status === 'submitting'}
                    className="w-full border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)] disabled:opacity-60"
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
                    E-posta
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    disabled={status === 'submitting'}
                    className="w-full border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)] disabled:opacity-60"
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
                    Mesaj
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    disabled={status === 'submitting'}
                    className="w-full resize-none border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)] disabled:opacity-60"
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-center bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  {status === 'submitting' ? 'Gönderiliyor…' : 'Gönder'}
                </button>

                {status === 'success' ? (
                  <p className="text-sm text-[var(--color-accent)]">
                    Mesajın alındı. En kısa sürede dönüş yapılacak.
                  </p>
                ) : null}
                {status === 'error' ? (
                  <p className="text-sm text-red-600">
                    {errorMessage ?? 'Bir şeyler ters gitti.'}
                  </p>
                ) : null}
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

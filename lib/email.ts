// ---------------------------------------------------------------------------
// H5 Ayak C Gün 3 — Resend email helper.
//
// Kullanım: await sendEmail({ to, subject, html, text? })
// Env gereklidir: RESEND_API_KEY + STUDIO_EMAIL_FROM. Eksikse skip (error
// değil) — ticket INSERT'ü bozmamalı. Hata durumlarında { ok: false, reason }.
// ---------------------------------------------------------------------------

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  reason?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.STUDIO_EMAIL_FROM ?? 'notifications@resend.dev';

  if (!apiKey || !apiKey.trim()) {
    return { ok: false, reason: 'RESEND_API_KEY yok (skip)' };
  }
  if (!input.to || !input.to.trim()) {
    return { ok: false, reason: 'alıcı adresi boş' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return {
        ok: false,
        reason: `Resend ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : 'bilinmeyen email hatası',
    };
  }
}

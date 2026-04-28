import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  checkAdminPassword,
  computeSessionToken,
} from '../../../../lib/admin-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// TODO: Rate limiting — brute-force'a karşı (ör. 5 hatalı deneme / 15 dk / IP).

const LoginSchema = z.object({
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Şifre gerekli.' }, { status: 400 });
  }

  const ok = await checkAdminPassword(parsed.data.password);
  if (!ok) {
    return NextResponse.json({ error: 'Şifre yanlış.' }, { status: 401 });
  }

  const token = await computeSessionToken(parsed.data.password);
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

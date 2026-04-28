// ---------------------------------------------------------------------------
// GÜVENLİK NOTU
// Bu basit env-password auth production için yeterli DEĞİL.
// Hafta 5'te Supabase Auth (magic link) üzerine geçilecek.
// Bir kullanıcı, tek şifre; kullanımı yalnızca kendi müşteri projesinde
// geçerli. Brute-force veya yatay tarama saldırılarına açık — rate limit
// şu an yok (orta vadede Upstash Ratelimit eklenecek).
// ---------------------------------------------------------------------------

export const SESSION_COOKIE_NAME = 'admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;  // 7 gün

// SHA-256 hex — Web Crypto API (Edge + Node runtime'da çalışır)
async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Constant-time string compare (timing attack yüzeyini küçültmek için)
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function expectedToken(): Promise<string | null> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256Hex(pw);
}

export async function computeSessionToken(password: string): Promise<string> {
  return sha256Hex(password);
}

/** Login sırasında kullanıcının verdiği şifreyi env ile karşılaştır. */
export async function checkAdminPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(password, expected);
}

/** Her istekte cookie değerini hash'ten doğrular. */
export async function verifyAdminSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await expectedToken();
  if (!expected) return false;
  return timingSafeEqual(cookieValue, expected);
}

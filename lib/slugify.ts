// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 2 — Türkçe-aware slugify
//
// Spec: docs/h6-reusable-components.md §9.5
// `slugify` kütüphanesinin Türkçe extension'ı patchy; elle yazılmış deterministic.
// ---------------------------------------------------------------------------

const TURKISH_MAP: Record<string, string> = {
  ı: 'i',
  İ: 'i',
  ş: 's',
  Ş: 's',
  ğ: 'g',
  Ğ: 'g',
  ü: 'u',
  Ü: 'u',
  ö: 'o',
  Ö: 'o',
  ç: 'c',
  Ç: 'c',
};

export function slugify(input: string, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  let s = input.trim();
  s = s.replace(/[ıİşŞğĞüÜöÖçÇ]/g, (m) => TURKISH_MAP[m] ?? m);
  s = s.toLowerCase();
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  if (s.length > maxLength) s = s.slice(0, maxLength).replace(/-+$/g, '');
  return s;
}

/**
 * Manuel edit sırasında kullanılır — trailing `-` korunur (kullanıcı `elle-y` yazarken
 * ara adımda "elle-" değeri zorunlu).
 */
export function slugifyInput(input: string, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  let s = input;
  s = s.replace(/[ıİşŞğĞüÜöÖçÇ]/g, (m) => TURKISH_MAP[m] ?? m);
  s = s.toLowerCase();
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^a-z0-9-]+/g, '-');
  s = s.replace(/-{2,}/g, '-');
  s = s.replace(/^-+/, '');
  if (s.length > maxLength) s = s.slice(0, maxLength);
  return s;
}

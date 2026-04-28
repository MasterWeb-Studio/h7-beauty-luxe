// H5 Ayak C Gün 3 — Fonts dosyası. Next.js `next/font/google` statik analiz
// için `subsets` alanında **literal array** bekler; spread (`[...LATIN]`)
// build sırasında "Unexpected spread" hatası verir. Bu yüzden her font
// çağrısında subsets satır içinde yazılıyor — DRY'lik azaldı ama build
// güvende.
//
// Bu dosya scaffolder artık runtime-dynamic preset (Ayak C Gün 1) sonrası
// preset varsa regen edilmez; template orijinal 5 preset fontu + legacy
// alias her build'de yüklenir. Preset değişimi CSS variable seviyesinde
// olduğundan font'un zaten hazır olması gerek.

import { DM_Sans, Fraunces, Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';

// ---------------------------------------------------------------------------
// H5 preset havuzu fontları
// ---------------------------------------------------------------------------

export const presetPlayfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const presetInter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const presetDmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const presetFraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const presetJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const presetFonts = [
  presetPlayfair,
  presetInter,
  presetDmSans,
  presetFraunces,
  presetJetBrainsMono,
];

// ---------------------------------------------------------------------------
// Legacy alias (section'larda var(--font-heading) / var(--font-body))
// ---------------------------------------------------------------------------

export const headingFont = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const bodyFont = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

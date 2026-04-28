import type { Metadata } from 'next';
import './globals.css';
import { headingFont, bodyFont, presetFonts } from '../lib/fonts';
import { content } from '../lib/content';
import { getPresetSelection, getAnimationPreset } from '../lib/preset-loader';
import { AnimationProvider } from '../lib/motion';

// Minimal root layout — yalnızca <html> + <body>.
// Site chrome'u (site)/layout.tsx'te, admin chrome'u admin/layout.tsx'te.
//
// H5 Ayak C Gün 1 — Preset runtime-dynamic:
//   - <html>'deki data-* attribute'ları artık Supabase'den okunuyor
//     (projects.preset_selection). Admin "Tema" sekmesi DB'yi günceller,
//     Vercel Deploy Hook redeploy tetikler, yeni build taze preset alır.
//   - 5 preset fontunun hepsi her zaman yüklenir (variable olarak). Hangi
//     preset aktif olursa onun CSS bloğu CSS variable'ları set eder.
//   - DB'de preset yoksa / migration eksikse DEFAULT_PRESET (merkez/nötr)
//     kullanılır; hata fırlatılmaz.

export const metadata: Metadata = {
  title: {
    default: `${content.meta.companyName} | ${content.meta.tagline}`,
    template: `%s | ${content.meta.companyName}`,
  },
  description: content.meta.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preset, animation] = await Promise.all([
    getPresetSelection(),
    getAnimationPreset(),
  ]);

  const fontClassName = [
    headingFont.variable,
    bodyFont.variable,
    ...presetFonts.map((f) => f.variable),
  ].join(' ');

  return (
    <html
      lang={content.meta.language}
      className={fontClassName}
      data-typography={preset.typography}
      data-grid={preset.grid}
      data-spacing={preset.spacing}
      data-radius={preset.radius}
      data-density={preset.density}
      data-palette={preset.palette}
      data-animation={animation}
    >
      <body>
        <AnimationProvider preset={animation}>{children}</AnimationProvider>
      </body>
    </html>
  );
}

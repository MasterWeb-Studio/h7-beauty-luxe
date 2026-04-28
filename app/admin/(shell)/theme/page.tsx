import { PageHeader } from '../../_components/PageHeader';
import { getPresetSelection, getAnimationPreset } from '../../../../lib/preset-loader';
import { ThemeEditor } from './_components/ThemeEditor';
import { AnimationEditor } from './_components/AnimationEditor';

// H5 Ayak C Gün 2 — Tema sekmesi server sayfası.
// Initial preset Supabase'den okunur; değişiklik olursa router.refresh()
// ile bir sonraki render güncel baseline gelir (Kaydet sonrası yeni
// baseline client state'inde zaten güncelleniyor; refresh yalnızca sayfa
// reload senaryoları için).
export const dynamic = 'force-dynamic';

export default async function ThemePage() {
  const [preset, animation] = await Promise.all([
    getPresetSelection(),
    getAnimationPreset(),
  ]);
  return (
    <>
      <PageHeader
        title="Tema"
        description="Tipografi, renk paleti, yuvarlama, yoğunluk ve animasyon preset'leri — değişiklik kaydedildiğinde canlı site otomatik redeploy olur."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Tema' }]}
      />
      <div className="space-y-6 p-8">
        <ThemeEditor initialPreset={preset} />
        <AnimationEditor initialPreset={animation} />
      </div>
    </>
  );
}

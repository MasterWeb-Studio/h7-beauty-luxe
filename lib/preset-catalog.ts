// ---------------------------------------------------------------------------
// H5 Ayak C Gün 2 — Admin "Tema" sekmesi katalog meta.
//
// Shared paketten duplicate (standalone deploy). 6 kategori × ID + label +
// kısa açıklama + görsel meta (palette için 4 swatch).
// Yalnızca UI için — runtime preset yüklemede preset-loader kullanılır.
// ---------------------------------------------------------------------------

export interface CatalogOption {
  id: string;
  label: string;
  description: string;
}

export const TYPOGRAPHY_OPTIONS: Array<
  CatalogOption & { preview: string; cssFontVar: string }
> = [
  {
    id: 'type-classic',
    label: 'Classic',
    description: 'Serif başlık (Playfair) + sans body (Inter). Kurumsal, ağırbaşlı.',
    preview: 'Aa Bb Cc',
    cssFontVar: 'var(--font-playfair)',
  },
  {
    id: 'type-modern',
    label: 'Modern',
    description: 'Tek sans (DM Sans). Sade, güncel, startup.',
    preview: 'Aa Bb Cc',
    cssFontVar: 'var(--font-dm-sans)',
  },
  {
    id: 'type-editorial',
    label: 'Editorial',
    description: 'Tek serif (Fraunces). Estetik, yayıncı, premium.',
    preview: 'Aa Bb Cc',
    cssFontVar: 'var(--font-fraunces)',
  },
  {
    id: 'type-tech',
    label: 'Tech',
    description: 'Inter + mono accent (JetBrains Mono). Developer, API dokümantasyonu.',
    preview: 'Aa Bb Cc',
    cssFontVar: 'var(--font-inter)',
  },
];

export const GRID_OPTIONS: CatalogOption[] = [
  { id: 'grid-tight', label: 'Tight', description: 'Sıkışık 12-col, 16px gutter — yoğun bilgi.' },
  { id: 'grid-balanced', label: 'Balanced', description: 'Dengeli 12-col, 24px gutter — default.' },
  { id: 'grid-airy', label: 'Airy', description: 'Havadar 8-col, 40px gutter — lüks, boutique.' },
];

export const SPACING_OPTIONS: CatalogOption[] = [
  { id: 'space-compact', label: 'Compact', description: 'Kısa section gap, sıkışık padding.' },
  { id: 'space-default', label: 'Default', description: 'Tipik kurumsal ritim.' },
  { id: 'space-generous', label: 'Generous', description: 'Apple / Stripe vibes — geniş nefes.' },
];

export const RADIUS_OPTIONS: Array<CatalogOption & { px: number }> = [
  { id: 'radius-sharp', label: 'Sharp', description: '2px köşe — teknik, keskin.', px: 2 },
  { id: 'radius-soft', label: 'Soft', description: '8px — modern default.', px: 8 },
  { id: 'radius-rounded', label: 'Rounded', description: '16px — friendly startup.', px: 16 },
  { id: 'radius-pill', label: 'Pill', description: '999px pill — beauty, boutique.', px: 999 },
];

export const DENSITY_OPTIONS: CatalogOption[] = [
  { id: 'density-minimal', label: 'Minimal', description: '4-5 section — butik, premium.' },
  { id: 'density-moderate', label: 'Moderate', description: '6-7 section — default kurumsal.' },
  { id: 'density-rich', label: 'Rich', description: '8-10 section — SaaS landing.' },
];

export interface PaletteOption extends CatalogOption {
  group: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  isDark?: boolean;
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  // Hukuk
  {
    id: 'palette-law-emerald',
    label: 'Law Emerald',
    description: 'Koyu zümrüt + krem + altın. Ciddi, akademik.',
    group: 'Hukuk / Kurumsal',
    primary: '#1F4E46', secondary: '#E6DCC3', accent: '#C9A959', bg: '#FAF8F3', text: '#1A1A1A',
  },
  {
    id: 'palette-law-navy',
    label: 'Law Navy',
    description: 'Lacivert + beyaz. Klasik, güvenilir.',
    group: 'Hukuk / Kurumsal',
    primary: '#1B2B4A', secondary: '#F0F2F5', accent: '#8A8D91', bg: '#FFFFFF', text: '#101522',
  },
  {
    id: 'palette-law-burgundy',
    label: 'Law Burgundy',
    description: 'Bordo + krem + koyu kahve.',
    group: 'Hukuk / Kurumsal',
    primary: '#6B1F2E', secondary: '#F3ECE3', accent: '#3E2A20', bg: '#FAF6F0', text: '#1A1410',
  },
  // Beauty
  {
    id: 'palette-beauty-peach',
    label: 'Beauty Peach',
    description: 'Peach + krem + mercan. Feminen, yumuşak.',
    group: 'Beauty / Wellness',
    primary: '#E8957E', secondary: '#FDF0E9', accent: '#C9485B', bg: '#FFF8F2', text: '#2A1F1A',
  },
  {
    id: 'palette-beauty-rose',
    label: 'Beauty Rose',
    description: 'Pembe + pudra + gül. Romantik, zarif.',
    group: 'Beauty / Wellness',
    primary: '#B85F7A', secondary: '#F9E5EB', accent: '#5E3142', bg: '#FFF5F7', text: '#2B1A21',
  },
  {
    id: 'palette-beauty-sage',
    label: 'Beauty Sage',
    description: 'Adaçayı yeşili + krem. Doğal, sakin.',
    group: 'Beauty / Wellness',
    primary: '#8A9E7E', secondary: '#EEE8D9', accent: '#4A5C40', bg: '#FAF8F0', text: '#1F2419',
  },
  // SaaS
  {
    id: 'palette-saas-purple',
    label: 'SaaS Purple',
    description: 'Mor + beyaz. Modern, yaratıcı.',
    group: 'SaaS / Tech',
    primary: '#6366F1', secondary: '#F0F0FA', accent: '#EC4899', bg: '#FFFFFF', text: '#0F0F1A',
  },
  {
    id: 'palette-saas-emerald',
    label: 'SaaS Emerald',
    description: 'Zümrüt + koyu gri. Büyüme, yeşil rakam.',
    group: 'SaaS / Tech',
    primary: '#10B981', secondary: '#F0FAF6', accent: '#064E3B', bg: '#FFFFFF', text: '#101520',
  },
  {
    id: 'palette-saas-cobalt',
    label: 'SaaS Cobalt',
    description: 'Kobalt mavi + turuncu accent.',
    group: 'SaaS / Tech',
    primary: '#2563EB', secondary: '#EFF4FE', accent: '#F97316', bg: '#FFFFFF', text: '#0A1020',
  },
  // Food
  {
    id: 'palette-food-terracotta',
    label: 'Food Terracotta',
    description: 'Kiremit + krem + zeytin. Akdeniz.',
    group: 'Restoran / Gıda',
    primary: '#B04A2F', secondary: '#F5EAD8', accent: '#6B7D3F', bg: '#FFF9EE', text: '#2A1810',
  },
  {
    id: 'palette-food-charcoal',
    label: 'Food Charcoal',
    description: 'Kömür + amber + krem. Fine dining.',
    group: 'Restoran / Gıda',
    primary: '#D4A456', secondary: '#2A2520', accent: '#EFE5D0', bg: '#1A1612', text: '#F5EFE3',
    isDark: true,
  },
  // Health
  {
    id: 'palette-health-teal',
    label: 'Health Teal',
    description: 'Cam göbeği + beyaz. Tıbbi, temiz.',
    group: 'Sağlık / Klinik',
    primary: '#0F766E', secondary: '#E6F4F2', accent: '#155E75', bg: '#FFFFFF', text: '#0F1E1C',
  },
  {
    id: 'palette-health-blush',
    label: 'Health Blush',
    description: 'Bebek pembe + beyaz + lacivert. Pediatri.',
    group: 'Sağlık / Klinik',
    primary: '#E96B8C', secondary: '#FCE9EF', accent: '#1F3B5C', bg: '#FFFBFC', text: '#1A0E14',
  },
  // Edu
  {
    id: 'palette-edu-indigo',
    label: 'Edu Indigo',
    description: 'Indigo + beyaz + altın. Akademik.',
    group: 'Eğitim / Danışmanlık',
    primary: '#4338CA', secondary: '#EEF0FB', accent: '#CA8A04', bg: '#FFFFFF', text: '#0F1020',
  },
  {
    id: 'palette-edu-olive',
    label: 'Edu Olive',
    description: 'Zeytin + krem + terra cotta.',
    group: 'Eğitim / Danışmanlık',
    primary: '#6B7A3F', secondary: '#F1EDDB', accent: '#B04A2F', bg: '#FAF7EC', text: '#1F1F15',
  },
  // Fitness
  {
    id: 'palette-fitness-crimson',
    label: 'Fitness Crimson',
    description: 'Crimson + siyah + beyaz. Enerji.',
    group: 'Fitness',
    primary: '#DC2626', secondary: '#1A1A1A', accent: '#FAFAFA', bg: '#FFFFFF', text: '#0A0A0A',
  },
  {
    id: 'palette-fitness-mono',
    label: 'Fitness Mono',
    description: 'Siyah + sarı accent. Minimalist gym.',
    group: 'Fitness',
    primary: '#0A0A0A', secondary: '#F4F4F4', accent: '#FACC15', bg: '#FFFFFF', text: '#0A0A0A',
  },
  // Universal
  {
    id: 'palette-neutral-slate',
    label: 'Neutral Slate',
    description: 'Slate + beyaz + mavi. Her sektörde çalışır.',
    group: 'Universal',
    primary: '#334155', secondary: '#F1F5F9', accent: '#2563EB', bg: '#FFFFFF', text: '#0F172A',
  },
];

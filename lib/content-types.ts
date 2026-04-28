// Bu tipler scaffolder'ın ürettiği content.ts ile eşleşir.
// Studio monorepo'sundan bağımsızdır (şablon kendi başına deploy edilir).
// Shared paketteki Zod schema'larla paralel tutulur — elle senkronla.

export interface CtaButton { label: string; href: string; }

// ===========================================================================
// H6 Sprint 10 — Section image (search/remote/placeholder discriminated union)
// ===========================================================================

export type SectionImage =
  | {
      type: 'search';
      query: string;
      orientation?: 'landscape' | 'portrait' | 'square';
      color?: string;
      mediaType?: 'photo' | 'illustration' | 'any';
    }
  | {
      type: 'remote';
      url: string;
      alt?: string;
      credit?: string;
      creditUrl?: string;
      color?: string;
      width?: number;
      height?: number;
    }
  | {
      type: 'placeholder';
      url?: string;
      alt?: string;
    };

// ===========================================================================
// Core section'lar — content-architect üretir
// ===========================================================================

// H5 Ayak B — Hero layout varyantı. Design Analyst seçer, scaffolder yazar.
// Sprint 22.5 — `display-typography` eklendi (typography-as-art, görsel yok).
export type HeroVariant =
  | 'left-aligned'
  | 'centered'
  | 'split'
  | 'fullbleed'
  | 'display-typography';

export interface HeroSection {
  type: 'hero';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCta?: CtaButton;
  secondaryCta?: CtaButton;
  variant?: HeroVariant;
  /** H6 Sprint 10 — opsiyonel hero görsel. */
  image?: SectionImage;
}

// H5 Ayak B — Feature-grid layout varyantı.
export type FeatureGridVariant = 'three-col' | 'two-col' | 'list' | 'icon-top';

export interface FeatureGridSection {
  type: 'feature-grid';
  eyebrow?: string;
  headline: string;
  description?: string;
  // Sprint 22.5: opsiyonel item.image (two-col + icon-top variant'larında render).
  items: Array<{ icon: string; title: string; description: string; image?: SectionImage }>;
  variant?: FeatureGridVariant;
}

// H5 Ayak B Gün 3 — layout varyantları.
export type AboutVariant = 'text-only' | 'with-image' | 'stats-side';
export type ServicesVariant = 'cards' | 'accordion' | 'table';
export type CtaVariant = 'banner' | 'inline' | 'split-action';

export interface AboutSection {
  type: 'about';
  eyebrow?: string;
  headline: string;
  body: string[];
  stats?: Array<{ label: string; value: string }>;
  variant?: AboutVariant;
  image?: SectionImage;
}

export interface ServicesSection {
  type: 'services';
  eyebrow?: string;
  headline: string;
  description?: string;
  items: Array<{
    title: string;
    description: string;
    bullets?: string[];
    price?: string;
    // Sprint 22.5: opsiyonel item.image (cards variant'ında render).
    image?: SectionImage;
  }>;
  variant?: ServicesVariant;
}

export interface CtaSection {
  type: 'cta';
  headline: string;
  subheadline?: string;
  primaryCta: CtaButton;
  secondaryCta?: CtaButton;
  variant?: CtaVariant;
  image?: SectionImage;
}

// Sprint 23 G2 — Module home section (H6 modülleri home page'e entegre)
export type ModuleHomeId =
  | 'products'
  | 'services'
  | 'team'
  | 'gallery'
  | 'references'
  | 'certificates'
  | 'news'
  | 'career'
  | 'counter'
  | 'newsletter'
  | 'video'
  | 'timeline'
  | 'contact-cards'
  | 'projects';

export interface ModuleHomeSection {
  type: 'module-home';
  module: ModuleHomeId;
  variant: string;
  headline?: string;
  description?: string;
  count?: number;
  selectionLogic?: 'latest' | 'featured' | 'random' | 'manual' | 'bestsellers';
}

export interface ContactSection {
  type: 'contact';
  headline: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  formEnabled: boolean;
}

export interface AppointmentSection {
  type: 'appointment';
  headline: string;
  subheadline?: string;
  note?: string;
  services?: string[];
}

// ===========================================================================
// Fill section'lar — placeholder setinden, scaffolder merge eder
// ===========================================================================

export interface TestimonialsSection {
  type: 'testimonials';
  headline: string;
  items: Array<{
    quote: string;
    author: string;
    role: string;
    _isPlaceholder?: boolean;
  }>;
}

export interface FaqSection {
  type: 'faq';
  headline: string;
  items: Array<{
    question: string;
    answer: string;
    _isPlaceholder?: boolean;
  }>;
}

export interface StatsSection {
  type: 'stats';
  eyebrow?: string;
  headline: string;
  description?: string;
  items: Array<{
    label: string;
    value: string;
    _isPlaceholder?: boolean;
  }>;
}

export interface TeamSection {
  type: 'team';
  headline: string;
  description?: string;
  items: Array<{
    name: string;
    role: string;
    bio?: string;
    avatarHint?: string;
    _isPlaceholder?: boolean;
  }>;
}

export interface ProjectsSection {
  type: 'projects';
  headline: string;
  description?: string;
  items: Array<{
    title: string;
    description: string;
    tags?: string[];
    year?: string;
    href?: string;
    _isPlaceholder?: boolean;
  }>;
}

export interface ProductsSection {
  type: 'products';
  headline: string;
  description?: string;
  items: Array<{
    title: string;
    description: string;
    price?: string;
    duration?: string;
    _isPlaceholder?: boolean;
  }>;
}

export interface BlogSection {
  type: 'blog';
  headline: string;
  description?: string;
  items: Array<{
    title: string;
    summary: string;
    date?: string;
    category?: string;
    href?: string;
    _isPlaceholder?: boolean;
  }>;
}

// ===========================================================================
// Section union + Page + ContentPlan
// ===========================================================================

export type Section =
  | HeroSection
  | FeatureGridSection
  | AboutSection
  | ServicesSection
  | CtaSection
  | ContactSection
  | AppointmentSection
  | ModuleHomeSection
  | TestimonialsSection
  | FaqSection
  | StatsSection
  | TeamSection
  | ProjectsSection
  | ProductsSection
  | BlogSection;

export interface Page {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  sections: Section[];
}

export interface SiteMeta {
  companyName: string;
  tagline: string;
  description: string;
  language: 'tr' | 'en';
  navigation: Array<{ label: string; href: string }>;
  footer: {
    about: string;
    columns: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
    copyright: string;
    social?: Array<{ platform: string; url: string }>;
  };
}

export interface ContentPlan {
  meta: SiteMeta;
  pages: Page[];
}

import type { Section } from '../lib/content-types';
import { HeroRenderer } from './sections/hero/HeroRenderer';
import { FeatureGridRenderer } from './sections/feature-grid/FeatureGridRenderer';
import { AboutRenderer } from './sections/about/AboutRenderer';
import { ServicesRenderer } from './sections/services/ServicesRenderer';
import { Testimonials } from './sections/Testimonials';
import { CtaRenderer } from './sections/cta/CtaRenderer';
import { Contact } from './sections/Contact';
import { AppointmentForm } from './sections/AppointmentForm';
import { Faq } from './sections/Faq';
import { Stats } from './sections/Stats';
import { Team } from './sections/Team';
import { Projects } from './sections/Projects';
import { Products } from './sections/Products';
import { Blog } from './sections/Blog';
import { ModuleHomeRenderer } from './sections/ModuleHomeRenderer';
import { FadeIn, ScrollReveal } from '@/lib/motion';

// H6 Sprint 14 — Section animasyon sarmalayıcısı.
// Hero: viewport'ta ilk render → FadeIn (instant, delay'sız).
// Diğerleri: scroll-triggered → ScrollReveal (viewport'a girince).
// Preset='none' veya prefers-reduced-motion → sarmalayıcılar statik div.
function wrapWithAnimation(type: Section['type'], child: React.ReactElement) {
  if (type === 'hero' || type === 'cta') {
    // Hero + CTA ilk ekranda görünür — hemen fade-in
    return <FadeIn speed="base">{child}</FadeIn>;
  }
  // Scroll-triggered
  return <ScrollReveal speed="base">{child}</ScrollReveal>;
}

// Sprint 23 G2 — async server component (module-home async DB fetch için).
// React handles async server components transparently; legacy sync caller'lar
// `await` etmiyor olsa bile JSX üzerinden render eder.
export async function SectionRenderer({
  section,
  locale,
}: {
  section: Section;
  locale?: string;
}) {
  let content: React.ReactElement | null = null;
  switch (section.type) {
    case 'hero':
      content = <HeroRenderer content={section} />;
      break;
    case 'feature-grid':
      content = <FeatureGridRenderer content={section} />;
      break;
    case 'about':
      content = <AboutRenderer content={section} />;
      break;
    case 'services':
      content = <ServicesRenderer content={section} />;
      break;
    case 'testimonials':
      content = <Testimonials data={section} />;
      break;
    case 'cta':
      content = <CtaRenderer content={section} />;
      break;
    case 'contact':
      content = <Contact data={section} />;
      break;
    case 'appointment':
      content = <AppointmentForm data={section} />;
      break;
    case 'faq':
      content = <Faq data={section} />;
      break;
    case 'stats':
      content = <Stats data={section} />;
      break;
    case 'team':
      content = <Team data={section} />;
      break;
    case 'projects':
      content = <Projects data={section} />;
      break;
    case 'products':
      content = <Products data={section} />;
      break;
    case 'blog':
      content = <Blog data={section} />;
      break;
    case 'module-home':
      content = await ModuleHomeRenderer({ section, locale: locale ?? 'tr' });
      if (!content) return null;
      break;
    default: {
      const _exhaustive: never = section;
      void _exhaustive;
      return null;
    }
  }
  return wrapWithAnimation(section.type, content);
}

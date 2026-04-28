// H5 Ayak B — Hero varyant ortak prop tipi.
// HeroSection (lib/content-types) zaten variant alanını taşıyor; burada sadece
// bir alias export'u tutuyoruz ki varyant dosyaları temiz imzayla çalışsın.
import type { HeroSection, HeroVariant } from '../../../lib/content-types';

export type HeroContent = HeroSection;
export type { HeroVariant };

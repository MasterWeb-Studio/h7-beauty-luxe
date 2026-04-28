// Zod schema'ları — sunucu tarafı validation için (özellikle /api/admin/content).
// lib/content-types.ts'teki TS interface'leriyle YAPISAL PARALEL.
// Elle senkron tutulur; şimdilik tek kullanıcı bu dosyayı değiştiriyor.

import { z } from 'zod';

// ===========================================================================
// Core section schemas
// ===========================================================================

export const HeroSectionSchema = z.object({
  type: z.literal('hero'),
  eyebrow: z.string().optional(),
  headline: z.string(),
  subheadline: z.string().optional(),
  primaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
});

export const FeatureGridSchema = z.object({
  type: z.literal('feature-grid'),
  eyebrow: z.string().optional(),
  headline: z.string(),
  description: z.string().optional(),
  items: z
    .array(z.object({ icon: z.string(), title: z.string(), description: z.string() }))
    .min(3)
    .max(6),
});

export const AboutSectionSchema = z.object({
  type: z.literal('about'),
  eyebrow: z.string().optional(),
  headline: z.string(),
  body: z.array(z.string()).min(1).max(4),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

export const ServicesSectionSchema = z.object({
  type: z.literal('services'),
  eyebrow: z.string().optional(),
  headline: z.string(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        bullets: z.array(z.string()).optional(),
      })
    )
    .min(2)
    .max(6),
});

export const CtaSectionSchema = z.object({
  type: z.literal('cta'),
  headline: z.string(),
  subheadline: z.string().optional(),
  primaryCta: z.object({ label: z.string(), href: z.string() }),
});

export const ContactSectionSchema = z.object({
  type: z.literal('contact'),
  headline: z.string(),
  description: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  formEnabled: z.boolean().default(true),
});

export const AppointmentSectionSchema = z.object({
  type: z.literal('appointment'),
  headline: z.string(),
  subheadline: z.string().optional(),
  note: z.string().optional(),
  services: z.array(z.string()).optional(),
});

// ===========================================================================
// Fill section schemas
// ===========================================================================

export const TestimonialsSectionSchema = z.object({
  type: z.literal('testimonials'),
  headline: z.string(),
  items: z
    .array(
      z.object({
        quote: z.string(),
        author: z.string(),
        role: z.string(),
        _isPlaceholder: z.boolean().optional(),
      })
    )
    .min(1)
    .max(4),
});

export const FaqSectionSchema = z.object({
  type: z.literal('faq'),
  headline: z.string(),
  items: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        _isPlaceholder: z.boolean().optional(),
      })
    )
    .min(3)
    .max(10),
});

export const StatsSectionSchema = z.object({
  type: z.literal('stats'),
  eyebrow: z.string().optional(),
  headline: z.string(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        _isPlaceholder: z.boolean().optional(),
      })
    )
    .min(2)
    .max(6),
});

export const TeamSectionSchema = z.object({
  type: z.literal('team'),
  headline: z.string(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional(),
        avatarHint: z.string().optional(),
        _isPlaceholder: z.boolean().optional(),
      })
    )
    .min(1)
    .max(8),
});

export const ProjectsSectionSchema = z.object({
  type: z.literal('projects'),
  headline: z.string(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
        year: z.string().optional(),
        href: z.string().optional(),
        _isPlaceholder: z.boolean().optional(),
      })
    )
    .min(1)
    .max(8),
});

export const ProductsSectionSchema = z.object({
  type: z.literal('products'),
  headline: z.string(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        price: z.string().optional(),
        duration: z.string().optional(),
        _isPlaceholder: z.boolean().optional(),
      })
    )
    .min(1)
    .max(8),
});

export const BlogSectionSchema = z.object({
  type: z.literal('blog'),
  headline: z.string(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        summary: z.string(),
        date: z.string().optional(),
        category: z.string().optional(),
        href: z.string().optional(),
        _isPlaceholder: z.boolean().optional(),
      })
    )
    .min(1)
    .max(6),
});

// ===========================================================================
// Section union, Page, SiteMeta, ContentPlan
// ===========================================================================

// Sprint 23 G2 — module-home section (H6 modülleri home entegrasyonu)
export const ModuleHomeSectionSchema = z.object({
  type: z.literal('module-home'),
  module: z.enum([
    'products', 'services', 'team', 'gallery', 'references', 'certificates',
    'news', 'career', 'counter', 'newsletter', 'video', 'timeline',
    'contact-cards', 'projects',
  ]),
  variant: z.string(),
  headline: z.string().optional(),
  description: z.string().optional(),
  count: z.number().int().positive().max(12).optional(),
  selectionLogic: z
    .enum(['latest', 'featured', 'random', 'manual', 'bestsellers'])
    .optional(),
});

export const SectionSchema = z.discriminatedUnion('type', [
  HeroSectionSchema,
  FeatureGridSchema,
  AboutSectionSchema,
  ServicesSectionSchema,
  CtaSectionSchema,
  ContactSectionSchema,
  AppointmentSectionSchema,
  ModuleHomeSectionSchema,
  TestimonialsSectionSchema,
  FaqSectionSchema,
  StatsSectionSchema,
  TeamSectionSchema,
  ProjectsSectionSchema,
  ProductsSectionSchema,
  BlogSectionSchema,
]);

export const PageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  sections: z.array(SectionSchema).min(1),
});

export const SiteMetaSchema = z.object({
  companyName: z.string(),
  tagline: z.string(),
  description: z.string(),
  language: z.enum(['tr', 'en']),
  navigation: z.array(z.object({ label: z.string(), href: z.string() })),
  footer: z.object({
    about: z.string(),
    columns: z.array(
      z.object({
        title: z.string(),
        links: z.array(z.object({ label: z.string(), href: z.string() })),
      })
    ),
    copyright: z.string(),
    social: z
      .array(
        z.object({
          platform: z.enum(['twitter', 'linkedin', 'instagram', 'facebook', 'github', 'youtube']),
          url: z.string(),
        })
      )
      .optional(),
  }),
});

export const ContentPlanSchema = z.object({
  meta: SiteMetaSchema,
  pages: z.array(PageSchema).min(1),
});

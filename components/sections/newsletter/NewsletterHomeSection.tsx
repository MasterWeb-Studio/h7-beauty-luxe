import { NewsletterSection } from './NewsletterRenderer';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NewsletterHomeSectionProps {
  variant?: 'newsletter-inline' | 'newsletter-card' | 'newsletter-footer';
  locale: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  placeholder?: string;
  successMessage?: string;
  source?: string;
}

// ─── Server Component Wrapper ────────────────────────────────────────────────
// This is a thin RSC wrapper so the home page (server component) can import
// it without pulling in 'use client' at the page level.

export function NewsletterHomeSection({
  variant = 'newsletter-inline',
  locale,
  title,
  description,
  ctaLabel,
  placeholder,
  successMessage,
  source,
}: NewsletterHomeSectionProps) {
  return (
    <NewsletterSection
      variant={variant}
      locale={locale}
      config={{ title, description, ctaLabel, placeholder, successMessage, source }}
    />
  );
}

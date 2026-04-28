import type { SectionImage } from '../../../lib/content-types';
import { ImageWithCredit, type CreditDisplay } from '../../ImageWithCredit';

// ---------------------------------------------------------------------------
// Sprint 18.5 G1 — Section image frame
//
// Variant'lardaki tekrarı tek yerde toplar. image undefined ise null döner
// (graceful) — scaffolder/pipeline'dan görsel gelmediyse variant metinle
// sessizce çalışmaya devam eder.
//
// Her variant kendi aspect-ratio, radius ve priority'sini geçer; helper
// yalnızca discriminated union'ı çözer ve attribution zorunluluğunu uygular.
// ---------------------------------------------------------------------------

export interface SectionImageFrameProps {
  image?: SectionImage;
  /** Tailwind aspect class — 'aspect-[4/3]', 'aspect-[4/5]', 'aspect-square' vb. */
  aspect?: string;
  /** Hero için true — LCP optimize, lazy loading off. */
  priority?: boolean;
  /** Credit görünürlük: 'always' default; fullbleed/bg için 'hover'. */
  creditDisplay?: CreditDisplay;
  /** Wrapper'a eklenecek className. */
  className?: string;
  /** placeholder.url yoksa renkli gradient blok göster mi? Default true. */
  showPlaceholderFallback?: boolean;
  /**
   * Fallback gradient — placeholder için `linear-gradient(...)` string.
   * Default: primary → accent. Scaffolder preset CSS var'larıyla uyumlu.
   */
  fallbackGradient?: string;
}

const DEFAULT_GRADIENT =
  'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 55%, var(--color-accent) 100%)';

export function SectionImageFrame({
  image,
  aspect = 'aspect-[4/3]',
  priority,
  creditDisplay = 'always',
  className,
  showPlaceholderFallback = true,
  fallbackGradient = DEFAULT_GRADIENT,
}: SectionImageFrameProps) {
  const wrapperClass = [
    'relative w-full overflow-hidden',
    aspect,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const radiusStyle = {
    borderRadius: 'var(--radius-card, var(--radius))',
  };

  // Hiç image yok — variant'ın isteğine göre ya null (Centered/LeftAligned/
  // AboutStatsSide graceful) ya da fallback gradient (Split hero sağ kolon
  // hiçbir zaman boş kalmasın).
  if (!image) {
    if (!showPlaceholderFallback) return null;
    return (
      <div
        className={wrapperClass}
        style={{ background: fallbackGradient, ...radiusStyle }}
        aria-hidden="true"
      />
    );
  }

  if (image.type === 'remote') {
    return (
      <div className={wrapperClass} style={radiusStyle}>
        <ImageWithCredit
          src={image.url}
          alt={image.alt}
          credit={image.credit}
          creditUrl={image.creditUrl}
          color={image.color}
          width={image.width}
          height={image.height}
          display={creditDisplay}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover"
          priority={priority}
        />
      </div>
    );
  }

  if (image.type === 'placeholder') {
    if (image.url) {
      return (
        <div className={wrapperClass} style={radiusStyle}>
          <ImageWithCredit
            src={image.url}
            alt={image.alt}
            display="alt-only"
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
            priority={priority}
          />
        </div>
      );
    }
    if (!showPlaceholderFallback) return null;
    return (
      <div
        className={wrapperClass}
        style={{ background: fallbackGradient, ...radiusStyle }}
        aria-hidden="true"
      />
    );
  }

  // type === 'search' — pipeline çözmemiş (should not happen post-resolver).
  // Defensive: placeholder fallback.
  if (!showPlaceholderFallback) return null;
  return (
    <div
      className={wrapperClass}
      style={{ background: fallbackGradient, ...radiusStyle }}
      aria-hidden="true"
    />
  );
}

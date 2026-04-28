import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// H6 Sprint 10 — ImageWithCredit
//
// Unsplash ve Pexels attribution zorunluluğunu tek yerden yöneten wrapper.
// Default: görsel altına küçük, opak credit satırı. "hover" mode: sadece
// hover'da görünür (hero/gallery için). "alt-only" mode: credit alt text
// olarak saklı — credit görsel üstünde asla görünmez (basın içeriği).
//
// H6 Sprint 15'te Hero/About/Cta renderer'ları bu komponenti kullanacak
// şekilde güncellenecek (şu an orchestrator/Content Architect image
// verisi üretiyor, section renderer'lar eskisi gibi çalışıyor).
// ---------------------------------------------------------------------------

export type CreditDisplay = 'always' | 'hover' | 'alt-only';

export interface ImageWithCreditProps {
  src: string;
  alt?: string;
  /** "Jane Doe / unsplash" gibi */
  credit?: string;
  /** Photographer sayfası — credit click URL */
  creditUrl?: string;
  /** Dominant color — skeleton/bg placeholder */
  color?: string;
  width?: number;
  height?: number;
  /** Credit görünürlük stratejisi */
  display?: CreditDisplay;
  /** Hero gibi yerlerde ek wrapper className */
  className?: string;
  /** img element'ine forwardlanan className (aspect/border-radius için) */
  imgClassName?: string;
  /** Priority loading — hero'da true */
  priority?: boolean;
  children?: ReactNode;
}

export function ImageWithCredit({
  src,
  alt,
  credit,
  creditUrl,
  color,
  width,
  height,
  display = 'always',
  className,
  imgClassName,
  priority,
  children,
}: ImageWithCreditProps) {
  const wrapperClass = ['relative inline-block', className].filter(Boolean).join(' ');
  const imgStyle: React.CSSProperties = {
    background: color,
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
  };

  const creditContent = credit ? (
    creditUrl ? (
      <a
        href={creditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {credit}
      </a>
    ) : (
      <span>{credit}</span>
    )
  ) : null;

  const creditClassByMode: Record<CreditDisplay, string> = {
    always:
      'absolute bottom-0 right-0 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-black/40 text-white',
    hover:
      'absolute bottom-0 right-0 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity',
    'alt-only': 'sr-only',
  };

  return (
    <figure className={`group ${wrapperClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ''}
        width={width}
        height={height}
        className={imgClassName}
        style={imgStyle}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      {children}
      {creditContent ? (
        <figcaption className={creditClassByMode[display]}>
          <span className="opacity-80">Photo:</span> {creditContent}
        </figcaption>
      ) : null}
    </figure>
  );
}

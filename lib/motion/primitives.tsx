'use client';

import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useAnimationTokens } from './AnimationProvider';

// ---------------------------------------------------------------------------
// H6 Sprint 14 — Motion primitives (preset-aware + reduced-motion)
//
// Hepsi preset: 'none' veya prefers-reduced-motion aktifse motion yerine
// düz div render edilir (zero-cost static).
// ---------------------------------------------------------------------------

function shouldAnimate(preset: string, reduced: boolean | null): boolean {
  return preset !== 'none' && !reduced;
}

// ---------------------------------------------------------------------------
// FadeIn — opacity + translate (preset.translate true ise)
// ---------------------------------------------------------------------------

export interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  children: ReactNode;
  /** Başlangıç gecikmesi (saniye). */
  delay?: number;
  /** fast | base | slow — token'dan okunur. */
  speed?: 'fast' | 'base' | 'slow';
  /** 'up' | 'down' | 'none' — translate yönü. Token.translate false ise unused. */
  direction?: 'up' | 'down' | 'none';
  as?: keyof typeof motion;
}

export function FadeIn({
  children,
  delay = 0,
  speed = 'base',
  direction = 'up',
  as: _as,
  className,
  style,
  ...rest
}: FadeInProps) {
  const { preset, tokens } = useAnimationTokens();
  const reduced = useReducedMotion();

  if (!shouldAnimate(preset, reduced) || !tokens.opacity) {
    return (
      <div className={className} style={style as React.CSSProperties | undefined}>
        {children}
      </div>
    );
  }

  const yOffset = tokens.translate && direction !== 'none' ? (direction === 'up' ? 20 : -20) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: tokens.duration[speed],
        ease: tokens.ease as any,
        delay,
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// SlideIn — x yönlü translate (preset.translate true ise)
// ---------------------------------------------------------------------------

export interface SlideInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  children: ReactNode;
  from?: 'left' | 'right';
  delay?: number;
  speed?: 'fast' | 'base' | 'slow';
}

export function SlideIn({
  children,
  from = 'left',
  delay = 0,
  speed = 'base',
  className,
  style,
  ...rest
}: SlideInProps) {
  const { preset, tokens } = useAnimationTokens();
  const reduced = useReducedMotion();

  if (!shouldAnimate(preset, reduced) || !tokens.translate) {
    return (
      <div className={className} style={style as React.CSSProperties | undefined}>
        {children}
      </div>
    );
  }

  const xOffset = from === 'left' ? -40 : 40;

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: tokens.duration[speed],
        ease: tokens.ease as any,
        delay,
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Stagger — children sırayla animasyonlu
// ---------------------------------------------------------------------------

export interface StaggerProps {
  children: ReactNode;
  /** Her child'ın başlangıç gecikmesi (token.stagger × idx). */
  staggerMultiplier?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Render tag — default 'div'. */
  as?: 'div' | 'ul' | 'ol' | 'section';
}

export function Stagger({
  children,
  staggerMultiplier = 1,
  className,
  style,
  as = 'div',
}: StaggerProps) {
  const { preset, tokens } = useAnimationTokens();
  const reduced = useReducedMotion();

  const Tag = as as any;

  if (!shouldAnimate(preset, reduced) || !tokens.opacity) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: tokens.stagger * staggerMultiplier,
      },
    },
  };

  const MotionTag = (motion as any)[as] ?? motion.div;

  return (
    <MotionTag
      initial="hidden"
      animate="show"
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  style,
  speed = 'base',
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  speed?: 'fast' | 'base' | 'slow';
  direction?: 'up' | 'down' | 'none';
}) {
  const { preset, tokens } = useAnimationTokens();
  const reduced = useReducedMotion();

  if (!shouldAnimate(preset, reduced) || !tokens.opacity) {
    return (
      <div className={className} style={style as React.CSSProperties | undefined}>
        {children}
      </div>
    );
  }

  const yOffset =
    tokens.translate && direction !== 'none' ? (direction === 'up' ? 20 : -20) : 0;

  const variants: Variants = {
    hidden: { opacity: 0, y: yOffset, scale: tokens.scale ? 0.95 : 1 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: tokens.duration[speed],
        ease: tokens.ease as any,
      },
    },
  };

  return (
    <motion.div variants={variants} className={className} style={style}>
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ScrollReveal — viewport'a girince tetikle
// ---------------------------------------------------------------------------

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  speed?: 'fast' | 'base' | 'slow';
  direction?: 'up' | 'down' | 'none';
  /** Sadece ilk kez görünürlükte tetikle — tekrar scroll'da tetiklenmez. */
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  style,
  speed = 'base',
  direction = 'up',
  once = true,
}: ScrollRevealProps) {
  const { preset, tokens } = useAnimationTokens();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    once,
    amount: tokens.scrollOffset,
  });

  if (!shouldAnimate(preset, reduced) || !tokens.opacity) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  const yOffset =
    tokens.translate && direction !== 'none' ? (direction === 'up' ? 30 : -30) : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration: tokens.duration[speed],
        ease: tokens.ease as any,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

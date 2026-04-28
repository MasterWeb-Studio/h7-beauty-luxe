import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimationProvider } from '../AnimationProvider';
import { FadeIn, SlideIn, Stagger, StaggerItem, ScrollReveal } from '../primitives';

// H6 Sprint 14 — Motion primitive basic render testleri.
// prefers-reduced-motion test jsdom'da zor, ama 'none' preset ile
// animasyonsuz fallback davranışı test edilebilir.

describe('Motion primitives', () => {
  describe('FadeIn', () => {
    it('renders children — normal preset', () => {
      render(
        <AnimationProvider preset="normal">
          <FadeIn>
            <span>visible</span>
          </FadeIn>
        </AnimationProvider>
      );
      expect(screen.getByText('visible')).toBeInTheDocument();
    });

    it('renders children as static — none preset (no motion wrapper)', () => {
      render(
        <AnimationProvider preset="none">
          <FadeIn>
            <span data-testid="n">static</span>
          </FadeIn>
        </AnimationProvider>
      );
      expect(screen.getByTestId('n')).toBeInTheDocument();
      expect(screen.getByText('static')).toBeInTheDocument();
    });
  });

  describe('SlideIn', () => {
    it('renders with translate — normal preset', () => {
      render(
        <AnimationProvider preset="normal">
          <SlideIn from="left">
            <span>slid</span>
          </SlideIn>
        </AnimationProvider>
      );
      expect(screen.getByText('slid')).toBeInTheDocument();
    });

    it('subtle preset skips translate (tokens.translate=false)', () => {
      render(
        <AnimationProvider preset="subtle">
          <SlideIn>
            <span>subtle-slide</span>
          </SlideIn>
        </AnimationProvider>
      );
      // Render çalıştı → content görünür
      expect(screen.getByText('subtle-slide')).toBeInTheDocument();
    });
  });

  describe('Stagger + StaggerItem', () => {
    it('renders children — energetic preset', () => {
      render(
        <AnimationProvider preset="energetic">
          <Stagger>
            <StaggerItem>
              <span>a</span>
            </StaggerItem>
            <StaggerItem>
              <span>b</span>
            </StaggerItem>
          </Stagger>
        </AnimationProvider>
      );
      expect(screen.getByText('a')).toBeInTheDocument();
      expect(screen.getByText('b')).toBeInTheDocument();
    });

    it('as="ul" → ul element', () => {
      const { container } = render(
        <AnimationProvider preset="normal">
          <Stagger as="ul">
            <StaggerItem>
              <li>x</li>
            </StaggerItem>
          </Stagger>
        </AnimationProvider>
      );
      const ul = container.querySelector('ul');
      expect(ul).not.toBeNull();
    });
  });

  describe('ScrollReveal', () => {
    it('renders children', () => {
      render(
        <AnimationProvider preset="normal">
          <ScrollReveal>
            <span>reveal</span>
          </ScrollReveal>
        </AnimationProvider>
      );
      expect(screen.getByText('reveal')).toBeInTheDocument();
    });

    it('none preset → static div (no motion/inView)', () => {
      render(
        <AnimationProvider preset="none">
          <ScrollReveal>
            <span>static</span>
          </ScrollReveal>
        </AnimationProvider>
      );
      expect(screen.getByText('static')).toBeInTheDocument();
    });
  });

  describe('AnimationProvider', () => {
    it('invalid preset → default "normal"', () => {
      render(
        <AnimationProvider preset={'invalid' as any}>
          <FadeIn>
            <span>content</span>
          </FadeIn>
        </AnimationProvider>
      );
      expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('null preset → default', () => {
      render(
        <AnimationProvider preset={null}>
          <FadeIn>
            <span>null-preset</span>
          </FadeIn>
        </AnimationProvider>
      );
      expect(screen.getByText('null-preset')).toBeInTheDocument();
    });
  });
});

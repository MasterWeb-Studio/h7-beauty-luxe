import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionImageFrame } from '../_helpers/SectionImageFrame';
import type { SectionImage } from '../../../lib/content-types';

// Sprint 18.5 G1 — SectionImageFrame unit testleri.
// 4 Hero + 2 About variant'ının image entegrasyonu bu helper'a bağlı —
// burası bozulursa canlıda görsel yok demektir.

describe('SectionImageFrame', () => {
  it('1. image undefined + fallback=true → gradient div render eder', () => {
    const { container } = render(<SectionImageFrame image={undefined} />);
    const div = container.querySelector('div[aria-hidden="true"]');
    expect(div).toBeInTheDocument();
    expect(div?.getAttribute('style')).toContain('linear-gradient');
  });

  it('2. image undefined + fallback=false → null (hiç render yok)', () => {
    const { container } = render(
      <SectionImageFrame image={undefined} showPlaceholderFallback={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('3. type=remote → img + credit + link', () => {
    const img: SectionImage = {
      type: 'remote',
      url: 'https://images.unsplash.com/photo-xyz.jpg',
      alt: 'Beauty salon',
      credit: 'Jane Doe / unsplash',
      creditUrl: 'https://unsplash.com/@jane',
      color: '#C87A6F',
      width: 1600,
      height: 1200,
    };
    render(<SectionImageFrame image={img} priority />);
    const el = screen.getByAltText('Beauty salon');
    expect(el.getAttribute('src')).toBe('https://images.unsplash.com/photo-xyz.jpg');
    expect(el.getAttribute('loading')).toBe('eager'); // priority=true
    expect(screen.getByRole('link', { name: 'Jane Doe / unsplash' })).toHaveAttribute(
      'href',
      'https://unsplash.com/@jane'
    );
  });

  it('4. type=placeholder + url → ImageWithCredit alt-only (credit UI yok)', () => {
    const img: SectionImage = {
      type: 'placeholder',
      url: 'https://cdn.example.com/placeholder.png',
      alt: 'ph',
    };
    render(<SectionImageFrame image={img} />);
    expect(screen.getByAltText('ph').getAttribute('src')).toContain('placeholder.png');
    // Credit block görünmez (alt-only) — 'Photo:' text yok
    expect(screen.queryByText('Photo:')).not.toBeInTheDocument();
  });

  it('5. type=placeholder url yok + fallback=true → gradient fallback', () => {
    const img: SectionImage = { type: 'placeholder' };
    const { container } = render(
      <SectionImageFrame image={img} fallbackGradient="linear-gradient(to right, red, blue)" />
    );
    const div = container.querySelector('div[aria-hidden="true"]');
    expect(div?.getAttribute('style')).toContain('red');
  });

  it('6. type=placeholder url yok + fallback=false → null', () => {
    const img: SectionImage = { type: 'placeholder' };
    const { container } = render(
      <SectionImageFrame image={img} showPlaceholderFallback={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('7. aspect prop uygulanır', () => {
    const img: SectionImage = {
      type: 'remote',
      url: 'https://x/y.jpg',
    };
    const { container } = render(<SectionImageFrame image={img} aspect="aspect-square" />);
    expect(container.querySelector('.aspect-square')).toBeInTheDocument();
  });

  it('8. className prop wrapper\'a eklenir', () => {
    const { container } = render(
      <SectionImageFrame image={undefined} className="rounded-2xl custom-x" />
    );
    expect(container.querySelector('.custom-x')).toBeInTheDocument();
  });

  it('9. creditDisplay=hover — ImageWithCredit\'e pass through', () => {
    const img: SectionImage = {
      type: 'remote',
      url: 'https://x/y.jpg',
      credit: 'A',
    };
    const { container } = render(
      <SectionImageFrame image={img} creditDisplay="hover" />
    );
    // hover modunda opacity-0 + group-hover sınıfları figcaption'da olur
    const fc = container.querySelector('figcaption');
    expect(fc?.className).toContain('opacity-0');
  });

  it('10. remote image alt yoksa boş string (img element yine render)', () => {
    const img: SectionImage = {
      type: 'remote',
      url: 'https://x/no-alt.jpg',
    };
    const { container } = render(<SectionImageFrame image={img} />);
    const imgEl = container.querySelector('img');
    expect(imgEl?.getAttribute('src')).toBe('https://x/no-alt.jpg');
    expect(imgEl?.getAttribute('alt')).toBe(''); // ImageWithCredit empty string default
  });
});

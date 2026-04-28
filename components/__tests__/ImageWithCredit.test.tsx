import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageWithCredit } from '../ImageWithCredit';

describe('ImageWithCredit (H6 Sprint 10)', () => {
  it('1. temel render — src + alt', () => {
    render(<ImageWithCredit src="/img.jpg" alt="test image" />);
    const img = screen.getByAltText('test image');
    expect(img).toHaveAttribute('src', '/img.jpg');
  });

  it('2. credit varsa figcaption render eder', () => {
    render(
      <ImageWithCredit
        src="/img.jpg"
        alt="x"
        credit="Jane Doe / unsplash"
      />
    );
    expect(screen.getByText(/Jane Doe \/ unsplash/)).toBeInTheDocument();
    expect(screen.getByText('Photo:')).toBeInTheDocument();
  });

  it('3. creditUrl verilirse anchor element', () => {
    render(
      <ImageWithCredit
        src="/img.jpg"
        alt="x"
        credit="J"
        creditUrl="https://unsplash.com/@jane"
      />
    );
    const link = screen.getByRole('link', { name: 'J' });
    expect(link).toHaveAttribute('href', 'https://unsplash.com/@jane');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('4. credit yoksa figcaption render ETMEZ', () => {
    render(<ImageWithCredit src="/img.jpg" alt="x" />);
    expect(screen.queryByText('Photo:')).not.toBeInTheDocument();
  });

  it('5. display=alt-only → credit sr-only', () => {
    render(
      <ImageWithCredit
        src="/img.jpg"
        alt="x"
        credit="J"
        display="alt-only"
      />
    );
    const caption = screen.getByText(/Photo:/);
    expect(caption.closest('figcaption')).toHaveClass('sr-only');
  });

  it('6. priority=true → loading=eager, default lazy', () => {
    const { rerender } = render(<ImageWithCredit src="/a.jpg" alt="a" priority />);
    expect(screen.getByAltText('a')).toHaveAttribute('loading', 'eager');
    rerender(<ImageWithCredit src="/a.jpg" alt="a" />);
    expect(screen.getByAltText('a')).toHaveAttribute('loading', 'lazy');
  });

  it('7. color dominant bg style olarak uygulanır', () => {
    render(<ImageWithCredit src="/a.jpg" alt="a" color="#abc123" />);
    const img = screen.getByAltText('a');
    expect(img).toHaveStyle({ background: 'rgb(171, 193, 35)' });
  });

  it('8. children (overlay) render edilir', () => {
    render(
      <ImageWithCredit src="/a.jpg" alt="a">
        <div data-testid="overlay">overlay content</div>
      </ImageWithCredit>
    );
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });
});

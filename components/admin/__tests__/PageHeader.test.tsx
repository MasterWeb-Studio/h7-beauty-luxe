import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PageHeader } from '../PageHeader';

vi.mock('next/link', () => ({
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('PageHeader', () => {
  it('1. sadece title → h1 + breadcrumb yok', () => {
    render(<PageHeader title="Ürünler" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ürünler');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('2. breadcrumbs → nav + ol + last aria-current', () => {
    render(
      <PageHeader
        title="Ürünler"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Ürünler' },
        ]}
      />
    );
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText('Admin').closest('a')).toHaveAttribute('href', '/admin');
    expect(screen.getByText('Ürünler', { selector: 'span' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('3. actions sağ tarafta render', () => {
    render(
      <PageHeader
        title="Ürünler"
        actions={<button type="button">Yeni Ürün</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Yeni Ürün' })).toBeInTheDocument();
  });

  it('4. description → subtitle render', () => {
    render(<PageHeader title="Ürünler" description="Katalog yönetimi" />);
    expect(screen.getByText('Katalog yönetimi')).toBeInTheDocument();
  });

  it('5. son breadcrumb href olsa bile link değil (aria-current)', () => {
    render(
      <PageHeader
        title="T"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Ürünler', href: '/admin/products' },
        ]}
      />
    );
    const last = screen.getByText('Ürünler', { selector: 'span' });
    expect(last).toHaveAttribute('aria-current', 'page');
    expect(last.tagName).toBe('SPAN');
  });

  it('6. ReactNode title → h1 fallback yok, node render', () => {
    render(
      <PageHeader title={<div data-testid="custom-title">Özel</div>} />
    );
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});

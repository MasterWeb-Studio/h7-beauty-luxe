import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../Sidebar';

// Next.js hooks
const mockPathname = { current: '/admin' };
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname.current,
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, className, ...rest }: any) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

describe('Sidebar (H6 Sprint 4 dinamik modül render)', () => {
  it('1. BASE_NAV linkleri render', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={false} />);
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: /İçerik/i })).toHaveAttribute('href', '/admin/content');
    expect(screen.getByRole('link', { name: /Tema/i })).toHaveAttribute('href', '/admin/theme');
    expect(screen.getByRole('link', { name: /Medya/i })).toHaveAttribute('href', '/admin/media');
  });

  it('2. Support + Ayarlar linkleri render', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={false} />);
    expect(screen.getByRole('link', { name: /Destek/i })).toHaveAttribute('href', '/admin/support');
    expect(screen.getByRole('link', { name: /Lead'ler/i })).toHaveAttribute('href', '/admin/leads');
    expect(screen.getByRole('link', { name: /Ayarlar/i })).toHaveAttribute('href', '/admin/settings');
  });

  it('3. Randevular conditional — showAppointments=false gizli', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={false} />);
    expect(screen.queryByRole('link', { name: /Randevular/i })).not.toBeInTheDocument();
  });

  it('4. Randevular conditional — showAppointments=true görünür', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={true} />);
    expect(screen.getByRole('link', { name: /Randevular/i })).toHaveAttribute(
      'href',
      '/admin/appointments'
    );
  });

  it('5. Modüller başlığı + modül linkleri dinamik', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={false} />);
    const modulesList = screen.getByTestId('sidebar-modules');
    expect(modulesList).toBeInTheDocument();

    // Sprint 7-8 sonrası 14 modül — displayName.tr'den
    const labels = [
      'Ürünler', 'Projeler', 'Haberler', 'Ekip', 'Referanslar',
      'Sertifikalar', 'Galeri', 'Kariyer', 'Hizmetler',
      'Sayaç', 'Bülten', 'Zaman Çizelgesi', 'Video', 'İletişim Kartları',
    ];
    for (const label of labels) {
      expect(within(modulesList).getByRole('link', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    }
  });

  it('6. Modül linki href /admin/modules/<id>', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={false} />);
    const modulesList = screen.getByTestId('sidebar-modules');
    expect(within(modulesList).getByRole('link', { name: /Ürünler/i })).toHaveAttribute(
      'href',
      '/admin/modules/products'
    );
    expect(within(modulesList).getByRole('link', { name: /Ekip/i })).toHaveAttribute(
      'href',
      '/admin/modules/team'
    );
  });

  it('7. Active link highlight — pathname /admin/modules/team', () => {
    mockPathname.current = '/admin/modules/team';
    render(<Sidebar showAppointments={false} />);
    const modulesList = screen.getByTestId('sidebar-modules');
    const teamLink = within(modulesList).getByRole('link', { name: /Ekip/i });
    expect(teamLink).toHaveAttribute('aria-current', 'page');
  });

  it('8. Active link — dashboard sadece tam /admin path\'te', () => {
    mockPathname.current = '/admin/content';
    render(<Sidebar showAppointments={false} />);
    const dashboard = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboard).not.toHaveAttribute('aria-current', 'page');
  });

  it('9. Priority sıralaması — critical/high önce', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={false} />);
    const modulesList = screen.getByTestId('sidebar-modules');
    const links = within(modulesList).getAllByRole('link');
    // Products (critical) en başta, diğerleri (high) sonra. References/Team/Projects/News high → id alfabetik.
    expect(links[0]).toHaveTextContent(/Ürünler/);
  });

  it('10. Çıkış butonu render', () => {
    mockPathname.current = '/admin';
    render(<Sidebar showAppointments={false} />);
    expect(screen.getByRole('button', { name: /Çıkış/i })).toBeInTheDocument();
  });
});

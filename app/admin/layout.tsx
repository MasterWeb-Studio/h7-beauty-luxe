import type { Metadata } from 'next';
import './admin.css';
import { ToastHost } from './_components/Toast';

// Admin nested layout — <html>/<body> root'ta (app/layout.tsx).
// Burada sadece admin-theme wrapper + metadata override + toast host.
// Sidebar + PageHeader yapısı (shell) route group'unda; login sayfası o wrapper dışında.

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme min-h-screen">
      {children}
      <ToastHost />
    </div>
  );
}

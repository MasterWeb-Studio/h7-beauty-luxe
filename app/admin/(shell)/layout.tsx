import type { ReactNode } from 'react';
import { AdminShell } from '../_components/AdminShell';
import { getContent } from '../../../lib/content-loader';

// Authed admin sayfalarını AdminShell (sidebar + content) ile sarmalar.
// /admin/login bu gruba girmez → login sayfası full-screen açılır.
// Content'ten appointment section var mı kontrol edip Sidebar'a iletir.

export default async function ShellLayout({ children }: { children: ReactNode }) {
  const content = await getContent();
  const showAppointments = content.pages.some((page) =>
    page.sections.some((section) => section.type === 'appointment')
  );

  return <AdminShell showAppointments={showAppointments}>{children}</AdminShell>;
}

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

// Dashboard / content / leads / appointments / settings sayfalarını saran kabuk.
// Login bu kabuğun DIŞINDA — admin/login/page.tsx kendi başına render edilir.

export function AdminShell({
  children,
  showAppointments,
}: {
  children: ReactNode;
  showAppointments: boolean;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar showAppointments={showAppointments} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

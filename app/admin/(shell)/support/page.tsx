import { PageHeader } from '../../_components/PageHeader';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../lib/supabase-admin';
import { SupportClient, type Ticket } from './_components/SupportClient';

export const dynamic = 'force-dynamic';

async function fetchInitialTickets(): Promise<Ticket[]> {
  let tenantId: string;
  let projectId: string | null;
  try {
    tenantId = getTenantId();
    projectId = getProjectId();
  } catch {
    return [];
  }
  if (!projectId) return [];

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('support_tickets')
      .select('id, subject, body, status, created_at, resolved_at')
      .eq('tenant_id', tenantId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return [];
    return (data ?? []) as Ticket[];
  } catch {
    return [];
  }
}

export default async function SupportPage() {
  const tickets = await fetchInitialTickets();
  return (
    <>
      <PageHeader
        title="Destek"
        description="Tema veya içerik dışında özel talep açın — Studio sahibi manuel olarak müdahale eder."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Destek' }]}
      />
      <div className="p-8">
        <SupportClient initialTickets={tickets} />
      </div>
    </>
  );
}

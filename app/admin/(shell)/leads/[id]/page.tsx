import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '../../../_components/PageHeader';
import { LeadStatusSelect } from '../_components/LeadStatusSelect';
import { NoteComposer } from '../_components/NoteComposer';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  body: string;
  created_at: string;
}

async function fetchLead(
  id: string
): Promise<{ lead: Lead | null; notes: Note[]; error: string | null }> {
  try {
    const supabase = getAdminSupabase();
    const tenantId = getTenantId();
    const projectId = getProjectId();

    let leadQuery = supabase
      .from('crm_leads')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (projectId) leadQuery = leadQuery.eq('project_id', projectId);

    const [leadRes, notesRes] = await Promise.all([
      leadQuery.maybeSingle(),
      supabase
        .from('crm_notes')
        .select('id, body, created_at')
        .eq('tenant_id', tenantId)
        .eq('parent_type', 'lead')
        .eq('parent_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (leadRes.error)
      return { lead: null, notes: [], error: leadRes.error.message };
    if (!leadRes.data) return { lead: null, notes: [], error: null };

    return {
      lead: leadRes.data as Lead,
      notes: (notesRes.data ?? []) as Note[],
      error: null,
    };
  } catch (err) {
    return {
      lead: null,
      notes: [],
      error: err instanceof Error ? err.message : 'DB hatası',
    };
  }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { lead, notes, error } = await fetchLead(id);

  if (error) {
    return (
      <>
        <PageHeader
          title="Lead"
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: "Lead'ler", href: '/admin/leads' },
          ]}
        />
        <div className="p-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        </div>
      </>
    );
  }
  if (!lead) notFound();

  return (
    <>
      <PageHeader
        title={lead.name}
        description={lead.email}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: "Lead'ler", href: '/admin/leads' },
          { label: lead.name },
        ]}
        actions={<LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />}
      />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Mesaj</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
              {lead.message ?? <span className="text-slate-400">Mesaj yok</span>}
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Notlar</h2>
              <span className="text-xs text-slate-400">{notes.length}</span>
            </div>

            <div className="mt-4">
              <NoteComposer parentType="lead" parentId={lead.id} />
            </div>

            {notes.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className="rounded border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="whitespace-pre-wrap text-sm text-slate-800">
                      {note.body}
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      {new Date(note.created_at).toLocaleString('tr-TR')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-slate-400">Henüz not yok.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Detay</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="E-posta" value={<a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>} />
              {lead.phone ? (
                <Row label="Telefon" value={<a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">{lead.phone}</a>} />
              ) : null}
              <Row label="Kaynak" value={<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{lead.source}</code>} />
              <Row label="Oluşturuldu" value={new Date(lead.created_at).toLocaleString('tr-TR')} />
              <Row label="Son değişiklik" value={new Date(lead.updated_at).toLocaleString('tr-TR')} />
            </dl>
          </section>

          <Link
            href="/admin/leads"
            className="block rounded border border-slate-200 bg-white px-4 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Lead listesi
          </Link>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{value}</dd>
    </div>
  );
}

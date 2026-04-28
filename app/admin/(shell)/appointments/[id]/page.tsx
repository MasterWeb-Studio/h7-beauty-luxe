import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '../../../_components/PageHeader';
import { AppointmentStatusSelect } from '../_components/AppointmentStatusSelect';
import { NoteComposer } from '../../leads/_components/NoteComposer';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

interface Appointment {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service: string | null;
  preferred_date: string;
  preferred_time: string;
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

const TIME_LABELS: Record<string, string> = {
  morning: 'Sabah',
  noon: 'Öğlen',
  afternoon: 'Öğleden sonra',
  evening: 'Akşam',
};

async function fetchAppointment(
  id: string
): Promise<{ appt: Appointment | null; notes: Note[]; error: string | null }> {
  try {
    const supabase = getAdminSupabase();
    const tenantId = getTenantId();
    const projectId = getProjectId();

    let apptQuery = supabase
      .from('crm_appointments')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (projectId) apptQuery = apptQuery.eq('project_id', projectId);

    const [apptRes, notesRes] = await Promise.all([
      apptQuery.maybeSingle(),
      supabase
        .from('crm_notes')
        .select('id, body, created_at')
        .eq('tenant_id', tenantId)
        .eq('parent_type', 'appointment')
        .eq('parent_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (apptRes.error)
      return { appt: null, notes: [], error: apptRes.error.message };
    if (!apptRes.data) return { appt: null, notes: [], error: null };

    return {
      appt: apptRes.data as Appointment,
      notes: (notesRes.data ?? []) as Note[],
      error: null,
    };
  } catch (err) {
    return {
      appt: null,
      notes: [],
      error: err instanceof Error ? err.message : 'DB hatası',
    };
  }
}

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { appt, notes, error } = await fetchAppointment(id);

  if (error) {
    return (
      <>
        <PageHeader
          title="Randevu"
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Randevular', href: '/admin/appointments' },
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
  if (!appt) notFound();

  return (
    <>
      <PageHeader
        title={appt.name}
        description={`${formatDate(appt.preferred_date)} — ${
          TIME_LABELS[appt.preferred_time] ?? appt.preferred_time
        }`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Randevular', href: '/admin/appointments' },
          { label: appt.name },
        ]}
        actions={
          <AppointmentStatusSelect
            appointmentId={appt.id}
            initialStatus={appt.status}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Talep</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Row label="Tarih" value={formatDate(appt.preferred_date)} />
              <Row
                label="Saat dilimi"
                value={TIME_LABELS[appt.preferred_time] ?? appt.preferred_time}
              />
              {appt.service ? <Row label="Hizmet" value={appt.service} /> : null}
              <Row label="Telefon" value={<a href={`tel:${appt.phone}`} className="text-blue-600 hover:underline">{appt.phone}</a>} />
              {appt.email ? (
                <Row
                  label="E-posta"
                  value={<a href={`mailto:${appt.email}`} className="text-blue-600 hover:underline">{appt.email}</a>}
                />
              ) : null}
            </dl>
            {appt.notes ? (
              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="text-xs text-slate-500">Konuğun notu</div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {appt.notes}
                </p>
              </div>
            ) : null}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">İç notlar</h2>
              <span className="text-xs text-slate-400">{notes.length}</span>
            </div>

            <div className="mt-4">
              <NoteComposer parentType="appointment" parentId={appt.id} />
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
            <h2 className="text-sm font-semibold text-slate-900">Kayıt</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row
                label="Oluşturuldu"
                value={new Date(appt.created_at).toLocaleString('tr-TR')}
              />
              <Row
                label="Son değişiklik"
                value={new Date(appt.updated_at).toLocaleString('tr-TR')}
              />
            </dl>
          </section>

          <Link
            href="/admin/appointments"
            className="block rounded border border-slate-200 bg-white px-4 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Randevu listesi
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

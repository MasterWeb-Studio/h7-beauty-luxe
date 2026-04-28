import Link from 'next/link';
import { PageHeader } from '../../_components/PageHeader';
import { AppointmentsFilterBar } from './_components/AppointmentsFilterBar';
import { AppointmentStatusSelect } from './_components/AppointmentStatusSelect';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

interface ApptRow {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service: string | null;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

interface SearchParams {
  status?: string;
  range?: string;
  page?: string;
}

function computeDateRange(range: string | undefined): { start?: string; end?: string } {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  if (range === 'today') {
    return { start: todayStr, end: todayStr };
  }
  if (range === 'week') {
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    return { start: todayStr, end: end.toISOString().slice(0, 10) };
  }
  if (range === 'month') {
    const end = new Date(today);
    end.setDate(end.getDate() + 30);
    return { start: todayStr, end: end.toISOString().slice(0, 10) };
  }
  return {};
}

async function fetchAppointments(
  params: SearchParams
): Promise<{ rows: ApptRow[]; total: number; page: number; error: string | null }> {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  try {
    const supabase = getAdminSupabase();
    const tenantId = getTenantId();
    const projectId = getProjectId();

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('crm_appointments')
      .select(
        'id, name, email, phone, service, preferred_date, preferred_time, status, created_at',
        { count: 'exact' }
      )
      .eq('tenant_id', tenantId)
      .order('preferred_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (projectId) query = query.eq('project_id', projectId);
    if (params.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }
    const { start, end } = computeDateRange(params.range);
    if (start) query = query.gte('preferred_date', start);
    if (end) query = query.lte('preferred_date', end);

    const { data, count, error } = await query;
    if (error) return { rows: [], total: 0, page, error: error.message };
    return { rows: (data ?? []) as ApptRow[], total: count ?? 0, page, error: null };
  } catch (err) {
    return {
      rows: [],
      total: 0,
      page,
      error: err instanceof Error ? err.message : 'DB hatası',
    };
  }
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { rows, total, page, error } = await fetchAppointments(params);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Randevular"
        description={error ? 'Bir sorun var — aşağıya bak' : `${total} kayıt`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Randevular' }]}
      />

      <div className="space-y-4 p-8">
        <AppointmentsFilterBar />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <div className="text-sm font-medium text-slate-600">Randevu yok</div>
            <p className="mt-1 text-xs text-slate-500">
              Filtreleri temizle veya randevu formundan yeni randevular bekle.
            </p>
          </div>
        ) : (
          <>
            <AppointmentsTable rows={rows} />
            {totalPages > 1 ? (
              <Pagination page={page} totalPages={totalPages} searchParams={params} />
            ) : null}
          </>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------

const TIME_LABELS: Record<string, string> = {
  morning: 'Sabah',
  noon: 'Öğlen',
  afternoon: 'Öğleden sonra',
  evening: 'Akşam',
};

function AppointmentsTable({ rows }: { rows: ApptRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <Th>Konuk</Th>
            <Th>Hizmet</Th>
            <Th>Tarih & Saat</Th>
            <Th>Statü</Th>
            <Th>Alındı</Th>
            <Th className="text-right">Detay</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((appt) => (
            <tr key={appt.id} className="hover:bg-slate-50">
              <Td>
                <div className="font-medium text-slate-900">{appt.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">{appt.phone}</div>
              </Td>
              <Td>
                {appt.service ? (
                  <span className="text-slate-700">{appt.service}</span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </Td>
              <Td>
                <div className="text-slate-900">{formatDate(appt.preferred_date)}</div>
                <div className="text-xs text-slate-500">
                  {TIME_LABELS[appt.preferred_time] ?? appt.preferred_time}
                </div>
              </Td>
              <Td>
                <AppointmentStatusSelect
                  appointmentId={appt.id}
                  initialStatus={appt.status}
                  compact
                />
              </Td>
              <Td>
                <span className="text-xs text-slate-500">
                  {formatRelative(appt.created_at)}
                </span>
              </Td>
              <Td className="text-right">
                <Link
                  href={`/admin/appointments/${appt.id}`}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Görüntüle →
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 text-sm align-top ${className}`}>{children}</td>;
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: SearchParams;
}) {
  const makeHref = (n: number): string => {
    const p = new URLSearchParams();
    if (searchParams.status) p.set('status', searchParams.status);
    if (searchParams.range) p.set('range', searchParams.range);
    if (n > 1) p.set('page', String(n));
    const qs = p.toString();
    return qs ? `/admin/appointments?${qs}` : '/admin/appointments';
  };

  return (
    <nav className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs text-slate-500">
        Sayfa {page} / {totalPages}
      </div>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={makeHref(page - 1)}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Önceki
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link
            href={makeHref(page + 1)}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Sonraki →
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'az önce';
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün`;
  return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
}

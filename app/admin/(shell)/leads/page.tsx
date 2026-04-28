import Link from 'next/link';
import { PageHeader } from '../../_components/PageHeader';
import { LeadsFilterBar } from './_components/LeadsFilterBar';
import { LeadStatusSelect } from './_components/LeadStatusSelect';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  source: string;
  message: string | null;
  created_at: string;
}

interface SearchParams {
  status?: string;
  q?: string;
  page?: string;
}

async function fetchLeads(
  params: SearchParams
): Promise<{ leads: LeadRow[]; total: number; page: number; error: string | null }> {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  try {
    const supabase = getAdminSupabase();
    const tenantId = getTenantId();
    const projectId = getProjectId();

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('crm_leads')
      .select('id, name, email, phone, status, source, message, created_at', {
        count: 'exact',
      })
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (projectId) query = query.eq('project_id', projectId);
    if (params.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }
    if (params.q) {
      const safe = params.q.replace(/[%,()]/g, '');
      if (safe) query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%`);
    }

    const { data, count, error } = await query;
    if (error) return { leads: [], total: 0, page, error: error.message };
    return { leads: (data ?? []) as LeadRow[], total: count ?? 0, page, error: null };
  } catch (err) {
    return {
      leads: [],
      total: 0,
      page,
      error: err instanceof Error ? err.message : 'DB hatası',
    };
  }
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { leads, total, page, error } = await fetchLeads(params);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Lead'ler"
        description={error ? 'Bir sorun var — aşağıya bak' : `${total} kayıt`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: "Lead'ler" }]}
      />

      <div className="space-y-4 p-8">
        <LeadsFilterBar />

        {error ? (
          <ErrorCard message={error} />
        ) : leads.length === 0 ? (
          <EmptyCard />
        ) : (
          <>
            <LeadsTable leads={leads} />
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

function LeadsTable({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <Th>İsim</Th>
            <Th>İletişim</Th>
            <Th>Kaynak</Th>
            <Th>Statü</Th>
            <Th>Tarih</Th>
            <Th className="text-right">Detay</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50">
              <Td>
                <div className="font-medium text-slate-900">{lead.name}</div>
                {lead.message ? (
                  <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                    {lead.message}
                  </div>
                ) : null}
              </Td>
              <Td>
                <div className="text-slate-700">{lead.email}</div>
                {lead.phone ? (
                  <div className="text-xs text-slate-500">{lead.phone}</div>
                ) : null}
              </Td>
              <Td>
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                  {lead.source}
                </span>
              </Td>
              <Td>
                <LeadStatusSelect
                  leadId={lead.id}
                  initialStatus={lead.status}
                  compact
                />
              </Td>
              <Td>
                <span className="text-xs text-slate-500">
                  {formatDate(lead.created_at)}
                </span>
              </Td>
              <Td className="text-right">
                <Link
                  href={`/admin/leads/${lead.id}`}
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

function EmptyCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      <div className="text-sm font-medium text-slate-600">Kayıt yok</div>
      <p className="mt-1 text-xs text-slate-500">
        İletişim formu doldurulduğunda lead'ler burada görünür.
      </p>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <div className="text-sm font-semibold text-red-900">Lead'ler yüklenemedi</div>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
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
    if (searchParams.q) p.set('q', searchParams.q);
    if (n > 1) p.set('page', String(n));
    const qs = p.toString();
    return qs ? `/admin/leads?${qs}` : '/admin/leads';
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

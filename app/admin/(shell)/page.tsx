import { PageHeader } from '../_components/PageHeader';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../lib/supabase-admin';
import { getContent } from '../../../lib/content-loader';
import type { ContentPlan } from '../../../lib/content-types';
import { projectInfo } from '../../../lib/project-info';

// Supabase sorgusu her istekte çalışsın — son veri görünsün.
export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalLeads: number;
  weeklyLeads: number;
  totalAppointments: number;
  pendingAppointments: number;
}

interface LeadRow {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

interface AppointmentRow {
  id: string;
  name: string;
  phone: string;
  service: string | null;
  preferred_date: string;
  preferred_time: string;
  status: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentLeads: LeadRow[];
  upcomingAppointments: AppointmentRow[];
}

function hasAppointmentMode(content: ContentPlan): boolean {
  return content.pages.some((page) =>
    page.sections.some((section) => section.type === 'appointment')
  );
}

async function fetchDashboardData(): Promise<DashboardData | { error: string }> {
  try {
    const supabase = getAdminSupabase();
    const tenantId = getTenantId();
    const projectId = getProjectId();

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const todayStr = new Date().toISOString().slice(0, 10);

    const baseLeads = () => {
      const q = supabase.from('crm_leads').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId);
      return projectId ? q.eq('project_id', projectId) : q;
    };
    const baseAppointments = () => {
      const q = supabase.from('crm_appointments').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId);
      return projectId ? q.eq('project_id', projectId) : q;
    };
    const recentLeadsQ = () => {
      const q = supabase
        .from('crm_leads')
        .select('id, name, email, status, created_at')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);
      return projectId ? q.eq('project_id', projectId) : q;
    };
    const upcomingQ = () => {
      const q = supabase
        .from('crm_appointments')
        .select('id, name, phone, service, preferred_date, preferred_time, status')
        .eq('tenant_id', tenantId)
        .in('status', ['requested', 'confirmed'])
        .gte('preferred_date', todayStr)
        .order('preferred_date', { ascending: true })
        .limit(5);
      return projectId ? q.eq('project_id', projectId) : q;
    };

    const [totalLeadsRes, weeklyLeadsRes, totalApptsRes, pendingApptsRes, recentLeadsRes, upcomingRes] =
      await Promise.all([
        baseLeads(),
        baseLeads().gte('created_at', weekAgo),
        baseAppointments(),
        baseAppointments().eq('status', 'requested'),
        recentLeadsQ(),
        upcomingQ(),
      ]);

    const firstError =
      totalLeadsRes.error ??
      weeklyLeadsRes.error ??
      totalApptsRes.error ??
      pendingApptsRes.error ??
      recentLeadsRes.error ??
      upcomingRes.error;
    if (firstError) {
      return { error: firstError.message };
    }

    return {
      stats: {
        totalLeads: totalLeadsRes.count ?? 0,
        weeklyLeads: weeklyLeadsRes.count ?? 0,
        totalAppointments: totalApptsRes.count ?? 0,
        pendingAppointments: pendingApptsRes.count ?? 0,
      },
      recentLeads: (recentLeadsRes.data ?? []) as LeadRow[],
      upcomingAppointments: (upcomingRes.data ?? []) as AppointmentRow[],
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Veri alınamadı.' };
  }
}

export default async function DashboardPage() {
  const [content, data] = await Promise.all([getContent(), fetchDashboardData()]);
  const appointmentMode = hasAppointmentMode(content);

  return (
    <>
      <PageHeader title="Dashboard" description="Proje genel bakış" />

      <div className="space-y-6 p-8">
        <ProjectCard content={content} />

        {'error' in data ? (
          <ErrorCard message={data.error} />
        ) : (
          <>
            <StatsGrid stats={data.stats} showAppointments={appointmentMode} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RecentLeads leads={data.recentLeads} />
              {appointmentMode ? (
                <UpcomingAppointments appointments={data.upcomingAppointments} />
              ) : (
                <AppointmentDisabledCard />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Bileşenler
// ---------------------------------------------------------------------------

function ProjectCard({ content }: { content: ContentPlan }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500">Proje</div>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            {content.meta.companyName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{content.meta.tagline}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Sektör: <span className="font-medium text-slate-700">{projectInfo.industry}</span></div>
          <div className="mt-1">Slug: <code className="rounded bg-slate-100 px-1.5 py-0.5">{projectInfo.slug}</code></div>
          <div className="mt-1">
            Üretildi: {new Date(projectInfo.generatedAt).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({
  stats,
  showAppointments,
}: {
  stats: DashboardStats;
  showAppointments: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Toplam Lead" value={stats.totalLeads} />
      <StatCard label="Bu hafta" value={stats.weeklyLeads} />
      {showAppointments ? (
        <>
          <StatCard label="Toplam Randevu" value={stats.totalAppointments} />
          <StatCard
            label="Bekleyen Randevu"
            value={stats.pendingAppointments}
            accent={stats.pendingAppointments > 0}
          />
        </>
      ) : (
        <>
          <StatCard label="Toplam Randevu" value="—" muted />
          <StatCard label="Bekleyen Randevu" value="—" muted />
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="text-xs uppercase tracking-widest text-slate-500">{label}</div>
      <div
        className={`mt-2 text-2xl font-semibold ${
          muted ? 'text-slate-300' : accent ? 'text-blue-600' : 'text-slate-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

const LEAD_STATUS: Record<string, { label: string; classes: string }> = {
  new: { label: 'Yeni', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: 'İletişim', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  qualified: { label: 'Nitelikli', classes: 'bg-green-50 text-green-700 border-green-200' },
  closed: { label: 'Kapandı', classes: 'bg-slate-100 text-slate-500 border-slate-200' },
};

function RecentLeads({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">Son Lead&apos;ler</h3>
        <span className="text-xs text-slate-400">Son 5</span>
      </div>
      {leads.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-500">
          Henüz lead yok.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {leads.map((lead) => {
            const status = LEAD_STATUS[lead.status] ?? {
              label: lead.status,
              classes: 'bg-slate-100 text-slate-700 border-slate-200',
            };
            return (
              <li key={lead.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">{lead.name}</div>
                  <div className="truncate text-xs text-slate-500">{lead.email}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${status.classes}`}
                  >
                    {status.label}
                  </span>
                  <span className="text-xs text-slate-400">{formatRelative(lead.created_at)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const TIME_SLOT: Record<string, string> = {
  morning: 'Sabah',
  noon: 'Öğlen',
  afternoon: 'Öğleden sonra',
  evening: 'Akşam',
};

function UpcomingAppointments({ appointments }: { appointments: AppointmentRow[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">Yaklaşan Randevular</h3>
        <span className="text-xs text-slate-400">Bugünden sonra</span>
      </div>
      {appointments.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-500">
          Bekleyen randevu yok.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {appointments.map((appt) => (
            <li key={appt.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-900">{appt.name}</div>
                <div className="truncate text-xs text-slate-500">
                  {appt.service ?? appt.phone}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm text-slate-900">{formatDate(appt.preferred_date)}</div>
                <div className="text-xs text-slate-500">{TIME_SLOT[appt.preferred_time] ?? appt.preferred_time}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AppointmentDisabledCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="text-sm font-medium text-slate-600">
        Randevu sistemi aktif değil
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Bu projenin iletişim sayfası <code className="rounded bg-slate-100 px-1 py-0.5">contact</code> section kullanıyor.
        Randevu almak için sayfaya <code className="rounded bg-slate-100 px-1 py-0.5">appointment</code> section eklenmeli.
      </p>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <div className="text-sm font-semibold text-red-900">Veri yüklenemedi</div>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      <p className="mt-3 text-xs text-red-600">
        <code className="rounded bg-white px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code>,
        <code className="ml-1 rounded bg-white px-1 py-0.5">NEXT_PUBLIC_TENANT_ID</code>
        {' '}ve Supabase şeması kontrol edilmeli.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tarih/zaman yardımcıları
// ---------------------------------------------------------------------------

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

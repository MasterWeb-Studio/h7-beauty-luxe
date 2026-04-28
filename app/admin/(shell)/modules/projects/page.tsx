import { getSpecById } from '@studio/shared/specs';
import { ModuleList } from '@/components/admin/ModuleList';
import { PageHeader } from '@/components/admin/PageHeader';

async function ModuleListContainer({ spec }: { spec: any }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/modules/projects?pageSize=50`,
    { cache: 'no-store' }
  );
  const { items = [], total = 0 } = res.ok ? await res.json() : {};
  return (
    <ModuleList
      spec={spec}
      items={items}
      total={total}
      modulePath="/admin/modules/projects"
      newPath="/admin/modules/projects/new"
      columns={spec.admin.listView.columns}
      filters={spec.admin.listView.filters}
      bulkActions={spec.admin.bulkActions}
      searchableFields={spec.admin.listView.searchableFields}
      defaultSort={spec.admin.listView.defaultSort}
      pageSize={spec.admin.listView.pageSize}
      showLocaleBadges={spec.admin.listView.showLocaleBadges}
      supportedLocales={['tr', 'en']}
    />
  );
}

export default function ModuleListPage() {
  const spec = getSpecById('projects')!;
  return (
    <div className="space-y-6">
      <PageHeader
        title={spec.meta.displayName.tr ?? spec.meta.id}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: spec.meta.displayName.tr ?? spec.meta.id },
        ]}
        actions={
          <>
            <a
              href="/admin/modules/projects/new"
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Yeni Proje
            </a>
            <a
              href="/admin/modules/projects/categories"
              className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Kategoriler
            </a>
          </>
        }
      />
      <ModuleListContainer spec={spec} />
    </div>
  );
}

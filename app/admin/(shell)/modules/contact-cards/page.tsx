import { getSpecById } from '@studio/shared/specs';
import { ModuleList } from '@/components/admin/ModuleList';
import { PageHeader } from '@/components/admin/PageHeader';

async function ModuleListContainer({ spec }: { spec: any }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/modules/contact-cards?pageSize=50`,
    { cache: 'no-store' }
  );
  const { items = [], total = 0 } = res.ok ? await res.json() : {};
  return (
    <ModuleList
      spec={spec}
      items={items}
      total={total}
      newHref="/admin/modules/contact-cards/new"
      editHrefFn={(item: any) => `/admin/modules/contact-cards/${item.id}`}
      supportedLocales={['tr', 'en']}
    />
  );
}

export default function ModuleListPage() {
  const spec = getSpecById('contact-cards')!;
  return (
    <div className="space-y-6">
      <PageHeader
        title={spec.meta.displayName.tr ?? spec.meta.id}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: spec.meta.displayName.tr ?? spec.meta.id },
        ]}
      />
      <ModuleListContainer spec={spec} />
    </div>
  );
}

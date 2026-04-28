'use client';

import { useRouter } from 'next/navigation';
import { getSpecById } from '@studio/shared/specs';
import { ModuleDetail } from '@/components/admin/ModuleDetail';
import { PageHeader } from '@/components/admin/PageHeader';

function fieldsFromSpec(spec: any) {
  return spec.fields.map((f: any) => ({
    name: f.name,
    type: f.type,
    label: f.description?.tr ?? f.name,
    localeAware: f.localeAware ?? false,
    required: f.required ?? false,
    maxLength: f.maxLength,
    enumValues: f.enumValues,
    default: f.default,
    helpText: f.adminHelp?.tr,
  }));
}

function tabsFromSpec(spec: any) {
  const tabs = spec.admin.detailView.tabs.map((tab: any) => ({
    id: tab.id,
    label: tab.label?.tr ?? tab.id,
    fields: spec.admin.detailView.fieldGroups
      .filter((g: any) => g.tabId === tab.id)
      .flatMap((g: any) => g.fields),
  }));
  return tabs;
}

export default function NewPage() {
  const spec = getSpecById('products')!;
  const router = useRouter();
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Yeni ${spec.meta.displayName.tr ?? spec.meta.id}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: spec.meta.displayName.tr ?? spec.meta.id, href: '/admin/modules/products' },
          { label: 'Yeni' },
        ]}
      />
      <ModuleDetail
        item={null}
        fields={fieldsFromSpec(spec)}
        tabs={tabsFromSpec(spec)}
        moduleName={spec.meta.displayName.tr ?? spec.meta.id}
        supportedLocales={['tr', 'en']}
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID!}
        onSave={async (values) => {
          const res = await fetch('/api/admin/modules/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!res.ok) throw new Error('Kaydedilemedi');
          const { item } = await res.json();
          router.push(`/admin/modules/products/${item.id}`);
        }}
        onCancel={() => router.push('/admin/modules/products')}
      />
    </div>
  );
}

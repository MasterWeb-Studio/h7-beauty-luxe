'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSpecById } from '@studio/shared/specs';
import { ModuleDetail } from '@/components/admin/ModuleDetail';
import { PageHeader } from '@/components/admin/PageHeader';

function fieldsFromSpec(spec: any) {
  return spec.fields.map((f: any) => ({
    name: f.name,
    type: f.type,
    label: f.description ?? { tr: f.name, en: f.name },
    localeAware: f.localeAware ?? false,
    required: f.required ?? false,
    maxLength: f.maxLength,
    enumValues: f.enumValues,
    default: f.default,
    adminHelp: f.adminHelp,
  }));
}

function tabsFromSpec(spec: any) {
  return spec.admin.detailView.tabs.map((tab: any) => ({
    id: tab.id,
    label: tab.label,
    fields: spec.admin.detailView.fieldGroups
      .filter((g: any) => g.tabId === tab.id)
      .flatMap((g: any) => g.fields),
  }));
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const spec = getSpecById('counter')!;
  const router = useRouter();
  const [item, setItem] = useState<any | null>(null);
  const [recordId, setRecordId] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setRecordId(id);
      const res = await fetch(`/api/admin/modules/counter/${id}`);
      if (res.ok) setItem((await res.json()).item);
    })();
  }, [params]);

  if (!item) return <div className="p-6 text-sm text-slate-500">Yükleniyor…</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={spec.meta.displayName.tr ?? spec.meta.id}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: spec.meta.displayName.tr ?? spec.meta.id, href: '/admin/modules/counter' },
          { label: 'Düzenle' },
        ]}
      />
      <ModuleDetail
        item={item}
        fields={fieldsFromSpec(spec)}
        tabs={tabsFromSpec(spec)}
        moduleName={spec.meta.displayName.tr ?? spec.meta.id}
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID!}
        onSave={async (values) => {
          const res = await fetch(`/api/admin/modules/counter/${recordId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!res.ok) throw new Error('Kaydedilemedi');
        }}
        onDelete={async (id) => {
          await fetch(`/api/admin/modules/counter/${id}`, { method: 'DELETE' });
          router.push('/admin/modules/counter');
        }}
        onCancel={() => router.push('/admin/modules/counter')}
      />
    </div>
  );
}

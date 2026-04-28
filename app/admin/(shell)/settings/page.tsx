import { PageHeader } from '../../_components/PageHeader';
import { getContent } from '../../../../lib/content-loader';
import { SettingsClient } from './SettingsClient';

// Server wrapper: content ve tenant/project ID'leri client'a prop olarak geçer.
// process.env burada (server-side) okunur; client component'e serialize edilir.

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const content = await getContent();
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID ?? '';
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? '';

  return (
    <>
      <PageHeader
        title="Ayarlar"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Ayarlar' }]}
      />
      <div className="p-8">
        <SettingsClient
          initialContent={content}
          tenantId={tenantId}
          projectId={projectId}
        />
      </div>
    </>
  );
}

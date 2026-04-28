import { PageHeader } from '@/components/admin/PageHeader';
import { MediaLibraryClient } from './MediaLibraryClient';

// H6 Sprint 13 — Merkezi medya admin sayfası
// Tüm media_library kayıtları grid görünümünde + filter + bulk delete.

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Medya Kütüphanesi"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Medya' },
        ]}
      />
      <MediaLibraryClient />
    </div>
  );
}

import { PageHeader } from '../../_components/PageHeader';
import { getContent } from '../../../../lib/content-loader';
import { ContentEditor } from './ContentEditor';

// Server component — content'i Supabase'ten (ya da static fallback) okur,
// client editor'e prop olarak geçer. Save sonrası router.refresh() bu
// sayfayı yeniden render ettirir → güncel veri çekilir.
export const dynamic = 'force-dynamic';

export default async function ContentPage() {
  const content = await getContent();
  return (
    <>
      <PageHeader
        title="İçerik"
        description="Site sayfalarını ve section'larını düzenleyin"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'İçerik' }]}
      />
      <div className="p-8">
        <ContentEditor initialContent={content} />
      </div>
    </>
  );
}

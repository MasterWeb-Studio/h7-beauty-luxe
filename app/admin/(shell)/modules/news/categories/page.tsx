'use client';

import { useState, useEffect } from 'react';
import { CategoryTree } from '@/components/admin/CategoryTree';
import { PageHeader } from '@/components/admin/PageHeader';

export default function NewsCategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/categories?module=news')
      .then((r) => r.json())
      .then((d) => setCats(d.items ?? []));
  }, []);

  const reload = () => {
    fetch('/api/admin/categories?module=news')
      .then((r) => r.json())
      .then((d) => setCats(d.items ?? []));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategoriler"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Haberler', href: '/admin/modules/news' },
          { label: 'Kategoriler' },
        ]}
      />
      <CategoryTree
        categories={cats}
        locale="tr"
        mode="manage"
        maxDepth={1}
        onCreate={async (parentId, name) => {
          await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: 'news', parentId, name }),
          });
          reload();
        }}
        onUpdate={async (id, patch) => {
          await fetch(`/api/admin/categories/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
          });
          reload();
        }}
        onDelete={async (id) => {
          await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
          reload();
        }}
        onReorder={async (ids, parentId) => {
          await fetch('/api/admin/categories/reorder', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, parentId, module: 'news' }),
          });
          reload();
        }}
      />
    </div>
  );
}

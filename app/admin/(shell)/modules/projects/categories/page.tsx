'use client';

import { useState, useEffect } from 'react';
import { CategoryTree } from '@/components/admin/CategoryTree';
import { PageHeader } from '@/components/admin/PageHeader';

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);

  const loadCategories = () => {
    fetch('/api/admin/categories?module=projects')
      .then((r) => r.json())
      .then((d) => setCats(d.items ?? []));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategoriler"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Projeler', href: '/admin/modules/projects' },
          { label: 'Kategoriler' },
        ]}
      />
      <CategoryTree
        categories={cats}
        locale="tr"
        mode="manage"
        maxDepth={2}
        onCreate={async (parentId, name) => {
          await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: 'projects', parent_id: parentId ?? null, name }),
          });
          loadCategories();
        }}
        onUpdate={async (id, patch) => {
          await fetch(`/api/admin/categories/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
          });
          loadCategories();
        }}
        onDelete={async (id) => {
          await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
          loadCategories();
        }}
        onReorder={async (ids, parentId) => {
          await fetch('/api/admin/categories/reorder', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: 'projects', ids, parent_id: parentId ?? null }),
          });
          loadCategories();
        }}
      />
    </div>
  );
}

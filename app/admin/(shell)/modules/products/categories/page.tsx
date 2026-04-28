'use client';

import { useState, useEffect } from 'react';
import { CategoryTree } from '@/components/admin/CategoryTree';
import { PageHeader } from '@/components/admin/PageHeader';

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/categories?module=products')
      .then((r) => r.json())
      .then((d) => setCats(d.items ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategoriler"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Ürünler', href: '/admin/modules/products' },
          { label: 'Kategoriler' },
        ]}
      />
      <CategoryTree
        categories={cats}
        locale="tr"
        mode="manage"
        maxDepth={4}
        onCreate={async (parentId, name) => {
          await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: 'products', parentId, name }),
          });
          const res = await fetch('/api/admin/categories?module=products');
          const d = await res.json();
          setCats(d.items ?? []);
        }}
        onUpdate={async (id, patch) => {
          await fetch(`/api/admin/categories/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
          });
          const res = await fetch('/api/admin/categories?module=products');
          const d = await res.json();
          setCats(d.items ?? []);
        }}
        onDelete={async (id) => {
          await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
          const res = await fetch('/api/admin/categories?module=products');
          const d = await res.json();
          setCats(d.items ?? []);
        }}
        onReorder={async (ids, parentId) => {
          await fetch('/api/admin/categories/reorder', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: 'products', ids, parentId }),
          });
          const res = await fetch('/api/admin/categories?module=products');
          const d = await res.json();
          setCats(d.items ?? []);
        }}
      />
    </div>
  );
}

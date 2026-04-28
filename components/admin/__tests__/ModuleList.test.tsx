import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ModuleList, type ModuleItem, type ColumnDef } from '../ModuleList';

const COLUMNS: ColumnDef[] = [
  { field: 'name', label: 'Ad', sortable: true },
  { field: 'category', label: 'Kategori' },
  { field: 'active', label: 'Aktif' },
];

const ITEMS: ModuleItem[] = [
  { id: '1', name: { tr: 'Mobilya', en: 'Furniture' }, category: 'A', active: true },
  { id: '2', name: { tr: 'Aksesuar', en: 'Accessories' }, category: 'B', active: false },
  { id: '3', name: { tr: 'Bilgisayar', en: 'Computer' }, category: 'A', active: true },
];

describe('ModuleList', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. items boş → empty state + CTA', () => {
    const onCreate = vi.fn();
    render(
      <ModuleList
        items={[]}
        columns={COLUMNS}
        moduleName="Ürün"
        onCreate={onCreate}
      />
    );
    expect(screen.getByText(/henüz ürün eklenmedi/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yeni ürün ekle/i })).toBeInTheDocument();
  });

  it('2. <=pageSize → pagination gizli', () => {
    render(
      <ModuleList items={ITEMS} columns={COLUMNS} moduleName="Ürün" pageSize={50} />
    );
    expect(screen.queryByText(/sayfa 1/i)).not.toBeInTheDocument();
  });

  it('3. >pageSize → pagination render', () => {
    const many = Array.from({ length: 12 }).map((_, i) => ({
      id: `i${i}`,
      name: { tr: `X${i}` },
      category: 'A',
      active: true,
    }));
    render(
      <ModuleList items={many} columns={COLUMNS} moduleName="Ürün" pageSize={5} />
    );
    expect(screen.getByText(/sayfa 1\/3/i)).toBeInTheDocument();
  });

  it('4. Search debounced → filtered list', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ModuleList
        items={ITEMS}
        columns={COLUMNS}
        moduleName="Ürün"
        searchableFields={['name']}
      />
    );
    await user.type(screen.getByRole('textbox'), 'Mob');
    vi.advanceTimersByTime(350);
    await waitFor(() => {
      expect(screen.getByText('Mobilya')).toBeInTheDocument();
      expect(screen.queryByText('Aksesuar')).not.toBeInTheDocument();
    });
  });

  it('5. Sort column toggle asc → desc', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ModuleList items={ITEMS} columns={COLUMNS} moduleName="Ürün" />
    );
    const sortBtn = screen.getByRole('button', { name: /Ad/i });
    await user.click(sortBtn);
    const header = sortBtn.closest('th')!;
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    await user.click(sortBtn);
    expect(header).toHaveAttribute('aria-sort', 'descending');
  });

  it('6. Bulk select 2 → BulkActionBar + "2 seçildi"', async () => {
    const user = userEvent.setup();
    render(
      <ModuleList
        items={ITEMS}
        columns={COLUMNS}
        moduleName="Ürün"
        bulkActions={[{ id: 'delete', label: 'Sil', destructive: true }]}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox', { name: /satır seç/i });
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(screen.getByRole('region', { name: /toplu işlemler/i })).toBeInTheDocument();
    expect(screen.getByText('2 seçildi')).toBeInTheDocument();
  });

  it('7. Tümünü seç → visible row\'lar seçilir', async () => {
    const user = userEvent.setup();
    render(
      <ModuleList
        items={ITEMS}
        columns={COLUMNS}
        moduleName="Ürün"
        bulkActions={[{ id: 'publish', label: 'Yayınla' }]}
      />
    );
    await user.click(screen.getByRole('checkbox', { name: /tümünü/i }));
    expect(screen.getByText('3 seçildi')).toBeInTheDocument();
  });

  it('8. Bulk action destructive confirm mock → onBulkAction', async () => {
    const user = userEvent.setup();
    const onBulkAction = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
    render(
      <ModuleList
        items={ITEMS}
        columns={COLUMNS}
        moduleName="Ürün"
        bulkActions={[{ id: 'delete', label: 'Sil', destructive: true }]}
        onBulkAction={onBulkAction}
      />
    );
    await user.click(screen.getAllByRole('checkbox', { name: /satır seç/i })[0]);
    await user.click(screen.getByRole('button', { name: 'Sil' }));
    await waitFor(() => expect(onBulkAction).toHaveBeenCalledWith('delete', ['1']));
  });

  it('9. Row click → onEdit(id)', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <ModuleList
        items={ITEMS}
        columns={COLUMNS}
        moduleName="Ürün"
        onEdit={onEdit}
      />
    );
    await user.click(screen.getByText('Mobilya'));
    expect(onEdit).toHaveBeenCalledWith('1');
  });

  it('10. Locale en → name["en"] render', () => {
    render(
      <ModuleList items={ITEMS} columns={COLUMNS} moduleName="Product" locale="en" />
    );
    expect(screen.getByText('Furniture')).toBeInTheDocument();
  });

  it('11. urlState initial + set çağrılır', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const getFn = vi.fn().mockReturnValue({ search: 'init' });
    const setFn = vi.fn();
    render(
      <ModuleList
        items={ITEMS}
        columns={COLUMNS}
        moduleName="Ürün"
        searchableFields={['name']}
        urlState={{ get: getFn, set: setFn }}
      />
    );
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('init');
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'yeni');
    vi.advanceTimersByTime(350);
    await waitFor(() => expect(setFn).toHaveBeenCalledWith({ search: 'yeni' }));
  });

  it('12. error prop → error render', () => {
    render(
      <ModuleList
        items={[]}
        columns={COLUMNS}
        moduleName="Ürün"
        error="Network hatası"
      />
    );
    expect(screen.getByText('Network hatası')).toBeInTheDocument();
  });

  it('13. loading → skeleton + aria-busy', () => {
    render(
      <ModuleList
        items={[]}
        columns={COLUMNS}
        moduleName="Ürün"
        loading
      />
    );
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
  });

  it('14. No results (search) → temizle butonu', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ModuleList
        items={ITEMS}
        columns={COLUMNS}
        moduleName="Ürün"
        searchableFields={['name']}
      />
    );
    await user.type(screen.getByRole('textbox'), 'zzzz');
    vi.advanceTimersByTime(350);
    await waitFor(() => {
      expect(screen.getByText(/sonuç bulunamadı/i)).toBeInTheDocument();
    });
  });
});

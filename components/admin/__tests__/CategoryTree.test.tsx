import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CategoryTree, buildTree, type Category } from '../CategoryTree';

function mk(overrides: Partial<Category>): Category {
  return {
    id: 'x',
    parent_id: null,
    slug: { tr: 'x' },
    name: { tr: 'X', en: 'X' },
    sort_order: 0,
    ...overrides,
  };
}

const FLAT: Category[] = [
  mk({ id: 'a', parent_id: null, sort_order: 0, name: { tr: 'Mobilya', en: 'Furniture' } }),
  mk({ id: 'b', parent_id: null, sort_order: 1, name: { tr: 'Aksesuar', en: 'Accessories' } }),
  mk({ id: 'a1', parent_id: 'a', sort_order: 0, name: { tr: 'Koltuk', en: 'Sofa' } }),
  mk({ id: 'a2', parent_id: 'a', sort_order: 1, name: { tr: 'Sandalye', en: 'Chair' } }),
  mk({ id: 'a1x', parent_id: 'a1', sort_order: 0, name: { tr: 'Kanepe', en: 'Couch' } }),
];

describe('buildTree', () => {
  it('düz listeden nested tree', () => {
    const tree = buildTree(FLAT);
    expect(tree).toHaveLength(2);
    expect(tree[0].id).toBe('a');
    expect(tree[0].children).toHaveLength(2);
    expect(tree[0].children![0].children).toHaveLength(1);
  });
});

describe('CategoryTree — manage mode', () => {
  it('1. boş → empty state + "+ Yeni kök kategori" buton', () => {
    render(
      <CategoryTree categories={[]} locale="tr" mode="manage" />
    );
    expect(screen.getByText(/henüz kategori yok/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yeni kök/i })).toBeInTheDocument();
  });

  it('2. tree render → ARIA tree + treeitem level', () => {
    render(
      <CategoryTree categories={FLAT} locale="tr" mode="manage" />
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
    const items = screen.getAllByRole('treeitem');
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0]).toHaveAttribute('aria-level', '1');
  });

  it('3. locale tr → en → kategori isimleri güncellenir', () => {
    const { rerender } = render(
      <CategoryTree categories={FLAT} locale="tr" mode="manage" />
    );
    expect(screen.getByText('Mobilya')).toBeInTheDocument();
    rerender(<CategoryTree categories={FLAT} locale="en" mode="manage" />);
    expect(screen.getByText('Furniture')).toBeInTheDocument();
  });

  it('4. maxDepth=2 + 3. seviye row → + Alt ekle disabled', () => {
    render(
      <CategoryTree categories={FLAT} locale="tr" mode="manage" maxDepth={2} />
    );
    // a1 seviye 2, altında "+ Alt ekle" disabled
    // Buton ikisi için visible ama hover opacity ile gizli, action buton "Alt ekle" aria-label'lı disabled kontrolü
    const addButtons = screen.getAllByRole('button', { name: /maks.*derinlik/i });
    expect(addButtons.length).toBeGreaterThan(0);
    addButtons.forEach((b) => expect(b).toBeDisabled());
  });

  it('5. Delete kategori → onDelete çağrılır (confirm mock)', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
    render(
      <CategoryTree
        categories={FLAT}
        locale="tr"
        mode="manage"
        onDelete={onDelete}
      />
    );
    const delBtns = screen.getAllByRole('button', { name: 'Sil' });
    await user.click(delBtns[0]);
    expect(onDelete).toHaveBeenCalledWith('a');
  });

  it('6. Inline edit → Enter → onUpdate', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(
      <CategoryTree
        categories={FLAT}
        locale="tr"
        mode="manage"
        onUpdate={onUpdate}
      />
    );
    await user.click(screen.getAllByRole('button', { name: 'Düzenle' })[0]);
    const input = document.activeElement as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Yeni Ad{enter}');
    expect(onUpdate).toHaveBeenCalledWith('a', {
      name: expect.objectContaining({ tr: 'Yeni Ad' }),
    });
  });

  it('7. Yeni kök kategori → input aç + Ekle → onCreate', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <CategoryTree
        categories={[]}
        locale="tr"
        mode="manage"
        onCreate={onCreate}
      />
    );
    await user.click(screen.getByRole('button', { name: /yeni kök/i }));
    const input = screen.getByPlaceholderText(/kategori adı/i);
    await user.type(input, 'İlk Kategori');
    await user.click(screen.getByRole('button', { name: 'Ekle' }));
    expect(onCreate).toHaveBeenCalledWith(null, { tr: 'İlk Kategori' });
  });
});

describe('CategoryTree — picker mode', () => {
  it('8. picker empty → bilgi mesajı', () => {
    render(<CategoryTree categories={[]} locale="tr" mode="picker" />);
    expect(screen.getByText(/önce manage/i)).toBeInTheDocument();
  });

  it('9. kategori tıklanınca onChange çağrılır', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CategoryTree
        categories={FLAT}
        locale="tr"
        mode="picker"
        onChange={onChange}
      />
    );
    await user.click(screen.getByText('Mobilya'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('10. value seçili → aria-selected true', () => {
    render(
      <CategoryTree
        categories={FLAT}
        locale="tr"
        mode="picker"
        value="a"
      />
    );
    const items = screen.getAllByRole('treeitem');
    const sel = items.find((n) => n.getAttribute('aria-selected') === 'true');
    expect(sel).toBeTruthy();
  });

  it('11. aynı değer tekrar tıklanınca null (toggle clear)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CategoryTree
        categories={FLAT}
        locale="tr"
        mode="picker"
        value="a"
        onChange={onChange}
      />
    );
    await user.click(screen.getByText('Mobilya'));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

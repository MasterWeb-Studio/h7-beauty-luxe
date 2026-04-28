import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ModuleDetail, type FieldDef } from '../ModuleDetail';

const FIELDS: FieldDef[] = [
  {
    name: 'title',
    type: 'text',
    localeAware: true,
    required: true,
    label: { tr: 'Başlık', en: 'Title' },
  },
  {
    name: 'description',
    type: 'textarea',
    localeAware: true,
    label: { tr: 'Açıklama', en: 'Description' },
    maxLength: 200,
  },
  {
    name: 'slug',
    type: 'slug',
    localeAware: true,
    sourceFieldName: 'title',
    label: { tr: 'URL', en: 'URL' },
  },
  {
    name: 'active',
    type: 'boolean',
    label: { tr: 'Aktif', en: 'Active' },
  },
  {
    name: 'status',
    type: 'enum',
    enumValues: ['draft', 'published'],
    label: { tr: 'Durum', en: 'Status' },
  },
];

describe('ModuleDetail', () => {
  // Fake timer sadece autosave testinde (7). Diğerleri real timer.

  it('1. Yeni kayıt → "Yeni Ürün" başlık + boş form', () => {
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
      />
    );
    expect(screen.getByRole('heading', { name: /yeni ürün/i })).toBeInTheDocument();
  });

  it('2. Edit mode → "Ürün düzenle" başlık + değerler', () => {
    render(
      <ModuleDetail
        item={{ id: 'r1', title: { tr: 'Mevcut', en: 'Existing' } }}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
      />
    );
    expect(screen.getByRole('heading', { name: /ürün düzenle/i })).toBeInTheDocument();
    expect((screen.getByRole('textbox', { name: /başlık/i }) as HTMLInputElement).value).toBe(
      'Mevcut'
    );
  });

  it('3. Required boş + Kaydet → error banner', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onSave={onSave}
      />
    );
    await user.click(screen.getByRole('button', { name: /^kaydet$/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/zorunlu alan/i);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('4. Required doldur + Kaydet → onSave', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onSave={onSave}
      />
    );
    await user.type(screen.getByRole('textbox', { name: /başlık/i }), 'Yeni Başlık');
    await user.click(screen.getByRole('button', { name: /^kaydet$/i }));
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ title: { tr: 'Yeni Başlık' } })
      )
    );
  });

  it('5. Locale switch → TR → EN', async () => {
    const user = userEvent.setup();
    render(
      <ModuleDetail
        item={{
          id: 'r1',
          title: { tr: 'Merhaba', en: 'Hello' },
        }}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
      />
    );
    expect((screen.getByRole('textbox', { name: /başlık/i }) as HTMLInputElement).value).toBe(
      'Merhaba'
    );
    // LocaleSwitcher'daki "en" butonu (LocaleField tabs ile ambiguous olduğundan group ile daraltılıyor)
    const localeGroup = screen.getByRole('group', { name: /dil/i });
    const enBtn = Array.from(localeGroup.querySelectorAll('button')).find(
      (b) => b.textContent?.trim().toLowerCase() === 'en'
    )!;
    await user.click(enBtn);
    // Locale EN olunca label "Title" olur, input value "Hello"
    expect((screen.getByRole('textbox', { name: /title/i }) as HTMLInputElement).value).toBe(
      'Hello'
    );
  });

  it('6. Tab render → fields gruplanır', () => {
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        tabs={[
          { id: 'content', label: { tr: 'İçerik' }, fields: ['title', 'description'] },
          { id: 'meta', label: { tr: 'Meta' }, fields: ['slug', 'status'] },
        ]}
        moduleName="Ürün"
        projectId="p1"
      />
    );
    expect(screen.getByRole('tab', { name: 'İçerik' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tab', { name: 'Meta' })).toBeInTheDocument();
  });

  it('7. Autosave debounced → onSave silent call', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onSave={onSave}
        autoSaveMs={150}
      />
    );
    await user.type(screen.getByRole('textbox', { name: /başlık/i }), 'X');
    await waitFor(() => expect(onSave).toHaveBeenCalled(), { timeout: 1500 });
  });

  it('8. Save fail → error banner', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockRejectedValue(new Error('Network down'));
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onSave={onSave}
      />
    );
    await user.type(screen.getByRole('textbox', { name: /başlık/i }), 'X');
    await user.click(screen.getByRole('button', { name: /^kaydet$/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/network down/i);
  });

  it('9. Delete confirm → onDelete(id) redirect', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
    render(
      <ModuleDetail
        item={{ id: 'r1', title: { tr: 'X' } }}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onDelete={onDelete}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Sil' }));
    expect(onDelete).toHaveBeenCalledWith('r1');
  });

  it('10. Enum select → değer güncellenir', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <ModuleDetail
        item={{ id: 'r1', title: { tr: 'X' } }}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onSave={onSave}
      />
    );
    const select = screen.getByRole('combobox', { name: /durum/i });
    await user.selectOptions(select, 'published');
    await user.click(screen.getByRole('button', { name: /^kaydet$/i }));
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'published' })
      )
    );
  });

  it('11. İptal dirty + confirm → onCancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onCancel={onCancel}
      />
    );
    await user.type(screen.getByRole('textbox', { name: /başlık/i }), 'X');
    await user.click(screen.getByRole('button', { name: 'İptal' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('12. Save status idle → saving → saved', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <ModuleDetail
        item={null}
        fields={FIELDS}
        moduleName="Ürün"
        projectId="p1"
        onSave={onSave}
      />
    );
    await user.type(screen.getByRole('textbox', { name: /başlık/i }), 'X');
    await user.click(screen.getByRole('button', { name: /^kaydet$/i }));
    await waitFor(() => {
      const statuses = screen.getAllByRole('status');
      const saved = statuses.find((s) => /kaydedildi/i.test(s.textContent ?? ''));
      expect(saved).toBeDefined();
    });
  });
});

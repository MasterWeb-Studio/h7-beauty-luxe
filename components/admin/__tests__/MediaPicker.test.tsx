import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MediaPicker, type MediaItem } from '../MediaPicker';

const ITEMS: MediaItem[] = [
  {
    id: 'm1',
    url: 'https://img.test/1.jpg',
    thumbUrl: 'https://img.test/1-thumb.jpg',
    alt: { tr: 'Banner', en: 'Banner' },
    category: 'hero',
    fileName: 'banner.jpg',
  },
  {
    id: 'm2',
    url: 'https://img.test/2.jpg',
    thumbUrl: 'https://img.test/2-thumb.jpg',
    alt: { tr: 'Ürün fotoğrafı', en: 'Product photo' },
    category: 'product',
    fileName: 'product.jpg',
  },
  {
    id: 'm3',
    url: 'https://img.test/3.jpg',
    thumbUrl: 'https://img.test/3-thumb.jpg',
    alt: { tr: 'Logo', en: 'Logo' },
    category: 'brand',
    fileName: 'logo.png',
  },
];

describe('MediaPicker — single mode', () => {
  it('1. trigger "Görsel ekle" → modal açılır', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={onChange}
        initialItems={ITEMS}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby');
  });

  it('2. Library → tek seçim → Seç → onChange(id)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={onChange}
        initialItems={ITEMS}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    const option = await screen.findByRole('option', { name: /banner/i });
    await user.click(option);
    await user.click(screen.getByRole('button', { name: /seç \(1\)/i }));
    expect(onChange).toHaveBeenCalledWith('m1');
  });

  it('3. Empty library → empty state', async () => {
    const user = userEvent.setup();
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={vi.fn()}
        initialItems={[]}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    expect(await screen.findByText(/henüz medya yok/i)).toBeInTheDocument();
  });

  it('4. Search "banner" → filtered list', async () => {
    const user = userEvent.setup();
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={vi.fn()}
        initialItems={ITEMS}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    const search = await screen.findByRole('textbox', { name: /medya ara/i });
    await user.type(search, 'banner');
    await waitFor(() => {
      expect(screen.queryByRole('option', { name: /ürün fotoğrafı/i })).not.toBeInTheDocument();
      expect(screen.getByRole('option', { name: /banner/i })).toBeInTheDocument();
    });
  });

  it('5. Escape ile kapanır → onChange çağrılmaz', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={onChange}
        initialItems={ITEMS}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    await user.click(await screen.findByRole('option', { name: /banner/i }));
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('MediaPicker — multi mode', () => {
  it('6. multi → 2 seçim → array', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MediaPicker
        projectId="p1"
        multi
        value={[]}
        onChange={onChange}
        initialItems={ITEMS}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    await user.click(await screen.findByRole('option', { name: /banner/i }));
    await user.click(screen.getByRole('option', { name: /logo/i }));
    await user.click(screen.getByRole('button', { name: /seç \(2\)/i }));
    expect(onChange).toHaveBeenCalledWith(['m1', 'm3']);
  });

  it('7. maxSelection=1 + 2. tıklama engellenir', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MediaPicker
        projectId="p1"
        multi
        maxSelection={1}
        value={[]}
        onChange={onChange}
        initialItems={ITEMS}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    await user.click(await screen.findByRole('option', { name: /banner/i }));
    await user.click(screen.getByRole('option', { name: /logo/i }));
    await user.click(screen.getByRole('button', { name: /seç \(1\)/i }));
    expect(onChange).toHaveBeenCalledWith(['m1']);
  });
});

describe('MediaPicker — upload', () => {
  it('8. Upload > 10MB → error', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn().mockResolvedValue([]);
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={vi.fn()}
        initialItems={[]}
        onUpload={onUpload}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    await user.click(screen.getByRole('tab', { name: 'Upload' }));
    const bigFile = new File(['x'.repeat(11 * 1024 * 1024)], 'big.png', {
      type: 'image/png',
    });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await user.upload(input, bigFile);
    expect(await screen.findByRole('alert')).toHaveTextContent(/10mb/i);
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('9. Upload image valid → onUpload çağrılır + library refresh', async () => {
    const user = userEvent.setup();
    const uploaded: MediaItem[] = [
      {
        id: 'new-1',
        url: 'https://img.test/new.jpg',
        alt: { tr: 'Yeni' },
        fileName: 'new.jpg',
      },
    ];
    const onUpload = vi.fn().mockResolvedValue(uploaded);
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={vi.fn()}
        initialItems={[]}
        onUpload={onUpload}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    await user.click(screen.getByRole('tab', { name: 'Upload' }));
    const file = new File(['x'], 'new.jpg', { type: 'image/jpeg' });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await user.upload(input, file);
    await waitFor(() => expect(onUpload).toHaveBeenCalled());
  });

  it('10. Non-image dosya reject', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();
    render(
      <MediaPicker
        projectId="p1"
        value={null}
        onChange={vi.fn()}
        initialItems={[]}
        onUpload={onUpload}
      />
    );
    await user.click(screen.getByRole('button', { name: /görsel ekle/i }));
    await user.click(screen.getByRole('tab', { name: 'Upload' }));
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);
    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert?.textContent ?? '').toMatch(/görsel/i);
    });
    expect(onUpload).not.toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { SeoFields, type SeoFieldsValue } from '../SeoFields';

function Harness(props: {
  initial?: SeoFieldsValue;
  autoGenerateFrom?: React.ComponentProps<typeof SeoFields>['autoGenerateFrom'];
}) {
  const [value, setValue] = useState<SeoFieldsValue>(
    props.initial ?? {
      title: { tr: '', en: '' },
      description: { tr: '', en: '' },
      slug: { tr: '', en: '' },
      ogImage: null,
    }
  );
  const [locale, setLocale] = useState('tr');
  return (
    <SeoFields
      value={value}
      onChange={setValue}
      locales={['tr', 'en']}
      activeLocale={locale}
      onActiveLocaleChange={setLocale}
      autoGenerateFrom={props.autoGenerateFrom}
      projectId="p1"
      siteUrl="https://example.com"
    />
  );
}

describe('SeoFields', () => {
  it('1. 3 sub-component (title/description/slug) render edilir', () => {
    render(<Harness />);
    expect(screen.getByText(/SEO Başlık/i)).toBeInTheDocument();
    expect(screen.getByText(/SEO Açıklama/i)).toBeInTheDocument();
    expect(screen.getByText(/URL Slug/i)).toBeInTheDocument();
  });

  it('2. title max 60 counter → 0/60 default', () => {
    render(<Harness />);
    expect(screen.getByText('0/60')).toBeInTheDocument();
  });

  it('3. description max 160 counter', () => {
    render(<Harness />);
    expect(screen.getByText('0/160')).toBeInTheDocument();
  });

  it('4. autoGenerateFrom.title → LocaleSlug source, auto slug üretilir', async () => {
    render(
      <Harness
        autoGenerateFrom={{
          title: { tr: 'Ürün Detayı', en: 'Product Detail' },
        }}
      />
    );
    const slugInput = screen.getAllByRole('textbox').find(
      (el) => el.classList.contains('font-mono')
    ) as HTMLInputElement;
    expect(slugInput.value).toBe('urun-detayi');
  });

  it('5. SERP preview title + description render', () => {
    render(
      <Harness
        initial={{
          title: { tr: 'Başlık', en: '' },
          description: { tr: 'Açıklama', en: '' },
          slug: { tr: 'baslik', en: '' },
          ogImage: null,
        }}
      />
    );
    const preview = screen.getByRole('complementary', { name: /google arama önizleme/i });
    expect(preview).toHaveTextContent('Başlık');
    expect(preview).toHaveTextContent('Açıklama');
    expect(preview).toHaveTextContent('/baslik');
  });

  it('6. Noindex toggle → value update', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const checkbox = screen.getByRole('checkbox', {
      name: /noindex/i,
    });
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    const preview = screen.getByRole('complementary');
    expect(preview).toHaveTextContent(/noindex aktif/i);
  });

  it('7. Canonical URL input', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText(/canonical/i);
    await user.type(input, 'https://foo.com/x');
    expect((input as HTMLInputElement).value).toBe('https://foo.com/x');
  });
});

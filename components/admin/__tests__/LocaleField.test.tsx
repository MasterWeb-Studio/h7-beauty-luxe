import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LocaleField, type LocaleValue } from '../LocaleField';

function createProps(overrides: Partial<React.ComponentProps<typeof LocaleField>> = {}) {
  const base = {
    value: { tr: '', en: '' } as LocaleValue,
    onChange: vi.fn(),
    locales: ['tr', 'en'],
    activeLocale: 'tr',
    onActiveLocaleChange: vi.fn(),
    label: { tr: 'Başlık', en: 'Title' },
  };
  return { ...base, ...overrides };
}

describe('LocaleField', () => {
  it('1. active locale (TR) label render ediliyor', () => {
    render(<LocaleField {...createProps()} />);
    expect(screen.getByText('Başlık')).toBeInTheDocument();
    const trTab = screen.getByRole('tab', { name: /TR/ });
    expect(trTab).toHaveAttribute('data-state', 'active');
  });

  it('2. EN tab tıklayınca onActiveLocaleChange çağrılır', async () => {
    const user = userEvent.setup();
    const onActiveLocaleChange = vi.fn();
    render(<LocaleField {...createProps({ onActiveLocaleChange })} />);

    await user.click(screen.getByRole('tab', { name: /EN/ }));
    expect(onActiveLocaleChange).toHaveBeenCalledWith('en');
  });

  it('3. input değişince onChange LocaleValue ile çağrılır', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<LocaleField {...createProps({ onChange })} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'M');
    expect(onChange).toHaveBeenCalledWith({ tr: 'M', en: '' });
  });

  it('4. locale dolu ise tab üzerinde ✓ gösterir', () => {
    render(
      <LocaleField
        {...createProps({ value: { tr: 'Merhaba', en: 'Hello' } })}
      />
    );
    const trTab = screen.getByRole('tab', { name: /TR/ });
    const enTab = screen.getByRole('tab', { name: /EN/ });
    expect(trTab).toHaveTextContent('✓');
    expect(enTab).toHaveTextContent('✓');
  });

  it('5. required + default locale boş ise ⚠ gösterir', () => {
    render(<LocaleField {...createProps({ required: true })} />);
    const trTab = screen.getByRole('tab', { name: /TR/ });
    expect(trTab).toHaveTextContent('⚠');
  });

  it('6. maxLength counter karakter sayısını gösterir', () => {
    render(
      <LocaleField
        {...createProps({ value: { tr: 'abc', en: '' }, maxLength: 10 })}
      />
    );
    expect(screen.getByText('3/10')).toBeInTheDocument();
  });

  it('7. error mesajı ve aria-invalid render edilir', () => {
    render(<LocaleField {...createProps({ error: 'Zorunlu alan' })} />);
    expect(screen.getByText('Zorunlu alan')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('8. disabled prop tüm tab\'ları ve input\'u disabled yapar', () => {
    render(<LocaleField {...createProps({ disabled: true })} />);
    const tabs = screen.getAllByRole('tab');
    tabs.forEach((t) => expect(t).toBeDisabled());
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('9. active locale değişince input yeni locale değerini gösterir', () => {
    const { rerender } = render(
      <LocaleField
        {...createProps({ value: { tr: 'Merhaba', en: 'Hello' }, activeLocale: 'tr' })}
      />
    );
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Merhaba');

    rerender(
      <LocaleField
        {...createProps({ value: { tr: 'Merhaba', en: 'Hello' }, activeLocale: 'en' })}
      />
    );
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Hello');
  });

  it('10. counter %90 eşiği aşınca amber, max\'a ulaşınca rose olur', () => {
    const { rerender } = render(
      <LocaleField
        {...createProps({ value: { tr: 'abcdefghi', en: '' }, maxLength: 10 })}
      />
    );
    expect(screen.getByText('9/10')).toHaveClass('text-amber-600');

    rerender(
      <LocaleField
        {...createProps({ value: { tr: 'abcdefghij', en: '' }, maxLength: 10 })}
      />
    );
    expect(screen.getByText('10/10')).toHaveClass('text-rose-600');
  });
});

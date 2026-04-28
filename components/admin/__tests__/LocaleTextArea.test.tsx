import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LocaleTextArea, type LocaleTextAreaValue } from '../LocaleTextArea';

function createProps(
  overrides: Partial<React.ComponentProps<typeof LocaleTextArea>> = {}
) {
  const base = {
    value: { tr: '', en: '' } as LocaleTextAreaValue,
    onChange: vi.fn(),
    locales: ['tr', 'en'],
    activeLocale: 'tr',
    onActiveLocaleChange: vi.fn(),
    label: { tr: 'Açıklama', en: 'Description' },
  };
  return { ...base, ...overrides };
}

describe('LocaleTextArea', () => {
  it('1. label render + textarea rolü', () => {
    render(<LocaleTextArea {...createProps()} />);
    expect(screen.getByText('Açıklama')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('2. default rows=4', () => {
    render(<LocaleTextArea {...createProps()} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });

  it('3. rows prop override edilir', () => {
    render(<LocaleTextArea {...createProps({ rows: 8 })} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });

  it('4. typing → onChange locale value update', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<LocaleTextArea {...createProps({ onChange })} />);
    await user.type(screen.getByRole('textbox'), 'A');
    expect(onChange).toHaveBeenCalledWith({ tr: 'A', en: '' });
  });

  it('5. locale tab ✓ indicator filled', () => {
    render(
      <LocaleTextArea
        {...createProps({ value: { tr: 'dolu', en: 'filled' } })}
      />
    );
    expect(screen.getByRole('tab', { name: /TR/ })).toHaveTextContent('✓');
    expect(screen.getByRole('tab', { name: /EN/ })).toHaveTextContent('✓');
  });

  it('6. maxLength counter', () => {
    render(
      <LocaleTextArea
        {...createProps({ value: { tr: 'abc', en: '' }, maxLength: 160 })}
      />
    );
    expect(screen.getByText('3/160')).toBeInTheDocument();
  });

  it('7. error + aria-invalid', () => {
    render(<LocaleTextArea {...createProps({ error: 'Çok kısa' })} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Çok kısa');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('8. disabled tabs + textarea', () => {
    render(<LocaleTextArea {...createProps({ disabled: true })} />);
    screen.getAllByRole('tab').forEach((t) => expect(t).toBeDisabled());
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('9. autoResize → inline style overflow hidden', () => {
    render(<LocaleTextArea {...createProps({ autoResize: true })} />);
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(ta.style.overflow).toBe('hidden');
    expect(ta.style.resize).toBe('none');
  });

  it('10. counter amber >=90% → rose >=max', () => {
    const { rerender } = render(
      <LocaleTextArea
        {...createProps({ value: { tr: 'a'.repeat(9), en: '' }, maxLength: 10 })}
      />
    );
    expect(screen.getByText('9/10')).toHaveClass('text-amber-600');
    rerender(
      <LocaleTextArea
        {...createProps({ value: { tr: 'a'.repeat(10), en: '' }, maxLength: 10 })}
      />
    );
    expect(screen.getByText('10/10')).toHaveClass('text-rose-600');
  });
});

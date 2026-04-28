import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { LocaleRichText } from '../LocaleRichText';

function Harness(props: {
  initial?: Record<string, string>;
  maxLength?: number;
  features?: React.ComponentProps<typeof LocaleRichText>['features'];
  mediaPickerEnabled?: boolean;
  onRequestImage?: () => Promise<string | null>;
}) {
  const [value, setValue] = useState<Record<string, string>>(
    props.initial ?? { tr: '', en: '' }
  );
  const [activeLocale, setActiveLocale] = useState('tr');
  return (
    <LocaleRichText
      value={value}
      onChange={setValue}
      locales={['tr', 'en']}
      activeLocale={activeLocale}
      onActiveLocaleChange={setActiveLocale}
      label={{ tr: 'İçerik', en: 'Content' }}
      features={props.features}
      maxLength={props.maxLength}
      mediaPickerEnabled={props.mediaPickerEnabled}
      onRequestImage={props.onRequestImage}
    />
  );
}

describe('LocaleRichText', () => {
  beforeEach(() => {
    vi.stubGlobal('prompt', vi.fn());
  });

  it('1. label + toolbar render', async () => {
    render(<Harness />);
    expect(screen.getByText('İçerik')).toBeInTheDocument();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('2. default features → Bold + Italic + H2 + H3 + lists + blockquote + link', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: /kalın/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eğik/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /başlık 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /başlık 3/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /madde listesi/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /numaralı liste/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /alıntı/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bağlantı/i })).toBeInTheDocument();
  });

  it('3. features prop override → sadece bold', () => {
    render(<Harness features={['bold']} />);
    expect(screen.getByRole('button', { name: /kalın/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /eğik/i })).not.toBeInTheDocument();
  });

  it('4. locale tab ✓ HTML dolu ise', () => {
    render(<Harness initial={{ tr: '<p>Merhaba</p>', en: '<p>Hello</p>' }} />);
    expect(screen.getByRole('tab', { name: /TR/ })).toHaveTextContent('✓');
    expect(screen.getByRole('tab', { name: /EN/ })).toHaveTextContent('✓');
  });

  it('5. HTML sadece tag → boş (hasValue plain text check)', () => {
    render(<Harness initial={{ tr: '<p></p>', en: '' }} />);
    expect(screen.getByRole('tab', { name: /TR/ })).not.toHaveTextContent('✓');
  });

  it('6. plain length counter', async () => {
    render(<Harness initial={{ tr: '<p>abc</p>', en: '' }} maxLength={100} />);
    await waitFor(() => {
      expect(screen.getByText('3/100')).toBeInTheDocument();
    });
  });

  it('7. counter %90 amber', async () => {
    render(
      <Harness
        initial={{ tr: `<p>${'a'.repeat(9)}</p>`, en: '' }}
        maxLength={10}
      />
    );
    await waitFor(() =>
      expect(screen.getByText('9/10')).toHaveClass('text-amber-600')
    );
  });

  it('7b. counter max rose', async () => {
    render(
      <Harness
        initial={{ tr: `<p>${'a'.repeat(10)}</p>`, en: '' }}
        maxLength={10}
      />
    );
    await waitFor(() =>
      expect(screen.getByText('10/10')).toHaveClass('text-rose-600')
    );
  });

  it('8. link button prompt → window.prompt çağrılır', async () => {
    const user = userEvent.setup();
    const promptMock = vi.fn().mockReturnValue('https://example.com');
    vi.stubGlobal('prompt', promptMock);
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: /bağlantı/i }));
    expect(promptMock).toHaveBeenCalled();
  });

  it('9. image feature disabled → image button yok', () => {
    render(<Harness features={['bold', 'italic']} />);
    expect(screen.queryByRole('button', { name: /görsel/i })).not.toBeInTheDocument();
  });

  it('10. mediaPickerEnabled + onRequestImage çağrılır', async () => {
    const user = userEvent.setup();
    const onRequestImage = vi.fn().mockResolvedValue('https://img.test/x.png');
    render(
      <Harness
        features={['bold', 'image']}
        mediaPickerEnabled
        onRequestImage={onRequestImage}
      />
    );
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /görsel/i }));
    });
    expect(onRequestImage).toHaveBeenCalled();
  });
});

/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import KeyboardKey from './index';

afterEach(cleanup);

describe('KeyboardKey React', () => {
  it('matches Vue key order, symbols and accessible phrase', () => {
    const { container } = render(
      <KeyboardKey keys={['Mod', 'Shift', 'K']} platform="mac" dataTestId="shortcut" />,
    );
    expect([...container.querySelectorAll('kbd')].map((key) => key.textContent)).toEqual([
      '⌘',
      '⇧',
      'K',
    ]);
    expect(container.querySelector('.peaui-keyboard-key__accessible')).toHaveTextContent(
      'Command plus Shift plus K',
    );
    expect(screen.getByTestId('shortcut')).not.toHaveAttribute('tabindex');
    expect(screen.getByTestId('shortcut')).not.toHaveAttribute('aria-keyshortcuts');
  });

  it('supports text formatting, custom renderers and an invariant accessible label', () => {
    const { container } = render(
      <KeyboardKey
        keys="Ctrl + Enter"
        platform="windows"
        format="text"
        renderKey={({ visualLabel }) => <strong>{visualLabel}</strong>}
        renderSeparator={() => 'then'}
      />,
    );
    expect(container.querySelector('.peaui-keyboard-key__accessible')).toHaveTextContent(
      'Control plus Enter',
    );
    expect([...container.querySelectorAll('kbd')].map((key) => key.textContent)).toEqual([
      'Ctrl',
      'Enter',
    ]);
    expect(container.querySelector('.peaui-keyboard-key__separator')).toHaveTextContent('then');
  });

  it('supports size, block and muted modifiers with forwarded presentation attributes', () => {
    render(
      <KeyboardKey
        keys="Escape"
        inline={false}
        muted
        size="m"
        className="consumer-class"
        data-testid="root"
      />,
    );
    expect(screen.getByTestId('root')).toHaveClass(
      'peaui-keyboard-key--block',
      'peaui-keyboard-key--size-m',
      'peaui-keyboard-key--muted',
      'consumer-class',
    );
  });

  it('renders an SSR-safe generic auto platform before effects run', () => {
    const html = renderToString(<KeyboardKey keys={['Mod', 'K']} platform="auto" />);
    expect(html).toContain('data-platform="generic"');
    expect(html).toContain('Control plus K');
    expect(html).not.toContain('tabindex');
  });
});

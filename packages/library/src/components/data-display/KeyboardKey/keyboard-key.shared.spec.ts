import { describe, expect, it } from 'vitest';

import {
  createKeyboardKeyAccessibleLabel,
  detectKeyboardPlatform,
  normalizeKeyboardKeyTokens,
  resolveInitialKeyboardPlatform,
  resolveKeyboardKey,
  resolveKeyboardKeyCombination,
} from './keyboard-key.shared';

describe('KeyboardKey shared contract', () => {
  it('normalizes string combinations without changing their order', () => {
    expect(normalizeKeyboardKeyTokens(' Mod + Shift + K ')).toEqual(['Mod', 'Shift', 'K']);
    expect(normalizeKeyboardKeyTokens(['Ctrl', 'Page Up'])).toEqual(['Ctrl', 'Page Up']);
  });

  it('maps Mod to the native platform modifier', () => {
    expect(resolveKeyboardKey('Mod', 'mac', 'symbol')).toMatchObject({
      accessibleLabel: 'Command',
      visualLabel: '⌘',
    });
    expect(resolveKeyboardKey('Mod', 'windows', 'symbol')).toMatchObject({
      accessibleLabel: 'Control',
      visualLabel: 'Ctrl',
    });
    expect(resolveKeyboardKey('Mod', 'linux', 'text').visualLabel).toBe('Ctrl');
  });

  it('provides full names for every compact symbol', () => {
    expect(resolveKeyboardKey('Alt', 'mac', 'symbol')).toMatchObject({
      accessibleLabel: 'Option',
      visualLabel: '⌥',
    });
    expect(resolveKeyboardKey('Shift', 'mac', 'symbol')).toMatchObject({
      accessibleLabel: 'Shift',
      visualLabel: '⇧',
    });
    expect(resolveKeyboardKey('Enter', 'generic', 'symbol')).toMatchObject({
      accessibleLabel: 'Enter',
      visualLabel: '↵',
    });
  });

  it('normalizes aliases and retains unknown keys as a safe fallback', () => {
    expect(resolveKeyboardKey('esc', 'generic', 'text')).toMatchObject({
      key: 'Escape',
      visualLabel: 'Esc',
    });
    expect(resolveKeyboardKey('f12', 'generic', 'symbol')).toMatchObject({
      accessibleLabel: 'F12',
      visualLabel: 'F12',
    });
    expect(resolveKeyboardKey('Ż', 'generic', 'symbol')).toMatchObject({
      accessibleLabel: 'Ż',
      visualLabel: 'Ż',
    });
  });

  it('builds one complete assistive phrase independently of visual formatting', () => {
    const states = resolveKeyboardKeyCombination(['Mod', 'Shift', 'K'], 'mac', 'symbol');
    expect(createKeyboardKeyAccessibleLabel(states)).toBe('Command plus Shift plus K');
    expect(createKeyboardKeyAccessibleLabel(states, 'Otwórz wyszukiwarkę')).toBe(
      'Otwórz wyszukiwarkę',
    );
  });

  it.each([
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X)', '', 'mac'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '', 'windows'],
    ['Mozilla/5.0 (X11; Linux x86_64)', '', 'linux'],
    ['Custom agent', '', 'generic'],
    ['', 'MacIntel', 'mac'],
  ] as const)('detects %s / %s as %s', (agent, platform, expected) => {
    expect(detectKeyboardPlatform(agent, platform)).toBe(expected);
  });

  it('keeps auto platform generic during the SSR-safe initial render', () => {
    expect(resolveInitialKeyboardPlatform('auto')).toBe('generic');
    expect(resolveInitialKeyboardPlatform('mac')).toBe('mac');
  });
});

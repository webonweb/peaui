import { describe, expect, it } from 'vitest';

import {
  getNextCommandPaletteActiveId,
  matchesCommandPaletteShortcut,
  resolveCommandPaletteResults,
  resolveCommandPaletteSections,
  scoreCommandPaletteCommand,
  type CommandPaletteCommand,
} from './command-palette.shared';

const commands: readonly CommandPaletteCommand[] = [
  { id: 'settings', label: 'Open settings', keywords: ['preferences'], group: 'system' },
  { id: 'search', label: 'Search workspace', keywords: ['find'], group: 'navigation' },
  { id: 'disabled', label: 'Disabled command', disabled: true },
];

describe('CommandPalette shared logic', () => {
  it('keeps non-Latin letters in search queries instead of matching every command', () => {
    const localized = [
      { id: 'ja', label: '設定を開く' },
      { id: 'uk', label: 'Налаштування' },
      { id: 'en', label: 'Settings' },
    ];
    expect(
      resolveCommandPaletteResults(localized, '設定').map(({ command }) => command.id),
    ).toEqual(['ja']);
    expect(
      resolveCommandPaletteResults(localized, 'налаш').map(({ command }) => command.id),
    ).toEqual(['uk']);
  });
  it('uses deterministic exact, prefix, substring and fuzzy scoring', () => {
    expect(scoreCommandPaletteCommand(commands[0]!, 'open settings')).toBeGreaterThan(
      scoreCommandPaletteCommand(commands[0]!, 'settings'),
    );
    expect(scoreCommandPaletteCommand(commands[0]!, 'pref')).toBeGreaterThan(0);
    expect(scoreCommandPaletteCommand(commands[0]!, 'opst')).toBeGreaterThan(0);
    expect(scoreCommandPaletteCommand(commands[0]!, 'missing')).toBe(-1);
  });

  it('keeps original order when commands receive the same score', () => {
    expect(resolveCommandPaletteResults(commands, '').map(({ command }) => command.id)).toEqual([
      'settings',
      'search',
      'disabled',
    ]);
  });

  it('groups commands and moves recent commands into a stable first section', () => {
    const sections = resolveCommandPaletteSections({
      commands,
      groups: [
        { id: 'navigation', label: 'Navigation', order: 1 },
        { id: 'system', label: 'System', order: 2 },
      ],
      recentIds: ['search'],
    });
    expect(sections.map(({ id }) => id)).toEqual(['recent', 'system', 'commands']);
    expect(sections[0]!.commands[0]!.command.id).toBe('search');
  });

  it('skips disabled commands and wraps keyboard navigation', () => {
    const results = resolveCommandPaletteResults(commands, '');
    expect(getNextCommandPaletteActiveId(results, 'search', 1)).toBe('settings');
    expect(getNextCommandPaletteActiveId(results, 'settings', -1)).toBe('search');
    expect(getNextCommandPaletteActiveId(results, null, 'last')).toBe('search');
  });

  it('matches Mod shortcuts without accepting unrelated modifiers or repeats', () => {
    const base = {
      altKey: false,
      ctrlKey: true,
      key: 'k',
      metaKey: false,
      repeat: false,
      shiftKey: false,
    };
    expect(matchesCommandPaletteShortcut(base, ['Mod', 'K'])).toBe(true);
    expect(matchesCommandPaletteShortcut({ ...base, shiftKey: true }, ['Mod', 'K'])).toBe(false);
    expect(matchesCommandPaletteShortcut({ ...base, repeat: true }, ['Mod', 'K'])).toBe(false);
  });
});

export type KeyboardKeyPlatform = 'auto' | 'windows' | 'mac' | 'linux' | 'generic';
export type ResolvedKeyboardKeyPlatform = Exclude<KeyboardKeyPlatform, 'auto'>;
export type KeyboardKeyFormat = 'symbol' | 'text';
export type KeyboardKeySize = 'xs' | 's' | 'm';

export type KeyboardKeySlotState = {
  accessibleLabel: string;
  index: number;
  key: string;
  platform: ResolvedKeyboardKeyPlatform;
  token: string;
  visualLabel: string;
};

type KeyDefinition = {
  accessible: string;
  symbol?: string;
  text: string;
};

const KEY_ALIASES: Readonly<Record<string, string>> = {
  alt: 'Alt',
  option: 'Alt',
  backspace: 'Backspace',
  caps: 'CapsLock',
  capslock: 'CapsLock',
  cmd: 'Meta',
  command: 'Meta',
  control: 'Control',
  ctrl: 'Control',
  del: 'Delete',
  delete: 'Delete',
  down: 'ArrowDown',
  arrowdown: 'ArrowDown',
  end: 'End',
  enter: 'Enter',
  esc: 'Escape',
  escape: 'Escape',
  fn: 'Fn',
  home: 'Home',
  ins: 'Insert',
  insert: 'Insert',
  left: 'ArrowLeft',
  arrowleft: 'ArrowLeft',
  meta: 'Meta',
  mod: 'Mod',
  pagedown: 'PageDown',
  pgdn: 'PageDown',
  pageup: 'PageUp',
  pgup: 'PageUp',
  plus: 'Plus',
  printscreen: 'PrintScreen',
  prtsc: 'PrintScreen',
  return: 'Enter',
  right: 'ArrowRight',
  arrowright: 'ArrowRight',
  shift: 'Shift',
  space: 'Space',
  spacebar: 'Space',
  super: 'Meta',
  tab: 'Tab',
  up: 'ArrowUp',
  arrowup: 'ArrowUp',
};

const KEY_DEFINITIONS: Readonly<Record<string, KeyDefinition>> = {
  ArrowDown: { accessible: 'Down Arrow', symbol: '↓', text: 'Down' },
  ArrowLeft: { accessible: 'Left Arrow', symbol: '←', text: 'Left' },
  ArrowRight: { accessible: 'Right Arrow', symbol: '→', text: 'Right' },
  ArrowUp: { accessible: 'Up Arrow', symbol: '↑', text: 'Up' },
  Backspace: { accessible: 'Backspace', symbol: '⌫', text: 'Backspace' },
  CapsLock: { accessible: 'Caps Lock', symbol: '⇪', text: 'Caps Lock' },
  Delete: { accessible: 'Delete', symbol: '⌦', text: 'Delete' },
  End: { accessible: 'End', text: 'End' },
  Enter: { accessible: 'Enter', symbol: '↵', text: 'Enter' },
  Escape: { accessible: 'Escape', symbol: 'Esc', text: 'Esc' },
  Fn: { accessible: 'Function', text: 'Fn' },
  Home: { accessible: 'Home', text: 'Home' },
  Insert: { accessible: 'Insert', text: 'Insert' },
  PageDown: { accessible: 'Page Down', text: 'Page Down' },
  PageUp: { accessible: 'Page Up', text: 'Page Up' },
  Plus: { accessible: 'Plus', symbol: '+', text: 'Plus' },
  PrintScreen: { accessible: 'Print Screen', text: 'Print Screen' },
  Space: { accessible: 'Space', symbol: 'Space', text: 'Space' },
  Tab: { accessible: 'Tab', symbol: '⇥', text: 'Tab' },
};

function compactToken(token: string): string {
  return token
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/[\s_-]+/g, '');
}

function normalizeUnknownToken(token: string): string {
  const trimmed = token.trim();
  if (/^[a-z]$/i.test(trimmed) || /^f(?:[1-9]|1[0-9]|2[0-4])$/i.test(trimmed)) {
    return trimmed.toLocaleUpperCase('en-US');
  }
  return trimmed;
}

function resolveModifier(
  key: 'Alt' | 'Control' | 'Meta' | 'Mod' | 'Shift',
  platform: ResolvedKeyboardKeyPlatform,
  format: KeyboardKeyFormat,
): KeyDefinition {
  const isMac = platform === 'mac';
  if (key === 'Mod') key = isMac ? 'Meta' : 'Control';

  const definitions: Record<Exclude<typeof key, 'Mod'>, KeyDefinition> = {
    Alt: {
      accessible: isMac ? 'Option' : 'Alt',
      symbol: isMac ? '⌥' : 'Alt',
      text: isMac ? 'Option' : 'Alt',
    },
    Control: {
      accessible: 'Control',
      symbol: isMac ? '⌃' : 'Ctrl',
      text: isMac ? 'Control' : 'Ctrl',
    },
    Meta: {
      accessible: isMac ? 'Command' : 'Meta',
      symbol: isMac ? '⌘' : 'Meta',
      text: isMac ? 'Command' : 'Meta',
    },
    Shift: { accessible: 'Shift', symbol: isMac ? '⇧' : 'Shift', text: 'Shift' },
  };
  const definition = definitions[key];
  return { ...definition, symbol: format === 'symbol' ? definition.symbol : definition.text };
}

export function normalizeKeyboardKeyTokens(keys: string | readonly string[]): string[] {
  const tokens = typeof keys === 'string' ? keys.split(/\s*\+\s*/u) : [...keys];
  return tokens.map((token) => String(token).trim()).filter(Boolean);
}

export function resolveKeyboardKey(
  token: string,
  platform: ResolvedKeyboardKeyPlatform,
  format: KeyboardKeyFormat,
  index = 0,
): KeyboardKeySlotState {
  const normalizedToken = normalizeUnknownToken(token);
  const alias = KEY_ALIASES[compactToken(token)];
  const key = alias ?? normalizedToken;
  const definition =
    key === 'Alt' || key === 'Control' || key === 'Meta' || key === 'Mod' || key === 'Shift'
      ? resolveModifier(key, platform, format)
      : KEY_DEFINITIONS[key];
  const accessibleLabel = definition?.accessible ?? normalizedToken;
  const visualLabel =
    (format === 'symbol' ? definition?.symbol : definition?.text) ?? normalizedToken;

  return { accessibleLabel, index, key, platform, token, visualLabel };
}

export function resolveKeyboardKeyCombination(
  keys: string | readonly string[],
  platform: ResolvedKeyboardKeyPlatform,
  format: KeyboardKeyFormat,
): KeyboardKeySlotState[] {
  return normalizeKeyboardKeyTokens(keys).map((token, index) =>
    resolveKeyboardKey(token, platform, format, index),
  );
}

export function createKeyboardKeyAccessibleLabel(
  states: readonly KeyboardKeySlotState[],
  ariaLabel?: string,
): string {
  const customLabel = ariaLabel?.trim();
  if (customLabel) return customLabel;
  return states.map(({ accessibleLabel }) => accessibleLabel).join(' plus ') || 'Keyboard shortcut';
}

export function detectKeyboardPlatform(
  userAgent = '',
  navigatorPlatform = '',
): ResolvedKeyboardKeyPlatform {
  const signature = `${navigatorPlatform} ${userAgent}`.toLocaleLowerCase('en-US');
  if (/(mac|iphone|ipad|ipod)/u.test(signature)) return 'mac';
  if (/windows|win32|win64/u.test(signature)) return 'windows';
  if (/linux|x11|android/u.test(signature)) return 'linux';
  return 'generic';
}

export function resolveInitialKeyboardPlatform(
  platform: KeyboardKeyPlatform,
): ResolvedKeyboardKeyPlatform {
  return platform === 'auto' ? 'generic' : platform;
}

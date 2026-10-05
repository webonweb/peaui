export type CommandPaletteMode = 'modal' | 'embedded';
export type CommandPaletteShortcut = string | readonly string[];

export type CommandPaletteExecutionContext = {
  command: CommandPaletteCommand;
  path: readonly CommandPaletteCommand[];
  query: string;
};

export type CommandPaletteCommand = {
  id: string;
  label: string;
  description?: string;
  keywords?: readonly string[];
  group?: string;
  icon?: string;
  shortcut?: CommandPaletteShortcut;
  disabled?: boolean;
  children?: readonly CommandPaletteCommand[];
  execute?: (context: CommandPaletteExecutionContext) => unknown;
  metadata?: unknown;
};

export type CommandPaletteGroup = {
  id: string;
  label: string;
  order?: number;
};

export type CommandPaletteFilter = (
  command: CommandPaletteCommand,
  query: string,
) => boolean | number;

export type CommandPaletteResolvedCommand = {
  command: CommandPaletteCommand;
  index: number;
  score: number;
};

export type CommandPaletteSection = {
  id: string;
  label: string;
  commands: CommandPaletteResolvedCommand[];
};

export type CommandPaletteExecutionSuccessDetail = {
  command: CommandPaletteCommand;
  result: unknown;
};

export type CommandPaletteExecutionErrorDetail = {
  command: CommandPaletteCommand;
  error: unknown;
};

export type CommandPaletteLevelChangeDetail = {
  commands: readonly CommandPaletteCommand[];
  path: readonly CommandPaletteCommand[];
};

export type CommandPaletteTriggerState = {
  close: () => void;
  open: boolean;
  openPalette: () => void;
  toggle: () => void;
};

const DEFAULT_GROUP_ID = 'commands';
const DEFAULT_GROUP_LABEL = 'Commands';
const RECENT_GROUP_ID = 'recent';

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function scoreToken(value: string, token: string): number {
  if (!token) return 0;
  if (value === token) return 1000;
  if (value.startsWith(token)) return 800 - Math.min(value.length - token.length, 100);

  const substringIndex = value.indexOf(token);
  if (substringIndex >= 0) return 600 - Math.min(substringIndex * 4, 200);

  let cursor = -1;
  let gaps = 0;
  for (const character of token) {
    const next = value.indexOf(character, cursor + 1);
    if (next < 0) return -1;
    if (cursor >= 0) gaps += next - cursor - 1;
    cursor = next;
  }
  return 350 - Math.min(gaps * 8 + cursor, 300);
}

export function scoreCommandPaletteCommand(command: CommandPaletteCommand, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const label = normalizeSearchText(command.label);
  const searchable = normalizeSearchText(
    [command.label, command.description, ...(command.keywords ?? [])].filter(Boolean).join(' '),
  );
  let score = 0;

  for (const token of normalizedQuery.split(' ')) {
    const labelScore = scoreToken(label, token);
    const searchableScore = scoreToken(searchable, token);
    const boostedLabelScore = labelScore < 0 ? -1 : labelScore + 120;
    const tokenScore = Math.max(boostedLabelScore, searchableScore);
    if (tokenScore < 0) return -1;
    score += tokenScore;
  }

  return score;
}

export function resolveCommandPaletteResults(
  commands: readonly CommandPaletteCommand[],
  query: string,
  filter?: CommandPaletteFilter,
): CommandPaletteResolvedCommand[] {
  const seen = new Set<string>();
  const results: CommandPaletteResolvedCommand[] = [];

  commands.forEach((command, index) => {
    const id = command.id.trim();
    const label = command.label.trim();
    if (!id || !label || seen.has(id)) return;
    seen.add(id);

    const customResult = filter?.(command, query);
    let score = scoreCommandPaletteCommand(command, query);
    if (typeof customResult === 'number') score = customResult;
    else if (customResult === false) score = -1;
    if (score >= 0) results.push({ command, index, score });
  });

  return results.sort((left, right) => right.score - left.score || left.index - right.index);
}

export function resolveCommandPaletteSections(options: {
  commands: readonly CommandPaletteCommand[];
  filter?: CommandPaletteFilter;
  groups?: readonly CommandPaletteGroup[];
  query?: string;
  recentIds?: readonly string[];
  recentLabel?: string;
}): CommandPaletteSection[] {
  const query = options.query ?? '';
  const groups = options.groups ?? [];
  const groupMap = new Map(groups.map((group, index) => [group.id, { ...group, index }]));
  const recentRank = new Map((options.recentIds ?? []).map((id, index) => [id, index]));
  const results = resolveCommandPaletteResults(options.commands, query, options.filter);
  const recent: CommandPaletteResolvedCommand[] = [];
  const sectionMap = new Map<string, CommandPaletteSection & { order: number; index: number }>();

  for (const result of results) {
    if (!query.trim() && recentRank.has(result.command.id)) {
      recent.push(result);
      continue;
    }

    const groupId = result.command.group?.trim() || DEFAULT_GROUP_ID;
    const definition = groupMap.get(groupId);
    const existing = sectionMap.get(groupId);
    if (existing) {
      existing.commands.push(result);
    } else {
      sectionMap.set(groupId, {
        id: groupId,
        label: definition?.label || (groupId === DEFAULT_GROUP_ID ? DEFAULT_GROUP_LABEL : groupId),
        commands: [result],
        order: definition?.order ?? Number.MAX_SAFE_INTEGER,
        index: definition?.index ?? sectionMap.size,
      });
    }
  }

  recent.sort(
    (left, right) =>
      (recentRank.get(left.command.id) ?? Number.MAX_SAFE_INTEGER) -
      (recentRank.get(right.command.id) ?? Number.MAX_SAFE_INTEGER),
  );

  const sections = [...sectionMap.values()]
    .sort((left, right) => left.order - right.order || left.index - right.index)
    .map(({ id, label, commands }) => ({ id, label, commands }));

  return recent.length
    ? [
        { id: RECENT_GROUP_ID, label: options.recentLabel ?? 'Recent', commands: recent },
        ...sections,
      ]
    : sections;
}

export function flattenCommandPaletteSections(
  sections: readonly CommandPaletteSection[],
): CommandPaletteResolvedCommand[] {
  return sections.flatMap(({ commands }) => commands);
}

export function getNextCommandPaletteActiveId(
  commands: readonly CommandPaletteResolvedCommand[],
  activeId: string | null | undefined,
  direction: 1 | -1 | 'first' | 'last',
): string | null {
  const enabled = commands.filter(({ command }) => command.disabled !== true);
  if (!enabled.length) return null;
  if (direction === 'first') return enabled[0]?.command.id ?? null;
  if (direction === 'last') return enabled.at(-1)?.command.id ?? null;

  const current = enabled.findIndex(({ command }) => command.id === activeId);
  let next = current + direction;
  if (current < 0) next = direction === 1 ? 0 : enabled.length - 1;
  return enabled[(next + enabled.length) % enabled.length]?.command.id ?? null;
}

export function isCommandPaletteEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'),
  );
}

export function matchesCommandPaletteShortcut(
  event: Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'key' | 'metaKey' | 'repeat' | 'shiftKey'>,
  shortcut: CommandPaletteShortcut,
): boolean {
  if (event.repeat) return false;
  const tokens = (typeof shortcut === 'string' ? shortcut.split(/\s*\+\s*/u) : shortcut)
    .map((token) => token.trim().toLocaleLowerCase('en-US'))
    .filter(Boolean);
  if (!tokens.length) return false;

  const hasMod = tokens.includes('mod');
  const requiresControl = tokens.includes('control') || tokens.includes('ctrl');
  const requiresMeta = tokens.some((token) => ['meta', 'cmd', 'command'].includes(token));
  const requiresAlt = tokens.some((token) => ['alt', 'option'].includes(token));
  const requiresShift = tokens.includes('shift');
  const modifierTokens = new Set([
    'mod',
    'control',
    'ctrl',
    'meta',
    'cmd',
    'command',
    'alt',
    'option',
    'shift',
  ]);
  const key = tokens.find((token) => !modifierTokens.has(token));

  if (!key || (hasMod && !event.ctrlKey && !event.metaKey)) return false;
  if (!hasMod && event.ctrlKey !== requiresControl) return false;
  if (!hasMod && event.metaKey !== requiresMeta) return false;
  if (event.altKey !== requiresAlt || event.shiftKey !== requiresShift) return false;
  if (requiresControl && !event.ctrlKey) return false;
  if (requiresMeta && !event.metaKey) return false;
  return event.key.toLocaleLowerCase('en-US') === key;
}

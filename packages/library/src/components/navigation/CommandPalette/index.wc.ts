import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import CommandPaletteVueComponent from './index.ce.vue';
import type {
  CommandPaletteCommand,
  CommandPaletteFilter,
  CommandPaletteGroup,
  CommandPaletteMode,
  CommandPaletteShortcut,
} from './command-palette.shared';

const CommandPaletteVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(CommandPaletteVueComponent, `${UIKIT_NAME}-command-palette`, { hostRole: 'group' });

/** Light-DOM command palette with property-based command registration. */
export class CommandPaletteElement extends CommandPaletteVueElement {
  static readonly tagName = CommandPaletteVueElement.tagName;

  declare commands: readonly CommandPaletteCommand[];
  declare open: boolean;
  declare query: string;
  declare activeId: string | null;
  declare recentIds: readonly string[];
  declare shortcut: CommandPaletteShortcut;
  declare registerShortcut: boolean;
  declare filter: CommandPaletteFilter | undefined;
  declare groups: readonly CommandPaletteGroup[];
  declare loading: boolean;
  declare closeOnExecute: boolean;
  declare mode: CommandPaletteMode;
  declare virtual: boolean;
  declare virtualThreshold: number;
  declare virtualHeight: number;

  constructor() {
    super();
    this.addEventListener('update:open', this.syncOpen);
    this.addEventListener('update:query', this.syncQuery);
    this.addEventListener('update:activeId', this.syncActiveId);
  }

  private getVueProperty(name: string): unknown {
    return Reflect.get(this, name);
  }

  private setVueProperty(name: string, value: unknown): void {
    Reflect.set(this, name, value);
  }

  private queueVuePropertySync(name: string, value: unknown): void {
    globalThis.queueMicrotask(() => {
      if (!Object.is(this.getVueProperty(name), value)) this.setVueProperty(name, value);
    });
  }

  private readonly syncOpen = (event: Event): void => {
    const value = (event as CustomEvent<boolean>).detail;
    if (!Object.is(this.getVueProperty('open'), value)) this.setVueProperty('open', value);
  };

  private readonly syncQuery = (event: Event): void => {
    const value = (event as CustomEvent<string>).detail;
    this.queueVuePropertySync('query', value);
  };

  private readonly syncActiveId = (event: Event): void => {
    const value = (event as CustomEvent<string | null>).detail;
    this.queueVuePropertySync('activeId', value);
  };

  openPalette(): void {
    this.setVueProperty('open', true);
  }

  closePalette(): void {
    this.setVueProperty('open', false);
  }

  focusSearch(): void {
    this.querySelector<HTMLInputElement>('[role="combobox"]')?.focus();
  }
}

export function defineCommandPalette(): typeof CommandPaletteElement {
  definePeauiCustomElement(CommandPaletteElement);
  return CommandPaletteElement;
}

defineCommandPalette();

export default CommandPaletteElement;

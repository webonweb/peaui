import { UIKIT_NAME } from '@/constants';

const GRID_ITEM_TAG_NAME = `${UIKIT_NAME}-grid-item`;
const GRID_ITEM_CLASS_NAME = `${UIKIT_NAME}-grid-item`;
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);

function getNormalizedAttributeValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const normalizedValue = value.trim();

    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    const normalizedValue = String(value).trim();

    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }

  return undefined;
}

function getBooleanAttributeValue(element: HTMLElement, name: string, fallback = false): boolean {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const normalizedValue = `${element.getAttribute(name) ?? ''}`.trim().toLowerCase();

  if (!normalizedValue) {
    return true;
  }

  return !FALSEY_ATTRIBUTE_VALUES.has(normalizedValue);
}

function getNumberAttributeValue(element: HTMLElement, name: string): number | undefined {
  const value = getNormalizedAttributeValue(element.getAttribute(name));

  if (!value) {
    return undefined;
  }

  const normalizedNumber = Number(value);

  return Number.isFinite(normalizedNumber) ? normalizedNumber : undefined;
}

function setNumberAttribute(element: HTMLElement, name: string, value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean) {
  element.setAttribute(name, String(value));
}

function normalizeNodes(nodes: Node[]): Node[] {
  return nodes.filter((node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return Boolean(node.textContent?.trim());
    }

    return true;
  });
}

export class GridItemElement extends HTMLElement {
  static readonly tagName = GRID_ITEM_TAG_NAME;

  static get observedAttributes(): string[] {
    return ['colspan', 'columns', 'gap', 'grid', 'class', 'style'];
  }

  #isMounted = false;
  #isSyncingDom = false;
  #managedClasses = new Set<string>();
  #mutationObserver: MutationObserver | null = null;

  connectedCallback(): void {
    if (this.#isMounted) {
      this.render();
      return;
    }

    this.#isMounted = true;
    this.#setupObserver();
    this.render();
  }

  disconnectedCallback(): void {
    this.#isMounted = false;
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
  }

  attributeChangedCallback(): void {
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    this.render();
  }

  get colspan(): number | undefined {
    return getNumberAttributeValue(this, 'colspan');
  }

  set colspan(value: number | null | undefined) {
    setNumberAttribute(this, 'colspan', value);
  }

  get columns(): number | undefined {
    return getNumberAttributeValue(this, 'columns');
  }

  set columns(value: number | null | undefined) {
    setNumberAttribute(this, 'columns', value);
  }

  get gap(): number {
    return getNumberAttributeValue(this, 'gap') ?? 6;
  }

  set gap(value: number | null | undefined) {
    setNumberAttribute(this, 'gap', value);
  }

  get grid(): boolean {
    return getBooleanAttributeValue(this, 'grid', true);
  }

  set grid(value: boolean) {
    setBooleanAttribute(this, 'grid', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#syncClasses();
      this.#syncStyleVars();
    });
  }

  #withDomSync<T>(callback: () => T): T {
    const wasSyncingDom = this.#isSyncingDom;

    this.#isSyncingDom = true;

    try {
      return callback();
    } finally {
      this.#isSyncingDom = wasSyncingDom;
    }
  }

  #setupObserver(): void {
    if (this.#mutationObserver) {
      return;
    }

    this.#mutationObserver = new MutationObserver((records) => {
      if (this.#isSyncingDom || this.#shouldIgnoreMutations(records)) {
        return;
      }

      this.render();
    });

    this.#mutationObserver.observe(this, {
      childList: true,
    });
  }

  #shouldIgnoreMutations(records: MutationRecord[]): boolean {
    return records.length === 0;
  }

  #syncClasses(): void {
    const classNames = new Set(
      [GRID_ITEM_CLASS_NAME, this.grid && `${GRID_ITEM_CLASS_NAME}--grid`].filter(
        Boolean,
      ) as string[],
    );

    for (const className of this.#managedClasses) {
      if (!classNames.has(className)) {
        this.classList.remove(className);
      }
    }

    for (const className of classNames) {
      this.classList.add(className);
    }

    this.#managedClasses = classNames;
  }

  #syncStyleVars(): void {
    this.style.setProperty('--peaui-grid-item-colspan', String(Math.max(this.colspan ?? 1, 1)));
    this.style.setProperty('--peaui-grid-item-columns', String(this.#slotColumns));
    this.style.setProperty('--peaui-grid-item-gap', String(this.gap));
  }

  get #slotColumns(): number {
    const columns = this.columns;

    if (columns !== undefined && columns > 0) {
      return columns;
    }

    return Math.max(normalizeNodes(Array.from(this.childNodes)).length, 1);
  }
}

export function defineGridItem(): typeof GridItemElement {
  if (typeof window !== 'undefined' && !window.customElements.get(GRID_ITEM_TAG_NAME)) {
    window.customElements.define(GRID_ITEM_TAG_NAME, GridItemElement);
  }

  return GridItemElement;
}

defineGridItem();

export default GridItemElement;

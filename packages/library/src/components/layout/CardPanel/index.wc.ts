import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { UIKIT_NAME } from '@/constants';
import { syncNodeChildren } from '@/helpers/dom.helper';

const CARD_PANEL_TAG_NAME = `${UIKIT_NAME}-card-panel`;
const CARD_PANEL_CLASS_NAME = `${UIKIT_NAME}-card-panel`;
const AS_VALUES = ['div', 'section', 'article', 'a'] as const;
const SIZE_VALUES = ['xs', 's', 'm', 'l'] as const;
const COLOR_VALUES = ['default', 'primary', 'grey'] as const;
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);

type CardPanelTag = (typeof AS_VALUES)[number];
type CardPanelSize = (typeof SIZE_VALUES)[number];
type CardPanelColor = (typeof COLOR_VALUES)[number];

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

function setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  const normalizedValue = getNormalizedAttributeValue(value);

  if (normalizedValue === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
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

function getEnumAttributeValue<T extends readonly string[]>(
  element: HTMLElement,
  name: string,
  allowedValues: T,
  fallback: T[number],
): T[number] {
  const value = element.getAttribute(name);

  if (value !== null && (allowedValues as readonly string[]).includes(value)) {
    return value;
  }

  return fallback;
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

export class CardPanelElement extends HTMLElement {
  static readonly tagName = CARD_PANEL_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'aria-label',
      'as',
      'background-color',
      'border-color',
      'data-testid',
      'href',
      'download',
      'hreflang',
      'referrerpolicy',
      'ping',
      'type',
      'is-hover-enabled',
      'is-shadow-enabled',
      'rel',
      'size',
      'target',
    ];
  }

  #contentElement = document.createElement('div');
  #contentNodes: Node[] = [];
  #headerElement = document.createElement('div');
  #headerNodes: Node[] = [];
  #isMounted = false;
  #isSyncingDom = false;
  #mutationObserver: MutationObserver | null = null;
  #rootElement: HTMLElement = document.createElement('div');

  connectedCallback(): void {
    upgradeCustomElementProperties(this);
    if (this.#isMounted) {
      this.render();
      return;
    }

    this.#isMounted = true;
    this.#setupObserver();
    this.#collectExternalNodes();
    this.render();
  }

  disconnectedCallback(): void {
    this.#isMounted = false;
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    this.render();
  }

  get ariaLabel(): string | null {
    return getNormalizedAttributeValue(this.getAttribute('aria-label')) ?? null;
  }

  set ariaLabel(value: string | null) {
    setStringAttribute(this, 'aria-label', value);
  }

  get as(): CardPanelTag {
    return getEnumAttributeValue(this, 'as', AS_VALUES, 'div');
  }

  set as(value: CardPanelTag) {
    this.setAttribute('as', value);
  }

  get isShadowEnabled(): boolean {
    return getBooleanAttributeValue(this, 'is-shadow-enabled');
  }

  set isShadowEnabled(value: boolean) {
    if (value) this.setAttribute('is-shadow-enabled', '');
    else this.removeAttribute('is-shadow-enabled');
  }

  get isHoverEnabled(): boolean {
    return getBooleanAttributeValue(this, 'is-hover-enabled', true);
  }

  set isHoverEnabled(value: boolean) {
    this.setAttribute('is-hover-enabled', String(value));
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  get backgroundColor(): CardPanelColor {
    return getEnumAttributeValue(this, 'background-color', COLOR_VALUES, 'default');
  }

  set backgroundColor(value: CardPanelColor) {
    this.setAttribute('background-color', value);
  }

  get borderColor(): CardPanelColor {
    return getEnumAttributeValue(this, 'border-color', COLOR_VALUES, 'default');
  }

  set borderColor(value: CardPanelColor) {
    this.setAttribute('border-color', value);
  }

  get size(): CardPanelSize {
    return getEnumAttributeValue(this, 'size', SIZE_VALUES, 'm');
  }

  set size(value: CardPanelSize) {
    this.setAttribute('size', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncRoot();
      this.#syncChildren();
      this.#syncHeader();
      this.#syncContent();
    });
  }

  #withDomSync<T>(callback: () => T): T {
    const wasSyncingDom = this.#isSyncingDom;

    this.#isSyncingDom = true;
    this.#mutationObserver?.disconnect();

    try {
      return callback();
    } finally {
      this.#isSyncingDom = wasSyncingDom;
      if (!wasSyncingDom && this.#isMounted) this.#observeMutations();
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

      this.#collectExternalNodes();
      this.render();
    });

    this.#observeMutations();
  }

  #observeMutations(): void {
    this.#mutationObserver?.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['slot'],
    });
  }

  #shouldIgnoreMutations(records: MutationRecord[]): boolean {
    if (records.length === 0) {
      return false;
    }

    return records.every((record) => {
      const changedNodes: Node[] = [
        ...Array.from(record.addedNodes),
        ...Array.from(record.removedNodes),
      ];

      return (
        record.target === this &&
        changedNodes.length > 0 &&
        changedNodes.every(
          (node) =>
            node === this.#rootElement ||
            this.#headerNodes.includes(node) ||
            this.#contentNodes.includes(node),
        )
      );
    });
  }

  #collectExternalNodes(): void {
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => node !== this.#rootElement),
    );
    const sourceNodes = normalizeNodes(
      Array.from(new Set([...directNodes, ...this.#headerNodes, ...this.#contentNodes])).filter(
        (node) => directNodes.includes(node) || this.contains(node),
      ),
    );
    const nextHeaderNodes: Node[] = [];
    const nextContentNodes: Node[] = [];

    sourceNodes.forEach((node) => {
      const slotName = node instanceof Element ? node.getAttribute('slot') : null;

      if (slotName === 'header') {
        nextHeaderNodes.push(node);
        return;
      }

      nextContentNodes.push(node);
    });

    this.#headerNodes = nextHeaderNodes;
    this.#contentNodes = nextContentNodes;
  }

  #syncRoot(): void {
    if (this.#rootElement.tagName.toLowerCase() !== this.as) {
      const previousRootElement = this.#rootElement;

      this.#rootElement = document.createElement(this.as);

      if (previousRootElement.parentNode === this) {
        previousRootElement.remove();
      }
    }

    this.#rootElement.className = this.#baseClassName;

    if (this.dataTestId) {
      this.#rootElement.setAttribute('data-testid', this.dataTestId);
    } else {
      this.#rootElement.removeAttribute('data-testid');
    }

    if (this.ariaLabel) {
      this.#rootElement.setAttribute('aria-label', this.ariaLabel);
    } else {
      this.#rootElement.removeAttribute('aria-label');
    }

    this.#syncAnchorAttributes();

    if (this.#rootElement.parentNode !== this) {
      this.appendChild(this.#rootElement);
    }
  }

  #syncAnchorAttributes(): void {
    for (const name of ['download', 'hreflang', 'referrerpolicy', 'ping', 'type']) {
      const value = this.as === 'a' ? this.getAttribute(name) : null;
      if (value === null) this.#rootElement.removeAttribute(name);
      else this.#rootElement.setAttribute(name, value);
    }
    if (this.as !== 'a') {
      this.#rootElement.removeAttribute('href');
      this.#rootElement.removeAttribute('target');
      this.#rootElement.removeAttribute('rel');
      return;
    }

    const normalizedHref = getNormalizedAttributeValue(this.getAttribute('href'));
    const normalizedTarget = getNormalizedAttributeValue(this.getAttribute('target'));
    const normalizedRel = getNormalizedAttributeValue(this.getAttribute('rel'));
    const resolvedRel =
      normalizedTarget === '_blank' ? (normalizedRel ?? 'noopener noreferrer') : normalizedRel;

    if (normalizedHref) {
      this.#rootElement.setAttribute('href', normalizedHref);
    } else {
      this.#rootElement.removeAttribute('href');
    }

    if (normalizedTarget) {
      this.#rootElement.setAttribute('target', normalizedTarget);
    } else {
      this.#rootElement.removeAttribute('target');
    }

    if (resolvedRel) {
      this.#rootElement.setAttribute('rel', resolvedRel);
    } else {
      this.#rootElement.removeAttribute('rel');
    }
  }

  #syncHeader(): void {
    this.#headerElement.className = `${CARD_PANEL_CLASS_NAME}__header`;
    syncNodeChildren(this.#headerElement, this.#headerNodes);
  }

  #syncContent(): void {
    this.#contentElement.className = this.#hasHeaderSlot
      ? `${CARD_PANEL_CLASS_NAME}__content ${CARD_PANEL_CLASS_NAME}__content--with-header`
      : `${CARD_PANEL_CLASS_NAME}__content`;
    syncNodeChildren(this.#contentElement, this.#contentNodes);
  }

  #syncChildren(): void {
    const children: Node[] = [];

    if (this.#hasHeaderSlot) {
      children.push(this.#headerElement);
    }

    children.push(this.#contentElement);
    syncNodeChildren(this.#rootElement, children);
  }

  get #baseClassName(): string {
    return [
      CARD_PANEL_CLASS_NAME,
      `${CARD_PANEL_CLASS_NAME}--size-${this.size}`,
      this.#hasHeaderSlot && `${CARD_PANEL_CLASS_NAME}--with-header`,
      this.isHoverEnabled && !this.isShadowEnabled && `${CARD_PANEL_CLASS_NAME}--hover-enabled`,
      this.isShadowEnabled && `${CARD_PANEL_CLASS_NAME}--shadow-enabled`,
      `${CARD_PANEL_CLASS_NAME}--background-${this.backgroundColor}`,
      `${CARD_PANEL_CLASS_NAME}--border-${this.borderColor}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get #hasHeaderSlot(): boolean {
    return this.#headerNodes.length > 0;
  }
}

export function defineCardPanel(): typeof CardPanelElement {
  if (typeof window !== 'undefined' && !window.customElements.get(CARD_PANEL_TAG_NAME)) {
    window.customElements.define(CARD_PANEL_TAG_NAME, CardPanelElement);
  }

  return CardPanelElement;
}

defineCardPanel();

export default CardPanelElement;

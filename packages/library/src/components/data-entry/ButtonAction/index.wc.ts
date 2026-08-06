import { UIKIT_NAME } from '@/constants';
import { isCustomElementNode, syncNodeChildren } from '@/helpers/dom.helper';

const BUTTON_ACTION_TAG_NAME = `${UIKIT_NAME}-button-action`;
const BUTTON_ACTION_CLASS_NAME = `${UIKIT_NAME}-button-action`;
const DEFAULT_ACCESSIBLE_NAME = 'Przycisk akcji';
const SIZE_VALUES = ['xxs', 'xs', 's', 'm', 'l'] as const;
const VARIANT_VALUES = ['primary', 'secondary', 'ghost', 'danger'] as const;
const TYPE_VALUES = ['button', 'submit', 'reset'] as const;
const NON_FORWARDED_ATTRIBUTES = new Set([
  'size',
  'variant',
  'type',
  'disabled',
  'data-testid',
  'use-aria-label',
  'class',
  'style',
]);
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);

type ButtonSize = (typeof SIZE_VALUES)[number];
type ButtonVariant = (typeof VARIANT_VALUES)[number];
type ButtonType = (typeof TYPE_VALUES)[number];

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

function isInlineEventHandlerAttribute(name: string): boolean {
  return /^on/i.test(name);
}

function hasVisibleTextContent(nodes: Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return Boolean(node.textContent?.trim());
    }

    if (node instanceof Element) {
      return Boolean(node.textContent.trim());
    }

    return false;
  });
}

export class ButtonActionElement extends HTMLElement {
  static readonly tagName = BUTTON_ACTION_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'size',
      'variant',
      'type',
      'disabled',
      'data-testid',
      'use-aria-label',
      'aria-label',
      'aria-labelledby',
      'class',
      'style',
      'id',
      'name',
      'title',
    ];
  }

  #ariaLabelProp: string | undefined;
  #buttonElement = document.createElement('button');
  #contentNodes: Node[] = [];
  #isMounted = false;
  #isSyncingDom = false;
  #managedForwardedAttributes = new Set<string>();
  #mutationObserver: MutationObserver | null = null;

  connectedCallback(): void {
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

  attributeChangedCallback(): void {
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    this.render();
  }

  get size(): ButtonSize {
    return getEnumAttributeValue(this, 'size', SIZE_VALUES, 'm');
  }

  set size(value: ButtonSize) {
    this.setAttribute('size', value);
  }

  get variant(): ButtonVariant {
    return getEnumAttributeValue(this, 'variant', VARIANT_VALUES, 'primary');
  }

  set variant(value: ButtonVariant) {
    this.setAttribute('variant', value);
  }

  get type(): ButtonType {
    return getEnumAttributeValue(this, 'type', TYPE_VALUES, 'button');
  }

  set type(value: ButtonType) {
    this.setAttribute('type', value);
  }

  get disabled(): boolean {
    return getBooleanAttributeValue(this, 'disabled');
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
      return;
    }

    this.removeAttribute('disabled');
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  get useAriaLabel(): boolean {
    return getBooleanAttributeValue(this, 'use-aria-label');
  }

  set useAriaLabel(value: boolean) {
    if (value) {
      this.setAttribute('use-aria-label', '');
      return;
    }

    this.removeAttribute('use-aria-label');
  }

  get ariaLabel(): string | null {
    return this.#ariaLabelProp ?? null;
  }

  set ariaLabel(value: string | null) {
    this.#ariaLabelProp = getNormalizedAttributeValue(value);

    if (this.#isMounted) {
      this.render();
    }
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncHost();
      this.#syncButton();
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

      this.#collectExternalNodes();
      this.render();
    });

    this.#mutationObserver.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  #shouldIgnoreMutations(records: MutationRecord[]): boolean {
    if (records.length === 0) {
      return false;
    }

    return records.every((record) => {
      if (record.type === 'attributes') {
        return (
          record.target === this.#buttonElement ||
          this.#hasTrackedCustomElementAncestor(record.target, false)
        );
      }

      if (record.type === 'characterData') {
        return this.#hasTrackedCustomElementAncestor(record.target);
      }

      const changedNodes: Node[] = [
        ...Array.from(record.addedNodes),
        ...Array.from(record.removedNodes),
      ];

      if (changedNodes.length === 0) {
        return false;
      }

      if (record.target === this) {
        return changedNodes.every(
          (node) => node === this.#buttonElement || this.#contentNodes.includes(node),
        );
      }

      if (record.target === this.#buttonElement) {
        return changedNodes.every((node) => this.#contentNodes.includes(node));
      }

      if (this.#hasTrackedCustomElementAncestor(record.target)) {
        return true;
      }

      return false;
    });
  }

  #hasTrackedCustomElementAncestor(node: Node, includeSelf = true): boolean {
    let currentNode: Node | null = includeSelf ? node : node.parentNode;

    while (currentNode && currentNode !== this) {
      if (this.#contentNodes.includes(currentNode)) {
        return isCustomElementNode(currentNode);
      }

      currentNode = currentNode.parentNode;
    }

    return false;
  }

  #collectExternalNodes(): void {
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => node !== this.#buttonElement),
    );
    const sourceNodes = normalizeNodes(
      Array.from(new Set([...directNodes, ...this.#contentNodes])).filter(
        (node) => directNodes.includes(node) || this.contains(node),
      ),
    );

    this.#contentNodes = sourceNodes;
  }

  #syncHost(): void {
    if (this.#buttonElement.parentNode !== this) {
      this.appendChild(this.#buttonElement);
    }
  }

  #syncButton(): void {
    this.#buttonElement.type = this.type;
    this.#buttonElement.disabled = this.disabled;
    this.#buttonElement.className = this.#resolvedClassName;
    this.#syncForwardedAttributes();
    this.#syncAriaLabel();

    if (this.dataTestId) {
      this.#buttonElement.setAttribute('data-testid', this.dataTestId);
    } else {
      this.#buttonElement.removeAttribute('data-testid');
    }

    syncNodeChildren(this.#buttonElement, this.#contentNodes);
  }

  #syncForwardedAttributes(): void {
    const forwardedAttributes = new Map<string, string>();

    for (const attribute of Array.from(this.attributes)) {
      if (
        NON_FORWARDED_ATTRIBUTES.has(attribute.name) ||
        isInlineEventHandlerAttribute(attribute.name)
      ) {
        continue;
      }

      forwardedAttributes.set(attribute.name, attribute.value);
    }

    const externalStyle = getNormalizedAttributeValue(this.getAttribute('style'));

    if (externalStyle) {
      forwardedAttributes.set('style', externalStyle);
    } else {
      forwardedAttributes.delete('style');
    }

    for (const name of this.#managedForwardedAttributes) {
      if (!forwardedAttributes.has(name)) {
        this.#buttonElement.removeAttribute(name);
      }
    }

    for (const [name, value] of forwardedAttributes) {
      this.#buttonElement.setAttribute(name, value);
    }

    this.#managedForwardedAttributes = new Set(forwardedAttributes.keys());
  }

  #syncAriaLabel(): void {
    const normalizedAttrsAriaLabel = getNormalizedAttributeValue(this.getAttribute('aria-label'));
    const normalizedAttrsAriaLabelledBy = getNormalizedAttributeValue(
      this.getAttribute('aria-labelledby'),
    );
    const resolvedAriaLabel =
      this.#ariaLabelProp ?? normalizedAttrsAriaLabel ?? this.#fallbackAccessibleName;
    const shouldUseAriaLabel = this.useAriaLabel || !hasVisibleTextContent(this.#contentNodes);

    if (shouldUseAriaLabel && !normalizedAttrsAriaLabelledBy && resolvedAriaLabel) {
      this.#buttonElement.setAttribute('aria-label', resolvedAriaLabel);
      return;
    }

    if (normalizedAttrsAriaLabel === undefined) {
      this.#buttonElement.removeAttribute('aria-label');
    }
  }

  get #fallbackAccessibleName(): string {
    return (
      getNormalizedAttributeValue(this.getAttribute('title')) ??
      getNormalizedAttributeValue(this.getAttribute('name')) ??
      getNormalizedAttributeValue(this.getAttribute('id')) ??
      this.dataTestId ??
      DEFAULT_ACCESSIBLE_NAME
    );
  }

  get #resolvedClassName(): string {
    const classNames = [
      BUTTON_ACTION_CLASS_NAME,
      `${BUTTON_ACTION_CLASS_NAME}--size-${this.size}`,
      `${BUTTON_ACTION_CLASS_NAME}--variant-${this.variant}`,
    ];

    if (this.disabled) {
      classNames.push(`${BUTTON_ACTION_CLASS_NAME}--is-disabled`);
    }

    const externalClassName = getNormalizedAttributeValue(this.getAttribute('class'));

    if (externalClassName) {
      classNames.push(externalClassName);
    }

    return classNames.join(' ');
  }
}

export function defineButtonAction(): typeof ButtonActionElement {
  if (typeof window !== 'undefined' && !window.customElements.get(BUTTON_ACTION_TAG_NAME)) {
    window.customElements.define(BUTTON_ACTION_TAG_NAME, ButtonActionElement);
  }

  return ButtonActionElement;
}

defineButtonAction();

export default ButtonActionElement;

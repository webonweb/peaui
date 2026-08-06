import { UIKIT_NAME } from '@/constants';
import { isCustomElementNode, syncNodeChildren } from '@/helpers/dom.helper';

const NAVIGATION_LINK_TAG_NAME = `${UIKIT_NAME}-navigation-link`;
const NAVIGATION_LINK_CLASS_NAME = `${UIKIT_NAME}-navigation-link`;
const DEFAULT_ACCESSIBLE_NAME = 'Link nawigacyjny';
const SIZE_VALUES = ['m', 's', 'xs'] as const;
const VARIANT_VALUES = ['default', 'primary'] as const;
const NON_FORWARDED_ATTRIBUTES = new Set([
  'path',
  'size',
  'variant',
  'data-testid',
  'aria-label',
  'rel',
  'href',
  'to',
  'class',
  'style',
]);

type NavigationLinkSize = (typeof SIZE_VALUES)[number];
type NavigationLinkVariant = (typeof VARIANT_VALUES)[number];

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

function hasVisibleTextContent(nodes: Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return Boolean(node.textContent?.trim());
    }

    if (node instanceof Element) {
      if (node.getAttribute('aria-hidden') === 'true') {
        return false;
      }

      if (node.childNodes.length > 0) {
        return hasVisibleTextContent(Array.from(node.childNodes));
      }

      return Boolean(node.textContent.trim());
    }

    return false;
  });
}

export class NavigationLinkElement extends HTMLElement {
  static readonly tagName = NAVIGATION_LINK_TAG_NAME;

  #anchorElement = document.createElement('a');
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

  get path(): string {
    return this.getAttribute('path') ?? '';
  }

  set path(value: string) {
    this.setAttribute('path', value);
  }

  get size(): NavigationLinkSize {
    return getEnumAttributeValue(this, 'size', SIZE_VALUES, 's');
  }

  set size(value: NavigationLinkSize) {
    this.setAttribute('size', value);
  }

  get variant(): NavigationLinkVariant {
    return getEnumAttributeValue(this, 'variant', VARIANT_VALUES, 'default');
  }

  set variant(value: NavigationLinkVariant) {
    this.setAttribute('variant', value);
  }

  get ariaLabel(): string | null {
    return getNormalizedAttributeValue(this.getAttribute('aria-label')) ?? null;
  }

  set ariaLabel(value: string | null) {
    setStringAttribute(this, 'aria-label', value);
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncHost();
      this.#syncAnchor();
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
          record.target === this.#anchorElement ||
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
          (node) => node === this.#anchorElement || this.#contentNodes.includes(node),
        );
      }

      if (record.target === this.#anchorElement) {
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
      Array.from(this.childNodes).filter((node) => node !== this.#anchorElement),
    );
    const sourceNodes = normalizeNodes(
      Array.from(new Set([...directNodes, ...this.#contentNodes])).filter(
        (node) => directNodes.includes(node) || this.contains(node),
      ),
    );

    this.#contentNodes = sourceNodes;
  }

  #syncHost(): void {
    if (this.#anchorElement.parentNode !== this) {
      this.appendChild(this.#anchorElement);
    }
  }

  #syncAnchor(): void {
    this.#anchorElement.className = this.#resolvedClassName;

    if (this.#normalizedPath) {
      this.#anchorElement.setAttribute('href', this.#normalizedPath);
    } else {
      this.#anchorElement.removeAttribute('href');
    }

    this.#syncForwardedAttributes();
    this.#syncAriaLabel();
    this.#syncRel();

    if (this.dataTestId) {
      this.#anchorElement.setAttribute('data-testid', this.dataTestId);
    } else {
      this.#anchorElement.removeAttribute('data-testid');
    }

    syncNodeChildren(this.#anchorElement, this.#contentNodes);
  }

  #syncForwardedAttributes(): void {
    const forwardedAttributes = new Map<string, string>();

    for (const attribute of Array.from(this.attributes)) {
      if (NON_FORWARDED_ATTRIBUTES.has(attribute.name)) {
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
        this.#anchorElement.removeAttribute(name);
      }
    }

    for (const [name, value] of forwardedAttributes) {
      this.#anchorElement.setAttribute(name, value);
    }

    this.#managedForwardedAttributes = new Set(forwardedAttributes.keys());
  }

  #syncAriaLabel(): void {
    if (this.#hasVisibleLabel) {
      this.#anchorElement.removeAttribute('aria-label');
      return;
    }

    const ariaLabelAttribute = this.getAttributeNode('aria-label');
    const explicitAriaLabel = ariaLabelAttribute
      ? getNormalizedAttributeValue(ariaLabelAttribute.value)
      : undefined;
    const title = getNormalizedAttributeValue(this.getAttribute('title'));
    let accessibleName = DEFAULT_ACCESSIBLE_NAME;

    if (this.#normalizedPath) {
      accessibleName = this.#normalizedPath;
    }

    if (title) {
      accessibleName = title;
    }

    if (explicitAriaLabel) {
      accessibleName = explicitAriaLabel;
    }

    this.#anchorElement.setAttribute('aria-label', accessibleName);
  }

  #syncRel(): void {
    if (!this.#normalizedPath) {
      this.#anchorElement.removeAttribute('rel');
      return;
    }

    const normalizedTarget = getNormalizedAttributeValue(this.getAttribute('target'));
    const normalizedRel = getNormalizedAttributeValue(this.getAttribute('rel'));
    const resolvedRel =
      normalizedTarget === '_blank' ? (normalizedRel ?? 'noopener noreferrer') : normalizedRel;

    if (resolvedRel) {
      this.#anchorElement.setAttribute('rel', resolvedRel);
      return;
    }

    this.#anchorElement.removeAttribute('rel');
  }

  get #normalizedPath(): string {
    return this.path.trim();
  }

  get #hasVisibleLabel(): boolean {
    return hasVisibleTextContent(this.#contentNodes);
  }

  get #resolvedClassName(): string {
    const classNames = [
      NAVIGATION_LINK_CLASS_NAME,
      `${NAVIGATION_LINK_CLASS_NAME}--size-${this.size}`,
      `${NAVIGATION_LINK_CLASS_NAME}--variant-${this.variant}`,
    ];
    const externalClassName = getNormalizedAttributeValue(this.getAttribute('class'));

    if (externalClassName) {
      classNames.push(externalClassName);
    }

    return classNames.join(' ');
  }
}

export function defineNavigationLink(): typeof NavigationLinkElement {
  if (typeof window !== 'undefined' && !window.customElements.get(NAVIGATION_LINK_TAG_NAME)) {
    window.customElements.define(NAVIGATION_LINK_TAG_NAME, NavigationLinkElement);
  }

  return NavigationLinkElement;
}

defineNavigationLink();

export default NavigationLinkElement;

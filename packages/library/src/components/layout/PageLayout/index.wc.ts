import { UIKIT_NAME } from '@/constants';
import { isCustomElementNode, syncNodeChildren } from '@/helpers/dom.helper';

const PAGE_LAYOUT_TAG_NAME = `${UIKIT_NAME}-page-layout`;
const PAGE_LAYOUT_CLASS_NAME = `${UIKIT_NAME}-page-layout`;
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

function setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  const normalizedValue = getNormalizedAttributeValue(value);

  if (normalizedValue === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
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

export class PageLayoutElement extends HTMLElement {
  static readonly tagName = PAGE_LAYOUT_TAG_NAME;

  static get observedAttributes(): string[] {
    return ['aria-label', 'data-testid', 'is-header-sticky'];
  }

  #headerElement = document.createElement('header');
  #mainElement = document.createElement('main');
  #additionalElement = document.createElement('div');
  #bodyElement = document.createElement('div');
  #footerElement = document.createElement('footer');
  #topNodes: Node[] = [];
  #additionalNodes: Node[] = [];
  #contentNodes: Node[] = [];
  #footerNodes: Node[] = [];
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

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  get ariaLabel(): string | null {
    return getNormalizedAttributeValue(this.getAttribute('aria-label')) ?? null;
  }

  set ariaLabel(value: string | null) {
    setStringAttribute(this, 'aria-label', value);
  }

  get isHeaderSticky(): boolean {
    return getBooleanAttributeValue(this, 'is-header-sticky');
  }

  set isHeaderSticky(value: boolean) {
    setBooleanAttribute(this, 'is-header-sticky', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncHostClasses();
      this.#syncChildren();
      this.#syncHeader();
      this.#syncMainContainer();
      this.#syncMainContent();
      this.#syncFooter();
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
      if (record.type === 'attributes') {
        return this.#hasTrackedCustomElementAncestor(record.target, false);
      }

      if (record.type !== 'childList') {
        return false;
      }

      const changedNodes: Node[] = [
        ...Array.from(record.addedNodes),
        ...Array.from(record.removedNodes),
      ];

      if (changedNodes.length === 0) {
        return false;
      }

      if (record.target === this) {
        return changedNodes.every((node) => this.#isManagedNode(node) || this.#isTrackedNode(node));
      }

      if (this.#isManagedNode(record.target)) {
        return changedNodes.every((node) => this.#isManagedNode(node) || this.#isTrackedNode(node));
      }

      if (this.#getTrackedAncestor(record.target) !== null) {
        return true;
      }

      return false;
    });
  }

  #isManagedNode(node: Node): boolean {
    return (
      node === this.#headerElement ||
      node === this.#mainElement ||
      node === this.#additionalElement ||
      node === this.#bodyElement ||
      node === this.#footerElement
    );
  }

  #isTrackedNode(node: Node): boolean {
    return (
      this.#topNodes.includes(node) ||
      this.#additionalNodes.includes(node) ||
      this.#contentNodes.includes(node) ||
      this.#footerNodes.includes(node)
    );
  }

  #hasTrackedCustomElementAncestor(node: Node, includeSelf = true): boolean {
    const trackedAncestor = this.#getTrackedAncestor(node, includeSelf);

    return Boolean(trackedAncestor && isCustomElementNode(trackedAncestor));
  }

  #getTrackedAncestor(node: Node, includeSelf = true): Node | null {
    let currentNode: Node | null = includeSelf ? node : node.parentNode;

    while (currentNode && currentNode !== this) {
      if (this.#isTrackedNode(currentNode)) {
        return currentNode;
      }

      currentNode = currentNode.parentNode;
    }

    return null;
  }

  #collectExternalNodes(): void {
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => !this.#isManagedNode(node)),
    );
    const sourceNodes = normalizeNodes(
      Array.from(
        new Set([
          ...directNodes,
          ...this.#topNodes,
          ...this.#additionalNodes,
          ...this.#contentNodes,
          ...this.#footerNodes,
        ]),
      ).filter((node) => directNodes.includes(node) || this.contains(node)),
    );
    const nextTopNodes: Node[] = [];
    const nextAdditionalNodes: Node[] = [];
    const nextContentNodes: Node[] = [];
    const nextFooterNodes: Node[] = [];

    sourceNodes.forEach((node) => {
      const slotName = node instanceof Element ? node.getAttribute('slot') : null;

      switch (slotName) {
        case 'top':
          nextTopNodes.push(node);
          break;
        case 'additional':
          nextAdditionalNodes.push(node);
          break;
        case 'footer':
          nextFooterNodes.push(node);
          break;
        default:
          nextContentNodes.push(node);
          break;
      }
    });

    this.#topNodes = nextTopNodes;
    this.#additionalNodes = nextAdditionalNodes;
    this.#contentNodes = nextContentNodes;
    this.#footerNodes = nextFooterNodes;
  }

  #syncHostClasses(): void {
    const classNames = new Set([PAGE_LAYOUT_CLASS_NAME]);

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

  #syncHeader(): void {
    this.#headerElement.className = this.isHeaderSticky
      ? `${PAGE_LAYOUT_CLASS_NAME}__top ${PAGE_LAYOUT_CLASS_NAME}__top--sticky`
      : `${PAGE_LAYOUT_CLASS_NAME}__top`;

    if (this.ariaLabel) {
      this.#headerElement.setAttribute('aria-label', this.ariaLabel);
    } else {
      this.#headerElement.removeAttribute('aria-label');
    }

    if (this.#topTestId) {
      this.#headerElement.setAttribute('data-testid', this.#topTestId);
    } else {
      this.#headerElement.removeAttribute('data-testid');
    }

    syncNodeChildren(this.#headerElement, this.#topNodes);
  }

  #syncMainContainer(): void {
    this.#mainElement.className = `${PAGE_LAYOUT_CLASS_NAME}__content`;

    if (this.#contentTestId) {
      this.#mainElement.setAttribute('data-testid', this.#contentTestId);
    } else {
      this.#mainElement.removeAttribute('data-testid');
    }

    this.#additionalElement.className = `${PAGE_LAYOUT_CLASS_NAME}__additional`;
    this.#bodyElement.className = `${PAGE_LAYOUT_CLASS_NAME}__body`;

    const mainChildren: Node[] = [];

    if (this.#additionalNodes.length > 0) {
      mainChildren.push(this.#additionalElement);
    }

    mainChildren.push(this.#bodyElement);
    syncNodeChildren(this.#mainElement, mainChildren);
  }

  #syncMainContent(): void {
    syncNodeChildren(this.#additionalElement, this.#additionalNodes);
    syncNodeChildren(this.#bodyElement, this.#contentNodes);
  }

  #syncFooter(): void {
    this.#footerElement.className = `${PAGE_LAYOUT_CLASS_NAME}__footer`;
    syncNodeChildren(this.#footerElement, this.#footerNodes);
  }

  #syncChildren(): void {
    const children: Node[] = [];

    if (this.#topNodes.length > 0) {
      children.push(this.#headerElement);
    }

    children.push(this.#mainElement);

    if (this.#footerNodes.length > 0) {
      children.push(this.#footerElement);
    }

    syncNodeChildren(this, children);
  }

  get #topTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-top` : undefined;
  }

  get #contentTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-content` : undefined;
  }
}

export function definePageLayout(): typeof PageLayoutElement {
  if (typeof window !== 'undefined' && !window.customElements.get(PAGE_LAYOUT_TAG_NAME)) {
    window.customElements.define(PAGE_LAYOUT_TAG_NAME, PageLayoutElement);
  }

  return PageLayoutElement;
}

definePageLayout();

export default PageLayoutElement;

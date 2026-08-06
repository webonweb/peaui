import { UIKIT_NAME } from '@/constants';
import { isCustomElementNode, syncNodeChildren } from '@/helpers/dom.helper';

const GRID_SECTION_TAG_NAME = `${UIKIT_NAME}-grid-section`;
const GRID_SECTION_CLASS_NAME = `${UIKIT_NAME}-grid-section`;

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

export class GridSectionElement extends HTMLElement {
  static readonly tagName = GRID_SECTION_TAG_NAME;

  static get observedAttributes(): string[] {
    return ['columns', 'gap', 'class'];
  }

  #additionalElement = document.createElement('div');
  #contentElement = document.createElement('div');
  #additionalNodes: Node[] = [];
  #contentNodes: Node[] = [];
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

  get columns(): number {
    return getNumberAttributeValue(this, 'columns') ?? 4;
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

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncHostClasses();
      this.#syncChildren();
      this.#syncAdditional();
      this.#syncContent();
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
        return changedNodes.every(
          (node) =>
            node === this.#additionalElement ||
            node === this.#contentElement ||
            this.#isTrackedNode(node),
        );
      }

      if (record.target === this.#additionalElement || record.target === this.#contentElement) {
        return changedNodes.every((node) => this.#isTrackedNode(node));
      }

      if (this.#getTrackedAncestor(record.target) !== null) {
        return true;
      }

      return false;
    });
  }

  #isTrackedNode(node: Node): boolean {
    return this.#additionalNodes.includes(node) || this.#contentNodes.includes(node);
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
    const orderedDomNodes = normalizeNodes(
      Array.from(this.childNodes).flatMap((node) => {
        if (node === this.#additionalElement) {
          return Array.from(this.#additionalElement.childNodes);
        }

        if (node === this.#contentElement) {
          return Array.from(this.#contentElement.childNodes);
        }

        return [node];
      }),
    );
    const sourceNodes =
      orderedDomNodes.length > 0
        ? orderedDomNodes
        : normalizeNodes(
            [...this.#additionalNodes, ...this.#contentNodes].filter((node) => this.contains(node)),
          );
    const nextAdditionalNodes: Node[] = [];
    const nextContentNodes: Node[] = [];

    sourceNodes.forEach((node) => {
      const slotName = node instanceof Element ? node.getAttribute('slot') : null;

      if (slotName === 'additional') {
        nextAdditionalNodes.push(node);
        return;
      }

      nextContentNodes.push(node);
    });

    this.#additionalNodes = nextAdditionalNodes;
    this.#contentNodes = nextContentNodes;
  }

  #syncHostClasses(): void {
    const classNames = new Set([GRID_SECTION_CLASS_NAME]);

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

  #syncAdditional(): void {
    this.#additionalElement.className = `${GRID_SECTION_CLASS_NAME}__additional`;
    syncNodeChildren(this.#additionalElement, this.#additionalNodes);
  }

  #syncContent(): void {
    this.#contentElement.className =
      this.columns > 1
        ? `${GRID_SECTION_CLASS_NAME}__content ${GRID_SECTION_CLASS_NAME}__content--multi`
        : `${GRID_SECTION_CLASS_NAME}__content`;

    this.#contentElement.style.setProperty('--peaui-grid-gap-y', String(this.gap));
    this.#contentElement.style.setProperty('--columns-minus-one', String(this.#columnsMinusOne));
    this.#contentElement.style.setProperty('--columns', String(this.columns));
    syncNodeChildren(this.#contentElement, this.#contentNodes);
  }

  #syncChildren(): void {
    const children: Node[] = [];

    if (this.#additionalNodes.length > 0) {
      children.push(this.#additionalElement);
    }

    children.push(this.#contentElement);
    syncNodeChildren(this, children);
  }

  get #columnsMinusOne(): number {
    return Math.max(this.columns - 1, 1);
  }
}

export function defineGridSection(): typeof GridSectionElement {
  if (typeof window !== 'undefined' && !window.customElements.get(GRID_SECTION_TAG_NAME)) {
    window.customElements.define(GRID_SECTION_TAG_NAME, GridSectionElement);
  }

  return GridSectionElement;
}

defineGridSection();

export default GridSectionElement;

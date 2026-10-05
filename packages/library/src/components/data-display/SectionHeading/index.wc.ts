import { SECTION_HEADING_TAGS } from './section-heading.shared';
import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { InfoTooltipElement, defineInfoTooltip } from '@/components/overlayer/InfoTooltip/index.wc';
import { UIKIT_NAME } from '@/constants';
import { renderCustomElement, syncNodeChildren } from '@/helpers/dom.helper';

const SECTION_HEADING_TAG_NAME = `${UIKIT_NAME}-section-heading`;
const SECTION_HEADING_CLASS_NAME = `${UIKIT_NAME}-section-heading`;
const SIZE_VALUES = [
  'heading-l',
  'heading-m',
  'heading-s',
  'heading-xs',
  'xl',
  'l',
  'm',
  's',
] as const;
const AS_VALUES = ['section', 'div', 'header'] as const;
const VARIANT_VALUES = ['default', 'primary', 'secondary'] as const;
const NON_FORWARDED_ATTRIBUTES = new Set(['size', 'as', 'data-testid', 'variant']);
const OBSERVED_ATTRIBUTES = new Set(['size', 'as', 'data-testid', 'variant']);
const HINT_ICON_PATH =
  'M6.19334 8.86C6.16467 8.89168 6.13795 8.92507 6.11334 8.96C6.08811 8.99716 6.06793 9.03752 6.05334 9.08C6.03412 9.11779 6.02063 9.15824 6.01334 9.2C6.01006 9.24438 6.01006 9.28895 6.01334 9.33333C6.01108 9.42078 6.02935 9.50755 6.06667 9.58667C6.09661 9.6694 6.14438 9.74453 6.20659 9.80674C6.26881 9.86896 6.34394 9.91673 6.42667 9.94667C6.50647 9.98194 6.59276 10.0002 6.68 10.0002C6.76725 10.0002 6.85354 9.98194 6.93334 9.94667C7.01607 9.91673 7.0912 9.86896 7.15341 9.80674C7.21563 9.74453 7.2634 9.6694 7.29334 9.58667C7.32294 9.50561 7.33653 9.41957 7.33334 9.33333C7.33384 9.2456 7.31703 9.15862 7.28385 9.0774C7.25067 8.99617 7.20179 8.92229 7.14 8.86C7.07803 8.79751 7.00429 8.74792 6.92305 8.71407C6.84181 8.68023 6.75468 8.6628 6.66667 8.6628C6.57866 8.6628 6.49153 8.68023 6.41029 8.71407C6.32905 8.74792 6.25531 8.79751 6.19334 8.86ZM6.66667 0C5.34813 0 4.0592 0.390993 2.96287 1.12354C1.86654 1.85608 1.01206 2.89727 0.507473 4.11544C0.00288856 5.33362 -0.129134 6.67406 0.128101 7.96727C0.385336 9.26048 1.02027 10.4484 1.95262 11.3807C2.88497 12.3131 4.07286 12.948 5.36607 13.2052C6.65927 13.4625 7.99972 13.3304 9.21789 12.8259C10.4361 12.3213 11.4773 11.4668 12.2098 10.3705C12.9423 9.27414 13.3333 7.98521 13.3333 6.66667C13.3333 5.79119 13.1609 4.92428 12.8259 4.11544C12.4908 3.30661 11.9998 2.57168 11.3807 1.95262C10.7617 1.33356 10.0267 0.842501 9.21789 0.50747C8.40906 0.172438 7.54215 0 6.66667 0ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1012C2.82657 10.5151 2.14298 9.68218 1.73931 8.70765C1.33564 7.73311 1.23003 6.66075 1.43582 5.62619C1.6416 4.59162 2.14955 3.64131 2.89543 2.89543C3.64131 2.14955 4.59162 1.6416 5.62619 1.43581C6.66075 1.23002 7.73311 1.33564 8.70765 1.73931C9.68219 2.14298 10.5151 2.82656 11.1012 3.70363C11.6872 4.58069 12 5.61183 12 6.66667C12 8.08115 11.4381 9.43771 10.4379 10.4379C9.43771 11.4381 8.08116 12 6.66667 12ZM6.66667 3.33333C6.31538 3.33311 5.97023 3.42541 5.66594 3.60096C5.36166 3.77651 5.10898 4.02911 4.93334 4.33333C4.8851 4.40921 4.85271 4.49406 4.83812 4.58278C4.82353 4.6715 4.82703 4.76226 4.84842 4.84959C4.86981 4.93692 4.90865 5.01902 4.96259 5.09096C5.01654 5.16289 5.08447 5.22317 5.16232 5.26816C5.24016 5.31316 5.3263 5.34194 5.41556 5.35279C5.50482 5.36363 5.59534 5.3563 5.68169 5.33125C5.76805 5.3062 5.84844 5.26394 5.91804 5.20701C5.98763 5.15009 6.04499 5.07967 6.08667 5C6.14541 4.89826 6.22998 4.81385 6.33183 4.75532C6.43369 4.69678 6.5492 4.6662 6.66667 4.66667C6.84348 4.66667 7.01305 4.7369 7.13807 4.86193C7.2631 4.98695 7.33334 5.15652 7.33334 5.33333C7.33334 5.51014 7.2631 5.67971 7.13807 5.80474C7.01305 5.92976 6.84348 6 6.66667 6C6.48986 6 6.32029 6.07024 6.19527 6.19526C6.07024 6.32029 6 6.48986 6 6.66667V7.33333C6 7.51014 6.07024 7.67971 6.19527 7.80474C6.32029 7.92976 6.48986 8 6.66667 8C6.84348 8 7.01305 7.92976 7.13807 7.80474C7.2631 7.67971 7.33334 7.51014 7.33334 7.33333V7.21333C7.77425 7.05335 8.14491 6.74348 8.38052 6.33791C8.61613 5.93234 8.7017 5.45686 8.62227 4.99459C8.54284 4.53233 8.30347 4.11268 7.946 3.80901C7.58853 3.50534 7.1357 3.33697 6.66667 3.33333Z';

type SectionHeadingSize = (typeof SIZE_VALUES)[number];
type SectionHeadingAs = (typeof AS_VALUES)[number];
type SectionHeadingVariant = (typeof VARIANT_VALUES)[number];

let nextTitleId = 0;

function getNextTitleId(): string {
  nextTitleId += 1;

  return `${SECTION_HEADING_CLASS_NAME}-title-${nextTitleId}`;
}

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

function createHintIcon(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  svg.setAttribute('class', `${SECTION_HEADING_CLASS_NAME}__hint-icon`);
  svg.setAttribute('viewBox', '0 0 14 14');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('aria-hidden', 'true');
  path.setAttribute('d', HINT_ICON_PATH);
  svg.appendChild(path);

  return svg;
}

defineInfoTooltip();

export class SectionHeadingElement extends HTMLElement {
  static readonly tagName = SECTION_HEADING_TAG_NAME;

  static get observedAttributes(): string[] {
    return Array.from(OBSERVED_ATTRIBUTES);
  }

  #titleId = getNextTitleId();
  #isMounted = false;
  #isSyncingDom = false;
  #managedForwardedAttributes = new Set<string>();
  #mutationObserver: MutationObserver | null = null;
  #rootElement: HTMLElement = document.createElement('div');
  #descriptionElement = document.createElement('p');
  #tooltipElement = document.createElement(InfoTooltipElement.tagName);
  #hintDescriptionElement = document.createElement('span');
  #hintIconElement = createHintIcon();
  #titleElement: HTMLElement | null = null;
  #titleNodes: Node[] = [];
  #descriptionNodes: Node[] = [];
  #hintNodes: Node[] = [];

  constructor() {
    super();

    this.#hintDescriptionElement.setAttribute('slot', 'description');
  }

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

  get size(): SectionHeadingSize {
    return getEnumAttributeValue(this, 'size', SIZE_VALUES, 'l');
  }

  set size(value: SectionHeadingSize) {
    this.setAttribute('size', value);
  }

  get as(): SectionHeadingAs {
    return getEnumAttributeValue(this, 'as', AS_VALUES, 'div');
  }

  set as(value: SectionHeadingAs) {
    this.setAttribute('as', value);
  }

  get variant(): SectionHeadingVariant {
    return getEnumAttributeValue(this, 'variant', VARIANT_VALUES, 'default');
  }

  set variant(value: SectionHeadingVariant) {
    this.setAttribute('variant', value);
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
      this.#syncRootElement();
      this.#syncTitle();
      this.#syncDescription();
      this.#syncRootChildren();
      // Reconcile the tooltip after moving its slotted content and sibling popup.
      if (this.#hintNodes.length > 0) renderCustomElement(this.#tooltipElement);
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
      childList: true,
      attributes: true,
    });
  }

  #shouldIgnoreMutations(records: MutationRecord[]): boolean {
    if (records.length === 0) {
      return false;
    }

    return records.every((record) => {
      if (record.type === 'attributes') {
        return (
          record.target === this &&
          Boolean(record.attributeName && OBSERVED_ATTRIBUTES.has(record.attributeName))
        );
      }

      if (record.type !== 'childList') {
        return false;
      }

      const changedNodes = [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)];

      return (
        record.target === this &&
        changedNodes.length > 0 &&
        changedNodes.every((node) => node === this.#rootElement)
      );
    });
  }

  #collectExternalNodes(): void {
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => node !== this.#rootElement),
    );
    const sourceNodes = normalizeNodes(
      Array.from(
        new Set([
          ...directNodes,
          ...this.#titleNodes,
          ...this.#descriptionNodes,
          ...this.#hintNodes,
        ]),
      ).filter((node) => directNodes.includes(node) || this.contains(node)),
    );
    const nextTitleNodes: Node[] = [];
    const nextDescriptionNodes: Node[] = [];
    const nextHintNodes: Node[] = [];

    sourceNodes.forEach((node) => {
      const slotName = node instanceof Element ? node.getAttribute('slot') : null;

      switch (slotName) {
        case 'title':
          nextTitleNodes.push(node);
          break;
        case 'description':
          nextDescriptionNodes.push(node);
          break;
        case 'hint':
          nextHintNodes.push(node);
          break;
        default:
          break;
      }
    });

    this.#titleNodes = nextTitleNodes;
    this.#descriptionNodes = nextDescriptionNodes;
    this.#hintNodes = nextHintNodes;
  }

  #syncHost(): void {
    if (!this.style.display) {
      this.style.display = 'block';
    }

    if (this.#rootElement.parentNode !== this) {
      this.appendChild(this.#rootElement);
    }
  }

  #syncRootElement(): void {
    if (this.#rootElement.tagName.toLowerCase() !== this.as) {
      const previousRootElement = this.#rootElement;

      this.#rootElement = document.createElement(this.as);
      this.#managedForwardedAttributes = new Set();

      if (previousRootElement.parentNode === this) {
        previousRootElement.remove();
      }
    }

    this.#rootElement.className = this.#resolvedRootClassName;

    if (this.dataTestId) {
      this.#rootElement.setAttribute('data-testid', this.dataTestId);
    } else {
      this.#rootElement.removeAttribute('data-testid');
    }

    if (this.#titleNodes.length > 0) {
      this.#rootElement.setAttribute('aria-labelledby', this.#titleId);
    } else {
      this.#rootElement.removeAttribute('aria-labelledby');
    }

    this.#syncForwardedAttributes();
  }

  #syncForwardedAttributes(): void {
    const forwardedAttributes = new Map<string, string>();

    for (const attribute of Array.from(this.attributes)) {
      if (NON_FORWARDED_ATTRIBUTES.has(attribute.name) || attribute.name === 'class') {
        continue;
      }

      forwardedAttributes.set(attribute.name, attribute.value);
    }

    for (const name of this.#managedForwardedAttributes) {
      if (!forwardedAttributes.has(name)) {
        this.#rootElement.removeAttribute(name);
      }
    }

    for (const [name, value] of forwardedAttributes) {
      this.#rootElement.setAttribute(name, value);
    }

    this.#managedForwardedAttributes = new Set(forwardedAttributes.keys());
  }

  #syncTitle(): void {
    if (this.#titleNodes.length === 0) {
      this.#titleElement = null;
      this.#tooltipElement.remove();
      return;
    }

    const expectedTagName = SECTION_HEADING_TAGS[this.size];

    if (!this.#titleElement || this.#titleElement.tagName.toLowerCase() !== expectedTagName) {
      this.#titleElement = document.createElement(expectedTagName);
    }

    this.#titleElement.id = this.#titleId;
    this.#titleElement.className = this.#titleClassName;

    if (this.#titleTestId) {
      this.#titleElement.setAttribute('data-testid', this.#titleTestId);
    } else {
      this.#titleElement.removeAttribute('data-testid');
    }

    const children = [...this.#titleNodes];

    if (this.#hintNodes.length > 0) {
      this.#tooltipElement.placement = 'right';
      this.#tooltipElement.dataTestId = this.#hintBaseTestId;
      syncNodeChildren(this.#hintDescriptionElement, this.#hintNodes);
      syncNodeChildren(this.#tooltipElement, [this.#hintIconElement, this.#hintDescriptionElement]);
      children.push(this.#tooltipElement);
      const popup = this.#tooltipElement.nextElementSibling;
      if (popup?.getAttribute('role') === 'tooltip') children.push(popup);
    } else {
      this.#tooltipElement.dataTestId = undefined;
      this.#tooltipElement.remove();
    }

    syncNodeChildren(this.#titleElement, children);
  }

  #syncDescription(): void {
    if (this.#descriptionNodes.length === 0) {
      return;
    }

    this.#descriptionElement.className = this.#descriptionClassName;

    if (this.#descriptionTestId) {
      this.#descriptionElement.setAttribute('data-testid', this.#descriptionTestId);
    } else {
      this.#descriptionElement.removeAttribute('data-testid');
    }

    syncNodeChildren(this.#descriptionElement, this.#descriptionNodes);
  }

  #syncRootChildren(): void {
    const children: Node[] = [];

    if (this.#titleElement) {
      children.push(this.#titleElement);
    }

    if (this.#descriptionNodes.length > 0) {
      children.push(this.#descriptionElement);
    }

    syncNodeChildren(this.#rootElement, children);

    if (this.#rootElement.parentNode !== this) {
      this.appendChild(this.#rootElement);
    }
  }

  get #resolvedRootClassName(): string {
    const externalClassName = getNormalizedAttributeValue(this.getAttribute('class'));

    return externalClassName
      ? `${SECTION_HEADING_CLASS_NAME} ${externalClassName}`
      : SECTION_HEADING_CLASS_NAME;
  }

  get #titleClassName(): string {
    const classNames = [SECTION_HEADING_CLASS_NAME + '__title'];

    if (this.size === 'heading-l') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--heading-large`);
    }

    if (this.size === 'heading-m') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--heading-medium`);
    }

    if (this.size === 'heading-s') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--heading-small`);
    }

    if (this.size === 'heading-xs') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--heading-extra-small`);
    }

    if (this.size === 'l') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--large`);
    }

    if (this.size === 'xl') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--extra-large`);
    }

    if (this.size === 's') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--small`);
    }

    classNames.push(`${SECTION_HEADING_CLASS_NAME}__title--variant-${this.variant}`);

    return classNames.join(' ');
  }

  get #descriptionClassName(): string {
    const classNames = [SECTION_HEADING_CLASS_NAME + '__description'];

    if (this.size === 'heading-l') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__description--heading-large`);
    }

    if (this.size === 'heading-s') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__description--heading-small`);
    }

    if (this.size === 'heading-xs') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__description--heading-extra-small`);
    }

    if (this.size === 'l' || this.size === 'heading-m') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__description--large`);
    }

    if (this.size === 'xl') {
      classNames.push(`${SECTION_HEADING_CLASS_NAME}__description--extra-large`);
    }

    classNames.push(`${SECTION_HEADING_CLASS_NAME}__description--variant-${this.variant}`);

    return classNames.join(' ');
  }

  get #titleTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-title` : undefined;
  }

  get #hintBaseTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-hint` : undefined;
  }

  get #descriptionTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-description` : undefined;
  }
}

export function defineSectionHeading(): typeof SectionHeadingElement {
  if (typeof window !== 'undefined' && !window.customElements.get(SECTION_HEADING_TAG_NAME)) {
    window.customElements.define(SECTION_HEADING_TAG_NAME, SectionHeadingElement);
  }

  return SectionHeadingElement;
}

defineSectionHeading();

export default SectionHeadingElement;

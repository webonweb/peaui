import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { getHumanizedSourceText } from './image-view.shared';
import { UIKIT_NAME } from '@/constants';

const IMAGE_VIEW_TAG_NAME = `${UIKIT_NAME}-image-view`;
const IMAGE_VIEW_CLASS_NAME = `${UIKIT_NAME}-image-view`;
const DEFAULT_ALT_TEXT = 'Obraz';
const SIZE_VALUES = ['auto', 'xs', 's', 'm', 'l', 'xl', 'full'] as const;
const FORWARDED_IMAGE_ATTRIBUTES = [
  'aria-label',
  'aria-labelledby',
  'crossorigin',
  'decoding',
  'fetchpriority',
  'height',
  'loading',
  'referrerpolicy',
  'sizes',
  'srcset',
  'title',
  'usemap',
  'width',
] as const;

type ImageViewSize = (typeof SIZE_VALUES)[number];

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

function setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  const normalizedValue = getNormalizedAttributeValue(value);

  if (normalizedValue === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
}

function getTrimmedAttributeValueAllowEmpty(
  element: HTMLElement,
  name: string,
): string | undefined {
  if (!element.hasAttribute(name)) {
    return undefined;
  }

  return `${element.getAttribute(name) ?? ''}`.trim();
}

function getResolvedAltText(
  src: string | undefined,
  explicitAlt: string | undefined,
  ariaLabel: string | undefined,
  title: string | undefined,
): string {
  if (explicitAlt !== undefined) {
    return explicitAlt;
  }

  return ariaLabel ?? title ?? getHumanizedSourceText(src) ?? DEFAULT_ALT_TEXT;
}

function isDecorativeImage(
  resolvedAlt: string,
  ariaLabel: string | undefined,
  ariaLabelledBy: string | undefined,
): boolean {
  return resolvedAlt === '' && !ariaLabel && !ariaLabelledBy;
}

export class ImageViewElement extends HTMLElement {
  static readonly tagName = IMAGE_VIEW_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'src',
      'alt',
      'size',
      'max',
      'data-testid',
      'class',
      'style',
      ...FORWARDED_IMAGE_ATTRIBUTES,
    ];
  }

  #imageElement = document.createElement('img');
  #isMounted = false;
  #isSyncingDom = false;
  #managedMaxWidth: string | undefined;
  #managedClasses = new Set<string>();
  #managedImageAttributes = new Set<string>();
  #originalInlineMaxWidth: string | null = null;

  connectedCallback(): void {
    upgradeCustomElementProperties(this);
    if (this.#isMounted) {
      this.render();
      return;
    }

    this.#isMounted = true;
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    this.render();
  }

  get src(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('src'));
  }

  set src(value: string | null | undefined) {
    setStringAttribute(this, 'src', value);
  }

  get alt(): string | undefined {
    return getTrimmedAttributeValueAllowEmpty(this, 'alt');
  }

  set alt(value: string | null | undefined) {
    if (value === null || value === undefined) {
      this.removeAttribute('alt');
      return;
    }

    this.setAttribute('alt', value.trim());
  }

  get size(): ImageViewSize {
    return getEnumAttributeValue(this, 'size', SIZE_VALUES, 'auto');
  }

  set size(value: ImageViewSize) {
    this.setAttribute('size', value);
  }

  get max(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('max'));
  }

  set max(value: string | null | undefined) {
    setStringAttribute(this, 'max', value);
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#syncHostClasses();
      this.#syncHostStyles();
      this.#syncImage();
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

  #syncHostClasses(): void {
    const classNames = new Set<string>([
      IMAGE_VIEW_CLASS_NAME,
      `${IMAGE_VIEW_CLASS_NAME}--size-${this.size}`,
    ]);

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

  #syncHostStyles(): void {
    const max = this.max;

    if (max) {
      if (this.#managedMaxWidth === undefined) {
        const inlineMaxWidth = this.style.getPropertyValue('max-width').trim();

        this.#originalInlineMaxWidth = inlineMaxWidth.length > 0 ? inlineMaxWidth : null;
      }

      this.style.maxWidth = max;
      this.#managedMaxWidth = max;
      return;
    }

    if (this.#managedMaxWidth === undefined) {
      return;
    }

    if (this.#originalInlineMaxWidth) {
      this.style.maxWidth = this.#originalInlineMaxWidth;
    } else {
      this.style.removeProperty('max-width');
    }

    this.#managedMaxWidth = undefined;
    this.#originalInlineMaxWidth = null;
  }

  #syncImage(): void {
    const src = this.src;

    if (!src) {
      this.#managedImageAttributes.clear();

      if (this.childNodes.length > 0) {
        this.replaceChildren();
      }

      return;
    }

    const ariaLabel = getNormalizedAttributeValue(this.getAttribute('aria-label'));
    const ariaLabelledBy = getNormalizedAttributeValue(this.getAttribute('aria-labelledby'));
    const title = getNormalizedAttributeValue(this.getAttribute('title'));
    const resolvedAlt = getResolvedAltText(src, this.alt, ariaLabel, title);
    const nextManagedAttributes = new Map<string, string>();

    this.#imageElement.className = `${IMAGE_VIEW_CLASS_NAME}__image`;

    nextManagedAttributes.set('src', src);
    nextManagedAttributes.set('alt', resolvedAlt);

    const dataTestId = this.dataTestId;

    if (dataTestId) {
      nextManagedAttributes.set('data-testid', dataTestId);
    }

    for (const attributeName of FORWARDED_IMAGE_ATTRIBUTES) {
      const value = getTrimmedAttributeValueAllowEmpty(this, attributeName);

      if (value !== undefined) {
        nextManagedAttributes.set(attributeName, value);
      }
    }

    if (isDecorativeImage(resolvedAlt, ariaLabel, ariaLabelledBy)) {
      nextManagedAttributes.set('aria-hidden', 'true');
      nextManagedAttributes.set('role', 'presentation');
    }

    for (const attributeName of this.#managedImageAttributes) {
      if (!nextManagedAttributes.has(attributeName)) {
        this.#imageElement.removeAttribute(attributeName);
      }
    }

    for (const [attributeName, value] of nextManagedAttributes) {
      this.#imageElement.setAttribute(attributeName, value);
    }

    this.#managedImageAttributes = new Set(nextManagedAttributes.keys());

    if (this.childNodes.length !== 1 || this.firstChild !== this.#imageElement) {
      this.replaceChildren(this.#imageElement);
    }
  }
}

export function defineImageView(): typeof ImageViewElement {
  if (typeof window !== 'undefined' && !window.customElements.get(IMAGE_VIEW_TAG_NAME)) {
    window.customElements.define(IMAGE_VIEW_TAG_NAME, ImageViewElement);
  }

  return ImageViewElement;
}

defineImageView();

export default ImageViewElement;

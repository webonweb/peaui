import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { UIKIT_NAME } from '@/constants';

const TAG_CHIP_TAG_NAME = `${UIKIT_NAME}-tag-chip`;
const TAG_CHIP_CLASS_NAME = `${UIKIT_NAME}-tag-chip`;

const SIZE_VALUES = ['xxs', 'xs', 's'] as const;
const VARIANT_VALUES = ['blue', 'green', 'red', 'orange', 'grey', 'violet', 'outline'] as const;
const AS_VALUES = ['span', 'button'] as const;
const INTERACTIVE_EVENT_NAMES = [
  'click',
  'keydown',
  'keyup',
  'keypress',
  'mousedown',
  'mouseup',
  'pointerdown',
  'pointerup',
  'touchstart',
  'touchend',
] as const;
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);

type TagChipSize = (typeof SIZE_VALUES)[number];
type TagChipVariant = (typeof VARIANT_VALUES)[number];
type TagChipAs = (typeof AS_VALUES)[number];
type InteractiveEventName = (typeof INTERACTIVE_EVENT_NAMES)[number];

const OBSERVED_ATTRIBUTES = [
  'label',
  'size',
  'variant',
  'active',
  'as',
  'data-testid',
  'aria-pressed',
  'disabled',
  ...INTERACTIVE_EVENT_NAMES.map((eventName) => `on${eventName}`),
];

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

function isInteractiveEventName(value: string): value is InteractiveEventName {
  return (INTERACTIVE_EVENT_NAMES as readonly string[]).includes(value);
}

function getBooleanAttributeValue(element: HTMLElement, name: string): boolean {
  if (!element.hasAttribute(name)) {
    return false;
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

function setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  const normalizedValue = getNormalizedAttributeValue(value);

  if (normalizedValue === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
}

export class TagChipElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return OBSERVED_ATTRIBUTES;
  }

  static readonly tagName = TAG_CHIP_TAG_NAME;

  #isMounted = false;
  #isSyncingAttributes = false;
  #hasExplicitAriaPressed = false;
  #managedClasses = new Set<string>();
  #trackedListeners = new Map<InteractiveEventName, Set<EventListenerOrEventListenerObject>>();

  constructor() {
    super();

    for (const eventName of INTERACTIVE_EVENT_NAMES) {
      this.#trackedListeners.set(eventName, new Set());
    }
  }

  connectedCallback(): void {
    upgradeCustomElementProperties(this);
    if (this.#isMounted) {
      this.render();
      return;
    }

    this.#isMounted = true;
    super.addEventListener('click', this.#handleManagedClick, true);
    super.addEventListener('keydown', this.#handleManagedKeydown);
    super.addEventListener('keyup', this.#handleManagedKeyup);

    this.render();
  }

  disconnectedCallback(): void {
    if (!this.#isMounted) {
      return;
    }

    this.#isMounted = false;

    super.removeEventListener('click', this.#handleManagedClick, true);
    super.removeEventListener('keydown', this.#handleManagedKeydown);
    super.removeEventListener('keyup', this.#handleManagedKeyup);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (this.#isSyncingAttributes) {
      return;
    }

    if (name === 'aria-pressed') {
      this.#hasExplicitAriaPressed =
        getNormalizedAttributeValue(this.getAttribute('aria-pressed')) !== undefined;
    }

    this.render();
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }

  set label(value: string) {
    setStringAttribute(this, 'label', value);
  }

  get size(): TagChipSize {
    return getEnumAttributeValue(this, 'size', SIZE_VALUES, 'xs');
  }

  set size(value: TagChipSize) {
    this.setAttribute('size', value);
  }

  get variant(): TagChipVariant {
    return getEnumAttributeValue(this, 'variant', VARIANT_VALUES, 'outline');
  }

  set variant(value: TagChipVariant) {
    this.setAttribute('variant', value);
  }

  get active(): boolean {
    return getBooleanAttributeValue(this, 'active');
  }

  set active(value: boolean | null) {
    if (value === null) {
      this.removeAttribute('active');
      return;
    }

    this.setAttribute('active', String(value));
  }

  get as(): TagChipAs {
    return getEnumAttributeValue(this, 'as', AS_VALUES, 'button');
  }

  set as(value: TagChipAs) {
    this.setAttribute('as', value);
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
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

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if (listener === null) {
      return;
    }

    super.addEventListener(type, listener, options);

    if (!isInteractiveEventName(type)) {
      return;
    }

    this.#trackedListeners.get(type)?.add(listener);
    this.render();
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void {
    if (listener === null) {
      return;
    }

    super.removeEventListener(type, listener, options);

    if (!isInteractiveEventName(type)) {
      return;
    }

    this.#trackedListeners.get(type)?.delete(listener);
    this.render();
  }

  render(): void {
    const size = this.size;
    const variant = this.variant;
    const active = this.active;
    const classNames = new Set([
      TAG_CHIP_CLASS_NAME,
      `${TAG_CHIP_CLASS_NAME}--size-${size}`,
      `${TAG_CHIP_CLASS_NAME}--variant-${variant}${active ? '-active' : ''}`,
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
    this.textContent = this.label;

    if (this.#isInteractiveButton) {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
    }

    if (this.#isInteractiveButton && this.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }

    this.#syncAriaPressed();
  }

  #syncAriaPressed(): void {
    const explicitAriaPressed = this.#hasExplicitAriaPressed
      ? getNormalizedAttributeValue(this.getAttribute('aria-pressed'))
      : undefined;

    if (explicitAriaPressed) {
      return;
    }

    if (!this.#isInteractiveButton || !this.hasAttribute('active')) {
      this.#setManagedAttribute('aria-pressed', undefined);
      return;
    }

    this.#setManagedAttribute('aria-pressed', this.active ? 'true' : 'false');
  }

  #setManagedAttribute(name: string, value: string | undefined): void {
    this.#isSyncingAttributes = true;

    if (value === undefined) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }

    this.#isSyncingAttributes = false;
  }

  get #hasInteractiveHandler(): boolean {
    return INTERACTIVE_EVENT_NAMES.some((eventName) => {
      const propertyName = `on${eventName}` as keyof HTMLElement;
      const listenerCount = this.#trackedListeners.get(eventName)?.size ?? 0;

      return (
        listenerCount > 0 ||
        this.hasAttribute(`on${eventName}`) ||
        typeof this[propertyName] === 'function'
      );
    });
  }

  get #hasAccessibleName(): boolean {
    return Boolean(
      getNormalizedAttributeValue(this.label) ??
      getNormalizedAttributeValue(this.getAttribute('aria-label')) ??
      getNormalizedAttributeValue(this.getAttribute('aria-labelledby')),
    );
  }

  get #isInteractiveButton(): boolean {
    return this.as === 'button' && this.#hasInteractiveHandler && this.#hasAccessibleName;
  }

  #handleManagedClick = (event: Event): void => {
    if (!this.#isInteractiveButton || !this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  };

  #handleManagedKeydown = (event: KeyboardEvent): void => {
    if (!this.#isInteractiveButton || this.disabled) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.click();
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  #handleManagedKeyup = (event: KeyboardEvent): void => {
    if (!this.#isInteractiveButton || this.disabled) {
      return;
    }

    if (event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.click();
  };
}

export function defineTagChip(): typeof TagChipElement {
  if (typeof window !== 'undefined' && !window.customElements.get(TAG_CHIP_TAG_NAME)) {
    window.customElements.define(TAG_CHIP_TAG_NAME, TagChipElement);
  }

  return TagChipElement;
}

defineTagChip();

export default TagChipElement;

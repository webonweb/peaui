import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { UIKIT_NAME } from '@/constants';
import {
  forwardNativeAttributes,
  observeNativeAttributes,
} from '@/helpers/native-element-attributes.helper';
type BadgeVariant = 'info' | 'error' | 'success' | 'danger';
type BadgeSize = 's' | 'm' | 'l';
const rootClass = `${UIKIT_NAME}-counter-badge`;
/** A live counter using native DOM; no framework runtime is required. */
export class CounterBadgeElement extends HTMLElement {
  static readonly tagName = rootClass;
  static readonly observedAttributes = ['value', 'variant', 'size', 'data-test-id'];
  #root = document.createElement('span');
  #disconnect: (() => void) | undefined;
  get value(): number {
    return Number(this.getAttribute('value') ?? 0);
  }
  set value(value: number) {
    this.setAttribute('value', String(value));
  }
  get variant(): BadgeVariant {
    const value = this.getAttribute('variant');
    return value === 'error' || value === 'success' || value === 'danger' ? value : 'info';
  }
  set variant(value: BadgeVariant) {
    this.setAttribute('variant', value);
  }
  get size(): BadgeSize {
    const value = this.getAttribute('size');
    return value === 'm' || value === 'l' ? value : 's';
  }
  set size(value: BadgeSize) {
    this.setAttribute('size', value);
  }
  get dataTestId(): string | undefined {
    return this.getAttribute('data-test-id') ?? undefined;
  }
  set dataTestId(value: string | undefined) {
    if (value === undefined) this.removeAttribute('data-test-id');
    else this.setAttribute('data-test-id', value);
  }
  connectedCallback(): void {
    upgradeCustomElementProperties(this);
    if (this.#root.parentNode !== this) this.replaceChildren(this.#root);
    this.#render();
    this.#disconnect?.();
    this.#disconnect = observeNativeAttributes(
      this,
      () => this.#render(),
      CounterBadgeElement.observedAttributes,
    );
  }
  disconnectedCallback(): void {
    this.#disconnect?.();
  }
  attributeChangedCallback(_name: string, previous: string | null, value: string | null): void {
    if (previous !== value && this.isConnected) this.#render();
  }
  #render(): void {
    forwardNativeAttributes(this, this.#root, CounterBadgeElement.observedAttributes);
    this.#root.className =
      `${rootClass} ${rootClass}--variant-${this.variant} ${rootClass}--size-${this.size} ${this.className}`.trim();
    this.#root.setAttribute('role', 'status');
    this.#root.setAttribute('aria-live', 'polite');
    this.#root.setAttribute('aria-atomic', 'true');
    if (this.dataTestId !== undefined) this.#root.dataset.testid = this.dataTestId;
    const value = String(this.value);
    if (this.#root.textContent !== value) this.#root.textContent = value;
  }
}
export function defineCounterBadge(): void {
  if (!customElements.get(CounterBadgeElement.tagName))
    customElements.define(CounterBadgeElement.tagName, CounterBadgeElement);
}
defineCounterBadge();
export default CounterBadgeElement;

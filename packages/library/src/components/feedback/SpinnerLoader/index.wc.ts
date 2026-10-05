import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { UIKIT_NAME } from '@/constants';
import {
  forwardNativeAttributes,
  observeNativeAttributes,
} from '@/helpers/native-element-attributes.helper';
const rootClass = `${UIKIT_NAME}-spinner-loader`;
export class SpinnerLoaderElement extends HTMLElement {
  static readonly tagName = rootClass;
  static readonly observedAttributes = ['data-test-id'];
  #root = document.createElement('div');
  #disconnect: (() => void) | undefined;
  constructor() {
    super();
    const status = document.createElement('div');
    status.className = `${rootClass}__text`;
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    status.textContent = 'Ładowanie... Proszę czekać.';
    const spinner = document.createElement('div');
    spinner.className = `${rootClass}__spinner`;
    spinner.setAttribute('aria-hidden', 'true');
    this.#root.append(status, spinner);
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
      SpinnerLoaderElement.observedAttributes,
    );
  }
  disconnectedCallback(): void {
    this.#disconnect?.();
  }
  attributeChangedCallback(_name: string, previous: string | null, value: string | null): void {
    if (previous !== value && this.isConnected) this.#render();
  }
  #render(): void {
    forwardNativeAttributes(this, this.#root, SpinnerLoaderElement.observedAttributes);
    this.#root.className = `${rootClass} ${rootClass}--fullscreen ${this.className}`.trim();
    this.#root.setAttribute('aria-busy', 'true');
    if (this.dataTestId !== undefined) this.#root.dataset.testid = this.dataTestId;
  }
}
export function defineSpinnerLoader(): void {
  if (!customElements.get(SpinnerLoaderElement.tagName))
    customElements.define(SpinnerLoaderElement.tagName, SpinnerLoaderElement);
}
defineSpinnerLoader();
export default SpinnerLoaderElement;

import {
  defineCustomElement,
  type Component,
  type CustomElementOptions,
  type VueElementConstructor,
} from 'vue';

export type PeauiVueElementConstructor = VueElementConstructor<Record<string, unknown>> & {
  readonly tagName: string;
};

type PeauiVueElementOptions = {
  /**
   * Optional semantic role for the custom-element host. It is only used when
   * the consumer did not provide a role explicitly.
   */
  hostRole?: string;
};

/**
 * Exposes an existing Vue component through the Custom Elements platform.
 *
 * Light DOM is intentional: every component entry loads its required styles,
 * and all framework implementations use the same tokens and BEM selectors.
 * Vue's custom-element runtime also translates component props, emits and
 * native slots into their Custom Elements equivalents.
 */
export function createVueCustomElement(
  component: unknown,
  tagName: string,
  options: PeauiVueElementOptions = {},
): PeauiVueElementConstructor {
  const createElement = defineCustomElement as unknown as (
    component: Component,
    options: CustomElementOptions,
  ) => VueElementConstructor<Record<string, unknown>>;
  const vueElementConstructor = createElement(component as Component, {
    shadowRoot: false,
  });

  class PeauiVueElement extends vueElementConstructor {
    connectedCallback(): void {
      if (options.hostRole && !this.hasAttribute('role')) {
        this.setAttribute('role', options.hostRole);
      }

      super.connectedCallback();
    }

    override dispatchEvent(event: Event): boolean {
      if (event instanceof CustomEvent && Array.isArray(event.detail)) {
        const normalizedDetail = event.detail.length === 1 ? event.detail[0] : event.detail;
        const normalizedEvent = new CustomEvent(event.type, {
          bubbles: event.bubbles,
          cancelable: event.cancelable,
          composed: event.composed,
          detail: normalizedDetail,
        });

        return super.dispatchEvent(normalizedEvent);
      }

      return super.dispatchEvent(event);
    }
  }

  const elementConstructor = PeauiVueElement as PeauiVueElementConstructor;

  Object.defineProperty(elementConstructor, 'tagName', {
    configurable: false,
    enumerable: true,
    value: tagName,
    writable: false,
  });

  return elementConstructor;
}

export function definePeauiCustomElement(elementConstructor: PeauiVueElementConstructor): void {
  if (typeof globalThis.customElements === 'undefined') return;

  if (!globalThis.customElements.get(elementConstructor.tagName)) {
    globalThis.customElements.define(elementConstructor.tagName, elementConstructor);
  }
}

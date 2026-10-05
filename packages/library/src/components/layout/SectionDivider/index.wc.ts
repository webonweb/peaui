import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { UIKIT_NAME } from '@/constants';

const className = `${UIKIT_NAME}-section-divider`;

/** A semantic separator with no framework runtime. */
export class SectionDividerElement extends HTMLElement {
  static readonly tagName = className;
  static readonly observedAttributes = ['direction', 'size', 'data-test-id'];
  #observer: MutationObserver | undefined;

  get direction(): 'horizontal' | 'vertical' {
    return this.getAttribute('direction') === 'vertical' ? 'vertical' : 'horizontal';
  }
  set direction(value: 'horizontal' | 'vertical') {
    this.setAttribute('direction', value);
  }
  get size(): 's' | 'm' | 'l' | 'xl' {
    const value = this.getAttribute('size');
    return value === 'm' || value === 'l' || value === 'xl' ? value : 's';
  }
  set size(value: 's' | 'm' | 'l' | 'xl') {
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
    this.render();
    this.#observer ??= new MutationObserver((records) => {
      if (
        records.some(
          ({ attributeName, oldValue }) =>
            attributeName !== null &&
            !SectionDividerElement.observedAttributes.includes(attributeName) &&
            oldValue !== this.getAttribute(attributeName),
        )
      )
        this.render();
    });
    this.#observer.observe(this, { attributes: true, attributeOldValue: true });
  }
  disconnectedCallback(): void {
    this.#observer?.disconnect();
  }
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this.isConnected) this.render();
  }
  private render(): void {
    const vertical = this.direction === 'vertical';
    const tag = vertical ? 'div' : 'hr';
    let root = this.firstElementChild as HTMLElement | null;
    if (root?.localName !== tag) {
      root = document.createElement(tag);
      this.replaceChildren(root);
    }
    for (const attribute of Array.from(root.attributes)) root.removeAttribute(attribute.name);
    for (const attribute of Array.from(this.attributes)) {
      if (
        ['id', 'direction', 'size', 'data-test-id', 'role', 'aria-orientation'].includes(
          attribute.name,
        )
      )
        continue;
      root.setAttribute(attribute.name, attribute.value);
    }
    root.className = [
      className,
      `${className}--${this.direction}`,
      `${className}--size-${this.size}`,
      this.className,
    ]
      .filter(Boolean)
      .join(' ');
    if (this.dataTestId !== undefined) root.dataset.testid = this.dataTestId;
    if (vertical) {
      root.setAttribute('role', 'separator');
      root.setAttribute('aria-orientation', 'vertical');
    }
  }
}

export function defineSectionDivider(): void {
  if (!customElements.get(SectionDividerElement.tagName))
    customElements.define(SectionDividerElement.tagName, SectionDividerElement);
}
defineSectionDivider();
export default SectionDividerElement;

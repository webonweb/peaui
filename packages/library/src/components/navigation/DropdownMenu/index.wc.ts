import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import DropdownMenuVueComponent from './index.vue';

const DropdownMenuVueElement = createVueCustomElement(
  DropdownMenuVueComponent,
  `${UIKIT_NAME}-dropdown-menu`,
);

/**
 * Vue Custom Elements consume projected light-DOM content as the default slot.
 * Preserve the public `slot="trigger"` API by normalizing it before Vue mounts.
 */
export class DropdownMenuElement extends DropdownMenuVueElement {
  static readonly tagName = `${UIKIT_NAME}-dropdown-menu`;

  private triggerCleanup?: () => void;
  private triggerObserver?: MutationObserver;
  private lightDomTrigger?: HTMLElement;

  connectedCallback(): void {
    const slottedTrigger = Array.from(this.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.getAttribute('slot') === 'trigger',
    );
    const trigger = slottedTrigger ?? this.lightDomTrigger;
    if (slottedTrigger) {
      slottedTrigger.remove();
      slottedTrigger.removeAttribute('slot');
      this.lightDomTrigger = slottedTrigger;
    }
    super.connectedCallback();

    if (trigger) void Promise.resolve().then(() => this.installLightDomTrigger(trigger));
  }

  disconnectedCallback(): void {
    this.triggerCleanup?.();
    this.triggerCleanup = undefined;
    super.disconnectedCallback();
  }

  private installLightDomTrigger(trigger: HTMLElement): void {
    this.triggerCleanup?.();
    const root = this.querySelector<HTMLElement>('.peaui-dropdown-menu');
    const proxy = root?.querySelector<HTMLButtonElement>('.peaui-dropdown-menu__trigger');
    if (!root || !proxy) return;

    proxy.classList.add('peaui-dropdown-menu__trigger-proxy');
    proxy.setAttribute('aria-hidden', 'true');
    proxy.setAttribute('inert', '');
    proxy.tabIndex = -1;
    proxy.focus = (options?: FocusOptions): void => trigger.focus(options);
    proxy.getBoundingClientRect = (): DOMRect => trigger.getBoundingClientRect();
    root.insertBefore(trigger, proxy);

    const syncAria = (): void => {
      for (const name of ['aria-controls', 'aria-expanded', 'aria-haspopup']) {
        const value = proxy.getAttribute(name);
        if (value === null) trigger.removeAttribute(name);
        else trigger.setAttribute(name, value);
      }
      if (proxy.disabled) trigger.setAttribute('aria-disabled', 'true');
      else trigger.removeAttribute('aria-disabled');
      if (trigger instanceof HTMLButtonElement) trigger.disabled = proxy.disabled;
      if (
        !trigger.matches('button, a[href], input, select, textarea, [tabindex], [role="button"]')
      ) {
        trigger.setAttribute('role', 'button');
        trigger.tabIndex = proxy.disabled ? -1 : 0;
      }
    };
    const activateProxy = (event: Event): void => {
      if (proxy.disabled) return;
      event.preventDefault();
      proxy.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    const forwardKeydown = (event: KeyboardEvent): void => {
      if (!['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Escape'].includes(event.key)) return;
      event.preventDefault();
      proxy.dispatchEvent(
        new KeyboardEvent('keydown', {
          altKey: event.altKey,
          bubbles: true,
          ctrlKey: event.ctrlKey,
          key: event.key,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
        }),
      );
    };
    const forwardFocus = (): void => trigger.focus();

    trigger.addEventListener('click', activateProxy);
    trigger.addEventListener('keydown', forwardKeydown);
    proxy.addEventListener('focus', forwardFocus);
    this.triggerObserver = new MutationObserver(syncAria);
    this.triggerObserver.observe(proxy, {
      attributeFilter: ['aria-controls', 'aria-expanded', 'aria-haspopup', 'disabled'],
      attributes: true,
    });
    this.triggerCleanup = (): void => {
      trigger.removeEventListener('click', activateProxy);
      trigger.removeEventListener('keydown', forwardKeydown);
      proxy.removeEventListener('focus', forwardFocus);
      this.triggerObserver?.disconnect();
      this.triggerObserver = undefined;
    };
    syncAria();
  }
}

export function defineDropdownMenu(): typeof DropdownMenuElement {
  definePeauiCustomElement(DropdownMenuElement);

  return DropdownMenuElement;
}

defineDropdownMenu();

export default DropdownMenuElement;

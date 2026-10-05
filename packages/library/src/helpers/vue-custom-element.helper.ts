import {
  defineCustomElement,
  getCurrentInstance,
  h,
  provide,
  shallowRef,
  onBeforeUpdate,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  useHost,
  type Component,
  type ComponentOptions,
  type SetupContext,
  type Slot,
  type CustomElementOptions,
  type VueElementConstructor,
} from 'vue';
import { connectFormReset } from './form-reset.helper';
import { NATIVE_SLOT_VERSION } from '../composables/useSlotPresence';

let elementAppId = 0;

/** Bridge native light-DOM slots and HTML attributes to the ordinary SFC contract. */
function withNativeElementContract(component: Component): Component {
  const options = component as ComponentOptions;
  const booleanProps = Object.entries((options.props ?? {}) as Record<string, unknown>).flatMap(
    ([name, definition]) => {
      const type =
        typeof definition === 'object' && definition !== null
          ? Reflect.get(definition, 'type')
          : definition;
      return type === Boolean ? [name] : [];
    },
  );
  const setup = options.setup as
    ((props: Readonly<Record<string, unknown>>, context: SetupContext) => unknown) | undefined;
  return {
    ...options,
    setup(props: Readonly<Record<string, unknown>>, context: SetupContext) {
      const instance = getCurrentInstance();
      const host = useHost();
      if (!instance || !host) return setup?.(props, context);
      // Vue 3.5 owns projection of these nodes. Keep that projection and expose
      // its slot presence to useSlots(), including conditional forwarded slots.
      const nativeSlots = () => Reflect.get(host, '_slots') as Record<string, Node[]> | undefined;
      const slotVersion = shallowRef(0);
      let projectionChanged = false;
      provide(NATIVE_SLOT_VERSION, slotVersion);
      // Vue removes native outlets after projection. Preserve their positions so
      // an existing outlet can accept nodes renamed or moved after connection.
      const outlets = new Map<HTMLSlotElement, Comment>();
      const getOutlets = Reflect.get(host, '_getSlots') as () => HTMLSlotElement[];
      Reflect.set(host, '_getSlots', () => {
        const current = getOutlets.call(host);
        for (const outlet of current) {
          if (outlets.has(outlet)) continue;
          const anchor = document.createComment('peaui-slot');
          outlet.before(anchor);
          outlets.set(outlet, anchor);
        }
        return current;
      });
      const restoreOutlets = () => {
        for (const [outlet, anchor] of outlets) {
          if (!anchor.isConnected) outlets.delete(outlet);
          else if (!outlet.isConnected) anchor.before(outlet);
        }
      };
      // Preserve identity: production Vue captures this object in setupContext.
      // Replacing it works in development (a getter) but loses slots in production.
      const normalize = () => {
        for (const name of booleanProps) {
          const value = instance.props[name];
          if (typeof value === 'string')
            instance.props[name] = !['false', '0', 'no', 'off'].includes(
              value.trim().toLowerCase(),
            );
        }
        for (const key of Object.keys(instance.attrs)) {
          if (/^(aria|data)[A-Z]/.test(key)) {
            instance.attrs[key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)] =
              instance.attrs[key];
            delete instance.attrs[key];
          }
        }
        if (host.id) {
          const target = 'id' in instance.props ? instance.props : instance.attrs;
          target.id = `${host.id}-control`;
        }
        const projected = nativeSlots() ?? {};
        const slots = instance.slots as Record<string, Slot | undefined>;
        for (const name of Object.keys(slots)) if (!(name in projected)) delete slots[name];
        for (const name of Object.keys(projected)) {
          slots[name] ??= () => [h('slot', name === 'default' ? {} : { name })];
        }
      };
      const observer = new MutationObserver((records) => {
        const projected = nativeSlots();
        if (!projected) return;
        const previous = Object.values(projected).flat();
        const removed = records.flatMap((record) => Array.from(record.removedNodes));
        const added = records
          .filter((record) => record.target === host)
          .flatMap((record) => Array.from(record.addedNodes));
        const nodes = [
          ...new Set([
            ...previous.filter(
              (node) =>
                !removed.some((parent) => parent === node || parent.contains(node)) ||
                host.contains(node),
            ),
            ...added,
          ]),
        ];
        const changed =
          nodes.length !== previous.length ||
          nodes.some((node) => !previous.includes(node)) ||
          records.some((record) =>
            previous.some((node) => node === record.target || node.contains(record.target)),
          );
        if (!changed) return;
        projectionChanged = true;
        slotVersion.value++;
        for (const name of Object.keys(projected)) delete projected[name];
        for (const node of nodes) {
          const name = node instanceof Element ? node.getAttribute('slot') || 'default' : 'default';
          (projected[name] ??= []).push(node);
        }
        normalize();
        instance.proxy?.$forceUpdate();
      });
      const observe = () =>
        observer.observe(host, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['slot'],
        });
      normalize();
      onBeforeUpdate(() => {
        observer.disconnect();
        // Moving projected text between pointerdown and click cancels activation
        // in WebKit. Ordinary prop/layout updates must preserve that DOM node.
        if (projectionChanged) {
          restoreOutlets();
          projectionChanged = false;
        }
        normalize();
      });
      onMounted(observe);
      onUpdated(() => {
        for (const [outlet, anchor] of outlets) {
          if (!anchor.isConnected) outlets.delete(outlet);
        }
        observe();
      });
      onBeforeUnmount(() => {
        observer.disconnect();
        Reflect.set(host, '_getSlots', getOutlets);
        outlets.clear();
      });
      return setup?.(props, context);
    },
  } as Component;
}

export type PeauiVueElementConstructor<Props extends object = Record<string, unknown>> =
  VueElementConstructor<{ -readonly [Key in keyof Props]: Props[Key] }> & {
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
export function createVueCustomElement<Props extends object = Record<string, unknown>>(
  component: unknown,
  tagName: string,
  options: PeauiVueElementOptions = {},
): PeauiVueElementConstructor<Props> {
  const createElement = defineCustomElement as unknown as (
    component: Component,
    options: CustomElementOptions,
  ) => VueElementConstructor<Record<string, unknown>>;
  const componentWithStyles = component as Component & { styles?: readonly string[] };
  // Vue cannot inject component-local styles into light DOM. The library emits
  // the same styles through its CSS entry, so remove the unsupported metadata
  // before constructing the element instead of logging a warning at runtime.
  const lightDomComponent = Array.isArray(componentWithStyles.styles)
    ? ({ ...componentWithStyles, styles: undefined } as Component)
    : componentWithStyles;
  const emits = (lightDomComponent as { emits?: string[] | Record<string, unknown> }).emits;
  const eventNames = new Set(
    (Array.isArray(emits) ? emits : Object.keys(emits ?? {})).flatMap((name) => [
      name,
      name.replace(/\B([A-Z])/g, '-$1').toLowerCase(),
    ]),
  );
  const vueElementConstructor = createElement(withNativeElementContract(lightDomComponent), {
    shadowRoot: false,
    configureApp(app) {
      app.config.idPrefix = `peaui-ce-${++elementAppId}`;
    },
  });

  class PeauiVueElement extends vueElementConstructor {
    private disconnectFormReset?: () => void;
    private readonly propertyWrites = new Map<string, number>();
    private trackingPropertyWrites = false;

    connectedCallback(): void {
      if (!this.trackingPropertyWrites) {
        this.trackingPropertyWrites = true;
        const setProp = Reflect.get(this, '_setProp') as (...args: unknown[]) => void;
        Reflect.set(this, '_setProp', (name: string, ...args: unknown[]) => {
          this.propertyWrites.set(name, (this.propertyWrites.get(name) ?? 0) + 1);
          setProp.call(this, name, ...args);
        });
      }
      if (options.hostRole && !this.hasAttribute('role')) {
        this.setAttribute('role', options.hostRole);
      }

      super.connectedCallback();
      this.disconnectFormReset?.();
      this.disconnectFormReset = connectFormReset(this);
    }

    disconnectedCallback(): void {
      this.disconnectFormReset?.();
      super.disconnectedCallback();
    }

    override dispatchEvent(event: Event): boolean {
      if (event instanceof CustomEvent && eventNames.has(event.type)) {
        const model = event.type.startsWith('update:') ? event.type.slice(7) : undefined;
        const previous = model ? (Reflect.get(this, model) as unknown) : undefined;
        const previousWrites = model ? this.propertyWrites.get(model) : undefined;
        const normalizedDetail =
          Array.isArray(event.detail) && event.detail.length === 1 ? event.detail[0] : event.detail;
        const normalizedEvent = new CustomEvent(event.type, {
          bubbles: true,
          cancelable: event.cancelable,
          composed: true,
          detail: normalizedDetail,
        });

        const accepted = super.dispatchEvent(normalizedEvent);
        if (!accepted) event.preventDefault();
        if (model && model in this) {
          queueMicrotask(() => {
            const current = Reflect.get(this, model);
            const consumerWrote = this.propertyWrites.get(model) !== previousWrites;
            if (accepted && !consumerWrote && Object.is(current, previous)) {
              if (!Object.is(current, normalizedDetail)) Reflect.set(this, model, normalizedDetail);
            } else if ((!accepted || consumerWrote) && Object.is(current, previous)) {
              const instance = Reflect.get(this, '_instance') as
                { props: Record<string, unknown> } | undefined;
              if (instance && model in instance.props && !Object.is(current, normalizedDetail)) {
                // Vue ignores same-value property writes, but useModel may have
                // changed locally. Restore that local value without re-entering
                // a render while the component's native event is still running.
                instance.props[model] = normalizedDetail;
                instance.props[model] = current;
              }
            }
          });
        }
        return accepted;
      }

      return super.dispatchEvent(event);
    }
  }

  const elementConstructor = PeauiVueElement as unknown as PeauiVueElementConstructor<Props>;

  Object.defineProperty(elementConstructor, 'tagName', {
    configurable: false,
    enumerable: true,
    value: tagName,
    writable: false,
  });

  return elementConstructor;
}

export function definePeauiCustomElement(
  elementConstructor: CustomElementConstructor & { readonly tagName: string },
): void {
  if (typeof globalThis.customElements === 'undefined') return;

  if (!globalThis.customElements.get(elementConstructor.tagName)) {
    globalThis.customElements.define(elementConstructor.tagName, elementConstructor);
  }
}

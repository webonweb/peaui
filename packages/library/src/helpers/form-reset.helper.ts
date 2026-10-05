type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type Snapshot = { value: unknown; controls: Array<{ value: string; checked?: boolean }> };
const initialValues = new WeakMap<HTMLElement, Snapshot>();
type ResetObserver = { belongsTo: (form: EventTarget | null) => boolean; reset: () => void };
const formsByDocument = new WeakMap<Document, Set<ResetObserver>>();

function observeReset(document: Document, observer: ResetObserver): () => void {
  let observers = formsByDocument.get(document);
  if (!observers) {
    observers = new Set();
    formsByDocument.set(document, observers);
    const current = observers;
    document.addEventListener('reset', (event) => {
      const pending = [...current];
      // A trusted reset-button activation may flush microtasks before its native default action.
      // Restore the model in the next task, after the browser has reset the native controls.
      setTimeout(() => {
        if (event.defaultPrevented) return;
        for (const entry of pending) {
          if (current.has(entry) && entry.belongsTo(event.target)) entry.reset();
        }
      }, 0);
    });
  }
  observers.add(observer);
  return () => {
    observers.delete(observer);
  };
}

/** Supports external form ownership and canceled reset events without per-control listeners. */
export function observeControlReset(control: HTMLElement, reset: () => void): () => void {
  return observeReset(control.ownerDocument, {
    belongsTo: (form) => {
      if ('form' in control) return (control as Control).form === form;
      const ownerId = control.getAttribute('form');
      const owner = ownerId
        ? control.ownerDocument.getElementById(ownerId)
        : control.closest('form');
      return owner === form || controlsFor(control).some((entry) => entry.form === form);
    },
    reset,
  });
}

function controlsFor(host: HTMLElement): Control[] {
  return Array.from(host.querySelectorAll<Control>('input, textarea, select'));
}

function copyValue(value: unknown): unknown {
  return Array.isArray(value) ? [...value] : value;
}

/** Synchronizes light-DOM native form resets with a custom element's public value property. */
export function connectFormReset(host: HTMLElement): () => void {
  const document = host.ownerDocument;
  let active = true;
  let disconnect: (() => void) | undefined;
  queueMicrotask(() => {
    if (!active || !host.isConnected || !('value' in host)) return;
    const controls = controlsFor(host);
    if (controls.length === 0) return;
    if (!initialValues.has(host)) {
      initialValues.set(host, {
        value: copyValue(Reflect.get(host, 'value')),
        controls: controls.map((control) => ({
          value: control.value,
          checked: 'checked' in control ? control.checked : undefined,
        })),
      });
    }
    disconnect = observeReset(document, {
      belongsTo: (form) => {
        const ownerId = host.getAttribute('form');
        const owner = ownerId ? document.getElementById(ownerId) : host.closest('form');
        return owner === form || controlsFor(host).some((control) => control.form === form);
      },
      reset: () => {
        const initial = initialValues.get(host);
        if (!initial) return;
        Reflect.set(host, 'value', copyValue(initial.value));
        controlsFor(host).forEach((control, index) => {
          const state = initial.controls[index];
          if (!state || control.type === 'file') return;
          control.value = state.value;
          if ('checked' in control && state.checked !== undefined) control.checked = state.checked;
        });
      },
    });
  });
  return () => {
    active = false;
    disconnect?.();
  };
}

export function syncNodeChildren(parent: Node & ParentNode, children: readonly Node[]): boolean {
  const currentChildren = Array.from(parent.childNodes);

  if (currentChildren.length === children.length) {
    const hasChanges = children.some((child, index) => currentChildren[index] !== child);

    if (!hasChanges) {
      return false;
    }
  }

  const desiredChildren = new Set(children);

  currentChildren.forEach((child) => {
    if (!desiredChildren.has(child)) {
      parent.removeChild(child);
    }
  });

  let referenceNode = parent.firstChild;

  children.forEach((child) => {
    if (referenceNode === child) {
      referenceNode = referenceNode.nextSibling;
      return;
    }

    parent.insertBefore(child, referenceNode);
    referenceNode = child.nextSibling;
  });

  return true;
}

export function renderCustomElement(element: Node | null | undefined): void {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const maybeRenderableElement = element as HTMLElement & { render?: () => void };

  if (typeof maybeRenderableElement.render === 'function') {
    maybeRenderableElement.render();
  }
}

export function isCustomElementNode(node: Node | null): node is HTMLElement {
  return node instanceof HTMLElement && node.tagName.includes('-');
}

/** Replay pre-upgrade own properties through the component's public setters. */
export function upgradeCustomElementProperties(element: HTMLElement): void {
  let prototype: object | null = Object.getPrototypeOf(element) as object | null;
  const values = new Map<string, unknown>();
  while (prototype && prototype !== HTMLElement.prototype) {
    for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(prototype))) {
      if (descriptor.set && Object.hasOwn(element, name) && !values.has(name)) {
        values.set(name, Reflect.get(element, name));
        Reflect.deleteProperty(element, name);
      }
    }
    prototype = Object.getPrototypeOf(prototype) as object | null;
  }
  for (const [name, value] of values) Reflect.set(element, name, value);
}

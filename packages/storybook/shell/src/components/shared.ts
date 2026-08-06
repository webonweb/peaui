export type StoryRenderable =
  | Node
  | string
  | number
  | null
  | undefined
  | StoryRenderable[];

export type StoryTableSummary = {
  summary?: unknown;
};

export type StoryPropTable = {
  defaultValue?: StoryTableSummary | string;
  required?: boolean;
  type?: StoryTableSummary | string;
};

export type StoryPropItem = {
  control?: boolean | string | { type?: string };
  description?: string;
  options?: unknown[];
  prop?: string;
  table?: StoryPropTable;
  [key: string]: unknown;
};

export type StoryContentSettings = {
  category?: string;
  code?: string;
  darkmode?: boolean;
  description?: string;
  language?: string;
  name?: string;
  props?: StoryPropItem[];
  resize?: boolean;
  [key: string]: unknown;
};

const FALSEY_ATTRIBUTE_VALUES = new Set(["false", "0", "no", "off"]);

export function defineCustomElement(
  tagName: string,
  constructor: CustomElementConstructor
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.customElements.get(tagName)) {
    window.customElements.define(tagName, constructor);
  }
}

export function ensureShadowRoot(element: HTMLElement): ShadowRoot {
  return element.shadowRoot ?? element.attachShadow({ mode: "open" });
}

export function setShadowContent(
  element: HTMLElement,
  styles: string,
  markup: string
): ShadowRoot {
  const shadowRoot = ensureShadowRoot(element);

  shadowRoot.innerHTML = `<style>${styles}</style>${markup}`;

  return shadowRoot;
}

export function appendRenderable(target: Node, value: StoryRenderable): void {
  if (value === null || value === undefined) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      appendRenderable(target, item);
    }

    return;
  }

  if (value instanceof Node) {
    target.appendChild(value);
    return;
  }

  target.appendChild(document.createTextNode(String(value)));
}

export function replaceRenderableChildren(
  target: Element,
  value: StoryRenderable
): void {
  target.replaceChildren();
  appendRenderable(target, value);
}

export function getStringAttribute(
  element: HTMLElement,
  name: string,
  fallback = ""
): string {
  return element.getAttribute(name) ?? fallback;
}

export function setStringAttribute(
  element: HTMLElement,
  name: string,
  value: string | null | undefined
): void {
  const normalizedValue = `${value ?? ""}`.trim();

  if (!normalizedValue) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
}

export function getBooleanAttribute(
  element: HTMLElement,
  name: string,
  fallback = false
): boolean {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const normalizedValue = `${element.getAttribute(name) ?? ""}`
    .trim()
    .toLowerCase();

  if (!normalizedValue) {
    return true;
  }

  return !FALSEY_ATTRIBUTE_VALUES.has(normalizedValue);
}

export function setBooleanAttribute(
  element: HTMLElement,
  name: string,
  value: boolean
): void {
  if (value) {
    element.setAttribute(name, "true");
    return;
  }

  element.removeAttribute(name);
}

export function toSummaryText(value: unknown, fallback = "---"): string {
  if (typeof value === "string") {
    return value || fallback;
  }

  if (value && typeof value === "object" && "summary" in value) {
    const summaryValue = (value as StoryTableSummary).summary;

    if (
      summaryValue === null ||
      summaryValue === undefined ||
      summaryValue === ""
    ) {
      return fallback;
    }

    return String(summaryValue);
  }

  return fallback;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

export function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

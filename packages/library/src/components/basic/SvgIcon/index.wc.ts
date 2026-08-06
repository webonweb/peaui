import { UIKIT_NAME } from '@/constants';

const SVG_ICON_TAG_NAME = `${UIKIT_NAME}-svg-icon`;
const SVG_ICON_CLASS_NAME = `${UIKIT_NAME}-svg-icon`;
const NON_FORWARDED_ATTRIBUTES = new Set(['name', 'data-testid', 'id', 'class']);

type IconLoader = () => Promise<string>;
// Vite transforms only a direct `import.meta.glob` call. The type-aware ESLint
// parser cannot resolve this compiler macro, although Vite and vue-tsc can.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const ICON_LOADERS = import.meta.glob<string>('../../../assets/icons/*.svg', {
  import: 'default',
  query: '?raw',
});

let nextIconId = 0;

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

function setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  const normalizedValue = getNormalizedAttributeValue(value);

  if (normalizedValue === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
}

function getIconLoader(name: string): IconLoader | undefined {
  const loader = ICON_LOADERS[`../../../assets/icons/${name}.svg`] as unknown;

  return typeof loader === 'function' ? (loader as IconLoader) : undefined;
}

function createSvgElement(markup: string): SVGSVGElement | null {
  const template = document.createElement('template');

  template.innerHTML = markup.trim();

  const svg = template.content.querySelector('svg');

  return svg ? (svg.cloneNode(true) as SVGSVGElement) : null;
}

function getNextIconId(): string {
  nextIconId += 1;

  return `${SVG_ICON_TAG_NAME}-${nextIconId}`;
}

export class SvgIconElement extends HTMLElement {
  static readonly tagName = SVG_ICON_TAG_NAME;

  #iconId = getNextIconId();
  #currentIconName?: string;
  #managedForwardedAttributes = new Set<string>();
  #mutationObserver?: MutationObserver;
  #renderedSvg: SVGSVGElement | null = null;
  #renderVersion = 0;

  connectedCallback(): void {
    if (!this.#mutationObserver) {
      this.#mutationObserver = new MutationObserver(() => {
        void this.render();
      });
      this.#mutationObserver.observe(this, {
        attributes: true,
      });
    }

    void this.render();
  }

  disconnectedCallback(): void {
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = undefined;
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }

  set name(value: string) {
    setStringAttribute(this, 'name', value);
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  async render(): Promise<void> {
    const iconName = getNormalizedAttributeValue(this.name);

    if (!iconName) {
      this.#renderVersion += 1;
      this.#currentIconName = undefined;
      this.#renderedSvg = null;
      this.replaceChildren();
      return;
    }

    if (!this.#renderedSvg || this.#currentIconName !== iconName) {
      await this.#loadIcon(iconName);
      return;
    }

    this.#syncSvgAttributes();
  }

  async #loadIcon(name: string): Promise<void> {
    const loader = getIconLoader(name);

    this.#renderVersion += 1;
    const renderVersion = this.#renderVersion;

    if (!loader) {
      if (renderVersion === this.#renderVersion) {
        this.#currentIconName = undefined;
        this.#renderedSvg = null;
        this.replaceChildren();
      }

      return;
    }

    const markup = await loader().catch(() => undefined);

    if (
      !markup ||
      !this.isConnected ||
      renderVersion !== this.#renderVersion ||
      getNormalizedAttributeValue(this.name) !== name
    ) {
      return;
    }

    const svg = createSvgElement(markup);

    if (!svg) {
      this.#currentIconName = undefined;
      this.#renderedSvg = null;
      this.replaceChildren();
      return;
    }

    this.#currentIconName = name;
    this.#renderedSvg = svg;
    this.replaceChildren(svg);
    this.#syncSvgAttributes();
  }

  #syncSvgAttributes(): void {
    if (!this.#renderedSvg) {
      return;
    }

    const forwardedAttributes = new Map<string, string>();

    for (const attribute of Array.from(this.attributes)) {
      if (NON_FORWARDED_ATTRIBUTES.has(attribute.name)) {
        continue;
      }

      forwardedAttributes.set(attribute.name, attribute.value);
    }

    if (!forwardedAttributes.has('aria-hidden')) {
      forwardedAttributes.set('aria-hidden', 'true');
    }

    if (!forwardedAttributes.has('focusable')) {
      forwardedAttributes.set('focusable', 'false');
    }

    for (const name of this.#managedForwardedAttributes) {
      if (!forwardedAttributes.has(name)) {
        this.#renderedSvg.removeAttribute(name);
      }
    }

    for (const [name, value] of forwardedAttributes) {
      this.#renderedSvg.setAttribute(name, value);
    }

    this.#managedForwardedAttributes = new Set(forwardedAttributes.keys());

    const externalClassName = getNormalizedAttributeValue(this.getAttribute('class'));
    const className = externalClassName
      ? `${SVG_ICON_CLASS_NAME} ${externalClassName}`
      : SVG_ICON_CLASS_NAME;

    this.#renderedSvg.setAttribute('class', className);
    this.#renderedSvg.setAttribute('id', this.#iconId);

    const dataTestId = this.dataTestId;

    if (dataTestId) {
      this.#renderedSvg.setAttribute('data-testid', dataTestId);
    } else {
      this.#renderedSvg.removeAttribute('data-testid');
    }
  }
}

export function defineSvgIcon(): typeof SvgIconElement {
  if (typeof window !== 'undefined' && !window.customElements.get(SVG_ICON_TAG_NAME)) {
    window.customElements.define(SVG_ICON_TAG_NAME, SvgIconElement);
  }

  return SvgIconElement;
}

defineSvgIcon();

export default SvgIconElement;

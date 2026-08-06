import { SvgIconElement, defineSvgIcon } from '@/components/basic/SvgIcon/index.wc';
import { UIKIT_NAME } from '@/constants';
import { syncNodeChildren } from '@/helpers/dom.helper';

const MESSAGE_TEXT_TAG_NAME = `${UIKIT_NAME}-message-text`;
const MESSAGE_TEXT_CLASS_NAME = `${UIKIT_NAME}-message-text`;
const SIZE_VALUES = [
  'xxs',
  'xs',
  's',
  'm',
  'l',
  'xl',
  'heading-xs',
  'heading-s',
  'heading-m',
  'heading-l',
] as const;
const VARIANT_VALUES = ['info', 'error', 'success', 'danger', 'default', 'white'] as const;
const BUILTIN_ICON_VARIANTS = new Set(['info', 'error', 'success', 'danger']);
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);
const BUILTIN_ICON_PATHS = {
  info: 'M6.66667 6C6.48986 6 6.32029 6.07024 6.19527 6.19526C6.07024 6.32029 6 6.48986 6 6.66667V9.33333C6 9.51014 6.07024 9.67971 6.19527 9.80474C6.32029 9.92976 6.48986 10 6.66667 10C6.84348 10 7.01305 9.92976 7.13807 9.80474C7.2631 9.67971 7.33334 9.51014 7.33334 9.33333V6.66667C7.33334 6.48986 7.2631 6.32029 7.13807 6.19526C7.01305 6.07024 6.84348 6 6.66667 6ZM6.92 3.38667C6.7577 3.31999 6.57564 3.31999 6.41334 3.38667C6.3315 3.4184 6.25674 3.46597 6.19334 3.52667C6.13445 3.59147 6.0871 3.66588 6.05334 3.74667C6.01602 3.82579 5.99775 3.91255 6 4C5.9995 4.08774 6.01631 4.17471 6.04949 4.25594C6.08267 4.33716 6.13155 4.41104 6.19334 4.47333C6.25814 4.53222 6.33255 4.57957 6.41334 4.61333C6.51434 4.65483 6.62398 4.67088 6.73263 4.66007C6.84129 4.64927 6.94563 4.61195 7.03648 4.55138C7.12733 4.49081 7.20191 4.40886 7.25368 4.31271C7.30544 4.21657 7.33279 4.10919 7.33334 4C7.33088 3.82349 7.26183 3.65442 7.14 3.52667C7.0766 3.46597 7.00184 3.4184 6.92 3.38667ZM6.66667 0C5.34813 0 4.0592 0.390993 2.96287 1.12354C1.86654 1.85608 1.01206 2.89727 0.507473 4.11544C0.00288856 5.33362 -0.129134 6.67406 0.128101 7.96727C0.385336 9.26047 1.02027 10.4484 1.95262 11.3807C2.88497 12.3131 4.07286 12.948 5.36607 13.2052C6.65927 13.4625 7.99972 13.3304 9.21789 12.8259C10.4361 12.3213 11.4773 11.4668 12.2098 10.3705C12.9423 9.27414 13.3333 7.98521 13.3333 6.66667C13.3333 5.79119 13.1609 4.92428 12.8259 4.11544C12.4908 3.30661 11.9998 2.57168 11.3807 1.95262C10.7617 1.33356 10.0267 0.842501 9.21789 0.50747C8.40906 0.172438 7.54215 0 6.66667 0V0ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1012C2.82657 10.5151 2.14298 9.68218 1.73931 8.70764C1.33565 7.73311 1.23003 6.66075 1.43582 5.62618C1.6416 4.59162 2.14955 3.64131 2.89543 2.89543C3.64131 2.14955 4.59162 1.6416 5.62619 1.43581C6.66075 1.23002 7.73311 1.33564 8.70765 1.73931C9.68219 2.14298 10.5151 2.82656 11.1012 3.70363C11.6872 4.58069 12 5.61183 12 6.66667C12 8.08115 11.4381 9.43771 10.4379 10.4379C9.43771 11.4381 8.08116 12 6.66667 12V12Z',
  error:
    'M6.66667 3.33333C6.48986 3.33333 6.32029 3.40357 6.19527 3.5286C6.07024 3.65362 6 3.82319 6 4V6.66667C6 6.84348 6.07024 7.01305 6.19527 7.13807C6.32029 7.26309 6.48986 7.33333 6.66667 7.33333C6.84348 7.33333 7.01305 7.26309 7.13807 7.13807C7.2631 7.01305 7.33334 6.84348 7.33334 6.66667V4C7.33334 3.82319 7.2631 3.65362 7.13807 3.5286C7.01305 3.40357 6.84348 3.33333 6.66667 3.33333ZM7.28 9.08C7.26541 9.03752 7.24523 8.99716 7.22 8.96L7.14 8.86C7.04625 8.76749 6.92721 8.70483 6.79788 8.67991C6.66855 8.655 6.53474 8.66895 6.41334 8.72C6.33255 8.75376 6.25814 8.80111 6.19334 8.86C6.13155 8.92229 6.08267 8.99617 6.04949 9.0774C6.01631 9.15862 5.9995 9.2456 6 9.33333C6.00106 9.42045 6.01918 9.50652 6.05334 9.58667C6.08328 9.6694 6.13105 9.74453 6.19326 9.80674C6.25547 9.86896 6.33061 9.91672 6.41334 9.94667C6.49314 9.98194 6.57942 10.0002 6.66667 10.0002C6.75392 10.0002 6.8402 9.98194 6.92 9.94667C7.00273 9.91672 7.07787 9.86896 7.14008 9.80674C7.20229 9.74453 7.25006 9.6694 7.28 9.58667C7.31416 9.50652 7.33228 9.42045 7.33334 9.33333C7.33661 9.28895 7.33661 9.24438 7.33334 9.2C7.32186 9.15749 7.30387 9.11701 7.28 9.08V9.08ZM6.66667 0C5.34813 0 4.0592 0.390993 2.96287 1.12354C1.86654 1.85608 1.01206 2.89727 0.507473 4.11544C0.00288856 5.33362 -0.129134 6.67406 0.128101 7.96727C0.385336 9.26047 1.02027 10.4484 1.95262 11.3807C2.88497 12.3131 4.07286 12.948 5.36607 13.2052C6.65927 13.4625 7.99972 13.3304 9.21789 12.8259C10.4361 12.3213 11.4773 11.4668 12.2098 10.3705C12.9423 9.27414 13.3333 7.98521 13.3333 6.66667C13.3333 5.79119 13.1609 4.92428 12.8259 4.11544C12.4908 3.30661 11.9998 2.57168 11.3807 1.95262C10.7617 1.33356 10.0267 0.842501 9.21789 0.50747C8.40906 0.172438 7.54215 0 6.66667 0V0ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1012C2.82657 10.5151 2.14298 9.68218 1.73931 8.70764C1.33565 7.73311 1.23003 6.66075 1.43582 5.62618C1.6416 4.59162 2.14955 3.64131 2.89543 2.89543C3.64131 2.14955 4.59162 1.6416 5.62619 1.43581C6.66075 1.23002 7.73311 1.33564 8.70765 1.73931C9.68219 2.14298 10.5151 2.82656 11.1012 3.70363C11.6872 4.58069 12 5.61183 12 6.66667C12 8.08115 11.4381 9.43771 10.4379 10.4379C9.43771 11.4381 8.08116 12 6.66667 12V12Z',
  success:
    'M8.48 4.52667L5.62 7.39333L4.52 6.29333C4.46024 6.22354 4.38669 6.16686 4.30398 6.12685C4.22127 6.08683 4.13118 6.06435 4.03937 6.0608C3.94756 6.05725 3.856 6.07273 3.77045 6.10624C3.6849 6.13976 3.60721 6.1906 3.54224 6.25557C3.47727 6.32054 3.42643 6.39823 3.39291 6.48378C3.35939 6.56933 3.34392 6.66089 3.34747 6.7527C3.35102 6.84451 3.3735 6.9346 3.41352 7.01731C3.45353 7.10002 3.51022 7.17357 3.58 7.23333L5.14667 8.80667C5.20896 8.86845 5.28284 8.91734 5.36407 8.95051C5.44529 8.98369 5.53227 9.00051 5.62 9C5.7949 8.99926 5.9625 8.92983 6.08667 8.80667L9.42 5.47333C9.48249 5.41136 9.53209 5.33762 9.56593 5.25638C9.59978 5.17514 9.6172 5.08801 9.6172 5C9.6172 4.91199 9.59978 4.82485 9.56593 4.74362C9.53209 4.66238 9.48249 4.58864 9.42 4.52667C9.29509 4.4025 9.12613 4.3328 8.95 4.3328C8.77388 4.3328 8.60491 4.4025 8.48 4.52667ZM6.66667 0C5.34813 0 4.0592 0.390993 2.96287 1.12354C1.86654 1.85608 1.01206 2.89727 0.507473 4.11544C0.00288856 5.33362 -0.129134 6.67406 0.128101 7.96727C0.385336 9.26047 1.02027 10.4484 1.95262 11.3807C2.88497 12.3131 4.07286 12.948 5.36607 13.2052C6.65927 13.4625 7.99972 13.3304 9.21789 12.8259C10.4361 12.3213 11.4773 11.4668 12.2098 10.3705C12.9423 9.27414 13.3333 7.98521 13.3333 6.66667C13.3333 5.79119 13.1609 4.92428 12.8259 4.11544C12.4908 3.30661 11.9998 2.57168 11.3807 1.95262C10.7617 1.33356 10.0267 0.842501 9.21789 0.50747C8.40906 0.172438 7.54215 0 6.66667 0V0ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1012C2.82657 10.5151 2.14298 9.68218 1.73931 8.70764C1.33565 7.73311 1.23003 6.66075 1.43582 5.62618C1.6416 4.59162 2.14955 3.64131 2.89543 2.89543C3.64131 2.14955 4.59162 1.6416 5.62619 1.43581C6.66075 1.23002 7.73311 1.33564 8.70765 1.73931C9.68219 2.14298 10.5151 2.82656 11.1012 3.70363C11.6872 4.58069 12 5.61183 12 6.66667C12 8.08115 11.4381 9.43771 10.4379 10.4379C9.43771 11.4381 8.08116 12 6.66667 12V12Z',
  danger:
    'M6.19334 8.86C6.16467 8.89168 6.13795 8.92507 6.11334 8.96C6.08811 8.99716 6.06793 9.03752 6.05334 9.08C6.03412 9.11779 6.02063 9.15823 6.01334 9.2C6.01006 9.24438 6.01006 9.28895 6.01334 9.33333C6.01108 9.42078 6.02935 9.50755 6.06667 9.58667C6.09661 9.6694 6.14438 9.74453 6.20659 9.80674C6.26881 9.86896 6.34394 9.91672 6.42667 9.94667C6.50647 9.98194 6.59276 10.0002 6.68 10.0002C6.76725 10.0002 6.85354 9.98194 6.93334 9.94667C7.01607 9.91672 7.0912 9.86896 7.15341 9.80674C7.21563 9.74453 7.2634 9.6694 7.29334 9.58667C7.32294 9.50561 7.33653 9.41957 7.33334 9.33333C7.33384 9.2456 7.31703 9.15862 7.28385 9.0774C7.25067 8.99617 7.20179 8.92229 7.14 8.86C7.07803 8.79751 7.00429 8.74792 6.92305 8.71407C6.84182 8.68023 6.75468 8.6628 6.66667 8.6628C6.57866 8.6628 6.49153 8.68023 6.41029 8.71407C6.32905 8.74792 6.25531 8.79751 6.19334 8.86ZM6.66667 0C5.34813 0 4.0592 0.390993 2.96287 1.12354C1.86654 1.85608 1.01206 2.89727 0.507473 4.11544C0.00288856 5.33362 -0.129134 6.67406 0.128101 7.96727C0.385336 9.26047 1.02027 10.4484 1.95262 11.3807C2.88497 12.3131 4.07286 12.948 5.36607 13.2052C6.65927 13.4625 7.99972 13.3304 9.21789 12.8259C10.4361 12.3213 11.4773 11.4668 12.2098 10.3705C12.9423 9.27414 13.3333 7.98521 13.3333 6.66667C13.3333 5.79119 13.1609 4.92428 12.8259 4.11544C12.4908 3.30661 11.9998 2.57168 11.3807 1.95262C10.7617 1.33356 10.0267 0.842501 9.21789 0.50747C8.40906 0.172438 7.54215 0 6.66667 0V0ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1012C2.82657 10.5151 2.14298 9.68218 1.73931 8.70764C1.33565 7.73311 1.23003 6.66075 1.43582 5.62618C1.6416 4.59162 2.14955 3.64131 2.89543 2.89543C3.64131 2.14955 4.59162 1.6416 5.62619 1.43581C6.66075 1.23002 7.73311 1.33564 8.70765 1.73931C9.68219 2.14298 10.5151 2.82656 11.1012 3.70363C11.6872 4.58069 12 5.61183 12 6.66667C12 8.08115 11.4381 9.43771 10.4379 10.4379C9.43771 11.4381 8.08116 12 6.66667 12V12ZM6.66667 3.33333C6.31538 3.33311 5.97023 3.42541 5.66594 3.60096C5.36166 3.77651 5.10898 4.02911 4.93334 4.33333C4.8851 4.40921 4.85271 4.49406 4.83812 4.58278C4.82353 4.6715 4.82703 4.76226 4.84842 4.84959C4.86981 4.93692 4.90865 5.01902 4.96259 5.09096C5.01654 5.16289 5.08447 5.22317 5.16232 5.26816C5.24016 5.31316 5.3263 5.34194 5.41556 5.35279C5.50482 5.36363 5.59534 5.3563 5.68169 5.33125C5.76805 5.3062 5.84844 5.26394 5.91804 5.20701C5.98763 5.15009 6.04499 5.07967 6.08667 5C6.14541 4.89826 6.22998 4.81385 6.33183 4.75532C6.43369 4.69678 6.5492 4.6662 6.66667 4.66667C6.84348 4.66667 7.01305 4.7369 7.13807 4.86193C7.2631 4.98695 7.33334 5.15652 7.33334 5.33333C7.33334 5.51014 7.2631 5.67971 7.13807 5.80474C7.01305 5.92976 6.84348 6 6.66667 6C6.48986 6 6.32029 6.07024 6.19527 6.19526C6.07024 6.32029 6 6.48986 6 6.66667V7.33333C6 7.51014 6.07024 7.67971 6.19527 7.80474C6.32029 7.92976 6.48986 8 6.66667 8C6.84348 8 7.01305 7.92976 7.13807 7.80474C7.2631 7.67971 7.33334 7.51014 7.33334 7.33333V7.21333C7.77425 7.05335 8.14491 6.74348 8.38052 6.33791C8.61613 5.93234 8.7017 5.45686 8.62227 4.99459C8.54284 4.53233 8.30347 4.11268 7.946 3.80901C7.58853 3.50534 7.1357 3.33697 6.66667 3.33333V3.33333Z',
} as const;

type MessageTextSize = (typeof SIZE_VALUES)[number];
type MessageTextVariant = (typeof VARIANT_VALUES)[number];

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

function getBooleanAttributeValue(element: HTMLElement, name: string, fallback = false): boolean {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const normalizedValue = `${element.getAttribute(name) ?? ''}`.trim().toLowerCase();

  if (!normalizedValue) {
    return true;
  }

  return !FALSEY_ATTRIBUTE_VALUES.has(normalizedValue);
}

function getEnumAttributeValue<T extends readonly string[]>(
  element: HTMLElement,
  name: string,
  allowedValues: T,
  fallback: T[number],
): T[number] {
  const value = element.getAttribute(name);

  if (value !== null && (allowedValues as readonly string[]).includes(value)) {
    return value;
  }

  return fallback;
}

function setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  const normalizedValue = getNormalizedAttributeValue(value);

  if (normalizedValue === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
}

function normalizeNodes(nodes: Node[]): Node[] {
  return nodes.filter((node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return Boolean(node.textContent?.trim());
    }

    return true;
  });
}

function createBuiltInIcon(
  variant: Exclude<MessageTextVariant, 'default' | 'white'>,
): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  svg.setAttribute('class', `${MESSAGE_TEXT_CLASS_NAME}__icon`);
  svg.setAttribute('viewBox', '0 0 14 14');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  path.setAttribute('d', BUILTIN_ICON_PATHS[variant]);

  if (variant === 'success') {
    path.setAttribute('fill', '#10893C');
  }

  svg.appendChild(path);

  return svg;
}

defineSvgIcon();

export class MessageTextElement extends HTMLElement {
  static readonly tagName = MESSAGE_TEXT_TAG_NAME;

  static get observedAttributes(): string[] {
    return ['id', 'data-testid', 'variant', 'size', 'with-icon', 'own-icon'];
  }

  #contentElement = document.createElement('p');
  #contentNodes: Node[] = [];
  #iconElement: SVGSVGElement | SvgIconElement | null = null;
  #isMounted = false;
  #isSyncingDom = false;
  #mutationObserver: MutationObserver | null = null;
  #rootElement = document.createElement('div');

  connectedCallback(): void {
    if (this.#isMounted) {
      this.render();
      return;
    }

    this.#isMounted = true;
    this.#setupObserver();
    this.#collectExternalNodes();
    this.render();
  }

  disconnectedCallback(): void {
    this.#isMounted = false;
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
  }

  attributeChangedCallback(): void {
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    this.render();
  }

  get variant(): MessageTextVariant {
    return getEnumAttributeValue(this, 'variant', VARIANT_VALUES, 'default');
  }

  set variant(value: MessageTextVariant) {
    this.setAttribute('variant', value);
  }

  get size(): MessageTextSize {
    return getEnumAttributeValue(this, 'size', SIZE_VALUES, 's');
  }

  set size(value: MessageTextSize) {
    this.setAttribute('size', value);
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  get withIcon(): boolean {
    return getBooleanAttributeValue(this, 'with-icon', true);
  }

  set withIcon(value: boolean) {
    if (value) {
      this.setAttribute('with-icon', 'true');
      return;
    }

    this.setAttribute('with-icon', 'false');
  }

  get ownIcon(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('own-icon'));
  }

  set ownIcon(value: string | null | undefined) {
    setStringAttribute(this, 'own-icon', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncRoot();
      this.#syncIcon();
      this.#syncChildren();
      this.#syncContent();
    });
  }

  #withDomSync<T>(callback: () => T): T {
    const wasSyncingDom = this.#isSyncingDom;

    this.#isSyncingDom = true;

    try {
      return callback();
    } finally {
      this.#isSyncingDom = wasSyncingDom;
    }
  }

  #setupObserver(): void {
    if (this.#mutationObserver) {
      return;
    }

    this.#mutationObserver = new MutationObserver((records) => {
      if (this.#isSyncingDom || this.#shouldIgnoreMutations(records)) {
        return;
      }

      this.#collectExternalNodes();
      this.render();
    });

    this.#mutationObserver.observe(this, {
      childList: true,
    });
  }

  #shouldIgnoreMutations(records: MutationRecord[]): boolean {
    if (records.length === 0) {
      return false;
    }

    return records.every((record) => {
      const changedNodes: Node[] = [
        ...Array.from(record.addedNodes),
        ...Array.from(record.removedNodes),
      ];

      return (
        record.target === this &&
        changedNodes.length > 0 &&
        changedNodes.every(
          (node) => node === this.#rootElement || this.#contentNodes.includes(node),
        )
      );
    });
  }

  #collectExternalNodes(): void {
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => node !== this.#rootElement),
    );
    const sourceNodes = normalizeNodes(
      Array.from(new Set([...directNodes, ...this.#contentNodes])).filter(
        (node) => directNodes.includes(node) || this.contains(node),
      ),
    );

    this.#contentNodes = sourceNodes;
  }

  #syncRoot(): void {
    this.#rootElement.className = [
      MESSAGE_TEXT_CLASS_NAME,
      `${MESSAGE_TEXT_CLASS_NAME}--size-${this.size}`,
      `${MESSAGE_TEXT_CLASS_NAME}--variant-${this.variant}`,
    ].join(' ');

    const rootId = getNormalizedAttributeValue(this.id);

    if (rootId) {
      this.#rootElement.id = `${rootId}-${this.variant}`;
    } else {
      this.#rootElement.removeAttribute('id');
    }

    if (this.dataTestId) {
      this.#rootElement.setAttribute('data-testid', this.dataTestId);
    } else {
      this.#rootElement.removeAttribute('data-testid');
    }

    if (this.#rootElement.parentNode !== this) {
      this.appendChild(this.#rootElement);
    }
  }

  #syncIcon(): void {
    const ownIcon = this.ownIcon;

    if (ownIcon) {
      const icon =
        this.#iconElement instanceof SvgIconElement
          ? this.#iconElement
          : (document.createElement(SvgIconElement.tagName) as SvgIconElement);

      icon.name = ownIcon;
      icon.dataTestId = this.#iconTestId;
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      icon.setAttribute(
        'class',
        `${MESSAGE_TEXT_CLASS_NAME}__icon-own ${MESSAGE_TEXT_CLASS_NAME}__icon-own--variant-${this.variant}`,
      );
      this.#iconElement = icon;
      return;
    }

    if (this.#showVariantIcon) {
      const icon = createBuiltInIcon(
        this.variant as Exclude<MessageTextVariant, 'default' | 'white'>,
      );

      if (this.#iconTestId) {
        icon.setAttribute('data-testid', this.#iconTestId);
      } else {
        icon.removeAttribute('data-testid');
      }

      this.#iconElement = icon;
      return;
    }

    this.#iconElement = null;
  }

  #syncContent(): void {
    this.#contentElement.className = `${MESSAGE_TEXT_CLASS_NAME}__content`;

    if (this.#textTestId) {
      this.#contentElement.setAttribute('data-testid', this.#textTestId);
    } else {
      this.#contentElement.removeAttribute('data-testid');
    }

    syncNodeChildren(this.#contentElement, this.#contentNodes);
  }

  #syncChildren(): void {
    const children: Node[] = [];

    if (this.#iconElement) {
      children.push(this.#iconElement);
    }

    children.push(this.#contentElement);
    syncNodeChildren(this.#rootElement, children);
  }

  get #iconTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-icon` : undefined;
  }

  get #textTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-title` : undefined;
  }

  get #showVariantIcon(): boolean {
    return this.withIcon && !this.ownIcon && BUILTIN_ICON_VARIANTS.has(this.variant);
  }
}

export function defineMessageText(): typeof MessageTextElement {
  if (typeof window !== 'undefined' && !window.customElements.get(MESSAGE_TEXT_TAG_NAME)) {
    window.customElements.define(MESSAGE_TEXT_TAG_NAME, MessageTextElement);
  }

  return MessageTextElement;
}

defineMessageText();

export default MessageTextElement;

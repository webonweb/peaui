import { SvgIconElement, defineSvgIcon } from '@/components/basic/SvgIcon/index.wc';
import { UIKIT_NAME } from '@/constants';
import { syncNodeChildren } from '@/helpers/dom.helper';

import { getAvatarInitials, normalizeAvatarInitials } from './avatar.helper';

type AvatarLoading = 'eager' | 'lazy';
type AvatarShape = 'circle' | 'rounded';
type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

const TAG_NAME = `${UIKIT_NAME}-avatar`;
const CLASS_NAME = `${UIKIT_NAME}-avatar`;
const STATUS_LABELS: Readonly<Record<Exclude<AvatarStatus, 'none'>, string>> = {
  away: 'Zaraz wracam',
  busy: 'Zajęty',
  offline: 'Niedostępny',
  online: 'Dostępny',
};
let nextAvatarId = 0;

function normalizeText(value: unknown): string | undefined {
  const normalized = typeof value === 'string' ? value.trim() : '';

  return normalized || undefined;
}

function setOptionalAttribute(
  element: HTMLElement,
  name: string,
  value: string | null | undefined,
): void {
  if (value === undefined || value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean): void {
  if (value) element.setAttribute(name, '');
  else element.removeAttribute(name);
}

function mergeIds(...values: Array<string | undefined>): string | undefined {
  const ids = new Set(values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));

  return ids.size > 0 ? [...ids].join(' ') : undefined;
}

function normalizeNodes(nodes: Node[]): Node[] {
  return nodes.filter((node) => {
    if (node.nodeType === Node.COMMENT_NODE) return false;
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());

    return true;
  });
}

defineSvgIcon();

export class AvatarElement extends HTMLElement {
  static readonly tagName = TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'alt',
      'aria-describedby',
      'aria-label',
      'aria-labelledby',
      'class',
      'data-testid',
      'disabled',
      'fallback-icon',
      'initials',
      'interactive',
      'loading',
      'name',
      'role',
      'shape',
      'size',
      'src',
      'status',
      'status-label',
      'style',
    ];
  }

  #connected = false;
  #rendering = false;
  #observer: MutationObserver | null = null;
  #root: HTMLElement = document.createElement('span');
  #media = document.createElement('span');
  #fallback = document.createElement('span');
  #initialsElement = document.createElement('span');
  #iconWrapper = document.createElement('span');
  #icon = document.createElement(SvgIconElement.tagName) as SvgIconElement;
  #statusElement = document.createElement('span');
  #statusLabelElement = document.createElement('span');
  #image: HTMLImageElement | null = null;
  #imageSource: string | undefined;
  #imageState: 'idle' | 'loading' | 'loaded' | 'error' = 'idle';
  #fallbackNodes: Node[] = [];
  #statusNodes: Node[] = [];
  readonly #statusId = `${CLASS_NAME}-status-${++nextAvatarId}`;

  connectedCallback(): void {
    if (this.#connected) {
      this.render();
      return;
    }

    this.#connected = true;
    this.#collectExternalNodes();
    this.render();
    this.#observe();
  }

  disconnectedCallback(): void {
    this.#connected = false;
    this.#observer?.disconnect();
    this.#observer = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (!this.#connected || oldValue === newValue || this.#rendering) return;

    if (name === 'src') this.#resetImage();
    this.render();
  }

  get src(): string | undefined {
    return normalizeText(this.getAttribute('src'));
  }
  set src(value: string | undefined) {
    setOptionalAttribute(this, 'src', value);
  }

  get alt(): string | undefined {
    return this.hasAttribute('alt') ? (this.getAttribute('alt') ?? '') : undefined;
  }
  set alt(value: string | undefined) {
    setOptionalAttribute(this, 'alt', value);
  }

  get name(): string | undefined {
    return normalizeText(this.getAttribute('name'));
  }
  set name(value: string | undefined) {
    setOptionalAttribute(this, 'name', value);
  }

  get initials(): string | undefined {
    return normalizeText(this.getAttribute('initials'));
  }
  set initials(value: string | undefined) {
    setOptionalAttribute(this, 'initials', value);
  }

  get size(): AvatarSize {
    return (normalizeText(this.getAttribute('size')) as AvatarSize | undefined) ?? 'm';
  }
  set size(value: AvatarSize) {
    setOptionalAttribute(this, 'size', value);
  }

  get shape(): AvatarShape {
    return (normalizeText(this.getAttribute('shape')) as AvatarShape | undefined) ?? 'circle';
  }
  set shape(value: AvatarShape) {
    setOptionalAttribute(this, 'shape', value);
  }

  get status(): AvatarStatus {
    return (normalizeText(this.getAttribute('status')) as AvatarStatus | undefined) ?? 'none';
  }
  set status(value: AvatarStatus) {
    setOptionalAttribute(this, 'status', value);
  }

  get statusLabel(): string | undefined {
    return normalizeText(this.getAttribute('status-label'));
  }
  set statusLabel(value: string | undefined) {
    setOptionalAttribute(this, 'status-label', value);
  }

  get loading(): AvatarLoading {
    return (normalizeText(this.getAttribute('loading')) as AvatarLoading | undefined) ?? 'lazy';
  }
  set loading(value: AvatarLoading) {
    setOptionalAttribute(this, 'loading', value);
  }

  get fallbackIcon(): string {
    return normalizeText(this.getAttribute('fallback-icon')) ?? 'users';
  }
  set fallbackIcon(value: string) {
    setOptionalAttribute(this, 'fallback-icon', value);
  }

  get interactive(): boolean {
    return this.hasAttribute('interactive');
  }
  set interactive(value: boolean) {
    setBooleanAttribute(this, 'interactive', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    setBooleanAttribute(this, 'disabled', value);
  }

  get ariaLabel(): string | null {
    return normalizeText(this.getAttribute('aria-label')) ?? null;
  }
  set ariaLabel(value: string | null) {
    setOptionalAttribute(this, 'aria-label', value);
  }

  get dataTestId(): string | undefined {
    return normalizeText(this.getAttribute('data-testid'));
  }
  set dataTestId(value: string | undefined) {
    setOptionalAttribute(this, 'data-testid', value);
  }

  render(): void {
    if (!this.#connected) return;

    this.#rendering = true;
    this.#observer?.disconnect();
    try {
      this.#collectExternalNodes();
      this.#syncImageSource();
      this.#syncRoot();
      this.#syncMedia();
      this.#syncStatus();
      syncNodeChildren(
        this.#root,
        [
          this.#media,
          this.#resolvedStatusLabel ? this.#statusElement : undefined,
          this.#resolvedStatusLabel ? this.#statusLabelElement : undefined,
        ].filter((node): node is HTMLElement => Boolean(node)),
      );
      if (this.#root.parentNode !== this) syncNodeChildren(this, [this.#root]);
    } finally {
      this.#rendering = false;
      this.#observe();
    }
  }

  #observe(): void {
    if (!this.#connected) return;
    this.#observer ??= new MutationObserver(() => {
      if (!this.#rendering) this.render();
    });
    this.#observer.observe(this, { childList: true });
  }

  #collectExternalNodes(): void {
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => node !== this.#root),
    );
    const sourceNodes = normalizeNodes(
      Array.from(new Set([...directNodes, ...this.#fallbackNodes, ...this.#statusNodes])).filter(
        (node) => directNodes.includes(node) || this.contains(node),
      ),
    );

    this.#fallbackNodes = sourceNodes.filter(
      (node) => !(node instanceof Element) || node.getAttribute('slot') !== 'status',
    );
    this.#statusNodes = sourceNodes.filter(
      (node) => node instanceof Element && node.getAttribute('slot') === 'status',
    );
  }

  #resetImage(): void {
    this.#image = null;
    this.#imageSource = undefined;
    this.#imageState = this.src ? 'loading' : 'idle';
  }

  #syncImageSource(): void {
    const source = this.src;
    if (source === this.#imageSource) return;

    this.#imageSource = source;
    this.#imageState = source ? 'loading' : 'idle';
    this.#image = source ? document.createElement('img') : null;
    if (!this.#image) return;

    this.#image.addEventListener('load', (event) => {
      this.#imageState = 'loaded';
      this.render();
      this.dispatchEvent(new CustomEvent('load', { detail: event }));
    });
    this.#image.addEventListener('error', (event) => {
      this.#imageState = 'error';
      this.render();
      this.dispatchEvent(new CustomEvent('error', { detail: event }));
    });
  }

  #syncRoot(): void {
    const tagName = this.interactive ? 'button' : 'span';
    if (this.#root.tagName.toLowerCase() !== tagName) {
      const previousRoot = this.#root;
      this.#root = document.createElement(tagName);
      previousRoot.replaceWith(this.#root);
    }

    this.#root.className = [
      CLASS_NAME,
      `${CLASS_NAME}--size-${this.size}`,
      `${CLASS_NAME}--shape-${this.shape}`,
      `${CLASS_NAME}--state-${this.#imageState}`,
      this.interactive ? `${CLASS_NAME}--interactive` : '',
      this.interactive && this.disabled ? `${CLASS_NAME}--disabled` : '',
      this.getAttribute('class') ?? '',
    ]
      .filter(Boolean)
      .join(' ');
    this.#root.setAttribute('data-state', this.#imageState);
    setOptionalAttribute(this.#root, 'data-testid', this.dataTestId);
    setOptionalAttribute(this.#root, 'style', this.getAttribute('style'));

    if (this.#root instanceof HTMLButtonElement) {
      this.#root.type = 'button';
      this.#root.disabled = this.disabled;
    }

    const rootUsesSemantics = this.interactive || (!this.#isDecorative && !this.#hasSemanticImage);
    const statusDescriptionId = this.#resolvedStatusLabel ? this.#statusId : undefined;
    setOptionalAttribute(
      this.#root,
      'role',
      this.interactive || !rootUsesSemantics
        ? undefined
        : (normalizeText(this.getAttribute('role')) ?? 'img'),
    );
    setOptionalAttribute(
      this.#root,
      'aria-label',
      rootUsesSemantics && !this.#isDecorative && !this.#ariaLabelledBy
        ? this.#accessibleName
        : undefined,
    );
    setOptionalAttribute(
      this.#root,
      'aria-labelledby',
      rootUsesSemantics && !this.#isDecorative ? this.#ariaLabelledBy : undefined,
    );
    setOptionalAttribute(
      this.#root,
      'aria-describedby',
      rootUsesSemantics && !this.#isDecorative
        ? mergeIds(this.#ariaDescribedBy, statusDescriptionId)
        : undefined,
    );
  }

  #syncMedia(): void {
    this.#media.className = `${CLASS_NAME}__media`;
    const imageVisible = this.#imageState === 'loaded' && Boolean(this.#imageSource);
    const mediaChildren: Node[] = [];

    if (this.#image && this.#imageState !== 'error' && this.#imageSource) {
      this.#image.src = this.#imageSource;
      this.#image.alt = this.#hasSemanticImage ? (this.alt ?? '') : '';
      this.#image.loading = this.loading;
      this.#image.decoding = 'async';
      this.#image.className = [
        `${CLASS_NAME}__image`,
        imageVisible ? `${CLASS_NAME}__image--visible` : '',
      ]
        .filter(Boolean)
        .join(' ');
      setOptionalAttribute(
        this.#image,
        'data-testid',
        this.dataTestId ? `${this.dataTestId}-image` : undefined,
      );
      setOptionalAttribute(this.#image, 'aria-hidden', this.#hasSemanticImage ? undefined : 'true');
      setOptionalAttribute(
        this.#image,
        'aria-describedby',
        this.#hasSemanticImage
          ? mergeIds(this.#ariaDescribedBy, this.#resolvedStatusLabel ? this.#statusId : undefined)
          : undefined,
      );
      setOptionalAttribute(
        this.#image,
        'role',
        this.#hasSemanticImage ? undefined : 'presentation',
      );
      mediaChildren.push(this.#image);
    }

    if (!imageVisible) {
      this.#fallback.className = `${CLASS_NAME}__fallback`;
      this.#fallback.setAttribute('aria-hidden', 'true');
      setOptionalAttribute(
        this.#fallback,
        'data-testid',
        this.dataTestId ? `${this.dataTestId}-fallback` : undefined,
      );

      if (this.#fallbackNodes.length > 0) {
        syncNodeChildren(this.#fallback, this.#fallbackNodes);
      } else if (this.#resolvedInitials) {
        this.#initialsElement.className = `${CLASS_NAME}__initials`;
        this.#initialsElement.textContent = this.#resolvedInitials;
        setOptionalAttribute(
          this.#initialsElement,
          'data-testid',
          this.dataTestId ? `${this.dataTestId}-initials` : undefined,
        );
        syncNodeChildren(this.#fallback, [this.#initialsElement]);
      } else {
        this.#iconWrapper.className = `${CLASS_NAME}__icon`;
        this.#icon.removeAttribute('class');
        this.#icon.name = this.fallbackIcon;
        this.#icon.dataTestId = this.dataTestId ? `${this.dataTestId}-icon` : undefined;
        syncNodeChildren(this.#iconWrapper, [this.#icon]);
        syncNodeChildren(this.#fallback, [this.#iconWrapper]);
      }
      mediaChildren.push(this.#fallback);
    }

    syncNodeChildren(this.#media, mediaChildren);
  }

  #syncStatus(): void {
    const label = this.#resolvedStatusLabel;
    if (!label) return;

    this.#statusElement.className = `${CLASS_NAME}__status ${CLASS_NAME}__status--${this.status}`;
    this.#statusElement.setAttribute('aria-hidden', 'true');
    setOptionalAttribute(
      this.#statusElement,
      'data-testid',
      this.dataTestId ? `${this.dataTestId}-status` : undefined,
    );
    syncNodeChildren(this.#statusElement, this.#statusNodes);

    this.#statusLabelElement.id = this.#statusId;
    this.#statusLabelElement.className = `${CLASS_NAME}__status-label`;
    this.#statusLabelElement.textContent = label;
    this.#statusLabelElement.removeAttribute('aria-live');
  }

  get #resolvedInitials(): string {
    return normalizeAvatarInitials(this.initials) || getAvatarInitials(this.name);
  }

  get #resolvedStatusLabel(): string | undefined {
    if (this.status === 'none') return undefined;

    return this.statusLabel ?? STATUS_LABELS[this.status];
  }

  get #ariaLabelledBy(): string | undefined {
    return normalizeText(this.getAttribute('aria-labelledby'));
  }

  get #ariaDescribedBy(): string | undefined {
    return normalizeText(this.getAttribute('aria-describedby'));
  }

  get #isDecorative(): boolean {
    return !this.interactive && this.alt === '' && !this.ariaLabel && !this.#ariaLabelledBy;
  }

  get #hasSemanticImage(): boolean {
    return (
      this.#imageState === 'loaded' &&
      !this.interactive &&
      Boolean(this.alt) &&
      !this.ariaLabel &&
      !this.#ariaLabelledBy
    );
  }

  get #accessibleName(): string {
    return (
      this.ariaLabel ?? this.alt ?? this.name ?? (this.#resolvedInitials || 'Awatar użytkownika')
    );
  }
}

export function defineAvatar(): typeof AvatarElement {
  if (typeof window !== 'undefined' && !window.customElements.get(TAG_NAME)) {
    window.customElements.define(TAG_NAME, AvatarElement);
  }

  return AvatarElement;
}

defineAvatar();

export default AvatarElement;

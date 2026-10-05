import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { UIKIT_NAME } from '@/constants';
import { isCustomElementNode, syncNodeChildren } from '@/helpers/dom.helper';

const INFO_TOOLTIP_TAG_NAME = `${UIKIT_NAME}-info-tooltip`;
const INFO_TOOLTIP_CLASS_NAME = `${UIKIT_NAME}-info-tooltip`;
const DEFAULT_TRIGGER_ARIA_LABEL = 'Pokaz dodatkowe informacje';
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);
const PLACEMENT_VALUES = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const;
const VARIANT_VALUES = ['default', 'disabled'] as const;
const FOCUSABLE_TRIGGER_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const MANAGED_TRIGGER_ANCESTOR_SELECTOR =
  'button, a[href], summary, [role="button"], [role="link"], [role="option"], [role="radio"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"]';
const MANAGED_HOST_ATTRIBUTE_NAMES = new Set(['role', 'tabindex']);

type Placement = (typeof PLACEMENT_VALUES)[number];
type Variant = (typeof VARIANT_VALUES)[number];

let nextTooltipId = 0;

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

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean) {
  if (value) {
    element.setAttribute(name, 'true');
    return;
  }

  element.removeAttribute(name);
}

function getNextTooltipId(): string {
  nextTooltipId += 1;

  return `info-tooltip-${nextTooltipId}`;
}

export class InfoTooltipElement extends HTMLElement {
  static readonly tagName = INFO_TOOLTIP_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'placement',
      'variant',
      'disabled',
      'data-test-id',
      'data-testid',
      'role',
      'tabindex',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
    ];
  }

  #tooltipId = getNextTooltipId();
  #tooltipElement = document.createElement('div');
  #titleElement = document.createElement('strong');
  #descriptionElement = document.createElement('p');
  #isMounted = false;
  #isSyncingDom = false;
  #layoutVersion = 0;
  #isTooltipVisible = false;
  #isTooltipHovered = false;
  #isTooltipFocused = false;
  #isTriggerHovered = false;
  #isTriggerFocused = false;
  #isOwnTriggerActivated = false;
  #isTemporarilyDismissed = false;
  #animationFrameId: number | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #mutationObserver: MutationObserver | null = null;
  #managedClasses = new Set<string>();
  #describedTriggerElements: HTMLElement[] = [];
  #hoverTriggerElement: HTMLElement | null = null;
  #focusTriggerElement: HTMLElement | null = null;
  #titleNodes: Node[] = [];
  #descriptionNodes: Node[] = [];
  #hasFocusableTriggerDescendant = false;
  #managedTriggerAncestor: HTMLElement | null = null;
  #explicitRole: string | undefined;
  #explicitTabindex: string | undefined;
  #explicitAriaLabel: string | undefined;
  #explicitAriaLabelledBy: string | undefined;
  #explicitAriaDescribedBy: string | undefined;
  #explicitForwardedTriggerTestId: string | undefined;
  #explicitBaseDataTestId: string | undefined;

  constructor() {
    super();

    this.addEventListener('click', this.#handleManagedTriggerClick);
    this.addEventListener('keydown', this.#handleManagedTriggerKeydown);
    this.addEventListener('keyup', this.#handleManagedTriggerKeyup);
    this.#tooltipElement.addEventListener('mouseenter', this.#handleTooltipMouseEnter);
    this.#tooltipElement.addEventListener('mouseleave', this.#handleTooltipMouseLeave);
    this.#tooltipElement.addEventListener('focusin', this.#handleTooltipFocusIn);
    this.#tooltipElement.addEventListener('focusout', this.#handleTooltipFocusOut);
  }

  connectedCallback(): void {
    upgradeCustomElementProperties(this);
    if (this.#isMounted) {
      this.render();
      return;
    }

    this.#isMounted = true;
    this.#syncExplicitAttributesFromDom();
    this.#setupObservers();
    this.render();
    this.#syncResizeObservation();
    window.addEventListener('resize', this.#handleViewportChange);
    window.visualViewport?.addEventListener('resize', this.#handleViewportChange);
    this.#scheduleInitialTooltipRefresh();
  }

  disconnectedCallback(): void {
    this.#withDomSync(() => {
      this.#isMounted = false;
      this.#setTooltipVisible(false);
      this.#describedTriggerElements.forEach((element) => {
        this.#removeTooltipDescriptionFromTrigger(element);
      });
      this.#describedTriggerElements = [];
      this.#hoverTriggerElement = this.#detachHoverListeners(this.#hoverTriggerElement);
      this.#focusTriggerElement = this.#detachFocusListeners(this.#focusTriggerElement);
      this.#managedTriggerAncestor = null;
      this.#hasFocusableTriggerDescendant = false;
      this.#resetVisibilityState();
      this.#tooltipElement.remove();
    });

    window.removeEventListener('resize', this.#handleViewportChange);
    window.visualViewport?.removeEventListener('resize', this.#handleViewportChange);

    if (this.#animationFrameId !== null) {
      window.cancelAnimationFrame(this.#animationFrameId);
      this.#animationFrameId = null;
    }

    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (this.#isSyncingDom) {
      return;
    }

    switch (name) {
      case 'role':
        this.#explicitRole = getNormalizedAttributeValue(newValue);
        break;
      case 'tabindex':
        this.#explicitTabindex = getNormalizedAttributeValue(newValue);
        break;
      case 'aria-label':
        this.#explicitAriaLabel = getNormalizedAttributeValue(newValue);
        break;
      case 'aria-labelledby':
        this.#explicitAriaLabelledBy = getNormalizedAttributeValue(newValue);
        break;
      case 'aria-describedby':
        this.#explicitAriaDescribedBy = getNormalizedAttributeValue(newValue);
        break;
      case 'data-testid':
        this.#explicitForwardedTriggerTestId = getNormalizedAttributeValue(newValue);
        break;
      case 'data-test-id':
        this.#explicitBaseDataTestId = getNormalizedAttributeValue(newValue);
        break;
      default:
        break;
    }

    if (this.#isMounted) {
      this.render();
    }
  }

  get placement(): Placement {
    return getEnumAttributeValue(this, 'placement', PLACEMENT_VALUES, 'top');
  }

  set placement(value: Placement) {
    this.setAttribute('placement', value);
  }

  get variant(): Variant {
    return getEnumAttributeValue(this, 'variant', VARIANT_VALUES, 'default');
  }

  set variant(value: Variant) {
    this.setAttribute('variant', value);
  }

  get disabled(): boolean {
    return getBooleanAttributeValue(this, 'disabled');
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, 'disabled', value);
  }

  get dataTestId(): string | undefined {
    return this.#explicitBaseDataTestId;
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-test-id', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectSlottedNodes();
      this.#syncHostClasses();
      this.#syncSharedStyles();
      this.#syncTooltipContent();
      this.#syncTriggerAccessibility();
      this.#syncHostAccessibility();
      this.#syncVisibilityTriggers();
      this.#syncTooltipVisibilityState();
      this.#syncResizeObservation();
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

  #syncExplicitAttributesFromDom(): void {
    this.#explicitRole = getNormalizedAttributeValue(this.getAttribute('role'));
    this.#explicitTabindex = getNormalizedAttributeValue(this.getAttribute('tabindex'));
    this.#explicitAriaLabel = getNormalizedAttributeValue(this.getAttribute('aria-label'));
    this.#explicitAriaLabelledBy = getNormalizedAttributeValue(
      this.getAttribute('aria-labelledby'),
    );
    this.#explicitAriaDescribedBy = getNormalizedAttributeValue(
      this.getAttribute('aria-describedby'),
    );
    this.#explicitForwardedTriggerTestId = getNormalizedAttributeValue(
      this.getAttribute('data-testid'),
    );
    this.#explicitBaseDataTestId = getNormalizedAttributeValue(this.getAttribute('data-test-id'));
  }

  #setupObservers(): void {
    if (!this.#mutationObserver) {
      this.#mutationObserver = new MutationObserver((records) => {
        if (this.#isSyncingDom || this.#shouldIgnoreMutations(records)) {
          return;
        }

        this.render();
      });

      this.#mutationObserver.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['slot', 'tabindex', 'disabled', 'href', 'role', 'contenteditable'],
      });
    }

    if (typeof ResizeObserver !== 'undefined' && !this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver(() => {
        this.#refreshTooltipPosition();
      });
    }
  }

  #syncResizeObservation(): void {
    if (!this.#resizeObserver) {
      return;
    }

    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this);
    this.#resizeObserver.observe(this.#tooltipElement);
  }

  #collectSlottedNodes(): void {
    const nextTitleNodes: Node[] = [];
    const nextDescriptionNodes: Node[] = [];

    // Slotted title/description nodes are moved into the sibling popup during rendering.
    // Keep those owned nodes on subsequent renders; detached nodes are intentionally dropped.
    const slottedElements = new Set([
      ...Array.from(this.children),
      ...this.#titleNodes.filter((node) => this.#titleElement.contains(node)),
      ...this.#descriptionNodes.filter((node) => this.#descriptionElement.contains(node)),
    ]);
    for (const element of slottedElements) {
      if (!(element instanceof Element)) continue;
      const slotName = element.getAttribute('slot');

      if (slotName === 'title') {
        nextTitleNodes.push(element);
        continue;
      }

      if (slotName === 'description') {
        nextDescriptionNodes.push(element);
      }
    }

    this.#titleNodes = nextTitleNodes;
    this.#descriptionNodes = nextDescriptionNodes;
  }

  #shouldIgnoreMutations(records: MutationRecord[]): boolean {
    if (records.length === 0) {
      return false;
    }

    return records.every((record) => {
      if (record.type === 'attributes') {
        if (!(record.target instanceof HTMLElement)) {
          return false;
        }

        if (record.target === this) {
          return Boolean(
            record.attributeName && MANAGED_HOST_ATTRIBUTE_NAMES.has(record.attributeName),
          );
        }

        if (this.#hasNestedCustomElementAncestor(record.target, false)) {
          return true;
        }

        return !this.contains(record.target);
      }

      if (record.type !== 'childList') {
        return false;
      }

      const changedNodes: Node[] = [
        ...Array.from(record.addedNodes),
        ...Array.from(record.removedNodes),
      ];

      if (changedNodes.length === 0) {
        return false;
      }

      if (record.target === this) {
        return changedNodes.every((node) => this.#isManagedTooltipContentNode(node));
      }

      if (this.#hasNestedCustomElementAncestor(record.target)) {
        return true;
      }

      return !this.contains(record.target);
    });
  }

  #isManagedTooltipContentNode(node: Node): boolean {
    return this.#titleNodes.includes(node) || this.#descriptionNodes.includes(node);
  }

  #hasNestedCustomElementAncestor(node: Node, includeSelf = true): boolean {
    let currentNode: Node | null = includeSelf ? node : node.parentNode;

    while (currentNode && currentNode !== this) {
      if (isCustomElementNode(currentNode)) {
        return true;
      }

      currentNode = currentNode.parentNode;
    }

    return false;
  }

  #syncHostClasses(): void {
    const classNames = new Set(
      [INFO_TOOLTIP_CLASS_NAME, this.disabled && `${INFO_TOOLTIP_CLASS_NAME}--disabled`].filter(
        Boolean,
      ) as string[],
    );

    for (const className of this.#managedClasses) {
      if (!classNames.has(className)) {
        this.classList.remove(className);
      }
    }

    for (const className of classNames) {
      this.classList.add(className);
    }

    this.#managedClasses = classNames;
  }

  #syncSharedStyles(): void {
    const anchorName = `--anchor-${this.#tooltipId}`;
    const layoutVersion = String(this.#layoutVersion);

    this.style.setProperty('--unique-anchor', anchorName);
    this.style.setProperty('--peaui-info-tooltip-layout-version', layoutVersion);
    this.#tooltipElement.style.setProperty('--unique-anchor', anchorName);
    this.#tooltipElement.style.setProperty('--peaui-info-tooltip-layout-version', layoutVersion);
  }

  #syncTooltipContent(): void {
    this.#tooltipElement.id = this.#tooltipId;
    this.#tooltipElement.setAttribute('role', 'tooltip');
    this.#tooltipElement.className = [
      `${INFO_TOOLTIP_CLASS_NAME}__content`,
      `${INFO_TOOLTIP_CLASS_NAME}__content--placement-${this.placement}`,
      `${INFO_TOOLTIP_CLASS_NAME}__content--variant-${this.variant}`,
    ].join(' ');

    if (this.disabled) {
      this.#tooltipElement.setAttribute('aria-hidden', 'true');
    } else {
      this.#tooltipElement.removeAttribute('aria-hidden');
    }

    if (this.#tooltipTestId) {
      this.#tooltipElement.setAttribute('data-testid', this.#tooltipTestId);
    } else {
      this.#tooltipElement.removeAttribute('data-testid');
    }

    const children: Node[] = [];

    if (this.#titleNodes.length > 0) {
      this.#titleElement.className = `${INFO_TOOLTIP_CLASS_NAME}__title`;

      if (this.#titleTestId) {
        this.#titleElement.setAttribute('data-testid', this.#titleTestId);
      } else {
        this.#titleElement.removeAttribute('data-testid');
      }

      syncNodeChildren(this.#titleElement, this.#titleNodes);
      children.push(this.#titleElement);
    }

    if (this.#descriptionNodes.length > 0) {
      this.#descriptionElement.className = `${INFO_TOOLTIP_CLASS_NAME}__description`;

      if (this.#descriptionTestId) {
        this.#descriptionElement.setAttribute('data-testid', this.#descriptionTestId);
      } else {
        this.#descriptionElement.removeAttribute('data-testid');
      }

      syncNodeChildren(this.#descriptionElement, this.#descriptionNodes);
      children.push(this.#descriptionElement);
    }

    syncNodeChildren(this.#tooltipElement, children);

    if (this.parentNode && this.nextSibling !== this.#tooltipElement) {
      this.after(this.#tooltipElement);
    }
  }

  #syncTriggerAccessibility(): void {
    this.#describedTriggerElements.forEach((element) => {
      this.#removeTooltipDescriptionFromTrigger(element);
    });
    this.#describedTriggerElements = [];

    if (this.disabled) {
      this.#managedTriggerAncestor = null;
      this.#hasFocusableTriggerDescendant = false;
      return;
    }

    const nextFocusableTriggerElements = Array.from(
      this.querySelectorAll<HTMLElement>(FOCUSABLE_TRIGGER_SELECTOR),
    );

    this.#managedTriggerAncestor =
      nextFocusableTriggerElements.length === 0 ? this.#getManagedTriggerAncestor() : null;

    let nextDescribedTriggerElements: HTMLElement[];

    if (nextFocusableTriggerElements.length > 0) {
      nextDescribedTriggerElements = nextFocusableTriggerElements;
    } else if (this.#managedTriggerAncestor) {
      nextDescribedTriggerElements = [this.#managedTriggerAncestor];
    } else {
      nextDescribedTriggerElements = [];
    }

    this.#hasFocusableTriggerDescendant = nextFocusableTriggerElements.length > 0;

    nextDescribedTriggerElements.forEach((element) => {
      this.#addTooltipDescriptionToTrigger(element);
    });
    this.#describedTriggerElements = nextDescribedTriggerElements;
  }

  #syncHostAccessibility(): void {
    this.#setManagedHostAttribute('data-open', this.#isTooltipVisible ? 'true' : undefined);
    this.#setManagedHostAttribute('data-testid', this.#resolvedTriggerTestId);
    this.#setManagedHostAttribute('role', this.#triggerRole);
    this.#setManagedHostAttribute('tabindex', this.#triggerTabindex);
    this.#setManagedHostAttribute('aria-label', this.#triggerAriaLabel);
    this.#setManagedHostAttribute('aria-labelledby', this.#triggerAriaLabelledBy);
    this.#setManagedHostAttribute('aria-describedby', this.#triggerAriaDescribedBy);
  }

  #setManagedHostAttribute(name: string, value: string | undefined): void {
    if (value === undefined) {
      this.removeAttribute(name);
      return;
    }

    this.setAttribute(name, value);
  }

  #syncVisibilityTriggers(): void {
    if (this.disabled) {
      this.#resetVisibilityState();
      this.#hoverTriggerElement = this.#detachHoverListeners(this.#hoverTriggerElement);
      this.#focusTriggerElement = this.#detachFocusListeners(this.#focusTriggerElement);
      return;
    }

    const nextFocusTrigger = this.#managedTriggerAncestor ?? this;

    if (this.#hoverTriggerElement !== this) {
      this.#hoverTriggerElement = this.#detachHoverListeners(this.#hoverTriggerElement);
      this.#hoverTriggerElement = this.#attachHoverListeners(this);
    }

    if (this.#focusTriggerElement !== nextFocusTrigger) {
      this.#focusTriggerElement = this.#detachFocusListeners(this.#focusTriggerElement);
      this.#focusTriggerElement = this.#attachFocusListeners(nextFocusTrigger);
    }
  }

  #attachHoverListeners(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
      return null;
    }

    element.addEventListener('mouseenter', this.#handleTriggerMouseEnter);
    element.addEventListener('mouseleave', this.#handleTriggerMouseLeave);

    return element;
  }

  #detachHoverListeners(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
      return null;
    }

    element.removeEventListener('mouseenter', this.#handleTriggerMouseEnter);
    element.removeEventListener('mouseleave', this.#handleTriggerMouseLeave);

    return null;
  }

  #attachFocusListeners(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
      return null;
    }

    element.addEventListener('focusin', this.#handleTriggerFocusIn);
    element.addEventListener('focusout', this.#handleTriggerFocusOut);

    return element;
  }

  #detachFocusListeners(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
      return null;
    }

    element.removeEventListener('focusin', this.#handleTriggerFocusIn);
    element.removeEventListener('focusout', this.#handleTriggerFocusOut);

    return null;
  }

  #addTooltipDescriptionToTrigger(element: HTMLElement): void {
    const descriptionIds = new Set(
      (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean),
    );

    descriptionIds.add(this.#tooltipId);
    element.setAttribute('aria-describedby', Array.from(descriptionIds).join(' '));
  }

  #removeTooltipDescriptionFromTrigger(element: HTMLElement): void {
    const descriptionIds = (element.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .filter((descriptionId) => descriptionId !== this.#tooltipId);

    if (descriptionIds.length === 0) {
      element.removeAttribute('aria-describedby');
      return;
    }

    element.setAttribute('aria-describedby', descriptionIds.join(' '));
  }

  #getManagedTriggerAncestor(): HTMLElement | null {
    let currentElement = this.parentElement;

    while (currentElement) {
      if (currentElement.matches(MANAGED_TRIGGER_ANCESTOR_SELECTOR)) {
        return currentElement;
      }

      currentElement = currentElement.parentElement;
    }

    return null;
  }

  #setTooltipVisible(value: boolean): void {
    if (value) this.ownerDocument.addEventListener('keydown', this.#handleTooltipEscape, true);
    else this.ownerDocument.removeEventListener('keydown', this.#handleTooltipEscape, true);
    this.#isTooltipVisible = value;
    this.#setManagedHostAttribute('data-open', value ? 'true' : undefined);
  }

  #syncTooltipVisibilityState(): void {
    this.#setTooltipVisible(
      !this.disabled &&
        (this.#isOwnTriggerActivated ||
          (!this.#isTemporarilyDismissed &&
            (this.#isTriggerHovered ||
              this.#isTooltipHovered ||
              this.#isTriggerFocused ||
              this.#isTooltipFocused))),
    );
  }

  #resetVisibilityState(): void {
    this.#isTooltipHovered = false;
    this.#isTooltipFocused = false;
    this.#isTriggerHovered = false;
    this.#isTriggerFocused = false;
    this.#isOwnTriggerActivated = false;
    this.#isTemporarilyDismissed = false;
    this.#setTooltipVisible(false);
  }

  #refreshTooltipPosition(): void {
    this.#layoutVersion += 1;
    this.#syncSharedStyles();
  }

  #scheduleInitialTooltipRefresh(): void {
    if (typeof window.requestAnimationFrame !== 'function') {
      this.#refreshTooltipPosition();
      return;
    }

    this.#animationFrameId = window.requestAnimationFrame(() => {
      this.#animationFrameId = null;
      this.#refreshTooltipPosition();
    });
  }

  #hasVisibleTextContent(): boolean {
    return Boolean(this.textContent.trim());
  }

  get #hasOwnFocusableTrigger(): boolean {
    return !this.#hasFocusableTriggerDescendant && !this.#managedTriggerAncestor;
  }

  get #triggerRole(): string | undefined {
    if (this.#explicitRole) {
      return this.#explicitRole;
    }

    if (this.disabled) {
      return undefined;
    }

    return this.#hasOwnFocusableTrigger ? 'button' : undefined;
  }

  get #triggerTabindex(): string | undefined {
    if (this.#explicitTabindex !== undefined) {
      return this.#explicitTabindex;
    }

    if (this.disabled) {
      return undefined;
    }

    return this.#hasOwnFocusableTrigger ? '0' : undefined;
  }

  get #triggerAriaLabel(): string | undefined {
    if (this.#explicitAriaLabel) {
      return this.#explicitAriaLabel;
    }

    if (this.disabled) {
      return undefined;
    }

    if (!this.#hasOwnFocusableTrigger || Boolean(this.#explicitAriaLabelledBy)) {
      return undefined;
    }

    if (this.#hasVisibleTextContent()) {
      return undefined;
    }

    return DEFAULT_TRIGGER_ARIA_LABEL;
  }

  get #triggerAriaLabelledBy(): string | undefined {
    if (this.disabled || !this.#hasOwnFocusableTrigger) {
      return undefined;
    }

    return this.#explicitAriaLabelledBy;
  }

  get #triggerAriaDescribedBy(): string | undefined {
    if (this.disabled || !this.#hasOwnFocusableTrigger) {
      return this.#explicitAriaDescribedBy;
    }

    const descriptionIds = new Set(
      (this.#explicitAriaDescribedBy ?? '').split(/\s+/).filter(Boolean),
    );

    descriptionIds.add(this.#tooltipId);

    return Array.from(descriptionIds).join(' ');
  }

  get #resolvedTriggerTestId(): string | undefined {
    if (this.#explicitBaseDataTestId) {
      return `${this.#explicitBaseDataTestId}-content`;
    }

    return this.#explicitForwardedTriggerTestId;
  }

  get #tooltipTestId(): string | undefined {
    return this.#explicitBaseDataTestId ? `${this.#explicitBaseDataTestId}-tooltip` : undefined;
  }

  get #titleTestId(): string | undefined {
    return this.#explicitBaseDataTestId ? `${this.#explicitBaseDataTestId}-title` : undefined;
  }

  get #descriptionTestId(): string | undefined {
    return this.#explicitBaseDataTestId ? `${this.#explicitBaseDataTestId}-description` : undefined;
  }

  #handleTriggerMouseEnter = (): void => {
    if (this.disabled) {
      return;
    }

    this.#isTriggerHovered = true;
    this.#isTemporarilyDismissed = false;
    this.#syncTooltipVisibilityState();
  };

  #handleTriggerMouseLeave = (event: MouseEvent): void => {
    const relatedTarget = event.relatedTarget as Node | null;

    this.#isTriggerHovered = false;

    if (relatedTarget && this.#tooltipElement.contains(relatedTarget)) {
      this.#isTooltipHovered = true;
    }

    this.#syncTooltipVisibilityState();
  };

  #handleTriggerFocusIn = (): void => {
    if (this.disabled) {
      return;
    }

    this.#isTriggerFocused = true;
    this.#isTemporarilyDismissed = false;
    this.#syncTooltipVisibilityState();
  };

  #handleTriggerFocusOut = (event: FocusEvent): void => {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget as Node | null;

    if (
      currentTarget &&
      relatedTarget &&
      (currentTarget.contains(relatedTarget) || this.#tooltipElement.contains(relatedTarget))
    ) {
      return;
    }

    this.#isTriggerFocused = false;
    this.#syncTooltipVisibilityState();
  };

  #handleViewportChange = (): void => {
    this.#refreshTooltipPosition();
  };

  #handleTooltipMouseEnter = (): void => {
    if (this.disabled) {
      return;
    }

    this.#isTooltipHovered = true;
    this.#isTemporarilyDismissed = false;
    this.#syncTooltipVisibilityState();
  };

  #handleTooltipMouseLeave = (event: MouseEvent): void => {
    const relatedTarget = event.relatedTarget as Node | null;

    this.#isTooltipHovered = false;

    if (relatedTarget && this.contains(relatedTarget)) {
      this.#isTriggerHovered = true;
    }

    this.#syncTooltipVisibilityState();
  };

  #handleTooltipFocusIn = (): void => {
    if (this.disabled) {
      return;
    }

    this.#isTooltipFocused = true;
    this.#isTemporarilyDismissed = false;
    this.#syncTooltipVisibilityState();
  };

  #handleTooltipFocusOut = (event: FocusEvent): void => {
    const relatedTarget = event.relatedTarget as Node | null;

    if (
      relatedTarget &&
      (this.#tooltipElement.contains(relatedTarget) || this.contains(relatedTarget))
    ) {
      return;
    }

    this.#isTooltipFocused = false;
    this.#syncTooltipVisibilityState();
  };

  #handleManagedTriggerClick = (event: MouseEvent): void => {
    if (this.disabled || !this.#hasOwnFocusableTrigger) {
      return;
    }

    event.preventDefault();

    if (this.#isOwnTriggerActivated) {
      this.#isOwnTriggerActivated = false;
      this.#isTemporarilyDismissed = true;
    } else {
      this.#isOwnTriggerActivated = true;
      this.#isTemporarilyDismissed = false;
    }

    this.#syncTooltipVisibilityState();
    this.#refreshTooltipPosition();
  };

  #handleManagedTriggerKeydown = (event: KeyboardEvent): void => {
    if (this.disabled || !this.#hasOwnFocusableTrigger) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.click();
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.#isOwnTriggerActivated = false;
      this.#isTemporarilyDismissed = true;
      this.#syncTooltipVisibilityState();
    }
  };

  #handleTooltipEscape = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.#isTooltipVisible) return;
    event.preventDefault();
    event.stopPropagation();
    this.#isOwnTriggerActivated = false;
    this.#isTemporarilyDismissed = true;
    this.#syncTooltipVisibilityState();
  };

  #handleManagedTriggerKeyup = (event: KeyboardEvent): void => {
    if (this.disabled || !this.#hasOwnFocusableTrigger || event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.click();
  };
}

export function defineInfoTooltip(): typeof InfoTooltipElement {
  if (typeof window !== 'undefined' && !window.customElements.get(INFO_TOOLTIP_TAG_NAME)) {
    window.customElements.define(INFO_TOOLTIP_TAG_NAME, InfoTooltipElement);
  }

  return InfoTooltipElement;
}

defineInfoTooltip();

export default InfoTooltipElement;

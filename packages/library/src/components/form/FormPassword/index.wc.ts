import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { connectFormReset } from '@/helpers/form-reset.helper';
import { SvgIconElement, defineSvgIcon } from '@/components/basic/SvgIcon/index.wc';
import { FormFieldElement, defineFormField } from '@/components/form/FormField/index.wc';
import { UIKIT_NAME } from '@/constants';
import { syncNodeChildren } from '@/helpers/dom.helper';
import { copyToClipboard } from '@/helpers/functions.helper';
import { PASSWORD_STRENGTH_SEGMENTS, evaluatePasswordStrength } from './strength.helper';

const FORM_PASSWORD_TAG_NAME = `${UIKIT_NAME}-form-password`;
const FORM_PASSWORD_CLASS_NAME = `${UIKIT_NAME}-form-field-password`;
const DOUBLE_ACTIONS_PADDING_RIGHT = '5.75rem';
const SINGLE_ACTION_PADDING_RIGHT = '2.875rem';
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);
const NON_FORWARDED_INPUT_ATTRIBUTES = new Set([
  'before',
  'can-copy',
  'can-visible',
  'class',
  'copy-error-message',
  'copy-password-aria-label',
  'copy-success-message',
  'data-testid',
  'disabled',
  'enable-password-strength-meter',
  'hide-password-aria-label',
  'icon-before',
  'id',
  'label',
  'max-length',
  'name',
  'placeholder',
  'readonly',
  'required',
  'show-password-aria-label',
  'style',
  'value',
]);
let nextGeneratedPasswordInputId = 0;

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

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean | undefined) {
  if (value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
}

function getNumberAttributeValue(element: HTMLElement, name: string): number | undefined {
  const value = getNormalizedAttributeValue(element.getAttribute(name));

  if (value === undefined) {
    return undefined;
  }

  const normalizedNumber = Number(value);

  return Number.isFinite(normalizedNumber) ? normalizedNumber : undefined;
}

function setNumberAttribute(element: HTMLElement, name: string, value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
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

function getNextGeneratedPasswordInputId(): string {
  nextGeneratedPasswordInputId += 1;

  return `${FORM_PASSWORD_CLASS_NAME}-${nextGeneratedPasswordInputId}`;
}

function mergeSpaceSeparatedIds(...values: Array<string | null | undefined>): string | undefined {
  const normalizedIds = values
    .flatMap((value) => `${value ?? ''}`.split(/\s+/))
    .map((value) => value.trim())
    .filter(Boolean);

  if (normalizedIds.length === 0) {
    return undefined;
  }

  return Array.from(new Set(normalizedIds)).join(' ');
}

defineFormField();
defineSvgIcon();

export class FormPasswordElement extends HTMLElement {
  #disconnectFormReset?: () => void;
  static readonly tagName = FORM_PASSWORD_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'before',
      'can-copy',
      'can-visible',
      'copy-error-message',
      'copy-password-aria-label',
      'copy-success-message',
      'data-testid',
      'disabled',
      'enable-password-strength-meter',
      'hide-password-aria-label',
      'icon-before',
      'id',
      'label',
      'max-length',
      'name',
      'placeholder',
      'readonly',
      'required',
      'show-password-aria-label',
      'value',
    ];
  }

  #actionsElement = document.createElement('div');
  #copyButtonElement = document.createElement('button');
  #copyIconElement = document.createElement(SvgIconElement.tagName);
  #copyStatusElement = document.createElement('span');
  #copyStatusMessage = '';
  #descriptionNodes: Node[] = [];
  #errorNodes: Node[] = [];
  #fieldElement = document.createElement(FormFieldElement.tagName);
  #forwardedInputAttributeNames = new Set<string>();
  #generatedInputId = getNextGeneratedPasswordInputId();
  #hintNodes: Node[] = [];
  #inputElement = document.createElement('input');
  #isMounted = false;
  #isPasswordVisible = false;
  #isSyncingDom = false;
  #isSyncingValueFromInput = false;
  #mutationObserver: MutationObserver | null = null;
  #strengthElement = document.createElement('div');
  #strengthBarElement = document.createElement('span');
  #strengthAssistiveElement = document.createElement('span');
  #strengthLabelElement = document.createElement('span');
  #strengthSegments = Array.from({ length: PASSWORD_STRENGTH_SEGMENTS }, () =>
    document.createElement('span'),
  );
  #successNodes: Node[] = [];
  #toggleButtonElement = document.createElement('button');
  #toggleIconElement = document.createElement(SvgIconElement.tagName);

  constructor() {
    super();

    this.#copyIconElement.name = 'copy';
    this.#toggleIconElement.name = 'eye';
    this.#inputElement.addEventListener('input', this.#handleInput);
    this.#toggleButtonElement.addEventListener('click', this.#handleToggleClick);
    this.#copyButtonElement.addEventListener('click', (event) => {
      void this.#handleCopyClick(event);
    });
  }

  connectedCallback(): void {
    upgradeCustomElementProperties(this);
    this.#disconnectFormReset?.();
    this.#disconnectFormReset = connectFormReset(this);
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
    this.#disconnectFormReset?.();
    this.#isMounted = false;
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    if (name === 'value' && this.#isSyncingValueFromInput) {
      return;
    }

    this.render();
  }

  get beforeText(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('before'));
  }

  set beforeText(value: string | null | undefined) {
    setStringAttribute(this, 'before', value);
  }

  get canCopy(): boolean {
    return getBooleanAttributeValue(this, 'can-copy', true);
  }

  set canCopy(value: boolean) {
    setBooleanAttribute(this, 'can-copy', value);
  }

  get canVisible(): boolean {
    return getBooleanAttributeValue(this, 'can-visible', true);
  }

  set canVisible(value: boolean) {
    setBooleanAttribute(this, 'can-visible', value);
  }

  get disabled(): boolean {
    return getBooleanAttributeValue(this, 'disabled');
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, 'disabled', value);
  }

  get enablePasswordStrengthMeter(): boolean {
    return getBooleanAttributeValue(this, 'enable-password-strength-meter');
  }

  set enablePasswordStrengthMeter(value: boolean) {
    setBooleanAttribute(this, 'enable-password-strength-meter', value);
  }

  get iconBefore(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('icon-before'));
  }

  set iconBefore(value: string | null | undefined) {
    setStringAttribute(this, 'icon-before', value);
  }

  get label(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('label'));
  }

  set label(value: string | null | undefined) {
    setStringAttribute(this, 'label', value);
  }

  get maxLength(): number | undefined {
    return getNumberAttributeValue(this, 'max-length');
  }

  set maxLength(value: number | null | undefined) {
    setNumberAttribute(this, 'max-length', value);
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }

  set name(value: string) {
    setStringAttribute(this, 'name', value);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') ?? 'wpisz';
  }

  set placeholder(value: string | null | undefined) {
    setStringAttribute(this, 'placeholder', value);
  }

  get readonly(): boolean {
    return getBooleanAttributeValue(this, 'readonly');
  }

  set readonly(value: boolean) {
    setBooleanAttribute(this, 'readonly', value);
  }

  get required(): boolean {
    return getBooleanAttributeValue(this, 'required');
  }

  set required(value: boolean) {
    setBooleanAttribute(this, 'required', value);
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  get showPasswordAriaLabel(): string {
    return this.getAttribute('show-password-aria-label') ?? 'Pokaz haslo';
  }

  set showPasswordAriaLabel(value: string | null | undefined) {
    setStringAttribute(this, 'show-password-aria-label', value);
  }

  get hidePasswordAriaLabel(): string {
    return this.getAttribute('hide-password-aria-label') ?? 'Ukryj haslo';
  }

  set hidePasswordAriaLabel(value: string | null | undefined) {
    setStringAttribute(this, 'hide-password-aria-label', value);
  }

  get copyPasswordAriaLabel(): string {
    return this.getAttribute('copy-password-aria-label') ?? 'Kopiuj haslo';
  }

  set copyPasswordAriaLabel(value: string | null | undefined) {
    setStringAttribute(this, 'copy-password-aria-label', value);
  }

  get copySuccessMessage(): string {
    return this.getAttribute('copy-success-message') ?? 'Haslo skopiowano do schowka.';
  }

  set copySuccessMessage(value: string | null | undefined) {
    setStringAttribute(this, 'copy-success-message', value);
  }

  get copyErrorMessage(): string {
    return this.getAttribute('copy-error-message') ?? 'Nie udalo sie skopiowac hasla.';
  }

  set copyErrorMessage(value: string | null | undefined) {
    setStringAttribute(this, 'copy-error-message', value);
  }

  get value(): string | undefined {
    if (!this.hasAttribute('value')) {
      return undefined;
    }

    return this.getAttribute('value') ?? '';
  }

  set value(value: string | null | undefined) {
    if (value === null || value === undefined) {
      this.removeAttribute('value');
      return;
    }

    this.setAttribute('value', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncHost();
      this.#syncInput();
      this.#syncActions();
      this.#syncField();
      this.#syncFieldChildren();
      this.#fieldElement.render();
      this.#syncStrengthMeter();
      this.#syncInputAfterFieldRender();
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
      attributes: true,
    });
  }

  #shouldIgnoreMutations(records: MutationRecord[]): boolean {
    if (records.length === 0) {
      return false;
    }

    return records.every((record) => {
      if (record.type === 'attributes') {
        const name = record.attributeName!;
        return (
          FormPasswordElement.observedAttributes.includes(name) ||
          NON_FORWARDED_INPUT_ATTRIBUTES.has(name)
        );
      }
      const changedNodes: Node[] = [
        ...Array.from(record.addedNodes),
        ...Array.from(record.removedNodes),
      ];

      return (
        record.target === this &&
        changedNodes.length > 0 &&
        changedNodes.every((node) => this.#isManagedNode(node) || this.#isTrackedNode(node))
      );
    });
  }

  #isManagedNode(node: Node): boolean {
    return node === this.#fieldElement || node === this.#strengthElement;
  }

  #isTrackedNode(node: Node): boolean {
    return (
      this.#hintNodes.includes(node) ||
      this.#descriptionNodes.includes(node) ||
      this.#errorNodes.includes(node) ||
      this.#successNodes.includes(node)
    );
  }

  #collectExternalNodes(): void {
    const trackedNodes = [
      ...this.#hintNodes,
      ...this.#descriptionNodes,
      ...this.#errorNodes,
      ...this.#successNodes,
    ];
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => !this.#isManagedNode(node)),
    );
    const sourceNodes = normalizeNodes(
      Array.from(new Set([...directNodes, ...trackedNodes])).filter(
        (node) => directNodes.includes(node) || this.contains(node),
      ),
    );
    const nextHintNodes: Node[] = [];
    const nextDescriptionNodes: Node[] = [];
    const nextErrorNodes: Node[] = [];
    const nextSuccessNodes: Node[] = [];

    sourceNodes.forEach((node) => {
      const slotName = node instanceof Element ? node.getAttribute('slot') : null;

      switch (slotName) {
        case 'hint':
          nextHintNodes.push(node);
          break;
        case 'description':
          nextDescriptionNodes.push(node);
          break;
        case 'error':
          nextErrorNodes.push(node);
          break;
        case 'success':
          nextSuccessNodes.push(node);
          break;
        default:
          break;
      }
    });

    this.#hintNodes = nextHintNodes;
    this.#descriptionNodes = nextDescriptionNodes;
    this.#errorNodes = nextErrorNodes;
    this.#successNodes = nextSuccessNodes;
  }

  #syncHost(): void {
    if (!this.style.display) {
      this.style.display = 'block';
    }

    if (this.#fieldElement.parentNode !== this) {
      this.appendChild(this.#fieldElement);
    }

    if (!this.enablePasswordStrengthMeter) {
      this.#strengthElement.remove();
      return;
    }

    if (this.#strengthElement.parentNode !== this) {
      this.appendChild(this.#strengthElement);
    }
  }

  #syncInput(): void {
    const nextAttributes = new Map<string, string>();
    const dataTestId = this.dataTestId;

    this.#inputElement.className = FORM_PASSWORD_CLASS_NAME;
    this.#inputElement.setAttribute('data-type', 'password');

    if (dataTestId !== undefined) {
      this.#inputElement.setAttribute('data-testid', `${dataTestId}-element`);
    } else {
      this.#inputElement.removeAttribute('data-testid');
    }

    for (const attributeName of this.getAttributeNames()) {
      if (NON_FORWARDED_INPUT_ATTRIBUTES.has(attributeName)) {
        continue;
      }

      const attributeValue = this.getAttribute(attributeName);

      if (attributeValue === null) {
        continue;
      }

      nextAttributes.set(attributeName, attributeValue);
    }

    for (const [name, value] of nextAttributes) {
      this.#inputElement.setAttribute(name, value);
    }

    for (const name of this.#forwardedInputAttributeNames) {
      if (!nextAttributes.has(name)) {
        this.#inputElement.removeAttribute(name);
      }
    }

    this.#forwardedInputAttributeNames = new Set(nextAttributes.keys());

    if (this.value !== undefined) {
      this.#inputElement.value = this.value;
      this.#inputElement.setAttribute('value', this.value);
    } else {
      this.#inputElement.value = '';
      this.#inputElement.removeAttribute('value');
    }
  }

  #syncActions(): void {
    const dataTestId = this.dataTestId;

    this.#actionsElement.className = `${FORM_PASSWORD_CLASS_NAME}__actions`;

    if (this.disabled) {
      this.#actionsElement.setAttribute('data-disabled', 'true');
    } else {
      this.#actionsElement.removeAttribute('data-disabled');
    }

    if (this.readonly) {
      this.#actionsElement.setAttribute('data-readonly', 'true');
    } else {
      this.#actionsElement.removeAttribute('data-readonly');
    }

    this.#toggleButtonElement.type = 'button';
    this.#toggleButtonElement.className = [
      `${FORM_PASSWORD_CLASS_NAME}__button`,
      `${FORM_PASSWORD_CLASS_NAME}__button--toggle`,
      this.#isPasswordVisible ? `${FORM_PASSWORD_CLASS_NAME}__button--active` : '',
    ]
      .filter(Boolean)
      .join(' ');
    this.#toggleButtonElement.setAttribute(
      'aria-controls',
      `${this.#resolvedInputId}-field-control`,
    );
    this.#toggleButtonElement.setAttribute('aria-label', this.#togglePasswordAriaLabel);
    this.#toggleButtonElement.setAttribute('aria-pressed', String(this.#isPasswordVisible));
    this.#toggleButtonElement.disabled = this.disabled;

    if (dataTestId !== undefined) {
      this.#toggleButtonElement.setAttribute('data-testid', `${dataTestId}-toggle-button`);
    } else {
      this.#toggleButtonElement.removeAttribute('data-testid');
    }

    this.#toggleIconElement.setAttribute('class', `${FORM_PASSWORD_CLASS_NAME}__icon`);
    syncNodeChildren(this.#toggleButtonElement, [this.#toggleIconElement]);

    this.#copyButtonElement.type = 'button';
    this.#copyButtonElement.className = `${FORM_PASSWORD_CLASS_NAME}__button`;
    this.#copyButtonElement.setAttribute('aria-label', this.copyPasswordAriaLabel);
    this.#copyButtonElement.disabled = this.#isCopyDisabled;

    if (dataTestId !== undefined) {
      this.#copyButtonElement.setAttribute('data-testid', `${dataTestId}-copy-button`);
    } else {
      this.#copyButtonElement.removeAttribute('data-testid');
    }

    this.#copyIconElement.setAttribute('class', `${FORM_PASSWORD_CLASS_NAME}__icon`);
    syncNodeChildren(this.#copyButtonElement, [this.#copyIconElement]);

    this.#copyStatusElement.className = `${FORM_PASSWORD_CLASS_NAME}__status`;
    this.#copyStatusElement.setAttribute('role', 'status');
    this.#copyStatusElement.setAttribute('aria-live', 'polite');
    this.#copyStatusElement.setAttribute('aria-atomic', 'true');

    if (dataTestId !== undefined) {
      this.#copyStatusElement.setAttribute('data-testid', `${dataTestId}-copy-status`);
    } else {
      this.#copyStatusElement.removeAttribute('data-testid');
    }

    this.#copyStatusElement.textContent = this.#copyStatusMessage;
    const actionChildren: Node[] = [];

    if (this.canVisible) {
      actionChildren.push(this.#toggleButtonElement);
    }

    if (this.canCopy) {
      actionChildren.push(this.#copyButtonElement, this.#copyStatusElement);
    }

    syncNodeChildren(this.#actionsElement, actionChildren);
  }

  #syncField(): void {
    this.#fieldElement.beforeText = this.beforeText;
    this.#fieldElement.disabled = this.disabled;
    this.#fieldElement.iconBefore = this.iconBefore;
    this.#fieldElement.id = `${this.#resolvedInputId}-field`;
    for (const name of ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid']) {
      const value = this.getAttribute(name);
      if (value === null) this.#fieldElement.removeAttribute(name);
      else this.#fieldElement.setAttribute(name, value);
    }
    this.#fieldElement.label = this.label;
    this.#fieldElement.maxLength = this.maxLength;
    this.#fieldElement.name = this.name;
    this.#fieldElement.placeholder = this.placeholder;
    this.#fieldElement.readonly = this.readonly;
    this.#fieldElement.required = this.required;
    this.#fieldElement.value = this.value;
    this.#fieldElement.dataTestId = this.dataTestId;
  }

  #syncFieldChildren(): void {
    const children: Node[] = [...this.#hintNodes];

    children.push(this.#inputElement);

    if (this.#isActionsVisible) {
      children.push(this.#actionsElement);
    }

    children.push(...this.#descriptionNodes, ...this.#errorNodes, ...this.#successNodes);

    syncNodeChildren(this.#fieldElement, children);
  }

  #syncStrengthMeter(): void {
    if (!this.enablePasswordStrengthMeter) {
      this.#strengthElement.remove();
      return;
    }

    const strengthResult = this.#strengthResult;
    const strengthMeterTestId = this.#strengthMeterTestId;
    const strengthLabelTestId = this.#strengthLabelTestId;

    this.#strengthElement.className = `${FORM_PASSWORD_CLASS_NAME}__strength`;
    this.#strengthElement.setAttribute('data-tone', strengthResult.tone);

    if (this.#hasSupportingMessage) {
      this.#strengthElement.setAttribute('data-has-supporting-message', 'true');
    } else {
      this.#strengthElement.removeAttribute('data-has-supporting-message');
    }

    if (strengthMeterTestId !== undefined) {
      this.#strengthElement.setAttribute('data-testid', strengthMeterTestId);
    } else {
      this.#strengthElement.removeAttribute('data-testid');
    }

    this.#strengthBarElement.className = `${FORM_PASSWORD_CLASS_NAME}__strength-bar`;

    this.#strengthSegments.forEach((segment, index) => {
      segment.className = `${FORM_PASSWORD_CLASS_NAME}__strength-segment`;

      if (index < strengthResult.activeSegments) {
        segment.setAttribute('data-active', 'true');
      } else {
        segment.removeAttribute('data-active');
      }
    });

    syncNodeChildren(this.#strengthBarElement, this.#strengthSegments);

    this.#strengthLabelElement.className = `${FORM_PASSWORD_CLASS_NAME}__strength-label`;
    this.#strengthLabelElement.textContent = strengthResult.label;

    if (strengthLabelTestId !== undefined) {
      this.#strengthLabelElement.setAttribute('data-testid', strengthLabelTestId);
    } else {
      this.#strengthLabelElement.removeAttribute('data-testid');
    }

    this.#strengthAssistiveElement.className = `${FORM_PASSWORD_CLASS_NAME}__status`;
    this.#strengthAssistiveElement.id = this.#strengthStatusId;
    this.#strengthAssistiveElement.setAttribute('role', 'status');
    this.#strengthAssistiveElement.setAttribute('aria-live', 'polite');
    this.#strengthAssistiveElement.setAttribute('aria-atomic', 'true');
    this.#strengthAssistiveElement.textContent = strengthResult.assistiveText;

    syncNodeChildren(this.#strengthElement, [
      this.#strengthBarElement,
      this.#strengthLabelElement,
      this.#strengthAssistiveElement,
    ]);
  }

  #syncInputAfterFieldRender(): void {
    const actionsPaddingRight = this.#actionsPaddingRight;

    this.#inputElement.type = this.canVisible && this.#isPasswordVisible ? 'text' : 'password';

    if (actionsPaddingRight !== undefined) {
      this.#inputElement.style.setProperty('--pr', actionsPaddingRight);
    } else {
      this.#inputElement.style.removeProperty('--pr');
    }

    const describedBy = mergeSpaceSeparatedIds(
      this.#inputElement.getAttribute('aria-describedby'),
      this.enablePasswordStrengthMeter ? this.#strengthStatusId : undefined,
    );

    if (describedBy !== undefined) {
      this.#inputElement.setAttribute('aria-describedby', describedBy);
    } else {
      this.#inputElement.removeAttribute('aria-describedby');
    }

    this.#inputElement.setCustomValidity(
      this.enablePasswordStrengthMeter ? this.#strengthResult.validationMessage : '',
    );
  }

  get #normalizedValue(): string {
    return this.value ?? '';
  }

  get #visibleActionsCount(): number {
    return Number(this.canVisible) + Number(this.canCopy);
  }

  get #isActionsVisible(): boolean {
    return this.#visibleActionsCount > 0;
  }

  get #actionsPaddingRight(): string | undefined {
    if (this.#visibleActionsCount === 2) {
      return DOUBLE_ACTIONS_PADDING_RIGHT;
    }

    if (this.#visibleActionsCount === 1) {
      return SINGLE_ACTION_PADDING_RIGHT;
    }

    return undefined;
  }

  get #togglePasswordAriaLabel(): string {
    return this.#isPasswordVisible ? this.hidePasswordAriaLabel : this.showPasswordAriaLabel;
  }

  get #resolvedInputId(): string {
    return getNormalizedAttributeValue(this.id) ?? this.#generatedInputId;
  }

  get #isCopyDisabled(): boolean {
    return this.disabled || this.#normalizedValue === '';
  }

  get #strengthResult() {
    return evaluatePasswordStrength(this.#normalizedValue);
  }

  get #hasSupportingMessage(): boolean {
    return (
      this.#descriptionNodes.length > 0 ||
      this.#errorNodes.length > 0 ||
      this.#successNodes.length > 0 ||
      this.maxLength !== undefined
    );
  }

  get #strengthStatusId(): string {
    return `${this.#resolvedInputId}-strength-status`;
  }

  get #strengthMeterTestId(): string | undefined {
    const dataTestId = this.dataTestId;

    return dataTestId !== undefined ? `${dataTestId}-strength-meter` : undefined;
  }

  get #strengthLabelTestId(): string | undefined {
    const dataTestId = this.dataTestId;

    return dataTestId !== undefined ? `${dataTestId}-strength-label` : undefined;
  }

  #handleInput = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();

    const nextValue = (event.target as HTMLInputElement).value;

    this.#isSyncingValueFromInput = true;

    try {
      this.value = nextValue;
    } finally {
      this.#isSyncingValueFromInput = false;
    }

    this.#fieldElement.value = nextValue;
    this.#syncActions();
    this.#syncStrengthMeter();
    this.#syncInputAfterFieldRender();
    this.dispatchEvent(
      new CustomEvent<string>('update:value', {
        bubbles: true,
        composed: true,
        detail: nextValue,
      }),
    );
  };

  #handleToggleClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled || !this.canVisible) {
      return;
    }

    this.#isPasswordVisible = !this.#isPasswordVisible;
    this.render();
  };

  #handleCopyClick = async (event: MouseEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    if (this.#isCopyDisabled || !this.canCopy) {
      return;
    }

    try {
      await copyToClipboard(this.#normalizedValue);
      await this.#announceCopyResult(this.copySuccessMessage);
    } catch {
      await this.#announceCopyResult(this.copyErrorMessage);
    }
  };

  async #announceCopyResult(message: string): Promise<void> {
    this.#copyStatusMessage = '';
    this.render();
    await Promise.resolve();
    this.#copyStatusMessage = message;
    this.render();
  }
}

export function defineFormPassword(): typeof FormPasswordElement {
  if (typeof window !== 'undefined' && !window.customElements.get(FORM_PASSWORD_TAG_NAME)) {
    window.customElements.define(FORM_PASSWORD_TAG_NAME, FormPasswordElement);
  }

  return FormPasswordElement;
}

defineFormPassword();

export default FormPasswordElement;

import { SvgIconElement, defineSvgIcon } from '@/components/basic/SvgIcon/index.wc';
import { MessageTextElement, defineMessageText } from '@/components/feedback/MessageText/index.wc';
import { FieldLabelElement, defineFieldLabel } from '@/components/form/FieldLabel/index.wc';
import { UIKIT_NAME } from '@/constants';
import { renderCustomElement, syncNodeChildren } from '@/helpers/dom.helper';

const FORM_FIELD_TAG_NAME = `${UIKIT_NAME}-form-field`;
const FORM_FIELD_CLASS_NAME = `${UIKIT_NAME}-form-field`;
const BASE_FIELD_CLASS_NAME = `${FORM_FIELD_CLASS_NAME}__element`;
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);

type FormFieldValue = number | string | string[] | null | undefined;
let nextGeneratedFieldId = 0;

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

  if (!value) {
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

function getNextGeneratedFieldId(): string {
  nextGeneratedFieldId += 1;

  return `${FORM_FIELD_CLASS_NAME}-${nextGeneratedFieldId}`;
}

function getNodesTextContent(nodes: Node[]): string | undefined {
  const normalizedText = nodes
    .map((node) => node.textContent?.trim() ?? '')
    .filter(Boolean)
    .join(' ')
    .trim();

  return normalizedText.length > 0 ? normalizedText : undefined;
}

defineSvgIcon();
defineMessageText();
defineFieldLabel();

export class FormFieldElement extends HTMLElement {
  static readonly tagName = FORM_FIELD_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'after',
      'before',
      'can-erase',
      'class',
      'data-testid',
      'disabled',
      'icon-after',
      'icon-before',
      'id',
      'label',
      'max-length',
      'name',
      'placeholder',
      'readonly',
      'required',
      'right-erase-position',
      'value',
      'aria-label',
      'aria-labelledby',
    ];
  }

  #additionalAfterElement = document.createElement('span');
  #additionalBeforeElement = document.createElement('span');
  #additionalNodes: Node[] = [];
  #assistiveDescriptionElement = document.createElement('span');
  #boundFieldElement: HTMLElement | null = null;
  #contentElement = document.createElement('div');
  #defaultNodes: Node[] = [];
  #descriptionMessageElement = document.createElement(
    MessageTextElement.tagName,
  ) as MessageTextElement;
  #descriptionNodes: Node[] = [];
  #eraseButtonElement = document.createElement('button');
  #eraseIconElement = document.createElement(SvgIconElement.tagName) as SvgIconElement;
  #errorMessageElement = document.createElement(MessageTextElement.tagName) as MessageTextElement;
  #errorNodes: Node[] = [];
  #fieldLabelElement = document.createElement(FieldLabelElement.tagName) as FieldLabelElement;
  #hintNodes: Node[] = [];
  #iconAfterElement = document.createElement(SvgIconElement.tagName) as SvgIconElement;
  #iconBeforeElement = document.createElement(SvgIconElement.tagName) as SvgIconElement;
  #generatedFieldId = getNextGeneratedFieldId();
  #isMounted = false;
  #isSyncingDom = false;
  #managedControlAttributeNames = new Set<string>();
  #managedControlClassNames = new Set<string>();
  #maxLengthMessageElement = document.createElement(
    MessageTextElement.tagName,
  ) as MessageTextElement;
  #mutationObserver: MutationObserver | null = null;
  #rootElement = document.createElement('div');
  #successMessageElement = document.createElement(MessageTextElement.tagName) as MessageTextElement;
  #successNodes: Node[] = [];
  #valueOverride = false;
  #valueProp: FormFieldValue = undefined;

  constructor() {
    super();

    this.#eraseIconElement.name = 'cross';
    this.#eraseIconElement.setAttribute('class', `${FORM_FIELD_CLASS_NAME}__erase-icon`);
    this.#eraseButtonElement.type = 'button';
    this.#eraseButtonElement.className = `${FORM_FIELD_CLASS_NAME}__erase-button`;
    this.#eraseButtonElement.setAttribute('aria-label', 'Usun wartosc pola');
    this.#eraseButtonElement.addEventListener('click', this.#handleEraseClick);
  }

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

  attributeChangedCallback(name: string): void {
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    if (name === 'value' && this.#valueOverride) {
      return;
    }

    this.render();
  }

  get afterText(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('after'));
  }

  set afterText(value: string | null | undefined) {
    setStringAttribute(this, 'after', value);
  }

  get beforeText(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('before'));
  }

  set beforeText(value: string | null | undefined) {
    setStringAttribute(this, 'before', value);
  }

  get canErase(): boolean {
    return getBooleanAttributeValue(this, 'can-erase');
  }

  set canErase(value: boolean) {
    setBooleanAttribute(this, 'can-erase', value);
  }

  get disabled(): boolean {
    return getBooleanAttributeValue(this, 'disabled');
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, 'disabled', value);
  }

  get iconAfter(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('icon-after'));
  }

  set iconAfter(value: string | null | undefined) {
    setStringAttribute(this, 'icon-after', value);
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

  get placeholder(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('placeholder'));
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

  get rightErasePosition(): number | undefined {
    return getNumberAttributeValue(this, 'right-erase-position');
  }

  set rightErasePosition(value: number | null | undefined) {
    setNumberAttribute(this, 'right-erase-position', value);
  }

  get value(): FormFieldValue {
    if (this.#valueOverride) {
      return this.#valueProp;
    }

    const valueAttribute = this.getAttribute('value');

    return valueAttribute ?? undefined;
  }

  set value(value: FormFieldValue) {
    this.#valueOverride = true;
    this.#valueProp = value;

    if (typeof value === 'string' || typeof value === 'number') {
      this.setAttribute('value', String(value));
    } else {
      this.removeAttribute('value');
    }

    if (this.#isMounted) {
      this.render();
    }
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalNodes();
      this.#syncHost();
      this.#syncRoot();
      this.#syncLabel();
      this.#syncFieldElement();
      this.#syncContent();
      this.#syncMessages();
      this.#syncChildren();
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
        changedNodes.every((node) => this.#isManagedNode(node) || this.#isTrackedNode(node))
      );
    });
  }

  #isManagedNode(node: Node): boolean {
    return (
      node === this.#rootElement ||
      node === this.#fieldLabelElement ||
      node === this.#contentElement ||
      node === this.#iconBeforeElement ||
      node === this.#iconAfterElement ||
      node === this.#additionalBeforeElement ||
      node === this.#additionalAfterElement ||
      node === this.#eraseButtonElement ||
      node === this.#assistiveDescriptionElement ||
      node === this.#descriptionMessageElement ||
      node === this.#maxLengthMessageElement ||
      node === this.#errorMessageElement ||
      node === this.#successMessageElement
    );
  }

  #isTrackedNode(node: Node): boolean {
    return (
      this.#defaultNodes.includes(node) ||
      this.#additionalNodes.includes(node) ||
      this.#hintNodes.includes(node) ||
      this.#descriptionNodes.includes(node) ||
      this.#errorNodes.includes(node) ||
      this.#successNodes.includes(node)
    );
  }

  #collectExternalNodes(): void {
    const trackedNodes = [
      ...this.#defaultNodes,
      ...this.#additionalNodes,
      ...this.#hintNodes,
      ...this.#descriptionNodes,
      ...this.#errorNodes,
      ...this.#successNodes,
    ];
    const directNodes = normalizeNodes(
      Array.from(this.childNodes).filter((node) => node !== this.#rootElement),
    );
    const sourceNodes = normalizeNodes(
      Array.from(new Set([...directNodes, ...trackedNodes])).filter(
        (node) => directNodes.includes(node) || this.contains(node),
      ),
    );
    const nextDefaultNodes: Node[] = [];
    const nextAdditionalNodes: Node[] = [];
    const nextHintNodes: Node[] = [];
    const nextDescriptionNodes: Node[] = [];
    const nextErrorNodes: Node[] = [];
    const nextSuccessNodes: Node[] = [];

    sourceNodes.forEach((node) => {
      const slotName = node instanceof Element ? node.getAttribute('slot') : null;

      switch (slotName) {
        case 'additional':
          nextAdditionalNodes.push(node);
          break;
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
          nextDefaultNodes.push(node);
          break;
      }
    });

    this.#defaultNodes = nextDefaultNodes;
    this.#additionalNodes = nextAdditionalNodes;
    this.#hintNodes = nextHintNodes;
    this.#descriptionNodes = nextDescriptionNodes;
    this.#errorNodes = nextErrorNodes;
    this.#successNodes = nextSuccessNodes;
  }

  #syncHost(): void {
    if (!this.style.display) {
      this.style.display = 'block';
    }

    if (this.#rootElement.parentNode !== this) {
      this.appendChild(this.#rootElement);
    }
  }

  #syncRoot(): void {
    this.#rootElement.className = FORM_FIELD_CLASS_NAME;

    if (this.dataTestId) {
      this.#rootElement.setAttribute('data-testid', this.dataTestId);
    } else {
      this.#rootElement.removeAttribute('data-testid');
    }
  }

  #syncLabel(): void {
    if (!this.label) {
      this.#fieldLabelElement.remove();
      return;
    }

    this.#fieldLabelElement.setAttribute('for', this.#resolvedFieldId);
    this.#fieldLabelElement.text = this.label;
    this.#fieldLabelElement.readonly = this.readonly;
    this.#fieldLabelElement.required = this.required;
    this.#fieldLabelElement.dataTestId = this.dataTestId;
    syncNodeChildren(this.#fieldLabelElement, this.#hintNodes);
    renderCustomElement(this.#fieldLabelElement);
  }

  #syncFieldElement(): void {
    const resolvedFieldElement =
      this.#defaultNodes.find((node): node is HTMLElement => node instanceof HTMLElement) ?? null;

    if (this.#boundFieldElement !== resolvedFieldElement) {
      this.#boundFieldElement = resolvedFieldElement;
      this.#managedControlAttributeNames = new Set();
      this.#managedControlClassNames = new Set();
    }

    if (!resolvedFieldElement) {
      return;
    }

    this.#syncControlClasses(resolvedFieldElement);
    this.#syncControlAttributes(resolvedFieldElement);
    this.#syncControlState(resolvedFieldElement);
  }

  #syncControlClasses(fieldElement: HTMLElement): void {
    const nextManagedClassNames = new Set(
      [BASE_FIELD_CLASS_NAME, ...this.#fieldClassNames, ...this.#hostFieldClassNames].filter(
        Boolean,
      ),
    );
    const currentClassNames = new Set(
      getNormalizedAttributeValue(fieldElement.getAttribute('class'))
        ?.split(/\s+/)
        .filter(Boolean) ?? [],
    );

    for (const className of this.#managedControlClassNames) {
      currentClassNames.delete(className);
    }

    for (const className of nextManagedClassNames) {
      currentClassNames.add(className);
    }

    fieldElement.setAttribute('class', Array.from(currentClassNames).join(' '));
    this.#managedControlClassNames = nextManagedClassNames;
  }

  #syncControlAttributes(fieldElement: HTMLElement): void {
    const nextAttributes = new Map<string, string>();
    const describedById = this.#describedById;

    nextAttributes.set('aria-disabled', String(this.disabled));
    nextAttributes.set('aria-invalid', String(this.#hasErrorSlot));
    nextAttributes.set('aria-required', String(this.required || false));
    nextAttributes.set('data-disabled', String(this.disabled));
    nextAttributes.set('id', this.#resolvedFieldId);
    nextAttributes.set('name', this.name);

    if (this.#fieldAriaLabel) {
      nextAttributes.set('aria-label', this.#fieldAriaLabel);
    }

    if (this.#fieldAriaLabelledBy) {
      nextAttributes.set('aria-labelledby', this.#fieldAriaLabelledBy);
    }

    if (describedById) {
      nextAttributes.set('aria-describedby', describedById);
    }

    if (this.placeholder) {
      nextAttributes.set('placeholder', this.placeholder);
    }

    if (this.maxLength !== undefined) {
      nextAttributes.set('maxlength', String(this.maxLength));
    }

    for (const [name, value] of nextAttributes) {
      fieldElement.setAttribute(name, value);
    }

    for (const name of this.#managedControlAttributeNames) {
      if (!nextAttributes.has(name)) {
        fieldElement.removeAttribute(name);
      }
    }

    this.#managedControlAttributeNames = new Set(nextAttributes.keys());
  }

  #syncControlState(fieldElement: HTMLElement): void {
    fieldElement.style.setProperty('--pr', this.#paddingRightValue);
    fieldElement.style.setProperty('--pl', this.#paddingLeftValue);

    if ('readOnly' in fieldElement) {
      (fieldElement as HTMLInputElement | HTMLTextAreaElement).readOnly = this.readonly;
    }

    if ('disabled' in fieldElement) {
      (fieldElement as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).disabled =
        this.disabled;
    }

    if (this.readonly) {
      fieldElement.setAttribute('readonly', '');
    } else {
      fieldElement.removeAttribute('readonly');
    }

    if (this.disabled) {
      fieldElement.setAttribute('disabled', '');
    } else {
      fieldElement.removeAttribute('disabled');
    }

    this.#syncControlValue(fieldElement);
  }

  #syncControlValue(fieldElement: HTMLElement): void {
    const value = this.value;

    if (fieldElement instanceof HTMLInputElement || fieldElement instanceof HTMLTextAreaElement) {
      if (typeof value === 'string' || typeof value === 'number') {
        fieldElement.value = String(value);
        fieldElement.setAttribute('value', String(value));
        return;
      }

      if (value === null || value === undefined) {
        fieldElement.value = '';
        fieldElement.removeAttribute('value');
        return;
      }
    }

    if (fieldElement instanceof HTMLSelectElement) {
      if (Array.isArray(value) && fieldElement.multiple) {
        Array.from(fieldElement.options).forEach((option) => {
          option.selected = value.includes(option.value);
        });
        return;
      }

      if (typeof value === 'string' || typeof value === 'number') {
        fieldElement.value = String(value);
      }
    }
  }

  #syncContent(): void {
    this.#contentElement.className = `${FORM_FIELD_CLASS_NAME}__content`;

    const contentChildren: Node[] = [];

    if (this.iconBefore) {
      this.#iconBeforeElement.name = this.iconBefore;
      this.#iconBeforeElement.setAttribute(
        'class',
        `${FORM_FIELD_CLASS_NAME}__icon ${FORM_FIELD_CLASS_NAME}__icon--before`,
      );
      contentChildren.push(this.#iconBeforeElement);
    } else {
      this.#iconBeforeElement.remove();
    }

    if (this.iconAfter) {
      this.#iconAfterElement.name = this.iconAfter;
      this.#iconAfterElement.setAttribute(
        'class',
        `${FORM_FIELD_CLASS_NAME}__icon ${FORM_FIELD_CLASS_NAME}__icon--after`,
      );
      contentChildren.push(this.#iconAfterElement);
    } else {
      this.#iconAfterElement.remove();
    }

    contentChildren.push(...this.#additionalNodes);
    contentChildren.push(...this.#defaultNodes);

    if (this.beforeText) {
      this.#additionalBeforeElement.className = `${FORM_FIELD_CLASS_NAME}__additional ${FORM_FIELD_CLASS_NAME}__additional--before`;
      this.#additionalBeforeElement.setAttribute('data-before', this.beforeText);
      this.#additionalBeforeElement.style.paddingLeft = this.iconBefore ? '2rem' : '0.75rem';
      contentChildren.push(this.#additionalBeforeElement);
    } else {
      this.#additionalBeforeElement.remove();
    }

    if (this.afterText) {
      this.#additionalAfterElement.className = `${FORM_FIELD_CLASS_NAME}__additional ${FORM_FIELD_CLASS_NAME}__additional--after`;
      this.#additionalAfterElement.setAttribute('data-after', this.afterText);
      this.#additionalAfterElement.style.paddingRight = this.iconAfter ? '2rem' : '0.75rem';
      contentChildren.push(this.#additionalAfterElement);
    } else {
      this.#additionalAfterElement.remove();
    }

    if (this.#isEraseButtonVisible) {
      if (this.#eraseButtonTestId) {
        this.#eraseButtonElement.setAttribute('data-testid', this.#eraseButtonTestId);
      } else {
        this.#eraseButtonElement.removeAttribute('data-testid');
      }

      this.#eraseButtonElement.style.setProperty('--right', this.#eraseButtonRightValue);
      syncNodeChildren(this.#eraseButtonElement, [this.#eraseIconElement]);
      contentChildren.push(this.#eraseButtonElement);
    } else {
      this.#eraseButtonElement.remove();
    }

    syncNodeChildren(this.#contentElement, contentChildren);
  }

  #syncMessages(): void {
    this.#syncDescriptionMessage();
    this.#syncMaxLengthMessage();
    this.#syncErrorMessage();
    this.#syncSuccessMessage();
  }

  #syncDescriptionMessage(): void {
    this.#descriptionMessageElement.id = this.#descriptionMessageId;
    this.#descriptionMessageElement.size = 'xs';
    this.#descriptionMessageElement.setAttribute('class', `${FORM_FIELD_CLASS_NAME}__message`);
    this.#descriptionMessageElement.removeAttribute('role');
    this.#descriptionMessageElement.removeAttribute('aria-live');
    this.#descriptionMessageElement.removeAttribute('aria-atomic');

    if (this.#descriptionTestId) {
      this.#descriptionMessageElement.dataTestId = this.#descriptionTestId;
    } else {
      this.#descriptionMessageElement.dataTestId = undefined;
    }

    syncNodeChildren(this.#descriptionMessageElement, this.#descriptionNodes);
    renderCustomElement(this.#descriptionMessageElement);
  }

  #syncMaxLengthMessage(): void {
    this.#maxLengthMessageElement.id = this.#maxLengthMessageId;
    this.#maxLengthMessageElement.size = 'xs';
    this.#maxLengthMessageElement.variant =
      this.maxLength === this.#stringValueLength ? 'info' : 'default';
    this.#maxLengthMessageElement.setAttribute('class', `${FORM_FIELD_CLASS_NAME}__message`);
    this.#maxLengthMessageElement.setAttribute('role', 'status');
    this.#maxLengthMessageElement.setAttribute('aria-live', 'polite');
    this.#maxLengthMessageElement.setAttribute('aria-atomic', 'true');

    if (this.#descriptionMaxLengthTestId) {
      this.#maxLengthMessageElement.dataTestId = this.#descriptionMaxLengthTestId;
    } else {
      this.#maxLengthMessageElement.dataTestId = undefined;
    }

    this.#maxLengthMessageElement.replaceChildren(
      document.createTextNode(
        `Dlugosc tekstu: ${this.#stringValueLength} / ${this.maxLength ?? 0} znakow`,
      ),
    );
    renderCustomElement(this.#maxLengthMessageElement);
  }

  #syncErrorMessage(): void {
    this.#errorMessageElement.id = this.#errorMessageId;
    this.#errorMessageElement.size = 'xs';
    this.#errorMessageElement.variant = 'error';
    this.#errorMessageElement.setAttribute('class', `${FORM_FIELD_CLASS_NAME}__message`);
    this.#errorMessageElement.setAttribute('role', 'alert');
    this.#errorMessageElement.setAttribute('aria-live', 'assertive');
    this.#errorMessageElement.setAttribute('aria-atomic', 'true');

    if (this.#errorTestId) {
      this.#errorMessageElement.dataTestId = this.#errorTestId;
    } else {
      this.#errorMessageElement.dataTestId = undefined;
    }

    syncNodeChildren(this.#errorMessageElement, this.#errorNodes);
    renderCustomElement(this.#errorMessageElement);
  }

  #syncSuccessMessage(): void {
    this.#successMessageElement.id = this.#successMessageId;
    this.#successMessageElement.size = 'xs';
    this.#successMessageElement.variant = 'success';
    this.#successMessageElement.setAttribute('class', `${FORM_FIELD_CLASS_NAME}__message`);
    this.#successMessageElement.setAttribute('role', 'status');
    this.#successMessageElement.setAttribute('aria-live', 'polite');
    this.#successMessageElement.setAttribute('aria-atomic', 'true');

    if (this.#successTestId) {
      this.#successMessageElement.dataTestId = this.#successTestId;
    } else {
      this.#successMessageElement.dataTestId = undefined;
    }

    syncNodeChildren(this.#successMessageElement, this.#successNodes);
    renderCustomElement(this.#successMessageElement);
  }

  #syncAssistiveDescription(): void {
    const assistiveText = this.#assistiveDescriptionText;

    if (!assistiveText) {
      this.#assistiveDescriptionElement.remove();
      return;
    }

    this.#assistiveDescriptionElement.id = this.#assistiveDescriptionId;
    this.#assistiveDescriptionElement.className = `${FORM_FIELD_CLASS_NAME}__message--sr-only`;
    this.#assistiveDescriptionElement.textContent = assistiveText;

    if (this.#assistiveDescriptionTestId) {
      this.#assistiveDescriptionElement.setAttribute(
        'data-testid',
        this.#assistiveDescriptionTestId,
      );
    } else {
      this.#assistiveDescriptionElement.removeAttribute('data-testid');
    }
  }

  #syncChildren(): void {
    const children: Node[] = [];

    if (this.label) {
      children.push(this.#fieldLabelElement);
    } else {
      this.#fieldLabelElement.remove();
    }

    children.push(this.#contentElement);

    const visibleMessageElement = this.#visibleMessageElement;

    if (visibleMessageElement) {
      children.push(visibleMessageElement);
    }

    this.#syncAssistiveDescription();

    if (this.#assistiveDescriptionText) {
      children.push(this.#assistiveDescriptionElement);
    }

    syncNodeChildren(this.#rootElement, children);
  }

  get #fieldClassNames(): string[] {
    const classNames: string[] = [];

    if (this.value !== '') {
      classNames.push(`${FORM_FIELD_CLASS_NAME}__element--medium`);
    }

    if (this.value === '') {
      classNames.push(`${FORM_FIELD_CLASS_NAME}__element--normal`);
    }

    if (this.disabled) {
      classNames.push(`${FORM_FIELD_CLASS_NAME}__element--disabled`);
    }

    if (this.readonly) {
      classNames.push(`${FORM_FIELD_CLASS_NAME}__element--readonly`);
    }

    if (!this.readonly) {
      classNames.push(`${FORM_FIELD_CLASS_NAME}__element--basic`);
    }

    if (this.#hasErrorSlot) {
      classNames.push(`${FORM_FIELD_CLASS_NAME}__element--error`);
    }

    if (this.#hasSuccessSlot) {
      classNames.push(`${FORM_FIELD_CLASS_NAME}__element--success`);
    }

    return classNames;
  }

  get #hostFieldClassNames(): string[] {
    return (
      getNormalizedAttributeValue(this.getAttribute('class'))?.split(/\s+/).filter(Boolean) ?? []
    );
  }

  get #descriptionMessageId(): string {
    return `${this.#resolvedFieldId}-help-description`;
  }

  get #maxLengthMessageId(): string {
    return `${this.#resolvedFieldId}-help-max-length-description`;
  }

  get #errorMessageId(): string {
    return `${this.#resolvedFieldId}-error`;
  }

  get #successMessageId(): string {
    return `${this.#resolvedFieldId}-success`;
  }

  get #explicitAriaLabel(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('aria-label'));
  }

  get #explicitAriaLabelledBy(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('aria-labelledby'));
  }

  get #fieldAriaLabel(): string | undefined {
    return (
      this.#explicitAriaLabel ??
      (!this.label && !this.#explicitAriaLabelledBy ? this.name : undefined)
    );
  }

  get #fieldAriaLabelledBy(): string | undefined {
    return this.label ? undefined : this.#explicitAriaLabelledBy;
  }

  get #describedById(): string | undefined {
    const describedByIds = new Set<string>();

    if (this.#visibleMessageElement === this.#errorMessageElement) {
      describedByIds.add(this.#errorMessageId);
    }

    if (this.#visibleMessageElement === this.#successMessageElement) {
      describedByIds.add(this.#successMessageId);
    }

    if (this.#visibleMessageElement === this.#maxLengthMessageElement) {
      describedByIds.add(this.#maxLengthMessageId);
    }

    if (this.#visibleMessageElement === this.#descriptionMessageElement) {
      describedByIds.add(this.#descriptionMessageId);
    }

    if (this.#assistiveDescriptionText) {
      describedByIds.add(this.#assistiveDescriptionId);
    }

    return describedByIds.size > 0 ? Array.from(describedByIds).join(' ') : undefined;
  }

  get #paddingRightValue(): string {
    const after = this.afterText;

    if (after) {
      return `${this.iconAfter ? after.length * 7.5 + 12 + (this.canErase ? 16 : 0) + 24 : after.length * 7.5 + 12 + (this.canErase ? 16 : 0)}px`;
    }

    return this.iconAfter ? '32px' : '12px';
  }

  get #paddingLeftValue(): string {
    const before = this.beforeText;

    if (before) {
      return `${this.iconBefore ? before.length * 7.5 + 14 + 24 : before.length * 7.5 + 14}px`;
    }

    return this.iconBefore ? '32px' : '12px';
  }

  get #isEraseButtonVisible(): boolean {
    const value = this.value;

    if (typeof value === 'object') {
      return this.canErase && Array.isArray(value) && value.length > 0 && !this.disabled;
    }

    return this.canErase && value !== undefined && value !== '' && !this.disabled;
  }

  get #stringValueLength(): number {
    return typeof this.value === 'string' ? this.value.length : 0;
  }

  get #hasDescriptionSlot(): boolean {
    return this.#descriptionNodes.length > 0;
  }

  get #hasErrorSlot(): boolean {
    return this.#errorNodes.length > 0;
  }

  get #hasSuccessSlot(): boolean {
    return this.#successNodes.length > 0;
  }

  get #resolvedFieldId(): string {
    return getNormalizedAttributeValue(this.id) ?? this.#generatedFieldId;
  }

  get #visibleMessageElement(): MessageTextElement | null {
    if (this.#hasErrorSlot) {
      return this.#errorMessageElement;
    }

    if (this.#hasSuccessSlot) {
      return this.#successMessageElement;
    }

    if (this.maxLength !== undefined) {
      return this.#maxLengthMessageElement;
    }

    if (this.#hasDescriptionSlot) {
      return this.#descriptionMessageElement;
    }

    return null;
  }

  get #assistiveDescriptionId(): string {
    return `${this.#resolvedFieldId}-assistive-description`;
  }

  get #assistiveDescriptionText(): string | undefined {
    const texts: string[] = [];
    const visibleMessageElement = this.#visibleMessageElement;

    if (this.#hasDescriptionSlot && visibleMessageElement !== this.#descriptionMessageElement) {
      const descriptionText = getNodesTextContent(this.#descriptionNodes);

      if (descriptionText) {
        texts.push(descriptionText);
      }
    }

    if (this.maxLength !== undefined && visibleMessageElement !== this.#maxLengthMessageElement) {
      texts.push(`Dlugosc tekstu: ${this.#stringValueLength} / ${this.maxLength} znakow`);
    }

    return texts.length > 0 ? texts.join(' ') : undefined;
  }

  get #descriptionTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-help-description` : undefined;
  }

  get #errorTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-error` : undefined;
  }

  get #successTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-success` : undefined;
  }

  get #descriptionMaxLengthTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-help-max-length-description` : undefined;
  }

  get #assistiveDescriptionTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-assistive-description` : undefined;
  }

  get #eraseButtonTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-erase-button` : undefined;
  }

  get #eraseButtonRightValue(): string {
    if (this.afterText) {
      return `${this.rightErasePosition}px`;
    }

    if (this.#additionalNodes.length > 0) {
      return '40px';
    }

    return `${this.iconAfter ? 30 : 12}px`;
  }

  #handleEraseClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('on:remove', { bubbles: true, composed: true }));
  };
}

export function defineFormField(): typeof FormFieldElement {
  if (typeof window !== 'undefined' && !window.customElements.get(FORM_FIELD_TAG_NAME)) {
    window.customElements.define(FORM_FIELD_TAG_NAME, FormFieldElement);
  }

  return FormFieldElement;
}

defineFormField();

export default FormFieldElement;

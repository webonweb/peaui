import { upgradeCustomElementProperties } from '@/helpers/dom.helper';
import { connectFormReset } from '@/helpers/form-reset.helper';
import { FormFieldElement, defineFormField } from '@/components/form/FormField/index.wc';
import { UIKIT_NAME } from '@/constants';
import { syncNodeChildren } from '@/helpers/dom.helper';

const FORM_INPUT_TAG_NAME = `${UIKIT_NAME}-form-input`;
const FORM_INPUT_CLASS_NAME = `${UIKIT_NAME}-form-field-input`;
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);
const NON_FORWARDED_INPUT_ATTRIBUTES = new Set([
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
  'style',
  'value',
]);

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
  if (value !== true) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, '');
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

defineFormField();

export class FormInputElement extends HTMLElement {
  #disconnectFormReset?: () => void;
  static readonly tagName = FORM_INPUT_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'after',
      'before',
      'can-erase',
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
      'value',
      'type',
      'autocomplete',
      'pattern',
      'form',
      'inputmode',
      'minlength',
      'maxlength',
      'multiple',
      'size',
      'spellcheck',
      'autocapitalize',
      'enterkeyhint',
      'title',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
    ];
  }

  #descriptionNodes: Node[] = [];
  #fieldElement = document.createElement(FormFieldElement.tagName);
  #forwardedInputAttributeNames = new Set<string>();
  #hintNodes: Node[] = [];
  #inputElement = document.createElement('input');
  #isMounted = false;
  #isSyncingDom = false;
  #isSyncingValueFromInput = false;
  #mutationObserver: MutationObserver | null = null;
  #successNodes: Node[] = [];
  #errorNodes: Node[] = [];

  constructor() {
    super();

    this.#inputElement.addEventListener('input', this.#handleInput);
    this.#fieldElement.addEventListener('on:remove', this.#handleFieldRemove);
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
      this.#syncField();
      this.#syncFieldChildren();
      this.#fieldElement.render();
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
        // Declared attributes already render synchronously; arbitrary native
        // attributes still need to reach the inner control after connection.
        return (
          FormInputElement.observedAttributes.includes(name) ||
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
    return node === this.#fieldElement;
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
      Array.from(this.childNodes).filter((node) => node !== this.#fieldElement),
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
  }

  #syncInput(): void {
    const nextAttributes = new Map<string, string>();

    this.#inputElement.type = this.getAttribute('type') || 'text';
    this.#inputElement.className = FORM_INPUT_CLASS_NAME;
    this.#inputElement.setAttribute('data-type', 'input');

    if (this.dataTestId) {
      this.#inputElement.setAttribute('data-testid', `${this.dataTestId}-element`);
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

  #syncField(): void {
    this.#fieldElement.afterText = this.afterText;
    this.#fieldElement.beforeText = this.beforeText;
    this.#fieldElement.canErase = this.canErase;
    this.#fieldElement.disabled = this.disabled;
    this.#fieldElement.iconAfter = this.iconAfter;
    this.#fieldElement.iconBefore = this.iconBefore;
    this.#fieldElement.id = this.id ? `${this.id}-field` : '';
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
    syncNodeChildren(this.#fieldElement, [
      ...this.#hintNodes,
      this.#inputElement,
      ...this.#descriptionNodes,
      ...this.#errorNodes,
      ...this.#successNodes,
    ]);
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
    this.dispatchEvent(
      new CustomEvent<string>('update:value', {
        bubbles: true,
        composed: true,
        detail: nextValue,
      }),
    );
  };

  #handleFieldRemove = (event: Event): void => {
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent('on:remove', { bubbles: true, composed: true }));
    this.value = '';
    this.dispatchEvent(
      new CustomEvent<string>('update:value', {
        bubbles: true,
        composed: true,
        detail: '',
      }),
    );
  };
}

export function defineFormInput(): typeof FormInputElement {
  if (typeof window !== 'undefined' && !window.customElements.get(FORM_INPUT_TAG_NAME)) {
    window.customElements.define(FORM_INPUT_TAG_NAME, FormInputElement);
  }

  return FormInputElement;
}

defineFormInput();

export default FormInputElement;

export type FormTagsInputMode = 'freeform' | 'suggestions-only';
export type FormTagsInputLayout = 'inline' | 'stacked';
export type FormTagsInputPlacement = 'auto' | 'top' | 'bottom';

export type FormTagsInputItem = {
  id?: string | number;
  label: string;
  value?: unknown;
  disabled?: boolean;
};

export type FormTagsInputTag = string | FormTagsInputItem;
export type FormTagsInputNormalizer = (input: string) => FormTagsInputTag;
export type FormTagsInputValidator = (
  tag: FormTagsInputTag,
  tags: readonly FormTagsInputTag[],
) => boolean | string;
export type FormTagsInputKeyGetter = (tag: FormTagsInputTag, index: number) => string | number;
export type FormTagsInputSerializer = (tag: FormTagsInputTag, index: number) => string;
export type FormTagsInputSuggestionProvider = (
  query: string,
  signal: AbortSignal,
) => Promise<readonly FormTagsInputTag[]>;

export type FormTagsInputInvalidReason =
  'duplicate' | 'empty' | 'invalid' | 'max' | 'suggestion-only';

export type FormTagsInputInvalidDetail = {
  input: string;
  reason: FormTagsInputInvalidReason;
  message: string;
  index: number;
};

export type FormTagsInputCommitOptions = {
  allowDuplicates: boolean;
  allowCreate: boolean;
  max?: number;
  normalizeTag?: FormTagsInputNormalizer;
  validateTag?: FormTagsInputValidator;
  getTagKey?: FormTagsInputKeyGetter;
  suggestions?: readonly FormTagsInputTag[];
};

export type FormTagsInputCommitResult = {
  accepted: FormTagsInputTag[];
  invalid: FormTagsInputInvalidDetail[];
  maxReached: boolean;
};

export function getTagsInputLabel(tag: FormTagsInputTag): string {
  return typeof tag === 'string' ? tag : tag.label;
}

export function getTagsInputKey(
  tag: FormTagsInputTag,
  index: number,
  getTagKey?: FormTagsInputKeyGetter,
): string | number {
  if (getTagKey) return getTagKey(tag, index);
  if (typeof tag !== 'string' && tag.id !== undefined) return tag.id;
  if (typeof tag !== 'string' && tag.value !== undefined) {
    if (typeof tag.value === 'string' || typeof tag.value === 'number') return tag.value;
    const serialized = JSON.stringify(tag.value);
    if (typeof serialized === 'string') return serialized;
  }
  return getTagsInputLabel(tag).trim().toLocaleLowerCase();
}

export function isTagsInputItemDisabled(
  tag: FormTagsInputTag,
  index: number,
  disabledTags: readonly (string | number)[] = [],
  getTagKey?: FormTagsInputKeyGetter,
): boolean {
  if (typeof tag !== 'string' && tag.disabled === true) return true;
  const key = getTagsInputKey(tag, index, getTagKey);
  const normalizedLabel = getTagsInputLabel(tag).trim().toLocaleLowerCase();
  return disabledTags.some(
    (disabledKey) =>
      Object.is(disabledKey, key) ||
      `${disabledKey}`.trim().toLocaleLowerCase() === normalizedLabel,
  );
}

export function parseTagsInput(
  input: string,
  separators: readonly string[] = [',', ';', '\n'],
): string[] {
  const normalizedSeparators = [...new Set(separators.filter(Boolean))].sort(
    (left, right) => right.length - left.length,
  );
  if (normalizedSeparators.length === 0) return input.trim() ? [input.trim()] : [];
  const pattern = normalizedSeparators.map(escapeRegularExpression).join('|');
  return input
    .split(new RegExp(pattern, 'gu'))
    .map((part) => part.trim())
    .filter(Boolean);
}

export function normalizeTagsInputCandidate(
  input: string,
  normalizeTag?: FormTagsInputNormalizer,
): FormTagsInputTag {
  const normalizedInput = input.trim();
  return normalizeTag ? normalizeTag(normalizedInput) : normalizedInput;
}

export function areTagsInputTagsEqual(
  left: FormTagsInputTag,
  right: FormTagsInputTag,
  getTagKey?: FormTagsInputKeyGetter,
): boolean {
  return Object.is(getTagsInputKey(left, 0, getTagKey), getTagsInputKey(right, 0, getTagKey));
}

const negativeZeroKey = Symbol('negative-zero-tag-key');

/** Indexes the same identities as areTagsInputTagsEqual, including Object.is(-0, 0). */
export function createTagsInputMatcher(
  tags: readonly FormTagsInputTag[],
  getTagKey?: FormTagsInputKeyGetter,
): (tag: FormTagsInputTag) => boolean {
  const keyFor = (tag: FormTagsInputTag): string | number | symbol => {
    const key = getTagsInputKey(tag, 0, getTagKey);
    return Object.is(key, -0) ? negativeZeroKey : key;
  };
  const keys = new Set(tags.map(keyFor));
  return (tag) => keys.has(keyFor(tag));
}

export function commitTagsInput(
  inputs: readonly string[],
  currentTags: readonly FormTagsInputTag[],
  options: FormTagsInputCommitOptions,
): FormTagsInputCommitResult {
  const accepted: FormTagsInputTag[] = [];
  const invalid: FormTagsInputInvalidDetail[] = [];
  let maxReached = false;

  for (const [index, rawInput] of inputs.entries()) {
    const input = rawInput.trim();
    if (!input) {
      invalid.push(invalidDetail(input, 'empty', 'Tag nie może być pusty.', index));
      continue;
    }

    let candidate: FormTagsInputTag;
    try {
      candidate = normalizeTagsInputCandidate(input, options.normalizeTag);
    } catch {
      invalid.push(
        invalidDetail(input, 'invalid', 'Nie udało się znormalizować wartości tagu.', index),
      );
      continue;
    }

    if (!getTagsInputLabel(candidate).trim()) {
      invalid.push(invalidDetail(input, 'empty', 'Tag nie może być pusty.', index));
      continue;
    }

    if (!options.allowCreate) {
      const matchingSuggestion = options.suggestions?.find(
        (suggestion) =>
          areTagsInputTagsEqual(suggestion, candidate, options.getTagKey) ||
          getTagsInputLabel(suggestion).trim().toLocaleLowerCase() ===
            getTagsInputLabel(candidate).trim().toLocaleLowerCase(),
      );
      if (matchingSuggestion === undefined) {
        invalid.push(
          invalidDetail(input, 'suggestion-only', 'Wybierz wartość z listy sugestii.', index),
        );
        continue;
      }
      candidate = matchingSuggestion;
    }

    const comparedTags = currentTags.concat(accepted);
    if (
      !options.allowDuplicates &&
      comparedTags.some((tag) => areTagsInputTagsEqual(tag, candidate, options.getTagKey))
    ) {
      invalid.push(invalidDetail(input, 'duplicate', 'Ten tag został już dodany.', index));
      continue;
    }

    if (options.max !== undefined && comparedTags.length >= normalizeTagsInputMax(options.max)) {
      maxReached = true;
      invalid.push(invalidDetail(input, 'max', 'Osiągnięto maksymalną liczbę tagów.', index));
      continue;
    }

    const validation = options.validateTag?.(candidate, comparedTags);
    if (validation !== undefined && validation !== true) {
      invalid.push(
        invalidDetail(
          input,
          'invalid',
          typeof validation === 'string' ? validation : 'Wartość tagu jest nieprawidłowa.',
          index,
        ),
      );
      continue;
    }

    accepted.push(candidate);
  }

  return { accepted, invalid, maxReached };
}

export function normalizeTagsInputMax(max: number | undefined): number {
  if (max === undefined || !Number.isFinite(max)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor(max));
}

export function serializeTagsInputTag(
  tag: FormTagsInputTag,
  index: number,
  serializer?: FormTagsInputSerializer,
): string {
  if (serializer) return serializer(tag, index);
  if (typeof tag === 'string') return tag;
  if (tag.value !== undefined) {
    return typeof tag.value === 'string' ? tag.value : JSON.stringify(tag.value);
  }
  return tag.label;
}

function invalidDetail(
  input: string,
  reason: FormTagsInputInvalidReason,
  message: string,
  index: number,
): FormTagsInputInvalidDetail {
  return { index, input, message, reason };
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

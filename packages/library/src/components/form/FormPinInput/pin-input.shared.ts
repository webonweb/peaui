export type FormPinInputType = 'numeric' | 'alphanumeric';
export type FormPinInputSize = 's' | 'm' | 'l';
export type FormPinInputInputMode =
  'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
export type FormPinInputTransformMode = 'none' | 'uppercase' | 'lowercase';
export type FormPinInputTransform =
  FormPinInputTransformMode | ((character: string, index: number) => string);
export type FormPinInputInvalidReason = 'character' | 'pattern' | 'transform' | 'overflow';

export type FormPinInputInvalidDetail = {
  input: string;
  rejected: string;
  reason: FormPinInputInvalidReason;
  index: number;
};

export type FormPinInputOptions = {
  length: number;
  type: FormPinInputType;
  pattern?: string;
  transform?: FormPinInputTransform;
};

export type FormPinInputApplication = {
  value: string;
  accepted: string;
  invalid?: FormPinInputInvalidDetail;
  nextIndex: number;
};

export const DEFAULT_PIN_LENGTH = 6;
export const MIN_PIN_LENGTH = 1;
export const MAX_PIN_LENGTH = 32;

export function normalizePinLength(length: number): number {
  if (!Number.isFinite(length)) return DEFAULT_PIN_LENGTH;
  return Math.min(MAX_PIN_LENGTH, Math.max(MIN_PIN_LENGTH, Math.trunc(length)));
}

function transformCharacter(
  character: string,
  index: number,
  transform: FormPinInputTransform | undefined,
): string {
  if (typeof transform === 'function') return transform(character, index);
  if (transform === 'uppercase') return character.toUpperCase();
  if (transform === 'lowercase') return character.toLowerCase();
  return character;
}

function matchesPattern(character: string, pattern: string | undefined): boolean {
  if (!pattern) return true;
  try {
    return new RegExp(`^(?:${pattern})$`, 'u').test(character);
  } catch {
    return false;
  }
}

function characterReason(
  character: string,
  type: FormPinInputType,
  pattern: string | undefined,
): FormPinInputInvalidReason | undefined {
  if (type === 'numeric' && !/^[0-9]$/.test(character)) return 'character';
  if (type === 'alphanumeric' && !/^[a-z0-9]$/i.test(character)) return 'character';
  if (!matchesPattern(character, pattern)) return 'pattern';
  return undefined;
}

export function normalizePinCharacters(
  input: string,
  options: FormPinInputOptions,
  startIndex = 0,
): { accepted: string; invalid?: FormPinInputInvalidDetail } {
  const accepted: string[] = [];
  const rejected: string[] = [];
  let firstReason: FormPinInputInvalidReason | undefined;
  const available = Math.max(0, normalizePinLength(options.length) - startIndex);

  for (const rawCharacter of Array.from(input)) {
    const transformed = transformCharacter(
      rawCharacter,
      startIndex + accepted.length,
      options.transform,
    );
    if (Array.from(transformed).length !== 1) {
      rejected.push(rawCharacter);
      firstReason ??= 'transform';
      continue;
    }

    const reason = characterReason(transformed, options.type, options.pattern);
    if (reason) {
      rejected.push(rawCharacter);
      firstReason ??= reason;
      continue;
    }

    if (accepted.length >= available) {
      rejected.push(rawCharacter);
      firstReason ??= 'overflow';
      continue;
    }
    accepted.push(transformed);
  }

  return {
    accepted: accepted.join(''),
    invalid:
      rejected.length > 0
        ? {
            input,
            rejected: rejected.join(''),
            reason: firstReason ?? 'character',
            index: startIndex,
          }
        : undefined,
  };
}

export function normalizePinValue(value: string, options: FormPinInputOptions): string {
  return normalizePinCharacters(value, options).accepted;
}

export function applyPinInput(
  currentValue: string,
  index: number,
  input: string,
  options: FormPinInputOptions,
): FormPinInputApplication {
  const length = normalizePinLength(options.length);
  const safeIndex = Math.min(length - 1, Math.max(0, Math.trunc(index)));
  const current = normalizePinValue(currentValue, options);
  const effectiveIndex = Math.min(safeIndex, current.length);
  const { accepted, invalid } = normalizePinCharacters(input, options, effectiveIndex);
  const cells = Array.from({ length }, (_, cellIndex) => current[cellIndex] ?? '');

  for (const [offset, character] of Array.from(accepted).entries()) {
    cells[effectiveIndex + offset] = character;
  }

  const value = cells.join('').slice(0, length);
  return {
    value,
    accepted,
    invalid,
    nextIndex: Math.min(length - 1, effectiveIndex + Math.max(accepted.length, 1)),
  };
}

export function removePinCharacter(value: string, index: number): string {
  if (index < 0 || index >= value.length) return value;
  return `${value.slice(0, index)}${value.slice(index + 1)}`;
}

export function getPinCellLabel(type: FormPinInputType, index: number, length: number): string {
  const noun = type === 'numeric' ? 'Cyfra' : 'Znak';
  return `${noun} ${index + 1} z ${normalizePinLength(length)}`;
}

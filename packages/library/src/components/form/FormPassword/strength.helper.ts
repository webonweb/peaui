export const PASSWORD_STRENGTH_SEGMENTS = 5;

const PASSWORD_SPECIAL_CHARACTER_REGEXP = /[$@+#!%^?;:>",.'\u2019\u201D]/;
const PERSONAL_DATA_REGEXP_LIST = [
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
  /\d{11}/,
  /\d{9,}/,
  /\d{2}[./-]?\d{2}[./-]?\d{4}/,
];
const KEYBOARD_SEQUENCE_LIST = [
  '0123456789',
  'abcdefghijklmnopqrstuvwxyz',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
];
const COMMON_PERSONAL_DATA_TOKENS = [
  'adam',
  'agata',
  'agnieszka',
  'aleksandra',
  'alicja',
  'anna',
  'bartosz',
  'cezary',
  'damian',
  'dawid',
  'ewa',
  'filip',
  'grzegorz',
  'hubert',
  'izabela',
  'jakub',
  'jan',
  'joanna',
  'jozef',
  'julian',
  'justyna',
  'karol',
  'katarzyna',
  'klaudia',
  'krzysztof',
  'lukasz',
  'magdalena',
  'marek',
  'maria',
  'marcin',
  'marta',
  'mateusz',
  'michal',
  'monika',
  'nataliia',
  'natalia',
  'ola',
  'paulina',
  'pawel',
  'piotr',
  'robert',
  'sebastian',
  'slawomir',
  'stanislaw',
  'tomasz',
  'wojciech',
  'zofia',
];

export type PasswordStrengthTone = 'neutral' | 'danger' | 'warning' | 'success';

export type PasswordStrengthCheckKey =
  | 'minimumLength'
  | 'lowercaseLetter'
  | 'uppercaseLetter'
  | 'digits'
  | 'specialCharacter'
  | 'personalData'
  | 'sequence';

export type PasswordStrengthCheck = {
  isPassed: boolean;
  message: string;
};

export type PasswordStrengthChecks = Record<PasswordStrengthCheckKey, PasswordStrengthCheck>;

export type PasswordStrengthResult = {
  activeSegments: number;
  assistiveText: string;
  checks: PasswordStrengthChecks;
  failedRules: string[];
  isEmpty: boolean;
  isValid: boolean;
  label: string;
  level: 0 | 1 | 2 | 3 | 4;
  tone: PasswordStrengthTone;
  validationMessage: string;
};

function normalizePasswordValue(password: string): string {
  return password
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function reverseText(value: string): string {
  return Array.from(value).reverse().join('');
}

function containsPersonalData(password: string): boolean {
  const normalizedPassword = normalizePasswordValue(password);

  if (COMMON_PERSONAL_DATA_TOKENS.some((token) => normalizedPassword.includes(token))) {
    return true;
  }

  return PERSONAL_DATA_REGEXP_LIST.some((pattern) => pattern.test(password));
}

function isAlphabetCharacter(character: string): boolean {
  return /^[a-z]$/.test(character);
}

function isDigitCharacter(character: string): boolean {
  return /^\d$/.test(character);
}

function hasSequentialAlphabetOrDigitRun(password: string): boolean {
  const normalizedPassword = normalizePasswordValue(password);
  const segments = normalizedPassword.match(/[a-z0-9]+/g) ?? [];

  for (const segment of segments) {
    let ascendingRunLength = 1;
    let descendingRunLength = 1;

    for (let index = 1; index < segment.length; index += 1) {
      const previousCharacter = segment[index - 1] ?? '';
      const currentCharacter = segment[index] ?? '';
      const isSameCharacterGroup =
        (isAlphabetCharacter(previousCharacter) && isAlphabetCharacter(currentCharacter)) ||
        (isDigitCharacter(previousCharacter) && isDigitCharacter(currentCharacter));

      if (!isSameCharacterGroup) {
        ascendingRunLength = 1;
        descendingRunLength = 1;
        continue;
      }

      const characterDiff = currentCharacter.charCodeAt(0) - previousCharacter.charCodeAt(0);

      ascendingRunLength = characterDiff === 1 ? ascendingRunLength + 1 : 1;
      descendingRunLength = characterDiff === -1 ? descendingRunLength + 1 : 1;

      if (ascendingRunLength >= 4 || descendingRunLength >= 4) {
        return true;
      }
    }
  }

  return false;
}

function hasKeyboardSequence(password: string): boolean {
  const normalizedPassword = normalizePasswordValue(password);

  for (const sequence of KEYBOARD_SEQUENCE_LIST) {
    const reversedSequence = reverseText(sequence);

    for (let index = 0; index <= normalizedPassword.length - 4; index += 1) {
      const fragment = normalizedPassword.slice(index, index + 4);

      if (!/^[a-z0-9]{4}$/.test(fragment)) {
        continue;
      }

      if (sequence.includes(fragment) || reversedSequence.includes(fragment)) {
        return true;
      }
    }
  }

  return false;
}

function containsDisallowedSequence(password: string): boolean {
  return hasSequentialAlphabetOrDigitRun(password) || hasKeyboardSequence(password);
}

function countMatchingCharacters(password: string, pattern: RegExp): number {
  return Array.from(password).filter((character) => pattern.test(character)).length;
}

function getPasswordStrengthLevel(input: {
  allRulesPassed: boolean;
  digitsCount: number;
  isLongerThanStrongMinimum: boolean;
  passedChecksCount: number;
  specialCharactersCount: number;
}): 0 | 1 | 2 | 3 | 4 {
  const {
    allRulesPassed,
    digitsCount,
    isLongerThanStrongMinimum,
    passedChecksCount,
    specialCharactersCount,
  } = input;

  if (
    allRulesPassed &&
    isLongerThanStrongMinimum &&
    digitsCount >= 3 &&
    specialCharactersCount >= 2
  ) {
    return 4;
  }

  if (allRulesPassed) {
    return 3;
  }

  if (passedChecksCount >= 5) {
    return 2;
  }

  if (passedChecksCount >= 3) {
    return 1;
  }

  return 0;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const normalizedPassword = password.trim();
  const digitsCount = countMatchingCharacters(password, /\d/);
  const specialCharactersCount = countMatchingCharacters(
    password,
    PASSWORD_SPECIAL_CHARACTER_REGEXP,
  );
  const checks: PasswordStrengthChecks = {
    minimumLength: {
      isPassed: password.length >= 12,
      message: 'co najmniej 12 znakow',
    },
    lowercaseLetter: {
      isPassed: /[a-z]/.test(password),
      message: 'co najmniej 1 mala litera (a-z)',
    },
    uppercaseLetter: {
      isPassed: /[A-Z]/.test(password),
      message: 'co najmniej 1 wielka litera (A-Z)',
    },
    digits: {
      isPassed: digitsCount >= 2,
      message: 'co najmniej 2 cyfry (0-9)',
    },
    specialCharacter: {
      isPassed: specialCharactersCount >= 1,
      message: `co najmniej 1 znak specjalny ($@+#!%^?;:>",'.)`,
    },
    personalData: {
      isPassed: !containsPersonalData(password),
      message: 'nie moze zawierac imion ani innych danych osobowych',
    },
    sequence: {
      isPassed: !containsDisallowedSequence(password),
      message: 'nie moze zawierac kolejnych liter lub cyfr (np. 1234, abcd, qwerty)',
    },
  };
  const failedRules = Object.values(checks)
    .filter((check) => !check.isPassed)
    .map((check) => check.message);
  const passedChecksCount = Object.values(checks).filter((check) => check.isPassed).length;
  const allRulesPassed = failedRules.length === 0;
  const isEmpty = normalizedPassword.length === 0;
  let level: 0 | 1 | 2 | 3 | 4 = 0;

  if (!isEmpty) {
    level = getPasswordStrengthLevel({
      allRulesPassed,
      digitsCount,
      isLongerThanStrongMinimum: password.length >= 16,
      passedChecksCount,
      specialCharactersCount,
    });
  }

  let tone: PasswordStrengthTone = 'neutral';

  if (!isEmpty) {
    if (level <= 1) {
      tone = 'danger';
    } else if (level === 2) {
      tone = 'warning';
    } else {
      tone = 'success';
    }
  }

  const strengthLabels = ['Bardzo slabe', 'Slabe', 'Srednie', 'Silne', 'Bardzo silne'] as const;
  const label = isEmpty ? 'Wpisz haslo' : strengthLabels[level];
  const activeSegments = isEmpty ? 0 : level + 1;
  const isValid = isEmpty || allRulesPassed;
  const validationMessage =
    !isValid && failedRules.length > 0
      ? `Haslo nie spelnia wymagan: ${failedRules.join('; ')}.`
      : '';
  let assistiveText = 'Sila hasla: wpisz haslo.';

  if (!isEmpty) {
    assistiveText = isValid
      ? `Sila hasla: ${label}. Haslo spelnia wszystkie wymagania.`
      : `Sila hasla: ${label}. Niespelnione wymagania: ${failedRules.join('; ')}.`;
  }

  return {
    activeSegments,
    assistiveText,
    checks,
    failedRules,
    isEmpty,
    isValid,
    label,
    level,
    tone,
    validationMessage,
  };
}

/**
 * Formats a given string by performing the following transformations:
 * 1. Removes Polish diacritical marks (e.g., ą → a, ś → s).
 * 2. Converts all characters to lowercase.
 * 3. Replaces all spaces with hyphens (`-`).
 *
 * @param input - The input string to format.
 * @returns The formatted string with Polish characters removed, lowercase letters, and spaces replaced by hyphens.
 *
 * @example
 * ```typescript
 * const formattedText = sanitizeToSlug('Zażółć gęślą jaźń');
 * console.log(formattedText); // Output: "zazolc-gesla-jazn"
 * ```
 */
export function sanitizeToSlug(input: string): string {
  const polishCharsMap: { [key: string]: string } = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'a',
    Ć: 'c',
    Ę: 'e',
    Ł: 'l',
    Ń: 'n',
    Ó: 'o',
    Ś: 's',
    Ź: 'z',
    Ż: 'z',
    '.': '',
  };

  return input
    .split('')
    .map((char) => polishCharsMap[char] ?? char)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '-')
    .replace(/\(/g, '')
    .replace(/\)/g, '');
}

export const slugify = sanitizeToSlug;

/**
 * Capitalizes the first letter of a given string.
 * @param input - The string to be transformed.
 * @returns The transformed string with the first letter capitalized.
 */
export function capitalizeFirstLetter(input: string): string {
  if (input.length === 0) {
    return input;
  }
  return input.charAt(0).toUpperCase() + input.slice(1);
}

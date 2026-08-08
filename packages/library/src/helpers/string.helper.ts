/** Converts text to a stable, lowercase slug without Polish diacritics. */
export function sanitizeToSlug(input: string): string {
  const polishCharsMap: Record<string, string> = {
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
  };

  return input
    .split('')
    .map((character) => polishCharsMap[character] ?? character)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '')
    .replace(/[()]/g, '');
}

export const slugify = sanitizeToSlug;

/** Returns the input with its first character converted to uppercase. */
export function capitalizeFirstLetter(input: string): string {
  if (input.length === 0) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

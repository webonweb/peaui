/**
 * countDecimalPlaces
 *
 * Determines how many digits appear after the decimal point in a given number.
 * Supports plain decimal notation as well as negative scientific notation (e.g. `1.23e-4`).
 *
 * @param value - The number to analyze. Can be any finite numeric value.
 * @returns The count of decimal places in `value`. Returns 0 for integers, `NaN`, `Infinity`, or `-Infinity`.
 */
export function countDecimalPlaces(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const str = value.toString();
  const eMatch = str.match(/^-?\d(?:\.(\d+))?e-(\d+)$/i);
  if (eMatch) {
    const fractionalDigits = eMatch[1]?.length ?? 0;
    const exponent = parseInt(eMatch[2] ?? '0', 10);
    return fractionalDigits + exponent;
  }

  const parts = str.split('.');
  if (parts.length === 2 && typeof parts[1] === 'string') {
    return parts[1].length;
  }

  return 0;
}

/**
 * Returns the range of items (1-indexed) for a given pagination page.
 *
 * @param page       page number (starting from 1)
 * @param pageSize   number of records per page (e.g. 5, 10, 25, 50)
 * @param totalItems (optional) total number of records – if provided,
 *                   the range will not exceed the last available item
 * @returns          a string in the form "start-end"
 */
export function getPageRange(page: number, pageSize: number, totalItems?: number): string {
  if (page < 1 || pageSize < 1) {
    throw new Error('page i pageSize muszą być dodatnie (>= 1)');
  }

  const start = (page - 1) * pageSize + 1;
  let end = start + pageSize - 1;

  if (totalItems !== undefined) {
    end = Math.min(end, totalItems);
  }

  return `${start}-${end}`;
}

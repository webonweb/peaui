/**
 * Toggles a single string value in an array.
 * Adds the value when missing and removes it when already present.
 *
 * @param array - Source string array.
 * @param element - Value to toggle.
 * @returns Updated array.
 */
export function xorElement(array: string[], element: string): string[] {
  const index = array.indexOf(element);

  if (index === -1) {
    return [...array, element];
  }

  return array.filter((_, currentIndex) => currentIndex !== index);
}

/**
 * Merges an array of objects into a single object.
 * When keys overlap, values from later objects override earlier ones.
 *
 * @param items - The array of objects to merge.
 * @returns A single object containing the merged properties of all items.
 */
export function mergeArrayObjects<T extends object>(items: T[]): T {
  return items.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T);
}

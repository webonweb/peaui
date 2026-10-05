/**
 * Converts a flat object with dot‐separated keys into a nested object.
 *
 * @param obj - An object whose keys may include dot (`.`) separators denoting nested paths.
 *              For example: `{ 'a.b': 1, 'a.c': 2, 'd': 3 }`.
 * @param inner - Optional transformer applied recursively to nested plain objects in the result.
 * @returns A new object with nested structure according to the dot paths.
 *          For example: `{ a: { b: 1, c: 2 }, d: 3 }`.
 *
 * @example
 * const flat = {
 *   'user.name.first': 'Alice',
 *   'user.name.last': 'Smith',
 *   'user.age': 30,
 *   'active': true
 * };
 * const nested = unflatten(flat);
 * // nested === {
 * //   user: {
 * //     name: { first: 'Alice', last: 'Smith' },
 * //     age: 30
 * //   },
 * //   active: true
 * // }
 */
function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTransformableRecord(value: unknown): value is Record<string, unknown> {
  return isPlainRecord(value);
}

/** Object paths are data only; prototype-related keys are never traversed or assigned. */
export function isSafeObjectPath(path: string): boolean {
  return path.split('.').every((key) => !['__proto__', 'constructor', 'prototype'].includes(key));
}

export function setDeepValue(target: Record<string, unknown>, path: string, value: unknown): void {
  if (!isSafeObjectPath(path)) return;
  const keys = path.split('.');
  let cursor = target;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    const next = Object.hasOwn(cursor, key) ? cursor[key] : undefined;
    if (!isPlainRecord(next)) {
      const child: Record<string, unknown> = {};
      cursor[key] = child;
      cursor = child;
    } else {
      // Copy the path so a draft does not mutate nested objects owned by the consumer.
      const child = { ...next };
      cursor[key] = child;
      cursor = child;
    }
  });
}

export function unflatten(
  obj: Record<string, unknown>,
  inner?: (value: Record<string, unknown>) => unknown,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [flatKey, value] of Object.entries(obj)) {
    setDeepValue(result, flatKey, value);
  }

  if (inner !== undefined) {
    Object.keys(result).forEach((key) => {
      const value = result[key];

      if (isTransformableRecord(value)) {
        result[key] = inner(value);
      }
    });
  }

  return result;
}

/**
 * Reads a nested value from an object using dot notation.
 *
 * @param obj - Source object.
 * @param path - Dot-separated path.
 * @returns Resolved nested value or undefined.
 */
export function getDeepValue<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
): T | undefined {
  if (!isSafeObjectPath(path)) return undefined;
  let current: unknown = obj;

  for (const key of path.split('.')) {
    if (!isPlainRecord(current) || !Object.hasOwn(current, key)) {
      return undefined;
    }

    current = current[key];
  }

  return current as T | undefined;
}

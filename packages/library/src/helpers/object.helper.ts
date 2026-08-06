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
import { ArraySchema, NumberSchema, StringSchema } from 'yup';

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTransformableRecord(value: unknown): value is Record<string, unknown> {
  return (
    isPlainRecord(value) &&
    !(value instanceof StringSchema) &&
    !(value instanceof NumberSchema) &&
    !(value instanceof ArraySchema)
  );
}

export function unflatten(
  obj: Record<string, unknown>,
  inner?: (value: Record<string, unknown>) => unknown,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [flatKey, value] of Object.entries(obj)) {
    const keys = flatKey.split('.');
    let cursor: Record<string, unknown> = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        cursor[String(key)] = value;
      } else {
        const nextValue = cursor[String(key)];

        if (!isPlainRecord(nextValue)) {
          const nextCursor: Record<string, unknown> = {};
          cursor[String(key)] = nextCursor;
          cursor = nextCursor;
          continue;
        }

        cursor = nextValue;
      }
    }
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
  let current: unknown = obj;

  for (const key of path.split('.')) {
    if (!isPlainRecord(current)) {
      return undefined;
    }

    current = current[key];
  }

  return current as T | undefined;
}

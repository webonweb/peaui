export function cloneDemoValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => cloneDemoValue(entry)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneDemoValue(entry)]),
    ) as T;
  }

  return value;
}

function propertyName(value: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(value) ? value : JSON.stringify(value);
}

export function serializeDemoValue(value: unknown, depth = 0): string {
  if (value === undefined) return 'undefined';
  if (typeof value === 'function') return value.toString();
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return String(value);
  }

  const indent = '  '.repeat(depth);
  const childIndent = '  '.repeat(depth + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[\n${value
      .map((entry) => `${childIndent}${serializeDemoValue(entry, depth + 1)}`)
      .join(',\n')}\n${indent}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    return `{\n${entries
      .map(
        ([key, entry]) =>
          `${childIndent}${propertyName(key)}: ${serializeDemoValue(entry, depth + 1)}`,
      )
      .join(',\n')}\n${indent}}`;
  }

  return String(value);
}

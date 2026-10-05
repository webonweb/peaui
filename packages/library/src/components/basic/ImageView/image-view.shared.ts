/** Derives a readable fallback without interpreting data/blob URLs as user-facing names. */
export function getHumanizedSourceText(src: string | undefined): string | undefined {
  const source = src?.trim();
  if (!source || source.startsWith('data:') || source.startsWith('blob:')) return undefined;
  const segment = source.split('#')[0]?.split('?')[0]?.split('/').filter(Boolean).pop();
  if (!segment) return undefined;
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    // A literal percent sign in a file name must not prevent the image from rendering.
  }
  const label = decoded
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return label || undefined;
}

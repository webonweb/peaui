/**
 * Creates stable, short initials for avatar fallbacks.
 *
 * One-word names use the first two Unicode code points. Multi-word names use
 * the first code point of the first and last word. The result is intentionally
 * capped so long names cannot change the avatar's dimensions.
 */
export function getAvatarInitials(name: string | null | undefined): string {
  const parts = `${name ?? ''}`
    .trim()
    .split(/[\s_-]+/u)
    .filter(Boolean);

  if (parts.length === 0) return '';

  const firstPart = Array.from(parts[0] ?? '');
  const characters =
    parts.length === 1
      ? firstPart.slice(0, 2)
      : [firstPart[0] ?? '', Array.from(parts.at(-1) ?? '')[0] ?? ''];

  return characters.join('').toLocaleUpperCase();
}

export function normalizeAvatarInitials(initials: string | null | undefined): string {
  return Array.from(`${initials ?? ''}`.replace(/\s+/gu, '').trim())
    .slice(0, 3)
    .join('')
    .toLocaleUpperCase();
}

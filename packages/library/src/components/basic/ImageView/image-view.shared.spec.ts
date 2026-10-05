import { describe, expect, it } from 'vitest';
import { getHumanizedSourceText } from './image-view.shared';

describe('ImageView fallback text', () => {
  it.each([
    ['/photos/user%20profile-image.png?size=2#preview', 'user profile image'],
    ['/photos/100%_complete.png', '100% complete'],
    ['data:image/png;base64,abc', undefined],
    ['blob:https://example.test/id', undefined],
  ])('handles encoded and opaque sources: %s', (source, expected) => {
    expect(getHumanizedSourceText(source)).toBe(expected);
  });
});

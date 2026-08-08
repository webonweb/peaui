import { describe, expect, it, vi } from 'vitest';

import {
  areTagsInputTagsEqual,
  commitTagsInput,
  getTagsInputKey,
  isTagsInputItemDisabled,
  normalizeTagsInputMax,
  parseTagsInput,
  serializeTagsInputTag,
} from './tags-input.shared';

describe('FormTagsInput shared', () => {
  it('dzieli paste przy użyciu wielu separatorów i usuwa puste fragmenty', () => {
    expect(parseTagsInput(' Vue, React; WC\nTypeScript ')).toEqual([
      'Vue',
      'React',
      'WC',
      'TypeScript',
    ]);
    expect(parseTagsInput('alpha--beta', ['--'])).toEqual(['alpha', 'beta']);
  });

  it('normalizuje przed wykrywaniem duplikatów', () => {
    const result = commitTagsInput(['  VUE  ', 'react'], ['vue'], {
      allowCreate: true,
      allowDuplicates: false,
      normalizeTag: (input) => input.toLocaleLowerCase(),
    });

    expect(result.accepted).toEqual(['react']);
    expect(result.invalid[0]).toMatchObject({ input: 'VUE', reason: 'duplicate' });
  });

  it('egzekwuje limit dla całej porcji paste przed emisją modelu', () => {
    const result = commitTagsInput(['React', 'WC', 'TypeScript'], ['Vue'], {
      allowCreate: true,
      allowDuplicates: false,
      max: 3,
    });

    expect(result.accepted).toEqual(['React', 'WC']);
    expect(result.maxReached).toBe(true);
    expect(result.invalid.at(-1)?.reason).toBe('max');
  });

  it('w trybie suggestions-only zachowuje typowany obiekt sugestii', () => {
    const suggestion = { id: 7, label: 'Dostępność', value: 'a11y' };
    const result = commitTagsInput(['Dostępność'], [], {
      allowCreate: false,
      allowDuplicates: false,
      suggestions: [suggestion],
    });

    expect(result.accepted[0]).toBe(suggestion);
    expect(
      commitTagsInput(['Inny'], [], {
        allowCreate: false,
        allowDuplicates: false,
        suggestions: [suggestion],
      }).invalid[0]?.reason,
    ).toBe('suggestion-only');
  });

  it('przekazuje pełny, aktualny model do walidatora', () => {
    const validateTag = vi.fn(
      (tag) => `${typeof tag === 'string' ? tag : tag.label}`.length >= 3 || 'Minimum 3 znaki.',
    );
    const result = commitTagsInput(['UI', 'Vue'], ['React'], {
      allowCreate: true,
      allowDuplicates: false,
      validateTag,
    });

    expect(result.accepted).toEqual(['Vue']);
    expect(result.invalid[0]).toMatchObject({ message: 'Minimum 3 znaki.', reason: 'invalid' });
    expect(validateTag).toHaveBeenLastCalledWith('Vue', ['React']);
  });

  it('wyznacza stabilne klucze, disabled i serializację obiektów', () => {
    const tag = { id: 'vue', label: 'Vue', value: { slug: 'vue' } };
    expect(getTagsInputKey(tag, 0)).toBe('vue');
    expect(isTagsInputItemDisabled(tag, 0, ['vue'])).toBe(true);
    expect(serializeTagsInputTag(tag, 0)).toBe('{"slug":"vue"}');
    expect(serializeTagsInputTag(tag, 0, (item) => `tag:${getTagsInputKey(item, 0)}`)).toBe(
      'tag:vue',
    );
  });

  it('porównuje tagi po jawnym kluczu zamiast referencji', () => {
    const getTagKey = (tag: string | { label: string }) =>
      typeof tag === 'string' ? tag : tag.label.toLocaleLowerCase();
    expect(areTagsInputTagsEqual({ label: 'Vue' }, { label: 'vue' }, getTagKey)).toBe(true);
  });

  it('bezpiecznie normalizuje niepoprawne wartości max', () => {
    expect(normalizeTagsInputMax(-3)).toBe(0);
    expect(normalizeTagsInputMax(2.9)).toBe(2);
    expect(normalizeTagsInputMax(Number.NaN)).toBe(Number.POSITIVE_INFINITY);
  });
});

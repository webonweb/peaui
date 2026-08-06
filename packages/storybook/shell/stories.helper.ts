import type { Meta } from '@storybook/vue3'

/**
 * Provides utilities for managing settings and props in Storybook.
 * @returns A set of utility functions: `getProps` and `getSettings`.
 */
export function useSettingsStorie() {
  /**
   * Combines meta parameters and additional settings for a Storybook story.
   * @param meta - The Storybook Meta object containing story metadata.
   * @param concat - Additional settings to merge into the resulting object.
   * @returns An object containing combined settings, including props and metadata.
   */
  const getSettings = <T>(meta: Meta<T>, concat: Record<string, string | boolean> = {}) => {
    const category = meta.title
      ?.split('/')
      .slice(0, -1)
      .join(' / ')
      .replace(/^\d+\.\s*/, '');

    return {
      ...meta.parameters,
      category: category || 'Komponent',
      props: meta.argTypes
        ? Object.keys(meta.argTypes || {}).map(key => ({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...meta.argTypes[key],
          prop: key,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: meta.argTypes[key].types || meta.argTypes[key].type,
        }))
        : [],
      ...concat,
    }
  }

  return {
    getSettings,
  }
}

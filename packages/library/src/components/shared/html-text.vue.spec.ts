// @vitest-environment node
import { expect, it } from 'vitest';
import { stripHtmlUsingDom } from '@/helpers/functions.helper';

it('extracts table label text in SSR without DOM globals, including entities and quoted tag delimiters', () => {
  expect(stripHtmlUsingDom('<b title="a > b">Name &amp; surname</b><!-- hidden --> &#321;')).toBe(
    'Name & surname Ł',
  );
  expect(stripHtmlUsingDom('3 < 5 &nbsp;')).toBe('3 < 5 \u00a0');
});

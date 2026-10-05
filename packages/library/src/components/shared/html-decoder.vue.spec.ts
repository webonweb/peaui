import { describe, expect, it } from 'vitest';
import { decodeHTML as decodeBrowser } from '@/helpers/html-decoder.browser';
import { decodeHTML as decodeServer } from '@/helpers/html-decoder';

describe('browser and server HTML decoding', () => {
  it.each([
    'Name &amp; surname &#321; &nbsp;',
    '&NotEqualTilde; &acE; &CounterClockwiseContourIntegral;',
    '&#0; &#x1f600; &#128; &#xD800; &#99999999;',
    '&copycat &amp= &notit; &unknown;',
    '<script>alert(1)</script> &lt;img src=x&gt;',
    '3 < 5\r\n\0 &amp; next',
  ])('preserves complete entity semantics for %s', (value) => {
    expect(decodeBrowser(value)).toBe(decodeServer(value));
  });
});

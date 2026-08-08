export type ClipboardMethod = 'api' | 'fallback';

function fallbackCopy(text: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.inset = '0 auto auto -9999px';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand('copy');
  } finally {
    textarea.remove();
  }
}

export async function copyText(text: string): Promise<ClipboardMethod> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return 'api';
    } catch {
      // Some browsers expose Clipboard API but reject it outside a secure context.
    }
  }

  if (fallbackCopy(text)) return 'fallback';
  throw new Error('Clipboard is unavailable');
}

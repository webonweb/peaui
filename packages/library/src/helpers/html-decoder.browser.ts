let decoder: HTMLTextAreaElement | undefined;

/** Decode references only; markup is never inserted into the DOM or interpreted. */
export function decodeHTML(text: string): string {
  if (!text.includes('&')) return text;
  decoder ??= document.createElement('textarea');
  return text.replace(/&(?:#[xX][\da-fA-F]+;?|#\d+;?|[a-zA-Z][a-zA-Z\d]*;?)/g, (reference) => {
    decoder!.innerHTML = reference;
    return decoder!.value;
  });
}

import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue';

import { locale } from '../i18n';

const textPairs: Array<[english: string, polish: string]> = [
  [
    'Use the controls to crop, rotate and adjust the image.',
    'Użyj kontrolek, aby wykadrować, obrócić i dopasować zdjęcie.',
  ],
  ['Rotate right', 'Obróć w prawo'],
  ['Rotate right', 'Obroć w prawo'],
  ['Rotate left', 'Obróć w lewo'],
  ['Rotate left', 'Obroć w lewo'],
  ['Zoom in', 'Powiększ'],
  ['Align', 'Wyrównaj'],
  ['Discard', 'Odrzuć'],
  ['Selection', 'Wybór'],
  ['Loading… Please wait.', 'Ładowanie... Proszę czekać.'],
  ['Open fullscreen', 'Otwórz pełny ekran'],
  ['Items per page', 'Pokaż na stronie'],
];

const textNodePairs: Array<[english: string, polish: string]> = [
  ['Displayed ', 'Wyświetlono '],
  [' of ', ' z '],
  [' records', ' rekordów'],
  ['Text length: ', 'Długość tekstu: '],
  [' characters', ' znaków'],
];

function replacePairs(value: string): string {
  return textPairs.reduce(
    (result, [english, polish]) =>
      locale.value === 'en'
        ? result.replaceAll(polish, english)
        : result.replaceAll(english, polish),
    value,
  );
}

function replacePatterns(value: string): string {
  if (locale.value === 'en') {
    return value
      .replace(/Wyświetlane:\s*([^\s]+)\s*\/\s*([^\s]+)/g, 'Displayed: $1 / $2')
      .replace(/Wyświetlono\s+(\d+)\s+z\s+(\d+)/g, 'Displayed $1 of $2')
      .replace(/(\d+)\s+rekordów/g, '$1 records')
      .replace(/Długość tekstu:\s*(\d+)\s*\/\s*(\d+)\s*znaków/g, 'Text length: $1 / $2 characters');
  }

  return value
    .replace(/Displayed:\s*([^\s]+)\s*\/\s*([^\s]+)/g, 'Wyświetlane: $1 / $2')
    .replace(/Displayed\s+(\d+)\s+of\s+(\d+)/g, 'Wyświetlono $1 z $2')
    .replace(/(\d+)\s+records/g, '$1 rekordów')
    .replace(/Text length:\s*(\d+)\s*\/\s*(\d+)\s*characters/g, 'Długość tekstu: $1 / $2 znaków');
}

function translateText(value: string): string {
  return replacePatterns(replacePairs(value));
}

function translateTextNode(value: string): string {
  const pair = textNodePairs.find(([english, polish]) =>
    locale.value === 'en' ? value === polish : value === english,
  );
  if (pair) return locale.value === 'en' ? pair[0] : pair[1];
  return translateText(value);
}

function translateRoot(root: HTMLElement): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue) {
      const translated = translateTextNode(node.nodeValue);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    }
    node = walker.nextNode();
  }

  for (const element of root.querySelectorAll<HTMLElement>('[aria-label], [title]')) {
    for (const attribute of ['aria-label', 'title']) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const translated = translateText(value);
      if (translated !== value) element.setAttribute(attribute, translated);
    }
  }
}

export function useDemoTranslation(root: Ref<HTMLElement | undefined>) {
  let animationFrame = 0;
  let delayedTranslation = 0;
  const observer = new MutationObserver(() => scheduleTranslation());

  function translate(): void {
    if (root.value) translateRoot(root.value);
  }

  function scheduleTranslation(): void {
    window.cancelAnimationFrame(animationFrame);
    window.clearTimeout(delayedTranslation);
    animationFrame = window.requestAnimationFrame(translate);
    delayedTranslation = window.setTimeout(translate, 80);
  }

  watch(
    root,
    (element) => {
      observer.disconnect();
      if (!element) return;
      scheduleTranslation();
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['aria-label', 'title'],
        childList: true,
        characterData: true,
        subtree: true,
      });
    },
    { flush: 'post' },
  );

  watch(locale, () => void nextTick(scheduleTranslation));
  onBeforeUnmount(() => {
    window.cancelAnimationFrame(animationFrame);
    window.clearTimeout(delayedTranslation);
    observer.disconnect();
  });

  return { translateDemo: translate };
}

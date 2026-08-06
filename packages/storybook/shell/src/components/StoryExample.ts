import { createHighlighter } from "shiki";

import {
  defineCustomElement,
  getStringAttribute,
  setShadowContent,
  setStringAttribute,
} from "./shared";

export const STORY_EXAMPLE_TAG_NAME = "peaui-story-example";

const styles = `
  :host {
    display: block;
  }

  .story-source {
    overflow-x: auto;
    border-radius: 0.5rem;
    padding: 0 1rem;
    background-color: light-dark(rgba(0, 0, 0, 0.04), #ffffff);
    font-size: 0.875rem;
    line-height: 1.45;
  }

  .story-source :is(pre, code) {
    font-family: Consolas, "Courier New", monospace;
  }

  .story-source pre.shiki {
    background-color: transparent !important;
  }

  .story-source pre {
    margin: 0;
    background: transparent;
  }
`;

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getSingletonHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      langs: ["vue", "ts", "js", "html", "css", "json", "bash"],
      themes: ["github-light", "github-dark"],
    });
  }

  return highlighterPromise;
}

function normalizeLanguage(language: string): string {
  return language.trim() || "html";
}

export class StoryExampleElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["code", "language"];
  }

  #renderToken = 0;

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  get code(): string {
    return getStringAttribute(this, "code");
  }

  set code(value: string) {
    setStringAttribute(this, "code", value);
  }

  get language(): string {
    return normalizeLanguage(getStringAttribute(this, "language", "html"));
  }

  set language(value: string) {
    setStringAttribute(this, "language", normalizeLanguage(value));
  }

  render(): void {
    const shadowRoot = setShadowContent(
      this,
      styles,
      `
        <div class="story-source">
          <div data-role="code"></div>
        </div>
      `
    );

    void this.#renderCode(shadowRoot);
  }

  async #renderCode(shadowRoot: ShadowRoot): Promise<void> {
    const currentToken = ++this.#renderToken;
    const codeContainer =
      shadowRoot.querySelector<HTMLElement>('[data-role="code"]');

    if (!codeContainer) {
      return;
    }

    if (!this.code.trim()) {
      codeContainer.textContent = "";
      return;
    }

    const highlighter = await getSingletonHighlighter();
    const html = highlighter.codeToHtml(this.code, {
      lang: this.language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });

    if (currentToken !== this.#renderToken) {
      return;
    }

    codeContainer.innerHTML = html;

    const shikiElement = codeContainer.querySelector<HTMLElement>("pre.shiki");

    if (shikiElement) {
      shikiElement.style.backgroundColor = "transparent";
      shikiElement.style.margin = "0";
    }
  }
}

export function defineStoryExample(): typeof StoryExampleElement {
  defineCustomElement(STORY_EXAMPLE_TAG_NAME, StoryExampleElement);

  return StoryExampleElement;
}

export function createStoryExample(
  init: Partial<Pick<StoryExampleElement, "code" | "language">> = {}
): StoryExampleElement {
  const element = document.createElement(
    STORY_EXAMPLE_TAG_NAME
  ) as StoryExampleElement;

  if (init.language !== undefined) {
    element.language = init.language;
  }

  if (init.code !== undefined) {
    element.code = init.code;
  }

  return element;
}

defineStoryExample();

export default StoryExampleElement;

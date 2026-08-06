import {
  asBoolean,
  asString,
  defineCustomElement,
  replaceRenderableChildren,
  setShadowContent,
  type StoryContentSettings,
  type StoryRenderable,
} from "./shared";
import { STORY_EXAMPLE_TAG_NAME, StoryExampleElement } from "./StoryExample";
import { STORY_DETAILS_TAG_NAME, StoryDetialsElement } from "./StoryDetials";
import { STORY_PROPS_TAG_NAME, StoryPropsElement } from "./StoryProps";
import { STORY_SETTINGS_TAG_NAME, StorySettingsElement } from "./StorySettings";

export const STORY_CONTENT_TAG_NAME = "peaui-story-content";

const styles = `
  :host {
    display: block;
  }

  .story-content {
    display: grid;
    width: 800px;
    max-width: 100%;
    margin: 1.5rem auto 0;
    padding-bottom: 2.5rem;
    overflow: visible;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    row-gap: 1.5rem;
  }

  .story-content__preview {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 10rem;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border: 1px solid rgba(17, 24, 39, 0.05);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background-color: light-dark(#ffffff, #000000);
  }

  :host-context(body.dark-mode) .story-content__preview {
    background-color: #000000 !important;
  }

  .story-content__preview slot {
    display: block;
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  .story-content__preview ::slotted(*) {
    display: block;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }
`;

export class StoryContentElement extends HTMLElement {
  #settings: StoryContentSettings = {};

  connectedCallback(): void {
    this.render();
  }

  get settings(): StoryContentSettings {
    return this.#settings;
  }

  set settings(value: StoryContentSettings | null | undefined) {
    this.#settings = value ?? {};
    this.render();
  }

  render(): void {
    const shadowRoot = setShadowContent(
      this,
      styles,
      `
        <div class="story-content">
          <div data-role="details"></div>
          <div data-role="settings"></div>
          <div class="story-content__preview">
            <slot></slot>
          </div>
          <div data-role="example"></div>
          <div data-role="props"></div>
        </div>
      `,
    );

    const detailsTarget = shadowRoot.querySelector<HTMLElement>(
      '[data-role="details"]',
    );
    const settingsTarget = shadowRoot.querySelector<HTMLElement>(
      '[data-role="settings"]',
    );
    const exampleTarget = shadowRoot.querySelector<HTMLElement>(
      '[data-role="example"]',
    );
    const propsTarget = shadowRoot.querySelector<HTMLElement>(
      '[data-role="props"]',
    );

    if (detailsTarget) {
      const detailsElement = document.createElement(
        STORY_DETAILS_TAG_NAME,
      ) as StoryDetialsElement;

      detailsElement.name = asString(this.#settings.name);
      detailsElement.description = asString(this.#settings.description);

      detailsTarget.replaceChildren(detailsElement);
    }

    if (settingsTarget) {
      const settingsElement = document.createElement(
        STORY_SETTINGS_TAG_NAME,
      ) as StorySettingsElement;

      settingsElement.applyOptions({
        resize: asBoolean(this.#settings.resize, true),
        darkmode: asBoolean(this.#settings.darkmode, true),
      });

      settingsTarget.replaceChildren(settingsElement);
    }

    if (exampleTarget) {
      const exampleElement = document.createElement(
        STORY_EXAMPLE_TAG_NAME,
      ) as StoryExampleElement;

      exampleElement.language = asString(this.#settings.language, "html");
      exampleElement.code = asString(this.#settings.code);

      exampleTarget.replaceChildren(exampleElement);
    }

    if (propsTarget) {
      const propsElement = document.createElement(
        STORY_PROPS_TAG_NAME,
      ) as StoryPropsElement;

      propsElement.propsList = Array.isArray(this.#settings.props)
        ? this.#settings.props
        : [];

      propsTarget.replaceChildren(propsElement);
    }
  }
}

export function defineStoryContent(): typeof StoryContentElement {
  defineCustomElement(STORY_CONTENT_TAG_NAME, StoryContentElement);

  return StoryContentElement;
}

export function createStoryContent(
  init: {
    preview?: StoryRenderable;
    settings?: StoryContentSettings;
  } = {},
): StoryContentElement {
  const element = document.createElement(
    STORY_CONTENT_TAG_NAME,
  ) as StoryContentElement;

  if (init.settings) {
    element.settings = init.settings;
  }

  if (init.preview !== undefined) {
    replaceRenderableChildren(element, init.preview);
  }

  return element;
}

defineStoryContent();

export default StoryContentElement;

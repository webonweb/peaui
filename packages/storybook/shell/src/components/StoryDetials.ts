import {
  defineCustomElement,
  getStringAttribute,
  setShadowContent,
  setStringAttribute,
} from "./shared";

export const STORY_DETAILS_TAG_NAME = "peaui-story-details";

const styles = `
  :host {
    display: block;
    min-width: 0;
    max-width: 100%;
  }

  .story-details {
    display: grid;
    grid-template-rows: repeat(2, max-content);
    row-gap: 1rem;
  }

  .story-details__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .story-details__title {
    margin: 0;
    padding: 0;
    overflow-wrap: anywhere;
    font-size: clamp(2rem, 8vw, 3rem);
    font-weight: 700;
  }

  .story-details__description {
    margin: 0;
    overflow-wrap: anywhere;
    color: light-dark(rgba(0, 0, 0, 0.6), #ffffff);
    font-size: 1rem;
    line-height: 160%;
  }
`;

export class StoryDetialsElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["description", "name"];
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  get description(): string {
    return getStringAttribute(this, "description");
  }

  set description(value: string) {
    setStringAttribute(this, "description", value);
  }

  get name(): string {
    return getStringAttribute(this, "name");
  }

  set name(value: string) {
    setStringAttribute(this, "name", value);
  }

  render(): void {
    const shadowRoot = setShadowContent(
      this,
      styles,
      `
        <div class="story-details">
          <div class="story-details__header">
            <h3 class="story-details__title"></h3>
          </div>
          <p class="story-details__description"></p>
        </div>
      `,
    );

    const titleElement = shadowRoot.querySelector<HTMLHeadingElement>(
      ".story-details__title",
    );
    const descriptionElement = shadowRoot.querySelector<HTMLParagraphElement>(
      ".story-details__description",
    );

    if (titleElement) {
      titleElement.textContent = this.name;
    }

    if (descriptionElement) {
      descriptionElement.textContent = this.description;
    }
  }
}

export { StoryDetialsElement as StoryDetailsElement };

export function defineStoryDetials(): typeof StoryDetialsElement {
  defineCustomElement(STORY_DETAILS_TAG_NAME, StoryDetialsElement);

  return StoryDetialsElement;
}

export function createStoryDetials(
  init: Partial<Pick<StoryDetialsElement, "description" | "name">> = {},
): StoryDetialsElement {
  const element = document.createElement(
    STORY_DETAILS_TAG_NAME,
  ) as StoryDetialsElement;

  if (init.name !== undefined) {
    element.name = init.name;
  }

  if (init.description !== undefined) {
    element.description = init.description;
  }

  return element;
}

defineStoryDetials();

export default StoryDetialsElement;

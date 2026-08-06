import {
  defineCustomElement,
  replaceRenderableChildren,
  setShadowContent,
  type StoryRenderable,
} from "./shared";

export const STORY_PREVIEW_TAG_NAME = "peaui-story-preview";

const styles = `
  :host {
    display: block;
  }

  .story-preview {
    position: relative;
    display: flex;
    min-height: 10rem;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border: 1px solid rgba(17, 24, 39, 0.05);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background-color: light-dark(#ffffff, #000000);
  }

  :host-context(body.dark-mode) .story-preview {
    background-color: #000000 !important;
  }
`;

export class StoryPreviewElement extends HTMLElement {
  connectedCallback(): void {
    this.render();
  }

  render(): void {
    setShadowContent(
      this,
      styles,
      `
        <div class="story-preview">
          <slot></slot>
        </div>
      `
    );
  }
}

export function defineStoryPreview(): typeof StoryPreviewElement {
  defineCustomElement(STORY_PREVIEW_TAG_NAME, StoryPreviewElement);

  return StoryPreviewElement;
}

export function createStoryPreview(
  content?: StoryRenderable
): StoryPreviewElement {
  const element = document.createElement(
    STORY_PREVIEW_TAG_NAME
  ) as StoryPreviewElement;

  if (content !== undefined) {
    replaceRenderableChildren(element, content);
  }

  return element;
}

defineStoryPreview();

export default StoryPreviewElement;

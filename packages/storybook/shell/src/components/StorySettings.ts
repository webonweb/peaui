import {
  asBoolean,
  defineCustomElement,
  getBooleanAttribute,
  setBooleanAttribute,
  setShadowContent,
} from "./shared";

export const STORY_SETTINGS_TAG_NAME = "peaui-story-settings";

type SizeKey =
  "peaui-size-s" | "peaui-size-md" | "peaui-size-lg" | "peaui-size-xl";

const styles = `
  :host {
    display: block;
  }

  .story-settings {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .story-settings__title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .story-settings__actions {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
  }

  .story-settings__font-controls {
    display: flex;
    align-items: center;
    column-gap: 0.25rem;
  }

  .story-settings__font-percent {
    margin-right: 10px;
    font-size: 12px;
  }

  .story-settings__font-button,
  .story-settings__darkmode-button {
    display: inline-flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 9999px;
    background: transparent;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s ease;
  }

  .story-settings__font-button:hover,
  .story-settings__darkmode-button:hover {
    background-color: var(--primary-100, #e6f7c3);
  }

  .story-settings__font-button--large {
    font-size: 1rem;
  }

  .story-settings__divider {
    opacity: 0.6;
  }

  .story-settings__darkmode-icon {
    width: 1.375rem;
    height: 1.375rem;
  }
`;

const referenceSize: Record<
  "enlarge" | "reduce",
  Record<SizeKey, SizeKey | undefined>
> = {
  enlarge: {
    "peaui-size-s": "peaui-size-md",
    "peaui-size-md": "peaui-size-lg",
    "peaui-size-lg": "peaui-size-xl",
    "peaui-size-xl": undefined,
  },
  reduce: {
    "peaui-size-s": undefined,
    "peaui-size-md": "peaui-size-s",
    "peaui-size-lg": "peaui-size-md",
    "peaui-size-xl": "peaui-size-lg",
  },
};

const referenceSizePercent: Record<SizeKey, string> = {
  "peaui-size-s": "50%",
  "peaui-size-md": "100%",
  "peaui-size-lg": "150%",
  "peaui-size-xl": "200%",
};

export class StorySettingsElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["darkmode", "resize"];
  }

  #size: SizeKey = "peaui-size-md";

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  get darkmode(): boolean {
    return getBooleanAttribute(this, "darkmode", true);
  }

  set darkmode(value: boolean) {
    setBooleanAttribute(this, "darkmode", value);
  }

  get resize(): boolean {
    return getBooleanAttribute(this, "resize", true);
  }

  set resize(value: boolean) {
    setBooleanAttribute(this, "resize", value);
  }

  applyOptions(options: { darkmode?: boolean; resize?: boolean } = {}): void {
    if (options.darkmode !== undefined) {
      this.darkmode = asBoolean(options.darkmode, true);
    }

    if (options.resize !== undefined) {
      this.resize = asBoolean(options.resize, true);
    }
  }

  render(): void {
    const shadowRoot = setShadowContent(
      this,
      styles,
      `
        <div class="story-settings">
          <strong class="story-settings__title"># Przyklad uzycia:</strong>
          <div class="story-settings__actions">
            <div class="story-settings__font-controls" data-role="font-controls">
              <div class="story-settings__font-percent" data-role="font-percent"></div>
              <button
                aria-label="Zmniejsz rozmiar tekstu"
                class="story-settings__font-button story-settings__font-button--small"
                data-action="reduce"
                type="button"
              >
                -A
              </button>
              <button
                aria-label="Powieksz rozmiar tekstu"
                class="story-settings__font-button story-settings__font-button--large"
                data-action="enlarge"
                type="button"
              >
                +A
              </button>
            </div>
            <div class="story-settings__divider" data-role="divider">|</div>
            <button
              aria-label="Przelacz tryb ciemny"
              class="story-settings__darkmode-button"
              data-action="darkmode"
              type="button"
            >
              <svg
                class="story-settings__darkmode-icon"
                viewBox="0 0 512 512"
              >
                <g
                  transform="translate(0,512) scale(0.1,-0.1)"
                  fill="currentColor"
                  stroke="none"
                >
                  <path
                    d="M2345 4629 c-393 -41 -793 -208 -1101 -460 -535 -437 -822 -1127 -754 -1810 73 -719 510 -1349 1155 -1665 493 -241 1045 -279 1565 -108 781 257 1337 951 1420 1773 54 538 -115 1093 -462 1519 -438 536 -1134 823 -1823 751z m55 -2069 l0 -1750 -22 0 c-13 0 -63 7 -113 16 -729 126 -1299 690 -1437 1422 -32 168 -32 456 0 624 105 556 453 1015 961 1268 167 83 448 165 579 169l32 1 0 -1750z"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
      `,
    );

    const fontControls = shadowRoot.querySelector<HTMLElement>(
      '[data-role="font-controls"]',
    );
    const divider = shadowRoot.querySelector<HTMLElement>(
      '[data-role="divider"]',
    );
    const darkmodeButton = shadowRoot.querySelector<HTMLButtonElement>(
      '[data-action="darkmode"]',
    );
    const fontPercent = shadowRoot.querySelector<HTMLElement>(
      '[data-role="font-percent"]',
    );
    const reduceButton = shadowRoot.querySelector<HTMLButtonElement>(
      '[data-action="reduce"]',
    );
    const enlargeButton = shadowRoot.querySelector<HTMLButtonElement>(
      '[data-action="enlarge"]',
    );

    if (fontControls) {
      fontControls.hidden = !this.resize;
    }

    if (divider) {
      divider.hidden = !(this.resize && this.darkmode);
    }

    if (darkmodeButton) {
      darkmodeButton.hidden = !this.darkmode;
      darkmodeButton.onclick = () => this.#handleToggleDarkMode();
    }

    if (fontPercent) {
      fontPercent.textContent = `Przyblizenie: ${
        referenceSizePercent[this.#size]
      }`;
    }

    if (reduceButton) {
      reduceButton.onclick = () => this.#handleChangeFontSize("reduce");
    }

    if (enlargeButton) {
      enlargeButton.onclick = () => this.#handleChangeFontSize("enlarge");
    }
  }

  #handleChangeFontSize(type: "enlarge" | "reduce"): void {
    const nextSize = referenceSize[type][this.#size];

    document.body.classList.remove(this.#size);
    this.#size = nextSize ?? this.#size;
    document.body.classList.add(this.#size);
    this.render();
  }

  #handleToggleDarkMode(): void {
    document.body.classList.toggle("dark-mode");
  }
}

export function defineStorySettings(): typeof StorySettingsElement {
  defineCustomElement(STORY_SETTINGS_TAG_NAME, StorySettingsElement);

  return StorySettingsElement;
}

export function createStorySettings(
  options: Partial<Pick<StorySettingsElement, "darkmode" | "resize">> = {},
): StorySettingsElement {
  const element = document.createElement(
    STORY_SETTINGS_TAG_NAME,
  ) as StorySettingsElement;

  if (options.darkmode !== undefined) {
    element.darkmode = asBoolean(options.darkmode, true);
  }

  if (options.resize !== undefined) {
    element.resize = asBoolean(options.resize, true);
  }

  return element;
}

defineStorySettings();

export default StorySettingsElement;

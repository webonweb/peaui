import {
  asString,
  defineCustomElement,
  setShadowContent,
  toSummaryText,
  type StoryPropItem,
} from "./shared";

export const STORY_PROPS_TAG_NAME = "peaui-story-props";

const styles = `
  :host {
    display: block;
  }

  .story-props {
    display: grid;
    grid-template-rows: repeat(2, max-content);
    row-gap: 1rem;
  }

  .story-props__title {
    display: block;
    margin-bottom: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .story-props__description {
    margin: 0;
    color: light-dark(rgba(0, 0, 0, 0.6), #ffffff);
    font-size: 1rem;
    line-height: 160%;
  }

  .story-props__table {
    width: 100%;
    border-collapse: collapse;
    color: light-dark(#6b7280, #ffffff);
    font-size: 0.875rem;
    text-align: left;
  }

  .story-props__thead {
    background-color: light-dark(#f3f4f6, #1d232f);
  }

  .story-props__th {
    padding: 0.75rem 1.5rem;
    color: #374151;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .story-props__row {
    border-bottom: 1px solid #e5e7eb;
    background-color: light-dark(#ffffff, #04060a);
  }

  .story-props__row:hover {
    background-color: light-dark(#f9fafb, #1d232f);
  }

  .story-props__cell {
    padding: 1rem 1.5rem;
  }
`;

export class StoryPropsElement extends HTMLElement {
  #propsList: StoryPropItem[] = [];

  connectedCallback(): void {
    this.render();
  }

  get propsList(): StoryPropItem[] {
    return this.#propsList;
  }

  set propsList(value: StoryPropItem[] | null | undefined) {
    this.#propsList = Array.isArray(value) ? value : [];
    this.render();
  }

  render(): void {
    const shadowRoot = setShadowContent(
      this,
      styles,
      `
        <div class="story-props">
          <div class="story-props__intro">
            <strong class="story-props__title"># API Reference:</strong>
            <p class="story-props__description">
              Ta sekcja zawiera szczegolowy przeglad dostepnych wlasciwosci komponentu.
              Sluzy jako przewodnik dla programistow, jak korzystac z komponentu i
              konfigurowac go w swoich aplikacjach.
            </p>
          </div>

          <div class="story-props__table-wrapper">
            <br />
            <table class="story-props__table">
              <thead class="story-props__thead">
                <tr>
                  <th class="story-props__th" scope="col">Prop</th>
                  <th class="story-props__th" scope="col">Default</th>
                  <th class="story-props__th" scope="col">Type</th>
                  <th class="story-props__th" scope="col">Required</th>
                </tr>
              </thead>
              <tbody data-role="rows"></tbody>
            </table>
          </div>
        </div>
      `
    );

    const rowsTarget =
      shadowRoot.querySelector<HTMLTableSectionElement>('[data-role="rows"]');

    if (!rowsTarget) {
      return;
    }

    rowsTarget.replaceChildren();

    for (const item of this.#propsList) {
      const row = document.createElement("tr");
      row.className = "story-props__row";

      row.innerHTML = `
        <td class="story-props__cell"></td>
        <td class="story-props__cell"></td>
        <td class="story-props__cell"></td>
        <td class="story-props__cell"></td>
      `;

      const cells = row.querySelectorAll<HTMLTableCellElement>("td");
      const table = item.table;

      cells[0]!.textContent = asString(item.prop, "---");
      cells[1]!.textContent = toSummaryText(table?.defaultValue);
      cells[2]!.textContent = toSummaryText(table?.type);
      cells[3]!.textContent = table?.required === true ? "Yes" : "No";

      rowsTarget.appendChild(row);
    }
  }
}

export function defineStoryProps(): typeof StoryPropsElement {
  defineCustomElement(STORY_PROPS_TAG_NAME, StoryPropsElement);

  return StoryPropsElement;
}

export function createStoryProps(
  propsList: StoryPropItem[] = []
): StoryPropsElement {
  const element = document.createElement(
    STORY_PROPS_TAG_NAME
  ) as StoryPropsElement;

  element.propsList = propsList;

  return element;
}

defineStoryProps();

export default StoryPropsElement;

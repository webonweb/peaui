<script lang="ts" setup>
import type { StoryPropItem } from "./shared";
import { toSummaryText } from "./shared";

defineProps<{
  propsList: StoryPropItem[];
}>();

function getControlLabel(item: StoryPropItem): string {
  const control = item.control;

  if (control === false) {
    return "tylko kod";
  }

  const controlType = typeof control === "string" ? control : control?.type;

  if (Array.isArray(item.options) && item.options.length > 0) {
    return `${controlType || "select"} (${item.options.length})`;
  }

  return controlType || "wartość";
}
</script>

<template>
  <div class="story-props">
    <div v-if="propsList.length > 0" class="story-props__table-wrapper">
      <table class="story-props__table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Opis / dane wejściowe</th>
            <th scope="col">Typ</th>
            <th scope="col">Domyślnie</th>
            <th scope="col">Edycja</th>
            <th scope="col">Wymagany</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in propsList" :key="item.prop">
            <td>
              <code>{{ item.prop || "—" }}</code>
            </td>
            <td class="story-props__description">
              {{
                item.description ||
                "Konfiguruje zachowanie lub wygląd komponentu."
              }}
            </td>
            <td>
              <code>{{ toSummaryText(item.table?.type) }}</code>
            </td>
            <td>
              <code>{{ toSummaryText(item.table?.defaultValue) }}</code>
            </td>
            <td>
              <span class="story-props__control">{{
                getControlLabel(item)
              }}</span>
            </td>
            <td>
              <span
                class="story-props__required"
                :class="{
                  'story-props__required--yes': item.table?.required === true,
                }"
              >
                {{ item.table?.required === true ? "Tak" : "Nie" }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="story-props__empty">
      Ten komponent nie wymaga propsów. Dane przekazuje się przez sloty lub
      zwykłe atrybuty HTML.
    </div>
  </div>
</template>

<style lang="scss" scoped>
.story-props {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.story-props__table-wrapper {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--docs-border, #dce3ec);
  border-radius: 0.9rem;
  background: var(--docs-surface, #fff);
}

.story-props__table {
  width: 100%;
  min-width: 64rem;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}

.story-props__table th {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--docs-border, #dce3ec);
  background: #f6f8fb;
  color: #647084;
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  white-space: nowrap;
}

.story-props__table td {
  padding: 1rem;
  border-bottom: 1px solid var(--docs-border, #dce3ec);
  color: #354052;
  vertical-align: top;
}

.story-props__table tr:last-child td {
  border-bottom: 0;
}

.story-props__table tbody tr:hover {
  background: rgba(63, 130, 5, 0.05);
}

.story-props__table code {
  padding: 0.15rem 0.35rem;
  border-radius: 0.35rem;
  background: #edf2f8;
  color: #285504;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.76rem;
  white-space: normal;
}

.story-props__description {
  min-width: 17rem;
  line-height: 1.55;
}

.story-props__control,
.story-props__required {
  display: inline-flex;
  padding: 0.24rem 0.45rem;
  border-radius: 999px;
  background: #eef1f5;
  color: #566173;
  font-size: 0.7rem;
  font-weight: 650;
  white-space: nowrap;
}

.story-props__required--yes {
  background: #e5f7ed;
  color: #0d7138;
}

.story-props__empty {
  padding: 1.25rem;
  border: 1px dashed var(--docs-border, #dce3ec);
  border-radius: 0.9rem;
  color: var(--docs-muted, #5d6878);
  line-height: 1.6;
}

:global(body.dark-mode .story-props__table th) {
  background: #172033;
  color: #aeb9c8;
}

:global(body.dark-mode .story-props__table td) {
  color: #dce5f2;
}

:global(body.dark-mode .story-props__table code) {
  background: #21304a;
  color: #d0ef8b;
}
</style>

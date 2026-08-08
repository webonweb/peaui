import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  formTagsInputDemoProps,
  formTagsInputDemoSuggestions,
  formTagsInputLongLabel,
} from './form-tags-input.demo';
import FormTagsInputComponent from './index.vue';

const meta = {
  title: '5. Form/FormTagsInput',
  component: FormTagsInputComponent,
  parameters: {
    name: 'FormTagsInput',
    description:
      'Dostępny i responsywny edytor tagów z walidacją, paste, edycją, sugestiami i kontrolowanym modelem.',
  },
  argTypes: {
    layout: { control: 'select', options: ['inline', 'stacked'] },
    mode: { control: 'select', options: ['freeform', 'suggestions-only'] },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'] },
  },
} satisfies Meta<typeof FormTagsInputComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

const playgroundRender: Story['render'] = (args) => ({
  components: { FormTagsInputComponent, StoryContent },
  setup: () => ({ args, settings: getSettings(meta) }),
  template: `
    <StoryContent :settings>
      <div style="inline-size:34rem;max-inline-size:100%">
        <FormTagsInputComponent v-bind="args" v-model:value="args.value" v-model:input-value="args.inputValue" />
      </div>
    </StoryContent>
  `,
});

export const Playground: Story = {
  args: { ...formTagsInputDemoProps, dataTestId: 'form-tags-input-default', inputValue: '' },
  render: playgroundRender,
};

export const SuggestionsOnly: Story = {
  args: {
    ...formTagsInputDemoProps,
    allowCreate: false,
    dataTestId: 'form-tags-input-suggestions',
    mode: 'suggestions-only',
    value: ['Vue'],
  },
  render: playgroundRender,
};

export const PasteEditAndKeyboard: Story = {
  render: () => ({
    components: { FormTagsInputComponent, StoryContent },
    setup: () => ({ formTagsInputDemoSuggestions, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-tags-keyboard style="inline-size:34rem;max-inline-size:100%">
          <p>Wklej wartości oddzielone przecinkiem. Backspace wybiera i usuwa, strzałki przenoszą fokus, F2 edytuje, a Escape anuluje.</p>
          <FormTagsInputComponent
            id="tags-keyboard-vue"
            name="tagsKeyboard"
            label="Tagi obsługiwane klawiaturą"
            description="Każda zmiana przechodzi walidację przed aktualizacją modelu."
            data-test-id="form-tags-input-keyboard"
            :suggestions="formTagsInputDemoSuggestions"
            :value="['Vue', 'React']"
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const ObjectsAndCustomContent: Story = {
  render: () => ({
    components: { FormTagsInputComponent, StoryContent },
    setup: () => ({
      settings: getSettings(meta),
      suggestions: [
        { id: 'a11y', label: 'Dostępność', value: 'accessibility' },
        { id: 'perf', label: 'Wydajność', value: 'performance' },
        { id: 'docs', label: 'Dokumentacja', value: 'documentation' },
      ],
    }),
    template: `
      <StoryContent :settings>
        <div style="inline-size:34rem;max-inline-size:100%">
          <FormTagsInputComponent id="tags-objects" name="areas" label="Obszary jakości" mode="suggestions-only" :allow-create="false" :suggestions :value="[suggestions[0]]">
            <template #tag-content="{ tag }"><strong>{{ tag.label }}</strong></template>
            <template #suggestion="{ suggestion }">{{ suggestion.label }} · {{ suggestion.value }}</template>
          </FormTagsInputComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const ValidationAndStates: Story = {
  render: () => ({
    components: { FormTagsInputComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))">
          <FormTagsInputComponent id="tags-required" name="required" label="Pole wymagane" required />
          <FormTagsInputComponent id="tags-error" name="error" label="Błąd walidacji" error="Usuń nieobsługiwany tag." :value="['Nieobsługiwany']" />
          <FormTagsInputComponent id="tags-max" name="max" label="Osiągnięty limit" :max="2" :value="['Vue', 'React']" />
          <FormTagsInputComponent id="tags-readonly" name="readonly" label="Tylko do odczytu" readonly :value="['Vue', 'React']" />
          <FormTagsInputComponent id="tags-loading" name="loading" label="Ładowanie sugestii" loading />
          <FormTagsInputComponent id="tags-disabled" name="disabled" label="Niedostępne" disabled :value="['Vue']" />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { FormTagsInputComponent, StoryContent },
    setup() {
      const tags = ref<string[]>(['Vue']);
      const query = ref('');
      return { formTagsInputDemoSuggestions, query, settings: getSettings(meta), tags };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;inline-size:34rem;max-inline-size:100%">
          <FormTagsInputComponent v-model:value="tags" v-model:input-value="query" id="tags-controlled" name="controlled" label="Kontrolowane tagi" :suggestions="formTagsInputDemoSuggestions" />
          <output>Tagi: {{ tags.join(', ') || 'brak' }} · Zapytanie: {{ query || 'puste' }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileLongContentAndRtl: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { FormTagsInputComponent },
    setup: () => ({ formTagsInputLongLabel }),
    template: `
      <div dir="rtl" data-tags-mobile style="inline-size:19rem;max-inline-size:100%;padding-block:1rem">
        <FormTagsInputComponent
          data-test-id="form-tags-input-mobile"
          id="tags-mobile"
          name="mobile"
          :label="formTagsInputLongLabel"
          description="Długie etykiety i tagi zawijają się bez poziomego overflow."
          layout="stacked"
          :value="['Bardzo długa nazwa technologii interfejsowej', 'WCAG 2.2 AA']"
          :suggestions="['Responsywny projekt wielojęzyczny']"
        />
      </div>
    `,
  }),
};

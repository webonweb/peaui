import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  formColorPickerDemoProps,
  formColorPickerLongLabel,
  formColorPickerRecentColors,
  formColorPickerSavedColors,
} from './form-color-picker.demo';
import FormColorPickerComponent from './index.vue';

const meta = {
  title: '5. Form/FormColorPicker',
  component: FormColorPickerComponent,
  args: { ...formColorPickerDemoProps },
  parameters: {
    name: 'FormColorPicker',
    description:
      'Dostępny i responsywny wybór koloru z formatami HEX, RGB i HSL, kanałem alpha oraz obsługą klawiatury 2D.',
  },
  argTypes: {
    density: { control: 'select', options: ['full', 'compact'] },
    format: { control: 'select', options: ['hex', 'rgb', 'hsl'] },
    placement: { control: 'select', options: ['bottom', 'top'] },
    variant: { control: 'select', options: ['popover', 'inline'] },
  },
} satisfies Meta<typeof FormColorPickerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

const playgroundRender: Story['render'] = (args) => ({
  components: { FormColorPickerComponent, StoryContent },
  setup: () => ({ args, settings: getSettings(meta) }),
  template: `
    <StoryContent :settings>
      <div style="inline-size:32rem;max-inline-size:100%">
        <FormColorPickerComponent v-bind="args" v-model:value="args.value" v-model:open="args.open" />
      </div>
    </StoryContent>
  `,
});

export const Playground: Story = {
  args: { ...formColorPickerDemoProps, dataTestId: 'form-color-picker-default', open: false },
  render: playgroundRender,
};

export const FormatsAndDensity: Story = {
  render: () => ({
    components: { FormColorPickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-color-picker-parity style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr));gap:1.25rem;align-items:start">
          <FormColorPickerComponent id="color-hex" name="colorHex" label="HEX" value="#4C9A2A" variant="inline" />
          <FormColorPickerComponent id="color-rgb" name="colorRgb" label="RGB compact" value="rgb(76, 154, 42)" format="rgb" density="compact" variant="inline" />
          <FormColorPickerComponent id="color-hsl" name="colorHsl" label="HSL z alpha" value="hsla(102, 57%, 38%, .7)" format="hsl" alpha variant="inline" />
        </div>
      </StoryContent>
    `,
  }),
};

export const PalettesAndEyedropper: Story = {
  args: {
    ...formColorPickerDemoProps,
    open: true,
    recentColors: formColorPickerRecentColors,
    savedColors: formColorPickerSavedColors,
    showEyedropper: true,
  },
  render: playgroundRender,
};

export const KeyboardAndContrast: Story = {
  render: () => ({
    components: { FormColorPickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <p>Ustaw fokus na powierzchni koloru i użyj strzałek; Shift zmienia wartość o większy krok.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1.25rem;align-items:start">
          <FormColorPickerComponent id="color-dark" name="colorDark" label="Wskaźnik na czerni" value="#000000" variant="inline" density="compact" />
          <FormColorPickerComponent id="color-light" name="colorLight" label="Wskaźnik na bieli" value="#FFFFFF" variant="inline" density="compact" />
        </div>
      </StoryContent>
    `,
  }),
};

export const ValidationAndStates: Story = {
  render: () => ({
    components: { FormColorPickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr));gap:1.25rem">
          <FormColorPickerComponent id="color-required" name="colorRequired" label="Wymagany kolor" value="" required />
          <FormColorPickerComponent id="color-error" name="colorError" label="Błąd zewnętrzny" value="#C73E3A" error="Ten kolor nie spełnia zasad marki." />
          <FormColorPickerComponent id="color-readonly" name="colorReadonly" label="Tylko do odczytu" value="#4C9A2A" readonly />
          <FormColorPickerComponent id="color-loading" name="colorLoading" label="Ładowanie" value="#4C9A2A" loading />
          <FormColorPickerComponent id="color-disabled" name="colorDisabled" label="Niedostępny" value="#4C9A2A" disabled />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { FormColorPickerComponent, StoryContent },
    setup() {
      const value = ref('#287BB5');
      const open = ref(false);
      return { open, settings: getSettings(meta), value };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;inline-size:32rem;max-inline-size:100%">
          <FormColorPickerComponent v-model:value="value" v-model:open="open" id="color-controlled" name="colorControlled" label="Kontrolowany kolor" alpha />
          <output>Wartość: {{ value }}; panel: {{ open ? 'otwarty' : 'zamknięty' }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { FormColorPickerComponent },
    setup: () => ({ formColorPickerLongLabel, formColorPickerSavedColors }),
    template: `
      <div data-color-picker-mobile style="inline-size:19rem;max-inline-size:100%;padding-block:1rem">
        <FormColorPickerComponent data-test-id="form-color-picker-mobile" id="color-mobile" name="colorMobile" :label="formColorPickerLongLabel" value="#4C9A2AE6" alpha variant="inline" :saved-colors="formColorPickerSavedColors" />
      </div>
    `,
  }),
};
